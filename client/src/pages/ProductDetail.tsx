import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import { Heart, Minus, Plus, Truck, ShieldCheck, Gift, Star, Clock, Loader2, Send, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProduct, useProducts, useReviews, useCreateReview } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useRecentlyViewed } from "@/context/RecentlyViewedContext";
import { useToast } from "@/hooks/use-toast";

function StarRating({ rating, onRate, interactive = false }: { rating: number; onRate?: (r: number) => void; interactive?: boolean }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <button key={i} type="button" onClick={() => interactive && onRate?.(i)} className={interactive ? "cursor-pointer hover:scale-110 transition-transform" : "cursor-default"} data-testid={`star-${i}`}>
          <Star className={`w-5 h-5 ${i <= rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/20'}`} />
        </button>
      ))}
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { items: recentlyViewed, addViewed } = useRecentlyViewed();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  
  const { data: product, isLoading } = useProduct(id);
  const { data: allProducts } = useProducts();

  useEffect(() => {
    if (product) {
      addViewed({ id: String(product.id), name: product.name, price: product.price, image: product.image, category: product.category });
    }
  }, [product?.id]);
  const { data: reviews } = useReviews(product?.id);
  const createReview = useCreateReview();

  const [reviewForm, setReviewForm] = useState({ author: "", rating: 5, comment: "" });
  const [showReviewForm, setShowReviewForm] = useState(false);

  if (isLoading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  if (!product) return <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4"><h2 className="text-2xl font-serif">Məhsul tapılmadı</h2><Link href="/products"><Button variant="outline">Məhsullara Qayıt</Button></Link></div>;

  const handleAddToCart = () => addToCart({ id: String(product.id), name: product.name, price: product.price, image: product.image }, quantity);
  const wishlisted = isInWishlist(String(product.id));
  const handleWishlist = () => toggleWishlist({ id: String(product.id), name: product.name, price: product.price, image: product.image, category: product.category });

  const handleSubmitReview = () => {
    if (!reviewForm.author || !reviewForm.comment) { toast({ title: "Əksik Məlumat", description: "Zəhmət olmasa adınızı və rəyinizi yazın.", variant: "destructive" }); return; }
    createReview.mutate({ productId: product.id, author: reviewForm.author, rating: reviewForm.rating, comment: reviewForm.comment }, {
      onSuccess: () => { toast({ title: "Rəy Əlavə Edildi", description: "Rəyiniz uğurla qeydə alındı." }); setReviewForm({ author: "", rating: 5, comment: "" }); setShowReviewForm(false); },
    });
  };

  const reviewsList = reviews || [];
  const avgRating = reviewsList.length > 0 ? reviewsList.reduce((s, r) => s + r.rating, 0) / reviewsList.length : 0;
  const relatedProducts = (allProducts || []).filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const recentlyViewedFiltered = recentlyViewed.filter(p => p.id !== String(product.id)).slice(0, 4);

  return (
    <div className="min-h-screen py-12 px-4 md:pt-32">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8 flex items-center text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">Ana Səhifə</Link>
          <span className="mx-2 text-border">/</span>
          <Link href="/products" className="hover:text-primary transition-colors">Kolleksiya</Link>
          <span className="mx-2 text-border">/</span>
          <span className="text-foreground font-semibold">{product.name}</span>
        </div>

        <div className="bg-white rounded-[2rem] shadow-xl shadow-black/3 overflow-hidden border border-white/50">
          <div className="grid lg:grid-cols-2 gap-0">
            <div className="relative aspect-square lg:aspect-auto lg:h-full bg-gradient-to-br from-accent/40 via-secondary/20 to-primary/5 p-8 md:p-16 flex items-center justify-center group overflow-hidden">
              {product.isNew && (
                <div className="absolute top-6 left-6 z-20 gradient-primary text-white text-xs font-bold px-4 py-1.5 rounded-xl shadow-[0_6px_20px_rgba(0,0,0,0.06)] uppercase tracking-wider" data-testid="badge-new">Yeni</div>
              )}
              {product.isPopular && (
                <div className="absolute top-6 right-6 z-20 glass px-3 py-1.5 rounded-xl text-xs font-bold text-primary flex items-center gap-1 border border-white/50 shadow-sm" data-testid="badge-popular">
                  <Star className="w-3 h-3 fill-primary" /> Çox Satılan
                </div>
              )}
              <img src={product.image} alt={product.name} className="relative z-10 w-full max-w-lg object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-700 ease-out" data-testid="img-product" />
            </div>

            <div className="p-8 md:p-12 lg:p-16 flex flex-col">
              <div className="text-xs text-primary font-bold mb-3 uppercase tracking-[0.2em]">{product.category}</div>
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4 leading-tight" data-testid="text-product-name">{product.name}</h1>
              
              {reviewsList.length > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <StarRating rating={Math.round(avgRating)} />
                  <span className="text-sm text-muted-foreground" data-testid="text-avg-rating">({avgRating.toFixed(1)}) · {reviewsList.length} rəy</span>
                </div>
              )}
              
              <div className="flex items-end gap-4 mb-8 pb-8 border-b border-border/30">
                <p className="text-3xl md:text-4xl gradient-text font-bold" data-testid="text-price">{product.price.toLocaleString('az-AZ')} ₼</p>
                {product.oldPrice && (
                  <>
                    <p className="text-muted-foreground/40 text-sm mb-1.5 line-through">{product.oldPrice.toLocaleString('az-AZ')} ₼</p>
                    <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-lg mb-1.5">-%{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}</span>
                  </>
                )}
                {!product.oldPrice && <p className="text-muted-foreground/40 text-sm mb-1.5 line-through">{(product.price * 1.2).toLocaleString('az-AZ')} ₼</p>}
              </div>
              
              <div className="mb-8">
                <h3 className="text-base font-bold text-foreground mb-2">Məhsul Təfərrüatı</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{product.description}</p>
              </div>

              <div className="glass rounded-2xl p-4 mb-8 flex items-center gap-4 border border-white/50">
                <div className="gradient-primary p-3 rounded-xl text-white shadow-[0_6px_20px_rgba(0,0,0,0.06)]">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Sürətli Göndərmə</h4>
                  <p className="text-xs text-muted-foreground">Bu gün saat 15:00-a qədər verilən sifarişlər eyni gün kargoda.</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mb-10 mt-auto">
                <div className="flex items-center justify-between glass rounded-full px-2 py-1 w-full sm:w-36 h-14 border border-white/50">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-full hover:bg-primary/10 flex items-center justify-center transition-colors" data-testid="button-decrease-qty"><Minus className="w-5 h-5" /></button>
                  <span className="font-bold text-lg" data-testid="text-quantity">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 rounded-full hover:bg-primary/10 flex items-center justify-center transition-colors" data-testid="button-increase-qty"><Plus className="w-5 h-5" /></button>
                </div>
                <Button onClick={handleAddToCart} className="flex-1 h-14 rounded-full text-lg gradient-primary text-white border-0 shadow-xl shadow-black/8 hover:shadow-2xl hover:shadow-black/12 hover:scale-[1.02] transition-all" data-testid="button-add-to-cart">
                  <ShoppingBag className="w-5 h-5 mr-2" /> Səbətə Əlavə Et
                </Button>
                <Button variant="outline" size="icon" onClick={handleWishlist} className={`h-14 w-14 rounded-full border-2 shrink-0 transition-all duration-300 ${wishlisted ? "gradient-primary text-white border-0 shadow-[0_6px_20px_rgba(0,0,0,0.06)]" : "text-muted-foreground hover:text-primary hover:border-primary border-border/50"}`} data-testid="button-wishlist">
                  <Heart className={`w-6 h-6 ${wishlisted ? "fill-white" : ""}`} />
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-border/30">
                {[
                  { icon: Truck, title: "Pulsuz Çatdırılma", sub: "50₼ üzəri" },
                  { icon: Gift, title: "Xüsusi Qablaşdırma", sub: "Zərif qutusunda" },
                  { icon: ShieldCheck, title: "Təhlükəsiz Ödəniş", sub: "256-bit SSL" },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center text-center space-y-1.5">
                    <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h4 className="font-semibold text-xs">{item.title}</h4>
                    <p className="text-[10px] text-muted-foreground hidden sm:block">{item.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 glass-strong rounded-[18px] p-6 md:p-10 border border-white/50 shadow-sm" data-testid="reviews-section">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Müştəri Rəyləri</h2>
              {reviewsList.length > 0 && (
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex flex-col items-center justify-center glass rounded-2xl p-5 border border-white/50 min-w-[120px]">
                    <p className="text-4xl font-bold gradient-text">{avgRating.toFixed(1)}</p>
                    <StarRating rating={Math.round(avgRating)} />
                    <p className="text-xs text-muted-foreground mt-1">{reviewsList.length} rəy</p>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    {[5, 4, 3, 2, 1].map(star => {
                      const count = reviewsList.filter(r => r.rating === star).length;
                      const pct = reviewsList.length > 0 ? (count / reviewsList.length) * 100 : 0;
                      return (
                        <div key={star} className="flex items-center gap-2" data-testid={`rating-bar-${star}`}>
                          <span className="text-xs font-semibold w-3 text-right">{star}</span>
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-amber-400 to-amber-300 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs text-muted-foreground w-6 text-right">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            <Button variant="outline" className="rounded-full border-border/50 font-semibold shrink-0" onClick={() => setShowReviewForm(!showReviewForm)} data-testid="button-write-review">Rəy Yaz</Button>
          </div>

          {showReviewForm && (
            <div className="glass rounded-2xl p-5 mb-8 border border-white/50 animate-in slide-in-from-top-4" data-testid="review-form">
              <h3 className="font-bold text-lg mb-4">Rəyinizi Yazın</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3"><span className="text-sm font-semibold">Qiymətiniz:</span><StarRating rating={reviewForm.rating} onRate={(r) => setReviewForm(p => ({ ...p, rating: r }))} interactive /></div>
                <Input placeholder="Adınız" value={reviewForm.author} onChange={(e) => setReviewForm(p => ({ ...p, author: e.target.value }))} className="rounded-xl h-11 bg-white/60 border-border/40" data-testid="input-review-author" />
                <textarea placeholder="Rəyiniz..." value={reviewForm.comment} onChange={(e) => setReviewForm(p => ({ ...p, comment: e.target.value }))} rows={3} className="w-full rounded-xl p-4 bg-white/60 border border-input text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring" data-testid="input-review-comment" />
                <Button onClick={handleSubmitReview} disabled={createReview.isPending} className="rounded-full px-6 gradient-primary text-white border-0 shadow-[0_6px_20px_rgba(0,0,0,0.06)]" data-testid="button-submit-review">
                  <Send className="w-4 h-4 mr-2" /> {createReview.isPending ? "Göndərilir..." : "Rəyi Göndər"}
                </Button>
              </div>
            </div>
          )}

          {reviewsList.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground"><Star className="w-10 h-10 mx-auto mb-3 opacity-15" /><p>Hələ rəy yazılmayıb. İlk rəyi siz yazın!</p></div>
          ) : (
            <div className="space-y-3">
              {reviewsList.map((review) => (
                <div key={review.id} className="glass rounded-2xl p-5 border border-white/50" data-testid={`review-${review.id}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 gradient-primary rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm">{review.author.charAt(0).toUpperCase()}</div>
                      <div><p className="font-semibold text-sm">{review.author}</p><p className="text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString('az-AZ')}</p></div>
                    </div>
                    <StarRating rating={review.rating} />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-16 mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">Bunlar da <span className="gradient-text italic">Maraqınızı Çəkə Bilər</span></h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              {relatedProducts.map((p) => (
                <Link key={p.id} href={`/product/${p.id}`}>
                  <div className="group cursor-pointer card-hover" data-testid={`card-related-${p.id}`}>
                    <div className="relative aspect-square rounded-[18px] overflow-hidden mb-3 bg-gradient-to-br [#FFF0F5] p-4">
                      <img src={p.image} alt={p.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-md" />
                    </div>
                    <p className="text-xs text-primary font-bold uppercase tracking-[0.15em] mb-0.5">{p.category}</p>
                    <h3 className="font-bold text-sm md:text-base mb-1 group-hover:text-primary transition-colors line-clamp-1">{p.name}</h3>
                    <p className="font-bold text-base">{p.price.toLocaleString('az-AZ')} ₼</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {recentlyViewedFiltered.length > 0 && (
          <div className="mt-8 mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">Son <span className="gradient-text italic">Baxdıqlarınız</span></h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              {recentlyViewedFiltered.map((p) => (
                <Link key={p.id} href={`/product/${p.id}`}>
                  <div className="group cursor-pointer card-hover" data-testid={`card-recent-${p.id}`}>
                    <div className="relative aspect-square rounded-[18px] overflow-hidden mb-3 bg-gradient-to-br [#FFF0F5] p-4">
                      <img src={p.image} alt={p.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-md" />
                    </div>
                    <p className="text-xs text-primary font-bold uppercase tracking-[0.15em] mb-0.5">{p.category}</p>
                    <h3 className="font-bold text-sm md:text-base mb-1 group-hover:text-primary transition-colors line-clamp-1">{p.name}</h3>
                    <p className="font-bold text-base">{p.price.toLocaleString('az-AZ')} ₼</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
