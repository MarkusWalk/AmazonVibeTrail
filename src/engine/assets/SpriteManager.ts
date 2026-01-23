import * as PIXI from 'pixi.js'
import { SpriteCategory } from '@models/sprites'
import type {
  SpriteMetadata,
  SpriteManifest,
  LoadedSprite,
} from '@models/sprites'

/**
 * SpriteManager - Centralized sprite loading and caching
 *
 * Supports:
 * - External image files
 * - Base64 data URLs (perfect for AI-generated sprites)
 * - Sprite sheets and atlases
 * - Lazy loading
 * - Category-based filtering
 */
export class SpriteManager {
  private sprites: Map<string, LoadedSprite> = new Map()
  private manifest: SpriteManifest | null = null
  private loadingPromises: Map<string, Promise<LoadedSprite>> = new Map()

  /**
   * Load the sprite manifest
   */
  async loadManifest(manifestPath: string): Promise<void> {
    try {
      const response = await fetch(manifestPath)
      this.manifest = await response.json()
      console.log(
        `[SpriteManager] Loaded manifest with ${this.manifest!.sprites.length} sprites`
      )
    } catch (error) {
      console.error('[SpriteManager] Failed to load manifest:', error)
      throw error
    }
  }

  /**
   * Set manifest directly (useful for embedded manifests)
   */
  setManifest(manifest: SpriteManifest): void {
    this.manifest = manifest
    console.log(
      `[SpriteManager] Manifest set with ${manifest.sprites.length} sprites`
    )
  }

  /**
   * Get all sprite metadata (without loading textures)
   */
  getAllSprites(): SpriteMetadata[] {
    return this.manifest?.sprites || []
  }

  /**
   * Get sprites by category
   */
  getSpritesByCategory(category: SpriteCategory): SpriteMetadata[] {
    return this.getAllSprites().filter((s) => s.category === category)
  }

  /**
   * Get sprites by tags
   */
  getSpritesByTags(tags: string[]): SpriteMetadata[] {
    return this.getAllSprites().filter((s) =>
      tags.some((tag) => s.tags?.includes(tag))
    )
  }

  /**
   * Get sprite metadata by ID
   */
  getSpriteMetadata(id: string): SpriteMetadata | null {
    return this.getAllSprites().find((s) => s.id === id) || null
  }

  /**
   * Load a sprite texture
   */
  async loadSprite(id: string): Promise<LoadedSprite> {
    // Return cached sprite if already loaded
    if (this.sprites.has(id)) {
      return this.sprites.get(id)!
    }

    // Return existing loading promise if already loading
    if (this.loadingPromises.has(id)) {
      return this.loadingPromises.get(id)!
    }

    // Start loading
    const loadingPromise = this._loadSpriteInternal(id)
    this.loadingPromises.set(id, loadingPromise)

    try {
      const loadedSprite = await loadingPromise
      this.sprites.set(id, loadedSprite)
      return loadedSprite
    } finally {
      this.loadingPromises.delete(id)
    }
  }

  /**
   * Internal sprite loading logic
   */
  private async _loadSpriteInternal(id: string): Promise<LoadedSprite> {
    const metadata = this.getSpriteMetadata(id)

    if (!metadata) {
      const error = `Sprite not found in manifest: ${id}`
      console.error(`[SpriteManager] ${error}`)
      return {
        metadata: {
          id,
          category: SpriteCategory.ICON,
          name: 'Unknown',
          src: '',
          width: 32,
          height: 32,
        },
        loaded: false,
        error,
      }
    }

    try {
      // Load texture using PixiJS
      const texture = await PIXI.Assets.load(metadata.src)

      console.log(`[SpriteManager] Loaded sprite: ${id}`)

      return {
        metadata,
        texture,
        loaded: true,
      }
    } catch (error) {
      const errorMsg = `Failed to load sprite: ${id}`
      console.error(`[SpriteManager] ${errorMsg}`, error)
      return {
        metadata,
        loaded: false,
        error: errorMsg,
      }
    }
  }

  /**
   * Load multiple sprites at once
   */
  async loadSprites(ids: string[]): Promise<LoadedSprite[]> {
    return Promise.all(ids.map((id) => this.loadSprite(id)))
  }

  /**
   * Preload all sprites in a category
   */
  async preloadCategory(category: SpriteCategory): Promise<void> {
    const sprites = this.getSpritesByCategory(category)
    const ids = sprites.map((s) => s.id)
    await this.loadSprites(ids)
    console.log(`[SpriteManager] Preloaded ${ids.length} sprites in ${category}`)
  }

  /**
   * Get loaded sprite (returns null if not loaded)
   */
  getLoadedSprite(id: string): LoadedSprite | null {
    return this.sprites.get(id) || null
  }

  /**
   * Get texture directly (returns null if not loaded)
   */
  getTexture(id: string): PIXI.Texture | null {
    const sprite = this.sprites.get(id)
    return sprite?.texture || null
  }

  /**
   * Check if sprite is loaded
   */
  isLoaded(id: string): boolean {
    return this.sprites.has(id) && this.sprites.get(id)!.loaded
  }

  /**
   * Unload a sprite to free memory
   */
  unloadSprite(id: string): void {
    const sprite = this.sprites.get(id)
    if (sprite?.texture) {
      sprite.texture.destroy(true)
    }
    this.sprites.delete(id)
  }

  /**
   * Unload all sprites
   */
  unloadAll(): void {
    this.sprites.forEach((sprite) => {
      if (sprite.texture) {
        sprite.texture.destroy(true)
      }
    })
    this.sprites.clear()
    console.log('[SpriteManager] Unloaded all sprites')
  }

  /**
   * Add a sprite to the manifest at runtime
   * (Useful for dynamically generated sprites)
   */
  addSprite(metadata: SpriteMetadata): void {
    if (!this.manifest) {
      this.manifest = {
        version: '1.0.0',
        lastUpdated: new Date().toISOString(),
        sprites: [],
      }
    }

    // Remove existing sprite with same ID
    this.manifest.sprites = this.manifest.sprites.filter(
      (s) => s.id !== metadata.id
    )

    // Add new sprite
    this.manifest.sprites.push(metadata)

    console.log(`[SpriteManager] Added sprite to manifest: ${metadata.id}`)
  }

  /**
   * Get statistics
   */
  getStats(): {
    totalSprites: number
    loadedSprites: number
    categoryCounts: Record<string, number>
  } {
    const categoryCounts: Record<string, number> = {}

    this.getAllSprites().forEach((sprite) => {
      categoryCounts[sprite.category] = (categoryCounts[sprite.category] || 0) + 1
    })

    return {
      totalSprites: this.getAllSprites().length,
      loadedSprites: this.sprites.size,
      categoryCounts,
    }
  }
}
