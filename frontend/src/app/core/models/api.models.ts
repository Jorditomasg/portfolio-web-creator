export interface Project {
  id: number;
  title: string;
  title_en: string | null;
  description: string | null;
  description_en: string | null;
  long_description: string | null;
  long_description_en: string | null;
  image_url: string | null;
  demo_url: string | null;
  github_url: string | null;
  technologies: string[];
  featured: boolean;
  start_date: string | null;
  end_date: string | null;
  is_in_progress: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: number;
  name: string;
  category: 'frontend' | 'backend' | 'tools' | 'other';
  level: number;
  icon_url: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Experience {
  id: number;
  title: string;
  title_en: string | null;
  company: string | null;
  company_logo: string | null;
  period: string | null;
  description: string | null;
  description_en: string | null;
  achievements: string[];
  achievements_en: string[];
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface AboutContent {
  id: number;
  bio: string | null;
  bio_en: string | null;
  image_url: string | null;
  highlights: string[];
  highlights_en: string[];
  created_at: string;
  updated_at: string;
}

export interface HeroContent {
  id: number;
  title: string | null;
  title_highlight: string | null;
  title_en: string | null;
  title_highlight_en: string | null;
  subtitle: string | null;
  subtitle_en: string | null;
  description: string | null;
  description_en: string | null;
  background_image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface PortfolioSettings {
  id: number;
  site_title: string;
  main_photo_url: string | null;
  meta_description: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  email: string | null;
  favicon_type: string;
  accent_color: string;
  show_admin_link: boolean;
  enable_contact_form: boolean;
  enable_email_sending: boolean;
  enable_database_storage: boolean;
  smtp_host: string | null;
  smtp_port: number | null;
  smtp_user: string | null;
  smtp_pass: string | null;
  smtp_secure: boolean;
  smtp_require_tls: boolean;
  smtp_from: string | null;
  created_at: string;
  updated_at: string;
}

export interface Specialty {
  id: number;
  title: string;
  title_en: string | null;
  description: string;
  description_en: string | null;
  color: string;
  icon_type: string;
  technologies: string[];
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

export interface Category {
  id: number;
  name: string;
  color: string;
  long_title?: string;
  short_title?: string;
  description?: string;
  long_title_en?: string;
  short_title_en?: string;
  description_en?: string;
  icon?: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}


