import { useEffect, useRef, useState } from 'react'
import { StateManager } from '@engine/core'
import { Game } from '@engine/Game'
import { PixiRenderer } from '@rendering/pixi'
import { GameState } from '@models/index'
import './App.css'

function App() {
  const [gameState, setGameState] = useState<GameState>(GameState.BOOT)
  const [stats, setStats] = useState({
    score: 0,
    health: 100,
    lives: 3,
    distance: 0,
    combo: 0,
    speed: 0,
  })
  const canvasContainerRef = useRef<HTMLDivElement>(null)
  const gameRef = useRef<Game | null>(null)
  const rendererRef = useRef<PixiRenderer | null>(null)
  const stateManagerRef = useRef<StateManager | null>(null)

  useEffect(() => {
    // Initialize state manager
    const stateManager = new StateManager()
    stateManagerRef.current = stateManager

    // Subscribe to state changes
    stateManager.subscribe('stateChange', (_oldState, newState) => {
      setGameState(newState)
    })

    // Transition to menu after boot
    setTimeout(() => {
      stateManager.setState(GameState.MENU)
    }, 1000)

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy()
      }
      if (rendererRef.current) {
        rendererRef.current.destroy()
      }
    }
  }, [])

  const handleStartGame = async () => {
    if (!canvasContainerRef.current || !stateManagerRef.current) return

    // Clear any existing game/renderer
    if (gameRef.current) {
      gameRef.current.destroy()
    }
    if (rendererRef.current) {
      rendererRef.current.destroy()
    }

    // Create renderer
    const renderer = new PixiRenderer({
      width: 800,
      height: 600,
      backgroundColor: 0x4a90a4, // River blue
      antialias: true,
    })
    await renderer.initialize(canvasContainerRef.current)
    rendererRef.current = renderer

    // Add UI text
    renderer.addText('score', 'Score: 0', 10, 10, {
      fontSize: 18,
      fill: 0xffffff,
    })
    renderer.addText('health', 'Health: 100', 10, 35, {
      fontSize: 18,
      fill: 0xffffff,
    })
    renderer.addText('lives', 'Lives: 3', 10, 60, {
      fontSize: 18,
      fill: 0xffffff,
    })
    renderer.addText('distance', 'Distance: 0m', 10, 85, {
      fontSize: 18,
      fill: 0xffffff,
    })
    renderer.addText('speed', 'Speed: 0.0 m/s', 10, 110, {
      fontSize: 18,
      fill: 0xffffff,
    })
    renderer.addText('combo', '', 10, 135, {
      fontSize: 20,
      fill: 0xffff00,
    })
    renderer.addText('location', 'Location: Belém', 10, 165, {
      fontSize: 16,
      fill: 0x87ceeb,
    })
    renderer.addText('controls', 'Controls: WASD or Arrow Keys', 10, 570, {
      fontSize: 14,
      fill: 0xcccccc,
    })

    // Create game
    const game = new Game({
      audio: { masterVolume: 0.8, sfxEnabled: true },
      gameplay: { difficulty: 'EXPLORER', steeringSensitivity: 1.0 },
      ui: { highContrast: false, tooltipDelay: 500 },
    })
    game.setRenderer(renderer)
    gameRef.current = game

    // Start game
    await game.start()

    // Update UI stats periodically
    const statsInterval = setInterval(() => {
      if (gameRef.current) {
        const playerStats = gameRef.current.getPlayerStats()
        if (playerStats) {
          setStats({
            score: gameRef.current.getScore(),
            health: playerStats.health,
            lives: playerStats.lives,
            distance: playerStats.distance,
            combo: playerStats.combo,
            speed: playerStats.speed,
          })
        }
      }
    }, 100)

    // Transition to river state
    stateManagerRef.current.setState(GameState.RIVER)

    return () => {
      clearInterval(statsInterval)
    }
  }

  const handlePauseGame = () => {
    if (gameRef.current) {
      gameRef.current.pause()
    }
  }

  const handleResumeGame = () => {
    if (gameRef.current) {
      gameRef.current.resume()
    }
  }

  const handleStopGame = () => {
    if (gameRef.current) {
      gameRef.current.stop()
    }
    if (stateManagerRef.current) {
      stateManagerRef.current.setState(GameState.MENU)
    }
  }

  return (
    <div className="app">
      <div className="app-header">
        <h1>🌴 Amazon Vibe Trail 🌴</h1>
        <p className="subtitle">
          Navigate the Amazon River - Avoid obstacles, survive!
        </p>
      </div>

      <div className="app-content">
        {gameState === GameState.BOOT && (
          <div className="boot-screen">
            <div className="loading-spinner"></div>
            <p>Loading game assets...</p>
          </div>
        )}

        {gameState === GameState.MENU && (
          <div className="menu-screen">
            <div className="game-info">
              <h2>How to Play</h2>
              <ul>
                <li>🛶 Use WASD or Arrow Keys to steer your canoe</li>
                <li>🪵 Avoid obstacles (logs, rocks, branches)</li>
                <li>🌀 Whirlpools will pull you in and deal damage</li>
                <li>🐟 Collect fish and items for bonuses</li>
                <li>❤️ You have 3 lives - keep health above zero</li>
                <li>⭐ Build combos for bonus points</li>
                <li>🚀 Speed boosts make you temporarily faster</li>
              </ul>
            </div>
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
            <div className="game-stats">
              <div className="stat">
                <span className="stat-label">Score</span>
                <span className="stat-value">{stats.score}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Lives</span>
                <span className="stat-value">{'❤️'.repeat(stats.lives)}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Health</span>
                <span
                  className="stat-value"
                  style={{
                    color:
                      stats.health > 60
                        ? '#90ee90'
                        : stats.health > 30
                          ? '#ffff00'
                          : '#ff0000',
                  }}
                >
                  {stats.health}
                </span>
              </div>
              <div className="stat">
                <span className="stat-label">Distance</span>
                <span className="stat-value">{stats.distance}m</span>
              </div>
              {stats.combo > 0 && (
                <div className="stat combo">
                  <span className="stat-label">Combo</span>
                  <span className="stat-value" style={{ color: '#ffff00' }}>
                    x{stats.combo}
                  </span>
                </div>
              )}
            </div>

            <div className="game-canvas" ref={canvasContainerRef}></div>

            <div className="game-controls">
              <button onClick={handlePauseGame}>⏸️ Pause</button>
              <button onClick={handleResumeGame}>▶️ Resume</button>
              <button onClick={handleStopGame}>⏹️ Stop</button>
            </div>
          </div>
        )}
      </div>

      <div className="app-footer">
        <p>Phase 1: Core Game Loop Complete ✅</p>
        <p>Physics, Rendering, and Controls Working!</p>
      </div>
    </div>
  )
}

export default App
