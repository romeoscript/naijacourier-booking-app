import { Fragment } from 'react'
import type { BookingStep } from '../hooks/useBookingFlow'
import styles from './StepIndicator.module.css'

const VISIBLE_STEPS = [
  { id: 'delivery', label: 'Delivery' },
  { id: 'details', label: 'Details' },
  { id: 'payment', label: 'Payment' },
] as const satisfies readonly { id: BookingStep; label: string }[]

export function StepIndicator({ currentStep }: { currentStep: BookingStep }) {
  const currentIndex = VISIBLE_STEPS.findIndex((step) => step.id === currentStep)

  return (
    <nav aria-label="Booking progress">
      <ol className={styles.steps}>
        {VISIBLE_STEPS.map((step, index) => (
          <Fragment key={step.id}>
            {index > 0 && (
              <li className={styles.separator} aria-hidden>
                —
              </li>
            )}
            <li
              className={index <= currentIndex ? styles.reached : undefined}
              aria-current={index === currentIndex ? 'step' : undefined}
            >
              {index + 1} · {step.label}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  )
}
