import { useId, type InputHTMLAttributes } from 'react'
import { cx } from '../../utils/cx'
import styles from './Field.module.css'

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  label: string
  error?: string
}

export function TextField({ label, error, className, ...inputProps }: TextFieldProps) {
  const id = useId()
  const errorId = `${id}-error`

  return (
    <label htmlFor={id}>
      {label}
      <input
        {...inputProps}
        id={id}
        className={cx(className, error && styles.invalid)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
      />
      {error && (
        <p id={errorId} className={styles.error} role="alert">
          {error}
        </p>
      )}
    </label>
  )
}
