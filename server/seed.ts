import { db } from "./db";
import { products, coupons } from "@shared/schema";

const SEED_PRODUCTS = [
  {
    name: "Eşq Dolu Gül Buketi",
    price: 85,
    oldPrice: 110,
    image: "/images/product-roses.png",
    description: "Diqqətlə seçilmiş, təzə və canlı çəhrayı-qırmızı güllərdən ibarət romantik buket. Xüsusi dizayn kraft kağız qablaşdırmasında və xüsusi qeyd kartı ilə birlikdə göndərilir. Güllərimiz dalından yeni dərilmiş təzəliyindədir və ən az 1 həftə vazo ömrünə malikdir. Sevgilinizə hisslərinizi ifadə etməyin ən klassik və ən gözəl yolu.",
    isPopular: true,
    isNew: false,
    isOnSale: true,
    category: "Güllər"
  },
  {
    name: "Zərif Ürək Boyunbağı",
    price: 125,
    image: "/images/product-necklace.png",
    description: "925 ayar gümüş, 1-ci sinif zirkon daşlarla bəzədilmiş zərif ürək dizaynlı boyunbağı. Antialerjik örtüyü sayəsində həssas dərilər üçün uygundur. Xüsusi işıqlı hədiyyə qutusunda göndərilir. Hər an onun qəlbində olun, parıltısı ilə göz qamaşdırın.",
    isPopular: true,
    isNew: true,
    category: "Zərgərlik"
  },
  {
    name: "Romance Ətir 50ml",
    price: 210,
    image: "/images/product-perfume.png",
    description: "Üst notalarında Fransız lavandası, orta notalarında vanil və alt notalarında yasəmən olan, baş döndürücü və gün boyu qalıcı bir qadın ətri. Şık vintage şüşə dizaynı ilə makiyaj masasının ulduzu olacaq. Gündəlik istifadə və xüsusi gecələr üçün mükəmməl seçim.",
    isPopular: false,
    isNew: true,
    category: "Kosmetika"
  },
  {
    name: "Şirin Peluş Ayıcıq 40sm",
    price: 45,
    image: "/images/product-bear.png",
    description: "Birinci keyfiyyət yumşaq peluş parçadan istehsal edilmiş, anti-alerjik doldurma materialı olan və əlində 'Səni Sevirəm' yazılı ürək yastığı tutan sevimli ayıcıq. Qucaqlanmalıq toxunuşu ilə hər yaş üçün möhtəşəm sürpriz.",
    isPopular: true,
    isNew: false,
    category: "Hədiyyə"
  },
  {
    name: "Cütlərə Xüsusi Üzük Dəsti",
    price: 185,
    image: "/images/product-rings.png",
    description: "Paslanmaz polad üzəri rodium örtüklü, heç vaxt qaralma etməyən minimalist cüt üzükləri. İç hissələrinə pulsuz ad yazdırma seçimi ilə eşqinizi əbədiləşdirin. Ağac cüt üzük qutusunda göndərilir.",
    isPopular: true,
    isNew: true,
    category: "Zərgərlik"
  },
  {
    name: "Premium Ürək Şokolad Qutusu",
    price: 65,
    oldPrice: 85,
    image: "/images/product-chocolates.png",
    description: "Qırmızı məxmər ürək qutu içərisində 24 ədəd Belçika şokoladı. Südlü, bitter və ağ şokolad çeşidlərinin moruq, karamel və fındıq doldurmaları ilə əsrarəngiz uyumu. Həm gözə həm damağa xitab edən ləzzətli hədiyyə.",
    isPopular: false,
    isNew: false,
    isOnSale: true,
    category: "Ləzzət"
  },
  {
    name: "Gül və Vanil Soya Şamı",
    price: 32,
    oldPrice: 45,
    image: "/images/product-candle.png",
    description: "%100 təbii soya mumundan istehsal edilmiş, is etməyən taxta fitilli romantik şam. Gül yarpaqları və şirin vanil ətri ilə otağınızın atmosferini dəyişdirəcək. Buzlu çəhrayı şüşə bankada və mantar qapaqlı şık dizaynı ilə.",
    isPopular: false,
    isNew: true,
    isOnSale: true,
    category: "Hədiyyə"
  },
  {
    name: "Xatirə Dəftəri (Eşq Albomu)",
    price: 58,
    image: "/images/product-album.png",
    description: "Ən gözəl xatirələrinizi əbədiləşdirmək üçün dəri cildli, qalın kraft yarpaqlı xüsusi dizayn foto albomu. İçərisində foto künc bəndləri və metalik qələm hədiyyəsi ilə birlikdə gəlir. Öz eşq hekayənizi yazmağa başlayın.",
    isPopular: true,
    isNew: false,
    category: "Hədiyyə"
  }
];

const SEED_COUPONS = [
  { code: "XOSGELDIM", discountPercent: 10, isActive: true },
  { code: "ESQ20", discountPercent: 20, isActive: true },
  { code: "SEVGI15", discountPercent: 15, isActive: true },
];

export async function seedProducts() {
  const existing = await db.select().from(products);
  if (existing.length === 0) {
    console.log("Seeding products...");
    await db.insert(products).values(SEED_PRODUCTS);
    console.log(`Seeded ${SEED_PRODUCTS.length} products.`);
  } else {
    console.log(`Database already has ${existing.length} products, skipping seed.`);
  }

  const existingCoupons = await db.select().from(coupons);
  if (existingCoupons.length === 0) {
    console.log("Seeding coupons...");
    await db.insert(coupons).values(SEED_COUPONS);
    console.log(`Seeded ${SEED_COUPONS.length} coupons.`);
  }
}
