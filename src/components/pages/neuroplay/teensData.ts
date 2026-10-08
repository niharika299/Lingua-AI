// Dataset for Tier 2: Teens (11-18 Years)
// 5 to 6 complex academic & abstract exercises per module

export const TEEN_VOCAB_EXERCISES = [
  {
    id: 1,
    sentence: 'Prakhar ne bina kisi "vilamb" ke apna vigyan (science) project samay par jama kar diya.',
    targetWord: 'vilamb',
    prompt: 'In this context, what is the exact meaning of the word "vilamb"?',
    options: [
      { id: 'a', text: 'Der / Delay', isCorrect: true },
      { id: 'b', text: 'Jaldi / Speed', isCorrect: false },
      { id: 'c', text: 'Galti / Error', isCorrect: false },
      { id: 'd', text: 'Shor / Noise', isCorrect: false },
    ],
    explanation: 'Correct! "Vilamb" means Delay or Procrastination. Extracting contextual clues improves reading comprehension.',
  },
  {
    id: 2,
    sentence: 'Uski "kushagra" buddhi ne ganit ke sabse kathin prashn ko 2 minute mein hal kar diya.',
    targetWord: 'kushagra',
    prompt: 'What does "kushagra" signify in this sentence?',
    options: [
      { id: 'a', text: 'Teekhi / Sharp & Brilliant', isCorrect: true },
      { id: 'b', text: 'Aalasi / Lazy', isCorrect: false },
      { id: 'c', text: 'Chhoti / Small', isCorrect: false },
      { id: 'd', text: 'Bholi / Naive', isCorrect: false },
    ],
    explanation: 'Correct! "Kushagra" means sharp-minded, acute intellect.',
  },
  {
    id: 3,
    sentence: 'N निरंतर "parishram" aur abhyas se hikisi bhi kshetra mein sresthata praapt ki ja sakti hai.',
    targetWord: 'parishram',
    prompt: 'What is the precise meaning of "parishram"?',
    options: [
      { id: 'a', text: 'Khatin Parishram / Hard Work', isCorrect: true },
      { id: 'b', text: 'Aaram / Rest', isCorrect: false },
      { id: 'c', text: 'Khel / Play', isCorrect: false },
      { id: 'd', text: 'Soya / Sleep', isCorrect: false },
    ],
    explanation: 'Correct! "Parishram" signifies diligent effort and hard work.',
  },
  {
    id: 4,
    sentence: 'Vidyarthiyo ko apne dhyan ko "ekagrita" ke saath padhai par kendrit karna chahiye.',
    targetWord: 'ekagrita',
    prompt: 'Identify the exact meaning of "ekagrita":',
    options: [
      { id: 'a', text: 'Ekagrata / Deep Concentration & Focus', isCorrect: true },
      { id: 'b', text: 'Akelapan / Loneliness', isCorrect: false },
      { id: 'c', text: 'Chinta / Anxiety', isCorrect: false },
      { id: 'd', text: 'Gussa / Anger', isCorrect: false },
    ],
    explanation: 'Correct! "Ekagrita" means intense focus and undivided concentration.',
  },
  {
    id: 5,
    sentence: 'Is kathin sthiti mein bhi usne apna "dhairya" nahi khoya aur shanti se faisla liya.',
    targetWord: 'dhairya',
    prompt: 'What does "dhairya" mean here?',
    options: [
      { id: 'a', text: 'Dhairya / Patience & Composure', isCorrect: true },
      { id: 'b', text: 'Darr / Fear', isCorrect: false },
      { id: 'c', text: 'Daud / Running', isCorrect: false },
      { id: 'd', text: 'Ladaai / Fight', isCorrect: false },
    ],
    explanation: 'Correct! "Dhairya" means patience and emotional composure under pressure.',
  },
  {
    id: 6,
    sentence: 'Anya chhatro ki tulna mein uska vyavahar aatyantik "samvedansheel" aur madhur tha.',
    targetWord: 'samvedansheel',
    prompt: 'Meaning of "samvedansheel":',
    options: [
      { id: 'a', text: 'Sensitive & Empathetic', isCorrect: true },
      { id: 'b', text: 'Kathor / Harsh', isCorrect: false },
      { id: 'c', text: 'Lalachi / Greedy', isCorrect: false },
      { id: 'd', text: 'Aagiyakari / Obedient', isCorrect: false },
    ],
    explanation: 'Correct! "Samvedansheel" means empathetic, perceptive, and sensitive to others.',
  },
];

