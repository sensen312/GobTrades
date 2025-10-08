// src/constants/tags.ts
export interface TagOption {
  label: string;
  value: string;
}

// Example tags, Master Lith, you can expand or refine this list.
// These tags are used in StyledMultiSelect components for stall setup.
export const ITEM_TAGS: TagOption[] = [
  { label: 'Shiny Bits', value: 'shiny_bits' },
  { label: 'Old Junk', value: 'old_junk' },
  { label: 'Magic Trinkets', value: 'magic_trinkets' },
  { label: 'Handmade Goods', value: 'handmade_goods' },
  { label: 'Mysterious Oddities', value: 'mysterious_oddities' },
  { label: 'Rusty Relics', value: 'rusty_relics' },
  { label: 'Sparkly Stones', value: 'sparkly_stones' },
  { label: 'Forgotten Lore', value: 'forgotten_lore' },
  { label: 'Goblin Gear', value: 'goblin_gear' },
  { label: 'Questionable Concoctions', value: 'questionable_concoctions' },
  { label: 'Lost Socks', value: 'lost_socks' },
  { label: 'Dubious Foodstuffs', value: 'dubious_foodstuffs' },
];

// For Phase 1, "Wants Tags" can use the same list as "Item Tags".
// This can be customized later if needed.
export const WANTS_TAGS: TagOption[] = [...ITEM_TAGS];
