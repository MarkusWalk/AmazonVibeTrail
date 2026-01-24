import type { DialogueTree } from '@models/dialogue'

/**
 * Sample Dialogue Trees
 *
 * These are example dialogues that demonstrate the system.
 * Add your own dialogues following this structure.
 */

export const elderlyGuideDialogue: DialogueTree = {
  id: 'guide_welcome',
  name: 'Elderly Guide - Welcome',
  startNodeId: 'welcome',
  nodes: [
    {
      id: 'welcome',
      speaker: 'Elderly Guide',
      portrait: 'npc_guide_elderly',
      text: 'Ah, a new traveler! Welcome to the mighty Amazon River. I have spent my entire life on these waters. What brings you to this wild frontier?',
      choices: [
        {
          id: 'exploration',
          text: 'I seek to explore the Amazon and document its wonders.',
          nextNodeId: 'explorer_path',
        },
        {
          id: 'trade',
          text: 'I am here to trade goods with the settlements along the river.',
          nextNodeId: 'trader_path',
        },
        {
          id: 'research',
          text: 'I am a researcher studying the flora and fauna of this region.',
          nextNodeId: 'researcher_path',
        },
      ],
    },
    {
      id: 'explorer_path',
      speaker: 'Elderly Guide',
      portrait: 'npc_guide_elderly',
      text: 'A noble pursuit! The Amazon holds countless mysteries. Be cautious of the rapids, and always respect the river. She can be generous, but also unforgiving.',
      nextNodeId: 'advice',
    },
    {
      id: 'trader_path',
      speaker: 'Elderly Guide',
      portrait: 'npc_guide_elderly',
      text: 'Trade can bring prosperity to these lands. The settlements along the river are always in need of goods. Be fair in your dealings, and you will be welcomed.',
      nextNodeId: 'advice',
    },
    {
      id: 'researcher_path',
      speaker: 'Elderly Guide',
      portrait: 'npc_guide_elderly',
      text: 'A scholar! The Amazon is the greatest natural library in the world. You will find species here that exist nowhere else. May your research bear fruit.',
      nextNodeId: 'advice',
    },
    {
      id: 'advice',
      speaker: 'Elderly Guide',
      portrait: 'npc_guide_elderly',
      text: 'Before you depart, let me give you some advice: Keep your rations stocked, watch for whirlpools, and if you see the pink dolphins, consider it a good omen.',
      choices: [
        {
          id: 'ask_supplies',
          text: 'What supplies should I carry?',
          nextNodeId: 'supplies_advice',
        },
        {
          id: 'ask_dangers',
          text: 'What dangers should I watch out for?',
          nextNodeId: 'dangers_advice',
        },
        {
          id: 'thank_leave',
          text: 'Thank you for the advice. I should be going.',
          nextNodeId: null, // End dialogue
        },
      ],
    },
    {
      id: 'supplies_advice',
      speaker: 'Elderly Guide',
      portrait: 'npc_guide_elderly',
      text: 'Always carry extra rations and medicine. A harpoon is useful for fishing. And a good map... well, that could save your life when the fog rolls in.',
      nextNodeId: 'farewell',
    },
    {
      id: 'dangers_advice',
      speaker: 'Elderly Guide',
      portrait: 'npc_guide_elderly',
      text: 'Beware of piranhas in shallow waters, anacondas near the banks, and jaguars if you venture into the forest. But the river itself is your greatest challenge - respect it.',
      nextNodeId: 'farewell',
    },
    {
      id: 'farewell',
      speaker: 'Elderly Guide',
      portrait: 'npc_guide_elderly',
      text: 'May the river spirits guide your journey. Safe travels, friend.',
      nextNodeId: null, // End dialogue
    },
  ],
}

