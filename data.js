/**
 * data.js — embedded data snapshots for the Best Finds Daily MCP server.
 *
 * Everything here is real data from Greg's operating deals business
 * (Best Finds with Greg / Magic City Melting Pot). Prices are copied
 * verbatim from his verified Deals Hub mapping — never invented.
 */

// ---------------------------------------------------------------------------
// Today's Temu Top 5 (snapshot of the daily drop, Oct 16, 2026 — verified
// live on Greg's signed-in Temu storefront that day; names, prices and sold
// counts copied from the Oct 16 drop records, never invented. Per-product
// links were not captured for this drop, so every item points at the
// storefront, which is Greg's canonical Temu entry point.)
// In production this snapshot is refreshed by the daily Temu drop flow;
// it is embedded here so the MCP server has no storage dependency.
// ---------------------------------------------------------------------------
export const TEMU_TOP5 = {
  date: "2026-10-16",
  dateLabel: "Oct 16, 2026",
  promoCode: "aln767451",
  storefront: "https://temu.to/k/p3e7nhnlelp",
  items: [
    {
      name: "Solar Outdoor Lights",
      price: 6.9,
      priceLabel: "$6.90",
      sold: "100K sold",
      url: "https://temu.to/k/p3e7nhnlelp",
    },
    {
      name: "Electric Grooming Kit",
      price: 10.37,
      priceLabel: "$10.37",
      sold: "100K sold",
      url: "https://temu.to/k/p3e7nhnlelp",
    },
    {
      name: "Impact Socket Set",
      price: 9.63,
      priceLabel: "$9.63",
      sold: "89K sold",
      url: "https://temu.to/k/p3e7nhnlelp",
    },
    {
      name: "Wok Set",
      price: 19.99,
      priceLabel: "$19.99",
      sold: "70K sold",
      url: "https://temu.to/k/p3e7nhnlelp",
    },
    {
      name: "Super Absorbent Drying Mat",
      price: 4.16,
      priceLabel: "$4.16",
      sold: "66K sold",
      url: "https://temu.to/k/p3e7nhnlelp",
    },
  ],
  // Required disclosure line, verbatim.
  disclosure:
    "Prices as of Oct 16, 2026; extra 30% off with code aln767451. #ad — I may earn a commission.",
};

// ---------------------------------------------------------------------------
// Deal hub directory — Greg's canonical link hubs.
// ---------------------------------------------------------------------------
export const DEAL_HUBS = [
  {
    name: "Master hub",
    url: "https://muse.ai/s/all-hubs-ot69dg4tutxe",
    description: "everything in one place",
  },
  {
    name: "Amazon Finds",
    url: "https://muse.ai/s/amazon-finds-hub-wz69dtxohxr82",
    description: "daily Amazon finds drops",
  },
  {
    name: "Deals Hub",
    url: "https://muse.ai/s/deals-hub-x0xz6fpjxuxxxvixt",
    description: "40 verified deals",
  },
  {
    name: "Temu Finds",
    url: "https://muse.ai/s/temu-finds-hub-xqp6fsx03xcgxlxq",
    description: "the daily Temu Top 5 and more",
  },
  {
    name: "Business Growth Hub",
    url: "https://muse.ai/s/business-growth-hub-rp69xe4658jxl",
    description: "tools and programs for creators and sellers",
  },
  {
    name: "Blog",
    url: "https://bestfindswithgreg.blogspot.com/",
    description: "Best Finds with Greg — written finds and review summaries",
  },
  {
    name: "Telegram deals channel",
    url: "https://t.me/Bestfindswithgreg",
    description: "deals as they drop, in Telegram",
  },
  {
    name: "Newsletter",
    url: "https://best-finds-daily.kit.com/profile",
    description: "Best Finds Daily — the highlights in your inbox",
  },
];

