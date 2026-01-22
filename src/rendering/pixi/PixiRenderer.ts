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

    switch (entity.type) {
      case 'PLAYER':
        // Draw a canoe shape
        graphics.rect(-20, -40, 40, 80)
        graphics.fill({ color: 0x8b4513 }) // Brown canoe
        // Add a paddle indicator
        graphics.rect(-5, -50, 10, 20)
        graphics.fill({ color: 0x654321 })
        break

      case 'OBSTACLE':
        // Draw a log/rock
        graphics.circle(0, 0, 25)
        graphics.fill({ color: 0x654321 }) // Dark brown
        break

      case 'COLLECTIBLE':
        // Draw a star for collectibles
        graphics.star(0, 0, 5, 15, 10)
        graphics.fill({ color: 0xffff00 }) // Yellow
        break

      default:
        // Default shape
        graphics.rect(-10, -10, 20, 20)
        graphics.fill({ color: 0xff0000 })
    }

    return graphics
  }

  /**
   * Update sprite position/rotation from entity
   */
  updateEntitySprite(entity: Entity): void {
    const sprite = this.sprites.get(entity.id)
    if (!sprite) return

    const pos = entity.getPosition()
    sprite.x = pos.x
    sprite.y = pos.y
    sprite.rotation = entity.getAngle()
  }

  /**
   * Remove entity sprite
   */
  removeEntitySprite(entityId: string): void {
    const sprite = this.sprites.get(entityId)
    if (sprite) {
      sprite.destroy({ children: true })
      this.sprites.delete(entityId)
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
}
