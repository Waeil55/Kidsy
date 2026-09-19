// Unified content provider — imports from existing grade banks + provides
// a simple { question, options, correct } interface for the new design UI.
import { getMathQuiz } from '../data/mathMasterBank.js';

export const GRADES = [
  { id: 'KG', label: 'Kindergarten', age: '4-5 yrs', desc: 'Phonics & Basic Counting', color: '#EC4899' },
  { id: 'G1', label: 'Grade 1', age: '6-7 yrs', desc: 'Addition & Simple Reading', color: '#F59E0B' },
  { id: 'G2', label: 'Grade 2', age: '7-8 yrs', desc: 'Word Problems & Nature', color: '#10B981' },
  { id: 'G3', label: 'Grade 3', age: '8-9 yrs', desc: 'Multiplication & Earth Science', color: '#3B82F6' },
  { id: 'G4', label: 'Grade 4', age: '9-10 yrs', desc: 'Fractions & Geography', color: '#8B5CF6' },
  { id: 'G5', label: 'Grade 5', age: '10-11 yrs', desc: 'Critical Thinking & STEM', color: '#EF4444' },
  { id: 'G6', label: 'Grade 6', age: '11-12 yrs', desc: 'Pre-Algebra & Global History', color: '#06B6D4' },
];

export const shuffleArray = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// ─── Embedded fallback questions per grade ──────────────────────────────────
const BANK = {
  KG: [
    { q: 'What letter does "Apple" start with?', o: ['A', 'B', 'C', 'D'], a: 'A' },
    { q: 'How many fingers do you have on one hand?', o: ['5', '3', '10', '4'], a: '5' },
    { q: 'What color is the sky?', o: ['Blue', 'Green', 'Red', 'Yellow'], a: 'Blue' },
    { q: 'Which animal says "moo"?', o: ['Cow', 'Dog', 'Cat', 'Bird'], a: 'Cow' },
    { q: 'What shape is a ball?', o: ['Circle', 'Square', 'Triangle', 'Star'], a: 'Circle' },
    { q: 'What comes after 1?', o: ['2', '3', '0', '5'], a: '2' },
    { q: 'Which is big?', o: ['Elephant', 'Ant', 'Bee', 'Mouse'], a: 'Elephant' },
    { q: 'What letter does "Ball" start with?', o: ['B', 'A', 'C', 'D'], a: 'B' },
    { q: 'How many legs does a dog have?', o: ['4', '2', '6', '3'], a: '4' },
    { q: 'What fruit is yellow and curved?', o: ['Banana', 'Apple', 'Grape', 'Orange'], a: 'Banana' },
    { q: 'What is hot?', o: ['Sun', 'Ice', 'Snow', 'Moon'], a: 'Sun' },
    { q: 'Which is a color?', o: ['Red', 'Run', 'Jump', 'Big'], a: 'Red' },
    { q: 'What letter does "Cat" start with?', o: ['C', 'A', 'B', 'D'], a: 'C' },
    { q: '1 + 1 = ?', o: ['2', '3', '1', '4'], a: '2' },
    { q: 'What falls from clouds?', o: ['Rain', 'Stars', 'Sand', 'Leaves'], a: 'Rain' },
    { q: 'Which is cold?', o: ['Ice cream', 'Fire', 'Sun', 'Oven'], a: 'Ice cream' },
    { q: 'What animal is black and white and says "neigh"?', o: ['Zebra', 'Lion', 'Bear', 'Frog'], a: 'Zebra' },
    { q: 'Count: 1, 2, 3, ___', o: ['4', '5', '6', '2'], a: '4' },
    { q: 'What letter does "Dog" start with?', o: ['D', 'B', 'C', 'A'], a: 'D' },
    { q: 'Which one can fly?', o: ['Bird', 'Fish', 'Dog', 'Snake'], a: 'Bird' },
    { q: 'What is 2 + 1?', o: ['3', '4', '2', '5'], a: '3' },
    { q: 'What grows in a garden?', o: ['Flowers', 'Rocks', 'Cars', 'Shoes'], a: 'Flowers' },
    { q: 'How many wheels does a car have?', o: ['4', '2', '6', '3'], a: '4' },
    { q: 'Which season has snow?', o: ['Winter', 'Summer', 'Spring', 'Fall'], a: 'Winter' },
    { q: 'What do you drink?', o: ['Water', 'Rocks', 'Sand', 'Paper'], a: 'Water' },
    { q: 'What letter does "Sun" start with?', o: ['S', 'A', 'B', 'C'], a: 'S' },
    { q: 'Which is a shape?', o: ['Square', 'Blue', 'Happy', 'Fast'], a: 'Square' },
    { q: 'What goes "woof"?', o: ['Dog', 'Cat', 'Fish', 'Bird'], a: 'Dog' },
    { q: 'What is 3 - 1?', o: ['2', '3', '1', '4'], a: '2' },
    { q: 'Where do fish live?', o: ['Water', 'Sky', 'Tree', 'House'], a: 'Water' },
  ],
  G1: [
    { q: 'What is 5 + 3?', o: ['8', '7', '9', '6'], a: '8' },
    { q: 'What is 10 - 4?', o: ['6', '5', '7', '8'], a: '6' },
    { q: 'Which word means "happy"?', o: ['Joyful', 'Sad', 'Angry', 'Tired'], a: 'Joyful' },
    { q: 'How many sides does a triangle have?', o: ['3', '4', '5', '6'], a: '3' },
    { q: 'What is the opposite of "big"?', o: ['Small', 'Tall', 'Fast', 'Hot'], a: 'Small' },
    { q: 'What comes next: 2, 4, 6, ___?', o: ['8', '7', '9', '10'], a: '8' },
    { q: 'Which is a living thing?', o: ['Tree', 'Rock', 'Chair', 'Book'], a: 'Tree' },
    { q: 'What is 7 + 2?', o: ['9', '8', '10', '11'], a: '9' },
    { q: 'How many months are in a year?', o: ['12', '10', '6', '24'], a: '12' },
    { q: 'What sound does a cat make?', o: ['Meow', 'Woof', 'Moo', 'Quack'], a: 'Meow' },
    { q: 'What is 15 - 8?', o: ['7', '6', '8', '9'], a: '7' },
    { q: 'Which is a noun?', o: ['Dog', 'Run', 'Quick', 'Very'], a: 'Dog' },
    { q: 'What season comes after summer?', o: ['Fall', 'Winter', 'Spring', 'Summer'], a: 'Fall' },
    { q: 'What is 9 + 6?', o: ['15', '14', '16', '13'], a: '15' },
    { q: 'What color do you get mixing red and blue?', o: ['Purple', 'Green', 'Orange', 'Brown'], a: 'Purple' },
    { q: 'Which is heavier?', o: ['Car', 'Feather', 'Leaf', 'Paper'], a: 'Car' },
    { q: 'How many cents in a dime?', o: ['10', '5', '25', '100'], a: '10' },
    { q: 'What is 20 - 7?', o: ['13', '12', '14', '15'], a: '13' },
    { q: 'Which animal lives in water?', o: ['Fish', 'Cat', 'Dog', 'Bird'], a: 'Fish' },
    { q: 'What is a baby dog called?', o: ['Puppy', 'Kitten', 'Calf', 'Foal'], a: 'Puppy' },
    { q: 'What is 4 × 2?', o: ['8', '6', '10', '12'], a: '8' },
    { q: 'What is the color of grass?', o: ['Green', 'Blue', 'Red', 'Yellow'], a: 'Green' },
    { q: 'Which direction is down?', o: ['↓', '↑', '→', '←'], a: '↓' },
    { q: 'What is 11 + 5?', o: ['16', '15', '17', '14'], a: '16' },
    { q: 'How many days in a week?', o: ['7', '5', '10', '12'], a: '7' },
    { q: 'What is the opposite of "hot"?', o: ['Cold', 'Warm', 'Fast', 'Big'], a: 'Cold' },
    { q: 'Which shape has 4 equal sides?', o: ['Square', 'Triangle', 'Circle', 'Pentagon'], a: 'Square' },
    { q: 'What is 8 - 3?', o: ['5', '4', '6', '7'], a: '5' },
    { q: 'What do bees make?', o: ['Honey', 'Milk', 'Juice', 'Bread'], a: 'Honey' },
    { q: 'How many legs does a spider have?', o: ['8', '6', '4', '10'], a: '8' },
  ],
  G2: [
    { q: 'What is 14 + 8?', o: ['22', '20', '24', '21'], a: '22' },
    { q: 'What is 36 - 15?', o: ['21', '22', '20', '23'], a: '21' },
    { q: 'What is 5 × 3?', o: ['15', '12', '18', '20'], a: '15' },
    { q: 'Which planet do we live on?', o: ['Earth', 'Mars', 'Jupiter', 'Venus'], a: 'Earth' },
    { q: 'What is a polygon with 6 sides?', o: ['Hexagon', 'Pentagon', 'Octagon', 'Square'], a: 'Hexagon' },
    { q: 'What gas do we breathe in?', o: ['Oxygen', 'Carbon dioxide', 'Nitrogen', 'Helium'], a: 'Oxygen' },
    { q: 'What is 72 ÷ 8?', o: ['9', '8', '7', '10'], a: '9' },
    { q: 'How many continents are there?', o: ['7', '5', '6', '8'], a: '7' },
    { q: 'What is the freezing point of water in °C?', o: ['0', '100', '50', '32'], a: '0' },
    { q: 'What is 9 × 4?', o: ['36', '32', '40', '45'], a: '36' },
    { q: 'Which is a mammal?', o: ['Whale', 'Shark', 'Snake', 'Eagle'], a: 'Whale' },
    { q: 'What is 100 ÷ 10?', o: ['10', '5', '20', '100'], a: '10' },
    { q: 'What is the largest ocean?', o: ['Pacific', 'Atlantic', 'Indian', 'Arctic'], a: 'Pacific' },
    { q: 'How many zeros in one hundred?', o: ['2', '1', '3', '0'], a: '2' },
    { q: 'What is 25 × 4?', o: ['100', '80', '120', '75'], a: '100' },
    { q: 'Which force keeps us on the ground?', o: ['Gravity', 'Friction', 'Magnetism', 'Electricity'], a: 'Gravity' },
    { q: 'What is 48 ÷ 6?', o: ['8', '7', '9', '6'], a: '8' },
    { q: 'What part of a plant absorbs water?', o: ['Roots', 'Leaves', 'Stem', 'Flower'], a: 'Roots' },
    { q: 'What is 15 + 27?', o: ['42', '41', '43', '40'], a: '42' },
    { q: 'How many hours in a day?', o: ['24', '12', '48', '36'], a: '24' },
    { q: 'What is 6 × 7?', o: ['42', '36', '48', '49'], a: '42' },
    { q: 'What type of rock is formed by volcanoes?', o: ['Igneous', 'Sedimentary', 'Metamorphic', 'Limestone'], a: 'Igneous' },
    { q: 'What is 90 - 37?', o: ['53', '52', '54', '55'], a: '53' },
    { q: 'What do roots do?', o: ['Absorb water', 'Make food', 'Produce seeds', 'Attract bees'], a: 'Absorb water' },
    { q: 'What is 8 × 8?', o: ['64', '56', '72', '48'], a: '64' },
    { q: 'How many legs does an insect have?', o: ['6', '8', '4', '10'], a: '6' },
    { q: 'What is 144 ÷ 12?', o: ['12', '11', '13', '14'], a: '12' },
    { q: 'Which is a renewable resource?', o: ['Solar energy', 'Coal', 'Oil', 'Natural gas'], a: 'Solar energy' },
    { q: 'What is 3 × 9?', o: ['27', '24', '30', '21'], a: '27' },
    { q: 'What layer of the atmosphere do we live in?', o: ['Troposphere', 'Stratosphere', 'Mesosphere', 'Exosphere'], a: 'Troposphere' },
  ],
  G3: [
    { q: 'What is 12 × 8?', o: ['96', '88', '104', '92'], a: '96' },
    { q: 'What is 144 ÷ 12?', o: ['12', '11', '13', '14'], a: '12' },
    { q: 'What is 72 ÷ 9?', o: ['8', '7', '9', '6'], a: '8' },
    { q: 'What is the capital of Egypt?', o: ['Cairo', 'Alexandria', 'Giza', 'Luxor'], a: 'Cairo' },
    { q: 'How many sides does a hexagon have?', o: ['6', '5', '7', '8'], a: '6' },
    { q: 'What gas do plants absorb?', o: ['Carbon dioxide', 'Oxygen', 'Nitrogen', 'Helium'], a: 'Carbon dioxide' },
    { q: 'What is 15 × 6?', o: ['90', '84', '96', '78'], a: '90' },
    { q: 'Which planet is the largest?', o: ['Jupiter', 'Saturn', 'Neptune', 'Earth'], a: 'Jupiter' },
    { q: 'What is 56 ÷ 8?', o: ['7', '6', '8', '9'], a: '7' },
    { q: 'What continent is Egypt in?', o: ['Africa', 'Asia', 'Europe', 'America'], a: 'Africa' },
    { q: 'What is 250 ÷ 5?', o: ['50', '45', '55', '60'], a: '50' },
    { q: 'Which animal is a reptile?', o: ['Snake', 'Dog', 'Fish', 'Bird'], a: 'Snake' },
    { q: 'What is 9 × 11?', o: ['99', '89', '109', '91'], a: '99' },
    { q: 'How many centimeters in a meter?', o: ['100', '10', '1000', '50'], a: '100' },
    { q: 'What is 360 ÷ 6?', o: ['60', '50', '70', '55'], a: '60' },
    { q: 'What type of rock has layers?', o: ['Sedimentary', 'Igneous', 'Metamorphic', 'Granite'], a: 'Sedimentary' },
    { q: 'What is 17 × 4?', o: ['68', '64', '72', '76'], a: '68' },
    { q: 'What is the largest desert on Earth?', o: ['Sahara', 'Gobi', 'Kalahari', 'Arabian'], a: 'Sahara' },
    { q: 'What is 85 - 39?', o: ['46', '44', '48', '42'], a: '46' },
    { q: 'How many bones does an adult human have?', o: ['206', '150', '300', '180'], a: '206' },
    { q: 'What is 13 × 7?', o: ['91', '84', '98', '87'], a: '91' },
    { q: 'What is the boiling point of water in °C?', o: ['100', '0', '50', '212'], a: '100' },
    { q: 'What is 200 ÷ 8?', o: ['25', '20', '30', '24'], a: '25' },
    { q: 'Which continent has the most countries?', o: ['Africa', 'Asia', 'Europe', 'South America'], a: 'Africa' },
    { q: 'What is 15²?', o: ['225', '200', '250', '215'], a: '225' },
    { q: 'What is a group of fish called?', o: ['School', 'Pack', 'Herd', 'Flock'], a: 'School' },
    { q: 'What is 48 ÷ 6?', o: ['8', '7', '9', '6'], a: '8' },
    { q: 'Which organ pumps blood?', o: ['Heart', 'Brain', 'Lung', 'Liver'], a: 'Heart' },
    { q: 'What is 345 + 267?', o: ['612', '602', '622', '610'], a: '612' },
    { q: 'How many vowels in "education"?', o: ['5', '4', '3', '6'], a: '5' },
  ],
  G4: [
    { q: 'What is 3/4 + 1/4?', o: ['1', '2/4', '4/8', '3/8'], a: '1' },
    { q: 'What is 156 × 3?', o: ['468', '458', '478', '448'], a: '468' },
    { q: 'What is 7/8 - 3/8?', o: ['4/8 = 1/2', '3/8', '5/8', '2/8'], a: '4/8 = 1/2' },
    { q: 'What is the equator?', o: ['An imaginary line around the middle of Earth', 'The North Pole', 'A mountain range', 'An ocean'], a: 'An imaginary line around the middle of Earth' },
    { q: 'What is 2.5 + 3.7?', o: ['6.2', '5.2', '7.2', '6.1'], a: '6.2' },
    { q: 'How many degrees in a right angle?', o: ['90', '180', '45', '60'], a: '90' },
    { q: 'What is 450 ÷ 15?', o: ['30', '25', '35', '28'], a: '30' },
    { q: 'Which continent is Australia in?', o: ['Oceania', 'Asia', 'Africa', 'Antarctica'], a: 'Oceania' },
    { q: 'What is 3/5 of 50?', o: ['30', '25', '35', '20'], a: '30' },
    { q: 'What is the longest river in the world?', o: ['Nile', 'Amazon', 'Mississippi', 'Yangtze'], a: 'Nile' },
    { q: 'What is 12²?', o: ['144', '124', '156', '132'], a: '144' },
    { q: 'What is 5/6 × 12?', o: ['10', '8', '12', '6'], a: '10' },
    { q: 'What is the process of water turning to vapor?', o: ['Evaporation', 'Condensation', 'Precipitation', 'Freezing'], a: 'Evaporation' },
    { q: 'What is 9.6 - 4.2?', o: ['5.4', '5.6', '4.4', '6.4'], a: '5.4' },
    { q: 'How many edges does a cube have?', o: ['12', '8', '6', '4'], a: '12' },
    { q: 'What is 7/10 as a decimal?', o: ['0.7', '0.07', '7.0', '0.17'], a: '0.7' },
    { q: 'Which country has the most people?', o: ['India', 'China', 'USA', 'Indonesia'], a: 'India' },
    { q: 'What is 336 ÷ 8?', o: ['42', '40', '44', '38'], a: '42' },
    { q: 'What is the freezing point of water in °F?', o: ['32', '0', '212', '100'], a: '32' },
    { q: 'What is 2/3 + 1/6?', o: ['5/6', '3/6', '3/9', '2/6'], a: '5/6' },
    { q: 'How many states in the USA?', o: ['50', '48', '52', '45'], a: '50' },
    { q: 'What is 18 × 12?', o: ['216', '206', '226', '196'], a: '216' },
    { q: 'What is a line of longitude called?', o: ['Meridian', 'Parallel', 'Equator', 'Tropic'], a: 'Meridian' },
    { q: 'What is 0.25 × 8?', o: ['2', '1.5', '3', '0.2'], a: '2' },
    { q: 'How many faces does a pyramid have?', o: ['5', '4', '6', '3'], a: '5' },
    { q: 'What is the largest organ in the human body?', o: ['Skin', 'Heart', 'Brain', 'Liver'], a: 'Skin' },
    { q: 'What is 45% of 200?', o: ['90', '80', '100', '45'], a: '90' },
    { q: 'What continent is Brazil in?', o: ['South America', 'North America', 'Africa', 'Europe'], a: 'South America' },
    { q: 'What is 1.5 × 4?', o: ['6', '5', '4.5', '7'], a: '6' },
    { q: 'How many zeros in one million?', o: ['6', '5', '7', '8'], a: '6' },
  ],
  G5: [
    { q: 'What is 3/4 × 2/5?', o: ['3/10', '6/20', '5/8', '1/2'], a: '3/10' },
    { q: 'What is 15% of 240?', o: ['36', '30', '40', '24'], a: '36' },
    { q: 'What is the volume of a cube with side 4?', o: ['64', '48', '32', '16'], a: '64' },
    { q: 'What is the Pythagorean theorem?', o: ['a² + b² = c²', 'a + b = c', 'a × b = c', 'a² - b² = c²'], a: 'a² + b² = c²' },
    { q: 'What is 7/8 as a decimal?', o: ['0.875', '0.785', '0.870', '0.750'], a: '0.875' },
    { q: 'What is the chemical formula for water?', o: ['H₂O', 'CO₂', 'O₂', 'NaCl'], a: 'H₂O' },
    { q: 'What is 2³ + 3²?', o: ['17', '13', '15', '20'], a: '17' },
    { q: 'What is the area of a circle formula?', o: ['πr²', '2πr', 'πd', 'r²'], a: 'πr²' },
    { q: 'What is 4.8 ÷ 0.6?', o: ['8', '6', '7', '9'], a: '8' },
    { q: 'What planet is known as the Red Planet?', o: ['Mars', 'Jupiter', 'Venus', 'Mercury'], a: 'Mars' },
    { q: 'What is the square root of 144?', o: ['12', '14', '11', '13'], a: '12' },
    { q: 'What is 3/5 + 2/3?', o: ['19/15', '5/8', '1/2', '6/15'], a: '19/15' },
    { q: 'What is photosynthesis?', o: ['Plants making food from sunlight', 'Animals eating food', 'Water evaporating', 'Rocks forming'], a: 'Plants making food from sunlight' },
    { q: 'What is 250 × 0.04?', o: ['10', '8', '12', '20'], a: '10' },
    { q: 'How many degrees in a triangle?', o: ['180', '360', '90', '270'], a: '180' },
    { q: 'What is 11²?', o: ['121', '111', '131', '101'], a: '121' },
    { q: 'What is the pH of pure water?', o: ['7', '0', '14', '1'], a: '7' },
    { q: 'What is 0.6 × 0.5?', o: ['0.30', '0.35', '0.25', '0.60'], a: '0.30' },
    { q: 'What force opposes motion?', o: ['Friction', 'Gravity', 'Magnetism', 'Inertia'], a: 'Friction' },
    { q: 'What is 72% as a fraction?', o: ['18/25', '7/25', '36/50', '72/100'], a: '18/25' },
    { q: 'What is the perimeter of a rectangle with l=8, w=5?', o: ['26', '40', '13', '30'], a: '26' },
    { q: 'What is 5/6 - 1/3?', o: ['1/2', '4/3', '3/6', '2/6'], a: '1/2' },
    { q: 'What is the nearest star to Earth?', o: ['The Sun', 'Proxima Centauri', 'Sirius', 'Alpha Centauri'], a: 'The Sun' },
    { q: 'What is 3.14 × 10?', o: ['31.4', '314', '3.14', '3140'], a: '31.4' },
    { q: 'How many faces does a cylinder have?', o: ['3', '2', '4', '5'], a: '3' },
    { q: 'What is 1000 ÷ 25?', o: ['40', '50', '25', '60'], a: '40' },
    { q: 'What is an isosceles triangle?', o: ['Triangle with 2 equal sides', 'Triangle with 3 equal sides', 'Triangle with no equal sides', 'Triangle with 1 right angle'], a: 'Triangle with 2 equal sides' },
    { q: 'What is 1/4 of 96?', o: ['24', '12', '48', '32'], a: '24' },
    { q: 'What element has the symbol O?', o: ['Oxygen', 'Gold', 'Iron', 'Silver'], a: 'Oxygen' },
    { q: 'What is the LCM of 4 and 6?', o: ['12', '24', '8', '18'], a: '12' },
  ],
  G6: [
    { q: 'What is -5 + 12?', o: ['7', '-7', '17', '-17'], a: '7' },
    { q: 'Solve: 3x = 24. What is x?', o: ['8', '6', '9', '7'], a: '8' },
    { q: 'What is the ratio 12:16 simplified?', o: ['3:4', '4:3', '6:8', '2:3'], a: '3:4' },
    { q: 'What is a prime number?', o: ['A number divisible only by 1 and itself', 'An even number', 'A number with 3 factors', 'A negative number'], a: 'A number divisible only by 1 and itself' },
    { q: 'What is 2/3 ÷ 1/4?', o: ['8/3', '2/12', '1/6', '3/8'], a: '8/3' },
    { q: 'What is the area of a triangle with base 10 and height 6?', o: ['30', '60', '16', '36'], a: '30' },
    { q: 'What is -3 × (-7)?', o: ['21', '-21', '-10', '10'], a: '21' },
    { q: 'What year did World War II end?', o: ['1945', '1941', '1939', '1918'], a: '1945' },
    { q: 'What is 15% as a fraction?', o: ['3/20', '15/100', '1/5', '3/10'], a: '3/20' },
    { q: 'Solve: x + 5 = 13. What is x?', o: ['8', '7', '9', '6'], a: '8' },
    { q: 'What is the circumference of a circle with radius 7? (Use π = 22/7)', o: ['44', '22', '49', '88'], a: '44' },
    { q: 'What is 0.75 as a percent?', o: ['75%', '7.5%', '0.75%', '750%'], a: '75%' },
    { q: 'Which ancient civilization built the pyramids?', o: ['Egyptians', 'Romans', 'Greeks', 'Persians'], a: 'Egyptians' },
    { q: 'What is the GCF of 18 and 24?', o: ['6', '12', '3', '8'], a: '6' },
    { q: 'What is 4² + 3²?', o: ['25', '7', '49', '14'], a: '25' },
    { q: 'What is absolute value of -15?', o: ['15', '-15', '0', '30'], a: '15' },
    { q: 'What continent has the most people?', o: ['Asia', 'Africa', 'Europe', 'South America'], a: 'Asia' },
    { q: 'What is 1/2 + 3/4?', o: ['5/4', '4/6', '3/6', '2/4'], a: '5/4' },
    { q: 'What is the slope of y = 2x + 3?', o: ['2', '3', '5', '1'], a: '2' },
    { q: 'How many vertices does a cube have?', o: ['8', '6', '12', '4'], a: '8' },
    { q: 'What is 6! (6 factorial)?', o: ['720', '360', '120', '48'], a: '720' },
    { q: 'What is -8 - (-3)?', o: ['-5', '-11', '5', '11'], a: '-5' },
    { q: 'What is the speed of light approximately?', o: ['300,000 km/s', '150,000 km/s', '500,000 km/s', '100,000 km/s'], a: '300,000 km/s' },
    { q: 'What is 3/5 of 120?', o: ['72', '60', '80', '48'], a: '72' },
    { q: 'What is the value of π to 2 decimal places?', o: ['3.14', '3.41', '3.12', '3.16'], a: '3.14' },
    { q: 'Solve: 2x - 4 = 10. What is x?', o: ['7', '6', '8', '5'], a: '7' },
    { q: 'What is the number system with base 2 called?', o: ['Binary', 'Decimal', 'Hexadecimal', 'Octal'], a: 'Binary' },
    { q: 'What is the surface area of a cube with side 3?', o: ['54', '27', '36', '18'], a: '54' },
    { q: 'What civilization invented the alphabet?', o: ['Phoenicians', 'Romans', 'Greeks', 'Chinese'], a: 'Phoenicians' },
    { q: 'What is the median of 3, 7, 9, 1, 5?', o: ['5', '7', '3', '9'], a: '5' },
  ],
};

