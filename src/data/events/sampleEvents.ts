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
    description: 'The river roars ahead like thunder! White water crashes over jagged rocks, churning the brown river into a frothing maelstrom. Your canoe pitches dangerously as the current accelerates, pulling you toward the chaos. You grip your paddle tightly - one wrong move and you could capsize!',
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
    description: 'A splash of water catches your eye! Surfacing mere meters from your canoe, a magnificent pink river dolphin - a boto - emerges from the murky depths. Its skin glows with an ethereal pink hue in the dappled sunlight. According to local legend, seeing one brings good fortune. The creature regards you with intelligent eyes before diving gracefully back into the river, leaving ripples in its wake. An extraordinary moment!',
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
    description: 'Three weathered canoes suddenly burst from a concealed tributary, cutting off your escape! Armed men level rust-pitted rifles at you while their leader - a scarred figure with gold teeth gleaming in the sunlight - grins menacingly. The smell of unwashed bodies and desperation hangs in the humid air. These are river pirates, and they have you surrounded!',
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
    description: 'The sky darkens ominously as massive storm clouds roll in from the jungle, turning day into twilight. Wind whips the river into choppy waves, and the first fat raindrops splatter against your face. Then the deluge begins - a wall of water so thick you can barely see ten meters ahead! Thunder cracks like artillery fire as lightning illuminates the churning river. Your canoe rocks violently, taking on water as the storm batters you mercilessly. You must bail frantically to stay afloat!',
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
    description: 'Movement in the water! An enormous green anaconda - easily 6 meters long and as thick as a man\'s torso - glides across the river directly in your path. Its massive muscular body creates a wake as it swims, olive scales glistening wetly. The serpent\'s head rises from the water, tongue flicking as it senses your presence. These apex predators can crush a caiman in their coils. Your heart pounds as you realize you must navigate past this ancient predator!',
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
    description: 'A ghostly white mist rises from the river like ethereal smoke, thickening with each passing moment. Within minutes, visibility drops to almost nothing - you can barely see the bow of your own canoe! The fog is cold and clammy, muffling all sound except the gentle lap of water and the occasional mysterious splash in the murk. The riverbanks have vanished completely. You drift through a white void, disoriented and vulnerable. Navigation becomes a matter of instinct and prayer. Ancient river travelers called this "breath of the spirits" and considered it a dangerous omen.',
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
    description: 'On the muddy riverbank ahead, you spot a magnificent jaguar emerging from the jungle shadows! The powerful cat moves with liquid grace, its golden coat decorated with distinctive black rosettes. Muscles ripple beneath its pelt as it approaches the water\'s edge to drink, completely unaware of your presence. This is the apex predator of the Amazon - el tigre - feared and revered by locals. You hold your breath, not daring to move, witnessing nature\'s perfect hunter in its element. An unforgettable sight!',
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
    description: 'Without warning, the water EXPLODES beside your canoe! A massive black caiman - over 4 meters of prehistoric fury - erupts from the depths, its jaws lined with rows of dagger-like teeth snapping mere inches from your boat! The largest predator in the Amazon river system, this ancient reptile is all muscle and aggression. Its armored hide is nearly black, camouflaging it perfectly in the dark water. The beast thrashes violently, trying to capsize your vessel. You must fend it off before it destroys your canoe!',
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
    description: 'Through a break in the dense jungle foliage, you glimpse something impossible - stone structures! Pulling your canoe to shore, you hack through vines and undergrowth to reveal ancient ruins, half-swallowed by the forest. Weathered stone blocks, fitted together with incredible precision, rise from the jungle floor. Intricate carvings cover the surfaces - geometric patterns, animal figures, symbols from a civilization long forgotten. Pottery shards litter the ground. This is evidence of the advanced pre-Columbian societies that thrived here centuries before the conquistadors arrived. An archaeological treasure!',
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
    description: 'A distant roar grows louder - something terrible approaches! Upriver, a wall of brown water surges around the bend, carrying uprooted trees, debris, and foam. A flash flood from heavy rains in the highlands has sent a surge wave down the river! The water level rises with terrifying speed, the current accelerating to a churning torrent. Your canoe is caught in the maelstrom, spinning and bucking like a wild horse. Branches and logs hurtle past, any one of which could smash your fragile vessel to splinters. You must navigate through this chaos or be swept away!',
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
      'The tribal shaman\'s eyes grew distant as smoke from sacred herbs swirled between you. "The fever-sickness comes to our village," they whispered urgently. "Children burn with heat, elders grow weak. I need medicinal plants from the deep rainforest - the cat\'s claw vine that grows where jaguars mark their territory, the silver-leafed healing plant found only in shadow. Bring me five specimens, and I will prepare medicine to save my people. The spirits have shown me you are the one who can help." Time is running out - every day of delay means more suffering.',
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
    description: 'Manaus - the legendary "Paris of the Tropics" - rises from the jungle like a fever dream. During the rubber boom, this city became wealthier than European capitals overnight. Rubber barons built the Teatro Amazonas opera house, importing Italian marble, French chandeliers, and European performers to this remote jungle city. The old guide told you: "You haven\'t truly experienced the Amazon until you\'ve stood in that golden opera house, where Caruso once sang to an audience dressed in the finest silks while the jungle pressed against the walls outside. It is civilization\'s strangest triumph." Navigate the treacherous river to reach this impossible city.',
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
      'Sarah Mitchell\'s camera clicked rapidly as she showed you her portfolio - jaguars mid-leap, macaws in flight, caimans exploding from water. "Future generations will only know these creatures through our photographs," she said, her enthusiasm tinged with sadness. "Deforestation, climate change... this Eden won\'t last forever. National Geographic wants a comprehensive wildlife survey - ten different species, properly documented. The pink dolphins, the harpy eagles, the electric eels... I need someone who knows the river to help find them. Will you help me capture this beauty before it vanishes?" She handed you a camera. The Amazon\'s biodiversity is staggering, but time is running out.',
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
    description: 'You hear them before you see them - a distant roar like continuous thunder. The Rapids of Manaus have claimed countless lives over the centuries. Wooden crosses on the riverbank mark where canoes capsized, where dreams ended in churning white water and jagged rocks. The elderly guide warned you: "Only the most skilled paddlers survive the rapids without a scratch. It is not merely about strength, but reading the water, feeling the current\'s rhythm, knowing when to fight and when to surrender to the river\'s flow. Master this, and you master the Amazon itself." Prove your river skills by navigating through unscathed - no mistakes, no second chances.',
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
      'The Amazon river dolphin (boto) is one of only five freshwater dolphin species on Earth and the largest of them all. Adult males can reach 2.5 meters in length and weigh up to 185 kg. Their remarkable pink coloration - caused by blood vessels close to the skin surface - intensifies with age and during excitement. Unlike ocean dolphins, botos have unfused neck vertebrae allowing them to turn their heads 90 degrees, essential for navigating the flooded forests. Indigenous legends speak of botos transforming into handsome men to seduce young women during festivals. Listed as endangered due to pollution and hydroelectric dams threatening their habitat.',
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
      'The scarlet macaw is among the largest and most spectacular parrots in the world, reaching up to 90 cm in length, most of which is their impressive tail feathers. Their brilliant plumage - crimson red bodies with bright yellow wing patches and blue flight feathers - evolved to be visible through the forest canopy. These intelligent birds mate for life, often living 40-50 years in the wild. They use their powerful curved beaks to crack Brazil nuts and palm nuts that other animals cannot open. Indigenous peoples prized their feathers for ceremonial headdresses. Their loud raucous calls can be heard over a kilometer away as flocks fly overhead at dawn and dusk.',
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
      'Uncaria tomentosa, known as uña de gato (cat\'s claw) for its curved thorns resembling feline claws, is a woody vine that can grow up to 30 meters climbing rainforest trees. Indigenous Amazonian tribes have used this plant medicinally for over 2000 years to treat arthritis, inflammation, stomach ulcers, and infections. The inner bark contains over 30 known medicinal compounds including powerful antioxidants. Modern pharmaceutical research has validated many traditional uses, finding anti-inflammatory, antiviral, and immune-boosting properties. Shamans prepare it by boiling the bark and root for hours, creating a bitter tea. In the 1990s, cat\'s claw became popular in Western herbal medicine, leading to overharvesting concerns. Sustainable cultivation is now encouraged to protect wild populations.',
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
      'Panthera onca - the jaguar - reigns as the largest and most powerful cat in the Americas, third largest in the world after tigers and lions. Males can weigh up to 160 kg of pure muscle. Unlike most cats, jaguars are exceptional swimmers and often hunt in water, taking caimans, turtles, and fish. Their name comes from the Native American word "yaguar" meaning "he who kills with one leap." Their bite is the strongest of all big cats relative to size - powerful enough to pierce turtle shells and crush skulls with a single bite to the head. Each jaguar\'s rosette pattern is unique like a fingerprint. Revered as sacred by ancient civilizations including the Maya and Aztec, who associated them with the underworld and the night sun. Now near-threatened due to habitat loss.',
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
      'The green anaconda is the heaviest snake in the world and one of the longest, with females growing up to 9 meters (30 feet) and weighing over 250 kg. Unlike pythons, anacondas are ovoviviparous, giving birth to live young - sometimes over 40 at once! These non-venomous constrictors are ambush predators, lying submerged in murky water with only their eyes and nostrils above the surface. Their prey includes capybaras, deer, caimans, and even jaguars on occasion. They kill by coiling around their victim and constricting until the prey suffocates. The name "anaconda" may derive from the Tamil word "anaikolra" meaning elephant killer. Local legends greatly exaggerate their size, with tales of 15-meter monsters that devour whole canoes.',
    image: 'creature_anaconda',
    value: 150,
  },

  {
    id: 'artifact_pottery',
    name: 'Ancient Pottery',
    category: 'artifact',
    rarity: 'rare',
    description:
      'This pottery shard dates from the pre-Columbian era, likely between 500-1500 CE, bearing intricate geometric designs and zoomorphic patterns characteristic of Marajoara or Tapajonic cultures. The sophisticated ceramic technology - including temperature-controlled firing, polychrome painting, and decorative appliqué - challenges old assumptions about "primitive" Amazonian societies. Archaeological evidence now suggests complex chiefdoms and possibly civilizations of over 100,000 people thrived in the Amazon before European contact. The devastating diseases brought by conquistadors (smallpox, measles, influenza) killed an estimated 90-95% of indigenous populations, erasing vast cultural knowledge. These pottery fragments are precious remnants of sophisticated societies that managed the forest sustainably for millennia, creating the anthropogenic "dark earth" (terra preta) still prized by farmers today. Each shard is a piece of a lost world.',
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
      'The harpy eagle is the most powerful bird of prey in the Americas and one of the largest eagles on Earth. Females can weigh up to 9 kg with a wingspan exceeding 2 meters, though their wings are relatively short for forest maneuverability. Their talons are larger than a grizzly bear\'s claws - up to 13 cm long - capable of exerting over 500 pounds of pressure, enough to crush a monkey\'s skull instantly. They hunt from the canopy, snatching sloths, monkeys, and even small deer from treetops in spectacular aerial attacks. The distinctive double-crest of black feathers raises when alarmed. Named after the harpies of Greek mythology - half-woman, half-bird monsters. Indigenous peoples considered harpy eagle feathers sacred, using them only in the most important ceremonies. Now near-threatened due to deforestation destroying their hunting grounds. A breeding pair requires 25-30 square kilometers of primary forest.',
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
      'Despite its name, the electric eel is not actually an eel but a type of knifefish more closely related to catfish. These remarkable creatures can generate three types of electrical discharge: low-voltage for navigation and communication in murky water, medium-voltage to stun prey, and high-voltage shocks up to 860 volts (though typically 600V) capable of stunning a horse or killing a human. They produce electricity through specialized cells called electrocytes - essentially biological batteries - that can discharge 80% of their 2-meter body simultaneously. They must surface to breathe air every 10 minutes despite having gills. Indigenous hunters traditionally drove horses into water to absorb the eels\' shocks until they tired, then safely captured them. Alexander von Humboldt witnessed this technique in 1800 and nearly died from shock himself studying these fish.',
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
      'Victoria amazonica is the largest water lily in the world, with circular pads reaching up to 3 meters in diameter. The underside features an intricate network of ribs radiating from the center - a natural architectural marvel that inspired the design of London\'s Crystal Palace in 1851. These reinforcing ribs can support up to 45 kg evenly distributed, enough for a small child to sit upon. The upturned rim (up to 20 cm high) prevents water from washing over the pad. Each night, the spectacular white flowers bloom and emit a pineapple-like fragrance to attract scarab beetles. On the second night, the flower turns pink and closes, trapping beetles inside to ensure pollination before dying. Named after Queen Victoria, this plant became a sensation in Victorian England when first successfully cultivated in 1849. Indigenous peoples traditionally used the enormous seeds - the size of peas - as food, popping them like popcorn.',
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
    description: 'The Rubber Baron leans back in his fine mahogany chair, imported from Portugal, and counts gold coins with manicured hands that have never touched a rubber tree. "White gold, my friend! That\'s what they call it! During the boom, we were richer than Rothschilds!" He gestures at his opulent mansion. "I need ten units of quality latex. The seringueiros are lazy - I need someone motivated. Bring me the rubber, and you\'ll have 100 gold pieces. Refuse..." He shrugs coldly. "...then you\'re just another nobody in the jungle." The rubber trade built empires on the backs of indigenous laborers. Will you participate in this brutal commerce?',
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
    description: 'Dr. Helena Santos adjusts her round spectacles excitedly, her field journal filled with detailed sketches and notes. "The Amazon holds more plant and animal species than anywhere else on Earth! But we\'re losing them before science can even catalog them!" She shows you sketches: a scarlet macaw in flight, a pink boto breaching water, the magnificent Victoria amazonica lily. "I need specimens for the Royal Botanical Gardens. A scarlet macaw feather, evidence of boto sighting, and a Victoria lily sample. These will advance our understanding immeasurably! The university will fund further expeditions if we succeed!" Her passion for discovery is genuine. Help push the boundaries of scientific knowledge.',
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
    description: 'In 1925, British explorer Colonel Percy Fawcett and his son disappeared into the Amazon searching for a lost city he called "Z" - believing ancient civilizations once thrived in the jungle. They were never seen again. An old prospector shows you a water-stained map with Fawcett\'s last known coordinates. "Hundreds have searched. Most never returned. But I found this journal page near Vilcabamba... his handwriting, I swear it! \'The city exists... the ruins are magnificent...\' it says. Then blood smears. Someone will solve this mystery eventually. Why not you?" The greatest archaeological mystery of the century awaits. Will you dare seek what Fawcett died searching for?',
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
    description: 'Sarah Mitchell spreads her photographs across the canoe - each one a masterpiece of wildlife photography. "This jaguar took me three weeks to find. The giant otter family... I lived in a blind for a month. The scarlet macaws... I had to climb a 50-meter tree at dawn every day." She looks at you seriously. "National Geographic wants a comprehensive portfolio - the apex predators, the iconic species, the creatures that define the Amazon. But I can\'t cover enough territory alone. The jaguar hunts at dusk, the macaws feed at dawn, the otters are incredibly shy... I need a river expert to help locate them. Together, we can create something that will inspire the world to protect this place." Art meets science in the service of conservation.',
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
    description: 'A desperate merchant grabs your arm at the trading post. "The river pirates grow bolder! Last week they attacked three merchant boats, killed two traders, stole everything! The gold-toothed captain and his crew terrorize the whole region!" He shows you a wanted poster - crude drawings of scarred faces. "The authorities in Manaus offer 150 gold pieces for information leading to their capture. But getting that information..." He swallows nervously. "...means surviving encounters with them. Three documented confrontations should prove their patterns, their hideouts. You\'re brave enough to travel alone - brave enough to face them? Someone must stop these murderers before they kill again. Will you bring justice to the river?"',
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
    description: 'Father Miguel kneels in the dirt, sketching plans for a school building while indigenous children watch curiously. "These children deserve education, medical care, hope for the future," he says quietly. "But I am a priest, not a carpenter or doctor. I need tools - hammers, saws, nails to build the school. And medicine - quinine for malaria, bandages, antiseptics for the clinic." He looks up at you with tired but determined eyes. "The rubber barons exploit them, the settlers ignore them, disease kills them. Someone must help. God has placed this burden on my shoulders, but I cannot carry it alone. Will you aid this mission of mercy? Not for profit, but for humanity?"',
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
    description: 'The Old Prospector spreads his ancient map across a boulder, fingers trembling with excitement and madness. "El Dorado! The City of Gold! It\'s REAL!" he insists feverishly. "The conquistadors searched in the wrong places! But I know... I KNOW it\'s up this tributary!" He points to unnamed waterways on the map. "First, prove yourself. Find five gold nuggets in the river sediment - it washes down from the Andes. Then locate the ancient treasure map - I heard rumors a missionary has part of it. With those, we\'ll have everything we need!" His eyes burn with three decades of obsession. "They called me mad! But we\'ll show them ALL!" Fortune or folly? Only one way to discover which.',
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
    description: 'The Village Elder sets down their carving and regards you solemnly. "For five hundred years, outsiders have come to our land. The conquistadors brought disease and slavery. The rubber barons brought exploitation and death. The settlers bring destruction of the forest." They pause, studying your face. "But not all outsiders are the same. Some come to learn, to trade fairly, to respect our ways. Prove yourself different. Visit three villages along the river - not to take, but to understand. Complete five fair trades - offering value, not theft. Do this, and we will know your heart is good. We will share our knowledge, our medicine, our friendship. Build a bridge between your world and ours."',
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