export const TEEN_SARCASM_EXERCISES = [
  {
    id: 1,
    quote: '"Oh brilliant! Another surprise test on a Monday morning. My week is off to a flying start!"',
    speakerTone: 'Sarcastic & Irritated',
    prompt: 'What is the speaker REALLY feeling behind this statement?',
    options: [
      { id: 'a', text: 'They are annoyed and overwhelmed by the unexpected test.', isCorrect: true },
      { id: 'b', text: 'They are genuinely excited and thrilled to take a test.', isCorrect: false },
      { id: 'c', text: 'They are planning to fly an airplane.', isCorrect: false },
    ],
    explanation: 'Spot on! Verbal irony uses positive words like "brilliant" with an exaggerated tone to convey frustration.',
  },
  {
    id: 2,
    quote: '"Break a leg in your stage performance tonight!"',
    speakerTone: 'Idiomatic Encouragement',
    prompt: 'What does "Break a leg" mean here?',
    options: [
      { id: 'a', text: 'Good luck! Do a fantastic job on stage!', isCorrect: true },
      { id: 'b', text: 'Literally injure your leg on stage.', isCorrect: false },
      { id: 'c', text: 'Cancel the theater show.', isCorrect: false },
    ],
    explanation: 'Correct! "Break a leg" is a theatrical idiom wishing good luck.',
  },
  {
    id: 3,
    quote: '"Don\'t spill the beans about the surprise party!"',
    speakerTone: 'Metaphorical Warning',
    prompt: 'What does "Spill the beans" mean?',
    options: [
      { id: 'a', text: 'Do not reveal the secret before time.', isCorrect: true },
      { id: 'b', text: 'Do not drop food on the carpet.', isCorrect: false },
      { id: 'c', text: 'Cook beans for dinner.', isCorrect: false },
    ],
    explanation: 'Correct! "Spill the beans" means revealing confidential news.',
  },
  {
    id: 4,
    quote: '"Great job dropping my laptop! You really deserve a medal for dexterity!"',
    speakerTone: 'Sarcastic Frustration',
    prompt: 'What is the speaker\'s true underlying message?',
    options: [
      { id: 'a', text: 'They are upset because the laptop was dropped carelessly.', isCorrect: true },
      { id: 'b', text: 'They want to award a gold medal.', isCorrect: false },
      { id: 'c', text: 'They are happy the laptop is broken.', isCorrect: false },
    ],
    explanation: 'Correct! The praise is sarcastic sarcasm aimed at highlighting carelessness.',
  },
  {
    id: 5,
    quote: '"I am feeling a bit under the weather today."',
    speakerTone: 'Idiomatic Expression',
    prompt: 'What does "under the weather" indicate?',
    options: [
      { id: 'a', text: 'Feeling slightly sick or unwell.', isCorrect: true },
      { id: 'b', text: 'Standing outside in rain.', isCorrect: false },
      { id: 'c', text: 'Checking the temperature forecast.', isCorrect: false },
    ],
    explanation: 'Correct! "Under the weather" means feeling mildly ill.',
  },
  {
    id: 6,
    quote: '"Let\'s bite the bullet and complete this difficult assignment now."',
    speakerTone: 'Determination Idiom',
    prompt: 'What does "bite the bullet" mean?',
    options: [
      { id: 'a', text: 'Face a tough situation bravely without delay.', isCorrect: true },
      { id: 'b', text: 'Chew on metal objects.', isCorrect: false },
      { id: 'c', text: 'Give up on the assignment.', isCorrect: false },
    ],
    explanation: 'Correct! "Bite the bullet" means enduring a necessary hardship bravely.',
  },
];

