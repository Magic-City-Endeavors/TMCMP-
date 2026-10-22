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
const TEMU_TOP5 = {
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
const DEAL_HUBS = [
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
const DEALS = [
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
const FALLBACK_BRIEFING = {
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

/**
 * worker.js — Best Finds Daily MCP server (Cloudflare Worker)
 *
 * A self-hosted Model Context Protocol (MCP) server over Streamable HTTP,
 * implementing MCP spec 2025-11-25 with plain JSON-RPC 2.0. It exposes the
 * live Best Finds Daily deals operation as tools that an Alexa+ agent (or
 * any MCP client) can call conversationally:
 *
 *   get_daily_briefing  today's spoken briefing, fetched live from the feed
 *   get_temu_top5       today's Temu Top 5 with prices and Greg's promo code
 *   get_deal_hubs       the curated hub directory
 *   search_deals        keyword / budget search over verified Amazon deals
 *
 * No external dependencies — Worker APIs + fetch only.
 *
 * Transport notes (Streamable HTTP, spec 2025-11-25):
 *   - POST carries JSON-RPC messages; single-message responses are returned
 *     as plain application/json bodies.
 *   - `initialize` issues an `Mcp-Session-Id` response header; the id is
 *     honoured on later requests, but it is never required.
 *   - Notifications (no `id`) are accepted with HTTP 202 and no body.
 *   - GET returns a small human/machine-readable info object for this
 *     endpoint instead of an SSE stream (this server never sends
 *     server-initiated messages, so it has nothing to stream).
 *   - Workers are stateless across isolates, and module memory is
 *     per-isolate, so an id issued by one isolate is unknown to the next.
 *     Session ids are therefore treated as advisory: requests are served
 *     with or without one, and an unknown id is ignored rather than
 *     rejected (the previous reject-unknown-ids behaviour 404'd the
 *     standard initialize -> notifications/initialized -> tools/list
 *     handshake whenever it crossed isolates — found live Oct 22, 2026;
 *     session tolerance is the deliberate fix).
 *   - The daily briefing is read through bindings when they exist —
 *     BRIEFING_KV (the same KV namespace the feed Worker writes) first,
 *     then the FEED_SERVICE service binding — because a plain fetch from
 *     one workers.dev Worker to another does not route. Plain fetch and
 *     then the labelled embedded snapshot remain as fallbacks.
 *   - CORS is wide open (Access-Control-Allow-Origin: *) because every
 *     datum this server serves is already public marketing copy, and
 *     browser-based MCP clients and test pages need it to call the tools.
 *   - GET /prices serves the public Amazon price map from BRIEFING_KV
 *     (key "prices:amazon", written out-of-band by
 *     scripts/update-prices.py) so hub pages can refresh the prices they
 *     display at page-open instead of relying on baked-in figures. See
 *     PRICE-PIPE.md for the whole pipe.
 *   - The same endpoint doubles as the HTTPS endpoint for the "Best Finds
 *     Daily for Alexa+" custom skill: POST bodies carrying an Alexa
 *     Skills Kit envelope (`request.type`) are answered by the ASK
 *     adapter below, reusing the same tool logic and verified data.
 */


const PROTOCOL_VERSION = "2025-11-25";
const SERVER_INFO = { name: "best-finds-daily", version: "1.0.0" };
const FEED_URL = "https://nameless-dust-a1fc.themagiccitymeltingpot.workers.dev";

// CORS — see the transport notes in the header comment.
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Mcp-Session-Id",
  "Access-Control-Expose-Headers": "Mcp-Session-Id",
};

// Session registry. Module-scope state is per-isolate on Cloudflare; ids
// are recorded so DELETE can retire them, but membership is never enforced
// — see the transport notes above for why unknown ids are served anyway.
const sessions = new Set();

// ---------------------------------------------------------------------------
// Tool catalogue
// ---------------------------------------------------------------------------

const TOOLS = [
  {
    name: "get_daily_briefing",
    title: "Get today's Best Finds Daily briefing",
    description:
      "Returns today's Best Finds Daily briefing text (the same content the " +
      "Alexa Flash Briefing reads each morning), fetched live from the feed.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "get_temu_top5",
    title: "Get today's Temu Top 5",
    description:
      "Returns today's Temu Top 5 finds with prices, sold counts, links, and " +
      "Greg's promo code for an extra 30% off.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "get_deal_hubs",
    title: "Get the Best Finds deal hub directory",
    description:
      "Returns the directory of Best Finds with Greg link hubs (Master hub, " +
      "Amazon Finds, Deals Hub, Temu Finds, Business Growth Hub, blog, " +
      "Telegram channel, newsletter) and what each one is for.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "search_deals",
    title: "Search verified Amazon deals",
    description:
      "Searches the verified Deals Hub set by keyword and/or a maximum price. " +
      "Returns matching deals with their verified price and savings.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description:
            "Keyword to match against deal names and categories, e.g. 'headphones', 'kitchen', 'under $50 gifts'. Optional.",
        },
        max_price: {
          type: "number",
          description: "Maximum price in USD; only deals at or under this price are returned. Optional.",
        },
      },
      additionalProperties: false,
    },
  },
];