export const merchantDialogue: DialogueTree = {
  id: 'merchant_trade',
  name: 'River Merchant - Trade',
  startNodeId: 'greeting',
  nodes: [
    {
      id: 'greeting',
      speaker: 'River Merchant',
      portrait: 'npc_trader_merchant',
      text: "Greetings, traveler! I am a merchant who trades along these waters. Looking to buy or sell? I have the finest goods from Belém to Iquitos!",
      choices: [
        {
          id: 'browse',
          text: 'What do you have for sale?',
          nextNodeId: 'show_goods',
        },
        {
          id: 'sell',
          text: 'I have some items to sell.',
          nextNodeId: 'buy_goods',
        },
        {
          id: 'info',
          text: 'Tell me about the river ahead.',
          nextNodeId: 'river_info',
        },
        {
          id: 'leave',
          text: 'Just passing through. Goodbye.',
          nextNodeId: null,
        },
      ],
    },
    {
      id: 'show_goods',
      speaker: 'River Merchant',
      portrait: 'npc_trader_merchant',
      text: 'I have medicine, tools, and supplies. Everything an adventurer needs! Prices are fair, and quality is guaranteed.',
      nextNodeId: 'trade_menu',
    },
    {
      id: 'buy_goods',
      speaker: 'River Merchant',
      portrait: 'npc_trader_merchant',
      text: "Ah, a fellow trader! Let me see what you've got. I'll offer good prices for rare specimens and trade goods.",
      nextNodeId: 'trade_menu',
    },
    {
      id: 'river_info',
      speaker: 'River Merchant',
      portrait: 'npc_trader_merchant',
      text: 'The river ahead gets rougher. Stock up on supplies here - the next trading post is many kilometers downstream. Be careful of the rapids near Manaus.',
      nextNodeId: 'trade_menu',
    },
    {
      id: 'trade_menu',
      speaker: 'River Merchant',
      portrait: 'npc_trader_merchant',
      text: 'Anything else I can help you with today?',
      choices: [
        {
          id: 'buy_more',
          text: 'Let me see your goods again.',
          nextNodeId: 'show_goods',
        },
        {
          id: 'done',
          text: 'That will be all. Thank you.',
          nextNodeId: 'farewell',
        },
      ],
    },
    {
      id: 'farewell',
      speaker: 'River Merchant',
      portrait: 'npc_trader_merchant',
      text: 'Safe travels! May your canoe stay dry and your catches be plentiful!',
      nextNodeId: null,
    },
  ],
}

export const shamanDialogue: DialogueTree = {
  id: 'shaman_healing',
  name: 'Tribal Shaman - Healing',
  startNodeId: 'greeting',
  nodes: [
    {
      id: 'greeting',
      speaker: 'Tribal Shaman',
      portrait: 'npc_shaman',
      text: 'The spirits told me a traveler would come. You carry the weariness of the river. Do you seek healing, wisdom, or merely rest?',
      choices: [
        {
          id: 'healing',
          text: 'I am injured and need healing.',
          nextNodeId: 'offer_healing',
        },
        {
          id: 'wisdom',
          text: 'I seek wisdom about the river.',
          nextNodeId: 'offer_wisdom',
        },
        {
          id: 'rest',
          text: 'Just a place to rest would be wonderful.',
          nextNodeId: 'offer_rest',
        },
      ],
    },
    {
      id: 'offer_healing',
      speaker: 'Tribal Shaman',
      portrait: 'npc_shaman',
      text: 'The forest provides for those who respect it. I will prepare a healing remedy from sacred herbs. Rest here, and by morning you will feel renewed.',
      nextNodeId: 'blessing',
      effect: {
        type: 'change_health',
        payload: { amount: 50 },
      },
    },
    {
      id: 'offer_wisdom',
      speaker: 'Tribal Shaman',
      portrait: 'npc_shaman',
      text: 'The river is not merely water, young one. It is the lifeblood of the forest, the path of our ancestors. Listen to its voice, and it will guide you.',
      nextNodeId: 'blessing',
    },
    {
      id: 'offer_rest',
      speaker: 'Tribal Shaman',
      portrait: 'npc_shaman',
      text: 'You are welcome in our village. Rest by the fire, eat with us. Tomorrow, continue your journey with renewed spirit.',
      nextNodeId: 'blessing',
      effect: {
        type: 'change_health',
        payload: { amount: 25 },
      },
    },
    {
      id: 'blessing',
      speaker: 'Tribal Shaman',
      portrait: 'npc_shaman',
      text: 'May the river spirits watch over you. Go in peace, traveler.',
      nextNodeId: null,
    },
  ],
}

