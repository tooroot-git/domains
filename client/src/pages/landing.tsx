import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "wouter";
import { getDomainFromUrl, getDomainPrice, formatPrice } from "@/lib/domain";
import { Button } from "@/components/ui/button";
import { ChatWidget } from "@/components/chat-widget";
import { TrustIndicators } from "@/components/trust-indicators";
import { PaymentDrawer } from "@/components/payment-drawer";
import { DomainAppraisal } from "@/components/domain-appraisal";
import { Helmet } from "react-helmet";

export default function Landing() {
  const [domain, setDomain] = useState("");
  const [isUpperCase, setIsUpperCase] = useState(false);
  const [price, setPrice] = useState(0);
  const [isPaymentDrawerOpen, setIsPaymentDrawerOpen] = useState(false);

  useEffect(() => {
    const currentDomain = getDomainFromUrl();
    setDomain(currentDomain);
    const domainPrice = getDomainPrice(currentDomain);
    setPrice(domainPrice);
  }, []);

  // Function removed - mailto link used directly

  const toggleCase = () => {
    setIsUpperCase(!isUpperCase);
  };

  const displayDomain = isUpperCase ? domain.toUpperCase() : domain;
  const metaDescription = `${domain} is available for purchase. This premium domain name is perfect for your business or project. Contact us now to secure this valuable digital asset.`;
  const keywords = `${domain}, domain name for sale, premium domain, buy domain name, ${domain.split('.')[1]} domain, domain marketplace`;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": domain,
    "description": `Premium domain name ${domain} available for sale. Perfect for your next big project.`,
    "offers": {
      "@type": "Offer",
      "priceCurrency": "USD",
      "price": price,
      "availability": "https://schema.org/InStock"
    }
  };

  return (
    <>
      <Helmet>
        <title>{`${domain} - Premium Domain Name For Sale | Domain Marketplace`}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={keywords} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={`${domain} - Premium Domain Name For Sale`} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`https://${domain}/og-image.png`} />
        <meta property="og:url" content={`https://${domain}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${domain} - Premium Domain Name For Sale`} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={`https://${domain}/og-image.png`} />
        <link rel="canonical" href={`https://${domain}`} />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-[#1a1b26] via-[#2a2c4c] to-[#1a1b26] text-white">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMzMzNjZkIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-5" />
        </div>

        <div className="container mx-auto px-4 py-6 md:py-12 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            {/* "For Sale" badge with premium animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2.5 px-5 py-2 mb-8 relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-600/90 to-orange-500/90 rounded-full animate-pulse-subtle blur-[0.5px]"></div>
              <div className="absolute inset-0 border border-yellow-400/50 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.3)]"></div>
              <span className="relative text-sm font-bold text-white tracking-wide">PREMIUM DOMAIN FOR SALE</span>
              <span className="relative w-2 h-2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] animate-ping"></span>
            </motion.div>

            {/* Domain name display with enhanced visuals */}
            <div className="relative mb-6 overflow-hidden">
              {/* Animated background gradients */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 0.15, scale: 1 }}
                transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 0.15, scale: 1 }}
                transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
                className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 rounded-full blur-3xl"
              />
              
              {/* Domain name with 3D text effect */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
                className="relative py-4 px-2"
              >
                {/* Removed text shadow for cleaner look */}
                
                {/* Main domain name text */}
                <h1 className={`relative text-5xl md:text-7xl lg:text-8xl font-bold ${
                  domain.length > 20 ? 'text-4xl md:text-6xl lg:text-7xl' : ''
                } bg-gradient-to-r from-white via-blue-200 to-purple-300 text-transparent bg-clip-text tracking-tight leading-none`}>
                  {displayDomain}
                </h1>
                
                {/* Removed reflection effect for cleaner look */}
              </motion.div>
              
              {/* Case toggle button moved closer to domain name */}
              <div className="text-center mt-1">
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="inline-block"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleCase}
                    className="text-[10px] text-blue-300 border-blue-500/20 hover:bg-blue-950/40 
                    py-1 px-3 h-7 transition-all duration-300 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.2)]
                    hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                  >
                    {isUpperCase ? "to lowercase" : "TO UPPERCASE"}
                  </Button>
                </motion.div>
              </div>
            </div>

            {/* Domain controls and price section */}
            <div className="mb-8">

              {/* Enhanced price display with animations */}
              {price > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.8, type: "spring" }}
                  className="relative mb-10"
                >
                  {/* Price background glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full blur-xl transform scale-110"></div>
                  
                  {/* Price with premium styling */}
                  <div className="relative">
                    {/* Dollar sign with subtle animation */}
                    <motion.span 
                      animate={{ 
                        y: [0, -3, 0],
                        scale: [1, 1.05, 1]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "loop" 
                      }}
                      className="inline-block font-bold text-xl md:text-3xl lg:text-4xl text-green-400 mr-1"
                    >
                      $
                    </motion.span>
                    
                    {/* Main price amount */}
                    <span className="text-3xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-green-400 via-teal-300 to-blue-500 text-transparent bg-clip-text drop-shadow-sm">
                      {formatPrice(price)}
                    </span>
                    
                    {/* Premium badge removed as requested */}
                  </div>
                </motion.div>
              )}
            </div>

            <div className="space-y-6">
              <div className="flex flex-col items-center gap-4">
                {/* Enhanced premium buy button with advanced effects */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
                  whileHover={{ 
                    scale: 1.03,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full max-w-[280px]"
                >
                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-black 
                      px-8 py-4 rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.4)] font-extrabold 
                      relative overflow-hidden group transition-all duration-300 
                      border border-yellow-400/50 hover:border-yellow-300 
                      hover:shadow-[0_0_30px_rgba(245,158,11,0.6)]"
                    onClick={() => setIsPaymentDrawerOpen(true)}
                    aria-label={`Buy ${domain} domain now for $${formatPrice(price)}`}
                  >
                    {/* Background effects */}
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500/90 to-yellow-500/90 group-hover:from-amber-500 group-hover:to-yellow-500 transition-all duration-500" />
                    
                    {/* Hover light effect */}
                    <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
                    
                    {/* Inner glow */}
                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute inset-0 rounded-xl bg-yellow-400 blur-md opacity-30" />
                    </div>
                    
                    {/* Text with shadow */}
                    <span className="relative z-10 text-xl tracking-wide flex items-center justify-center">
                      <span className="drop-shadow-sm">BUY NOW</span>
                      
                      {/* Animated arrow */}
                      <motion.svg 
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop" }}
                        className="w-5 h-5 ml-2 -mr-1 relative"
                        viewBox="0 0 24 24" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </motion.svg>
                    </span>
                  </Button>
                </motion.div>

                <div className="flex flex-wrap gap-4 text-xs sm:text-sm font-medium justify-center mb-8">
                  <Link href="/domains" className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors hover:underline decoration-2 underline-offset-4">
                    View All Domains →
                  </Link>
                  <a
                    href={`mailto:offers@fattalgroup.io?subject=${encodeURIComponent(`Offer for ${domain}`)}&body=${encodeURIComponent(`Hello,\n\nI would like to make an offer for ${domain}:\n\nFull Name: \nCountry: \nOffer Amount: \nAdditional Comments: \n\nBest regards,`)}`}
                    className="inline-flex items-center gap-1 text-pink-400 hover:text-pink-300 transition-colors hover:underline decoration-2 underline-offset-4"
                  >
                    Make Offer →
                  </a>
                </div>
              </div>



              <div className="mt-6">
                <TrustIndicators />
              </div>

              {/* GoDaddy Domain Appraisal */}
              {domain && price > 0 && (
                <DomainAppraisal domain={domain} askingPrice={price} />
              )}

              <div className="mt-8">
                <ChatWidget domain={domain} />
              </div>
            </div>
          </motion.div>
        </div>
        <PaymentDrawer
          isOpen={isPaymentDrawerOpen}
          onClose={() => setIsPaymentDrawerOpen(false)}
          domain={domain}
          price={price}
        />
      </div>
    </>
  );
}