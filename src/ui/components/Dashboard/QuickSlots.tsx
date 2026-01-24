import React from 'react'
import styles from './QuickSlots.module.css'

export interface QuickSlotItem {
  id: string
  name: string
  icon: string // Emoji or icon character
  count?: number
  cooldown?: number // 0-100 percentage
}

interface QuickSlotsProps {
  slots: (QuickSlotItem | null)[]
  selectedSlot?: number
  onSlotClick?: (index: number) => void
}

export const QuickSlots: React.FC<QuickSlotsProps> = ({
  slots,
  selectedSlot,
  onSlotClick,
}) => {
  return (
    <div className={styles.quickSlots}>
      <div className={styles.label}>Quick Items</div>
      <div className={styles.slotsContainer}>
        {slots.map((item, index) => (
          <div
            key={index}
            className={`${styles.slot} ${selectedSlot === index ? styles.selected : ''} ${item ? styles.filled : ''}`}
            onClick={() => onSlotClick?.(index)}
            title={item?.name || 'Empty slot'}
          >
            {item && (
              <>
                <div className={styles.icon}>{item.icon}</div>
                {item.count !== undefined && (
                  <div className={styles.count}>{item.count}</div>
                )}
                {item.cooldown !== undefined && item.cooldown > 0 && (
                  <div
                    className={styles.cooldown}
                    style={{ height: `${item.cooldown}%` }}
                  />
                )}
                <div className={styles.keybind}>{index + 1}</div>
              </>
            )}
            {!item && <div className={styles.keybind}>{index + 1}</div>}
          </div>
        ))}
      </div>
    </div>
  )
}
