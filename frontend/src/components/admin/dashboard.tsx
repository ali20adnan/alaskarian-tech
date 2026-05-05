import { useState, useEffect, useRef, useMemo } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "motion/react"
import { 
  Users, 
  MessageSquare, 
  LayoutDashboard, 
  TrendingUp, 
  Settings, 
  LogOut,
  Bell,
  Search,
  CheckCircle2,
  Clock,
  Menu,
  X,
  FileText,
  Palette,
  Eye,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Box,
  Monitor,
  ExternalLink,
  ChevronDown,
  Paperclip,
  Smile,
  Bookmark,
  ShoppingBag,
  Ban,
} from "lucide-react"
import { cn } from "@/src/lib/utils"
import { Button } from "@/src/components/ui/button"
import { useSiteConfig } from "@/src/contexts/site-config-context"

interface AdminDashboardProps {
  onLogout: () => void
  isRTL: boolean
}

type TabType = "overview" | "content" | "appearance" | "support" | "settings" | "logs" | "users" | "products"

/** iOS-style switch; `dir="ltr"` keeps thumb motion correct inside RTL admin layout */
function AdminToggle({
  checked,
  onCheckedChange,
  activeClassName,
}: {
  checked: boolean
  onCheckedChange: () => void
  activeClassName: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onCheckedChange}
      dir="ltr"
      className={cn(
        "relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center justify-start rounded-full p-1 transition-colors",
        "border border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900",
        checked ? activeClassName : "bg-slate-300 dark:bg-slate-600",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-md ring-1 ring-black/10 transition-transform duration-200 ease-out",
          checked ? "translate-x-5" : "translate-x-0",
        )}
      />
    </button>
  )
}

const SUPPORT_EMOJIS = ["😀", "👍", "❤️", "🙏", "✅", "⏰", "📷", "🎉", "😊", "🔔"]

type SupportMsg = {
  id: string
  role: "user" | "agent"
  text: string
  time: string
  imageUrl?: string
}

