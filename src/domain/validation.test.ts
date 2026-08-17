import { describe, expect, it } from 'vitest'
import { createDeliveryDraft, createDetailsDraft } from './booking'
import { parseDeliveryDraft, parseDetailsDraft } from './validation'

const TODAY = '2026-08-17'

const validDeliveryDraft = {
  ...createDeliveryDraft(),
  from: 'Lagos',
  to: 'Abuja',
  pickupDate: TODAY,
} as const

const validDetailsDraft = {
  ...createDetailsDraft(),
  sender: {
    name: 'Ada Obi',
    phone: '08012345678',
    address: '14 Awolowo Road, Ikoyi',
    landmark: ' Near the mall ',
  },
  receiver: {
    name: 'Chidi Eze',
    phone: '+2349087654321',
    address: '3 Gana Street, Maitama',
    landmark: '',
  },
  contents: 'Documents',
  declaredValue: '25000',
  hazardConfirmed: true,
}

describe('parseDeliveryDraft', () => {
  it('accepts a complete draft', () => {
    const result = parseDeliveryDraft(validDeliveryDraft, TODAY)

    expect(result).toEqual({ ok: true, value: validDeliveryDraft })
  })

  it('reports every missing field at once', () => {
    const result = parseDeliveryDraft(createDeliveryDraft(), TODAY)

    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(Object.keys(result.errors)).toEqual(['from', 'to', 'pickupDate'])
  })

  it('rejects a delivery city that matches the pickup city', () => {
    const result = parseDeliveryDraft({ ...validDeliveryDraft, to: 'Lagos' }, TODAY)

    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.errors.to).toMatch(/must be different/)
  })

  it('rejects a pickup date in the past', () => {
    const result = parseDeliveryDraft({ ...validDeliveryDraft, pickupDate: '2026-08-16' }, TODAY)

    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.errors.pickupDate).toMatch(/cannot be in the past/)
  })
})

describe('parseDetailsDraft', () => {
  it('normalises phone numbers and trims free text', () => {
    const result = parseDetailsDraft(validDetailsDraft)

    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.value.sender.phone).toBe('08012345678')
    expect(result.value.receiver.phone).toBe('09087654321')
    expect(result.value.sender.landmark).toBe('Near the mall')
    expect(result.value.declaredValueNaira).toBe(25_000)
  })

  it('rejects a phone number that is not a Nigerian mobile', () => {
    const result = parseDetailsDraft({
      ...validDetailsDraft,
      receiver: { ...validDetailsDraft.receiver, phone: '0601234567' },
    })

    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.errors.receiver?.phone).toBeDefined()
    expect(result.errors.sender).toBeUndefined()
  })

  it('rejects a non-positive declared value', () => {
    const result = parseDetailsDraft({ ...validDetailsDraft, declaredValue: '0' })

    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.errors.declaredValue).toBeDefined()
  })

  it('requires the prohibited-items confirmation', () => {
    const result = parseDetailsDraft({ ...validDetailsDraft, hazardConfirmed: false })

    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.errors.hazardConfirmed).toBeDefined()
  })
})
