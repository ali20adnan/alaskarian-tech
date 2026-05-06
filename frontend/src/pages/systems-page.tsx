import { useEffect, useMemo, useState } from "react"
import { ChevronDown, Monitor, Search, ImageOff } from "lucide-react"
import { useLanguage } from "@/src/contexts/language-context"
import { cn } from "@/src/lib/utils"
import { ProductModal, type Product } from "@/src/components/product-modal"

const translations = {
  en: {
    title: "All Products",
    subtitle: "Search and filter all available systems",
    searchPlaceholder: "Search by name or description...",
    allCategories: "All categories",
    mediaOnly: "Has media only",
    sortNewest: "Newest first",
    sortPriceLow: "Price: Low to high",
    sortPriceHigh: "Price: High to low",
    noResults: "No products match your filters",
    filters: [
      { id: "all", label: "All Systems" },
      { id: "sales", label: "Sales Systems" },
      { id: "apps", label: "Helper Apps" },
      { id: "admin", label: "Admin Systems" },
    ],
    currency: "IQD",
  },
  ar: {
    title: "كل المنتجات",
    subtitle: "ابحث وفلتر جميع الأنظمة المتاحة",
    searchPlaceholder: "ابحث بالاسم أو الوصف...",
    allCategories: "كل التصنيفات",
    mediaOnly: "المنتجات التي تحتوي وسائط فقط",
    sortNewest: "الأحدث أولاً",
    sortPriceLow: "السعر: من الأقل للأعلى",
    sortPriceHigh: "السعر: من الأعلى للأقل",
    noResults: "لا توجد منتجات مطابقة للفلاتر",
    filters: [
      { id: "all", label: "كل الأنظمة" },
      { id: "sales", label: "أنظمة مبيعات" },
      { id: "apps", label: "تطبيقات مساعدة" },
      { id: "admin", label: "أنظمة إدارية" },
    ],
    currency: "د.ع",
  },
}

type CatalogItem = Omit<Product, "icon"> & { category: string }

function resolveCategoryLabel(
  categoryId: string,
  filters: { id: string; label: string }[],
): string {
  const id = categoryId.toLowerCase()
  const match = filters.find((f) => f.id === id)
  return match ? match.label : categoryId
}

function CatalogImage({ src, alt }: { src?: string; alt: string }) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <div className="flex h-full items-center justify-center">
        <ImageOff className="h-10 w-10 text-slate-400" />
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

