import React, { createContext, useContext, useState, useEffect } from "react";

export interface SiteConfig {
  hero: {
    titleAr: string;
    titleEn: string;
    subtitleAr: string;
    subtitleEn: string;
    primaryButtonAr: string;
    primaryButtonEn: string;
    secondaryButtonAr: string;
    secondaryButtonEn: string;
  };
  stats: {
    labelAr: string;
    labelEn: string;
    value: string;
  }[];
  appearance: {
    primaryColor: string;
    accentColor: string;
    showSupportButton: boolean;
    announcementAr: string;
    announcementEn: string;
    showAnnouncement: boolean;
  };
  contact: {
    email: string;
    phone: string;
    addressAr: string;
    addressEn: string;
    socials: {
      platform: string;
      url: string;
    }[];
  };
}

const defaultConfig: SiteConfig = {
  hero: {
    titleAr: "وفر الوقت والمال وزد من مستوى مبيعاتك",
    titleEn: "Save Time and Money and Boost Your Sales",
    subtitleAr: "مع تطبيقات العسكريان لإدارة شركات التوزيع",
    subtitleEn: "With Alaskarian applications for distribution companies management",
    primaryButtonAr: "ابدأ الآن",
    primaryButtonEn: "Get Started",
    secondaryButtonAr: "تعرف علينا",
    secondaryButtonEn: "Learn More",
  },
  stats: [
    { labelAr: "عميل نشط", labelEn: "Active Client", value: "1500+" },
    { labelAr: "نظام مفعل", labelEn: "Active System", value: "45" },
    { labelAr: "دعم فني", labelEn: "Support", value: "24/7" },
  ],
  appearance: {
    primaryColor: "#0891b2", // cyan-600
    accentColor: "#2563eb", // blue-600
    showSupportButton: true,
    announcementAr: "بدأ العرض الصيفي! خصم 20% على جميع الأنظمة",
    announcementEn: "Summer offer started! 20% off on all systems",
    showAnnouncement: true,
  },
  contact: {
    email: "info@alaskarian.com",
    phone: "5252",
    addressAr: "العراق، سامراء",
    addressEn: "Samarra, Iraq",
    socials: [
      { platform: "Facebook", url: "https://facebook.com" },
      { platform: "LinkedIn", url: "https://linkedin.com" },
    ],
  },
};

interface SiteConfigContextType {
  config: SiteConfig;
  updateConfig: (newConfig: Partial<SiteConfig>) => void;
  resetConfig: () => void;
}

const SiteConfigContext = createContext<SiteConfigContextType | undefined>(undefined);

export function SiteConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<SiteConfig>(defaultConfig);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/config")
      .then(res => res.json())
      .then(data => {
        if (data && data.hero) {
          setConfig(data);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to load config", err);
        setIsLoading(false);
      });
  }, []);

  const updateConfig = async (newConfig: SiteConfig) => {
    try {
      const response = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newConfig),
      });
      if (response.ok) {
        setConfig(newConfig);
      }
    } catch (err) {
      console.error("Failed to update config", err);
    }
  };

  const resetConfig = async () => {
    await updateConfig(defaultConfig);
  };

  if (isLoading) return <div className="h-screen w-screen flex items-center justify-center bg-slate-950 text-white font-bold text-2xl animate-pulse">Loading Alaskarian Systems...</div>;

  return (
    <SiteConfigContext.Provider value={{ config, updateConfig, resetConfig }}>
      {children}
    </SiteConfigContext.Provider>
  );
}

export function useSiteConfig() {
  const context = useContext(SiteConfigContext);
  if (context === undefined) {
    throw new Error("useSiteConfig must be used within a SiteConfigProvider");
  }
  return context;
}