export const TEEN_GRAMMAR_EXERCISES = [
  {
    id: 1,
    sentenceA: 'Aarav studied diligently all weekend.',
    sentenceB: 'He achieved the top grade in physics.',
    targetConjunction: 'Therefore',
    prompt: 'Synthesize these sentences using the most appropriate cause-and-effect conjunction:',
    options: [
      { id: 'a', text: 'Aarav studied diligently all weekend; therefore, he achieved the top grade in physics.', isCorrect: true },
      { id: 'b', text: 'Aarav studied diligently although he achieved top grade.', isCorrect: false },
      { id: 'c', text: 'Aarav achieved top grade whereas he studied.', isCorrect: false },
    ],
    explanation: 'Excellent! "Therefore" demonstrates logical cause and consequence.',
  },
  {
    id: 2,
    sentenceA: 'The rain was pouring heavily.',
    sentenceB: 'The players remained on the football field.',
    targetConjunction: 'Although',
    prompt: 'Combine using "Although":',
    options: [
      { id: 'a', text: 'Although the rain was pouring heavily, the players remained on the football field.', isCorrect: true },
      { id: 'b', text: 'Because rain was pouring, players stayed on field.', isCorrect: false },
      { id: 'c', text: 'The rain poured furthermore players stayed.', isCorrect: false },
    ],
    explanation: 'Correct! "Although" introduces a contrasting condition.',
  },
  {
    id: 3,
    sentenceA: 'Riya loves computer programming.',
    sentenceB: 'Her brother prefers classical music.',
    targetConjunction: 'Whereas',
    prompt: 'Combine using "Whereas":',
    options: [
      { id: 'a', text: 'Riya loves computer programming, whereas her brother prefers classical music.', isCorrect: true },
      { id: 'b', text: 'Riya loves programming because her brother prefers music.', isCorrect: false },
      { id: 'c', text: 'Therefore Riya loves programming brother music.', isCorrect: false },
    ],
    explanation: 'Correct! "Whereas" compares two contrasting facts.',
  },
  {
    id: 4,
    sentenceA: 'The team encountered technical glitches.',
    sentenceB: 'They delivered their presentation successfully.',
    targetConjunction: 'However',
    prompt: 'Combine using "However":',
    options: [
      { id: 'a', text: 'The team encountered technical glitches; however, they delivered their presentation successfully.', isCorrect: true },
      { id: 'b', text: 'The team encountered glitches because they delivered presentation.', isCorrect: false },
      { id: 'c', text: 'Whereas glitches however presentation.', isCorrect: false },
    ],
    explanation: 'Correct! "However" signals an unexpected contrast or resolution.',
  },
  {
    id: 5,
    sentenceA: 'Regular exercise improves physical cardiovascular stamina.',
    sentenceB: 'It enhances mental cognitive clarity.',
    targetConjunction: 'Furthermore',
    prompt: 'Combine using "Furthermore":',
    options: [
      { id: 'a', text: 'Regular exercise improves cardiovascular stamina; furthermore, it enhances mental clarity.', isCorrect: true },
      { id: 'b', text: 'Exercise improves stamina although it enhances clarity.', isCorrect: false },
      { id: 'c', text: 'Exercise stamina whereas mental clarity.', isCorrect: false },
    ],
    explanation: 'Correct! "Furthermore" adds supporting evidence.',
  },
  {
    id: 6,
    sentenceA: 'The science exhibition deadline was postponed.',
    sentenceB: 'The students received an extra week for research.',
    targetConjunction: 'Consequently',
    prompt: 'Combine using "Consequently":',
    options: [
      { id: 'a', text: 'The science exhibition deadline was postponed; consequently, students received an extra week for research.', isCorrect: true },
      { id: 'b', text: 'Deadline postponed although extra week research.', isCorrect: false },
      { id: 'c', text: 'Extra week research whereas postponed.', isCorrect: false },
    ],
    explanation: 'Correct! "Consequently" emphasizes logical outcome.',
  },
];

