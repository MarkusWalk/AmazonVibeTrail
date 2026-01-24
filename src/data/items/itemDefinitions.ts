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
