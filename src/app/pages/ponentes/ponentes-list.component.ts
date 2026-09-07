import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SpeakerService } from './speaker.service';
import { SpeakerResponseDto } from './speaker.model';

@Component({
  selector: 'app-ponentes-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './ponentes-list.component.html',
  styleUrls: ['./ponentes-list.component.scss'],
})
export class PonentesListComponent {
  private readonly speakerService = inject(SpeakerService);

  readonly speakers = signal<SpeakerResponseDto[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly deletingId = signal<number | null>(null);

  constructor() {
    this.fetchSpeakers();
  }

  fetchSpeakers(): void {
    this.loading.set(true);
    this.error.set(null);
    this.speakerService.getAll().subscribe({
      next: (data) => {
        this.speakers.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los ponentes. Intenta de nuevo.');
        this.loading.set(false);
      },
    });
  }

  remove(speaker: SpeakerResponseDto): void {
    const confirmed = confirm(`¿Eliminar a "${speaker.name}" de los ponentes? Esta acción no se puede deshacer.`);
    if (!confirmed) return;

    this.deletingId.set(speaker.id);
    this.speakerService.delete(speaker.id).subscribe({
      next: () => {
        this.speakers.update((list) => list.filter((s) => s.id !== speaker.id));
        this.deletingId.set(null);
      },
      error: () => {
        this.error.set('No se pudo eliminar el ponente.');
        this.deletingId.set(null);
      },
    });
  }

  initials(name: string): string {
    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('');
  }
}