export const TEEN_SOCIAL_EXERCISES = [
  {
    id: 1,
    scenario: 'During a group project, a teammate hasn\'t submitted their slide because their internet crashed. Other members want to complain to teacher immediately. What is the empathetic perspective?',
    options: [
      { id: 'a', text: 'Private check-in: Ask if they need help uploading or technical support before escalating.', isCorrect: true },
      { id: 'b', text: 'Immediately post angry messages on class WhatsApp group.', isCorrect: false },
      { id: 'c', text: 'Delete their name from project cover page without asking.', isCorrect: false },
    ],
    explanation: 'Constructive empathy! Understanding unexpected hurdles builds strong teamwork skills.',
  },
  {
    id: 2,
    scenario: 'A new student sits alone at lunch looking nervous. What is the most welcoming perspective-taking action?',
    options: [
      { id: 'a', text: 'Approach with a friendly smile: "Hi! Would you like to sit with us today?"', isCorrect: true },
      { id: 'b', text: 'Stare at them from afar and whisper with friends.', isCorrect: false },
      { id: 'c', text: 'Ignore them completely.', isCorrect: false },
    ],
    explanation: 'Empathetic inclusion reduces social isolation in school settings.',
  },
  {
    id: 3,
    scenario: 'Your friend posts an embarrassing photo of you online without asking. How do you communicate boundary?',
    options: [
      { id: 'a', text: 'Calm direct message: "Hey, I felt uncomfortable with that photo. Could you please take it down?"', isCorrect: true },
      { id: 'b', text: 'Post a bad photo of them back in revenge.', isCorrect: false },
      { id: 'c', text: 'Block them permanently without explaining why.', isCorrect: false },
    ],
    explanation: 'Assertive communication sets healthy digital boundaries cleanly.',
  },
  {
    id: 4,
    scenario: 'You disagree with a friend\'s opinion on a controversial book character. How do you discuss?',
    options: [
      { id: 'a', text: 'Acknowledge their view: "I see why you think that, but here\'s how I interpreted it differently..."', isCorrect: true },
      { id: 'b', text: 'Tell them: "Your opinion is completely stupid!"', isCorrect: false },
      { id: 'c', text: 'Walk away angrily.', isCorrect: false },
    ],
    explanation: 'Respectful dialogue validates differing viewpoints.',
  },
  {
    id: 5,
    scenario: 'Your close friend got selected for basketball team, but you didn\'t make the cut. How do you handle it?',
    options: [
      { id: 'a', text: 'Congratulate them genuinely, then practice harder for next selection.', isCorrect: true },
      { id: 'b', text: 'Refuse to talk to them for a month out of jealousy.', isCorrect: false },
      { id: 'c', text: 'Spread rumors that selection was unfair.', isCorrect: false },
    ],
    explanation: 'Emotional maturity balances personal disappointment with genuine support for friends.',
  },
  {
    id: 6,
    scenario: 'A friend seems unusually quiet and upset after class. How do you show support?',
    options: [
      { id: 'a', text: 'Gentle check-in: "Hey, I noticed you seem quiet. I am here if you want to talk."', isCorrect: true },
      { id: 'b', text: 'Tell everyone in class they are acting weird.', isCorrect: false },
      { id: 'c', text: 'Demand they tell you immediately what happened.', isCorrect: false },
    ],
    explanation: 'Non-pressured support provides a safe space for friends.',
  },
];

export const TEEN_PHONOLOGY_EXERCISES = [
  {
    id: 1,
    word: 'UNBELIEVABLE',
    prompt: 'Deconstruct "UNBELIEVABLE" into Prefix + Root + Suffix:',
    options: [
      { id: 'a', text: 'UN- (Prefix) + BELIEVE (Root) + -ABLE (Suffix)', isCorrect: true },
      { id: 'b', text: 'UNBELIEVE- (Root) + ABLE (Suffix)', isCorrect: false },
      { id: 'c', text: 'U- (Prefix) + NBELIEVABLE (Root)', isCorrect: false },
    ],
    explanation: 'Correct! Morphological awareness breaks complex academic vocabulary into meaningful chunks.',
  },
  {
    id: 2,
    word: 'RECONSTRUCTION',
    prompt: 'Deconstruct "RECONSTRUCTION" into affixes:',
    options: [
      { id: 'a', text: 'RE- (Prefix) + CONSTRUCT (Root) + -ION (Suffix)', isCorrect: true },
      { id: 'b', text: 'RECONS- (Root) + TRUCTION (Suffix)', isCorrect: false },
      { id: 'c', text: 'RECONSTRUCT- (Prefix) + ION (Root)', isCorrect: false },
    ],
    explanation: 'Correct! RE- (again) + CONSTRUCT (build) + -ION (process).',
  },
  {
    id: 3,
    word: 'DISCONNECTION',
    prompt: 'Deconstruct "DISCONNECTION":',
    options: [
      { id: 'a', text: 'DIS- (Prefix) + CONNECT (Root) + -ION (Suffix)', isCorrect: true },
      { id: 'b', text: 'DISCONNECT- (Root) + ION (Suffix)', isCorrect: false },
      { id: 'c', text: 'DIS- (Root) + CONNECTION (Suffix)', isCorrect: false },
    ],
    explanation: 'Correct! DIS- (opposite) + CONNECT + -ION.',
  },
  {
    id: 4,
    word: 'INEQUALITY',
    prompt: 'Deconstruct "INEQUALITY":',
    options: [
      { id: 'a', text: 'IN- (Prefix) + EQUAL (Root) + -ITY (Suffix)', isCorrect: true },
      { id: 'b', text: 'INEQUAL- (Root) + ITY (Suffix)', isCorrect: false },
      { id: 'c', text: 'I- (Prefix) + NEQUALITY (Root)', isCorrect: false },
    ],
    explanation: 'Correct! IN- (not) + EQUAL + -ITY (state of being).',
  },
  {
    id: 5,
    word: 'TRANSFORMATION',
    prompt: 'Deconstruct "TRANSFORMATION":',
    options: [
      { id: 'a', text: 'TRANS- (Prefix) + FORM (Root) + -ATION (Suffix)', isCorrect: true },
      { id: 'b', text: 'TRANSFORM- (Root) + ATION (Suffix)', isCorrect: false },
      { id: 'c', text: 'T- (Prefix) + RANSFORMATION (Root)', isCorrect: false },
    ],
    explanation: 'Correct! TRANS- (across/change) + FORM + -ATION.',
  },
  {
    id: 6,
    word: 'PRECAUTIONARY',
    prompt: 'Deconstruct "PRECAUTIONARY":',
    options: [
      { id: 'a', text: 'PRE- (Prefix) + CAUTION (Root) + -ARY (Suffix)', isCorrect: true },
      { id: 'b', text: 'PRECAUTION- (Root) + ARY (Suffix)', isCorrect: false },
      { id: 'c', text: 'P- (Prefix) + RECAUTIONARY (Root)', isCorrect: false },
    ],
    explanation: 'Correct! PRE- (before) + CAUTION + -ARY.',
  },
];