export const rubberBaronDialogue: DialogueTree = {
  id: 'rubber_baron',
  name: 'Rubber Baron - Business Proposition',
  startNodeId: 'greeting',
  nodes: [
    {
      id: 'greeting',
      speaker: 'Rubber Baron',
      portrait: 'npc_baron',
      text: 'Ah, another fortune seeker! The rubber trade has made many men rich. Are you here to work for me, or do you have rubber to sell?',
      choices: [
        {
          id: 'work',
          text: 'I am looking for work. What can I do for you?',
          nextNodeId: 'work_offer',
        },
        {
          id: 'sell',
          text: 'I have rubber to trade. What is your offer?',
          nextNodeId: 'trade_rubber',
        },
        {
          id: 'refuse',
          text: 'I am not interested in the rubber trade.',
          nextNodeId: 'disappointed',
        },
      ],
    },
    {
      id: 'work_offer',
      speaker: 'Rubber Baron',
      portrait: 'npc_baron',
      text: 'I need someone to collect rubber from the trees upriver. Bring me 10 units of rubber, and I will pay you handsomely. 100 gold pieces!',
      nextNodeId: 'accept_quest',
      effect: {
        type: 'START_QUEST',
        questId: 'rubber_collection_quest',
      },
    },
    {
      id: 'trade_rubber',
      speaker: 'Rubber Baron',
      portrait: 'npc_baron',
      text: 'Excellent! I will pay you 25 gold per unit of rubber. The more you bring, the richer you become!',
      nextNodeId: 'farewell',
      effect: {
        type: 'OPEN_TRADE',
        merchantId: 'rubber_baron',
      },
    },
    {
      id: 'disappointed',
      speaker: 'Rubber Baron',
      portrait: 'npc_baron',
      text: 'Hmph! Then you are of no use to me. Good day.',
      nextNodeId: null,
    },
    {
      id: 'accept_quest',
      speaker: 'Rubber Baron',
      portrait: 'npc_baron',
      text: 'Splendid! Return when you have the rubber.',
      nextNodeId: null,
    },
    {
      id: 'farewell',
      speaker: 'Rubber Baron',
      portrait: 'npc_baron',
      text: 'Pleasure doing business with you!',
      nextNodeId: null,
    },
  ],
}

export const indigenousHunterDialogue: DialogueTree = {
  id: 'indigenous_hunter',
  name: 'Indigenous Hunter - Forest Knowledge',
  startNodeId: 'encounter',
  nodes: [
    {
      id: 'encounter',
      speaker: 'Indigenous Hunter',
      portrait: 'npc_hunter',
      text: 'You travel loudly through the forest. The animals hear you coming from far away. Are you seeking food, or are you lost?',
      choices: [
        {
          id: 'food',
          text: 'I need to hunt for food. Can you teach me?',
          nextNodeId: 'teach_hunting',
        },
        {
          id: 'medicine',
          text: 'I seek medicinal plants. Do you know where to find them?',
          nextNodeId: 'medicine_knowledge',
        },
        {
          id: 'just_passing',
          text: 'I am just passing through. I mean no harm.',
          nextNodeId: 'safe_passage',
        },
      ],
    },
    {
      id: 'teach_hunting',
      speaker: 'Indigenous Hunter',
      portrait: 'npc_hunter',
      text: 'Hunting requires patience and respect for the forest. Take this harpoon. Use it wisely, and only take what you need.',
      nextNodeId: 'farewell',
      effect: {
        type: 'GIVE_ITEM',
        itemId: 'harpoon',
        quantity: 3,
      },
    },
    {
      id: 'medicine_knowledge',
      speaker: 'Indigenous Hunter',
      portrait: 'npc_hunter',
      text: 'The cinchona tree grows in the high forests. Its bark cures the fever that kills outsiders. Also seek the medicinal herbs near the river banks.',
      nextNodeId: 'farewell',
    },
    {
      id: 'safe_passage',
      speaker: 'Indigenous Hunter',
      portrait: 'npc_hunter',
      text: 'The forest can be dangerous for those who do not know its ways. Stay on the river, and you will be safe.',
      nextNodeId: 'farewell',
    },
    {
      id: 'farewell',
      speaker: 'Indigenous Hunter',
      portrait: 'npc_hunter',
      text: 'May the spirits protect you on your journey.',
      nextNodeId: null,
    },
  ],
}

