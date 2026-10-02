export const CATEGORIES = [
  {
    id: 'serum',
    name: 'Serums',
    tagline: 'Concentrated actives',
    description:
      'High-potency serums that target specific concerns — hydration, radiance and firmness — without heaviness.',
  },
  {
    id: 'moisturiser',
    name: 'Moisturisers',
    tagline: 'Barrier-first hydration',
    description:
      'Lightweight to rich creams that support the skin barrier and keep it comfortable from morning to night.',
  },
  {
    id: 'cleanser',
    name: 'Cleansers',
    tagline: 'Gentle daily reset',
    description:
      'Low-pH formulas that remove makeup and daily impurities while respecting the skin’s natural moisture.',
  },
  {
    id: 'makeup',
    name: 'Makeup',
    tagline: 'Second-skin colour',
    description:
      'Buildable, breathable colour with skin-like finish, developed for real skin tones and long wear.',
  },
  {
    id: 'mask',
    name: 'Masks',
    tagline: 'Weekly reset ritual',
    description:
      'Overnight and weekly treatments that deliver a visible reset in as little as ten minutes.',
  },
]

export const PRODUCTS = [
  {
    id: 'vit-c-glow-serum',
    photo: '/products/vit-c-glow-serum.jpg',
    photoAlt: 'Skincare serum bottle photographed among green leaves',
    name: 'Vitamin C Glow Serum',
    tagline: '15% stabilised vitamin C',
    category: 'serum',
    price: 68,
    rating: 4.9,
    reviews: 412,
    badge: 'Bestseller',
    shade: { from: '#f6d6d1', to: '#e28f87' },
    sizes: ['30ml', '50ml'],
    shortDescription:
      'A brightening daily serum that visibly evens tone and softens the look of fine lines.',
    description:
      'Our signature brightening serum pairs 15% stabilised L-ascorbic acid with ferulic acid and vitamin E for antioxidant power that stays stable in the bottle, not just on the shelf. The weightless fluid texture sinks in fast and layers cleanly under moisturiser or makeup, making it a reliable morning step in any routine.',
    benefits: [
      'Visibly brightens dull, uneven skin tone in 4 weeks',
      'Softens the appearance of fine lines and post-acne marks',
      'Protects against daily oxidative stress from pollution and UV',
      'Layers under sunscreen and makeup without pilling',
    ],
    ingredients:
      'Aqua, Ascorbic Acid, 3-O-Ethyl Ascorbic Acid, Ferulic Acid, Tocopherol, Panthenol, Glycerin, Sodium Hyaluronate, Niacinamide.',
    howToUse:
      'Mornings, apply 3–4 drops to clean, dry skin before moisturiser. Always follow with SPF 50+. Introduce every other day for the first week if you are new to actives.',
    skinType: ['All skin types', 'Dullness', 'Uneven tone'],
    keyIngredients: [
      { name: 'L-Ascorbic Acid 15%', note: 'Brightening' },
      { name: 'Ferulic Acid', note: 'Antioxidant' },
      { name: 'Niacinamide', note: 'Barrier support' },
    ],
  },
  {
    id: 'hydra-riche-cream',
    photo: '/products/hydra-riche-cream.jpg',
    photoAlt: 'Open jar of face cream on a white background',
    name: 'Hydra Riche Cream',
    tagline: 'Ceramide recovery night cream',
    category: 'moisturiser',
    price: 74,
    rating: 4.8,
    reviews: 268,
    badge: 'New',
    shade: { from: '#e8eee4', to: '#8ba486' },
    sizes: ['50ml'],
    shortDescription:
      'A rich, cushiony night cream that rebuilds a stressed barrier while you sleep.',
    description:
      'A lipid-rich night cream built around a 3:1:1 ceramide ratio modelled on the skin’s own barrier. Encapsulated ceramides, cholesterol and fatty acids release slowly across eight hours, so skin wakes up comfortable rather than coated. The whipped texture melts on contact and suits dry, normal and combination skin.',
    benefits: [
      'Restores a compromised moisture barrier overnight',
      'Relieves tightness and flaking in cold or dry air',
      'Non-comedogenic — safe for acne-prone skin',
      'Fragrance-free and suitable for sensitive skin',
    ],
    ingredients:
      'Aqua, Glycerin, Ceramide NP, Ceramide AP, Ceramide EOP, Cholesterol, Squalane, Shea Butter, Panthenol, Beta-Glucan.',
    howToUse:
      'As the final step of your evening routine, warm a pearl-sized amount between fingertips and press gently into face and neck.',
    skinType: ['Dry', 'Normal', 'Sensitive', 'Mature'],
    keyIngredients: [
      { name: 'Ceramide Complex', note: 'Barrier repair' },
      { name: 'Squalane', note: 'Moisture retention' },
      { name: 'Beta-Glucan', note: 'Soothing' },
    ],
  },
  {
    id: 'silk-milk-cleanser',
    photo: '/products/silk-milk-cleanser.jpg',
    photoAlt: 'Facial cleanser bottle on a soft pastel background',
    name: 'Silk Milk Cleanser',
    tagline: 'Low-pH cream cleanser',
    category: 'cleanser',
    price: 32,
    rating: 4.7,
    reviews: 531,
    badge: null,
    shade: { from: '#f2edea', to: '#ad9a8f' },
    sizes: ['120ml', '200ml'],
    shortDescription:
      'A pH 5.5 cream cleanser that melts away makeup and SPF without stripping.',
    description:
      'A milky, cushiony cleanser formulated at skin’s natural pH of 5.5. It dissolves sunscreen, long-wear foundation and daily grime in one pass, then rinses clean — no residue, no tight after-feeling. Mild enough for twice-daily use and tested on sensitive, reactive skin.',
    benefits: [
      'Removes long-wear makeup and mineral SPF in a single wash',
      'Keeps skin’s natural pH and moisture intact',
      'No tight, squeaky after-feeling',
      'Fragrance-free and ophthalmologist tested',
    ],
    ingredients:
      'Aqua, Glycerin, Coco-Glucoside, Milk Protein, Oat Kernel Extract, Panthenol, Allantoin, Sodium Cocoyl Glutamate.',
    howToUse:
      'Massage a small amount onto damp skin for 30 seconds, focusing on the eye and lip area. Rinse with lukewarm water.',
    skinType: ['All skin types', 'Sensitive', 'Dry'],
    keyIngredients: [
      { name: 'Oat Kernel Extract', note: 'Calming' },
      { name: 'Milk Protein', note: 'Softening' },
      { name: 'Coco-Glucoside', note: 'Gentle surfactant' },
    ],
  },
  {
    id: 'velvet-lip-tint',
    photo: '/products/velvet-lip-tint.jpg',
    photoAlt: 'Dark red lipstick with its cap on a white textured surface',
    name: 'Velvet Lip Tint',
    tagline: 'Weightless transfer-resistant colour',
    category: 'makeup',
    price: 38,
    rating: 4.6,
    reviews: 689,
    badge: 'Bestseller',
    shade: { from: '#e4dbd5', to: '#c14e45' },
    sizes: ['Rhubarb', 'Bare Linen', 'Mulberry', 'Terracotta', 'Noir Cherry'],
    shortDescription:
      'A blurring, buildable lip colour that stays put for eight hours without drying.',
    description:
      'A soft-matte lip tint with a blurring second-skin finish. The weightless pigment sets to a flexible, non-tight finish that survives coffee, meals and long meetings. Build two or three layers for a deeper wash of colour, or blot with a tissue for a diffused finish.',
    benefits: [
      'Eight-hour transfer and fade resistance',
      'Buildable from a soft wash to full colour',
      'No tight, drying or flakey finish',
      'One universal formula tested across 42 skin tones',
    ],
    ingredients:
      'Isododecane, Hydrogenated Polyisobutene, Dimethicone, Mica, Iron Oxides, Titanium Dioxide, Tocopherol, Caprylic/Capric Triglyceride.',
    howToUse:
      'Exfoliate and moisturise lips, then swipe one coat with the angled applicator. Wait 10 seconds before adding a second layer.',
    skinType: ['All skin types'],
    keyIngredients: [
      { name: 'Jojoba Esters', note: 'Comfort' },
      { name: 'Vitamin E', note: 'Antioxidant' },
      { name: 'Pigment Blend', note: 'High colour payoff' },
    ],
  },
  {
    id: 'midnight-recovery-mask',
    photo: '/products/midnight-recovery-mask.jpg',
    photoAlt: 'Cosmetic serum bottle with water droplets and greenery',
    name: 'Midnight Recovery Mask',
    tagline: 'Overnight resurfacing mask',
    category: 'mask',
    price: 58,
    rating: 4.8,
    reviews: 197,
    badge: null,
    shade: { from: '#e3cfa5', to: '#927c70' },
    sizes: ['75ml'],
    shortDescription:
      'A resurfacing overnight mask that smooths texture and revives tired-looking skin.',
    description:
      'A leave-on overnight treatment that works while you sleep. A 5% lactic acid and bakuchiol blend gently resurfaces rough texture and refines the look of pores, while a ceramide and squalane base prevents the dryness that usually comes with exfoliation. Wake up to skin that looks smoother and feels replenished.',
    benefits: [
      'Smooths rough texture and the look of pores overnight',
      'Refines uneven skin tone without harsh peeling',
      'Hydrates while exfoliating — no tightness',
      'Suitable for beginner retinol and acid users',
    ],
    ingredients:
      'Aqua, Lactic Acid, Bakuchiol, Glycerin, Squalane, Ceramide NP, Panthenol, Allantoin, Sodium Hyaluronate, Tocopherol.',
    howToUse:
      'At night, smooth a thin layer over clean, dry skin as your last step. Rinse with water in the morning. Use 2–3 nights per week.',
    skinType: ['All skin types', 'Uneven texture', 'Dullness'],
    keyIngredients: [
      { name: 'Lactic Acid 5%', note: 'Gentle resurfacing' },
      { name: 'Bakuchiol', note: 'Retinol alternative' },
      { name: 'Squalane', note: 'Barrier support' },
    ],
  },
  {
    id: 'dewy-skin-serum',
    photo: '/products/dewy-skin-serum.jpg',
    photoAlt: 'White skincare bottle with gold detailing on a cream backdrop',
    name: 'Dewy Skin Serum',
    tagline: 'Hyaluronic hydration essence',
    category: 'serum',
    price: 54,
    rating: 4.7,
    reviews: 344,
    badge: null,
    shade: { from: '#fbeae7', to: '#d4695f' },
    sizes: ['30ml', '50ml'],
    shortDescription:
      'Five weights of hyaluronic acid for immediate, long-lasting surface hydration.',
    description:
      'A hydrating essence that floods skin with five molecular weights of hyaluronic acid, drawing water from the atmosphere into the upper layers of skin. Layer it under moisturiser for a glassy, well-lit finish, or press a soaked cotton pad over the face for a five-minute hydration reset.',
    benefits: [
      'Immediate, visible plumping and dewiness',
      'Holds moisture for up to 24 hours',
      'Perfect prep step for makeup application',
      'Alcohol-free and fragrance-free',
    ],
    ingredients:
      'Aqua, Sodium Hyaluronate, Hydrolyzed Sodium Hyaluronate, Sodium Hyaluronate Crosspolymer, Glycerin, Betaine, Panthenol, Trehalose.',
    howToUse:
      'After cleansing, press 2–3 pumps into damp skin. Follow with serum, moisturiser and SPF.',
    skinType: ['All skin types', 'Dehydration', 'Dullness'],
    keyIngredients: [
      { name: '5-Weight Hyaluronic Acid', note: 'Deep hydration' },
      { name: 'Betaine', note: 'Moisture balance' },
      { name: 'Trehalose', note: 'Osmoprotectant' },
    ],
  },
  {
    id: 'silk-veil-cushion',
    photo: '/products/silk-veil-cushion.jpg',
    photoAlt: 'Cosmetic powder compact and makeup arranged on a pale surface',
    name: 'Silk Veil Cushion',
    tagline: 'Second-skin luminous foundation',
    category: 'makeup',
    price: 62,
    rating: 4.5,
    reviews: 256,
    badge: null,
    shade: { from: '#f6f8f5', to: '#6d876a' },
    sizes: ['Ivory', 'Sand', 'Honey', 'Amber', 'Espresso'],
    shortDescription:
      'A breathable cushion foundation with buildable coverage and a natural, lit-from-within finish.',
    description:
      'A cushion foundation that behaves like skin. The water-light formula builds from sheer to medium coverage without ever looking set, and the soft-focus finish diffuses texture while a subtle light-reflective complex adds glow. SPF 30 protection sits right in the formula, so it works as makeup and skincare at once.',
    benefits: [
      'Buildable sheer-to-medium, natural coverage',
      'Soft-focus finish that blurs texture and pores',
      'SPF 30 broad-spectrum protection',
      'Refillable compact — less waste, more product',
    ],
    ingredients:
      'Aqua, Cyclopentasiloxane, Glycerin, Mica, Iron Oxides, Titanium Dioxide, Niacinamide, Sodium Hyaluronate, Zinc Oxide, Tocopherol.',
    howToUse:
      'Pat onto skin with the included puff, starting from the centre of the face and blending outward. Build where coverage is needed.',
    skinType: ['All skin types', 'Combination', 'Uneven tone'],
    keyIngredients: [
      { name: 'Niacinamide', note: 'Tone evening' },
      { name: 'Zinc Oxide', note: 'SPF 30' },
      { name: 'Soft-focus Mica', note: 'Blur effect' },
    ],
  },
  {
    id: 'purifying-clay-mask',
    photo: '/products/purifying-clay-mask.jpg',
    photoAlt: 'Woman wearing a green clay facial mask',
    name: 'Purifying Clay Mask',
    tagline: 'Weekly pore-clearing mask',
    category: 'mask',
    price: 44,
    rating: 4.6,
    reviews: 173,
    badge: null,
    shade: { from: '#e8eee4', to: '#556b53' },
    sizes: ['75ml'],
    shortDescription:
      'Kaolin and matcha clay that draws out congestion in ten minutes without drying skin.',
    description:
      'A balanced clarifying mask with kaolin clay, matcha and willow bark extract. It absorbs excess oil and loosens congestion in the pores, then rinses away without that stretched, tight feeling. Skin is left clear and matte, never over-dried.',
    benefits: [
      'Visibly minimises the look of enlarged pores',
      'Absorbs excess oil without stripping the skin',
      'Gently exfoliates with willow bark extract',
      'Leaves skin soft and matte, never tight',
    ],
    ingredients:
      'Kaolin, Bentonite, Camellia Sinensis Leaf Extract, Salix Alba Bark Extract, Glycerin, Panthenol, Allantoin, Sodium Dehydroacetate.',
    howToUse:
      'Apply a thin, even layer to clean, dry skin. Leave 10 minutes — do not let it fully crack. Rinse with lukewarm water.',
    skinType: ['Oily', 'Combination', 'Congested'],
    keyIngredients: [
      { name: 'Kaolin Clay', note: 'Oil absorption' },
      { name: 'Matcha', note: 'Antioxidant' },
      { name: 'Willow Bark', note: 'Exfoliating' },
    ],
  },
]

