# Implementation Plan: AmazonVibeTrail

> Detailed technical implementation roadmap with technology stack and development phases

## Table of Contents

- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Development Phases](#development-phases)
- [Implementation Details](#implementation-details)
- [Testing Strategy](#testing-strategy)
- [Deployment Plan](#deployment-plan)
- [Timeline Estimates](#timeline-estimates)

---

## Technology Stack

### Core Technologies

#### Frontend Framework
**TypeScript + HTML5 Canvas/WebGL**
- **Language**: TypeScript 5.x
- **Why**: Type safety, excellent tooling, browser compatibility, educational accessibility
- **Build Tool**: Vite 5.x (fast HMR, optimized builds)
- **Package Manager**: pnpm (efficient, fast)

#### Game Engine/Rendering
**PixiJS 8.x** (Primary renderer)
- **Why**:
  - Hardware-accelerated 2D rendering via WebGL
  - Excellent performance for sprite-based games
  - Rich plugin ecosystem
  - Good documentation and community
- **Plugins**:
  - `@pixi/sound` - Audio management
  - `@pixi/ui` - Interactive UI components
  - `@pixi/particle-emitter` - Visual effects (mist, splashes)

**Three.js 0.160+** (Optional 3D elements)
- **Why**: For potential 3D skybox, terrain, or enhanced visual depth
- **Use Case**: Background parallax, atmospheric effects

#### Physics Engine
**Matter.js 0.19+**
- **Why**:
  - Lightweight 2D physics
  - Perfect for canoe physics and collision detection
  - Easy integration with PixiJS
  - No dependencies
- **Alternatives Considered**:
  - Box2D (more complex, overkill)
  - Planck.js (Box2D port, heavier)

#### State Management
**Zustand 4.x**
- **Why**:
  - Lightweight (< 1KB)
  - Simple API, minimal boilerplate
  - Works well without React
  - Built-in persistence support
- **Use Case**: PlayerProfile, game configuration, UI state

#### UI Layer Framework
**React 18.x** (for complex UI overlays)
- **Why**:
  - Component-based architecture
  - Excellent for complex forms and menus
  - Large ecosystem
  - Can overlay on Canvas seamlessly
- **Alternatives**: Vue 3 (also viable), Svelte (lighter but smaller ecosystem)

#### Data & Content
**JSON** (configuration and content files)
- Map graphs, dialogue trees, item definitions
- Easy to edit, version control friendly

**IndexedDB** (via Dexie.js)
- **Why**: Persistent storage for save games
- **Library**: Dexie.js 3.x (wrapper for IndexedDB)

#### Audio
**Howler.js 2.x**
- **Why**:
  - Cross-browser audio compatibility
  - Sprite sheet support
  - Volume/fade controls
  - Spatial audio capabilities

#### Development Tools

**Code Quality**
- **ESLint** - Linting with TypeScript rules
- **Prettier** - Code formatting
- **Husky** - Git hooks for pre-commit checks

**Testing**
- **Vitest** - Unit testing (Vite-native, fast)
- **Playwright** - E2E testing
- **@testing-library/react** - UI component testing

**Documentation**
- **TypeDoc** - API documentation generation
- **Storybook** - UI component playground

**Version Control**
- **Git** with conventional commits
- **GitHub Actions** - CI/CD pipeline

---

## Project Structure

```
AmazonVibeTrail/
├── docs/                          # Documentation
│   ├── api/                       # Generated API docs
│   └── design/                    # Design documents
│
├── public/                        # Static assets
│   ├── audio/
│   │   ├── music/
│   │   └── sfx/
│   ├── images/
│   │   ├── sprites/
│   │   ├── ui/
│   │   └── backgrounds/
│   └── data/
│       ├── maps/                  # Map graph JSON files
│       ├── dialogues/             # Dialogue tree scripts
│       ├── items/                 # Item definitions
│       └── encounters/            # Historical encounter configs
│
├── src/
│   ├── core/                      # Game engine (Model)
│   │   ├── engine/
│   │   │   ├── GameEngine.ts      # Main game loop coordinator
│   │   │   ├── PhysicsSystem.ts   # Matter.js integration
│   │   │   └── TickManager.ts     # Frame timing and updates
│   │   │
│   │   ├── entities/              # Game objects
│   │   │   ├── Canoe.ts
│   │   │   ├── Obstacle.ts        # Logs, rocks, etc.
│   │   │   ├── Wildlife.ts        # Animals for photography
│   │   │   └── Fork.ts            # River branching markers
│   │   │
│   │   ├── systems/               # Game logic systems
│   │   │   ├── NavigationManager.ts
│   │   │   ├── StateManager.ts
│   │   │   ├── CollisionSystem.ts
│   │   │   ├── InventorySystem.ts
│   │   │   └── EventSystem.ts
│   │   │
│   │   └── models/                # Data structures
│   │       ├── PlayerProfile.ts
│   │       ├── MapGraph.ts
│   │       ├── GameConfig.ts
│   │       └── Event.ts
│   │
│   ├── rendering/                 # Presentation layer (View)
│   │   ├── renderers/
│   │   │   ├── WorldRenderer.ts   # River, entities, environment
│   │   │   ├── HUDRenderer.ts     # Dashboard overlay
│   │   │   └── EffectsRenderer.ts # Particles, filters
│   │   │
│   │   ├── ui/                    # React UI components
│   │   │   ├── components/
│   │   │   │   ├── Dashboard/
│   │   │   │   ├── Map/
│   │   │   │   ├── Guidebook/
│   │   │   │   ├── Dialogue/
│   │   │   │   ├── Inventory/
│   │   │   │   └── Menu/
│   │   │   │
│   │   │   └── screens/           # Full-screen states
│   │   │       ├── BootScreen.tsx
│   │   │       ├── MenuScreen.tsx
│   │   │       ├── GameScreen.tsx
│   │   │       └── SettingsScreen.tsx
│   │   │
│   │   └── assets/                # UI styling
│   │       ├── styles/
│   │       └── themes/
│   │
│   ├── input/                     # Controller layer
│   │   ├── InputRouter.ts         # Main input coordinator
│   │   ├── KeyboardHandler.ts
│   │   ├── MouseHandler.ts
│   │   └── TouchHandler.ts        # Mobile support
│   │
│   ├── data/                      # Data access layer
│   │   ├── DataRepository.ts      # Asset loading coordinator
│   │   ├── loaders/
│   │   │   ├── MapLoader.ts
│   │   │   ├── DialogueLoader.ts
│   │   │   ├── AssetLoader.ts     # Images, audio
│   │   │   └── ConfigLoader.ts
│   │   │
│   │   └── persistence/
│   │       ├── SaveManager.ts     # Save/load games
│   │       └── StorageAdapter.ts  # IndexedDB wrapper
│   │
│   ├── audio/                     # Audio system
│   │   ├── AudioManager.ts
│   │   ├── MusicController.ts
│   │   └── SFXController.ts
│   │
│   ├── utils/                     # Shared utilities
│   │   ├── math/
│   │   │   ├── Vector2D.ts
│   │   │   └── Collision.ts
│   │   ├── helpers/
│   │   └── constants.ts
│   │
│   ├── types/                     # TypeScript definitions
│   │   ├── entities.d.ts
│   │   ├── events.d.ts
│   │   └── game.d.ts
│   │
│   ├── main.ts                    # Application entry point
│   └── EngineAPI.ts               # Public API facade
│
├── tests/
│   ├── unit/                      # Vitest unit tests
│   ├── integration/               # Integration tests
│   └── e2e/                       # Playwright E2E tests
│
├── .github/
│   └── workflows/
│       ├── ci.yml                 # Continuous integration
│       └── deploy.yml             # Deployment automation
│
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
├── .eslintrc.json
├── .prettierrc
└── README.md
```

---

## Development Phases

### Phase 0: Project Setup (Week 1)

**Goal**: Initialize project with all tooling and infrastructure

#### Tasks
1. **Repository Setup**
   - Initialize Git repository
   - Set up branch protection rules
   - Configure GitHub Actions workflows
   - Create issue/PR templates

2. **Development Environment**
   ```bash
   # Initialize project
   pnpm create vite amazonvibetrail --template react-ts
   cd amazonvibetrail

   # Install core dependencies
   pnpm add pixi.js matter-js zustand howler.js dexie
   pnpm add -D @types/matter-js @types/howler

   # Install development tools
   pnpm add -D vitest @testing-library/react playwright
   pnpm add -D eslint prettier husky lint-staged
   pnpm add -D typedoc
   ```

3. **Configuration Files**
   - Set up TypeScript strict mode
   - Configure ESLint rules
   - Set up Prettier
   - Configure Vite build options
   - Set up path aliases (@core, @ui, @utils)

4. **Project Structure**
   - Create directory structure as outlined above
   - Set up barrel exports (index.ts files)
   - Create placeholder files with interfaces

5. **Documentation**
   - Set up TypeDoc configuration
   - Create CONTRIBUTING.md
   - Create CODE_OF_CONDUCT.md
   - Update README with setup instructions

**Deliverables**:
- Fully configured development environment
- CI/CD pipeline running basic checks
- Documentation framework in place

---

### Phase 1: Core Engine Foundation (Weeks 2-4)

**Goal**: Build the headless game engine with basic simulation

#### 1.1 Game Loop & Tick System (Week 2, Days 1-3)

**Implementation**:

```typescript
// src/core/engine/TickManager.ts
export class TickManager {
  private targetFPS = 60;
  private accumulator = 0;
  private lastTime = 0;
  private fixedDeltaTime = 1000 / 60; // 16.67ms

  public tick(callback: (deltaTime: number) => void): void {
    // Fixed timestep implementation
    // Prevents physics inconsistencies
  }
}

// src/core/engine/GameEngine.ts
export class GameEngine {
  private tickManager: TickManager;
  private physicsSystem: PhysicsSystem;
  private stateManager: StateManager;
  private running = false;

  public initialize(config: GameConfig): void {
    // Bootstrap all systems
  }

  public start(): void {
    this.running = true;
    this.gameLoop();
  }

  private gameLoop(): void {
    // Main game loop
    // 1. Process input
    // 2. Update physics
    // 3. Update entities
    // 4. Emit events
  }
}
```

**Tests**:
- Unit test: TickManager maintains consistent frame rate
- Unit test: GameEngine initializes all systems
- Unit test: Game loop processes in correct order

#### 1.2 Physics Integration (Week 2, Days 4-5)

**Implementation**:

```typescript
// src/core/engine/PhysicsSystem.ts
import Matter from 'matter-js';

export class PhysicsSystem {
  private engine: Matter.Engine;
  private world: Matter.World;

  public initialize(): void {
    this.engine = Matter.Engine.create({
      gravity: { x: 0, y: 0 } // Top-down view, no gravity
    });
    this.world = this.engine.world;
  }

  public step(deltaTime: number): void {
    Matter.Engine.update(this.engine, deltaTime);
  }

  public addBody(body: Matter.Body): void {
    Matter.World.add(this.world, body);
  }

  public removeBody(body: Matter.Body): void {
    Matter.World.remove(this.world, body);
  }
}
```

**Tests**:
- Unit test: PhysicsSystem initializes Matter.js correctly
- Integration test: Bodies collide and trigger events
- Performance test: Can handle 100+ physics bodies at 60fps

#### 1.3 Entity System (Week 3)

**Implementation**:

```typescript
// src/core/entities/Entity.ts
export abstract class Entity {
  public id: string;
  public position: Vector2D;
  public velocity: Vector2D;
  public physicsBody?: Matter.Body;

  abstract update(deltaTime: number): void;
  abstract onCollision(other: Entity): void;
}

// src/core/entities/Canoe.ts
export class Canoe extends Entity {
  public health: number = 100;
  public speed: number = 0;
  public steeringAngle: number = 0;

  public steer(angle: number): void {
    this.steeringAngle = angle;
    // Apply forces to physics body
  }

  public update(deltaTime: number): void {
    // Update velocity based on steering
    // Apply river current effects
    // Update sprite rotation
  }

  public onCollision(other: Entity): void {
    if (other instanceof Obstacle) {
      this.takeDamage(10);
    }
  }
}
```

**Tests**:
- Unit test: Canoe steering affects velocity
- Unit test: Collision reduces health
- Integration test: Canoe responds to river current

#### 1.4 Player Profile & State (Week 4)

**Implementation**:

```typescript
// src/core/models/PlayerProfile.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PlayerProfile {
  health: number;
  rations: number;
  statusEffects: StatusEffect[];
  inventory: Inventory;
  navigation: NavigationState;
  score: number;
}

export const usePlayerStore = create<PlayerProfile>()(
  persist(
    (set) => ({
      health: 100,
      rations: 50,
      statusEffects: [],
      inventory: {
        harpoons: 12,
        quinine: 0,
        cameraFilm: 24,
        guidebookEntries: [],
        tradeGoods: []
      },
      navigation: {
        currentEra: '1993',
        currentNodeId: 'bellem_port',
        targetNodeId: null,
        distanceOnSegment: 0,
        totalSegmentLength: 0
      },
      score: 0,

      // Actions
      consumeRations: (amount) => set((state) => ({
        rations: Math.max(0, state.rations - amount)
      })),

      takeDamage: (amount) => set((state) => ({
        health: Math.max(0, state.health - amount)
      }))
    }),
    {
      name: 'amazon-trail-save',
      version: 1
    }
  )
);
```

**Tests**:
- Unit test: State updates correctly
- Unit test: Persistence works
- Unit test: Actions modify state properly

**Deliverables**:
- Functional game engine running at 60fps
- Physics simulation working
- Basic entity system with Canoe
- Player state management
- 80%+ test coverage

---

### Phase 2: Navigation & Map System (Weeks 5-7)

**Goal**: Implement node-based navigation and river generation

#### 2.1 Map Graph System (Week 5)

**Implementation**:

```typescript
// src/core/models/MapGraph.ts
export interface MapNode {
  id: string;
  name: string;
  type: 'SETTLEMENT' | 'LANDMARK' | 'FORK' | 'HIDDEN';
  coordinates: { x: number; y: number };
  eraRestriction?: string;
  events?: string[]; // Event IDs that can trigger here
}

export interface MapEdge {
  from: string;
  to: string;
  distance: number; // In kilometers
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'EXTREME';
  biome: 'RIVER_WIDE' | 'JUNGLE_DEEP' | 'RAPIDS' | 'TRIBUTARY';
}

export interface MapGraph {
  nodes: Map<string, MapNode>;
  edges: MapEdge[];

  getNode(id: string): MapNode | undefined;
  getEdgesFrom(nodeId: string): MapEdge[];
  getPath(from: string, to: string): MapEdge[];
}

// src/core/systems/NavigationManager.ts
export class NavigationManager {
  private mapGraph: MapGraph;
  private currentSegment: MapEdge | null = null;
  private progress: number = 0; // 0-1 along current segment

  public setDestination(targetNodeId: string): void {
    // Calculate path using A* or Dijkstra
    // Set up segment progression
  }

  public update(distanceTraveled: number): void {
    // Update progress along segment
    // Check for arrival at nodes
    // Trigger fork events when approaching splits
  }

  public getCurrentBiome(): string {
    return this.currentSegment?.biome || 'RIVER_WIDE';
  }
}
```

**Data Files**:

```json
// public/data/maps/amazon_main.json
{
  "id": "amazon_main",
  "name": "Amazon River Basin",
  "nodes": [
    {
      "id": "belem",
      "name": "Belém",
      "type": "SETTLEMENT",
      "coordinates": { "x": 100, "y": 500 },
      "events": ["tutorial_start", "jaguar_spirit"]
    },
    {
      "id": "santarem",
      "name": "Santarém",
      "type": "SETTLEMENT",
      "coordinates": { "x": 300, "y": 450 },
      "events": ["trade_post", "meet_rubber_tapper"]
    },
    {
      "id": "manaus",
      "name": "Manaus",
      "type": "SETTLEMENT",
      "coordinates": { "x": 500, "y": 400 },
      "events": ["opera_house", "rubber_baron"]
    }
  ],
  "edges": [
    {
      "from": "belem",
      "to": "santarem",
      "distance": 200,
      "difficulty": "EASY",
      "biome": "RIVER_WIDE"
    },
    {
      "from": "santarem",
      "to": "manaus",
      "distance": 250,
      "difficulty": "MEDIUM",
      "biome": "JUNGLE_DEEP"
    }
  ]
}
```

**Tests**:
- Unit test: Map graph loads from JSON
- Unit test: Path finding works
- Integration test: Navigation updates correctly

#### 2.2 River Generation (Week 6)

**Implementation**:

```typescript
// src/core/systems/RiverGenerator.ts
export class RiverGenerator {
  // Procedurally generate river geometry based on current segment
  public generateRiverSegment(edge: MapEdge, seed: number): RiverGeometry {
    // Use Perlin noise for natural curves
    // Adjust width based on biome
    // Add obstacles based on difficulty
    // Create fork markers when approaching branch points
  }
}

export interface RiverGeometry {
  centerline: Vector2D[]; // Spline points
  width: number;
  obstacles: ObstacleDefinition[];
  currentStrength: number;
  currentDirection: Vector2D;
}
```

**Tests**:
- Unit test: River generation is deterministic (same seed = same river)
- Unit test: Difficulty affects obstacle density
- Visual test: River looks natural and playable

#### 2.3 Fork Logic (Week 7)

**Implementation**:

```typescript
// src/core/entities/Fork.ts
export class Fork extends Entity {
  public leftPath: string;  // Node ID
  public rightPath: string; // Node ID
  public decisionDistance: number = 50; // Meters before fork

  public update(deltaTime: number): void {
    // Visualize fork marker
    // Detect if player has passed decision point
    // Lock in choice
  }
}

// In NavigationManager
public checkForUpcomingFork(): Fork | null {
  const distanceToNextNode = this.getRemainingDistance();
  if (distanceToNextNode < 100) {
    const nextNode = this.getNextNode();
    const branches = this.mapGraph.getEdgesFrom(nextNode.id);
    if (branches.length > 1) {
      return new Fork(branches[0].to, branches[1].to);
    }
  }
  return null;
}
```

**Tests**:
- Unit test: Fork spawns at correct distance
- Integration test: Player choice updates navigation
- E2E test: Missing a fork takes default path

**Deliverables**:
- Map graph system loading from JSON
- Procedural river generation
- Fork/branching mechanics working
- Navigation progress tracking

---

### Phase 3: GUI Framework (Weeks 8-10)

**Goal**: Build the rendering pipeline and UI foundation

#### 3.1 Rendering Pipeline (Week 8)

**Implementation**:

```typescript
// src/rendering/renderers/WorldRenderer.ts
import * as PIXI from 'pixi.js';

export class WorldRenderer {
  private app: PIXI.Application;
  private layers: {
    background: PIXI.Container;
    world: PIXI.Container;
    entities: PIXI.Container;
    effects: PIXI.Container;
  };

  public initialize(canvasElement: HTMLCanvasElement): void {
    this.app = new PIXI.Application({
      view: canvasElement,
      width: 1920,
      height: 1080,
      backgroundColor: 0x87CEEB, // Sky blue
      resolution: window.devicePixelRatio || 1,
      autoDensity: true
    });

    // Create layer hierarchy
    this.setupLayers();
  }

  public render(entities: Entity[], camera: Camera): void {
    // Clear previous frame
    // Update camera transform
    // Render background (parallax)
    // Render entities (sorted by z-index)
    // Apply post-processing filters
  }
}

// src/rendering/renderers/HUDRenderer.ts
export class HUDRenderer {
  private hudContainer: PIXI.Container;

  public renderDashboard(playerProfile: PlayerProfile): void {
    // Draw compass
    // Draw health/rations gauges
    // Draw quick slots
  }
}
```

**Setup**:

```typescript
// src/main.ts
import { GameEngine } from '@core/engine/GameEngine';
import { WorldRenderer } from '@rendering/renderers/WorldRenderer';
import { createRoot } from 'react-dom/client';
import { GameScreen } from '@ui/screens/GameScreen';

const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
const uiRoot = document.getElementById('ui-root') as HTMLElement;

// Initialize engine
const engine = new GameEngine();
engine.initialize(config);

// Initialize renderer
const worldRenderer = new WorldRenderer();
worldRenderer.initialize(canvas);

// Mount React UI
createRoot(uiRoot).render(<GameScreen />);

// Start game loop
engine.start();
```

**Tests**:
- Visual test: Layers render in correct order
- Performance test: Maintains 60fps with 50+ entities
- Unit test: Camera transform works

#### 3.2 UI Component Library (Week 9)

**Implementation**:

```tsx
// src/rendering/ui/components/Dashboard/HealthGauge.tsx
import React from 'react';
import { usePlayerStore } from '@core/models/PlayerProfile';
import styles from './HealthGauge.module.css';

export const HealthGauge: React.FC = () => {
  const health = usePlayerStore(state => state.health);

  return (
    <div className={styles.gauge}>
      <div className={styles.label}>Health</div>
      <div className={styles.barContainer}>
        <div
          className={styles.barFill}
          style={{ width: `${health}%` }}
        />
      </div>
      <div className={styles.value}>{health}</div>
    </div>
  );
};

// src/rendering/ui/components/Dashboard/Dashboard.tsx
export const Dashboard: React.FC = () => {
  return (
    <div className={styles.dashboard}>
      <Compass />
      <HealthGauge />
      <RationsGauge />
      <QuickSlots />
      <StatusIndicators />
    </div>
  );
};
```

**Styling**:

```css
/* src/rendering/ui/components/Dashboard/Dashboard.module.css */
.dashboard {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 150px;
  background: linear-gradient(to top, #2c1810, transparent);
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 20px;
  pointer-events: none;
}

.dashboard > * {
  pointer-events: auto;
}

/* Skeuomorphic styling with wood texture, brass details, etc. */
```

**Components to Build**:
- Dashboard (HUD)
- Modal wrapper
- Button variants
- Input fields
- Tooltip system

**Tests**:
- Storybook stories for each component
- Unit tests for interaction logic
- Visual regression tests

#### 3.3 Input Routing System (Week 10)

**Implementation**:

```typescript
// src/input/InputRouter.ts
export class InputRouter {
  private keyboardHandler: KeyboardHandler;
  private mouseHandler: MouseHandler;
  private uiLayer: HTMLElement;
  private gameCanvas: HTMLCanvasElement;

  public initialize(): void {
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    // Mouse events
    this.gameCanvas.addEventListener('click', (e) => {
      if (this.isOverUI(e)) {
        // Let React handle it
        return;
      }
      this.handleGameWorldClick(e);
    });

    // Keyboard events
    window.addEventListener('keydown', (e) => {
      // Check if input field is focused
      if (document.activeElement?.tagName === 'INPUT') {
        return;
      }
      this.handleGameInput(e);
    });
  }

  private isOverUI(event: MouseEvent): boolean {
    const uiElements = document.elementsFromPoint(event.clientX, event.clientY);
    return uiElements.some(el => el.closest('#ui-root'));
  }

  private handleGameInput(event: KeyboardEvent): void {
    switch(event.key) {
      case 'ArrowLeft':
        this.engine.sendCommand('STEER', { angle: -15 });
        break;
      case 'ArrowRight':
        this.engine.sendCommand('STEER', { angle: 15 });
        break;
      case ' ':
        this.engine.sendCommand('USE_ITEM', { item: 'harpoon' });
        break;
      case 'm':
        this.engine.sendCommand('TOGGLE_MAP');
        break;
    }
  }
}
```

**Tests**:
- Integration test: UI clicks don't affect game world
- Integration test: Keyboard shortcuts work
- Unit test: Input mapping configuration

**Deliverables**:
- PixiJS rendering pipeline with layers
- React UI component library
- Input routing between game and UI
- Storybook documentation

---

### Phase 4: Complex UI Screens (Weeks 11-14)

**Goal**: Build the major UI interfaces

#### 4.1 Interactive Map (Week 11)

**Implementation**:

```tsx
// src/rendering/ui/components/Map/InteractiveMap.tsx
import React, { useRef, useEffect, useState } from 'react';
import { MapGraph } from '@core/models/MapGraph';
import styles from './InteractiveMap.module.css';

export const InteractiveMap: React.FC<{ mapGraph: MapGraph }> = ({ mapGraph }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    renderMap(ctx, mapGraph, { zoom, pan });
  }, [mapGraph, zoom, pan]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom(prev => Math.max(0.5, Math.min(3, prev + e.deltaY * -0.001)));
  };

  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(nodeId);
    // Show node details
    // Offer "Plot Course" button
  };

  return (
    <div className={styles.mapContainer}>
      <canvas
        ref={canvasRef}
        onWheel={handleWheel}
        onClick={handleCanvasClick}
        className={styles.mapCanvas}
      />
      {selectedNode && (
        <NodeDetails
          node={mapGraph.getNode(selectedNode)}
          onPlotCourse={plotCourseToNode}
        />
      )}
    </div>
  );
};

function renderMap(
  ctx: CanvasRenderingContext2D,
  graph: MapGraph,
  view: { zoom: number, pan: Vector2D }
): void {
  // Clear canvas
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Apply transform
  ctx.save();
  ctx.translate(view.pan.x, view.pan.y);
  ctx.scale(view.zoom, view.zoom);

  // Draw parchment background
  ctx.fillStyle = '#f4e7d7';
  ctx.fillRect(0, 0, 2000, 1500);

  // Draw edges (river segments)
  ctx.strokeStyle = '#4a90e2';
  ctx.lineWidth = 8;
  graph.edges.forEach(edge => {
    const fromNode = graph.getNode(edge.from);
    const toNode = graph.getNode(edge.to);
    if (fromNode && toNode) {
      drawRiverSegment(ctx, fromNode.coordinates, toNode.coordinates);
    }
  });

  // Draw nodes
  graph.nodes.forEach(node => {
    drawNode(ctx, node);
  });

  ctx.restore();
}
```

**Features**:
- Pan and zoom
- Fog of war (unvisited areas dimmed)
- Node hover tooltips
- Path plotting
- Current location marker

**Tests**:
- E2E test: User can zoom and pan map
- E2E test: Clicking node shows details
- Visual test: Map renders correctly

#### 4.2 Guidebook Interface (Week 12)

**Implementation**:

```tsx
// src/rendering/ui/components/Guidebook/Guidebook.tsx
export const Guidebook: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'detail'>('grid');
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null);

  const entries = usePlayerStore(state => state.inventory.guidebookEntries);

  return (
    <div className={styles.guidebook}>
      <div className={styles.leftPage}>
        {viewMode === 'grid' ? (
          <EntryGrid
            entries={entries}
            onSelectEntry={(id) => {
              setSelectedEntry(id);
              setViewMode('detail');
            }}
          />
        ) : (
          <EntryDetail entry={entries.find(e => e.id === selectedEntry)} />
        )}
      </div>

      <div className={styles.spine} />

      <div className={styles.rightPage}>
        {viewMode === 'detail' && selectedEntry && (
          <EntryIllustration entryId={selectedEntry} />
        )}
      </div>

      <PageControls
        currentPage={currentPage}
        totalPages={Math.ceil(entries.length / 6)}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

// src/rendering/ui/components/Guidebook/EntryGrid.tsx
const EntryGrid: React.FC = ({ entries, onSelectEntry }) => {
  return (
    <div className={styles.grid}>
      {entries.map(entry => (
        <div
          key={entry.id}
          className={styles.gridItem}
          onClick={() => onSelectEntry(entry.id)}
        >
          <img src={entry.thumbnail} alt={entry.name} />
          <span>{entry.name}</span>
        </div>
      ))}
      {/* Show silhouettes for undiscovered entries */}
      {getUndiscoveredPlaceholders().map((_, idx) => (
        <div key={`unknown-${idx}`} className={styles.unknownItem}>
          <div className={styles.silhouette}>?</div>
        </div>
      ))}
    </div>
  );
};
```

**Features**:
- Page flip animation (CSS transforms)
- Grid view of collected specimens
- Detail view with scientific info
- Filter/search functionality
- Unlock animations

**Tests**:
- E2E test: User can browse guidebook
- Unit test: Filters work correctly
- Visual test: Page flip animation

#### 4.3 Dialogue System (Week 13)

**Implementation**:

```typescript
// public/data/dialogues/roosevelt_1913.json
{
  "id": "roosevelt_encounter_1913",
  "npc": {
    "name": "Theodore Roosevelt",
    "portrait": "roosevelt_1913.png",
    "title": "Former President and Explorer"
  },
  "rootNode": "greeting",
  "nodes": {
    "greeting": {
      "speaker": "roosevelt",
      "text": "Bully! Another traveler on this magnificent river. What brings you to these untamed lands?",
      "choices": [
        {
          "text": "I'm searching for Vilcabamba, the lost Inca city.",
          "nextNode": "quest_response",
          "requires": { "flag": "jaguar_spirit_met" }
        },
        {
          "text": "I'm documenting the wildlife of the Amazon.",
          "nextNode": "wildlife_discussion"
        },
        {
          "text": "Just exploring, sir.",
          "nextNode": "explorer_kinship"
        }
      ]
    },
    "quest_response": {
      "speaker": "roosevelt",
      "text": "Vilcabamba! The last refuge of the Incas. I've heard tales... Take this map fragment. It may aid your journey.",
      "effects": [
        { "type": "ADD_ITEM", "item": "map_fragment_vilcabamba" },
        { "type": "SET_FLAG", "flag": "roosevelt_helped" }
      ],
      "choices": [
        {
          "text": "Thank you, Mr. President!",
          "nextNode": "farewell"
        }
      ]
    }
  }
}
```

```tsx
// src/rendering/ui/components/Dialogue/DialogueSystem.tsx
export const DialogueSystem: React.FC<{ dialogueId: string }> = ({ dialogueId }) => {
  const [dialogue, setDialogue] = useState<Dialogue | null>(null);
  const [currentNode, setCurrentNode] = useState<string>('');
  const [history, setHistory] = useState<DialogueNode[]>([]);

  useEffect(() => {
    loadDialogue(dialogueId).then(setDialogue);
  }, [dialogueId]);

  const handleChoice = (choice: DialogueChoice) => {
    // Check requirements
    if (!meetsRequirements(choice.requires)) {
      return;
    }

    // Apply effects
    applyEffects(choice.effects);

    // Update history
    setHistory(prev => [...prev, dialogue.nodes[currentNode]]);

    // Navigate to next node
    setCurrentNode(choice.nextNode);
  };

  return (
    <div className={styles.dialogueOverlay}>
      <div className={styles.portrait}>
        <img src={dialogue?.npc.portrait} alt={dialogue?.npc.name} />
      </div>

      <div className={styles.textBox}>
        <div className={styles.npcName}>{dialogue?.npc.name}</div>
        <div className={styles.text}>
          {dialogue?.nodes[currentNode]?.text}
        </div>

        <div className={styles.choices}>
          {dialogue?.nodes[currentNode]?.choices.map((choice, idx) => (
            <button
              key={idx}
              onClick={() => handleChoice(choice)}
              disabled={!meetsRequirements(choice.requires)}
              className={styles.choice}
            >
              {choice.text}
            </button>
          ))}
        </div>
      </div>

      <DialogueHistory history={history} />
    </div>
  );
};
```

**Features**:
- JSON-driven dialogue trees
- Choice requirements (flags, items)
- Effects system (give items, set flags)
- Conversation history
- Portrait animations

**Tests**:
- Unit test: Dialogue tree navigation
- Unit test: Requirements checking
- E2E test: Full conversation flow

#### 4.4 Inventory & Trade (Week 14)

**Implementation**:

```tsx
// src/rendering/ui/components/Inventory/Inventory.tsx
export const Inventory: React.FC = () => {
  const inventory = usePlayerStore(state => state.inventory);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  return (
    <div className={styles.inventoryScreen}>
      <div className={styles.itemGrid}>
        {Object.entries(inventory).map(([itemId, quantity]) => (
          <ItemSlot
            key={itemId}
            itemId={itemId}
            quantity={quantity}
            selected={selectedItem === itemId}
            onClick={() => setSelectedItem(itemId)}
          />
        ))}
      </div>

      {selectedItem && (
        <ItemDetails
          itemId={selectedItem}
          onUse={() => useItem(selectedItem)}
          onDrop={() => dropItem(selectedItem)}
        />
      )}

      <StatsPanel />
    </div>
  );
};

// src/rendering/ui/components/Trade/TradeWindow.tsx
export const TradeWindow: React.FC<{ merchantId: string }> = ({ merchantId }) => {
  const [playerOffer, setPlayerOffer] = useState<TradeItem[]>([]);
  const [merchantOffer, setMerchantOffer] = useState<TradeItem[]>([]);

  const playerValue = calculateTradeValue(playerOffer);
  const merchantValue = calculateTradeValue(merchantOffer);
  const balanceDifference = merchantValue - playerValue;

  return (
    <div className={styles.tradeWindow}>
      <div className={styles.playerSide}>
        <h3>Your Offer</h3>
        <InventoryPicker
          onSelect={(item) => addToPlayerOffer(item)}
        />
        <TradeValue value={playerValue} />
      </div>

      <div className={styles.balance}>
        <TradeBalanceIndicator difference={balanceDifference} />
        <button
          onClick={executeTrade}
          disabled={Math.abs(balanceDifference) > 5}
        >
          Trade
        </button>
      </div>

      <div className={styles.merchantSide}>
        <h3>Merchant's Offer</h3>
        <MerchantInventory
          merchantId={merchantId}
          onSelect={(item) => addToMerchantOffer(item)}
        />
        <TradeValue value={merchantValue} />
      </div>
    </div>
  );
};
```

**Features**:
- Grid-based inventory
- Item tooltips with stats
- Drag-and-drop trading
- Value calculation system
- Trade validation

**Tests**:
- E2E test: User can trade items
- Unit test: Trade value calculation
- Unit test: Invalid trades rejected

**Deliverables**:
- Interactive map with fog of war
- Guidebook with page flipping
- Dialogue system with branching
- Inventory and trading interfaces

---

### Phase 5: Content Integration (Weeks 15-17)

**Goal**: Populate game with actual content and events

#### 5.1 Event System (Week 15)

**Implementation**:

```typescript
// src/core/systems/EventSystem.ts
export enum EventType {
  DIALOGUE = 'EVENT_TYPE_DIALOGUE',
  HAZARD = 'EVENT_TYPE_HAZARD',
  DISCOVERY = 'EVENT_TYPE_DISCOVERY',
  TRADE = 'EVENT_TYPE_TRADE'
}

export interface GameEvent {
  id: string;
  type: EventType;
  trigger: EventTrigger;
  data: any;
}

export interface EventTrigger {
  type: 'LOCATION' | 'COLLISION' | 'RANDOM' | 'TIME';
  conditions: EventCondition[];
}

export class EventSystem {
  private events: GameEvent[] = [];
  private activeEvents: Set<string> = new Set();

  public registerEvent(event: GameEvent): void {
    this.events.push(event);
  }

  public checkTriggers(context: GameContext): GameEvent[] {
    return this.events
      .filter(event => !this.activeEvents.has(event.id))
      .filter(event => this.evaluateTrigger(event.trigger, context));
  }

  public triggerEvent(event: GameEvent): void {
    this.activeEvents.add(event.id);

    switch(event.type) {
      case EventType.DIALOGUE:
        this.openDialogue(event.data.dialogueId);
        break;
      case EventType.HAZARD:
        this.handleHazard(event.data);
        break;
      case EventType.DISCOVERY:
        this.unlockGuidebookEntry(event.data.entryId);
        break;
      case EventType.TRADE:
        this.openTradeWindow(event.data.merchantId);
        break;
    }
  }
}
```

**Content Files**:

```json
// public/data/encounters/manaus_1910.json
{
  "id": "manaus_rubber_boom",
  "location": "manaus",
  "era": "1910",
  "events": [
    {
      "id": "opera_house_visit",
      "type": "EVENT_TYPE_DIALOGUE",
      "trigger": {
        "type": "LOCATION",
        "conditions": [
          { "flag": "first_visit_manaus" }
        ]
      },
      "data": {
        "dialogueId": "opera_house_tour"
      }
    },
    {
      "id": "rubber_baron_trade",
      "type": "EVENT_TYPE_TRADE",
      "trigger": {
        "type": "LOCATION",
        "conditions": [
          { "flag": "opera_house_visited" }
        ]
      },
      "data": {
        "merchantId": "rubber_baron",
        "inventory": [
          { "id": "rubber", "quantity": 100, "value": 50 },
          { "id": "quinine", "quantity": 3, "value": 75 }
        ]
      }
    }
  ]
}
```

#### 5.2 Content Creation (Weeks 15-17)

**Assets to Create**:

1. **Map Nodes** (20-30 locations)
   - Belém, Santarém, Manaus, Iquitos, etc.
   - Hidden tributaries and Vilcabamba

2. **Dialogue Trees** (15-20 encounters)
   - Teddy Roosevelt (1913)
   - Henry Ford (1928)
   - Henry Bates (1850s)
   - Rubber tappers, merchants, indigenous guides

3. **Guidebook Entries** (50-75 species)
   - Flora: Rubber tree, Cinchona, Brazil nut, Orchids
   - Fauna: Jaguar, Macaw, Piranha, River dolphin, Sloth
   - Include scientific names, descriptions, historical context

4. **Items & Equipment** (30-40 items)
   - Harpoons, fishing rod, camera, film
   - Medicine (Quinine, bandages)
   - Trade goods (spices, rubber, coffee)
   - Quest items (map fragments, artifacts)

5. **Hazards & Obstacles** (15-20 types)
   - Logs, rocks, rapids, whirlpools
   - Wildlife (piranhas, caimans)
   - Weather (storms, fog)

**Tools**:
- Create content editor (simple web form)
- Validation scripts for JSON
- Asset pipeline for images/audio

**Tests**:
- Content validation tests
- Spelling/grammar checks
- Playtest all dialogue paths

---

### Phase 6: Polish & Optimization (Weeks 18-20)

**Goal**: Audio, effects, performance, and final polish

#### 6.1 Audio Implementation (Week 18)

**Implementation**:

```typescript
// src/audio/AudioManager.ts
import { Howl, Howler } from 'howler';

export class AudioManager {
  private music: Map<string, Howl> = new Map();
  private sfx: Map<string, Howl> = new Map();
  private currentMusic: Howl | null = null;

  public initialize(): void {
    // Load audio assets
    this.loadMusic();
    this.loadSFX();

    // Set master volume from config
    const volume = useConfigStore.getState().audio.masterVolume;
    Howler.volume(volume);
  }

  public playMusic(trackId: string, fadeIn: number = 1000): void {
    const track = this.music.get(trackId);
    if (!track) return;

    // Fade out current music
    if (this.currentMusic) {
      this.currentMusic.fade(1, 0, 1000);
      this.currentMusic.once('fade', () => this.currentMusic?.stop());
    }

    // Fade in new music
    track.volume(0);
    track.play();
    track.fade(0, 1, fadeIn);
    this.currentMusic = track;
  }

  public playSFX(sfxId: string, volume: number = 1): void {
    const sound = this.sfx.get(sfxId);
    if (!sound) return;

    sound.volume(volume);
    sound.play();
  }

  public setMasterVolume(volume: number): void {
    Howler.volume(volume);
  }
}
```

**Audio Assets Needed**:
- **Music**:
  - Main menu theme
  - River travel (calm)
  - River travel (tense/rapids)
  - Settlement theme
  - Time warp transition
  - Historical encounter themes
  - Victory/defeat

- **SFX**:
  - Water splashing
  - Canoe creaking
  - Collision impacts
  - Wildlife calls (birds, monkeys, jaguars)
  - UI clicks, page turns
  - Camera shutter
  - Harpoon throw
  - Dialogue text typing

**Sources**:
- Freesound.org (CC-licensed)
- Custom recordings
- Royalty-free music libraries

#### 6.2 Visual Effects (Week 19)

**Implementation**:

```typescript
// src/rendering/renderers/EffectsRenderer.ts
import * as PIXI from 'pixi.js';
import { Emitter } from '@pixi/particle-emitter';

export class EffectsRenderer {
  private emitters: Map<string, Emitter> = new Map();

  public createSplashEffect(position: Vector2D): void {
    const emitter = new Emitter(
      this.effectsContainer,
      {
        lifetime: { min: 0.3, max: 0.6 },
        frequency: 0.001,
        spawnChance: 1,
        particlesPerWave: 10,
        emitterLifetime: 0.1,
        maxParticles: 20,
        pos: position,
        behaviors: [
          {
            type: 'alpha',
            config: { alpha: { list: [{ value: 1, time: 0 }, { value: 0, time: 1 }] }}
          },
          {
            type: 'scale',
            config: { scale: { list: [{ value: 0.5, time: 0 }, { value: 0.1, time: 1 }] }}
          },
          {
            type: 'color',
            config: { color: { list: [{ value: '#ffffff', time: 0 }, { value: '#4a90e2', time: 1 }] }}
          },
          {
            type: 'moveSpeed',
            config: { speed: { list: [{ value: 200, time: 0 }, { value: 50, time: 1 }] }}
          }
        ]
      }
    );

    emitter.emit = true;
  }

  public applySepiaTone(intensity: number): void {
    const filter = new PIXI.ColorMatrixFilter();
    filter.sepia(true);
    this.worldContainer.filters = [filter];
  }

  public createTimeWarpEffect(): void {
    // Swirl/vortex shader
    // Screen fade to white
    // Particle burst
    // Era transition animation
  }
}
```

**Effects to Implement**:
- Water splashes
- Mist/fog (Blue Mist patches)
- Rain particles
- Screen shake on collision
- Time warp vortex
- Era transition (sepia fade)
- Camera flash
- Discovery sparkle
- Menu transitions

#### 6.3 Performance Optimization (Week 20)

**Optimizations**:

1. **Rendering**:
   - Object pooling for frequently created entities
   - Sprite batching in PixiJS
   - Culling off-screen entities
   - Reduce draw calls

2. **Physics**:
   - Broad-phase collision detection
   - Sleep inactive bodies
   - Limit physics updates to visible area

3. **Asset Loading**:
   - Lazy loading for non-critical assets
   - Texture atlases to reduce HTTP requests
   - Compress images (WebP)
   - Audio sprite sheets

4. **Code Splitting**:
   ```typescript
   // Lazy load UI screens
   const MapScreen = lazy(() => import('@ui/screens/MapScreen'));
   const GuidebookScreen = lazy(() => import('@ui/screens/GuidebookScreen'));
   ```

5. **Bundle Size**:
   - Tree-shaking unused code
   - Code splitting by route
   - Compress with Brotli
   - Analyze bundle with rollup-plugin-visualizer

**Performance Budget**:
- Initial load: < 500KB (gzipped)
- Time to interactive: < 3s
- Frame rate: 60fps (desktop), 30fps minimum (mobile)
- Memory usage: < 200MB

**Tests**:
- Lighthouse performance audit (score > 90)
- Load testing with slow 3G
- Memory leak detection
- Frame rate profiling

**Deliverables**:
- Complete audio implementation
- All visual effects working
- Performance optimized for 60fps
- Bundle size under budget

---

## Testing Strategy

### Unit Tests (Vitest)

**Coverage Target**: 80%+ for core systems

```typescript
// tests/unit/core/entities/Canoe.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { Canoe } from '@core/entities/Canoe';

describe('Canoe', () => {
  let canoe: Canoe;

  beforeEach(() => {
    canoe = new Canoe({ x: 0, y: 0 });
  });

  it('should initialize with correct default values', () => {
    expect(canoe.health).toBe(100);
    expect(canoe.speed).toBe(0);
  });

  it('should reduce health when taking damage', () => {
    canoe.takeDamage(25);
    expect(canoe.health).toBe(75);
  });

  it('should not allow health to go below 0', () => {
    canoe.takeDamage(150);
    expect(canoe.health).toBe(0);
  });

  it('should steer correctly', () => {
    canoe.steer(15);
    expect(canoe.steeringAngle).toBe(15);
  });
});
```

**Test Coverage**:
- All entity classes
- All system classes
- State management (Zustand stores)
- Utility functions
- Data loaders

### Integration Tests

```typescript
// tests/integration/navigation.test.ts
import { describe, it, expect } from 'vitest';
import { GameEngine } from '@core/engine/GameEngine';
import { NavigationManager } from '@core/systems/NavigationManager';

describe('Navigation Integration', () => {
  it('should trigger fork event when approaching branch', async () => {
    const engine = new GameEngine();
    await engine.initialize(testConfig);

    const navManager = engine.getSystem(NavigationManager);
    navManager.setDestination('manaus');

    // Simulate traveling 90% of segment
    const events: GameEvent[] = [];
    engine.subscribe('FORK_APPROACHING', (e) => events.push(e));

    navManager.update(180); // 180km of 200km segment

    expect(events.length).toBe(1);
    expect(events[0].type).toBe('FORK_APPROACHING');
  });
});
```

### E2E Tests (Playwright)

```typescript
// tests/e2e/gameplay.spec.ts
import { test, expect } from '@playwright/test';

test('complete tutorial journey', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // Start new game
  await page.click('text=New Game');
  await expect(page.locator('.tutorial-overlay')).toBeVisible();

  // Complete steering tutorial
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowRight');
  await page.click('text=Got it!');

  // Travel to first settlement
  await page.keyboard.down('ArrowUp'); // Accelerate
  await page.waitForSelector('text=Arriving at Santarém', { timeout: 30000 });

  // Open map
  await page.keyboard.press('m');
  await expect(page.locator('.interactive-map')).toBeVisible();

  // Check that Santarém is now revealed
  await expect(page.locator('[data-node-id="santarem"]')).toHaveClass(/visited/);
});

test('trade with merchant', async ({ page }) => {
  // Load save game with items
  await page.goto('http://localhost:5173');
  await page.click('text=Load Game');
  await page.click('text=Test Save');

  // Navigate to merchant
  await page.keyboard.press('m');
  await page.click('[data-node-id="manaus"]');
  await page.click('text=Plot Course');

  // Fast travel
  await page.click('[data-testid="fast-travel"]');

  // Open trade window
  await page.click('text=Trade');

  // Offer 5 fish for 1 harpoon
  await page.click('[data-item="fish"]');
  await page.fill('input[name="quantity"]', '5');
  await page.click('[data-item="harpoon"][data-side="merchant"]');

  // Execute trade
  await page.click('text=Trade');

  // Verify inventory updated
  const fishCount = await page.textContent('[data-item="fish"] .quantity');
  expect(parseInt(fishCount!)).toBeLessThan(5);
});
```

### Visual Regression Tests

```typescript
// tests/visual/ui-components.spec.ts
import { test } from '@playwright/test';

test('dashboard renders correctly', async ({ page }) => {
  await page.goto('http://localhost:5173/storybook');
  await page.click('text=Dashboard');

  await page.screenshot({
    path: 'tests/visual/screenshots/dashboard.png',
    fullPage: true
  });

  // Compare with baseline
  // (using Percy, Chromatic, or custom comparison)
});
```

---

## Deployment Plan

### Build Configuration

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: './dist/stats.html',
      open: false,
      gzipSize: true
    })
  ],
  resolve: {
    alias: {
      '@core': path.resolve(__dirname, './src/core'),
      '@rendering': path.resolve(__dirname, './src/rendering'),
      '@ui': path.resolve(__dirname, './src/rendering/ui'),
      '@input': path.resolve(__dirname, './src/input'),
      '@data': path.resolve(__dirname, './src/data'),
      '@utils': path.resolve(__dirname, './src/utils')
    }
  },
  build: {
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'zustand'],
          'game-engine': ['pixi.js', 'matter-js'],
          'ui-components': ['@ui/components']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
});
```

### Deployment Targets

#### 1. Web (GitHub Pages / Netlify / Vercel)

**GitHub Pages**:
```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - uses: pnpm/action-setup@v2
        with:
          version: 8

      - uses: actions/setup-node@v3
        with:
          node-version: 20
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile
      - run: pnpm test
      - run: pnpm build

      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

