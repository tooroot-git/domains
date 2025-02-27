export const domainPrices: Record<string, number> = {
  "31337.gg": 200,
  "Anony.uk": 1200,
  "Anonychat.app": 1450,
  "BankToken.io": 682,
  "BestChaturbateShows.com": 1046,
  "BestLiveCams.com": 6015,
  "BestLiveCams.io": 6015,
  "BetaCheck.io": 500,
  "BlueCam.net": 2179,  // Fixed casing
  "BreachMap.com": 1291,
  "Bunnei.net": 4590,
  "Buuny.net": 500,
  "BuyQuick.io": 1100,
  "ChainFinance.ai": 1298,
  "Chaturbate-Cams.live": 200,
  "ChaturbateStreaming.com": 1398,
  "CheckSec.io": 1200,
  "CreditCenterUSA.com": 1100,
  "DataLeak.io": 1457,
  "DataNeta.com": 1200,
  "DefiWealth.net": 684,
  "DollyRoom.com": 870,
  "DollyRooms.com": 5218,
  "DomainsFather.com": 2200,
  "DoxDocks.com": 100,
  "FindUser.net": 750,
  "FreeChaturbateLive.com": 700,
  "FreeTokens.store": 250,
  "GptAuto.io": 1320,
  "InfoCheck.io": 3000,
  "IntelTrace.io": 1200,
  "InvestEasy.io": 1000,
  "LiveCams.Channel": 2500,
  "LiveCamsWithoutSignup.com": 350,
  "MetaDoxe.com": 250,
  "OffsecIntel.com": 5500,
  "OsintFox.com": 15000,
  "OsSec.io": 1200,
  "PayFull.net": 1323,
  "PhotoMe.io": 5000,
  "PlayZoy.com": 2200,
  "PornProfile.com": 1450,
  "SafeZone.dev": 200,
  "SecPort.io": 6768,
  "SecWeb.io": 3926,
  "sexvideopro.com": 2544,
  "TheNextGenTech.net": 264,
  "TopCamGirls.net": 801,
  "TopChaturbateModels.com": 800,
  "UltraGpt.io": 228,
  "WebSexxx.com": 4231,
  "NudeByMe.com": 2500,
  "OsintCenter.com": 3200,
  "2235794d-3e7b-4bad-a01c-bb10a512e1d1-00-1zyfb4etrn8j4.worf.replit.dev": 6500
};
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US').format(price);
}

export function getDomainPrice(domain: string): number {
  // Make case-insensitive comparison
  const domainUpper = domain.toUpperCase();
  const found = Object.keys(domainPrices).find(key => key.toUpperCase() === domainUpper);
  return found ? domainPrices[found] : 0;
}

export function getDomainFromUrl(): string {
  const urlParams = new URLSearchParams(window.location.search);
  const domainParam = urlParams.get('domain');

  if (domainParam) {
    // Make case-insensitive comparison for domain parameter
    const domainUpper = domainParam.toUpperCase();
    const found = Object.keys(domainPrices).find(key => key.toUpperCase() === domainUpper);
    if (found) return found;
  }

  // Remove protocol and www if present
  const host = window.location.hostname.replace(/^www\./i, "");
  
  // Use the actual domain name for Replit environments
  if (host.includes('replit.dev') || host.includes('repl.co')) {
    // Use the actual hostname instead of defaulting to a sample domain
    return host;
  }

  // If running locally, return a sample domain that has a price
  if (host === "localhost") {
    return "OsintFox.com";
  }
  
  // If domain is extremely long (non-standard), use a sample domain
  if (host.length > 60) {
    return "OsintFox.com";
  }

  // Return the actual hostname for all other cases
  return host;
}