export const BENEFITS = [
  {
    title: 'Swiss Formulation',
    text: 'Every formula is developed in our Zürich laboratory and tested to European cosmetic standards, which are among the strictest in the world.',
  },
  {
    title: 'Cruelty-Free',
    text: 'LUMIÈRE has never tested on animals and is certified by Leaping Bunny, with full supply-chain transparency to match.',
  },
  {
    title: 'Clean Formulas',
    text: 'No parabens, sulphates, mineral oil or synthetic fragrance. Every ingredient is disclosed in full, in the order it appears.',
  },
  {
    title: 'Refillable',
    text: 'Our glass and aluminium packaging is designed to be refilled, cutting packaging waste by more than 60% per year.',
  },
]

export const PROCESS_STEPS = [
  {
    step: '01',
    title: 'Sourcing',
    text: 'We work directly with 14 small farms and laboratories across Switzerland, France and South Korea — no brokers, no middlemen, fully traceable.',
  },
  {
    step: '02',
    title: 'Formulation',
    text: 'Our formulators in Zürich build each recipe in-house, testing for efficacy, stability and skin compatibility across 12 months.',
  },
  {
    step: '03',
    title: 'Testing',
    text: 'Every product passes a 12-week clinical study on real participants, plus ophthalmological and patch testing, before it reaches you.',
  },
  {
    step: '04',
    title: 'Delivery',
    text: 'Packed in recycled, plastic-free materials and shipped carbon-neutral across Switzerland, the EU and the UK.',
  },
]

