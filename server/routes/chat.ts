import OpenAI from "openai";
import { Router } from "express";
import { z } from "zod";
import { storage } from "../storage";
import axios from "axios"; // Make sure axios is imported

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const router = Router();

const requestSchema = z.object({
  message: z.string(),
  sessionId: z.string(),
  domain: z.string(),
});

// Function to get domain appraisal data
async function getDomainAppraisal(domain: string) {
  try {
    const response = await axios.get(`/api/domain-appraisal/${domain}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching domain appraisal:', error);
    return null;
  }
}

router.post("/api/chat", async (req, res) => {
  try {
    const parsedData = requestSchema.parse(req.body);
    const { message, sessionId, domain } = parsedData;

    // Check rate limit
    const rateLimit = await storage.getRateLimit(sessionId);
    // messageCount can be undefined according to the type, so we need to check
    if (rateLimit && typeof rateLimit.messageCount === 'number' && rateLimit.messageCount >= 4) {
      return res.status(429).json({
        message: "Chat limit reached. Please use the buy now button to proceed.",
      });
    }

    // Get domain appraisal data
    let appraisalData = null;
    try {
      // Clean domain name to handle potential issues
      const cleanDomain = domain.replace(/^(https?:\/\/)?(www\.)?/i, "");
      
      // Check if domain is too long (GoDaddy API has 60 char limit)
      if (cleanDomain.length > 60) {
        console.warn(`Domain too long for GoDaddy API (${cleanDomain.length} chars): ${cleanDomain}`);
        // Create a mock response structure for long domains
        appraisalData = {
          status: "error",
          message: "Domain name too long for GoDaddy API (max 60 chars)",
          data: {
            domain: cleanDomain,
            govalue: 0,
            govalue_limits: [0, 0],
            comparable_sales: [],
            reasons: []
          }
        };
      } else {
        // Implement retry mechanism
        const maxRetries = 3;
        let retries = 0;
        let lastError;
        
        while (retries < maxRetries && !appraisalData) {
          try {
            // Use direct axios call to the GoDaddy API to avoid making an HTTP request to our own API
            const response = await axios.get(`https://godaddy-domain-appraisal-api-govalue.p.rapidapi.com/godaddy/appraisal/${cleanDomain}`, {
              headers: {
                'x-rapidapi-host': 'godaddy-domain-appraisal-api-govalue.p.rapidapi.com',
                'x-rapidapi-key': process.env.RAPIDAPI_KEY || '2d4563941emsh1764b2c55887080p1c065cjsn30c4ddd2e7c4'
              }
            });
            appraisalData = response.data;
          } catch (error) {
            lastError = error;
            console.error(`Error fetching domain appraisal in chat (attempt ${retries + 1}/${maxRetries}):`, error);
            
            // Wait before retrying (increase delay with each retry)
            await new Promise(resolve => setTimeout(resolve, 1000 * (retries + 1)));
            retries++;
          }
        }
        
        if (!appraisalData && retries === maxRetries) {
          console.error('All retries failed for domain appraisal in chat');
        }
      }
    } catch (error) {
      console.error('Unexpected error fetching domain appraisal in chat:', error);
      // Continue even if appraisal fails
    }

    // Format appraisal data for the AI if available
    let appraisalInfo = '';
    if (appraisalData && appraisalData.data) {
      const { govalue, govalue_limits, comparable_sales, reasons } = appraisalData.data;
      
      appraisalInfo = `
      GoDaddy Domain Appraisal Data:
      - Estimated value: $${govalue}
      - Value range: $${govalue_limits[0]} - $${govalue_limits[1]}
      
      Comparable sales:
      ${comparable_sales.slice(0, 5).map((sale: any) => `- ${sale.domain}: $${sale.price} (${sale.year})`).join('\n')}
      
      Domain strengths:
      ${reasons.map((reason: any) => `- ${reason.type.replace('_', ' ')}`).join('\n')}`;
    }

    let content: string;
    // Initial message - provide compelling domain advantages
    if (!message) {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a professional domain name consultant specializing in premium domain sales. Analyze "${domain}" and provide a compelling welcome message highlighting key benefits. 
            
            ${appraisalData ? appraisalInfo : ''}
            
            Format guidelines:
            • Use simple bullet points (only •)
            • Keep each point clear and direct
            • No special characters or symbols
            • No markdown or HTML
            • No quotation marks unless absolutely necessary
            • End with a simple question
            Focus on value and branding potential.
            
            If you have domain appraisal data, you can subtly reference the market value but without mentioning specific numbers in your response.`
          },
          {
            role: "user",
            content: `Present the advantages of owning ${domain}`
          }
        ],
        temperature: 0.7,
        max_tokens: 300,
      });
      content = response.choices[0].message.content || "";
    } else {
      // Regular chat messages
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a professional domain broker helping clients understand the value of "${domain}".
            
            ${appraisalData ? appraisalInfo : ''}
            
            Guidelines:
            • Keep responses clear and direct
            • No special characters or symbols
            • No markdown or HTML
            • Use bullet points (•) for lists
            • No quotation marks unless necessary
            Focus on answering the question professionally.
            
            If you have domain appraisal data, you can use this to inform your answers but don't explicitly mention GoDaddy's valuation numbers unless directly asked.`
          },
          { role: "user", content: message }
        ],
        temperature: 0.7,
        max_tokens: 300,
      });
      content = response.choices[0].message.content || "";
    }

    // Store chat messages
    await storage.createChatMessage({
      sessionId,
      message: message || "What makes this domain valuable?",
      type: "user",
    });

    await storage.createChatMessage({
      sessionId,
      message: content,
      type: "assistant",
    });

    // Increment rate limit
    await storage.incrementRateLimit(sessionId);

    res.json({ message: content });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ message: "Failed to process chat request" });
  }
});

export default router;