/**
 * Event System Types
 *
 * Defines game events, triggers, and conditions for dynamic encounters
 */

export enum EventType {
  DIALOGUE = 'DIALOGUE',
  HAZARD = 'HAZARD',
  DISCOVERY = 'DISCOVERY',
  TRADE = 'TRADE',
  QUEST = 'QUEST',
  ENCOUNTER = 'ENCOUNTER',
  ENVIRONMENTAL = 'ENVIRONMENTAL',
}

export enum TriggerType {
  LOCATION = 'LOCATION',
  COLLISION = 'COLLISION',
  RANDOM = 'RANDOM',
  TIME = 'TIME',
  DISTANCE = 'DISTANCE',
  HEALTH = 'HEALTH',
  ITEM = 'ITEM',
}

export interface EventCondition {
  type: 'flag' | 'item' | 'health' | 'location' | 'distance' | 'time'
  operator?: 'equals' | 'greater' | 'less' | 'has' | 'not'
  key: string
  value?: unknown
}

export interface EventTrigger {
  type: TriggerType
  conditions?: EventCondition[]
  probability?: number // 0-1, for random events
}

export interface GameEvent {
  id: string
  name: string
  description?: string
  type: EventType
  trigger: EventTrigger
  data: EventData
  repeatable?: boolean
  cooldown?: number // ms before can trigger again
}

export interface EventData {
  // Dialogue event
  dialogueId?: string

  // Hazard event
  hazardType?: 'storm' | 'rapids' | 'whirlpool' | 'rocks'
  damage?: number

  // Discovery event
  discoveryType?: 'specimen' | 'location' | 'npc' | 'item'
  discoveryId?: string

  // Trade event
  merchantId?: string

  // Quest event
  questId?: string

  // Encounter event
  encounterId?: string

  // Generic data
  [key: string]: unknown
}

export interface EventResult {
  success: boolean
  message?: string
  effects?: EventEffect[]
}

export interface EventEffect {
  type: 'health' | 'rations' | 'item' | 'flag' | 'unlock' | 'quest'
  target: string
  value: unknown
}

export interface ActiveEvent {
  eventId: string
  triggeredAt: number
  completed: boolean
  result?: EventResult
}

// Quest/Mission types
export enum QuestStatus {
  AVAILABLE = 'AVAILABLE',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export interface QuestObjective {
  id: string
  description: string
  type: 'collect' | 'reach' | 'talk' | 'discover' | 'survive'
  target: string
  current: number
  required: number
  completed: boolean
}

export interface Quest {
  id: string
  name: string
  description: string
  giver?: string // NPC ID
  status: QuestStatus
  objectives: QuestObjective[]
  rewards?: QuestReward[]
  experience?: number
}

export interface QuestReward {
  type: 'item' | 'health' | 'rations' | 'unlock' | 'gold'
  target: string
  amount: number
}

// Specimen/Discovery types
export interface Specimen {
  id: string
  name: string
  scientificName?: string
  category: 'plant' | 'animal' | 'mineral' | 'artifact'
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary'
  description: string
  discoveredAt?: string // Location
  discoveredDate?: string
  image?: string // Sprite ID
  value: number
}

export interface GuidebookEntry {
  id: string
  title: string
  category: 'flora' | 'fauna' | 'culture' | 'history' | 'geography'
  content: string
  unlocked: boolean
  images?: string[]
  relatedSpecimens?: string[]
}
