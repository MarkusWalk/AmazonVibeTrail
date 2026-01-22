import { Entity } from './Entity'
import { EntityType } from '@models/index'
import type { Vector2D } from '@models/index'

/**
 * Player - The player's canoe entity
 * Handles steering, acceleration, and player-specific behavior
 */
export class Player extends Entity {
  private maxSpeed: number = 5
  private acceleration: number = 0.2
  private turnSpeed: number = 0.05
  private currentThrust: number = 0
  private currentTurn: number = 0

  // Player stats
  private health: number = 100
  private isDamaged: boolean = false

  constructor(id: string, position: Vector2D) {
    super(id, EntityType.PLAYER, position)
  }

  /**
   * Update player state
   */
  update(_deltaTime: number): void {
    if (!this.isActive) return

    // Sync with physics
    this.syncWithPhysics()

    // Reset damage state after a brief moment
    if (this.isDamaged) {
      setTimeout(() => {
        this.isDamaged = false
      }, 500)
    }
  }

  /**
   * Apply thrust (forward/backward movement)
   */
  applyThrust(amount: number): void {
    this.currentThrust = Math.max(-1, Math.min(1, amount))
  }

  /**
   * Apply turn (left/right steering)
   */
  applyTurn(amount: number): void {
    this.currentTurn = Math.max(-1, Math.min(1, amount))
  }

  /**
   * Get thrust force vector based on current angle
   */
  getThrustForce(): Vector2D {
    const force = this.currentThrust * this.acceleration

    return {
      x: Math.sin(this.angle) * force,
      y: -Math.cos(this.angle) * force,
    }
  }

  /**
   * Get current turn amount
   */
  getTurnAmount(): number {
    return this.currentTurn * this.turnSpeed
  }

  /**
   * Take damage
   */
  takeDamage(amount: number): void {
    this.health = Math.max(0, this.health - amount)
    this.isDamaged = true
    console.log(`[Player] Took ${amount} damage. Health: ${this.health}`)
  }

  /**
   * Heal
   */
  heal(amount: number): void {
    this.health = Math.min(100, this.health + amount)
  }

  /**
   * Get health
   */
  getHealth(): number {
    return this.health
  }

  /**
   * Check if damaged recently
   */
  isRecentlyDamaged(): boolean {
    return this.isDamaged
  }

  /**
   * Reset controls (stop all input)
   */
  resetControls(): void {
    this.currentThrust = 0
    this.currentTurn = 0
  }

  /**
   * Handle collision with another entity
   */
  onCollision(other: Entity): void {
    if (other.type === EntityType.OBSTACLE) {
      this.takeDamage(10)
      // Apply knockback force
      const knockbackForce: Vector2D = {
        x: this.position.x - other.getPosition().x,
        y: this.position.y - other.getPosition().y,
      }
      // Normalize and apply
      const magnitude = Math.sqrt(
        knockbackForce.x ** 2 + knockbackForce.y ** 2
      )
      if (magnitude > 0) {
        knockbackForce.x = (knockbackForce.x / magnitude) * 2
        knockbackForce.y = (knockbackForce.y / magnitude) * 2
        this.setVelocity({
          x: this.velocity.x + knockbackForce.x,
          y: this.velocity.y + knockbackForce.y,
        })
      }
    }
  }

  /**
   * Get max speed
   */
  getMaxSpeed(): number {
    return this.maxSpeed
  }

  /**
   * Set max speed (useful for power-ups or hazards)
   */
  setMaxSpeed(speed: number): void {
    this.maxSpeed = speed
  }

  /**
   * Get current speed
   */
  getCurrentSpeed(): number {
    return Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2)
  }

  /**
   * Check if alive
   */
  isAlive(): boolean {
    return this.health > 0
  }
}
