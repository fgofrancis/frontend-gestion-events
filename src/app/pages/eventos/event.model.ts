import { SpeakerResponseDto } from '../ponentes/speaker.model';

export interface EventRequestDto {
  name: string;
  date: string; // formato ISO 'YYYY-MM-DD'
  location: string;
  categoryId: number | null;
  speakersId: number[];
}

export interface EventResponseDto {
  id: number;
  name: string;
  date: string;
  location: string;
  categoryId: number;
  categoryName: string;
  speakerDtos: SpeakerResponseDto[];
}

export interface PageEventResponseDto {
  totalPages: number;
  totalElements: number;
  size: number;
  content: EventResponseDto[];
  number: number; // página actual (0-indexed)
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface EventFilters {
  name?: string;
  location?: string;
  dateFrom?: string;
  dateTo?: string;
  page: number;
  size: number;
}
