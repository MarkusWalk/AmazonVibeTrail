import * as PIXI from 'pixi.js'

/**
 * Particle definition
 */
interface Particle {
  sprite: PIXI.Graphics
  velocityX: number
  velocityY: number
  lifespan: number
  maxLifespan: number
  alpha: number
  scale: number
  gravity: number
}

/**
 * Particle effect configuration
 */
interface ParticleEffectConfig {
  x: number
  y: number
  count: number
  color: number
  minSpeed: number
  maxSpeed: number
  minSize: number
  maxSize: number
  lifespan: number
  gravity?: number
  spread?: number
}

/**
 * ParticleManager - Manages particle effects for visual polish
 */
export class ParticleManager {
  private container: PIXI.Container
  private particles: Particle[] = []

  constructor(container: PIXI.Container) {
    this.container = container
  }

  /**
   * Create a water splash effect
   */
  createWaterSplash(x: number, y: number): void {
    this.createEffect({
      x,
      y,
      count: 15,
      color: 0x4a90a4,
      minSpeed: 100,
      maxSpeed: 300,
      minSize: 2,
      maxSize: 6,
      lifespan: 0.8,
      gravity: 300,
      spread: 360,
    })
  }

  /**
   * Create a sparkle effect for collectibles
   */
  createSparkle(x: number, y: number, color: number = 0xffff00): void {
    this.createEffect({
      x,
      y,
      count: 10,
      color,
      minSpeed: 50,
      maxSpeed: 150,
      minSize: 2,
      maxSize: 4,
      lifespan: 0.6,
      gravity: 0,
      spread: 360,
    })
  }

  /**
   * Create a collision impact effect
   */
  createImpact(x: number, y: number): void {
    this.createEffect({
      x,
      y,
      count: 8,
      color: 0xffffff,
      minSpeed: 80,
      maxSpeed: 200,
      minSize: 3,
      maxSize: 7,
      lifespan: 0.4,
      gravity: 0,
      spread: 360,
    })
  }

  /**
   * Generic particle effect creation
   */
  private createEffect(config: ParticleEffectConfig): void {
    const {
      x,
      y,
      count,
      color,
      minSpeed,
      maxSpeed,
      minSize,
      maxSize,
      lifespan,
      gravity = 0,
      spread = 360,
    } = config

    for (let i = 0; i < count; i++) {
      // Create particle sprite
      const particle = new PIXI.Graphics()
      const size = minSize + Math.random() * (maxSize - minSize)
      particle.circle(0, 0, size)
      particle.fill({ color, alpha: 1 })
      particle.x = x
      particle.y = y

      // Random velocity
      const angle = (Math.random() * spread * Math.PI) / 180
      const speed = minSpeed + Math.random() * (maxSpeed - minSpeed)
      const velocityX = Math.cos(angle) * speed
      const velocityY = Math.sin(angle) * speed

      // Add to container
      this.container.addChild(particle)

      // Track particle
      this.particles.push({
        sprite: particle,
        velocityX,
        velocityY,
        lifespan,
        maxLifespan: lifespan,
        alpha: 1,
        scale: 1,
        gravity,
      })
    }
  }

  /**
   * Update all particles
   */
  update(deltaTime: number): void {
    const dt = deltaTime / 1000 // Convert to seconds

    // Update each particle
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i]

      // Update position
      p.sprite.x += p.velocityX * dt
      p.sprite.y += p.velocityY * dt

      // Apply gravity (per-particle)
      p.velocityY += p.gravity * dt

      // Update lifespan
      p.lifespan -= dt

      // Fade out based on remaining lifespan
      const lifespanPercent = p.lifespan / p.maxLifespan
      p.alpha = lifespanPercent
      p.sprite.alpha = p.alpha

      // Scale down over time
      p.scale = 0.5 + lifespanPercent * 0.5
      p.sprite.scale.set(p.scale)

      // Remove dead particles
      if (p.lifespan <= 0) {
        this.container.removeChild(p.sprite)
        p.sprite.destroy()
        this.particles.splice(i, 1)
      }
    }
  }

  /**
   * Clear all particles
   */
  clear(): void {
    this.particles.forEach((p) => {
      this.container.removeChild(p.sprite)
      p.sprite.destroy()
    })
    this.particles = []
  }

  /**
   * Get particle count
   */
  getParticleCount(): number {
    return this.particles.length
  }
}
