import { Entity } from './Entity'
import { EntityType } from '@models/index'
import type { Vector2D } from '@models/index'
import type { ForkChoice } from '@models/navigation'

/**
 * Fork - Visual indicator for river branches
 * Allows player to choose which path to take
 */
export class Fork extends Entity {
  private choices: ForkChoice[]
  private selectedChoice: ForkChoice | null = null
  private isDecided: boolean = false

  constructor(id: string, position: Vector2D, choices: ForkChoice[]) {
    super(id, EntityType.NPC, position) // Using NPC type for non-collidable entities
    this.choices = choices
  }

  /**
   * Update fork state
   */
  update(_deltaTime: number): void {
    if (!this.isActive) return

    // Sync with physics
    this.syncWithPhysics()

    // Fork moves with river current
    if (this.physicsBody) {
      this.velocity.y += 0.01
    }
  }

  /**
   * Get available choices
   */
  getChoices(): ForkChoice[] {
    return this.choices
  }

  /**
   * Select a choice
   */
  selectChoice(choice: ForkChoice): void {
    this.selectedChoice = choice
    this.isDecided = true
    console.log(`[Fork] Choice selected: ${choice.description}`)
  }

  /**
   * Get selected choice
   */
  getSelectedChoice(): ForkChoice | null {
    return this.selectedChoice
  }

  /**
   * Check if decision has been made
   */
  isChoiceMade(): boolean {
    return this.isDecided
  }

  /**
   * Auto-select first choice (default behavior if player doesn't choose)
   */
  autoSelect(): void {
    if (this.choices.length > 0 && !this.isDecided) {
      this.selectChoice(this.choices[0])
    }
  }

  /**
   * Check if off-screen
   */
  isOffScreen(screenHeight: number): boolean {
    return this.position.y > screenHeight + 100 || this.position.y < -200
  }

  /**
   * Handle collision (shouldn't collide, just visual)
   */
  onCollision(_other: Entity): void {
    // Forks don't collide
  }
}
