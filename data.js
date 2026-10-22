/**
 * data.js — embedded data snapshots for the Best Finds Daily MCP server.
 *
 * Everything here is real data from Greg's operating deals business
 * (Best Finds with Greg / Magic City Melting Pot). Prices are copied
 * verbatim from his verified Deals Hub mapping — never invented.
 */

// ---------------------------------------------------------------------------
// Today's Temu Top 5 (snapshot of the daily drop, Oct 22, 2026 — verified
// live on Greg's signed-in Temu storefront that day; names, prices and sold
// counts copied from the Oct 22 drop records
// (~/workspace/temu-finds-promo/2026-10-22/MANIFEST.md), never invented.
// Per-product links were not captured for this drop, so every item points
// at the storefront, which is Greg's canonical Temu entry point.)
// The MCP tool prefers the daily-refreshed copy in BRIEFING_KV (key
// "temu-top5") and falls back to this embedded snapshot — whichever carries
// the later date wins, so the tool can never serve a day-old list as
// "today's" again (the Oct 21 snapshot did exactly that on Oct 22).
// ---------------------------------------------------------------------------
export const TEMU_TOP5 = {
  date: "2026-10-22",
  dateLabel: "Oct 22, 2026",
  promoCode: "aln767451",
  storefront: "https://temu.to/k/p3e7nhnlelp",
  items: [
    {
      name: "1080P Wireless Doorbell Camera",
      price: 14.26,
      priceLabel: "$14.26",
      sold: "20K+ sold",
      url: "https://temu.to/k/p3e7nhnlelp",
    },
    {
      name: "5-in-1 Handheld Mixer & Immersion Blender",
      price: 23.98,
      priceLabel: "$23.98",
      sold: "17K+ sold",
      url: "https://temu.to/k/p3e7nhnlelp",
    },
    {
      name: "Super Mini HD Camera (USB Rechargeable)",
      price: 23.76,
      priceLabel: "$23.76",
      sold: "12K+ sold",
      url: "https://temu.to/k/p3e7nhnlelp",
    },
    {
      name: "3-in-1 Portable Charcoal Smoker Grill",
      price: 42.31,
      priceLabel: "$42.31",
      sold: "11K+ sold",
      url: "https://temu.to/k/p3e7nhnlelp",
    },
    {
      name: "180° Flex-Head Ratcheting Wrench Set 16pc",
      price: 35.32,
      priceLabel: "$35.32",
      sold: "8K+ sold",
      url: "https://temu.to/k/p3e7nhnlelp",
    },
  ],
  // Required disclosure line, verbatim.
  disclosure:
    "Prices as of Oct 22, 2026; extra 30% off with code aln767451. #ad — I may earn a commission.",
};

