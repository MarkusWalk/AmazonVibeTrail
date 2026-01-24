/**
 * UIEventManager - Manages UI overlay state and events
 * Allows the game engine to trigger UI overlays without directly coupling to React
 */

export type UIOverlayType =
  | 'dialogue'
  | 'trade'
  | 'inventory'
  | 'map'
  | 'guidebook'
  | 'pause'
  | 'gameOver'
  | null

export interface DialogueData {
  dialogueId: string
  characterName?: string
  portrait?: string
}

export interface TradeData {
  merchantId: string
  merchantName?: string
}

export type UIEventData = DialogueData | TradeData | Record<string, unknown>

type UIEventListener = (overlay: UIOverlayType, data?: UIEventData) => void

/**
 * Singleton UI Event Manager
 */
class UIEventManagerClass {
  private listeners: Set<UIEventListener> = new Set()
  private currentOverlay: UIOverlayType = null
  private currentData: UIEventData | undefined

  /**
   * Subscribe to UI overlay events
   */
  subscribe(listener: UIEventListener): () => void {
    this.listeners.add(listener)
    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener)
    }
  }

  /**
   * Open a UI overlay
   */
  openOverlay(overlay: UIOverlayType, data?: UIEventData): void {
    this.currentOverlay = overlay
    this.currentData = data

    // Notify all listeners
    this.listeners.forEach((listener) => {
      listener(overlay, data)
    })

    console.log(`[UI] Opening overlay: ${overlay}`, data)
  }

  /**
   * Close current overlay
   */
  closeOverlay(): void {
    const previousOverlay = this.currentOverlay
    this.currentOverlay = null
    this.currentData = undefined

    // Notify all listeners
    this.listeners.forEach((listener) => {
      listener(null)
    })

    console.log(`[UI] Closed overlay: ${previousOverlay}`)
  }

  /**
   * Get current overlay
   */
  getCurrentOverlay(): UIOverlayType {
    return this.currentOverlay
  }

  /**
   * Get current overlay data
   */
  getCurrentData(): UIEventData | undefined {
    return this.currentData
  }

  /**
   * Check if any overlay is open
   */
  isOverlayOpen(): boolean {
    return this.currentOverlay !== null
  }
}

// Export singleton instance
export const UIEventManager = new UIEventManagerClass()
