import { useParams, Link } from "react-router-dom"
import { useLanguage } from "@/src/contexts/language-context"
import { useState, useEffect } from "react"
import { motion } from "motion/react"
import { ArrowLeft, CheckCircle2, ChevronRight, Layout, Cpu, Users, Briefcase } from "lucide-react"
import { cn } from "@/src/lib/utils"

const contentMap: Record<string, any> = {
  "distribution-management": {
    en: {
      title: "Distribution Management System",
      description: "A comprehensive solution for managing complex distribution networks, tracking shipments, and optimizing delivery routes in real-time.",
      features: ["Real-time Fleet Tracking", "Route Optimization", "Delivery Confirmation", "Inventory Integration"],
      icon: Layout
    },
    ar: {
      title: "نظام إدارة التوزيع",
      description: "حل شامل لإدارة شبكات التوزيع المعقدة، وتتبع الشحنات، وتحسين مسارات التسليم في الوقت الفعلي.",
      features: ["تتبع الأسطول في الوقت الفعلي", "تحسين المسار", "تأكيد التسليم", "تكامل المخزون"],
      icon: Layout
    }
  },
  "sales-representatives": {
    en: {
      title: "Sales Representatives System",
      description: "Empower your field agents with tools to manage orders, customer visits, and sales targets on the go.",
      features: ["Mobile Order Management", "CRM Integration", "Target Tracking", "Performance Analytics"],
      icon: Users
    },
    ar: {
      title: "نظام المندوبين",
      description: "قم بتمكين وكلائك الميدانيين بالأدوات اللازمة لإدارة الطلبات وزيارات العملاء وأهداف المبيعات أثناء التنقل.",
      features: ["إدارة الطلبات عبر الهاتف المحمول", "تكامل CRM", "تتبع الأهداف", "تحليلات الأداء"],
      icon: Users
    }
  },
  "custom-development": {
    en: {
      title: "Custom Software Development",
      description: "Tailor-made software solutions built specifically to address your unique business challenges and requirements.",
      features: ["Bespoke Architecture", "Agile Methodology", "Scalable Tech Stack", "Continuous Integration"],
      icon: Cpu
    },
    ar: {
      title: "تطوير برمحيات مخصص",
      description: "حلول برمجية مصممة خصيصًا لتلبية تحديات ومتطلبات عملك الفريدة.",
      features: ["هيكل مخصص", "منهجية Agile", "تقنيات قابلة للتطوير", "تكامل مستمر"],
      icon: Cpu
    }
  },
  "accounting-system": {
    en: {
      title: "Advanced Accounting System",
      description: "Comprehensive financial management with real-time reporting, tax compliance, and automated ledger entries.",
      features: ["Automated Invoicing", "General Ledger", "Financial Reports", "Tax Integration"],
      icon: Layout
    },
    ar: {
      title: "النظام المحاسبي المتقدم",
      description: "إدارة مالية شاملة مع تقارير فورية، وامتثال ضريبي، وقيود دفاتر مؤتمتة.",
      features: ["فواتير مؤتمتة", "دفتر الأستاذ العام", "تقارير مالية", "التكامل الضريبي"],
      icon: Layout
    }
  },
  "cloud-solutions": {
    en: {
      title: "Enterprise Cloud Solutions",
      description: "Scalable and secure cloud infrastructure designed to host your applications with maximum uptime and performance.",
      features: ["Cloud Hosting", "Auto-scaling", "Disaster Recovery", "Microservices Architecture"],
      icon: Cpu
    },
    ar: {
      title: "الحلول السحابية للمؤسسات",
      description: "بنية تحتية سحابية قابلة للتطوير وآمنة مصممة لاستضافة تطبيقاتك بأقصى قدر من التوافر والأداء.",
      features: ["استضافة سحابية", "توسيع تلقائي", "التعافي من الكوارث", "هيكلية Microservices"],
      icon: Cpu
    }
  },
  "inventory-system": {
    en: {
      title: "Inventory Control System",
      description: "Manage your warehouses with precision. Track stock levels, handle transfers, and automate reordering.",
      features: ["Multi-warehouse Support", "Barcode Scanning", "Auto-reorder Logic", "Stock History"],
      icon: Layout
    },
    ar: {
      title: "نظام مراقبة المخزون",
      description: "إدارة مستودعاتك بدقة. تتبع مستويات المخزون، والتعامل مع التحويلات، وأتمتة إعادة الطلب.",
      features: ["دعم مخازن متعددة", "مسح الباركود", "منطق إعادة الطلب التلقائي", "سجل المخزون"],
      icon: Layout
    }
  },
  "mobile-apps": {
    en: {
      title: "Mobile App Development",
      description: "Developing high-performance iOS and Android applications that provide seamless user experiences.",
      features: ["Native Performance", "Cross-platform Tech", "UX-focused Design", "App Store Deployment"],
      icon: Users
    },
    ar: {
      title: "تطوير تطبيقات الموبايل",
      description: "تطوير تطبيقات iOS و Android عالية الأداء توفر تجارب مستخدم سلسة.",
      features: ["أداء أصلي", "تقنيات متعددة المنصات", "تصميم يركز على تجربة المستخدم", "نشر في المتاجر"],
      icon: Users
    }
  }
}

