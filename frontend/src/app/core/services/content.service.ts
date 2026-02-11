import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable, of, forkJoin, finalize, catchError, map, tap } from 'rxjs';
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
  private _skills = signal<Skill[]>([]); // Keep if needed for backward compat, though depleted
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
    // No explicit loadAllContent() here anymore
  }

  // --- Granular Fetch Methods ---

  loadProjects(force: boolean = false): Observable<void> {
    if (!force && this._projects().length > 0) return of(void 0);
    return this.fetchData(this._projects, `${this.apiUrl}/projects`);
  }

  loadExperiences(force: boolean = false): Observable<void> {
    if (!force && this._experiences().length > 0) return of(void 0);
    return this.fetchData(this._experiences, `${this.apiUrl}/experiences`);
  }

  loadAbout(force: boolean = false): Observable<void> {
    if (!force && this._about()) return of(void 0);
    return this.fetchData(this._about, `${this.apiUrl}/about`);
  }

  loadHero(force: boolean = false): Observable<void> {
    if (!force && this._hero()) return of(void 0);
    return this.fetchData(this._hero, `${this.apiUrl}/hero`);
  }

  loadSettings(force: boolean = false): Observable<void> {
    if (!force && this._settings()) return of(void 0);
    return this.fetchData(this._settings, `${this.apiUrl}/settings`);
  }

  loadSpecialties(force: boolean = false): Observable<void> {
    if (!force && this._specialties().length > 0) return of(void 0);
    return this.fetchData(this._specialties, `${this.apiUrl}/specialties`);
  }

  loadTechnologies(force: boolean = false): Observable<void> {
    if (!force && this._technologies().length > 0) return of(void 0);
    return this.fetchData(this._technologies, `${this.apiUrl}/technologies`);
  }

  loadCategories(force: boolean = false): Observable<void> {
    if (!force && this._categories().length > 0) return of(void 0);
    return this.fetchData(this._categories, `${this.apiUrl}/categories`);
  }

  loadSkills(force: boolean = false): Observable<void> {
    if (!force && this._skills().length > 0) return of(void 0);
    return this.fetchData(this._skills, `${this.apiUrl}/skills`);
  }

  /**
   * Helper to fetch data and update a signal.
   * Handles loading state and errors.
   */
  private fetchData<T>(signal: any, url: string): Observable<void> {
    this._isLoading.set(true);
    this._error.set(null);
    return this.http.get<T>(url).pipe(
      tap(data => signal.set(data || (Array.isArray(data) ? [] : null))),
      map(() => void 0),
      catchError(err => {
        console.error(`Error loading ${url}`, err);
        this._error.set(err.message || 'Error loading content');
        return of(void 0);
      }),
      finalize(() => this._isLoading.set(false))
    );
  }

  /**
   * @deprecated Use granular load methods instead.
   */
  loadAllContent(): Observable<void> {
    this._isLoading.set(true);
    return forkJoin([
      this.loadProjects(),
      this.loadExperiences(),
      this.loadAbout(),
      this.loadHero(),
      this.loadSettings(),
      this.loadSpecialties(),
      this.loadTechnologies(),
      this.loadCategories()
    ]).pipe(
      map(() => void 0),
      catchError(err => {
        console.error('Failed to load content', err);
        return of(void 0);
      }),
      finalize(() => this._isLoading.set(false))
    );
  }

  refreshProjects() { this.loadProjects(true).subscribe(); }
  refreshSkills() { this.loadSkills(true).subscribe(); }
  refreshSpecialties() { this.loadSpecialties(true).subscribe(); }
  refreshTechnologies() { this.loadTechnologies(true).subscribe(); }
  refreshCategories() { this.loadCategories(true).subscribe(); }
}
