import type { ReactNode } from 'react'
import styles from './FormGrid.module.css'

export function FormGrid({ children }: { children: ReactNode }) {
  return <div className={styles.grid}>{children}</div>
}
