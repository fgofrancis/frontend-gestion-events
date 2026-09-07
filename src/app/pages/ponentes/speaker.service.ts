import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SpeakerRequestDto, SpeakerResponseDto } from './speaker.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SpeakerService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/speakers`;
  //private readonly baseUrl = '/api/v1/speakers';

  getAll(): Observable<SpeakerResponseDto[]> {
    return this.http.get<SpeakerResponseDto[]>(this.baseUrl);
  }

  getById(id: number): Observable<SpeakerResponseDto> {
    return this.http.get<SpeakerResponseDto>(`${this.baseUrl}/${id}`);
  }

  create(dto: SpeakerRequestDto): Observable<SpeakerResponseDto> {
    return this.http.post<SpeakerResponseDto>(this.baseUrl, dto);
  }

  update(id: number, dto: SpeakerRequestDto): Observable<SpeakerResponseDto> {
    return this.http.put<SpeakerResponseDto>(`${this.baseUrl}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
