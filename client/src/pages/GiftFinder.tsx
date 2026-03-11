import { useState } from "react";
import { Link } from "wouter";
import { Heart, Gift, Users, Wallet, Sparkles, ArrowRight, ArrowLeft, ShoppingBag, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useProducts } from "@/lib/api";
import { useCart } from "@/context/CartContext";

const QUESTIONS = [
  {
    id: "recipient",
    question: "Hədiyyəni kimə alırsınız?",
    icon: Users,
    options: [
      { value: "sevgili", label: "Sevgilimə", emoji: "💕" },
      { value: "ana", label: "Anama", emoji: "👩" },
      { value: "rəfiqə", label: "Rəfiqəmə", emoji: "👯‍♀️" },
      { value: "həyat yoldaşı", label: "Həyat Yoldaşıma", emoji: "💍" },
    ],
  },
  {
    id: "occasion",
    question: "Hansı münasibət üçün?",
    icon: Sparkles,
    options: [
      { value: "sevgililər", label: "Sevgililər Günü", emoji: "❤️" },
      { value: "ad günü", label: "Ad Günü", emoji: "🎂" },
      { value: "ildönümü", label: "İldönümü", emoji: "🎉" },
      { value: "sürpriz", label: "Sürpriz", emoji: "🎁" },
    ],
  },
  {
    id: "budget",
    question: "Büdcəniz nə qədərdir?",
    icon: Wallet,
    options: [
      { value: "low", label: "50 ₼-a qədər", emoji: "💰" },
      { value: "mid", label: "50 - 100 ₼", emoji: "💰💰" },
      { value: "high", label: "100 - 200 ₼", emoji: "💰💰💰" },
      { value: "premium", label: "200 ₼+", emoji: "✨" },
    ],
  },
  {
    id: "style",
    question: "Hansı tip hədiyyəni üstün tutursunuz?",
    icon: Gift,
    options: [
      { value: "romantik", label: "Romantik", emoji: "🌹" },
      { value: "praktik", label: "Praktik", emoji: "🎯" },
      { value: "lüks", label: "Lüks & Zərif", emoji: "💎" },
      { value: "şirin", label: "Şirin & Oyunbaz", emoji: "🧸" },
    ],
  },
];

function getRecommendations(answers: Record<string, string>, products: any[]) {
  let scored = products.map(p => {
    let score = 0;
    const budget = answers.budget;
    if (budget === "low" && p.price <= 50) score += 3;
    else if (budget === "mid" && p.price > 50 && p.price <= 100) score += 3;
    else if (budget === "high" && p.price > 100 && p.price <= 200) score += 3;
    else if (budget === "premium" && p.price > 200) score += 3;

    const style = answers.style;
    if (style === "romantik" && (p.category === "Güllər" || p.category === "Zərgərlik")) score += 2;
    if (style === "praktik" && (p.category === "Kosmetika" || p.category === "Hədiyyə")) score += 2;
    if (style === "lüks" && (p.category === "Zərgərlik" || p.category === "Kosmetika")) score += 2;
    if (style === "şirin" && (p.category === "Hədiyyə" || p.category === "Ləzzət")) score += 2;

    if (p.isPopular) score += 1;
    return { ...p, score };
  });
  return scored.sort((a, b) => b.score - a.score).slice(0, 4);
}

