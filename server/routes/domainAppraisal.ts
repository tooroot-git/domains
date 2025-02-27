import express from 'express';
import axios from 'axios';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const router = express.Router();

async function getDomainAppraisal(domain: string) {
    // Clean domain name to handle potential issues
    const cleanDomain = domain.replace(/^(https?:\/\/)?(www\.)?/i, "");
    
    // Check if domain is too long (GoDaddy API has 60 char limit)
    if (cleanDomain.length > 60) {
        console.warn(`Domain too long (${cleanDomain.length} chars): ${cleanDomain}`);
        return {
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
    }
    
    // Implement retry mechanism
    const maxRetries = 3;
    let retries = 0;
    let lastError;
    
    while (retries < maxRetries) {
        try {
            const response = await axios.get(`https://godaddy-domain-appraisal-api-govalue.p.rapidapi.com/godaddy/appraisal/${cleanDomain}`, {
                headers: {
                    'x-rapidapi-host': 'godaddy-domain-appraisal-api-govalue.p.rapidapi.com',
                    'x-rapidapi-key': process.env.RAPIDAPI_KEY || '2d4563941emsh1764b2c55887080p1c065cjsn30c4ddd2e7c4'
                }
            });
            
            return response.data;
        } catch (error) {
            lastError = error;
            console.error(`Error fetching domain appraisal (attempt ${retries + 1}/${maxRetries}):`, error);
            
            // Wait before retrying (increase delay with each retry)
            await new Promise(resolve => setTimeout(resolve, 1000 * (retries + 1)));
            retries++;
        }
    }
    
    console.error('All retries failed for domain appraisal');
    throw lastError;
}

// Generate an expert explanation for a premium price
async function generatePremiumExplanation(domain: string, appraisalValue: number, askingPrice: number) {
    try {
        // Extract domain name without extension for more targeted analysis
        const domainParts = domain.split('.');
        const domainName = domainParts[0];
        const extension = domainParts.slice(1).join('.');
        
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: `You are a domain seller who knows the domain name market well. Be concise and confident.
                    
                    A customer is considering ${domain} priced at $${askingPrice}, but automated appraisal values it at $${appraisalValue}.
                    
                    Write a brief, persuasive explanation of why the domain is worth the asking price. Remember you are the SELLER.
                    
                    Guidelines:
                    - Be extremely concise (maximum 2-3 short sentences, 30-40 words total)
                    - Mention 1-2 specific advantages of this domain (${domainName}.${extension}) that automated tools don't consider
                    - Use simple, direct language with a confident tone
                    - Highlight why the price difference exists without using technical jargon
                    - Format as a single short paragraph, no greeting or sign-off
                    - Do not use bullet points or structured formats
                    - Focus on making a quick, compelling sales point`
                },
                {
                    role: "user",
                    content: `Why is ${domain} priced at $${askingPrice} when the automated appraisal shows only $${appraisalValue}? Explain briefly why our price is justified.`
                }
            ],
            temperature: 0.8,
            max_tokens: 150,
        });
        
        // Make sure the response isn't too long
        const content = response.choices[0].message.content || "";
        return content.length > 60 ? content.substring(0, 60) + "..." : content;
    } catch (error) {
        console.error('Error generating premium explanation:', error);
        return `${domain} has uniqueness that automated tools miss. Perfect for your business needs.`;
    }
}

router.get('/:domain', async (req, res) => {
    try {
        const domain = req.params.domain;
        const data = await getDomainAppraisal(domain);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch domain appraisal' });
    }
});

// New endpoint for premium explanation
router.post('/premium-explanation', async (req, res) => {
    try {
        const { domain, appraisalValue, askingPrice } = req.body;
        
        // Better validation with helpful debug info
        if (!domain) {
            console.error('Missing domain in premium explanation request:', req.body);
            return res.status(400).json({ 
                error: 'Missing domain parameter',
                explanation: 'This domain has unique features that automated systems miss. Perfect for your business.' 
            });
        }
        
        if (!appraisalValue) {
            console.error('Missing appraisalValue in premium explanation request:', req.body);
            return res.status(400).json({ 
                error: 'Missing appraisalValue parameter',
                explanation: `${domain} offers brand recognition that automated tools can't value. A smart investment.` 
            });
        }
        
        if (!askingPrice) {
            console.error('Missing askingPrice in premium explanation request:', req.body);
            return res.status(400).json({ 
                error: 'Missing askingPrice parameter',
                explanation: `${domain} has memorable branding potential that algorithms can't measure. Grab it while available.`
            });
        }
        
        if (askingPrice <= appraisalValue) {
            console.log('Asking price not higher than appraisal in premium explanation request:', req.body);
            return res.status(200).json({ 
                explanation: `${domain} is priced right at market value - a balanced investment with immediate brand recognition.` 
            });
        }
        
        const explanation = await generatePremiumExplanation(domain, appraisalValue, askingPrice);
        res.json({ explanation });
    } catch (error) {
        console.error('Error handling premium explanation request:', error);
        // Even on error, return something useful for a better user experience
        const fallbackDomain = req.body?.domain || 'This domain';
        res.status(200).json({ 
            explanation: `${fallbackDomain} offers unique branding value that algorithms miss. Perfect for your business growth.`
        });
    }
});

export default router;