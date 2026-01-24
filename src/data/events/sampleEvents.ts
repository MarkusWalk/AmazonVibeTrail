import { EventType, TriggerType, QuestStatus } from '@models/events'
import type { GameEvent, Quest, Specimen } from '@models/events'

/**
 * Sample Game Events
 *
 * These are example encounters and events that can trigger during gameplay
 */

export const sampleEvents: GameEvent[] = [
  // Welcome event - triggers at game start
  {
    id: 'welcome_to_amazon',
    name: 'Welcome to the Amazon',
    description: 'Your journey begins at Belém',
    type: EventType.DIALOGUE,
    trigger: {
      type: TriggerType.LOCATION,
      conditions: [
        { type: 'location', key: 'belem', operator: 'equals', value: 'belem' },
        { type: 'flag', key: 'game_started', operator: 'not', value: true },
      ],
    },
    data: {
      dialogueId: 'guide_welcome',
    },
    repeatable: false,
  },

  // Random encounter - river merchant
  {
    id: 'merchant_encounter',
    name: 'River Merchant',
    description: 'A traveling merchant approaches your canoe',
    type: EventType.TRADE,
    trigger: {
      type: TriggerType.RANDOM,
      probability: 0.15, // 15% chance per check
      conditions: [
        { type: 'distance', key: 'distance', operator: 'greater', value: 100 },
      ],
    },
    data: {
      merchantId: 'trader_merchant',
      dialogueId: 'merchant_trade',
    },
    repeatable: true,
    cooldown: 300000, // 5 minutes
  },

  // Hazard event - rapids
  {
    id: 'rapids_hazard',
    name: 'Dangerous Rapids',
    description: 'You encounter treacherous rapids!',
    type: EventType.HAZARD,
    trigger: {
      type: TriggerType.LOCATION,
      conditions: [
        { type: 'location', key: 'manaus', operator: 'equals', value: 'manaus' },
      ],
    },
    data: {
      hazardType: 'rapids',
      damage: 25,
    },
    repeatable: true,
    cooldown: 600000, // 10 minutes
  },

  // Discovery event - pink dolphin
  {
    id: 'pink_dolphin_discovery',
    name: 'Pink River Dolphin Sighting',
    description: 'A rare pink dolphin appears beside your canoe!',
    type: EventType.DISCOVERY,
    trigger: {
      type: TriggerType.RANDOM,
      probability: 0.05, // 5% chance - rare!
      conditions: [
        { type: 'distance', key: 'distance', operator: 'greater', value: 500 },
      ],
    },
    data: {
      discoveryType: 'specimen',
      discoveryId: 'creature_dolphin_pink',
    },
    repeatable: false,
  },

  // Low health warning
  {
    id: 'low_health_warning',
    name: 'Weakening Health',
    description: 'Your health is running low',
    type: EventType.DIALOGUE,
    trigger: {
      type: TriggerType.HEALTH,
      conditions: [
        { type: 'health', key: 'health', operator: 'less', value: 30 },
        { type: 'flag', key: 'low_health_warned', operator: 'not', value: true },
      ],
    },
    data: {
      dialogueId: 'low_health_warning',
    },
    repeatable: false,
  },

  // Settlement arrival
  {
    id: 'settlement_arrival_manaus',
    name: 'Arrival at Manaus',
    description: 'You arrive at the bustling city of Manaus',
    type: EventType.DIALOGUE,
    trigger: {
      type: TriggerType.LOCATION,
      conditions: [
        { type: 'location', key: 'manaus', operator: 'equals', value: 'manaus' },
        { type: 'flag', key: 'manaus_visited', operator: 'not', value: true },
      ],
    },
    data: {
      dialogueId: 'manaus_arrival',
    },
    repeatable: false,
  },

  // Specimen discovery - medicinal plant
  {
    id: 'discover_medicinal_plant',
    name: 'Medicinal Plant Discovery',
    description: 'You spot an unusual plant with healing properties',
    type: EventType.DISCOVERY,
    trigger: {
      type: TriggerType.RANDOM,
      probability: 0.2,
    },
    data: {
      discoveryType: 'specimen',
      discoveryId: 'plant_medicinal_herb',
    },
    repeatable: true,
    cooldown: 180000, // 3 minutes
  },

  // Quest trigger - shaman's request
  {
    id: 'shaman_quest_trigger',
    name: "Shaman's Request",
    description: 'The tribal shaman has a request for you',
    type: EventType.QUEST,
    trigger: {
      type: TriggerType.LOCATION,
      conditions: [
        { type: 'location', key: 'tefé', operator: 'equals', value: 'tefe' },
      ],
    },
    data: {
      questId: 'healing_herbs_quest',
      dialogueId: 'shaman_healing',
    },
    repeatable: false,
  },
]

/**
 * Sample Quests
 */