**Custom Domain**: `amazonvibetrail.com`

#### 2. Desktop (Electron)

```bash
pnpm add -D electron electron-builder
```

```typescript
// electron/main.ts
import { app, BrowserWindow } from 'electron';
import path from 'path';

function createWindow() {
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:5173');
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(createWindow);
```

**Build Configuration**:
```json
// package.json
{
  "build": {
    "appId": "com.amazonvibetrail.app",
    "productName": "Amazon Vibe Trail",
    "directories": {
      "output": "release"
    },
    "files": [
      "dist/**/*",
      "electron/**/*"
    ],
    "mac": {
      "target": "dmg",
      "icon": "build/icon.icns"
    },
    "win": {
      "target": "nsis",
      "icon": "build/icon.ico"
    },
    "linux": {
      "target": "AppImage",
      "icon": "build/icon.png"
    }
  }
}
```

#### 3. Mobile (Capacitor - Optional)

```bash
pnpm add @capacitor/core @capacitor/cli
pnpm exec cap init
pnpm exec cap add ios
pnpm exec cap add android
```

---

## Timeline Estimates

### Summary (20 weeks total for MVP)

| Phase | Duration | Deliverables |
|-------|----------|--------------|
| 0: Setup | 1 week | Dev environment, tooling, CI/CD |
| 1: Core Engine | 3 weeks | Game loop, physics, entities, state |
| 2: Navigation | 3 weeks | Map system, river generation, forks |
| 3: GUI Framework | 3 weeks | Rendering pipeline, UI library, input |
| 4: Complex UI | 4 weeks | Map, Guidebook, Dialogue, Inventory |
| 5: Content | 3 weeks | Events, dialogues, species, items |
| 6: Polish | 3 weeks | Audio, effects, optimization |

