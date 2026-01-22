import { GameState } from '@models/index'

export interface StateManagerEvents {
  stateChange: (oldState: GameState, newState: GameState) => void
}

/**
 * StateManager - Controls high-level application flow
 * Manages transitions between different game screens/states
 */
export class StateManager {
  private currentState: GameState = GameState.BOOT
  private stateHistory: GameState[] = []
  private eventListeners: Map<string, Set<(...args: unknown[]) => void>> =
    new Map()

  constructor() {
    this.stateHistory.push(GameState.BOOT)
  }

  /**
   * Get the current game state
   */
  getCurrentState(): GameState {
    return this.currentState
  }

  /**
   * Transition to a new state
   */
  setState(newState: GameState): void {
    if (newState === this.currentState) {
      console.warn('[StateManager] Already in state:', newState)
      return
    }

    const oldState = this.currentState
    this.currentState = newState
    this.stateHistory.push(newState)

    console.log(`[StateManager] State transition: ${oldState} -> ${newState}`)

    // Emit state change event
    this.emit('stateChange', oldState, newState)
  }

  /**
   * Go back to the previous state
   */
  goBack(): void {
    if (this.stateHistory.length <= 1) {
      console.warn('[StateManager] Cannot go back - no previous state')
      return
    }

    // Remove current state
    this.stateHistory.pop()

    // Get previous state
    const previousState = this.stateHistory[this.stateHistory.length - 1]
    this.setState(previousState)
  }

  /**
   * Check if we can go back
   */
  canGoBack(): boolean {
    return this.stateHistory.length > 1
  }

  /**
   * Get state history
   */
  getHistory(): GameState[] {
    return [...this.stateHistory]
  }

  /**
   * Check if currently in a specific state
   */
  isInState(state: GameState): boolean {
    return this.currentState === state
  }

  /**
   * Subscribe to state change events
   */
  subscribe<K extends keyof StateManagerEvents>(
    event: K,
    callback: StateManagerEvents[K]
  ): () => void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set())
    }

    const listeners = this.eventListeners.get(event)!
    listeners.add(callback as (...args: unknown[]) => void)

    // Return unsubscribe function
    return () => {
      listeners.delete(callback as (...args: unknown[]) => void)
    }
  }

  /**
   * Emit an event
   */
  private emit<K extends keyof StateManagerEvents>(
    event: K,
    ...args: Parameters<StateManagerEvents[K]>
  ): void {
    const listeners = this.eventListeners.get(event)
    if (listeners) {
      listeners.forEach((callback) => {
        callback(...args)
      })
    }
  }

  /**
   * Reset to initial state
   */
  reset(): void {
    const oldState = this.currentState
    this.currentState = GameState.BOOT
    this.stateHistory = [GameState.BOOT]
    console.log('[StateManager] Reset to BOOT state')
    this.emit('stateChange', oldState, GameState.BOOT)
  }
}
