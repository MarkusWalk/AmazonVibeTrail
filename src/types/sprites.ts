/**
 * Sprite Type Definitions
 *
 * This system supports both external image files and AI-generated base64 sprites
 */

export enum SpriteCategory {
  NPC = 'NPC',
  ITEM = 'ITEM',
  CREATURE = 'CREATURE',
  ICON = 'ICON',
  ENVIRONMENT = 'ENVIRONMENT',
  UI = 'UI',
  PORTRAIT = 'PORTRAIT',
}

export interface SpriteMetadata {
  id: string
  category: SpriteCategory
  name: string
  description?: string

  // Image source - supports both file paths and base64 data URLs
  src: string // Path like '/sprites/npc/guide.png' or 'data:image/png;base64,...'

  // Dimensions
  width: number
  height: number

  // Optional sprite sheet info
  frameWidth?: number
  frameHeight?: number
  frameCount?: number

  // Animation info
  animated?: boolean
  fps?: number

  // Anchor point (0-1, default 0.5, 0.5 for center)
  anchorX?: number
  anchorY?: number

  // Tags for filtering/searching
  tags?: string[]

  // AI generation metadata (optional)
  generatedBy?: string // e.g., 'nano-banana', 'dalle', 'midjourney'
  prompt?: string // The prompt used to generate this sprite
  generatedAt?: string // ISO timestamp

  // Gameplay metadata
  rarity?: 'common' | 'uncommon' | 'rare' | 'legendary'
  value?: number // For items
}

export interface SpriteManifest {
  version: string
  lastUpdated: string
  sprites: SpriteMetadata[]
}

export interface SpriteAtlas {
  id: string
  src: string
  width: number
  height: number
  sprites: {
    id: string
    x: number
    y: number
    width: number
    height: number
  }[]
}

// For runtime sprite access
export interface LoadedSprite {
  metadata: SpriteMetadata
  texture?: any // PIXI.Texture or similar
  loaded: boolean
  error?: string
}
