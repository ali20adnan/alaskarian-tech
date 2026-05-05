"use client"

import { useLanguage } from "@/src/contexts/language-context"
import { cn } from "@/src/lib/utils"
import { Users, MapPin, Calendar, Monitor, Star } from "lucide-react"
import { useSiteConfig } from "@/src/contexts/site-config-context"

const icons = [Users, MapPin, Calendar, Monitor, Star];

export function StatsSection() {
  const { isRTL, language } = useLanguage()
  const { config } = useSiteConfig()

  return (
    <section className="py-8 sm:py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4 md:px-6" dir={isRTL ? "rtl" : "ltr"}>
        {/* Stats Bar */}
        <div className="bg-slate-900 rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 lg:p-12">
          <div className={cn(
            "grid gap-y-8",
            config.stats.length === 1 && "grid-cols-1",
            config.stats.length === 2 && "grid-cols-2",
            config.stats.length === 3 && "grid-cols-1 sm:grid-cols-3",
            config.stats.length >= 4 && "grid-cols-2 lg:grid-cols-4"
          )}>
            {config.stats.map((stat, index) => {
              const Icon = icons[index % icons.length];
              return (
                <div
                  key={index}
                  className={cn(
                    "text-center relative py-4 sm:py-6 px-2 sm:px-4",
                    // Vertical borders - only on large screens
                    index < config.stats.length - 1 && "lg:border-r lg:border-slate-700/50",
                    // Horizontal border for mobile - always between items unless it's the last one
                    index < config.stats.length - 1 && "border-b lg:border-b-0 border-slate-700/50"
                  )}
                >
                  <div className="flex items-center justify-center gap-2 mb-2 sm:mb-3">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                    <span className={cn(
                      "text-2xl sm:text-3xl md:text-4xl font-bold text-cyan-400",
                      isRTL && "font-cairo"
                    )}>
                      {stat.value}
                    </span>
                  </div>
                  <h4 className={cn(
                    "text-sm sm:text-base md:text-lg font-semibold text-white mb-1 sm:mb-2",
                    isRTL && "font-cairo"
                  )}>
                    {language === 'ar' ? stat.labelAr : stat.labelEn}
                  </h4>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
