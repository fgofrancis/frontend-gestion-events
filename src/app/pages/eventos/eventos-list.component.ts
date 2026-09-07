import { Component, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { EventService } from './event.service';
import { EventFilters, EventResponseDto, PageEventResponseDto } from './event.model';

const PAGE_SIZE = 10;

@Component({
  selector: 'app-eventos-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, DatePipe],
  templateUrl: './eventos-list.component.html',
  styleUrls: ['./eventos-list.component.scss'],
})
export class EventosListComponent {
  private readonly eventService = inject(EventService);
  private readonly fb = inject(FormBuilder);
 private readonly router = inject(Router); //change-up

  readonly page = signal<PageEventResponseDto | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly deletingId = signal<number | null>(null);
  private currentPage = 0;

  readonly filtersForm = this.fb.nonNullable.group({
    name: [''],
    location: [''],
    dateFrom: [''],
    dateTo: [''],
  });

  constructor() {
    this.fetchEvents();
  }

  applyFilters(): void {
    this.currentPage = 0;
    this.fetchEvents();
  }

  clearFilters(): void {
    this.filtersForm.reset({ name: '', location: '', dateFrom: '', dateTo: '' });
    this.currentPage = 0;
    this.fetchEvents();
  }

  goToPage(nextPage: number): void {
    this.currentPage = nextPage;
    this.fetchEvents();
  }

    openReport(): void {
    const raw = this.filtersForm.getRawValue();
    const queryParams: Record<string, string> = {};
    if (raw.name) queryParams['name'] = raw.name;
    if (raw.location) queryParams['location'] = raw.location;
    if (raw.dateFrom) queryParams['dateFrom'] = raw.dateFrom;
    if (raw.dateTo) queryParams['dateTo'] = raw.dateTo;

    this.router.navigate(['/eventos/reporte'], { queryParams });
  }
  
  remove(event: EventResponseDto): void {
    const confirmed = confirm(`¿Eliminar el evento "${event.name}"? Esta acción no se puede deshacer.`);
    if (!confirmed) return;

    this.deletingId.set(event.id);
    this.eventService.delete(event.id).subscribe({
      next: () => {
        this.deletingId.set(null);
        this.fetchEvents();
      },
      error: () => {
        this.error.set('No se pudo eliminar el evento.');
        this.deletingId.set(null);
      },
    });
  }

  private fetchEvents(): void {
    this.loading.set(true);
    this.error.set(null);

    const raw = this.filtersForm.getRawValue();
    const filters: EventFilters = {
      page: this.currentPage,
      size: PAGE_SIZE,
      name: raw.name || undefined,
      location: raw.location || undefined,
      dateFrom: raw.dateFrom || undefined,
      dateTo: raw.dateTo || undefined,
    };

    this.eventService.getAll(filters).subscribe({
      next: (result) => {
        this.page.set(result);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los eventos. Intenta de nuevo.');
        this.loading.set(false);
      },
    });
  }
}
