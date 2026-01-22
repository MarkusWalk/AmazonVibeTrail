import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { GameEngine } from '@engine/core/GameEngine'
import type { GameConfig } from '@models/index'

describe('GameEngine', () => {
  let engine: GameEngine
  let mockConfig: GameConfig

  beforeEach(() => {
    mockConfig = {
      audio: { masterVolume: 0.8, sfxEnabled: true },
      gameplay: { difficulty: 'EXPLORER', steeringSensitivity: 1.0 },
      ui: { highContrast: false, tooltipDelay: 500 },
    }
    engine = new GameEngine(mockConfig)
  })

  afterEach(() => {
    engine.stop()
  })

  describe('Initialization', () => {
    it('should create an engine instance', () => {
      expect(engine).toBeDefined()
    })

    it('should initialize with config', () => {
      engine.initialize()
      const state = engine.getState()
      expect(state).toBeDefined()
      expect(state.isRunning).toBe(false)
      expect(state.isPaused).toBe(false)
    })
  })

  describe('Lifecycle', () => {
    it('should start the engine', () => {
      engine.start()
      const state = engine.getState()
      expect(state.isRunning).toBe(true)
      expect(state.isPaused).toBe(false)
    })

    it('should pause the engine', () => {
      engine.start()
      engine.pause()
      const state = engine.getState()
      expect(state.isRunning).toBe(true)
      expect(state.isPaused).toBe(true)
    })

    it('should resume the engine', () => {
      engine.start()
      engine.pause()
      engine.resume()
      const state = engine.getState()
      expect(state.isRunning).toBe(true)
      expect(state.isPaused).toBe(false)
    })

    it('should stop the engine', () => {
      engine.start()
      engine.stop()
      const state = engine.getState()
      expect(state.isRunning).toBe(false)
      expect(state.isPaused).toBe(false)
    })
  })

  describe('Commands', () => {
    it('should accept commands', (done) => {
      const spy = vi.spyOn(console, 'log')
      engine.sendCommand('TEST_COMMAND', { data: 'test' })
      engine.start()

      // Wait for command to be processed on next tick
      setTimeout(() => {
        engine.stop()
        expect(spy).toHaveBeenCalled()
        done()
      }, 100)
    })
  })

  describe('Events', () => {
    it('should allow subscribing to events', () => {
      const callback = vi.fn()
      const unsubscribe = engine.subscribe('tick', callback)

      expect(unsubscribe).toBeInstanceOf(Function)
    })

    it('should emit tick events when running', (done) => {
      const callback = vi.fn(() => {
        if (callback.mock.calls.length >= 2) {
          engine.stop()
          expect(callback).toHaveBeenCalled()
          done()
        }
      })

      engine.subscribe('tick', callback)
      engine.start()
    })
  })

  describe('State', () => {
    it('should return current state', () => {
      const state = engine.getState()
      expect(state).toHaveProperty('isRunning')
      expect(state).toHaveProperty('isPaused')
      expect(state).toHaveProperty('targetFPS')
      expect(state.targetFPS).toBe(60)
    })
  })
})
