"use client"

import { useState, useRef, useEffect } from "react"
import { useLanguage } from "@/src/contexts/language-context"
import { useSiteConfig } from "@/src/contexts/site-config-context"
import { cn } from "@/src/lib/utils"
import { ChevronLeft, ChevronRight, Monitor, ImageOff, Pill, ShoppingCart, Landmark, Stethoscope, Factory, GraduationCap, LayoutGrid, TrendingUp, Smartphone, Settings, SlidersHorizontal } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { ProductModal, type Product } from "./product-modal"

const translations = {
  en: {
    sectionLabel: "Systems Section",
    title: "Al-Askaryan",
    titleHighlight: "Systems",
    subtitle: "Organize your business no matter what type of work you do",
    cta: "Build Your System",
    viewAll: "View All",
    filters: [
      { id: "all", label: "All Systems", icon: LayoutGrid },
      { id: "sales", label: "Sales Systems", icon: TrendingUp },
      { id: "apps", label: "Helper Apps", icon: Smartphone },
      { id: "admin", label: "Admin Systems", icon: Settings },
    ],
    priceLabel: "Price",
    currency: "IQD",
    catalog: {
      title: "All Products",
      subtitle: "Search and filter all available systems",
      searchPlaceholder: "Search by name or description...",
      allCategories: "All categories",
      mediaOnly: "Has media only",
      sortNewest: "Newest first",
      sortPriceLow: "Price: Low to high",
      sortPriceHigh: "Price: High to low",
      noResults: "No products match your filters",
    },
    systems: [
      {
        id: 1,
        category: "sales",
        title: "Pharmacies & Warehouses",
        description: "Provides excellent management for materials with the ability to set expiry dates and alert period before expiration to notify the user",
        price: "1,124,000",
        color: "from-green-400 to-green-500",
        barColor: "bg-gradient-to-r from-orange-400 via-yellow-400 to-green-400",
      },
      {
        id: 2,
        category: "sales",
        title: "Sales & Inventory",
        description: "Integrated program for managing sales, purchases, and accounts for commercial companies and stores",
        price: "824,000",
        color: "from-pink-400 to-pink-500",
        barColor: "bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400",
      },
      {
        id: 3,
        category: "admin",
        title: "Banking & Transfers",
        description: "Works according to the unified accounting system for managing banking and exchange company accounts",
        price: "824,000",
        color: "from-blue-400 to-blue-500",
        barColor: "bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400",
      },
      {
        id: 4,
        category: "apps",
        title: "Medical Clinics",
        description: "Integrated system for managing medical clinics and complexes with many features to help organize work",
        price: "824,000",
        color: "from-teal-400 to-teal-500",
        barColor: "bg-gradient-to-r from-teal-400 via-green-400 to-lime-400",
      },
      {
        id: 5,
        category: "admin",
        title: "Factories & Plants",
        description: "Comprehensive management for factories including raw materials, manufactured goods, and cost tracking",
        price: "1,049,000",
        color: "from-orange-400 to-orange-500",
        barColor: "bg-gradient-to-r from-orange-400 via-red-400 to-pink-400",
      },
      {
        id: 6,
        category: "admin",
        title: "Schools Management",
        description: "Complete management for schools including student accounts and product accounting",
        price: "824,000",
        color: "from-purple-400 to-purple-500",
        barColor: "bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400",
      },
    ] as (Omit<Product, 'icon'> & { category: string })[],
  },
  ar: {
    sectionLabel: "قسم الأنظمة",
    title: "أنظمة",
    titleHighlight: "العسكريان",
    subtitle: "تنظم أعمالك مهما يكون نوع عملك",
    cta: "اصنع نظامك",
    viewAll: "عرض الكل",
    filters: [
      { id: "all", label: "كل الأنظمة", icon: LayoutGrid },
      { id: "sales", label: "أنظمة مبيعات", icon: TrendingUp },
      { id: "apps", label: "تطبيقات مساعدة", icon: Smartphone },
      { id: "admin", label: "أنظمة إدارية", icon: Settings },
    ],
    priceLabel: "السعر",
    currency: "د.ع",
    catalog: {
      title: "كل المنتجات",
      subtitle: "ابحث وفلتر جميع الأنظمة المتاحة",
      searchPlaceholder: "ابحث بالاسم أو الوصف...",
      allCategories: "كل التصنيفات",
      mediaOnly: "المنتجات التي تحتوي وسائط فقط",
      sortNewest: "الأحدث أولاً",
      sortPriceLow: "السعر: من الأقل للأعلى",
      sortPriceHigh: "السعر: من الأعلى للأقل",
      noResults: "لا توجد منتجات مطابقة للفلاتر",
    },
    systems: [
      {
        id: 1,
        category: "sales",
        title: "الصيدليات و المذاخر",
        description: "يوفر إدارة ممتازة للمواد وذلك بإمكانية تحديد تاريخ صلاحية المواد وضبط فترة تنبيه قبل إنتهاء الصلاحية ليتم إعلام المستخدم",
        price: "1,124,000",
        color: "from-green-400 to-green-500",
        barColor: "bg-gradient-to-r from-orange-400 via-yellow-400 to-green-400",
      },
      {
        id: 2,
        category: "sales",
        title: "المبيعات و المخازن",
        description: "برنامج متكامل لإدارة مبيعات و مشتريات وحسابات الشركات والمحلات التجارية",
        price: "824,000",
        color: "from-pink-400 to-pink-500",
        barColor: "bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400",
      },
      {
        id: 3,
        category: "admin",
        title: "الصيرفة و الحوالات",
        description: "يعمل النظام وفق النظام المحاسبي الموحد لإدارة حسابات المكاتب والشركات الخاصة بالتعاملات المالية",
        price: "824,000",
        color: "from-blue-400 to-blue-500",
        barColor: "bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400",
      },
      {
        id: 4,
        category: "apps",
        title: "العيادات الطبية",
        description: "نظام متكامل لإدارة عيادات الأطباء و المجمعات الطبية حيث يحتوي على الكثير من المميزات التي تساعد في تسهيل و تنظيم العمل",
        price: "824,000",
        color: "from-teal-400 to-teal-500",
        barColor: "bg-gradient-to-r from-teal-400 via-green-400 to-lime-400",
      },
      {
        id: 5,
        category: "admin",
        title: "المعامل و المصانع",
        description: "إدارة شاملة للمعامل و المصانع من خلال تحديد المواد الأولية و المواد المصنعة و أيضا معرفة كلف المواد و كلف التصنيع",
        price: "1,049,000",
        color: "from-orange-400 to-orange-500",
        barColor: "bg-gradient-to-r from-orange-400 via-red-400 to-pink-400",
      },
      {
        id: 6,
        category: "admin",
        title: "إدارة المدارس",
        description: "يعمل البرنامج وفق النظام المحاسبي و يتظم حسابات المنتسبات و إدارة كاملة للمدارس و المناهج",
        price: "824,000",
        color: "from-purple-400 to-purple-500",
        barColor: "bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400",
      },
    ] as (Omit<Product, 'icon'> & { category: string })[],
  },
}

