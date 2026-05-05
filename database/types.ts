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

export interface SiteConfig {
  hero: HeroBlock;
  stats: StatItem[];
  appearance: AppearanceBlock;
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
