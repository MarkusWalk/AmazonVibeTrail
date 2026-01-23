import React from 'react'
import { Compass } from './Compass'
import { HealthGauge } from './HealthGauge'
import { RationsGauge } from './RationsGauge'
import { QuickSlots, QuickSlotItem } from './QuickSlots'
import { StatusIndicators, StatusEffect } from './StatusIndicators'
import styles from './Dashboard.module.css'

interface DashboardProps {
  health: number
  maxHealth: number
  rations: number
  maxRations: number
  direction: number
  location?: string
  quickSlots: (QuickSlotItem | null)[]
  selectedSlot?: number
  statuses: StatusEffect[]
  onSlotClick?: (index: number) => void
}

export const Dashboard: React.FC<DashboardProps> = ({
  health,
  maxHealth,
  rations,
  maxRations,
  direction,
  location,
  quickSlots,
  selectedSlot,
  statuses,
  onSlotClick,
}) => {
  return (
    <div className={styles.dashboard}>
      <div className={styles.leftSection}>
        <Compass direction={direction} location={location} />
        <StatusIndicators statuses={statuses} />
      </div>

      <div className={styles.centerSection}>
        <QuickSlots
          slots={quickSlots}
          selectedSlot={selectedSlot}
          onSlotClick={onSlotClick}
        />
      </div>

      <div className={styles.rightSection}>
        <HealthGauge health={health} maxHealth={maxHealth} />
        <RationsGauge rations={rations} maxRations={maxRations} />
      </div>
    </div>
  )
}
