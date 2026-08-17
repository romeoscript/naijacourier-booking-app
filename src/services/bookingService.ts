import type { BookingDetails, Confirmation, DeliveryPlan } from '../domain/booking'

export interface BookingRequest {
  plan: DeliveryPlan
  details: BookingDetails
  feeNaira: number
}

/**
 * Demo checkout: the booking is confirmed client-side and nothing is charged.
 *
 * This is the single seam to replace for production — initialise the Paystack
 * transaction here, verify it server-side, persist the booking, and return the
 * tracking reference the backend issued. Callers already handle rejection.
 */
export async function submitBooking(request: BookingRequest): Promise<Confirmation> {
  return Promise.resolve({
    trackingReference: generateTrackingReference(),
    feeNaira: request.feeNaira,
  })
}

function generateTrackingReference(): string {
  return `NC-${Date.now().toString().slice(-8)}`
}