export const TESTIMONIALS = [
  {
    name: 'Sophie R.',
    location: 'Geneva, CH',
    rating: 5,
    text: 'I have tried dozens of Swiss serums and this is the first one that made a visible difference in four weeks. The texture sits beautifully under sunscreen and makeup.',
    product: 'Vitamin C Glow Serum',
  },
  {
    name: 'Ana M.',
    location: 'Barcelona, ES',
    rating: 5,
    text: 'My skin is reactive and most serums sting. The Hydra Riche Cream is the only rich moisturiser I can use without flaring. It is genuinely beautiful.',
    product: 'Hydra Riche Cream',
  },
  {
    name: 'Lena K.',
    location: 'Zürich, CH',
    rating: 5,
    text: 'The Velvet Lip Tint lasts a full workday, through lunch and coffee. I repurchased it in three shades within a month.',
    product: 'Velvet Lip Tint',
  },
  {
    name: 'Chiara B.',
    location: 'Milan, IT',
    rating: 4,
    text: 'The cushion gives a natural finish without looking flat. Refilling the compact instead of buying a new one is a small thing that clearly matters to this brand.',
    product: 'Silk Veil Cushion',
  },
  {
    name: 'Marta T.',
    location: 'Lausanne, CH',
    rating: 5,
    text: 'I use the milk cleanser morning and night and my skin is calmer than it has been in years. No tightness, no residue, just clean.',
    product: 'Silk Milk Cleanser',
  },
  {
    name: 'Jasmin P.',
    location: 'Bern, CH',
    rating: 5,
    text: 'Weekly clay mask has visibly refined my pores and, crucially, my skin does not feel tight afterwards. Difficult balance to strike.',
    product: 'Purifying Clay Mask',
  },
]

