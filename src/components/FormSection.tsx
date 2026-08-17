import { useId, type ReactNode } from 'react'
import styles from './FormSection.module.css'

interface FormSectionProps {
  title: string
  children: ReactNode
}

export function FormSection({ title, children }: FormSectionProps) {
  const titleId = useId()

  return (
    <div className={styles.section} role="group" aria-labelledby={titleId}>
      <h3 id={titleId} className={styles.title}>
        {title}
      </h3>
      {children}
    </div>
  )
}