// ─── Dynamic questions from math bank ─────────────────────────────────────
function getDynamicMath(grade, count = 10) {
  try {
    const gradeCode = grade === 'KG' ? 'K' : grade.replace('G', '');
    const quiz = getMathQuiz(gradeCode, count);
    if (!quiz || !Array.isArray(quiz)) return [];
    return quiz.map((q) => ({
      question: q.question,
      options: shuffleArray(q.options || [q.correct, q.distractor1, q.distractor2, q.distractor3].filter(Boolean)),
      correct: q.correct,
    }));
  } catch {
    return [];
  }
}

// ─── Public API ────────────────────────────────────────────────────────────
export function getQuestionsForGrade(grade, count = 10) {
  const embedded = shuffleArray(BANK[grade] || BANK.G3).slice(0, count);
  const dynamic = getDynamicMath(grade, count);

  // Merge: take embedded questions, fill remaining slots from dynamic bank
  const result = embedded.map((q) => ({
    question: q.q,
    options: shuffleArray(q.o),
    correct: q.a,
  }));

  if (dynamic.length > 0) {
    const needed = Math.max(0, count - result.length);
    result.push(...dynamic.slice(0, needed));
  }

  return shuffleArray(result);
}

export function getSubjectsForGrade(grade) {
  const gradeInfo = GRADES.find((g) => g.id === grade) || GRADES[3];
  return [
    { id: 'math', name: 'Mathematics', icon: '🧮', desc: `Math for ${gradeInfo.label}` },
    { id: 'reading', name: 'Reading', icon: '📖', desc: `Reading & English` },
    { id: 'science', name: 'Science', icon: '🔬', desc: `Science Discovery` },
    { id: 'social', name: 'Social Studies', icon: '🌍', desc: `World & Geography` },
  ];
}
