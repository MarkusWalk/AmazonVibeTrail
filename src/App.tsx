import { useEffect, useRef, useState } from 'react'
import { GameEngine, StateManager } from '@engine/core'
import { GameState } from '@models/index'
import './App.css'

function App() {
  const [engineState, setEngineState] = useState<{
    isRunning: boolean
    isPaused: boolean
    targetFPS: number
  } | null>(null)
  const [gameState, setGameState] = useState<GameState>(GameState.BOOT)
  const engineRef = useRef<GameEngine | null>(null)
  const stateManagerRef = useRef<StateManager | null>(null)

  useEffect(() => {
    // Initialize game engine
    const engine = new GameEngine({
      audio: { masterVolume: 0.8, sfxEnabled: true },
      gameplay: { difficulty: 'EXPLORER', steeringSensitivity: 1.0 },
      ui: { highContrast: false, tooltipDelay: 500 },
    })

    engine.initialize()
    engineRef.current = engine

    // Initialize state manager
    const stateManager = new StateManager()
    stateManagerRef.current = stateManager

    // Subscribe to state changes
    stateManager.subscribe('stateChange', (_oldState, newState) => {
      setGameState(newState)
    })

    // Subscribe to engine ticks
    engine.subscribe('tick', (_deltaTime) => {
      // Update engine state display
      setEngineState(engine.getState())
    })

    // Transition to menu after boot
    setTimeout(() => {
      stateManager.setState(GameState.MENU)
    }, 1000)

    return () => {
      engine.stop()
    }
  }, [])

  const handleStartEngine = () => {
    if (engineRef.current) {
      engineRef.current.start()
      setEngineState(engineRef.current.getState())
    }
  }

  const handleStopEngine = () => {
    if (engineRef.current) {
      engineRef.current.stop()
      setEngineState(engineRef.current.getState())
    }
  }

  const handlePauseEngine = () => {
    if (engineRef.current) {
      engineRef.current.pause()
      setEngineState(engineRef.current.getState())
    }
  }

  const handleResumeEngine = () => {
    if (engineRef.current) {
      engineRef.current.resume()
      setEngineState(engineRef.current.getState())
    }
  }

  const handleStartGame = () => {
    if (stateManagerRef.current) {
      stateManagerRef.current.setState(GameState.RIVER)
      handleStartEngine()
    }
  }

  return (
    <div className="app">
      <div className="app-header">
        <h1>🌴 Amazon Vibe Trail 🌴</h1>
        <p className="subtitle">
          A modern recreation of the classic educational game
        </p>
      </div>

      <div className="app-content">
        <div className="state-display">
          <h2>Game State: {gameState}</h2>
          {engineState && (
            <div className="engine-info">
              <p>
                Engine Status:{' '}
                {engineState.isRunning ? '🟢 Running' : '🔴 Stopped'}
              </p>
              <p>
                Simulation: {engineState.isPaused ? '⏸️ Paused' : '▶️ Active'}
              </p>
              <p>Target FPS: {engineState.targetFPS}</p>
            </div>
          )}
        </div>

        {gameState === GameState.BOOT && (
          <div className="boot-screen">
            <div className="loading-spinner"></div>
            <p>Loading game assets...</p>
          </div>
        )}

        {gameState === GameState.MENU && (
          <div className="menu-screen">
            <div className="menu-buttons">
              <button className="menu-button primary" onClick={handleStartGame}>
                Start New Journey
              </button>
              <button className="menu-button" disabled>
                Load Game
              </button>
              <button className="menu-button" disabled>
                Options
              </button>
              <button className="menu-button" disabled>
                Credits
              </button>
            </div>
          </div>
        )}

        {gameState === GameState.RIVER && (
          <div className="river-screen">
            <div className="game-canvas">
              <p className="canvas-placeholder">
                🛶 River View - Canvas will render here
              </p>
              <p className="dev-note">
                PixiJS canvas integration coming in next phase
              </p>
            </div>

            <div className="engine-controls">
              <h3>Engine Controls (Debug)</h3>
              <div className="control-buttons">
                {engineState?.isPaused ? (
                  <button onClick={handleResumeEngine}>Resume</button>
                ) : (
                  <button onClick={handlePauseEngine}>Pause</button>
                )}
                <button onClick={handleStopEngine}>Stop Engine</button>
                <button
                  onClick={() =>
                    stateManagerRef.current?.setState(GameState.MENU)
                  }
                >
                  Back to Menu
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="app-footer">
        <p>Phase 0: Project Setup Complete ✅</p>
        <p>Next: Implement PixiJS rendering and physics</p>
      </div>
    </div>
  )
}

export default App