export const botanistDialogue: DialogueTree = {
  id: 'botanist_expedition',
  name: 'Botanist - Scientific Expedition',
  startNodeId: 'excited_greeting',
  nodes: [
    {
      id: 'excited_greeting',
      speaker: 'Dr. Helena Santos',
      portrait: 'npc_botanist',
      text: "Oh marvelous! Another soul interested in the Amazon's biodiversity! I am Dr. Helena Santos, studying the medicinal plants of this region. Have you encountered any interesting specimens?",
      choices: [
        {
          id: 'show_specimens',
          text: 'Yes! I have collected several plants and creatures.',
          nextNodeId: 'examine_specimens',
        },
        {
          id: 'help_collect',
          text: 'I can help you collect specimens. What do you need?',
          nextNodeId: 'quest_specimens',
        },
        {
          id: 'not_interested',
          text: 'I am not a scientist. I am just passing through.',
          nextNodeId: 'disappointed_response',
        },
      ],
    },
    {
      id: 'examine_specimens',
      speaker: 'Dr. Helena Santos',
      portrait: 'npc_botanist',
      text: 'Fascinating! Let me examine what you have found. Some of these specimens are quite rare! I will pay you for any specimens you wish to sell.',
      nextNodeId: 'trade_specimens',
      effect: {
        type: 'OPEN_TRADE',
        merchantId: 'botanist',
      },
    },
    {
      id: 'quest_specimens',
      speaker: 'Dr. Helena Santos',
      portrait: 'npc_botanist',
      text: 'Wonderful! I need samples of the scarlet macaw, the pink river dolphin, and the Victoria amazonica water lily. If you can find these, I will reward you generously!',
      nextNodeId: 'accept_science_quest',
      effect: {
        type: 'START_QUEST',
        questId: 'botanical_specimens_quest',
      },
    },
    {
      id: 'disappointed_response',
      speaker: 'Dr. Helena Santos',
      portrait: 'npc_botanist',
      text: 'A pity. This region holds so many secrets yet to be discovered by science.',
      nextNodeId: null,
    },
    {
      id: 'accept_science_quest',
      speaker: 'Dr. Helena Santos',
      portrait: 'npc_botanist',
      text: 'Excellent! I eagerly await your findings. Science thanks you!',
      nextNodeId: null,
    },
    {
      id: 'trade_specimens',
      speaker: 'Dr. Helena Santos',
      portrait: 'npc_botanist',
      text: 'Thank you for contributing to science!',
      nextNodeId: null,
    },
  ],
}

export const riverPirateDialogue: DialogueTree = {
  id: 'river_pirate',
  name: 'River Pirate - Dangerous Encounter',
  startNodeId: 'ambush',
  nodes: [
    {
      id: 'ambush',
      speaker: 'River Pirate Captain',
      portrait: 'npc_pirate',
      text: "Well, well, what do we have here? A lone traveler with a canoe full of goods! Hand over your valuables, and maybe we'll let you pass unharmed.",
      choices: [
        {
          id: 'fight',
          text: 'I will not give you anything! Come and take it!',
          nextNodeId: 'choose_fight',
        },
        {
          id: 'negotiate',
          text: 'Perhaps we can come to an arrangement?',
          nextNodeId: 'negotiation',
        },
        {
          id: 'flee',
          text: 'Take what you want, just let me go!',
          nextNodeId: 'surrender',
        },
      ],
    },
    {
      id: 'choose_fight',
      speaker: 'River Pirate Captain',
      portrait: 'npc_pirate',
      text: 'Brave but foolish! My crew will enjoy this.',
      nextNodeId: null,
      effect: {
        type: 'change_health',
        payload: { amount: -30 },
      },
    },
    {
      id: 'negotiation',
      speaker: 'River Pirate Captain',
      portrait: 'npc_pirate',
      text: "A smart one, eh? Alright, give me 50 gold and some of your rations, and we part as... let's say, reluctant acquaintances.",
      choices: [
        {
          id: 'accept_deal',
          text: 'Fine. Here is your payment.',
          nextNodeId: 'deal_accepted',
        },
        {
          id: 'reject_deal',
          text: 'That is too much! I refuse!',
          nextNodeId: 'choose_fight',
        },
      ],
    },
    {
      id: 'deal_accepted',
      speaker: 'River Pirate Captain',
      portrait: 'npc_pirate',
      text: 'Pleasure doing business! Safe travels, friend. And if you see any authorities... you never saw us.',
      nextNodeId: null,
      effect: {
        type: 'change_rations',
        payload: { amount: -20 },
      },
    },
    {
      id: 'surrender',
      speaker: 'River Pirate Captain',
      portrait: 'npc_pirate',
      text: "Smart choice! We'll take your rations and some supplies. Consider it a toll for using our river!",
      nextNodeId: null,
      effect: {
        type: 'change_rations',
        payload: { amount: -30 },
      },
    },
  ],
}

