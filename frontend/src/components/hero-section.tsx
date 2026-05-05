"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { useLanguage } from "@/src/contexts/language-context"
import { cn } from "@/src/lib/utils"
import { useState, useEffect } from "react"
import { useSiteConfig } from "@/src/contexts/site-config-context"
import { motion, AnimatePresence } from "motion/react"

function splitTitleLastWord(title: string): { before: string; last: string } {
  const words = title.trim().split(/\s+/).filter(Boolean)
  if (words.length <= 1) {
    return { before: title.trim(), last: "" }
  }
  return {
    before: words.slice(0, -1).join(" "),
    last: words[words.length - 1] ?? "",
  }
}

export function HeroSection() {
  const { isRTL, language } = useLanguage()
  const { config } = useSiteConfig()
  const [currentSlide, setCurrentSlide] = useState(0)

  const titleArParts = splitTitleLastWord(config.hero.titleAr)
  const titleEnParts = splitTitleLastWord(config.hero.titleEn)

  const slides = [
    {
      headline1: language === "ar" ? titleArParts.before : titleEnParts.before,
      headline2: language === "ar" ? titleArParts.last : titleEnParts.last,
      description: language === 'ar' ? config.hero.subtitleAr : config.hero.subtitleEn,
      primaryBtn: language === 'ar' ? config.hero.primaryButtonAr : config.hero.primaryButtonEn,
      secondaryBtn: language === 'ar' ? config.hero.secondaryButtonAr : config.hero.secondaryButtonEn,
    },
    {
      headline1: isRTL ? "حلول تقنية متكاملة" : "Integrated Tech Solutions",
      headline2: isRTL ? "لنمو أعمالك" : "For Your Business Growth",
      description: isRTL 
        ? "أنظمة إدارة متطورة تناسب احتياجاتك" 
        : "Advanced management systems tailored to your needs",
      primaryBtn: language === 'ar' ? config.hero.primaryButtonAr : config.hero.primaryButtonEn,
      secondaryBtn: language === 'ar' ? config.hero.secondaryButtonAr : config.hero.secondaryButtonEn,
    },
    {
      headline1: isRTL ? "دعم فني متواصل" : "Continuous Support",
      headline2: isRTL ? "على مدار الساعة" : "Around the Clock",
      description: isRTL 
        ? "فريق متخصص لخدمتك في أي وقت" 
        : "Dedicated team to serve you anytime",
      primaryBtn: language === 'ar' ? config.hero.primaryButtonAr : config.hero.primaryButtonEn,
      secondaryBtn: language === 'ar' ? config.hero.secondaryButtonAr : config.hero.secondaryButtonEn,
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden bg-background"
    >
      {/* White Background */}
      <div className="absolute inset-0 bg-background" />

      {/* Blue Arc Shape with Waves */}
      <div className="absolute top-0 left-0 right-0 h-[85vh] overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[200vw] h-[170vh] rounded-b-[50%] dark:opacity-100"
          style={{
            background: "linear-gradient(180deg, #0055AA 0%, #007799 40%, #008899 70%, #009988 100%)",
          }}
        />
        
        {/* Animated Wave Divider at the bottom for smoother transition */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-[0] transform translate-y-[1px]">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="relative block w-[calc(100%+1.3px)] h-[60px]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
              className="fill-background"
            />
          </svg>
        </div>

        {/* Wave Lines on Arc */}
        <svg
          className="absolute bottom-[15%] left-0 right-0 w-full"
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          style={{ height: "100px" }}
        >
          {/* Wave 1 */}
          <path
            d="M0,60 C240,90 480,30 720,60 C960,90 1200,30 1440,60"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
            fill="none"
            className="animate-wave-slow-path"
          />
          {/* Wave 2 */}
          <path
            d="M0,80 C360,110 720,50 1080,80 C1260,95 1380,65 1440,80"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
            fill="none"
            className="animate-wave-medium-path"
          />
        </svg>
      </div>

      {/* Navigation Arrows */}
      <motion.button
        initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
        onClick={prevSlide}
        className={cn(
          "absolute top-[35%] sm:top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full border-2 border-white/20 dark:border-white/30 bg-slate-800/60 dark:bg-slate-900/70 backdrop-blur-md flex items-center justify-center text-white/80 hover:border-cyan-400 hover:text-cyan-400 hover:bg-slate-800/80 dark:hover:bg-slate-900/90 transition-all duration-300 shadow-xl",
          isRTL ? "right-2 sm:right-4 md:right-8" : "left-2 sm:left-4 md:left-8"
        )}
        aria-label="Previous slide"
      >
        {isRTL ? <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" /> : <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />}
      </motion.button>

      <motion.button
        initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
        onClick={nextSlide}
        className={cn(
          "absolute top-[35%] sm:top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full border-2 border-white/20 dark:border-white/30 bg-slate-800/60 dark:bg-slate-900/70 backdrop-blur-md flex items-center justify-center text-white/80 hover:border-cyan-400 hover:text-cyan-400 hover:bg-slate-800/80 dark:hover:bg-slate-900/90 transition-all duration-300 shadow-xl",
          isRTL ? "left-2 sm:left-4 md:left-8" : "right-2 sm:right-4 md:right-8"
        )}
        aria-label="Next slide"
      >
        {isRTL ? <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" /> : <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />}
      </motion.button>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 pt-32 pb-20" dir={isRTL ? "rtl" : "ltr"}>
        <div className={cn(
          "text-center",
          isRTL && "font-cairo direction-rtl"
        )}>
          {/* Main Headlines */}
          <div className="min-h-[220px] flex flex-col justify-center items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center"
              >
                <h1 
                  className={cn(
                    "text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6",
                    isRTL ? "tracking-normal leading-tight" : "tracking-tight"
                  )}
                >
                  <span 
                    className="block text-white" 
                    style={{ textShadow: '0 4px 16px rgba(0,0,0,0.2)' }}
                  >
                    {slides[currentSlide].headline1}
                  </span>
                  <span
                    className="block mt-3 text-secondary"
                    style={{ textShadow: "0 4px 16px rgba(0,0,0,0.25)" }}
                  >
                    {slides[currentSlide].headline2}
                  </span>
                </h1>

                {/* Description */}
                <p 
                  className={cn(
                    "text-base sm:text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8 font-medium text-center",
                    isRTL && "leading-relaxed"
                  )}
                  style={{ textShadow: '0 2px 10px rgba(0,0,0,0.15)' }}
                >
                  {slides[currentSlide].description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Slide Indicators */}
          <div className="flex items-center justify-center gap-3 mt-6 mb-12">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={cn(
                  "h-3 rounded-full transition-all duration-300",
                  currentSlide === index 
                    ? "w-10 bg-secondary" 
                    : "w-3 bg-white/40 hover:bg-white/60"
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Device Mockups */}
        <div className={cn(
          "relative flex items-end justify-center gap-4 mt-8",
          isRTL && "flex-row-reverse"
        )}>
          {/* Left Phone (Products) - Shows on right in RTL */}
          <motion.div 
            initial={{ opacity: 0, y: 100, rotate: isRTL ? 15 : -15 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              rotate: isRTL ? 6 : -6 
            }}
            transition={{ 
              duration: 1, 
              delay: 0.2,
              type: "spring",
              stiffness: 50
            }}
            className={cn(
              "hidden md:block relative w-48 lg:w-56",
              isRTL ? "" : ""
            )}
          >
            <motion.div
              animate={{
                y: [8, -8, 8],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              <div className="bg-slate-900 dark:bg-slate-950 rounded-3xl p-2 shadow-2xl shadow-black/40 ring-1 ring-white/10">
                <div className="bg-white dark:bg-slate-100 rounded-2xl overflow-hidden aspect-[9/19]">
                  <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 p-3">
                    {/* Product List */}
                    <div className={cn(
                      "text-xs font-semibold text-slate-800 mb-3",
                      isRTL ? "text-right font-cairo" : "text-left"
                    )}>
                      {isRTL ? "المنتجات" : "Products"}
                    </div>
                    <div className="space-y-2">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className={cn(
                          "flex items-center gap-2 p-2 rounded-lg bg-slate-100",
                          isRTL && "flex-row-reverse"
                        )}>
                          <div className="w-8 h-8 rounded bg-gradient-to-br from-cyan-200 to-blue-200" />
                          <div className="flex-1">
                            <div className="h-2 w-16 rounded bg-slate-300 mb-1" />
                            <div className="h-2 w-10 rounded bg-slate-200" />
                          </div>
                          <div className="text-xs font-bold text-cyan-600">
                            ${(20 + i * 15)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Center Tablet */}
          <motion.div 
            initial={{ opacity: 0, y: 120 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 1, 
              type: "spring",
              stiffness: 50
            }}
            className="relative w-56 sm:w-64 md:w-72 lg:w-80 z-10"
          >
            <motion.div
              animate={{
                y: [-10, 10, -10],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="bg-slate-900 dark:bg-slate-950 rounded-2xl sm:rounded-3xl p-2 sm:p-3 shadow-2xl shadow-black/50 ring-1 ring-white/10">
                <div className="bg-white dark:bg-slate-100 rounded-xl sm:rounded-2xl overflow-hidden">
                  <div className="w-full bg-gradient-to-br from-slate-50 to-slate-100 p-3 sm:p-4">
                    {/* App Header */}
                    <div className={cn(
                      "flex items-center justify-between mb-3 sm:mb-4",
                      isRTL && "flex-row-reverse"
                    )}>
                      <div className={cn(
                        "flex items-center gap-2",
                        isRTL && "flex-row-reverse"
                      )}>
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600" />
                        <span className={cn("text-[10px] sm:text-xs font-semibold text-slate-800", isRTL && "font-cairo")}>
                          {isRTL ? "العسكريان" : "Al-Askaryan"}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-slate-200" />
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-slate-200" />
                      </div>
                    </div>
                    
                    {/* Grid Items */}
                    <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                      {[...Array(9)].map((_, i) => (
                        <div key={i} className="aspect-square rounded-md sm:rounded-lg bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                          <div className="w-4 h-4 sm:w-6 sm:h-6 rounded bg-slate-400/50" />
                        </div>
                      ))}
                    </div>
                    
                    {/* Bottom Button */}
                    <div className="mt-3 sm:mt-4 pb-1">
                      <div className={cn(
                        "w-full py-2 sm:py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-[10px] sm:text-xs font-semibold text-center shadow-lg shadow-cyan-500/20",
                        isRTL && "font-cairo"
                      )}>
                        {isRTL ? "إضافة منتج" : "Add Product"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Phone (Agents) - Shows on left in RTL */}
          <motion.div 
            initial={{ opacity: 0, y: 100, rotate: isRTL ? -15 : 15 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              rotate: isRTL ? -6 : 6 
            }}
            transition={{ 
              duration: 1, 
              delay: 0.4,
              type: "spring",
              stiffness: 50
            }}
            className={cn(
              "hidden md:block relative w-48 lg:w-56",
              isRTL ? "" : ""
            )}
          >
            <motion.div
              animate={{
                y: [8, -8, 8],
              }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="bg-slate-900 dark:bg-slate-950 rounded-3xl p-2 shadow-2xl shadow-black/40 ring-1 ring-white/10">
                <div className="bg-slate-800 dark:bg-slate-900 rounded-2xl overflow-hidden aspect-[9/19]">
                  <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center">
                    <div className="text-center p-4">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                        <span className={cn("text-white text-2xl font-bold", isRTL && "font-cairo")}>
                          {isRTL ? "ع" : "A"}
                        </span>
                      </div>
                      <p className={cn("text-white/90 text-sm font-medium", isRTL && "font-cairo")}>
                        {isRTL ? "مندوبين" : "Agents"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
