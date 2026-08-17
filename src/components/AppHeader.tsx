import { LockIcon } from './icons'
import styles from './AppHeader.module.css'

export function AppHeader() {
  return (
    <header className={styles.header}>
      <b className={styles.brand}>
        Naija<span className={styles.brandAccent}>Courier</span>
      </b>
      <span className={styles.tagline}>
        <LockIcon className={styles.taglineIcon} />
        Secure delivery booking
      </span>
    </header>
  )
}
