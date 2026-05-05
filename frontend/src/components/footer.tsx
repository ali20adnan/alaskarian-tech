"use client"

import { Link } from "react-router-dom"
import { useLanguage } from "@/src/contexts/language-context"
import { useSiteConfig } from "@/src/contexts/site-config-context"
import { cn } from "@/src/lib/utils"
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin, Twitter } from "lucide-react"

const translations = {
  en: {
    company: {
      name: "Al-Askaryan Tech",
      description: "Leading software solutions provider specializing in distribution management, sales automation, and business intelligence systems.",
    },
    sections: {
      systems: {
        title: "Our Systems",
        links: [
          { name: "Distribution Management", slug: "distribution-management" },
          { name: "Sales Representatives", slug: "sales-representatives" },
          { name: "Inventory System", slug: "inventory-system" },
          { name: "Accounting System", slug: "accounting-system" },
          { name: "Point of Sale", slug: "point-of-sale" },
          { name: "Business Intelligence", slug: "business-intelligence" }
        ],
      },
      services: {
        title: "Services",
        links: [
          { name: "Custom Development", slug: "custom-development" },
          { name: "Mobile Apps", slug: "mobile-apps" },
          { name: "Cloud Solutions", slug: "cloud-solutions" },
          { name: "Technical Support", slug: "technical-support" },
          { name: "Training", slug: "training" },
          { name: "Consulting", slug: "consulting" }
        ],
      },
      company: {
        title: "Company",
        links: [
          { name: "About Us", slug: "about" },
          { name: "Our Team", slug: "team" },
          { name: "Careers", slug: "careers" },
          { name: "Partners", slug: "partners" },
          { name: "Blog", slug: "blog" },
          { name: "Contact", slug: "contact" }
        ],
      },
    },
    contact: { title: "Contact Us" },
    copyright: "All rights reserved.",
    madeWith: "Made with excellence in Iraq",
  },
  ar: {
    company: {
      name: "العسكريان للحلول البرمجية",
      description: "مزود رائد للحلول البرمجية متخصص في إدارة التوزيع وأتمتة المبيعات وأنظمة ذكاء الأعمال.",
    },
    sections: {
      systems: {
        title: "أنظمتنا",
        links: [
          { name: "إدارة التوزيع", slug: "distribution-management" },
          { name: "المندوبين", slug: "sales-representatives" },
          { name: "نظام المخازن", slug: "inventory-system" },
          { name: "النظام المحاسبي", slug: "accounting-system" },
          { name: "نقاط البيع", slug: "point-of-sale" },
          { name: "ذكاء الأعمال", slug: "business-intelligence" }
        ],
      },
      services: {
        title: "الخدمات",
        links: [
          { name: "تطوير مخصص", slug: "custom-development" },
          { name: "تطبيقات الموبايل", slug: "mobile-apps" },
          { name: "حلول سحابية", slug: "cloud-solutions" },
          { name: "الدعم الفني", slug: "technical-support" },
          { name: "التدريب", slug: "training" },
          { name: "الاستشارات", slug: "consulting" }
        ],
      },
      company: {
        title: "الشركة",
        links: [
          { name: "من نحن", slug: "about" },
          { name: "فريقنا", slug: "team" },
          { name: "الوظائف", slug: "careers" },
          { name: "الشركاء", slug: "partners" },
          { name: "المدونة", slug: "blog" },
          { name: "تواصل معنا", slug: "contact" }
        ],
      },
    },
    contact: { title: "تواصل معنا" },
    copyright: "جميع الحقوق محفوظة.",
    madeWith: "صُنع بإتقان في العراق",
  },
}

