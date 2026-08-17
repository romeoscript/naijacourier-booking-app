import type { BookingDetails, Confirmation, DeliveryPlan } from '../../domain/booking'
import { formatNaira, formatPickupDate } from '../../domain/format'
import { Button } from '../Button'
import { Card } from '../Card'
import { CheckIcon } from '../icons'
import styles from './ConfirmationStep.module.css'

interface ConfirmationStepProps {
  plan: DeliveryPlan
  details: BookingDetails
  confirmation: Confirmation
  onBookAnother: () => void
}

export function ConfirmationStep({
  plan,
  details,
  confirmation,
  onBookAnother,
}: ConfirmationStepProps) {
  const ticketRows = [
    { label: 'Pickup', value: `${plan.from} — ${details.sender.address}` },
    { label: 'Delivery', value: `${plan.to} — ${details.receiver.address}` },
    { label: 'Pickup date', value: formatPickupDate(plan.pickupDate) },
    { label: 'Receiver', value: `${details.receiver.name} · ${details.receiver.phone}` },
    { label: 'Package', value: `${details.contents} (${plan.weight})` },
    { label: 'Fee paid', value: formatNaira(confirmation.feeNaira) },
  ]

  return (
    <Card centered>
      <div className={styles.success}>
        <CheckIcon className={styles.successIcon} />
      </div>
      <span className="eyebrow">DELIVERY BOOKED</span>
      <h2>Your courier has been booked!</h2>
      <p className={styles.reference}>
        Tracking reference: <b>{confirmation.trackingReference}</b>
      </p>

      <dl className={styles.ticket}>
        {ticketRows.map((row) => (
          <div key={row.label} className={styles.ticketRow}>
            <dt className={styles.ticketLabel}>{row.label}</dt>
            <dd className={styles.ticketValue}>{row.value}</dd>
          </div>
        ))}
      </dl>

      <Button onClick={onBookAnother}>Book another delivery</Button>
    </Card>
  )
}
