import Matter from 'matter-js'
import type { Vector2D } from '@models/index'

/**
 * PhysicsSystem - Wraps Matter.js physics engine
 * Provides a clean interface for physics simulation in the game
 */
export class PhysicsSystem {
  private engine: Matter.Engine
  private world: Matter.World
  private bodies: Map<string, Matter.Body> = new Map()

  constructor() {
    // Create Matter.js engine with custom gravity (water resistance)
    this.engine = Matter.Engine.create({
      gravity: {
        x: 0,
        y: 0, // No gravity - we're in water!
        scale: 0.001,
      },
    })
    this.world = this.engine.world

    // Configure engine for better water-like physics
    this.engine.world.gravity.y = 0
  }

  /**
   * Update physics simulation by deltaTime
   */
  update(deltaTime: number): void {
    // Convert deltaTime from ms to seconds for Matter.js
    Matter.Engine.update(this.engine, deltaTime)
  }

  /**
   * Create a rectangular physics body
   */
  createRectBody(
    id: string,
    x: number,
    y: number,
    width: number,
    height: number,
    options: Matter.IBodyDefinition = {}
  ): Matter.Body {
    const body = Matter.Bodies.rectangle(x, y, width, height, {
      friction: 0.1,
      frictionAir: 0.02, // Water resistance
      restitution: 0.3, // Bounciness
      ...options,
    })

    this.bodies.set(id, body)
    Matter.World.add(this.world, body)
    return body
  }

  /**
   * Create a circular physics body
   */
  createCircleBody(
    id: string,
    x: number,
    y: number,
    radius: number,
    options: Matter.IBodyDefinition = {}
  ): Matter.Body {
    const body = Matter.Bodies.circle(x, y, radius, {
      friction: 0.1,
      frictionAir: 0.02,
      restitution: 0.3,
      ...options,
    })

    this.bodies.set(id, body)
    Matter.World.add(this.world, body)
    return body
  }

  /**
   * Remove a body from the physics world
   */
  removeBody(id: string): void {
    const body = this.bodies.get(id)
    if (body) {
      Matter.World.remove(this.world, body)
      this.bodies.delete(id)
    }
  }

  /**
   * Get a body by ID
   */
  getBody(id: string): Matter.Body | undefined {
    return this.bodies.get(id)
  }

  /**
   * Get body position
   */
  getBodyPosition(id: string): Vector2D | null {
    const body = this.bodies.get(id)
    if (!body) return null

    return {
      x: body.position.x,
      y: body.position.y,
    }
  }

  /**
   * Get body velocity
   */
  getBodyVelocity(id: string): Vector2D | null {
    const body = this.bodies.get(id)
    if (!body) return null

    return {
      x: body.velocity.x,
      y: body.velocity.y,
    }
  }

  /**
   * Apply force to a body
   */
  applyForce(id: string, force: Vector2D, position?: Vector2D): void {
    const body = this.bodies.get(id)
    if (!body) return

    const forcePosition = position || body.position
    Matter.Body.applyForce(
      body,
      forcePosition,
      Matter.Vector.create(force.x, force.y)
    )
  }

  /**
   * Set body velocity directly
   */
  setVelocity(id: string, velocity: Vector2D): void {
    const body = this.bodies.get(id)
    if (!body) return

    Matter.Body.setVelocity(body, Matter.Vector.create(velocity.x, velocity.y))
  }

  /**
   * Set body position
   */
  setPosition(id: string, position: Vector2D): void {
    const body = this.bodies.get(id)
    if (!body) return

    Matter.Body.setPosition(body, Matter.Vector.create(position.x, position.y))
  }

  /**
   * Set body angle (rotation in radians)
   */
  setAngle(id: string, angle: number): void {
    const body = this.bodies.get(id)
    if (!body) return

    Matter.Body.setAngle(body, angle)
  }

  /**
   * Get body angle
   */
  getAngle(id: string): number | null {
    const body = this.bodies.get(id)
    if (!body) return null

    return body.angle
  }

  /**
   * Check for collisions between bodies
   */
  checkCollisions(): Array<{ bodyA: string; bodyB: string }> {
    const collisions: Array<{ bodyA: string; bodyB: string }> = []
    const detector = Matter.Detector.create()
    const pairs = Matter.Detector.collisions(detector)

    pairs.forEach((pair) => {
      // Find IDs for colliding bodies
      let bodyAId: string | null = null
      let bodyBId: string | null = null

      this.bodies.forEach((body, id) => {
        if (body === pair.bodyA) bodyAId = id
        if (body === pair.bodyB) bodyBId = id
      })

      if (bodyAId && bodyBId) {
        collisions.push({ bodyA: bodyAId, bodyB: bodyBId })
      }
    })

    return collisions
  }

  /**
   * Register collision callbacks
   */
  onCollisionStart(callback: (pairs: Matter.Pair[]) => void): void {
    Matter.Events.on(this.engine, 'collisionStart', (event) => {
      callback(event.pairs)
    })
  }

  onCollisionEnd(callback: (pairs: Matter.Pair[]) => void): void {
    Matter.Events.on(this.engine, 'collisionEnd', (event) => {
      callback(event.pairs)
    })
  }

  /**
   * Clear all bodies from the world
   */
  clear(): void {
    // Remove all bodies manually
    this.world.bodies.forEach((body) => {
      Matter.World.remove(this.world, body)
    })
    this.bodies.clear()
  }

  /**
   * Get the Matter.js engine (for advanced usage)
   */
  getEngine(): Matter.Engine {
    return this.engine
  }

  /**
   * Get the Matter.js world (for advanced usage)
   */
  getWorld(): Matter.World {
    return this.world
  }

  /**
   * Get all body IDs
   */
  getAllBodyIds(): string[] {
    return Array.from(this.bodies.keys())
  }

  /**
   * Debug: Get engine state
   */
  getDebugInfo(): {
    bodyCount: number
    timestamp: number
  } {
    return {
      bodyCount: this.bodies.size,
      timestamp: this.engine.timing.timestamp,
    }
  }
}
