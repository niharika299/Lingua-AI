// Core Speech Therapy Datasets for Kids Tier (5-11 Years)
// 5 to 6 rounds for every clinical module

export const KIDS_VOCAB_QUESTIONS = [
  {
    id: 1,
    prompt: 'Ek aisa animal jo bohot slow chalta hai aur uske peeth par hard shell hota hai, uska naam kya hai?',
    clue: 'Clue: Ye paani aur zameen dono par reh sakta hai aur dhere-dhere chalta hai! 🐢',
    options: [
      { id: 'tortoise', name: '🐢 Kachua (Tortoise)', isCorrect: true },
      { id: 'rabbit', name: '🐇 Khargosh (Rabbit)', isCorrect: false },
      { id: 'elephant', name: '🐘 Hathi (Elephant)', isCorrect: false },
      { id: 'snail', name: '🐌 Ghongha (Snail)', isCorrect: false },
    ],
    explanation: 'Sahi jawab! Kachua / Tortoise! Specific naam lene se vocabulary strong hoti hai.',
  },
  {
    id: 2,
    prompt: 'Ek aisa tool jisse hum paper par likhte hain aur galat hone par eraser se mita sakte hain?',
    clue: 'Clue: Ye wood ki bani hoti hai aur isme graphite ki lead hoti hai! ✏️',
    options: [
      { id: 'pencil', name: '✏️ Pencil', isCorrect: true },
      { id: 'pen', name: '🖊️ Ball Pen', isCorrect: false },
      { id: 'book', name: '📖 Book', isCorrect: false },
      { id: 'ruler', name: '📏 Scale', isCorrect: false },
    ],
    explanation: 'Sahi jawab! Pencil! "Wo cheez" kehne ki jagah specific object ka naam liya!',
  },
  {
    id: 3,
    prompt: 'Ek aisa item jo baarish (rain) aane par hum apne sar ke upar kholte hain taaki bheegein nahi?',
    clue: 'Clue: Ye umbrella cloth ki hoti hai aur handle hota hai! ☔',
    options: [
      { id: 'umbrella', name: '☔ Chhatri (Umbrella)', isCorrect: true },
      { id: 'raincoat', name: '🧥 Raincoat', isCorrect: false },
      { id: 'towel', name: '🧼 Towel', isCorrect: false },
      { id: 'hat', name: '🧢 Cap', isCorrect: false },
    ],
    explanation: 'Shabaash! Chhatri / Umbrella! Exact naming practice!',
  },
  {
    id: 4,
    prompt: 'Ek aisa round device jo deewar (wall) par laga hota hai aur humein time (samay) batata hai?',
    clue: 'Clue: Isme 1 se 12 tak numbers aur do sui (hands) hote hain! ⏰',
    options: [
      { id: 'clock', name: '⏰ Ghadi (Clock)', isCorrect: true },
      { id: 'mirror', name: '🪞 Mirror', isCorrect: false },
      { id: 'picture', name: '🖼️ Photo Frame', isCorrect: false },
      { id: 'calendar', name: '📅 Calendar', isCorrect: false },
    ],
    explanation: 'Bilkul sahi! Ghadi / Clock!',
  },
  {
    id: 5,
    prompt: 'Ek aisa wild animal jo Australia mein milta hai aur jump karke chalta hai aur uske pet mein pouch hota hai?',
    clue: 'Clue: Apne baby ko pouch mein baitha kar jump karta hai! 🦘',
    options: [
      { id: 'kangaroo', name: '🦘 Kangaroo', isCorrect: true },
      { id: 'monkey', name: '🐒 Bandar (Monkey)', isCorrect: false },
      { id: 'deer', name: '🦌 Hiran (Deer)', isCorrect: false },
      { id: 'bear', name: '🐻 Bhalu (Bear)', isCorrect: false },
    ],
    explanation: 'Bahut badiya! Kangaroo!',
  },
  {
    id: 6,
    prompt: 'Ek aisa 2-wheeled vehicle jisme pedal marne se chain ghoomti hai aur wheels chalte hain?',
    clue: 'Clue: Isme koi engine nahi hota, pairon se pedal chalana padta hai! 🚲',
    options: [
      { id: 'bicycle', name: '🚲 Bicycle (Cycle)', isCorrect: true },
      { id: 'scooter', name: '🛵 Scooter', isCorrect: false },
      { id: 'car', name: '🚗 Car', isCorrect: false },
      { id: 'train', name: '🚆 Train', isCorrect: false },
    ],
    explanation: 'Awesome! Bicycle / Cycle!',
  },
];

