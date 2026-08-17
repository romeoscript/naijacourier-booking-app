import type { IsoDate } from './booking'

const nairaFormatter = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  maximumFractionDigits: 0,
})

const pickupDateFormatter = new Intl.DateTimeFormat('en-NG', {
  weekday: 'short',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

export function formatNaira(amount: number): string {
  return nairaFormatter.format(amount)
}

export function formatPickupDate(date: IsoDate): string {
  return pickupDateFormatter.format(parseIsoDate(date))
}

export function todayIsoDate(): IsoDate {
  return toIsoDate(new Date())
}

/** Parses at local midnight; `new Date('2026-08-17')` would parse as UTC and shift a day. */
function parseIsoDate(date: IsoDate): Date {
  return new Date(`${date}T00:00:00`)
}

function toIsoDate(date: Date): IsoDate {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${String(date.getFullYear())}-${month}-${day}`
}
