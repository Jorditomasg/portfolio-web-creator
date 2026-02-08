import { Component, inject, signal, effect, computed, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TechnologiesService } from '../../core/services/technologies.service';
import { CategoriesService } from '../../core/services/categories.service';
import { ToastService } from '../../core/services/toast.service';
import { Technology } from '../../core/models/technology.model';
import { Category } from '../../core/models/api.models';
import { firstValueFrom } from 'rxjs';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { DOCUMENT } from '@angular/common'; // Import DOCUMENT

@Component({
  selector: 'app-admin-technologies',
  standalone: true,
  imports: [FormsModule, DragDropModule],
  templateUrl: './technologies.component.html',
})
export class AdminTechnologiesComponent implements OnInit {
  private techService = inject(TechnologiesService);
  private catService = inject(CategoriesService);
  private toast = inject(ToastService);

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
    this.loadData();
  }

  async loadData() {
    await Promise.all([this.loadCategories(), this.loadTechnologies()]);
    // Set initial active tab if not set
    if (!this.activeTab() && this.categoryKeys().length > 0) {
      this.activeTab.set(this.categoryKeys()[0]);
    }
  }

  async loadCategories() {
    try {
      const cats = await firstValueFrom(this.catService.getCategories());
      this.categories.set(cats.sort((a, b) => (a.display_order || 0) - (b.display_order || 0)));
    } catch (err) {
      console.error('Error loading categories', err);
      this.toast.error('Error al cargar categorías');
    }
  }

  async loadTechnologies() {
    try {
      const techs = await firstValueFrom(this.techService.getTechnologies());
      // Ensure we have a defined category for every tech
      const processedTechs = techs.map(t => ({
        ...t,
        category: t.category || 'other'
      }));
      this.technologies.set(processedTechs);
    } catch (err) {
      console.error('Error loading technologies', err);
      this.toast.error('Error al cargar tecnologías');
    }
  }

  openModal() {
    this.isEditing.set(false);
    this.form = { 
      name: '', 
      icon: '',
      show_in_about: false,
      category: this.activeTab() || 'other',
      level: 1
    };
    this.searchResults.set([]);
    this.showModal.set(true);
  }

  openModalForCategory(category: string) {
    this.isEditing.set(false);
    this.form = { 
      name: '', 
      icon: '',
      show_in_about: false,
      category: category || 'other',
      level: 1
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

  async saveCategory() {
    if (!this.categoryForm.name) return;
    
    try {
      if (this.isEditingCategory() && this.editingCategoryId()) {
        await firstValueFrom(this.catService.update(this.editingCategoryId()!, this.categoryForm));
        this.toast.success('Categoría actualizada');
      } else {
        // Calculate next display order
        const maxOrder = Math.max(...this.categories().map(c => c.display_order || 0), 0);
        const newCategory = { ...this.categoryForm, display_order: maxOrder + 1 };
        await firstValueFrom(this.catService.create(newCategory));
        this.toast.success('Categoría creada');
      }
      await this.loadCategories(); // Reload to get updates/new IDs
      // If we renamed the category, we might need to update activeTab if it was the edited one
      // But for now let's keep it simple. User can click tab again.
      if (this.isEditingCategory() && this.categoryForm.name === this.activeTab()) {
         // keep active
      } else if (this.isEditingCategory()) {
         // if renamed, switch to new name
         this.activeTab.set(this.categoryForm.name!);
      } else {
         // if new, switch to it
         this.activeTab.set(this.categoryForm.name!);
      }

      this.closeCategoryModal();
    } catch (e) {
      console.error(e);
      this.toast.error('Error al guardar categoría');
    }
  }

  async deleteCategory(categoryName: string) {
    const category = this.categories().find(c => c.name === categoryName);
    if (!category) return;

    const techCount = this.groupedTechnologies()[categoryName]?.length || 0;
    const confirmMessage = techCount > 0 
      ? `¿Estás seguro de eliminar la categoría "${categoryName}"?\nSe eliminarán TAMBIÉN las ${techCount} tecnologías que contiene.`
      : `¿Estás seguro de eliminar la categoría "${categoryName}"?`;

    if (!confirm(confirmMessage)) return;

    try {
      await firstValueFrom(this.catService.delete(category.id));
      this.toast.success('Categoría eliminada');
      
      // Remove from local state and select another tab if needed
      this.categories.update(cats => cats.filter(c => c.id !== category.id));
      
      // Update grouped technologies locally (remove them)
      this.technologies.update(techs => techs.filter(t => t.category !== category.name));

      // Switch tab
      if (this.categoryKeys().length > 0) {
        this.activeTab.set(this.categoryKeys()[0]);
      } else {
        this.activeTab.set('');
      }
    } catch (e) {
      console.error(e);
      this.toast.error('Error al eliminar categoría');
    }
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

  async saveCategoryOrder() {
    const cats = this.categoriesForOrdering();
    try {
      await Promise.all(cats.map((cat, index) => 
        firstValueFrom(this.catService.update(cat.id, { display_order: index }))
      ));
      await this.loadCategories();
      this.toast.success('Orden de categorías actualizado');
      this.closeCategoryOrderModal();
    } catch (e) {
      console.error(e);
      this.toast.error('Error al actualizar orden');
    }
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

  async save() {
    // Allow empty icon for "No Icon" support (or use a placeholder logic if preferred)
    const iconToSave = this.form.icon || ''; 

    if (!this.form.name) return;
    
    this.isSaving.set(true);
    try {
      const techData = { ...this.form, icon: iconToSave };

      if (this.isEditing() && this.form.id) {
        const updated = await firstValueFrom(this.techService.updateTechnology(this.form.id, techData as Technology));
        this.technologies.update(techs => 
          techs.map(t => t.id === updated.id ? updated : t)
        );
        this.toast.success('Tecnología actualizada');
      } else {
        const created = await firstValueFrom(this.techService.createTechnology(techData));
        this.technologies.update(techs => [...techs, created]);
        this.toast.success('Tecnología creada');
      }
      this.closeModal();
    } catch (err) {
      console.error('Error saving technology', err);
      this.toast.error('Error al guardar tecnología');
    } finally {
      this.isSaving.set(false);
    }
  }

  async deleteTechnology(tech: Technology) {
    if (!confirm(`¿Estás seguro de eliminar ${tech.name}?`)) return;

    try {
      await firstValueFrom(this.techService.deleteTechnology(tech.id!));
      this.technologies.update(techs => techs.filter(t => t.id !== tech.id));
      this.toast.success('Tecnología eliminada');
    } catch (err) {
      console.error('Error deleting technology', err);
      this.toast.error('Error al eliminar tecnología');
    }
  }

  // Drag and Drop implementation
  async drop(event: CdkDragDrop<Technology[]>, category: string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      // Update display_order for all items in this category container
      await this.updateOrder(event.container.data);
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
      try {
        await firstValueFrom(this.techService.updateTechnology(item.id!, { category }));
        
        // Update local state to reflect category change across the app
        this.technologies.update(techs => 
          techs.map(t => t.id === item.id ? { ...t, category } : t)
        );

        await this.updateOrder(event.container.data);
      } catch (err) {
        this.toast.error('Error al mover la tecnología');
      }
    }
  }

  async updateOrder(items: Technology[]) {
    // Prepare updates
    const updates = items.map((tech, index) => ({
      id: tech.id!,
      display_order: index
    }));

    try {
      // Optimistically update backend
      await Promise.all(updates.map(u => 
        firstValueFrom(this.techService.updateTechnology(u.id, { display_order: u.display_order }))
      ));
      
      // Refresh local signal to ensure consistency
      this.technologies.update(allTechs => {
        return allTechs.map(t => {
           const updated = updates.find(u => u.id === t.id);
           if (updated) return { ...t, display_order: updated.display_order };
           return t;
        });
      });

    } catch (err) {
      console.error('Error updating order', err);
      this.toast.error('Error al guardar el orden');
    }
  }

  async dropCategory(event: CdkDragDrop<Category[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      
      const cats = event.container.data;
      try {
        await Promise.all(cats.map((cat, index) => 
          firstValueFrom(this.catService.update(cat.id, { display_order: index }))
        ));
        
        // Refresh global categories
        await this.loadCategories();
        this.toast.success('Orden de categorías actualizado');
      } catch (e) {
        console.error(e);
        this.toast.error('Error al actualizar orden de categorías');
      }
    }
  }

  // Inline updates - synced: level 0 = eye off, level > 0 = eye on
  async toggleShowInAbout(tech: Technology, event: Event) {
    event.stopPropagation();
    const newValue = !tech.show_in_about;
    const newLevel = newValue ? (tech.level || 1) : 0; // If enabling, keep level or set to 1; if disabling, set to 0
    
    // Optimistic UI update
    this.technologies.update(techs => 
      techs.map(t => t.id === tech.id ? { ...t, show_in_about: newValue, level: newLevel } : t)
    );

    try {
      await firstValueFrom(this.techService.updateTechnology(tech.id!, { show_in_about: newValue, level: newLevel }));
    } catch(err) {
      this.toast.error('Error al actualizar');
      // Revert on error
      this.technologies.update(techs => 
        techs.map(t => t.id === tech.id ? { ...t, show_in_about: !newValue, level: tech.level } : t)
      );
    }
  }

  async updateLevel(tech: Technology, newLevel: number) {
    if (tech.level === newLevel) return;
    
    const oldLevel = tech.level;
    const oldShowInAbout = tech.show_in_about;
    const newShowInAbout = newLevel > 0; // Level > 0 means visible, level = 0 means hidden
    
    // Optimistic update
    this.technologies.update(techs => 
      techs.map(t => t.id === tech.id ? { ...t, level: newLevel, show_in_about: newShowInAbout } : t)
    );

    try {
       await firstValueFrom(this.techService.updateTechnology(tech.id!, { level: newLevel, show_in_about: newShowInAbout }));
    } catch (err) {
       this.toast.error('Error al actualizar nivel');
       // Revert
       this.technologies.update(techs => 
        techs.map(t => t.id === tech.id ? { ...t, level: oldLevel, show_in_about: oldShowInAbout } : t)
      );
    }
  }
}
