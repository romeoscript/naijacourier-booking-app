import type { PartyDraft } from '../../domain/booking'
import type { FieldErrors } from '../../domain/validation'
import { FormGrid } from '../FormGrid'
import { FormSection } from '../FormSection'
import { TextField } from '../fields/TextField'

interface PartyFieldsetProps {
  title: string
  addressLabel: string
  values: PartyDraft
  errors: FieldErrors<PartyDraft> | undefined
  onChange: (patch: Partial<PartyDraft>) => void
}

export function PartyFieldset({
  title,
  addressLabel,
  values,
  errors,
  onChange,
}: PartyFieldsetProps) {
  return (
    <FormSection title={title}>
      <FormGrid>
        <TextField
          label="Full name"
          autoComplete="name"
          value={values.name}
          error={errors?.name}
          onChange={(event) => {
            onChange({ name: event.target.value })
          }}
        />
        <TextField
          label="Phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="08012345678"
          value={values.phone}
          error={errors?.phone}
          onChange={(event) => {
            onChange({ phone: event.target.value })
          }}
        />
        <TextField
          label={addressLabel}
          autoComplete="street-address"
          value={values.address}
          error={errors?.address}
          onChange={(event) => {
            onChange({ address: event.target.value })
          }}
        />
        <TextField
          label="Landmark"
          value={values.landmark}
          error={errors?.landmark}
          onChange={(event) => {
            onChange({ landmark: event.target.value })
          }}
        />
      </FormGrid>
    </FormSection>
  )
}
