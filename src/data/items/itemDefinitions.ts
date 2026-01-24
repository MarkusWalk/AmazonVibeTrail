import type { InventoryItem } from '@ui/components/Inventory'

/**
 * Item definitions for the game
 * Maps item IDs to their full metadata for inventory display
 */
export const itemDefinitions: Record<string, Omit<InventoryItem, 'quantity'>> = {
  // Tools
  harpoon: {
    id: 'harpoon',
    name: 'Fishing Harpoon',
    description: 'A sturdy harpoon for catching fish in the river',
    icon: '🔱',
    category: 'tool',
    rarity: 'common',
    value: 5,
    weight: 2,
  },
  camera: {
    id: 'camera',
    name: 'Camera',
    description: 'Capture images of wildlife for the guidebook',
    icon: '📷',
    category: 'tool',
    rarity: 'uncommon',
    value: 50,
    weight: 3,
  },
  compass: {
    id: 'compass',
    name: 'Compass',
    description: 'Helps you navigate the winding river',
    icon: '🧭',
    category: 'tool',
    rarity: 'common',
    value: 10,
    weight: 1,
  },
  map_fragment: {
    id: 'map_fragment',
    name: 'Map Fragment',
    description: 'A piece of an ancient map showing hidden locations',
    icon: '🗺️',
    category: 'quest',
    rarity: 'rare',
    value: 100,
    weight: 0,
  },

  // Consumables
  health_potion: {
    id: 'health_potion',
    name: 'Health Potion',
    description: 'Restores 25 health points',
    icon: '🧪',
    category: 'consumable',
    rarity: 'common',
    value: 15,
    weight: 1,
  },
  medicine: {
    id: 'medicine',
    name: 'Quinine Medicine',
    description: 'Treats malaria and other tropical diseases',
    icon: '💊',
    category: 'consumable',
    rarity: 'uncommon',
    value: 50,
    weight: 1,
  },
  dried_fish: {
    id: 'dried_fish',
    name: 'Dried Fish',
    description: 'Restores 10 rations',
    icon: '🐟',
    category: 'consumable',
    rarity: 'common',
    value: 5,
    weight: 1,
  },
  fresh_fruit: {
    id: 'fresh_fruit',
    name: 'Fresh Fruit',
    description: 'Restores 5 rations and 5 health',
    icon: '🍎',
    category: 'consumable',
    rarity: 'common',
    value: 3,
    weight: 1,
  },

  // Trade Goods
  rubber: {
    id: 'rubber',
    name: 'Rubber',
    description: 'Valuable trade commodity from rubber trees',
    icon: '⚫',
    category: 'trade',
    rarity: 'uncommon',
    value: 25,
    weight: 3,
  },
  coffee_beans: {
    id: 'coffee_beans',
    name: 'Coffee Beans',
    description: 'High-quality Amazonian coffee beans',
    icon: '☕',
    category: 'trade',
    rarity: 'common',
    value: 10,
    weight: 2,
  },
  spices: {
    id: 'spices',
    name: 'Exotic Spices',
    description: 'Rare spices from the jungle',
    icon: '🌶️',
    category: 'trade',
    rarity: 'rare',
    value: 40,
    weight: 1,
  },
  gold_nugget: {
    id: 'gold_nugget',
    name: 'Gold Nugget',
    description: 'A small nugget of river gold',
    icon: '🪙',
    category: 'trade',
    rarity: 'rare',
    value: 100,
    weight: 2,
  },

  // Specimens
  plant_medicinal_herb: {
    id: 'plant_medicinal_herb',
    name: 'Medicinal Herb',
    description: 'A plant with healing properties',
    icon: '🌿',
    category: 'specimen',
    rarity: 'common',
    value: 8,
    weight: 0,
  },
  creature_macaw: {
    id: 'creature_macaw',
    name: 'Scarlet Macaw Feather',
    description: 'A vibrant feather from a scarlet macaw',
    icon: '🪶',
    category: 'specimen',
    rarity: 'uncommon',
    value: 15,
    weight: 0,
  },
  creature_piranha: {
    id: 'creature_piranha',
    name: 'Piranha Tooth',
    description: 'A sharp tooth from a red-bellied piranha',
    icon: '🦷',
    category: 'specimen',
    rarity: 'common',
    value: 5,
    weight: 0,
  },
  artifact_pottery: {
    id: 'artifact_pottery',
    name: 'Ancient Pottery Shard',
    description: 'A fragment of ancient Inca pottery',
    icon: '🏺',
    category: 'specimen',
    rarity: 'legendary',
    value: 200,
    weight: 1,
  },

  // Quest Items
  cinchona_bark: {
    id: 'cinchona_bark',
    name: 'Cinchona Bark',
    description: 'The bark of the cinchona tree, source of quinine',
    icon: '🌳',
    category: 'quest',
    rarity: 'legendary',
    value: 500,
    weight: 2,
  },
  jaguar_totem: {
    id: 'jaguar_totem',
    name: 'Jaguar Spirit Totem',
    description: 'A sacred totem given by the Jaguar Spirit',
    icon: '🐆',
    category: 'quest',
    rarity: 'legendary',
    value: 0,
    weight: 1,
  },

  // Additional Tools
  gold_pan: {
    id: 'gold_pan',
    name: 'Gold Panning Dish',
    description: 'Used to sift through river sediment for gold',
    icon: '🥘',
    category: 'tool',
    rarity: 'uncommon',
    value: 30,
    weight: 2,
  },
  machete: {
    id: 'machete',
    name: 'Machete',
    description: 'Essential for cutting through jungle vegetation',
    icon: '🔪',
    category: 'tool',
    rarity: 'common',
    value: 20,
    weight: 3,
  },
  fishing_net: {
    id: 'fishing_net',
    name: 'Fishing Net',
    description: 'Allows for efficient fish catching',
    icon: '🥅',
    category: 'tool',
    rarity: 'common',
    value: 15,
    weight: 4,
  },
  binoculars: {
    id: 'binoculars',
    name: 'Binoculars',
    description: 'Spot wildlife and landmarks from a distance',
    icon: '🔭',
    category: 'tool',
    rarity: 'uncommon',
    value: 45,
    weight: 2,
  },
  lantern: {
    id: 'lantern',
    name: 'Oil Lantern',
    description: 'Provides light during night travel',
    icon: '🏮',
    category: 'tool',
    rarity: 'common',
    value: 12,
    weight: 2,
  },
  rope: {
    id: 'rope',
    name: 'Hemp Rope',
    description: 'Sturdy rope for securing canoe and supplies',
    icon: '🪢',
    category: 'tool',
    rarity: 'common',
    value: 8,
    weight: 3,
  },
  professional_camera: {
    id: 'professional_camera',
    name: 'Professional Camera',
    description: 'High-quality camera for wildlife documentation',
    icon: '📸',
    category: 'tool',
    rarity: 'rare',
    value: 120,
    weight: 4,
  },
  portuguese_compass: {
    id: 'portuguese_compass',
    name: 'Portuguese Brass Compass',
    description: 'Precision navigation instrument from Europe',
    icon: '🧭',
    category: 'tool',
    rarity: 'rare',
    value: 80,
    weight: 1,
  },

  // Additional Consumables
  medicinal_herbs: {
    id: 'medicinal_herbs',
    name: 'Medicinal Herb Bundle',
    description: 'Pouch of various healing herbs, restores 30 health',
    icon: '🌿',
    category: 'consumable',
    rarity: 'uncommon',
    value: 35,
    weight: 1,
  },
  smoked_meat: {
    id: 'smoked_meat',
    name: 'Smoked Meat',
    description: 'Preserved meat, restores 15 rations',
    icon: '🥓',
    category: 'consumable',
    rarity: 'common',
    value: 12,
    weight: 2,
  },
  jungle_berries: {
    id: 'jungle_berries',
    name: 'Jungle Berries',
    description: 'Sweet berries that restore 8 rations',
    icon: '🫐',
    category: 'consumable',
    rarity: 'common',
    value: 6,
    weight: 1,
  },
  antidote: {
    id: 'antidote',
    name: 'Antivenom',
    description: 'Cures poison from snake and spider bites',
    icon: '💉',
    category: 'consumable',
    rarity: 'rare',
    value: 75,
    weight: 1,
  },
  energy_tonic: {
    id: 'energy_tonic',
    name: 'Energy Tonic',
    description: 'Temporarily increases movement speed',
    icon: '⚡',
    category: 'consumable',
    rarity: 'uncommon',
    value: 40,
    weight: 1,
  },

  // Additional Trade Goods
  brazil_nuts: {
    id: 'brazil_nuts',
    name: 'Brazil Nuts',
    description: 'Nutritious nuts harvested from giant trees',
    icon: '🥜',
    category: 'trade',
    rarity: 'common',
    value: 8,
    weight: 2,
  },
  cacao_pods: {
    id: 'cacao_pods',
    name: 'Cacao Pods',
    description: 'Source of chocolate, valuable for trade',
    icon: '🍫',
    category: 'trade',
    rarity: 'uncommon',
    value: 30,
    weight: 3,
  },
  tobacco_leaves: {
    id: 'tobacco_leaves',
    name: 'Tobacco Leaves',
    description: 'Dried tobacco leaves for trade',
    icon: '🍃',
    category: 'trade',
    rarity: 'common',
    value: 15,
    weight: 1,
  },
  silk_cloth: {
    id: 'silk_cloth',
    name: 'Silk Cloth',
    description: 'Fine imported silk from trade routes',
    icon: '🧵',
    category: 'trade',
    rarity: 'rare',
    value: 90,
    weight: 1,
  },
  emerald: {
    id: 'emerald',
    name: 'Raw Emerald',
    description: 'Uncut emerald from Amazon deposits',
    icon: '💎',
    category: 'trade',
    rarity: 'legendary',
    value: 300,
    weight: 1,
  },

  // Special Items
  blessing_amulet: {
    id: 'blessing_amulet',
    name: "Missionary's Blessing Amulet",
    description: 'Provides protection and luck, small health regeneration',
    icon: '✝️',
    category: 'quest',
    rarity: 'rare',
    value: 150,
    weight: 0,
  },
  sacred_herb_pouch: {
    id: 'sacred_herb_pouch',
    name: 'Sacred Herb Pouch',
    description: 'Gift from indigenous elder, slowly restores health',
    icon: '👝',
    category: 'quest',
    rarity: 'rare',
    value: 0,
    weight: 1,
  },
  pirate_treasure_map: {
    id: 'pirate_treasure_map',
    name: 'Pirate Treasure Map',
    description: 'Map showing the location of buried pirate treasure',
    icon: '🗺️',
    category: 'quest',
    rarity: 'legendary',
    value: 0,
    weight: 0,
  },
  expedition_journal: {
    id: 'expedition_journal',
    name: 'Explorer\'s Journal',
    description: 'Journal from a lost expedition with valuable notes',
    icon: '📓',
    category: 'quest',
    rarity: 'rare',
    value: 250,
    weight: 1,
  },
  spirit_feather: {
    id: 'spirit_feather',
    name: 'Spirit Feather',
    description: 'Blessed feather that protects against evil spirits',
    icon: '🪶',
    category: 'quest',
    rarity: 'legendary',
    value: 0,
    weight: 0,
  },
}

/**
 * Get item definition by ID
 */
export function getItemDefinition(itemId: string): Omit<InventoryItem, 'quantity'> | undefined {
  return itemDefinitions[itemId]
}

/**
 * Create inventory item with quantity
 */
export function createInventoryItem(itemId: string, quantity: number): InventoryItem | null {
  const definition = getItemDefinition(itemId)
  if (!definition) {
    console.warn(`[Items] No definition found for item: ${itemId}`)
    return null
  }

  return {
    ...definition,
    quantity,
  }
}

/**
 * Convert player inventory Map to InventoryItem array
 */
export function convertInventoryToItems(inventory: Map<string, number>): InventoryItem[] {
  const items: InventoryItem[] = []

  inventory.forEach((quantity, itemId) => {
    const item = createInventoryItem(itemId, quantity)
    if (item) {
      items.push(item)
    }
  })

  return items
}
