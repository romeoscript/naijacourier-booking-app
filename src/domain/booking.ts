import type { City } from './cities'
import type { DeliverySpeed, PackageType, WeightBand } from './pricing'

/** A `yyyy-mm-dd` calendar date, as produced by `<input type="date">`. */
export type IsoDate = string

/** Step 1 as the user is filling it in — cities may still be unchosen. */
export interface DeliveryDraft {
  from: City | ''
  to: City | ''
  pickupDate: IsoDate
  packageType: PackageType
  weight: WeightBand
  speed: DeliverySpeed
}

/** Step 1 once validated: every field is present and the route is deliverable. */
export interface DeliveryPlan {
  from: City
  to: City
  pickupDate: IsoDate
  packageType: PackageType
  weight: WeightBand
  speed: DeliverySpeed
}

export interface PartyDraft {
  name: string
  phone: string
  address: string
  landmark: string
}

/** Step 2 as the user is filling it in — every field is raw input. */
export interface DetailsDraft {
  sender: PartyDraft
  receiver: PartyDraft
  contents: string
  declaredValue: string
  hazardConfirmed: boolean
}

export interface Party {
  name: string
  phone: string
  address: string
  landmark: string
}

/** Step 2 once validated: phones are normalised and the declared value is a number. */
export interface BookingDetails {
  sender: Party
  receiver: Party
  contents: string
  declaredValueNaira: number
}

export interface Confirmation {
  trackingReference: string
  feeNaira: number
}

export function createDeliveryDraft(): DeliveryDraft {
  return {
    from: '',
    to: '',
    pickupDate: '',
    packageType: 'Documents',
    weight: 'Up to 1 kg',
    speed: 'Standard',
  }
}

export function createDetailsDraft(): DetailsDraft {
  return {
    sender: createPartyDraft(),
    receiver: createPartyDraft(),
    contents: '',
    declaredValue: '',
    hazardConfirmed: false,
  }
}

function createPartyDraft(): PartyDraft {
  return { name: '', phone: '', address: '', landmark: '' }
}
