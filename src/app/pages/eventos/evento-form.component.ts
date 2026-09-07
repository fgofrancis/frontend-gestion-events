import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { EventService } from './event.service';
import { CategoryService } from '../categorias/category.service';
import { SpeakerService } from '../ponentes/speaker.service';
import { CategoryDto } from '../categorias/category.model';
import { SpeakerResponseDto } from '../ponentes/speaker.model';

@Component({
  selector: 'app-evento-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './evento-form.component.html',
  styleUrls: ['./evento-form.component.scss'],
})
export class EventoFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly eventService = inject(EventService);
  private readonly categoryService = inject(CategoryService);
  private readonly speakerService = inject(SpeakerService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly eventId = this.route.snapshot.paramMap.get('id');
  readonly isEditMode = !!this.eventId;

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

  readonly categories = signal<CategoryDto[]>([]);
  readonly speakers = signal<SpeakerResponseDto[]>([]);
  readonly selectedSpeakerIds = signal<Set<number>>(new Set());

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(150)]],
    date: ['', Validators.required],
    location: ['', Validators.required],
    categoryId: this.fb.control<number | null>(null, Validators.required),
  });

  constructor() {
    const categories$ = this.categoryService.getAll();
    const speakers$ = this.speakerService.getAll();
    const event$ = this.isEditMode ? this.eventService.getById(Number(this.eventId)) : null;

    forkJoin({
      categories: categories$,
      speakers: speakers$,
      event: event$ ?? [null],
    }).subscribe({
      next: ({ categories, speakers, event }) => {
        this.categories.set(categories);
        this.speakers.set(speakers);

        if (event) {
          this.form.patchValue({
            name: event.name,
            date: event.date,
            location: event.location,
            categoryId: event.categoryId,
          });
          this.selectedSpeakerIds.set(new Set(event.speakerDtos.map((s) => s.id)));
        }

        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los datos necesarios para el formulario.');
        this.loading.set(false);
      },
    });
  }

  toggleSpeaker(id: number): void {
    const current = new Set(this.selectedSpeakerIds());
    if (current.has(id)) {
      current.delete(id);
    } else {
      current.add(id);
    }
    this.selectedSpeakerIds.set(current);
  }

  isSpeakerSelected(id: number): boolean {
    return this.selectedSpeakerIds().has(id);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.error.set(null);
    const raw = this.form.getRawValue();

    const dto = {
      name: raw.name,
      date: raw.date,
      location: raw.location,
      categoryId: raw.categoryId!,
      speakersId: Array.from(this.selectedSpeakerIds()),
    };

    const request$ = this.isEditMode
      ? this.eventService.update(Number(this.eventId), dto)
      : this.eventService.create(dto);

    request$.subscribe({
      next: () => this.router.navigate(['/eventos']),
      error: () => {
        this.error.set('No se pudo guardar el evento. Revisa los datos e intenta de nuevo.');
        this.saving.set(false);
      },
    });
  }
}
