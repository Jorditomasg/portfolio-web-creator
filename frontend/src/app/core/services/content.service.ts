import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import {
  Project,
  Skill,
  Experience,
  AboutContent,
  HeroContent,
  PortfolioSettings,
  Specialty,
  Category,
} from '../models/api.models';
import { Technology } from '../models/technology.model';

@Injectable({ providedIn: 'root' })
export class ContentService {
  private http = inject(HttpClient);
  private apiUrl = '/api';

  // Reactive state with signals
  private _projects = signal<Project[]>([]);
  private _skills = signal<Skill[]>([]);
  private _experiences = signal<Experience[]>([]);
  private _about = signal<AboutContent | null>(null);
  private _hero = signal<HeroContent | null>(null);
  private _settings = signal<PortfolioSettings | null>(null);
  private _specialties = signal<Specialty[]>([]);
  private _technologies = signal<Technology[]>([]);
  private _categories = signal<Category[]>([]);
  private _isLoading = signal(false);
  private _error = signal<string | null>(null);

  // Public read-only signals
  readonly projects = this._projects.asReadonly();
  readonly skills = this._skills.asReadonly();
  readonly experiences = this._experiences.asReadonly();
  readonly about = this._about.asReadonly();
  readonly hero = this._hero.asReadonly();
  readonly settings = this._settings.asReadonly();
  readonly specialties = this._specialties.asReadonly();
  readonly technologies = this._technologies.asReadonly();
  readonly categories = this._categories.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  // Computed signals
  readonly featuredProjects = computed(() => 
    this._projects()
      .filter(p => p.featured)
      .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
  );

  readonly sortedProjects = computed(() => 
    [...this._projects()].sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
  );

  readonly skillsByCategory = computed(() => {
    // Filter technologies that should be shown in about
    const skills = this._technologies().filter(t => t.show_in_about);
    const categories = this._categories();

    // Group by category
    const grouped: Record<string, Technology[]> = {};
    skills.forEach(skill => {
      const cat = skill.category || 'other';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(skill);
    });

    // Create result structure: Array of { category: Category | string, skills: Technology[] }
    // Sort categories by display_order
    const sortedCategories = [...categories].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    
    const result: { category: Category, skills: Technology[] }[] = [];

    // Add defined categories if they have skills
    sortedCategories.forEach(cat => {
      if (grouped[cat.name] && grouped[cat.name].length > 0) {
        // Sort skills within category
        const catSkills = grouped[cat.name].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
        result.push({ category: cat, skills: catSkills });
        delete grouped[cat.name];
      }
    });

    // Handle 'other' or undefined categories if any remain and have skills
    // We can attach them to a dummy Category object or handle them separately.
    // Assuming 'other' is mapped to a fallback or just pushed at the end.
    Object.keys(grouped).forEach(key => {
      if (grouped[key].length > 0) {
        // Create a mock category for unknown ones
        const mockCat: Category = {
          id: -1,
          name: key,
          long_title: key.charAt(0).toUpperCase() + key.slice(1),
          short_title: key.charAt(0).toUpperCase() + key.slice(1),
          // ... defaults
          display_order: 999,
          color: '#6B7280',
          created_at: new Date(),
          updated_at: new Date(),
          technologies: []
        } as any; 
        
        result.push({ category: mockCat, skills: grouped[key] });
      }
    });

    return result;
  });

  readonly specialtyCategories = computed(() => {
    // Filter categories that have enough info to be shown as a "Specialty Card" (Hero/About)
    // User requirement: Must have long_title and description.
    return this.skillsByCategory().filter(group => 
      group.category && 
      group.category.long_title && 
      group.category.description
    );
  });

  readonly siteTitle = computed(() => 
    this._settings()?.site_title || 'Portfolio'
  );

  constructor() {
    this.loadAllContent();
  }

  async loadAllContent(): Promise<void> {
    this._isLoading.set(true);
    this._error.set(null);

    try {
      const [projects, experiences, about, hero, settings, specialties, technologies, categories] = await Promise.all([
        firstValueFrom(this.http.get<Project[]>(`${this.apiUrl}/projects`)),
        firstValueFrom(this.http.get<Experience[]>(`${this.apiUrl}/experiences`)),
        firstValueFrom(this.http.get<AboutContent>(`${this.apiUrl}/about`)),
        firstValueFrom(this.http.get<HeroContent>(`${this.apiUrl}/hero`)),
        firstValueFrom(this.http.get<PortfolioSettings>(`${this.apiUrl}/settings`)),
        firstValueFrom(this.http.get<Specialty[]>(`${this.apiUrl}/specialties`)),
        firstValueFrom(this.http.get<Technology[]>(`${this.apiUrl}/technologies`)),
        firstValueFrom(this.http.get<Category[]>(`${this.apiUrl}/categories`)),
      ]);

      this._projects.set(projects || []);
      // this._skills.set(skills || []); // Deprecated
      this._experiences.set(experiences || []);
      this._about.set(about);
      this._hero.set(hero);
      this._settings.set(settings);
      this._specialties.set(specialties || []);
      this._technologies.set(technologies || []);
      this._categories.set(categories || []);
    } catch (err) {
      console.error('Failed to load content', err);
      this._error.set('Error al cargar el contenido');
    } finally {
      this._isLoading.set(false);
    }
  }

  async refreshProjects(): Promise<void> {
    const projects = await firstValueFrom(this.http.get<Project[]>(`${this.apiUrl}/projects`));
    this._projects.set(projects || []);
  }

  async refreshSkills(): Promise<void> {
    const skills = await firstValueFrom(this.http.get<Skill[]>(`${this.apiUrl}/skills`));
    this._skills.set(skills || []);
  }

  async refreshSpecialties(): Promise<void> {
    const specialties = await firstValueFrom(this.http.get<Specialty[]>(`${this.apiUrl}/specialties`));
    this._specialties.set(specialties || []);
  }
  
  async refreshTechnologies(): Promise<void> {
    const technologies = await firstValueFrom(this.http.get<Technology[]>(`${this.apiUrl}/technologies`));
    this._technologies.set(technologies || []);
  }

  async refreshCategories(): Promise<void> {
    const categories = await firstValueFrom(this.http.get<Category[]>(`${this.apiUrl}/categories`));
    this._categories.set(categories || []);
  }
}
