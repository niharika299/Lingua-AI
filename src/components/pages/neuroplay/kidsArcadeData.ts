// Dataset for Tier 1 Kids (5-11 Years) Arcade Games
// Clean, bright pastel specifications with XP rewards and audio prompts

export interface ArcadeGameInfo {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  colorBg: string; // Pastel light background class
  borderColor: string;
  categoryTag: string; // MEMORY / ATTENTION / AUDITORY / PATTERN
  levelPill: string;   // Beginner
  duration: string;    // 2m
  points: string;      // ★ +80
  description: string;
}

export const KIDS_ARCADE_GAMES_LIST: ArcadeGameInfo[] = [
  {
    id: 'memory_match',
    title: '1. Memory Match',
    subtitle: 'Card Flip Pair Matching',
    emoji: '🃏',
    colorBg: 'bg-indigo-50/90 hover:bg-indigo-100/90',
    borderColor: 'border-indigo-200',
    categoryTag: 'MEMORY',
    levelPill: 'Beginner',
    duration: '2m',
    points: '★ +80',
    description: 'Flip cards to match identical emoji pairs (🍎, 🍌, 🍇, 🐶, 🐱, 🦁)!',
  },
  {
    id: 'focus_numbers',
    title: '2. Focus Numbers',
    subtitle: 'Spot the Number Grid',
    emoji: '🔢',
    colorBg: 'bg-amber-50/90 hover:bg-amber-100/90',
    borderColor: 'border-amber-200',
    categoryTag: 'ATTENTION',
    levelPill: 'Beginner',
    duration: '2m',
    points: '★ +70',
    description: 'Spot and tap all target digits in the 4x4 grid before time runs out!',
  },
  {
    id: 'number_bingo',
    title: '3. Number Bingo',
    subtitle: 'Audio Stamp Callout',
    emoji: '🎯',
    colorBg: 'bg-emerald-50/90 hover:bg-emerald-100/90',
    borderColor: 'border-emerald-200',
    categoryTag: 'AUDITORY',
    levelPill: 'Beginner',
    duration: '2m',
    points: '★ +75',
    description: 'Listen to spoken voice callouts and stamp the correct number on your board!',
  },
  {
    id: 'finger_sequence',
    title: '4. Finger Sequence',
    subtitle: 'Pattern Follower Gesture Recall',
    emoji: '🖐️',
    colorBg: 'bg-sky-50/90 hover:bg-sky-100/90',
    borderColor: 'border-sky-200',
    categoryTag: 'PATTERN',
    levelPill: 'Beginner',
    duration: '2m',
    points: '★ +80',
    description: 'Watch the hand gesture sequence (👈, 👆, 👉, 👇) and repeat it in order!',
  },
];

// Data for Game 2: Focus Numbers (5 progressive rounds)
export const FOCUS_NUMBERS_ROUNDS = [
  { round: 1, targetDigit: 7, grid: [3, 7, 2, 9, 7, 1, 7, 5, 4, 7, 8, 7, 6, 2, 7, 9], targetCount: 5, prompt: 'FIND: 7', timeLimitSeconds: 25 },
  { round: 2, targetDigit: 3, grid: [3, 8, 3, 1, 4, 3, 9, 3, 2, 6, 3, 5, 1, 3, 7, 4], targetCount: 5, prompt: 'FIND: 3', timeLimitSeconds: 25 },
  { round: 3, targetDigit: 9, grid: [9, 2, 5, 9, 8, 9, 1, 4, 9, 6, 9, 3, 7, 9, 2, 8], targetCount: 5, prompt: 'FIND: 9', timeLimitSeconds: 25 },
  { round: 4, targetDigit: 5, grid: [1, 5, 4, 5, 2, 8, 5, 5, 3, 7, 5, 9, 6, 5, 1, 3], targetCount: 5, prompt: 'FIND: 5', timeLimitSeconds: 25 },
  { round: 5, targetDigit: 2, grid: [2, 6, 2, 8, 2, 1, 7, 2, 2, 4, 3, 5, 8, 2, 9, 1], targetCount: 5, prompt: 'FIND: 2', timeLimitSeconds: 25 },
];

// Data for Game 3: Number Bingo (5 audio rounds)
export const BINGO_ROUNDS = [
  { round: 1, callNumber: 6, audioText: 'Callout: 6! Stamp the number 6 on your board!', grid: [5, 12, 6, 20, 8, 19, 3, 25, 11, 6, 30, 2, 17, 9, 6, 22] },
  { round: 2, callNumber: 14, audioText: 'Callout: 14! Find Fourteen!', grid: [10, 14, 4, 15, 14, 9, 21, 33, 16, 2, 14, 18, 7, 25, 12, 30] },
  { round: 3, callNumber: 7, audioText: 'Callout: 7! Stamp 7 on your card!', grid: [7, 13, 22, 1, 18, 7, 29, 11, 24, 6, 15, 7, 3, 20, 9, 14] },
  { round: 4, callNumber: 21, audioText: 'Callout: 21! Spot Twenty-One!', grid: [19, 8, 21, 31, 25, 21, 10, 36, 21, 17, 3, 22, 14, 29, 6, 40] },
  { round: 5, callNumber: 33, audioText: 'Callout: 33! Stamp Thirty-Three!', grid: [33, 11, 5, 26, 17, 33, 20, 8, 33, 12, 24, 2, 30, 15, 9, 18] },
];

// Data for Game 4: Finger Sequence (5 levels with 👈, 👆, 👉, 👇)
export const FINGER_SEQUENCE_STAGES = [
  { level: 1, name: 'Level 1 (3 Sequence)', sequence: ['👈 Left', '👆 Up', '👉 Right'], audioText: 'Left, Up, Right' },
  { level: 2, name: 'Level 2 (4 Sequence)', sequence: ['👇 Down', '👈 Left', '👆 Up', '👉 Right'], audioText: 'Down, Left, Up, Right' },
  { level: 3, name: 'Level 3 (5 Sequence)', sequence: ['👆 Up', '👉 Right', '👇 Down', '👈 Left', '👆 Up'], audioText: 'Up, Right, Down, Left, Up' },
  { level: 4, name: 'Level 4 (6 Sequence)', sequence: ['👈 Left', '👇 Down', '👉 Right', '👆 Up', '👈 Left', '👇 Down'], audioText: 'Left, Down, Right, Up, Left, Down' },
  { level: 5, name: 'Level 5 (7 Sequence Master)', sequence: ['👆 Up', '👈 Left', '👇 Down', '👉 Right', '👆 Up', '👈 Left', '👉 Right'], audioText: 'Up, Left, Down, Right, Up, Left, Right' },
];