export const missionaryDialogue: DialogueTree = {
  id: 'missionary_shelter',
  name: 'Missionary - Shelter and Faith',
  startNodeId: 'warm_greeting',
  nodes: [
    {
      id: 'warm_greeting',
      speaker: 'Father Miguel',
      portrait: 'npc_missionary',
      text: 'Welcome, child! Our mission provides shelter to all travelers on this great river. You look weary from your journey. Will you rest here and share a meal with us?',
      choices: [
        {
          id: 'accept_shelter',
          text: 'Thank you, Father. I could use the rest.',
          nextNodeId: 'provide_shelter',
        },
        {
          id: 'ask_mission',
          text: 'What is your mission here in the Amazon?',
          nextNodeId: 'explain_mission',
        },
        {
          id: 'decline_politely',
          text: 'I appreciate the offer, but I must continue my journey.',
          nextNodeId: 'blessing',
        },
      ],
    },
    {
      id: 'provide_shelter',
      speaker: 'Father Miguel',
      portrait: 'npc_missionary',
      text: 'Wonderful! Come, we have simple food, but it is wholesome. Rest here tonight, and tomorrow you will feel renewed.',
      nextNodeId: 'mission_work',
      effect: {
        type: 'change_health',
        payload: { amount: 40 },
      },
    },
    {
      id: 'explain_mission',
      speaker: 'Father Miguel',
      portrait: 'npc_missionary',
      text: 'We are here to provide education and medical care to the indigenous peoples. We also offer refuge to travelers like yourself. The Amazon can be harsh, but faith and compassion make it more bearable.',
      nextNodeId: 'mission_work',
    },
    {
      id: 'mission_work',
      speaker: 'Father Miguel',
      portrait: 'npc_missionary',
      text: 'We are building a school for the local children. If you have any spare supplies or tools, they would be greatly appreciated.',
      choices: [
        {
          id: 'donate',
          text: 'I can spare some supplies for your cause.',
          nextNodeId: 'grateful_thanks',
        },
        {
          id: 'cannot_help',
          text: 'I wish I could help, but I need all my supplies.',
          nextNodeId: 'understanding',
        },
      ],
    },
    {
      id: 'grateful_thanks',
      speaker: 'Father Miguel',
      portrait: 'npc_missionary',
      text: 'Bless you! Your generosity will help many children learn to read and write. May God protect you on your journey.',
      nextNodeId: null,
      effect: {
        type: 'GIVE_ITEM',
        itemId: 'blessing_amulet',
        quantity: 1,
      },
    },
    {
      id: 'understanding',
      speaker: 'Father Miguel',
      portrait: 'npc_missionary',
      text: 'I understand completely. The river demands much from all who travel it. You are always welcome here.',
      nextNodeId: 'blessing',
    },
    {
      id: 'blessing',
      speaker: 'Father Miguel',
      portrait: 'npc_missionary',
      text: 'May the Lord watch over you, and may you find what you seek on this river. Vaya con Dios.',
      nextNodeId: null,
    },
  ],
}

