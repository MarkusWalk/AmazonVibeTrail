import React from 'react'
import styles from './RationsGauge.module.css'

interface RationsGaugeProps {
  rations: number
  maxRations: number
}

export const RationsGauge: React.FC<RationsGaugeProps> = ({
  rations,
  maxRations,
}) => {
  const percentage = Math.max(0, Math.min(100, (rations / maxRations) * 100))

  // Determine color based on rations percentage
  const getRationsColor = () => {
    if (percentage > 50) return '#60a5fa' // Blue
    if (percentage > 20) return '#fb923c' // Orange
    return '#dc2626' // Red
  }

  return (
    <div className={styles.gauge}>
      <div className={styles.label}>Rations</div>
      <div className={styles.barContainer}>
        <div
          className={styles.barFill}
          style={{
            width: `${percentage}%`,
            backgroundColor: getRationsColor(),
          }}
        />
        <div className={styles.barBorder} />
      </div>
      <div className={styles.value}>
        {Math.floor(rations)}/{maxRations}
      </div>
    </div>
  )
}
