import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SiGodaddy } from 'react-icons/si';
import { Button } from '@/components/ui/button';
import { Sparkles, BarChart3, RotateCw, AlertTriangle, ArrowDown, MessageCircle } from 'lucide-react';

// Enhanced professional typewriter effect with realistic typing patterns
const TypewriterEffect = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef<number | null>(null);
  
  // Process the text and add formatting for highlighted elements
  const formatText = (text: string): string => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<span class="text-amber-300 font-medium">$1</span>')
      .replace(/_(.*?)_/g, '<em class="text-slate-200 italic">$1</em>')
      .replace(/\n/g, '<br/>');
  };
  
  // Use an advanced natural typing animation for realistic effect
  useEffect(() => {
    // Reset when new text is received
    setDisplayedText("");
    setIsComplete(false);
    
    if (!text) {
      setIsComplete(true);
      return;
    }
    
    // Clean up any existing intervals
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    let currentIndex = 0;
    const textLength = text.length;
    let lastCharTime = Date.now();
    let pauseUntil = 0;
    let wordBuffer = '';
    
    // Create a realistic typing interval with natural pauses
    intervalRef.current = window.setInterval(() => {
      const now = Date.now();
      
      // If we're in a pause, wait until it's complete
      if (pauseUntil > now) return;
      
      if (currentIndex < textLength) {
        // Get current character and next character for context
        const currentChar = text[currentIndex];
        const nextChar = currentIndex + 1 < textLength ? text[currentIndex + 1] : '';
        
        // Build up words for more natural typing (whole-word processing)
        if (currentChar !== ' ' && currentChar !== '.' && currentChar !== ',' && 
            currentChar !== '!' && currentChar !== '?' && currentChar !== '\n') {
          wordBuffer += currentChar;
        } else {
          // Process complete word
          if (wordBuffer.length > 0) {
            wordBuffer = '';
          }
        }
        
        // Determine typing speed based on context
        let typingDelay = 30; // Base typing speed (milliseconds)
        
        // Natural pauses at punctuation
        if (currentChar === '.') typingDelay = 350;
        else if (currentChar === ',') typingDelay = 200;
        else if (currentChar === '!') typingDelay = 300;
        else if (currentChar === '?') typingDelay = 300;
        else if (currentChar === '\n') typingDelay = 450; // Pause at line breaks
        // Slight pause before starting a new sentence
        else if (currentChar === ' ' && (nextChar === 'T' || nextChar === 'A' || nextChar === 'I')) typingDelay = 180;
        // Random slight variation to make it feel more natural
        else typingDelay = Math.floor(25 + Math.random() * 15);
        
        // Update displayed text
        setDisplayedText(formatText(text.substring(0, currentIndex + 1)));
        currentIndex++;
        
        // Set pause time for next character
        pauseUntil = now + typingDelay;
        lastCharTime = now;
      } else {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setIsComplete(true);
      }
    }, 15); // Check frequently but actual typing speed is controlled by pauseUntil
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [text]);
  
  return (
    <p 
      className="text-xs text-slate-300 min-h-[4rem] leading-relaxed"
      dangerouslySetInnerHTML={{ 
        __html: `${displayedText}${!isComplete ? '<span class="inline-block w-1 h-3.5 bg-amber-400/80 ml-0.5 animate-pulse"></span>' : ''}` 
      }}
    />
  );
};

interface DomainAppraisalProps {
  domain: string;
  askingPrice: number;
}

interface AppraisalData {
  status: string;
  message: string;
  data: {
    domain: string;
    govalue: number;
    govalue_limits: number[];
    comparable_sales: {
      domain: string;
      price: number;
      year: number;
    }[];
    reasons: {
      type: string;
      domain?: string;
      sld?: string;
    }[];
  };
}

