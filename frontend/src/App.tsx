/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react"
import { Navbar } from "@/src/components/navbar"
import { HeroSection } from "@/src/components/hero-section"
import { StatsSection } from "@/src/components/stats-section"
import { SystemsSection } from "@/src/components/systems-section"
import { CustomSystemCTA } from "@/src/components/custom-system-cta"
import { FeaturesSection } from "@/src/components/features-section"
import { Footer } from "@/src/components/footer"
import { SupportChat } from "@/src/components/support-chat"
import { ThemeProvider } from "@/src/components/theme-provider"
import { LanguageProvider, useLanguage } from "@/src/contexts/language-context"
import { SiteConfigProvider } from "@/src/contexts/site-config-context"
import { Toaster } from "@/src/components/ui/toaster"
import { AdminLogin } from "@/src/components/admin/login"
import { AdminDashboard } from "@/src/components/admin/dashboard"
import { AnnouncementBar } from "@/src/components/announcement-bar"
import { useSiteConfig } from "@/src/contexts/site-config-context"
import { cn } from "@/src/lib/utils"

import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom"
import { DetailedPage } from "@/src/pages/detailed-page"
import { LocationPage } from "@/src/pages/location-page"

function MainAppContent() {
  const { pathname } = useLocation()
  const isAdminRoute = pathname.startsWith("/admin")
  const { language } = useLanguage()
  const { config } = useSiteConfig()
  const isRTL = language === 'ar'
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('admin-token')
    if (token) setIsAdminAuthenticated(true)
  }, [])

  const handleAdminLogin = (token: string) => {
    localStorage.setItem('admin-token', token)
    setIsAdminAuthenticated(true)
  }

  const handleAdminLogout = () => {
    localStorage.removeItem('admin-token')
    setIsAdminAuthenticated(false)
  }

  return (
    <div className={cn("min-h-screen bg-background antialiased", isRTL ? "font-cairo" : "font-sans")} dir={isRTL ? "rtl" : "ltr"}>
      <style>
        {`
          :root {
            --primary-color: ${config.appearance.primaryColor};
            --accent-color: ${config.appearance.accentColor};
          }
        `}
      </style>
      {!isAdminRoute && (
        <>
          <AnnouncementBar />
          <Navbar />
        </>
      )}

      <Routes>
        <Route path="/" element={
          <>
            <HeroSection />
            <StatsSection />
            <SystemsSection />
            <CustomSystemCTA />
            <FeaturesSection />
          </>
        } />
        
        <Route path="/admin" element={
          isAdminAuthenticated ? (
            <AdminDashboard onLogout={handleAdminLogout} isRTL={isRTL} />
          ) : (
            <AdminLogin onLogin={handleAdminLogin} isRTL={isRTL} />
          )
        } />

        <Route path="/:type/:id" element={<DetailedPage />} />
        <Route path="/location" element={<LocationPage />} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {!isAdminRoute && (
        <>
          <Footer />
          <SupportChat />
        </>
      )}
      <Toaster />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
    >
      <BrowserRouter>
        <LanguageProvider>
          <SiteConfigProvider>
            <MainAppContent />
          </SiteConfigProvider>
        </LanguageProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}
