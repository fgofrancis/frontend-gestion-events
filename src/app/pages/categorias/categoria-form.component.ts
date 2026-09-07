import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CategoryService } from './category.service';

@Component({
  selector: 'app-categoria-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './categoria-form.component.html',
  styleUrls: ['./categoria-form.component.scss'],
})
export class CategoriaFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly categoryService = inject(CategoryService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly categoryId = this.route.snapshot.paramMap.get('id');
  readonly isEditMode = !!this.categoryId;

  readonly loading = signal(this.isEditMode);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.maxLength(500)]],
  });

  constructor() {
    if (this.isEditMode) {
      this.categoryService.getById(Number(this.categoryId)).subscribe({
        next: (category) => {
          this.form.patchValue({
            name: category.name,
            description: category.description ?? '',
          });
          this.loading.set(false);
        },
        error: () => {
          this.error.set('No se pudo cargar la categoría solicitada.');
          this.loading.set(false);
        },
      });
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.error.set(null);
    const dto = this.form.getRawValue();

    const request$ = this.isEditMode
      ? this.categoryService.update(Number(this.categoryId), dto)
      : this.categoryService.create(dto);

    request$.subscribe({
      next: () => this.router.navigate(['/categorias']),
      error: () => {
        this.error.set('No se pudo guardar la categoría. Revisa los datos e intenta de nuevo.');
        this.saving.set(false);
      },
    });
  }
}
