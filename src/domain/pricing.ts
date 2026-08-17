import type { City } from './cities'

export const PACKAGE_TYPES = [
  'Documents',
  'Small package',
  'Medium package',
  'Large package',
] as const

export const WEIGHT_BANDS = ['Up to 1 kg', '1–5 kg', '5–10 kg', '10–20 kg'] as const

export const DELIVERY_SPEEDS = ['Standard', 'Express'] as const

export type PackageType = (typeof PACKAGE_TYPES)[number]
export type WeightBand = (typeof WEIGHT_BANDS)[number]
export type DeliverySpeed = (typeof DELIVERY_SPEEDS)[number]

/**
 * Base fare in naira for a route, keyed by its two cities in alphabetical order
 * so each pair is priced identically in both directions.
 */
const ROUTE_FARES: Readonly<Record<string, number>> = {
  'Abuja|Lagos': 10_000,
  'Benin City|Lagos': 7_000,
  'Lagos|Port Harcourt': 10_000,
  'Ibadan|Lagos': 5_000,
  'Lagos|Warri': 8_000,
  'Abuja|Benin City': 9_000,
  'Abuja|Enugu': 7_000,
  'Enugu|Lagos': 9_000,
  'Lagos|Owerri': 9_500,
}

const UNLISTED_ROUTE_FARE = 8_000

const PACKAGE_TYPE_SURCHARGE: Readonly<Record<PackageType, number>> = {
  Documents: 0,
  'Small package': 500,
  'Medium package': 1_500,
  'Large package': 3_000,
}

const WEIGHT_MULTIPLIER: Readonly<Record<WeightBand, number>> = {
  'Up to 1 kg': 1,
  '1–5 kg': 1.2,
  '5–10 kg': 1.5,
  '10–20 kg': 2,
}

const SPEED_MULTIPLIER: Readonly<Record<DeliverySpeed, number>> = {
  Standard: 1,
  Express: 1.6,
}

const FARE_ROUNDING_NAIRA = 100

export interface DeliveryFeeInput {
  from: City
  to: City
  packageType: PackageType
  weight: WeightBand
  speed: DeliverySpeed
}

export function calculateDeliveryFee({
  from,
  to,
  packageType,
  weight,
  speed,
}: DeliveryFeeInput): number {
  const fare = ROUTE_FARES[routeKey(from, to)] ?? UNLISTED_ROUTE_FARE
  const beforeMultipliers = fare + PACKAGE_TYPE_SURCHARGE[packageType]
  const total = beforeMultipliers * WEIGHT_MULTIPLIER[weight] * SPEED_MULTIPLIER[speed]

  return Math.round(total / FARE_ROUNDING_NAIRA) * FARE_ROUNDING_NAIRA
}

function routeKey(from: City, to: City): string {
  return [from, to].sort().join('|')
}
