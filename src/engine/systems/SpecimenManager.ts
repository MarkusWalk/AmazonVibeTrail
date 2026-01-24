import type { Specimen, GuidebookEntry } from '@models/events'

/**
 * SpecimenManager - Manages specimen collection and guidebook
 *
 * Handles:
 * - Specimen registration and discovery
 * - Guidebook entry unlocking
 * - Collection tracking
 * - Rarity and value calculations
 */
export class SpecimenManager {
  private specimens: Map<string, Specimen> = new Map()
  private discoveredSpecimens: Set<string> = new Set()
  private guidebook: Map<string, GuidebookEntry> = new Map()
  private unlockedEntries: Set<string> = new Set()

  /**
   * Register a specimen
   */
  registerSpecimen(specimen: Specimen): void {
    this.specimens.set(specimen.id, specimen)
    console.log(`[SpecimenManager] Registered specimen: ${specimen.name}`)
  }

  /**
   * Register multiple specimens
   */
  registerSpecimens(specimens: Specimen[]): void {
    specimens.forEach((specimen) => this.registerSpecimen(specimen))
  }

  /**
   * Discover a specimen
   */
  discoverSpecimen(
    specimenId: string,
    location?: string,
    date?: string
  ): Specimen | null {
    const specimen = this.specimens.get(specimenId)
    if (!specimen) {
      console.warn(`[SpecimenManager] Specimen not found: ${specimenId}`)
      return null
    }

    if (this.discoveredSpecimens.has(specimenId)) {
      console.log(`[SpecimenManager] Specimen already discovered: ${specimen.name}`)
      return specimen
    }

    specimen.discoveredAt = location
    specimen.discoveredDate = date || new Date().toISOString()

    this.discoveredSpecimens.add(specimenId)
    console.log(`[SpecimenManager] Discovered specimen: ${specimen.name}`)

    // Unlock related guidebook entries
    this.unlockRelatedEntries(specimenId)

    return specimen
  }

  /**
   * Get all discovered specimens
   */
  getDiscoveredSpecimens(): Specimen[] {
    return Array.from(this.discoveredSpecimens)
      .map((id) => this.specimens.get(id))
      .filter((s): s is Specimen => s !== undefined)
  }

  /**
   * Get specimens by category
   */
  getSpecimensByCategory(
    category: Specimen['category']
  ): Specimen[] {
    return Array.from(this.specimens.values()).filter(
      (s) => s.category === category && this.discoveredSpecimens.has(s.id)
    )
  }

  /**
   * Get specimens by rarity
   */
  getSpecimensByRarity(rarity: Specimen['rarity']): Specimen[] {
    return Array.from(this.specimens.values()).filter(
      (s) => s.rarity === rarity && this.discoveredSpecimens.has(s.id)
    )
  }

  /**
   * Check if specimen is discovered
   */
  isDiscovered(specimenId: string): boolean {
    return this.discoveredSpecimens.has(specimenId)
  }

  /**
   * Get total collection value
   */
  getTotalValue(): number {
    return this.getDiscoveredSpecimens().reduce(
      (total, specimen) => total + specimen.value,
      0
    )
  }

  /**
   * Get collection completion percentage
   */
  getCompletionPercentage(): number {
    if (this.specimens.size === 0) return 0
    return (this.discoveredSpecimens.size / this.specimens.size) * 100
  }

  /**
   * Register a guidebook entry
   */
  registerGuidebookEntry(entry: GuidebookEntry): void {
    this.guidebook.set(entry.id, entry)
    console.log(`[SpecimenManager] Registered guidebook entry: ${entry.title}`)
  }

  /**
   * Unlock a guidebook entry
   */
  unlockEntry(entryId: string): boolean {
    const entry = this.guidebook.get(entryId)
    if (!entry) {
      console.warn(`[SpecimenManager] Guidebook entry not found: ${entryId}`)
      return false
    }

    if (this.unlockedEntries.has(entryId)) {
      return false // Already unlocked
    }

    entry.unlocked = true
    this.unlockedEntries.add(entryId)
    console.log(`[SpecimenManager] Unlocked guidebook entry: ${entry.title}`)

    return true
  }

  /**
   * Unlock related guidebook entries for a specimen
   */
  private unlockRelatedEntries(specimenId: string): void {
    for (const entry of this.guidebook.values()) {
      if (entry.relatedSpecimens?.includes(specimenId)) {
        this.unlockEntry(entry.id)
      }
    }
  }

  /**
   * Get all unlocked guidebook entries
   */
  getUnlockedEntries(): GuidebookEntry[] {
    return Array.from(this.unlockedEntries)
      .map((id) => this.guidebook.get(id))
      .filter((e): e is GuidebookEntry => e !== undefined)
  }

  /**
   * Get entries by category
   */
  getEntriesByCategory(
    category: GuidebookEntry['category']
  ): GuidebookEntry[] {
    return Array.from(this.guidebook.values()).filter(
      (e) => e.category === category && this.unlockedEntries.has(e.id)
    )
  }

  /**
   * Get guidebook entry
   */
  getEntry(entryId: string): GuidebookEntry | undefined {
    return this.guidebook.get(entryId)
  }

  /**
   * Check if entry is unlocked
   */
  isEntryUnlocked(entryId: string): boolean {
    return this.unlockedEntries.has(entryId)
  }

  /**
   * Get statistics
   */
  getStats(): {
    totalSpecimens: number
    discoveredSpecimens: number
    totalGuidebookEntries: number
    unlockedEntries: number
    collectionValue: number
    completionPercentage: number
  } {
    return {
      totalSpecimens: this.specimens.size,
      discoveredSpecimens: this.discoveredSpecimens.size,
      totalGuidebookEntries: this.guidebook.size,
      unlockedEntries: this.unlockedEntries.size,
      collectionValue: this.getTotalValue(),
      completionPercentage: this.getCompletionPercentage(),
    }
  }

  /**
   * Reset (for new game)
   */
  reset(): void {
    this.discoveredSpecimens.clear()
    this.unlockedEntries.clear()
    this.guidebook.forEach((entry) => {
      entry.unlocked = false
    })
    console.log('[SpecimenManager] Reset')
  }
}
