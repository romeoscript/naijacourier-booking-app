import { useMemo, useReducer } from 'react'
import {
  createDeliveryDraft,
  createDetailsDraft,
  type BookingDetails,
  type Confirmation,
  type DeliveryDraft,
  type DeliveryPlan,
  type DetailsDraft,
} from '../domain/booking'

export type BookingStep = BookingFlowState['step']

/**
 * The flow is a union rather than a bag of nullable fields so that, for example,
 * the payment step cannot be reached without a validated plan and details.
 */
export type BookingFlowState =
  | { step: 'delivery'; deliveryDraft: DeliveryDraft; detailsDraft: DetailsDraft }
  | {
      step: 'details'
      deliveryDraft: DeliveryDraft
      detailsDraft: DetailsDraft
      plan: DeliveryPlan
    }
  | {
      step: 'payment'
      deliveryDraft: DeliveryDraft
      detailsDraft: DetailsDraft
      plan: DeliveryPlan
      details: BookingDetails
    }
  | {
      step: 'confirmation'
      plan: DeliveryPlan
      details: BookingDetails
      confirmation: Confirmation
    }

type BookingFlowAction =
  | { type: 'deliveryDraftChanged'; patch: Partial<DeliveryDraft> }
  | { type: 'deliveryConfirmed'; plan: DeliveryPlan }
  | { type: 'detailsDraftChanged'; patch: Partial<DetailsDraft> }
  | { type: 'detailsConfirmed'; details: BookingDetails }
  | { type: 'paymentCompleted'; confirmation: Confirmation }
  | { type: 'steppedBack' }
  | { type: 'flowReset' }

export interface BookingFlow {
  state: BookingFlowState
  changeDeliveryDraft: (patch: Partial<DeliveryDraft>) => void
  confirmDelivery: (plan: DeliveryPlan) => void
  changeDetailsDraft: (patch: Partial<DetailsDraft>) => void
  confirmDetails: (details: BookingDetails) => void
  completePayment: (confirmation: Confirmation) => void
  stepBack: () => void
  reset: () => void
}

export function useBookingFlow(): BookingFlow {
  const [state, dispatch] = useReducer(bookingFlowReducer, undefined, createInitialState)

  const actions = useMemo(
    () => ({
      changeDeliveryDraft: (patch: Partial<DeliveryDraft>) => {
        dispatch({ type: 'deliveryDraftChanged', patch })
      },
      confirmDelivery: (plan: DeliveryPlan) => {
        dispatch({ type: 'deliveryConfirmed', plan })
      },
      changeDetailsDraft: (patch: Partial<DetailsDraft>) => {
        dispatch({ type: 'detailsDraftChanged', patch })
      },
      confirmDetails: (details: BookingDetails) => {
        dispatch({ type: 'detailsConfirmed', details })
      },
      completePayment: (confirmation: Confirmation) => {
        dispatch({ type: 'paymentCompleted', confirmation })
      },
      stepBack: () => {
        dispatch({ type: 'steppedBack' })
      },
      reset: () => {
        dispatch({ type: 'flowReset' })
      },
    }),
    [],
  )

  return { state, ...actions }
}

function createInitialState(): BookingFlowState {
  return {
    step: 'delivery',
    deliveryDraft: createDeliveryDraft(),
    detailsDraft: createDetailsDraft(),
  }
}

function bookingFlowReducer(
  state: BookingFlowState,
  action: BookingFlowAction,
): BookingFlowState {
  switch (action.type) {
    case 'deliveryDraftChanged':
      if (state.step !== 'delivery') return state
      return { ...state, deliveryDraft: { ...state.deliveryDraft, ...action.patch } }

    case 'deliveryConfirmed':
      if (state.step !== 'delivery') return state
      return { ...state, step: 'details', plan: action.plan }

    case 'detailsDraftChanged':
      if (state.step !== 'details') return state
      return { ...state, detailsDraft: { ...state.detailsDraft, ...action.patch } }

    case 'detailsConfirmed':
      if (state.step !== 'details') return state
      return { ...state, step: 'payment', details: action.details }

    case 'paymentCompleted':
      if (state.step !== 'payment') return state
      return {
        step: 'confirmation',
        plan: state.plan,
        details: state.details,
        confirmation: action.confirmation,
      }

    case 'steppedBack':
      return stepBackFrom(state)

    case 'flowReset':
      return createInitialState()
  }
}

function stepBackFrom(state: BookingFlowState): BookingFlowState {
  switch (state.step) {
    case 'details':
      return {
        step: 'delivery',
        deliveryDraft: state.deliveryDraft,
        detailsDraft: state.detailsDraft,
      }
    case 'payment':
      return {
        step: 'details',
        deliveryDraft: state.deliveryDraft,
        detailsDraft: state.detailsDraft,
        plan: state.plan,
      }
    default:
      return state
  }
}
