/**
 * foods.js — Static food database
 *
 * Each entry follows the schema:
 *   { id, name, cat, unit, default, per100: { cal, carb, prot, fat } }
 *
 * 'cat' values: meat | grains | dairy | vegetables | fruits |
 *               drinks | snacks | meals | other
 */

'use strict';

export const BASE_FOODS = [
  { id:  1, name: 'Smoked egg',           cat: 'meat',       unit: 'g', default:  60, per100: { cal: 155, carb: 1.1, prot: 13,  fat: 11  } },
  { id:  2, name: 'Chicken breast',       cat: 'meat',       unit: 'g', default: 100, per100: { cal: 165, carb: 0,   prot: 31,  fat: 3.6 } },
  { id:  3, name: 'Brown rice',           cat: 'grains',     unit: 'g', default: 150, per100: { cal: 112, carb: 23,  prot: 2.6, fat: 0.9 } },
  { id:  4, name: 'White rice',           cat: 'grains',     unit: 'g', default: 150, per100: { cal: 130, carb: 28,  prot: 2.7, fat: 0.3 } },
  { id:  5, name: 'Sweet potato',         cat: 'grains',     unit: 'g', default: 120, per100: { cal:  86, carb: 20,  prot: 1.6, fat: 0.1 } },
  { id:  6, name: 'Oats',                 cat: 'grains',     unit: 'g', default:  80, per100: { cal: 379, carb: 67,  prot: 13,  fat: 7   } },
  { id:  7, name: 'Broccoli',             cat: 'vegetables', unit: 'g', default: 100, per100: { cal:  34, carb: 7,   prot: 2.8, fat: 0.4 } },
  { id:  8, name: 'Spinach',              cat: 'vegetables', unit: 'g', default:  80, per100: { cal:  23, carb: 3.6, prot: 2.9, fat: 0.4 } },
  { id:  9, name: 'Greek yogurt',         cat: 'dairy',      unit: 'g', default: 200, per100: { cal:  97, carb: 3.6, prot: 10,  fat: 5   } },
  { id: 10, name: 'Milk (whole)',          cat: 'dairy',      unit: 'g', default: 200, per100: { cal:  61, carb: 4.8, prot: 3.2, fat: 3.3 } },
  { id: 11, name: 'Salmon steak',         cat: 'meat',       unit: 'g', default: 130, per100: { cal: 208, carb: 0,   prot: 20,  fat: 13  } },
  { id: 12, name: 'Tuna (canned)',        cat: 'meat',       unit: 'g', default:  85, per100: { cal: 116, carb: 0,   prot: 26,  fat: 1   } },
  { id: 13, name: 'Avocado',              cat: 'fruits',     unit: 'g', default:  80, per100: { cal: 160, carb: 9,   prot: 2,   fat: 15  } },
  { id: 14, name: 'Olive oil',            cat: 'other',      unit: 'g', default:  15, per100: { cal: 884, carb: 0,   prot: 0,   fat: 100 } },
  { id: 15, name: 'Almonds',              cat: 'snacks',     unit: 'g', default:  30, per100: { cal: 579, carb: 22,  prot: 21,  fat: 50  } },
  { id: 16, name: 'Banana',               cat: 'fruits',     unit: 'g', default: 120, per100: { cal:  89, carb: 23,  prot: 1.1, fat: 0.3 } },
  { id: 17, name: 'Apple',                cat: 'fruits',     unit: 'g', default: 150, per100: { cal:  52, carb: 14,  prot: 0.3, fat: 0.2 } },
  { id: 18, name: 'Beef (lean)',          cat: 'meat',       unit: 'g', default: 100, per100: { cal: 250, carb: 0,   prot: 26,  fat: 15  } },
  { id: 19, name: 'Tofu',                 cat: 'meat',       unit: 'g', default: 150, per100: { cal:  76, carb: 1.9, prot: 8,   fat: 4.8 } },
  { id: 20, name: 'Whole wheat bread',    cat: 'grains',     unit: 'g', default:  60, per100: { cal: 247, carb: 41,  prot: 13,  fat: 3.4 } },
  { id: 21, name: 'Egg white',            cat: 'dairy',      unit: 'g', default: 100, per100: { cal:  52, carb: 0.7, prot: 11,  fat: 0.2 } },
  { id: 22, name: 'Wholemeal bread',      cat: 'grains',     unit: 'g', default:  70, per100: { cal: 229, carb: 39,  prot: 9,   fat: 3   } },
  { id: 23, name: 'Brie cheese',          cat: 'dairy',      unit: 'g', default:  40, per100: { cal: 334, carb: 0.5, prot: 20,  fat: 28  } },
  { id: 24, name: 'Cucumber',             cat: 'vegetables', unit: 'g', default: 100, per100: { cal:  15, carb: 3.6, prot: 0.7, fat: 0.1 } },
  { id: 25, name: 'Tomato shrimp pasta', cat: 'meals',      unit: 'g', default: 300, per100: { cal: 118, carb: 16,  prot: 7,   fat: 2.8 } },
  { id: 26, name: 'Witch soup',           cat: 'meals',      unit: 'g', default: 300, per100: { cal:  45, carb: 5,   prot: 3,   fat: 1.5 } },
  { id: 27, name: 'Pork (lean)',          cat: 'meat',       unit: 'g', default: 100, per100: { cal: 242, carb: 0,   prot: 27,  fat: 14  } },
  { id: 28, name: 'Shrimp',               cat: 'meat',       unit: 'g', default: 100, per100: { cal:  99, carb: 0.9, prot: 24,  fat: 0.3 } },
  { id: 29, name: 'Tomato',               cat: 'vegetables', unit: 'g', default: 120, per100: { cal:  18, carb: 3.9, prot: 0.9, fat: 0.2 } },
  { id: 30, name: 'Lentils',              cat: 'grains',     unit: 'g', default: 150, per100: { cal: 116, carb: 20,  prot: 9,   fat: 0.4 } },
  { id: 31, name: 'Quinoa',               cat: 'grains',     unit: 'g', default: 150, per100: { cal: 120, carb: 21,  prot: 4.4, fat: 1.9 } },
  { id: 32, name: 'Cottage cheese',       cat: 'dairy',      unit: 'g', default: 150, per100: { cal:  98, carb: 3.4, prot: 11,  fat: 4.3 } },
  { id: 33, name: 'Cheddar cheese',       cat: 'dairy',      unit: 'g', default:  30, per100: { cal: 403, carb: 1.3, prot: 25,  fat: 33  } },
  { id: 34, name: 'Blueberries',          cat: 'fruits',     unit: 'g', default: 100, per100: { cal:  57, carb: 14,  prot: 0.7, fat: 0.3 } },
  { id: 35, name: 'Strawberries',         cat: 'fruits',     unit: 'g', default: 100, per100: { cal:  32, carb: 7.7, prot: 0.7, fat: 0.3 } },
  { id: 36, name: 'Orange',               cat: 'fruits',     unit: 'g', default: 130, per100: { cal:  47, carb: 12,  prot: 0.9, fat: 0.1 } },
  { id: 37, name: 'Walnuts',              cat: 'snacks',     unit: 'g', default:  30, per100: { cal: 654, carb: 14,  prot: 15,  fat: 65  } },
  { id: 38, name: 'Peanut butter',        cat: 'snacks',     unit: 'g', default:  30, per100: { cal: 588, carb: 20,  prot: 25,  fat: 50  } },
  { id: 39, name: 'Whole egg',            cat: 'dairy',      unit: 'g', default:  60, per100: { cal: 143, carb: 1.1, prot: 13,  fat: 10  } },
  { id: 40, name: 'Turkey breast',        cat: 'meat',       unit: 'g', default: 100, per100: { cal: 157, carb: 0,   prot: 30,  fat: 3.2 } },
  { id: 41, name: 'Cod fillet',           cat: 'meat',       unit: 'g', default: 120, per100: { cal:  82, carb: 0,   prot: 18,  fat: 0.7 } },
  { id: 42, name: 'Sardines (canned)',    cat: 'meat',       unit: 'g', default:  85, per100: { cal: 208, carb: 0,   prot: 25,  fat: 11  } },
  { id: 43, name: 'Edamame',              cat: 'vegetables', unit: 'g', default: 100, per100: { cal: 121, carb: 8.9, prot: 11,  fat: 5.2 } },
  { id: 44, name: 'Chickpeas',            cat: 'grains',     unit: 'g', default: 150, per100: { cal: 164, carb: 27,  prot: 8.9, fat: 2.6 } },
  { id: 45, name: 'Black beans',          cat: 'grains',     unit: 'g', default: 150, per100: { cal: 132, carb: 24,  prot: 8.9, fat: 0.5 } },
  { id: 46, name: 'Pasta (cooked)',       cat: 'grains',     unit: 'g', default: 180, per100: { cal: 131, carb: 25,  prot: 5,   fat: 1.1 } },
  { id: 47, name: 'Cauliflower',          cat: 'vegetables', unit: 'g', default: 100, per100: { cal:  25, carb: 5,   prot: 1.9, fat: 0.3 } },
  { id: 48, name: 'Bell pepper',          cat: 'vegetables', unit: 'g', default: 100, per100: { cal:  31, carb: 6,   prot: 1,   fat: 0.3 } },
  { id: 49, name: 'Zucchini',             cat: 'vegetables', unit: 'g', default: 150, per100: { cal:  17, carb: 3.1, prot: 1.2, fat: 0.3 } },
  { id: 50, name: 'Carrot',               cat: 'vegetables', unit: 'g', default: 100, per100: { cal:  41, carb: 10,  prot: 0.9, fat: 0.2 } },
  { id: 51, name: 'Mushrooms',            cat: 'vegetables', unit: 'g', default: 100, per100: { cal:  22, carb: 3.3, prot: 3.1, fat: 0.3 } },
  { id: 52, name: 'Bibimbap',             cat: 'meals',      unit: 'g', default: 350, per100: { cal: 130, carb: 18,  prot: 7,   fat: 3.5 } },
  { id: 53, name: 'Kimchi jjigae',        cat: 'meals',      unit: 'g', default: 300, per100: { cal:  60, carb: 5,   prot: 4,   fat: 2.5 } },
  { id: 54, name: 'Doenjang jjigae',      cat: 'meals',      unit: 'g', default: 300, per100: { cal:  55, carb: 4,   prot: 5,   fat: 2   } },
  { id: 55, name: 'Grilled mackerel',     cat: 'meat',       unit: 'g', default: 120, per100: { cal: 205, carb: 0,   prot: 19,  fat: 14  } },
  { id: 56, name: 'Protein shake',        cat: 'drinks',     unit: 'g', default: 300, per100: { cal:  40, carb: 3,   prot: 6,   fat: 0.5 } },
  { id: 57, name: 'Orange juice',         cat: 'drinks',     unit: 'g', default: 200, per100: { cal:  45, carb: 10,  prot: 0.7, fat: 0.2 } },
  { id: 58, name: 'Coffee (black)',       cat: 'drinks',     unit: 'g', default: 200, per100: { cal:   2, carb: 0,   prot: 0.3, fat: 0   } },
  { id: 59, name: 'Black rice',           cat: 'grains',     unit: 'g', default: 150, per100: { cal: 121, carb: 26,  prot: 2.8, fat: 0.9 } },
  { id: 60, name: 'Cherry tomatoes',      cat: 'vegetables', unit: 'g', default: 100, per100: { cal:  18, carb: 3.9, prot: 0.9, fat: 0.2 } },
  { id: 61, name: 'Kimchi',               cat: 'vegetables', unit: 'g', default:  80, per100: { cal:  15, carb: 2.4, prot: 1.1, fat: 0.5 } },
  { id: 62, name: 'Mozzarella',           cat: 'dairy',      unit: 'g', default:  50, per100: { cal: 280, carb: 2.2, prot: 28,  fat: 17  } },
  { id: 63, name: 'Tangerine',            cat: 'fruits',     unit: 'g', default: 100, per100: { cal:  47, carb: 12,  prot: 0.7, fat: 0.2 } },
  { id: 64, name: 'Butter',               cat: 'other',      unit: 'g', default:  10, per100: { cal: 717, carb: 0.1, prot: 0.9, fat: 81  } },
  { id: 65, name: 'Fried rice (mixed)',   cat: 'meals',      unit: 'g', default: 250, per100: { cal: 163, carb: 22,  prot: 5,   fat: 6   } },
];

