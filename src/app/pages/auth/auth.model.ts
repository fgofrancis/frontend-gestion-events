export interface LoginDto {
  username: string;
  password: string;
}

export interface RegisterDto {
  username: string;
  password: string;
  email: string;
  name: string;
  roles?: string[];
}

export interface JwtAuthResponseDto {
  accessToken: string;
  tokenType: string;
}

export interface JwtPayload {
  sub: string;
  roles?: string[];
  exp: number;
  iat?: number;
}
