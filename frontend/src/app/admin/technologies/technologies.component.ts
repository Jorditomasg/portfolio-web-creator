import { Component, inject, signal, effect, computed, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TechnologiesService } from '../../core/services/technologies.service';
import { CategoriesService } from '../../core/services/categories.service';
import { ContentService } from '../../core/services/content.service';
import { ToastService } from '../../core/services/toast.service';
import { Technology } from '../../core/models/technology.model';
import { Category } from '../../core/models/api.models';
import { forkJoin, switchMap, finalize, tap, catchError, of, map } from 'rxjs';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

// SVG icons for specialty types (matching AboutComponent)
const SPECIALTY_ICONS: Record<string, string> = {
  'frontend': `<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <path d="M8 21h8M12 17v4" />
    <path d="M7 8l3 3-3 3M13 14h4" stroke-linecap="round" stroke-linejoin="round" />
  </svg>`,
  'tools': `<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
  </svg>`,
  'backend': `<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <rect x="2" y="2" width="20" height="8" rx="2" />
    <rect x="2" y="14" width="20" height="8" rx="2" />
    <circle cx="6" cy="6" r="1" fill="currentColor" />
    <circle cx="6" cy="18" r="1" fill="currentColor" />
    <path d="M10 6h8M10 18h8" stroke-linecap="round" />
  </svg>`,
  'devops': `<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
    <path d="M2 12h20" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>`,
  'database': `<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M21 12c0 1.66-4.03 3-9 3s-9-1.34-9-3" />
    <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
  </svg>`,
  'mobile': `<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <rect x="5" y="2" width="14" height="20" rx="2" />
    <path d="M12 18h.01" stroke-linecap="round" />
  </svg>`,
  'cloud': `<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
  </svg>`,
  'design': `<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path d="M12 19l7-7 3 3-7 7-3-3z"/>
    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
    <path d="M2 2l7.586 7.586"/>
    <circle cx="11" cy="11" r="2"/>
  </svg>`,
  'security': `<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path d="M12 1l10 5v6c0 5.55-3.84 10.74-9 12-5.16-1.26-9-6.45-9-12V6l9-5z"/>
  </svg>`,
  'testing': `<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
  </svg>`,
  'ai': `<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V11a2 2 0 1 1-2 0V5.73C10.4 5.39 10 4.74 10 4a2 2 0 0 1 2-2z"/>
    <path d="M12 13v8"/>
    <path d="M12 18l-5-3"/>
    <path d="M12 18l5-3"/>
  </svg>`,
  'blockchain': `<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
    <line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>`,
  'game': `<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <rect x="2" y="6" width="20" height="12" rx="2" />
    <path d="M6 12h4m-2-2v4" />
    <circle cx="15" cy="11" r="1" />
    <circle cx="17" cy="13" r="1" />
  </svg>`,
  'desktop': `<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>`,
  'other': `<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 16v-4"/>
    <path d="M12 8h.01"/>
  </svg>`,
};

@Component({
  selector: 'app-admin-technologies',
  imports: [FormsModule, DragDropModule],
  templateUrl: './technologies.component.html',
})
export class AdminTechnologiesComponent implements OnInit {
  private techService = inject(TechnologiesService);
  private catService = inject(CategoriesService);
  private contentService = inject(ContentService);
  private toast = inject(ToastService);
  private sanitizer = inject(DomSanitizer);

  getIconForCategory(type: string): SafeHtml {
    const svg = SPECIALTY_ICONS[type] || SPECIALTY_ICONS['other'];
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }

  technologies = signal<Technology[]>([]);
  categories = signal<Category[]>([]);
  activeTab = signal<string>(''); // Active category tab (by name)
  
  groupedTechnologies = computed(() => {
    const grouped: Record<string, Technology[]> = {};
    const techs = this.technologies();
    
    // Initialize with known categories to ensure empty ones show up if needed
    this.categories().forEach(cat => {
      grouped[cat.name] = [];
    });
    
    techs.forEach(tech => {
      const cat = tech.category || 'other';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(tech);
    });

    // Sort by display_order within categories
    Object.keys(grouped).forEach(cat => {
      grouped[cat].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    });

    return grouped;
  });

