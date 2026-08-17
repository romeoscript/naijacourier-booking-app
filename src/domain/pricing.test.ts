import { describe, expect, it } from 'vitest'
import { calculateDeliveryFee, type DeliveryFeeInput } from './pricing'

const cheapestBooking: DeliveryFeeInput = {
  from: 'Lagos',
  to: 'Ibadan',
  packageType: 'Documents',
  weight: 'Up to 1 kg',
  speed: 'Standard',
}

describe('calculateDeliveryFee', () => {
  it('charges the listed route fare for a standard document', () => {
    expect(calculateDeliveryFee(cheapestBooking)).toBe(5_000)
  })

  it('prices a route the same in both directions', () => {
    expect(calculateDeliveryFee({ ...cheapestBooking, from: 'Ibadan', to: 'Lagos' })).toBe(
      calculateDeliveryFee(cheapestBooking),
    )
  })

  it('falls back to a flat fare for routes with no listed price', () => {
    expect(calculateDeliveryFee({ ...cheapestBooking, from: 'Calabar', to: 'Asaba' })).toBe(8_000)
  })

  it('compounds the package surcharge with the weight and speed multipliers', () => {
    expect(
      calculateDeliveryFee({
        from: 'Lagos',
        to: 'Abuja',
        packageType: 'Medium package',
        weight: '5–10 kg',
        speed: 'Express',
      }),
    ).toBe(27_600)
  })
})
