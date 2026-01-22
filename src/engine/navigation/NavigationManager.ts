import type {
  MapGraph,
  MapNode,
  RiverSegment,
  NavigationState,
  ForkChoice,
} from '@models/navigation'
import type { Vector2D } from '@models/index'

/**
 * NavigationManager - Manages the map graph and player navigation
 * Tracks position on river segments and handles fork choices
 */
export class NavigationManager {
  private mapGraph: MapGraph
  private navigationState: NavigationState
  private currentSegment: RiverSegment | null = null
  private upcomingFork: ForkChoice[] | null = null
  private forkDecisionDistance: number = 200 // Distance before fork to show choices

  constructor(mapGraph: MapGraph, startNodeId: string) {
    this.mapGraph = mapGraph
    this.navigationState = {
      currentNodeId: startNodeId,
      targetNodeId: null,
      currentSegmentId: null,
      distanceOnSegment: 0,
      totalSegmentLength: 0,
      progressPercent: 0,
    }
  }

  /**
   * Start traveling to a target node
   */
  setTarget(targetNodeId: string): boolean {
    const targetNode = this.getNode(targetNodeId)
    if (!targetNode) {
      console.error(`[NavigationManager] Target node not found: ${targetNodeId}`)
      return false
    }

    // Find a path from current node to target
    const segment = this.findSegmentFromCurrentNode(targetNodeId)
    if (!segment) {
      console.error(
        `[NavigationManager] No direct segment to ${targetNodeId}`
      )
      return false
    }

    this.navigationState.targetNodeId = targetNodeId
    this.navigationState.currentSegmentId = segment.id
    this.navigationState.distanceOnSegment = 0
    this.navigationState.totalSegmentLength = segment.distance
    this.currentSegment = segment

    console.log(
      `[NavigationManager] Traveling from ${this.navigationState.currentNodeId} to ${targetNodeId}`
    )
    return true
  }

  /**
   * Update navigation progress
   */
  update(distanceTraveled: number): void {
    if (!this.currentSegment || !this.navigationState.currentSegmentId) {
      return
    }

    this.navigationState.distanceOnSegment += distanceTraveled

    // Calculate progress percentage
    this.navigationState.progressPercent =
      (this.navigationState.distanceOnSegment /
        this.navigationState.totalSegmentLength) *
      100

    // Check if we've reached the target node
    if (
      this.navigationState.distanceOnSegment >=
      this.navigationState.totalSegmentLength
    ) {
      this.arriveAtNode(this.navigationState.targetNodeId!)
    }

    // Check for upcoming forks
    const distanceRemaining =
      this.navigationState.totalSegmentLength -
      this.navigationState.distanceOnSegment

    if (distanceRemaining <= this.forkDecisionDistance && !this.upcomingFork) {
      this.checkForFork()
    }
  }

  /**
   * Arrive at a node
   */
  private arriveAtNode(nodeId: string): void {
    console.log(`[NavigationManager] Arrived at node: ${nodeId}`)

    this.navigationState.currentNodeId = nodeId
    this.navigationState.targetNodeId = null
    this.navigationState.currentSegmentId = null
    this.navigationState.distanceOnSegment = 0
    this.navigationState.totalSegmentLength = 0
    this.navigationState.progressPercent = 0
    this.currentSegment = null
    this.upcomingFork = null
  }

  /**
   * Check if there's a fork ahead
   */
  private checkForFork(): void {
    if (!this.navigationState.targetNodeId) return

    const targetNode = this.getNode(this.navigationState.targetNodeId)
    if (!targetNode) return

    // Find all segments leaving the target node
    const outgoingSegments = this.getOutgoingSegments(
      this.navigationState.targetNodeId
    )

    if (outgoingSegments.length > 1) {
      // There's a fork!
      this.upcomingFork = outgoingSegments.map((segment, index) => {
        const toNode = this.getNode(segment.toNodeId)!
        const directions: Array<'left' | 'right' | 'center'> = [
          'left',
          'center',
          'right',
        ]
        const direction = directions[Math.min(index, 2)]

        return {
          segmentId: segment.id,
          toNodeId: segment.toNodeId,
          direction,
          description: `${direction.toUpperCase()}: ${toNode.name}`,
        }
      })

      console.log('[NavigationManager] Fork detected:', this.upcomingFork)
    }
  }

  /**
   * Make a choice at a fork
   */
  chooseFork(segmentId: string): boolean {
    if (!this.upcomingFork) {
      console.warn('[NavigationManager] No fork to choose from')
      return false
    }

    const choice = this.upcomingFork.find((c) => c.segmentId === segmentId)
    if (!choice) {
      console.error('[NavigationManager] Invalid fork choice')
      return false
    }

    // Set the new target
    const success = this.setTarget(choice.toNodeId)
    this.upcomingFork = null

    return success
  }

  /**
   * Auto-choose the first fork option (default behavior)
   */
  autoChooseFork(): void {
    if (this.upcomingFork && this.upcomingFork.length > 0) {
      this.chooseFork(this.upcomingFork[0].segmentId)
    }
  }

  /**
   * Get river current for the current segment
   */
  getCurrentFlow(): Vector2D {
    if (!this.currentSegment) {
      return { x: 0, y: 0 }
    }

    return {
      x:
        this.currentSegment.currentDirection.x *
        this.currentSegment.currentSpeed,
      y:
        this.currentSegment.currentDirection.y *
        this.currentSegment.currentSpeed,
    }
  }

  /**
   * Get a node by ID
   */
  getNode(nodeId: string): MapNode | undefined {
    return this.mapGraph.nodes.find((n) => n.id === nodeId)
  }

  /**
   * Get a segment by ID
   */
  getSegment(segmentId: string): RiverSegment | undefined {
    return this.mapGraph.segments.find((s) => s.id === segmentId)
  }

  /**
   * Find a segment from the current node to a target node
   */
  private findSegmentFromCurrentNode(
    targetNodeId: string
  ): RiverSegment | undefined {
    return this.mapGraph.segments.find(
      (s) =>
        s.fromNodeId === this.navigationState.currentNodeId &&
        s.toNodeId === targetNodeId
    )
  }

  /**
   * Get all outgoing segments from a node
   */
  private getOutgoingSegments(nodeId: string): RiverSegment[] {
    return this.mapGraph.segments.filter((s) => s.fromNodeId === nodeId)
  }

  /**
   * Get all incoming segments to a node
   */
  getIncomingSegments(nodeId: string): RiverSegment[] {
    return this.mapGraph.segments.filter((s) => s.toNodeId === nodeId)
  }

  /**
   * Get current navigation state
   */
  getState(): NavigationState {
    return { ...this.navigationState }
  }

  /**
   * Get current segment
   */
  getCurrentSegment(): RiverSegment | null {
    return this.currentSegment
  }

  /**
   * Get upcoming fork choices
   */
  getUpcomingFork(): ForkChoice[] | null {
    return this.upcomingFork
  }

  /**
   * Check if at a settlement
   */
  isAtSettlement(): boolean {
    if (!this.navigationState.currentNodeId) return false

    const node = this.getNode(this.navigationState.currentNodeId)
    return node?.hasSettlement === true
  }

  /**
   * Get current node
   */
  getCurrentNode(): MapNode | null {
    if (!this.navigationState.currentNodeId) return null
    return this.getNode(this.navigationState.currentNodeId) || null
  }

  /**
   * Get all nodes in the map
   */
  getAllNodes(): MapNode[] {
    return this.mapGraph.nodes
  }

  /**
   * Get all segments in the map
   */
  getAllSegments(): RiverSegment[] {
    return this.mapGraph.segments
  }
}