/**
 * Keyword → category mapping for auto-detection.
 * Order matters: first match wins.
 */
export const CATEGORY_RULES = [
  { cat: 'meat',       words: ['chicken','beef','pork','fish','salmon','tuna','shrimp','turkey','mackerel','cod','sardine','lamb','steak','ham','bacon','sausage','galbi','bulgogi','samgyeopsal','dakgalbi','gopchang','chadolbaegi'] },
  { cat: 'grains',     words: ['rice','bread','pasta','noodle','oat','wheat','flour','quinoa','corn','potato','sweet potato','tortilla','cereal','porridge','tteok','juk','bibimbap','kimbap','onigiri','bagel','ramen','udon','soba'] },
  { cat: 'dairy',      words: ['milk','cheese','yogurt','butter','cream','egg','whey','kefir','mozzarella','cheddar','brie','cottage','ricotta'] },
  { cat: 'vegetables', words: ['broccoli','spinach','kale','lettuce','cabbage','carrot','tomato','cucumber','onion','garlic','pepper','mushroom','zucchini','eggplant','cauliflower','kimchi','seaweed','tofu','edamame','namul'] },
  { cat: 'fruits',     words: ['apple','banana','orange','grape','strawberry','blueberry','mango','pineapple','watermelon','melon','kiwi','peach','cherry','lemon','lime','avocado','coconut','tangerine','persimmon','pomegranate'] },
  { cat: 'drinks',     words: ['juice','coffee','tea','water','shake','smoothie','soda','cola','beer','wine','latte','americano','matcha','kombucha','sikhye','barley tea','banana milk'] },
  { cat: 'snacks',     words: ['cookie','chip','crisp','candy','chocolate','cake','brownie','muffin','donut','wafer','popcorn','granola','biscuit','jelly','gummy','ice cream','pepero','choco','haitai','oreo','pringles','pocky','nakki'] },
  { cat: 'meals',      words: ['soup','stew','curry','salad','sandwich','burger','pizza','sushi','jjigae','guk','tang','bokkeum','gui','jeon','naengmyeon','gimbap','dosirak','fried','roasted','grilled','baked','steamed','mixed'] },
];

/**
 * Detect a category from a food name using keyword rules.
 * @param {string} name
 * @returns {string} category key, defaulting to 'other'
 */
export function detectCategory(name) {
  if (!name) return 'other';
  const lower = name.toLowerCase();
  for (const rule of CATEGORY_RULES) {
    if (rule.words.some(w => lower.includes(w))) return rule.cat;
  }
  return 'other';
}

/** Human-readable labels for category keys. */
export const CATEGORY_LABELS = {
  meat:       'Meat & Fish',
  grains:     'Grains & Carbs',
  dairy:      'Eggs & Dairy',
  vegetables: 'Vegetables',
  fruits:     'Fruits',
  drinks:     'Drinks',
  snacks:     'Snacks',
  meals:      'Meals & Dishes',
  other:      'Other',
};

/** Chart / analysis colours for each category. */
export const CATEGORY_COLORS = {
  meat:       '#ef4444',
  grains:     '#3b82f6',
  dairy:      '#f59e0b',
  vegetables: '#22c55e',
  fruits:     '#f97316',
  drinks:     '#06b6d4',
  snacks:     '#8b5cf6',
  meals:      '#6366f1',
  other:      '#9ca3af',
};
