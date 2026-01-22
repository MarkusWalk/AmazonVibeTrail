import { GameEngine, InputRouter } from './core'
import { Player, Obstacle, ObstacleSubType } from './entities'
import type { PixiRenderer } from '@rendering/pixi'
import type { GameConfig } from '@models/index'

/**
 * Game - Main game coordinator
 * Connects Engine (Model), Renderer (View), and InputRouter (Controller)
 */
export class Game {
  private engine: GameEngine
  private renderer: PixiRenderer | null = null
  private inputRouter: InputRouter
  private player: Player | null = null

  // Game state
  private score: number = 0
  private obstacleSpawnTimer: number = 0
  private obstacleSpawnInterval: number = 2000 // ms

  constructor(config: GameConfig) {
    this.engine = new GameEngine(config)
    this.engine.initialize()

    this.inputRouter = new InputRouter()
    this.setupInputHandlers()

    console.log('[Game] Initialized')
  }

  /**
   * Set the renderer
   */
  setRenderer(renderer: PixiRenderer): void {
    this.renderer = renderer
    console.log('[Game] Renderer attached')
  }

  /**
   * Start the game
   */
  async start(): Promise<void> {
    if (!this.renderer || !this.renderer.isReady()) {
      console.error('[Game] Renderer not ready')
      return
    }

    // Create player
    this.createPlayer()

    // Create initial obstacles
    this.spawnObstacle()

    // Set up render background
    this.renderer.createBackground()
    this.renderer.createWaterEffect()

    // Subscribe to engine tick for rendering
    this.engine.subscribe('tick', (deltaTime) => {
      this.onTick(deltaTime)
    })

    // Subscribe to collisions
    this.engine.subscribe('collision', (entityAId, entityBId) => {
      console.log(`[Game] Collision: ${entityAId} <-> ${entityBId}`)
    })

    // Start engine
    this.engine.start()

    console.log('[Game] Started')
  }

  /**
   * Create the player entity
   */
  private createPlayer(): void {
    if (!this.renderer) return

    const { width, height } = this.renderer.getDimensions()

    // Create player entity
    this.player = new Player('player', {
      x: width / 2,
      y: height - 150,
    })

    // Create physics body
    const physics = this.engine.getPhysics()
    const body = physics.createRectBody(
      'player',
      width / 2,
      height - 150,
      40,
      80,
      {
        frictionAir: 0.05,
        density: 0.01,
      }
    )

    this.player.setPhysicsBody(body)

    // Add to engine
    this.engine.addEntity(this.player)

    // Create sprite
    this.renderer.createEntitySprite(this.player, 'entities')

    console.log('[Game] Player created')
  }

  /**
   * Spawn an obstacle
   */
  private spawnObstacle(): void {
    if (!this.renderer) return

    const { width } = this.renderer.getDimensions()

    // Random horizontal position
    const x = Math.random() * (width - 100) + 50

    // Random obstacle type
    const types = [
      ObstacleSubType.LOG,
      ObstacleSubType.ROCK,
      ObstacleSubType.BRANCH,
    ]
    const type = types[Math.floor(Math.random() * types.length)]

    // Create obstacle
    const id = `obstacle_${Date.now()}_${Math.random()}`
    const obstacle = new Obstacle(id, { x, y: -50 }, type)

    // Create physics body
    const physics = this.engine.getPhysics()
    const radius = type === ObstacleSubType.BRANCH ? 15 : 25
    const body = physics.createCircleBody(id, x, -50, radius, {
      frictionAir: 0.01,
      density: 0.005,
      isSensor: false,
    })

    // Add downward velocity (river current)
    physics.setVelocity(id, { x: 0, y: 1.5 })

    obstacle.setPhysicsBody(body)

    // Add to engine
    this.engine.addEntity(obstacle)

    // Create sprite
    this.renderer.createEntitySprite(obstacle, 'entities')

    console.log(`[Game] Spawned ${type} obstacle at x:${x}`)
  }