// ---------------------------------------------------------------------------
// Verified Amazon deals — all 40 entries copied EXACTLY from the Deals Hub
// verified mapping (~/workspace/amazon-finds-day2/deals-hub-verified-mapping.md,
// mapped from Greg's screenshots, Oct 6, 2026). Names, prices and savings
// are as mapped; `price` is the numeric form of `priceLabel` for filtering.
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// PRICE AUDIT — Oct 16, 2026 (Rainforest API live verification):
// 8 entries below were re-verified live and corrected — Blink Mini 2K+,
// tarte mascara, Keurig K-Supreme, Tineco Floor ONE, Stanley Quencher,
// iRobot Roomba, Ensure Max Protein, Kiehl's Ultra Facial Cream. Every one
// had risen back to its list/typical price: the Oct 6 Prime Big Deal prices
// are over. The remaining 32 entries still carry Oct 6, 2026 deal-window
// prices and must be treated as STALE until re-verified (the audit was cut
// short when Rainforest suspended the trial account mid-run — see
// ~/workspace/goals/amazon-finds-daily-drops/hidden_files/amazon-price-audit-20261016.md).
// ---------------------------------------------------------------------------
export const DEALS = [
  {
    name: "Blink Mini 2K+ (2-pack, white)",
    price: 69.99,
    priceLabel: "$69.99",
    savingsLabel: "no discount vs list",
    referenceLabel: "Typ $69.99",
    category: "smart home",
    keywords: ["blink", "camera", "security", "mini", "smart home"],
  },
  {
    name: "tarte tartelette mascara",
    price: 28,
    priceLabel: "$28.00",
    savingsLabel: "no discount vs list",
    referenceLabel: "List $28.00",
    category: "beauty",
    keywords: ["tarte", "mascara", "makeup", "beauty", "cosmetics"],
  },
  {
    name: "Keurig K-Supreme single-serve coffee maker",
    price: 169.99,
    priceLabel: "$169.99",
    savingsLabel: "no discount vs list",
    referenceLabel: "List $169.99",
    category: "kitchen",
    keywords: ["keurig", "coffee", "coffee maker", "kitchen", "k-cup"],
  },
  {
    name: "Shark AV2501S robot vacuum",
    price: 239.99,
    priceLabel: "$239.99",
    savingsLabel: "$310 off",
    referenceLabel: "List $549.99",
    category: "home",
    keywords: ["shark", "robot vacuum", "vacuum", "cleaning", "home"],
  },
  {
    name: "Bose QuietComfort headphones",
    price: 169.0,
    priceLabel: "$169.00",
    savingsLabel: "$190 off",
    referenceLabel: "List $369.00",
    category: "tech",
    keywords: ["bose", "headphones", "quietcomfort", "audio", "tech"],
  },
  {
    name: "Ring Battery Doorbell",
    price: 39.99,
    priceLabel: "$39.99",
    savingsLabel: "$60 off",
    referenceLabel: "List $99.99",
    category: "smart home",
    keywords: ["ring", "doorbell", "security", "camera", "smart home"],
  },
  {
    name: "Amazon Echo Dot",
    price: 39.99,
    priceLabel: "$39.99",
    savingsLabel: "50% off",
    referenceLabel: "List $79.99",
    category: "smart home",
    keywords: ["echo", "dot", "alexa", "amazon", "speaker", "smart home"],
  },
  {
    name: "Stanley Quencher tumbler",
    price: 40,
    priceLabel: "$40.00",
    savingsLabel: "no discount vs list",
    referenceLabel: "List $40.00",
    category: "drinkware",
    keywords: ["stanley", "quencher", "tumbler", "cup", "drinkware"],
  },
  {
    name: "Chefman air fryer",
    price: 71.99,
    priceLabel: "$71.99",
    savingsLabel: "$88 off",
    referenceLabel: "List $159.99",
    category: "kitchen",
    keywords: ["chefman", "air fryer", "fryer", "kitchen", "cooking"],
  },
  {
    name: "Samsonite Freeform luggage",
    price: 175.0,
    priceLabel: "$175.00",
    savingsLabel: "$304 off",
    referenceLabel: "Typ $479.99",
    category: "travel",
    keywords: ["samsonite", "luggage", "suitcase", "freeform", "travel"],
  },
  {
    name: "Tineco Floor ONE wet/dry vacuum",
    price: 599,
    priceLabel: "$599.00",
    savingsLabel: "no discount vs list",
    referenceLabel: "List $599.00",
    category: "home",
    keywords: ["tineco", "floor one", "wet dry vacuum", "vacuum", "mop", "cleaning", "home"],
  },
  {
    name: "LEGO Star Wars set",
    price: 83.99,
    priceLabel: "$83.99",
    savingsLabel: "$56 off",
    referenceLabel: "List $139.99",
    category: "toys",
    keywords: ["lego", "star wars", "toys", "building set", "kids", "gift"],
  },
  {
    name: "Premier Protein variety pack",
    price: 19.19,
    priceLabel: "$19.19",
    savingsLabel: "40% off",
    referenceLabel: "Typ $31.98",
    category: "health",
    keywords: ["premier protein", "protein shake", "protein", "health", "nutrition"],
  },
  {
    name: "Beats Studio Pro headphones",
    price: 149.95,
    priceLabel: "$149.95",
    savingsLabel: "$150 off",
    referenceLabel: "List $299.99",
    category: "tech",
    keywords: ["beats", "studio pro", "headphones", "audio", "tech"],
  },
  {
    name: "Shark Pet Cordless stick vacuum",
    price: 149.99,
    priceLabel: "$149.99",
    savingsLabel: "$150 off",
    referenceLabel: "List $299.99",
    category: "home",
    keywords: ["shark", "cordless vacuum", "stick vacuum", "pet", "vacuum", "cleaning", "home"],
  },
  {
    name: "roborock robot vacuum (2026 model)",
    price: 384.99,
    priceLabel: "$384.99",
    savingsLabel: "$315 off",
    referenceLabel: "List $699.99",
    category: "home",
    keywords: ["roborock", "robot vacuum", "vacuum", "cleaning", "home"],
  },
  {
    name: "medicube PDRN skincare",
    price: 14.95,
    priceLabel: "$14.95",
    savingsLabel: "50% off",
    referenceLabel: "Typ $29.99",
    category: "beauty",
    keywords: ["medicube", "pdrn", "skincare", "skin care", "beauty", "k-beauty"],
  },
  {
    name: "Beats Solo 4 headphones",
    price: 99.95,
    priceLabel: "$99.95",
    savingsLabel: "$100 off",
    referenceLabel: "List $199.95",
    category: "tech",
    keywords: ["beats", "solo 4", "headphones", "audio", "tech"],
  },
  {
    name: "Amazon Echo Show",
    price: 149.99,
    priceLabel: "$149.99",
    savingsLabel: "$100 off",
    referenceLabel: "List $249.99",
    category: "smart home",
    keywords: ["echo show", "echo", "alexa", "amazon", "smart display", "smart home"],
  },
  {
    name: "Samsung SSD 990",
    price: 349.99,
    priceLabel: "$349.99",
    savingsLabel: "$329 off",
    referenceLabel: "List $679.97",
    category: "tech",
    keywords: ["samsung", "ssd", "990", "storage", "drive", "tech", "pc"],
  },
  {
    name: "Govee RGBIC floor lamp",
    price: 54.99,
    priceLabel: "$54.99",
    savingsLabel: "45% off",
    referenceLabel: "List $99.99",
    category: "smart home",
    keywords: ["govee", "floor lamp", "lamp", "rgbic", "lighting", "smart home", "home"],
  },
  {
    name: "Amazon Fire HD 10 tablet",
    price: 72.99,
    priceLabel: "$72.99",
    savingsLabel: "$82 off",
    referenceLabel: "Typ $164.99",
    category: "tech",
    keywords: ["fire hd", "tablet", "amazon", "fire tablet", "tech"],
  },
  {
    name: "iRobot Roomba",
    price: 636,
    priceLabel: "$636.00",
    savingsLabel: "$163 off",
    referenceLabel: "List $799.99",
    category: "home",
    keywords: ["irobot", "roomba", "robot vacuum", "vacuum", "cleaning", "home"],
  },
  {
    name: "Ensure Max Protein",
    price: 27.97,
    priceLabel: "$27.97",
    savingsLabel: "no discount vs list",
    referenceLabel: "Typ $27.97",
    category: "health",
    keywords: ["ensure", "max protein", "protein shake", "protein", "health", "nutrition"],
  },
  {
    name: "Kiehl's Ultra Facial Cream",
    price: 72,
    priceLabel: "$72.00",
    savingsLabel: "no discount vs list",
    referenceLabel: "Typ $72.00",
    category: "beauty",
    keywords: ["kiehl's", "kiehls", "facial cream", "moisturizer", "skincare", "beauty"],
  },
  {
    name: "CGK Unlimited King Size 4-piece sheet set",
    price: 24.2,
    priceLabel: "$24.20",
    savingsLabel: "46% off",
    referenceLabel: "List $44.99",
    category: "home",
    keywords: ["sheet set", "sheets", "bedding", "king size", "cgk", "home"],
  },
  {
    name: "Toniebox 2 Audio (blue)",
    price: 119.99,
    priceLabel: "$119.99",
    savingsLabel: "$89 off",
    referenceLabel: "List $209.96",
    category: "kids",
    keywords: ["toniebox", "audio player", "kids", "children", "stories", "toys"],
  },
  {
    name: "Amazon Echo Show",
    price: 59.99,
    priceLabel: "$59.99",
    savingsLabel: "40% off",
    referenceLabel: "List $99.99",
    category: "smart home",
    keywords: ["echo show", "echo", "alexa", "amazon", "smart display", "smart home"],
  },
  {
    name: "Keurig K-Express",
    price: 59.99,
    priceLabel: "$59.99",
    savingsLabel: "$50 off",
    referenceLabel: "List $109.99",
    category: "kitchen",
    keywords: ["keurig", "k-express", "coffee", "coffee maker", "kitchen", "k-cup"],
  },
  {
    name: "Philips Sonicare",
    price: 64.96,
    priceLabel: "$64.96",
    savingsLabel: "41% off",
    referenceLabel: "List $109.99",
    category: "health",
    keywords: ["philips", "sonicare", "toothbrush", "electric toothbrush", "health", "dental"],
  },
  {
    name: "Toniebox 2 Audio (pink)",
    price: 119.99,
    priceLabel: "$119.99",
    savingsLabel: "$89 off",
    referenceLabel: "List $209.96",
    category: "kids",
    keywords: ["toniebox", "audio player", "kids", "children", "stories", "toys"],
  },
  {
    name: "Amazon Echo Spot",
    price: 54.99,
    priceLabel: "$54.99",
    savingsLabel: "$55 off",
    referenceLabel: "List $109.99",
    category: "smart home",
    keywords: ["echo spot", "echo", "alexa", "amazon", "alarm clock", "smart home"],
  },
  {
    name: "Amazon Fire TV",
    price: 239.99,
    priceLabel: "$239.99",
    savingsLabel: "$160 off",
    referenceLabel: "List $399.99",
    category: "tech",
    keywords: ["fire tv", "television", "tv", "amazon", "streaming", "tech"],
  },
  {
    name: "Blink Outdoor 4",
    price: 104.99,
    priceLabel: "$104.99",
    savingsLabel: "$195 off",
    referenceLabel: "List $299.99",
    category: "smart home",
    keywords: ["blink", "outdoor camera", "camera", "security", "smart home"],
  },
  {
    name: "Jackery Solar Generator",
    price: 709.0,
    priceLabel: "$709.00",
    savingsLabel: "$590 off",
    referenceLabel: "List $1,299.00",
    category: "outdoors",
    keywords: ["jackery", "solar generator", "generator", "power station", "solar", "camping", "outdoors"],
  },
  {
    name: "ROVE R2-4K Dual dash cam",
    price: 107.99,
    priceLabel: "$107.99",
    savingsLabel: "$92 off",
    referenceLabel: "List $199.99",
    category: "auto",
    keywords: ["rove", "dash cam", "dashcam", "car camera", "auto", "4k"],
  },
  {
    name: "Waterpik Aquarius",
    price: 49.99,
    priceLabel: "$49.99",
    savingsLabel: "$50 off",
    referenceLabel: "List $99.99",
    category: "health",
    keywords: ["waterpik", "aquarius", "water flosser", "flosser", "dental", "health"],
  },
  {
    name: "Ring Outdoor Camera",
    price: 49.99,
    priceLabel: "$49.99",
    savingsLabel: "$50 off",
    referenceLabel: "List $99.99",
    category: "smart home",
    keywords: ["ring", "outdoor camera", "camera", "security", "smart home"],
  },
  {
    name: "HEYDUDE Men's shoes",
    price: 34.99,
    priceLabel: "$34.99",
    savingsLabel: "50% off",
    referenceLabel: "Typ $69.99",
    category: "apparel",
    keywords: ["heydude", "shoes", "men's shoes", "mens", "footwear", "apparel"],
  },
  {
    name: "medicube PDRN",
    price: 11.94,
    priceLabel: "$11.94",
    savingsLabel: "40% off",
    referenceLabel: "List $20.00",
    category: "beauty",
    keywords: ["medicube", "pdrn", "skincare", "skin care", "beauty", "k-beauty"],
  },
];

// ---------------------------------------------------------------------------
// Fallback briefing — used only if the live feed fetch fails, and always
// labelled as cached by the tool that returns it.
// ---------------------------------------------------------------------------
export const FALLBACK_BRIEFING = {
  titleText: "Best Finds Daily",
  date: "2026-10-14",
  mainText:
    "Welcome to Best Finds Daily with Greg! Here are today's top finds. " +
    "First up: my Temu storefront is freshly stocked with today's Top Five finds — " +
    "head there and use my promo code aln767451 at checkout for an extra thirty percent off. " +
    "Second: my Deals Hub and my Amazon Finds Hub are updated with this week's latest picks, " +
    "all gathered in one easy place so you can browse and shop without hunting around. " +
    "And third: if you are growing a business online, stop by my Business Growth Hub for the " +
    "tools and free resources I use, and sign up for my Best Finds Daily newsletter so the " +
    "highlights land in your inbox every morning. Check the Alexa app for every link, and " +
    "I'll catch you tomorrow for more Best Finds Daily!",
};