export const TEEN_MEMORY_EXERCISES = [
  {
    id: 1,
    lectureTitle: '🔬 Short Science Audio Clip: Photosynthesis Core Pillars',
    lectureText: '"Photosynthesis occurs in plant chloroplasts using chlorophyll. It converts sunlight, water, and carbon dioxide into glucose sugar and oxygen gas. Oxygen is released into the atmosphere as a vital byproduct."',
    factsPrompt: 'Identify the 3 core facts mentioned in the lecture:',
    options: [
      { id: 'a', text: '1. Occurs in chloroplasts. 2. Converts sunlight, water, CO2 into glucose. 3. Releases oxygen byproduct.', isCorrect: true },
      { id: 'b', text: '1. Occurs in animal cells. 2. Requires dark rooms. 3. Produces salt water.', isCorrect: false },
      { id: 'c', text: '1. Plants sleep at night. 2. Leaves are blue. 3. Flowers smell nice.', isCorrect: false },
    ],
  },
  {
    id: 2,
    lectureTitle: '🌌 Short Physics Clip: Newton\'s Laws of Motion',
    lectureText: '"Newton\'s First Law states an object remains at rest unless acted upon by an external net force. The Second Law defines force equal to mass times acceleration (F = ma). The Third Law states every action has an equal and opposite reaction."',
    factsPrompt: 'Identify the 3 core pillars:',
    options: [
      { id: 'a', text: '1. First Law: Inertia. 2. Second Law: F = ma. 3. Third Law: Equal & opposite reaction.', isCorrect: true },
      { id: 'b', text: '1. Gravity is weak. 2. Speed is constant. 3. Planets are round.', isCorrect: false },
      { id: 'c', text: '1. Friction is zero. 2. Energy is lost. 3. Heat rises.', isCorrect: false },
    ],
  },
  {
    id: 3,
    lectureTitle: '🧪 Short Chemistry Clip: Water Molecule Structure',
    lectureText: '"Water consists of two hydrogen atoms polar-bonded to one oxygen atom (H2O). It has high surface tension and acts as a universal solvent due to its polar molecular structure."',
    factsPrompt: 'Identify the 3 core facts:',
    options: [
      { id: 'a', text: '1. Formula is H2O. 2. High surface tension. 3. Universal solvent due to polarity.', isCorrect: true },
      { id: 'b', text: '1. Formula is CO2. 2. Low boiling point. 3. Non-polar liquid.', isCorrect: false },
      { id: 'c', text: '1. Tastes like sugar. 2. Made of iron. 3. Glows in dark.', isCorrect: false },
    ],
  },
  {
    id: 4,
    lectureTitle: '🧬 Short Biology Clip: DNA Double Helix Structure',
    lectureText: '"DNA stores genetic code in a double helix structure discovered by Watson, Crick, and Franklin. Nucleotide bases pair specifically: Adenine with Thymine, and Cytosine with Guanine."',
    factsPrompt: 'Identify the 3 core facts:',
    options: [
      { id: 'a', text: '1. Double helix shape. 2. Stores genetic code. 3. A-T and C-G base pairing.', isCorrect: true },
      { id: 'b', text: '1. Single straight wire. 2. Made of lipids. 3. No base pairing.', isCorrect: false },
      { id: 'c', text: '1. Found in muscles only. 2. Red color. 3. Disappears daily.', isCorrect: false },
    ],
  },
  {
    id: 5,
    lectureTitle: '🌍 Short Geography Clip: Water Cycle Dynamics',
    lectureText: '"The Earth\'s water cycle operates through solar evaporation from oceans, atmospheric condensation forming clouds, and precipitation as rain or snow returning to rivers and aquifers."',
    factsPrompt: 'Identify the 3 core stages:',
    options: [
      { id: 'a', text: '1. Solar Evaporation. 2. Atmospheric Condensation. 3. Precipitation & Aquifer Recharge.', isCorrect: true },
      { id: 'b', text: '1. Ocean freezing. 2. Cloud burning. 3. Wind stopping.', isCorrect: false },
      { id: 'c', text: '1. River digging. 2. Rain evaporation. 3. Ice melting.', isCorrect: false },
    ],
  },
];

