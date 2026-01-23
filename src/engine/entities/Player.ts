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
  private maxHealth: number = 100
  private lives: number = 3
  private isDamaged: boolean = false

  // Tracking stats
  private distanceTraveled: number = 0
  private combo: number = 0
  private maxCombo: number = 0
  private obstaclesAvoided: number = 0
  private collectiblesGathered: number = 0

  // Power-up effects
  private speedBoostTimer: number = 0
  private invincibilityTimer: number = 0

  constructor(id: string, position: Vector2D) {
    super(id, EntityType.PLAYER, position)
  }

  /**
   * Update player state
   */
  update(deltaTime: number): void {
    if (!this.isActive) return

    // Sync with physics
    this.syncWithPhysics()

    // Track distance traveled
    const speed = this.getCurrentSpeed()
    this.distanceTraveled += speed * (deltaTime / 1000)

    // Update power-up timers
    if (this.speedBoostTimer > 0) {
      this.speedBoostTimer -= deltaTime
      if (this.speedBoostTimer <= 0) {
        this.maxSpeed = 5 // Reset to default
      }
    }

    if (this.invincibilityTimer > 0) {
      this.invincibilityTimer -= deltaTime
    }

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
    // Handle collectibles
    if (other.type === EntityType.COLLECTIBLE) {
      this.collectItem()
      return
    }

    // Handle obstacles (only if not invincible)
    if (other.type === EntityType.OBSTACLE && !this.isInvincible()) {
      this.takeDamage(10)
      this.breakCombo() // Break combo on hit

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

      // Check if health is 0, lose a life
      if (this.health <= 0 && this.lives > 0) {
        this.loseLife()
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
    return this.health > 0 && this.lives > 0
  }

  /**
   * Lose a life and respawn
   */
  loseLife(): boolean {
    this.lives--
    if (this.lives > 0) {
      this.health = this.maxHealth
      this.combo = 0
      this.invincibilityTimer = 2000 // 2 seconds of invincibility
      console.log(`[Player] Lost a life! Lives remaining: ${this.lives}`)
      return true // Can respawn
    }
    return false // Game over
  }

  /**
   * Get lives
   */
  getLives(): number {
    return this.lives
  }

  /**
   * Add a life
   */
  addLife(): void {
    this.lives = Math.min(5, this.lives + 1) // Max 5 lives
  }

  /**
   * Get distance traveled
   */
  getDistanceTraveled(): number {
    return Math.floor(this.distanceTraveled)
  }

  /**
   * Increment combo
   */
  incrementCombo(): void {
    this.combo++
    if (this.combo > this.maxCombo) {
      this.maxCombo = this.combo
    }
  }

  /**
   * Break combo
   */
  breakCombo(): void {
    this.combo = 0
  }

  /**
   * Get current combo
   */
  getCombo(): number {
    return this.combo
  }

  /**
   * Get max combo
   */
  getMaxCombo(): number {
    return this.maxCombo
  }

  /**
   * Increment obstacles avoided
   */
  incrementObstaclesAvoided(): void {
    this.obstaclesAvoided++
    this.incrementCombo()
  }

  /**
   * Get obstacles avoided
   */
  getObstaclesAvoided(): number {
    return this.obstaclesAvoided
  }

  /**
   * Collect item
   */
  collectItem(): void {
    this.collectiblesGathered++
  }

  /**
   * Get collectibles gathered
   */
  getCollectiblesGathered(): number {
    return this.collectiblesGathered
  }

  /**
   * Apply speed boost
   */
  applySpeedBoost(duration: number): void {
    this.maxSpeed = 8
    this.speedBoostTimer = duration
    console.log(`[Player] Speed boost activated for ${duration}ms`)
  }

  /**
   * Check if invincible
   */
  isInvincible(): boolean {
    return this.invincibilityTimer > 0
  }

  /**
   * Get all player stats
   */
  getStats(): {
    health: number
    lives: number
    distance: number
    combo: number
    maxCombo: number
    obstaclesAvoided: number
    collectiblesGathered: number
    speed: number
    angle: number
    speedBoostActive: boolean
    speedBoostRemaining: number
    invincible: boolean
    invincibilityRemaining: number
  } {
    return {
      health: this.health,
      lives: this.lives,
      distance: this.getDistanceTraveled(),
      combo: this.combo,
      maxCombo: this.maxCombo,
      obstaclesAvoided: this.obstaclesAvoided,
      collectiblesGathered: this.collectiblesGathered,
      speed: this.getCurrentSpeed(),
      angle: this.angle,
      speedBoostActive: this.speedBoostTimer > 0,
      speedBoostRemaining: this.speedBoostTimer,
      invincible: this.invincibilityTimer > 0,
      invincibilityRemaining: this.invincibilityTimer,
    }
  }
}
