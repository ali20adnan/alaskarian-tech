import { motion } from "motion/react"
import { Button } from "@/src/components/ui/button"
import { useLanguage } from "@/src/contexts/language-context"
import { useSiteConfig } from "@/src/contexts/site-config-context"
import { cn } from "@/src/lib/utils"
import { Monitor, Smartphone, Wrench, Send } from "lucide-react"

export function CustomSystemCTA() {
  const { isRTL } = useLanguage()
  const { config } = useSiteConfig()
  const cta = config.cta

  return (
    <section className="py-20 bg-white dark:bg-slate-950 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-8 flex flex-wrap justify-center gap-x-3"
          >
            <span className="text-slate-900 dark:text-white">
              {isRTL ? cta.titleAr : cta.titleEn}
            </span>
            <span className="text-blue-600">
              {isRTL ? cta.titleHighlightAr : cta.titleHighlightEn}
            </span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-6 rounded-full text-xl font-bold shadow-xl shadow-blue-500/20 group flex items-center justify-center gap-3"
            >
              <span className="font-cairo uppercase">
                {isRTL ? cta.buttonAr : cta.buttonEn}
              </span>
              <Send className={cn("h-6 w-6 transition-transform group-hover:translate-x-1", isRTL && "-scale-x-100 group-hover:-translate-x-1")} />
            </Button>
          </motion.div>
        </div>

        <div className="relative max-w-4xl mx-auto h-[400px] flex items-center justify-center">
          {/* Main User Illustration Mockup */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative z-10"
          >
            <div className="relative">
               {/* Simplified Person Representation */}
               <div className="w-24 h-48 bg-blue-600 rounded-2xl relative">
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-10 bg-orange-200 rounded-full" />
                  <div className="absolute top-12 left-0 w-full h-24 bg-blue-700 rounded-xl" />
               </div>
               
               {/* Floating Interface Elements */}
               <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-10 -right-20 w-48 h-32 bg-blue-100 dark:bg-slate-800 rounded-xl border-2 border-blue-200 dark:border-slate-700 shadow-lg p-4"
               >
                  <div className="h-2 w-3/4 bg-blue-300 dark:bg-slate-600 rounded mb-2" />
                  <div className="h-2 w-1/2 bg-blue-200 dark:bg-slate-700 rounded mb-4" />
                  <div className="flex gap-1">
                    <div className="h-10 flex-1 bg-white dark:bg-slate-900 rounded" />
                    <div className="h-10 w-10 bg-blue-500 rounded" />
                  </div>
               </motion.div>

               <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute bottom-10 -left-20 w-48 h-32 bg-blue-50 dark:bg-slate-900 rounded-xl border-2 border-blue-100 dark:border-slate-800 shadow-lg p-4"
               >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded bg-emerald-400" />
                    <div className="h-2 w-16 bg-slate-300 rounded" />
                  </div>
                  <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded mb-2" />
                  <div className="h-2 w-2/3 bg-slate-200 dark:bg-slate-800 rounded" />
               </motion.div>

               <motion.div 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 left-12 w-40 h-24 bg-blue-600 rounded-xl shadow-2xl flex items-center justify-center border-2 border-white/20"
               >
                  <Wrench className="h-10 w-10 text-white animate-pulse" />
               </motion.div>
            </div>
          </motion.div>

          {/* Decorative Elements */}
          <div className="absolute inset-0 flex items-center justify-center opacity-20 dark:opacity-10 pointer-events-none">
            <div className="w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  )
}
