import { motion } from "framer-motion";
import { Shield, CreditCard, Timer, BadgeCheck } from "lucide-react";

export function TrustIndicators() {
  const indicators = [
    {
      icon: <Shield className="w-4 h-4" />,
      text: "Secure checkout via direct payment with verified payment processors",
    },
    {
      icon: <CreditCard className="w-4 h-4" />,
      text: "Direct payment option with 10% discount - no intermediaries",
    },
    {
      icon: <Timer className="w-4 h-4" />,
      text: "Fast, hassle-free domain transfer",
    },
    {
      icon: <BadgeCheck className="w-4 h-4" />,
      text: "Trusted by thousands of domain buyers worldwide",
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="grid gap-3 md:gap-4 p-4 bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/50"
    >
      <h3 className="text-center text-sm font-semibold text-slate-200 mb-1">Premium Domain Services</h3>
      {indicators.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + index * 0.1 }}
          className="flex items-center gap-3 group"
          whileHover={{ scale: 1.01 }}
        >
          {/* Simple icon without gradient background */}
          <div className="flex-shrink-0 w-7 h-7 flex items-center justify-center">
            <div className="text-slate-300 group-hover:text-white transition-colors">
              {item.icon}
            </div>
          </div>
          
          {/* Text with hover effect */}
          <span className="text-xs text-left text-slate-300 group-hover:text-white transition-colors duration-300">
            {item.text}
          </span>
        </motion.div>
      ))}
      
      {/* Simplified transaction badge */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-2 mx-auto"
      >
        <div className="inline-flex items-center justify-center px-3 py-1 text-[10px] font-medium text-white bg-slate-700/70 rounded-full">
          100% SECURE TRANSACTION
        </div>
      </motion.div>
    </motion.div>
  );
}