export const KIDS_COMPREHENSION_TASKS = [
  {
    id: 1,
    title: 'Task 1: Bedroom Cleanup Routine',
    instruction: 'Aapko ye 3 steps ek-ek karke sequence me poore karne hain:',
    steps: [
      { id: 1, text: 'Step 1: Put the blue bottle on the table 🧴', detail: 'Blue bottle uthayein aur table par rakhein.' },
      { id: 2, text: 'Step 2: Open the cupboard to find the book 📖', detail: 'Almari kholein aur storybook nikalein.' },
      { id: 3, text: 'Step 3: Come back and jump 3 times! 🏃', detail: 'Waapas aayein aur khushi se 3 baar jump karein!' },
    ],
  },
  {
    id: 2,
    title: 'Task 2: School Bag Preparation',
    instruction: 'Follow these 3 sequence steps for school prep:',
    steps: [
      { id: 1, text: 'Step 1: Put the pencil box in the bag ✏️', detail: 'Pencil box uthakar school bag mein rakhein.' },
      { id: 2, text: 'Step 2: Zip the front pocket carefully 🎒', detail: 'Bag ki front zipper band karein.' },
      { id: 3, text: 'Step 3: Put on your shoes and wave bye 👋', detail: 'Shoes pehnein aur smile karke bye kahein!' },
    ],
  },
  {
    id: 3,
    title: 'Task 3: Kitchen Helper Task',
    instruction: 'Execute these 3 steps in order:',
    steps: [
      { id: 1, text: 'Step 1: Wash your hands with soap 🧼', detail: 'Basin par jaakar 20 seconds handwash karein.' },
      { id: 2, text: 'Step 2: Pick up the green apple from basket 🍎', detail: 'Fruit basket se green apple uthayein.' },
      { id: 3, text: 'Step 3: Place it gently on the dining plate 🍽️', detail: 'Plate par apple rakhein.' },
    ],
  },
  {
    id: 4,
    title: 'Task 4: Art & Craft Activity',
    instruction: 'Follow the 3 sequential instructions:',
    steps: [
      { id: 1, text: 'Step 1: Draw a big yellow circle on paper 🟡', detail: 'Crayon se yellow circle banayein.' },
      { id: 2, text: 'Step 2: Draw 8 sun rays around the circle ☀️', detail: 'Sun rays ki lines kheenchein.' },
      { id: 3, text: 'Step 3: Write your name at the bottom ✍️', detail: 'Page ke neeche apna naam likhein.' },
    ],
  },
  {
    id: 5,
    title: 'Task 5: Bedtime Preparation',
    instruction: 'Complete the bedtime routine sequence:',
    steps: [
      { id: 1, text: 'Step 1: Brush your teeth thoroughly 🪥', detail: 'Bathroom mein brush and toothpaste use karein.' },
      { id: 2, text: 'Step 2: Turn off the main ceiling light 💡', detail: 'Light switch off karein.' },
      { id: 3, text: 'Step 3: Hop under the blanket and say Goodnight 🌙', detail: 'Bed par jakar blanket pehnein.' },
    ],
  },
];

export const KIDS_GRAMMAR_ROUNDS = [
  {
    id: 1,
    brokenSentence: 'Wo park gaya',
    targetSentence: ['Wo', 'kal', 'park', 'gaya', 'tha', 'aur', 'usne', 'wahan', 'football', 'kheli', 'thi'],
    tiles: ['kheli', 'kal', 'gaya', 'park', 'Wo', 'tha', 'football', 'aur', 'wahan', 'usne', 'thi'],
    explanation: 'Correct past tense: Wo kal park gaya tha aur usne wahan football kheli thi.',
  },
  {
    id: 2,
    brokenSentence: 'Khushi khana khaya',
    targetSentence: ['Khushi', 'ne', 'kal', 'raat', 'swadisht', 'khana', 'khaya', 'tha'],
    tiles: ['raat', 'khana', 'ne', 'khaya', 'Khushi', 'swadisht', 'kal', 'tha'],
    explanation: 'Correct past tense: Khushi ne kal raat swadisht khana khaya tha.',
  },
  {
    id: 3,
    brokenSentence: 'Hum market gaya',
    targetSentence: ['Hum', 'kal', 'shaam', 'ko', 'bazaar', 'gaye', 'the'],
    tiles: ['bazaar', 'kal', 'Hum', 'gaye', 'shaam', 'the', 'ko'],
    explanation: 'Correct past tense: Hum kal shaam ko bazaar gaye the.',
  },
  {
    id: 4,
    brokenSentence: 'Rohan book padha',
    targetSentence: ['Rohan', 'ne', 'kal', 'ek', 'rochak', 'kahani', 'padhi', 'thi'],
    tiles: ['kahani', 'Rohan', 'padhi', 'kal', 'ne', 'rochak', 'thi', 'ek'],
    explanation: 'Correct past tense: Rohan ne kal ek rochak kahani padhi thi.',
  },
  {
    id: 5,
    brokenSentence: 'Bache khela',
    targetSentence: ['Bache', 'kal', 'maidan', 'mein', 'khel', 'rahe', 'the'],
    tiles: ['khel', 'Bache', 'maidan', 'kal', 'the', 'mein', 'rahe'],
    explanation: 'Correct continuous past tense: Bache kal maidan mein khel rahe the.',
  },
];

