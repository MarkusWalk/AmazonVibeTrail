/**
 * Map and Navigation type definitions
 */

export interface MapNode {
  id: string
  name: string
  type: NodeType
  coordinates: { x: number; y: number }
  eraRestriction: string | null // e.g., "1500s", "1900s", null = any era
  description?: string
  hasSettlement?: boolean
  hasTrade?: boolean
}

export enum NodeType {
  START = 'START',
  SETTLEMENT = 'SETTLEMENT',
  JUNCTION = 'JUNCTION', // Fork in the river
  LANDMARK = 'LANDMARK',
  DESTINATION = 'DESTINATION',
  WAYPOINT = 'WAYPOINT',
}

export interface RiverSegment {
  id: string
  fromNodeId: string
  toNodeId: string
  distance: number // In-game distance units
  difficulty: SegmentDifficulty
  biome: BiomeType
  currentSpeed: number // River current speed
  currentDirection: { x: number; y: number } // Normalized direction vector
  hazards?: string[] // e.g., ["rapids", "whirlpools"]
}

export enum SegmentDifficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
  EXTREME = 'EXTREME',
}

export enum BiomeType {
  RIVER_MAIN = 'RIVER_MAIN',
  RIVER_TRIBUTARY = 'RIVER_TRIBUTARY',
  RAPIDS = 'RAPIDS',
  JUNGLE_DEEP = 'JUNGLE_DEEP',
  FLOODPLAIN = 'FLOODPLAIN',
  DELTA = 'DELTA',
}

export interface MapGraph {
  nodes: MapNode[]
  segments: RiverSegment[]
}

export interface NavigationState {
  currentNodeId: string | null
  targetNodeId: string | null
  currentSegmentId: string | null
  distanceOnSegment: number // How far along the current segment
  totalSegmentLength: number
  progressPercent: number // 0-100
}

export interface ForkChoice {
  segmentId: string
  toNodeId: string
  direction: 'left' | 'right' | 'center'
  description: string
}
