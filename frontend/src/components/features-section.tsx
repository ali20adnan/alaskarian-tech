"use client"

import { useLanguage } from "@/src/contexts/language-context"
import { useSiteConfig } from "@/src/contexts/site-config-context"
import { cn } from "@/src/lib/utils"
import * as Icons from "lucide-react"

export function FeaturesSection() {
  const { isRTL } = useLanguage()
  const { config } = useSiteConfig()
  const f = config.features

  return (
    <section className="py-20 md:py-32 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Title */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className={cn(
            "text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white",
            isRTL && "font-cairo"
          )}>
            <span>{isRTL ? f.titleAr : f.titleEn}</span>{" "}
            <span className="text-[#FFCC00]">{isRTL ? f.titleHighlightAr : f.titleHighlightEn}</span>
          </h2>
          <p className={cn(
            "text-lg md:text-xl text-slate-300 max-w-2xl mx-auto",
            isRTL && "font-cairo"
          )}>
            {isRTL ? f.subtitleAr : f.subtitleEn}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {f.items.map((item, index) => {
            const IconComponent = (Icons as any)[item.iconName] || Icons.HelpCircle
            
            return (
              <div
                key={index}
                className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/10 hover:bg-white/10 hover:border-cyan-500/50 transition-all duration-300"
              >
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-cyan-400 transition-all duration-300">
                  <IconComponent className="w-7 h-7 text-cyan-400" />
                </div>

                {/* Content */}
                <h3 className={cn(
                  "text-xl md:text-2xl font-bold text-white mb-3",
                  isRTL && "font-cairo"
                )}>
                  {isRTL ? item.titleAr : item.titleEn}
                </h3>
                <p className={cn(
                  "text-slate-400 leading-relaxed",
                  isRTL && "font-cairo"
                )}>
                  {isRTL ? item.descriptionAr : item.descriptionEn}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