export const KIDS_SOCIAL_SCENARIOS = [
  {
    id: 1,
    scenario: 'Apne dost se khiloona (toy) maangna hai. Bina chhinne ya chillaaye sahi tarika kya hai?',
    options: [
      { id: 1, text: 'Pyaar se maangna: "Kya main thodi der ke liye ye khiloona le sakta hoon?"', isBest: true },
      { id: 2, text: '"Mujhe abhi ye toy do, warna main gussa ho jaunga!"', isBest: false },
      { id: 3, text: 'Chheen kar bhaag jaana', isBest: false },
    ],
    feedback: 'Shabaash! Polite request se friends hamesha khushi se share karte hain.',
  },
  {
    id: 2,
    scenario: 'Playground mein doosre bache game khel rahe hain. Aapko unke saath khelna hai, kya kahein?',
    options: [
      { id: 1, text: '"Kya main bhi aapke saath is game mein shaamil ho sakta hoon?"', isBest: true },
      { id: 2, text: 'Game ke beech mein jaakar ball ko laat marna', isBest: false },
      { id: 3, text: 'Side mein baithkar rona', isBest: false },
    ],
    feedback: 'Excellent! Soft spoken permission poochne se sabhi welcome karte hain.',
  },
  {
    id: 3,
    scenario: 'Classroom mein teacher ki baat samajh nahi aayi. Kya karna chahiye?',
    options: [
      { id: 1, text: 'Haath uthakar politely kehna: "Teacher, kya aap dubara samjha sakti hain?"', isBest: true },
      { id: 2, text: 'Bench par sar rakh kar so jaana', isBest: false },
      { id: 3, text: 'Doosre bache ki notebook chheen lena', isBest: false },
    ],
    feedback: 'Bahut accha! Question poochne se learning easy hoti hai.',
  },
  {
    id: 4,
    scenario: 'Khelte waqt galti se kisi dost se takkar ho gayi. Sahi response kya hai?',
    options: [
      { id: 1, text: 'Turant kehna: "Sorry! Kya aapko chot toh nahi lagi?"', isBest: true },
      { id: 2, text: 'Kehna: "Tumhari galti thi!" aur gussa karna', isBest: false },
      { id: 3, text: 'Wahan se bhaag jana', isBest: false },
    ],
    feedback: 'Wonderful empathy! Care dikhane se dosti aur mazboot hoti hai.',
  },
  {
    id: 5,
    scenario: 'Ghar par koi guest aaye hain. Unhe kaise greet karein?',
    options: [
      { id: 1, text: 'Smile karke kehna: "Namaste! Aap kaise hain?"', isBest: true },
      { id: 2, text: 'Apne room mein jaakar darwaza band kar lena', isBest: false },
      { id: 3, text: 'Unhe bina dekhe TV dekhte rehna', isBest: false },
    ],
    feedback: 'Superb mannerisms! Guests ko respect dena acchi aadat hai.',
  },
];

