import { useState } from "react";
import { Link } from "wouter";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, CheckCircle, Loader2, Tag, X, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/context/CartContext";
import { useCreateOrder, useValidateCoupon } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function Cart() {
  const { items, updateQuantity, removeFromCart, total, clearCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  const { toast } = useToast();
  const createOrder = useCreateOrder();
  const validateCoupon = useValidateCoupon();

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountPercent: number } | null>(null);

  const [form, setForm] = useState({ customerName: "", customerEmail: "", customerPhone: "", address: "" });

  const [giftWrap, setGiftWrap] = useState(false);
  const [giftWrapStyle, setGiftWrapStyle] = useState("classic");
  const [giftMessage, setGiftMessage] = useState("");
  const giftWrapPrice = giftWrap ? (giftWrapStyle === "premium" ? 5 : 3) : 0;

  const WRAP_OPTIONS = [
    { value: "classic", label: "Klassik Çəhrayı", price: 3, emoji: "🎀" },
    { value: "premium", label: "Premium Qızılı", price: 5, emoji: "✨" },
  ];

  const shippingCost = total >= 50 ? 0 : 5;
  const discountAmount = appliedCoupon ? Math.round(total * appliedCoupon.discountPercent / 100) : 0;
  const grandTotal = total - discountAmount + shippingCost + giftWrapPrice;

  const handleInputChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    validateCoupon.mutate(couponCode.trim(), {
      onSuccess: (coupon) => {
        setAppliedCoupon({ code: coupon.code, discountPercent: coupon.discountPercent });
        setCouponCode("");
        toast({ title: "Kupon Tətbiq Edildi!", description: `%${coupon.discountPercent} endirim səbətinizə tətbiq edildi.` });
      },
      onError: (err: any) => {
        toast({ title: "Etibarsız Kupon", description: err.message || "Bu kupon kodu etibarsızdır.", variant: "destructive" });
      },
    });
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    toast({ title: "Kupon Silindi", description: "Endirim kuponu silindi." });
  };

  const handleSubmitOrder = async () => {
    if (!form.customerName || !form.customerEmail || !form.customerPhone || !form.address) {
      toast({ title: "Əksik Məlumat", description: "Zəhmət olmasa bütün sahələri doldurun.", variant: "destructive" });
      return;
    }
    const orderItems = items.map(item => ({ id: item.id, name: item.name, price: item.price, quantity: item.quantity }));
    const orderData: any = { products: orderItems };
    if (giftWrap) {
      orderData.giftWrap = { style: giftWrapStyle, message: giftMessage, price: giftWrapPrice };
    }
    if (appliedCoupon) {
      orderData.coupon = { code: appliedCoupon.code, discountPercent: appliedCoupon.discountPercent };
    }
    createOrder.mutate({
      customerName: form.customerName, customerEmail: form.customerEmail,
      customerPhone: form.customerPhone, address: form.address,
      items: JSON.stringify(orderData), total: grandTotal,
    }, {
      onSuccess: (data) => { setOrderSuccess(true); setOrderId(data.id); clearCart(); },
      onError: () => { toast({ title: "Xəta", description: "Sifariş yaradılarkən xəta baş verdi.", variant: "destructive" }); },
    });
  };

  if (orderSuccess) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center space-y-6 pt-24">
        <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-[18px] flex items-center justify-center text-white mb-4 animate-in zoom-in shadow-xl shadow-green-500/20">
          <CheckCircle className="w-14 h-14" />
        </div>
        <h1 className="text-3xl font-bold text-foreground" data-testid="text-order-success">Sifarişiniz Qəbul Edildi!</h1>
        <p className="text-muted-foreground max-w-md text-lg">Sifarişiniz uğurla yaradıldı. Ən qısa zamanda hazırlanıb kargoya veriləcəkdir.</p>
        {orderId && (
          <div className="glass px-6 py-3 rounded-2xl border border-white/50 shadow-sm">
            <p className="text-sm text-muted-foreground">Sifariş Nömrəniz: <span className="font-bold text-foreground" data-testid="text-order-id">#{orderId}</span></p>
          </div>
        )}
        <div className="flex gap-3">
          <Link href="/products">
            <Button size="lg" className="rounded-full h-12 px-8 gradient-primary text-white border-0 shadow-[0_8px_20px_rgba(0,0,0,0.06)]" data-testid="link-continue-shopping">Alış-verişə Davam Et</Button>
          </Link>
          <Link href="/order-tracking">
            <Button size="lg" variant="outline" className="rounded-full h-12 px-8 border-border/50" data-testid="link-track-order">Sifariş İzləmə</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center space-y-6 pt-24">
        <div className="w-24 h-24 bg-gradient-to-br from-accent to-secondary/50 rounded-[18px] flex items-center justify-center text-primary mb-4 shadow-lg">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-bold" data-testid="text-empty-cart">Səbətiniz Boşdur</h1>
        <p className="text-muted-foreground max-w-md">Sevdiklərinizi xoşbəxt edəcək gözəl hədiyyələri kəşf etməyə başlayın.</p>
        <Link href="/products">
          <Button size="lg" className="rounded-full mt-4 h-12 px-8 gradient-primary text-white border-0 shadow-[0_8px_20px_rgba(0,0,0,0.06)]" data-testid="link-start-shopping">Alış-verişə Başla</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 pt-24">
      <div className="container mx-auto max-w-5xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-10" data-testid="text-cart-title">
          Alış-veriş <span className="gradient-text italic">Səbətim</span>
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row glass-strong rounded-2xl p-4 border border-white/50 shadow-sm gap-4 items-center sm:items-stretch card-hover" data-testid={`cart-item-${item.id}`}>
                <Link href={`/product/${item.id}`} className="shrink-0">
                  <div className="w-24 h-24 bg-gradient-to-br [#FFF0F5] rounded-2xl overflow-hidden p-2">
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                  </div>
                </Link>
                <div className="flex flex-1 flex-col justify-between py-1 text-center sm:text-left">
                  <div>
                    <Link href={`/product/${item.id}`}>
                      <h3 className="font-serif text-base font-bold hover:text-primary transition-colors">{item.name}</h3>
                    </Link>
                    <p className="text-primary font-bold mt-0.5 text-sm">{item.price.toLocaleString('az-AZ')} ₼</p>
                  </div>
                  <div className="flex items-center justify-center sm:justify-between mt-3 w-full">
                    <div className="flex items-center glass rounded-full px-1 py-1 border border-white/50">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 rounded-full hover:bg-primary/10 flex items-center justify-center transition-colors" data-testid={`button-decrease-${item.id}`}>
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-bold text-sm" data-testid={`text-quantity-${item.id}`}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 rounded-full hover:bg-primary/10 flex items-center justify-center transition-colors" data-testid={`button-increase-${item.id}`}>
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-muted-foreground hover:text-destructive transition-colors ml-4 sm:ml-0 p-2 rounded-xl hover:bg-destructive/10" data-testid={`button-remove-${item.id}`}>
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="w-full lg:w-[400px] shrink-0">
            <div className="glass-strong rounded-[18px] p-6 md:p-8 sticky top-28 border border-white/50 shadow-xl shadow-black/3">
              {!showCheckout ? (
                <>
                  <h2 className="font-serif text-2xl font-bold mb-6">Sifariş Xülasəsi</h2>
                  {!appliedCoupon ? (
                    <div className="flex gap-2 mb-5" data-testid="coupon-input-area">
                      <div className="relative flex-1">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input placeholder="Kupon kodu" value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()} className="pl-9 rounded-full h-10 bg-white/60 text-sm border-border/40" data-testid="input-coupon" />
                      </div>
                      <Button variant="outline" size="sm" onClick={handleApplyCoupon} disabled={validateCoupon.isPending} className="rounded-full h-10 px-4 text-sm border-border/50" data-testid="button-apply-coupon">
                        {validateCoupon.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Tətbiq Et"}
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-full px-4 py-2 mb-5" data-testid="coupon-applied">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-semibold text-green-700">{appliedCoupon.code} (%{appliedCoupon.discountPercent})</span>
                      </div>
                      <button onClick={handleRemoveCoupon} className="text-green-600 hover:text-red-500 transition-colors" data-testid="button-remove-coupon"><X className="w-4 h-4" /></button>
                    </div>
                  )}
                  <div className="mb-5 rounded-2xl border border-white/50 overflow-hidden">
                    <button onClick={() => setGiftWrap(!giftWrap)} className={`w-full flex items-center justify-between p-3.5 transition-all ${giftWrap ? 'gradient-primary text-white' : 'glass hover:bg-white/50'}`} data-testid="button-gift-wrap">
                      <div className="flex items-center gap-2">
                        <Gift className="w-4 h-4" />
                        <span className="font-semibold text-sm">Hədiyyə Qablaşdırması</span>
                      </div>
                      <span className="text-xs font-semibold">{giftWrap ? 'Aktiv' : '3 ₼-dan'}</span>
                    </button>
                    {giftWrap && (
                      <div className="p-3.5 space-y-3 animate-in slide-in-from-top-2 fade-in duration-200 bg-white/40">
                        <div className="flex gap-2">
                          {WRAP_OPTIONS.map(opt => (
                            <button key={opt.value} onClick={() => setGiftWrapStyle(opt.value)} className={`flex-1 p-2.5 rounded-xl text-center transition-all text-xs border ${giftWrapStyle === opt.value ? 'border-primary bg-primary/10 font-bold' : 'border-border/30 hover:border-primary/30'}`} data-testid={`wrap-${opt.value}`}>
                              <span className="text-base block mb-0.5">{opt.emoji}</span>
                              <span className="block">{opt.label}</span>
                              <span className="text-primary font-bold">{opt.price} ₼</span>
                            </button>
                          ))}
                        </div>
                        <Input placeholder="Hədiyyə mesajınız (isteğe bağlı)" value={giftMessage} onChange={(e) => setGiftMessage(e.target.value)} className="rounded-xl h-10 bg-white/60 text-sm border-border/40" data-testid="input-gift-message" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-3 mb-6 text-sm">
                    <div className="flex justify-between text-muted-foreground"><span>Ara Cəm</span><span>{total.toLocaleString('az-AZ')} ₼</span></div>
                    {discountAmount > 0 && (<div className="flex justify-between text-green-600 font-medium"><span>Endirim</span><span data-testid="text-discount">-{discountAmount.toLocaleString('az-AZ')} ₼</span></div>)}
                    {giftWrapPrice > 0 && (<div className="flex justify-between text-pink-600 font-medium"><span>Hədiyyə Qablaşdırması</span><span data-testid="text-gift-wrap-price">{giftWrapPrice} ₼</span></div>)}
                    <div className="flex justify-between text-muted-foreground"><span>Çatdırılma</span><span>{shippingCost === 0 ? "Pulsuz" : "5 ₼"}</span></div>
                    {total < 50 && (<p className="text-xs text-primary/80 italic mt-1">Daha {(50 - total).toLocaleString('az-AZ')} ₼ alış-veriş edərək çatdırılmanı pulsuz edə bilərsiniz!</p>)}
                  </div>
                  <div className="border-t border-border/30 pt-4 mb-6">
                    <div className="flex justify-between items-center text-lg font-bold"><span>Cəmi</span><span className="gradient-text text-2xl" data-testid="text-grand-total">{grandTotal.toLocaleString('az-AZ')} ₼</span></div>
                    <p className="text-xs text-muted-foreground mt-2 text-right">ƏDV Daxildir</p>
                  </div>
                  <Button className="w-full h-14 rounded-full text-lg gradient-primary text-white border-0 shadow-xl shadow-black/8 hover:shadow-2xl hover:shadow-black/12 transition-all" onClick={() => setShowCheckout(true)} data-testid="button-checkout">
                    Sifarişi Tamamla <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-serif text-xl font-bold">Çatdırılma Məlumatları</h2>
                    <button onClick={() => setShowCheckout(false)} className="text-sm text-primary font-semibold hover:underline" data-testid="button-back-to-summary">Geri</button>
                  </div>
                  <div className="space-y-4 mb-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Ad Soyad</Label>
                      <Input placeholder="Adınız və Soyadınız" value={form.customerName} onChange={(e) => handleInputChange("customerName", e.target.value)} className="rounded-xl h-12 bg-white/60 border-border/40" data-testid="input-name" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">E-poçt</Label>
                      <Input type="email" placeholder="numune@email.com" value={form.customerEmail} onChange={(e) => handleInputChange("customerEmail", e.target.value)} className="rounded-xl h-12 bg-white/60 border-border/40" data-testid="input-email" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Telefon</Label>
                      <Input type="tel" placeholder="050 XXX XX XX" value={form.customerPhone} onChange={(e) => handleInputChange("customerPhone", e.target.value)} className="rounded-xl h-12 bg-white/60 border-border/40" data-testid="input-phone" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Çatdırılma Ünvanı</Label>
                      <textarea placeholder="Tam ünvanınızı yazın..." value={form.address} onChange={(e) => handleInputChange("address", e.target.value)} className="w-full min-h-[100px] rounded-xl p-4 bg-white/60 border border-input text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring" data-testid="input-address" />
                    </div>
                  </div>
                  <div className="border-t border-border/30 pt-4 mb-6">
                    <div className="flex justify-between items-center font-bold"><span>Cəmi</span><span className="gradient-text text-xl" data-testid="text-checkout-total">{grandTotal.toLocaleString('az-AZ')} ₼</span></div>
                  </div>
                  <Button className="w-full h-14 rounded-full text-lg gradient-primary text-white border-0 shadow-xl shadow-black/8" onClick={handleSubmitOrder} disabled={createOrder.isPending} data-testid="button-submit-order">
                    {createOrder.isPending ? (<><Loader2 className="w-5 h-5 mr-2 animate-spin" />Sifariş Yaradılır...</>) : (<>Sifarişi Təsdiqlə <ArrowRight className="w-5 h-5 ml-2" /></>)}
                  </Button>
                </>
              )}
              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span>Təhlükəsiz 256-bit SSL Ödəniş</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
