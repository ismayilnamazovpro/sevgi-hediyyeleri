import { Link } from "wouter";
import { Heart, ShoppingBag, Percent, Clock, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useProducts, useAllReviewStats } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useState, useEffect } from "react";

function Countdown({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const tick = () => {
      const now = new Date().getTime();
      const diff = targetDate.getTime() - now;
      if (diff <= 0) return;
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const units = [
    { label: "Gün", value: timeLeft.days },
    { label: "Saat", value: timeLeft.hours },
    { label: "Dəqiqə", value: timeLeft.minutes },
    { label: "Saniyə", value: timeLeft.seconds },
  ];

  return (
    <div className="flex gap-3 justify-center" data-testid="countdown-timer">
      {units.map((u) => (
        <div key={u.label} className="flex flex-col items-center">
          <div className="glass-strong w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center border border-white/50 shadow-sm">
            <span className="text-2xl md:text-3xl font-bold gradient-text">{String(u.value).padStart(2, '0')}</span>
          </div>
          <span className="text-[10px] md:text-xs text-muted-foreground font-semibold mt-1.5">{u.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function Sales() {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { data: products, isLoading } = useProducts();
  const { data: reviewStats } = useAllReviewStats();

  const saleProducts = (products || []).filter(p => p.isOnSale && p.oldPrice);

  const nextValentines = new Date(new Date().getFullYear(), 1, 14);
  if (nextValentines < new Date()) nextValentines.setFullYear(nextValentines.getFullYear() + 1);

  return (
    <div className="min-h-screen py-12 px-4 pt-24">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center rounded-full gradient-primary px-4 py-1.5 text-xs font-bold text-white mb-4 shadow-[0_6px_20px_rgba(0,0,0,0.06)]">
            <Percent className="mr-1.5 h-3 w-3" /> Xüsusi Endirimlər
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3" data-testid="text-sales-title">
            Endirimli <span className="gradient-text italic">Məhsullar</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
            Sevdiklərinizi xoşbəxt etmək üçün xüsusi endirimlərdən yararlanın!
          </p>
        </div>

        <div className="glass-strong rounded-[18px] p-6 md:p-8 border border-white/50 shadow-sm mb-12 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-lg">Sevgililər Gününə Qalan Vaxt</h3>
          </div>
          <Countdown targetDate={nextValentines} />
          <p className="text-xs text-muted-foreground mt-4">14 Fevral — Sifarişinizi indi verin, vaxtında çatdırılsın!</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : saleProducts.length === 0 ? (
          <div className="text-center py-16 glass rounded-[18px] border border-white/50">
            <Percent className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-20" />
            <h3 className="text-xl font-serif text-muted-foreground">Hazırda endirimli məhsul yoxdur.</h3>
            <Link href="/products">
              <Button variant="outline" className="mt-4 rounded-full">Bütün Məhsullara Bax</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
            {saleProducts.map((product) => {
              const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;
              return (
                <Card key={product.id} className="overflow-hidden group border-0 shadow-sm card-hover bg-white rounded-[18px] flex flex-col" data-testid={`card-sale-${product.id}`}>
                  <div className="relative aspect-square overflow-hidden bg-gradient-to-br [#FFF0F5] p-4">
                    <Link href={`/product/${product.id}`}>
                      <img src={product.image} alt={product.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-md" />
                    </Link>
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-sm">-%{discount}</span>
                    <Button size="icon" variant="ghost" onClick={() => toggleWishlist({ id: String(product.id), name: product.name, price: product.price, image: product.image, category: product.category })} className={`absolute top-3 right-3 rounded-2xl h-9 w-9 shadow-md transition-all ${isInWishlist(String(product.id)) ? 'gradient-primary text-white border-0' : 'glass border border-white/50 text-foreground/50 hover:text-primary'}`} data-testid={`wishlist-sale-${product.id}`}>
                      <Heart className={`w-4 h-4 ${isInWishlist(String(product.id)) ? 'fill-white' : ''}`} />
                    </Button>
                  </div>
                  <CardContent className="p-3.5 md:p-4 flex flex-col flex-1">
                    <p className="text-[10px] md:text-xs text-primary/70 font-bold uppercase tracking-[0.15em] mb-0.5">{product.category}</p>
                    <Link href={`/product/${product.id}`}>
                      <h3 className="font-bold text-sm md:text-base mb-1.5 hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
                    </Link>
                    {reviewStats?.[product.id] && (
                      <div className="flex items-center gap-1 mb-1.5">
                        <div className="flex gap-0.5">{[1,2,3,4,5].map(s => <Star key={s} className={`w-3 h-3 ${s <= Math.round(reviewStats[product.id].avgRating) ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/20'}`} />)}</div>
                        <span className="text-[10px] text-muted-foreground">({reviewStats[product.id].count})</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 mb-3">
                      <p className="text-foreground font-bold text-lg">{product.price.toLocaleString('az-AZ')} ₼</p>
                      <p className="text-muted-foreground/50 text-sm line-through">{product.oldPrice?.toLocaleString('az-AZ')} ₼</p>
                    </div>
                    <Button size="sm" className="w-full rounded-xl gradient-primary text-white border-0 shadow-[0_6px_20px_rgba(0,0,0,0.06)] text-xs md:text-sm active-press h-10 mt-auto" onClick={() => addToCart({ id: String(product.id), name: product.name, price: product.price, image: product.image })} data-testid={`add-cart-sale-${product.id}`}>
                      <ShoppingBag className="w-3.5 h-3.5 mr-1.5" /> Səbətə Əlavə Et
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
