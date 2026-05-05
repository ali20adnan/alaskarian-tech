"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

export type Language = "en" | "ar"

interface Translations {
  nav: {
    home: string
    projects: string
    services: string
    about: string
    contact: string
  }
  dropdowns: {
    systems: { title: string; desc: string; slug: string }[]
    services: { title: string; desc: string; slug: string }[]
    contact: { title: string; desc: string }[]
  }
  hero: {
    badge: string
    headline1: string
    headline2: string
    subtitle: string
    description: string
    exploreCta: string
    aboutCta: string
    stats: {
      projects: string
      experience: string
      satisfaction: string
      support: string
    }
  }
  logo: {
    title: string
    subtitle: string
  }
}

const translations: Record<Language, Translations> = {
  en: {
    nav: {
      home: "Home",
      projects: "Our Systems",
      services: "Our Services",
      about: "About",
      contact: "Contact Us",
    },
    dropdowns: {
      systems: [
        { title: "Distribution Management", desc: "Complete distribution company management system", slug: "distribution-management" },
        { title: "Sales Representatives", desc: "Mobile app for sales team management", slug: "sales-representatives" },
        { title: "Inventory System", desc: "Smart warehouse and inventory management", slug: "inventory-system" },
        { title: "Accounting System", desc: "Financial management and reporting", slug: "accounting-system" },
      ],
      services: [
        { title: "Custom Development", desc: "Tailored software solutions", slug: "custom-development" },
        { title: "Mobile Apps", desc: "iOS and Android applications", slug: "mobile-apps" },
        { title: "Cloud Solutions", desc: "Scalable cloud infrastructure", slug: "cloud-solutions" },
        { title: "Technical Support", desc: "24/7 maintenance and support", slug: "technical-support" },
      ],
      contact: [
        { title: "Sales Inquiry", desc: "Talk to our sales team" },
        { title: "Technical Support", desc: "Get help with our products" },
        { title: "Partnership", desc: "Become a partner" },
      ],
    },
    hero: {
      badge: "Welcome to Excellence",
      headline1: "Engineering",
      headline2: "The Future",
      subtitle: "نصنع المستقبل الرقمي",
      description: "A prestigious platform showcasing innovative digital solutions and cutting-edge technology projects that define tomorrow's landscape.",
      exploreCta: "Explore Projects",
      aboutCta: "About Us",
      stats: {
        projects: "Projects",
        experience: "Years Experience",
        satisfaction: "Client Satisfaction",
        support: "Support",
      },
    },
    logo: {
      title: "Alaskarian Tech",
      subtitle: "العسكريان للحلول البرمجية",
    },
  },
  ar: {
    nav: {
      home: "الرئيسية",
      projects: "أنظمتنا",
      services: "خدماتنا",
      about: "عنا",
      contact: "تواصل معنا",
    },
    dropdowns: {
      systems: [
        { title: "إدارة التوزيع", desc: "نظام متكامل لإدارة شركات التوزيع", slug: "distribution-management" },
        { title: "المندوبين", desc: "تطبيق موبايل لإدارة فريق المبيعات", slug: "sales-representatives" },
        { title: "نظام المخازن", desc: "إدارة ذكية للمخازن والمستودعات", slug: "inventory-system" },
        { title: "النظام المحاسبي", desc: "إدارة مالية وتقارير شاملة", slug: "accounting-system" },
      ],
      services: [
        { title: "تطوير مخصص", desc: "حلول برمجية حسب الطلب", slug: "custom-development" },
        { title: "تطبيقات الموبايل", desc: "تطبيقات iOS و Android", slug: "mobile-apps" },
        { title: "حلول سحابية", desc: "بنية تحتية سحابية قابلة للتوسع", slug: "cloud-solutions" },
        { title: "الدعم الفني", desc: "صيانة ودعم على مدار الساعة", slug: "technical-support" },
      ],
      contact: [
        { title: "استفسارات المبيعات", desc: "تحدث مع فريق المبيعات" },
        { title: "الدعم الفني", desc: "احصل على مساعدة لمنتجاتنا" },
        { title: "الشراكة", desc: "كن شريكاً معنا" },
      ],
    },
    hero: {
      badge: "مرحباً بك في التميز",
      headline1: "نهندس",
      headline2: "المستقبل",
      subtitle: "Engineering The Future",
      description: "منصة مرموقة تعرض حلولاً رقمية مبتكرة ومشاريع تقنية متطورة تحدد ملامح الغد.",
      exploreCta: "استكشف المشاريع",
      aboutCta: "من نحن",
      stats: {
        projects: "مشروع",
        experience: "سنوات خبرة",
        satisfaction: "رضا العملاء",
        support: "دعم",
      },
    },
    logo: {
      title: "العسكريان للحلول البرمجية",
      subtitle: "Alaskarian Tech",
    },
  },
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: Translations
  isRTL: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedLang = localStorage.getItem("language") as Language
    if (savedLang && (savedLang === "en" || savedLang === "ar")) {
      setLanguageState(savedLang)
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      document.documentElement.lang = language
      document.documentElement.dir = language === "ar" ? "rtl" : "ltr"
      localStorage.setItem("language", language)
    }
  }, [language, mounted])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
  }

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: translations[language],
    isRTL: language === "ar",
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
