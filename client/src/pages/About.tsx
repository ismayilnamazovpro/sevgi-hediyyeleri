import { Heart, Star, Truck, Shield, Gift, Users } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen pt-24 pb-12">
      <section className="px-4 pb-16">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center rounded-full gradient-primary px-4 py-1.5 text-xs font-bold text-white mb-6 shadow-[0_6px_20px_rgba(0,0,0,0.06)]">
            <Heart className="mr-2 h-3 w-3 fill-white/50" />
            Hekayəmiz
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6" data-testid="text-about-title">
            Sevgi ilə Qurulan <span className="gradient-text italic">Bir Brend</span>
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
            2023-cü ildə qurulan Eşq & Hədiyyə, sevdiklərinizə ən xüsusi anlarda unudulmaz hədiyyələr təqdim etmə arzusu ilə yola çıxdı. 
            Hər bir məhsulumuz eşqi və sevgini ən gözəl şəkildə ifadə etmək üçün diqqətlə seçilir.
          </p>
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-12">Niyə <span className="gradient-text italic">Biz?</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: Gift, title: "Diqqətlə Seçilmiş", desc: "Hər məhsul keyfiyyət və estetik standartlarımıza uyğun titizliklə seçilir.", gradient: "from-rose-500 to-pink-400" },
              { icon: Truck, title: "Sürətli Çatdırılma", desc: "Sifarişləriniz eyni gün kargoya verilir, 1-3 iş günü ərzində qapınızdadır.", gradient: "from-pink-400 to-rose-400" },
              { icon: Shield, title: "Təhlükəsiz Alış-veriş", desc: "256-bit SSL şifrələmə ilə təhlükəsiz ödəniş infrastrukturu.", gradient: "from-pink-500 to-pink-400" },
              { icon: Star, title: "Müştəri Məmnuniyyəti", desc: "Minlərlə xoşbəxt müştəri və %98 məmnuniyyət nisbəti.", gradient: "from-rose-500 to-pink-400" },
              { icon: Heart, title: "Xüsusi Qablaşdırma", desc: "Hər hədiyyə zərif və xüsusi dizayn qutularda təqdim olunur.", gradient: "from-pink-500 to-rose-400" },
              { icon: Users, title: "7/24 Dəstək", desc: "Suallarınız üçün hər zaman yanınızdayıq.", gradient: "from-pink-500 to-rose-400" },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="glass-strong p-6 rounded-[18px] border border-white/50 text-center card-hover" data-testid={`about-feature-${idx}`}>
                  <div className={`w-14 h-14 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-6">Missiyamız</h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-10">
            İnsanların sevdiklərinə hisslərini ən gözəl şəkildə ifadə etmələrinə kömək etmək. 
            Hər bir hədiyyə bir təbəssüm, bir xoşbəxtlik göz yaşı və unudulmaz bir an yaratmaq gücünə malikdir.
          </p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: "500+", label: "Məhsul Çeşidi" },
              { value: "10K+", label: "Xoşbəxt Müştəri" },
              { value: "50+", label: "Şəhərə Çatdırılma" },
            ].map((stat, i) => (
              <div key={i} className="glass-strong p-5 rounded-2xl border border-white/50">
                <p className="text-3xl md:text-4xl font-bold gradient-text mb-1" data-testid={`stat-${["products","customers","cities"][i]}`}>{stat.value}</p>
                <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