export const sampleQuests: Quest[] = [
  {
    id: 'healing_herbs_quest',
    name: 'Healing Herbs',
    description:
      'The tribal shaman needs healing herbs from the rainforest. Collect 5 medicinal plants.',
    giver: 'npc_shaman',
    status: QuestStatus.AVAILABLE,
    objectives: [
      {
        id: 'collect_herbs',
        description: 'Collect medicinal plants',
        type: 'collect',
        target: 'plant_medicinal_herb',
        current: 0,
        required: 5,
        completed: false,
      },
    ],
    rewards: [
      {
        type: 'health',
        target: 'player',
        amount: 50,
      },
      {
        type: 'item',
        target: 'item_medicine',
        amount: 3,
      },
    ],
    experience: 100,
  },

  {
    id: 'reach_manaus',
    name: 'Journey to Manaus',
    description: 'Travel to the city of Manaus and explore its famous opera house.',
    status: QuestStatus.AVAILABLE,
    objectives: [
      {
        id: 'reach_manaus',
        description: 'Reach Manaus',
        type: 'reach',
        target: 'manaus',
        current: 0,
        required: 1,
        completed: false,
      },
      {
        id: 'visit_opera_house',
        description: 'Visit the Opera House',
        type: 'talk',
        target: 'opera_house_guide',
        current: 0,
        required: 1,
        completed: false,
      },
    ],
    rewards: [
      {
        type: 'unlock',
        target: 'guidebook_manaus_history',
        amount: 1,
      },
    ],
    experience: 200,
  },

  {
    id: 'wildlife_photographer',
    name: 'Wildlife Photography',
    description:
      'Document the incredible wildlife of the Amazon. Photograph 10 different species.',
    status: QuestStatus.AVAILABLE,
    objectives: [
      {
        id: 'photograph_species',
        description: 'Photograph different species',
        type: 'discover',
        target: 'any_creature',
        current: 0,
        required: 10,
        completed: false,
      },
    ],
    rewards: [
      {
        type: 'item',
        target: 'item_camera',
        amount: 1,
      },
      {
        type: 'unlock',
        target: 'guidebook_fauna_complete',
        amount: 1,
      },
    ],
    experience: 300,
  },

  {
    id: 'survive_rapids',
    name: 'Rapids Survival',
    description: 'Navigate through dangerous rapids without taking damage.',
    status: QuestStatus.AVAILABLE,
    objectives: [
      {
        id: 'clear_rapids',
        description: 'Navigate rapids safely',
        type: 'survive',
        target: 'rapids_section',
        current: 0,
        required: 1,
        completed: false,
      },
    ],
    rewards: [
      {
        type: 'item',
        target: 'item_compass',
        amount: 1,
      },
    ],
    experience: 150,
  },
]

/**
 * Sample Specimens
 */
export const sampleSpecimens: Specimen[] = [
  {
    id: 'creature_dolphin_pink',
    name: 'Pink River Dolphin',
    scientificName: 'Inia geoffrensis',
    category: 'animal',
    rarity: 'legendary',
    description:
      'The Amazon river dolphin, also known as boto, is one of the few freshwater dolphin species. Its pink coloration becomes more pronounced with age.',
    image: 'creature_dolphin_pink',
    value: 500,
  },

  {
    id: 'creature_macaw_scarlet',
    name: 'Scarlet Macaw',
    scientificName: 'Ara macao',
    category: 'animal',
    rarity: 'uncommon',
    description:
      'A large, colorful parrot native to South America. Known for their bright red, yellow, and blue plumage.',
    image: 'creature_macaw',
    value: 100,
  },

  {
    id: 'plant_medicinal_herb',
    name: 'Medicinal Herb',
    scientificName: 'Uncaria tomentosa',
    category: 'plant',
    rarity: 'common',
    description:
      "Cat's claw, a medicinal vine used by indigenous peoples for centuries to treat various ailments.",
    image: 'plant_herb',
    value: 25,
  },

  {
    id: 'plant_orchid_rare',
    name: 'Rare Orchid',
    scientificName: 'Cattleya walkeriana',
    category: 'plant',
    rarity: 'rare',
    description:
      'A beautiful and rare orchid species found in the Amazon rainforest. Prized by collectors.',
    image: 'plant_orchid',
    value: 200,
  },

  {
    id: 'creature_jaguar',
    name: 'Jaguar',
    scientificName: 'Panthera onca',
    category: 'animal',
    rarity: 'rare',
    description:
      'The largest cat in the Americas. A powerful predator that is an excellent swimmer.',
    image: 'creature_jaguar',
    value: 300,
  },

  {
    id: 'creature_anaconda',
    name: 'Green Anaconda',
    scientificName: 'Eunectes murinus',
    category: 'animal',
    rarity: 'uncommon',
    description:
      'One of the largest snakes in the world. A non-venomous constrictor that lives in or near water.',
    image: 'creature_anaconda',
    value: 150,
  },

  {
    id: 'artifact_pottery',
    name: 'Ancient Pottery',
    category: 'artifact',
    rarity: 'rare',
    description:
      'Pre-Columbian pottery shard with intricate geometric designs. Evidence of advanced indigenous civilizations.',
    image: 'artifact_pottery',
    value: 250,
  },

  {
    id: 'mineral_gold_nugget',
    name: 'Gold Nugget',
    category: 'mineral',
    rarity: 'uncommon',
    description:
      'A small gold nugget washed down from the Andes. Historically significant to the region.',
    image: 'mineral_gold',
    value: 175,
  },
  // Additional specimens
  {
    id: 'plant_rubber_tree',
    name: 'Rubber Tree Latex',
    category: 'plant',
    rarity: 'common',
    description:
      'Latex sap from Hevea brasiliensis, the source of natural rubber that drove the Amazon rubber boom.',
    image: 'plant_rubber',
    value: 60,
  },
  {
    id: 'plant_cacao',
    name: 'Cacao Pod',
    category: 'plant',
    rarity: 'uncommon',
    description:
      'The pod of Theobroma cacao, source of chocolate, native to the Amazon.',
    image: 'plant_cacao',
    value: 45,
  },
  {
    id: 'creature_capybara',
    name: 'Capybara Tooth',
    category: 'animal',
    rarity: 'common',
    description:
      'Tooth from the world\'s largest rodent, semi-aquatic and native to South America.',
    image: 'creature_capybara',
    value: 25,
  },
  {
    id: 'creature_anaconda',
    name: 'Anaconda Scale',
    category: 'animal',
    rarity: 'rare',
    description:
      'Scale from a green anaconda, one of the largest snakes in the world.',
    image: 'creature_anaconda',
    value: 100,
  },
  {
    id: 'creature_sloth',
    name: 'Three-toed Sloth Claw',
    category: 'animal',
    rarity: 'uncommon',
    description:
      'Claw from a three-toed sloth, known for its slow movement through the canopy.',
    image: 'creature_sloth',
    value: 50,
  },
  {
    id: 'artifact_inca_figurine',
    name: 'Inca Figurine',
    category: 'artifact',
    rarity: 'legendary',
    description:
      'A small golden figurine of an Inca deity, incredibly rare and valuable.',
    image: 'artifact_figurine',
    value: 500,
  },
]

