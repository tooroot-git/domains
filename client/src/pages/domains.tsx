import { motion } from "framer-motion";
import { Link } from "wouter";
import { getDomainPrice, formatPrice } from "@/lib/domain";
import { Shield, Camera, Lightbulb, Tag, Flame } from "lucide-react";
import { Helmet } from "react-helmet";

interface DomainCategory {
  title: string;
  icon: JSX.Element;
  domains: string[];
  gradientColors: string;
  description: string; // Added for SEO
}

const categories: DomainCategory[] = [
  {
    title: "Cybersecurity & OSINT Domains for Sale",
    icon: <Shield className="w-4 h-4" />,
    gradientColors: "from-[#1F4E79] to-[#5A5A5A]",
    description: "Premium domain names for cybersecurity tools and OSINT platforms",
    domains: [
      "OsintFox.com",
      "SecPort.io",
      "OsintCenter.com",
      "OffsecIntel.com",
      "SecWeb.io",
      "InfoCheck.io",
      "CheckSec.io", 
      "OsSec.io",
      "Anony.uk",
      "Anonychat.app"
    ]
  },
  {
    title: "Live Cam & Adult Entertainment Domains",
    icon: <Camera className="w-4 h-4" />,
    gradientColors: "from-[#C41E3A] to-black",
    description: "Domain names for live cam websites and adult entertainment platforms",
    domains: [
      "BestLiveCams.com",
      "BestLiveCams.io",
      "LiveCams.Channel",
      "LiveCamsWithoutSignup.com",
      "PlayZoy.com",
      "DollyRooms.com",
      "WebSexxx.com",
      "BlueCam.net",
      "Bunnei.net",
      "BestChaturbateShows.com",
      "DollyRoom.com",
      "FreeChaturbateLive.com",
      "TopCamGirls.net",
      "FreeTokens.store",
      "Chaturbate-Cams.live"
    ]
  },
  {
    title: "Web Security & Leak Detection Domains",
    icon: <Tag className="w-4 h-4" />,
    gradientColors: "from-[#28A745] to-[#002855]",
    description: "Domain names for web security solutions and data breach detection",
    domains: [
      "DomainsFather.com",
      "CreditCenterUSA.com",
      "DataNeta.com",
      "DataLeak.io",
      "PayFull.net",
      "IntelTrace.io"
    ]
  },
  {
    title: "Brandable Domains for Startups and Personal Brands",
    icon: <Lightbulb className="w-4 h-4" />,
    gradientColors: "from-[#FFA500] to-[#00AEEF]",
    description: "Short, memorable domain names perfect for startups and personal branding",
    domains: [
      "PhotoMe.io",
      "GptAuto.io",
      "BuyQuick.io",
      "FindUser.net",
      "TheNextGenTech.net",
      "UltraGpt.io",
      "SafeZone.dev",
      "31337.gg",
      "DefiWealth.net",
      "BankToken.io",
      "InvestEasy.io"
    ]
  }
];