// ---------------------------------------------------------------------------
// Tool implementations — each returns MCP content: [{ type: "text", text }]
// ---------------------------------------------------------------------------

function textResult(text, isError = false) {
  const result = { content: [{ type: "text", text }] };
  if (isError) result.isError = true;
  return result;
}

/** Normalise a Flash Briefing feed payload (object or JSON text) into the
 *  spoken result text. Throws when the payload holds no usable briefing. */
function briefingTextFromFeed(feed) {
  const parsed = typeof feed === "string" ? JSON.parse(feed) : feed;
  // The feed is the Alexa Flash Briefing JSON: either a bare array of
  // briefing items or an object holding one. Normalise defensively and
  // pick the most recently updated item.
  const items = Array.isArray(parsed) ? parsed : parsed.items || parsed.briefings || [parsed];
  if (!items.length) throw new Error("feed contained no briefings");
  const latest = items.reduce((a, b) =>
    String(b.updateDate || "") > String(a.updateDate || "") ? b : a
  );
  if (!latest.mainText) throw new Error("latest briefing had no mainText");

  const date = String(latest.updateDate || "").slice(0, 10);
  return `${latest.titleText || "Best Finds Daily"} — ${date}\n\n${latest.mainText}`;
}

async function toolGetDailyBriefing(args, env) {
  // Route 1 — the shared KV namespace the feed Worker writes each morning.
  // Reading KV directly is the reliable path: no Worker-to-Worker HTTP.
  try {
    if (env && env.BRIEFING_KV && typeof env.BRIEFING_KV.get === "function") {
      const stored = await env.BRIEFING_KV.get("briefing", "text");
      if (stored) return textResult(briefingTextFromFeed(stored));
    }
  } catch (err) {
    // Fall through to the next route; the snapshot still protects the call.
  }

  // Route 2 — the FEED_SERVICE service binding to the feed Worker.
  try {
    if (env && env.FEED_SERVICE && typeof env.FEED_SERVICE.fetch === "function") {
      const res = await env.FEED_SERVICE.fetch(FEED_URL, {
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(`feed responded ${res.status}`);
      return textResult(briefingTextFromFeed(await res.text()));
    }
  } catch (err) {
    // Fall through to plain fetch.
  }

  // Route 3 — plain fetch of the public feed URL. Works from outside
  // Cloudflare; from a workers.dev Worker it does not route, which is
  // exactly why routes 1–2 exist. Kept because it costs nothing to try.
  try {
    const res = await fetch(FEED_URL, {
      headers: { Accept: "application/json" },
      // The feed is refreshed every morning; a short edge cache is fine.
      cf: { cacheTtl: 300, cacheEverything: true },
    });
    if (!res.ok) throw new Error(`feed responded ${res.status}`);
    return textResult(briefingTextFromFeed(await res.text()));
  } catch (err) {
    // Never fail the conversation because the feed hiccuped: serve the
    // embedded snapshot and say plainly that it is cached.
    return textResult(
      `${FALLBACK_BRIEFING.titleText} — ${FALLBACK_BRIEFING.date} (cached copy — the live feed could not be reached just now)\n\n${FALLBACK_BRIEFING.mainText}`
    );
  }
}

/** Render a Temu Top 5 snapshot (embedded or KV) into tool text. */
function renderTemuTop5(snapshot) {
  const lines = [
    `Today's Temu Top 5 — ${snapshot.dateLabel}`,
    `Storefront: ${snapshot.storefront} (code ${snapshot.promoCode})`,
    "",
  ];
  snapshot.items.forEach((item, i) => {
    lines.push(`${i + 1}. ${item.name} — ${item.priceLabel} (${item.sold})`);
    lines.push(`   ${item.url}`);
  });
  lines.push("", snapshot.disclosure);
  return lines.join("\n");
}

/** A usable Temu snapshot: an object with a date, a dateLabel and at least
 *  one fully-labelled item. Anything else is treated as absent. */
function validTemuSnapshot(value) {
  return (
    value &&
    typeof value === "object" &&
    typeof value.date === "string" &&
    typeof value.dateLabel === "string" &&
    Array.isArray(value.items) &&
    value.items.length > 0 &&
    value.items.every(
      (item) => item && typeof item.name === "string" && typeof item.priceLabel === "string"
    )
  );
}

/** Pick the freshest Temu Top 5 snapshot available: the daily-refreshed
 *  copy in BRIEFING_KV (key "temu-top5", written by the daily Temu drop
 *  flow alongside the briefing) vs the embedded snapshot in data.js —
 *  whichever carries the later date wins, so a stale embedded snapshot can
 *  never again be served as "today's" (the Oct 21 snapshot was served on
 *  Oct 22 before this wiring). Falls back to the embedded snapshot on any
 *  KV absence or error. */
async function currentTemuTop5(env) {
  try {
    if (env && env.BRIEFING_KV && typeof env.BRIEFING_KV.get === "function") {
      const stored = await env.BRIEFING_KV.get("temu-top5", "json");
      if (validTemuSnapshot(stored) && stored.date >= TEMU_TOP5.date) return stored;
    }
  } catch (err) {
    // Fall through to the embedded snapshot.
  }
  return TEMU_TOP5;
}

async function toolGetTemuTop5(args, env) {
  return textResult(renderTemuTop5(await currentTemuTop5(env)));
}

function toolGetDealHubs() {
  const lines = ["Best Finds with Greg — hub directory", ""];
  for (const hub of DEAL_HUBS) {
    lines.push(`${hub.name} — ${hub.url} (${hub.description})`);
  }
  // The ASK DealHubsIntent speaks the Temu promo code and the other tools
  // print it; the directory carries it too so no surface drops the code.
  lines.push(
    "",
    `Temu storefront (${TEMU_TOP5.storefront}) — extra 30% off with code ${TEMU_TOP5.promoCode}`
  );
  return textResult(lines.join("\n"));
}

/** Read the live price pipe (BRIEFING_KV key "prices:amazon" — the same
 *  map GET /prices serves; see PRICE-PIPE.md). Returns {} on any absence
 *  or error: the pipe is an override source, never a dependency. */
async function loadPipeMap(env) {
  try {
    if (env && env.BRIEFING_KV && typeof env.BRIEFING_KV.get === "function") {
      const stored = await env.BRIEFING_KV.get("prices:amazon", "json");
      if (stored && typeof stored === "object" && !Array.isArray(stored)) return stored;
    }
  } catch (err) {
    // Fall through with the empty map.
  }
  return {};
}

/** Apply the pipe's verified prices over a deals array, matching by ASIN.
 *  Only `verified: true` pipe entries with a numeric price > 0 override;
 *  when the pipe carries a genuine was price above the verified price, the
 *  savings/reference labels are recomputed from it. Everything else keeps
 *  the embedded values — which are themselves pipe-synced (see data.js),
 *  so the served price is the pipe's price with or without KV access.
 *  (Embedded prices had drifted from the pipe before this wiring — Blink
 *  Mini served $69.99 against a $30.99 verified price, Oct 22, 2026.) */
function applyPipePrices(deals, pipeMap) {
  return deals.map((deal) => {
    const entry = deal.asin ? pipeMap[deal.asin] : null;
    if (!entry || entry.verified !== true) return deal;
    if (typeof entry.price !== "number" || !(entry.price > 0)) return deal;
    const next = {
      ...deal,
      price: entry.price,
      priceLabel: `$${entry.price.toFixed(2)}`,
    };
    if (typeof entry.was === "number" && entry.was > entry.price) {
      const diff = Math.round((entry.was - entry.price) * 100) / 100;
      next.savingsLabel = diff % 1 === 0 ? `$${diff} off` : `$${diff.toFixed(2)} off`;
      next.referenceLabel = `List $${entry.was.toFixed(2)}`;
    }
    return next;
  });
}

/** The deals set a request should serve: DEALS with the live pipe applied
 *  when KV is reachable, the (pipe-synced) embedded set otherwise. */
async function effectiveDeals(env) {
  const pipeMap = await loadPipeMap(env);
  return Object.keys(pipeMap).length ? applyPipePrices(DEALS, pipeMap) : DEALS;
}

/** Shared verified-deal matcher — the single source of truth for both the
 *  search_deals MCP tool and the Alexa (ASK) adapter below. Returns the
 *  matching entries from the given deals set (held entries with
 *  `price: null` never match: no verified price, never served as a deal). */
function findDeals(deals, rawQuery, maxPrice) {
  const query = typeof rawQuery === "string" ? rawQuery.trim().toLowerCase() : "";
  // Every query word must match somewhere in the deal's name, category or
  // keyword list — simple, predictable AND-matching for a small verified set.
  const words = query.split(/\s+/).filter(Boolean);
  return deals.filter((deal) => {
    // Held entries (price: null) have no verified price and are never served
    // as deals, regardless of any descriptive fields retained in the data.
    if (typeof deal.price !== "number") return false;
    if (maxPrice !== null && deal.price > maxPrice) return false;
    if (!words.length) return true;
    const haystack = [deal.name, deal.category, ...deal.keywords].join(" ").toLowerCase();
    return words.every((w) => haystack.includes(w));
  });
}

async function toolSearchDeals(args, env) {
  const query = typeof args.query === "string" ? args.query.trim().toLowerCase() : "";
  const maxPrice =
    typeof args.max_price === "number" && Number.isFinite(args.max_price)
      ? args.max_price
      : null;

  const matches = findDeals(await effectiveDeals(env), args.query, maxPrice);

  if (!matches.length) {
    const scope = [
      query && `matching "${args.query}"`,
      maxPrice !== null && `under $${maxPrice.toFixed(2)}`,
    ]
      .filter(Boolean)
      .join(" ");
    return textResult(
      `No verified deals ${scope} right now. Try a broader keyword (e.g. "kitchen", "smart home", "headphones") or a higher budget — or ask for get_deal_hubs to browse everything.`
    );
  }

  const lines = [`${matches.length} verified deal${matches.length === 1 ? "" : "s"} found:`, ""];
  for (const deal of matches) {
    lines.push(`- ${deal.name} — ${deal.priceLabel} (${deal.savingsLabel}, ${deal.referenceLabel})`);
  }
  lines.push("", "Prices as verified in the Deals Hub mapping. #ad — I may earn a commission.");
  return textResult(lines.join("\n"));
}

const TOOL_HANDLERS = {
  get_daily_briefing: toolGetDailyBriefing,
  get_temu_top5: toolGetTemuTop5,
  get_deal_hubs: toolGetDealHubs,
  search_deals: toolSearchDeals,
};

// ---------------------------------------------------------------------------
// Alexa Skills Kit (ASK) adapter
// ---------------------------------------------------------------------------
// The "Best Finds Daily for Alexa+" custom skill points its HTTPS endpoint
// at this same Worker URL. Alexa posts ASK envelopes (LaunchRequest /
// IntentRequest), not JSON-RPC — without this adapter the skill answered
// every request with "No Content" (found in the live console test,
// Oct 19, 2026). On POST, any body carrying `request.type` is handled here
// instead of by the JSON-RPC dispatcher; everything else is untouched.
// Speech quotes only the same verified data the tools serve (verified-only
// deals via findDeals, the embedded Temu Top 5 snapshot); URLs are never
// spoken — they ride in the Simple card.
// The adapter is session-aware: deal intents store a small context object
// in sessionAttributes (lastIntent + search terms), and FallbackIntent —
// where an "anything cheaper?" follow-up lands, the interaction model
// having no such intent — answers from that context (see askFallback).
// Launch and hub-directory speech append the biggest verified saving,
// computed from the data (see biggestSaving).

const ASK_REPROMPT =
  "Ask me for today's finds, today's top find, the Temu Top 5, deals under a budget, or Greg's deal hubs.";
const ASK_QUESTIONS =
  "You can ask: what are today's finds? What's today's top find? What are today's Temu finds? Or find me smart home deals under fifty dollars. You can also ask where to shop all of Greg's hubs, or what's the promo code.";

function askResponse({ text, cardTitle, cardContent, reprompt, endSession = false, sessionAttributes = {} }) {
  const response = {
    outputSpeech: { type: "PlainText", text },
    shouldEndSession: endSession,
  };
  if (cardTitle) {
    response.card = { type: "Simple", title: cardTitle, content: cardContent || text };
  }
  if (!endSession) {
    response.reprompt = {
      outputSpeech: { type: "PlainText", text: reprompt || ASK_REPROMPT },
    };
  }
  return { version: "1.0", sessionAttributes, response };
}

/** Strip URLs and collapse whitespace for speech, then trim to a speakable
 *  length at a sentence boundary where possible. */
function toSpeakable(text, max = 750) {
  const clean = String(text)
    .replace(/https?:\/\/\S+/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const stop = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("! "), cut.lastIndexOf("? "));
  return (stop > 200 ? cut.slice(0, stop + 1) : cut).trim();
}

function topFindSpeech() {
  const item = TEMU_TOP5.items[0];
  return (
    `Today's top find is the ${item.name} at ${item.priceLabel} — ${item.sold}. ` +
    `Use Greg's code ${TEMU_TOP5.promoCode} at the Temu storefront for an extra thirty percent off.`
  );
}

/** Derive a verified deal's "was" (list) price from the data's own labels:
 *  savingsLabel "was $9.99" or referenceLabel "List $799.99". A "Typ $…"
 *  reference is a typical price, not a was price, and never counts.
 *  Returns null when the entry carries no was price. */
function wasPriceOf(deal) {
  for (const label of [deal.savingsLabel, deal.referenceLabel]) {
    const match = typeof label === "string" && label.match(/^(?:was|list)\s+\$(\d+(?:\.\d{1,2})?)/i);
    if (match) return parseFloat(match[1]);
  }
  return null;
}

/** The verified deal with the largest (was − price) saving, computed from
 *  the data on every call — never hardcoded. Null when no verified deal
 *  carries a was price above its verified price. */
function biggestSaving(deals = DEALS) {
  let best = null;
  for (const deal of deals) {
    if (typeof deal.price !== "number") continue;
    const was = wasPriceOf(deal);
    if (was === null || was <= deal.price) continue;
    const saving = Math.round((was - deal.price) * 100) / 100;
    if (!best || saving > best.saving) best = { deal, was, saving };
  }
  return best;
}

function moneyLabel(value) {
  return `$${value.toFixed(2)}`;
}

/** One spoken sentence naming the biggest verified saving right now, or ""
 *  when no verified deal has a was price. Appended to the launch and hub
 *  directory responses only; speech copy follows the Gemini-first pass,
 *  grounded against the computed values. */
function biggestSavingSentence(deals = DEALS) {
  const best = biggestSaving(deals);
  if (!best) return "";
  return (
    ` The biggest saving right now is the ${best.deal.name} at ${best.deal.priceLabel}, ` +
    `down from ${moneyLabel(best.was)} — a saving of ${moneyLabel(best.saving)}.`
  );
}

/** AMAZON.FallbackIntent, session-aware. The interaction model has no
 *  "anything cheaper?" intent, so that follow-up lands on FallbackIntent —
 *  the handler answers it from the session context the earlier turns
 *  stored (see the sessionAttributes set in handleAskRequest):
 *   - after a search: re-run the same search at a lowered ceiling. The new
 *     ceiling is 60% of the previous one, rounded to the nearest dollar;
 *     for an unbounded search the implicit previous ceiling is the highest
 *     price in the previous result set, and the same 60% rule applies to
 *     it. The new ceiling is stored, so repeated follow-ups keep
 *     descending (toward a $1 floor).
 *   - after the top find: read Temu items #2–#3.
 *   - after the briefing: read the top find and offer the Temu Top 5.
 *   - after the Temu Top 5: offer the briefing / budget-search next step.
 *  With no stored context this is exactly the long-standing
 *  didn't-understand response, speech unchanged. Copy follows the
 *  Gemini-first pass; values come only from findDeals / TEMU_TOP5. */
function askFallback(attrs, deals = DEALS) {
  const lastIntent = attrs && attrs.lastIntent;

  if (lastIntent === "search" && typeof attrs.lastQuery === "string") {
    const query = attrs.lastQuery;
    const prevMax =
      typeof attrs.lastMaxPrice === "number" && Number.isFinite(attrs.lastMaxPrice)
        ? attrs.lastMaxPrice
        : null;
    const dealsHubUrl = DEAL_HUBS.find((h) => h.name === "Deals Hub")?.url || "";

    let ceiling = null;
    if (prevMax !== null) {
      ceiling = Math.round(prevMax * 0.6);
    } else {
      const prev = findDeals(deals, query, null);
      if (prev.length) ceiling = Math.round(Math.max(...prev.map((d) => d.price)) * 0.6);
    }

    if (ceiling === null) {
      // The previous search was unbounded and still empty: nothing exists
      // at any price, so there is nothing cheaper to descend to.
      return askResponse({
        text:
          `I couldn't find any verified deals matching "${query}" at any price right now, ` +
          "so there's nothing cheaper to show. Try a broader keyword — or ask me for today's Temu Top 5.",
        sessionAttributes: { lastIntent: "search", lastQuery: query, lastMaxPrice: null },
      });
    }

    const nextAttrs = { lastIntent: "search", lastQuery: query, lastMaxPrice: ceiling };
    const matches = findDeals(deals, query, ceiling);
    if (!matches.length) {
      const scope = [query && `matching "${query}"`, `under $${ceiling}`].filter(Boolean).join(" ");
      return askResponse({
        text:
          `I couldn't find any verified deals ${scope} right now. ` +
          "Try a broader keyword or a higher budget — or ask me for today's Temu Top 5.",
        cardTitle: "No verified deals found",
        cardContent: `No verified deals ${scope} in the current Deals Hub set.\nBrowse everything: ${dealsHubUrl}`,
        sessionAttributes: nextAttrs,
      });
    }
    const spoken = matches.map((deal) => `${deal.name}, ${deal.priceLabel}`).join("; ");
    const cardLines = matches.map(
      (deal) => `- ${deal.name} — ${deal.priceLabel} (${deal.savingsLabel}, ${deal.referenceLabel})`
    );
    return askResponse({
      text:
        `Going cheaper — under $${ceiling} I found ${matches.length} verified ` +
        `deal${matches.length === 1 ? "" : "s"}: ${spoken}. I've put the details on a card for you.`,
      cardTitle: "Verified deals — cheaper",
      cardContent: `${cardLines.join("\n")}\n\nDeals Hub: ${dealsHubUrl}\nPrices as verified in the Deals Hub mapping. #ad — I may earn a commission.`,
      sessionAttributes: nextAttrs,
    });
  }

  if (lastIntent === "topfind") {
    const second = TEMU_TOP5.items[1];
    const third = TEMU_TOP5.items[2];
    return askResponse({
      text:
        `Here are the next two picks on today's Temu Top 5 list: ` +
        `Number two: ${second.name}, ${second.priceLabel}. ` +
        `Number three: ${third.name}, ${third.priceLabel}. ` +
        "Ask for the Temu Top 5 to hear the whole list.",
      cardTitle: "Today's Temu Top 5 — next picks",
      cardContent:
        `2. ${second.name} — ${second.priceLabel} (${second.sold})\n${second.url}\n` +
        `3. ${third.name} — ${third.priceLabel} (${third.sold})\n${third.url}\n\nCode ${TEMU_TOP5.promoCode} for an extra 30% off. #ad — I may earn a commission.`,
      sessionAttributes: { lastIntent: "topfind" },
    });
  }

  if (lastIntent === "briefing") {
    return askResponse({
      text: `${topFindSpeech()} Or ask for the Temu Top 5 to hear today's whole list.`,
      sessionAttributes: { lastIntent: "briefing" },
    });
  }

  if (lastIntent === "temu") {
    return askResponse({
      text:
        "That's the Temu Top 5. Want more? Ask for today's briefing, " +
        "or tell me a budget and I'll search the verified deals.",
      sessionAttributes: { lastIntent: "temu" },
    });
  }

  return askResponse({ text: `Sorry, I didn't catch that. ${ASK_QUESTIONS}` });
}

const NUMBER_WORDS = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7,
  eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13,
  fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18,
  nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60,
  seventy: 70, eighty: 80, ninety: 90,
};

/** Parse a spoken number phrase ("twenty five", "one hundred", "a hundred",
 *  "fifty") into a value; returns null when any token is not a number word. */
function numberWordsToValue(tokens) {
  let current = 0;
  let seen = false;
  for (const token of tokens) {
    if (token === "a" || token === "an") {
      if (!seen) { current = 1; seen = true; }
      continue;
    }
    if (!(token in NUMBER_WORDS)) return null;
    seen = true;
    const value = NUMBER_WORDS[token];
    if (value === 100) current = (current || 1) * 100;
    else current += value;
  }
  return seen && current > 0 ? current : null;
}

/** Split a spoken search slot value into { query, maxPrice }, extracting a
 *  budget tail such as "under $50", "under 24.99 dollars" or "under
 *  twenty-five dollars" when present. Non-number tails ("under the stairs")
 *  are left in the query untouched. */
function parseSpokenSearch(rawQuery) {
  let query = String(rawQuery || "").trim();
  let maxPrice = null;

  const digitMatch = query.match(
    /\b(?:under|below|less than)\s+\$?(\d+(?:\.\d{1,2})?)\s*(?:dollars?|bucks)?\b/i
  );
  if (digitMatch) {
    maxPrice = parseFloat(digitMatch[1]);
    query = (query.slice(0, digitMatch.index) + query.slice(digitMatch.index + digitMatch[0].length)).trim();
  } else {
    const wordMatch =
      query.match(/\b(?:under|below|less than)\s+([a-z][a-z\s-]*?)\s*(?:dollars?|bucks)\b/i) ||
      query.match(/\b(?:under|below|less than)\s+([a-z][a-z\s-]*)$/i);
    if (wordMatch) {
      const tokens = wordMatch[1].toLowerCase().split(/[\s-]+/).filter(Boolean);
      const value = numberWordsToValue(tokens);
      if (value !== null) {
        maxPrice = value;
        query = (query.slice(0, wordMatch.index) + query.slice(wordMatch.index + wordMatch[0].length)).trim();
      }
    }
  }

  query = query
    .replace(/\s+/g, " ")
    .replace(/^(deals?|finds?)\s+/i, "")
    .replace(/\s+(deals?|finds?)$/i, "")
    .trim();
  return { query, maxPrice };
}

async function handleAskRequest(body, env) {
  const request = body.request || {};
  const attrs = (body.session && body.session.attributes) || {};
  // The deals set for this request: embedded data with the live verified
  // pipe applied when KV is reachable (see effectiveDeals).
  const deals = await effectiveDeals(env);

  if (request.type === "SessionEndedRequest") {
    return { version: "1.0", sessionAttributes: {}, response: {} };
  }

  if (request.type === "LaunchRequest") {
    const item = TEMU_TOP5.items[0];
    return askResponse({
      text:
        `Welcome to Best Finds Daily! ${topFindSpeech()} ` +
        "Ask me for today's finds, the Temu Top 5, deals under a budget, or where to shop all of Greg's hubs." +
        biggestSavingSentence(deals),
      cardTitle: "Today's top find",
      cardContent: `${item.name} — ${item.priceLabel} (${item.sold})\n${item.url}\n\nCode ${TEMU_TOP5.promoCode} for an extra 30% off. #ad — I may earn a commission.`,
    });
  }

  if (request.type === "IntentRequest") {
    const intentName = request.intent && request.intent.name;

    switch (intentName) {
      case "TodaysBriefingIntent": {
        const result = await toolGetDailyBriefing({}, env);
        const fullText = (result.content || []).map((c) => c.text).join("\n");
        return askResponse({
          text: toSpeakable(fullText),
          cardTitle: "Best Finds Daily — today's briefing",
          cardContent: toSpeakable(fullText, 6000),
          sessionAttributes: { lastIntent: "briefing" },
        });
      }

      case "TopFindIntent": {
        const item = TEMU_TOP5.items[0];
        return askResponse({
          text: topFindSpeech(),
          cardTitle: "Today's top find",
          cardContent: `${item.name} — ${item.priceLabel} (${item.sold})\n${item.url}\n\nCode ${TEMU_TOP5.promoCode} for an extra 30% off. #ad — I may earn a commission.`,
          sessionAttributes: { lastIntent: "topfind" },
        });
      }

      case "TemuTopFiveIntent": {
        const ordinals = ["Number one", "Number two", "Number three", "Number four", "Number five"];
        const spoken = TEMU_TOP5.items
          .map((item, i) => `${ordinals[i]}: ${item.name}, ${item.priceLabel}.`)
          .join(" ");
        const cardText = renderTemuTop5(TEMU_TOP5);
        return askResponse({
          text:
            `Today's Temu Top 5 for ${TEMU_TOP5.dateLabel}. ${spoken} ` +
            `Use Greg's code ${TEMU_TOP5.promoCode} at checkout for an extra thirty percent off.`,
          cardTitle: "Today's Temu Top 5",
          cardContent: cardText,
          sessionAttributes: { lastIntent: "temu" },
        });
      }

      case "SearchDealsIntent": {
        const slots = (request.intent && request.intent.slots) || {};
        const rawQuery = (slots.query && slots.query.value) || "";
        const { query, maxPrice } = parseSpokenSearch(rawQuery);
        const matches = findDeals(deals, query, maxPrice);
        const dealsHubUrl = DEAL_HUBS.find((h) => h.name === "Deals Hub")?.url || "";
        const searchAttrs = { lastIntent: "search", lastQuery: query, lastMaxPrice: maxPrice };
        if (!matches.length) {
          const scope = [
            query && `matching "${query}"`,
            maxPrice !== null && `under $${maxPrice}`,
          ]
            .filter(Boolean)
            .join(" ");
          return askResponse({
            text:
              `I couldn't find any verified deals ${scope} right now. ` +
              "Try a broader keyword or a higher budget — or ask me for today's Temu Top 5.",
            cardTitle: "No verified deals found",
            cardContent: `No verified deals ${scope} in the current Deals Hub set.\nBrowse everything: ${dealsHubUrl}`,
            sessionAttributes: searchAttrs,
          });
        }
        const spoken = matches
          .map((deal) => `${deal.name}, ${deal.priceLabel}`)
          .join("; ");
        const cardLines = matches.map(
          (deal) => `- ${deal.name} — ${deal.priceLabel} (${deal.savingsLabel}, ${deal.referenceLabel})`
        );
        return askResponse({
          text:
            `I found ${matches.length} verified deal${matches.length === 1 ? "" : "s"}: ${spoken}. ` +
            "I've put the details on a card for you.",
          cardTitle: "Verified deals",
          cardContent: `${cardLines.join("\n")}\n\nDeals Hub: ${dealsHubUrl}\nPrices as verified in the Deals Hub mapping. #ad — I may earn a commission.`,
          sessionAttributes: searchAttrs,
        });
      }

      case "DealHubsIntent": {
        const cardText = (toolGetDealHubs().content || []).map((c) => c.text).join("\n");
        return askResponse({
          text:
            "You can shop all of Greg's hubs from the Master hub: Amazon Finds, the Deals Hub, " +
            "Temu Finds, the Business Growth Hub, his blog, the Telegram deals channel, and the " +
            `Best Finds Daily newsletter. And the Temu promo code is ${TEMU_TOP5.promoCode}, ` +
            "for an extra thirty percent off." +
            biggestSavingSentence(deals),
          cardTitle: "Best Finds with Greg — hub directory",
          cardContent: cardText,
        });
      }

      case "HelloWorldIntent":
        return askResponse({ text: `Hello! ${topFindSpeech()}` });

      case "AMAZON.NavigateHomeIntent":
        return askResponse({ text: topFindSpeech() });

      case "AMAZON.HelpIntent":
        return askResponse({ text: ASK_QUESTIONS });

      case "AMAZON.StopIntent":
      case "AMAZON.CancelIntent":
        return askResponse({ text: "Goodbye.", endSession: true });

      case "AMAZON.FallbackIntent":
        return askFallback(attrs, deals);

      default:
        return askResponse({
          text: `Sorry, I didn't catch that. ${ASK_QUESTIONS}`,
        });
    }
  }

  // Unknown ASK request type: answer with the fallback rather than an error.
  return askResponse({ text: `Sorry, I didn't catch that. ${ASK_QUESTIONS}` });
}

// ---------------------------------------------------------------------------
// Live price pipe — GET /prices (see PRICE-PIPE.md)
// ---------------------------------------------------------------------------

/** Serve the Amazon price map stored in BRIEFING_KV under "prices:amazon".
 *  The map is { ASIN: { price, title, verified_at, source, verified, was } }
 *  and is written by scripts/update-prices.py; this Worker only reads it.
 *  An absent or unreadable map serves as {} with HTTP 200 on purpose: hub
 *  pages read "no live data" as "keep the baked-in prices", so this
 *  endpoint can never blank or zero out a page's prices. */
async function handlePrices(env) {
  let map = {};
  try {
    if (env && env.BRIEFING_KV && typeof env.BRIEFING_KV.get === "function") {
      const stored = await env.BRIEFING_KV.get("prices:amazon", "json");
      if (stored && typeof stored === "object" && !Array.isArray(stored)) map = stored;
    }
  } catch (err) {
    // Fall through with the empty map — see the note above.
  }
  return jsonResponse(map, 200, { "Cache-Control": "public, max-age=300" });
}

// ---------------------------------------------------------------------------
// JSON-RPC plumbing
// ---------------------------------------------------------------------------

function rpcResult(id, result) {
  return { jsonrpc: "2.0", id, result };
}

function rpcError(id, code, message) {
  return { jsonrpc: "2.0", id: id ?? null, error: { code, message } };
}

function jsonResponse(payload, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS, ...extraHeaders },
  });
}

