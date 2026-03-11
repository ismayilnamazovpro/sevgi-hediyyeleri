import { useState } from "react";
import { Search, Package, Truck, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface OrderData { id: number; customerName: string; status: string; total: number; items: string; createdAt: string; }

const STATUS_STEPS = [
  { key: "pending", label: "Sifariş Qəbul Edildi", icon: Clock, desc: "Sifarişiniz uğurla qəbul edildi" },
  { key: "preparing", label: "Hazırlanır", icon: Package, desc: "Sifarişiniz diqqətlə hazırlanır" },
  { key: "shipped", label: "Kargoya Verilib", icon: Truck, desc: "Sifarişiniz yola çıxdı" },
  { key: "delivered", label: "Təslim Edildi", icon: CheckCircle, desc: "Sifarişiniz təslim edildi" },
];

export default function OrderTracking() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!orderId.trim()) return;
    setLoading(true); setError(""); setOrder(null);
    try {
      const res = await fetch(`/api/orders/${orderId.trim()}`);
      if (!res.ok) throw new Error();
      setOrder(await res.json());
    } catch { setError("Bu nömrəyə aid sifariş tapılmadı. Zəhmət olmasa sifariş nömrənizi yoxlayın."); }
    finally { setLoading(false); }
  };

  const getStatusIndex = (status: string) => { const idx = STATUS_STEPS.findIndex(s => s.key === status); return idx >= 0 ? idx : 0; };
  const parsedItems = order ? (() => { try { return JSON.parse(order.items); } catch { return []; } })() : [];

  return (
    <div className="min-h-screen py-12 px-4 pt-24">
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-10">
          <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-black/8">
            <Package className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2" data-testid="text-tracking-title">Sifariş İzləmə</h1>
          <p className="text-muted-foreground">Sifariş nömrənizi daxil edərək sifarişinizin vəziyyətini izləyin.</p>
        </div>

        <div className="flex gap-3 mb-8">
          <Input placeholder="Sifariş nömrəniz (məs: 1)" value={orderId} onChange={(e) => setOrderId(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} className="rounded-full h-12 bg-white/70 border-border/40" data-testid="input-order-id" />
          <Button onClick={handleSearch} disabled={loading} className="rounded-full h-12 px-6 shrink-0 gradient-primary text-white border-0 shadow-[0_8px_20px_rgba(0,0,0,0.06)]" data-testid="button-search-order">
            <Search className="w-5 h-5 mr-2" /> Sorğula
          </Button>
        </div>

        {error && <div className="bg-destructive/10 text-destructive p-4 rounded-2xl text-center text-sm mb-6" data-testid="text-order-error">{error}</div>}

        {order && (
          <div className="glass-strong rounded-[18px] p-6 md:p-8 border border-white/50 shadow-sm animate-in fade-in slide-in-from-bottom-4" data-testid="order-details">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/30">
              <div><p className="text-sm text-muted-foreground">Sifariş No</p><p className="text-2xl font-bold gradient-text" data-testid="text-order-number">#{order.id}</p></div>
              <div className="text-right"><p className="text-sm text-muted-foreground">Tarix</p><p className="font-semibold">{new Date(order.createdAt).toLocaleDateString('az-AZ')}</p></div>
            </div>

            <div className="mb-8">
              <h3 className="font-bold text-lg mb-6">Sifariş Vəziyyəti</h3>
              <div className="space-y-0">
                {STATUS_STEPS.map((step, idx) => {
                  const currentIdx = getStatusIndex(order.status);
                  const isCompleted = idx <= currentIdx;
                  const isCurrent = idx === currentIdx;
                  const Icon = step.icon;
                  return (
                    <div key={step.key} className="flex items-start gap-4" data-testid={`status-step-${step.key}`}>
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                          isCompleted ? 'gradient-primary text-white shadow-[0_6px_20px_rgba(0,0,0,0.06)]' : 'bg-muted text-muted-foreground'
                        } ${isCurrent ? 'ring-4 ring-primary/15 scale-110' : ''}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        {idx < STATUS_STEPS.length - 1 && <div className={`w-0.5 h-10 ${isCompleted ? 'bg-primary' : 'bg-muted'}`} />}
                      </div>
                      <div className="pb-6">
                        <p className={`font-bold text-sm ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>{step.label}</p>
                        <p className="text-xs text-muted-foreground">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {parsedItems.length > 0 && (
              <div className="border-t border-border/30 pt-4">
                <h3 className="font-bold text-lg mb-4">Sifariş Tərkibi</h3>
                <div className="space-y-3">
                  {parsedItems.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center text-sm glass p-3 rounded-xl border border-white/50">
                      <span className="font-medium">{item.name} <span className="text-muted-foreground">x{item.quantity}</span></span>
                      <span className="font-bold">{(item.price * item.quantity).toLocaleString('az-AZ')} ₼</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-border/30 font-bold">
                  <span>Cəmi</span>
                  <span className="gradient-text text-lg" data-testid="text-order-total">{order.total.toLocaleString('az-AZ')} ₼</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
