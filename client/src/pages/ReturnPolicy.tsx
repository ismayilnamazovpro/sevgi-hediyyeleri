import { RotateCcw, CheckCircle, Clock, AlertTriangle, Phone } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function ReturnPolicy() {
  return (
    <div className="min-h-screen py-12 px-4 pt-24">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-12">
          <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-black/8">
            <RotateCcw className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3" data-testid="text-return-title">
            Qaytarma və <span className="gradient-text italic">Dəyişdirmə</span>
          </h1>
          <p className="text-muted-foreground text-lg">Müştəri məmnuniyyəti bizim üçün hər şeydən vacibdir.</p>
        </div>

        <div className="space-y-6">
          <div className="glass-strong rounded-[18px] p-6 md:p-8 border border-white/50 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-400 rounded-xl flex items-center justify-center text-white shadow-sm">
                <CheckCircle className="w-5 h-5" />
              </div>
              <h2 className="font-bold text-xl">Qaytarma Şərtləri</h2>
            </div>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {[
                "Məhsul alındıqdan sonra 14 gün ərzində qaytarıla bilər.",
                "Məhsul istifadə edilməmiş və orijinal qablaşdırmasında olmalıdır.",
                "Hədiyyə qablaşdırması açılmış məhsullar qaytarıla bilər, lakin qablaşdırma haqqı geri qaytarılmır.",
                "Fərdiləşdirilmiş (ad həkk edilmiş) məhsullar qaytarıla bilməz.",
                "Çiçəklər və qida məhsulları gigiyenik səbəblərə görə qaytarıla bilməz.",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-strong rounded-[18px] p-6 md:p-8 border border-white/50 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-400 rounded-xl flex items-center justify-center text-white shadow-sm">
                <Clock className="w-5 h-5" />
              </div>
              <h2 className="font-bold text-xl">Qaytarma Prosesi</h2>
            </div>
            <div className="space-y-4">
              {[
                { step: "1", title: "Əlaqə Saxlayın", desc: "Əlaqə səhifəmiz və ya telefon vasitəsilə qaytarma istəyinizi bildirin." },
                { step: "2", title: "Təsdiq Alın", desc: "Komandamız 24 saat ərzində qaytarma müraciətinizi nəzərdən keçirəcək." },
                { step: "3", title: "Məhsulu Göndərin", desc: "Kuryer məhsulu ünvanınızdan pulsuz olaraq götürəcək." },
                { step: "4", title: "Geri Ödəniş", desc: "Məhsul alındıqdan sonra 3-5 iş günü ərzində geri ödəniş ediləcək." },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4" data-testid={`return-step-${i}`}>
                  <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm">{item.step}</div>
                  <div>
                    <h4 className="font-bold text-sm">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-strong rounded-[18px] p-6 md:p-8 border border-white/50 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-400 rounded-xl flex items-center justify-center text-white shadow-sm">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h2 className="font-bold text-xl">Zəmanət</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Bütün zərgərlik məhsullarımız 6 ay, digər məhsullar isə 30 gün zəmanət ilə satılır. 
              Zəmanət müddəti ərzində istehsal qüsuru aşkar edilərsə, pulsuz dəyişdirmə və ya geri ödəniş edilir.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Zədələnmiş və ya səhv göndərilmiş məhsullar üçün çatdırılmadan sonra 48 saat ərzində bizimlə əlaqə saxlamanız xahiş olunur.
            </p>
          </div>

          <div className="text-center mt-8">
            <p className="text-muted-foreground text-sm mb-4">Suallarınız var? Bizimlə əlaqə saxlayın.</p>
            <Link href="/contact">
              <Button className="rounded-full px-8 h-12 gradient-primary text-white border-0 shadow-[0_8px_20px_rgba(0,0,0,0.06)]" data-testid="link-contact-returns">
                <Phone className="w-4 h-4 mr-2" /> Əlaqə Saxlayın
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
