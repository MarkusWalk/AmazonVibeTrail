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

// Export all dialogues
export const allDialogues = [
  elderlyGuideDialogue,
  merchantDialogue,
  shamanDialogue,
]
