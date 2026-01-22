import { Entity } from './Entity'
import { EntityType } from '@models/index'
import type { Vector2D } from '@models/index'

/**
 * Whirlpool - A dangerous vortex that pulls the player towards its center
 * and spins them around, dealing continuous damage
 */
export class Whirlpool extends Entity {
  private pullRadius: number = 100
  private pullStrength: number = 0.15
  private damagePerSecond: number = 5
  private rotationSpeed: number = 0.05
  private damageTimer: number = 0

  constructor(id: string, position: Vector2D) {
    super(id, EntityType.OBSTACLE, position)
  }

  /**
   * Update whirlpool state
   */
  update(deltaTime: number): void {
    if (!this.isActive) return

    // Sync with physics
    this.syncWithPhysics()

    // Rotate the whirlpool
    this.angle += this.rotationSpeed * (deltaTime / 16.67)

    // Move slowly downstream
    if (this.physicsBody) {
      this.velocity.y += 0.008 * (deltaTime / 16.67)
    }

    this.damageTimer += deltaTime
  }

  /**
   * Get pull force for an entity at a position
   */
  getPullForce(targetPosition: Vector2D): Vector2D | null {
    const dx = this.position.x - targetPosition.x
    const dy = this.position.y - targetPosition.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    // Only pull if within radius
    if (distance > this.pullRadius) {
      return null
    }

    // Calculate pull strength based on distance (stronger when closer)
    const strength =
      this.pullStrength * (1 - distance / this.pullRadius) * 1.5

    // Normalize direction and apply strength
    const force: Vector2D = {
      x: (dx / distance) * strength,
      y: (dy / distance) * strength,
    }

    return force
  }

  /**
   * Get pull radius
   */
  getPullRadius(): number {
    return this.pullRadius
  }

  /**
   * Check if should deal damage (every 200ms)
   */
  shouldDealDamage(): boolean {
    if (this.damageTimer >= 200) {
      this.damageTimer = 0
      return true
    }
    return false
  }

  /**
   * Get damage amount
   */
  getDamageAmount(): number {
    return this.damagePerSecond * 0.2 // 200ms worth of damage
  }

  /**
   * Handle collision
   */
  onCollision(other: Entity): void {
    if (other.type === EntityType.PLAYER) {
      console.log('[Whirlpool] Player caught in whirlpool!')
    }
  }

  /**
   * Check if off-screen
   */
  isOffScreen(screenHeight: number): boolean {
    return this.position.y > screenHeight + 150
  }
}
