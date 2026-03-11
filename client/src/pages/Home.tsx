import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "wouter";
import { Heart, ArrowRight, Loader2, X, ShoppingBag, ChevronRight, Gift, Gem, Flower2, Palette, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useProducts, useAllReviewStats } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

const CATEGORIES = [
  { name: "Güllər", icon: Flower2, link: "/products" },
  { name: "Zərgərlik", icon: Gem, link: "/products" },
  { name: "Kosmetika", icon: Palette, link: "/products" },
  { name: "Hədiyyələr", icon: Gift, link: "/products" },
];

function StoryViewer({ stories, initialIndex, onClose }: {
  stories: { id: number; name: string; image: string; price: number; category: string; description: string }[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { addToCart } = useCart();
  const story = stories[currentIndex];
  const STORY_DURATION = 5000;

  const goNext = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setProgress(0);
    } else {
      onClose();
    }
  }, [currentIndex, stories.length, onClose]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setProgress(0);
    }
  }, [currentIndex]);

  useEffect(() => {
    setProgress(0);
    const interval = 50;
    timerRef.current = setInterval(() => {
      setProgress(prev => {
        const next = prev + (interval / STORY_DURATION) * 100;
        if (next >= 100) {
          goNext();
          return 0;
        }
        return next;
      });
    }, interval);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [currentIndex, goNext]);

  const handleTap = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x < rect.width / 3) goPrev();
    else if (x > (rect.width / 3) * 2) goNext();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center" data-testid="story-viewer">
      <div className="absolute top-0 left-0 right-0 flex gap-1 p-2 pt-3 z-20 px-3">
        {stories.map((_, idx) => (
          <div key={idx} className="flex-1 h-[3px] rounded-full bg-white/20 overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-100 ease-linear"
              style={{ width: idx < currentIndex ? '100%' : idx === currentIndex ? `${progress}%` : '0%' }}
            />
          </div>
        ))}
      </div>

      <button onClick={onClose} className="absolute top-8 right-3 z-30 text-white p-2 rounded-full bg-white/10 backdrop-blur-md" data-testid="story-close">
        <X className="w-5 h-5" />
      </button>

      <div className="absolute top-8 left-3 z-30 flex items-center gap-2">
        <div className="w-8 h-8 rounded-full border-2 border-white/30 overflow-hidden">
          <img src={story.image} alt="" className="w-full h-full object-cover" />
        </div>
        <span className="text-white text-sm font-semibold">{story.category}</span>
      </div>

      <div className="relative w-full h-full max-w-lg mx-auto" onClick={handleTap}>
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <img src={story.image} alt={story.name} className="max-w-full max-h-[60vh] object-contain drop-shadow-2xl animate-in zoom-in-95 duration-300" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 pb-10">
          <p className="text-white/50 text-xs uppercase tracking-[0.2em] mb-1">{story.category}</p>
          <h3 className="text-white text-xl font-bold mb-2">{story.name}</h3>
          <p className="text-white/70 text-sm line-clamp-2 mb-4">{story.description}</p>
          <div className="flex items-center gap-3">
            <span className="text-white text-2xl font-bold">{story.price.toLocaleString('az-AZ')} ₼</span>
            <Button
              size="sm"
              className="btn-primary px-5 h-10 text-sm border-0"
              onClick={(e) => {
                e.stopPropagation();
                addToCart({ id: String(story.id), name: story.name, price: story.price, image: story.image });
              }}
              data-testid={`story-add-cart-${story.id}`}
            >
              <ShoppingBag className="w-4 h-4 mr-1.5" />
              Səbətə Əlavə Et
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { data: products, isLoading } = useProducts();
  const { data: reviewStats } = useAllReviewStats();

  const allProducts = products || [];
  const popularProducts = allProducts.filter(p => p.isPopular);
  const newProducts = allProducts.filter(p => p.isNew);

  const [storyOpen, setStoryOpen] = useState(false);
  const [storyIndex, setStoryIndex] = useState(0);

  const [selectedSlide, setSelectedSlide] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedSlide(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    onSelect();
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi]);

  const openStory = (index: number) => {
    setStoryIndex(index);
    setStoryOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {storyOpen && allProducts.length > 0 && (
        <StoryViewer
          stories={allProducts.map(p => ({ id: p.id, name: p.name, image: p.image, price: p.price, category: p.category, description: p.description }))}
          initialIndex={storyIndex}
          onClose={() => setStoryOpen(false)}
        />
      )}

      <section className="pt-20 md:pt-24 pb-3 px-4" data-testid="stories-section">
        <div className="container mx-auto">
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5 shrink-0 snap-start">
                  <div className="w-[68px] h-[68px] rounded-full bg-[#F0F0F2] animate-pulse" />
                  <div className="w-12 h-3 bg-[#F0F0F2] rounded animate-pulse" />
                </div>
              ))
            ) : (
              allProducts.map((product, idx) => (
                <button
                  key={product.id}
                  onClick={() => openStory(idx)}
                  className="flex flex-col items-center gap-1.5 shrink-0 snap-start active-press group"
                  data-testid={`story-bubble-${product.id}`}
                >
                  <div className="w-[68px] h-[68px] md:w-[76px] md:h-[76px] rounded-full p-[2px] border-2 border-[#FF4D8D] group-hover:scale-105 transition-transform">
                    <div className="w-full h-full rounded-full overflow-hidden bg-white">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <span className="text-[11px] text-[#8A8A8A] font-medium max-w-[68px] truncate text-center">
                    {product.name.split(' ').slice(0, 2).join(' ')}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="relative w-full overflow-hidden px-4 pt-2 md:pt-4">
        <div className="container mx-auto rounded-[20px] overflow-hidden relative" style={{ boxShadow: '0 6px 20px rgba(0,0,0,0.06)' }} ref={emblaRef}>
          <div className="flex">
            {[
              { image: "/images/hero.png", title: "Sevgililər üçün", subtitle: "xüsusi hədiyyələr", desc: "Onu nə qədər sevdiyinizi göstərməyin ən zərif yolu." },
              { image: "/images/slider-dinner.png", title: "Unudulmaz", subtitle: "anlar yaradın", desc: "Birlikdə keçirdiyiniz hər anı xüsusi edəcək hədiyyələr." },
              { image: "/images/slider-couple.png", title: "Sonsuz Eşqin", subtitle: "simvolu", desc: "Qəlbinizdən keçənləri ən gözəl şəkildə anladan kolleksiya." }
            ].map((slide, index) => (
              <div key={index} className="flex-[0_0_100%] min-w-0 relative">
                <div className="relative h-[280px] md:h-[420px] lg:h-[500px] overflow-hidden">
                  <img src={slide.image} alt={`Slayd ${index + 1}`} className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                    <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-2">
                      {slide.title} <span className="text-white/80 italic">{slide.subtitle}</span>
                    </h1>
                    <p className="text-white/60 text-sm md:text-base max-w-md mb-5 hidden md:block">{slide.desc}</p>
                    <Link href="/products">
                      <Button className="btn-primary px-8 h-12 text-sm font-semibold border-0">
                        Kəşf Et <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center gap-2 mt-4" data-testid="slider-dots">
          {[0, 1, 2].map((idx) => (
            <button
              key={idx}
              onClick={() => emblaApi?.scrollTo(idx)}
              className={`rounded-full transition-all duration-300 ${
                selectedSlide === idx
                  ? "w-7 h-2 bg-[#FF4D8D]"
                  : "w-2 h-2 bg-[#1F1F1F]/15"
              }`}
              data-testid={`slider-dot-${idx}`}
              aria-label={`Slayd ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      <section className="py-7 md:py-10 px-4" data-testid="categories-section">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-[#1F1F1F]">Kateqoriyalar</h2>
            <Link href="/products">
              <span className="text-sm text-[#FF4D8D] font-semibold flex items-center gap-0.5">
                Hamısı <ChevronRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {CATEGORIES.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <Link key={idx} href={cat.link}>
                  <div className="flex flex-col items-center gap-2 active-press" data-testid={`category-${idx}`}>
                    <div className="w-14 h-14 rounded-full bg-[#FFF0F5] flex items-center justify-center">
                      <Icon className="w-6 h-6 text-[#FF4D8D]" />
                    </div>
                    <span className="text-[11px] font-medium text-[#1F1F1F] text-center">{cat.name}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-4 md:py-8 px-4" data-testid="popular-section">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-[#1F1F1F]">Ən Çox Seçilənlər</h2>
            <Link href="/products">
              <span className="text-sm text-[#FF4D8D] font-semibold flex items-center gap-0.5">
                Hamısı <ChevronRight className="w-4 h-4" />
              </span>
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-[#FF4D8D]" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {popularProducts.slice(0, 6).map((product) => (
                <div key={product.id} className="card-soft card-hover flex flex-col h-full overflow-hidden" data-testid={`card-product-${product.id}`}>
                  <div className="relative aspect-square overflow-hidden bg-[#FFF0F5] p-3" style={{ borderRadius: '18px 18px 0 0' }}>
                    <Link href={`/product/${product.id}`}>
                      <img src={product.image} alt={product.name} className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-500" />
                    </Link>
                    <button
                      onClick={() => toggleWishlist({ id: String(product.id), name: product.name, price: product.price, image: product.image, category: product.category })}
                      className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        isInWishlist(String(product.id)) ? 'bg-[#FF4D8D] text-white' : 'bg-white/90 text-[#8A8A8A] hover:text-[#FF4D8D]'
                      }`}
                      style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
                      data-testid={`wishlist-${product.id}`}
                    >
                      <Heart className={`w-4 h-4 ${isInWishlist(String(product.id)) ? 'fill-white' : ''}`} />
                    </button>
                    {product.isNew && (
                      <span className="absolute top-2.5 left-2.5 bg-[#FF4D8D] text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">YENİ</span>
                    )}
                  </div>
                  <div className="p-3 flex flex-col flex-1">
                    <p className="text-[10px] text-[#8A8A8A] font-medium uppercase tracking-wider mb-0.5">{product.category}</p>
                    <Link href={`/product/${product.id}`}>
                      <h3 className="font-semibold text-sm text-[#1F1F1F] mb-1 line-clamp-1 hover:text-[#FF4D8D] transition-colors">{product.name}</h3>
                    </Link>
                    {reviewStats?.[product.id] && (
                      <div className="flex items-center gap-1 mb-1" data-testid={`rating-${product.id}`}>
                        <div className="flex gap-0.5">
                          {[1,2,3,4,5].map(s => (
                            <Star key={s} className={`w-3 h-3 ${s <= Math.round(reviewStats[product.id].avgRating) ? 'fill-amber-400 text-amber-400' : 'text-[#EFEFEF]'}`} />
                          ))}
                        </div>
                        <span className="text-[10px] text-[#8A8A8A]">({reviewStats[product.id].count})</span>
                      </div>
                    )}
                    <p className="text-[#1F1F1F] font-bold text-base mb-2.5">{product.price.toLocaleString('az-AZ')} ₼</p>
                    <Button
                      size="sm"
                      className="w-full btn-primary h-9 text-xs font-semibold border-0 mt-auto"
                      onClick={() => addToCart({ id: String(product.id), name: product.name, price: product.price, image: product.image })}
                      data-testid={`add-cart-${product.id}`}
                    >
                      <ShoppingBag className="w-3.5 h-3.5 mr-1.5" />
                      Səbətə Əlavə Et
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-6 md:py-10 px-4 mb-6" data-testid="new-arrivals-section">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-[#1F1F1F]">Yeni Əlavə Edilənlər</h2>
            <Link href="/products">
              <span className="text-sm text-[#FF4D8D] font-semibold flex items-center gap-0.5">
                Hamısı <ChevronRight className="w-4 h-4" />
              </span>
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-[#FF4D8D]" />
            </div>
          ) : (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory -mx-1 px-1">
              {newProducts.map((product) => (
                <div key={product.id} className="card-soft card-hover flex flex-col shrink-0 w-[155px] md:w-[220px] snap-start overflow-hidden" data-testid={`card-new-${product.id}`}>
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#FFF0F5] p-3" style={{ borderRadius: '18px 18px 0 0' }}>
                    <span className="absolute top-2 left-2 z-10 bg-[#FF4D8D] text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                      Yeni
                    </span>
                    <Link href={`/product/${product.id}`}>
                      <img src={product.image} alt={product.name} className="object-contain w-full h-full" />
                    </Link>
                  </div>
                  <div className="p-3 flex flex-col flex-1">
                    <p className="text-[10px] text-[#8A8A8A] font-medium uppercase tracking-wider mb-0.5">{product.category}</p>
                    <Link href={`/product/${product.id}`}>
                      <h3 className="font-semibold text-sm text-[#1F1F1F] mb-1 line-clamp-1">{product.name}</h3>
                    </Link>
                    <span className="text-[#1F1F1F] font-bold text-sm mb-2">{product.price.toLocaleString('az-AZ')} ₼</span>
                    <Button
                      size="sm"
                      className="w-full h-8 text-xs font-medium active-press bg-[#FFF0F5] text-[#FF4D8D] hover:bg-[#FF4D8D] hover:text-white transition-all border-0 mt-auto rounded-xl"
                      onClick={() => addToCart({ id: String(product.id), name: product.name, price: product.price, image: product.image })}
                      data-testid={`add-cart-new-${product.id}`}
                    >
                      Səbətə Əlavə Et
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
