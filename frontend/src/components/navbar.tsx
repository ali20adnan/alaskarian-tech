"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Link } from "react-router-dom"
import { Moon, Sun, Menu, X, Phone, ChevronDown } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { cn } from "@/src/lib/utils"
import { useLanguage, type Language } from "@/src/contexts/language-context"
import { useSiteConfig } from "@/src/contexts/site-config-context"

type DropdownKey = "systems" | "services" | "contact"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isThemeChanging, setIsThemeChanging] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<DropdownKey | null>(null)
  const { theme, resolvedTheme, setTheme } = useTheme()
  const { language, setLanguage, t, isRTL } = useLanguage()
  const { config } = useSiteConfig()
  const whatsappLink = `https://wa.me/${(config.contact.whatsapp || config.contact.phone).replace(/[^\d]/g, "")}`

  const navLinks: { href: string; label: string; hasDropdown: boolean; dropdownKey?: DropdownKey }[] = [
    { href: "#systems", label: t.nav.projects, hasDropdown: true, dropdownKey: "systems" },
    { href: "#services", label: t.nav.services, hasDropdown: true, dropdownKey: "services" },
    { href: "#contact", label: t.nav.contact, hasDropdown: true, dropdownKey: "contact" },
    { href: "#about", label: t.nav.about, hasDropdown: false },
  ]

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (!isThemeChanging) return
    const t = window.setTimeout(() => setIsThemeChanging(false), 250)
    return () => window.clearTimeout(t)
  }, [isThemeChanging])

  const currentTheme = mounted ? (theme === "system" ? resolvedTheme : theme) : undefined

  const toggleTheme = () => {
    if (isThemeChanging || !currentTheme) return
    setIsThemeChanging(true)
    setTheme(currentTheme === "dark" ? "light" : "dark")
  }

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang)
    setIsMobileMenuOpen(false)
  }

  const handleMouseEnter = (key: DropdownKey) => {
    setActiveDropdown(key)
  }

  const handleMouseLeave = () => {
    setActiveDropdown(null)
  }

  return (
    <header
      className={cn(
        "sticky top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled
          ? "bg-background/95 dark:bg-slate-900/95 backdrop-blur-md py-2 shadow-sm dark:shadow-black/20"
          : "py-4 bg-background dark:bg-slate-900/80"
      )}
    >
      <div className="container mx-auto px-4 md:px-6" dir={isRTL ? "rtl" : "ltr"}>
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 rounded-lg border-2 border-cyan-500 bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {language === "ar" ? config.navbar.logoInitialAr : config.navbar.logoInitialEn}
                </span>
              </div>
            </div>
            <span className={cn("text-lg font-bold text-foreground", isRTL && "font-cairo")}>
              {language === "ar" ? config.navbar.logoTitleAr : config.navbar.logoTitleEn}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <div
                key={link.href}
                className="relative"
                onMouseEnter={() => link.dropdownKey && handleMouseEnter(link.dropdownKey)}
                onMouseLeave={handleMouseLeave}
              >
                {link.hasDropdown ? (
                  <button
                    className={cn(
                      "relative px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-300 flex items-center gap-1",
                      isRTL && "font-cairo"
                    )}
                  >
                    {link.label}
                    <ChevronDown 
                      className={cn(
                        "w-4 h-4 transition-transform duration-300",
                        activeDropdown === link.dropdownKey && "rotate-180"
                      )} 
                    />
                  </button>
                ) : (
                  <Link
                    to={link.href}
                    className={cn(
                      "relative px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-300 flex items-center gap-1",
                      isRTL && "font-cairo"
                    )}
                  >
                    {link.label}
                  </Link>
                )}

                {/* Dropdown Menu */}
                {link.hasDropdown && link.dropdownKey && (
                  <div
                    className={cn(
                      "absolute top-full pt-2 transition-all duration-300",
                      isRTL ? "right-0" : "left-0",
                      activeDropdown === link.dropdownKey
                        ? "opacity-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 -translate-y-2 pointer-events-none"
                    )}
                  >
                    <div className="bg-background/98 dark:bg-slate-900/98 backdrop-blur-xl border border-border dark:border-slate-700/50 rounded-xl shadow-xl dark:shadow-black/40 p-2 min-w-[280px]">
                      {t.dropdowns[link.dropdownKey].map((item, index) => (
                        <Link
                          key={index}
                          to={`/${link.dropdownKey}/${item.slug || index}`}
                          onClick={handleMouseLeave}
                          className={cn(
                            "block px-4 py-3 rounded-lg hover:bg-muted dark:hover:bg-slate-800/80 transition-colors duration-200",
                            isRTL && "text-right"
                          )}
                        >
                          <span className={cn(
                            "block font-medium text-foreground text-sm",
                            isRTL && "font-cairo"
                          )}>
                            {item.title}
                          </span>
                          <span className={cn(
                            "block text-xs text-muted-foreground mt-0.5",
                            isRTL && "font-cairo"
                          )}>
                            {item.desc}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Phone Number */}
            <a 
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="hidden md:flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className={isRTL ? "font-cairo" : ""}>
                {language === "ar" 
                  ? `${config.navbar.customerServiceAr} ${config.contact.phone}` 
                  : `${config.navbar.customerServiceEn} ${config.contact.phone}`}
              </span>
            </a>

            {/* Language Switcher */}
            <div className="hidden sm:flex items-center gap-1">
              <button 
                onClick={() => handleLanguageChange("en")}
                className={cn(
                  "px-2 py-1 text-sm font-medium rounded transition-all duration-300",
                  language === "en" 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                EN
              </button>
              <span className="text-muted-foreground/50">|</span>
              <button 
                onClick={() => handleLanguageChange("ar")}
                className={cn(
                  "px-2 py-1 text-sm font-medium rounded transition-all duration-300 font-cairo",
                  language === "ar" 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                عربي
              </button>
            </div>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              disabled={!mounted || isThemeChanging}
              className="w-9 h-9 rounded-full hover:bg-muted transition-colors duration-200 disabled:opacity-100"
              aria-label="Toggle theme"
            >
              {mounted && (currentTheme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />)}
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-9 h-9 rounded-full hover:bg-muted"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-500",
            isMobileMenuOpen ? "max-h-[600px] mt-4" : "max-h-0"
          )}
          dir={isRTL ? "rtl" : "ltr"}
        >
          <div className="bg-muted/50 rounded-2xl p-4 space-y-2">
            {navLinks.map((link) => (
              <MobileNavItem
                key={link.href}
                link={link}
                isRTL={isRTL}
                dropdowns={t.dropdowns}
                onClose={() => setIsMobileMenuOpen(false)}
              />
            ))}
            
            {/* Mobile Phone */}
            <a 
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className={cn(
                "flex items-center gap-2 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-background rounded-xl transition-all duration-300",
                isRTL && "font-cairo"
              )}
            >
              <Phone className="w-4 h-4" />
              <span>
                {language === "ar" 
                  ? `${config.navbar.customerServiceAr} ${config.contact.phone}` 
                  : `${config.navbar.customerServiceEn} ${config.contact.phone}`}
              </span>
            </a>

            {/* Mobile Language Switcher */}
            <div className="flex items-center justify-center gap-4 pt-2 border-t border-border/50">
              <button 
                onClick={() => handleLanguageChange("en")}
                className={cn(
                  "px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300",
                  language === "en" 
                    ? "text-primary bg-primary/10" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                EN
              </button>
              <button 
                onClick={() => handleLanguageChange("ar")}
                className={cn(
                  "px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 font-cairo",
                  language === "ar" 
                    ? "text-primary bg-primary/10" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                عربي
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

// Mobile Navigation Item Component
interface MobileNavItemProps {
  key?: string | number
  link: { href: string; label: string; hasDropdown: boolean; dropdownKey?: DropdownKey }
  isRTL: boolean
  dropdowns: {
    systems: { title: string; desc: string; slug: string }[]
    services: { title: string; desc: string; slug: string }[]
    contact: { title: string; desc: string }[]
  }
  onClose: () => void
}

function MobileNavItem({
  link,
  isRTL,
  dropdowns,
  onClose,
}: MobileNavItemProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (!link.hasDropdown) {
    return (
      <Link
        to={link.href}
        onClick={onClose}
        className={cn(
          "flex items-center justify-between px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-background rounded-xl transition-all duration-300",
          isRTL && "font-cairo"
        )}
      >
        {link.label}
      </Link>
    )
  }

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-background rounded-xl transition-all duration-300",
          isRTL && "font-cairo"
        )}
      >
        <span>{link.label}</span>
        <ChevronDown className={cn("w-4 h-4 transition-transform duration-300", isOpen && "rotate-180")} />
      </button>
      
      <div className={cn(
        "overflow-hidden transition-all duration-300",
        isOpen ? "max-h-96" : "max-h-0"
      )}>
        <div className="py-2 space-y-1">
          {link.dropdownKey && dropdowns[link.dropdownKey].map((item, index) => (
            <Link
              key={index}
              to={`/${link.dropdownKey}/${item.slug || index}`}
              onClick={onClose}
              className={cn(
                "block px-6 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors",
                isRTL && "font-cairo"
              )}
            >
              {item.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
