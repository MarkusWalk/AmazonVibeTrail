import { GameEngine, InputRouter } from './core'
import {
  Player,
  Obstacle,
  ObstacleSubType,
  Collectible,
  CollectibleType,
  Whirlpool,
  Fork,
} from './entities'
import { NavigationManager } from './navigation'
import { EventManager, QuestManager, SpecimenManager } from './systems'
import type { GameContext } from './systems/EventManager'
import { UIEventManager } from '@ui/UIEventManager'
import { amazonRiverMap } from '@data/maps/amazonRiver'
import { sampleGameContent } from '@data/events/sampleEvents'
import type { PixiRenderer } from '@rendering/pixi'
import type { GameConfig, GameEvent } from '@models/index'

/**
 * Game - Main game coordinator
 * Connects Engine (Model), Renderer (View), and InputRouter (Controller)
 */
export class Game {
  private engine: GameEngine
  private renderer: PixiRenderer | null = null
  private inputRouter: InputRouter
  private player: Player | null = null
  private navigationManager: NavigationManager

  // Phase 5 Content Systems
  private eventManager: EventManager
  private questManager: QuestManager
  private specimenManager: SpecimenManager

  // Game state
  private score: number = 0
  private gameTime: number = 0
  private difficultyMultiplier: number = 1
  private currentFork: Fork | null = null

  // Spawn timers
  private obstacleSpawnTimer: number = 0
  private obstacleSpawnInterval: number = 2000 // ms
  private collectibleSpawnTimer: number = 0
  private collectibleSpawnInterval: number = 4000 // ms
  private whirlpoolSpawnTimer: number = 0
  private whirlpoolSpawnInterval: number = 15000 // ms

