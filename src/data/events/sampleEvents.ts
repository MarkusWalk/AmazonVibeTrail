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

  // Pirate ambush encounter
  {
    id: 'pirate_ambush',
    name: 'River Pirate Ambush',
    description: 'Pirates block your path demanding a toll',
    type: EventType.ENCOUNTER,
    trigger: {
      type: TriggerType.RANDOM,
      probability: 0.08,
      conditions: [
        { type: 'distance', key: 'distance', operator: 'greater', value: 200 },
      ],
    },
    data: {
      hostile: true,
      damage: 30,
      dialogueId: 'river_pirate',
    },
    repeatable: true,
    cooldown: 900000, // 15 minutes
  },

  // Missionary shelter
  {
    id: 'missionary_shelter',
    name: 'Mission Shelter',
    description: 'You find a missionary outpost offering shelter',
    type: EventType.DIALOGUE,
    trigger: {
      type: TriggerType.HEALTH,
      conditions: [
        { type: 'health', key: 'health', operator: 'less', value: 50 },
      ],
    },
    data: {
      dialogueId: 'missionary_shelter',
    },
    repeatable: true,
    cooldown: 1200000, // 20 minutes
  },

  // Gold prospector encounter
  {
    id: 'gold_prospector_encounter',
    name: 'Mad Prospector',
    description: 'An old prospector shares tales of El Dorado',
    type: EventType.DIALOGUE,
    trigger: {
      type: TriggerType.RANDOM,
      probability: 0.1,
      conditions: [
        { type: 'distance', key: 'distance', operator: 'greater', value: 300 },
      ],
    },
    data: {
      dialogueId: 'gold_prospector',
    },
    repeatable: false,
  },

  // Tropical storm hazard
  {
    id: 'tropical_storm',
    name: 'Tropical Storm',
    description: 'A sudden storm batters your canoe',
    type: EventType.HAZARD,
    trigger: {
      type: TriggerType.RANDOM,
      probability: 0.12,
    },
    data: {
      hazardType: 'storm',
      damage: 20,
      speedModifier: 0.5,
    },
    repeatable: true,
    cooldown: 600000, // 10 minutes
  },

  // Wildlife photographer quest
  {
    id: 'photographer_quest_trigger',
    name: 'Wildlife Documentation',
    description: 'A photographer needs help documenting wildlife',
    type: EventType.QUEST,
    trigger: {
      type: TriggerType.LOCATION,
      conditions: [
        { type: 'location', key: 'santarem', operator: 'equals', value: 'santarem' },
      ],
    },
    data: {
      questId: 'wildlife_photography_quest',
      dialogueId: 'wildlife_photographer',
    },
    repeatable: false,
  },

  // Portuguese explorer encounter
  {
    id: 'portuguese_explorer_lost',
    name: 'Lost Explorer',
    description: 'A Portuguese expedition has lost their way',
    type: EventType.ENCOUNTER,
    trigger: {
      type: TriggerType.RANDOM,
      probability: 0.06,
      conditions: [
        { type: 'distance', key: 'distance', operator: 'greater', value: 400 },
      ],
    },
    data: {
      hostile: false,
      dialogueId: 'portuguese_explorer',
    },
    repeatable: false,
  },

  // Indigenous village encounter
  {
    id: 'indigenous_village',
    name: 'Indigenous Village',
    description: 'You encounter a friendly indigenous village',
    type: EventType.DIALOGUE,
    trigger: {
      type: TriggerType.LOCATION,
      conditions: [
        { type: 'location', key: 'iquitos', operator: 'equals', value: 'iquitos' },
      ],
    },
    data: {
      dialogueId: 'indigenous_elder',
    },
    repeatable: false,
  },

  // Anaconda hazard
  {
    id: 'anaconda_encounter',
    name: 'Giant Anaconda',
    description: 'A massive anaconda crosses your path',
    type: EventType.HAZARD,
    trigger: {
      type: TriggerType.RANDOM,
      probability: 0.07,
      conditions: [
        { type: 'distance', key: 'distance', operator: 'greater', value: 150 },
      ],
    },
    data: {
      hazardType: 'wildlife',
      damage: 15,
      discoveryId: 'creature_anaconda',
    },
    repeatable: true,
    cooldown: 480000, // 8 minutes
  },

  // Fog environmental event
  {
    id: 'thick_fog',
    name: 'Dense Fog',
    description: 'Thick fog descends on the river, reducing visibility',
    type: EventType.ENVIRONMENTAL,
    trigger: {
      type: TriggerType.RANDOM,
      probability: 0.15,
    },
    data: {
      speedModifier: 0.6,
      duration: 120000, // 2 minutes
      weatherEffect: 'fog',
    },
    repeatable: true,
    cooldown: 300000, // 5 minutes
  },

  // Jaguar sighting
  {
    id: 'jaguar_sighting',
    name: 'Jaguar on the Riverbank',
    description: 'A magnificent jaguar is spotted drinking at the river',
    type: EventType.DISCOVERY,
    trigger: {
      type: TriggerType.RANDOM,
      probability: 0.04, // Rare
      conditions: [
        { type: 'distance', key: 'distance', operator: 'greater', value: 600 },
      ],
    },
    data: {
      discoveryType: 'specimen',
      discoveryId: 'creature_jaguar',
    },
    repeatable: false,
  },

  // Rations running low
  {
    id: 'low_rations_warning',
    name: 'Dwindling Supplies',
    description: 'Your rations are running dangerously low',
    type: EventType.DIALOGUE,
    trigger: {
      type: TriggerType.RATIONS,
      conditions: [
        { type: 'rations', key: 'rations', operator: 'less', value: 25 },
        { type: 'flag', key: 'low_rations_warned', operator: 'not', value: true },
      ],
    },
    data: {
      dialogueId: 'low_rations_warning',
    },
    repeatable: false,
  },

  // Caiman attack
  {
    id: 'black_caiman_attack',
    name: 'Black Caiman Attack',
    description: 'A black caiman lunges at your canoe',
    type: EventType.HAZARD,
    trigger: {
      type: TriggerType.RANDOM,
      probability: 0.09,
    },
    data: {
      hazardType: 'wildlife',
      damage: 25,
      discoveryId: 'creature_black_caiman',
    },
    repeatable: true,
    cooldown: 420000, // 7 minutes
  },

  // Ancient ruins discovery
  {
    id: 'ancient_ruins_discovery',
    name: 'Hidden Ruins',
    description: 'You discover ancient ruins hidden in the jungle',
    type: EventType.DISCOVERY,
    trigger: {
      type: TriggerType.RANDOM,
      probability: 0.03, // Very rare
      conditions: [
        { type: 'distance', key: 'distance', operator: 'greater', value: 800 },
      ],
    },
    data: {
      discoveryType: 'artifact',
      discoveryId: 'artifact_pottery',
    },
    repeatable: false,
  },

  // Flash flood
  {
    id: 'flash_flood',
    name: 'Flash Flood',
    description: 'Rising waters threaten to capsize your canoe',
    type: EventType.HAZARD,
    trigger: {
      type: TriggerType.RANDOM,
      probability: 0.05,
    },
    data: {
      hazardType: 'flood',
      damage: 30,
      speedModifier: 1.5, // Faster current
    },
    repeatable: true,
    cooldown: 720000, // 12 minutes
  },

  // Indigenous hunter teaching
  {
    id: 'hunter_teaching',
    name: 'Hunter\'s Wisdom',
    description: 'An indigenous hunter offers to teach you survival skills',
    type: EventType.DIALOGUE,
    trigger: {
      type: TriggerType.RANDOM,
      probability: 0.08,
      conditions: [
        { type: 'distance', key: 'distance', operator: 'greater', value: 250 },
      ],
    },
    data: {
      dialogueId: 'indigenous_hunter',
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
  {
    id: 'creature_harpy_eagle',
    name: 'Harpy Eagle Feather',
    scientificName: 'Harpia harpyja',
    category: 'animal',
    rarity: 'rare',
    description:
      'Feather from the harpy eagle, one of the largest and most powerful eagles in the world.',
    image: 'creature_harpy_eagle',
    value: 180,
  },
  {
    id: 'creature_poison_dart_frog',
    name: 'Poison Dart Frog',
    scientificName: 'Dendrobates sp.',
    category: 'animal',
    rarity: 'uncommon',
    description:
      'Brightly colored frog containing powerful toxins used by indigenous peoples on hunting darts.',
    image: 'creature_poison_frog',
    value: 120,
  },
  {
    id: 'creature_black_caiman',
    name: 'Black Caiman Tooth',
    scientificName: 'Melanosuchus niger',
    category: 'animal',
    rarity: 'rare',
    description:
      'Tooth from a black caiman, the largest predator in the Amazon river system.',
    image: 'creature_black_caiman',
    value: 160,
  },
  {
    id: 'creature_otter_giant',
    name: 'Giant River Otter Whisker',
    scientificName: 'Pteronura brasiliensis',
    category: 'animal',
    rarity: 'uncommon',
    description:
      'Whisker from the giant river otter, an endangered species native to the Amazon.',
    image: 'creature_otter',
    value: 140,
  },
  {
    id: 'creature_arapaima',
    name: 'Arapaima Scale',
    scientificName: 'Arapaima gigas',
    category: 'animal',
    rarity: 'uncommon',
    description:
      'Scale from one of the largest freshwater fish in the world, known to reach 3 meters in length.',
    image: 'creature_arapaima',
    value: 95,
  },
  {
    id: 'creature_toucan',
    name: 'Toucan Beak Fragment',
    scientificName: 'Ramphastos sp.',
    category: 'animal',
    rarity: 'common',
    description:
      'Fragment from a toucan beak, these birds are iconic symbols of the rainforest.',
    image: 'creature_toucan',
    value: 70,
  },
  {
    id: 'creature_tarantula',
    name: 'Goliath Tarantula',
    scientificName: 'Theraphosa blondi',
    category: 'animal',
    rarity: 'uncommon',
    description:
      'The largest spider in the world by mass, native to the Amazon rainforest.',
    image: 'creature_tarantula',
    value: 85,
  },
  {
    id: 'creature_electric_eel',
    name: 'Electric Eel Specimen',
    scientificName: 'Electrophorus electricus',
    category: 'animal',
    rarity: 'rare',
    description:
      'Actually a type of knifefish, capable of generating powerful electric shocks up to 600 volts.',
    image: 'creature_electric_eel',
    value: 190,
  },
  {
    id: 'plant_victoria_lily',
    name: 'Victoria Lily Pad',
    scientificName: 'Victoria amazonica',
    category: 'plant',
    rarity: 'uncommon',
    description:
      'Massive water lily with pads that can grow up to 3 meters in diameter and support significant weight.',
    image: 'plant_victoria_lily',
    value: 110,
  },
  {
    id: 'plant_brazil_nut',
    name: 'Brazil Nut Pod',
    scientificName: 'Bertholletia excelsa',
    category: 'plant',
    rarity: 'common',
    description:
      'Hard-shelled pod containing brazil nuts, these trees can live for over 500 years.',
    image: 'plant_brazil_nut',
    value: 40,
  },
  {
    id: 'plant_cinchona_bark',
    name: 'Cinchona Bark',
    scientificName: 'Cinchona sp.',
    category: 'plant',
    rarity: 'uncommon',
    description:
      'Bark from the cinchona tree, source of quinine used to treat malaria.',
    image: 'plant_cinchona',
    value: 130,
  },
  {
    id: 'plant_heliconia',
    name: 'Heliconia Flower',
    scientificName: 'Heliconia sp.',
    category: 'plant',
    rarity: 'common',
    description:
      'Colorful tropical flower resembling a bird of paradise, pollinated by hummingbirds.',
    image: 'plant_heliconia',
    value: 55,
  },
  {
    id: 'plant_passion_fruit',
    name: 'Wild Passion Fruit',
    scientificName: 'Passiflora edulis',
    category: 'plant',
    rarity: 'common',
    description:
      'Fruit from the passion flower vine, native to the Amazon and widely cultivated.',
    image: 'plant_passion_fruit',
    value: 35,
  },
  {
    id: 'mineral_emerald',
    name: 'Amazon Emerald',
    category: 'mineral',
    rarity: 'rare',
    description:
      'High-quality emerald from the Amazon region, prized for its deep green color.',
    image: 'mineral_emerald',
    value: 300,
  },
  {
    id: 'mineral_quartz_crystal',
    name: 'Clear Quartz Crystal',
    category: 'mineral',
    rarity: 'uncommon',
    description:
      'Large quartz crystal formation, believed by indigenous peoples to have spiritual properties.',
    image: 'mineral_quartz',
    value: 75,
  },
  {
    id: 'artifact_stone_axe',
    name: 'Pre-Columbian Stone Axe',
    category: 'artifact',
    rarity: 'rare',
    description:
      'Polished stone axe head from pre-Columbian times, showing advanced tool-making skills.',
    image: 'artifact_axe',
    value: 220,
  },
  {
    id: 'artifact_treasure_map',
    name: 'Ancient Treasure Map',
    category: 'artifact',
    rarity: 'legendary',
    description:
      'Faded map supposedly showing the location of El Dorado, the legendary city of gold.',
    image: 'artifact_map',
    value: 450,
  },
  {
    id: 'artifact_shaman_mask',
    name: 'Ceremonial Shaman Mask',
    category: 'artifact',
    rarity: 'rare',
    description:
      'Intricately carved wooden mask used in traditional shamanic ceremonies.',
    image: 'artifact_mask',
    value: 280,
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
  {
    id: 'wildlife_photography_quest',
    name: 'Amazon Wildlife Portfolio',
    description: 'Help Sarah Mitchell document rare Amazon wildlife',
    status: QuestStatus.AVAILABLE,
    objectives: [
      {
        id: 'photograph_jaguar',
        description: 'Photograph a jaguar',
        type: 'discover',
        target: 'creature_jaguar',
        current: 0,
        required: 1,
        completed: false,
      },
      {
        id: 'photograph_macaw',
        description: 'Photograph a scarlet macaw',
        type: 'discover',
        target: 'creature_macaw_scarlet',
        current: 0,
        required: 1,
        completed: false,
      },
      {
        id: 'photograph_otter',
        description: 'Photograph a giant river otter',
        type: 'discover',
        target: 'creature_otter_giant',
        current: 0,
        required: 1,
        completed: false,
      },
    ],
    rewards: [
      {
        type: 'gold',
        target: 'player',
        amount: 250,
      },
      {
        type: 'item',
        target: 'professional_camera',
        amount: 1,
      },
    ],
  },
  {
    id: 'pirate_revenge_quest',
    name: 'River Justice',
    description: 'Stop the river pirates from raiding settlements',
    status: QuestStatus.AVAILABLE,
    objectives: [
      {
        id: 'survive_pirate_encounters',
        description: 'Survive pirate encounters',
        type: 'survive',
        target: 'pirate_encounter',
        current: 0,
        required: 3,
        completed: false,
      },
      {
        id: 'report_to_authorities',
        description: 'Report to authorities in Manaus',
        type: 'talk',
        target: 'manaus_authorities',
        current: 0,
        required: 1,
        completed: false,
      },
    ],
    rewards: [
      {
        type: 'gold',
        target: 'player',
        amount: 150,
      },
      {
        type: 'item',
        target: 'pirate_treasure_map',
        amount: 1,
      },
    ],
  },
  {
    id: 'missionary_aid_quest',
    name: 'Mission of Mercy',
    description: 'Help Father Miguel build a school for local children',
    status: QuestStatus.AVAILABLE,
    objectives: [
      {
        id: 'collect_tools',
        description: 'Collect building tools',
        type: 'collect',
        target: 'tools',
        current: 0,
        required: 5,
        completed: false,
      },
      {
        id: 'collect_medicine',
        description: 'Collect medicine supplies',
        type: 'collect',
        target: 'medicine',
        current: 0,
        required: 10,
        completed: false,
      },
    ],
    rewards: [
      {
        type: 'item',
        target: 'blessing_amulet',
        amount: 1,
      },
      {
        type: 'health',
        target: 'player',
        amount: 50,
      },
    ],
  },
  {
    id: 'gold_rush_quest',
    name: 'El Dorado Fever',
    description: 'Search for gold in the ancient tributaries',
    status: QuestStatus.AVAILABLE,
    objectives: [
      {
        id: 'collect_gold_nuggets',
        description: 'Collect gold nuggets',
        type: 'collect',
        target: 'mineral_gold_nugget',
        current: 0,
        required: 5,
        completed: false,
      },
      {
        id: 'find_ancient_map',
        description: 'Find an ancient treasure map',
        type: 'discover',
        target: 'artifact_treasure_map',
        current: 0,
        required: 1,
        completed: false,
      },
    ],
    rewards: [
      {
        type: 'gold',
        target: 'player',
        amount: 300,
      },
      {
        type: 'item',
        target: 'gold_pan',
        amount: 1,
      },
    ],
  },
  {
    id: 'indigenous_alliance_quest',
    name: 'Bridge of Cultures',
    description: 'Build trust with the indigenous communities',
    status: QuestStatus.AVAILABLE,
    objectives: [
      {
        id: 'visit_villages',
        description: 'Visit indigenous villages',
        type: 'reach',
        target: 'indigenous_village',
        current: 0,
        required: 3,
        completed: false,
      },
      {
        id: 'trade_fairly',
        description: 'Complete fair trades',
        type: 'talk',
        target: 'village_traders',
        current: 0,
        required: 5,
        completed: false,
      },
    ],
    rewards: [
      {
        type: 'item',
        target: 'sacred_herb_pouch',
        amount: 1,
      },
      {
        type: 'unlock',
        target: 'indigenous_knowledge',
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
