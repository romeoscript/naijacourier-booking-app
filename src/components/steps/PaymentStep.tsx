import { useState } from 'react'
import type { BookingDetails, Confirmation, DeliveryPlan } from '../../domain/booking'
import { formatNaira, formatPickupDate } from '../../domain/format'
import { submitBooking } from '../../services/bookingService'
import { Button } from '../Button'
import { Card } from '../Card'
import { CardIcon } from '../icons'
import styles from './PaymentStep.module.css'

type PaymentStatus = { state: 'idle' } | { state: 'submitting' } | { state: 'failed' }

const PAYMENT_ERROR_MESSAGE = 'We could not complete your booking. Please try again.'

interface PaymentStepProps {
  plan: DeliveryPlan
  details: BookingDetails
  feeNaira: number
  onBack: () => void
  onPaid: (confirmation: Confirmation) => void
}

export function PaymentStep({ plan, details, feeNaira, onBack, onPaid }: PaymentStepProps) {
  const [status, setStatus] = useState<PaymentStatus>({ state: 'idle' })
  const isSubmitting = status.state === 'submitting'

  const summaryRows = [
    { label: 'Route', value: `${plan.from} → ${plan.to}` },
    { label: 'Pickup date', value: formatPickupDate(plan.pickupDate) },
    { label: 'Package', value: `${plan.packageType} · ${plan.weight}` },
    { label: 'Service', value: plan.speed },
    { label: 'Sender', value: details.sender.name },
    { label: 'Receiver', value: details.receiver.name },
    { label: 'Contents', value: details.contents },
  ]

  const handlePay = async () => {
    if (isSubmitting) return
    setStatus({ state: 'submitting' })

    try {
      onPaid(await submitBooking({ plan, details, feeNaira }))
    } catch (error) {
      console.error('Booking submission failed', error)
      setStatus({ state: 'failed' })
    }
  }

  return (
    <Card>
      <span className="eyebrow">STEP 3</span>
      <h2>Review &amp; pay</h2>

      <div className={styles.checkout}>
        <div>
          <dl className={styles.summary}>
            {summaryRows.map((row) => (
              <div key={row.label} className={styles.summaryRow}>
                <dt className={styles.summaryLabel}>{row.label}</dt>
                <dd className={styles.summaryValue}>{row.value}</dd>
              </div>
            ))}
          </dl>

          <div className={styles.payment}>
            <h3>Payment method</h3>
            <div className={styles.method}>
              <span className={styles.methodName}>
                <CardIcon className={styles.methodIcon} />
                Paystack
              </span>
              <small className={styles.methodHint}>Card, bank transfer, USSD and more</small>
            </div>

            <Button
              className={styles.payButton}
              disabled={isSubmitting}
              onClick={() => {
                void handlePay()
              }}
            >
              {isSubmitting ? 'Processing…' : `Pay ${formatNaira(feeNaira)}`}
            </Button>

            {status.state === 'failed' && (
              <p className={styles.error} role="alert">
                {PAYMENT_ERROR_MESSAGE}
              </p>
            )}

            <small className={styles.disclaimer}>
              Demo payment button — connect your Paystack public key and backend before going
              live.
            </small>
          </div>
        </div>

        <aside className={styles.total}>
          <small className={styles.totalLabel}>Delivery fee</small>
          <strong className={styles.totalAmount}>{formatNaira(feeNaira)}</strong>
        </aside>
      </div>

      <Button variant="secondary" onClick={onBack} disabled={isSubmitting}>
        ← Back
      </Button>
    </Card>
  )
}
