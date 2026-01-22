import type { Vector2D, EntityType } from '@models/index'
import type Matter from 'matter-js'

/**
 * Entity - Base class for all game entities
 * Connects game logic with physics bodies
 */
export abstract class Entity {
  public readonly id: string
  public readonly type: EntityType
  protected position: Vector2D
  protected velocity: Vector2D
  protected angle: number = 0
  protected physicsBody: Matter.Body | null = null
  protected isActive: boolean = true

  constructor(id: string, type: EntityType, position: Vector2D) {
    this.id = id
    this.type = type
    this.position = { ...position }
    this.velocity = { x: 0, y: 0 }
  }

  /**
   * Update entity state (called every tick)
   */
  abstract update(deltaTime: number): void

  /**
   * Get entity position
   */
  getPosition(): Vector2D {
    return { ...this.position }
  }

  /**
   * Set entity position
   */
  setPosition(position: Vector2D): void {
    this.position = { ...position }
  }

  /**
   * Get entity velocity
   */
  getVelocity(): Vector2D {
    return { ...this.velocity }
  }

  /**
   * Set entity velocity
   */
  setVelocity(velocity: Vector2D): void {
    this.velocity = { ...velocity }
  }

  /**
   * Get entity angle (rotation in radians)
   */
  getAngle(): number {
    return this.angle
  }

  /**
   * Set entity angle
   */
  setAngle(angle: number): void {
    this.angle = angle
  }

  /**
   * Set physics body
   */
  setPhysicsBody(body: Matter.Body): void {
    this.physicsBody = body
  }

  /**
   * Get physics body
   */
  getPhysicsBody(): Matter.Body | null {
    return this.physicsBody
  }

  /**
   * Sync entity state with physics body
   */
  syncWithPhysics(): void {
    if (this.physicsBody) {
      this.position = {
        x: this.physicsBody.position.x,
        y: this.physicsBody.position.y,
      }
      this.velocity = {
        x: this.physicsBody.velocity.x,
        y: this.physicsBody.velocity.y,
      }
      this.angle = this.physicsBody.angle
    }
  }

  /**
   * Check if entity is active
   */
  isEntityActive(): boolean {
    return this.isActive
  }

  /**
   * Activate entity
   */
  activate(): void {
    this.isActive = true
  }

  /**
   * Deactivate entity
   */
  deactivate(): void {
    this.isActive = false
  }

  /**
   * Called when entity collides with another
   */
  onCollision(_other: Entity): void {
    // Override in subclasses
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    this.isActive = false
    this.physicsBody = null
  }
}