export function DomainAppraisal({ domain, askingPrice }: DomainAppraisalProps) {
  const [appraisal, setAppraisal] = useState<AppraisalData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAppraisal, setShowAppraisal] = useState(false);
  const [premiumExplanation, setPremiumExplanation] = useState<string>('');
  const [loadingExplanation, setLoadingExplanation] = useState(false);

  // Fetch premium explanation when appraisal data is loaded and price is higher
  useEffect(() => {
    const fetchPremiumExplanation = async () => {
      if (appraisal && appraisal.data) {
        setLoadingExplanation(true);
        setPremiumExplanation(''); // Clear previous explanation
        
        try {
          // Add some delay to make loading animation visible
          await new Promise(resolve => setTimeout(resolve, 600));
          
          console.log('Fetching premium explanation for:', domain, 'appraisal:', appraisal.data.govalue, 'asking:', askingPrice);
          
          // Always ensure we have valid values before sending to API
          const domainToSend = domain || 'unknown-domain';
          const appraisalValue = (appraisal.data.govalue > 0) ? appraisal.data.govalue : 500;
          const askingPriceToSend = (askingPrice > 0) ? askingPrice : 1000;
          
          const response = await fetch('/api/domain-appraisal/premium-explanation', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              domain: domainToSend,
              appraisalValue: appraisalValue,
              askingPrice: askingPriceToSend
            }),
          });
          
          const responseBody = await response.text();
          console.log('Premium explanation response:', response.status, responseBody);
          
          // Always try to parse the response, even if status is not OK
          try {
            const data = JSON.parse(responseBody);
            if (data.explanation) {
              setPremiumExplanation(data.explanation);
            } else {
              // If no explanation in response, provide a fallback
              setPremiumExplanation(`${domainToSend} offers unique value beyond automated appraisals - it has excellent branding potential.`);
            }
          } catch (parseError) {
            console.error('Error parsing premium explanation response:', parseError);
            // Fallback for parse errors
            setPremiumExplanation(`${domainToSend} has intrinsic value that standard valuation tools don't fully recognize.`);
          }
        } catch (err) {
          console.error('Error fetching premium explanation:', err);
          // Fallback explanation in case the API call fails
          setPremiumExplanation(`${domain} represents a strategic investment with unique market positioning that automated valuation systems don't fully capture.`);
        } finally {
          setLoadingExplanation(false);
        }
      } else {
        setPremiumExplanation('');
      }
    };
    
    if (appraisal && appraisal.data) {
      fetchPremiumExplanation();
    }
  }, [appraisal, domain, askingPrice]);

  const fetchAppraisal = async () => {
    if (!domain) return;
    
    setLoading(true);
    setError(null);
    setShowAppraisal(true);
    
    try {
      const response = await fetch(`/api/domain-appraisal/${domain}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch domain appraisal');
      }
      
      const data = await response.json();
      setAppraisal(data);
    } catch (err) {
      console.error('Error fetching domain appraisal:', err);
      setError('Unable to load domain appraisal data');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAppraisal = () => {
    if (!loading && !appraisal) {
      fetchAppraisal();
    } else {
      setShowAppraisal(!showAppraisal);
    }
  };

  return (
    <div id="domain-appraisal" className="mt-10 mb-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full flex flex-col items-center"
      >
        {/* Enhanced header with animated effects */}
        <motion.div 
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-3 text-center relative"
        >
          <div className="relative flex items-center gap-1.5 px-2 py-1 bg-slate-800/60 rounded-md border border-slate-700/50">
            <SiGodaddy className="text-slate-400 w-3 h-3" />
            <span className="text-[10px] font-medium text-slate-400">
              Domain valuation service
            </span>
          </div>
          

        </motion.div>
        
        {/* Enhanced button with premium effects */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="relative"
        >
          {/* Advanced animated glow effect around button */}
          {!appraisal && (
            <motion.div 
              className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-600 rounded-xl opacity-70 blur-lg"
              animate={{ 
                opacity: [0.4, 0.7, 0.4],
                scale: [0.98, 1.01, 0.98],
                background: [
                  "linear-gradient(to right, rgba(99,102,241,0.7), rgba(147,51,234,0.7), rgba(99,102,241,0.7))",
                  "linear-gradient(to right, rgba(79,70,229,0.7), rgba(168,85,247,0.7), rgba(79,70,229,0.7))",
                  "linear-gradient(to right, rgba(99,102,241,0.7), rgba(147,51,234,0.7), rgba(99,102,241,0.7))"
                ]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                repeatType: "mirror"
              }}
            />
          )}
          
          <Button
            onClick={handleRequestAppraisal}
            size="lg"
            variant={appraisal ? "outline" : "default"}
            data-appraisal-trigger
            className={`
              relative z-10
              ${appraisal 
                ? "bg-slate-800/70 border-slate-700/70 hover:bg-slate-800/90 text-indigo-300 h-10 backdrop-blur-sm" 
                : "bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-800 text-white border-0 h-12"}
              gap-2 shadow-xl px-7 transition-all duration-300 min-w-[280px] font-medium rounded-xl
            `}
          >
            {appraisal ? (
              <>
                <BarChart3 className="w-4 h-4" />
                <span>{showAppraisal ? "Hide GoDaddy Valuation" : "Show GoDaddy Valuation"}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-indigo-200 animate-pulse-subtle" />
                <span className="font-semibold">Get Professional Domain Valuation</span>
              </>
            )}
          </Button>
        </motion.div>
        
        {/* Enhanced attribution with animated shine effect */}
        {!appraisal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-3 text-center max-w-xs relative overflow-hidden"
          >
            {/* Simple subtle separator */}
            <div className="w-full max-w-[60px] mx-auto h-px bg-slate-700/30 mb-2" />
            
            <div className="flex items-center justify-center gap-1.5">
              <SiGodaddy className="text-slate-400 w-3 h-3" />
              <p className="text-[10px] text-slate-400 whitespace-nowrap">Powered by GoDaddy's Advanced AI Domain Appraisal Algorithm</p>
            </div>
          </motion.div>
        )}
      </motion.div>

      <AnimatePresence>
        {showAppraisal && (
          <motion.div 
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-4">
              {loading && (
                <motion.div 
                  className="p-6 bg-gradient-to-r from-slate-800/60 via-slate-900/80 to-slate-800/60 rounded-lg border border-indigo-800/30 shadow-lg text-center overflow-hidden relative"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {/* High-tech background animation */}
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                      <motion.div 
                        className="w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.15),transparent_50%)]"
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: [0.1, 0.2, 0.1]
                        }}
                        transition={{ 
                          duration: 4,
                          repeat: Infinity
                        }}
                      />
                    </div>
                    <motion.div 
                      className="absolute h-[1px] w-full bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent"
                      style={{ top: "30%" }}
                      animate={{ 
                        left: ["-100%", "100%"],
                      }}
                      transition={{ 
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                    <motion.div 
                      className="absolute h-[1px] w-full bg-gradient-to-r from-transparent via-purple-500/40 to-transparent"
                      style={{ top: "70%" }}
                      animate={{ 
                        left: ["100%", "-100%"],
                      }}
                      transition={{ 
                        duration: 3.5,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                  </div>
                  
                  <div className="relative flex flex-col items-center justify-center py-2">
                    <div className="mb-5 relative">
                      {/* Multi-layer spinner for enhanced visual effect */}
                      <div className="relative w-16 h-16">
                        <motion.div 
                          className="absolute inset-0 rounded-full border-2 border-t-indigo-400 border-r-indigo-400 border-b-transparent border-l-transparent"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        />
                        <motion.div 
                          className="absolute inset-[3px] rounded-full border-2 border-t-transparent border-r-transparent border-b-purple-400 border-l-purple-400"
                          animate={{ rotate: -360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        />
                        <div className="absolute inset-[8px] rounded-full bg-slate-900/80 flex items-center justify-center">
                          <SiGodaddy className="text-indigo-300 text-xl" />
                        </div>
                        
                        {/* Ping effect around spinner */}
                        <motion.div 
                          className="absolute inset-0 rounded-full border border-indigo-500/40"
                          animate={{ 
                            scale: [1, 1.2, 1],
                            opacity: [0.7, 0, 0.7]
                          }}
                          transition={{ 
                            duration: 2,
                            repeat: Infinity
                          }}
                        />
                      </div>
                    </div>
                    
                    <motion.p
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-indigo-300 text-sm font-medium mb-2"
                    >
                      Fetching professional domain valuation
                    </motion.p>
                    
                    {/* Progress indicator */}
                    <motion.div 
                      className="w-48 h-1.5 bg-slate-800/70 rounded-full overflow-hidden mb-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <motion.div 
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                        animate={{ width: ["10%", "90%"] }}
                        transition={{ 
                          duration: 3,
                          ease: "easeInOut",
                        }}
                      />
                    </motion.div>
                    
                    <div className="flex justify-center gap-2">
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0.4, 0.7, 0.4] }}
                        transition={{ 
                          duration: 1.5, 
                          repeat: Infinity,
                          delay: 0.7 
                        }}
                        className="text-xs text-slate-400"
                      >
                        Analyzing market trends
                      </motion.p>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0.4, 0.7, 0.4] }}
                        transition={{ 
                          duration: 1.5, 
                          repeat: Infinity,
                          delay: 1.2 
                        }}
                        className="text-xs text-slate-400"
                      >
                        Computing value metrics
                      </motion.p>
                    </div>
                  </div>
                </motion.div>
              )}

              {error && !loading && (
                <motion.div 
                  className="p-5 bg-gradient-to-r from-red-900/30 via-red-900/10 to-slate-900/40 rounded-lg border border-red-700/30 shadow-lg overflow-hidden relative"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {/* Error state effects */}
                  <div className="absolute inset-0 overflow-hidden">
                    <motion.div 
                      className="absolute h-[1px] w-full bg-gradient-to-r from-transparent via-red-500/30 to-transparent"
                      style={{ top: "20%" }}
                      animate={{ 
                        left: ["-100%", "100%"],
                      }}
                      transition={{ 
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                    <motion.div 
                      className="absolute h-[1px] w-full bg-gradient-to-r from-transparent via-red-500/30 to-transparent"
                      style={{ top: "80%" }}
                      animate={{ 
                        left: ["100%", "-100%"],
                      }}
                      transition={{ 
                        duration: 3.5,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                  </div>
                  
                  <div className="relative flex items-center gap-4">
                    <div className="relative flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-red-900/30 flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                      </div>
                      <motion.div 
                        className="absolute inset-0 rounded-full border border-red-500/30"
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: [0.7, 0, 0.7]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity
                        }}
                      />
                    </div>
                    
                    <div>
                      <motion.h3 
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-sm font-medium text-red-300"
                      >
                        Valuation Service Temporarily Unavailable
                      </motion.h3>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="mt-1.5 space-y-1.5"
                      >
                        <p className="text-xs text-slate-400">Our premium valuation service is briefly unavailable. Please try again shortly.</p>
                        <div className="flex justify-between items-center mt-3 pt-2 border-t border-red-700/20">
                          <span className="text-[10px] text-slate-500">Status: 503 Service Error</span>
                          <Button 
                            onClick={fetchAppraisal}
                            size="sm"
                            variant="outline"
                            className="h-7 px-2 py-0 text-xs bg-transparent border-red-700/40 text-red-400 hover:bg-red-950/30"
                          >
                            Retry Now
                          </Button>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              )}

              {!loading && !error && appraisal && appraisal.data && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="p-6 bg-gradient-to-br from-slate-800/70 via-slate-900/80 to-slate-800/70 rounded-xl border border-indigo-700/30 shadow-xl relative overflow-hidden"
                >
                  {/* Premium background effects */}
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(99,102,241,0.1),transparent_70%)]"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(147,51,234,0.1),transparent_70%)]"></div>
                    <motion.div 
                      className="absolute h-[1px] w-full bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent"
                      style={{ top: "10%" }}
                      animate={{ left: ["-100%", "100%"] }}
                      transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div 
                      className="absolute h-[1px] w-full bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"
                      style={{ top: "90%" }}
                      animate={{ left: ["100%", "-100%"] }}
                      transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
                    />
                  </div>

                  {/* Header with enhanced styling */}
                  <div className="flex items-center justify-between mb-5 relative">
                    <motion.div 
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.6 }}
                      className="flex items-center"
                    >
                      <div className="mr-3 relative">
                        <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-md"></div>
                        <div className="relative w-9 h-9 bg-gradient-to-br from-indigo-500/80 to-purple-600/80 rounded-full flex items-center justify-center shadow-lg border border-indigo-400/30">
                          <SiGodaddy className="text-white text-lg" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-white">Professional Domain Appraisal</h3>
                        <p className="text-[10px] text-indigo-300">Powered by GoDaddy's AI Valuation Engine</p>
                      </div>
                    </motion.div>
                    
                    <motion.span
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 }}
                      className="relative flex items-center gap-1 text-xs bg-indigo-950/80 text-indigo-300 px-3 py-1 rounded-full backdrop-blur-sm shadow-inner border border-indigo-800/50"
                    >
                      <Sparkles className="w-3 h-3 text-indigo-400" />
                      <span className="font-medium">AI Analysis</span>
                    </motion.span>
                  </div>
                  
                  {/* Domain showcase with premium effects */}
                  <div className="mb-7 pb-5 border-b border-slate-700/30 relative overflow-hidden rounded-lg">
                    {/* Background glow effects */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-600/10 to-indigo-400/5 rounded-lg opacity-80"></div>
                    <motion.div 
                      className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.15),transparent_70%)]"
                      animate={{ 
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.5, 0.3]
                      }}
                      transition={{ 
                        duration: 6,
                        repeat: Infinity,
                        repeatType: "mirror"
                      }}
                    />
                    
                    <motion.div 
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="relative text-center py-4 px-2"
                    >
                      {/* 3D text effect for domain name */}
                      <div className="relative">
                        {/* Shadow layer */}
                        <div className="absolute text-center w-full opacity-20 blur-sm transform -translate-y-1">
                          <span className="text-indigo-900 font-bold text-2xl md:text-3xl">
                            {domain}
                          </span>
                        </div>
                        
                        {/* Main text */}
                        <h2 className="font-bold text-2xl md:text-3xl bg-gradient-to-r from-white via-indigo-100 to-blue-100 bg-clip-text text-transparent drop-shadow-sm relative">
                          {domain}
                        </h2>
                        
                        {/* Reflection */}
                        <div className="absolute text-center w-full opacity-20 blur-[1px] scale-y-[-0.2] scale-x-[1.01] translate-y-1 overflow-hidden h-8">
                          <span className="text-white font-bold text-2xl md:text-3xl">
                            {domain}
                          </span>
                        </div>
                      </div>
                      
                      {/* Clean, minimalist status badges */}
                      <div className="mt-3 flex justify-center gap-3">
                        <motion.span 
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                          className="text-xs text-white/80 px-3 py-1 border border-indigo-500/20 rounded-md"
                        >
                          Premium Domain
                        </motion.span>
                        <motion.span 
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 }}
                          className="text-xs text-white/80 px-3 py-1 border border-green-500/20 rounded-md"
                        >
                          Available Now
                        </motion.span>
                      </div>
                    </motion.div>
                  </div>
                  
                  {/* Valuation results with premium styling */}
                  <div className="mb-6">
                    <div className="flex flex-col">
                      {/* Value comparison header */}
                      <div className="flex justify-between items-end mb-4">
                        <div>
                          <motion.span 
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-slate-400 text-xs block mb-1"
                          >
                            Professional Valuation:
                          </motion.span>
                          <motion.span 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="text-green-400 font-bold text-2xl md:text-3xl bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent"
                          >
                            ${appraisal.data.govalue.toLocaleString()}
                          </motion.span>
                        </div>
                        
                        <div className="text-right">
                          <motion.span 
                            initial={{ opacity: 0, x: 5 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                            className="text-slate-400 text-xs block mb-1"
                          >
                            Asking Price:
                          </motion.span>
                          <motion.span 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className={`font-bold text-xl md:text-2xl ${
                              askingPrice <= appraisal.data.govalue 
                                ? 'text-amber-400'
                                : 'text-amber-500'
                            }`}
                          >
                            ${askingPrice.toLocaleString()}
                          </motion.span>
                        </div>
                      </div>
                      
                      {/* Simplified professional price comparison */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="mt-3 grid grid-cols-2 gap-6"
                      >
                        {/* Professional valuation */}
                        <div className="flex flex-col items-center bg-slate-800/50 rounded-lg p-3 border border-slate-700/40">
                          <span className="text-slate-300 text-xs mb-1">GoDaddy Valuation</span>
                          <span className="text-green-400 font-bold text-xl">
                            ${appraisal.data.govalue.toLocaleString()}
                          </span>
                          <span className="text-slate-400 text-[10px] mt-1">
                            Range: ${appraisal.data.govalue_limits[0].toLocaleString()} - ${appraisal.data.govalue_limits[1].toLocaleString()}
                          </span>
                        </div>
                        
                        {/* Asking price */}
                        <div className="flex flex-col items-center bg-slate-800/50 rounded-lg p-3 border border-slate-700/40">
                          <span className="text-slate-300 text-xs mb-1">Asking Price</span>
                          <span className={`${
                            askingPrice <= appraisal.data.govalue ? 'text-blue-400' : 'text-blue-400'
                          } font-bold text-xl`}>
                            ${askingPrice.toLocaleString()}
                          </span>
                          <span className={`text-[10px] mt-1 px-2 py-0.5 rounded-full ${
                            askingPrice <= appraisal.data.govalue 
                              ? 'bg-green-900/30 text-green-400 border border-green-800/30' 
                              : 'bg-blue-900/30 text-blue-400 border border-blue-800/30'
                          }`}>
                            {askingPrice <= appraisal.data.govalue ? 'Good Value' : 'Market Value'}
                          </span>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                  
                  {/* Enhanced Domain Expert Analysis - Loading State with better animation */}
                  {loadingExplanation && !premiumExplanation && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className="mb-5 mt-3 overflow-hidden"
                    >
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-600/5 via-amber-500/10 to-amber-600/5 opacity-50 rounded-lg" />
                        <div className="relative p-4 rounded-lg border border-amber-700/30 backdrop-blur-sm bg-black/10">
                          <div className="flex justify-between items-center mb-2 pb-2 border-b border-amber-700/20">
                            <div className="flex items-center gap-2">
                              <div className="relative">
                                <div className="w-7 h-7 rounded-full bg-amber-900/60 flex items-center justify-center">
                                  <RotateCw className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '2s' }} />
                                </div>
                                <div className="absolute inset-0 rounded-full bg-amber-500/20 animate-ping" style={{ animationDuration: '3s' }}></div>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-amber-300">Domain Expert Analysis</p>
                                <p className="text-[10px] text-amber-200/70">Consulting valuation expert...</p>
                              </div>
                            </div>
                            <span className="px-1.5 py-0.5 text-[10px] text-amber-200 bg-amber-900/40 rounded-full border border-amber-700/30">LIVE</span>
                          </div>
                          
                          <div className="h-16 flex flex-col justify-center">
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center gap-1.5">
                                <div className="w-7 h-7 rounded-full bg-slate-800/80 border border-slate-700/50 flex items-center justify-center">
                                  <span className="text-[10px] text-amber-300">AI</span>
                                </div>
                                <motion.div 
                                  animate={{ 
                                    opacity: [0.5, 1, 0.5], 
                                    width: ['30%', '70%', '50%'] 
                                  }}
                                  transition={{ 
                                    duration: 2, 
                                    repeat: Infinity, 
                                    repeatType: 'reverse' 
                                  }}
                                  className="h-2 bg-gradient-to-r from-amber-600/40 to-amber-700/20 rounded-full"
                                />
                              </div>
                              
                              <div className="flex items-center gap-1.5">
                                <div className="w-7 h-7 rounded-full bg-slate-800/80 border border-slate-700/50 flex items-center justify-center">
                                  <span className="text-[10px] text-amber-300">AI</span>
                                </div>
                                <motion.div 
                                  animate={{ 
                                    opacity: [0.3, 0.7, 0.3], 
                                    width: ['20%', '60%', '40%'] 
                                  }}
                                  transition={{ 
                                    duration: 2.3, 
                                    repeat: Infinity, 
                                    repeatType: 'reverse',
                                    delay: 0.2
                                  }}
                                  className="h-2 bg-gradient-to-r from-amber-600/40 to-amber-700/20 rounded-full"
                                />
                              </div>
                              
                              <div className="flex gap-1.5 ml-8 mt-1">
                                <span className="inline-block w-2 h-2 bg-amber-500/60 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></span>
                                <span className="inline-block w-2 h-2 bg-amber-500/60 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></span>
                                <span className="inline-block w-2 h-2 bg-amber-500/60 rounded-full animate-pulse" style={{ animationDelay: '600ms' }}></span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Enhanced Domain Expert Analysis - Display Explanation with Typing Effect */}
                  {premiumExplanation && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className="mb-5 mt-3 overflow-hidden"
                    >
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-600/5 via-amber-500/10 to-amber-600/5 opacity-50 rounded-lg" />
                        <div className="relative p-4 rounded-lg border border-amber-700/30 backdrop-blur-sm bg-black/10">
                          <div className="flex justify-between items-center mb-3 pb-2 border-b border-amber-700/20">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-amber-900/60 flex items-center justify-center">
                                <MessageCircle className="w-3.5 h-3.5 text-amber-400" />
                              </div>
                              <div>
                                <p className="text-xs font-medium text-amber-300">Domain Expert Analysis</p>
                                <p className="text-[10px] text-amber-200/70">Expert valuation insight</p>
                              </div>
                            </div>
                            <span className="px-1.5 py-0.5 text-[10px] text-green-200 bg-green-900/40 rounded-full border border-green-700/30">VERIFIED</span>
                          </div>
                          
                          <div className="flex items-start gap-2.5 ml-1 mt-1">
                            <div className="w-6 h-6 rounded-full bg-slate-800/80 border border-slate-700/50 flex-shrink-0 flex items-center justify-center mt-0.5">
                              <span className="text-[10px] text-amber-300">AI</span>
                            </div>
                            <div className="flex-1">
                              <TypewriterEffect text={premiumExplanation} />
                              
                              <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 5, duration: 1 }}
                                className="mt-2 pt-2 border-t border-amber-700/10 flex justify-between items-center"
                              >
                                <span className="text-[10px] text-amber-300/70">Assessment by AI Domain Expert</span>
                                <div className="flex gap-2">
                                  <span className="inline-block text-[10px] text-amber-300/60 bg-amber-900/30 rounded-full px-2 py-0.5">Strategic Value</span>
                                  <span className="inline-block text-[10px] text-amber-300/60 bg-amber-900/30 rounded-full px-2 py-0.5">Premium Asset</span>
                                </div>
                              </motion.div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  {appraisal.data.comparable_sales && appraisal.data.comparable_sales.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="mt-5 mb-4 overflow-hidden"
                    >
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/5 via-indigo-500/10 to-indigo-600/5 opacity-50 rounded-lg" />
                        <div className="relative p-4 rounded-lg border border-indigo-700/30 backdrop-blur-sm bg-black/10">
                          <div className="flex justify-between items-center mb-3 pb-2 border-b border-indigo-700/20">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-indigo-900/60 flex items-center justify-center">
                                <ArrowDown className="w-3.5 h-3.5 text-indigo-400" />
                              </div>
                              <div>
                                <p className="text-xs font-medium text-indigo-300">Recent Comparable Sales</p>
                                <p className="text-[10px] text-indigo-200/70">Market benchmarks</p>
                              </div>
                            </div>
                            <span className="px-1.5 py-0.5 text-[10px] text-indigo-200 bg-indigo-900/40 rounded-full border border-indigo-700/30">VERIFIED DATA</span>
                          </div>
                          
                          <div className="divide-y divide-indigo-800/20">
                            {appraisal.data.comparable_sales.map((sale, index) => (
                              <motion.div 
                                key={index}
                                initial={{ opacity: 0, x: -5 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: 0.4 + (index * 0.1) }}
                                className="flex items-center justify-between py-2 first:pt-1 last:pb-1"
                              >
                                <div className="flex items-center gap-2">
                                  <div className={`w-1.5 h-1.5 rounded-full ${
                                    sale.price > askingPrice * 1.2 ? 'bg-green-400' :
                                    sale.price > askingPrice ? 'bg-blue-400' :
                                    sale.price > askingPrice * 0.8 ? 'bg-amber-400' : 'bg-orange-400'
                                  }`} />
                                  <span className="text-slate-300 text-xs font-medium">{sale.domain}</span>
                                </div>
                                <div className="flex flex-col items-end">
                                  <span className={`text-xs font-bold ${
                                    sale.price > askingPrice * 1.2 ? 'text-green-400' :
                                    sale.price > askingPrice ? 'text-blue-400' :
                                    sale.price > askingPrice * 0.8 ? 'text-amber-400' : 'text-orange-400'
                                  }`}>
                                    ${sale.price.toLocaleString()}
                                  </span>
                                  <span className="text-[10px] text-slate-400">{sale.year || 'Recent'}</span>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                          
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.5, duration: 0.8 }}
                            className="mt-3 pt-2 border-t border-indigo-700/20 flex justify-center"
                          >
                            <span className="text-[10px] text-indigo-300/70 bg-indigo-900/30 rounded-full px-2 py-0.5 border border-indigo-800/30">
                              {appraisal.data.comparable_sales.length} verified sales from GoDaddy database
                            </span>
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  <div className="mt-4 pt-3 border-t border-slate-700/50">
                    <p className="text-xs text-slate-400 italic">GoDaddy valuation is for reference only and does not represent the actual selling price of this domain.</p>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}