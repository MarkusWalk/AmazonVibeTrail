// Core game types

export interface Vector2D {
  x: number
  y: number
}

export interface Entity {
  id: string
  position: Vector2D
  velocity: Vector2D
  type: EntityType
}

export enum EntityType {
  PLAYER = 'PLAYER',
  OBSTACLE = 'OBSTACLE',
  COLLECTIBLE = 'COLLECTIBLE',
  NPC = 'NPC',
}

export enum GameState {
  BOOT = 'BOOT',
  MENU = 'MENU',
  RIVER = 'RIVER',
  MAP = 'MAP',
  DIALOGUE = 'DIALOGUE',
  INVENTORY = 'INVENTORY',
  TRADE = 'TRADE',
  PAUSED = 'PAUSED',
}

export interface PlayerProfile {
  health: number
  rations: number
  statusEffects: string[]
  inventory: Inventory
  navigation: NavigationState
  score: number
}

export interface Inventory {
  harpoons: number
  quinine: number
  cameraFilm: number
  guidebookEntries: string[]
  tradeGoods: TradeGood[]
}

export interface TradeGood {
  id: string
  qty: number
}

export interface NavigationState {
  currentEra: string
  currentNodeId: string
  targetNodeId: string | null
  distanceOnSegment: number
  totalSegmentLength: number
}

export interface GameConfig {
  audio: AudioConfig
  gameplay: GameplayConfig
  ui: UIConfig
}

export interface AudioConfig {
  masterVolume: number
  sfxEnabled: boolean
}

export interface GameplayConfig {
  difficulty: 'EASY' | 'EXPLORER' | 'HARD'
  steeringSensitivity: number
}

export interface UIConfig {
  highContrast: boolean
  tooltipDelay: number
}

export type Command = {
  type: string
  payload?: unknown
}

// Export navigation types
export * from './navigation'

// Export sprite types
export * from './sprites'