  /**
   * Called every engine tick
   */
  private onTick(deltaTime: number): void {
    if (!this.renderer || !this.player) return

    // Update player steering based on physics
    if (this.player.isAlive()) {
      const physics = this.engine.getPhysics()

      // Apply thrust force
      const thrustForce = this.player.getThrustForce()
      if (thrustForce.x !== 0 || thrustForce.y !== 0) {
        physics.applyForce('player', thrustForce)
      }

      // Apply turn (rotation)
      const turnAmount = this.player.getTurnAmount()
      if (turnAmount !== 0) {
        const currentAngle = physics.getAngle('player') || 0
        physics.setAngle('player', currentAngle + turnAmount)
      }
    }

    // Update all entity sprites
    const entities = this.engine.getAllEntities()
    entities.forEach((entity) => {
      this.renderer!.updateEntitySprite(entity)
    })

    // Update score display
    this.renderer.updateText('score', `Score: ${this.score}`)
    this.renderer.updateText(
      'health',
      `Health: ${this.player.getHealth()}`
    )

    // Remove off-screen obstacles
    const { height } = this.renderer.getDimensions()
    entities.forEach((entity) => {
      if (entity instanceof Obstacle && entity.isOffScreen(height)) {
        this.renderer!.removeEntitySprite(entity.id)
        this.engine.removeEntity(entity.id)
        this.score += 10 // Score for avoiding obstacle
      }
    })

    // Spawn new obstacles
    this.obstacleSpawnTimer += deltaTime
    if (this.obstacleSpawnTimer >= this.obstacleSpawnInterval) {
      this.spawnObstacle()
      this.obstacleSpawnTimer = 0
    }

    // Check if player is dead
    if (!this.player.isAlive()) {
      this.gameOver()
    }
  }

  /**
   * Set up input handlers
   */
  private setupInputHandlers(): void {
    // Keyboard controls
    const keysPressed = new Set<string>()

    this.inputRouter.registerHandler('keydown', (event) => {
      const keyEvent = event as KeyboardEvent
      keysPressed.add(keyEvent.key.toLowerCase())

      if (!this.player) return null

      // Update player controls based on keys pressed
      let thrust = 0
      let turn = 0

      if (keysPressed.has('w') || keysPressed.has('arrowup')) {
        thrust = 1
      }
      if (keysPressed.has('s') || keysPressed.has('arrowdown')) {
        thrust = -0.5
      }
      if (keysPressed.has('a') || keysPressed.has('arrowleft')) {
        turn = -1
      }
      if (keysPressed.has('d') || keysPressed.has('arrowright')) {
        turn = 1
      }

      this.player.applyThrust(thrust)
      this.player.applyTurn(turn)

      return null
    })

    this.inputRouter.registerHandler('keyup', (event) => {
      const keyEvent = event as KeyboardEvent
      keysPressed.delete(keyEvent.key.toLowerCase())

      if (!this.player) return null

      // Recalculate controls
      let thrust = 0
      let turn = 0

      if (keysPressed.has('w') || keysPressed.has('arrowup')) {
        thrust = 1
      }
      if (keysPressed.has('s') || keysPressed.has('arrowdown')) {
        thrust = -0.5
      }
      if (keysPressed.has('a') || keysPressed.has('arrowleft')) {
        turn = -1
      }
      if (keysPressed.has('d') || keysPressed.has('arrowright')) {
        turn = 1
      }

      this.player.applyThrust(thrust)
      this.player.applyTurn(turn)

      return null
    })
  }

  /**
   * Game over
   */
  private gameOver(): void {
    this.engine.pause()
    console.log(`[Game] Game Over! Final Score: ${this.score}`)

    if (this.renderer) {
      this.renderer.addText(
        'gameover',
        'GAME OVER',
        this.renderer.getDimensions().width / 2 - 100,
        this.renderer.getDimensions().height / 2,
        {
          fontSize: 48,
          fill: 0xff0000,
        }
      )
    }
  }

  /**
   * Pause the game
   */
  pause(): void {
    this.engine.pause()
    this.inputRouter.disable()
  }

  /**
   * Resume the game
   */
  resume(): void {
    this.engine.resume()
    this.inputRouter.enable()
  }

  /**
   * Stop the game
   */
  stop(): void {
    this.engine.stop()
    this.inputRouter.disable()
  }

  /**
   * Get current score
   */
  getScore(): number {
    return this.score
  }

  /**
   * Get player health
   */
  getPlayerHealth(): number {
    return this.player ? this.player.getHealth() : 0
  }

  /**
   * Clean up
   */
  destroy(): void {
    this.engine.destroy()
    this.inputRouter.destroy()
    if (this.renderer) {
      this.renderer.destroy()
    }
    console.log('[Game] Destroyed')
  }
}
