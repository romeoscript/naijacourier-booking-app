import { useEffect, useRef, type ReactElement } from 'react'
import { AppHeader } from './components/AppHeader'
import { Hero } from './components/Hero'
import { StepIndicator } from './components/StepIndicator'
import { ConfirmationStep } from './components/steps/ConfirmationStep'
import { DeliveryStep } from './components/steps/DeliveryStep'
import { DetailsStep } from './components/steps/DetailsStep'
import { PaymentStep } from './components/steps/PaymentStep'
import { todayIsoDate } from './domain/format'
import { calculateDeliveryFee } from './domain/pricing'
import { useBookingFlow } from './hooks/useBookingFlow'
import styles from './App.module.css'

export function App() {
  const {
    state,
    changeDeliveryDraft,
    confirmDelivery,
    changeDetailsDraft,
    confirmDetails,
    completePayment,
    stepBack,
    reset,
  } = useBookingFlow()

  const stepRegionRef = useRef<HTMLDivElement>(null)
  const hasRenderedRef = useRef(false)

  useEffect(() => {
    if (!hasRenderedRef.current) {
      hasRenderedRef.current = true
      return
    }

    stepRegionRef.current?.focus()
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }, [state.step])

  const renderStep = (): ReactElement => {
    switch (state.step) {
      case 'delivery':
        return (
          <DeliveryStep
            draft={state.deliveryDraft}
            earliestPickupDate={todayIsoDate()}
            onChange={changeDeliveryDraft}
            onContinue={confirmDelivery}
          />
        )
      case 'details':
        return (
          <DetailsStep
            draft={state.detailsDraft}
            onChange={changeDetailsDraft}
            onBack={stepBack}
            onContinue={confirmDetails}
          />
        )
      case 'payment':
        return (
          <PaymentStep
            plan={state.plan}
            details={state.details}
            feeNaira={calculateDeliveryFee(state.plan)}
            onBack={stepBack}
            onPaid={completePayment}
          />
        )
      case 'confirmation':
        return (
          <ConfirmationStep
            plan={state.plan}
            details={state.details}
            confirmation={state.confirmation}
            onBookAnother={reset}
          />
        )
    }
  }

  return (
    <>
      <AppHeader />
      <main className={styles.main}>
        <Hero />
        {state.step !== 'confirmation' && <StepIndicator currentStep={state.step} />}
        <div ref={stepRegionRef} tabIndex={-1} className={styles.stepRegion}>
          {renderStep()}
        </div>
      </main>
      <footer className={styles.footer}>© {new Date().getFullYear()} NaijaCourier</footer>
    </>
  )
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
