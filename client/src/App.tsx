import { Switch, Route, useLocation, Link } from "wouter";
import { useEffect, useState, useRef } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { RecentlyViewedProvider } from "@/context/RecentlyViewedContext";
import { Instagram, Twitter, Facebook, Phone, Mail, Heart } from "lucide-react";

import { Navbar } from "@/components/layout/Navbar";

import Home from "@/pages/Home";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import Cart from "@/pages/Cart";
import Wishlist from "@/pages/Wishlist";
import OrderTracking from "@/pages/OrderTracking";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import GiftFinder from "@/pages/GiftFinder";
import Sales from "@/pages/Sales";
import FAQ from "@/pages/FAQ";
import ReturnPolicy from "@/pages/ReturnPolicy";
import NotFound from "@/pages/not-found";

function PageTransition({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitioning, setTransitioning] = useState(false);
  const prevLocation = useRef(location);

  useEffect(() => {
    if (location !== prevLocation.current) {
      prevLocation.current = location;
      setTransitioning(true);
      window.scrollTo({ top: 0, behavior: 'instant' });

      const timeout = setTimeout(() => {
        setDisplayChildren(children);
        setTransitioning(false);
      }, 150);

      return () => clearTimeout(timeout);
    } else {
      setDisplayChildren(children);
    }
  }, [location, children]);

  return (
    <div
      className={`transition-all duration-300 ease-out ${
        transitioning ? "opacity-0 translate-y-3" : "opacity-100 translate-y-0"
      }`}
    >
      {displayChildren}
    </div>
  );
}

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location]);
  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/products" component={Products} />
      <Route path="/product/:id" component={ProductDetail} />
      <Route path="/cart" component={Cart} />
      <Route path="/wishlist" component={Wishlist} />
      <Route path="/order-tracking" component={OrderTracking} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/gift-finder" component={GiftFinder} />
      <Route path="/sales" component={Sales} />
      <Route path="/faq" component={FAQ} />
      <Route path="/return-policy" component={ReturnPolicy} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <WishlistProvider>
          <RecentlyViewedProvider>
          <TooltipProvider>
            <div className="flex flex-col min-h-screen relative">
              <Navbar />
              <ScrollToTop />
              
              <main className="flex-grow pb-20 md:pb-0">
                <PageTransition>
                  <Router />
                </PageTransition>
              </main>
              
              <footer className="border-t border-[#EFEFEF] pt-12 pb-28 md:pb-12 mt-12 bg-white">
                <div className="container mx-auto px-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-center md:text-left">
                    
                    <div className="space-y-3 flex flex-col items-center md:items-start">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#FF4D8D] rounded-xl flex items-center justify-center">
                          <Heart className="w-4 h-4 text-white fill-white/40" />
                        </div>
                        <span className="text-xl font-bold text-[#1F1F1F]">
                          Eşq & Hədiyyə
                        </span>
                      </div>
                      <p className="text-[#8A8A8A] text-sm max-w-xs leading-relaxed">
                        Ən xüsusi anlarınızı taçlandıracaq, sevgi ilə seçilmiş bənzərsiz hədiyyə kolleksiyası.
                      </p>
                    </div>

                    <div className="flex flex-col items-center md:items-start space-y-2">
                      <h4 className="font-semibold text-xs uppercase tracking-widest text-[#8A8A8A] mb-1">Faydalı Keçidlər</h4>
                      {[
                        { href: "/sales", label: "Endirimlər" },
                        { href: "/gift-finder", label: "Hədiyyə Tapıcı" },
                        { href: "/faq", label: "Tez-tez Soruşulan Suallar" },
                        { href: "/return-policy", label: "Qaytarma Siyasəti" },
                        { href: "/order-tracking", label: "Sifariş İzləmə" },
                      ].map(link => (
                        <Link key={link.href} href={link.href}>
                          <span className="text-sm text-[#8A8A8A] hover:text-[#FF4D8D] transition-colors cursor-pointer" data-testid={`footer-link-${link.href.slice(1)}`}>{link.label}</span>
                        </Link>
                      ))}
                    </div>
                    
                    <div className="flex flex-col items-center space-y-3">
                      <h4 className="font-semibold text-xs uppercase tracking-widest text-[#8A8A8A]">Bizi İzləyin</h4>
                      <div className="flex gap-2.5">
                        {[
                          { icon: Instagram, label: "instagram" },
                          { icon: Twitter, label: "twitter" },
                          { icon: Facebook, label: "facebook" },
                        ].map(({ icon: Icon, label }) => (
                          <a key={label} href="#" className="w-10 h-10 rounded-full bg-[#F7F7F9] flex items-center justify-center text-[#8A8A8A] hover:bg-[#FFF0F5] hover:text-[#FF4D8D] transition-all duration-200" data-testid={`link-${label}`}>
                            <Icon className="w-4 h-4" />
                          </a>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center md:items-end space-y-2 text-sm text-[#8A8A8A]">
                      <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-[#FF4D8D]" /> +994 (50) 123 45 67</p>
                      <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-[#FF4D8D]" /> info@esqvehediyye.az</p>
                    </div>
                    
                  </div>
                  
                  <div className="border-t border-[#EFEFEF] pt-6 text-center text-[#8A8A8A] text-xs">
                    <p>© {new Date().getFullYear()} Eşq & Hədiyyə. Bütün hüquqlar qorunur.</p>
                  </div>
                </div>
              </footer>
            </div>
            <Toaster />
          </TooltipProvider>
          </RecentlyViewedProvider>
        </WishlistProvider>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