  categoryKeys = computed(() => {
    const definedCats = this.categories()
      .sort((a, b) => a.display_order - b.display_order)
      .map(c => c.name);
      
    const allGroupedKeys = Object.keys(this.groupedTechnologies());
    const extraKeys = allGroupedKeys.filter(k => !definedCats.includes(k)).sort();
    
    return [...definedCats, ...extraKeys];
  });

  showModal = signal(false);
  isEditing = signal(false);
  isSaving = signal(false);
  
  form: Partial<Technology> = { 
    name: '', 
    icon: '',
    show_in_about: false,
    category: 'other',
    level: 1 
  };

  searchResults = signal<{name: string, icon: string}[]>([]);
  private searchTimeout: any;

  // Category modal state
  showCategoryModal = signal(false);
  isEditingCategory = signal(false);
  editingCategoryId = signal<number | null>(null);
  
  // Category ordering modal state
  showCategoryOrderModal = signal(false);
  categoriesForOrdering = signal<Category[]>([]);
  
  categoryForm: Partial<Category> = {
    name: '',
    color: '#F5A623',
    short_title: '',
    long_title: '',
    description: '',
    short_title_en: '',
    long_title_en: '',
    description_en: '',
    icon: ''
  };

  presetColors = [
    '#F5A623', // Orange
    '#4A90E2', // Blue
    '#7ED321', // Green
    '#D0021B', // Red
    '#9013FE', // Purple
    '#F8E71C', // Yellow
    '#50E3C2', // Teal
    '#B8E986', // Light Green
    '#BD10E0', // Magenta
    '#4A4A4A', // Gray
    '#FFFFFF'  // White
  ];

  availableIcons = [
    'frontend', 'backend', 'tools', 'database', 'mobile', 
    'cloud', 'devops', 'design', 'security', 'testing', 
    'ai', 'blockchain', 'game', 'desktop', 'other'
  ];

  onCategoryTitleChange(newTitle: string) {
    // Only auto-update if name is empty or looks like a slug of the previous title
    // But for simplicity, let's just update if name is empty or strict match isn't required
    // Better: Helper function to slugify
    if (!this.categoryForm.name || this.categoryForm.name === this.slugify(this.categoryForm.short_title || '')) {
       // logic is a bit complex to reverse, so let's just simple auto-fill if name is empty
    }
    this.categoryForm.name = this.slugify(newTitle);
  }

  slugify(text: string): string {
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');            // Trim - from end of text
  }


  ngOnInit() {
    this.loadData().subscribe();
  }

  loadData() {
    return forkJoin([
      this.loadCategories(),
      this.loadTechnologies()
    ]).pipe(
      tap(() => {
        // Set initial active tab if not set
        if (!this.activeTab() && this.categoryKeys().length > 0) {
          this.activeTab.set(this.categoryKeys()[0]);
        }
      })
    );
  }

  loadCategories() {
    return this.catService.getCategories().pipe(
      tap(cats => {
        this.categories.set(cats.sort((a, b) => (a.display_order || 0) - (b.display_order || 0)));
      }),
      catchError(err => {
        console.error('Error loading categories', err);
        this.toast.error('Error al cargar categorías');
        return of([]);
      }),
      map(() => void 0)
    );
  }

  loadTechnologies() {
    return this.techService.getTechnologies().pipe(
      tap(techs => {
        // Ensure we have a defined category for every tech
        const processedTechs = techs.map(t => ({
          ...t,
          category: t.category || 'other'
        }));
        this.technologies.set(processedTechs);
      }),
      catchError(err => {
        console.error('Error loading technologies', err);
        this.toast.error('Error al cargar tecnologías');
        return of([]);
      }),
      map(() => void 0)
    );
  }

  openModal() {
    this.isEditing.set(false);
    this.form = { 
      name: '', 
      icon: '',
      show_in_about: true,
      category: this.activeTab() || 'other',
      level: 4
    };
    this.searchResults.set([]);
    this.showModal.set(true);
  }

