import React from 'react'
import styles from './StatusIndicators.module.css'

export interface StatusEffect {
  id: string
  name: string
  icon: string // Emoji or icon character
  duration?: number // Seconds remaining
  type: 'buff' | 'debuff' | 'neutral'
}

interface StatusIndicatorsProps {
  statuses: StatusEffect[]
}

export const StatusIndicators: React.FC<StatusIndicatorsProps> = ({
  statuses,
}) => {
  if (statuses.length === 0) {
    return null
  }

  return (
    <div className={styles.statusIndicators}>
      <div className={styles.label}>Status</div>
      <div className={styles.statusContainer}>
        {statuses.map((status) => (
          <div
            key={status.id}
            className={`${styles.status} ${styles[status.type]}`}
            title={`${status.name}${status.duration ? ` (${Math.ceil(status.duration)}s)` : ''}`}
          >
            <div className={styles.icon}>{status.icon}</div>
            {status.duration !== undefined && (
              <div className={styles.duration}>{Math.ceil(status.duration)}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
