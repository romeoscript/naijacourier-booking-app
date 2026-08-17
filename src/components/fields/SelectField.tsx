import { useId, type ChangeEvent } from 'react'
import styles from './Field.module.css'

export interface SelectOption<TValue extends string> {
  value: TValue
  label: string
}

interface SelectFieldProps<TValue extends string> {
  label: string
  value: TValue
  options: readonly SelectOption<TValue>[]
  onValueChange: (value: TValue) => void
  error?: string
}

export function SelectField<TValue extends string>({
  label,
  value,
  options,
  onValueChange,
  error,
}: SelectFieldProps<TValue>) {
  const id = useId()
  const errorId = `${id}-error`

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selected = options.find((option) => option.value === event.target.value)
    if (selected) {
      onValueChange(selected.value)
    }
  }

  return (
    <label htmlFor={id}>
      {label}
      <select
        id={id}
        value={value}
        onChange={handleChange}
        className={error ? styles.invalid : undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={errorId} className={styles.error} role="alert">
          {error}
        </p>
      )}
    </label>
  )
}