export const KIDS_PHONOLOGY_WORDS = [
  { word: 'Tamatar 🍅', syllables: 3, chunks: ['Ta', 'ma', 'tar'], audioPrompt: 'Ta - ma - tar (3 claps)' },
  { word: 'Patanga 🪁', syllables: 3, chunks: ['Pa', 'tan', 'ga'], audioPrompt: 'Pa - tan - ga (3 claps)' },
  { word: 'Machhali 🐟', syllables: 3, chunks: ['Ma', 'chha', 'li'], audioPrompt: 'Ma - chha - li (3 claps)' },
  { word: 'Titali 🦋', syllables: 3, chunks: ['Ti', 'ta', 'li'], audioPrompt: 'Ti - ta - li (3 claps)' },
  { word: 'Nariyal 🥥', syllables: 3, chunks: ['Na', 'ri', 'yal'], audioPrompt: 'Na - ri - yal (3 claps)' },
  { word: 'Bulbul 🐦', syllables: 2, chunks: ['Bul', 'bul'], audioPrompt: 'Bul - bul (2 claps)' },
];

export const KIDS_MEMORY_LISTS = [
  { round: 1, items: ['🍎 Apple', '🍌 Banana'], prompt: 'Listen to 2 items: Apple, Banana' },
  { round: 2, items: ['🍎 Apple', '🍌 Banana', '🥛 Milk'], prompt: 'Listen to 3 items: Apple, Banana, Milk' },
  { round: 3, items: ['🍎 Apple', '🍌 Banana', '🥛 Milk', '🍞 Bread'], prompt: 'Listen to 4 items: Apple, Banana, Milk, Bread' },
  { round: 4, items: ['🍎 Apple', '🍌 Banana', '🥛 Milk', '🍞 Bread', '🧀 Cheese'], prompt: 'Listen to 5 items: Apple, Banana, Milk, Bread, Cheese' },
  { round: 5, items: ['🍎 Apple', '🍌 Banana', '🥛 Milk', '🍞 Bread', '🧀 Cheese', '🥚 Eggs'], prompt: 'Listen to 6 items: Apple, Banana, Milk, Bread, Cheese, Eggs' },
];

export const KIDS_NARRATIVE_PUZZLES = [
  {
    id: 1,
    title: 'Puzzle 1: Planting a Flower 🌻',
    cards: [
      { id: 1, order: 1, text: '1. Seed in Soil 🌱', icon: '🌱' },
      { id: 2, order: 2, text: '2. Watering Plant 🚰', icon: '🚰' },
      { id: 3, order: 3, text: '3. Green Sprout 🌿', icon: '🌿' },
      { id: 4, order: 4, text: '4. Blooming Sunflower 🌻', icon: '🌻' },
    ],
  },
  {
    id: 2,
    title: 'Puzzle 2: Baking a Birthday Cake 🎂',
    cards: [
      { id: 1, order: 1, text: '1. Mixing Flour & Eggs 🥣', icon: '🥣' },
      { id: 2, order: 2, text: '2. Baking in Oven ♨️', icon: '♨️' },
      { id: 3, order: 3, text: '3. Adding Cream & Cherries 🍒', icon: '🍒' },
      { id: 4, order: 4, text: '4. Blowing Candles 🎂', icon: '🎂' },
    ],
  },
  {
    id: 3,
    title: 'Puzzle 3: Paper Boat Rain Adventure ⛵',
    cards: [
      { id: 1, order: 1, text: '1. Folding Paper Boat 📄', icon: '📄' },
      { id: 2, order: 2, text: '2. Rain Started Falling 🌧️', icon: '🌧️' },
      { id: 3, order: 3, text: '3. Floating Boat in Stream 🌊', icon: '🌊' },
      { id: 4, order: 4, text: '4. Waving at Boat ⛵', icon: '⛵' },
    ],
  },
  {
    id: 4,
    title: 'Puzzle 4: Puppy Bath Time 🐶',
    cards: [
      { id: 1, order: 1, text: '1. Muddy Puppy Playing 🐕', icon: '🐕' },
      { id: 2, order: 2, text: '2. Warm Soap Bath 🧼', icon: '🧼' },
      { id: 3, order: 3, text: '3. Towel Drying 🧻', icon: '🧻' },
      { id: 4, order: 4, text: '4. Clean Fluffy Puppy 🐶', icon: '🐶' },
    ],
  },
  {
    id: 5,
    title: 'Puzzle 5: Flying a Kite 🪁',
    cards: [
      { id: 1, order: 1, text: '1. Tying Kite String 🧶', icon: '🧶' },
      { id: 2, order: 2, text: '2. Running in Wind 🏃', icon: '🏃' },
      { id: 3, order: 3, text: '3. Kite Soaring High 🪁', icon: '🪁' },
      { id: 4, order: 4, text: '4. Happy Flying Session 🌤️', icon: '🌤️' },
    ],
  },
];
