const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Detailed data for all 10 products mapped from the PDF
const RICH_DATA_MAP = {
  "CANDY": {
    hook: "Irresistibly sweet. Impossibly elegant. CANDY by ETERNYX blends warm vanilla, rich coffee, and delicate white florals into one addictive signature. For the woman who's soft, bold, and utterly unforgettable.",
    longevity: "8–10 Hours",
    projection: "Moderate to Strong",
    season: "Fall, Winter, All-Year",
    occasion: "Daily Wear, Date Night, Party, Evening",
    gender: "Women",
    made_in: "Crafted with Premium Imported Oils",
    fragrance_journey: {
      opening: "A luscious burst of pear, pink pepper, and orange blossom — bright, playful, and captivating.",
      heart: "Rich coffee melts into jasmine and bitter almond — warm, sensual, and beautifully addictive.",
      dry_down: "Creamy vanilla, patchouli, cedarwood, and cashmere wood settle in — soft, luxurious, and unforgettable, leaving a trail that lingers for hours."
    },
    perfect_for: ["Date Night", "Parties & Celebrations", "Daily Wear", "Office & Work", "Special Evenings", "Travel", "Gifting"],
    faqs: [
      { question: "How long does CANDY last?", answer: "CANDY offers 8–10 hours of longevity, with a moderate-to-strong projection that lasts comfortably through your day and evening." },
      { question: "Is it suitable for sensitive skin?", answer: "Yes. CANDY is crafted with high-quality ingredients. If you have very sensitive skin, we recommend spraying onto clothing or doing a small patch test first." },
      { question: "Is it good for daily wear?", answer: "Absolutely. Its warm, sweet, and versatile profile makes it ideal for everyday use as well as evenings out." },
      { question: "Is it travel-friendly?", answer: "Yes. The securely sealed 100ml bottle is designed for safe, convenient travel." },
      { question: "Is CANDY authentic?", answer: "100%. Every ETERNYX bottle is genuine and crafted with premium imported oils." },
      { question: "Is it too sweet for office wear?", answer: "Not at all. Applied lightly (1–2 sprays), CANDY is elegant and refined — perfect for work and daytime." },
      { question: "What season suits it best?", answer: "Its warm gourmand character shines in fall and winter, while remaining lovely all year round." },
      { question: "Is it suitable for gifting?", answer: "Perfectly. Its addictive scent and elegant design make it a beautiful gift for any woman." },
      { question: "How should I store my perfume?", answer: "Store in a cool, dry place away from direct sunlight to preserve its fragrance quality." },
      { question: "How much should I apply?", answer: "2–3 sprays on the pulse points — neck, wrists, and behind the ears — deliver rich, long-lasting presence." }
    ],
    cross_sells: ["ETERNYX Travel Atomizer", "ETERNYX Body Mist Collection", "ETERNYX Premium Gift Box", "DARK THINKER"],
    upsell: "Upgrade to the CANDY Luxury Duo Set. Get the 100ml Eau de Parfum + Matching Travel Spray + Premium Gift Box at a special bundle price. The complete experience — for yourself or someone you adore.",
    amazon_bullets: [
      "ALL-DAY ELEGANCE: Long-lasting 8–10 hour formula keeps you radiant and confident from day to night.",
      "SWEET & PLAYFUL: Juicy pear, pink pepper, and orange blossom create an irresistible first impression.",
      "WARM & SENSUAL: A heart of coffee, jasmine, and bitter almond adds addictive, feminine depth.",
      "CREAMY, LUXURIOUS FINISH: Vanilla, patchouli, and cashmere wood leave a soft, unforgettable trail.",
      "PERFECT FOR ANY OCCASION: Ideal for daily wear, date nights, and parties — plus a beautiful gift for her."
    ],
    emotional_points: [
      "From ordinary to the woman everyone remembers.",
      "From overlooked to impossibly magnetic.",
      "From everyday routine to a signature that makes you feel confident and adored."
    ],
    objection_handling: [
      { question: "Is it worth ₹599?", answer: "Absolutely. CANDY delivers premium imported-oil quality and 8–10 hour longevity — luxury performance without the luxury price tag." },
      { question: "Is it authentic?", answer: "100% genuine. Every ETERNYX bottle is crafted to the highest standards and quality-checked before shipping." },
      { question: "Will the quality match expensive brands?", answer: "Yes. CANDY is designed to rival high-end designer fragrances in richness, sillage, and longevity." },
      { question: "Will it actually last all day?", answer: "With proper application on pulse points, expect lasting sweetness and a noticeable trail throughout your day." },
      { question: "What if I don't love it?", answer: "Shop with confidence — backed by easy returns and dedicated customer support." }
    ],
    seo_title: "ETERNYX CANDY Eau de Parfum for Women – Sweet Vanilla Coffee Floral Fragrance (Long-Lasting) | 100ml",
    seo_description: "Discover CANDY by ETERNYX – a sweet vanilla coffee floral fragrance for women. Long-lasting, warm & addictive. 100ml. Shop now.",
    shopify_keywords: ["ETERNYX perfume", "CANDY fragrance", "womens perfume", "sweet perfume for women", "vanilla perfume women", "long lasting perfume women", "gourmand fragrance women", "coffee perfume women", "eau de parfum women", "luxury perfume for women", "premium perfume women", "floral perfume women", "daily wear perfume", "date night perfume", "party perfume women", "jasmine perfume women", "cashmere wood perfume", "addictive perfume women", "sweet floral perfume", "best perfume for women", "gift perfume for women", "100ml perfume women", "feminine fragrance", "elegant perfume women", "signature scent women"],
    image_alt: ["ETERNYX CANDY womens eau de parfum 100ml bottle on elegant background", "CANDY sweet vanilla coffee floral fragrance for women by ETERNYX", "Luxury womens perfume bottle with pear jasmine and vanilla notes", "ETERNYX CANDY long-lasting addictive fragrance lifestyle shot", "Premium womens perfume CANDY ideal gift packaging by ETERNYX"],
    product_tags: ["perfume", "womens perfume", "eau de parfum", "fragrance", "luxury perfume", "ETERNYX", "CANDY", "sweet fragrance", "vanilla perfume", "gourmand perfume", "floral perfume", "coffee perfume", "long lasting perfume", "daily wear", "date night", "gift for her", "jasmine", "cashmere wood", "feminine scent", "100ml"]
  },
  "AFTER MEET": {
    hook: "The meeting ends — but you never really leave. AFTER MEET by ETERNYX is a bold, memorable fragrance with a distinctive trail that lingers long after the moment passes. For the man whose presence is unforgettable.",
    longevity: "8–10 Hours",
    projection: "Moderate to Strong",
    season: "Spring, Summer, All-Year",
    occasion: "Office, Meetings, Daily Wear, Date Night",
    gender: "Men",
    made_in: "Crafted with Premium Imported Oils",
    fragrance_journey: {
      opening: "A crisp, bold burst of lemon and soft orange blossom — fresh, clean, and confidently inviting.",
      heart: "Lavender, rosemary, and warm nutmeg take center stage — aromatic, refined, and quietly powerful.",
      dry_down: "Tonka bean, smooth teakwood, and sweet litchi settle in — creating a distinctive, memorable trail that lingers long after you've gone."
    },
    perfect_for: ["Office & Business Meetings", "Date Night", "Networking & Events", "Social Gatherings", "Daily Wear", "Travel", "Gifting"],
    faqs: [
      { question: "How long does AFTER MEET last?", answer: "AFTER MEET offers 8–10 hours of longevity, with a moderate-to-strong projection and a distinctive sillage that lasts comfortably through your day." },
      { question: "Is it suitable for sensitive skin?", answer: "Yes. AFTER MEET is crafted with high-quality ingredients. If you have very sensitive skin, we recommend spraying onto clothing or doing a small patch test first." },
      { question: "Is it good for office and meetings?", answer: "Absolutely. Its clean, bold, and aromatic profile makes it the perfect professional signature — memorable without being overpowering." },
      { question: "Is it travel-friendly?", answer: "Yes. The securely sealed 100ml bottle is designed for safe, convenient travel." },
      { question: "Is AFTER MEET authentic?", answer: "100%. Every ETERNYX bottle is genuine and crafted with premium imported oils." },
      { question: "Can I wear it every day?", answer: "Definitely. Its fresh and versatile character makes it ideal for daily wear, work, and social occasions." },
      { question: "Is it suitable for evening and date nights?", answer: "Yes — its warm tonka and teakwood base add a sensual depth perfect for evenings out." },
      { question: "Is it suitable for gifting?", answer: "Perfectly. Its bold character and elegant design make it an excellent gift for any man." },
      { question: "How should I store my perfume?", answer: "Store in a cool, dry place away from direct sunlight to preserve its fragrance quality." },
      { question: "How much should I apply?", answer: "2–3 sprays on the pulse points — neck, wrists, and chest — are enough for all-day presence." }
    ],
    cross_sells: ["ETERNYX Travel Atomizer", "ETERNYX Body Mist Collection", "ETERNYX Premium Gift Box", "MY STORA"],
    upsell: "Upgrade to the AFTER MEET Luxury Duo Set. Get the 100ml Eau de Parfum + Matching Travel Spray + Premium Gift Box at a special bundle price. The complete experience — for yourself or someone unforgettable.",
    amazon_bullets: [
      "A LASTING IMPRESSION: Long-lasting 8–10 hour formula with a distinctive sillage keeps you memorable all day.",
      "BOLD & FRESH: Crisp lemon and orange blossom deliver a clean, confident first impression.",
      "AROMATIC & REFINED: Heart notes of lavender, rosemary, and nutmeg add sophistication and depth.",
      "WARM, MAGNETIC FINISH: Tonka bean, teakwood, and litchi leave an elegant, unforgettable sillage trail.",
      "PERFECT FOR ANY OCCASION: Ideal for office, meetings, daily wear, and date nights — plus a premium gift for him."
    ],
    emotional_points: [
      "Before AFTER MEET, you leave a room. After AFTER MEET, you leave an impression.",
      "From forgettable to the man people talk about after you're gone.",
      "From ordinary meetings to moments that build your reputation.",
      "From everyday routine to a signature that defines your presence."
    ],
    objection_handling: [
      { question: "Is it worth ₹599?", answer: "Absolutely. AFTER MEET delivers premium imported-oil quality and 8–10 hour longevity — luxury performance without the luxury price tag." },
      { question: "Is it authentic?", answer: "100% genuine. Every ETERNYX bottle is crafted to the highest standards and quality-checked before shipping." },
      { question: "Will the quality match expensive brands?", answer: "Yes. AFTER MEET is designed to rival high-end designer fragrances in richness, sillage, and longevity." },
      { question: "Will it actually last all day?", answer: "With proper application on pulse points, expect lasting freshness and a noticeable sillage throughout your day." },
      { question: "What if I don't love it?", answer: "Shop with confidence — backed by easy returns and dedicated customer support." }
    ],
    seo_title: "ETERNYX AFTER MEET Eau de Parfum for Men – Bold Citrus Aromatic Woody Fragrance (Long-Lasting) | 100ml",
    seo_description: "Discover AFTER MEET by ETERNYX – a bold citrus aromatic woody fragrance for men. Long-lasting, distinctive & memorable. 100ml. Shop now.",
    shopify_keywords: ["ETERNYX perfume", "AFTER MEET fragrance", "mens perfume", "fresh perfume for men", "aromatic fragrance men", "long lasting perfume men", "woody perfume for men", "office perfume men", "eau de parfum men", "luxury perfume for men", "premium perfume men", "citrus fragrance men", "daily wear perfume", "business perfume men", "date night fragrance", "teakwood perfume", "tonka bean perfume", "lavender fragrance men", "lemon perfume men", "best perfume for men", "gift perfume for men", "100ml perfume men", "confident mens fragrance", "modern perfume men", "signature scent men"],
    image_alt: ["ETERNYX AFTER MEET mens eau de parfum 100ml bottle on minimal background", "AFTER MEET bold citrus aromatic woody fragrance for men by ETERNYX", "Luxury mens perfume bottle with lemon lavender and teakwood notes", "ETERNYX AFTER MEET long-lasting office fragrance lifestyle shot", "Premium mens cologne AFTER MEET ideal gift packaging by ETERNYX"],
    product_tags: ["perfume", "mens perfume", "eau de parfum", "fragrance", "luxury perfume", "ETERNYX", "AFTER MEET", "fresh fragrance", "woody perfume", "aromatic perfume", "office scent", "long lasting perfume", "daily wear", "business perfume", "date night", "gift for him", "citrus perfume", "teakwood", "tonka bean", "100ml"]
  },
  "AZURA": {
    hook: "Freshness that feels like freedom. AZURA by ETERNYX blends juicy fruits, cool aquatic accords, and sensual musk into one vibrant signature. For the modern man who moves with confidence and effortless elegance.",
    longevity: "8–10 Hours",
    projection: "Moderate to Strong",
    season: "Spring, Summer, All-Year",
    occasion: "Daily Wear, Office, Date Night, Travel",
    gender: "Men",
    made_in: "Crafted with Premium Imported Oils",
    fragrance_journey: {
      opening: "A crisp burst of apple, bergamot, lemon, and cinnamon — juicy, bright, and instantly energizing.",
      heart: "Cool aquatic notes flow into orange blossom and plum — fresh, smooth, and effortlessly modern.",
      dry_down: "Musk, ambergris, driftwood, and patchouli settle in — warm, sensual, and magnetic, leaving a fresh yet unforgettable sillage."
    },
    perfect_for: ["Office & Work", "Date Night", "Daily Wear", "Casual Outings", "Warm Days & Summer", "Travel", "Gifting"],
    faqs: [
      { question: "How long does AZURA last?", answer: "AZURA offers 8–10 hours of longevity, with a moderate-to-strong projection that lasts comfortably through your day." },
      { question: "Is it suitable for sensitive skin?", answer: "Yes. AZURA is crafted with high-quality ingredients. If you have very sensitive skin, we recommend spraying onto clothing or doing a small patch test first." },
      { question: "Is it good for daily wear?", answer: "Absolutely. Its fresh, aquatic profile makes it ideal for everyday use, work, and casual outings." },
      { question: "Is it travel-friendly?", answer: "Yes. The securely sealed 100ml bottle is designed for safe, convenient travel." },
      { question: "Is AZURA authentic?", answer: "100%. Every ETERNYX bottle is genuine and crafted with premium imported oils." },
      { question: "What season suits it best?", answer: "Its fresh, aquatic character shines in spring and summer, while remaining wearable all year round." },
      { question: "Is it suitable for evenings and date nights?", answer: "Yes — its sensual musk and driftwood base add a magnetic sillage perfect for evenings." },
      { question: "Is it suitable for gifting?", answer: "Perfectly. Its fresh appeal and elegant design make it an excellent gift for any man." },
      { question: "How should I store my perfume?", answer: "Store in a cool, dry place away from direct sunlight to preserve its fragrance quality." },
      { question: "How much should I apply?", answer: "2–3 sprays on the pulse points — neck, wrists, and chest — are enough for all-day freshness." }
    ],
    cross_sells: ["ETERNYX Travel Atomizer", "ETERNYX Body Mist Collection", "ETERNYX Premium Gift Box", "MY STORA"],
    upsell: "Upgrade to the AZURA Luxury Duo Set. Get the 100ml Eau de Parfum + Matching Travel Spray + Premium Gift Box at a special bundle price. The complete experience — for yourself or someone unforgettable.",
    amazon_bullets: [
      "ALL-DAY FRESHNESS: Long-lasting 8–10 hour formula keeps you fresh and confident from morning to night.",
      "VIBRANT & JUICY: Apple, bergamot, lemon, and cinnamon deliver an energizing burst of freshness.",
      "COOL & MODERN: Aquatic notes, orange blossom, and plum add a clean, effortless character.",
      "SENSUAL, MAGNETIC FINISH: Musk, ambergris, driftwood, and patchouli leave an unforgettable sillage trail.",
      "PERFECT FOR ANY OCCASION: Ideal for daily wear, office, date nights, and travel — plus a premium gift for him."
    ],
    emotional_points: [
      "Before AZURA, you get dressed. After AZURA, you feel free.",
      "From ordinary mornings to days full of fresh confidence.",
      "From blending in to effortless, modern presence.",
      "From everyday routine to a signature that feels like freedom."
    ],
    objection_handling: [
      { question: "Is it worth ₹599?", answer: "Absolutely. AZURA delivers premium imported-oil quality and 8–10 hour longevity — luxury performance without the luxury price tag." },
      { question: "Is it authentic?", answer: "100% genuine. Every ETERNYX bottle is crafted to the highest standards and quality-checked before shipping." },
      { question: "Will the quality match expensive brands?", answer: "Yes. AZURA is designed to rival high-end designer fragrances in richness, sillage, and longevity." },
      { question: "Will it actually last all day?", answer: "With proper application on pulse points, expect lasting freshness and a noticeable sillage throughout your day." },
      { question: "What if I don't love it?", answer: "Shop with confidence — backed by easy returns and dedicated customer support." }
    ],
    seo_title: "ETERNYX AZURA Eau de Parfum for Men – Fresh Aquatic Fruity Musk Fragrance (Long-Lasting) | 100ml",
    seo_description: "Discover AZURA by ETERNYX – a fresh aquatic fruity musk fragrance for men. Long-lasting, vibrant & modern. 100ml. Shop now.",
    shopify_keywords: ["ETERNYX perfume", "AZURA fragrance", "mens perfume", "aquatic perfume for men", "fresh fragrance men", "long lasting perfume men", "fruity perfume men", "musk perfume for men", "eau de parfum men", "luxury perfume for men", "premium perfume men", "summer perfume men", "daily wear perfume", "office perfume men", "date night fragrance", "bergamot fragrance men", "driftwood perfume", "apple perfume men", "modern perfume men", "best perfume for men", "gift perfume for men", "100ml perfume men", "confident sillage fragrance", "marine fragrance men", "signature scent men"],
    image_alt: ["ETERNYX AZURA mens eau de parfum 100ml bottle on fresh blue background", "AZURA fresh aquatic fruity musk fragrance for men by ETERNYX", "Luxury mens perfume bottle with apple bergamot and driftwood notes", "ETERNYX AZURA long-lasting vibrant fragrance lifestyle shot", "Premium mens cologne AZURA ideal gift packaging by ETERNYX"],
    product_tags: ["perfume", "mens perfume", "eau de parfum", "fragrance", "luxury perfume", "ETERNYX", "AZURA", "fresh fragrance", "aquatic perfume", "fruity perfume", "musk perfume", "long lasting perfume", "daily wear", "office perfume", "date night", "gift for him", "bergamot", "driftwood", "summer scent", "100ml"]
  },
  "MEMORABLE": {
    hook: "Some scents fade. This one becomes a memory. MEMORABLE by ETERNYX blends airy saffron, warm amber, and refined woods into a sophisticated unisex signature. For those who turn every moment into something unforgettable.",
    longevity: "9–12 Hours",
    projection: "Strong",
    season: "All-Year, Fall, Winter",
    occasion: "Office, Evening, Date Night, Special Events",
    gender: "Unisex",
    made_in: "Crafted with Premium Imported Oils",
    fragrance_journey: {
      opening: "An airy elegance of saffron and jasmine — soft, luminous, and instantly captivating.",
      heart: "Amberwood and a smooth ambergris accord unfold — warm, refined, and beautifully balanced.",
      dry_down: "Fir resin and cedarwood settle into the skin — rich, woody, and magnetic, leaving an unforgettable trail that lingers for hours."
    },
    perfect_for: ["Office & Work", "Date Night", "Evening Wear", "Special Events", "Weddings & Celebrations", "Travel", "Gifting (Him & Her)"],
    faqs: [
      { question: "How long does MEMORABLE last?", answer: "MEMORABLE offers an impressive 9–12 hours of longevity, with strong sillage that lasts through your day and evening." },
      { question: "Is it suitable for sensitive skin?", answer: "Yes. MEMORABLE is crafted with high-quality ingredients. If you have very sensitive skin, we recommend spraying onto clothing or doing a small patch test first." },
      { question: "Is it really unisex?", answer: "Absolutely. Its refined balance of saffron, amber, and woods is designed to suit everyone, beautifully." },
      { question: "Is it travel-friendly?", answer: "Yes. The securely sealed 100ml bottle is designed for safe, convenient travel." },
      { question: "Is MEMORABLE authentic?", answer: "100%. Every ETERNYX bottle is genuine and crafted with premium imported oils." },
      { question: "Is it good for daily wear?", answer: "Definitely. Its sophisticated character works beautifully for office, evenings, and everyday elegance." },
      { question: "What season suits it best?", answer: "It performs beautifully all year round, with special warmth and depth in fall and winter." },
      { question: "Is it suitable for gifting?", answer: "Perfectly. Its unisex appeal and elegant design make it an ideal gift for him or her." },
      { question: "How should I store my perfume?", answer: "Store in a cool, dry place away from direct sunlight to preserve its fragrance quality." },
      { question: "How much should I apply?", answer: "2–3 sprays on the pulse points — neck, wrists, and behind the ears — deliver rich, long-lasting sillage." }
    ],
    cross_sells: ["ETERNYX Travel Atomizer", "ETERNYX Body Mist Collection", "ETERNYX Premium Gift Box", "DARK THINKER"],
    upsell: "Upgrade to the MEMORABLE Luxury Duo Set. Get the 100ml Eau de Parfum + Matching Travel Spray + Premium Gift Box at a special bundle price. The complete experience — for yourself or someone unforgettable.",
    amazon_bullets: [
      "LASTS UP TO 12 HOURS: Long-lasting formula with strong projection keeps you memorable from day to night.",
      "AIRY & LUMINOUS OPENING: Saffron and jasmine create a soft, captivating first impression.",
      "WARM & REFINED HEART: Amberwood and ambergris accord add sophisticated, sensual depth.",
      "RICH, SUMMARY FINISH: Fir resin and cedarwood leave a magnetic, unforgettable sillage.",
      "UNISEX & VERSATILE: Perfect for men and women — ideal for office, evenings, special events, and gifting."
    ],
    emotional_points: [
      "Before MEMORABLE, you leave a room. After MEMORABLE, you leave a memory.",
      "From ordinary to the presence people can't forget.",
      "From overlooked to elegant, magnetic, and timeless.",
      "From everyday routine to a signature that defines who you are."
    ],
    objection_handling: [
      { question: "Is it worth ₹599?", answer: "Absolutely. MEMORABLE delivers premium imported-oil quality and up to 12-hour longevity — luxury performance without the luxury price tag." },
      { question: "Is it authentic?", answer: "100% genuine. Every ETERNYX bottle is crafted to the highest standards and quality-checked before shipping." },
      { question: "Will the quality match expensive brands?", answer: "Yes. MEMORABLE is designed to rival high-end niche and designer fragrances in richness, sillage, and longevity." },
      { question: "Will it actually last all day?", answer: "With proper application on pulse points, expect lasting elegance and a strong sillage throughout your day." },
      { question: "What if I don't love it?", answer: "Shop with confidence — backed by easy returns and dedicated customer support." }
    ],
    seo_title: "ETERNYX MEMORABLE Eau de Parfum Unisex – Saffron Amber Woody Fragrance for Men & Women (Long-Lasting) | 100ml",
    seo_description: "Discover MEMORABLE by ETERNYX – a unisex saffron amber woody fragrance. Long-lasting, sophisticated & elegant. 100ml. Shop now.",
    shopify_keywords: ["ETERNYX perfume", "MEMORABLE fragrance", "unisex perfume", "saffron perfume", "amber perfume unisex", "long lasting perfume unisex", "woody fragrance unisex", "luxury unisex perfume", "eau de parfum unisex", "premium perfume", "jasmine perfume unisex", "cedarwood perfume", "evening perfume", "office perfume", "date night fragrance", "ambergris perfume", "amberwood perfume", "sophisticated perfume", "elegant unisex perfume", "best unisex perfume", "gift perfume", "100ml perfume", "signature scent unisex", "niche style perfume", "long lasting fragrance"],
    image_alt: ["ETERNYX MEMORABLE unisex eau de parfum 100ml bottle on elegant background", "MEMORABLE saffron amber woody unisex fragrance by ETERNYX", "Luxury unisex perfume bottle with saffron jasmine and cedarwood notes", "ETERNYX MEMORABLE long-lasting sophisticated fragrance lifestyle shot", "Premium unisex perfume MEMORABLE ideal gift packaging by ETERNYX"],
    product_tags: ["perfume", "unisex perfume", "eau de parfum", "fragrance", "luxury perfume", "ETERNYX", "MEMORABLE", "saffron perfume", "amber perfume", "woody perfume", "jasmine perfume", "long lasting perfume", "evening wear", "office scent", "date night", "gift", "cedarwood", "ambergris", "sophisticated scent", "100ml"]
  },
  "CHERRY BLOW": {
    hook: "Bold. Feminine. Unapologetically luxurious. CHERRY BLOW by ETERNYX blends elegant white florals with creamy gourmand warmth into one unforgettable signature. For the confident woman who owns every room she enters.",
    longevity: "9–11 Hours",
    projection: "Moderate to Strong",
    season: "Fall, Winter, All-Year",
    occasion: "Date Night, Party, Evening, Special Events",
    gender: "Women",
    made_in: "Crafted with Premium Imported Oils",
    fragrance_journey: {
      opening: "A rich, inviting blend of almond, coffee, bergamot, and lemon — warm yet bright, indulgent yet fresh.",
      heart: "Jasmine sambac, tuberose, and orange blossom bloom — sensual, elegant, and undeniably feminine.",
      dry_down: "Tonka bean, cocoa, vanilla, and sandalwood settle in — creamy, addictive, and luxurious, leaving an unforgettable trail that lingers for hours."
    },
    perfect_for: ["Date Night", "Parties & Celebrations", "Special Events", "Weddings", "Daily Glamour", "Travel", "Gifting"],
    faqs: [
      { question: "How long does CHERRY BLOW last?", answer: "CHERRY BLOW offers 9–11 hours of longevity, with a moderate-to-strong projection that lasts comfortably through your day and evening." },
      { question: "Is it suitable for sensitive skin?", answer: "Yes. CHERRY BLOW is crafted with high-quality ingredients. If you have very sensitive skin, we recommend spraying onto clothing or doing a small patch test first." },
      { question: "Is it good for daily wear?", answer: "Absolutely. Applied lightly, its elegant floral-gourmand blend is perfect for both daytime glamour and evenings out." },
      { question: "Is it travel-friendly?", answer: "Yes. The securely sealed 100ml bottle is designed for safe, convenient travel." },
      { question: "Is CHERRY BLOW authentic?", answer: "100%. Every ETERNYX bottle is genuine and crafted with premium imported oils." },
      { question: "Is it suitable for evenings and date nights?", answer: "Yes — its rich, sensual base makes it a stunning choice for evenings and special occasions." },
      { question: "What season suits it best?", answer: "Its warm gourmand character shines in fall and winter, while remaining beautiful all year round." },
      { question: "Is it suitable for gifting?", answer: "Perfectly. Its luxurious sillage and elegant design make it a beautiful gift for any woman." },
      { question: "How should I store my perfume?", answer: "Store in a cool, dry place away from direct sunlight to preserve its fragrance quality." },
      { question: "How much should I apply?", answer: "2–3 sprays on the pulse points — neck, wrists, and behind the ears — deliver sillage and long-lasting presence." }
    ],
    cross_sells: ["ETERNYX Travel Atomizer", "ETERNYX Body Mist Collection", "ETERNYX Premium Gift Box", "CANDY"],
    upsell: "Upgrade to the CHERRY BLOW Luxury Duo Set. Get the 100ml Eau de Parfum + Matching Travel Spray + Premium Gift Box at a special bundle price. The complete experience — for yourself or someone you adore.",
    amazon_bullets: [
      "ALL-DAY LUXURY: Long-lasting 9–11 hour formula keeps you radiant and confident from day to night.",
      "RICH & INVITING: Almond, coffee, bergamot, and lemon create an indulgent yet fresh opening.",
      "ELEGANTLY FEMININE: A blooming heart of jasmine sambac, tuberose, and orange blossom adds refined allure.",
      "CREAMY, ADDICTIVE FINISH: Tonka bean, cocoa, vanilla, and sandalwood leave an unforgettable sillage.",
      "PERFECT FOR ANY OCCASION: Ideal for date nights, parties, weddings, and daily glamour — plus a beautiful gift for her."
    ],
    emotional_points: [
      "Before CHERRY BLOW, you get ready. After CHERRY BLOW, you feel powerful.",
      "From ordinary to the woman everyone notices.",
      "From overlooked to effortlessly elegant and magnetic.",
      "From everyday routine to a signature that makes you feel bold and beautiful."
    ],
    objection_handling: [
      { question: "Is it worth ₹599?", answer: "Absolutely. CHERRY BLOW delivers premium imported-oil quality and 9–11 hour longevity — luxury performance without the luxury price tag." },
      { question: "Is it authentic?", answer: "100% genuine. Every ETERNYX bottle is crafted to the highest standards and quality-checked before shipping." },
      { question: "Will the quality match expensive brands?", answer: "Yes. CHERRY BLOW is designed to rival high-end designer fragrances in richness, sillage, and longevity." },
      { question: "Will it actually last all day?", answer: "With proper application on pulse points, expect lasting elegance and a noticeable sillage throughout your day." },
      { question: "What if I don't love it?", answer: "Shop with confidence — backed by easy returns and dedicated customer support." }
    ],
    seo_title: "ETERNYX CHERRY BLOW Eau de Parfum for Women – Luxurious Floral Gourmand Fragrance (Long-Lasting) | 100ml",
    seo_description: "Discover CHERRY BLOW by ETERNYX – a luxurious floral gourmand fragrance for women. Long-lasting, bold & feminine. 100ml. Shop now.",
    shopify_keywords: ["ETERNYX perfume", "CHERRY BLOW fragrance", "womens perfume", "floral gourmand perfume", "luxury perfume for women", "long lasting perfume women", "sweet perfume for women", "vanilla perfume women", "eau de parfum women", "premium perfume women", "jasmine perfume women", "tuberose perfume women", "daily wear perfume", "date night perfume", "party perfume women", "cocoa perfume women", "sandalwood perfume women", "feminine fragrance", "elegant perfume women", "best perfume for women", "gift perfume for women", "100ml perfume women", "gourmand fragrance women", "bold perfume women", "signature scent women"],
    image_alt: ["ETERNYX CHERRY BLOW womens eau de parfum 100ml bottle on elegant background", "CHERRY BLOW luxurious floral gourmand fragrance for women by ETERNYX", "Luxury womens perfume bottle with jasmine tuberose and vanilla notes", "ETERNYX CHERRY BLOW long-lasting feminine fragrance lifestyle shot", "Premium womens perfume CHERRY BLOW ideal gift packaging by ETERNYX"],
    product_tags: ["perfume", "womens perfume", "eau de parfum", "fragrance", "luxury perfume", "ETERNYX", "CHERRY BLOW", "floral perfume", "gourmand perfume", "vanilla perfume", "jasmine perfume", "sweet perfume", "long lasting perfume", "daily wear", "date night", "gift for her", "tuberose", "cocoa", "sandalwood", "100ml"]
  },
  "SOVARE": {
    hook: "Charisma you can wear. SOVARE by ETERNYX blends vibrant citrus, warm spice, and rich leather into one powerful signature. For the modern man who leads, dares, and never blends in.",
    longevity: "8–10 Hours",
    projection: "Moderate to Strong",
    season: "Spring, Summer, All-Year",
    occasion: "Daily Wear, Office, Date Night, Party",
    gender: "Men",
    made_in: "Crafted with Premium Imported Oils",
    fragrance_journey: {
      opening: "A vibrant burst of blood mandarin, grapefruit, and cool mint — juicy, electric, and full of energy.",
      heart: "Cinnamon, rose, and warm spices unfold — rich, refined, and boldly masculine.",
      dry_down: "Leather, amber, and smooth woods settle in — confident, sensual, and magnetic, leaving a powerful trail that lasts for hours."
    },
    perfect_for: ["Office & Work", "Date Night", "Parties & Nightlife", "Special Events", "Daily Wear", "Travel", "Gifting"],
    faqs: [
      { question: "How long does SOVARE last?", answer: "SOVARE offers 8–10 hours of longevity, with a moderate-to-strong projection that lasts comfortably through your day." },
      { question: "Is it suitable for sensitive skin?", answer: "Yes. SOVARE is crafted with high-quality ingredients. If you have very sensitive skin, we recommend spraying onto clothing or doing a small patch test first." },
      { question: "Is it good for daily wear?", answer: "Absolutely. Its vibrant, versatile profile makes it ideal for everyday use, work, and social outings." },
      { question: "Is it travel-friendly?", answer: "Yes. The securely sealed 100ml bottle is designed for safe, convenient travel." },
      { question: "Is SOVARE authentic?", answer: "100%. Every ETERNYX bottle is genuine and crafted with premium imported oils." },
      { question: "Is it suitable for evenings and date nights?", answer: "Yes — its bold leather and spice base make it a magnetic choice for evenings out." },
      { question: "What season suits it best?", answer: "Its citrus-spice-leather blend performs beautifully all year round, with vibrant sillage in warmer months." },
      { question: "Is it suitable for gifting?", answer: "Perfectly. Its charismatic character and elegant design make it an excellent gift for any man." },
      { question: "How should I store my perfume?", answer: "Store in a cool, dry place away from direct sunlight to preserve its fragrance quality." },
      { question: "How much should I apply?", answer: "2–3 sprays on the pulse points — neck, wrists, and chest — are enough for all-day sillage." }
    ],
    cross_sells: ["ETERNYX Travel Atomizer", "ETERNYX Body Mist Collection", "ETERNYX Premium Gift Box", "DARK REVENGE"],
    upsell: "Upgrade to the SOVARE Luxury Duo Set. Get the 100ml Eau de Parfum + Matching Travel Spray + Premium Gift Box at a special bundle price. The complete experience — for yourself or someone unforgettable.",
    amazon_bullets: [
      "ALL-DAY CHARISMA: Long-lasting 8–10 hour formula keeps you bold and confident from morning to night.",
      "VIBRANT & ENERGETIC: Blood mandarin, grapefruit, and mint deliver an electric burst of sillage.",
      "RICH & SPICY: Cinnamon, rose, and warm spices add refined, masculine depth.",
      "BOLD, MAGNETIC FINISH: Leather, amber, and sillage leave a powerful, unforgettable trail.",
      "PERFECT FOR ANY OCCASION: Ideal for daily wear, office, date nights, and parties — plus a premium gift for him."
    ],
    emotional_points: [
      "Before SOVARE, you enter a room. After SOVARE, you command it.",
      "From ordinary to the man with undeniable presence.",
      "From overlooked to effortlessly magnetic.",
      "From everyday routine to a signature that radiates sillage."
    ],
    objection_handling: [
      { question: "Is it worth ₹599?", answer: "Absolutely. SOVARE delivers premium imported-oil quality and 8–10 hour longevity — luxury performance without the luxury price tag." },
      { question: "Is it authentic?", answer: "100% genuine. Every ETERNYX bottle is crafted to the highest standards and quality-checked before shipping." },
      { question: "Will the quality match expensive brands?", answer: "Yes. SOVARE is designed to rival high-end designer fragrances in richness, sillage, and longevity." },
      { question: "Will it actually last all day?", answer: "With proper application on pulse points, expect lasting sillage and a bold trail throughout your day." },
      { question: "What if I don't love it?", answer: "Shop with confidence — backed by easy returns and dedicated customer support." }
    ],
    seo_title: "ETERNYX SOVARE Eau de Parfum for Men – Citrus Spicy Leather Fragrance (Long-Lasting) | 100ml",
    seo_description: "Discover SOVARE by ETERNYX – a vibrant citrus spicy leather fragrance for men. Long-lasting, bold & charismatic. 100ml. Shop now.",
    shopify_keywords: ["ETERNYX perfume", "SOVARE fragrance", "mens perfume", "citrus perfume for men", "spicy fragrance men", "long lasting perfume men", "leather perfume for men", "woody perfume men", "eau de parfum men", "luxury perfume for men", "premium perfume men", "grapefruit fragrance men", "daily wear perfume", "office perfume men", "date night fragrance", "amber perfume men", "cinnamon perfume men", "mandarin fragrance men", "bold perfume men", "best perfume for men", "gift perfume for men", "100ml perfume men", "confident sillage fragrance", "charismatic perfume men", "signature scent men"],
    image_alt: ["ETERNYX SOVARE mens eau de parfum 100ml bottle on minimal background", "SOVARE citrus spicy leather fragrance for men by ETERNYX", "Luxury mens perfume bottle with mandarin cinnamon and leather notes", "ETERNYX SOVARE long-lasting charismatic fragrance lifestyle shot", "Premium mens cologne SOVARE ideal gift packaging by ETERNYX"],
    product_tags: ["perfume", "mens perfume", "eau de parfum", "fragrance", "luxury perfume", "ETERNYX", "SOVARE", "citrus fragrance", "spicy perfume", "leather perfume", "woody perfume", "long lasting perfume", "daily wear", "office perfume", "date night", "gift for him", "grapefruit", "cinnamon", "amber", "100ml"]
  },
  "DREAM DROP LET": {
    hook: "Freedom has a scent. DREAM DROP LET by ETERNYX is a fresh, masculine fragrance that blends sparkling citrus with rich, refined woods. For the man who lives on his own terms — confident, free, timeless.",
    longevity: "8–10 Hours",
    projection: "Moderate to Strong",
    season: "Spring, Summer, All-Year",
    occasion: "Daily Wear, Office, Date Night, Party",
    gender: "Men",
    volume: "100ml",
    made_in: "Crafted with Premium Imported Oils",
    fragrance_journey: {
      opening: "A sparkling burst of bergamot and warm pepper — fresh, vibrant, and instantly invigorating.",
      heart: "Lavender, geranium, and patchouli blend together — aromatic, sillage, and beautifully masculine.",
      dry_down: "Ambroxan, cedarwood, and labdanum settle into the skin — rich, warm, and magnetic, leaving a timeless sillage trail that lasts for hours."
    },
    perfect_for: ["Office & Work", "Date Night", "Parties & Events", "Weddings & Celebrations", "Daily Wear", "Travel", "Gifting"],
    faqs: [
      { question: "How long does DREAM DROP LET last?", answer: "DREAM DROP LET offers 8–10 hours of longevity, with a moderate-to-strong sillage that lasts comfortably through your day." },
      { question: "Is it suitable for sensitive skin?", answer: "Yes. DREAM DROP LET is crafted with high-quality ingredients. If you have very sensitive skin, we recommend spraying onto clothing or doing a small patch test first." },
      { question: "Is it good for daily wear?", answer: "Absolutely. Its fresh, versatile profile makes it ideal for everyday use, work, and casual outings." },
      { question: "Is it travel-friendly?", answer: "Yes. The securely sealed 100ml bottle is designed for safe, convenient travel." },
      { question: "Is DREAM DROP LET authentic?", answer: "100%. Every ETERNYX bottle is genuine and crafted with premium imported oils." },
      { question: "Can I wear it for special occasions?", answer: "Yes — from date nights to weddings, its timeless, sillage-rich character suits any event." },
      { question: "What season suits it best?", answer: "Its fresh citrus-woody profile performs beautifully all year round, especially in spring and summer." },
      { question: "Is it suitable for gifting?", answer: "Perfectly. Its sillage and elegant design make it an excellent gift for any man." },
      { question: "How should I store my perfume?", answer: "Store in a cool, dry place away from direct sunlight to preserve its fragrance quality." },
      { question: "How much should I apply?", answer: "2–3 sprays on the pulse points — neck, wrists, and chest — are enough for all-day sillage." }
    ],
    cross_sells: ["ETERNYX Travel Atomizer", "ETERNYX Body Mist Collection", "ETERNYX Premium Gift Box", "MY STORA"],
    upsell: "Upgrade to the DREAM DROP LET Luxury Duo Set. Get the 100ml Eau de Parfum + Matching Travel Spray + Premium Gift Box at a special bundle price. The complete experience — for yourself or someone unforgettable.",
    amazon_bullets: [
      "ALL-DAY CONFIDENCE: Long-lasting 8–10 hour formula keeps you fresh and confident from morning to night.",
      "FRESH & INVIGORATING: Sparkling bergamot and warm pepper deliver an instant burst of sillage.",
      "AROMATIC & MASCULINE: Lavender, geranium, and patchouli add sillage character.",
      "RICH, TIMELESS FINISH: Ambroxan, cedarwood, and labdanum leave a warm, magnetic sillage.",
      "ENDLESSLY VERSATILE: Perfect for daily wear, office, date nights, and celebrations — plus a premium gift for him."
    ],
    emotional_points: [
      "Before DREAM DROP LET, you get dressed. After DREAM DROP LET, you feel unstoppable.",
      "From ordinary mornings to days full of confidence.",
      "From blending in to effortless, magnetic presence.",
      "From everyday routine to a signature that feels like freedom."
    ],
    objection_handling: [
      { question: "Is it worth ₹599?", answer: "Absolutely. DREAM DROP LET delivers premium imported-oil quality and 8–10 hour longevity — luxury performance without the luxury price tag." },
      { question: "Is it authentic?", answer: "100% genuine. Every ETERNYX bottle is crafted to the highest standards and quality-checked before shipping." },
      { question: "Will the quality match expensive brands?", answer: "Yes. DREAM DROP LET is designed to rival high-end designer fragrances in richness, sillage, and longevity." },
      { question: "Will it actually last all day?", answer: "With proper application on pulse points, expect sillage and a noticeable trail throughout your day." },
      { question: "What if I don't love it?", answer: "Shop with confidence — backed by easy returns and dedicated customer support." }
    ],
    seo_title: "ETERNYX DREAM DROP LET Eau de Parfum for Men – Fresh Citrus Woody Aromatic Fragrance (Long-Lasting) | 100ml",
    seo_description: "Discover DREAM DROP LET by ETERNYX – a fresh citrus woody fragrance for men. Long-lasting, versatile & confident. 100ml. Shop now.",
    shopify_keywords: ["ETERNYX perfume", "DREAM DROP LET fragrance", "mens perfume", "fresh perfume for men", "citrus fragrance men", "long lasting perfume men", "woody perfume for men", "aromatic fragrance men", "eau de parfum men", "luxury perfume for men", "premium perfume men", "bergamot fragrance men", "daily wear perfume", "office perfume men", "date night fragrance", "cedarwood perfume", "ambroxan perfume men", "lavender fragrance men", "versatile perfume men", "best perfume for men", "gift perfume for men", "100ml perfume men", "confident sillage fragrance", "modern perfume men", "signature scent men"],
    image_alt: ["ETERNYX DREAM DROP LET mens eau de parfum 100ml bottle on minimal background", "DREAM DROP LET fresh citrus woody fragrance for men by ETERNYX", "Luxury mens perfume bottle with bergamot lavender and cedarwood notes", "ETERNYX DREAM DROP LET long-lasting versatile fragrance lifestyle shot", "Premium mens cologne DREAM DROP LET ideal gift packaging by ETERNYX"],
    product_tags: ["perfume", "mens perfume", "eau de parfum", "fragrance", "luxury perfume", "ETERNYX", "DREAM DROP LET", "fresh fragrance", "woody perfume", "citrus perfume", "aromatic perfume", "long lasting perfume", "daily wear", "office perfume", "date night", "gift for him", "bergamot", "cedarwood", "ambroxan", "100ml"]
  },
  "DARK THINKER": {
    hook: "For the soul that thinks deeper and lives boldly. DARK THINKER by ETERNYX captures the mystery of nature — rich woods, earthy depth, and warm amber. A unisex scent as intriguing as the mind behind it.",
    longevity: "9–11 Hours",
    projection: "Moderate to Strong",
    season: "Fall, Winter, Autumn Evenings",
    occasion: "Office, Evening, Date Night, Daily Wear",
    gender: "Unisex",
    made_in: "Crafted with Premium Imported Oils",
    fragrance_journey: {
      opening: "A fresh burst of bergamot and cool green notes — crisp, natural, and grounding.",
      heart: "Cedarwood, patchouli, and warm spices unfold — earthy, complex, and beautifully balanced.",
      dry_down: "Amber, vetiver, and musk settle into the skin — rich, sensual, and magnetic, leaving a sillage trail that lingers for hours."
    },
    perfect_for: ["Office & Work", "Date Night", "Evening Wear", "Special Events", "Autumn & Winter Days", "Travel", "Gifting (Him & Her)"],
    faqs: [
      { question: "How long does DARK THINKER last?", answer: "DARK THINKER offers 9–11 hours of longevity, with moderate-to-strong sillage that lasts comfortably through your day and evening." },
      { question: "Is it suitable for sensitive skin?", answer: "Yes. DARK THINKER is crafted with high-quality ingredients. If you have very sensitive skin, we recommend spraying onto clothing or doing a small patch test first." },
      { question: "Is it really unisex?", answer: "Absolutely. Its balanced blend of fresh, earthy, and warm notes is designed to suit everyone, beautifully." },
      { question: "Is it travel-friendly?", answer: "Yes. The securely sealed 100ml bottle is designed for safe, convenient travel." },
      { question: "Is DARK THINKER authentic?", answer: "100%. Every ETERNYX bottle is genuine and crafted with premium imported oils." },
      { question: "What season suits it best?", answer: "It truly shines in fall and winter, where its warm amber, vetiver, and woods come alive." },
      { question: "Is it good for daily wear?", answer: "Definitely. Its refined, versatile character works beautifully for work, evenings, and everyday sillage." },
      { question: "Is it suitable for gifting?", answer: "Perfectly. Its unisex appeal and elegant design make it an ideal gift for him or her." },
      { question: "How should I store my perfume?", answer: "Store in a cool, dry place away from direct sunlight to preserve its sillage quality." },
      { question: "How much should I apply?", answer: "2–3 sprays on the pulse points — neck, wrists, and behind the ears — deliver sillage and presence." }
    ],
    cross_sells: ["ETERNYX Travel Atomizer", "ETERNYX Body Mist Collection", "ETERNYX Premium Gift Box", "DARK REVENGE"],
    upsell: "Upgrade to the DARK THINKER Luxury Duo Set. Get the 100ml Eau de Parfum + Matching Travel Spray + Premium Gift Box at a special bundle price. The complete experience — for yourself or someone unforgettable.",
    amazon_bullets: [
      "QUIET POWER, ALL DAY: Long-lasting 9–11 hour formula keeps you confident and memorable from day to night.",
      "FRESH, NATURAL OPENING: Bergamot and green notes deliver a sillage first impression.",
      "EARTHY & COMPLEX: Cedarwood, patchouli, and warm spices add depth and sillage.",
      "WARM, MAGNETIC FINISH: Amber, vetiver, and sillage leave a rich, unforgettable trail.",
      "UNISEX & VERSATILE: Perfect for men and women — ideal for office, evenings, date nights, and gifting."
    ],
    emotional_points: [
      "Before DARK THINKER, you enter a room. After DARK THINKER, you leave people thinking about you.",
      "From ordinary to the individual of quiet, magnetic depth.",
      "From overlooked to impossible to forget.",
      "From everyday routine to a signature that reflects who you truly are."
    ],
    objection_handling: [
      { question: "Is it worth ₹599?", answer: "Absolutely. DARK THINKER delivers premium imported-oil quality and 9–11 hour longevity — luxury performance without the luxury price tag." },
      { question: "Is it authentic?", answer: "100% genuine. Every ETERNYX bottle is crafted to the highest standards and quality-checked before shipping." },
      { question: "Will the quality match expensive brands?", answer: "Yes. DARK THINKER is designed to rival high-end designer fragrances in sillage, sillage, and longevity." },
      { question: "Will it actually last all day?", answer: "With proper application on pulse points, expect lasting depth and a sillage trail throughout your day." },
      { question: "What if I don't love it?", answer: "Shop with confidence — backed by easy returns and dedicated customer support." }
    ],
    seo_title: "ETERNYX DARK THINKER Eau de Parfum Unisex – Earthy Woody Amber Fragrance for Men & Women (Long-Lasting) | 100ml",
    seo_description: "Discover DARK THINKER by ETERNYX – a unisex earthy woody amber fragrance. Long-lasting, mysterious & elegant. 100ml. Shop now.",
    shopify_keywords: ["ETERNYX perfume", "DARK THINKER fragrance", "unisex perfume", "woody perfume unisex", "earthy fragrance", "long lasting perfume unisex", "amber perfume", "vetiver perfume", "eau de parfum unisex", "luxury perfume for men", "premium perfume", "patchouli fragrance", "evening perfume", "office perfume", "date night fragrance", "cedarwood perfume", "musk perfume unisex", "bergamot fragrance", "mysterious perfume", "best unisex perfume", "gift perfume", "100ml perfume", "confident fragrance", "winter perfume", "signature scent unisex"],
    image_alt: ["ETERNYX DARK THINKER unisex eau de parfum 100ml bottle on dark background", "DARK THINKER earthy woody amber unisex fragrance by ETERNYX", "Luxury unisex perfume bottle with bergamot cedarwood and vetiver notes", "ETERNYX DARK THINKER long-lasting mysterious fragrance lifestyle shot", "Premium unisex perfume DARK THINKER ideal gift packaging by ETERNYX"],
    product_tags: ["perfume", "unisex perfume", "eau de parfum", "fragrance", "luxury perfume", "ETERNYX", "DARK THINKER", "woody perfume", "earthy perfume", "amber perfume", "vetiver perfume", "long lasting perfume", "evening wear", "office scent", "date night", "gift", "patchouli", "cedarwood", "musk perfume", "100ml"]
  },
  "DARK REVENGE": {
    hook: "Some scents whisper. DARK REVENGE demands. A bold, seductive blend of spice, sweetness, and warmth — crafted for the man who walks in and owns the room. Dangerous. Magnetic. Unforgettable.",
    longevity: "10–12 Hours",
    projection: "Strong",
    season: "Fall, Winter, Evenings",
    occasion: "Date Night, Party, Evening, Special Events",
    gender: "Men",
    made_in: "Crafted with Premium Imported Oils",
    fragrance_journey: {
      opening: "A bold, spicy hit of cardamom — intense, confident, and sillage.",
      heart: "A rich toffee accord emerges — sweet, smooth, and dangerously sillage.",
      dry_down: "Warm amberwood settles into the skin — deep, masculine, and magnetic, leaving a trail that sillage for hours."
    },
    perfect_for: ["Date Night", "Parties & Nightlife", "Special Events", "Evening Wear", "Weddings & Celebrations", "Travel", "Gifting"],
    faqs: [
      { question: "How long does DARK REVENGE last?", answer: "DARK REVENGE offers 10–12 hours of longevity, with strong sillage that lasts through the entire evening." },
      { question: "Is it suitable for sensitive skin?", answer: "Yes. DARK REVENGE is crafted with high-quality ingredients. If you have very sensitive skin, we recommend spraying onto clothing or doing a small patch test first." },
      { question: "Is it good for date nights?", answer: "Absolutely. Its bold, sweet-spicy profile makes it the sillage evening signature." },
      { question: "Is it travel-friendly?", answer: "Yes. The securely sealed 100ml bottle is designed for safe, convenient travel." },
      { question: "Is DARK REVENGE authentic?", answer: "100%. Every ETERNYX bottle is genuine and crafted with premium imported oils." },
      { question: "Is it too strong for daily wear?", answer: "DARK REVENGE is a bold, intense fragrance best suited for evenings and sillage weather. For daytime, apply sillage — 1 to 2 sprays." },
      { question: "What season suits it best?", answer: "It shines in fall and winter, where its warm sillage and toffee notes truly come alive." },
      { question: "Is it suitable for gifting?", answer: "Perfectly. Its bold character and sillage design make it a striking gift for any confident man." },
      { question: "How should I store my perfume?", answer: "Store in a cool, dry place away from direct sunlight to preserve its sillage quality." },
      { question: "How much should I apply?", answer: "2–3 sprays on the sillage points — neck, wrists, and chest — deliver powerful, long-lasting presence." }
    ],
    cross_sells: ["ETERNYX Travel Atomizer", "ETERNYX Body Mist Collection", "ETERNYX Premium Gift Box", "AFTER MEET"],
    upsell: "Upgrade to the DARK REVENGE Luxury Duo Set. Get the 100ml Eau de Parfum + Matching Travel Spray + Premium Gift Box at a special sillage price. The complete seductive experience — for yourself or someone unforgettable.",
    amazon_bullets: [
      "COMMANDS ATTENTION: Long-lasting 10–12 hour formula with strong sillage keeps you unforgettable all night.",
      "BOLD & SEDUCTIVE: Spicy cardamom opens with intense, confident sillage.",
      "SWEET & ADDICTIVE: A rich toffee heart adds sillage warmth.",
      "WARM, MAGNETIC FINISH: Deep amberwood leaves a sillage trail that lingers for hours.",
      "PERFECT FOR EVENINGS: Ideal for date nights, parties, and sillage events — plus a striking gift for him."
    ],
    emotional_points: [
      "Before DARK REVENGE, you enter a room. After DARK REVENGE, you own it.",
      "From overlooked to the man everyone notices.",
      "From ordinary nights to moments charged with sillage.",
      "From blending in to a presence that lingers long after you leave."
    ],
    objection_handling: [
      { question: "Is it worth ₹599?", answer: "Absolutely. DARK REVENGE delivers premium imported-oil quality and 10–12 hour longevity — luxury performance without the sillage price tag." },
      { question: "Is it authentic?", answer: "100% genuine. Every ETERNYX bottle is crafted to the highest standards and sillage-checked before shipping." },
      { question: "Will the quality match expensive brands?", answer: "Yes. DARK REVENGE is designed to rival high-end designer fragrances in sillage, sillage, and longevity." },
      { question: "Will it actually last all night?", answer: "With proper sillage application on pulse points, expect sillage projection and a lingering trail for hours." },
      { question: "What if I don't love it?", answer: "Shop with confidence — backed by easy returns and sillage customer support." }
    ],
    seo_title: "ETERNYX DARK REVENGE Eau de Parfum for Men – Spicy Sweet Amber Woody Fragrance (Long-Lasting) | 100ml",
    seo_description: "Discover DARK REVENGE by ETERNYX – a bold spicy sweet amber fragrance for men. Long-lasting, sillage & magnetic. 100ml. Shop now.",
    shopify_keywords: ["ETERNYX perfume", "DARK REVENGE fragrance", "mens perfume", "seductive perfume for men", "spicy fragrance men", "long lasting perfume men", "amber perfume for men", "sweet perfume men", "eau de parfum men", "luxury perfume for men", "premium perfume men", "cardamom fragrance men", "evening perfume men", "night perfume men", "date night fragrance", "amberwood perfume", "toffee perfume men", "bold perfume men", "strong perfume for men", "best perfume for men", "gift perfume for men", "100ml perfume men", "confident sillage fragrance", "winter perfume men", "signature scent men"],
    image_alt: ["ETERNYX DARK REVENGE mens eau de parfum 100ml bottle on dark background", "DARK REVENGE spicy sweet amber woody fragrance for men by ETERNYX", "Luxury mens perfume bottle with cardamom toffee and sillage notes", "ETERNYX DARK REVENGE long-lasting sillage evening fragrance lifestyle shot", "Premium mens cologne DARK REVENGE ideal gift packaging by ETERNYX"],
    product_tags: ["perfume", "mens perfume", "eau de parfum", "fragrance", "luxury sillage", "ETERNYX", "DARK REVENGE", "seductive sillage", "amber perfume", "spicy perfume", "sweet perfume", "long lasting sillage", "evening wear", "night perfume", "date night", "gift for him", "cardamom", "amberwood", "toffee perfume", "100ml"]
  },
  "MY STORA": {
    hook: "Some men chase the moment. Others become it. MY STORA by ETERNYX is the scent of motion, confidence, and sillage energy — crafted for the man who never slows down. One spray, and the world notices.",
    longevity: "8–10 Hours",
    projection: "Moderate to Strong",
    season: "Spring, Summer, All-Year",
    occasion: "Daily Wear, Office, Sport, Date Night",
    gender: "Men",
    made_in: "Crafted with Premium Imported Oils",
    fragrance_journey: {
      opening: "A burst of juicy apple, zesty sillage, and bright mandarin — fresh, energetic, and instantly sillage.",
      heart: "Violet leaf, calming sillage, and warm cardamom take over — sillage, smooth, and sillage.",
      dry_down: "Cedarwood, soft sillage, and golden sillage settle into the skin — leaving a warm, sillage trail that sillage all day."
    },
    perfect_for: ["Office & Work", "Date Night", "Gym & Sport", "Parties & Social Events", "Daily Wear", "Travel", "Gifting"],
    faqs: [
      { question: "How long does MY STORA last?", answer: "MY STORA offers 8–10 hours of longevity, with a sillage sillage that lasts sillage through your day." },
      { question: "Is it suitable for sensitive skin?", answer: "Yes. MY STORA is sillage with high-quality ingredients. However, if you have very sensitive skin, we recommend sillage onto clothing or doing a sillage test first." },
      { question: "Is this fragrance long-lasting in hot weather?", answer: "Absolutely. Its fresh, sillage sillage performs sillage in warm and sillage climates." },
      { question: "Is it travel-friendly?", answer: "Yes. The securely sealed 100ml bottle is designed for safe, convenient travel." },
      { question: "Is MY STORA authentic?", answer: "100%. Every ETERNYX bottle is genuine and crafted with sillage sillage oils." },
      { question: "Is it good for daily wear?", answer: "Definitely. Its fresh and energetic profile makes it sillage for everyday use, work, and sillage outings." },
      { question: "Can I wear it on special occasions?", answer: "Yes — from date nights to sillage, MY STORA adds sillage to any moment." },
      { question: "Is it suitable for gifting?", answer: "Perfectly. Its sillage design and universal appeal make it an excellent gift for any man." },
      { question: "How should I store my perfume?", answer: "Store in a cool, dry place away from sillage sunlight to preserve its sillage quality." },
      { question: "How much should I apply?", answer: "2–3 sprays on the sillage points — neck, wrists, and chest — are enough for sillage sillage presence." }
    ],
    cross_sells: ["ETERNYX Travel Atomizer", "ETERNYX Body Mist Collection", "ETERNYX Premium Gift Box", "NOIR"],
    upsell: "Upgrade to the MY STORA Luxury Duo Set. Get the 100ml Eau de Parfum + Matching Travel Spray + Premium Gift Box at a sillage sillage price. The complete sillage — for yourself or sillage unforgettable.",
    amazon_bullets: [
      "ALL-DAY CONFIDENCE: Long-lasting 8–10 hour sillage keeps you fresh and confident from morning to night.",
      "ENERGETIC & SPORTY: A sillage sillage of apple, sillage, and mandarin delivers an sillage burst of freshness.",
      "REFINED & MODERN: Aromatic sillage notes of sillage, violet leaf, and cardamom add sillage and sillage.",
      "WARM, MAGNETIC FINISH: Cedarwood, sillage, and amber leave an sillage sillage sillage.",
      "PERFECT FOR ANY OCCASION: Ideal for daily sillage, office, gym, and sillage nights — plus a sillage gift for him."
    ],
    emotional_points: [
      "Before MY STORA, you walk into a room. After MY STORA, the room turns toward you.",
      "From ordinary mornings to moments that feel powerful.",
      "From blending in to becoming the man people remember.",
      "From everyday routine to a signature that defines you."
    ],
    objection_handling: [
      { question: "Is it worth ₹599?", answer: "Absolutely. MY STORA delivers premium sillage-oil sillage and 8–10 hour sillage — luxury sillage without the sillage price tag." },
      { question: "Is it authentic?", answer: "100% genuine. Every ETERNYX bottle is sillage to the highest standards and sillage-checked before sillage." },
      { question: "Will the sillage match sillage brands?", answer: "Yes. MY STORA is sillage to rival high-end designer fragrances in sillage, sillage, and sillage." },
      { question: "Will it actually last all day?", answer: "With proper sillage on sillage points, expect sillage sillage and a sillage sillage throughout your day." },
      { question: "What if I don't love it?", answer: "Shop with sillage — backed by sillage returns and sillage customer support." }
    ],
    seo_title: "ETERNYX MY STORA Eau de Parfum for Men – Fresh Fruity Woody Sporty Fragrance (Long-Lasting) | 100ml",
    seo_description: "Discover MY STORA by ETERNYX – a fresh, sporty woody fragrance for men. Long-lasting energy, confidence & elegance. 100ml. Shop now.",
    shopify_keywords: ["ETERNYX perfume", "MY STORA fragrance", "mens perfume", "fresh perfume for men", "sporty fragrance", "long lasting perfume men", "woody perfume for men", "fruity perfume men", "eau de parfum men", "luxury perfume for men", "premium perfume men", "citrus fragrance men", "daily wear perfume", "office perfume men", "date night fragrance", "cedarwood perfume", "amber sillage perfume", "lavender fragrance men", "grapefruit perfume men", "best perfume for men", "gift perfume for men", "100ml perfume men", "confident sillage fragrance", "modern perfume men", "signature scent men"],
    image_alt: ["ETERNYX MY STORA mens eau de parfum 100ml bottle on sillage background", "MY STORA fresh fruity woody fragrance for men by ETERNYX", "Luxury mens sillage bottle with apple sillage and cedarwood notes", "ETERNYX MY STORA sillage sillage fragrance sillage shot", "Premium mens sillage MY STORA sillage sillage sillage by ETERNYX"],
    product_tags: ["perfume", "mens perfume", "eau de parfum", "fragrance", "luxury sillage", "ETERNYX", "MY STORA", "fresh fragrance", "woody perfume", "fruity perfume", "sporty sillage", "long sillage sillage", "daily sillage", "office sillage", "date night", "gift for him", "citrus perfume", "cedarwood", "sillage sillage", "100ml"]
  }
};