const generateDomainLogo = (domain: string, gradientColors: string) => {
  const parts = domain.split('.');
  const name = parts[0];
  const tld = parts.slice(1).join('.');

  const price = getDomainPrice(domain);
  
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${gradientColors} p-4 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 group`}>
      {/* Animated highlight effect */}
      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="absolute -inset-1 bg-white/10 opacity-0 blur-xl group-hover:opacity-20 transition-all duration-500"></div>
      
      <div className="text-center whitespace-nowrap overflow-hidden">
        <div className="inline-flex items-center justify-center w-full">
          <span className={`font-bold text-white ${
            name.length > 12
              ? 'text-xs md:text-sm'
              : name.length > 8
              ? 'text-sm md:text-base'
              : 'text-base md:text-lg'
          } truncate max-w-[90%] drop-shadow-md`}>
            {name}
          </span>
          <span className="text-sm md:text-base text-white/90 shrink-0 drop-shadow-sm">.{tld}</span>
        </div>
      </div>
      
      {/* Animated shine effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none">
        <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
      </div>
    </div>
  );
};

export default function Domains() {
  // Enhanced structured data according to requirements
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Premium Domain Marketplace",
    "description": "Buy short, catchy, and SEO-friendly domain names for cybersecurity tools, OSINT platforms, live cam websites, and startups.",
    "offers": {
      "@type": "Offer",
      "priceCurrency": "USD",
      "price": "Starting at $200",
      "availability": "https://schema.org/InStock"
    }
  };

  // Additional BreadcrumbList schema as required
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": window.location.origin
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Domain Marketplace",
        "item": window.location.href
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Buy Premium Domains for Cybersecurity, Live Cams, OSINT, and Web Solutions</title>
        <meta name="description" content="Find short, catchy, and SEO-friendly domain names for cybersecurity tools, OSINT platforms, live cam websites, and web security solutions. Secure your perfect domain today!" />
        <meta name="keywords" content="buy cybersecurity domain name, premium OSINT domain for sale, domain name for live cam website, data breach domain name, web security domain, short domain for personal brand" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={window.location.href} />

        {/* Open Graph Tags */}
        <meta property="og:title" content="Buy Premium Domains for Cybersecurity, Live Cams, OSINT, and Web Solutions" />
        <meta property="og:description" content="Find short, catchy, and SEO-friendly domain names for cybersecurity tools, OSINT platforms, live cam websites, and web security solutions. Secure your perfect domain today!" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`${window.location.origin}/og-image.png`} />

        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Buy Premium Domains for Cybersecurity, Live Cams, OSINT, and Web Solutions" />
        <meta name="twitter:description" content="Find short, catchy, and SEO-friendly domain names for cybersecurity tools, OSINT platforms, live cam websites, and web security solutions." />
        <meta name="twitter:image" content={`${window.location.origin}/og-image.png`} />

        {/* Schema.org Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-[#1a1b26] via-[#2a2c4c] to-[#1a1b26] text-white py-6 md:py-12">
        <div className="container mx-auto px-3 md:px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8 md:mb-12"
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-300 text-transparent bg-clip-text mb-3 md:mb-4 px-2">
              Premium Domain Names for Sale – Secure Yours Today!
            </h1>
            <p className="text-slate-300 max-w-2xl mx-auto text-sm sm:text-base px-2">
              Find short, catchy, and SEO-friendly domain names for cybersecurity tools, OSINT platforms, live cam websites, and web security solutions.
            </p>
          </motion.div>

          <div className="space-y-8 md:space-y-12">
            {categories.map((category, categoryIndex) => (
              <div key={category.title} id={category.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
                  className="flex justify-center mb-4 md:mb-6"
                >
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full px-4 md:px-6 py-2">
                    {category.icon}
                    <h2 className="text-lg md:text-xl font-semibold">{category.title}</h2>
                  </div>
                </motion.div>

                <div className="grid grid-cols-2 xs:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 px-1 md:px-0">
                  {category.domains.map((domain, index) => (
                    <motion.div
                      key={domain}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        duration: 0.5, 
                        delay: index * 0.1,
                        ease: "easeOut"
                      }}
                      whileHover={{ 
                        y: -5,
                        transition: { duration: 0.2 }
                      }}
                      className="relative"
                    >
                      {/* Premium domain marker removed as requested */}
                      
                      {/* Main domain card with enhanced styling */}
                      <Link href={`/?domain=${encodeURIComponent(domain)}`}>
                        <a className="block group">
                          <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/90 rounded-xl p-3 md:p-3.5 
                            transition-all duration-300 border border-slate-700/50 hover:border-indigo-500/30
                            hover:shadow-[0_0_25px_rgba(79,70,229,0.15)] relative overflow-hidden">
                            
                            {/* Ambient highlights */}
                            <div className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="absolute top-0 right-0 bg-indigo-500/10 w-24 h-24 rounded-full blur-2xl -mr-10 -mt-10"></div>
                              <div className="absolute bottom-0 left-0 bg-purple-500/10 w-24 h-24 rounded-full blur-2xl -ml-10 -mb-10"></div>
                            </div>
                            
                            {/* Domain logo with enhanced styling */}
                            <div className="transform transition-all duration-300 group-hover:scale-[1.02]">
                              {generateDomainLogo(domain, category.gradientColors)}
                            </div>
                            
                            {/* Domain info section */}
                            <div className="mt-3 md:mt-4 text-center relative">
                              {/* Domain name with hover effect */}
                              <p className="text-[10px] xs:text-xs sm:text-sm font-semibold bg-gradient-to-r from-white to-slate-300 
                                bg-clip-text text-transparent mb-1.5 truncate px-1 max-w-full transition-all duration-300
                                group-hover:from-white group-hover:to-indigo-200">
                                {domain}
                              </p>
                              
                              {/* Price with shine effect */}
                              <div className="relative overflow-hidden rounded-full px-3 py-0.5 mx-auto w-fit
                                bg-gradient-to-r from-emerald-900/50 to-green-900/30 border border-emerald-700/30">
                                <motion.p 
                                  className="text-green-400 font-bold text-[10px] xs:text-xs sm:text-sm relative z-10"
                                  whileHover={{ scale: 1.05 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  ${formatPrice(getDomainPrice(domain))}
                                </motion.p>
                                
                                {/* Moving highlight */}
                                <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-10 group-hover:animate-shine" />
                              </div>
                            </div>
                          </div>
                        </a>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}