export const goldProspectorDialogue: DialogueTree = {
  id: 'gold_prospector',
  name: 'Gold Prospector - El Dorado Dreams',
  startNodeId: 'excited_encounter',
  nodes: [
    {
      id: 'excited_encounter',
      speaker: 'Old Prospector',
      portrait: 'npc_prospector',
      text: "You there! Have you seen any signs of gold in these waters? I've been searching for El Dorado for thirty years! It's real, I tell you, REAL!",
      choices: [
        {
          id: 'humor_him',
          text: 'Tell me about El Dorado. What makes you so sure?',
          nextNodeId: 'eldorado_story',
        },
        {
          id: 'practical_advice',
          text: 'Perhaps you should focus on smaller, more realistic finds?',
          nextNodeId: 'stubborn_response',
        },
        {
          id: 'share_map',
          text: 'I have heard legends about a lost city upriver...',
          nextNodeId: 'map_interest',
        },
      ],
    },
    {
      id: 'eldorado_story',
      speaker: 'Old Prospector',
      portrait: 'npc_prospector',
      text: "The indigenous peoples speak of a city where the buildings are covered in gold! The conquistadors searched for it, but they didn't know where to look. I have a map!",
      nextNodeId: 'show_map',
    },
    {
      id: 'stubborn_response',
      speaker: 'Old Prospector',
      portrait: 'npc_prospector',
      text: 'Bah! Small finds are for small minds! I will find the City of Gold, mark my words!',
      nextNodeId: 'offer_trade',
    },
    {
      id: 'map_interest',
      speaker: 'Old Prospector',
      portrait: 'npc_prospector',
      text: "You've heard the legends too! Perhaps you have seen signs I've missed? These old eyes aren't what they used to be.",
      nextNodeId: 'show_map',
    },
    {
      id: 'show_map',
      speaker: 'Old Prospector',
      portrait: 'npc_prospector',
      text: "Look at this! This map shows a tributary that doesn't appear on any modern charts. That's where the city must be! If you find any gold dust or ancient artifacts, bring them to me!",
      nextNodeId: 'offer_trade',
    },
    {
      id: 'offer_trade',
      speaker: 'Old Prospector',
      portrait: 'npc_prospector',
      text: "I'll pay good money for any gold or artifacts you find. And if you help me find El Dorado... we'll split the treasure 50-50!",
      choices: [
        {
          id: 'accept_partnership',
          text: 'Alright, if I find anything, I will bring it to you.',
          nextNodeId: 'partnership_accepted',
        },
        {
          id: 'decline_nicely',
          text: 'I have my own journey to complete. Good luck with your search.',
          nextNodeId: 'disappointed_farewell',
        },
      ],
    },
    {
      id: 'partnership_accepted',
      speaker: 'Old Prospector',
      portrait: 'npc_prospector',
      text: "Excellent! Here, take this gold pan. It might come in handy! We're going to be rich, partner!",
      nextNodeId: null,
      effect: {
        type: 'GIVE_ITEM',
        itemId: 'gold_pan',
        quantity: 1,
      },
    },
    {
      id: 'disappointed_farewell',
      speaker: 'Old Prospector',
      portrait: 'npc_prospector',
      text: "Your loss! When I'm swimming in gold, don't come crying to me!",
      nextNodeId: null,
    },
  ],
}

export const indigenousElderDialogue: DialogueTree = {
  id: 'indigenous_elder',
  name: 'Indigenous Elder - Ancient Wisdom',
  startNodeId: 'observant_greeting',
  nodes: [
    {
      id: 'observant_greeting',
      speaker: 'Village Elder',
      portrait: 'npc_elder',
      text: 'The river has brought you to our village. You are not the first outsider to travel these waters, and you will not be the last. What do you seek in our lands?',
      choices: [
        {
          id: 'respectful_introduction',
          text: 'I am traveling the river to learn about this land and its people.',
          nextNodeId: 'approve_respect',
        },
        {
          id: 'ask_knowledge',
          text: 'I seek knowledge of the forest and its secrets.',
          nextNodeId: 'ancient_knowledge',
        },
        {
          id: 'ask_permission',
          text: 'I wish to pass through peacefully. May I have your blessing?',
          nextNodeId: 'grant_blessing',
        },
      ],
    },
    {
      id: 'approve_respect',
      speaker: 'Village Elder',
      portrait: 'npc_elder',
      text: 'Your respectful words are welcome. Many outsiders come only to take - trees, animals, even our people. But you seem different. You may stay and learn from us.',
      nextNodeId: 'teaching_offer',
    },
    {
      id: 'ancient_knowledge',
      speaker: 'Village Elder',
      portrait: 'npc_elder',
      text: 'The forest has been our home for countless generations. We know which plants heal, which animals warn of danger, and which spirits protect the sacred places.',
      nextNodeId: 'teaching_offer',
    },
    {
      id: 'teaching_offer',
      speaker: 'Village Elder',
      portrait: 'npc_elder',
      text: 'I will teach you about the medicinal plants. The bark of the fever tree, the leaves that stop bleeding, the roots that give strength. This knowledge could save your life.',
      choices: [
        {
          id: 'accept_teachings',
          text: 'I would be honored to learn from you.',
          nextNodeId: 'receive_teachings',
        },
        {
          id: 'offer_trade',
          text: 'In exchange, I can offer supplies from the settlements.',
          nextNodeId: 'mutual_benefit',
        },
      ],
    },
    {
      id: 'receive_teachings',
      speaker: 'Village Elder',
      portrait: 'npc_elder',
      text: 'Good. Knowledge shared is knowledge preserved. Take these medicinal herbs. Use them wisely, and remember where they came from.',
      nextNodeId: null,
      effect: {
        type: 'GIVE_ITEM',
        itemId: 'medicinal_herbs',
        quantity: 5,
      },
    },
    {
      id: 'mutual_benefit',
      speaker: 'Village Elder',
      portrait: 'npc_elder',
      text: 'A fair exchange. We need metal tools and medicine from your world. In return, we offer knowledge that cannot be bought. This is how peace is built.',
      nextNodeId: null,
      effect: {
        type: 'OPEN_TRADE',
        merchantId: 'village_elder',
      },
    },
    {
      id: 'grant_blessing',
      speaker: 'Village Elder',
      portrait: 'npc_elder',
      text: 'The spirits judge the heart, not the words. I see your intentions are good. Travel safely, and may the river guide you to your destination.',
      nextNodeId: null,
      effect: {
        type: 'change_health',
        payload: { amount: 20 },
      },
    },
  ],
}