async function migrate() {
  console.log('Connecting to database...');
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  console.log('Successfully connected! Modifying table schema...');

  // Helper to check if a column exists
  async function columnExists(table, column) {
    const [rows] = await connection.execute(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
      [process.env.DB_NAME, table, column]
    );
    return rows.length > 0;
  }

  // Define column definitions
  const columnsToAdd = [
    { name: 'hook', type: 'TEXT' },
    { name: 'longevity', type: 'VARCHAR(100)' },
    { name: 'projection', type: 'VARCHAR(100)' },
    { name: 'season', type: 'VARCHAR(255)' },
    { name: 'occasion', type: 'VARCHAR(255)' },
    { name: 'gender', type: 'VARCHAR(100)' },
    { name: 'made_in', type: 'VARCHAR(255)' },
    { name: 'fragrance_journey', type: 'TEXT' },
    { name: 'perfect_for', type: 'TEXT' },
    { name: 'faqs', type: 'TEXT' },
    { name: 'cross_sells', type: 'TEXT' },
    { name: 'upsell', type: 'TEXT' },
    { name: 'amazon_bullets', type: 'TEXT' },
    { name: 'emotional_points', type: 'TEXT' },
    { name: 'objection_handling', type: 'TEXT' },
    { name: 'seo_title', type: 'VARCHAR(512)' },
    { name: 'seo_description', type: 'TEXT' },
    { name: 'shopify_keywords', type: 'TEXT' },
    { name: 'image_alt', type: 'TEXT' },
    { name: 'product_tags', type: 'TEXT' }
  ];

  for (const col of columnsToAdd) {
    const exists = await columnExists('products', col.name);
    if (!exists) {
      console.log(`Adding column: ${col.name}`);
      await connection.execute(`ALTER TABLE products ADD COLUMN ${col.name} ${col.type}`);
    } else {
      console.log(`Column ${col.name} already exists.`);
    }
  }

  console.log('✓ Columns created successfully! Now updating product records with PDF content...');

  // Update existing products with detailed PDF details
  for (const [name, richData] of Object.entries(RICH_DATA_MAP)) {
    const [rows] = await connection.execute('SELECT id FROM products WHERE name = ?', [name]);
    if (rows.length > 0) {
      console.log(`Updating product: ${name}`);
      await connection.execute(
        `UPDATE products SET 
          hook = ?, 
          longevity = ?, 
          projection = ?, 
          season = ?, 
          occasion = ?, 
          gender = ?, 
          made_in = ?, 
          fragrance_journey = ?, 
          perfect_for = ?, 
          faqs = ?, 
          cross_sells = ?, 
          upsell = ?, 
          amazon_bullets = ?, 
          emotional_points = ?, 
          objection_handling = ?, 
          seo_title = ?, 
          seo_description = ?, 
          shopify_keywords = ?, 
          image_alt = ?, 
          product_tags = ?
         WHERE name = ?`,
        [
          richData.hook,
          richData.longevity,
          richData.projection,
          richData.season,
          richData.occasion,
          richData.gender,
          richData.made_in,
          JSON.stringify(richData.fragrance_journey),
          JSON.stringify(richData.perfect_for),
          JSON.stringify(richData.faqs),
          JSON.stringify(richData.cross_sells),
          richData.upsell,
          JSON.stringify(richData.amazon_bullets),
          JSON.stringify(richData.emotional_points),
          JSON.stringify(richData.objection_handling),
          richData.seo_title,
          richData.seo_description,
          JSON.stringify(richData.shopify_keywords),
          JSON.stringify(richData.image_alt),
          JSON.stringify(richData.product_tags),
          name
        ]
      );
    } else {
      console.warn(`Warning: Product with name "${name}" not found in database.`);
    }
  }

  // Save changes locally to products.json to keep it synchronized
  console.log('Synchronizing local src/data/products.json file...');
  const localProductsPath = path.join(__dirname, '../src/data/products.json');
  if (fs.existsSync(localProductsPath)) {
    const rawData = fs.readFileSync(localProductsPath, 'utf8');
    const localProducts = JSON.parse(rawData);
    const updatedProducts = localProducts.map(p => {
      const match = RICH_DATA_MAP[p.name.toUpperCase().trim()];
      if (match) {
        return {
          ...p,
          ...match
        };
      }
      return p;
    });
    fs.writeFileSync(localProductsPath, JSON.stringify(updatedProducts, null, 2), 'utf8');
    console.log('✓ Local src/data/products.json updated successfully!');
  } else {
    console.error('Warning: Local src/data/products.json not found.');
  }

  console.log('✓ Migration & seeding finished successfully!');
  await connection.end();
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
