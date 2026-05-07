"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { X, ChevronLeft, ChevronRight, Monitor, Check, Play, ImageOff, VideoOff } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "@/src/lib/utils"
import { useLanguage } from "@/src/contexts/language-context"

export interface Product {
  id: number | string
  title: string
  description: string
  price: string | number
  color: string
  barColor: string
  icon: React.ElementType
  features?: string[]
  imageUrl?: string
  videoUrl?: string
  imageUrls?: string[]
  /** Resolved filter label (e.g. أنظمة مبيعات) for UI chips */
  categoryLabel?: string
}

interface ProductModalProps {
  isOpen: boolean
  onClose: () => void
  product: Product | null
}

const translations = {
  ar: {
    startingFrom: "بدءاً من",
    currency: "د.ع",
    moreDetails: "تفاصيل أكثر",
    features: "المميزات",
    screenshots: "صور النظام",
    requestDemo: "طلب عرض توضيحي",
    buyNow: "اشتري الآن",
    watchVideo: "شاهد الفيديو",
    featuresList: [
      "واجهة سهلة الاستخدام",
      "دعم فني على مدار الساعة",
      "تحديثات مجانية مدى الحياة",
      "نسخ احتياطي تلقائي",
      "تقارير متقدمة",
      "دعم متعدد اللغات",
    ]
  },
  en: {
    startingFrom: "Starting from",
    currency: "IQD",
    moreDetails: "More Details",
    features: "Features",
    screenshots: "Screenshots",
    requestDemo: "Request Demo",
    buyNow: "Buy Now",
    watchVideo: "Watch Video",
    featuresList: [
      "Easy to use interface",
      "24/7 Technical support",
      "Free lifetime updates",
      "Automatic backup",
      "Advanced reports",
      "Multi-language support",
    ]
  }
}

