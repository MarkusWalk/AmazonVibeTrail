/**
 * ObjectPool - Generic object pooling for performance
 * Reduces garbage collection by reusing objects
 */
export class ObjectPool<T> {
  private available: T[] = []
  private inUse: Set<T> = new Set()
  private factory: () => T
  private reset: (obj: T) => void
  private maxSize: number

  constructor(
    factory: () => T,
    reset: (obj: T) => void,
    initialSize: number = 10,
    maxSize: number = 100
  ) {
    this.factory = factory
    this.reset = reset
    this.maxSize = maxSize

    // Pre-create initial pool
    for (let i = 0; i < initialSize; i++) {
      this.available.push(factory())
    }
  }

  /**
   * Get an object from the pool
   */
  acquire(): T {
    let obj: T

    if (this.available.length > 0) {
      obj = this.available.pop()!
    } else {
      // Pool empty, create new object if under max size
      if (this.inUse.size < this.maxSize) {
        obj = this.factory()
      } else {
        // Pool at max size, force reuse oldest object
        console.warn('[ObjectPool] Pool at max size, forcing reuse')
        const iterator = this.inUse.values()
        const next = iterator.next()
        if (next.value) {
          obj = next.value
          this.inUse.delete(obj)
        } else {
          // Fallback: create new object
          obj = this.factory()
        }
      }
    }

    this.reset(obj)
    this.inUse.add(obj)
    return obj
  }

  /**
   * Return an object to the pool
   */
  release(obj: T): void {
    if (this.inUse.has(obj)) {
      this.inUse.delete(obj)
      this.available.push(obj)
    }
  }

  /**
   * Release all objects in use
   */
  releaseAll(): void {
    this.inUse.forEach((obj) => {
      this.available.push(obj)
    })
    this.inUse.clear()
  }

  /**
   * Get pool statistics
   */
  getStats(): { available: number; inUse: number; total: number } {
    return {
      available: this.available.length,
      inUse: this.inUse.size,
      total: this.available.length + this.inUse.size,
    }
  }

  /**
   * Clear the pool completely
   */
  clear(): void {
    this.available = []
    this.inUse.clear()
  }
}