const systemIcons: Record<number, typeof Monitor> = {
  1: Pill,
  2: ShoppingCart,
  3: Landmark,
  4: Stethoscope,
  5: Factory,
  6: GraduationCap,
}

function resolveCategoryLabel(
  categoryId: string,
  filters: { id: string; label: string }[],
): string {
  const id = categoryId.toLowerCase()
  const match = filters.find((f) => f.id === id)
  if (match) return match.label
  return categoryId
}

function ProductImage({ src, alt }: { src?: string; alt: string }) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800">
        <ImageOff className="h-14 w-14 text-slate-400" />
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className="h-full w-full object-cover"
      onError={() => setFailed(true)}
      loading="lazy"
    />
  )
}

export function SystemsSection() {
  const { isRTL, language } = useLanguage()
  const { config } = useSiteConfig()
  const navigate = useNavigate()
  const t = isRTL ? translations.ar : translations.en
  const [activeFilter, setActiveFilter] = useState("all")
  const [selectedSystem, setSelectedSystem] = useState<Product | null>(null)
  const [dbProducts, setDbProducts] = useState<any[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        const formatted = data.map((p: any) => ({
          id: `db-${p.id}`,
          category: p.category?.toLowerCase() || "sales",
          title: isRTL ? p.nameAr : p.nameEn,
          description: isRTL ? p.descriptionAr : p.descriptionEn,
          price: p.price.toLocaleString(),
          color: "from-blue-400 to-blue-500",
          barColor: "bg-gradient-to-r from-blue-400 to-cyan-400",
          imageUrl: p.imageUrl,
          videoUrl: p.videoUrl
        }))
        setDbProducts(formatted)
      })
      .catch(err => console.error("Failed to fetch products:", err))
  }, [isRTL])

  const allProducts = [...t.systems, ...dbProducts]

  const filteredSystems = activeFilter === "all" 
    ? allProducts 
    : allProducts.filter(system => system.category === activeFilter)

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      })
    }
  }

  return (
    <section className="py-12 sm:py-16 md:py-24 bg-slate-50 dark:bg-slate-950" dir={isRTL ? "rtl" : "ltr"}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* Sidebar */}
          <div className="lg:w-72 xl:w-80 shrink-0 text-center lg:text-start">
            <span className={cn(
              "text-sm text-muted-foreground mb-2 block",
              isRTL && "font-cairo"
            )}>
              {language === 'ar' ? config.systems.sectionLabelAr : config.systems.sectionLabelEn}
            </span>
            <h2 className={cn(
              "text-2xl sm:text-3xl md:text-4xl font-bold mb-4",
              isRTL && "font-cairo"
            )}>
              <span className="text-foreground">
                {language === 'ar' ? config.systems.titleAr : config.systems.titleEn}
              </span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">
                {language === 'ar' ? config.systems.titleHighlightAr : config.systems.titleHighlightEn}
              </span>
            </h2>
            <p className={cn(
              "text-muted-foreground mb-6 text-sm sm:text-base",
              isRTL && "font-cairo"
            )}>
              {language === 'ar' ? config.systems.subtitleAr : config.systems.subtitleEn}
            </p>
            <button className={cn(
              "inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-slate-300 dark:border-slate-700 text-foreground font-semibold hover:border-cyan-500 hover:text-cyan-500 transition-colors",
              isRTL && "font-cairo"
            )}>
              {language === 'ar' ? config.systems.ctaAr : config.systems.ctaEn}
              <ChevronLeft className={cn("w-4 h-4", !isRTL && "rotate-180")} />
            </button>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Filter Tabs */}
            <div className="mb-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3 lg:justify-start sm:mb-8">
              {t.filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={cn(
                    "inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300",
                    activeFilter === filter.id
                      ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/30"
                      : "bg-white dark:bg-slate-800 text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700",
                    isRTL && "font-cairo"
                  )}
                >
                  <filter.icon className="w-4 h-4" />
                  {filter.label}
                </button>
              ))}
              <button
                onClick={() => navigate("/systems")}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-xs font-semibold text-cyan-700 transition-all hover:bg-cyan-500/20 dark:text-cyan-300 sm:px-4 sm:text-sm",
                  isRTL && "font-cairo",
                )}
              >
                <SlidersHorizontal className="h-4 w-4" />
                {language === 'ar' ? config.systems.viewAllAr : config.systems.viewAllEn}
              </button>
            </div>

            {/* Carousel Container */}
            <div className="relative px-6 sm:px-8 md:px-12">
              {/* Navigation Arrow - Left */}
              <button
                onClick={() => scroll("left")}
                className="absolute top-1/2 -translate-y-1/2 left-0 z-10 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-muted-foreground hover:text-cyan-500 hover:border-cyan-500 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              {/* Navigation Arrow - Right */}
              <button
                onClick={() => scroll("right")}
                className="absolute top-1/2 -translate-y-1/2 right-0 z-10 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-muted-foreground hover:text-cyan-500 hover:border-cyan-500 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Cards Carousel */}
              <div
                ref={scrollRef}
                className="flex gap-4 sm:gap-5 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {filteredSystems.map((system) => {
                  const IconComponent = systemIcons[system.id] || Monitor
                  return (
                    <div
                      key={system.id}
                      className="shrink-0 w-[260px] sm:w-[280px] md:w-[300px] snap-start"
                    >
                      <div 
                        onClick={() =>
                          setSelectedSystem({
                            ...system,
                            icon: IconComponent,
                            categoryLabel: resolveCategoryLabel(system.category, t.filters),
                          })
                        }
                        className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 hover:shadow-xl hover:border-cyan-500/50 transition-all duration-300 h-full flex flex-col cursor-pointer"
                      >
                        {/* Media + category chip (replaces disconnected header row) */}
                        <div className="p-4 pb-3">
                          <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200/90 dark:bg-slate-800 dark:ring-slate-700/90">
                            <div
                              className={cn(
                                "absolute start-3 top-3 z-10 flex max-w-[min(100%-1.5rem,200px)] items-center gap-2 rounded-full border border-white/20 bg-slate-950/80 py-1.5 ps-1.5 pe-2.5 shadow-lg backdrop-blur-md dark:bg-black/70",
                                isRTL && "font-cairo",
                              )}
                            >
                              <div
                                className={cn(
                                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br",
                                  system.color,
                                )}
                              >
                                <IconComponent className="h-4 w-4 text-white" />
                              </div>
                              <span className="truncate text-[11px] font-semibold text-white sm:text-xs">
                                {resolveCategoryLabel(system.category, t.filters)}
                              </span>
                            </div>
                            <ProductImage src={system.imageUrl} alt={system.title} />
                          </div>
                        </div>

                        {/* Card Content */}
                        <div className="p-4 flex-1 flex flex-col">
                          <h3 className={cn(
                            "text-base sm:text-lg font-bold text-foreground mb-2",
                            isRTL && "font-cairo"
                          )}>
                            {system.title}
                          </h3>
                          <p className={cn(
                            "text-xs sm:text-sm text-muted-foreground mb-4 line-clamp-3 flex-1",
                            isRTL && "font-cairo leading-relaxed"
                          )}>
                            {system.description}
                          </p>

                          {/* Price */}
                          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                            <span className={cn(
                              "text-xs text-muted-foreground",
                              isRTL && "font-cairo"
                            )}>
                              {t.priceLabel}
                            </span>
                            <span className={cn(
                              "text-sm sm:text-base font-bold text-cyan-600 dark:text-cyan-400",
                              isRTL && "font-cairo"
                            )}>
                              {system.price} {t.currency}
                            </span>
                          </div>
                        </div>

                        {/* Color Bar */}
                        <div className={cn("h-1.5", system.barColor)} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Modal */}
      {selectedSystem && (
        <ProductModal
          isOpen={!!selectedSystem}
          onClose={() => setSelectedSystem(null)}
          product={selectedSystem}
        />
      )}
    </section>
  )
}