export function Footer() {
  const { isRTL } = useLanguage()
  const { config } = useSiteConfig()
  const t = isRTL ? translations.ar : translations.en
  const phoneText = config.contact.phone
  const whatsappLink = `https://wa.me/${(config.contact.whatsapp || config.contact.phone).replace(/[^\d]/g, "")}`
  const addressText = isRTL ? config.contact.addressAr : config.contact.addressEn
  const socials = [
    { Icon: Facebook, url: config.contact.socials.facebook, label: "Facebook" },
    { Icon: Twitter, url: config.contact.socials.twitter, label: "Twitter" },
    { Icon: Instagram, url: config.contact.socials.instagram, label: "Instagram" },
    { Icon: Linkedin, url: config.contact.socials.linkedin, label: "LinkedIn" },
  ]

  return (
    <footer className="bg-slate-950 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 md:px-6 py-8 sm:py-12 md:py-16" dir={isRTL ? "rtl" : "ltr"}>
        {/* Mobile: Company Info First */}
        <div className="mb-8 sm:mb-10 lg:hidden">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <span className={cn("text-white font-bold text-lg", isRTL && "font-cairo")}>
                {isRTL ? "ع" : "A"}
              </span>
            </div>
            <span className={cn("text-lg sm:text-xl font-bold", isRTL && "font-cairo")}>
              {t.company.name}
            </span>
          </div>
          <p className={cn(
            "text-slate-400 mb-6 text-sm sm:text-base leading-relaxed",
            isRTL && "font-cairo"
          )}>
            {t.company.description}
          </p>
          {/* Social Links */}
          <div className="flex gap-2 sm:gap-3">
            {socials.map(({ Icon, url, label }) => (
              <a
                key={label}
                href={url || "#"}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-slate-800 hover:bg-cyan-600 flex items-center justify-center transition-colors duration-300"
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8 md:gap-12">
          {/* Company Info - Desktop Only */}
          <div className="hidden lg:block lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <span className={cn("text-white font-bold text-lg", isRTL && "font-cairo")}>
                  {isRTL ? "ع" : "A"}
                </span>
              </div>
              <span className={cn("text-xl font-bold", isRTL && "font-cairo")}>
                {t.company.name}
              </span>
            </div>
            <p className={cn(
              "text-slate-400 mb-6 max-w-sm leading-relaxed",
              isRTL && "font-cairo"
            )}>
              {t.company.description}
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {socials.map(({ Icon, url, label }) => (
                <a
                  key={label}
                  href={url || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-cyan-600 flex items-center justify-center transition-colors duration-300"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div className="hidden lg:block">
            <h4 className={cn(
              "text-base sm:text-lg font-semibold mb-3 sm:mb-4",
              isRTL && "font-cairo"
            )}>
              {t.sections.company.title}
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              {t.sections.company.links.map((link, i) => (
                <li key={i}>
                  <Link
                    to={`/company/${link.slug}`}
                    className={cn(
                      "text-sm sm:text-base text-slate-400 hover:text-cyan-400 transition-colors",
                      isRTL && "font-cairo"
                    )}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Systems */}
          <div>
            <h4 className={cn(
              "text-base sm:text-lg font-semibold mb-3 sm:mb-4",
              isRTL && "font-cairo"
            )}>
              {t.sections.systems.title}
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              {t.sections.systems.links.map((link, i) => (
                <li key={i}>
                  <Link
                    to={`/systems/${link.slug}`}
                    className={cn(
                      "text-sm sm:text-base text-slate-400 hover:text-cyan-400 transition-colors",
                      isRTL && "font-cairo"
                    )}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className={cn(
              "text-base sm:text-lg font-semibold mb-3 sm:mb-4",
              isRTL && "font-cairo"
            )}>
              {t.sections.services.title}
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              {t.sections.services.links.map((link, i) => (
                <li key={i}>
                  <Link
                    to={`/services/${link.slug}`}
                    className={cn(
                      "text-sm sm:text-base text-slate-400 hover:text-cyan-400 transition-colors",
                      isRTL && "font-cairo"
                    )}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 sm:col-span-2 md:col-span-1">
            <h4 className={cn(
              "text-base sm:text-lg font-semibold mb-3 sm:mb-4",
              isRTL && "font-cairo"
            )}>
              {t.contact.title}
            </h4>
            <ul className="space-y-3 sm:space-y-4">
              <li>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-500 shrink-0" />
                  <span dir="ltr">{phoneText}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${config.contact.email}`}
                  className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-500 shrink-0" />
                  <span className="break-all">{config.contact.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={config.contact.websiteUrl || "/location"}
                  className={cn(
                  "flex items-center gap-2 sm:gap-3 text-sm sm:text-base text-slate-400",
                  "hover:text-cyan-400 transition-colors",
                  isRTL && "font-cairo"
                )}>
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-500 shrink-0" />
                  <span>{addressText}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="container mx-auto px-4 md:px-6 py-4 sm:py-6" dir={isRTL ? "rtl" : "ltr"}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
            <p className={cn(
              "text-slate-500 text-xs sm:text-sm text-center sm:text-start",
              isRTL && "font-cairo"
            )}>
              &copy; {new Date().getFullYear()} {t.company.name}. {t.copyright}
            </p>
            <div className="flex flex-col items-center sm:items-end gap-2">
              <p className={cn(
                "text-slate-500 text-xs sm:text-sm",
                isRTL && "font-cairo"
              )}>
                {t.madeWith}
              </p>
              <Link 
                to="/admin" 
                className={cn(
                  "text-[10px] text-slate-700 hover:text-slate-500 transition-colors uppercase tracking-widest",
                  isRTL && "font-cairo"
                )}
              >
                {isRTL ? "دخول المسؤول" : "Admin Login"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