export function DetailedPage() {
  const { id } = useParams()
  const { language } = useLanguage()
  const isRTL = language === 'ar'

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])
  
  const content = contentMap[id || ""]?.[language] || {
    en: {
      title: id?.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") || "Details",
      description: `Detailed information about ${id?.replace("-", " ")}. We provide top-notch solutions to help your business grow and achieve its goals.`,
      features: ["Customizable Workflow", "High Performance", "Secure Data", "Full Support"],
      icon: Briefcase
    },
    ar: {
      title: id?.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") || "تفاصيل",
      description: `معلومات مفصلة حول ${id?.replace("-", " ")}. نحن نقدم حلولاً من الدرجة الأولى لمساعدة عملك على النمو وتحقيق أهدافه.`,
      features: ["سير عمل قابل للتخصيص", "أداء عالي", "بيانات آمنة", "دعم كامل"],
      icon: Briefcase
    }
  }[language]

  const Icon = content.icon

  return (
    <main className="container mx-auto px-4 py-32" dir={isRTL ? "rtl" : "ltr"}>
      <Link 
        to="/" 
        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-12 group transition-all"
      >
        {isRTL ? <ChevronRight className="w-5 h-5 group-hover:translate-x-1" /> : <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1" />}
        <span className={cn(isRTL && "font-cairo")}>
          {isRTL ? "العودة للرئيسية" : "Back to Home"}
        </span>
      </Link>

      <div className="grid lg:grid-cols-2 gap-16 items-start">
        <motion.div
          initial={{ opacity: 0, x: isRTL ? 40 : -40 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <div className="inline-flex p-4 bg-blue-100 dark:bg-blue-900/30 rounded-2xl text-blue-600 mb-4">
            <Icon size={48} />
          </div>
          
          <h1 className={cn(
            "text-5xl md:text-6xl font-bold dark:text-white leading-tight",
            isRTL && "font-cairo"
          )}>
            {content.title}
          </h1>
          
          <p className={cn(
            "text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl",
            isRTL && "font-cairo"
          )}>
            {content.description}
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            {content.features.map((feature: string, i: number) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 rounded-xl shadow-sm border dark:border-slate-800">
                <CheckCircle2 className="text-emerald-500 w-5 h-5 shrink-0" />
                <span className={cn("font-medium dark:text-slate-200", isRTL && "font-cairo")}>
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          <div className="aspect-square bg-gradient-to-br from-blue-600/10 to-cyan-500/10 rounded-3xl overflow-hidden shadow-2xl border dark:border-slate-800 flex items-center justify-center p-12">
             <div className="w-full h-full bg-white dark:bg-slate-900 rounded-2xl shadow-inner flex items-center justify-center relative overflow-hidden group">
                <Icon size={120} className="text-blue-600/20 dark:text-blue-600/10" />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-600/5 to-transparent" />
                
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl animate-pulse delay-700" />
             </div>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
