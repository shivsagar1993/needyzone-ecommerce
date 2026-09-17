const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const STANDARD_CATEGORIES = [
  { id: "cctv-security", name: "CCTV & Security" },
  { id: "mobile-chargers", name: "Mobile Chargers" },
  { id: "data-cables", name: "Data Cables" },
  { id: "digital-switches", name: "Digital Switches" },
  { id: "power-strips", name: "Power Strips" },
  { id: "networking-devices", name: "Networking Devices" },
  { id: "usb-products", name: "USB Products" },
  { id: "cameras", name: "Cameras" },
  { id: "smart-phones", name: "Smartphones" },
  { id: "laptops", name: "Laptops" },
  { id: "headphones", name: "Headphones" },
  { id: "watches", name: "Smart Watches" },
  { id: "speakers", name: "Speakers" },
  { id: "tablets", name: "Tablets" },
];

const NEEDYZONE_PRODUCTS = [
  {
    id: "cctv-bullet-01",
    slug: "dahua-2mp-hdcvi-ir-bullet-camera",
    title: "Dahua 2MP HDCVI IR Bullet Camera (Smart Night Vision)",
    price: 49,
    rating: 5,
    description: "High-definition 1080P outdoor weatherproof security camera with Smart IR and IP67 protection.",
    mainImage: "dh-hac-b4a21-vf-2mp-hdcvi-ir-bullet-camera-500x500-1.png",
    manufacturer: "Dahua",
    categoryId: "cctv-security",
    inStock: 25,
  },
  {
    id: "cctv-dome-02",
    slug: "hikvision-360-turret-dome-camera",
    title: "Hikvision 360° AI Eyeball Turret Dome Camera",
    price: 65,
    rating: 5,
    description: "Commercial indoor/outdoor turret dome with 360 wide-angle surveillance, motion sensor, and night guard.",
    mainImage: "cat-cctv-security.png",
    manufacturer: "Hikvision",
    categoryId: "cctv-security",
    inStock: 18,
  },
  {
    id: "charger-pd-03",
    slug: "needyzone-20w-fast-pd-typec-charger",
    title: "NeedyZone 20W Fast PD Dual USB-C Wall Charger",
    price: 19,
    rating: 5,
    description: "Ultra-compact GaN fast power delivery adapter compatible with iPhone, Android, and tablets.",
    mainImage: "dept-charger.jpg",
    manufacturer: "NeedyZone",
    categoryId: "mobile-chargers",
    inStock: 50,
  },
  {
    id: "cable-braided-04",
    slug: "needyzone-100w-braided-typec-cable",
    title: "100W Nylon Braided Ultra-Fast Type-C to Type-C Cable",
    price: 12,
    rating: 5,
    description: "Heavy-duty 2-meter fast charging and 480Mbps data transfer cable with reinforced alloy connectors.",
    mainImage: "dept-cables.jpg",
    manufacturer: "NeedyZone",
    categoryId: "data-cables",
    inStock: 80,
  },
  {
    id: "switch-digital-05",
    slug: "smart-digital-touch-switch-board-4gang",
    title: "Smart Digital Touch Switch Board (WiFi / App Controlled)",
    price: 35,
    rating: 5,
    description: "Tempered crystal glass touch control wall panel compatible with Alexa, Google Home, and smartphone app.",
    mainImage: "dept-smartswitch.jpg",
    manufacturer: "NeedyZone",
    categoryId: "digital-switches",
    inStock: 30,
  },
  {
    id: "power-strip-06",
    slug: "surge-protected-smart-power-strip-surge-guard",
    title: "Heavy-Duty Surge Protected 6-Socket Power Extension Board",
    price: 28,
    rating: 5,
    description: "Master surge protection extension strip with 4 USB quick-charging ports and fireproof casing.",
    mainImage: "dept-powerstrip.jpg",
    manufacturer: "NeedyZone",
    categoryId: "power-strips",
    inStock: 40,
  },
  {
    id: "cctv-pro-07",
    slug: "pro-wireless-outdoor-ip-cctv-camera",
    title: "Pro 4K Wireless Outdoor PTZ Security CCTV Camera",
    price: 89,
    rating: 5,
    description: "Motorized pan-tilt-zoom wireless outdoor camera with two-way audio, spotlight color night vision, and cloud storage.",
    mainImage: "hero-cctv-trio-transparent.png",
    manufacturer: "NeedyZone",
    categoryId: "cctv-security",
    inStock: 15,
  },
  {
    id: "gadgets-08",
    slug: "dual-band-gigabit-wifi-mesh-router",
    title: "NeedyZone Dual-Band Gigabit WiFi 6 Mesh Security Router",
    price: 59,
    rating: 5,
    description: "Ultra-fast WiFi 6 router designed for multi-camera CCTV live streams, low-latency streaming, and whole-home coverage.",
    mainImage: "dept-networking.jpg",
    manufacturer: "NeedyZone",
    categoryId: "networking-devices",
    inStock: 22,
  },
];

async function seed() {
  console.log("Starting NeedyZone category and product synchronization...");

  // 1. Ensure merchant exists
  let merchant = await prisma.merchant.findFirst();
  if (!merchant) {
    merchant = await prisma.merchant.create({
      data: {
        id: "1",
        name: "NeedyZone Official Direct",
        status: "ACTIVE",
      },
    });
    console.log("Created default merchant:", merchant.id);
  }

  // 2. Synchronize categories
  for (const cat of STANDARD_CATEGORIES) {
    const existing = await prisma.category.findFirst({
      where: {
        OR: [
          { id: cat.id },
          { name: cat.name },
          { name: cat.id },
        ],
      },
    });

    if (!existing) {
      await prisma.category.create({
        data: {
          id: cat.id,
          name: cat.name,
        },
      });
      console.log(`Created category: ${cat.name} (${cat.id})`);
    } else {
      // Update name to standard display name if necessary
      if (existing.name !== cat.name && existing.id === cat.id) {
        await prisma.category.update({
          where: { id: existing.id },
          data: { name: cat.name },
        });
        console.log(`Updated category name: ${cat.name}`);
      }
    }
  }

  // 3. Synchronize products
  for (const prod of NEEDYZONE_PRODUCTS) {
    // Check if category exists
    let cat = await prisma.category.findFirst({
      where: {
        OR: [
          { id: prod.categoryId },
          { name: prod.categoryId },
        ],
      },
    });

    if (!cat) {
      cat = await prisma.category.create({
        data: {
          id: prod.categoryId,
          name: prod.categoryId,
        },
      });
    }

    const existingProduct = await prisma.product.findFirst({
      where: {
        OR: [{ id: prod.id }, { slug: prod.slug }],
      },
    });

    if (!existingProduct) {
      await prisma.product.create({
        data: {
          id: prod.id,
          slug: prod.slug,
          title: prod.title,
          price: prod.price,
          rating: prod.rating,
          description: prod.description,
          mainImage: prod.mainImage,
          manufacturer: prod.manufacturer,
          inStock: prod.inStock,
          categoryId: cat.id,
          merchantId: merchant.id,
        },
      });
      console.log(`Created product: ${prod.title} -> Category: ${cat.name}`);
    } else {
      // Ensure categoryId is correctly linked to the proper category
      await prisma.product.update({
        where: { id: existingProduct.id },
        data: {
          categoryId: cat.id,
          title: prod.title,
          price: prod.price,
          mainImage: prod.mainImage,
          manufacturer: prod.manufacturer,
          inStock: prod.inStock,
        },
      });
      console.log(`Updated product: ${prod.title} -> Category: ${cat.name}`);
    }
  }

  console.log("Synchronization completed successfully!");
}

seed()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
