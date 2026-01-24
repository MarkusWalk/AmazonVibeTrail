import { useEffect, useRef, useState } from 'react'
import { StateManager } from '@engine/core'
import { Game } from '@engine/Game'
import { PixiRenderer } from '@rendering/pixi'
import { GameState } from '@models/index'
import { Dashboard } from './ui/components/Dashboard'
import { Dialogue } from './ui/components/Dialogue'
import { Inventory } from './ui/components/Inventory'
import { InteractiveMap } from './ui/components/Map'
import { convertInventoryToItems } from '@data/items/itemDefinitions'
import { UIEventManager, type UIOverlayType, type UIEventData } from './ui/UIEventManager'
import type { QuickSlotItem, StatusEffect } from './ui/components/Dashboard'
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
    currentWeight: 0,
    maxWeight: 100,
  })
  const [playerInventory, setPlayerInventory] = useState<Map<string, number>>(new Map())
  const [rations, setRations] = useState(100)
  const [maxRations, setMaxRations] = useState(100)
  const [direction, setDirection] = useState(180) // Facing south (downstream)
  const [quickSlots] = useState<(QuickSlotItem | null)[]>([
    { id: 'harpoon', name: 'Harpoon', icon: '🔱', count: 5 },
    { id: 'health', name: 'Health Potion', icon: '🧪', count: 3 },
    { id: 'map', name: 'Map', icon: '🗺️' },
    null,
    null,
  ])
  const [selectedSlot, setSelectedSlot] = useState(0)
  const [statuses, setStatuses] = useState<StatusEffect[]>([])
  const [currentOverlay, setCurrentOverlay] = useState<UIOverlayType>(null)
  const [overlayData, setOverlayData] = useState<UIEventData | undefined>()
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

    // Subscribe to UI overlay events
    const unsubscribe = UIEventManager.subscribe((overlay, data) => {
      setCurrentOverlay(overlay)
      setOverlayData(data)
    })

    // Transition to menu after boot
    setTimeout(() => {
      stateManager.setState(GameState.MENU)
    }, 1000)

    return () => {
      unsubscribe()
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
            currentWeight: playerStats.currentWeight,
            maxWeight: playerStats.maxWeight,
          })

          // Update direction (convert radians to degrees if needed)
          const angle = playerStats.angle || 0
          setDirection((angle * 180 / Math.PI) + 180) // Convert to compass degrees

          // Update rations from player stats
          setRations(playerStats.rations)
          setMaxRations(playerStats.maxRations)

          // Update inventory
          const inventory = (gameRef.current as any).player?.getInventory()
          if (inventory) {
            setPlayerInventory(inventory)
          }

          // Update status effects based on player state
          const newStatuses: StatusEffect[] = []
          if (playerStats.speedBoostActive) {
            newStatuses.push({
              id: 'speed_boost',
              name: 'Speed Boost',
              icon: '⚡',
              duration: playerStats.speedBoostRemaining / 1000,
              type: 'buff'
            })
          }
          if (playerStats.invincible) {
            newStatuses.push({
              id: 'invincible',
              name: 'Invincible',
              icon: '🛡️',
              duration: playerStats.invincibilityRemaining / 1000,
              type: 'buff'
            })
          }
          setStatuses(newStatuses)
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

  const handleCloseOverlay = () => {
    UIEventManager.closeOverlay()
    // Resume game if it was paused
    if (gameRef.current) {
      gameRef.current.resume()
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
            <div className="game-canvas" ref={canvasContainerRef}></div>

            <Dashboard
              health={stats.health}
              maxHealth={100}
              rations={rations}
              maxRations={maxRations}
              direction={direction}
              location={`Score: ${stats.score} | Distance: ${stats.distance}m`}
              quickSlots={quickSlots}
              selectedSlot={selectedSlot}
              statuses={statuses}
              onSlotClick={(index) => setSelectedSlot(index)}
            />

            {/* UI Overlays */}
            {currentOverlay === 'dialogue' && overlayData && 'dialogueId' in overlayData && (
              <Dialogue
                dialogueId={overlayData.dialogueId as string}
                onClose={handleCloseOverlay}
              />
            )}

            {currentOverlay === 'map' && gameRef.current && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                zIndex: 1000,
                padding: '20px',
              }}>
                <button
                  onClick={handleCloseOverlay}
                  style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    padding: '10px 20px',
                    fontSize: '16px',
                    zIndex: 1001,
                    background: '#333',
                    color: 'white',
                    border: '2px solid #666',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Close Map ✕
                </button>
                <InteractiveMap
                  mapGraph={gameRef.current.getNavigationManager().getMapGraph()}
                  currentNodeId={gameRef.current.getNavigationManager().getCurrentNode()?.id || 'belem'}
                  visitedNodeIds={gameRef.current.getNavigationManager().getVisitedNodes()}
                  onNodeSelect={(nodeId) => {
                    console.log(`[App] Selected node: ${nodeId}`)
                  }}
                  onPlotCourse={(nodeId) => {
                    console.log(`[App] Plot course to: ${nodeId}`)
                    gameRef.current?.getNavigationManager().setTarget(nodeId)
                    handleCloseOverlay()
                  }}
                />
              </div>
            )}

            {currentOverlay === 'inventory' && (
              <Inventory
                isOpen={true}
                onClose={handleCloseOverlay}
                items={convertInventoryToItems(playerInventory)}
                maxWeight={stats.maxWeight}
                currentWeight={stats.currentWeight}
                onUseItem={(itemId) => {
                  console.log(`[App] Use item: ${itemId}`)
                  // TODO: Implement item usage through game
                  handleCloseOverlay()
                }}
                onDropItem={(itemId, quantity) => {
                  console.log(`[App] Drop item: ${itemId} x${quantity}`)
                  // TODO: Implement item dropping through game
                }}
              />
            )}

            <div className="game-controls">
              <button onClick={handlePauseGame}>⏸️ Pause</button>
              <button onClick={handleResumeGame}>▶️ Resume</button>
              <button onClick={handleStopGame}>⏹️ Stop</button>
              <button onClick={() => UIEventManager.openOverlay('map')}>🗺️ Map</button>
              <button onClick={() => UIEventManager.openOverlay('inventory')}>🎒 Inventory</button>
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