export function ProductModal({ isOpen, onClose, product }: ProductModalProps) {
  const { isRTL } = useLanguage()
  const t = isRTL ? translations.ar : translations.en
  const [currentImage, setCurrentImage] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [headerImageFailed, setHeaderImageFailed] = useState(false)
  const [previewImageFailed, setPreviewImageFailed] = useState(false)
  const [previewVideoFailed, setPreviewVideoFailed] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    setHeaderImageFailed(false)
    setPreviewImageFailed(false)
    setPreviewVideoFailed(false)
  }, [product?.id, isOpen])

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "auto"
    }
  }, [isOpen, onClose])

  const IconComponent = product?.icon || Monitor

  const carouselItems = React.useMemo(() => {
    if (!product) return []
    const items = []
    if (product.videoUrl) items.push({ type: "video", url: product.videoUrl })
    
    const imgs = product.imageUrls && product.imageUrls.length > 0 
      ? product.imageUrls 
      : (product.imageUrl ? [product.imageUrl] : [])
      
    imgs.forEach(url => items.push({ type: "image", url }))
    return items
  }, [product])

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % carouselItems.length)
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + carouselItems.length) % carouselItems.length)
  
  const youtubeId = (url: string) => url.match(/(?:v=|be\/)([^?&]+)/)?.[1] ?? null

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {isOpen && product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[120] flex items-center justify-center p-4"
        >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ duration: 0.2 }}
        className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={cn(
            "absolute top-5 z-50 w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm",
            isRTL ? "left-5" : "right-5"
          )}
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Colored Top Bar */}
        <div className={cn("h-1 w-full", product.barColor)} />

        <div className="overflow-y-auto max-h-[calc(90vh-4px)]">
          {/* Header Section */}
          <div className="p-6 sm:p-8 border-b border-slate-100 dark:border-slate-800">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center">
              {/* Product Image */}
              <div className="md:w-1/3 flex-shrink-0 w-full">
                <div className="bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-xl overflow-hidden aspect-square flex items-center justify-center">
                  {product.imageUrl && !headerImageFailed ? (
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="w-full h-full object-cover"
                      onError={() => setHeaderImageFailed(true)}
                    />
                  ) : (
                    <div className="relative">
                      <div className="w-32 h-24 sm:w-40 sm:h-28 bg-slate-300 dark:bg-slate-600 rounded-t-lg" />
                      <div className="w-32 sm:w-40 h-3 bg-slate-400 dark:bg-slate-500 rounded-b-sm" />
                      <div className="w-16 sm:w-20 h-2 bg-slate-400 dark:bg-slate-500 mx-auto mt-1 rounded-full" />
                      <ImageOff className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-slate-400 dark:text-slate-500" />
                    </div>
                  )}
                </div>
              </div>

              {/* Product Info */}
              <div className="flex-1">
                <div
                  className={cn(
                    "mb-4 inline-flex max-w-full items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1.5 dark:border-slate-700 dark:bg-slate-800/80",
                    isRTL && "font-cairo",
                  )}
                >
                  <div
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br",
                      product.color,
                    )}
                  >
                    <IconComponent className="h-4 w-4 text-white" />
                  </div>
                  <span className="truncate text-xs font-semibold text-foreground sm:text-sm">
                    {product.categoryLabel ?? (isRTL ? "نظام" : "System")}
                  </span>
                </div>

                {/* Title */}
                <h2 className={cn(
                  "text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-3",
                  isRTL && "font-cairo"
                )}>
                  {product.title}
                </h2>

                {/* Description */}
                <p className={cn(
                  "text-muted-foreground leading-relaxed mb-6",
                  isRTL && "font-cairo"
                )}>
                  {product.description}
                </p>

                {/* Price & CTA */}
                <div className="flex flex-wrap items-center gap-4">
                  <div>
                    <span className={cn("text-xs text-muted-foreground block", isRTL && "font-cairo")}>
                      {t.startingFrom}
                    </span>
                    <span className={cn("text-2xl font-bold text-cyan-600 dark:text-cyan-400", isRTL && "font-cairo")}>
                      {product.price} {t.currency}
                    </span>
                  </div>
                  
                  <div className="flex gap-3">
                    <button className={cn(
                      "px-5 py-2.5 rounded-full border-2 border-slate-300 dark:border-slate-600 text-foreground font-medium hover:border-cyan-500 hover:text-cyan-500 transition-colors",
                      isRTL && "font-cairo"
                    )}>
                      {t.moreDetails}
                    </button>
                    <button className={cn(
                      "px-5 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium hover:shadow-lg hover:shadow-cyan-500/30 transition-all",
                      isRTL && "font-cairo"
                    )}>
                      {t.buyNow}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Screenshots Carousel */}
          <div className="p-6 sm:p-8 bg-slate-50 dark:bg-slate-900/20 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className={cn(
                "text-lg font-bold text-foreground",
                isRTL && "font-cairo"
              )}>
                {t.screenshots}
              </h3>
            </div>
            
            <div className="relative">
              {/* Images/Video Carousel */}
              <div className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl bg-slate-100 dark:bg-slate-950">
                <div 
                  className="flex transition-transform duration-700 cubic-bezier(0.4, 0, 0.2, 1)"
                  style={{ transform: `translateX(${isRTL ? (currentImage * 100) : -(currentImage * 100)}%)` }}
                >
                  {carouselItems.map((item, idx) => (
                    <div key={idx} className="shrink-0 w-full aspect-video flex items-center justify-center">
                      {item.type === "video" ? (
                        <div className="w-full h-full">
                          {(item.url.includes("youtube.com") || item.url.includes("youtu.be")) ? (
                             <iframe
                                className="w-full h-full"
                                src={`https://www.youtube.com/embed/${youtubeId(item.url)}`}
                                title="Product Video"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-view"
                                allowFullScreen
                             />
                          ) : (
                             <video
                                src={item.url}
                                controls
                                className="w-full h-full object-contain bg-black"
                             />
                          )}
                        </div>
                      ) : (
                        <img
                          src={item.url}
                          alt={`Preview ${idx}`}
                          className="w-full h-full object-contain select-none"
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* Navigation Arrows - Overlayed */}
                {carouselItems.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className={cn(
                        "absolute top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100",
                        isRTL ? "right-4" : "left-4"
                      )}
                    >
                      {isRTL ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
                    </button>
                    <button
                      onClick={nextImage}
                      className={cn(
                        "absolute top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100",
                        isRTL ? "left-4" : "right-4"
                      )}
                    >
                      {isRTL ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="p-6 sm:p-8">
            <h3 className={cn(
              "text-lg font-bold mb-4",
              isRTL && "font-cairo"
            )}>
              {t.features}
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {t.featuresList.map((feature, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className={cn(
                    "text-sm text-foreground",
                    isRTL && "font-cairo"
                  )}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="p-6 sm:p-8 bg-gradient-to-r from-cyan-500 to-blue-600">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className={cn("text-lg sm:text-xl font-bold text-white", isRTL && "font-cairo")}>
                  {isRTL ? "هل أنت مهتم بهذا النظام؟" : "Interested in this system?"}
                </h4>
                <p className={cn("text-white/80 text-sm", isRTL && "font-cairo")}>
                  {isRTL ? "تواصل معنا للحصول على عرض توضيحي مجاني" : "Contact us for a free demo"}
                </p>
              </div>
              <button className={cn(
                "px-6 py-3 rounded-full bg-white text-cyan-600 font-bold hover:shadow-lg transition-all",
                isRTL && "font-cairo"
              )}>
                {t.requestDemo}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
