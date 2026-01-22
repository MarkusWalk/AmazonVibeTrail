import { Entity } from './Entity'
import { EntityType } from '@models/index'
import type { Vector2D } from '@models/index'

export enum CollectibleType {
  FISH = 'FISH',
  HEALTH_PACK = 'HEALTH_PACK',
  SPECIMEN = 'SPECIMEN',
  SPEED_BOOST = 'SPEED_BOOST',
}

/**
 * Collectible - Items that give bonuses when collected
 * Examples: fish (score), health packs (healing), specimens (guidebook)
 */
export class Collectible extends Entity {
  private collectibleType: CollectibleType
  private value: number
  private collected: boolean = false

  constructor(
    id: string,
    position: Vector2D,
    collectibleType: CollectibleType
  ) {
    super(id, EntityType.COLLECTIBLE, position)
    this.collectibleType = collectibleType

    // Set value based on collectible type
    switch (collectibleType) {
      case CollectibleType.FISH:
        this.value = 25 // Score points
        break
      case CollectibleType.HEALTH_PACK:
        this.value = 30 // Health restored
        break
      case CollectibleType.SPECIMEN:
        this.value = 50 // Score points
        break
      case CollectibleType.SPEED_BOOST:
        this.value = 5 // Duration in seconds
        break
    }
  }

  /**
   * Update collectible state
   */
  update(deltaTime: number): void {
    if (!this.isActive) return

    // Sync with physics
    this.syncWithPhysics()

    // Collectibles drift slowly downstream
    if (this.physicsBody) {
      this.velocity.y += 0.005 * (deltaTime / 16.67)
    }

    // Bob up and down (visual effect handled by renderer)
    // We can add a bobbing offset for the renderer to use
  }

  /**
   * Get collectible type
   */
  getCollectibleType(): CollectibleType {
    return this.collectibleType
  }

  /**
   * Get value
   */
  getValue(): number {
    return this.value
  }

  /**
   * Mark as collected
   */
  collect(): void {
    this.collected = true
    this.deactivate()
    console.log(
      `[Collectible] ${this.collectibleType} collected! Value: ${this.value}`
    )
  }

  /**
   * Check if collected
   */
  isCollected(): boolean {
    return this.collected
  }

  /**
   * Handle collision
   */
  onCollision(other: Entity): void {
    if (other.type === EntityType.PLAYER && !this.collected) {
      this.collect()
    }
  }

  /**
   * Check if off-screen
   */
  isOffScreen(screenHeight: number): boolean {
    return this.position.y > screenHeight + 100
  }
}
