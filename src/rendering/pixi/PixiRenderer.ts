import * as PIXI from 'pixi.js'
import type { Entity } from '@engine/entities'

export interface RendererConfig {
  width: number
  height: number
  backgroundColor: number
  antialias?: boolean
}

/**
 * PixiRenderer - The View in MVC
 * Manages PixiJS application and rendering layers
 */
export class PixiRenderer {
  private app: PIXI.Application
  private layers: Map<string, PIXI.Container> = new Map()
  private sprites: Map<string, PIXI.Container> = new Map()
  private isInitialized: boolean = false

  // Screen shake properties
  private shakeIntensity: number = 0
  private shakeDuration: number = 0
  private shakeRemaining: number = 0
  private originalStageX: number = 0
  private originalStageY: number = 0

  // Performance tracking
  private lastPositions: Map<string, { x: number; y: number; rotation: number }> =
    new Map()
  private updateThreshold: number = 0.1 // Only update if moved more than this

  constructor(private config: RendererConfig) {
    // Create PixiJS application
    this.app = new PIXI.Application()
  }

  /**
   * Initialize the renderer (async because PixiJS v8 requires it)
   */
  async initialize(container: HTMLElement): Promise<void> {
    await this.app.init({
      width: this.config.width,
      height: this.config.height,
      backgroundColor: this.config.backgroundColor,
      antialias: this.config.antialias ?? true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    })

    // Append canvas to container
    container.appendChild(this.app.canvas)

    // Create rendering layers (z-index ordering)
    this.createLayer('background', 0) // Background layer
    this.createLayer('water', 1) // Water effects
    this.createLayer('entities', 2) // Game entities
    this.createLayer('ui', 3) // UI elements

    this.isInitialized = true
    console.log('[PixiRenderer] Initialized')
  }

  /**
   * Create a rendering layer
   */
  private createLayer(name: string, zIndex: number): void {
    const container = new PIXI.Container()
    container.zIndex = zIndex
    container.label = name

    this.layers.set(name, container)
    this.app.stage.addChild(container)

    // Enable sorting by zIndex
    this.app.stage.sortableChildren = true
  }

  /**
   * Get a layer by name
   */
  getLayer(name: string): PIXI.Container | undefined {
    return this.layers.get(name)
  }

  /**
   * Create a sprite for an entity
   */
  createEntitySprite(entity: Entity, layerName: string = 'entities'): void {
    const layer = this.layers.get(layerName)
    if (!layer) {
      console.error(`[PixiRenderer] Layer ${layerName} not found`)
      return
    }

    // Create a container for the entity
    const container = new PIXI.Container()
    container.label = entity.id

    // Create visual representation based on entity type
    const graphics = this.createEntityGraphics(entity)
    container.addChild(graphics)

    // Position the sprite
    const pos = entity.getPosition()
    container.x = pos.x
    container.y = pos.y
    container.rotation = entity.getAngle()

    // Add to layer
    layer.addChild(container)
    this.sprites.set(entity.id, container)
  }

