export type Login = {
  username: string;
  password: string;
};

export type SignUp = {
  username: string;
  email: string;
  full_name: string;
  password: string;
};

export type Institute = {
  id: string;
  X: number; // Longitude
  Y: number; // Latitude
  OBJECTID: number;
  ID: number;
  TRAEGER: string;
  BEZEICHNUNG: string;
  KURZBEZEICHNUNG: string;
  STRASSE: string;
  STRSCHL: number;
  HAUSBEZ: number;
  PLZ: number;
  ORT: string;
  HORT: number;
  KITA: number;
  TELEFON: string;
  EMAIL: string;
  BARRIEREFREI: number;
  INTEGRATIV: number;
  category: string;
};

export type UserDetails = {
  full_name?: string;
  address?: string;
  password?: string;
  username?: string;
  email?: string;
  favourite_facility?: string;
  house_number?: string;
  plz?: string;
  ort?: string;
};

export type Bounds = {
  lat: number;
  lng: number;
} | null;