  constructor(config: GameConfig) {
    this.engine = new GameEngine(config)
    this.engine.initialize()

    this.inputRouter = new InputRouter()
    this.setupInputHandlers()

    // Initialize navigation with Amazon River map
    this.navigationManager = new NavigationManager(amazonRiverMap, 'belem')

    // Initialize Phase 5 content systems
    this.eventManager = new EventManager()
    this.questManager = new QuestManager()
    this.specimenManager = new SpecimenManager()

    console.log('[Game] Initialized with navigation and content systems')
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

    // Register sample content
    this.eventManager.registerEvents(sampleGameContent.events)
    sampleGameContent.quests.forEach((quest) =>
      this.questManager.registerQuest(quest)
    )
    this.specimenManager.registerSpecimens(sampleGameContent.specimens)
    console.log('[Game] Registered sample content')

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
      this.handleCollision(entityAId, entityBId)
    })

    // Start navigation - set first target
    this.navigationManager.setTarget('breves')

    // Start engine
    this.engine.start()

    console.log('[Game] Started with navigation to Breves')
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
   * Spawn an obstacle with varied sizes and speeds
   */
  private spawnObstacle(): void {
    if (!this.renderer) return

    const { width } = this.renderer.getDimensions()

    // Random horizontal position
    const x = Math.random() * (width - 100) + 50

    // Random obstacle type with weighted distribution
    const types = [
      ObstacleSubType.LOG,
      ObstacleSubType.LOG, // More logs
      ObstacleSubType.ROCK,
      ObstacleSubType.BRANCH,
      ObstacleSubType.BRANCH, // More branches
    ]
    const type = types[Math.floor(Math.random() * types.length)]

    // Create obstacle
    const id = `obstacle_${Date.now()}_${Math.random()}`
    const obstacle = new Obstacle(id, { x, y: -50 }, type)

    // Create physics body with varied sizes
    const physics = this.engine.getPhysics()
    let radius = 25
    if (type === ObstacleSubType.BRANCH) radius = 15
    if (type === ObstacleSubType.ROCK) radius = 30

    const body = physics.createCircleBody(id, x, -50, radius, {
      frictionAir: 0.01,
      density: 0.005,
      isSensor: false,
    })

    // Add downward velocity (river current) with variation
    const baseSpeed = 1.5 * this.difficultyMultiplier
    const speedVariation = Math.random() * 0.5 - 0.25
    physics.setVelocity(id, { x: 0, y: baseSpeed + speedVariation })

    obstacle.setPhysicsBody(body)

    // Add to engine
    this.engine.addEntity(obstacle)

    // Create sprite
    this.renderer.createEntitySprite(obstacle, 'entities')
  }

  /**
   * Spawn a collectible
   */
  private spawnCollectible(): void {
    if (!this.renderer) return

    const { width } = this.renderer.getDimensions()

    // Random horizontal position
    const x = Math.random() * (width - 100) + 50

    // Random collectible type
    const types = [
      CollectibleType.FISH,
      CollectibleType.FISH,
      CollectibleType.HEALTH_PACK,
      CollectibleType.SPEED_BOOST,
    ]
    const type = types[Math.floor(Math.random() * types.length)]

    // Create collectible
    const id = `collectible_${Date.now()}_${Math.random()}`
    const collectible = new Collectible(id, { x, y: -50 }, type)

    // Create physics body (sensor - doesn't collide physically)
    const physics = this.engine.getPhysics()
    const body = physics.createCircleBody(id, x, -50, 15, {
      frictionAir: 0.005,
      density: 0.001,
      isSensor: true, // Pass through
    })

    physics.setVelocity(id, { x: 0, y: 1.2 })

    collectible.setPhysicsBody(body)

    // Add to engine
    this.engine.addEntity(collectible)

    // Create sprite
    this.renderer.createEntitySprite(collectible, 'entities')
  }

  /**
   * Spawn a whirlpool
   */
  private spawnWhirlpool(): void {
    if (!this.renderer) return

    const { width } = this.renderer.getDimensions()

    // Random horizontal position
    const x = Math.random() * (width - 200) + 100

    // Create whirlpool
    const id = `whirlpool_${Date.now()}`
    const whirlpool = new Whirlpool(id, { x, y: -100 })

    // Create physics body (larger sensor area)
    const physics = this.engine.getPhysics()
    const body = physics.createCircleBody(id, x, -100, 60, {
      frictionAir: 0.005,
      density: 0.001,
      isSensor: true,
    })

    physics.setVelocity(id, { x: 0, y: 0.8 })

    whirlpool.setPhysicsBody(body)

    // Add to engine
    this.engine.addEntity(whirlpool)

    // Create sprite
    this.renderer.createEntitySprite(whirlpool, 'entities')
  }

  /**
   * Spawn a fork (river branch choice)
   */
  private spawnFork(choices: any[]): void {
    if (!this.renderer) return

    const { width } = this.renderer.getDimensions()

    // Create fork at top of screen
    const id = `fork_${Date.now()}`
    const fork = new Fork(id, { x: width / 2, y: -150 }, choices)

    // Create physics body (sensor - doesn't collide)
    const physics = this.engine.getPhysics()
    const body = physics.createCircleBody(id, width / 2, -150, 80, {
      frictionAir: 0.005,
      density: 0.001,
      isSensor: true,
    })

    physics.setVelocity(id, { x: 0, y: 1.0 })

    fork.setPhysicsBody(body)

    // Add to engine
    this.engine.addEntity(fork)

    // Create sprite
    this.renderer.createEntitySprite(fork, 'entities')

    // Store reference
    this.currentFork = fork

    console.log('[Game] Fork spawned with', choices.length, 'choices')
  }

  /**
   * Handle collision events
   */
  private handleCollision(entityAId: string, entityBId: string): void {
    const entityA = this.engine.getEntity(entityAId)
    const entityB = this.engine.getEntity(entityBId)

    if (!entityA || !entityB || !this.player) return

    // Check if player collected something
    if (
      (entityA === this.player && entityB instanceof Collectible) ||
      (entityB === this.player && entityA instanceof Collectible)
    ) {
      const collectible = (entityA instanceof Collectible
        ? entityA
        : entityB) as Collectible

      if (!collectible.isCollected()) {
        this.handleCollectiblePickup(collectible)
      }
    }
  }

  /**
   * Handle collectible pickup
   */
  private handleCollectiblePickup(collectible: Collectible): void {
    if (!this.player) return

    const type = collectible.getCollectibleType()
    const value = collectible.getValue()

    switch (type) {
      case CollectibleType.FISH:
        this.score += value
        break

      case CollectibleType.HEALTH_PACK:
        this.player.heal(value)
        break

      case CollectibleType.SPEED_BOOST:
        this.player.applySpeedBoost(value * 1000)
        break

      case CollectibleType.SPECIMEN:
        this.score += value
        // Handle specimen discovery
        // For now, trigger a random specimen discovery
        const allSpecimens = Array.from(
          sampleGameContent.specimens.map((s) => s.id)
        )
        const randomSpecimen =
          allSpecimens[Math.floor(Math.random() * allSpecimens.length)]
        const currentNode = this.navigationManager.getCurrentNode()
        const specimen = this.specimenManager.discoverSpecimen(
          randomSpecimen,
          currentNode?.name
        )
        if (specimen) {
          console.log(`[Game] Discovered specimen: ${specimen.name}`)

          // Check for collection quests
          const activeQuests = this.questManager.getActiveQuests()
          activeQuests.forEach((quest) => {
            quest.objectives.forEach((objective) => {
              if (
                objective.type === 'collect' &&
                objective.target === specimen.id
              ) {
                this.questManager.incrementObjective(quest.id, objective.id, 1)
                console.log(
                  `[Game] Quest progress: ${objective.description} (${objective.current}/${objective.required})`
                )
              }
            })
          })
        }
        break
    }

    console.log(`[Game] Collected ${type}, value: ${value}`)
  }

  /**
   * Handle triggered events from EventManager
   */
  private handleTriggeredEvents(events: GameEvent[]): void {
    const player = this.player
    if (!player) return

    events.forEach((event) => {
      // Trigger the event
      this.eventManager.triggerEvent(event.id)

      // Handle different event types
      switch (event.type) {
        case 'DIALOGUE':
          console.log(`[Game] Dialogue event: ${event.name}`)
          // Open dialogue UI
          if (event.data.dialogueId) {
            this.engine.pause()
            UIEventManager.openOverlay('dialogue', {
              dialogueId: event.data.dialogueId as string,
              characterName: event.data.characterName as string | undefined,
              portrait: event.data.portrait as string | undefined,
            })
          }
          this.eventManager.completeEvent(event.id)
          break

        case 'DISCOVERY':
          console.log(`[Game] Discovery event: ${event.name}`)
          if (event.data.discoveryType === 'specimen' && event.data.discoveryId) {
            const currentNode = this.navigationManager.getCurrentNode()
            const specimen = this.specimenManager.discoverSpecimen(
              event.data.discoveryId as string,
              currentNode?.name
            )
            if (specimen) {
              console.log(
                `[Game] Discovered specimen: ${specimen.name} (${specimen.category})`
              )
              // Could show a notification or open guidebook
            }
          }
          this.eventManager.completeEvent(event.id)
          break

        case 'QUEST':
          console.log(`[Game] Quest event: ${event.name}`)
          if (event.data.questId) {
            const started = this.questManager.startQuest(
              event.data.questId as string
            )
            if (started) {
              console.log(`[Game] Started quest: ${event.data.questId}`)
            }
          }
          this.eventManager.completeEvent(event.id)
          break

        case 'HAZARD':
          console.log(`[Game] Hazard event: ${event.name}`)
          if (event.data.damage) {
            player.takeDamage(event.data.damage as number)
            console.log(`[Game] Hazard dealt ${event.data.damage} damage`)
          }
          // Apply other hazard effects
          if (event.data.rationsDamage) {
            const rationsLost = event.data.rationsDamage as number
            player.consumeRations(rationsLost)
            console.log(`[Game] Lost ${rationsLost} rations`)
          }
          this.eventManager.completeEvent(event.id)
          break

        case 'TRADE':
          console.log(`[Game] Trade event: ${event.name}`)
          // Open trade UI
          if (event.data.merchantId) {
            this.engine.pause()
            UIEventManager.openOverlay('trade', {
              merchantId: event.data.merchantId as string,
              merchantName: event.data.merchantName as string | undefined,
            })
          }
          this.eventManager.completeEvent(event.id)
          break

        case 'ENCOUNTER':
          console.log(`[Game] Encounter event: ${event.name}`)
          // Handle hostile encounters
          if (event.data.hostile && event.data.damage) {
            player.takeDamage(event.data.damage as number)
            console.log(`[Game] Hostile encounter dealt ${event.data.damage} damage`)
          }
          // Handle friendly encounters (could open dialogue)
          if (event.data.dialogueId) {
            this.engine.pause()
            UIEventManager.openOverlay('dialogue', {
              dialogueId: event.data.dialogueId as string,
            })
          }
          this.eventManager.completeEvent(event.id)
          break

        case 'ENVIRONMENTAL':
          console.log(`[Game] Environmental event: ${event.name}`)
          // Apply environmental effects
          if (event.data.speedModifier) {
            const modifier = event.data.speedModifier as number
            const currentMax = player.getMaxSpeed()
            player.setMaxSpeed(currentMax * modifier)
            console.log(`[Game] Speed modified by ${modifier}x`)
            // Reset after duration
            if (event.data.duration) {
              setTimeout(() => {
                player.setMaxSpeed(5) // Reset to default
              }, event.data.duration as number)
            }
          }
          // Weather effects
          if (event.data.weatherEffect) {
            console.log(`[Game] Weather: ${event.data.weatherEffect}`)
            // Could apply visual filters via renderer
          }
          this.eventManager.completeEvent(event.id)
          break

        default:
          console.warn(`[Game] Unhandled event type: ${event.type}`)
          this.eventManager.completeEvent(event.id)
      }
    })
  }

  /**
   * Called every engine tick
   */
  private onTick(deltaTime: number): void {
    if (!this.renderer || !this.player) return

    this.gameTime += deltaTime

    // Increase difficulty over time
    this.difficultyMultiplier = 1 + Math.floor(this.gameTime / 30000) * 0.2

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

      // Apply whirlpool pull forces
      const entities = this.engine.getAllEntities()
      entities.forEach((entity) => {
        if (entity instanceof Whirlpool) {
          const pullForce = entity.getPullForce(this.player!.getPosition())
          if (pullForce) {
            physics.applyForce('player', pullForce)

            // Deal damage if close enough and timer ready
            if (entity.shouldDealDamage()) {
              this.player!.takeDamage(entity.getDamageAmount())
            }
          }
        }
      })

      // Apply river current
      const current = this.navigationManager.getCurrentFlow()
      if (current.x !== 0 || current.y !== 0) {
        physics.applyForce('player', {
          x: current.x * 0.1,
          y: current.y * 0.1,
        })
      }

      // Update navigation progress based on distance traveled
      const playerSpeed = this.player.getCurrentSpeed()
      this.navigationManager.update(playerSpeed * (deltaTime / 1000))

      // Check for upcoming forks and spawn fork entity if needed
      const upcomingFork = this.navigationManager.getUpcomingFork()
      if (upcomingFork && !this.currentFork) {
        this.spawnFork(upcomingFork)
      }

      // Auto-choose fork if player didn't decide and fork passed
      if (this.currentFork && this.currentFork.getPosition().y > 500) {
        if (!this.currentFork.isChoiceMade()) {
          this.currentFork.autoSelect()
          const choice = this.currentFork.getSelectedChoice()
          if (choice) {
            this.navigationManager.chooseFork(choice.segmentId)
          }
        }
        // Remove old fork
        this.renderer.removeEntitySprite(this.currentFork.id)
        this.engine.removeEntity(this.currentFork.id)
        this.currentFork = null
      }

      // Check for triggered events (Phase 5 integration)
      const stats = this.player.getStats()
      const currentNode = this.navigationManager.getCurrentNode()

      const gameContext: GameContext = {
        currentLocation: currentNode?.id,
        gameTime: this.gameTime,
        distanceTraveled: stats.distance,
        health: stats.health,
        rations: stats.rations,
        inventory: this.player.getInventory(),
      }

      const triggeredEvents = this.eventManager.checkTriggers(gameContext)
      if (triggeredEvents.length > 0) {
        this.handleTriggeredEvents(triggeredEvents)
      }
    }

    // Update all entity sprites
    const entities = this.engine.getAllEntities()
    entities.forEach((entity) => {
      this.renderer!.updateEntitySprite(entity)

      // Add invincibility visual effect
      if (entity === this.player && this.player.isInvincible()) {
        const sprite = (this.renderer! as any).sprites.get(entity.id)
        if (sprite) {
          sprite.alpha = 0.5 + Math.sin(this.gameTime / 100) * 0.3
        }
      }
    })

    // Update score display
    const stats = this.player.getStats()
    this.renderer.updateText('score', `Score: ${this.score}`)
    this.renderer.updateText('health', `Health: ${stats.health}`)
    this.renderer.updateText('lives', `Lives: ${stats.lives}`)
    this.renderer.updateText('distance', `Distance: ${stats.distance}m`)
    this.renderer.updateText(
      'combo',
      stats.combo > 0 ? `Combo: x${stats.combo}` : ''
    )
    this.renderer.updateText(
      'speed',
      `Speed: ${stats.speed.toFixed(1)} m/s`
    )

    // Update navigation display
    const navState = this.navigationManager.getState()
    const currentNode = this.navigationManager.getCurrentNode()
    if (currentNode) {
      this.renderer.updateText('location', `Location: ${currentNode.name}`)
    } else if (navState.targetNodeId) {
      const targetNode = this.navigationManager.getNode(navState.targetNodeId)
      const progress = Math.floor(navState.progressPercent)
      if (targetNode) {
        this.renderer.updateText(
          'location',
          `→ ${targetNode.name} (${progress}%)`
        )
      }
    }

    // Remove off-screen entities and award points
    const { height } = this.renderer.getDimensions()
    entities.forEach((entity) => {
      if (entity instanceof Obstacle && entity.isOffScreen(height)) {
        this.renderer!.removeEntitySprite(entity.id)
        this.engine.removeEntity(entity.id)

        // Award points and increment combo
        const comboMultiplier = 1 + this.player!.getCombo() * 0.1
        this.score += Math.floor(10 * comboMultiplier)
        this.player!.incrementObstaclesAvoided()
      }

      if (entity instanceof Collectible && entity.isOffScreen(height)) {
        this.renderer!.removeEntitySprite(entity.id)
        this.engine.removeEntity(entity.id)
      }

      if (entity instanceof Whirlpool && entity.isOffScreen(height)) {
        this.renderer!.removeEntitySprite(entity.id)
        this.engine.removeEntity(entity.id)
      }
    })

    // Spawn new entities
    this.obstacleSpawnTimer += deltaTime
    if (this.obstacleSpawnTimer >= this.obstacleSpawnInterval) {
      this.spawnObstacle()
      this.obstacleSpawnTimer = 0

      // Increase spawn rate with difficulty
      this.obstacleSpawnInterval = Math.max(
        800,
        2000 - Math.floor(this.gameTime / 10000) * 100
      )
    }

    this.collectibleSpawnTimer += deltaTime
    if (this.collectibleSpawnTimer >= this.collectibleSpawnInterval) {
      this.spawnCollectible()
      this.collectibleSpawnTimer = 0
    }

    this.whirlpoolSpawnTimer += deltaTime
    if (this.whirlpoolSpawnTimer >= this.whirlpoolSpawnInterval) {
      this.spawnWhirlpool()
      this.whirlpoolSpawnTimer = 0
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
    const keysPressed = new Set<string>()

    this.inputRouter.registerHandler('keydown', (event) => {
      const keyEvent = event as KeyboardEvent
      keysPressed.add(keyEvent.key.toLowerCase())

      if (!this.player) return null

      this.updatePlayerControls(keysPressed)
      return null
    })

    this.inputRouter.registerHandler('keyup', (event) => {
      const keyEvent = event as KeyboardEvent
      keysPressed.delete(keyEvent.key.toLowerCase())

      if (!this.player) return null

      this.updatePlayerControls(keysPressed)
      return null
    })
  }

  /**
   * Update player controls based on pressed keys
   */
  private updatePlayerControls(keysPressed: Set<string>): void {
    if (!this.player) return

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
  }

  /**
   * Game over
   */
  private gameOver(): void {
    this.engine.pause()
    console.log(`[Game] Game Over! Final Score: ${this.score}`)

    if (this.renderer && this.player) {
      const stats = this.player.getStats()

      // Show game over screen
      this.renderer.clearLayer('ui')
      this.renderer.addText(
        'gameover',
        'GAME OVER',
        this.renderer.getDimensions().width / 2 - 120,
        150,
        {
          fontSize: 48,
          fill: 0xff0000,
        }
      )

      this.renderer.addText(
        'finalScore',
        `Final Score: ${this.score}`,
        this.renderer.getDimensions().width / 2 - 100,
        220,
        {
          fontSize: 24,
          fill: 0xffffff,
        }
      )

      this.renderer.addText(
        'statsDistance',
        `Distance Traveled: ${stats.distance}m`,
        this.renderer.getDimensions().width / 2 - 120,
        260,
        {
          fontSize: 18,
          fill: 0xcccccc,
        }
      )

      this.renderer.addText(
        'statsObstacles',
        `Obstacles Avoided: ${stats.obstaclesAvoided}`,
        this.renderer.getDimensions().width / 2 - 120,
        290,
        {
          fontSize: 18,
          fill: 0xcccccc,
        }
      )

      this.renderer.addText(
        'statsCombo',
        `Max Combo: x${stats.maxCombo}`,
        this.renderer.getDimensions().width / 2 - 120,
        320,
        {
          fontSize: 18,
          fill: 0xcccccc,
        }
      )

      this.renderer.addText(
        'statsCollectibles',
        `Collectibles: ${stats.collectiblesGathered}`,
        this.renderer.getDimensions().width / 2 - 120,
        350,
        {
          fontSize: 18,
          fill: 0xcccccc,
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
   * Get player stats
   */
  getPlayerStats() {
    return this.player ? this.player.getStats() : null
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
