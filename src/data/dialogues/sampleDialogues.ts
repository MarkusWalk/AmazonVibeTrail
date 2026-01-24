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

// Export all dialogues
export const allDialogues = [
  elderlyGuideDialogue,
  merchantDialogue,
  shamanDialogue,
  rubberBaronDialogue,
  indigenousHunterDialogue,
  botanistDialogue,
]
