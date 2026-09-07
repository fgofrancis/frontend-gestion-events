import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CategoryService } from './category.service';
import { CategoryDto } from './category.model';

@Component({
  selector: 'app-categorias-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './categorias-list.component.html',
  styleUrls: ['./categorias-list.component.scss'],
})
export class CategoriasListComponent {
  private readonly categoryService = inject(CategoryService);

  readonly categories = signal<CategoryDto[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly deletingId = signal<number | null>(null);

  constructor() {
    this.fetchCategories();
  }

  fetchCategories(): void {
    this.loading.set(true);
    this.error.set(null);
    this.categoryService.getAll().subscribe({
      next: (data) => {
        this.categories.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar las categorías. Intenta de nuevo.');
        this.loading.set(false);
      },
    });
  }

  remove(category: CategoryDto): void {
    if (!category.id) return;
    const confirmed = confirm(`¿Eliminar la categoría "${category.name}"? Esta acción no se puede deshacer.`);
    if (!confirmed) return;

    this.deletingId.set(category.id);
    this.categoryService.delete(category.id).subscribe({
      next: () => {
        this.categories.update((list) => list.filter((c) => c.id !== category.id));
        this.deletingId.set(null);
      },
      error: () => {
        this.error.set('No se pudo eliminar la categoría.');
        this.deletingId.set(null);
      },
    });
  }
}
