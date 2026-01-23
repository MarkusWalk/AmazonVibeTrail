/**
 * Dialogue System Types
 */

export interface DialogueNode {
  id: string
  speaker: string // NPC name
  portrait?: string // Sprite ID for portrait
  text: string
  choices?: DialogueChoice[]
  nextNodeId?: string | null // Auto-advance if no choices, null = end dialogue
  onComplete?: string // Event to trigger when this node completes
  effect?: DialogueEffect // Effect to apply when this node is shown
}

export interface DialogueChoice {
  id: string
  text: string
  nextNodeId: string | null // null = end dialogue
  condition?: string // Optional condition to show this choice
  effect?: DialogueEffect
}

export interface DialogueEffect {
  type: 'add_item' | 'remove_item' | 'change_health' | 'change_rations' | 'unlock_location'
  payload: unknown
}

export interface DialogueTree {
  id: string
  name: string
  startNodeId: string
  nodes: DialogueNode[]
}

export interface DialogueState {
  currentTreeId: string | null
  currentNodeId: string | null
  visitedNodes: string[]
  variables: Record<string, unknown>
}
