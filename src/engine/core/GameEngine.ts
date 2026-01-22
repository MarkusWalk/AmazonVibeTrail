import type { GameConfig, Command, GameState } from '@models/index'

export interface GameEngineEvents {
  stateChange: (newState: GameState) => void
  tick: (deltaTime: number) => void
  collision: (entityId: string) => void
  nodeArrival: (nodeId: string) => void
  discovery: (itemId: string) => void
}

/**
 * GameEngine - The central coordinator for the simulation
 * Manages the game loop, physics, and game state
 * This is the "Model" in MVC - no knowledge of rendering or UI
 */
export class GameEngine {
  private isRunning: boolean = false
  private isPaused: boolean = false
  private lastTickTime: number = 0
  private targetFPS: number = 60
  private tickInterval: number = 1000 / this.targetFPS
  private animationFrameId: number | null = null
  private commandQueue: Command[] = []
  private eventListeners: Map<string, Set<(...args: unknown[]) => void>> =
    new Map()

  constructor(private config: GameConfig) {
    this.tick = this.tick.bind(this)
  }

  /**
   * Initialize the engine with configuration
   */
  initialize(config?: Partial<GameConfig>): void {
    if (config) {
      this.config = { ...this.config, ...config }
    }
    console.log('[GameEngine] Initialized with config:', this.config)
  }

  /**
   * Start the game simulation loop
   */
  start(): void {
    if (this.isRunning) {
      console.warn('[GameEngine] Already running')
      return
    }

    this.isRunning = true
    this.isPaused = false
    this.lastTickTime = performance.now()
    this.gameLoop()
    console.log('[GameEngine] Started')
  }

  /**
   * Pause the simulation
   */
  pause(): void {
    this.isPaused = true
    console.log('[GameEngine] Paused')
  }

  /**
   * Resume from pause
   */
  resume(): void {
    if (!this.isRunning) {
      console.warn('[GameEngine] Cannot resume - engine not started')
      return
    }
    this.isPaused = false
    this.lastTickTime = performance.now()
    console.log('[GameEngine] Resumed')
  }

  /**
   * Stop the simulation completely
   */
  stop(): void {
    this.isRunning = false
    this.isPaused = false
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = null
    }
    console.log('[GameEngine] Stopped')
  }

  /**
   * Main game loop - uses requestAnimationFrame for smooth rendering
   */
  private gameLoop(): void {
    if (!this.isRunning) return

    const currentTime = performance.now()
    const deltaTime = currentTime - this.lastTickTime

    // Only tick if enough time has passed (frame limiting)
    if (deltaTime >= this.tickInterval) {
      this.tick(deltaTime)
      this.lastTickTime = currentTime - (deltaTime % this.tickInterval)
    }

    this.animationFrameId = requestAnimationFrame(() => this.gameLoop())
  }

  /**
   * Single simulation tick
   * This is where all game logic updates happen
   */
  private tick(deltaTime: number): void {
    if (this.isPaused) return

    // 1. Process input commands
    this.processCommands()

    // 2. Update physics
    this.updatePhysics(deltaTime)

    // 3. Check collisions
    this.checkCollisions()

    // 4. Resolve game state
    this.resolveState()

    // Emit tick event for systems that need to sync
    this.emit('tick', deltaTime)
  }

  /**
   * Process queued commands from the controller
   */
  private processCommands(): void {
    while (this.commandQueue.length > 0) {
      const command = this.commandQueue.shift()
      if (command) {
        this.handleCommand(command)
      }
    }
  }

  /**
   * Handle individual command
   */
  private handleCommand(command: Command): void {
    // TODO: Implement command handling based on command.type
    console.log('[GameEngine] Handling command:', command)
  }

  /**
   * Update physics state
   */
  private updatePhysics(_deltaTime: number): void {
    // TODO: Implement physics updates
    // This will integrate with Matter.js
  }

  /**
   * Check for collisions between entities
   */
  private checkCollisions(): void {
    // TODO: Implement collision detection
  }

  /**
   * Resolve game state after updates
   */
  private resolveState(): void {
    // TODO: Apply gameplay effects (damage, resource consumption, etc.)
  }

  /**
   * Send a command to the engine
   */
  sendCommand(type: string, payload?: unknown): void {
    this.commandQueue.push({ type, payload })
  }

  /**
   * Subscribe to engine events
   */
  subscribe<K extends keyof GameEngineEvents>(
    event: K,
    callback: GameEngineEvents[K]
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
   * Emit an event to all subscribers
   */
  private emit<K extends keyof GameEngineEvents>(
    event: K,
    ...args: Parameters<GameEngineEvents[K]>
  ): void {
    const listeners = this.eventListeners.get(event)
    if (listeners) {
      listeners.forEach((callback) => {
        callback(...args)
      })
    }
  }

  /**
   * Get current engine state (for debugging)
   */
  getState(): {
    isRunning: boolean
    isPaused: boolean
    targetFPS: number
  } {
    return {
      isRunning: this.isRunning,
      isPaused: this.isPaused,
      targetFPS: this.targetFPS,
    }
  }
}
