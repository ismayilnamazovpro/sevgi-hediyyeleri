import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { ShoppingBag, Heart, Home, Gift, Info, Phone, ArrowLeft, Package, Sparkles, Percent, HelpCircle, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { itemCount } = useCart();
  const { itemCount: wishlistCount } = useWishlist();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
  }, [isMobileMenuOpen]);

  const goBack = () => window.history.back();

  const links = [
    { href: "/", label: "Ana Səhifə", icon: <Home className="w-5 h-5" /> },
    { href: "/products", label: "Kolleksiya", icon: <Gift className="w-5 h-5" /> },
    { href: "/sales", label: "Endirimlər", icon: <Percent className="w-5 h-5" /> },
    { href: "/gift-finder", label: "Hədiyyə Tapıcı", icon: <Sparkles className="w-5 h-5" /> },
    { href: "/order-tracking", label: "Sifariş İzləmə", icon: <Package className="w-5 h-5" /> },
    { href: "/about", label: "Haqqımızda", icon: <Info className="w-5 h-5" /> },
    { href: "/contact", label: "Əlaqə", icon: <Phone className="w-5 h-5" /> },
    { href: "/faq", label: "FAQ", icon: <HelpCircle className="w-5 h-5" /> },
  ];

  const bottomNavLinks = [
    { href: "/", label: "Ana Səhifə", icon: <Home className="w-[22px] h-[22px]" /> },
    { href: "/products", label: "Kolleksiya", icon: <Gift className="w-[22px] h-[22px]" /> },
    { href: "/wishlist", label: "Sevimlilər", icon: <Heart className="w-[22px] h-[22px]" /> },
    { href: "/cart", label: "Səbət", icon: <ShoppingBag className="w-[22px] h-[22px]" /> },
  ];

  return (
    <>
      <header className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-xl shadow-[0_1px_0_#EFEFEF] py-2" : "bg-transparent py-3"
      }`}>
        <div className="container mx-auto px-4 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2 z-50">
            {location !== "/" && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={goBack}
                className="lg:hidden rounded-full h-10 w-10 active-press hover:bg-[#FFF0F5]"
              >
                <ArrowLeft className="w-5 h-5 text-[#1F1F1F]" />
              </Button>
            )}

            <Link href="/" className="flex items-center gap-2.5 active-press">
              <div className="w-9 h-9 bg-[#FF4D8D] rounded-xl flex items-center justify-center">
                <Heart className="w-[18px] h-[18px] text-white fill-white/40" />
              </div>
              <span className={`font-bold text-[#1F1F1F] tracking-tight ${location !== "/" ? "text-lg hidden sm:block" : "text-xl"}`}>
                Eşq & Hədiyyə
              </span>
            </Link>
          </div>

          <nav className="hidden lg:flex items-center gap-1 bg-white rounded-full px-2 py-1.5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
            {links.map((link) => (
              <Link key={link.href} href={link.href}>
                <span className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  location === link.href 
                    ? "bg-[#FF4D8D] text-white" 
                    : "text-[#8A8A8A] hover:text-[#1F1F1F] hover:bg-[#F7F7F9]"
                }`}>
                  {link.label}
                </span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5 z-50">
            <Link href="/wishlist">
              <Button variant="ghost" size="icon" className="relative rounded-full h-10 w-10 active-press hover:bg-[#FFF0F5]" data-testid="link-wishlist">
                <Heart className="w-5 h-5 text-[#1F1F1F]" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-[18px] h-[18px] bg-[#FF4D8D] text-white text-[10px] font-bold rounded-full">
                    {wishlistCount}
                  </span>
                )}
              </Button>
            </Link>
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative rounded-full h-10 w-10 active-press hover:bg-[#FFF0F5]" data-testid="link-cart">
                <ShoppingBag className="w-5 h-5 text-[#1F1F1F]" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-[18px] h-[18px] bg-[#FF4D8D] text-white text-[10px] font-bold rounded-full">
                    {itemCount}
                  </span>
                )}
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden rounded-full h-10 w-10 active-press hover:bg-[#FFF0F5]"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white animate-in fade-in duration-200 lg:hidden flex flex-col pt-20 pb-8 px-5">
          <div className="flex-1 flex flex-col gap-1.5 pt-4">
            {links.map((link, index) => (
              <div 
                key={link.href}
                className="animate-in slide-in-from-bottom-2 fade-in"
                style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
              >
                <Link href={link.href}>
                  <span 
                    className={`flex items-center gap-3.5 py-3.5 px-5 rounded-[18px] text-[15px] font-medium transition-all active-press ${
                      location === link.href 
                        ? "bg-[#FFF0F5] text-[#FF4D8D]" 
                        : "text-[#1F1F1F] hover:bg-[#F7F7F9]"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.icon}
                    {link.label}
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="lg:hidden fixed bottom-0 left-0 w-full z-40">
        <div className="bg-white border-t border-[#EFEFEF] flex items-center justify-around py-2 px-2 pb-[max(env(safe-area-inset-bottom,8px),8px)]">
          {bottomNavLinks.map((link) => {
            const isActive = location === link.href;
            return (
              <Link key={link.href} href={link.href}>
                <div className={`flex flex-col items-center justify-center gap-1 px-5 py-1.5 rounded-2xl active-press transition-all duration-200 ${
                  isActive ? "bg-[#FFF0F5]" : ""
                }`}>
                  <div className="relative">
                    <div className={isActive ? "text-[#FF4D8D]" : "text-[#8A8A8A]"}>
                      {link.icon}
                    </div>
                    {link.href === "/wishlist" && wishlistCount > 0 && (
                      <span className="absolute -top-1 -right-2 flex items-center justify-center w-4 h-4 text-[9px] font-bold rounded-full bg-[#FF4D8D] text-white">
                        {wishlistCount}
                      </span>
                    )}
                    {link.href === "/cart" && itemCount > 0 && (
                      <span className="absolute -top-1 -right-2 flex items-center justify-center w-4 h-4 text-[9px] font-bold rounded-full bg-[#FF4D8D] text-white">
                        {itemCount}
                      </span>
                    )}
                  </div>
                  <span className={`text-[10px] font-medium leading-none ${isActive ? "text-[#FF4D8D]" : "text-[#8A8A8A]"}`}>{link.label}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
