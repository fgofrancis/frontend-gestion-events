export interface SpeakerRequestDto {
  name: string;
  email: string;
  bio?: string;
}

export interface SpeakerResponseDto {
  id: number;
  name: string;
  email: string;
  bio?: string;
}