  openModalForCategory(category: string) {
    this.isEditing.set(false);
    this.form = { 
      name: '', 
      icon: '',
      show_in_about: true,
      category: category || 'other',
      level: 4
    };
    this.searchResults.set([]);
    this.showModal.set(true);
  }

  openCategoryModal() {
    this.isEditingCategory.set(false);
    this.editingCategoryId.set(null);
    this.categoryForm = { 
      name: '', 
      color: '#F5A623',
      short_title: '',
      long_title: '',
      description: '',
      short_title_en: '',
      long_title_en: '',
      description_en: '',
      icon: ''
    };
    this.showCategoryModal.set(true);
  }

  editCategoryModal(categoryName: string) {
    const category = this.categories().find(c => c.name === categoryName);
    if (!category) return;

    this.isEditingCategory.set(true);
    this.editingCategoryId.set(category.id);
    this.categoryForm = { ...category };
    this.showCategoryModal.set(true);
  }

  getCategoryColor(categoryName: string): string {
    const cat = this.categories().find(c => c.name === categoryName);
    return cat?.color || '#6B7280';
  }

  closeCategoryModal() {
    this.showCategoryModal.set(false);
    this.isEditingCategory.set(false);
    this.editingCategoryId.set(null);
  }

  saveCategory() {
    // If short_title is missing, we can't properly generate the slug or show it
    if (!this.categoryForm.short_title) {
      this.toast.error('El título corto es requerido');
      return;
    }

    // Always regenerate name from short_title to ensure consistency
    this.categoryForm.name = this.slugify(this.categoryForm.short_title);
    
    let req;
    if (this.isEditingCategory() && this.editingCategoryId()) {
      req = this.catService.update(this.editingCategoryId()!, this.categoryForm);
    } else {
      // Calculate next display order
      const maxOrder = Math.max(...this.categories().map(c => c.display_order || 0), 0);
      const newCategory = { ...this.categoryForm, display_order: maxOrder + 1 };
      req = this.catService.create(newCategory);
    }

    req.pipe(
      switchMap(() => this.loadCategories())
    ).subscribe({
      next: () => {
        this.toast.success(this.isEditingCategory() ? 'Categoría actualizada' : 'Categoría creada');
        
        // Refresh global content
        this.contentService.refreshCategories();
        this.contentService.refreshTechnologies();

        // If we renamed the category, we might need to update activeTab if it was the edited one
        if (this.isEditingCategory() && this.categoryForm.name === this.activeTab()) {
           // keep active
        } else {
           // switch to new/renamed category
           this.activeTab.set(this.categoryForm.name!);
        }

        this.closeCategoryModal();
      },
      error: (e) => {
        console.error(e);
        this.toast.error('Error al guardar categoría');
      }
    });
  }

  deleteCategory(categoryName: string) {
    const category = this.categories().find(c => c.name === categoryName);
    if (!category) return;

    const techCount = this.groupedTechnologies()[categoryName]?.length || 0;
    const confirmMessage = techCount > 0 
      ? `¿Estás seguro de eliminar la categoría "${categoryName}"?\nSe eliminarán TAMBIÉN las ${techCount} tecnologías que contiene.`
      : `¿Estás seguro de eliminar la categoría "${categoryName}"?`;

    if (!confirm(confirmMessage)) return;

    this.catService.delete(category.id).subscribe({
      next: () => {
        this.toast.success('Categoría eliminada');
        
        // Remove from local state and select another tab if needed
        this.categories.update(cats => cats.filter(c => c.id !== category.id));
        
        // Update grouped technologies locally (remove them)
        this.technologies.update(techs => techs.filter(t => t.category !== category.name));
        
        // Refresh global content as well
        this.contentService.refreshCategories();
        this.contentService.refreshTechnologies();

        // Switch tab
        if (this.categoryKeys().length > 0) {
          this.activeTab.set(this.categoryKeys()[0]);
        } else {
          this.activeTab.set('');
        }
      },
      error: (e) => {
        console.error(e);
        this.toast.error('Error al eliminar categoría');
      }
    });
  }

