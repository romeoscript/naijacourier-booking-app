import { useState, type SubmitEventHandler } from 'react'
import type { BookingDetails, DetailsDraft } from '../../domain/booking'
import { parseDetailsDraft, type DetailsErrors } from '../../domain/validation'
import { Button } from '../Button'
import { Card } from '../Card'
import { FormGrid } from '../FormGrid'
import { FormSection } from '../FormSection'
import { CheckboxField } from '../fields/CheckboxField'
import { TextField } from '../fields/TextField'
import { PartyFieldset } from './PartyFieldset'
import styles from './DetailsStep.module.css'

interface DetailsStepProps {
  draft: DetailsDraft
  onChange: (patch: Partial<DetailsDraft>) => void
  onBack: () => void
  onContinue: (details: BookingDetails) => void
}

export function DetailsStep({ draft, onChange, onBack, onContinue }: DetailsStepProps) {
  const [errors, setErrors] = useState<DetailsErrors | null>(null)

  const applyPatch = (patch: Partial<DetailsDraft>) => {
    onChange(patch)

    if (errors === null) return
    const result = parseDetailsDraft({ ...draft, ...patch })
    setErrors(result.ok ? {} : result.errors)
  }

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    const result = parseDetailsDraft(draft)
    setErrors(result.ok ? {} : result.errors)

    if (result.ok) {
      onContinue(result.value)
    }
  }

  return (
    <Card>
      <span className="eyebrow">STEP 2</span>
      <h2>Sender &amp; receiver details</h2>
      <form onSubmit={handleSubmit} noValidate>
        <PartyFieldset
          title="Sender"
          addressLabel="Pickup address"
          values={draft.sender}
          errors={errors?.sender}
          onChange={(patch) => {
            applyPatch({ sender: { ...draft.sender, ...patch } })
          }}
        />
        <PartyFieldset
          title="Receiver"
          addressLabel="Delivery address"
          values={draft.receiver}
          errors={errors?.receiver}
          onChange={(patch) => {
            applyPatch({ receiver: { ...draft.receiver, ...patch } })
          }}
        />

        <FormSection title="Package information">
          <FormGrid>
            <TextField
              label="What's inside?"
              placeholder="e.g. clothes, documents"
              value={draft.contents}
              error={errors?.contents}
              onChange={(event) => {
                applyPatch({ contents: event.target.value })
              }}
            />
            <TextField
              label="Declared value (₦)"
              type="number"
              inputMode="numeric"
              min={1}
              value={draft.declaredValue}
              error={errors?.declaredValue}
              onChange={(event) => {
                applyPatch({ declaredValue: event.target.value })
              }}
            />
          </FormGrid>
          <CheckboxField
            label="I confirm this package contains no prohibited or dangerous items."
            checked={draft.hazardConfirmed}
            error={errors?.hazardConfirmed}
            onCheckedChange={(hazardConfirmed) => {
              applyPatch({ hazardConfirmed })
            }}
          />
        </FormSection>

        <div className={styles.actions}>
          <Button variant="secondary" onClick={onBack}>
            ← Back
          </Button>
          <Button type="submit">Continue to payment →</Button>
        </div>
      </form>
    </Card>
  )
}