  /**
   * Create graphics for an entity based on its type
   */
  private createEntityGraphics(entity: Entity): PIXI.Graphics {
    const graphics = new PIXI.Graphics()

    // Check for specific entity class names
    const className = entity.constructor.name

    if (className === 'Player') {
      // Draw a more detailed canoe shape
      graphics.moveTo(0, -45)
      graphics.lineTo(-18, 35)
      graphics.lineTo(0, 40)
      graphics.lineTo(18, 35)
      graphics.lineTo(0, -45)
      graphics.fill({ color: 0x8b4513 }) // Brown canoe

      // Add decoration stripe
      graphics.rect(-15, -10, 30, 4)
      graphics.fill({ color: 0x654321 })

      // Paddle indicator
      graphics.rect(-5, -55, 10, 15)
      graphics.fill({ color: 0x654321 })
    } else if (className === 'Whirlpool') {
      // Draw a whirlpool effect (spiral)
      graphics.circle(0, 0, 50)
      graphics.fill({ color: 0x1e5a8e, alpha: 0.6 })

      graphics.circle(0, 0, 35)
      graphics.fill({ color: 0x2e7ab8, alpha: 0.7 })

      graphics.circle(0, 0, 20)
      graphics.fill({ color: 0x4a90d4, alpha: 0.8 })

      // Center vortex
      graphics.circle(0, 0, 10)
      graphics.fill({ color: 0x0a2a4e })
    } else if (className === 'Collectible') {
      // Different collectible types have different visuals
      // Fish
      graphics.ellipse(0, 0, 15, 10)
      graphics.fill({ color: 0xff8c00 }) // Orange fish

      // Tail
      graphics.moveTo(15, 0)
      graphics.lineTo(22, -8)
      graphics.lineTo(22, 8)
      graphics.lineTo(15, 0)
      graphics.fill({ color: 0xff6600 })

      // Eye
      graphics.circle(-8, -3, 2)
      graphics.fill({ color: 0x000000 })
    } else if (className === 'Obstacle') {
      // Default obstacle - log/rock
      // Make it look like a floating log
      graphics.roundRect(-30, -12, 60, 24, 6)
      graphics.fill({ color: 0x654321 })

      // Wood grain lines
      graphics.rect(-28, -2, 56, 2)
      graphics.fill({ color: 0x4a3015, alpha: 0.5 })

      graphics.rect(-25, 6, 50, 2)
      graphics.fill({ color: 0x4a3015, alpha: 0.5 })
    } else if (className === 'Fork') {
      // Draw a fork indicator with arrows
      // Center circle
      graphics.circle(0, 0, 40)
      graphics.fill({ color: 0xffff00, alpha: 0.7 })

      // Arrow pointing left
      graphics.moveTo(-50, 0)
      graphics.lineTo(-70, -15)
      graphics.lineTo(-70, 15)
      graphics.lineTo(-50, 0)
      graphics.fill({ color: 0xffff00 })

      // Arrow pointing right
      graphics.moveTo(50, 0)
      graphics.lineTo(70, -15)
      graphics.lineTo(70, 15)
      graphics.lineTo(50, 0)
      graphics.fill({ color: 0xffff00 })

      // Text indicator "FORK" (will be rendered as texture)
      graphics.circle(0, 0, 30)
      graphics.fill({ color: 0x333333, alpha: 0.8 })
    } else {
      // Default shape
      graphics.rect(-10, -10, 20, 20)
      graphics.fill({ color: 0xff0000 })
    }

    return graphics
  }

  /**
   * Update sprite position/rotation from entity
   * Optimized: Only updates if entity has moved significantly
   */
  updateEntitySprite(entity: Entity): void {
    const sprite = this.sprites.get(entity.id)
    if (!sprite) return

    const pos = entity.getPosition()
    const rotation = entity.getAngle()
    const lastPos = this.lastPositions.get(entity.id)

    // Check if entity has moved significantly
    if (lastPos) {
      const dx = Math.abs(pos.x - lastPos.x)
      const dy = Math.abs(pos.y - lastPos.y)
      const dr = Math.abs(rotation - lastPos.rotation)

      // Skip update if movement is below threshold
      if (
        dx < this.updateThreshold &&
        dy < this.updateThreshold &&
        dr < 0.01
      ) {
        return
      }
    }

    // Update sprite transform
    sprite.x = pos.x
    sprite.y = pos.y
    sprite.rotation = rotation

    // Cache position for next frame
    this.lastPositions.set(entity.id, { x: pos.x, y: pos.y, rotation })
  }

  /**
   * Remove entity sprite
   */
  removeEntitySprite(entityId: string): void {
    const sprite = this.sprites.get(entityId)
    if (sprite) {
      sprite.destroy({ children: true })
      this.sprites.delete(entityId)
      this.lastPositions.delete(entityId) // Clean up cached position
    }
  }

  /**
   * Create background (river water)
   */
  createBackground(): void {
    const backgroundLayer = this.layers.get('background')
    if (!backgroundLayer) return

    // Create a tiled water texture
    const graphics = new PIXI.Graphics()
    graphics.rect(0, 0, this.config.width, this.config.height)
    graphics.fill({ color: 0x4a90a4 }) // River blue

    backgroundLayer.addChild(graphics)
  }

  /**
   * Create water effects layer
   */
  createWaterEffect(): void {
    const waterLayer = this.layers.get('water')
    if (!waterLayer) return

    // Create semi-transparent overlay for water effect
    const graphics = new PIXI.Graphics()
    graphics.rect(0, 0, this.config.width, this.config.height)
    graphics.fill({ color: 0x87ceeb, alpha: 0.2 }) // Light blue overlay

    waterLayer.addChild(graphics)
  }

