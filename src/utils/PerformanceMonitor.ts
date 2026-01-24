/**
 * PerformanceMonitor - Tracks game performance metrics
 */
export class PerformanceMonitor {
  private frameCount: number = 0
  private lastTime: number = performance.now()
  private fps: number = 0
  private frameTime: number = 0
  private frameHistory: number[] = []
  private maxHistorySize: number = 60 // Track last 60 frames
  private updateInterval: number = 500 // Update FPS every 500ms

  // Performance stats
  private stats = {
    fps: 0,
    avgFrameTime: 0,
    minFps: Infinity,
    maxFps: 0,
    entityCount: 0,
    particleCount: 0,
    physicsBodyCount: 0,
  }

  /**
   * Update performance tracking
   */
  update(deltaTime: number): void {
    const currentTime = performance.now()
    this.frameCount++

    // Track frame time
    this.frameHistory.push(deltaTime)
    if (this.frameHistory.length > this.maxHistorySize) {
      this.frameHistory.shift()
    }

    // Calculate average frame time
    this.frameTime =
      this.frameHistory.reduce((a, b) => a + b, 0) / this.frameHistory.length

    // Update FPS every interval
    if (currentTime - this.lastTime >= this.updateInterval) {
      const elapsed = currentTime - this.lastTime
      this.fps = (this.frameCount * 1000) / elapsed

      // Update stats
      this.stats.fps = Math.round(this.fps)
      this.stats.avgFrameTime = Math.round(this.frameTime * 100) / 100
      this.stats.minFps = Math.min(this.stats.minFps, this.stats.fps)
      this.stats.maxFps = Math.max(this.stats.maxFps, this.stats.fps)

      // Reset counters
      this.frameCount = 0
      this.lastTime = currentTime
    }
  }

  /**
   * Set entity count
   */
  setEntityCount(count: number): void {
    this.stats.entityCount = count
  }

  /**
   * Set particle count
   */
  setParticleCount(count: number): void {
    this.stats.particleCount = count
  }

  /**
   * Set physics body count
   */
  setPhysicsBodyCount(count: number): void {
    this.stats.physicsBodyCount = count
  }

  /**
   * Get current FPS
   */
  getFPS(): number {
    return this.stats.fps
  }

  /**
   * Get average frame time in milliseconds
   */
  getFrameTime(): number {
    return this.stats.avgFrameTime
  }

  /**
   * Get all statistics
   */
  getStats(): typeof this.stats {
    return { ...this.stats }
  }

  /**
   * Check if performance is good
   */
  isPerformanceGood(): boolean {
    return this.stats.fps >= 50 && this.stats.avgFrameTime <= 20
  }

  /**
   * Check if performance is degraded
   */
  isPerformancePoor(): boolean {
    return this.stats.fps < 30 || this.stats.avgFrameTime > 33
  }

  /**
   * Get performance grade (A-F)
   */
  getPerformanceGrade(): string {
    const fps = this.stats.fps
    if (fps >= 60) return 'A'
    if (fps >= 50) return 'B'
    if (fps >= 40) return 'C'
    if (fps >= 30) return 'D'
    return 'F'
  }

  /**
   * Reset statistics
   */
  reset(): void {
    this.frameCount = 0
    this.lastTime = performance.now()
    this.fps = 0
    this.frameTime = 0
    this.frameHistory = []
    this.stats = {
      fps: 0,
      avgFrameTime: 0,
      minFps: Infinity,
      maxFps: 0,
      entityCount: 0,
      particleCount: 0,
      physicsBodyCount: 0,
    }
  }

  /**
   * Log performance report to console
   */
  logReport(): void {
    console.log('[PerformanceMonitor] Report:')
    console.log(`  FPS: ${this.stats.fps} (min: ${this.stats.minFps}, max: ${this.stats.maxFps})`)
    console.log(`  Frame Time: ${this.stats.avgFrameTime}ms`)
    console.log(`  Entities: ${this.stats.entityCount}`)
    console.log(`  Particles: ${this.stats.particleCount}`)
    console.log(`  Physics Bodies: ${this.stats.physicsBodyCount}`)
    console.log(`  Grade: ${this.getPerformanceGrade()}`)
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor()
