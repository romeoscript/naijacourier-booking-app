import type { ReactNode } from 'react'
import { cx } from '../utils/cx'
import styles from './Card.module.css'

interface CardProps {
  children: ReactNode
  centered?: boolean
}

export function Card({ children, centered = false }: CardProps) {
  return <section className={cx(styles.card, centered && styles.centered)}>{children}</section>
}