export function SystemsPage() {
  const { isRTL } = useLanguage()
  const t = isRTL ? translations.ar : translations.en
  const [catalogSearch, setCatalogSearch] = useState("")
  const [catalogCategory, setCatalogCategory] = useState("all")
  const [catalogMediaOnly, setCatalogMediaOnly] = useState(false)
  const [catalogSort, setCatalogSort] = useState("newest")
  const [selectedSystem, setSelectedSystem] = useState<Product | null>(null)
  const [dbProducts, setDbProducts] = useState<CatalogItem[]>([])

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((p: any) => ({
          id: `db-${p.id}`,
          category: p.category?.toLowerCase() || "sales",
          title: isRTL ? p.nameAr : p.nameEn,
          description: isRTL ? p.descriptionAr : p.descriptionEn,
          price: p.price.toLocaleString(),
          color: "from-blue-400 to-blue-500",
          barColor: "bg-gradient-to-r from-blue-400 to-cyan-400",
          imageUrl: p.imageUrl,
          videoUrl: p.videoUrl,
        }))
        setDbProducts(formatted)
      })
      .catch((err) => console.error("Failed to fetch products:", err))
  }, [isRTL])

  const parsePrice = (value: string | number) => Number(String(value).replace(/[^\d.]/g, "")) || 0

  const catalogProducts = useMemo(() => {
    const q = catalogSearch.trim().toLowerCase()
    const byQuery = dbProducts.filter((p) =>
      q ? `${p.title} ${p.description}`.toLowerCase().includes(q) : true,
    )
    const byCategory = byQuery.filter((p) =>
      catalogCategory === "all" ? true : p.category === catalogCategory,
    )
    const byMedia = byCategory.filter((p) =>
      catalogMediaOnly ? Boolean(p.imageUrl || p.videoUrl) : true,
    )

    return [...byMedia].sort((a, b) => {
      if (catalogSort === "priceLow") return parsePrice(a.price) - parsePrice(b.price)
      if (catalogSort === "priceHigh") return parsePrice(b.price) - parsePrice(a.price)
      return String(b.id).localeCompare(String(a.id))
    })
  }, [catalogCategory, catalogMediaOnly, catalogSearch, catalogSort, dbProducts])

  return (
    <section className="py-10 sm:py-14 bg-slate-50 dark:bg-slate-950" dir={isRTL ? "rtl" : "ltr"}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-6">
          <h1 className={cn("text-2xl font-bold dark:text-white sm:text-3xl", isRTL && "font-cairo")}>{t.title}</h1>
          <p className={cn("mt-1 text-sm text-muted-foreground", isRTL && "font-cairo")}>{t.subtitle}</p>
        </div>

        <div className="mb-4 grid grid-cols-1 gap-3 lg:grid-cols-4">
          <div className="relative lg:col-span-2">
            <Search className={cn("absolute top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400", isRTL ? "right-3" : "left-3")} />
            <input
              type="text"
              value={catalogSearch}
              onChange={(e) => setCatalogSearch(e.target.value)}
              placeholder={t.searchPlaceholder}
              className={cn(
                "w-full rounded-xl border bg-white py-2.5 text-sm outline-none focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white",
                isRTL ? "pr-10 pl-3 text-right font-cairo" : "pl-10 pr-3",
              )}
            />
          </div>
          <div className="relative">
            <select
              value={catalogCategory}
              onChange={(e) => setCatalogCategory(e.target.value)}
              className={cn(
                "w-full appearance-none rounded-xl border bg-white py-2.5 text-sm outline-none focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white",
                isRTL ? "pe-10 ps-3 text-right font-cairo" : "pe-10 ps-3",
              )}
            >
              <option value="all">{t.allCategories}</option>
              {t.filters.filter((f) => f.id !== "all").map((f) => (
                <option key={f.id} value={f.id}>{f.label}</option>
              ))}
            </select>
            <ChevronDown
              className={cn(
                "pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500",
                isRTL ? "left-3" : "right-3",
              )}
            />
          </div>
          <div className="relative">
            <select
              value={catalogSort}
              onChange={(e) => setCatalogSort(e.target.value)}
              className={cn(
                "w-full appearance-none rounded-xl border bg-white py-2.5 text-sm outline-none focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white",
                isRTL ? "pe-10 ps-3 text-right font-cairo" : "pe-10 ps-3",
              )}
            >
              <option value="newest">{t.sortNewest}</option>
              <option value="priceLow">{t.sortPriceLow}</option>
              <option value="priceHigh">{t.sortPriceHigh}</option>
            </select>
            <ChevronDown
              className={cn(
                "pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500",
                isRTL ? "left-3" : "right-3",
              )}
            />
          </div>
        </div>

        <label className={cn("mb-6 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300", isRTL && "font-cairo")}>
          <input
            type="checkbox"
            checked={catalogMediaOnly}
            onChange={(e) => setCatalogMediaOnly(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
          />
          {t.mediaOnly}
        </label>

        {catalogProducts.length === 0 ? (
          <div className={cn("rounded-2xl border border-dashed p-10 text-center text-muted-foreground", isRTL && "font-cairo")}>
            {t.noResults}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {catalogProducts.map((system) => (
              <button
                key={`catalog-${system.id}`}
                onClick={() => {
                  setSelectedSystem({
                    ...system,
                    icon: Monitor,
                    categoryLabel: resolveCategoryLabel(system.category, t.filters),
                  })
                }}
                className="overflow-hidden rounded-2xl border bg-white text-start shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900"
              >
                <div className="aspect-[16/10] bg-slate-100 dark:bg-slate-800">
                  <CatalogImage src={system.imageUrl} alt={system.title} />
                </div>
                <div className="p-4">
                  <p className={cn("mb-1 text-xs text-cyan-600", isRTL && "font-cairo")}>{resolveCategoryLabel(system.category, t.filters)}</p>
                  <h4 className={cn("line-clamp-1 font-bold dark:text-white", isRTL && "font-cairo")}>{system.title}</h4>
                  <p className={cn("mt-1 line-clamp-2 text-xs text-muted-foreground", isRTL && "font-cairo")}>{system.description}</p>
                  <p className={cn("mt-3 text-sm font-bold text-cyan-600 dark:text-cyan-400", isRTL && "font-cairo")}>
                    {system.price} {t.currency}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

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