// Additional quests
const additionalQuests: Quest[] = [
  {
    id: 'rubber_collection_quest',
    name: 'The Rubber Baron\'s Contract',
    description: 'Collect rubber for the baron',
    status: QuestStatus.AVAILABLE,
    objectives: [
      {
        id: 'collect_rubber',
        description: 'Collect rubber latex',
        type: 'collect',
        target: 'rubber',
        current: 0,
        required: 10,
        completed: false,
      },
    ],
    rewards: [
      {
        type: 'gold',
        target: 'player',
        amount: 100,
      },
    ],
  },
  {
    id: 'botanical_specimens_quest',
    name: 'Scientific Discovery',
    description: 'Help Dr. Santos collect rare specimens',
    status: QuestStatus.AVAILABLE,
    objectives: [
      {
        id: 'find_macaw',
        description: 'Find a scarlet macaw specimen',
        type: 'collect',
        target: 'creature_macaw',
        current: 0,
        required: 1,
        completed: false,
      },
      {
        id: 'find_dolphin',
        description: 'Find a pink river dolphin specimen',
        type: 'collect',
        target: 'creature_dolphin_pink',
        current: 0,
        required: 1,
        completed: false,
      },
      {
        id: 'find_lily',
        description: 'Find Victoria amazonica water lily',
        type: 'collect',
        target: 'plant_victoria_lily',
        current: 0,
        required: 1,
        completed: false,
      },
    ],
    rewards: [
      {
        type: 'gold',
        target: 'player',
        amount: 200,
      },
      {
        type: 'item',
        target: 'camera',
        amount: 1,
      },
    ],
  },
  {
    id: 'lost_expedition_quest',
    name: 'The Lost Expedition',
    description: 'Find the remains of the lost Fawcett expedition',
    status: QuestStatus.AVAILABLE,
    objectives: [
      {
        id: 'reach_lost_city',
        description: 'Reach the coordinates of the lost city',
        type: 'reach',
        target: 'vilcabamba',
        current: 0,
        required: 1,
        completed: false,
      },
      {
        id: 'find_artifact',
        description: 'Find an artifact from the expedition',
        type: 'discover',
        target: 'artifact_expedition_journal',
        current: 0,
        required: 1,
        completed: false,
      },
    ],
    rewards: [
      {
        type: 'gold',
        target: 'player',
        amount: 500,
      },
      {
        type: 'item',
        target: 'artifact_inca_figurine',
        amount: 1,
      },
    ],
  },
]

// Combine all quests
const allQuests = [...sampleQuests, ...additionalQuests]

// Export all sample content
export const sampleGameContent = {
  events: sampleEvents,
  quests: allQuests,
  specimens: sampleSpecimens,
}
