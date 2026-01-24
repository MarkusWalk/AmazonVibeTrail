import { SpriteCategory, SpriteManifest } from '@models/sprites'
import * as Placeholders from './placeholders'

/**
 * Sprite Manifest
 *
 * This manifest defines all sprites used in the game.
 * Sprites can be:
 * 1. External files: src = '/sprites/category/name.png'
 * 2. AI-generated base64: src = 'data:image/png;base64,...'
 * 3. Placeholders: Using data URLs with simple shapes (see placeholders.ts)
 *
 * To add AI-generated sprites:
 * 1. Generate sprite with nano-banana or other AI tool
 * 2. Convert to base64 data URL
 * 3. Replace the placeholder src below with your generated sprite
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
      src: Placeholders.PLACEHOLDER_GUIDE,
      width: 64,
      height: 64,
      tags: ['human', 'guide', 'wise'],
      rarity: 'common',
      generatedBy: 'placeholder',
      prompt: 'Replace with: elderly Amazon river guide, pixel art, 64x64',
    },
    {
      id: 'npc_trader_merchant',
      category: SpriteCategory.NPC,
      name: 'River Merchant',
      description: 'Traveling merchant trading goods along the river',
      src: Placeholders.PLACEHOLDER_MERCHANT,
      width: 64,
      height: 64,
      tags: ['human', 'trader', 'merchant'],
      rarity: 'common',
      generatedBy: 'placeholder',
      prompt: 'Replace with: river trader merchant, pixel art, 64x64',
    },
    {
      id: 'npc_shaman',
      category: SpriteCategory.NPC,
      name: 'Tribal Shaman',
      description: 'Spiritual leader with healing knowledge',
      src: Placeholders.PLACEHOLDER_SHAMAN,
      width: 64,
      height: 64,
      tags: ['human', 'healer', 'spiritual'],
      rarity: 'uncommon',
      generatedBy: 'placeholder',
      prompt: 'Replace with: tribal shaman with mystical appearance, pixel art, 64x64',
    },

    // ===== Items =====
    {
      id: 'item_harpoon',
      category: SpriteCategory.ITEM,
      name: 'Harpoon',
      description: 'Fishing tool for catching large fish',
      src: Placeholders.PLACEHOLDER_HARPOON,
      width: 32,
      height: 32,
      tags: ['tool', 'fishing', 'weapon'],
      rarity: 'common',
      value: 25,
      generatedBy: 'placeholder',
      prompt: 'Replace with: fishing harpoon icon, pixel art, 32x32',
    },
    {
      id: 'item_medicine',
      category: SpriteCategory.ITEM,
      name: 'Medicine',
      description: 'Herbal medicine for healing wounds',
      src: Placeholders.PLACEHOLDER_MEDICINE,
      width: 32,
      height: 32,
      tags: ['consumable', 'healing'],
      rarity: 'common',
      value: 30,
      generatedBy: 'placeholder',
      prompt: 'Replace with: medicine bottle with red cross, pixel art, 32x32',
    },
    {
      id: 'item_compass',
      category: SpriteCategory.ITEM,
      name: 'Brass Compass',
      description: 'Navigational tool for finding your way',
      src: Placeholders.PLACEHOLDER_COMPASS,
      width: 32,
      height: 32,
      tags: ['tool', 'navigation'],
      rarity: 'uncommon',
      value: 50,
      generatedBy: 'placeholder',
      prompt: 'Replace with: brass compass icon, pixel art, 32x32',
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
      src: Placeholders.PLACEHOLDER_PIRANHA,
      width: 48,
      height: 48,
      tags: ['fish', 'dangerous', 'hostile'],
      rarity: 'common',
      generatedBy: 'placeholder',
      prompt: 'Replace with: dangerous piranha fish with sharp teeth, pixel art, 48x48',
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
      src: Placeholders.PLACEHOLDER_MACAW,
      width: 48,
      height: 48,
      tags: ['bird', 'peaceful', 'collectible'],
      rarity: 'common',
      generatedBy: 'placeholder',
      prompt: 'Replace with: colorful macaw parrot, bright colors, pixel art, 48x48',
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
      src: Placeholders.PLACEHOLDER_PALM_TREE,
      width: 64,
      height: 96,
      tags: ['tree', 'background'],
      generatedBy: 'placeholder',
      prompt: 'Replace with: tropical palm tree, pixel art, 64x96',
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