export const FAQS = [
  {
    q: 'Where are LUMIÈRE products made?',
    a: 'All products are formulated and manufactured in our Zürich facility. We formulate in-house and work with audited partners in France and South Korea for specific raw materials, which we source directly from the growers.',
  },
  {
    q: 'Is LUMIÈRE suitable for sensitive skin?',
    a: 'Yes. Our Hydra Riche Cream, Silk Milk Cleanser and Dewy Skin Serum are fragrance-free and tested on sensitive and reactive skin. If you are new to actives, we recommend introducing one product at a time.',
  },
  {
    q: 'Do you offer samples or discovery kits?',
    a: 'Yes. Every order includes two complimentary samples chosen to complement your purchase, and our Discovery Kit contains travel sizes of five of our bestsellers for CHF 39.',
  },
  {
    q: 'How do I find the right products for my skin type?',
    a: 'Use the skin-type filter on our Products page, or take the two-minute routine finder on the Home page. If you are still unsure, our team answers messages within one business day.',
  },
  {
    q: 'What is your returns policy?',
    a: 'If a product is not right for your skin, return the unopened item within 30 days for a full refund or free replacement. We cover the return shipping within Switzerland.',
  },
  {
    q: 'Is the packaging recyclable?',
    a: 'Our glass bottles and aluminium caps are fully recyclable, and every outer carton is FSC-certified, plastic-free and printed with soy-based ink. We also offer a refill programme on our three bestsellers.',
  },
]