  /**
   * Add text to UI layer
   */
  addText(
    id: string,
    text: string,
    x: number,
    y: number,
    style?: Partial<PIXI.TextStyle>
  ): void {
    const uiLayer = this.layers.get('ui')
    if (!uiLayer) return

    const textObj = new PIXI.Text({
      text,
      style: {
        fill: 0xffffff,
        fontSize: 24,
        fontFamily: 'Arial',
        ...style,
      },
    })

    textObj.x = x
    textObj.y = y
    textObj.label = id

    uiLayer.addChild(textObj)
    this.sprites.set(id, textObj as unknown as PIXI.Container)
  }

  /**
   * Update text content
   */
  updateText(id: string, text: string): void {
    const textObj = this.sprites.get(id) as unknown as PIXI.Text
    if (textObj && 'text' in textObj) {
      textObj.text = text
    }
  }

  /**
   * Clear a layer
   */
  clearLayer(layerName: string): void {
    const layer = this.layers.get(layerName)
    if (layer) {
      layer.removeChildren()
    }
  }

  /**
   * Render a frame (called automatically by PixiJS)
   */
  render(): void {
    // PixiJS handles rendering automatically via requestAnimationFrame
    // This method is here for manual rendering if needed
    if (this.isInitialized) {
      this.app.renderer.render(this.app.stage)
    }
  }

  /**
   * Resize the renderer
   */
  resize(width: number, height: number): void {
    this.app.renderer.resize(width, height)
    this.config.width = width
    this.config.height = height
  }

  /**
   * Get canvas element
   */
  getCanvas(): HTMLCanvasElement {
    return this.app.canvas
  }

  /**
   * Get renderer dimensions
   */
  getDimensions(): { width: number; height: number } {
    return {
      width: this.config.width,
      height: this.config.height,
    }
  }

  /**
   * Check if initialized
   */
  isReady(): boolean {
    return this.isInitialized
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    this.sprites.forEach((sprite) => {
      sprite.destroy({ children: true })
    })
    this.sprites.clear()
    this.layers.clear()
    this.app.destroy(true, { children: true })
    this.isInitialized = false
    console.log('[PixiRenderer] Destroyed')
  }

  /**
   * Get PixiJS application (for advanced usage)
   */
  getApp(): PIXI.Application {
    return this.app
  }

  /**
   * Trigger screen shake effect
   * @param intensity - How much to shake (pixels)
   * @param duration - How long to shake (seconds)
   */
  shakeScreen(intensity: number = 10, duration: number = 0.3): void {
    this.shakeIntensity = intensity
    this.shakeDuration = duration
    this.shakeRemaining = duration
    this.originalStageX = this.app.stage.x
    this.originalStageY = this.app.stage.y
  }

  /**
   * Update screen shake effect
   * @param deltaTime - Time elapsed in milliseconds
   */
  updateScreenShake(deltaTime: number): void {
    if (this.shakeRemaining <= 0) {
      // No shake active, ensure stage is at original position
      if (this.app.stage.x !== this.originalStageX || this.app.stage.y !== this.originalStageY) {
        this.app.stage.x = this.originalStageX
        this.app.stage.y = this.originalStageY
      }
      return
    }

    const dt = deltaTime / 1000 // Convert to seconds
    this.shakeRemaining -= dt

    // Calculate shake offset based on remaining time
    const shakePercent = this.shakeRemaining / this.shakeDuration
    const currentIntensity = this.shakeIntensity * shakePercent

    // Random offset
    const offsetX = (Math.random() - 0.5) * currentIntensity * 2
    const offsetY = (Math.random() - 0.5) * currentIntensity * 2

    this.app.stage.x = this.originalStageX + offsetX
    this.app.stage.y = this.originalStageY + offsetY

    // Reset when done
    if (this.shakeRemaining <= 0) {
      this.app.stage.x = this.originalStageX
      this.app.stage.y = this.originalStageY
    }
  }

  /**
   * Update renderer effects
   * @param deltaTime - Time elapsed in milliseconds
   */
  update(deltaTime: number): void {
    this.updateScreenShake(deltaTime)
  }
}