### Post-MVP Enhancements (Future)

- **Multiplayer** (racing mode, co-op exploration)
- **Mobile optimization** and touch controls
- **Mod support** (custom maps, dialogues, species)
- **Achievements system**
- **Speedrun timer and leaderboards**
- **Historical accuracy mode** vs. Arcade mode
- **VR support** for immersive exploration
- **Localization** (Spanish, Portuguese, French)

---

## Risk Mitigation

### Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Physics performance issues | Medium | High | Profile early, use object pooling, limit simulation area |
| Asset loading times | High | Medium | Lazy loading, compression, loading screens |
| Browser compatibility | Low | Medium | Polyfills, feature detection, graceful degradation |
| State management complexity | Medium | Medium | Use Zustand, clear boundaries, thorough testing |
| Audio playback issues | Medium | Low | Use Howler.js (handles cross-browser), fallback to silent mode |

### Content Risks

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Historical inaccuracies | Medium | Medium | Research sources, consult historians, add disclaimers |
| Offensive/insensitive content | Low | High | Sensitivity review, cultural consultants, playtesting |
| Insufficient content | Low | High | Prototype with 20% content, expand based on feedback |

### Project Risks

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Scope creep | High | High | Strict MVP definition, deferred features list |
| Team availability | Medium | Medium | Clear task breakdown, async-friendly workflow |
| Technology changes | Low | Medium | Lock dependency versions, upgrade cautiously |

