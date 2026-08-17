import type {
  BookingDetails,
  DeliveryDraft,
  DeliveryPlan,
  DetailsDraft,
  IsoDate,
  Party,
  PartyDraft,
} from './booking'

export type FieldErrors<TDraft> = Partial<Record<keyof TDraft, string>>

export type ParseResult<TValue, TErrors> =
  | { ok: true; value: TValue }
  | { ok: false; errors: TErrors }

export interface DetailsErrors {
  sender?: FieldErrors<PartyDraft>
  receiver?: FieldErrors<PartyDraft>
  contents?: string
  declaredValue?: string
  hazardConfirmed?: string
}

const MIN_NAME_LENGTH = 2
const MIN_ADDRESS_LENGTH = 6
const MIN_CONTENTS_LENGTH = 3
const MAX_DECLARED_VALUE_NAIRA = 10_000_000

const PHONE_FORMAT_MESSAGE = 'Enter a valid Nigerian mobile number, e.g. 08012345678.'

/** Local `0XXXXXXXXXX` or international `+234XXXXXXXXXX`, with 7/8/9 network prefixes. */
const NIGERIAN_MOBILE_PATTERN = /^(?:\+?234|0)([789]\d{9})$/

export function parseDeliveryDraft(
  draft: DeliveryDraft,
  earliestPickupDate: IsoDate,
): ParseResult<DeliveryPlan, FieldErrors<DeliveryDraft>> {
  const { from, to, pickupDate } = draft
  const errors: FieldErrors<DeliveryDraft> = {}

  if (!from) {
    errors.from = 'Select a pickup city.'
  }

  if (!to) {
    errors.to = 'Select a delivery city.'
  } else if (to === from) {
    errors.to = 'Pickup and delivery cities must be different.'
  }

  if (!pickupDate) {
    errors.pickupDate = 'Choose a pickup date.'
  } else if (pickupDate < earliestPickupDate) {
    errors.pickupDate = 'Pickup date cannot be in the past.'
  }

  if (hasKeys(errors) || !from || !to || !pickupDate) {
    return { ok: false, errors }
  }

  return {
    ok: true,
    value: {
      from,
      to,
      pickupDate,
      packageType: draft.packageType,
      weight: draft.weight,
      speed: draft.speed,
    },
  }
}

export function parseDetailsDraft(
  draft: DetailsDraft,
): ParseResult<BookingDetails, DetailsErrors> {
  const errors: DetailsErrors = {}

  const sender = parsePartyDraft(draft.sender, { role: 'sender', addressLabel: 'pickup address' })
  if (!sender.ok) errors.sender = sender.errors

  const receiver = parsePartyDraft(draft.receiver, {
    role: 'receiver',
    addressLabel: 'delivery address',
  })
  if (!receiver.ok) errors.receiver = receiver.errors

  const contents = parseRequiredText(draft.contents, MIN_CONTENTS_LENGTH)
  if (contents === null) errors.contents = 'Describe what is inside the package.'

  const declaredValueNaira = parseDeclaredValue(draft.declaredValue)
  if (declaredValueNaira === null) {
    errors.declaredValue = `Enter a value between ₦1 and ₦${MAX_DECLARED_VALUE_NAIRA.toLocaleString('en-NG')}.`
  }

  if (!draft.hazardConfirmed) {
    errors.hazardConfirmed = 'Please confirm the package contains no prohibited items.'
  }

  if (
    hasKeys(errors) ||
    !sender.ok ||
    !receiver.ok ||
    contents === null ||
    declaredValueNaira === null
  ) {
    return { ok: false, errors }
  }

  return {
    ok: true,
    value: { sender: sender.value, receiver: receiver.value, contents, declaredValueNaira },
  }
}

interface PartyLabels {
  role: string
  addressLabel: string
}

function parsePartyDraft(
  draft: PartyDraft,
  { role, addressLabel }: PartyLabels,
): ParseResult<Party, FieldErrors<PartyDraft>> {
  const errors: FieldErrors<PartyDraft> = {}

  const name = parseRequiredText(draft.name, MIN_NAME_LENGTH)
  if (name === null) errors.name = `Enter the ${role}'s full name.`

  const phone = parseNigerianMobile(draft.phone)
  if (phone === null) errors.phone = PHONE_FORMAT_MESSAGE

  const address = parseRequiredText(draft.address, MIN_ADDRESS_LENGTH)
  if (address === null) errors.address = `Enter the full ${addressLabel}.`

  if (hasKeys(errors) || name === null || phone === null || address === null) {
    return { ok: false, errors }
  }

  return { ok: true, value: { name, phone, address, landmark: draft.landmark.trim() } }
}

function parseRequiredText(value: string, minLength: number): string | null {
  const trimmed = value.trim()

  return trimmed.length >= minLength ? trimmed : null
}

/** Returns the number in local `0XXXXXXXXXX` form so stored numbers are comparable. */
function parseNigerianMobile(value: string): string | null {
  const compact = value.replace(/[\s()-]/g, '')
  const subscriberNumber = NIGERIAN_MOBILE_PATTERN.exec(compact)?.[1]

  return subscriberNumber === undefined ? null : `0${subscriberNumber}`
}

function parseDeclaredValue(value: string): number | null {
  const trimmed = value.trim()
  if (trimmed === '') return null

  const amount = Number(trimmed)
  if (!Number.isFinite(amount) || amount <= 0 || amount > MAX_DECLARED_VALUE_NAIRA) {
    return null
  }

  return Math.round(amount)
}

function hasKeys(errors: object): boolean {
  return Object.keys(errors).length > 0
}
