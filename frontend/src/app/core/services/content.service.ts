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
} from '../models/api.models';

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
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  // Computed signals
  readonly featuredProjects = computed(() => 
    this._projects().filter(p => p.featured)
  );

  readonly skillsByCategory = computed(() => {
    const skills = this._skills();
    return {
      frontend: skills.filter(s => s.category === 'frontend'),
      backend: skills.filter(s => s.category === 'backend'),
      tools: skills.filter(s => s.category === 'tools'),
      other: skills.filter(s => s.category === 'other'),
    };
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
      const [projects, skills, experiences, about, hero, settings, specialties] = await Promise.all([
        firstValueFrom(this.http.get<Project[]>(`${this.apiUrl}/projects`)),
        firstValueFrom(this.http.get<Skill[]>(`${this.apiUrl}/skills`)),
        firstValueFrom(this.http.get<Experience[]>(`${this.apiUrl}/experiences`)),
        firstValueFrom(this.http.get<AboutContent>(`${this.apiUrl}/about`)),
        firstValueFrom(this.http.get<HeroContent>(`${this.apiUrl}/hero`)),
        firstValueFrom(this.http.get<PortfolioSettings>(`${this.apiUrl}/settings`)),
        firstValueFrom(this.http.get<Specialty[]>(`${this.apiUrl}/specialties`)),
      ]);

      this._projects.set(projects || []);
      this._skills.set(skills || []);
      this._experiences.set(experiences || []);
      this._about.set(about);
      this._hero.set(hero);
      this._settings.set(settings);
      this._specialties.set(specialties || []);
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
}