---

## Success Metrics

### Technical Metrics
- ✅ Load time < 3s on broadband
- ✅ 60fps on mid-range hardware
- ✅ 80%+ test coverage
- ✅ Bundle size < 500KB (initial)
- ✅ Lighthouse score > 90

### User Experience Metrics
- ✅ Tutorial completion rate > 90%
- ✅ Average session length > 20 minutes
- ✅ Player retention (return after 1 week) > 40%
- ✅ Guidebook collection rate (avg % of species) > 60%
- ✅ Game completion rate > 25%

### Educational Metrics
- ✅ Players can name 10+ Amazonian species
- ✅ Players can identify 3+ historical figures
- ✅ Players understand time period contexts
- ✅ Positive feedback on educational value

---

## Conclusion

This implementation plan provides a detailed roadmap for building AmazonVibeTrail as a modern web-based game using TypeScript, PixiJS, and React. The phased approach allows for iterative development with clear deliverables, while the chosen tech stack balances performance, accessibility, and developer experience.

**Next Steps**:
1. Review and approve this plan
2. Set up development environment (Phase 0)
3. Begin Phase 1 implementation
4. Schedule weekly progress reviews
5. Adjust timeline based on actual progress

---

**Document Version**: 1.0
**Last Updated**: 2026-01-22
**Author**: Development Team