export const portugueseExplorerDialogue: DialogueTree = {
  id: 'portuguese_explorer',
  name: 'Portuguese Explorer - Lost Navigator',
  startNodeId: 'desperate_hail',
  nodes: [
    {
      id: 'desperate_hail',
      speaker: 'Captain João Silva',
      portrait: 'npc_explorer',
      text: "Thank the heavens! Another soul on this cursed river! I am Captain João Silva, and my expedition is lost. Our maps are useless here - the river changes like a living thing!",
      choices: [
        {
          id: 'offer_help',
          text: 'I can help you navigate. Where are you trying to go?',
          nextNodeId: 'grateful_response',
        },
        {
          id: 'ask_expedition',
          text: 'What is your expedition searching for?',
          nextNodeId: 'explain_mission',
        },
        {
          id: 'warn_dangers',
          text: 'The river ahead is dangerous. You should turn back.',
          nextNodeId: 'stubborn_explorer',
        },
      ],
    },
    {
      id: 'grateful_response',
      speaker: 'Captain João Silva',
      portrait: 'npc_explorer',
      text: 'You are a lifesaver! We are trying to reach Manaus. My crew is sick with fever, and we desperately need medicine and fresh supplies.',
      nextNodeId: 'navigation_help',
    },
    {
      id: 'explain_mission',
      speaker: 'Captain João Silva',
      portrait: 'npc_explorer',
      text: "We are mapping the Amazon for the Portuguese Crown. But this river is more complex than anything in Europe! Tributaries that appear and disappear, islands that move... it's maddening!",
      nextNodeId: 'navigation_help',
    },
    {
      id: 'stubborn_explorer',
      speaker: 'Captain João Silva',
      portrait: 'npc_explorer',
      text: "Turn back? Never! The Crown expects results, and I will not return to Lisbon empty-handed! But... I could use some advice on surviving this damned river.",
      nextNodeId: 'navigation_help',
    },
    {
      id: 'navigation_help',
      speaker: 'Captain João Silva',
      portrait: 'npc_explorer',
      text: 'If you can guide us to the next settlement, I will pay you handsomely. I also have European goods that might interest you - wine, tools, ammunition.',
      choices: [
        {
          id: 'accept_guide',
          text: 'I will guide you to Manaus. Follow my canoe.',
          nextNodeId: 'guide_accepted',
        },
        {
          id: 'give_map',
          text: 'I can give you directions, but I cannot guide you personally.',
          nextNodeId: 'directions_given',
        },
        {
          id: 'trade_only',
          text: 'I can trade with you, but I have my own destination.',
          nextNodeId: 'open_trade',
        },
      ],
    },
    {
      id: 'guide_accepted',
      speaker: 'Captain João Silva',
      portrait: 'npc_explorer',
      text: 'Wonderful! My crew will be so relieved! Here, take this Portuguese compass. It is the finest navigation instrument money can buy!',
      nextNodeId: null,
      effect: {
        type: 'GIVE_ITEM',
        itemId: 'portuguese_compass',
        quantity: 1,
      },
    },
    {
      id: 'directions_given',
      speaker: 'Captain João Silva',
      portrait: 'npc_explorer',
      text: 'Your directions are much appreciated. Take these gold coins as payment. And be careful out there - the river shows no mercy to the unprepared.',
      nextNodeId: null,
    },
    {
      id: 'open_trade',
      speaker: 'Captain João Silva',
      portrait: 'npc_explorer',
      text: 'Very well. Let us trade. I have fine European goods that are rare in these parts.',
      nextNodeId: null,
      effect: {
        type: 'OPEN_TRADE',
        merchantId: 'portuguese_captain',
      },
    },
  ],
}

