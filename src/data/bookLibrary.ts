import { ScannedPage } from '../types';

export const SAMPLE_BOOK_PAGES: ScannedPage[] = [
  {
    id: 'sample-1',
    title: 'The Little Explorer',
    topic: 'Adventure & Discovery',
    imageUrl: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=800&q=80',
    extractedText:
      'Leo packed his compass and brass telescope into his brown canvas pack. Beyond the gentle meadow, a mysterious whispering forest began. With each quiet step through the fern trails, tiny songbirds guided the path toward the hidden emerald waterfall.',
    simplifiedText:
      'Leo packed his bag with a compass and telescope. He walked through a quiet green forest with singing birds to find a hidden waterfall.',
    paragraphs: [
      'Leo packed his compass and telescope into his pack.',
      'Beyond the meadow, a whispering forest began.',
      'Songbirds guided the path toward a hidden waterfall.',
    ],
    date: 'Sample Library',
    progressPct: 100,
    wordCount: 42,
    isSample: true,
  },
  {
    id: 'sample-2',
    title: 'The Secret Life of Plants',
    topic: 'Science',
    imageUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&q=80',
    extractedText:
      'Green leaves are like tiny food factories that drink golden sunlight. Deep below the dark rich soil, thirsty roots sip water and mineral salts. Plants exhale the clean, crisp oxygen that all people and animals breathe every day.',
    simplifiedText:
      'Green leaves turn sunlight into food. Deep roots drink water from the soil. Plants give us the fresh air we breathe.',
    paragraphs: [
      'Green leaves are like tiny food factories.',
      'Roots sip water deep underground.',
      'Plants create the clean air we breathe.',
    ],
    date: 'Sample Library',
    progressPct: 60,
    wordCount: 38,
    isSample: true,
  },
  {
    id: 'sample-3',
    title: 'Journey Through Space',
    topic: 'Space & Astronomy',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    extractedText:
      'Outer space is an immense ocean of midnight velvet speckled with trillions of glittering stars. Astronauts float weightlessly inside their silver spacecraft because gravity does not pull them down.',
    simplifiedText:
      'Outer space is huge and full of shining stars. Inside space stations, astronauts float around with zero gravity.',
    paragraphs: [
      'Outer space is filled with trillions of stars.',
      'Astronauts float in space because there is no gravity.',
    ],
    date: 'Sample Library',
    progressPct: 85,
    wordCount: 32,
    isSample: true,
  },
  {
    id: 'sample-4',
    title: 'Our Solar System',
    topic: 'Science',
    imageUrl: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=800&q=80',
    extractedText:
      'Eight unique planets circle around our giant fiery Sun. Mercury is closest and scorched, while stormy Jupiter is so huge that over one thousand Earths could fit inside its swirling belly.',
    simplifiedText:
      'Eight planets travel around the Sun. Mercury is closest and hot. Jupiter is the biggest planet of all.',
    paragraphs: [
      'Eight planets circle around the Sun.',
      'Mercury is hot and close.',
      'Jupiter is the largest planet in our solar system.',
    ],
    date: 'Sample Library',
    progressPct: 40,
    wordCount: 34,
    isSample: true,
  },
  {
    id: 'sample-5',
    title: 'Amazing Ocean World',
    topic: 'Nature',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    extractedText:
      'Beneath the sunlit turquoise waves, colorful coral reefs shelter seahorses, clownfish, and gentle sea turtles. Whales communicate by singing deep musical songs that travel through ocean currents for hundreds of miles.',
    simplifiedText:
      'Under the blue ocean waves, sea turtles and fish live in colorful reefs. Whales sing long songs to each other.',
    paragraphs: [
      'Beneath the waves, sea turtles swim through coral reefs.',
      'Whales sing musical songs that travel very far.',
    ],
    date: 'Sample Library',
    progressPct: 90,
    wordCount: 36,
    isSample: true,
  },
  {
    id: 'sample-6',
    title: 'Life of a Butterfly',
    topic: 'Biology',
    imageUrl: 'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?auto=format&fit=crop&w=800&q=80',
    extractedText:
      'A hungry caterpillar munches green leaves until it spins a snug chrysalis pod. Inside this quiet sleeping chamber, a magnificent transformation called metamorphosis unfolds. Soon, a vibrant winged butterfly emerges and flutters into the sky.',
    simplifiedText:
      'A tiny caterpillar eats leaves and sleeps in a cocoon. Then it transforms into a beautiful butterfly with wings.',
    paragraphs: [
      'A hungry caterpillar eats leaves.',
      'It rests inside a snug chrysalis.',
      'It emerges as a butterfly ready to fly.',
    ],
    date: 'Sample Library',
    progressPct: 75,
    wordCount: 38,
    isSample: true,
  },
  {
    id: 'sample-7',
    title: 'Volcanoes: Earth Wonders',
    topic: 'Earth Science',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    extractedText:
      'Deep inside our restless Earth, molten rock called magma bubbles with extreme heat. When internal pressure builds high enough, the volcano releases glowing orange lava, plumes of gray ash, and rumbling steam.',
    simplifiedText:
      'Deep in the ground, super hot melted rock is called magma. When pressure rises, a volcano erupts with glowing lava.',
    paragraphs: [
      'Hot melted rock deep underground is called magma.',
      'Pressure pushes glowing lava out of the volcano peak.',
    ],
    date: 'Sample Library',
    progressPct: 30,
    wordCount: 35,
    isSample: true,
  },
  {
    id: 'sample-8',
    title: 'Amazing Animals of the Savannah',
    topic: 'Nature',
    imageUrl: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?auto=format&fit=crop&w=800&q=80',
    extractedText:
      'Golden lions rest under the shade of acacia trees while herds of zebras and tall giraffes graze across the African grasslands. Giraffes use their long blue-black tongues to pluck the sweetest leaves from thorny branches.',
    simplifiedText:
      'Lions rest in the shade while tall giraffes eat leaves from high trees across the warm grassy plains.',
    paragraphs: [
      'Lions rest in the shade of acacia trees.',
      'Giraffes use long tongues to reach high leaves.',
    ],
    date: 'Sample Library',
    progressPct: 95,
    wordCount: 37,
    isSample: true,
  },
  {
    id: 'sample-9',
    title: 'The Clever Fox & The River',
    topic: 'Story',
    imageUrl: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&w=800&q=80',
    extractedText:
      'Rusty the red fox wished to cross the rushing river without soaking his bushy tail. Instead of jumping into the deep rapids, he rolled three dry pine logs together and paddled safely across like a master captain.',
    simplifiedText:
      'Rusty the red fox wanted to cross a wide river. He used three dry pine logs as a raft to stay dry.',
    paragraphs: [
      'Rusty the fox wanted to cross the rushing river.',
      'He made a raft from pine logs and stayed dry.',
    ],
    date: 'Sample Library',
    progressPct: 100,
    wordCount: 39,
    isSample: true,
  },
  {
    id: 'sample-10',
    title: 'Weather Wonders',
    topic: 'Science',
    imageUrl: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=800&q=80',
    extractedText:
      'When bright sunshine breaks through falling raindrops, white light splits into seven glowing colors: red, orange, yellow, green, blue, indigo, and violet. This natural prism arc in the sky is called a rainbow.',
    simplifiedText:
      'When sunlight shines through raindrops, light bends into seven colors to make a beautiful rainbow.',
    paragraphs: [
      'Raindrops bend sunlight in the sky.',
      'Seven glowing colors form an arching rainbow.',
    ],
    date: 'Sample Library',
    progressPct: 50,
    wordCount: 36,
    isSample: true,
  },
  {
    id: 'sample-11',
    title: 'Giants of the Jurassic: Dinosaurs',
    topic: 'Paleontology & Science',
    imageUrl: 'https://images.unsplash.com/photo-1579202673506-ca3ce28943ef?auto=format&fit=crop&w=800&q=80',
    extractedText:
      'Millions of years ago, colossal dinosaurs roamed the ancient fern forests. The gentle Brachiosaurus stretched its towering neck high above the tree canopy to graze on tender pine needles, while speedy Velociraptors hunted in clever packs across sandy riverbanks.',
    simplifiedText:
      'Long ago, giant dinosaurs lived on Earth. Some ate leaves high up in tall trees, and others ran quickly across the land.',
    paragraphs: [
      'Millions of years ago, giant dinosaurs walked on Earth.',
      'The Brachiosaurus reached tall treetops with its long neck.',
      'Small, quick dinosaurs ran in groups along rivers.',
    ],
    date: 'Sample Library',
    progressPct: 65,
    wordCount: 38,
    isSample: true,
  },
  {
    id: 'sample-12',
    title: 'The Beating Heart: Your Body Pump',
    topic: 'Biology & Health',
    imageUrl: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=800&q=80',
    extractedText:
      'Your human heart is a powerful muscular pump roughly the size of your fist. Day and night without pause, it squeezes rhythmically to push fresh oxygenated blood through thousands of miles of tiny vessels to energize every muscle, bone, and thinking cell.',
    simplifiedText:
      'Your heart is a strong muscle that pumps blood all through your body. It works day and night to keep you healthy and energetic.',
    paragraphs: [
      'Your heart is a muscle about the size of your fist.',
      'It pumps blood day and night without stopping.',
      'Clean blood carries oxygen to all your muscles and brain.',
    ],
    date: 'Sample Library',
    progressPct: 80,
    wordCount: 40,
    isSample: true,
  },
  {
    id: 'sample-13',
    title: 'Secrets of the Amazon Rainforest',
    topic: 'Ecology & Nature',
    imageUrl: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=800&q=80',
    extractedText:
      'The lush Amazon rainforest is the emerald crown of our planet. Bright green tree frogs hide beneath giant banana leaves, while emerald toucans with vibrant rainbow beaks chirp high up in the dense canopy where warm mist hovers.',
    simplifiedText:
      'The Amazon rainforest is full of tall green trees and rare animals. Colorful toucans and tiny tree frogs live under broad wet leaves.',
    paragraphs: [
      'The Amazon rainforest is full of green trees and animals.',
      'Tree frogs hide under big leaves to stay cool.',
      'Toucans fly high in the treetops where mist floats.',
    ],
    date: 'Sample Library',
    progressPct: 70,
    wordCount: 39,
    isSample: true,
  },
  {
    id: 'sample-14',
    title: 'How Airplanes Fly: The Magic of Wings',
    topic: 'Physics & Engineering',
    imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80',
    extractedText:
      'Airplanes soar through the open clouds because of an aerodynamic force called lift. Air rushes faster over the curved top of each airplane wing, creating lower air pressure above that gently pulls the heavy metal aircraft upward into the clear blue sky.',
    simplifiedText:
      'Airplanes fly because air moves faster over the top of their wings. This creates lift that pulls the plane up into the sky.',
    paragraphs: [
      'Airplanes fly high using a force called lift.',
      'Air moves quickly over the curved wings.',
      'Lower pressure pulls the plane up into the clouds.',
    ],
    date: 'Sample Library',
    progressPct: 45,
    wordCount: 41,
    isSample: true,
  },
  {
    id: 'sample-15',
    title: 'The Moon and Its Changing Phases',
    topic: 'Space & Astronomy',
    imageUrl: 'https://images.unsplash.com/photo-1522030299830-16b8d3d049fe?auto=format&fit=crop&w=800&q=80',
    extractedText:
      'The Moon does not produce its own light; it reflects bright beams from the distant Sun. As the Moon travels around Earth each month, we observe different portions of its sunlit side, from a thin crescent sliver to a glowing full lunar sphere.',
    simplifiedText:
      'The Moon shines because sunlight bounces off it. As it moves around Earth, it looks like it changes shape from a crescent to a full circle.',
    paragraphs: [
      'The Moon shines bright by reflecting sunlight.',
      'It orbits around Earth every month.',
      'We see different shapes from a sliver to a full Moon.',
    ],
    date: 'Sample Library',
    progressPct: 90,
    wordCount: 42,
    isSample: true,
  },
  {
    id: 'sample-16',
    title: 'The Coral Reef: Cities Under The Sea',
    topic: 'Marine Biology',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    extractedText:
      'Coral reefs are underwater living cities built by tiny marine organisms called coral polyps. Thousands of sea creatures find food and safe homes among the branching sea fans, including baby sea turtles, spotted stingrays, and busy hermit crabs.',
    simplifiedText:
      'Coral reefs are bustling underwater neighborhoods made by tiny sea polyps. Fish, crabs, and baby turtles live safely together here.',
    paragraphs: [
      'Coral reefs are like underwater cities built by tiny polyps.',
      'Thousands of sea creatures make their home in the reef.',
      'Turtles and crabs swim safely between the corals.',
    ],
    date: 'Sample Library',
    progressPct: 55,
    wordCount: 38,
    isSample: true,
  },
];