// ---------------------------------------------------------------------------
// Deal hub directory — Greg's canonical link hubs.
// ---------------------------------------------------------------------------
export const DEAL_HUBS = [
  {
    name: "Master hub",
    url: "https://all-hubs.themagiccitymeltingpot.workers.dev/",
    description: "everything in one place",
  },
  {
    name: "Amazon Finds",
    url: "https://amazon-finds-hub.themagiccitymeltingpot.workers.dev/",
    description: "daily Amazon finds drops",
  },
  {
    name: "Deals Hub",
    url: "https://deals-hub.themagiccitymeltingpot.workers.dev/",
    description: "40 verified deals",
  },
  {
    name: "Temu Finds",
    url: "https://temu-finds-hub.themagiccitymeltingpot.workers.dev/",
    description: "the daily Temu Top 5 and more",
  },
  {
    name: "Business Growth Hub",
    url: "https://business-growth-hub.themagiccitymeltingpot.workers.dev/",
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
// Amazon deals inventory — all 40 entries copied from the Deals Hub mapping
// (~/workspace/amazon-finds-day2/deals-hub-verified-mapping.md, mapped from
// Greg's screenshots, Oct 6, 2026). Only entries with a price in the verified
// refresh set may carry price data; held entries keep name/category/keywords
// with `price: null` and no price-bearing labels.
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
// ---------------------------------------------------------------------------
// WEEKLY REFRESH — Oct 19, 2026: Halloween seasonal leaders (window Oct 20-31)
// swapped in at the top from fresh-daily-picks.json (all verified Oct 16,
// 2026): Ediseng Pumpkin + Spider earrings ($8.99, campaigns end Oct 22),
// HALLOWEEN Man EDT ($48.00, ends Oct 31), FUNTASTY 15ct ($9.99, ends Nov 30).
// Swapped out (verified Oct 16 at full list/typical price, no discount —
// the weakest entries): Tineco Floor ONE $599.00, Keurig K-Supreme $169.99,
// tarte tartelette mascara $28.00, Ensure Max Protein $27.97. Count stays 40.
// REMEDIATION — Oct 19, 2026: under Gee's NO PRICELESS PROMOS rule, the
// other 32 Oct 6 snapshot prices were stripped (`price: null`, price-bearing
// labels removed) and search_deals serves priced entries only.
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// EXPANSION — Oct 21, 2026: four verified lotion deals added after the
// Kiehl's entry below (count 40 -> 44 entries; verified priced entries
// 8 -> 12). Provenance for each: Greg's own Amazon app screenshots,
// Oct 19, 2026 (the lotion slate), now also carried in the price pipe as
// verified (source "gee-screenshot-2026-10-19"): CeraVe Daily Moisturizing
// Lotion $18.14 (ASIN B07RK4HST7), La Roche-Posay Lipikar AP+MAX $21.99
// (ASIN B003QXZWYW), Aquaphor Healing Ointment 7 oz $12.97 (ASIN
// B0107QPFBU), Aveeno Daily Moisturizing Lotion $9.97 was $14.16 (ASIN
// B001459IEE). Associate links: https://www.amazon.com/dp/<ASIN>?tag=mcmp0b-20
// (the DEALS schema carries no link field — the Alexa cards route shoppers
// to the Deals Hub, as with every other entry).
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// PIPE SYNC — Oct 22, 2026: every priced entry below was re-checked against
// the live price pipe (GET /prices, the verified KV map) and corrected to
// the pipe's verified price; each priced entry now also carries its ASIN
// so the Worker can keep applying the pipe's price at request time (see
// applyPipePrices in worker.js). Corrections in this pass: HALLOWEEN Man
// EDT $48.00 -> $36.00 (B009YUFD4K), Blink Mini 2K+ $69.99 -> $30.99
// (B0F3BJJ9DJ), Stanley Quencher $40.00 -> $39.99 (B0CP9YBWMG), iRobot
// Roomba $636.00 -> $629.99 (B0GT6BYB85), Kiehl's Ultra Facial Cream
// $72.00 -> $54.00 (B00C6SV33M).
// ---------------------------------------------------------------------------
export const DEALS = [
  {
    name: "Ediseng Pumpkin Dangle Earrings",
    asin: "B0HBQBX1XL",
    price: 8.99,
    priceLabel: "$8.99",
    savingsLabel: "was $9.99",
    referenceLabel: "Verified Oct 16, 2026",
    category: "seasonal",
    keywords: ["ediseng", "pumpkin", "earrings", "halloween", "jewelry", "seasonal"],
  },
  {
    name: "Ediseng Spider Dangle Earrings",
    asin: "B0HBQFCTX5",
    price: 8.99,
    priceLabel: "$8.99",
    savingsLabel: "was $9.99",
    referenceLabel: "Verified Oct 16, 2026",
    category: "seasonal",
    keywords: ["ediseng", "spider", "earrings", "halloween", "jewelry", "seasonal"],
  },
  {
    name: "HALLOWEEN Man EDT",
    asin: "B009YUFD4K",
    price: 36,
    priceLabel: "$36.00",
    savingsLabel: "no discount claimed",
    referenceLabel: "Verified Oct 22, 2026",
    category: "fragrance",
    keywords: ["halloween man", "edt", "fragrance", "cologne", "men", "seasonal", "gift"],
  },
  {
    name: "FUNTASTY 15ct",
    asin: "B0HGG7ZC2T",
    price: 9.99,
    priceLabel: "$9.99",
    savingsLabel: "no discount claimed",
    referenceLabel: "Verified Oct 16, 2026",
    category: "seasonal",
    keywords: ["funtasty", "candy", "sour candy", "sweet", "halloween", "seasonal", "snacks"],
  },
  {
    name: "Blink Mini 2K+ (2-pack, white)",
    asin: "B0F3BJJ9DJ",
    price: 30.99,
    priceLabel: "$30.99",
    savingsLabel: "no discount claimed",
    referenceLabel: "Verified Oct 22, 2026",
    category: "smart home",
    keywords: ["blink", "camera", "security", "mini", "smart home"],
  },
  {
    name: "Shark AV2501S robot vacuum",
    price: null,
    priceLabel: null,
    savingsLabel: "price not verified",
    referenceLabel: "Held Oct 19, 2026 — no verified price",
    category: "home",
    keywords: ["shark", "robot vacuum", "vacuum", "cleaning", "home"],
  },
  {
    name: "Bose QuietComfort headphones",
    price: null,
    priceLabel: null,
    savingsLabel: "price not verified",
    referenceLabel: "Held Oct 19, 2026 — no verified price",
    category: "tech",
    keywords: ["bose", "headphones", "quietcomfort", "audio", "tech"],
  },
  {
    name: "Ring Battery Doorbell",
    price: null,
    priceLabel: null,
    savingsLabel: "price not verified",
    referenceLabel: "Held Oct 19, 2026 — no verified price",
    category: "smart home",
    keywords: ["ring", "doorbell", "security", "camera", "smart home"],
  },
  {
    name: "Amazon Echo Dot",
    price: null,
    priceLabel: null,
    savingsLabel: "price not verified",
    referenceLabel: "Held Oct 19, 2026 — no verified price",
    category: "smart home",
    keywords: ["echo", "dot", "alexa", "amazon", "speaker", "smart home"],
  },
  {
    name: "Stanley Quencher tumbler",
    asin: "B0CP9YBWMG",
    price: 39.99,
    priceLabel: "$39.99",
    savingsLabel: "no discount claimed",
    referenceLabel: "List $40.00",
    category: "drinkware",
    keywords: ["stanley", "quencher", "tumbler", "cup", "drinkware"],
  },
  {
    name: "Chefman air fryer",
    price: null,
    priceLabel: null,
    savingsLabel: "price not verified",
    referenceLabel: "Held Oct 19, 2026 — no verified price",
    category: "kitchen",
    keywords: ["chefman", "air fryer", "fryer", "kitchen", "cooking"],
  },
  {
    name: "Samsonite Freeform luggage",
    price: null,
    priceLabel: null,
    savingsLabel: "price not verified",
    referenceLabel: "Held Oct 19, 2026 — no verified price",
    category: "travel",
    keywords: ["samsonite", "luggage", "suitcase", "freeform", "travel"],
  },
  {
    name: "LEGO Star Wars set",
    price: null,
    priceLabel: null,
    savingsLabel: "price not verified",
    referenceLabel: "Held Oct 19, 2026 — no verified price",
    category: "toys",
    keywords: ["lego", "star wars", "toys", "building set", "kids", "gift"],
  },
  {
    name: "Premier Protein variety pack",
    price: null,
    priceLabel: null,
    savingsLabel: "price not verified",
    referenceLabel: "Held Oct 19, 2026 — no verified price",
    category: "health",
    keywords: ["premier protein", "protein shake", "protein", "health", "nutrition"],
  },
  {
    name: "Beats Studio Pro headphones",
    price: null,
    priceLabel: null,
    savingsLabel: "price not verified",
    referenceLabel: "Held Oct 19, 2026 — no verified price",
    category: "tech",
    keywords: ["beats", "studio pro", "headphones", "audio", "tech"],
  },
  {
    name: "Shark Pet Cordless stick vacuum",
    price: null,
    priceLabel: null,
    savingsLabel: "price not verified",
    referenceLabel: "Held Oct 19, 2026 — no verified price",
    category: "home",
    keywords: ["shark", "cordless vacuum", "stick vacuum", "pet", "vacuum", "cleaning", "home"],
  },
  {
    name: "roborock robot vacuum (2026 model)",
    price: null,
    priceLabel: null,
    savingsLabel: "price not verified",
    referenceLabel: "Held Oct 19, 2026 — no verified price",
    category: "home",
    keywords: ["roborock", "robot vacuum", "vacuum", "cleaning", "home"],
  },
  {
    name: "medicube PDRN skincare",
    price: null,
    priceLabel: null,
    savingsLabel: "price not verified",
    referenceLabel: "Held Oct 19, 2026 — no verified price",
    category: "beauty",
    keywords: ["medicube", "pdrn", "skincare", "skin care", "beauty", "k-beauty"],
  },
  {
    name: "Beats Solo 4 headphones",
    price: null,
    priceLabel: null,
    savingsLabel: "price not verified",
    referenceLabel: "Held Oct 19, 2026 — no verified price",
    category: "tech",
    keywords: ["beats", "solo 4", "headphones", "audio", "tech"],
  },
  {
    name: "Amazon Echo Show",
    price: null,
    priceLabel: null,
    savingsLabel: "price not verified",
    referenceLabel: "Held Oct 19, 2026 — no verified price",
    category: "smart home",
    keywords: ["echo show", "echo", "alexa", "amazon", "smart display", "smart home"],
  },
  {
    name: "Samsung SSD 990",
    price: null,
    priceLabel: null,
    savingsLabel: "price not verified",
    referenceLabel: "Held Oct 19, 2026 — no verified price",
    category: "tech",
    keywords: ["samsung", "ssd", "990", "storage", "drive", "tech", "pc"],
  },
  {
    name: "Govee RGBIC floor lamp",
    price: null,
    priceLabel: null,
    savingsLabel: "price not verified",
    referenceLabel: "Held Oct 19, 2026 — no verified price",
    category: "smart home",
    keywords: ["govee", "floor lamp", "lamp", "rgbic", "lighting", "smart home", "home"],
  },
  {
    name: "Amazon Fire HD 10 tablet",
    price: null,
    priceLabel: null,
    savingsLabel: "price not verified",
    referenceLabel: "Held Oct 19, 2026 — no verified price",
    category: "tech",
    keywords: ["fire hd", "tablet", "amazon", "fire tablet", "tech"],
  },
  {
    name: "iRobot Roomba",
    asin: "B0GT6BYB85",
    price: 629.99,
    priceLabel: "$629.99",
    savingsLabel: "$170 off",
    referenceLabel: "List $799.99",
    category: "home",
    keywords: ["irobot", "roomba", "robot vacuum", "vacuum", "cleaning", "home"],
  },
  {
    name: "Kiehl's Ultra Facial Cream",
    asin: "B00C6SV33M",
    price: 54,
    priceLabel: "$54.00",
    savingsLabel: "no discount claimed",
    referenceLabel: "Verified Oct 22, 2026",
    category: "beauty",
    keywords: ["kiehl's", "kiehls", "facial cream", "moisturizer", "skincare", "beauty"],
  },
  {
    name: "CeraVe Daily Moisturizing Lotion",
    asin: "B07RK4HST7",
    price: 18.14,
    priceLabel: "$18.14",
    savingsLabel: "no discount claimed",
    referenceLabel: "Verified Oct 19, 2026",
    category: "beauty",
    keywords: ["cerave", "lotion", "moisturizing lotion", "moisturizer", "skincare", "skin care", "beauty", "dry skin"],
  },
  {
    name: "La Roche-Posay Lipikar AP+MAX",
    asin: "B003QXZWYW",
    price: 21.99,
    priceLabel: "$21.99",
    savingsLabel: "no discount claimed",
    referenceLabel: "Verified Oct 19, 2026",
    category: "beauty",
    keywords: ["la roche-posay", "lipikar", "lotion", "balm", "body cream", "moisturizer", "skincare", "skin care", "beauty", "eczema", "dry skin"],
  },
  {
    name: "Aquaphor Healing Ointment 7 oz",
    asin: "B0107QPFBU",
    price: 12.97,
    priceLabel: "$12.97",
    savingsLabel: "no discount claimed",
    referenceLabel: "Verified Oct 19, 2026",
    category: "beauty",
    keywords: ["aquaphor", "healing ointment", "ointment", "lotion", "skin protectant", "skincare", "skin care", "beauty", "dry skin"],
  },
  {
    name: "Aveeno Daily Moisturizing Lotion",
    asin: "B001459IEE",
    price: 9.97,
    priceLabel: "$9.97",
    savingsLabel: "was $14.16",
    referenceLabel: "Verified Oct 19, 2026",
    category: "beauty",
    keywords: ["aveeno", "lotion", "moisturizing lotion", "moisturizer", "oat", "skincare", "skin care", "beauty", "dry skin"],
  },
  {
    // Added Oct 21, 2026 (submit-day staging): La Roche-Posay Cicaplast
    // Balm B5, 1.35 oz — ASIN B0060OUV5Y, $13.69 (was $18.99), verified in
    // the live price pipe Oct 21, 2026 (source "gee-link-capture + amazon
    // page read 2026-10-21"). Associate link:
    // https://www.amazon.com/dp/B0060OUV5Y?tag=mcmp0b-20
    name: "La Roche-Posay Cicaplast Balm B5",
    asin: "B0060OUV5Y",
    price: 13.69,
    priceLabel: "$13.69",
    savingsLabel: "was $18.99",
    referenceLabel: "Verified Oct 21, 2026",
    category: "beauty",
    keywords: ["la roche-posay", "cicaplast", "balm", "b5", "skin repair", "soothing balm", "skincare", "skin care", "beauty", "dry skin", "irritated skin"],
  },
  {
    name: "CGK Unlimited King Size 4-piece sheet set",
    price: null,
    priceLabel: null,
    savingsLabel: "price not verified",
    referenceLabel: "Held Oct 19, 2026 — no verified price",
    category: "home",
    keywords: ["sheet set", "sheets", "bedding", "king size", "cgk", "home"],
  },
  {
    name: "Toniebox 2 Audio (blue)",
    price: null,
    priceLabel: null,
    savingsLabel: "price not verified",
    referenceLabel: "Held Oct 19, 2026 — no verified price",
    category: "kids",
    keywords: ["toniebox", "audio player", "kids", "children", "stories", "toys"],
  },
  {
    name: "Amazon Echo Show",
    price: null,
    priceLabel: null,
    savingsLabel: "price not verified",
    referenceLabel: "Held Oct 19, 2026 — no verified price",
    category: "smart home",
    keywords: ["echo show", "echo", "alexa", "amazon", "smart display", "smart home"],
  },
  {
    name: "Keurig K-Express",
    price: null,
    priceLabel: null,
    savingsLabel: "price not verified",
    referenceLabel: "Held Oct 19, 2026 — no verified price",
    category: "kitchen",
    keywords: ["keurig", "k-express", "coffee", "coffee maker", "kitchen", "k-cup"],
  },
  {
    name: "Philips Sonicare",
    price: null,
    priceLabel: null,
    savingsLabel: "price not verified",
    referenceLabel: "Held Oct 19, 2026 — no verified price",
    category: "health",
    keywords: ["philips", "sonicare", "toothbrush", "electric toothbrush", "health", "dental"],
  },
  {
    name: "Toniebox 2 Audio (pink)",
    price: null,
    priceLabel: null,
    savingsLabel: "price not verified",
    referenceLabel: "Held Oct 19, 2026 — no verified price",
    category: "kids",
    keywords: ["toniebox", "audio player", "kids", "children", "stories", "toys"],
  },
  {
    name: "Amazon Echo Spot",
    price: null,
    priceLabel: null,
    savingsLabel: "price not verified",
    referenceLabel: "Held Oct 19, 2026 — no verified price",
    category: "smart home",
    keywords: ["echo spot", "echo", "alexa", "amazon", "alarm clock", "smart home"],
  },
  {
    name: "Amazon Fire TV",
    price: null,
    priceLabel: null,
    savingsLabel: "price not verified",
    referenceLabel: "Held Oct 19, 2026 — no verified price",
    category: "tech",
    keywords: ["fire tv", "television", "tv", "amazon", "streaming", "tech"],
  },
  {
    name: "Blink Outdoor 4",
    price: null,
    priceLabel: null,
    savingsLabel: "price not verified",
    referenceLabel: "Held Oct 19, 2026 — no verified price",
    category: "smart home",
    keywords: ["blink", "outdoor camera", "camera", "security", "smart home"],
  },
  {
    name: "Jackery Solar Generator",
    price: null,
    priceLabel: null,
    savingsLabel: "price not verified",
    referenceLabel: "Held Oct 19, 2026 — no verified price",
    category: "outdoors",
    keywords: ["jackery", "solar generator", "generator", "power station", "solar", "camping", "outdoors"],
  },
  {
    name: "ROVE R2-4K Dual dash cam",
    price: null,
    priceLabel: null,
    savingsLabel: "price not verified",
    referenceLabel: "Held Oct 19, 2026 — no verified price",
    category: "auto",
    keywords: ["rove", "dash cam", "dashcam", "car camera", "auto", "4k"],
  },
  {
    name: "Waterpik Aquarius",
    price: null,
    priceLabel: null,
    savingsLabel: "price not verified",
    referenceLabel: "Held Oct 19, 2026 — no verified price",
    category: "health",
    keywords: ["waterpik", "aquarius", "water flosser", "flosser", "dental", "health"],
  },
  {
    name: "Ring Outdoor Camera",
    price: null,
    priceLabel: null,
    savingsLabel: "price not verified",
    referenceLabel: "Held Oct 19, 2026 — no verified price",
    category: "smart home",
    keywords: ["ring", "outdoor camera", "camera", "security", "smart home"],
  },
  {
    name: "HEYDUDE Men's shoes",
    price: null,
    priceLabel: null,
    savingsLabel: "price not verified",
    referenceLabel: "Held Oct 19, 2026 — no verified price",
    category: "apparel",
    keywords: ["heydude", "shoes", "men's shoes", "mens", "footwear", "apparel"],
  },
  {
    name: "medicube PDRN",
    price: null,
    priceLabel: null,
    savingsLabel: "price not verified",
    referenceLabel: "Held Oct 19, 2026 — no verified price",
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
