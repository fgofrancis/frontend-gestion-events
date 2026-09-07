import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SpeakerService } from './speaker.service';

@Component({
  selector: 'app-ponente-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './ponente-form.component.html',
  styleUrls: ['./ponente-form.component.scss'],
})
export class PonenteFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly speakerService = inject(SpeakerService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly speakerId = this.route.snapshot.paramMap.get('id');
  readonly isEditMode = !!this.speakerId;

  readonly loading = signal(this.isEditMode);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
    bio: ['', [Validators.maxLength(500)]],
  });

  constructor() {
    if (this.isEditMode) {
      this.speakerService.getById(Number(this.speakerId)).subscribe({
        next: (speaker) => {
          this.form.patchValue({
            name: speaker.name,
            email: speaker.email,
            bio: speaker.bio ?? '',
          });
          this.loading.set(false);
        },
        error: () => {
          this.error.set('No se pudo cargar el ponente solicitado.');
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
      ? this.speakerService.update(Number(this.speakerId), dto)
      : this.speakerService.create(dto);

    request$.subscribe({
      next: () => this.router.navigate(['/ponentes']),
      error: () => {
        this.error.set('No se pudo guardar el ponente. Revisa los datos e intenta de nuevo.');
        this.saving.set(false);
      },
    });
  }
}
