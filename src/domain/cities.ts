export const CITIES = [
  'Lagos',
  'Abuja',
  'Benin City',
  'Port Harcourt',
  'Ibadan',
  'Warri',
  'Enugu',
  'Asaba',
  'Calabar',
  'Owerri',
] as const

export type City = (typeof CITIES)[number]

export function isCity(value: string): value is City {
  return (CITIES as readonly string[]).includes(value)
}
