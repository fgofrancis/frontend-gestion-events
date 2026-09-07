import { Component, inject, signal } from '@angular/core';
import { CommonModule, DatePipe, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, expand, reduce } from 'rxjs';
import { EventService } from './event.service';
import { EventResponseDto, PageEventResponseDto } from './event.model';

const REPORT_PAGE_SIZE = 100;

@Component({
  selector: 'app-eventos-reporte',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './eventos-reporte.component.html',
  styleUrls: ['./eventos-reporte.component.scss'],
})
export class EventosReporteComponent {
  private readonly eventService = inject(EventService);
  private readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);

  readonly events = signal<EventResponseDto[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly generatedAt = new Date();

  readonly filters = {
    name: this.route.snapshot.queryParamMap.get('name') || '',
    location: this.route.snapshot.queryParamMap.get('location') || '',
    dateFrom: this.route.snapshot.queryParamMap.get('dateFrom') || '',
    dateTo: this.route.snapshot.queryParamMap.get('dateTo') || '',
  };

  readonly hasFilters =
    !!this.filters.name || !!this.filters.location || !!this.filters.dateFrom || !!this.filters.dateTo;

  constructor() {
    this.fetchAllMatching();
  }

  goBack(): void {
    this.location.back();
  }

  print(): void {
    window.print();
  }

  speakerNames(event: EventResponseDto): string {
    return event.speakerDtos.map((s) => s.name).join(', ');
  }

  private fetchAllMatching(): void {
    this.loading.set(true);
    this.error.set(null);

    const baseFilters = {
      name: this.filters.name || undefined,
      location: this.filters.location || undefined,
      dateFrom: this.filters.dateFrom || undefined,
      dateTo: this.filters.dateTo || undefined,
    };

    this.eventService
      .getAll({ ...baseFilters, page: 0, size: REPORT_PAGE_SIZE })
      .pipe(
        expand((page: PageEventResponseDto) =>
          page.last
            ? EMPTY
            : this.eventService.getAll({ ...baseFilters, page: page.number + 1, size: REPORT_PAGE_SIZE }),
        ),
        reduce((acc: EventResponseDto[], page: PageEventResponseDto) => [...acc, ...page.content], []),
      )
      .subscribe({
        next: (events) => {
          this.events.set(events);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('No se pudo generar el reporte. Intenta de nuevo.');
          this.loading.set(false);
        },
      });
  }
}
