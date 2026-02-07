import { Injectable, signal, computed } from '@angular/core';

export type Language = 'es' | 'en';

interface Translations {
  [key: string]: {
    es: string;
    en: string;
  };
}

const translations: Translations = {
  // Navigation
  'nav.home': { es: 'Inicio', en: 'Home' },
  'nav.about': { es: 'Sobre mí', en: 'About' },
  'nav.projects': { es: 'Proyectos', en: 'Projects' },
  'nav.contact': { es: 'Contacto', en: 'Contact' },
  
  // Home
  'home.cta.projects': { es: 'Ver Proyectos', en: 'View Projects' },
  'home.cta.contact': { es: 'Contactar', en: 'Contact Me' },
  'home.specialties': { es: 'Especialidades', en: 'Specialties' },
  'home.specialties.subtitle': { es: 'Áreas en las que me especializo para entregar soluciones de calidad', en: 'Areas where I specialize to deliver quality solutions' },
  
  // About
  'about.title': { es: 'Sobre Mí', en: 'About Me' },
  'about.subtitle': { es: 'Conoce mi trayectoria y especialidades técnicas', en: 'Learn about my journey and technical specialties' },
  'about.who': { es: '¿Quién soy?', en: 'Who am I?' },
  'about.highlights': { es: 'Highlights', en: 'Highlights' },
  'about.specialties': { es: 'Mis Especialidades', en: 'My Specialties' },
  'about.skills': { es: 'Habilidades Técnicas', en: 'Technical Skills' },
  'about.frontend': { es: 'Frontend', en: 'Frontend' },
  'about.backend': { es: 'Backend', en: 'Backend' },
  'about.tools': { es: 'Herramientas', en: 'Tools' },
  'about.experience': { es: 'Experiencia Profesional', en: 'Professional Experience' },
  
  // Projects
  'projects.title': { es: 'Mis Proyectos', en: 'My Projects' },
  'projects.subtitle': { es: 'Una selección de trabajos que demuestran mis habilidades', en: 'A selection of work showcasing my skills' },
  'projects.demo': { es: 'Demo', en: 'Demo' },
  'projects.code': { es: 'Código', en: 'Code' },
  'projects.empty': { es: 'No hay proyectos para mostrar.', en: 'No projects to display.' },
  
  // Contact
  'contact.title': { es: 'Contacto', en: 'Contact' },
  'contact.subtitle': { es: '¿Tienes un proyecto en mente? ¡Hablemos!', en: 'Have a project in mind? Let\'s talk!' },
  'contact.form.title': { es: 'Envíame un mensaje', en: 'Send me a message' },
  'contact.form.name': { es: 'Nombre', en: 'Name' },
  'contact.form.email': { es: 'Email', en: 'Email' },
  'contact.form.subject': { es: 'Asunto', en: 'Subject' },
  'contact.form.message': { es: 'Mensaje', en: 'Message' },
  'contact.form.send': { es: 'Enviar Mensaje', en: 'Send Message' },
  'contact.form.sending': { es: 'Enviando...', en: 'Sending...' },
  'contact.form.success': { es: '¡Mensaje enviado correctamente!', en: 'Message sent successfully!' },
  'contact.direct': { es: 'Contacto directo', en: 'Direct contact' },
  'contact.linkedin': { es: 'Ver perfil profesional', en: 'View professional profile' },
  'contact.github': { es: 'Ver repositorios', en: 'View repositories' },
  'contact.empty': { es: 'No hay enlaces de contacto configurados.', en: 'No contact links configured.' },
  
  // Footer
  'footer.rights': { es: 'Todos los derechos reservados.', en: 'All rights reserved.' },
};

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private _currentLang = signal<Language>(this.getInitialLang());
  
  readonly currentLang = this._currentLang.asReadonly();
  readonly isSpanish = computed(() => this._currentLang() === 'es');
  readonly isEnglish = computed(() => this._currentLang() === 'en');

  private getInitialLang(): Language {
    // 1. Check localStorage first (user preference)
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('lang');
      if (stored === 'en' || stored === 'es') return stored;
    }
    
    // 2. Detect browser language
    if (typeof navigator !== 'undefined') {
      const browserLang = navigator.language || (navigator as any).userLanguage;
      if (browserLang) {
        const lang = browserLang.split('-')[0].toLowerCase();
        if (lang === 'en') return 'en';
        if (lang === 'es') return 'es';
        // Default to English for other languages
        return 'en';
      }
    }
    
    // 3. Fallback to Spanish
    return 'es';
  }

  setLanguage(lang: Language) {
    this._currentLang.set(lang);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('lang', lang);
    }
  }

  toggleLanguage() {
    this.setLanguage(this._currentLang() === 'es' ? 'en' : 'es');
  }

  t(key: string): string {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Translation not found: ${key}`);
      return key;
    }
    return translation[this._currentLang()];
  }

  // For use in templates - returns a signal
  translate(key: string) {
    return computed(() => this.t(key));
  }
}
