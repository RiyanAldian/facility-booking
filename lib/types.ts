export type ID = string | number;

export interface User {
  id: ID;
  name: string;
  email: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface Facility {
  id: ID;
  name: string;
  status: "open" | "closed" | "maintenance";
  description?: string;
  capacity?: number;
}

export interface FacilityDetail extends Facility {}

export interface DailyAvailabilitySlot {
  slot: string; // e.g. "08:00-09:00"
  available: boolean;
}

export interface DailyAvailabilityResponse {
  date: string; // YYYY-MM-DD
  slots: DailyAvailabilitySlot[];
}

export interface updateProfile {
  name: string;
  email: string;
  currentPassword: string;
  newPassword: string;
}
