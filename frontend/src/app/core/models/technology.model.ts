export interface Technology {
  id: number;
  name: string;
  icon: string;
  show_in_about: boolean;
  category: string; // Changed from enum to string for dynamic categories
  level: number;
  display_order?: number;
  created_at?: string;
  updated_at?: string;
}
