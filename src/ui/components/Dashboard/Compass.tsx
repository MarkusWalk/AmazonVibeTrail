import React from 'react'
import styles from './Compass.module.css'

interface CompassProps {
  direction: number // Angle in degrees (0 = North, 90 = East, 180 = South, 270 = West)
  location?: string
}

export const Compass: React.FC<CompassProps> = ({ direction, location }) => {
  // Normalize direction to 0-360
  const normalizedDirection = ((direction % 360) + 360) % 360

  // Get cardinal direction
  const getCardinalDirection = (angle: number): string => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
    const index = Math.round(angle / 45) % 8
    return directions[index]
  }

  return (
    <div className={styles.compass}>
      <div className={styles.compassRose}>
        <div
          className={styles.needle}
          style={{ transform: `rotate(${normalizedDirection}deg)` }}
        >
          <div className={styles.needleNorth} />
          <div className={styles.needleSouth} />
        </div>
        <div className={styles.cardinalPoints}>
          <span className={styles.north}>N</span>
          <span className={styles.east}>E</span>
          <span className={styles.south}>S</span>
          <span className={styles.west}>W</span>
        </div>
      </div>
      <div className={styles.info}>
        <div className={styles.heading}>
          {getCardinalDirection(normalizedDirection)}
        </div>
        {location && <div className={styles.location}>{location}</div>}
      </div>
    </div>
  )
}