export const TEEN_NARRATIVE_EXERCISES = [
  {
    id: 1,
    title: 'Movie Pitch 1: Cyber-Robot Mystery 🤖',
    prompt: 'Structure a compelling 3-part narrative pitch:',
    steps: [
      { label: 'Hook', text: 'In a futuristic city, an innocent eco-robot discovers a forgotten secret garden under the neon towers.' },
      { label: 'Conflict / Twist', text: 'The city central AI decides to pave over the garden for an energy reactor.' },
      { label: 'Climax & Resolution', text: 'The robot rallies local school children to build solar domes, saving the urban sanctuary.' },
    ],
  },
  {
    id: 2,
    title: 'Movie Pitch 2: Lost Arctic Expedition ❄️',
    prompt: 'Structure the 3 narrative pillars:',
    steps: [
      { label: 'Hook', text: 'A young meteorologist detects strange warm weather anomalies near the North Pole.' },
      { label: 'Conflict / Twist', text: 'A sudden blizzard destroys their main radio relay tower during an expedition.' },
      { label: 'Climax & Resolution', text: 'Using ancient thermal hot springs, the team builds a distress beacon and survives.' },
    ],
  },
  {
    id: 3,
    title: 'Movie Pitch 3: Undersea Science Lab 🐬',
    prompt: 'Structure the narrative sequence:',
    steps: [
      { label: 'Hook', text: 'An oceanography team builds the deepest underwater marine sanctuary.' },
      { label: 'Conflict / Twist', text: 'A submarine seismic trench shift threatens to rupture the main glass dome.' },
      { label: 'Climax & Resolution', text: 'A pod of rescued dolphins guides the emergency escape capsule to safety.' },
    ],
  },
  {
    id: 4,
    title: 'Movie Pitch 4: The Time-Travel History Quest ⏳',
    prompt: 'Structure the narrative sequence:',
    steps: [
      { label: 'Hook', text: 'A high-school student accidentally activates a vintage clockwork device in museum.' },
      { label: 'Conflict / Twist', text: 'They get stranded in 18th century London without their modern smartphone.' },
      { label: 'Climax & Resolution', text: 'Using basic physics principles, they repair the gear clock and return home.' },
    ],
  },
  {
    id: 5,
    title: 'Movie Pitch 5: Space Farming Odyssey 🚀',
    prompt: 'Structure the narrative sequence:',
    steps: [
      { label: 'Hook', text: 'Astronaut teens attempt to grow the first wheat crops inside a Mars glass dome.' },
      { label: 'Conflict / Twist', text: 'A solar flare cuts off automated hydroponic water valves.' },
      { label: 'Climax & Resolution', text: 'They engineer a manual ice-melt drip system, saving the colony harvest.' },
    ],
  },
];
