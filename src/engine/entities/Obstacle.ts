import { Entity } from './Entity'
import { EntityType } from '@models/index'
import type { Vector2D } from '@models/index'

export enum ObstacleSubType {
  LOG = 'LOG',
  ROCK = 'ROCK',
  BRANCH = 'BRANCH',
}

/**
 * Obstacle - Hazards in the river that damage the player
 * Examples: floating logs, rocks, branches
 */
export class Obstacle extends Entity {
  private subType: ObstacleSubType
  private damageAmount: number

  constructor(
    id: string,
    position: Vector2D,
    subType: ObstacleSubType = ObstacleSubType.LOG
  ) {
    super(id, EntityType.OBSTACLE, position)
    this.subType = subType

    // Set damage based on obstacle type
    switch (subType) {
      case ObstacleSubType.LOG:
        this.damageAmount = 10
        break
      case ObstacleSubType.ROCK:
        this.damageAmount = 15
        break
      case ObstacleSubType.BRANCH:
        this.damageAmount = 5
        break
    }
  }

  /**
   * Update obstacle state
   */
  update(deltaTime: number): void {
    if (!this.isActive) return

    // Sync with physics
    this.syncWithPhysics()

    // Obstacles move with the river current
    // This will be enhanced when we add NavigationManager
    // For now, they drift slowly downstream
    if (this.physicsBody) {
      // Apply gentle downstream drift
      this.velocity.y += 0.01 * (deltaTime / 16.67) // Normalize to 60fps
    }
  }

  /**
   * Get obstacle sub-type
   */
  getSubType(): ObstacleSubType {
    return this.subType
  }

  /**
   * Get damage amount
   */
  getDamageAmount(): number {
    return this.damageAmount
  }

  /**
   * Handle collision
   */
  onCollision(other: Entity): void {
    if (other.type === EntityType.PLAYER) {
      console.log(
        `[Obstacle] ${this.subType} hit player, dealing ${this.damageAmount} damage`
      )
    }
  }

  /**
   * Check if obstacle is off-screen and should be removed
   */
  isOffScreen(screenHeight: number): boolean {
    return this.position.y > screenHeight + 100
  }
}