export const wildlifePhotographerDialogue: DialogueTree = {
  id: 'wildlife_photographer',
  name: 'Wildlife Photographer - Nature Documentation',
  startNodeId: 'enthusiastic_greeting',
  nodes: [
    {
      id: 'enthusiastic_greeting',
      speaker: 'Sarah Mitchell',
      portrait: 'npc_photographer',
      text: "Oh wow, another river traveler! I'm Sarah Mitchell, wildlife photographer. This place is absolutely incredible! Have you seen the pink dolphins? The jaguars? I'm trying to document everything!",
      choices: [
        {
          id: 'share_sightings',
          text: 'I have seen some amazing wildlife on my journey.',
          nextNodeId: 'excited_response',
        },
        {
          id: 'offer_help',
          text: 'What kind of animals are you looking for?',
          nextNodeId: 'species_list',
        },
        {
          id: 'ask_photos',
          text: 'Can I see some of your photographs?',
          nextNodeId: 'show_portfolio',
        },
      ],
    },
    {
      id: 'excited_response',
      speaker: 'Sarah Mitchell',
      portrait: 'npc_photographer',
      text: "That's fantastic! Could you tell me where you spotted them? I'm creating a comprehensive guide to Amazon wildlife, and local knowledge is invaluable!",
      nextNodeId: 'species_list',
    },
    {
      id: 'species_list',
      speaker: 'Sarah Mitchell',
      portrait: 'npc_photographer',
      text: "I'm particularly interested in the scarlet macaw, the giant river otter, the black caiman, and of course, the elusive jaguar. If you can help me find any of these, I'll pay you for your time!",
      choices: [
        {
          id: 'accept_photo_quest',
          text: 'I can help you find these animals.',
          nextNodeId: 'photo_quest_start',
        },
        {
          id: 'trade_photos',
          text: 'I have some specimens that might interest you.',
          nextNodeId: 'specimen_trade',
        },
        {
          id: 'just_curious',
          text: 'I am just curious about your work. Good luck finding them!',
          nextNodeId: 'farewell_excited',
        },
      ],
    },
    {
      id: 'show_portfolio',
      speaker: 'Sarah Mitchell',
      portrait: 'npc_photographer',
      text: "Sure! Look at this jaguar I photographed last week - isn't it magnificent? And this macaw pair - they mate for life, you know. Nature is incredible!",
      nextNodeId: 'species_list',
    },
    {
      id: 'photo_quest_start',
      speaker: 'Sarah Mitchell',
      portrait: 'npc_photographer',
      text: "Excellent! When you spot any of these species, make a note of the location. Bring me proof - a photo, a feather, anything - and I'll reward you! Here, take this camera!",
      nextNodeId: null,
      effect: {
        type: 'START_QUEST',
        questId: 'wildlife_photography_quest',
      },
    },
    {
      id: 'specimen_trade',
      speaker: 'Sarah Mitchell',
      portrait: 'npc_photographer',
      text: "Really? Let me see! I'll pay top dollar for rare specimens or clear photographs. Everything helps with the research!",
      nextNodeId: null,
      effect: {
        type: 'OPEN_TRADE',
        merchantId: 'wildlife_photographer',
      },
    },
    {
      id: 'farewell_excited',
      speaker: 'Sarah Mitchell',
      portrait: 'npc_photographer',
      text: "Thanks! If you see anything amazing out there, remember to photograph it! Nature's beauty should be shared with the world!",
      nextNodeId: null,
    },
  ],
}

// Export all dialogues
export const allDialogues = [
  elderlyGuideDialogue,
  merchantDialogue,
  shamanDialogue,
  rubberBaronDialogue,
  indigenousHunterDialogue,
  botanistDialogue,
  riverPirateDialogue,
  missionaryDialogue,
  goldProspectorDialogue,
  indigenousElderDialogue,
  portugueseExplorerDialogue,
  wildlifePhotographerDialogue,
]