export const formatPrice = (value) =>
  new Intl.NumberFormat('en-CH', { style: 'currency', currency: 'CHF' }).format(value)

export const getProductById = (id) => PRODUCTS.find((product) => product.id === id)

export const getCategoryById = (id) => CATEGORIES.find((category) => category.id === id)

/**
 * Photography credits.
 *
 * All product and editorial photography is sourced from Pexels and used under
 * the Pexels Licence (free for commercial use, no attribution required — credits
 * given here as good practice).
 *
 * Placeholder imagery: these are real stock photographs of real cosmetic products,
 * not LUMIÈRE products. They must be reviewed and replaced with the client's own
 * product photography before any real launch, and any shot showing a recognisable
 * third-party brand or logo must be swapped out for trademark reasons.
 */
export const PHOTO_CREDITS = [
  { file: 'vit-c-glow-serum.jpg', pexelsId: 12602356, photographer: 'Saher Suthriwala' },
  { file: 'dewy-skin-serum.jpg', pexelsId: 13516796, photographer: 'mearlywan' },
  { file: 'hydra-riche-cream.jpg', pexelsId: 36375310, photographer: 'Betül Üstün' },
  { file: 'silk-milk-cleanser.jpg', pexelsId: 6689393, photographer: 'Jana Kukebal' },
  { file: 'velvet-lip-tint.jpg', pexelsId: 14444882, photographer: 'Pexels' },
  { file: 'silk-veil-cushion.jpg', pexelsId: 3373739, photographer: 'Shiny Diamond' },
  { file: 'midnight-recovery-mask.jpg', pexelsId: 14149696, photographer: 'Dinh Dinh' },
  { file: 'purifying-clay-mask.jpg', pexelsId: 6978043, photographer: 'Monstera Production' },
  { file: 'editorial-jar.jpg', pexelsId: 6690857, photographer: 'Tara Winstead' },
  { file: 'editorial-bottles.jpg', pexelsId: 15569178, photographer: 'Elena Druzhinina' },
]