export function AdminDashboard({ onLogout, isRTL }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>("overview")
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const { config, updateConfig, resetConfig } = useSiteConfig()
  const [localConfig, setLocalConfig] = useState(config)
  const [isSaving, setIsSaving] = useState(false)
  const [logs, setLogs] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [isProductsLoading, setIsProductsLoading] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [newProduct, setNewProduct] = useState({
    nameAr: "",
    nameEn: "",
    price: 0,
    category: "",
    descriptionAr: "",
    descriptionEn: "",
    imageUrl: "",
    videoUrl: ""
  })

  const [supportMessages, setSupportMessages] = useState<SupportMsg[]>([
    {
      id: "m1",
      role: "user",
      text: "مرحباً، اواجه مشكلة في تفعيل لوحة التحكم الجديدة. هل يمكنك المساعدة؟",
      time: "10:15 AM",
    },
    {
      id: "m2",
      role: "agent",
      text: "أهلاً بك أحمد، نعم بالتأكيد! نحتاج أولاً للتأكد من رقم المتسلسل للنظام لديك.",
      time: "10:18 AM",
    },
  ])
  const [supportReply, setSupportReply] = useState("")
  const [supportImagePreview, setSupportImagePreview] = useState<string | null>(null)
  const [showSupportEmoji, setShowSupportEmoji] = useState(false)
  const [showSupportCanned, setShowSupportCanned] = useState(false)
  const [showSupportOrders, setShowSupportOrders] = useState(false)
  const [activeChatBlocked, setActiveChatBlocked] = useState(false)
  const supportAttachmentRef = useRef<HTMLInputElement>(null)

  const cannedReplies = useMemo(
    () =>
      isRTL
        ? [
            { id: "c1", label: "طلب الرقم التسلسلي", body: "مرحباً، يرجى إرسال الرقم التسلسلي الظاهر في شاشة التفعيل." },
            { id: "c2", label: "تأكيد الاستلام", body: "تم استلام طلبك وسيتم التواصل معك خلال دقائق." },
            { id: "c3", label: "إغلاق تذكرة", body: "نأمل أن تكون المشكلة قد حُلت. نسعد بخدمتك دائماً." },
          ]
        : [
            { id: "c1", label: "Ask for serial", body: "Hello, please send the serial number shown on your activation screen." },
            { id: "c2", label: "Acknowledge", body: "Thanks — we received your request and will reply shortly." },
            { id: "c3", label: "Close ticket", body: "We hope the issue is resolved. Let us know if you need anything else." },
          ],
    [isRTL],
  )

  const mockCustomerOrders = useMemo(
    () =>
      isRTL
        ? [
            { id: "ORD-1042", total: "1,124,000 د.ع", status: "مكتمل", date: "2025-04-28" },
            { id: "ORD-1038", total: "450,000 د.ع", status: "قيد الشحن", date: "2025-04-22" },
          ]
        : [
            { id: "ORD-1042", total: "1,124,000 IQD", status: "Completed", date: "2025-04-28" },
            { id: "ORD-1038", total: "450,000 IQD", status: "Shipped", date: "2025-04-22" },
          ],
    [isRTL],
  )

  useEffect(() => {
    if (activeTab === "logs") {
      fetch("/api/logs").then(res => res.json()).then(setLogs)
    }
    if (activeTab === "products") {
      fetchProducts()
    }
  }, [activeTab])

  const fetchProducts = async () => {
    setIsProductsLoading(true)
    try {
      const res = await fetch("/api/products")
      const data = await res.json()
      setProducts(data)
    } finally {
      setIsProductsLoading(false)
    }
  }

  const handleCreateProduct = async () => {
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct)
    })
    if (res.ok) {
      setNewProduct({ nameAr: "", nameEn: "", price: 0, category: "", descriptionAr: "", descriptionEn: "", imageUrl: "", videoUrl: "" })
      fetchProducts()
    }
  }

  const handleUpdateProduct = async () => {
    const res = await fetch(`/api/products/${editingProduct.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingProduct)
    })
    if (res.ok) {
      setEditingProduct(null)
      fetchProducts()
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (!confirm(isRTL ? "هل أنت متأكد؟" : "Are you sure?")) return
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" })
    if (res.ok) fetchProducts()
  }

  // Sync local state with global config
  useEffect(() => {
    setLocalConfig(config)
  }, [config])

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    updateConfig(localConfig)
    setIsSaving(false)
  }

  const stats = [
    { label: isRTL ? "مجموع المستخدمين" : "Total Users", value: "1,284", icon: Users, color: "bg-blue-500", trend: "+12%" },
    { label: isRTL ? "دردشات نشطة" : "Active Chats", value: "14", icon: MessageSquare, color: "bg-cyan-500", trend: "-5%" },
    { label: isRTL ? "معدل التحويل" : "Conversion Rate", value: "3.4%", icon: TrendingUp, color: "bg-emerald-500", trend: "+2%" },
    { label: isRTL ? "أداء النظام" : "System Health", value: "99.9%", icon: CheckCircle2, color: "bg-purple-500", trend: "Stable" },
  ]

  const recentChats = [
    { id: 1, user: "احمد علي", message: "احتاج مساعدة في تفعيل النظام", status: "online", time: "2m ago" },
    { id: 2, user: "Sarah Smith", message: "How can I integrate the API?", status: "offline", time: "15m ago" },
    { id: 3, user: "محمد حسن", message: "شكراً لكم، تم حل المشكلة", status: "online", time: "1h ago" },
  ]

  return (
    <div className={cn(
      "min-h-screen bg-slate-50 dark:bg-[#06080a] flex",
      isRTL && "font-cairo"
    )} dir={isRTL ? "rtl" : "ltr"}>
      
      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {!isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(true)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:sticky top-0 z-50 h-screen transition-all duration-300 bg-white dark:bg-slate-900 border-r dark:border-slate-800 flex flex-col shadow-xl lg:shadow-none",
        isSidebarOpen ? "w-72" : "w-20 -translate-x-full lg:translate-x-0"
      )}>
        <div className="flex flex-col h-full w-full overflow-hidden">
          {/* Logo */}
          <div className="p-8 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-600 flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/20">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            {isSidebarOpen && (
              <span className="font-bold text-xl dark:text-white truncate tracking-tight">
                {isRTL ? "لوحة العسكريان" : "Alaskarian Panel"}
              </span>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-2 mt-2 overflow-y-auto custom-scrollbar">
            <Link
              to="/"
              className={cn(
                "mb-3 flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-slate-100 hover:text-foreground dark:hover:bg-slate-800 dark:hover:text-white",
                !isSidebarOpen && "justify-center px-2",
              )}
            >
              <ExternalLink className="h-4 w-4 shrink-0 opacity-70" />
              {isSidebarOpen && (isRTL ? "الموقع العام" : "Public site")}
            </Link>
            <NavItem 
              icon={LayoutDashboard} 
              label={isRTL ? "نظرة عامة" : "Overview"} 
              isActive={activeTab === "overview"} 
              onClick={() => setActiveTab("overview")}
              isOpen={isSidebarOpen}
            />
            <NavItem 
              icon={Users} 
              label={isRTL ? "المستخدمين" : "Users"} 
              isActive={activeTab === "users"} 
              onClick={() => setActiveTab("users")}
              isOpen={isSidebarOpen}
            />
            <NavItem 
              icon={Box} 
              label={isRTL ? "المنتجات" : "Products"} 
              isActive={activeTab === "products"} 
              onClick={() => setActiveTab("products")}
              isOpen={isSidebarOpen}
            />
            <NavItem 
              icon={FileText} 
              label={isRTL ? "إدارة المحتوى" : "Content Management"} 
              isActive={activeTab === "content"} 
              onClick={() => setActiveTab("content")}
              isOpen={isSidebarOpen}
            />
            <NavItem 
              icon={Palette} 
              label={isRTL ? "تخصيص المظهر" : "Appearance"} 
              isActive={activeTab === "appearance"} 
              onClick={() => setActiveTab("appearance")}
              isOpen={isSidebarOpen}
            />
            <NavItem 
              icon={Clock} 
              label={isRTL ? "سجلات النظام" : "System Logs"} 
              isActive={activeTab === "logs"} 
              onClick={() => setActiveTab("logs")}
              isOpen={isSidebarOpen}
            />
            <NavItem 
              icon={MessageSquare} 
              label={isRTL ? "مركز الدعم" : "Support Center"} 
              isActive={activeTab === "support"} 
              onClick={() => setActiveTab("support")}
              isOpen={isSidebarOpen}
              badge="14"
            />
            <NavItem 
              icon={Settings} 
              label={isRTL ? "الإعدادات" : "Settings"} 
              isActive={activeTab === "settings"} 
              onClick={() => setActiveTab("settings")}
              isOpen={isSidebarOpen}
            />
          </nav>

          {/* User Profile & Logout - Fixed at bottom */}
          <div className="mt-auto p-4 border-t dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <div className={cn(
              "flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-slate-800 border dark:border-slate-700 shadow-sm mb-3 transition-all",
              !isSidebarOpen && "justify-center p-2 opacity-0 lg:opacity-100"
            )}>
              <div className="w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center shrink-0 border-2 border-white dark:border-slate-700">
                <Users className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              </div>
              {isSidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold dark:text-white truncate">Admin Account</p>
                  <p className="text-[10px] text-muted-foreground truncate uppercase font-semibold">Super Admin</p>
                </div>
              )}
            </div>
            <Button 
              variant="ghost" 
              onClick={onLogout}
              className={cn(
                "w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl px-4 py-8 transition-all h-auto",
                !isSidebarOpen && "justify-center px-2"
              )}
            >
              <LogOut className="w-5 h-5" />
              {isSidebarOpen && <span className={cn("ml-3 font-bold", isRTL && "mr-3 ml-0")}>{isRTL ? "تسجيل الخروج" : "Logout"}</span>}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Topbar */}
        <header className="h-20 bg-white dark:bg-slate-900 border-b dark:border-slate-800 px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:flex"
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder={isRTL ? "بحث عن أي شيء..." : "Search anything..."}
                className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg border-0 text-sm w-64 focus:ring-2 focus:ring-cyan-500/20"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" />
            </Button>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-2" />
            <div className="flex items-center gap-3">
               <div className="flex flex-col items-end hidden lg:flex">
                  <span className="text-sm font-semibold dark:text-white">Admin User</span>
                  <span className="text-[10px] uppercase font-bold text-cyan-500 tracking-wider">Super Admin</span>
               </div>
               <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20" />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8">
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div 
                key="overview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {stats.map((stat, i) => (
                    <motion.div 
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border dark:border-slate-800 hover:shadow-md transition-all group"
                    >
                      <div className="flex items-start justify-between">
                        <div className={cn("p-3 rounded-xl text-white shadow-lg", stat.color)}>
                          <stat.icon className="w-6 h-6" />
                        </div>
                        <span className={cn(
                          "text-xs font-bold px-2 py-1 rounded-full",
                          stat.trend.startsWith("+") ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" : "bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                        )}>
                          {stat.trend}
                        </span>
                      </div>
                      <div className="mt-4">
                        <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                        <h3 className="text-2xl font-bold dark:text-white mt-1">{stat.value}</h3>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Recent Activity */}
                  <div className="bg-white dark:bg-slate-900 rounded-3xl border dark:border-slate-800 p-8">
                    <h3 className="text-xl font-bold dark:text-white mb-6">
                      {isRTL ? "النشاط الأخير" : "Recent Activity"}
                    </h3>
                    <div className="space-y-6">
                      {[1, 2, 3, 4].map((item) => (
                        <div key={item} className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-700 shrink-0 overflow-hidden">
                             <img src={`https://i.pravatar.cc/100?img=${item + 10}`} alt="User" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm dark:text-slate-200">
                              <span className="font-bold">User #{item * 123}</span> just registered from Saudi Arabia
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">2 minutes ago</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* System Status Table */}
                  <div className="bg-white dark:bg-slate-900 rounded-3xl border dark:border-slate-800 p-8 overflow-hidden">
                    <h3 className="text-xl font-bold dark:text-white mb-6">
                      {isRTL ? "حالة النظام" : "System Status"}
                    </h3>
                    <div className="space-y-4">
                      {["Auth API", "Database", "File Storage", "Search Engine"].map((service) => (
                        <div key={service} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-sm font-medium dark:text-slate-200">{service}</span>
                          </div>
                          <span className="text-xs text-emerald-500 font-bold uppercase tracking-wider">Operational</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "content" && (
              <motion.div 
                key="content"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-bold dark:text-white">{isRTL ? "إدارة المحتوى" : "Content Management"}</h2>
                    <p className="text-muted-foreground">{isRTL ? "تحكم في جميع النصوص والرسوم في الموقع" : "Control all text and visuals on the site"}</p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={resetConfig} className="gap-2">
                       <RotateCcw className="w-4 h-4" />
                       {isRTL ? "إعادة ضبط" : "Reset"}
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving} className="gap-2 bg-gradient-to-r from-cyan-600 to-blue-600">
                       <Save className={cn("w-4 h-4", isSaving && "animate-spin")} />
                       {isSaving ? (isRTL ? "جاري الحفظ..." : "Saving...") : (isRTL ? "حفظ التغييرات" : "Save Changes")}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                   {/* Hero Section Control */}
                  <div className="bg-white dark:bg-slate-900 rounded-3xl border dark:border-slate-800 p-8 space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                       <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-600 flex items-center justify-center">
                          <FileText className="w-4 h-4" />
                       </div>
                       <h3 className="text-xl font-bold dark:text-white">{isRTL ? "قسم الواجهة (Hero)" : "Hero Section"}</h3>
                    </div>
                    
                    <div className="space-y-4">
                       <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Title (English)</label>
                          <input 
                            type="text" 
                            value={localConfig.hero.titleEn}
                            onChange={(e) => setLocalConfig({...localConfig, hero: {...localConfig.hero, titleEn: e.target.value}})}
                            className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-cyan-500/20 outline-none dark:text-white"
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Title (Arabic)</label>
                          <input 
                            type="text" 
                            dir="rtl"
                            value={localConfig.hero.titleAr}
                            onChange={(e) => setLocalConfig({...localConfig, hero: {...localConfig.hero, titleAr: e.target.value}})}
                            className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-cyan-500/20 outline-none dark:text-white font-cairo"
                          />
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Primary Button (EN)</label>
                            <input 
                              type="text" 
                              value={localConfig.hero.primaryButtonEn}
                              onChange={(e) => setLocalConfig({...localConfig, hero: {...localConfig.hero, primaryButtonEn: e.target.value}})}
                              className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border-slate-200 dark:border-slate-700 dark:text-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Primary Button (AR)</label>
                            <input 
                              type="text" 
                              dir="rtl"
                              value={localConfig.hero.primaryButtonAr}
                              onChange={(e) => setLocalConfig({...localConfig, hero: {...localConfig.hero, primaryButtonAr: e.target.value}})}
                              className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border-slate-200 dark:border-slate-700 dark:text-white font-cairo"
                            />
                          </div>
                       </div>
                    </div>
                  </div>

                  {/* Stats Section Control */}
                  <div className="bg-white dark:bg-slate-900 rounded-3xl border dark:border-slate-800 p-8 space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                       <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                          <TrendingUp className="w-4 h-4" />
                       </div>
                       <h3 className="text-xl font-bold dark:text-white">{isRTL ? "إحصائيات المنصة" : "Platform Stats"}</h3>
                    </div>
                    
                    <div className="space-y-6">
                       {localConfig.stats.map((stat, i) => (
                         <div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border dark:border-slate-700 space-y-3">
                            <div className="flex items-center justify-between">
                               <span className="text-xs font-bold text-cyan-500 uppercase tracking-widest">Stat #{i + 1}</span>
                               <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500" onClick={() => {
                                 const newStats = [...localConfig.stats];
                                 newStats.splice(i, 1);
                                 setLocalConfig({...localConfig, stats: newStats});
                               }}><Trash2 className="w-3 h-3" /></Button>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                               <input 
                                 type="text" 
                                 placeholder="Value (e.g. 1500+)"
                                 value={stat.value}
                                 onChange={(e) => {
                                   const newStats = [...localConfig.stats];
                                   newStats[i].value = e.target.value;
                                   setLocalConfig({...localConfig, stats: newStats});
                                 }}
                                 className="w-full p-2 bg-white dark:bg-slate-900 rounded-lg text-sm dark:text-white"
                               />
                               <div className="flex flex-col gap-2">
                                  <input 
                                    type="text" 
                                    placeholder="Label (EN)"
                                    value={stat.labelEn}
                                    onChange={(e) => {
                                      const newStats = [...localConfig.stats];
                                      newStats[i].labelEn = e.target.value;
                                      setLocalConfig({...localConfig, stats: newStats});
                                    }}
                                    className="w-full p-2 bg-white dark:bg-slate-900 rounded-lg text-sm dark:text-white"
                                  />
                                  <input 
                                    type="text" 
                                    placeholder="Label (AR)"
                                    dir="rtl"
                                    value={stat.labelAr}
                                    onChange={(e) => {
                                      const newStats = [...localConfig.stats];
                                      newStats[i].labelAr = e.target.value;
                                      setLocalConfig({...localConfig, stats: newStats});
                                    }}
                                    className="w-full p-2 bg-white dark:bg-slate-900 rounded-lg text-sm dark:text-white font-cairo"
                                  />
                               </div>
                            </div>
                         </div>
                       ))}
                       <Button variant="outline" className="w-full rounded-xl border-dashed py-6" onClick={() => {
                         setLocalConfig({...localConfig, stats: [...localConfig.stats, { labelAr: "جديد", labelEn: "New Stat", value: "0" }]});
                       }}>
                          <Plus className="w-4 h-4 mr-2" />
                          {isRTL ? "إضافة إحصائية جديدة" : "Add New Stat"}
                       </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "appearance" && (
              <motion.div 
                key="appearance"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                 <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-3xl font-bold dark:text-white">{isRTL ? "تخصيص المظهر" : "Visual Identity Control"}</h2>
                      <p className="text-muted-foreground">{isRTL ? "تحكم في هوية الموقع البصرية وعناصر العرض" : "Master the site's visual identity and visibility"}</p>
                    </div>
                    <Button onClick={handleSave} disabled={isSaving} className="gap-2 bg-gradient-to-r from-cyan-600 to-blue-600">
                       <Save className={cn("w-4 h-4", isSaving && "animate-spin")} />
                       {isRTL ? "حفظ الإعدادات" : "Save Appearance"}
                    </Button>
                 </div>

                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Theme Controls */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border dark:border-slate-800 p-8 space-y-6">
                       <h3 className="text-xl font-bold dark:text-white flex items-center gap-2">
                          <Palette className="w-5 h-5 text-cyan-600" />
                          {isRTL ? "الألوان والثيم" : "Colors & Theme"}
                       </h3>
                       
                       <div className="space-y-6">
                          <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                             <div>
                                <p className="font-bold dark:text-white">{isRTL ? "اللون الأساسي" : "Primary Color"}</p>
                                <p className="text-xs text-muted-foreground">{localConfig.appearance.primaryColor}</p>
                             </div>
                             <input 
                               type="color" 
                               value={localConfig.appearance.primaryColor}
                               onChange={(e) => setLocalConfig({...localConfig, appearance: {...localConfig.appearance, primaryColor: e.target.value}})}
                               className="w-12 h-12 rounded-xl cursor-pointer border-0 bg-transparent"
                             />
                          </div>
                          
                          <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                             <div>
                                <p className="font-bold dark:text-white">{isRTL ? "زر الدعم الفني" : "Support Button"}</p>
                                <p className="text-xs text-muted-foreground">{isRTL ? "إظهار أو إخفاء أيقونة الدردشة" : "Show or hide the chat widget"}</p>
                             </div>
                             <AdminToggle
                               checked={localConfig.appearance.showSupportButton}
                               onCheckedChange={() =>
                                 setLocalConfig({
                                   ...localConfig,
                                   appearance: {
                                     ...localConfig.appearance,
                                     showSupportButton: !localConfig.appearance.showSupportButton,
                                   },
                                 })
                               }
                               activeClassName="bg-cyan-600"
                             />
                          </div>
                       </div>
                    </div>

                    {/* Announcement Bar */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border dark:border-slate-800 p-8 space-y-6">
                       <h3 className="text-xl font-bold dark:text-white flex items-center gap-2">
                          <Bell className="w-5 h-5 text-amber-500" />
                          {isRTL ? "شريط الإعلانات" : "Announcement Bar"}
                       </h3>
                       
                       <div className="space-y-4">
                          <div className="flex items-center justify-between mb-2">
                             <p className="text-sm font-medium dark:text-slate-300">{isRTL ? "تفعيل الشريط" : "Enable Announcement"}</p>
                             <AdminToggle
                               checked={localConfig.appearance.showAnnouncement}
                               onCheckedChange={() =>
                                 setLocalConfig({
                                   ...localConfig,
                                   appearance: {
                                     ...localConfig.appearance,
                                     showAnnouncement: !localConfig.appearance.showAnnouncement,
                                   },
                                 })
                               }
                               activeClassName="bg-amber-500"
                             />
                          </div>
                          
                          <div className="space-y-4 opacity-100 transition-opacity" style={{ opacity: localConfig.appearance.showAnnouncement ? 1 : 0.4 }}>
                             <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500">TEXT (EN)</label>
                                <input 
                                  disabled={!localConfig.appearance.showAnnouncement}
                                  type="text"
                                  value={localConfig.appearance.announcementEn}
                                  onChange={(e) => setLocalConfig({...localConfig, appearance: {...localConfig.appearance, announcementEn: e.target.value}})}
                                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border dark:border-slate-700 dark:text-white"
                                />
                             </div>
                             <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500">TEXT (AR)</label>
                                <input 
                                  disabled={!localConfig.appearance.showAnnouncement}
                                  type="text"
                                  dir="rtl"
                                  value={localConfig.appearance.announcementAr}
                                  onChange={(e) => setLocalConfig({...localConfig, appearance: {...localConfig.appearance, announcementAr: e.target.value}})}
                                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border dark:border-slate-700 dark:text-white font-cairo"
                                />
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
              </motion.div>
            )}

            {activeTab === "logs" && (
              <motion.div 
                key="logs"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                 <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-3xl font-bold dark:text-white">{isRTL ? "سجلات النظام" : "System Logs"}</h2>
                      <p className="text-muted-foreground">{isRTL ? "تتبع جميع الحركات والتغييرات في الموقع" : "Track all activities and changes on the site"}</p>
                    </div>
                    <Button variant="outline" onClick={() => fetch("/api/logs").then(res => res.json()).then(setLogs)}>
                        <RotateCcw className="w-4 h-4 mr-2" />
                        {isRTL ? "تحديث" : "Refresh"}
                    </Button>
                 </div>

                 <div className="bg-white dark:bg-slate-900 rounded-3xl border dark:border-slate-800 overflow-hidden">
                    <table className="w-full text-left">
                       <thead className="bg-slate-50 dark:bg-slate-800/50">
                          <tr>
                             <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">{isRTL ? "الوقت" : "Timestamp"}</th>
                             <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">{isRTL ? "الحدث" : "Event"}</th>
                             <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">{isRTL ? "المستخدم" : "User"}</th>
                             <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">{isRTL ? "الحالة" : "Status"}</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y dark:divide-slate-800">
                          {logs.map((log) => (
                             <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <td className="px-6 py-4 text-sm text-muted-foreground">{new Date(log.timestamp).toLocaleString()}</td>
                                <td className="px-6 py-4 text-sm font-bold dark:text-white">{log.event}</td>
                                <td className="px-6 py-4 text-sm dark:text-slate-300">{log.user}</td>
                                <td className="px-6 py-4">
                                   <span className="px-2 py-1 bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 text-xs font-bold rounded-full uppercase">
                                      {log.status}
                                   </span>
                                </td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </motion.div>
            )}

            {activeTab === "users" && (
              <motion.div 
                key="users"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                 <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-3xl font-bold dark:text-white">{isRTL ? "إدارة المستخدمين" : "User Management"}</h2>
                      <p className="text-muted-foreground">{isRTL ? "إدارة صلاحيات وحسابات طاقم العمل" : "Manage staff permissions and accounts"}</p>
                    </div>
                    <Button className="bg-cyan-600 hover:bg-cyan-700">
                        <Plus className="w-4 h-4 mr-2" />
                        {isRTL ? "إضافة مستخدم" : "Add User"}
                    </Button>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                       <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border dark:border-slate-800 flex items-center gap-4 hover:shadow-lg transition-all">
                          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0">
                             <img src={`https://i.pravatar.cc/100?img=${i + 30}`} alt="User" />
                          </div>
                          <div>
                             <h4 className="font-bold dark:text-white">User Name #{i}</h4>
                             <p className="text-xs text-muted-foreground">user{i}@example.com</p>
                             <div className="flex gap-2 mt-2">
                                <span className={cn(
                                   "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase",
                                   i === 1 ? "bg-cyan-100 text-cyan-600 dark:bg-cyan-500/20" : "bg-slate-100 text-slate-600 dark:bg-slate-800"
                                )}>
                                   {i === 1 ? "Admin" : "Editor"}
                                </span>
                             </div>
                          </div>
                       </div>
                    ))}
                 </div>
              </motion.div>
            )}

            {activeTab === "support" && (
              <motion.div 
                key="support"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                  <div>
                    <h2 className="text-3xl font-bold dark:text-white">
                      {isRTL ? "مركز دعم العملاء" : "Customer Support Hub"}
                    </h2>
                    <p className="text-muted-foreground mt-1">
                      {isRTL ? "إدارة جميع الدردشات والمحادثات النشطة" : "Manage all active support chats and conversations"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="rounded-xl border-slate-200 dark:border-slate-800">
                        {isRTL ? "تحميل التقرير" : "Download Report"}
                    </Button>
                    <Button className="rounded-xl bg-cyan-600 hover:bg-cyan-700">
                        {isRTL ? "تحديث التلقائي" : "Auto Refresh"}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-320px)] min-h-[500px]">
                  {/* Chat List */}
                  <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-3xl border dark:border-slate-800 flex flex-col">
                    <div className="p-6 border-b dark:border-slate-800">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                           type="text" 
                           placeholder={isRTL ? "بحث عن محادثة..." : "Search chats..."}
                           className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border-0 text-sm focus:ring-2 focus:ring-cyan-500/20"
                        />
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                       {recentChats.map((chat) => (
                         <button 
                           key={chat.id}
                           className={cn(
                             "w-full p-4 rounded-2xl flex items-start gap-4 transition-all hover:bg-slate-50 dark:hover:bg-slate-800 group",
                             chat.id === 1 && "bg-cyan-50 dark:bg-cyan-500/10 ring-1 ring-cyan-500/30"
                           )}
                         >
                            <div className="relative">
                              <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0 overflow-hidden border-2 border-white dark:border-slate-700">
                                 <img src={`https://i.pravatar.cc/100?img=${chat.id + 20}`} alt={chat.user} />
                              </div>
                              <span className={cn(
                                "absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900",
                                chat.status === "online" ? "bg-emerald-500" : "bg-slate-300"
                              )} />
                            </div>
                            <div className="flex-1 text-left min-w-0">
                               <div className="flex items-center justify-between mb-1">
                                  <h4 className="font-bold text-sm dark:text-white truncate">{chat.user}</h4>
                                  <span className="text-[10px] text-muted-foreground">{chat.time}</span>
                               </div>
                               <p className="text-xs text-muted-foreground truncate group-hover:text-cyan-600 transition-colors">{chat.message}</p>
                            </div>
                         </button>
                       ))}
                    </div>
                  </div>

                  {/* Active Chat Window */}
                  <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border dark:border-slate-800 flex flex-col shadow-sm overflow-hidden">
                     <div className="p-4 sm:p-6 border-b dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-4 min-w-0">
                           <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0">
                              <img src="https://i.pravatar.cc/100?img=21" alt="Active User" />
                           </div>
                           <div className="min-w-0">
                              <h4 className="font-bold dark:text-white truncate">احمد علي</h4>
                              <p className="text-xs text-emerald-500 flex items-center gap-1 font-medium">
                                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                 {activeChatBlocked ? (isRTL ? "محظور" : "Blocked") : isRTL ? "متصل الآن" : "Online now"}
                              </p>
                           </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                           <Button
                             type="button"
                             variant={showSupportOrders ? "secondary" : "ghost"}
                             size="sm"
                             className="rounded-xl gap-2"
                             onClick={() => {
                               setShowSupportOrders((v) => !v)
                               setShowSupportEmoji(false)
                               setShowSupportCanned(false)
                             }}
                           >
                             <ShoppingBag className="h-4 w-4" />
                             <span className="hidden sm:inline">{isRTL ? "طلبات الزبون" : "Orders"}</span>
                           </Button>
                           <Button variant="ghost" size="icon" className="rounded-xl" type="button" aria-label="Notifications">
                             <Bell className="h-4 w-4" />
                           </Button>
                           <Button
                             type="button"
                             variant="ghost"
                             size="icon"
                             className={cn("rounded-xl", activeChatBlocked ? "text-emerald-600" : "text-red-600")}
                             aria-label={activeChatBlocked ? (isRTL ? "إلغاء الحظر" : "Unblock") : (isRTL ? "حظر الزبون" : "Block user")}
                             onClick={() => {
                               if (activeChatBlocked) {
                                 setActiveChatBlocked(false)
                                 return
                               }
                               if (confirm(isRTL ? "حظر هذا الزبون من الدردشة؟" : "Block this customer from chat?")) {
                                 setActiveChatBlocked(true)
                                 setShowSupportEmoji(false)
                                 setShowSupportCanned(false)
                               }
                             }}
                           >
                             <Ban className="h-4 w-4" />
                           </Button>
                        </div>
                     </div>

                     {activeChatBlocked && (
                       <div className="border-b border-red-500/30 bg-red-500/10 px-4 py-2 text-center text-sm text-red-700 dark:text-red-300">
                         {isRTL
                           ? "تم حظر هذا الزبون — لن يستطيع إرسال رسائل جديدة حتى تلغي الحظر من أيقونة الحظر."
                           : "This customer is blocked from chat. Click the ban icon again to unblock."}
                       </div>
                     )}

                     {showSupportOrders && (
                       <div className="border-b dark:border-slate-800 bg-slate-50/80 px-4 py-3 dark:bg-slate-800/40">
                         <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                           {isRTL ? "طلبات الزبون (تجريبي)" : "Customer orders (demo)"}
                         </p>
                         <div className="overflow-x-auto rounded-xl border dark:border-slate-700">
                           <table className="w-full min-w-[280px] text-sm">
                             <thead className="bg-slate-100 dark:bg-slate-800/80">
                               <tr>
                                 <th className="px-3 py-2 text-start font-semibold">{isRTL ? "رقم الطلب" : "Order"}</th>
                                 <th className="px-3 py-2 text-start font-semibold">{isRTL ? "المبلغ" : "Total"}</th>
                                 <th className="px-3 py-2 text-start font-semibold">{isRTL ? "الحالة" : "Status"}</th>
                                 <th className="px-3 py-2 text-start font-semibold">{isRTL ? "التاريخ" : "Date"}</th>
                               </tr>
                             </thead>
                             <tbody>
                               {mockCustomerOrders.map((o) => (
                                 <tr key={o.id} className="border-t dark:border-slate-700">
                                   <td className="px-3 py-2 font-mono text-xs">{o.id}</td>
                                   <td className="px-3 py-2">{o.total}</td>
                                   <td className="px-3 py-2">{o.status}</td>
                                   <td className="px-3 py-2 text-muted-foreground">{o.date}</td>
                                 </tr>
                               ))}
                             </tbody>
                           </table>
                         </div>
                       </div>
                     )}

                     <div className="flex-1 overflow-y-auto space-y-5 bg-slate-50/50 px-2 py-5 dark:bg-slate-900/50 sm:px-4">
                        <div className="text-center">
                           <span className="inline-block rounded-full bg-slate-200/60 px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground dark:bg-slate-800/60">
                              {isRTL ? "اليوم" : "Today"}
                           </span>
                        </div>

                        {supportMessages.map((m) =>
                          m.role === "user" ? (
                            <div
                              key={m.id}
                              className={cn("flex w-full", isRTL ? "justify-start" : "justify-end")}
                            >
                              <div className="flex max-w-[min(85%,32rem)] flex-col items-start gap-1">
                                <div className="rounded-2xl border bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                                  {m.imageUrl && (
                                    <img src={m.imageUrl} alt="" className="mb-2 max-h-44 w-full rounded-lg object-cover" />
                                  )}
                                  <p className="text-sm leading-relaxed dark:text-slate-200">{m.text}</p>
                                </div>
                                <span className="ps-1 text-[10px] text-muted-foreground">{m.time}</span>
                              </div>
                            </div>
                          ) : (
                            <div
                              key={m.id}
                              className={cn("flex w-full", isRTL ? "justify-end" : "justify-start")}
                            >
                              <div className="flex max-w-[min(85%,32rem)] flex-col items-start gap-1">
                                <div className="rounded-2xl bg-gradient-to-br from-cyan-600 to-blue-600 p-4 text-white shadow-lg shadow-cyan-500/20">
                                  {m.imageUrl && (
                                    <img src={m.imageUrl} alt="" className="mb-2 max-h-44 w-full rounded-lg object-cover ring-1 ring-white/30" />
                                  )}
                                  <p className="text-sm leading-relaxed">{m.text}</p>
                                </div>
                                <span className="ps-1 text-[10px] text-muted-foreground">{m.time}</span>
                              </div>
                            </div>
                          ),
                        )}
                     </div>

                     <div className="relative border-t dark:border-slate-800 p-4 sm:p-6">
                        {supportImagePreview && (
                          <div className="mb-3 flex items-center gap-3 rounded-xl border border-dashed border-slate-300 p-2 dark:border-slate-600">
                            <img src={supportImagePreview} alt="" className="h-16 w-16 rounded-lg object-cover" />
                            <div className="min-w-0 flex-1 text-xs text-muted-foreground">
                              {isRTL ? "معاينة المرفق — ستُرسل مع الرد" : "Attachment preview — sends with reply"}
                            </div>
                            <Button type="button" variant="ghost" size="sm" onClick={() => setSupportImagePreview(null)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}

                        <div className="relative mb-2 flex flex-wrap items-center gap-1 border-b border-slate-100 pb-2 dark:border-slate-800">
                          <input
                            ref={supportAttachmentRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0]
                              if (!f?.type.startsWith("image/")) return
                              const r = new FileReader()
                              r.onload = () => setSupportImagePreview(String(r.result))
                              r.readAsDataURL(f)
                              e.target.value = ""
                            }}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="rounded-xl"
                            disabled={activeChatBlocked}
                            aria-label={isRTL ? "إرفاق صورة" : "Attach image"}
                            onClick={() => supportAttachmentRef.current?.click()}
                          >
                            <Paperclip className="h-4 w-4" />
                          </Button>
                          <div className="relative">
                            <Button
                              type="button"
                              variant={showSupportEmoji ? "secondary" : "ghost"}
                              size="icon"
                              className="rounded-xl"
                              disabled={activeChatBlocked}
                              aria-label="Emoji"
                              onClick={() => {
                                setShowSupportEmoji((v) => !v)
                                setShowSupportCanned(false)
                              }}
                            >
                              <Smile className="h-4 w-4" />
                            </Button>
                            {showSupportEmoji && (
                              <div
                                className={cn(
                                  "absolute bottom-full z-20 mb-2 flex w-[220px] flex-wrap gap-1 rounded-xl border bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-900",
                                  isRTL ? "end-0" : "start-0",
                                )}
                              >
                                {SUPPORT_EMOJIS.map((em) => (
                                  <button
                                    key={em}
                                    type="button"
                                    className="rounded-lg p-1.5 text-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                                    onClick={() => {
                                      setSupportReply((p) => p + em)
                                      setShowSupportEmoji(false)
                                    }}
                                  >
                                    {em}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="relative">
                            <Button
                              type="button"
                              variant={showSupportCanned ? "secondary" : "ghost"}
                              size="icon"
                              className="rounded-xl"
                              disabled={activeChatBlocked}
                              aria-label={isRTL ? "ردود جاهزة" : "Saved replies"}
                              onClick={() => {
                                setShowSupportCanned((v) => !v)
                                setShowSupportEmoji(false)
                              }}
                            >
                              <Bookmark className="h-4 w-4" />
                            </Button>
                            {showSupportCanned && (
                              <div
                                className={cn(
                                  "absolute bottom-full z-20 mb-2 max-h-56 w-64 overflow-y-auto rounded-xl border bg-white py-1 shadow-xl dark:border-slate-700 dark:bg-slate-900",
                                  isRTL ? "end-0" : "start-0",
                                )}
                              >
                                {cannedReplies.map((c) => (
                                  <button
                                    key={c.id}
                                    type="button"
                                    className="block w-full px-3 py-2 text-start text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                                    onClick={() => {
                                      setSupportReply((prev) => (prev ? `${prev}\n` : "") + c.body)
                                      setShowSupportCanned(false)
                                    }}
                                  >
                                    <span className="block font-semibold text-foreground">{c.label}</span>
                                    <span className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{c.body}</span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2 sm:gap-3">
                           <input
                              type="text"
                              value={supportReply}
                              onChange={(e) => setSupportReply(e.target.value)}
                              disabled={activeChatBlocked}
                              placeholder={activeChatBlocked ? (isRTL ? "محادثة موقوفة" : "Chat blocked") : isRTL ? "اكتب ردك هنا..." : "Type your response..."}
                              className={cn(
                                "min-w-0 flex-1 rounded-2xl border-0 bg-slate-50 py-3 ps-4 pe-4 text-sm focus:ring-2 focus:ring-cyan-500/25 dark:bg-slate-800 dark:text-white",
                                isRTL && "font-cairo text-right",
                                activeChatBlocked && "cursor-not-allowed opacity-60",
                              )}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                  e.preventDefault()
                                  if (activeChatBlocked) return
                                  const t = supportReply.trim()
                                  if (!t && !supportImagePreview) return
                                  setSupportMessages((prev) => [
                                    ...prev,
                                    {
                                      id: `m-${Date.now()}`,
                                      role: "agent",
                                      text: t || (isRTL ? "مرفق" : "Attachment"),
                                      time: new Date().toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" }),
                                      imageUrl: supportImagePreview || undefined,
                                    },
                                  ])
                                  setSupportReply("")
                                  setSupportImagePreview(null)
                                }
                              }}
                           />
                           <Button
                             type="button"
                             className="shrink-0 rounded-2xl bg-cyan-600 px-6 shadow-lg shadow-cyan-500/20 hover:bg-cyan-700 sm:px-8"
                             disabled={activeChatBlocked || (!supportReply.trim() && !supportImagePreview)}
                             onClick={() => {
                               const t = supportReply.trim()
                               if (!t && !supportImagePreview) return
                               setSupportMessages((prev) => [
                                 ...prev,
                                 {
                                   id: `m-${Date.now()}`,
                                   role: "agent",
                                   text: t || (isRTL ? "مرفق" : "Attachment"),
                                   time: new Date().toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" }),
                                   imageUrl: supportImagePreview || undefined,
                                 },
                               ])
                               setSupportReply("")
                               setSupportImagePreview(null)
                             }}
                           >
                              {isRTL ? "إرسال" : "Send"}
                           </Button>
                        </div>
                     </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "products" && (
              <motion.div 
                key="products"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-bold dark:text-white">{isRTL ? "إدارة المنتجات" : "Products Management"}</h2>
                    <p className="text-muted-foreground">{isRTL ? "أضف وعدل المنتجات والخدمات التي تقدمها" : "Add and edit the products and services you offer"}</p>
                  </div>
                  <Button onClick={() => setEditingProduct({ nameAr: "", nameEn: "", price: 0, category: "", descriptionAr: "", descriptionEn: "" })} className="gap-2 bg-gradient-to-r from-cyan-600 to-blue-600">
                    <Plus className="w-4 h-4" />
                    {isRTL ? "إضافة منتج" : "Add Product"}
                  </Button>
                </div>

                {/* Edit/Create Modal Simulation */}
                {(editingProduct || (newProduct.nameEn && !editingProduct)) && (
                   <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
                      <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                      >
                         <h3 className="text-2xl font-bold dark:text-white mb-6">
                            {editingProduct?.id ? (isRTL ? "تعديل المنتج" : "Edit Product") : (isRTL ? "إضافة منتج جديد" : "Add New Product")}
                         </h3>
                         <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="space-y-2">
                               <label className="text-xs font-bold text-slate-500 uppercase">Name (EN)</label>
                               <input 
                                  type="text"
                                  value={editingProduct ? editingProduct.nameEn : newProduct.nameEn}
                                  onChange={(e) => editingProduct ? setEditingProduct({...editingProduct, nameEn: e.target.value}) : setNewProduct({...newProduct, nameEn: e.target.value})}
                                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border dark:border-slate-700 dark:text-white"
                               />
                            </div>
                            <div className="space-y-2">
                               <label className="text-xs font-bold text-slate-500 uppercase">Name (AR)</label>
                               <input 
                                  type="text" dir="rtl"
                                  value={editingProduct ? editingProduct.nameAr : newProduct.nameAr}
                                  onChange={(e) => editingProduct ? setEditingProduct({...editingProduct, nameAr: e.target.value}) : setNewProduct({...newProduct, nameAr: e.target.value})}
                                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border dark:border-slate-700 dark:text-white font-cairo"
                               />
                            </div>
                            <div className="space-y-2">
                               <label className="text-xs font-bold text-slate-500 uppercase">Price ($)</label>
                               <input 
                                  type="number"
                                  value={editingProduct ? editingProduct.price : newProduct.price}
                                  onChange={(e) => editingProduct ? setEditingProduct({...editingProduct, price: Number(e.target.value)}) : setNewProduct({...newProduct, price: Number(e.target.value)})}
                                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border dark:border-slate-700 dark:text-white"
                               />
                            </div>
                            <div className="space-y-2">
                               <label className="text-xs font-bold text-slate-500 uppercase">Category</label>
                               <input 
                                  type="text"
                                  value={editingProduct ? editingProduct.category : newProduct.category}
                                  onChange={(e) => editingProduct ? setEditingProduct({...editingProduct, category: e.target.value}) : setNewProduct({...newProduct, category: e.target.value})}
                                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border dark:border-slate-700 dark:text-white"
                               />
                            </div>
                            
                            <div className="space-y-2">
                               <label className="text-xs font-bold text-slate-500 uppercase">Image URL</label>
                               <input 
                                  type="text"
                                  placeholder="https://..."
                                  value={editingProduct ? editingProduct.imageUrl : newProduct.imageUrl}
                                  onChange={(e) => editingProduct ? setEditingProduct({...editingProduct, imageUrl: e.target.value}) : setNewProduct({...newProduct, imageUrl: e.target.value})}
                                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border dark:border-slate-700 dark:text-white"
                               />
                            </div>
                            <div className="space-y-2">
                               <label className="text-xs font-bold text-slate-500 uppercase">Video URL</label>
                               <input 
                                  type="text"
                                  placeholder="YouTube link..."
                                  value={editingProduct ? editingProduct.videoUrl : newProduct.videoUrl}
                                  onChange={(e) => editingProduct ? setEditingProduct({...editingProduct, videoUrl: e.target.value}) : setNewProduct({...newProduct, videoUrl: e.target.value})}
                                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border dark:border-slate-700 dark:text-white"
                               />
                            </div>

                            <div className="col-span-2 space-y-2">
                               <label className="text-xs font-bold text-slate-500 uppercase">Description (EN)</label>
                               <textarea 
                                  value={editingProduct ? editingProduct.descriptionEn : newProduct.descriptionEn}
                                  onChange={(e) => editingProduct ? setEditingProduct({...editingProduct, descriptionEn: e.target.value}) : setNewProduct({...newProduct, descriptionEn: e.target.value})}
                                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border dark:border-slate-700 dark:text-white h-24"
                               />
                            </div>
                            <div className="col-span-2 space-y-2">
                               <label className="text-xs font-bold text-slate-500 uppercase">Description (AR)</label>
                               <textarea 
                                  dir="rtl"
                                  value={editingProduct ? editingProduct.descriptionAr : newProduct.descriptionAr}
                                  onChange={(e) => editingProduct ? setEditingProduct({...editingProduct, descriptionAr: e.target.value}) : setNewProduct({...newProduct, descriptionAr: e.target.value})}
                                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border dark:border-slate-700 dark:text-white font-cairo h-24"
                               />
                            </div>
                         </div>
                         <div className="flex gap-4">
                            <Button className="flex-1 bg-cyan-600" onClick={editingProduct?.id ? handleUpdateProduct : handleCreateProduct}>
                               {isRTL ? "حفظ" : "Save"}
                            </Button>
                            <Button variant="outline" className="flex-1" onClick={() => { setEditingProduct(null); setNewProduct({ nameAr: "", nameEn: "", price: 0, category: "", descriptionAr: "", descriptionEn: "", imageUrl: "", videoUrl: "" }) }}>
                               {isRTL ? "إلغاء" : "Cancel"}
                            </Button>
                         </div>
                      </motion.div>
                   </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {isProductsLoading ? (
                      [1, 2, 3].map(i => <div key={i} className="h-48 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-3xl" />)
                   ) : (
                      products.map((product) => (
                         <div key={product.id} className="group bg-white dark:bg-slate-900 rounded-3xl border dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all relative">
                            {product.imageUrl ? (
                               <div className="h-40 w-full overflow-hidden">
                                  <img src={product.imageUrl} alt={product.nameEn} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                               </div>
                            ) : (
                               <div className="h-40 w-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                  <Box className="w-12 h-12 text-slate-300" />
                               </div>
                            )}

                            <div className="p-6">
                              <div className="flex justify-between items-start mb-4">
                               <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-2xl">
                                  <Box className="w-6 h-6" />
                               </div>
                               <div className="flex gap-1">
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-cyan-500" onClick={() => setEditingProduct(product)}>
                                     <Eye className="w-4 h-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => handleDeleteProduct(product.id)}>
                                     <Trash2 className="w-4 h-4" />
                                  </Button>
                               </div>
                              </div>
                              <div className="space-y-1">
                               <h4 className="font-bold text-lg dark:text-white uppercase">{isRTL ? product.nameAr : product.nameEn}</h4>
                               <div className="flex items-center gap-4">
                                  <p className="text-sm text-cyan-600 font-bold">${product.price}</p>
                                  <span className="text-[10px] uppercase font-black text-slate-400 tracking-tighter bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">{product.category}</span>
                               </div>
                               {product.videoUrl && (
                                  <div className="flex items-center gap-1 text-[10px] text-emerald-500 font-bold mt-2">
                                     <Monitor className="w-3 h-3" />
                                     {isRTL ? "يحتوي عرض فيديو" : "Has Video Demo"}
                                  </div>
                               )}
                              </div>
                              <p className="text-xs text-muted-foreground mt-4 line-clamp-2">
                               {isRTL ? product.descriptionAr : product.descriptionEn}
                              </p>
                            </div>
                         </div>
                      ))
                   )}
                   {products.length === 0 && !isProductsLoading && (
                      <div className="col-span-full py-20 text-center bg-slate-50 dark:bg-slate-800/20 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                         <Box className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                         <p className="text-slate-500">{isRTL ? "لا توجد منتجات حالياً" : "No products found"}</p>
                      </div>
                   )}
                </div>
              </motion.div>
            )}

            {activeTab === "settings" && (
              <motion.div 
                key="settings"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-4xl"
              >
                 <h2 className="text-3xl font-bold dark:text-white mb-8">
                   {isRTL ? "إعدادات النظام" : "System Settings"}
                 </h2>
                 <div className="bg-white dark:bg-slate-900 rounded-3xl border dark:border-slate-800 p-8 space-y-8">
                    <div className="flex items-center justify-between">
                       <div>
                          <h4 className="font-bold dark:text-white">{isRTL ? "تنبيهات البريد الالكتروني" : "Email Notifications"}</h4>
                          <p className="text-sm text-muted-foreground">{isRTL ? "تلقي تقارير يومية عن نشاط المستخدمين" : "Receive daily reports about user activity"}</p>
                       </div>
                       <div className="w-12 h-6 bg-cyan-600 rounded-full relative shadow-inner">
                          <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-md" />
                       </div>
                    </div>
                    <div className="h-px bg-slate-100 dark:bg-slate-800" />
                    <div className="flex items-center justify-between">
                       <div>
                          <h4 className="font-bold dark:text-white">{isRTL ? "وضع الصيانة" : "Maintenance Mode"}</h4>
                          <p className="text-sm text-muted-foreground">{isRTL ? "سيتم إغلاق الواجهة الأمامية للمستخدمين" : "Front-end will be closed for users"}</p>
                       </div>
                       <div className="w-12 h-6 bg-slate-300 dark:bg-slate-700 rounded-full relative">
                          <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md" />
                       </div>
                    </div>
                    <div className="h-px bg-slate-100 dark:bg-slate-800" />
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                       <div>
                          <h4 className="font-bold dark:text-white">{isRTL ? "لغة النظام الافتراضية" : "Default System Language"}</h4>
                       </div>
                       <div className="relative w-full min-w-0 sm:w-auto sm:min-w-[13.5rem]">
                          <select
                            aria-label={isRTL ? "لغة النظام الافتراضية" : "Default system language"}
                            className={cn(
                              "w-full cursor-pointer appearance-none rounded-lg border-0 bg-slate-50 py-2.5 ps-3 pe-10 text-sm outline-none transition-shadow focus:ring-2 focus:ring-cyan-500/25 dark:bg-slate-800 dark:text-white",
                              isRTL && "text-right font-cairo",
                            )}
                          >
                            <option value="ar">{isRTL ? "العربية" : "Arabic"}</option>
                            <option value="en">{isRTL ? "الإنجليزية" : "English"}</option>
                          </select>
                          <ChevronDown
                            className="pointer-events-none absolute top-1/2 size-4 -translate-y-1/2 text-slate-500 end-3 dark:text-slate-400"
                            aria-hidden
                          />
                       </div>
                    </div>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}

interface NavItemProps {
  icon: any
  label: string
  isActive?: boolean
  onClick: () => void
  isOpen: boolean
  badge?: string
}

function NavItem({ icon: Icon, label, isActive, onClick, isOpen, badge }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center transition-all duration-200 rounded-xl",
        isOpen ? "px-4 py-3 gap-3" : "p-3 justify-center",
        isActive 
          ? "bg-cyan-600 text-white shadow-lg shadow-cyan-500/20" 
          : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400"
      )}
    >
      <Icon className={cn("w-5 h-5 shrink-0", isActive && "animate-pulse")} />
      {isOpen && (
        <div className="flex-1 flex items-center justify-between min-w-0">
          <span className="font-medium truncate">{label}</span>
          {badge && (
            <span className={cn(
              "text-[10px] font-bold px-2 py-0.5 rounded-full",
              isActive ? "bg-white/20 text-white" : "bg-cyan-100 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400"
            )}>
              {badge}
            </span>
          )}
        </div>
      )}
    </button>
  )
}
