import { useState } from "react";
import { Phone, Mail, MapPin, Send, Clock, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast({ title: "Əksik Məlumat", description: "Zəhmət olmasa tələb olunan sahələri doldurun.", variant: "destructive" });
      return;
    }
    setSending(true);
    await new Promise(r => setTimeout(r, 1000));
    setSending(false);
    toast({ title: "Mesajınız Göndərildi!", description: "Ən qısa zamanda sizə geri dönəcəyik." });
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-black/8">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3" data-testid="text-contact-title">Bizimlə Əlaqə</h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">Suallarınız, təklifləriniz və ya xüsusi sifarişləriniz üçün bizimlə əlaqə saxlaya bilərsiniz.</p>
        </div>

        <div className="grid md:grid-cols-5 gap-6">
          <div className="md:col-span-2 space-y-3">
            {[
              { icon: Phone, label: "Telefon", value: "+994 (50) 123 45 67", sub: "Bazar ertəsi - Şənbə, 09:00 - 18:00", gradient: "from-pink-500 to-pink-400" },
              { icon: Mail, label: "E-poçt", value: "info@esqvehediyye.az", sub: "24 saat ərzində cavab", gradient: "from-pink-500 to-rose-400" },
              { icon: MapPin, label: "Ünvan", value: "Nizami küç. 123", sub: "Bakı, Azərbaycan", gradient: "from-rose-500 to-pink-400" },
              { icon: Clock, label: "İş Saatları", value: "09:00 - 18:00", sub: "Bazar günü istisna olmaqla hər gün", gradient: "from-rose-500 to-pink-400" },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex items-start gap-4 glass-strong p-5 rounded-2xl border border-white/50 card-hover" data-testid={`contact-info-${idx}`}>
                  <div className={`bg-gradient-to-br ${item.gradient} p-3 rounded-xl text-white shrink-0 shadow-md`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium mb-0.5">{item.label}</p>
                    <p className="font-bold text-sm">{item.value}</p>
                    <p className="text-xs text-muted-foreground">{item.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="md:col-span-3 glass-strong p-6 md:p-8 rounded-[18px] border border-white/50 shadow-sm">
            <h2 className="font-bold text-xl mb-6">Mesaj Göndərin</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Ad Soyad *</Label>
                  <Input value={form.name} onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Adınız" className="rounded-xl h-11 bg-white/60 border-border/40" data-testid="input-contact-name" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">E-poçt *</Label>
                  <Input type="email" value={form.email} onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))} placeholder="numune@email.com" className="rounded-xl h-11 bg-white/60 border-border/40" data-testid="input-contact-email" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Mövzu</Label>
                <Input value={form.subject} onChange={(e) => setForm(p => ({ ...p, subject: e.target.value }))} placeholder="Mesajınızın mövzusu" className="rounded-xl h-11 bg-white/60 border-border/40" data-testid="input-contact-subject" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Mesajınız *</Label>
                <textarea value={form.message} onChange={(e) => setForm(p => ({ ...p, message: e.target.value }))} placeholder="Mesajınızı yazın..." rows={5} className="w-full rounded-xl p-4 bg-white/60 border border-input text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring" data-testid="input-contact-message" />
              </div>
              <Button type="submit" disabled={sending} className="w-full h-12 rounded-full text-base gradient-primary text-white border-0 shadow-xl shadow-black/8" data-testid="button-send-message">
                {sending ? "Göndərilir..." : (<><Send className="w-4 h-4 mr-2" /> Mesaj Göndər</>)}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
