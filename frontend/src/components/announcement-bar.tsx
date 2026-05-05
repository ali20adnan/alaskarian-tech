import { motion, AnimatePresence } from "motion/react"
import { useLanguage } from "@/src/contexts/language-context"
import { useSiteConfig } from "@/src/contexts/site-config-context"
import { Sparkles } from "lucide-react"
import { cn } from "@/src/lib/utils"

export function AnnouncementBar() {
  const { language, isRTL } = useLanguage()
  const { config } = useSiteConfig()

  if (!config.appearance.showAnnouncement) return null

  const text = language === 'ar' ? config.appearance.announcementAr : config.appearance.announcementEn

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="relative bg-gradient-to-r from-amber-500 to-orange-600 text-white min-h-[40px] flex items-center shadow-sm z-[100]"
      >
        <div className="container mx-auto px-4 flex items-center justify-center gap-3 py-2">
           <Sparkles className="w-4 h-4 animate-pulse shrink-0" />
           <span className={cn(
             "text-xs sm:text-sm font-bold uppercase tracking-wider text-center leading-tight",
             isRTL && "font-cairo"
           )}>
             {text}
           </span>
           <Sparkles className="w-4 h-4 animate-pulse shrink-0 hidden sm:block" />
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