export default function GiftFinder() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const { data: products } = useProducts();
  const { addToCart } = useCart();

  const handleAnswer = (questionId: string, value: string) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    if (step < QUESTIONS.length - 1) {
      setTimeout(() => setStep(step + 1), 300);
    } else {
      setTimeout(() => setShowResults(true), 300);
    }
  };

  const restart = () => {
    setStep(0);
    setAnswers({});
    setShowResults(false);
  };

  const recommendations = showResults && products ? getRecommendations(answers, products) : [];
  const currentQuestion = QUESTIONS[step];
  const progress = ((step + (showResults ? 1 : 0)) / QUESTIONS.length) * 100;

  if (showResults) {
    return (
      <div className="min-h-screen py-12 px-4 pt-24">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-10 animate-in fade-in slide-in-from-bottom-4">
            <div className="w-20 h-20 gradient-primary rounded-[18px] flex items-center justify-center mx-auto mb-5 shadow-xl shadow-black/8">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3" data-testid="text-results-title">Sizin üçün Tövsiyələrimiz</h1>
            <p className="text-muted-foreground text-lg">Cavablarınıza əsasən ən uyğun hədiyyələri seçdik!</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 mb-10">
            {recommendations.map((product) => (
              <Card key={product.id} className="overflow-hidden group border-0 shadow-sm card-hover bg-white rounded-[18px] flex flex-col" data-testid={`card-recommendation-${product.id}`}>
                <div className="relative aspect-square overflow-hidden bg-gradient-to-br [#FFF0F5] p-4">
                  <Link href={`/product/${product.id}`}>
                    <img src={product.image} alt={product.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-md" />
                  </Link>
                  <span className="absolute top-3 left-3 gradient-primary text-white text-[9px] font-bold px-2 py-1 rounded-lg shadow-sm">Tövsiyə</span>
                </div>
                <CardContent className="p-3 flex flex-col flex-1">
                  <p className="text-[10px] text-primary/70 font-bold uppercase tracking-[0.15em] mb-0.5">{product.category}</p>
                  <Link href={`/product/${product.id}`}>
                    <h3 className="font-bold text-sm mb-1 hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
                  </Link>
                  <p className="font-bold text-base mb-2">{product.price.toLocaleString('az-AZ')} ₼</p>
                  <Button size="sm" className="w-full rounded-xl gradient-primary text-white border-0 shadow-[0_6px_20px_rgba(0,0,0,0.06)] text-xs active-press h-9 mt-auto" onClick={() => addToCart({ id: String(product.id), name: product.name, price: product.price, image: product.image })} data-testid={`add-cart-rec-${product.id}`}>
                    <ShoppingBag className="w-3.5 h-3.5 mr-1" /> Səbətə Əlavə Et
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-center gap-3">
            <Button variant="outline" className="rounded-full px-6 border-border/50" onClick={restart} data-testid="button-restart-quiz">
              <RotateCcw className="w-4 h-4 mr-2" /> Yenidən Başla
            </Button>
            <Link href="/products">
              <Button className="rounded-full px-6 gradient-primary text-white border-0 shadow-[0_8px_20px_rgba(0,0,0,0.06)]" data-testid="link-all-products">
                Bütün Məhsullar <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 pt-24">
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-black/8">
            <Gift className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2" data-testid="text-quiz-title">Hədiyyə Tapıcı</h1>
          <p className="text-muted-foreground">Bir neçə sualı cavablandırın, ən uyğun hədiyyəni biz tapaq!</p>
        </div>

        <div className="w-full bg-muted rounded-full h-2 mb-8 overflow-hidden">
          <div className="h-full gradient-primary rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>

        <div className="glass-strong rounded-[18px] p-6 md:p-10 border border-white/50 shadow-sm animate-in fade-in slide-in-from-bottom-4" key={step}>
          <div className="flex items-center gap-3 mb-6">
            {step > 0 && (
              <button onClick={() => setStep(step - 1)} className="p-2 rounded-xl hover:bg-muted transition-colors" data-testid="button-prev-question">
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div className="flex items-center gap-2">
              <currentQuestion.icon className="w-5 h-5 text-primary" />
              <span className="text-xs text-muted-foreground font-semibold">{step + 1} / {QUESTIONS.length}</span>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-6">{currentQuestion.question}</h2>

          <div className="grid grid-cols-2 gap-3">
            {currentQuestion.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(currentQuestion.id, option.value)}
                className={`p-5 rounded-2xl text-left transition-all duration-300 active-press border ${
                  answers[currentQuestion.id] === option.value
                    ? "gradient-primary text-white border-transparent shadow-[0_8px_20px_rgba(0,0,0,0.06)]"
                    : "glass border-white/50 hover:border-primary/30 hover:shadow-md"
                }`}
                data-testid={`option-${option.value}`}
              >
                <span className="text-2xl mb-2 block">{option.emoji}</span>
                <span className="font-semibold text-sm">{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
