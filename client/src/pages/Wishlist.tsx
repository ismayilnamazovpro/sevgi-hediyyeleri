import { Link } from "wouter";
import { Heart, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

export default function Wishlist() {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center space-y-6 pt-24">
        <div className="w-24 h-24 bg-gradient-to-br from-accent to-secondary/50 rounded-[18px] flex items-center justify-center text-primary mb-4 shadow-lg">
          <Heart className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-bold" data-testid="text-empty-wishlist">Sevimli Siyahınız Boşdur</h1>
        <p className="text-muted-foreground max-w-md">
          Bəyəndiyiniz məhsulları ürək ikonuna klikləyərək sevimlilərinizə əlavə edə bilərsiniz.
        </p>
        <Link href="/products">
          <Button size="lg" className="rounded-full mt-4 h-12 px-8 gradient-primary text-white border-0 shadow-[0_8px_20px_rgba(0,0,0,0.06)]" data-testid="link-browse-products">
            Məhsulları Kəşf Et
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 pt-24">
      <div className="container mx-auto max-w-5xl">
        <div className="flex items-center gap-3 mb-10">
          <div className="p-2 gradient-primary rounded-xl shadow-[0_6px_20px_rgba(0,0,0,0.06)]">
            <Heart className="w-5 h-5 text-white fill-white/50" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">Sevimlilərim</h1>
          <span className="glass px-3 py-1 rounded-xl text-primary text-sm font-bold border border-white/50">{items.length}</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden group border-0 shadow-sm card-hover bg-white rounded-[18px] flex flex-col" data-testid={`card-wishlist-${item.id}`}>
              <div className="relative aspect-square overflow-hidden bg-gradient-to-br [#FFF0F5] p-4">
                <Link href={`/product/${item.id}`}>
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-md" />
                </Link>
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="absolute top-3 right-3 p-2 rounded-2xl glass border border-white/50 text-muted-foreground hover:bg-destructive hover:text-white hover:border-destructive transition-all shadow-sm"
                  data-testid={`button-remove-wishlist-${item.id}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <CardContent className="p-3.5 md:p-4 flex flex-col flex-1">
                <Link href={`/product/${item.id}`}>
                  <h3 className="font-bold text-sm md:text-base mb-1.5 hover:text-primary transition-colors line-clamp-1">{item.name}</h3>
                </Link>
                <p className="text-foreground font-bold text-lg mb-3">{item.price.toLocaleString('az-AZ')} ₼</p>
                <Button
                  size="sm"
                  className="w-full rounded-xl gradient-primary text-white border-0 shadow-[0_6px_20px_rgba(0,0,0,0.06)] hover:shadow-lg transition-all mt-auto text-xs md:text-sm active-press h-10"
                  onClick={() => addToCart({ id: item.id, name: item.name, price: item.price, image: item.image })}
                  data-testid={`button-add-cart-wishlist-${item.id}`}
                >
                  <ShoppingBag className="w-3.5 h-3.5 mr-1.5" />
                  Səbətə Əlavə Et
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
