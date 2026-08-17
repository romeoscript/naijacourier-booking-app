import { useId } from 'react'
import { cx } from '../../utils/cx'
import styles from './Field.module.css'

interface CheckboxFieldProps {
  label: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  error?: string
}

export function CheckboxField({ label, checked, onCheckedChange, error }: CheckboxFieldProps) {
  const id = useId()
  const errorId = `${id}-error`

  return (
    <>
      <label htmlFor={id} className={styles.checkbox}>
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(event) => {
            onCheckedChange(event.target.checked)
          }}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
        />
        {label}
      </label>
      {error && (
        <p id={errorId} className={cx(styles.error, styles.checkboxError)} role="alert">
          {error}
        </p>
      )}
    </>
  )
}
