export interface Project {
  id: number;
  title: string;
  description: string | null;
  long_description: string | null;
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
  company: string | null;
  company_logo: string | null;
  period: string | null;
  description: string | null;
  achievements: string[];
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
  highlights: string[];
  created_at: string;
  updated_at: string;
}

export interface HeroContent {
  id: number;
  title: string | null;
  title_highlight: string | null;
  subtitle: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface PortfolioSettings {
  id: number;
  site_title: string;
  main_photo_url: string | null;
  hero_background_url: string | null;
  seo_image_url: string | null;
  meta_description: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  email: string | null;
  umami_url: string | null;
  umami_website_id: string | null;
  favicon_type: string;
  accent_color: string;
  show_admin_link: boolean;
  created_at: string;
  updated_at: string;
}

export interface Specialty {
  id: number;
  title: string;
  description: string;
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
  icon?: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}


