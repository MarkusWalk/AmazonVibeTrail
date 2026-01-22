# AmazonVibeTrail

Technical Design Document: The Amazon Trail Recreation1. Executive SummaryThis project aims to recreate the core mechanics of the educational survival game "The Amazon Trail." The system separates the core simulation engine from the presentation layer. While the engine handles the "headless" logic (physics, history, stats), the architecture now includes a robust Graphical User Interface (GUI) layer designed for rich, mouse-driven interaction, utilizing skeuomorphic elements (guidebooks, maps, dashboards) and complex window management.2. High-Level ArchitectureThe application follows a Model-View-Controller (MVC) variation, strictly separating the Simulation (Model) from the Interface (View).Core ModulesGameEngine (Model): The central coordinator. Manages the "tick" rate, physics integration, and logical state. It knows nothing about pixels or buttons.UIManager (View): The presentation master. It manages the "Visual Stack" (what is drawn on top of what), handles window rendering, and manages UI transitions (fades, slides).InputRouter (Controller): A sophisticated input manager that determines if a click was meant for a UI Element (e.g., "Pause Button") or the Game World (e.g., "Steer Canoe").StateManager: Controls the high-level application flow (River vs. Map vs. Dialogue).NavigationManager: Manages the node-based map graph and river branching logic.DataRepository: Handles loading of assets and configuration data.3. Data Structures & Models3.1. The Player State (PlayerProfile)Global state persisted across game sessions.{
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
3.2. World Map Schema (MapGraph)The map is defined as a directed graph of nodes (Locations) and edges (River Segments).{
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
3.3. Game Options (GameConfig)User-configurable settings.{
  "audio": { "master_volume": 0.8, "sfx_enabled": true },
  "gameplay": { "difficulty": "EXPLORER", "steering_sensitivity": 1.0 },
  "ui": { "high_contrast": false, "tooltip_delay": 500 }
}
4. Core Systems & Logic4.1. The Simulation Loop (Tick)Input Processing: Processes queued commands.Physics Step: Updates entity positions.Collision Detection: Mathematical intersection check.State Resolution: Applies gameplay effects.4.2. Map & Navigation LogicFork Logic: Spawns physical fork entities in the river when approaching branching paths.Arrival: Triggers specific UI states upon reaching map nodes.4.3. Screen & State ManagementThe StateManager dictates the active context:STATE_BOOT: Asset loading.STATE_MENU: Main menu.STATE_RIVER: Active gameplay (HUD visible).STATE_MAP: Full-screen map interface.STATE_DIALOGUE: NPC interaction overlay.STATE_INVENTORY: Item management screen.5. GUI & Presentation ArchitectureThis layer handles the "Real GUI" requirements, ensuring rich interaction beyond simple key presses.5.1. The Visual Stack (Z-Index Strategy)The rendering engine composes the scene in strict layers:World Layer (Bottom): The 3D/2D river simulation, skybox, and entities.Vignette/Filter Layer: Full-screen effects (Sepia for history, darkening for night).HUD Layer (Heads-Up Display): Always-on dashboard elements (Speed, Health, Compass).Window Layer: Modal interfaces (Inventory, Map, Trade Screen) that pause or obscure the world.Dialogue Layer: NPC portraits and text boxes.Tooltip/Cursor Layer (Top): Mouse cursors and hover information.5.2. Core UI ComponentsA. The Dashboard (HUD)A skeuomorphic "Canoe Dashboard" at the bottom of the screen.Compass: A rotating needle gauge showing river direction.Gauges: Visual bars for Health (Heart monitor style) and Rations.Quick Slots: Clickable icons for Harpoon, Camera, and Map.B. The Navigator's MapNot just a static image, but an interactive "Parchment" interface.Pan & Zoom: Mouse drag to pan, scroll to zoom.Fog of War: Unvisited nodes are obscured or sketched faintly.Interactive Nodes: Hovering over a node displays distance and difficulty info. Clicking plots a course.C. The GuidebookAn interactive book interface for the "Collection" aspect.Page Flip Animation: Visual feedback when changing pages.Grid View: Thumbnails of collected flora/fauna.Detail View: Clicking a thumbnail opens a detailed scientific description and historical context.D. Dialogue SystemPortrait Engine: Renders the NPC (e.g., Teddy Roosevelt) on the left/right.Choice Wheel/List: A clickable list of responses.History Log: A scrollable text area reviewing past conversation lines.6. Narrative & Content ArchitectureThis section defines the story structure and the taxonomy of events that drive player engagement.6.1. The PremiseThe player begins in modern-day Belém but is visited in a dream by the Jaguar Spirit, an ancient Inca deity. The Spirit reveals that the Inca King is dying of a mysterious fever (Malaria) in the hidden city of Vilcabamba. To save him, the player must travel up the Amazon River, but also back in time, to collect the Cinchona plant (the source of Quinine) and deliver it before the King perishes.6.2. The User Journey (The "Loop")The Call (Belém, Present Day):Tutorial: The player learns to steer the canoe and use the Guidebook.Inciting Incident: The Jaguar Spirit appears. The player is given a map that glows with "Blue Mist" locations.The Ascent (River & Survival):River Phase: The player navigates sections of the river, managing hunger (Fishing) and Health (avoiding Logs).The Time Warp: The player steers into "Blue Mist" patches. The screen fades, and the era shifts (e.g., 1993 -> 1910).The Hub: Arriving at a settlement (e.g., Manaus). The player trades fish for supplies and talks to locals.The Historical Encounters (Mid-Game):The player meets key figures: Henry Ford at Fordlândia (1920s), Teddy Roosevelt during his expedition (1913), and Henry Bates (1850s).Goal: Each encounter provides a clue to the location of Vilcabamba or a necessary trade item.The Climax (Vilcabamba, 1500s):The river becomes treacherous (Class V rapids).The final Time Warp takes the player to the pre-Columbian era.The player must navigate the hidden tributaries to the Lost City and deliver the cure.6.3. Event TaxonomyEvents are distinct logical blocks triggered by location or random chance.A. Narrative Events (EVENT_TYPE_DIALOGUE)Trigger: Docking at a settlement or Time Warp.Interface: Opens Dialogue Layer.Data: Loads a JSON dialogue tree script.Examples: "Talk to the Rubber Tapper," "Argue with the Conquistador."B. Hazard Events (EVENT_TYPE_HAZARD)Trigger: Collision or Random Tick.Interface: Simulation Pause + Modal Alert or Flash.Mechanic: Instant stat penalty or "Crisis Choice."Examples:Log Collision: -10 Health.Capsize: Lose 20% of Rations.Malaria: Screen blurs, steering becomes sluggish until Quinine is used.C. Discovery Events (EVENT_TYPE_DISCOVERY)Trigger: Photography mechanic or "Look" command.Interface: Guidebook unlock animation.Mechanic: Adds entry to PlayerProfile.Examples: "Identified Scarlet Macaw," "Found Rubber Tree."D. Trade Events (EVENT_TYPE_TRADE)Trigger: Interaction with Merchant NPC.Interface: Opens Trade Window (Inventory UI).Mechanic: Barter system (Value matching, not currency).Examples: Swap 5 Fish for 1 Harpoon.7. Interface Layer (API)The Engine exposes public methods for external control.EngineAPIinitialize(config): Bootstraps the simulation.start() / pause() / resume(): Flow control.Command Interface:sendCommand('STEER', { angle: -15 })sendCommand('OPEN_WINDOW', { id: 'guidebook' })sendCommand('TRADE_ITEM', { item_id: 'quinine', qty: 1 })subscribe(eventType, callback): Listen for logic events.8. Development RoadmapPhase 1 (Core Loop): Engine physics and PlayerProfile.Phase 2 (Navigation): NavigationManager and Map logic.Phase 3 (GUI Framework): Implement UIManager, Hit-Testing, and the Layer Stack.Phase 4 (Screens): Build specific complex screens (Map, Guidebook, Dashboard).Phase 5 (Content): Connect DataRepository to UI (populate the Guidebook).
