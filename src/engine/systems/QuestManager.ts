import { QuestStatus } from '@models/events'
import type { Quest } from '@models/events'

/**
 * QuestManager - Manages quests and objectives
 *
 * Handles:
 * - Quest registration and tracking
 * - Objective progress updates
 * - Quest completion and rewards
 * - Quest state persistence
 */
export class QuestManager {
  private quests: Map<string, Quest> = new Map()
  private activeQuests: Set<string> = new Set()
  private completedQuests: Set<string> = new Set()

  /**
   * Register a quest
   */
  registerQuest(quest: Quest): void {
    this.quests.set(quest.id, quest)
    console.log(`[QuestManager] Registered quest: ${quest.name}`)
  }

  /**
   * Start a quest
   */
  startQuest(questId: string): boolean {
    const quest = this.quests.get(questId)
    if (!quest) {
      console.warn(`[QuestManager] Quest not found: ${questId}`)
      return false
    }

    if (quest.status !== QuestStatus.AVAILABLE) {
      console.warn(`[QuestManager] Quest not available: ${quest.name}`)
      return false
    }

    quest.status = QuestStatus.ACTIVE
    this.activeQuests.add(questId)

    console.log(`[QuestManager] Started quest: ${quest.name}`)
    return true
  }

  /**
   * Update objective progress
   */
  updateObjective(questId: string, objectiveId: string, progress: number): void {
    const quest = this.quests.get(questId)
    if (!quest || quest.status !== QuestStatus.ACTIVE) return

    const objective = quest.objectives.find((obj) => obj.id === objectiveId)
    if (!objective) return

    objective.current = Math.min(progress, objective.required)

    if (objective.current >= objective.required) {
      objective.completed = true
      console.log(`[QuestManager] Objective completed: ${objective.description}`)
    }

    // Check if all objectives are complete
    this.checkQuestCompletion(questId)
  }

  /**
   * Increment objective progress
   */
  incrementObjective(questId: string, objectiveId: string, amount: number = 1): void {
    const quest = this.quests.get(questId)
    if (!quest || quest.status !== QuestStatus.ACTIVE) return

    const objective = quest.objectives.find((obj) => obj.id === objectiveId)
    if (!objective || objective.completed) return

    this.updateObjective(questId, objectiveId, objective.current + amount)
  }

  /**
   * Check if quest is complete
   */
  private checkQuestCompletion(questId: string): void {
    const quest = this.quests.get(questId)
    if (!quest || quest.status !== QuestStatus.ACTIVE) return

    const allCompleted = quest.objectives.every((obj) => obj.completed)

    if (allCompleted) {
      this.completeQuest(questId)
    }
  }

  /**
   * Complete a quest
   */
  completeQuest(questId: string): void {
    const quest = this.quests.get(questId)
    if (!quest) return

    quest.status = QuestStatus.COMPLETED
    this.activeQuests.delete(questId)
    this.completedQuests.add(questId)

    console.log(`[QuestManager] Quest completed: ${quest.name}`)

    // Handle rewards (would integrate with game systems)
    if (quest.rewards) {
      console.log(`[QuestManager] Rewards: `, quest.rewards)
    }
  }

  /**
   * Fail a quest
   */
  failQuest(questId: string): void {
    const quest = this.quests.get(questId)
    if (!quest) return

    quest.status = QuestStatus.FAILED
    this.activeQuests.delete(questId)

    console.log(`[QuestManager] Quest failed: ${quest.name}`)
  }

  /**
   * Get all active quests
   */
  getActiveQuests(): Quest[] {
    return Array.from(this.activeQuests)
      .map((id) => this.quests.get(id))
      .filter((q): q is Quest => q !== undefined)
  }

  /**
   * Get all available quests
   */
  getAvailableQuests(): Quest[] {
    return Array.from(this.quests.values()).filter(
      (q) => q.status === QuestStatus.AVAILABLE
    )
  }

  /**
   * Get all completed quests
   */
  getCompletedQuests(): Quest[] {
    return Array.from(this.completedQuests)
      .map((id) => this.quests.get(id))
      .filter((q): q is Quest => q !== undefined)
  }

  /**
   * Get quest by ID
   */
  getQuest(questId: string): Quest | undefined {
    return this.quests.get(questId)
  }

  /**
   * Get quest progress
   */
  getProgress(questId: string): number {
    const quest = this.quests.get(questId)
    if (!quest) return 0

    const completedObjectives = quest.objectives.filter((obj) => obj.completed).length
    return (completedObjectives / quest.objectives.length) * 100
  }

  /**
   * Check if quest is available
   */
  isAvailable(questId: string): boolean {
    const quest = this.quests.get(questId)
    return quest?.status === QuestStatus.AVAILABLE
  }

  /**
   * Check if quest is active
   */
  isActive(questId: string): boolean {
    return this.activeQuests.has(questId)
  }

  /**
   * Check if quest is completed
   */
  isCompleted(questId: string): boolean {
    return this.completedQuests.has(questId)
  }

  /**
   * Get statistics
   */
  getStats(): {
    totalQuests: number
    activeQuests: number
    completedQuests: number
    failedQuests: number
  } {
    const failedQuests = Array.from(this.quests.values()).filter(
      (q) => q.status === QuestStatus.FAILED
    ).length

    return {
      totalQuests: this.quests.size,
      activeQuests: this.activeQuests.size,
      completedQuests: this.completedQuests.size,
      failedQuests,
    }
  }

  /**
   * Reset (for new game)
   */
  reset(): void {
    this.quests.forEach((quest) => {
      quest.status = QuestStatus.AVAILABLE
      quest.objectives.forEach((obj) => {
        obj.current = 0
        obj.completed = false
      })
    })
    this.activeQuests.clear()
    this.completedQuests.clear()
    console.log('[QuestManager] Reset')
  }
}
