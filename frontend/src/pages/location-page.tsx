import { Link } from "react-router-dom"
import { ArrowLeft, ChevronRight, MapPin } from "lucide-react"
import { cn } from "@/src/lib/utils"
import { useLanguage } from "@/src/contexts/language-context"
import { useSiteConfig } from "@/src/contexts/site-config-context"

export function LocationPage() {
  const { language } = useLanguage()
  const { config } = useSiteConfig()
  const isRTL = language === "ar"

  return (
    <main className="container mx-auto px-4 py-24" dir={isRTL ? "rtl" : "ltr"}>
      <Link
        to="/"
        className="mb-8 inline-flex items-center gap-2 text-cyan-600 transition-colors hover:text-cyan-700"
      >
        {isRTL ? <ChevronRight className="h-5 w-5" /> : <ArrowLeft className="h-5 w-5" />}
        <span className={cn(isRTL && "font-cairo")}>{isRTL ? "العودة للرئيسية" : "Back to Home"}</span>
      </Link>

      <div className="mb-6">
        <h1 className={cn("text-3xl font-bold text-foreground sm:text-4xl", isRTL && "font-cairo")}>
          {isRTL ? "موقعنا" : "Our Location"}
        </h1>
        <p className={cn("mt-2 flex items-center gap-2 text-muted-foreground", isRTL && "font-cairo")}>
          <MapPin className="h-4 w-4 text-cyan-600" />
          {isRTL ? config.contact.addressAr : config.contact.addressEn}
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <iframe
          title="Al-Askari Shrine Samarra"
          src="https://www.google.com/maps?q=34.1967,43.8750&z=16&output=embed"
          className="h-[68vh] w-full min-h-[420px]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </main>
  )
}
