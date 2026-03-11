# Eşq & Hədiyyə - Romantik Hədiyyə E-Ticarət Saytı

## Layihə Haqqında
Sevgililər və qadınlar üçün romantik hədiyyələr satan, mobil uyğun e-ticarət veb saytı. Çəhrayı, krem və pastel bənövşəyi tonlarında müasir, şirin və romantik dizayn. Azərbaycan dilində interfeys.

## Texnologiya
- **Frontend:** React + TypeScript, Tailwind CSS v4, Wouter (routing), TanStack Query
- **Backend:** Express.js, Node.js
- **Verilənlər Bazası:** PostgreSQL + Drizzle ORM
- **UI Kitabxanası:** shadcn/ui komponentləri, Lucide React ikonları
- **Carousel:** embla-carousel-react

## Layihə Strukturu
```
client/src/
  pages/          - Home, Products, ProductDetail, Cart, Wishlist, OrderTracking, About, Contact, GiftFinder, Sales, FAQ, ReturnPolicy
  components/     - Navbar, UI komponentləri
  context/        - CartContext (səbət), WishlistContext (sevimlilər), RecentlyViewedContext (son baxılanlar)
  lib/            - api.ts (API hooks), queryClient
  assets/images/  - Məhsul şəkilləri (həmçinin public/images-a kopyalanmış)
server/
  index.ts        - Express server
  routes.ts       - API marşrutları
  storage.ts      - Verilənlər bazası CRUD əməliyyatları
  db.ts           - Drizzle DB bağlantısı
  seed.ts         - İlk məhsul və kupon məlumatlarını yükləmə
shared/
  schema.ts       - Drizzle şemaları (products, orders, reviews, coupons)
```

## API Marşrutları
- `GET /api/products` - Bütün məhsulları gətir
- `GET /api/products/:id` - Tək məhsul detalı
- `GET /api/products/category/:category` - Kateqoriyaya görə filtr
- `POST /api/orders` - Yeni sifariş yarat
- `GET /api/orders/:id` - Sifariş detalı
- `GET /api/reviews` - Bütün rəy statistikaları (avgRating, count per product)
- `GET /api/reviews/:productId` - Məhsul rəylərini gətir
- `POST /api/reviews` - Yeni rəy əlavə et
- `POST /api/coupons/validate` - Kupon kodunu doğrula

## Verilənlər Bazası Cədvəlləri
- **products**: id, name, price, old_price, image, images[], description, category, is_popular, is_new, is_on_sale
- **orders**: id, customer_name, customer_email, customer_phone, address, items, total, status, created_at
- **reviews**: id, product_id, author, rating, comment, created_at
- **coupons**: id, code, discount_percent, is_active

## Xüsusiyyətlər
- **Instagram Story**: Məhsulları hekayə formatında göstərən dairəvi düymələr (auto-progress, tap navigation)
- **Sevimlilər Siyahısı**: Ürək ikonu ilə məhsul saxlama, ayrı sevimlilər səhifəsi
- **Kupon/Endirim Kodu**: Səbətdə kupon daxil etmə (XOSGELDIM %10, ESQ20 %20, SEVGI15 %15)
- **Məhsul Rəyləri**: Ulduzlu qiymətləndirmə, rəy yazma, rating breakdown bars
- **Sifariş İzləmə**: Sifariş nömrəsi ilə vəziyyət sorğulama (timeline görünüşü)
- **Məhsul Sıralama**: Qiymət, yenilik və populyarlığa görə sıralama
- **Haqqımızda & Əlaqə**: Tam səhifə dizaynları və əlaqə formu
- **Hədiyyə Tapıcı (Quiz)**: 4 addımlı quiz - kimin üçün, münasibət, büdcə, stil → uyğun təkliflər
- **Endirimlər Səhifəsi**: Endirimli məhsullar + Sevgililər Gününə geri sayım
- **FAQ**: Kateqoriyalı accordion suallar (Çatdırılma, Ödəniş, Qaytarma, Hədiyyə Qablaşdırması, Təhlükəsizlik)
- **Qaytarma Siyasəti**: Şərtlər, proses addımları, zəmanət məlumatı
- **Hədiyyə Qablaşdırması**: Səbətdə Klassik (3₼) və Premium (5₼) qablaşdırma seçimi + mesaj
- **Son Baxılanlar**: ProductDetail-da son baxılan məhsulların göstərilməsi (localStorage)
- **Endirim Badge-ləri**: Məhsul kartlarında -%XX faiz göstəricisi

## Vacib Qeydlər
- Məhsul şəkilləri `client/public/images/` qovluğundan xidmət edilir
- Verilənlər bazasındakı məhsul image sahələri `/images/...` formatında
- Tətbiq ilk çalışanda `seed.ts` ilə 8 məhsul və 3 kupon avtomatik əlavə olunur
- 3 məhsul endirimlidir: Gül Buketi (85₼, əvvəl 110₼), Şokolad (65₼, əvvəl 85₼), Şam (32₼, əvvəl 45₼)
- Səbət və sevimlilər idarəetməsi client-side Context üzərindən edilir
- Font: Inter (Google Fonts) — bütün UI üçün tək font
- Rəng paleti: Primary #FF4D8D, Background #F7F7F9, Card #FFFFFF, Text #1F1F1F, Secondary text #8A8A8A, Border #EFEFEF, Accent #FFF0F5
- Dizayn: Apple/modern e-commerce stili, minimal, soft shadows (0 6px 20px rgba(0,0,0,0.06)), border-radius 18px
- Bottom nav: ağ fon, #EFEFEF border, aktiv ikon #FFF0F5 bg + #FF4D8D rəngi
- Kateqoriya ikonları: 56px dairə, #FFF0F5 fon, #FF4D8D ikon
- Story bubbles: 2px border #FF4D8D, radius 50%
- Hero banner: radius 20px, CTA btn-primary class (30px radius, pink shadow)
- CSS utilities: @utility ilə — active-press, glass, glass-strong, gradient-primary, card-soft, card-hover, btn-primary
- Alt naviqasiya: 4 düymə - Ana Səhifə, Kolleksiya, Sevimlilər (badge), Səbət (badge)
- Footer: ağ fon, təmiz dizayn, faydalı keçidlər (Sales, GiftFinder, FAQ, ReturnPolicy, OrderTracking)
- Valyuta: ₼ (Azərbaycan Manatı), locale: az-AZ
