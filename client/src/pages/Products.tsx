import { useState } from "react";
import { Link } from "wouter";
import { Heart, Search, Loader2, ArrowUpDown, ShoppingBag, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useProducts, useAllReviewStats } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { Star } from "lucide-react";

type SortOption = "default" | "price-asc" | "price-desc" | "newest" | "popular";

export default function Products() {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { data: products, isLoading } = useProducts();
  const { data: reviewStats } = useAllReviewStats();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("Hamısı");
  const [sortBy, setSortBy] = useState<SortOption>("default");

  const allProducts = products || [];
  const categories = ["Hamısı", ...Array.from(new Set(allProducts.map(p => p.category)))];

  let filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "Hamısı" || product.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  switch (sortBy) {
    case "price-asc": filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price); break;
    case "price-desc": filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price); break;
    case "newest": filteredProducts = [...filteredProducts].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break;
    case "popular": filteredProducts = [...filteredProducts].sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0)); break;
  }

  return (
    <div className="min-h-screen py-12 px-4 md:py-24">
      <div className="container mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4 pt-8">
          <h1 className="text-4xl md:text-5xl font-bold" data-testid="text-products-title">
            Kolleksiyanı <span className="gradient-text italic">Kəşf Et</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Onu xoşbəxt edəcək ən romantik hədiyyələri kəşf edin.
          </p>
        </div>

        <div className="flex flex-col gap-4 mb-10">
          <div className="glass-strong rounded-2xl p-4 md:p-5 border border-white/50 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex flex-wrap gap-2 justify-center md:justify-start w-full md:w-auto">
                {categories.map(category => (
                  <Button 
                    key={category} 
                    variant={activeCategory === category ? "default" : "outline"}
                    onClick={() => setActiveCategory(category)}
                    className={`rounded-full text-sm font-semibold transition-all duration-300 ${
                      activeCategory === category 
                        ? "gradient-primary text-white shadow-[0_6px_20px_rgba(0,0,0,0.06)] border-0" 
                        : "bg-white/60 border-border/50 hover:bg-white"
                    }`}
                    data-testid={`button-category-${category}`}
                  >
                    {category}
                  </Button>
                ))}
              </div>
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input 
                  placeholder="Məhsul axtar..." 
                  className="pl-11 rounded-full bg-white/60 border-border/40 h-11 focus:bg-white transition-colors"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  data-testid="input-search"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between px-1">
            <p className="text-sm text-muted-foreground font-medium" data-testid="text-product-count">{filteredProducts.length} məhsul</p>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="text-sm bg-white/70 border border-border/40 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30 font-medium"
                data-testid="select-sort"
              >
                <option value="default">Standart</option>
                <option value="price-asc">Qiymət: Aşağıdan Yuxarıya</option>
                <option value="price-desc">Qiymət: Yuxarıdan Aşağıya</option>
                <option value="newest">Ən Yenilər</option>
                <option value="popular">Ən Populyar</option>
              </select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 glass rounded-[18px] border border-white/50">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-20" />
            <h3 className="text-2xl font-serif text-muted-foreground">Axtardığınız meyarlara uyğun məhsul tapılmadı.</h3>
            <Button 
              variant="outline" 
              className="mt-6 rounded-full"
              onClick={() => {setSearchTerm(""); setActiveCategory("Hamısı"); setSortBy("default");}}
              data-testid="button-clear-filters"
            >
              Filterləri Təmizlə
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden group border-0 shadow-sm card-hover bg-white rounded-[18px] flex flex-col h-full" data-testid={`card-product-${product.id}`}>
                <div className="relative aspect-square overflow-hidden bg-gradient-to-br [#FFF0F5] p-4">
                  {product.isOnSale && product.oldPrice ? (
                    <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-sm" data-testid={`badge-sale-${product.id}`}>
                      -%{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}
                    </div>
                  ) : product.isNew ? (
                    <div className="absolute top-3 left-3 z-10 gradient-primary text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-sm uppercase" data-testid={`badge-new-${product.id}`}>
                      Yeni
                    </div>
                  ) : null}
                  <Link href={`/product/${product.id}`}>
                    <img src={product.image} alt={product.name} className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out drop-shadow-md" />
                  </Link>
                  <Button 
                    size="icon" 
                    variant="ghost"
                    onClick={() => toggleWishlist({ id: String(product.id), name: product.name, price: product.price, image: product.image, category: product.category })}
                    className={`absolute top-3 right-3 rounded-2xl h-9 w-9 shadow-md transition-all duration-300 ${
                      isInWishlist(String(product.id)) 
                        ? 'gradient-primary text-white border-0' 
                        : 'glass border border-white/50 text-foreground/50 hover:text-primary'
                    }`}
                    data-testid={`button-wishlist-${product.id}`}
                  >
                    <Heart className={`w-4 h-4 ${isInWishlist(String(product.id)) ? 'fill-white' : ''}`} />
                  </Button>
                </div>
                <CardContent className="p-3.5 md:p-4 flex flex-col flex-1">
                  <p className="text-[10px] md:text-xs text-primary/70 font-bold uppercase tracking-[0.15em] mb-0.5">{product.category}</p>
                  <Link href={`/product/${product.id}`}>
                    <h3 className="font-bold text-sm md:text-base mb-1.5 hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
                  </Link>
                  {reviewStats?.[product.id] && (
                    <div className="flex items-center gap-1 mb-1.5" data-testid={`rating-${product.id}`}>
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map(s => (
                          <Star key={s} className={`w-3 h-3 ${s <= Math.round(reviewStats[product.id].avgRating) ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/20'}`} />
                        ))}
                      </div>
                      <span className="text-[10px] text-muted-foreground font-medium">({reviewStats[product.id].count})</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 mb-3">
                    <p className="text-foreground font-bold text-lg md:text-xl">{product.price.toLocaleString('az-AZ')} ₼</p>
                    {product.oldPrice && <p className="text-muted-foreground/50 text-xs line-through">{product.oldPrice.toLocaleString('az-AZ')} ₼</p>}
                  </div>
                  <Button 
                    size="sm"
                    className="w-full rounded-xl gradient-primary text-white border-0 shadow-[0_6px_20px_rgba(0,0,0,0.06)] hover:shadow-lg hover:shadow-black/10 transition-all mt-auto text-xs md:text-sm active-press h-10"
                    onClick={() => addToCart({ id: String(product.id), name: product.name, price: product.price, image: product.image })}
                    data-testid={`button-add-cart-${product.id}`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5 mr-1.5" />
                    Səbətə Əlavə Et
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
