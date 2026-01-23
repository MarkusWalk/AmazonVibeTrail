import { TriggerType } from '@models/events'
import type {
  GameEvent,
  EventTrigger,
  EventCondition,
  ActiveEvent,
  EventResult,
} from '@models/events'

/**
 * EventManager - Manages game events, triggers, and encounters
 *
 * Handles:
 * - Event registration and triggering
 * - Condition evaluation
 * - Event cooldowns and repeatability
 * - Active event tracking
 */
export class EventManager {
  private events: Map<string, GameEvent> = new Map()
  private activeEvents: Map<string, ActiveEvent> = new Map()
  private completedEvents: Set<string> = new Set()
  private flags: Map<string, boolean> = new Map()
  private eventCooldowns: Map<string, number> = new Map()

  /**
   * Register an event
   */
  registerEvent(event: GameEvent): void {
    this.events.set(event.id, event)
    console.log(`[EventManager] Registered event: ${event.id}`)
  }

  /**
   * Register multiple events
   */
  registerEvents(events: GameEvent[]): void {
    events.forEach((event) => this.registerEvent(event))
  }

  /**
   * Check for triggered events based on current game context
   */
  checkTriggers(context: GameContext): GameEvent[] {
    const triggeredEvents: GameEvent[] = []

    for (const event of this.events.values()) {
      // Skip if already active
      if (this.activeEvents.has(event.id)) continue

      // Skip if completed and not repeatable
      if (this.completedEvents.has(event.id) && !event.repeatable) continue

      // Skip if on cooldown
      if (this.isOnCooldown(event.id)) continue

      // Check if trigger conditions are met
      if (this.evaluateTrigger(event.trigger, context)) {
        triggeredEvents.push(event)
      }
    }

    return triggeredEvents
  }

  /**
   * Evaluate if a trigger should activate
   */
  private evaluateTrigger(trigger: EventTrigger, context: GameContext): boolean {
    // Check probability for random events
    if (trigger.type === TriggerType.RANDOM && trigger.probability) {
      if (Math.random() > trigger.probability) return false
    }

    // Evaluate all conditions
    if (trigger.conditions) {
      return trigger.conditions.every((condition) =>
        this.evaluateCondition(condition, context)
      )
    }

    // Check specific trigger types
    switch (trigger.type) {
      case TriggerType.LOCATION:
        return context.currentLocation !== undefined
      case TriggerType.COLLISION:
        return context.collisionEntity !== undefined
      case TriggerType.TIME:
        return context.gameTime !== undefined
      case TriggerType.DISTANCE:
        return context.distanceTraveled !== undefined
      case TriggerType.HEALTH:
        return context.health !== undefined
      default:
        return true
    }
  }

  /**
   * Evaluate a single condition
   */
  private evaluateCondition(
    condition: EventCondition,
    context: GameContext
  ): boolean {
    const { type, operator = 'equals', key, value } = condition

    switch (type) {
      case 'flag':
        return this.flags.get(key) === true

      case 'item':
        const itemCount = context.inventory?.get(key) || 0
        return this.compareValues(itemCount, value, operator)

      case 'health':
        return this.compareValues(context.health || 0, value, operator)

      case 'location':
        return context.currentLocation === key

      case 'distance':
        return this.compareValues(context.distanceTraveled || 0, value, operator)

      case 'time':
        return this.compareValues(context.gameTime || 0, value, operator)

      default:
        return false
    }
  }

  /**
   * Compare values with operator
   */
  private compareValues(
    actual: number | string,
    expected: unknown,
    operator: string
  ): boolean {
    switch (operator) {
      case 'equals':
        return actual === expected
      case 'greater':
        return Number(actual) > Number(expected)
      case 'less':
        return Number(actual) < Number(expected)
      case 'has':
        return actual !== undefined && actual !== null
      case 'not':
        return actual !== expected
      default:
        return false
    }
  }

  /**
   * Trigger an event
   */
  triggerEvent(eventId: string): void {
    const event = this.events.get(eventId)
    if (!event) {
      console.warn(`[EventManager] Event not found: ${eventId}`)
      return
    }

    const activeEvent: ActiveEvent = {
      eventId,
      triggeredAt: Date.now(),
      completed: false,
    }

    this.activeEvents.set(eventId, activeEvent)
    console.log(`[EventManager] Triggered event: ${event.name}`)

    // Start cooldown if specified
    if (event.cooldown) {
      this.eventCooldowns.set(eventId, Date.now() + event.cooldown)
    }
  }

  /**
   * Complete an event
   */
  completeEvent(eventId: string, result?: EventResult): void {
    const activeEvent = this.activeEvents.get(eventId)
    if (!activeEvent) return

    activeEvent.completed = true
    activeEvent.result = result

    this.activeEvents.delete(eventId)
    this.completedEvents.add(eventId)

    const event = this.events.get(eventId)
    console.log(`[EventManager] Completed event: ${event?.name || eventId}`)
  }

  /**
   * Check if event is on cooldown
   */
  private isOnCooldown(eventId: string): boolean {
    const cooldownEnd = this.eventCooldowns.get(eventId)
    if (!cooldownEnd) return false

    if (Date.now() < cooldownEnd) {
      return true
    }

    // Cooldown expired
    this.eventCooldowns.delete(eventId)
    return false
  }

  /**
   * Set a flag
   */
  setFlag(key: string, value: boolean = true): void {
    this.flags.set(key, value)
    console.log(`[EventManager] Flag set: ${key} = ${value}`)
  }

  /**
   * Get a flag
   */
  getFlag(key: string): boolean {
    return this.flags.get(key) || false
  }

  /**
   * Get active events
   */
  getActiveEvents(): ActiveEvent[] {
    return Array.from(this.activeEvents.values())
  }

  /**
   * Get event by ID
   */
  getEvent(eventId: string): GameEvent | undefined {
    return this.events.get(eventId)
  }

  /**
   * Check if event has been completed
   */
  isCompleted(eventId: string): boolean {
    return this.completedEvents.has(eventId)
  }

  /**
   * Reset all events (for new game)
   */
  reset(): void {
    this.activeEvents.clear()
    this.completedEvents.clear()
    this.flags.clear()
    this.eventCooldowns.clear()
    console.log('[EventManager] Reset')
  }

  /**
   * Get statistics
   */
  getStats(): {
    totalEvents: number
    activeEvents: number
    completedEvents: number
  } {
    return {
      totalEvents: this.events.size,
      activeEvents: this.activeEvents.size,
      completedEvents: this.completedEvents.size,
    }
  }
}

/**
 * Game context for event evaluation
 */
export interface GameContext {
  currentLocation?: string
  gameTime?: number
  distanceTraveled?: number
  health?: number
  rations?: number
  inventory?: Map<string, number>
  collisionEntity?: string
  [key: string]: unknown
}
