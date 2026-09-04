const fs = require('fs');
const path = require('path');

const PRODUCTS_FILE = path.join(__dirname, '../src/data/products.json');

const richData = {
  "CANDY": {
    "hook": "Irresistibly sweet. Impossibly elegant. CANDY by ETERNYX blends warm vanilla, rich coffee, and delicate white florals into one addictive signature. For the woman who's soft, bold, and utterly unforgettable.",
    "key_features": {
      "family": "Sweet Gourmand Floral",
      "longevity": "8–10 Hours",
      "projection": "Moderate to Strong",
      "season": "Fall, Winter, All-Year",
      "occasion": "Daily Wear, Date Night, Party, Evening",
      "gender": "Women",
      "made_in": "Crafted with Premium Imported Oils"
    },
    "fragrance_journey": {
      "opening": "A luscious burst of pear, pink pepper, and orange blossom — bright, playful, and captivating.",
      "heart": "Rich coffee melts into jasmine and bitter almond — warm, sensual, and beautifully addictive.",
      "dry_down": "Creamy vanilla, patchouli, cedarwood, and cashmere wood settle in — soft, luxurious, and unforgettable, leaving a trail that lingers for hours."
    },
    "perfect_for": ["Date Night", "Parties & Celebrations", "Daily Wear", "Office & Work", "Special Evenings", "Travel", "Gifting"],
    "faqs": [
      { "question": "How long does CANDY last?", "answer": "CANDY offers 8–10 hours of longevity, with a moderate-to-strong projection that lasts comfortably through your day and evening." },
      { "question": "Is it suitable for sensitive skin?", "answer": "Yes. CANDY is crafted with high-quality ingredients. If you have very sensitive skin, we recommend spraying onto clothing or doing a small patch test first." },
      { "question": "Is it good for daily wear?", "answer": "Absolutely. Its warm, sweet, and versatile profile makes it ideal for everyday use as well as evenings out." },
      { "question": "Is it travel-friendly?", "answer": "Yes. The securely sealed 100ml bottle is designed for safe, convenient travel." },
      { "question": "Is CANDY authentic?", "answer": "100%. Every ETERNYX bottle is genuine and crafted with premium imported oils." },
      { "question": "Is it too sweet for office wear?", "answer": "Not at all. Applied lightly (1–2 sprays), CANDY is elegant and refined — perfect for work and daytime." },
      { "question": "What season suits it best?", "answer": "Its warm gourmand character shines in fall and winter, while remaining lovely all year round." },
      { "question": "Is it suitable for gifting?", "answer": "Perfectly. Its addictive scent and elegant design make it a beautiful gift for any woman." },
      { "question": "How should I store my perfume?", "answer": "Store in a cool, dry place away from direct sunlight to preserve its fragrance quality." },
      { "question": "How much should I apply?", "answer": "2–3 sprays on the pulse points — neck, wrists, and behind the ears — deliver rich, long-lasting presence." }
    ]
  },
  "AFTER MEET": {
    "hook": "The meeting ends — but you never really leave. AFTER MEET by ETERNYX is a bold, memorable fragrance with a distinctive trail that lingers long after the moment passes. For the man whose presence is unforgettable.",
    "key_features": {
      "family": "Fresh Citrus Aromatic Woody",
      "longevity": "8–10 Hours",
      "projection": "Moderate to Strong",
      "season": "Spring, Summer, All-Year",
      "occasion": "Office, Meetings, Daily Wear, Date Night",
      "gender": "Men",
      "made_in": "Crafted with Premium Imported Oils"
    },
    "fragrance_journey": {
      "opening": "A crisp, bold burst of lemon and soft orange blossom — fresh, clean, and confidently inviting.",
      "heart": "Lavender, rosemary, and warm nutmeg take center stage — aromatic, refined, and quietly powerful.",
      "dry_down": "Tonka bean, smooth teakwood, and sweet litchi settle in — creating a distinctive, memorable trail that lingers long after you've gone."
    },
    "perfect_for": ["Office & Business Meetings", "Date Night", "Networking & Events", "Social Gatherings", "Daily Wear", "Travel", "Gifting"],
    "faqs": [
      { "question": "How long does AFTER MEET last?", "answer": "AFTER MEET offers 8–10 hours of longevity, with a moderate-to-strong projection and a distinctive trail that lasts through your day." },
      { "question": "Is it suitable for sensitive skin?", "answer": "Yes. AFTER MEET is crafted with high-quality ingredients. If you have very sensitive skin, we recommend spraying onto clothing or doing a small patch test first." },
      { "question": "Is it good for office and meetings?", "answer": "Absolutely. Its clean, bold, and aromatic profile makes it the perfect professional signature — memorable without being overpowering." },
      { "question": "Is it travel-friendly?", "answer": "Yes. The securely sealed 100ml bottle is designed for safe, convenient travel." },
      { "question": "Is AFTER MEET authentic?", "answer": "100%. Every ETERNYX bottle is genuine and crafted with premium imported oils." },
      { "question": "Can I wear it every day?", "answer": "Definitely. Its fresh and versatile character makes it ideal for daily wear, work, and social occasions." },
      { "question": "Is it suitable for evening and date nights?", "answer": "Yes — its warm tonka and teakwood base add a sensual depth perfect for evenings out." },
      { "question": "Is it suitable for gifting?", "answer": "Perfectly. Its bold character and elegant design make it an excellent gift for any man." },
      { "question": "How should I store my perfume?", "answer": "Store in a cool, dry place away from direct sunlight to preserve its fragrance quality." },
      { "question": "How much should I apply?", "answer": "2–3 sprays on the pulse points — neck, wrists, and chest — are enough for all-day presence." }
    ]
  },
  "AZURA": {
    "hook": "Freshness that feels like freedom. AZURA by ETERNYX blends juicy fruits, cool aquatic accords, and sensual musk into one vibrant signature. For the modern man who moves with confidence and effortless elegance.",
    "key_features": {
      "family": "Fresh Aquatic Fruity",
      "longevity": "8–10 Hours",
      "projection": "Moderate to Strong",
      "season": "Spring, Summer, All-Year",
      "occasion": "Daily Wear, Office, Date Night, Travel",
      "gender": "Men",
      "made_in": "Crafted with Premium Imported Oils"
    },
    "fragrance_journey": {
      "opening": "A crisp burst of apple, bergamot, lemon, and cinnamon — juicy, bright, and instantly energizing.",
      "heart": "Cool aquatic notes flow into orange blossom and plum — fresh, smooth, and effortlessly modern.",
      "dry_down": "Musk, ambergris, driftwood, and patchouli settle in — warm, sensual, and magnetic, leaving a fresh yet unforgettable trail."
    },
    "perfect_for": ["Office & Work", "Date Night", "Daily Wear", "Casual Outings", "Warm Days & Summer", "Travel", "Gifting"],
    "faqs": [
      { "question": "How long does AZURA last?", "answer": "AZURA offers 8–10 hours of longevity, with a moderate-to-strong projection that lasts comfortably through your day." },
      { "question": "Is it suitable for sensitive skin?", "answer": "Yes. AZURA is crafted with high-quality ingredients. If you have very sensitive skin, we recommend spraying onto clothing or doing a small patch test first." },
      { "question": "Is it good for daily wear?", "answer": "Absolutely. Its fresh, aquatic profile makes it ideal for everyday use, work, and casual outings." },
      { "question": "Is it travel-friendly?", "answer": "Yes. The securely sealed 100ml bottle is designed for safe, convenient travel." },
      { "question": "Is AZURA authentic?", "answer": "100%. Every ETERNYX bottle is genuine and crafted with premium imported oils." },
      { "question": "What season suits it best?", "answer": "Its fresh, aquatic character shines in spring and summer, while remaining wearable all year round." },
      { "question": "Is it suitable for evenings and date nights?", "answer": "Yes — its sensual musk and driftwood base add a magnetic depth perfect for evenings." },
      { "question": "Is it suitable for gifting?", "answer": "Perfectly. Its fresh appeal and elegant design make it an excellent gift for any man." },
      { "question": "How should I store my perfume?", "answer": "Store in a cool, dry place away from direct sunlight to preserve its fragrance quality." },
      { "question": "How much should I apply?", "answer": "2–3 sprays on the pulse points — neck, wrists, and chest — are enough for all-day freshness." }
    ]
  },
  "MEMORABLE": {
    "hook": "Some scents fade. This one becomes a memory. MEMORABLE by ETERNYX blends airy saffron, warm amber, and refined woods into a sophisticated unisex signature. For those who turn every moment into something unforgettable.",
    "key_features": {
      "family": "Amber Woody Floral",
      "longevity": "9–12 Hours",
      "projection": "Strong",
      "season": "All-Year, Fall, Winter",
      "occasion": "Office, Evening, Date Night, Special Events",
      "gender": "Unisex",
      "made_in": "Crafted with Premium Imported Oils"
    },
    "fragrance_journey": {
      "opening": "An airy elegance of saffron and jasmine — soft, luminous, and instantly captivating.",
      "heart": "Amberwood and a smooth ambergris accord unfold — warm, refined, and beautifully balanced.",
      "dry_down": "Fir resin and cedarwood settle into the skin — rich, woody, and magnetic, leaving an unforgettable trail that lingers for hours."
    },
    "perfect_for": ["Office & Work", "Date Night", "Evening Wear", "Special Events", "Weddings & Celebrations", "Travel", "Gifting (Him & Her)"],
    "faqs": [
      { "question": "How long does MEMORABLE last?", "answer": "MEMORABLE offers an impressive 9–12 hours of longevity, with strong projection that lasts through your day and evening." },
      { "question": "Is it suitable for sensitive skin?", "answer": "Yes. MEMORABLE is crafted with high-quality ingredients. If you have very sensitive skin, we recommend spraying onto clothing or doing a small patch test first." },
      { "question": "Is it really unisex?", "answer": "Absolutely. Its refined balance of saffron, amber, and woods is designed to suit everyone, beautifully." },
      { "question": "Is it travel-friendly?", "answer": "Yes. The securely sealed 100ml bottle is designed for safe, convenient travel." },
      { "question": "Is MEMORABLE authentic?", "answer": "100%. Every ETERNYX bottle is genuine and crafted with premium imported oils." },
      { "question": "Is it good for daily wear?", "answer": "Definitely. Its sophisticated character works beautifully for office, evenings, and everyday elegance." },
      { "question": "What season suits it best?", "answer": "It performs beautifully all year round, with special warmth and depth in fall and winter." },
      { "question": "Is it suitable for gifting?", "answer": "Perfectly. Its unisex appeal and elegant design make it an ideal gift for him or her." },
      { "question": "How should I store my perfume?", "answer": "Store in a cool, dry place away from direct sunlight to preserve its fragrance quality." },
      { "question": "How much should I apply?", "answer": "2–3 sprays on the pulse points — neck, wrists, and behind the ears — deliver rich, long-lasting presence." }
    ]
  },
  "CHERRY BLOW": {
    "hook": "Bold. Feminine. Unapologetically luxurious. CHERRY BLOW by ETERNYX blends elegant white florals with creamy gourmand warmth into one unforgettable signature. For the confident woman who owns every room she enters.",
    "key_features": {
      "family": "Floral Gourmand",
      "longevity": "9–11 Hours",
      "projection": "Moderate to Strong",
      "season": "Fall, Winter, All-Year",
      "occasion": "Date Night, Party, Evening, Special Events",
      "gender": "Women",
      "made_in": "Crafted with Premium Imported Oils"
    },
    "fragrance_journey": {
      "opening": "A rich, inviting blend of almond, coffee, bergamot, and lemon — warm yet bright, indulgent yet fresh.",
      "heart": "Jasmine sambac, tuberose, and orange blossom bloom — sensual, elegant, and undeniably feminine.",
      "dry_down": "Tonka bean, cocoa, vanilla, and sandalwood settle in — creamy, addictive, and luxurious, leaving an unforgettable trail that lingers for hours."
    },
    "perfect_for": ["Date Night", "Parties & Celebrations", "Special Events", "Weddings", "Daily Glamour", "Travel", "Gifting"],
    "faqs": [
      { "question": "How long does CHERRY BLOW last?", "answer": "CHERRY BLOW offers 9–11 hours of longevity, with a moderate-to-strong projection that lasts comfortably through your day and evening." },
      { "question": "Is it suitable for sensitive skin?", "answer": "Yes. CHERRY BLOW is crafted with high-quality ingredients. If you have very sensitive skin, we recommend spraying onto clothing or doing a small patch test first." },
      { "question": "Is it good for daily wear?", "answer": "Absolutely. Applied lightly, its elegant floral-gourmand blend is perfect for both daytime glamour and evenings out." },
      { "question": "Is it travel-friendly?", "answer": "Yes. The securely sealed 100ml bottle is designed for safe, convenient travel." },
      { "question": "Is CHERRY BLOW authentic?", "answer": "100%. Every ETERNYX bottle is genuine and crafted with premium imported oils." },
      { "question": "Is it suitable for evenings and date nights?", "answer": "Yes — its rich, sensual base makes it a stunning choice for evenings and special occasions." },
      { "question": "What season suits it best?", "answer": "Its warm gourmand character shines in fall and winter, while remaining beautiful all year round." },
      { "question": "Is it suitable for gifting?", "answer": "Perfectly. Its luxurious scent and elegant design make it a beautiful gift for any woman." },
      { "question": "How should I store my perfume?", "answer": "Store in a cool, dry place away from direct sunlight to preserve its fragrance quality." },
      { "question": "How much should I apply?", "answer": "2–3 sprays on the pulse points — neck, wrists, and behind the ears — deliver rich, long-lasting presence." }
    ]
  },
  "SOVARE": {
    "hook": "Charisma you can wear. SOVARE by ETERNYX blends vibrant citrus, warm spice, and rich leather into one powerful signature. For the modern man who leads, dares, and never blends in.",
    "key_features": {
      "family": "Citrus Spicy Leather",
      "longevity": "8–10 Hours",
      "projection": "Moderate to Strong",
      "season": "Spring, Summer, All-Year",
      "occasion": "Daily Wear, Office, Date Night, Party",
      "gender": "Men",
      "made_in": "Crafted with Premium Imported Oils"
    },
    "fragrance_journey": {
      "opening": "A vibrant burst of blood mandarin, grapefruit, and cool mint — juicy, electric, and instantly alive.",
      "heart": "Cinnamon, rose, and warm spices unfold — rich, refined, and boldly masculine.",
      "dry_down": "Leather, amber, and smooth woods settle in — confident, sensual, and magnetic, leaving a powerful trail that lasts for hours."
    },
    "perfect_for": ["Office & Work", "Date Night", "Parties & Nightlife", "Special Events", "Daily Wear", "Travel", "Gifting"],
    "faqs": [
      { "question": "How long does SOVARE last?", "answer": "SOVARE offers 8–10 hours of longevity, with a moderate-to-strong projection that lasts comfortably through your day." },
      { "question": "Is it suitable for sensitive skin?", "answer": "Yes. SOVARE is crafted with high-quality ingredients. If you have very sensitive skin, we recommend spraying onto clothing or doing a small patch test first." },
      { "question": "Is it good for daily wear?", "answer": "Absolutely. Its vibrant, versatile profile makes it ideal for everyday use, work, and social outings." },
      { "question": "Is it travel-friendly?", "answer": "Yes. The securely sealed 100ml bottle is designed for safe, convenient travel." },
      { "question": "Is SOVARE authentic?", "answer": "100%. Every ETERNYX bottle is genuine and crafted with premium imported oils." },
      { "question": "Is it suitable for evenings and date nights?", "answer": "Yes — its bold leather and spice base make it a magnetic choice for evenings out." },
      { "question": "What season suits it best?", "answer": "Its citrus-spice-leather blend performs beautifully all year round, with vibrant freshness in warmer months." },
      { "question": "Is it suitable for gifting?", "answer": "Perfectly. Its charismatic character and elegant design make it an excellent gift for any man." },
      { "question": "How should I store my perfume?", "answer": "Store in a cool, dry place away from direct sunlight to preserve its fragrance quality." },
      { "question": "How much should I apply?", "answer": "2–3 sprays on the pulse points — neck, wrists, and chest — are enough for all-day presence." }
    ]
  },
  "DREAM DROP LET": {
    "hook": "Freedom has a scent. DREAM DROP LET by ETERNYX is a fresh, masculine fragrance that blends sparkling citrus with rich, refined woods. For the man who lives on his own terms — confident, free, timeless.",
    "key_features": {
      "family": "Fresh Citrus Woody Aromatic",
      "longevity": "8–10 Hours",
      "projection": "Moderate to Strong",
      "season": "Spring, Summer, All-Year",
      "occasion": "Daily Wear, Office, Date Night, Party",
      "gender": "Men",
      "made_in": "Crafted with Premium Imported Oils"
    },
    "fragrance_journey": {
      "opening": "A sparkling burst of bergamot and warm pepper — fresh, vibrant, and instantly invigorating.",
      "heart": "Lavender, geranium, and patchouli blend together — aromatic, smooth, and beautifully masculine.",
      "dry_down": "Ambroxan, cedarwood, and labdanum settle into the skin — rich, warm, and magnetic, leaving a timeless trail that lasts for hours."
    },
    "perfect_for": ["Office & Work", "Date Night", "Parties & Events", "Weddings & Celebrations", "Daily Wear", "Travel", "Gifting"],
    "faqs": [
      { "question": "How long does DREAM DROP LET last?", "answer": "DREAM DROP LET offers 8–10 hours of longevity, with a moderate-to-strong projection that lasts comfortably through your day." },
      { "question": "Is it suitable for sensitive skin?", "answer": "Yes. DREAM DROP LET is crafted with high-quality ingredients. If you have very sensitive skin, we recommend spraying onto clothing or doing a small patch test first." },
      { "question": "Is it good for daily wear?", "answer": "Absolutely. Its fresh, versatile profile makes it ideal for everyday use, work, and casual outings." },
      { "question": "Is it travel-friendly?", "answer": "Yes. The securely sealed 100ml bottle is designed for safe, convenient travel." },
      { "question": "Is DREAM DROP LET authentic?", "answer": "100%. Every ETERNYX bottle is genuine and crafted with premium imported oils." },
      { "question": "Can I wear it for special occasions?", "answer": "Yes — from date nights to weddings, its timeless, sophisticated character suits any event." },
      { "question": "What season suits it best?", "answer": "Its fresh citrus-woody profile performs beautifully all year round, especially in spring and summer." },
      { "question": "Is it suitable for gifting?", "answer": "Perfectly. Its versatile appeal and elegant design make it an excellent gift for any man." },
      { "question": "How should I store my perfume?", "answer": "Store in a cool, dry place away from direct sunlight to preserve its fragrance quality." },
      { "question": "How much should I apply?", "answer": "2–3 sprays on the pulse points — neck, wrists, and chest — are enough for all-day presence." }
    ]
  },
  "DARK THINKER": {
    "hook": "For the soul that thinks deeper and lives boldly. DARK THINKER by ETERNYX captures the mystery of nature — rich woods, earthy depth, and warm amber. A unisex scent as intriguing as the mind behind it.",
    "key_features": {
      "family": "Woody Earthy Amber",
      "longevity": "9–11 Hours",
      "projection": "Moderate to Strong",
      "season": "Fall, Winter, Autumn Evenings",
      "occasion": "Office, Evening, Date Night, Daily Wear",
      "gender": "Unisex",
      "made_in": "Crafted with Premium Imported Oils"
    },
    "fragrance_journey": {
      "opening": "A fresh burst of bergamot and cool green notes — crisp, natural, and grounding.",
      "heart": "Cedarwood, patchouli, and warm spices unfold — earthy, complex, and beautifully balanced.",
      "dry_down": "Amber, vetiver, and musk settle into the skin — rich, sensual, and magnetic, leaving a memorable trail that lingers for hours."
    },
    "perfect_for": ["Office & Work", "Date Night", "Evening Wear", "Special Events", "Autumn & Winter Days", "Travel", "Gifting (Him & Her)"],
    "faqs": [
      { "question": "How long does DARK THINKER last?", "answer": "DARK THINKER offers 9–11 hours of longevity, with moderate-to-strong projection that lasts comfortably through your day and evening." },
      { "question": "Is it suitable for sensitive skin?", "answer": "Yes. DARK THINKER is crafted with high-quality ingredients. If you have very sensitive skin, we recommend spraying onto clothing or doing a small patch test first." },
      { "question": "Is it really unisex?", "answer": "Absolutely. Its balanced blend of fresh, earthy, and warm notes is designed to suit everyone, beautifully." },
      { "question": "Is it travel-friendly?", "answer": "Yes. The securely sealed 100ml bottle is designed for safe, convenient travel." },
      { "question": "Is DARK THINKER authentic?", "answer": "100%. Every ETERNYX bottle is genuine and crafted with premium imported oils." },
      { "question": "What season suits it best?", "answer": "It truly shines in fall and winter, where its warm amber, vetiver, and woods come alive." },
      { "question": "Is it good for daily wear?", "answer": "Definitely. Its refined, versatile character works beautifully for work, evenings, and everyday sophistication." },
      { "question": "Is it suitable for gifting?", "answer": "Perfectly. Its unisex appeal and elegant design make it an ideal gift for him or her." },
      { "question": "How should I store my perfume?", "answer": "Store in a cool, dry place away from direct sunlight to preserve its fragrance quality." },
      { "question": "How much should I apply?", "answer": "2–3 sprays on the pulse points — neck, wrists, and behind the ears — deliver rich, long-lasting presence." }
    ]
  },
  "DARK REVENGE": {
    "hook": "Some scents whisper. DARK REVENGE demands. A bold, seductive blend of spice, sweetness, and warmth — crafted for the man who walks in and owns the room. Dangerous. Magnetic. Unforgettable.",
    "key_features": {
      "family": "Spicy Sweet Amber Woody",
      "longevity": "10–12 Hours",
      "projection": "Strong",
      "season": "Fall, Winter, Evenings",
      "occasion": "Date Night, Party, Evening, Special Events",
      "gender": "Men",
      "made_in": "Crafted with Premium Imported Oils"
    },
    "fragrance_journey": {
      "opening": "A bold, spicy hit of cardamom — intense, confident, and impossible to ignore.",
      "heart": "A rich toffee accord emerges — sweet, smooth, and dangerously seductive.",
      "dry_down": "Warm amberwood settles into the skin — deep, masculine, and magnetic, leaving a trail that lingers for hours."
    },
    "perfect_for": ["Date Night", "Parties & Nightlife", "Special Events", "Evening Wear", "Weddings & Celebrations", "Travel", "Gifting"],
    "faqs": [
      { "question": "How long does DARK REVENGE last?", "answer": "DARK REVENGE offers 10–12 hours of longevity, with strong projection that lasts through the entire evening." },
      { "question": "Is it suitable for sensitive skin?", "answer": "Yes. DARK REVENGE is crafted with high-quality ingredients. If you have very sensitive skin, we recommend spraying onto clothing or doing a small patch test first." },
      { "question": "Is it good for date nights?", "answer": "Absolutely. Its bold, sweet-spicy profile makes it the ultimate seductive evening signature." },
      { "question": "Is it travel-friendly?", "answer": "Yes. The securely sealed 100ml bottle is designed for safe, convenient travel." },
      { "question": "Is DARK REVENGE authentic?", "answer": "100%. Every ETERNYX bottle is genuine and crafted with premium imported oils." },
      { "question": "Is it too strong for daily wear?", "answer": "DARK REVENGE is a bold, intense fragrance best suited for evenings and cooler weather. For daytime, apply lightly — 1 to 2 sprays." },
      { "question": "What season suits it best?", "answer": "It shines in fall and winter, where its warm amber and toffee notes truly come alive." },
      { "question": "Is it suitable for gifting?", "answer": "Perfectly. Its bold character and elegant design make it a striking gift for any confident man." },
      { "question": "How should I store my perfume?", "answer": "Store in a cool, dry place away from direct sunlight to preserve its fragrance quality." },
      { "question": "How much should I apply?", "answer": "2–3 sprays on the pulse points — neck, wrists, and chest — deliver powerful, long-lasting presence." }
    ]
  },
  "MY STORA": {
    "hook": "Some men chase the moment. Others become it. MY STORA by ETERNYX is the scent of motion, confidence, and effortless energy — crafted for the man who never slows down. One spray, and the world notices.",
    "key_features": {
      "family": "Fresh Fruity Woody Aromatic",
      "longevity": "8–10 Hours",
      "projection": "Moderate to Strong",
      "season": "Spring, Summer, All-Year",
      "occasion": "Daily Wear, Office, Sport, Date Night",
      "gender": "Men",
      "made_in": "Crafted with Premium Imported Oils"
    },
    "fragrance_journey": {
      "opening": "A burst of juicy apple, zesty grapefruit, and bright mandarin — fresh, energetic, and instantly uplifting.",
      "heart": "Violet leaf, calming lavender, and warm cardamom take over — aromatic, smooth, and effortlessly refined.",
      "dry_down": "Cedarwood, soft musk, and golden amber settle into the skin — leaving a warm, masculine trail that lingers all day."
    },
    "perfect_for": ["Office & Work", "Date Night", "Gym & Sport", "Parties & Social Events", "Daily Wear", "Travel", "Gifting"],
    "faqs": [
      { "question": "How long does MY STORA last?", "answer": "MY STORA offers 8–10 hours of longevity, with a moderate-to-strong projection that lasts comfortably through your day." },
      { "question": "Is it suitable for sensitive skin?", "answer": "Yes. MY STORA is crafted with high-quality ingredients. However, if you have very sensitive skin, we recommend spraying onto clothing or doing a small patch test first." },
      { "question": "Is this fragrance long-lasting in hot weather?", "answer": "Absolutely. Its fresh, citrus-woody composition performs beautifully in warm and humid climates." },
      { "question": "Is it travel-friendly?", "answer": "Yes. The securely sealed 100ml bottle is designed for safe, convenient travel." },
      { "question": "Is MY STORA authentic?", "answer": "100%. Every ETERNYX bottle is genuine and crafted with premium imported oils." },
      { "question": "Is it good for daily wear?", "answer": "Definitely. Its fresh and energetic profile makes it ideal for everyday use, work, and casual outings." },
      { "question": "Can I wear it on special occasions?", "answer": "Yes — from date nights to celebrations, MY STORA adds confidence to any moment." },
      { "question": "Is it suitable for gifting?", "answer": "Perfectly. Its elegant design and universal appeal make it an excellent gift for any man." },
      { "question": "How should I store my perfume?", "answer": "Store in a cool, dry place away from direct sunlight to preserve its fragrance quality." },
      { "question": "How much should I apply?", "answer": "2–3 sprays on the pulse points — neck, wrists, and chest — are enough for all-day presence." }
    ]
  }
};

const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8'));

const enrichedProducts = products.map(p => {
  const name = p.name.toUpperCase();
  if (richData[name]) {
    return {
      ...p,
      ...richData[name]
    };
  }
  return p;
});

fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(enrichedProducts, null, 2), 'utf8');
console.log('Successfully enriched products.json!');
