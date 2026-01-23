import { SpriteCategory, SpriteManifest } from '@models/sprites'

/**
 * Sprite Manifest
 *
 * This manifest defines all sprites used in the game.
 * Sprites can be:
 * 1. External files: src = '/sprites/category/name.png'
 * 2. AI-generated base64: src = 'data:image/png;base64,...'
 * 3. Placeholders: Using data URLs with simple shapes
 *
 * To add AI-generated sprites:
 * 1. Generate sprite with nano-banana or other AI tool
 * 2. Convert to base64 data URL
 * 3. Add entry here with metadata
 */

export const spriteManifest: SpriteManifest = {
  version: '1.0.0',
  lastUpdated: '2026-01-23',
  sprites: [
    // ===== NPCs =====
    {
      id: 'npc_guide_elderly',
      category: SpriteCategory.NPC,
      name: 'Elderly Guide',
      description: 'Wise elderly guide with knowledge of the river',
      src: '/sprites/npc/guide_elderly.png', // Placeholder - to be generated
      width: 64,
      height: 64,
      tags: ['human', 'guide', 'wise'],
      rarity: 'common',
    },
    {
      id: 'npc_trader_merchant',
      category: SpriteCategory.NPC,
      name: 'River Merchant',
      description: 'Traveling merchant trading goods along the river',
      src: '/sprites/npc/trader_merchant.png', // Placeholder - to be generated
      width: 64,
      height: 64,
      tags: ['human', 'trader', 'merchant'],
      rarity: 'common',
    },
    {
      id: 'npc_shaman',
      category: SpriteCategory.NPC,
      name: 'Tribal Shaman',
      description: 'Spiritual leader with healing knowledge',
      src: '/sprites/npc/shaman.png', // Placeholder - to be generated
      width: 64,
      height: 64,
      tags: ['human', 'healer', 'spiritual'],
      rarity: 'uncommon',
    },

    // ===== Items =====
    {
      id: 'item_harpoon',
      category: SpriteCategory.ITEM,
      name: 'Harpoon',
      description: 'Fishing tool for catching large fish',
      src: '/sprites/items/harpoon.png', // Placeholder - to be generated
      width: 32,
      height: 32,
      tags: ['tool', 'fishing', 'weapon'],
      rarity: 'common',
      value: 25,
    },
    {
      id: 'item_medicine',
      category: SpriteCategory.ITEM,
      name: 'Medicine',
      description: 'Herbal medicine for healing wounds',
      src: '/sprites/items/medicine.png', // Placeholder - to be generated
      width: 32,
      height: 32,
      tags: ['consumable', 'healing'],
      rarity: 'common',
      value: 30,
    },
    {
      id: 'item_compass',
      category: SpriteCategory.ITEM,
      name: 'Brass Compass',
      description: 'Navigational tool for finding your way',
      src: '/sprites/items/compass.png', // Placeholder - to be generated
      width: 32,
      height: 32,
      tags: ['tool', 'navigation'],
      rarity: 'uncommon',
      value: 50,
    },
    {
      id: 'item_map',
      category: SpriteCategory.ITEM,
      name: 'River Map',
      description: 'Detailed map of the Amazon River',
      src: '/sprites/items/map.png', // Placeholder - to be generated
      width: 32,
      height: 32,
      tags: ['tool', 'navigation'],
      rarity: 'rare',
      value: 75,
    },
    {
      id: 'item_rations',
      category: SpriteCategory.ITEM,
      name: 'Food Rations',
      description: 'Preserved food for the journey',
      src: '/sprites/items/rations.png', // Placeholder - to be generated
      width: 32,
      height: 32,
      tags: ['consumable', 'food'],
      rarity: 'common',
      value: 20,
    },

    // ===== Creatures =====
    {
      id: 'creature_piranha',
      category: SpriteCategory.CREATURE,
      name: 'Piranha',
      description: 'Dangerous carnivorous fish',
      src: '/sprites/creatures/piranha.png', // Placeholder - to be generated
      width: 48,
      height: 48,
      tags: ['fish', 'dangerous', 'hostile'],
      rarity: 'common',
    },
    {
      id: 'creature_anaconda',
      category: SpriteCategory.CREATURE,
      name: 'Anaconda',
      description: 'Massive river snake',
      src: '/sprites/creatures/anaconda.png', // Placeholder - to be generated
      width: 64,
      height: 64,
      tags: ['snake', 'dangerous', 'hostile'],
      rarity: 'uncommon',
    },
    {
      id: 'creature_jaguar',
      category: SpriteCategory.CREATURE,
      name: 'Jaguar',
      description: 'Powerful predator of the rainforest',
      src: '/sprites/creatures/jaguar.png', // Placeholder - to be generated
      width: 64,
      height: 64,
      tags: ['mammal', 'dangerous', 'predator'],
      rarity: 'rare',
    },
    {
      id: 'creature_macaw',
      category: SpriteCategory.CREATURE,
      name: 'Macaw',
      description: 'Colorful tropical parrot',
      src: '/sprites/creatures/macaw.png', // Placeholder - to be generated
      width: 48,
      height: 48,
      tags: ['bird', 'peaceful', 'collectible'],
      rarity: 'common',
    },
    {
      id: 'creature_dolphin_pink',
      category: SpriteCategory.CREATURE,
      name: 'Pink River Dolphin',
      description: 'Rare pink dolphin of the Amazon',
      src: '/sprites/creatures/dolphin_pink.png', // Placeholder - to be generated
      width: 64,
      height: 64,
      tags: ['mammal', 'peaceful', 'rare'],
      rarity: 'legendary',
    },

    // ===== Icons =====
    {
      id: 'icon_health',
      category: SpriteCategory.ICON,
      name: 'Health Icon',
      description: 'Health indicator icon',
      src: '/sprites/icons/health.png', // Placeholder - to be generated
      width: 24,
      height: 24,
      tags: ['ui', 'health'],
    },
    {
      id: 'icon_hunger',
      category: SpriteCategory.ICON,
      name: 'Hunger Icon',
      description: 'Hunger/rations indicator',
      src: '/sprites/icons/hunger.png', // Placeholder - to be generated
      width: 24,
      height: 24,
      tags: ['ui', 'hunger'],
    },
    {
      id: 'icon_location',
      category: SpriteCategory.ICON,
      name: 'Location Icon',
      description: 'Map location marker',
      src: '/sprites/icons/location.png', // Placeholder - to be generated
      width: 24,
      height: 24,
      tags: ['ui', 'map'],
    },

    // ===== Portraits =====
    {
      id: 'portrait_player',
      category: SpriteCategory.PORTRAIT,
      name: 'Player Portrait',
      description: 'Player character portrait',
      src: '/sprites/portraits/player.png', // Placeholder - to be generated
      width: 128,
      height: 128,
      tags: ['portrait', 'player'],
    },

    // ===== Environment =====
    {
      id: 'env_tree_palm',
      category: SpriteCategory.ENVIRONMENT,
      name: 'Palm Tree',
      description: 'Tropical palm tree',
      src: '/sprites/environment/tree_palm.png', // Placeholder - to be generated
      width: 64,
      height: 96,
      tags: ['tree', 'background'],
    },
    {
      id: 'env_rock_river',
      category: SpriteCategory.ENVIRONMENT,
      name: 'River Rock',
      description: 'Large river stone',
      src: '/sprites/environment/rock_river.png', // Placeholder - to be generated
      width: 48,
      height: 48,
      tags: ['rock', 'obstacle'],
    },
  ],
}
