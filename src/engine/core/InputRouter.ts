import type { Command } from '@models/index'

export type InputHandler = (event: Event) => Command | null

/**
 * InputRouter - The Controller in MVC
 * Determines if input was meant for UI or game world and routes accordingly
 */
export class InputRouter {
  private handlers: Map<string, Set<InputHandler>> = new Map()
  private isEnabled: boolean = true

  constructor() {
    this.setupEventListeners()
  }

  /**
   * Set up DOM event listeners
   */
  private setupEventListeners(): void {
    // Keyboard events
    window.addEventListener('keydown', this.handleKeyDown.bind(this))
    window.addEventListener('keyup', this.handleKeyUp.bind(this))

    // Mouse events
    window.addEventListener('mousedown', this.handleMouseDown.bind(this))
    window.addEventListener('mouseup', this.handleMouseUp.bind(this))
    window.addEventListener('mousemove', this.handleMouseMove.bind(this))
    window.addEventListener('wheel', this.handleWheel.bind(this))

    // Touch events for mobile
    window.addEventListener('touchstart', this.handleTouchStart.bind(this))
    window.addEventListener('touchend', this.handleTouchEnd.bind(this))
    window.addEventListener('touchmove', this.handleTouchMove.bind(this))
  }

  /**
   * Register an input handler for a specific event type
   */
  registerHandler(eventType: string, handler: InputHandler): () => void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set())
    }

    this.handlers.get(eventType)!.add(handler)

    // Return unregister function
    return () => {
      this.handlers.get(eventType)?.delete(handler)
    }
  }

  /**
   * Process an input event through registered handlers
   */
  private processEvent(eventType: string, event: Event): Command[] {
    if (!this.isEnabled) return []

    const handlers = this.handlers.get(eventType)
    if (!handlers) return []

    const commands: Command[] = []

    handlers.forEach((handler) => {
      const command = handler(event)
      if (command) {
        commands.push(command)
      }
    })

    return commands
  }

  /**
   * Handle keyboard down events
   */
  private handleKeyDown(event: KeyboardEvent): void {
    const commands = this.processEvent('keydown', event)
    commands.forEach((cmd) => this.emitCommand(cmd))
  }

  /**
   * Handle keyboard up events
   */
  private handleKeyUp(event: KeyboardEvent): void {
    const commands = this.processEvent('keyup', event)
    commands.forEach((cmd) => this.emitCommand(cmd))
  }

  /**
   * Handle mouse down events
   */
  private handleMouseDown(event: MouseEvent): void {
    const commands = this.processEvent('mousedown', event)
    commands.forEach((cmd) => this.emitCommand(cmd))
  }

  /**
   * Handle mouse up events
   */
  private handleMouseUp(event: MouseEvent): void {
    const commands = this.processEvent('mouseup', event)
    commands.forEach((cmd) => this.emitCommand(cmd))
  }

  /**
   * Handle mouse move events
   */
  private handleMouseMove(event: MouseEvent): void {
    const commands = this.processEvent('mousemove', event)
    commands.forEach((cmd) => this.emitCommand(cmd))
  }

  /**
   * Handle mouse wheel events
   */
  private handleWheel(event: WheelEvent): void {
    const commands = this.processEvent('wheel', event)
    commands.forEach((cmd) => this.emitCommand(cmd))
  }

  /**
   * Handle touch start events
   */
  private handleTouchStart(event: TouchEvent): void {
    const commands = this.processEvent('touchstart', event)
    commands.forEach((cmd) => this.emitCommand(cmd))
  }

  /**
   * Handle touch end events
   */
  private handleTouchEnd(event: TouchEvent): void {
    const commands = this.processEvent('touchend', event)
    commands.forEach((cmd) => this.emitCommand(cmd))
  }

  /**
   * Handle touch move events
   */
  private handleTouchMove(event: TouchEvent): void {
    const commands = this.processEvent('touchmove', event)
    commands.forEach((cmd) => this.emitCommand(cmd))
  }

  /**
   * Emit a command (to be connected to GameEngine)
   */
  private emitCommand(command: Command): void {
    // This will be connected to GameEngine.sendCommand in the main app
    console.log('[InputRouter] Command:', command)
  }

  /**
   * Enable input processing
   */
  enable(): void {
    this.isEnabled = true
  }

  /**
   * Disable input processing (useful for modals, loading screens, etc.)
   */
  disable(): void {
    this.isEnabled = false
  }

  /**
   * Check if input is enabled
   */
  getEnabled(): boolean {
    return this.isEnabled
  }

  /**
   * Clean up event listeners
   */
  destroy(): void {
    window.removeEventListener('keydown', this.handleKeyDown.bind(this))
    window.removeEventListener('keyup', this.handleKeyUp.bind(this))
    window.removeEventListener('mousedown', this.handleMouseDown.bind(this))
    window.removeEventListener('mouseup', this.handleMouseUp.bind(this))
    window.removeEventListener('mousemove', this.handleMouseMove.bind(this))
    window.removeEventListener('wheel', this.handleWheel.bind(this))
    window.removeEventListener('touchstart', this.handleTouchStart.bind(this))
    window.removeEventListener('touchend', this.handleTouchEnd.bind(this))
    window.removeEventListener('touchmove', this.handleTouchMove.bind(this))

    this.handlers.clear()
  }
}
