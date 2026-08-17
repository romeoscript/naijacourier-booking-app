import type { ButtonHTMLAttributes } from 'react'
import { cx } from '../utils/cx'
import styles from './Button.module.css'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
}

export function Button({ variant = 'primary', className, type = 'button', ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      type={type}
      className={cx(variant === 'secondary' && styles.secondary, className)}
    />
  )
}