/** Dispatch one JSON-RPC message. Returns { status, payload, headers } or
 *  { status: 202 } for notifications, which take no response body. */
async function handleMessage(msg, sessionId, env) {
  const isNotification = msg.id === undefined || msg.id === null;

  // Notifications: accept and stay silent (HTTP 202), known or not — a
  // notification must never produce a JSON-RPC error response.
  if (isNotification) return { status: 202 };

  if (typeof msg.method !== "string") {
    return { status: 200, payload: rpcError(msg.id, -32600, "Invalid Request: method must be a string") };
  }

  switch (msg.method) {
    case "initialize": {
      const newSessionId = crypto.randomUUID();
      sessions.add(newSessionId);
      return {
        status: 200,
        headers: { "Mcp-Session-Id": newSessionId },
        payload: rpcResult(msg.id, {
          protocolVersion: PROTOCOL_VERSION,
          capabilities: { tools: {} },
          serverInfo: SERVER_INFO,
          instructions:
            "Best Finds Daily deals tools. Call get_daily_briefing for today's briefing, get_temu_top5 for today's Temu finds, search_deals for Amazon deals by keyword or budget, get_deal_hubs for all of Greg's links.",
        }),
      };
    }

    case "ping":
      return { status: 200, payload: rpcResult(msg.id, {}) };

    case "tools/list":
      return { status: 200, payload: rpcResult(msg.id, { tools: TOOLS }) };

    case "tools/call": {
      const params = msg.params || {};
      const handler = TOOL_HANDLERS[params.name];
      if (!handler) {
        // A bad tool name is a tool-level failure, so it rides back in the
        // result with isError rather than as a protocol error.
        return {
          status: 200,
          payload: rpcResult(
            msg.id,
            textResult(`Unknown tool: ${String(params.name)}. Available tools: ${Object.keys(TOOL_HANDLERS).join(", ")}.`, true)
          ),
        };
      }
      try {
        const result = await handler(params.arguments || {}, env);
        return { status: 200, payload: rpcResult(msg.id, result) };
      } catch (err) {
        return {
          status: 200,
          payload: rpcResult(msg.id, textResult(`Tool ${params.name} failed: ${err.message}`, true)),
        };
      }
    }

    default:
      return { status: 200, payload: rpcError(msg.id, -32601, `Method not found: ${msg.method}`) };
  }
}

