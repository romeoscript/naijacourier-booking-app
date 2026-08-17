import { useState, type SubmitEventHandler } from 'react'
import type { DeliveryDraft, DeliveryPlan, IsoDate } from '../../domain/booking'
import { CITIES, type City } from '../../domain/cities'
import { formatNaira } from '../../domain/format'
import {
  calculateDeliveryFee,
  DELIVERY_SPEEDS,
  PACKAGE_TYPES,
  WEIGHT_BANDS,
} from '../../domain/pricing'
import { parseDeliveryDraft, type FieldErrors } from '../../domain/validation'
import { Button } from '../Button'
import { Card } from '../Card'
import { FormGrid } from '../FormGrid'
import { SelectField, type SelectOption } from '../fields/SelectField'
import { TextField } from '../fields/TextField'
import styles from './DeliveryStep.module.css'

const asOptions = <TValue extends string>(values: readonly TValue[]): SelectOption<TValue>[] =>
  values.map((value) => ({ value, label: value }))

const CITY_OPTIONS: readonly SelectOption<City | ''>[] = [
  { value: '', label: 'Select city' },
  ...asOptions(CITIES),
]
const PACKAGE_TYPE_OPTIONS = asOptions(PACKAGE_TYPES)
const WEIGHT_OPTIONS = asOptions(WEIGHT_BANDS)
const SPEED_OPTIONS = asOptions(DELIVERY_SPEEDS)

interface DeliveryStepProps {
  draft: DeliveryDraft
  earliestPickupDate: IsoDate
  onChange: (patch: Partial<DeliveryDraft>) => void
  onContinue: (plan: DeliveryPlan) => void
}

export function DeliveryStep({
  draft,
  earliestPickupDate,
  onChange,
  onContinue,
}: DeliveryStepProps) {
  const [errors, setErrors] = useState<FieldErrors<DeliveryDraft> | null>(null)
  const { from, to } = draft
  const quotedFee =
    from && to
      ? calculateDeliveryFee({
          from,
          to,
          packageType: draft.packageType,
          weight: draft.weight,
          speed: draft.speed,
        })
      : null

  const applyPatch = (patch: Partial<DeliveryDraft>) => {
    onChange(patch)

    if (errors === null) return
    const result = parseDeliveryDraft({ ...draft, ...patch }, earliestPickupDate)
    setErrors(result.ok ? {} : result.errors)
  }

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    const result = parseDeliveryDraft(draft, earliestPickupDate)
    setErrors(result.ok ? {} : result.errors)

    if (result.ok) {
      onContinue(result.value)
    }
  }

  return (
    <Card>
      <span className="eyebrow">STEP 1</span>
      <h2>Where should we deliver?</h2>
      <form onSubmit={handleSubmit} noValidate>
        <FormGrid>
          <SelectField
            label="Pickup city"
            value={from}
            options={CITY_OPTIONS}
            error={errors?.from}
            onValueChange={(value) => {
              applyPatch({ from: value })
            }}
          />
          <SelectField
            label="Delivery city"
            value={to}
            options={CITY_OPTIONS}
            error={errors?.to}
            onValueChange={(value) => {
              applyPatch({ to: value })
            }}
          />
          <TextField
            label="Pickup date"
            type="date"
            value={draft.pickupDate}
            min={earliestPickupDate}
            error={errors?.pickupDate}
            onChange={(event) => {
              applyPatch({ pickupDate: event.target.value })
            }}
          />
          <SelectField
            label="Package type"
            value={draft.packageType}
            options={PACKAGE_TYPE_OPTIONS}
            onValueChange={(value) => {
              applyPatch({ packageType: value })
            }}
          />
          <SelectField
            label="Weight"
            value={draft.weight}
            options={WEIGHT_OPTIONS}
            onValueChange={(value) => {
              applyPatch({ weight: value })
            }}
          />
          <SelectField
            label="Delivery speed"
            value={draft.speed}
            options={SPEED_OPTIONS}
            onValueChange={(value) => {
              applyPatch({ speed: value })
            }}
          />
        </FormGrid>

        <p className={styles.quote}>
          <span>Estimated delivery fee</span>
          {quotedFee === null ? (
            <span className={styles.amountPending}>Select both cities</span>
          ) : (
            <strong className={styles.amount}>{formatNaira(quotedFee)}</strong>
          )}
        </p>

        <Button type="submit">Continue to sender &amp; receiver →</Button>
      </form>
    </Card>
  )
}
