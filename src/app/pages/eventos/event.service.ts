import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventFilters, EventRequestDto, EventResponseDto, PageEventResponseDto } from './event.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EventService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/events`;
  //private readonly baseUrl = '/api/v1/events';

  getAll(filters: EventFilters): Observable<PageEventResponseDto> {
    let params = new HttpParams()
      .set('page', filters.page)
      .set('size', filters.size);

    if (filters.name) params = params.set('name', filters.name);
    if (filters.location) params = params.set('location', filters.location);
    if (filters.dateFrom) params = params.set('dateFrom', filters.dateFrom);
    if (filters.dateTo) params = params.set('dateTo', filters.dateTo);

    return this.http.get<PageEventResponseDto>(this.baseUrl, { params });
  }

  getById(id: number): Observable<EventResponseDto> {
    return this.http.get<EventResponseDto>(`${this.baseUrl}/${id}`);
  }

  create(dto: EventRequestDto): Observable<EventResponseDto> {
    return this.http.post<EventResponseDto>(this.baseUrl, dto);
  }

  update(id: number, dto: EventRequestDto): Observable<EventResponseDto> {
    return this.http.put<EventResponseDto>(`${this.baseUrl}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