// ---------------------------------------------------------------------------
// Worker entry point
// ---------------------------------------------------------------------------

export default {
  async fetch(request, env) {
    // CORS preflight for browser-based clients.
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    // GET /prices: the live price map for hub pages (see PRICE-PIPE.md).
    if (request.method === "GET" && new URL(request.url).pathname.replace(/\/+$/, "") === "/prices") {
      return handlePrices(env);
    }

    // GET: endpoint info (see transport notes in the header comment).
    if (request.method === "GET") {
      return jsonResponse({
        name: SERVER_INFO.name,
        version: SERVER_INFO.version,
        protocolVersion: PROTOCOL_VERSION,
        transport: "streamable-http",
        tools: TOOLS.map((t) => t.name),
        prices: "/prices",
        description:
          "Best Finds Daily MCP server — live deals tools for Alexa+ and any MCP client. POST JSON-RPC 2.0 messages to this URL.",
      });
    }

    // DELETE: explicit session termination.
    if (request.method === "DELETE") {
      const sid = request.headers.get("Mcp-Session-Id");
      if (sid) sessions.delete(sid);
      return new Response(null, { status: 200, headers: CORS_HEADERS });
    }

    if (request.method !== "POST") {
      return jsonResponse(rpcError(null, -32600, `Unsupported method: ${request.method}`), 405);
    }

    // Session handling: ids are advisory only (see the transport notes).
    // A request is served whether it carries a known id, an unknown id,
    // or no id at all — rejecting unknown ids broke the standard MCP
    // handshake whenever consecutive requests landed on different
    // isolates (found live Oct 22, 2026).
    const sessionId = request.headers.get("Mcp-Session-Id");

    let body;
    try {
      body = await request.json();
    } catch {
      return jsonResponse(rpcError(null, -32700, "Parse error: request body is not valid JSON"), 400);
    }

    // Alexa Skills Kit (ASK) adapter: an ASK envelope (a non-array body
    // carrying `request.type`) is answered by the adapter instead of the
    // JSON-RPC dispatcher. Non-ASK bodies flow on unchanged.
    if (
      body &&
      typeof body === "object" &&
      !Array.isArray(body) &&
      body.request &&
      typeof body.request.type === "string"
    ) {
      return jsonResponse(await handleAskRequest(body, env));
    }

    // Batch requests: process each message, return the non-notification
    // responses as an array; a batch of pure notifications gets a bare 202.
    if (Array.isArray(body)) {
      const responses = [];
      let headers = {};
      for (const msg of body) {
        const out = await handleMessage(msg || {}, sessionId, env);
        if (out.payload) responses.push(out.payload);
        if (out.headers) headers = { ...headers, ...out.headers };
      }
      if (!responses.length) return new Response(null, { status: 202, headers: CORS_HEADERS });
      return jsonResponse(responses, 200, headers);
    }

    if (!body || typeof body !== "object" || body.jsonrpc !== "2.0") {
      return jsonResponse(rpcError(body?.id, -32600, "Invalid Request: expected a JSON-RPC 2.0 message"), 400);
    }

    const out = await handleMessage(body, sessionId, env);
    if (out.status === 202) return new Response(null, { status: 202, headers: CORS_HEADERS });
    return jsonResponse(out.payload, out.status, out.headers || {});
  },
};