  // Category ordering modal
  openCategoryOrderModal() {
    this.categoriesForOrdering.set([...this.categories()].sort((a, b) => 
      (a.display_order || 0) - (b.display_order || 0)
    ));
    this.showCategoryOrderModal.set(true);
  }

  closeCategoryOrderModal() {
    this.showCategoryOrderModal.set(false);
    this.categoriesForOrdering.set([]);
  }

  moveCategoryUp(index: number) {
    if (index <= 0) return;
    const cats = [...this.categoriesForOrdering()];
    [cats[index - 1], cats[index]] = [cats[index], cats[index - 1]];
    this.categoriesForOrdering.set(cats);
  }

  moveCategoryDown(index: number) {
    const cats = this.categoriesForOrdering();
    if (index >= cats.length - 1) return;
    const newCats = [...cats];
    [newCats[index], newCats[index + 1]] = [newCats[index + 1], newCats[index]];
    this.categoriesForOrdering.set(newCats);
  }

  saveCategoryOrder() {
    const cats = this.categoriesForOrdering();
    const updates = cats.map((cat, index) => 
      this.catService.update(cat.id, { display_order: index })
    );

    forkJoin(updates).pipe(
      switchMap(() => this.loadCategories())
    ).subscribe({
      next: () => {
        this.contentService.refreshCategories(); // Sync global
        this.toast.success('Orden de categorías actualizado');
        this.closeCategoryOrderModal();
      },
      error: (e) => {
        console.error(e);
        this.toast.error('Error al actualizar orden');
      }
    });
  }

  editTechnology(tech: Technology) {
    this.isEditing.set(true);
    this.form = { ...tech };
    this.searchResults.set([]);
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.searchResults.set([]);
  }

  onNameChange() {
    if (this.searchTimeout) clearTimeout(this.searchTimeout);

    if (!this.form.name || this.form.name.length < 2) {
      this.searchResults.set([]);
      return;
    }

    this.searchTimeout = setTimeout(() => {
      this.techService.searchIcons(this.form.name!).subscribe({
        next: (results) => this.searchResults.set(results),
        error: () => this.searchResults.set([])
      });
    }, 300);
  }

  selectIcon(result: {name: string, icon: string}) {
    this.form.name = result.name; // Optional: keep user input or use canonical name
    this.form.icon = result.icon;
    this.searchResults.set([]);
  }

  save() {
    // Allow empty icon for 'No Icon' support
    const iconToSave = this.form.icon || ''; 

    if (!this.form.name) return;
    
    this.isSaving.set(true);
    const techData = { ...this.form, icon: iconToSave };

    let req;
    if (this.isEditing() && this.form.id) {
      req = this.techService.updateTechnology(this.form.id, techData as Technology);
    } else {
      req = this.techService.createTechnology(techData);
    }

    req.pipe(
      finalize(() => this.isSaving.set(false))
    ).subscribe({
      next: (result) => {
        if (this.isEditing() && this.form.id) {
          this.technologies.update(techs => 
            techs.map(t => t.id === result.id ? result : t)
          );
          this.toast.success('Tecnología actualizada');
        } else {
          this.technologies.update(techs => [...techs, result]);
          this.toast.success('Tecnología creada');
        }
        
        this.contentService.refreshTechnologies(); // Sync global
        this.closeModal();
      },
      error: (err) => {
        console.error('Error saving technology', err);
        this.toast.error('Error al guardar tecnología');
      }
    });
  }

  deleteTechnology(tech: Technology) {
    if (!confirm(`¿Estás seguro de eliminar ${tech.name}?`)) return;

    this.techService.deleteTechnology(tech.id!).subscribe({
      next: () => {
        this.technologies.update(techs => techs.filter(t => t.id !== tech.id));
        this.contentService.refreshTechnologies(); // Sync global
        this.toast.success('Tecnología eliminada');
      },
      error: (err) => {
        console.error('Error deleting technology', err);
        this.toast.error('Error al eliminar tecnología');
      }
    });
  }

