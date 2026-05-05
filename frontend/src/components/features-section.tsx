"use client"

import { useLanguage } from "@/src/contexts/language-context"
import { cn } from "@/src/lib/utils"
import { Shield, Zap, Clock, Headphones, Cloud, Lock } from "lucide-react"

const translations = {
  en: {
    title: "Why Choose",
    titleHighlight: "Al-Askaryan",
    subtitle: "We provide exceptional value through our commitment to quality, innovation, and customer success",
    features: [
      {
        icon: Shield,
        title: "Reliable & Secure",
        description: "Enterprise-grade security with 99.9% uptime guarantee for your peace of mind",
      },
      {
        icon: Zap,
        title: "Lightning Fast",
        description: "Optimized performance ensuring quick response times across all our systems",
      },
      {
        icon: Clock,
        title: "24/7 Support",
        description: "Round-the-clock technical support team ready to assist you anytime",
      },
      {
        icon: Headphones,
        title: "Expert Training",
        description: "Comprehensive training programs to help your team master our systems",
      },
      {
        icon: Cloud,
        title: "Cloud-Based",
        description: "Access your data anywhere with our secure cloud infrastructure",
      },
      {
        icon: Lock,
        title: "Data Privacy",
        description: "Your data is protected with advanced encryption and strict privacy policies",
      },
    ],
  },
  ar: {
    title: "لماذا تختار",
    titleHighlight: "العسكريان",
    subtitle: "نقدم قيمة استثنائية من خلال التزامنا بالجودة والابتكار ونجاح العملاء",
    features: [
      {
        icon: Shield,
        title: "موثوق وآمن",
        description: "أمان على مستوى المؤسسات مع ضمان وقت تشغيل 99.9% لراحة بالك",
      },
      {
        icon: Zap,
        title: "سرعة فائقة",
        description: "أداء محسن يضمن أوقات استجابة سريعة عبر جميع أنظمتنا",
      },
      {
        icon: Clock,
        title: "دعم 24/7",
        description: "فريق دعم فني على مدار الساعة جاهز لمساعدتك في أي وقت",
      },
      {
        icon: Headphones,
        title: "تدريب متخصص",
        description: "برامج تدريبية شاملة لمساعدة فريقك على إتقان أنظمتنا",
      },
      {
        icon: Cloud,
        title: "قائم على السحابة",
        description: "الوصول إلى بياناتك من أي مكان مع بنيتنا التحتية السحابية الآمنة",
      },
      {
        icon: Lock,
        title: "خصوصية البيانات",
        description: "بياناتك محمية بتشفير متقدم وسياسات خصوصية صارمة",
      },
    ],
  },
}

export function FeaturesSection() {
  const { isRTL } = useLanguage()
  const t = isRTL ? translations.ar : translations.en

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
            <span>{t.title}</span>{" "}
            <span className="text-[#FFCC00]">{t.titleHighlight}</span>
          </h2>
          <p className={cn(
            "text-lg md:text-xl text-slate-300 max-w-2xl mx-auto",
            isRTL && "font-cairo"
          )}>
            {t.subtitle}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {t.features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/10 hover:bg-white/10 hover:border-cyan-500/50 transition-all duration-300"
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-cyan-400 transition-all duration-300">
                <feature.icon className="w-7 h-7 text-cyan-400" />
              </div>

              {/* Content */}
              <h3 className={cn(
                "text-xl md:text-2xl font-bold text-white mb-3",
                isRTL && "font-cairo"
              )}>
                {feature.title}
              </h3>
              <p className={cn(
                "text-slate-400 leading-relaxed",
                isRTL && "font-cairo"
              )}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
