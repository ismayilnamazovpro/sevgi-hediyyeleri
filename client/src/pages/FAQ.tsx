import { useState } from "react";
import { ChevronDown, HelpCircle, Truck, CreditCard, RotateCcw, Gift, Shield, Clock } from "lucide-react";

const FAQ_SECTIONS = [
  {
    title: "Çatdırılma",
    icon: Truck,
    gradient: "from-pink-500 to-rose-400",
    questions: [
      { q: "Çatdırılma nə qədər vaxt alır?", a: "Bakı daxili sifarişlər 1-2 iş günü, regionlara çatdırılma isə 2-4 iş günü ərzində həyata keçirilir. Saat 15:00-a qədər verilən sifarişlər eyni gün kargoya təhvil verilir." },
      { q: "Çatdırılma haqqı nə qədərdir?", a: "50 ₼ və üzəri sifarişlərdə çatdırılma pulsuzdur. 50 ₼-dan aşağı sifarişlər üçün çatdırılma haqqı 5 ₼-dır." },
      { q: "Sifarişimi izləyə bilərəm?", a: "Bəli! Sifarişiniz təsdiqlənəndən sonra sifariş nömrəniz ilə 'Sifariş İzləmə' səhifəsindən canlı olaraq izləyə bilərsiniz." },
      { q: "Hansı şəhərlərə çatdırılma edirsiniz?", a: "Hazırda Azərbaycanın 50-dən çox şəhər və rayonuna çatdırılma xidməti göstəririk. Sifarişinizi verərkən ünvanınızı daxil etməyiniz kifayətdir." },
    ],
  },
  {
    title: "Ödəniş",
    icon: CreditCard,
    gradient: "from-pink-500 to-rose-400",
    questions: [
      { q: "Hansı ödəniş üsullarını qəbul edirsiniz?", a: "Visa, Mastercard kredit/debit kartları, bank köçürməsi və qapıda nağd ödəniş seçimləri mövcuddur." },
      { q: "Ödənişim təhlükəsizdirmi?", a: "Bəli! Bütün ödənişlər 256-bit SSL şifrələmə ilə qorunur. Kart məlumatlarınız heç vaxt serverimizdə saxlanılmır." },
      { q: "Taksit seçimi varmı?", a: "Hazırda taksit seçimi mövcud deyil, lakin müxtəlif endirim kuponlarımızdan yararlana bilərsiniz." },
    ],
  },
  {
    title: "Qaytarma və Dəyişdirmə",
    icon: RotateCcw,
    gradient: "from-pink-500 to-rose-400",
    questions: [
      { q: "Məhsulu qaytara bilərəm?", a: "Bəli! Məhsulu aldıqdan sonra 14 gün ərzində, istifadə edilməmiş və orijinal qablaşdırmasında olması şərti ilə qaytara bilərsiniz." },
      { q: "Qaytarma prosesi necə işləyir?", a: "Əlaqə səhifəsindən bizimlə əlaqə saxlayın, sifariş nömrənizi və qaytarma səbəbini bildirin. Kuryer məhsulu sizdən götürəcək və 3-5 iş günü ərzində geri ödəniş ediləcək." },
      { q: "Zədələnmiş məhsul gəlsə nə edim?", a: "Zədələnmiş və ya səhv göndərilmiş məhsullar üçün 48 saat ərzində bizimlə əlaqə saxlayın. Pulsuz dəyişdirmə və ya tam geri ödəniş təmin edirik." },
    ],
  },
  {
    title: "Hədiyyə Qablaşdırması",
    icon: Gift,
    gradient: "from-rose-500 to-pink-400",
    questions: [
      { q: "Hədiyyə qablaşdırması seçimi varmı?", a: "Bəli! Sifarişi tamamlayarkən hədiyyə qablaşdırması seçimini aktivləşdirə bilərsiniz. Müxtəlif dizayn seçimləri və fərdi mesaj kartı əlavə edə bilərsiniz." },
      { q: "Hədiyyə qablaşdırması əlavə ödənişlidirmi?", a: "Standart qablaşdırma pulsuzdur. Premium qablaşdırma seçimləri 3 ₼-dan başlayır." },
    ],
  },
  {
    title: "Təhlükəsizlik",
    icon: Shield,
    gradient: "from-pink-600 to-rose-400",
    questions: [
      { q: "Şəxsi məlumatlarım necə qorunur?", a: "Məlumatlarınız GDPR standartlarına uyğun olaraq qorunur. Heç bir məlumatınız üçüncü tərəflərlə paylaşılmır." },
      { q: "Saxtakarlığa qarşı nə tədbirlər görülüb?", a: "3D Secure doğrulama, SSL şifrələmə və fraud-detection sistemlərimiz aktiv şəkildə işləyir." },
    ],
  },
];

export default function FAQ() {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggle = (key: string) => {
    setOpenItems(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <div className="min-h-screen py-12 px-4 pt-24">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-12">
          <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-black/8">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3" data-testid="text-faq-title">
            Tez-tez Verilən <span className="gradient-text italic">Suallar</span>
          </h1>
          <p className="text-muted-foreground text-lg">Suallarınıza burada cavab tapa bilərsiniz.</p>
        </div>

        <div className="space-y-6">
          {FAQ_SECTIONS.map((section, sIdx) => {
            const Icon = section.icon;
            return (
              <div key={sIdx} className="glass-strong rounded-[18px] border border-white/50 overflow-hidden shadow-sm" data-testid={`faq-section-${sIdx}`}>
                <div className="flex items-center gap-3 p-5 pb-3">
                  <div className={`w-10 h-10 bg-gradient-to-br ${section.gradient} rounded-xl flex items-center justify-center text-white shadow-md shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h2 className="font-bold text-lg">{section.title}</h2>
                </div>
                <div className="px-5 pb-5 space-y-1">
                  {section.questions.map((item, qIdx) => {
                    const key = `${sIdx}-${qIdx}`;
                    const isOpen = openItems.has(key);
                    return (
                      <div key={qIdx} data-testid={`faq-item-${key}`}>
                        <button onClick={() => toggle(key)} className="w-full flex items-center justify-between py-3 px-4 rounded-xl text-left hover:bg-white/50 transition-colors">
                          <span className="font-semibold text-sm pr-4">{item.q}</span>
                          <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isOpen && (
                          <div className="px-4 pb-3 animate-in slide-in-from-top-2 fade-in duration-200">
                            <p className="text-sm text-muted-foreground leading-relaxed pl-0">{item.a}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
