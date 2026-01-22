import type { Entity } from '@engine/entities'
import type { EntityType } from '@models/index'

/**
 * EntityManager - Manages all game entities
 * Provides creation, update, and retrieval of entities
 */
export class EntityManager {
  private entities: Map<string, Entity> = new Map()
  private entitiesByType: Map<EntityType, Set<string>> = new Map()

  /**
   * Add an entity to the manager
   */
  addEntity(entity: Entity): void {
    this.entities.set(entity.id, entity)

    // Add to type index
    if (!this.entitiesByType.has(entity.type)) {
      this.entitiesByType.set(entity.type, new Set())
    }
    this.entitiesByType.get(entity.type)!.add(entity.id)

    console.log(`[EntityManager] Added entity: ${entity.id} (${entity.type})`)
  }

  /**
   * Remove an entity
   */
  removeEntity(entityId: string): void {
    const entity = this.entities.get(entityId)
    if (!entity) return

    // Remove from type index
    const typeSet = this.entitiesByType.get(entity.type)
    if (typeSet) {
      typeSet.delete(entityId)
    }

    // Clean up entity
    entity.destroy()

    // Remove from main map
    this.entities.delete(entityId)

    console.log(
      `[EntityManager] Removed entity: ${entityId} (${entity.type})`
    )
  }

  /**
   * Get an entity by ID
   */
  getEntity(entityId: string): Entity | undefined {
    return this.entities.get(entityId)
  }

  /**
   * Get all entities of a specific type
   */
  getEntitiesByType(type: EntityType): Entity[] {
    const ids = this.entitiesByType.get(type)
    if (!ids) return []

    return Array.from(ids)
      .map((id) => this.entities.get(id))
      .filter((entity): entity is Entity => entity !== undefined)
  }

  /**
   * Get all entities
   */
  getAllEntities(): Entity[] {
    return Array.from(this.entities.values())
  }

  /**
   * Get all active entities
   */
  getActiveEntities(): Entity[] {
    return Array.from(this.entities.values()).filter((entity) =>
      entity.isEntityActive()
    )
  }

  /**
   * Update all entities
   */
  updateAll(deltaTime: number): void {
    this.entities.forEach((entity) => {
      if (entity.isEntityActive()) {
        entity.update(deltaTime)
      }
    })
  }

  /**
   * Get entity count
   */
  getEntityCount(): number {
    return this.entities.size
  }

  /**
   * Get active entity count
   */
  getActiveEntityCount(): number {
    return this.getActiveEntities().length
  }

  /**
   * Clear all entities
   */
  clear(): void {
    this.entities.forEach((entity) => entity.destroy())
    this.entities.clear()
    this.entitiesByType.clear()
    console.log('[EntityManager] Cleared all entities')
  }

  /**
   * Check if entity exists
   */
  hasEntity(entityId: string): boolean {
    return this.entities.has(entityId)
  }

  /**
   * Get entities within a radius of a point
   */
  getEntitiesInRadius(
    x: number,
    y: number,
    radius: number
  ): Entity[] {
    return this.getActiveEntities().filter((entity) => {
      const pos = entity.getPosition()
      const dx = pos.x - x
      const dy = pos.y - y
      const distance = Math.sqrt(dx * dx + dy * dy)
      return distance <= radius
    })
  }
}
