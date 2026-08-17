import styles from './Hero.module.css'

export function Hero() {
  return (
    <div className={styles.hero}>
      <span className="eyebrow">SEND ANYWHERE IN NIGERIA</span>
      <h1 className={styles.title}>Book a courier delivery</h1>
      <p>Tell us what you&rsquo;re sending, where it is going, and who should receive it.</p>
    </div>
  )
}
