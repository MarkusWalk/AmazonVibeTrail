# AmazonVibeTrail

> A modern recreation of the classic educational survival game "The Amazon Trail"

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Status: In Development](https://img.shields.io/badge/Status-In%20Development-blue.svg)]()

**📋 [View Implementation Plan](./IMPLEMENTATION_PLAN.md)** - Detailed technical roadmap with technology stack, phases, and timelines

## Table of Contents

- [About](#about)
- [Features](#features)
- [Technical Architecture](#technical-architecture)
  - [High-Level Architecture](#high-level-architecture)
  - [Data Structures](#data-structures--models)
  - [Core Systems](#core-systems--logic)
  - [GUI Architecture](#gui--presentation-architecture)
  - [Narrative Design](#narrative--content-architecture)
  - [API Interface](#interface-layer-api)
- [Getting Started](#getting-started)
- [Development Roadmap](#development-roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## About

**AmazonVibeTrail** is a faithful recreation of the beloved educational game "The Amazon Trail," combining survival mechanics, historical exploration, and environmental education. Navigate the Amazon River through time, meeting historical figures, collecting specimens, and learning about the ecosystem while completing a mystical quest.

### The Story

You begin your journey in modern-day Belém, where the Jaguar Spirit—an ancient Inca deity—appears in a dream. The Spirit reveals that the Inca King is dying of malaria in the hidden city of Vilcabamba. Your mission: travel up the Amazon River through time itself to collect the Cinchona plant (source of Quinine) and deliver the cure before it's too late.

---

## Features

### Core Gameplay
- **River Navigation**: Steer your canoe through treacherous waters, avoiding obstacles and managing resources
- **Time Travel Mechanics**: Navigate through "Blue Mist" patches to travel between different historical eras (1500s-1990s)
- **Survival Management**: Balance health, rations, and equipment while facing environmental hazards
- **Resource Gathering**: Fish for food, photograph wildlife, and collect botanical specimens

### Educational Content
- **Historical Encounters**: Meet figures like Teddy Roosevelt (1913), Henry Ford (1920s), and Henry Bates (1850s)
- **Interactive Guidebook**: Build a collection of Amazonian flora and fauna with scientific descriptions
- **Authentic Geography**: Navigate a node-based map of the actual Amazon River system
- **Era-Specific Events**: Experience historical contexts through scripted narrative events

### Rich User Interface
- **Skeuomorphic Design**: Dashboard gauges, parchment maps, and vintage guidebook aesthetics
- **Interactive Map**: Pan, zoom, and plot courses with fog-of-war exploration
- **Dialogue Trees**: Complex conversations with NPCs offering choices and consequences
- **Trade System**: Barter with merchants using collected goods

---

## Technical Architecture

This project follows a **Model-View-Controller (MVC)** architecture, strictly separating the simulation engine from the presentation layer for modularity and testability.

### High-Level Architecture

#### Core Modules

**GameEngine (Model)**
- The central coordinator managing the simulation "tick" rate
- Handles physics integration and logical state
- No knowledge of rendering or UI elements
- Pure business logic and game rules

**UIManager (View)**
- Manages the "Visual Stack" (rendering order)
- Handles window rendering and UI transitions (fades, slides)
- Responsible for all visual presentation

**InputRouter (Controller)**
- Sophisticated input management system
- Determines input context (UI element vs. game world)
- Routes commands to appropriate handlers
- Example: Distinguishes between clicking "Pause Button" vs. "Steer Canoe"

**StateManager**
- Controls high-level application flow
- Manages state transitions between screens
- Coordinates game phases

**NavigationManager**
- Manages node-based map graph
- Handles river branching logic
- Tracks player progress through the world

**DataRepository**
- Handles loading of assets and configuration
- Provides data to other systems
- Manages serialization/deserialization

---

### Data Structures & Models

#### 3.1. The Player State (PlayerProfile)

Global state persisted across game sessions.

```json
{
  "health": 100.0,
  "rations": 50.0,
  "status_effects": ["MALARIA_LATENT"],
  "inventory": {
    "harpoons": 12,
    "quinine": 0,
    "camera_film": 24,
    "guidebook_entries": [],
    "trade_goods": [
      { "id": "spices", "qty": 5 }
    ]
  },
  "navigation": {
    "current_era": "1993",
    "current_node_id": "bellem_port",
    "target_node_id": "santarem_outpost",
    "distance_on_segment": 120.5,
    "total_segment_length": 500.0
  },
  "score": 0
}
```

#### 3.2. World Map Schema (MapGraph)

The map is defined as a directed graph of nodes (Locations) and edges (River Segments).

```json
{
  "nodes": [
    {
      "id": "node_101",
      "name": "Manaus",
      "type": "SETTLEMENT",
      "coordinates": { "x": 450, "y": 300 },
      "era_restriction": null
    }
  ],
  "edges": [
    {
      "from": "node_101",
      "to": "node_102",
      "distance": 200,
      "difficulty": "HARD",
      "biome": "JUNGLE_DEEP"
    }
  ]
}
```

#### 3.3. Game Options (GameConfig)

User-configurable settings.

```json
{
  "audio": { "master_volume": 0.8, "sfx_enabled": true },
  "gameplay": { "difficulty": "EXPLORER", "steering_sensitivity": 1.0 },
  "ui": { "high_contrast": false, "tooltip_delay": 500 }
}
```

---

### Core Systems & Logic

#### 4.1. The Simulation Loop (Tick)

The game runs on a consistent tick-based simulation:

1. **Input Processing**: Processes queued commands from the controller
2. **Physics Step**: Updates entity positions and velocities
3. **Collision Detection**: Mathematical intersection checks between entities
4. **State Resolution**: Applies gameplay effects (damage, resource consumption, etc.)

#### 4.2. Map & Navigation Logic

**Fork Logic**
- Spawns physical fork entities in the river when approaching branching paths
- Visual indicators guide player decision-making
- Missed forks result in taking the default path

**Arrival Detection**
- Triggers specific UI states upon reaching map nodes
- Initiates settlement events, trading opportunities, or story beats

#### 4.3. Screen & State Management

The StateManager dictates the active context:

| State | Description | UI Elements |
|-------|-------------|-------------|
| `STATE_BOOT` | Asset loading screen | Progress bar |
| `STATE_MENU` | Main menu | Start, Load, Options, Quit |
| `STATE_RIVER` | Active gameplay | Full HUD, interactive world |
| `STATE_MAP` | Full-screen map interface | Navigator's map, route planning |
| `STATE_DIALOGUE` | NPC interaction overlay | Portrait, text, choices |
| `STATE_INVENTORY` | Item management screen | Grid view, stats, trade |

---

### GUI & Presentation Architecture

This layer provides rich mouse-driven interaction with skeuomorphic design elements.

#### 5.1. The Visual Stack (Z-Index Strategy)

The rendering engine composes the scene in strict layers (bottom to top):

1. **World Layer**: The 3D/2D river simulation, skybox, and entities
2. **Vignette/Filter Layer**: Full-screen effects (sepia for historical eras, darkening for night)
3. **HUD Layer**: Always-on dashboard elements (Speed, Health, Compass)
4. **Window Layer**: Modal interfaces (Inventory, Map, Trade) that pause or obscure the world
5. **Dialogue Layer**: NPC portraits and text boxes
6. **Tooltip/Cursor Layer**: Mouse cursors and hover information

#### 5.2. Core UI Components

##### A. The Dashboard (HUD)

A skeuomorphic "Canoe Dashboard" anchored to the bottom of the screen.

- **Compass**: Rotating needle gauge showing river direction
- **Gauges**: Visual bars for Health (heart monitor style) and Rations (provisions barrel)
- **Quick Slots**: Clickable icons for Harpoon, Camera, and Map
- **Status Indicators**: Active effects, time of day, current era

##### B. The Navigator's Map

An interactive "parchment" interface, not just a static image.

- **Pan & Zoom**: Mouse drag to pan, scroll wheel to zoom
- **Fog of War**: Unvisited nodes are obscured or sketched faintly
- **Interactive Nodes**: Hover displays distance and difficulty; click to plot course
- **Route Visualization**: Shows planned path with distance estimates

##### C. The Guidebook

An interactive book interface for the "collection" aspect.

- **Page Flip Animation**: Visual feedback when navigating
- **Grid View**: Thumbnails of collected flora/fauna with silhouettes for undiscovered entries
- **Detail View**: Clicking a thumbnail opens full scientific description and historical context
- **Search/Filter**: Organize by type, era discovered, or collection status

##### D. Dialogue System

Sophisticated conversation interface.

- **Portrait Engine**: Renders NPC (e.g., Teddy Roosevelt) with era-appropriate styling
- **Choice Wheel/List**: Clickable list of player responses
- **History Log**: Scrollable text area reviewing past conversation
- **Branching Logic**: Choices affect relationships and unlock different story paths

---

### Narrative & Content Architecture

#### 6.1. The Premise

The player begins in modern-day Belém but is visited in a dream by the **Jaguar Spirit**, an ancient Inca deity. The Spirit reveals that the Inca King is dying of a mysterious fever (Malaria) in the hidden city of **Vilcabamba**. To save him, the player must travel up the Amazon River—and back through time—to collect the **Cinchona plant** (source of Quinine) and deliver it before the King perishes.

#### 6.2. The User Journey (The "Loop")

##### Act I: The Call (Belém, Present Day)
- **Tutorial**: Learn to steer the canoe and use the Guidebook
- **Inciting Incident**: The Jaguar Spirit appears, giving a map with glowing "Blue Mist" locations

##### Act II: The Ascent (River & Survival)
- **River Phase**: Navigate sections managing hunger (fishing) and health (avoiding obstacles)
- **The Time Warp**: Steer into "Blue Mist" patches; screen fades, era shifts (1993 → 1910)
- **The Hub**: Arrive at settlements (Manaus, Santarém) to trade and gather information

##### Act III: The Historical Encounters (Mid-Game)
Meet key historical figures who provide clues and items:
- **Henry Ford** at Fordlândia (1920s) - Industrial perspective
- **Teddy Roosevelt** during his expedition (1913) - Conservation ethics
- **Henry Bates** (1850s) - Scientific methodology

##### Act IV: The Climax (Vilcabamba, 1500s)
- **Treacherous Rapids**: Class V rapids test navigation skills
- **Final Time Warp**: Journey to pre-Columbian era
- **The Lost City**: Navigate hidden tributaries to deliver the cure

#### 6.3. Event Taxonomy

Events are distinct logical blocks triggered by location, collision, or random chance.

##### A. Narrative Events (`EVENT_TYPE_DIALOGUE`)
- **Trigger**: Docking at settlement or Time Warp completion
- **Interface**: Opens Dialogue Layer
- **Data**: Loads JSON dialogue tree script
- **Examples**: "Talk to the Rubber Tapper," "Argue with the Conquistador"

##### B. Hazard Events (`EVENT_TYPE_HAZARD`)
- **Trigger**: Collision detection or random tick
- **Interface**: Simulation pause + modal alert or screen flash
- **Mechanic**: Instant stat penalty or crisis choice
- **Examples**:
  - Log Collision: -10 Health
  - Capsize: Lose 20% of Rations
  - Malaria: Screen blurs, steering becomes sluggish until Quinine used

##### C. Discovery Events (`EVENT_TYPE_DISCOVERY`)
- **Trigger**: Photography mechanic or "Look" command
- **Interface**: Guidebook unlock animation
- **Mechanic**: Adds entry to PlayerProfile
- **Examples**: "Identified Scarlet Macaw," "Found Rubber Tree"

##### D. Trade Events (`EVENT_TYPE_TRADE`)
- **Trigger**: Interaction with Merchant NPC
- **Interface**: Opens Trade Window (Inventory UI)
- **Mechanic**: Barter system (value matching, not currency)
- **Examples**: Swap 5 Fish for 1 Harpoon

---

### Interface Layer (API)

The Engine exposes public methods for external control and integration.

#### EngineAPI

```javascript
// Initialization
engine.initialize(config)  // Bootstraps the simulation with config object

// Flow Control
engine.start()    // Begin simulation
engine.pause()    // Pause simulation
engine.resume()   // Resume from pause

// Command Interface
engine.sendCommand('STEER', { angle: -15 })
engine.sendCommand('OPEN_WINDOW', { id: 'guidebook' })
engine.sendCommand('TRADE_ITEM', { item_id: 'quinine', qty: 1 })
engine.sendCommand('USE_ITEM', { item_id: 'harpoon' })

// Event Subscription
engine.subscribe('COLLISION', callback)
engine.subscribe('NODE_ARRIVAL', callback)
engine.subscribe('DISCOVERY', callback)
```

---

## Getting Started

> **Note**: This project is in the design phase. Implementation has not yet begun.
> See the [Implementation Plan](./IMPLEMENTATION_PLAN.md) for the complete technical roadmap.

### Technology Stack

The game will be built using:
- **TypeScript 5.x** - Type-safe development
- **PixiJS 8.x** - High-performance 2D rendering (WebGL)
- **React 18.x** - UI component framework
- **Matter.js** - 2D physics engine
- **Zustand** - Lightweight state management
- **Vite** - Fast build tooling
- **Howler.js** - Cross-browser audio

See [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) for detailed technology choices and architecture.

### Prerequisites

- Node.js 20+ and pnpm 8+
- Modern browser with WebGL support
- Git for version control

### Installation

```bash
# Clone the repository
git clone https://github.com/MarkusWalk/AmazonVibeTrail.git

# Navigate to project directory
cd AmazonVibeTrail

# Install dependencies (once implementation begins)
pnpm install

# Run development server
pnpm dev
```

### Running the Game

```bash
# Development mode with hot reload
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Run tests
pnpm test
```

---

## Development Roadmap

### Phase 1: Core Loop
- Implement engine physics and tick system
- Create PlayerProfile data structure
- Basic collision detection

### Phase 2: Navigation
- Develop NavigationManager
- Implement map graph logic
- Fork and branching mechanics

### Phase 3: GUI Framework
- Build UIManager and Visual Stack
- Implement hit-testing and input routing
- Create layer rendering system

### Phase 4: Screens
- Build complex UI screens:
  - Interactive Map
  - Guidebook interface
  - Dashboard/HUD
  - Dialogue system

### Phase 5: Content
- Connect DataRepository to UI
- Populate Guidebook entries
- Create dialogue trees
- Design historical encounters

### Phase 6: Polish
- Audio implementation
- Visual effects and animations
- Playtesting and balancing
- Performance optimization

---

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

### Development Guidelines
- Follow the MVC architecture pattern
- Maintain separation between engine and UI layers
- Write unit tests for core systems
- Document all public APIs
- Use descriptive commit messages

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## Acknowledgments

- Original "The Amazon Trail" by MECC (Minnesota Educational Computing Consortium)
- Inspired by the educational gaming movement of the 1990s
- Thanks to all contributors and playtesters

---

**Status**: This project is currently in the design and planning phase. No code has been written yet, but the architecture and game design are fully specified and ready for implementation.