  // Drag and Drop implementation
  drop(event: CdkDragDrop<Technology[]>, category: string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      // Update display_order for all items in this category container
      this.updateOrder(event.container.data).subscribe();
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      
      // Update category and order
      const item = event.container.data[event.currentIndex];
      
      // We need to update the item in the backend immediately for category change
      this.techService.updateTechnology(item.id!, { category }).pipe(
        tap(() => {
          // Update local state to reflect category change across the app
          this.technologies.update(techs => 
            techs.map(t => t.id === item.id ? { ...t, category } : t)
          );
        }),
        switchMap(() => this.updateOrder(event.container.data))
      ).subscribe({
        next: () => {
          this.contentService.refreshTechnologies(); // Sync global
        },
        error: (err) => {
          console.error('Error moving technology', err);
          this.toast.error('Error al mover la tecnología');
        }
      });
    }
  }

  updateOrder(items: Technology[]) {
    // Prepare updates
    const updates = items.map((tech, index) => 
      this.techService.updateTechnology(tech.id!, { display_order: index })
    );

    // Optimistically update backend
    return forkJoin(updates).pipe(
      tap(() => {
        // Refresh local signal to ensure consistency
        this.technologies.update(allTechs => {
          return allTechs.map(t => {
             // Find if this tech is in the updated list
             const updatedItem = items.find(item => item.id === t.id);
             if (updatedItem) {
               // Find index in items
               const index = items.indexOf(updatedItem);
               return { ...t, display_order: index };
             }
             return t;
          });
        });
      }),
      map(() => void 0),
      catchError(err => {
        console.error('Error updating order', err);
        this.toast.error('Error al guardar el orden');
        return of(void 0);
      })
    );
  }

  dropCategory(event: CdkDragDrop<Category[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      
      const cats = event.container.data;
      const updates = cats.map((cat, index) => 
        this.catService.update(cat.id, { display_order: index })
      );

      forkJoin(updates).pipe(
        switchMap(() => this.loadCategories())
      ).subscribe({
        next: () => {
          this.contentService.refreshCategories(); // Sync global
          this.toast.success('Orden de categorías actualizado');
        },
        error: (e) => {
          console.error(e);
          this.toast.error('Error al actualizar orden de categorías');
        }
      });
    }
  }

  // Inline updates - synced: level 0 = eye off, level > 0 = eye on
  toggleShowInAbout(tech: Technology, event: Event) {
    event.stopPropagation();
    const newValue = !tech.show_in_about;
    const newLevel = newValue ? (tech.level || 1) : 0; // If enabling, keep level or set to 1; if disabling, set to 0
    
    // Optimistic UI update
    this.technologies.update(techs => 
      techs.map(t => t.id === tech.id ? { ...t, show_in_about: newValue, level: newLevel } : t)
    );

    this.techService.updateTechnology(tech.id!, { show_in_about: newValue, level: newLevel }).subscribe({
      next: () => {
        this.contentService.refreshTechnologies(); // Sync global
      },
      error: (err) => {
        console.error('Error updating show_in_about', err);
        this.toast.error('Error al actualizar');
        // Revert on error
        this.technologies.update(techs => 
          techs.map(t => t.id === tech.id ? { ...t, show_in_about: !newValue, level: tech.level } : t)
        );
      }
    });
  }

  updateLevel(tech: Technology, newLevel: number) {
    if (tech.level === newLevel) return;
    
    const oldLevel = tech.level;
    const oldShowInAbout = tech.show_in_about;
    const newShowInAbout = newLevel > 0; // Level > 0 means visible, level = 0 means hidden
    
    // Optimistic update
    this.technologies.update(techs => 
      techs.map(t => t.id === tech.id ? { ...t, level: newLevel, show_in_about: newShowInAbout } : t)
    );

    this.techService.updateTechnology(tech.id!, { level: newLevel, show_in_about: newShowInAbout }).subscribe({
      next: () => {
        this.contentService.refreshTechnologies(); // Sync global
      },
      error: (err) => {
        console.error('Error updating level', err);
        this.toast.error('Error al actualizar nivel');
        // Revert
        this.technologies.update(techs => 
          techs.map(t => t.id === tech.id ? { ...t, level: oldLevel, show_in_about: oldShowInAbout } : t)
        );
      }
    });
  }
}
