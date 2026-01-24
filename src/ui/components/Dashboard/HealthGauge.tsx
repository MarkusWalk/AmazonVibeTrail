import React from 'react'
import styles from './HealthGauge.module.css'

interface HealthGaugeProps {
  health: number
  maxHealth: number
}

export const HealthGauge: React.FC<HealthGaugeProps> = ({
  health,
  maxHealth,
}) => {
  const percentage = Math.max(0, Math.min(100, (health / maxHealth) * 100))

  // Determine color based on health percentage
  const getHealthColor = () => {
    if (percentage > 60) return '#4ade80' // Green
    if (percentage > 30) return '#facc15' // Yellow
    return '#ef4444' // Red
  }

  return (
    <div className={styles.gauge}>
      <div className={styles.label}>Health</div>
      <div className={styles.barContainer}>
        <div
          className={styles.barFill}
          style={{
            width: `${percentage}%`,
            backgroundColor: getHealthColor(),
          }}
        />
        <div className={styles.barBorder} />
      </div>
      <div className={styles.value}>
        {Math.floor(health)}/{maxHealth}
      </div>
    </div>
  )
}
