import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] w-full flex flex-col items-center justify-center px-4 text-center space-y-6 pt-24">
      <AlertCircle className="h-16 w-16 text-primary/30" />
      <h1 className="text-3xl font-serif font-bold">Səhifə Tapılmadı</h1>
      <p className="text-muted-foreground max-w-md">
        Axtardığınız səhifə mövcud deyil və ya silinmiş ola bilər.
      </p>
      <Link href="/">
        <Button size="lg" className="rounded-full h-12 px-8">
          Ana Səhifəyə Qayıt
        </Button>
      </Link>
    </div>
  );
}
