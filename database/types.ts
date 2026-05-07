/** Domain types persisted by the database layer (file-backed today). */

export interface HeroBlock {
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  primaryButtonAr: string;
  primaryButtonEn: string;
  secondaryButtonAr: string;
  secondaryButtonEn: string;
}

export interface StatItem {
  labelAr: string;
  labelEn: string;
  value: string;
}

export interface AppearanceBlock {
  primaryColor: string;
  accentColor: string;
  showSupportButton: boolean;
  showAnnouncement: boolean;
  announcementAr: string;
  announcementEn: string;
}

export interface FeatureItem {
  iconName: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
}

export interface FeaturesBlock {
  titleAr: string;
  titleHighlightAr: string;
  titleEn: string;
  titleHighlightEn: string;
  subtitleAr: string;
  subtitleEn: string;
  items: FeatureItem[];
}

export interface CTABlock {
  titleAr: string;
  titleEn: string;
  titleHighlightAr: string;
  titleHighlightEn: string;
  buttonAr: string;
  buttonEn: string;
}

export interface NavbarBlock {
  logoInitialAr: string;
  logoInitialEn: string;
  logoTitleAr: string;
  logoTitleEn: string;
  customerServiceAr: string;
  customerServiceEn: string;
}

export interface FooterBlock {
  companyNameAr: string;
  companyNameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  copyrightAr: string;
  copyrightEn: string;
  madeWithAr: string;
  madeWithEn: string;
}

export interface SystemsBlock {
  sectionLabelAr: string;
  sectionLabelEn: string;
  titleAr: string;
  titleEn: string;
  titleHighlightAr: string;
  titleHighlightEn: string;
  subtitleAr: string;
  subtitleEn: string;
  ctaAr: string;
  ctaEn: string;
  viewAllAr: string;
  viewAllEn: string;
}

export interface SiteConfig {
  hero: HeroBlock;
  stats: StatItem[];
  features: FeaturesBlock;
  cta: CTABlock;
  navbar: NavbarBlock;
  footer: FooterBlock;
  systems: SystemsBlock;
  appearance: AppearanceBlock;
  contact: {
    email: string;
    phone: string;
    whatsapp: string;
    addressAr: string;
    addressEn: string;
    websiteUrl: string;
    socials: {
      facebook: string;
      twitter: string;
      instagram: string;
      linkedin: string;
    };
  };
  integrations?: {
    telegram?: {
      botToken: string;
      chatId: string;
      enabled: boolean;
    };
  };
}

export interface Product {
  id: string;
  nameAr: string;
  nameEn: string;
  price: number;
  category: string;
  descriptionAr: string;
  descriptionEn: string;
  imageUrl: string;
  videoUrl: string;
}

export interface ActivityLogEntry {
  id: number;
  timestamp: string;
  event: string;
  user: string;
  status: string;
}
