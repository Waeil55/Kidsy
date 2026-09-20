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

// ─── Embedded fallback questions per grade (50+ each) ──────────────────────
const BANK = {
  KG: [
    // Alphabet recognition
    { q: 'What letter does "Apple" start with?', o: ['A', 'B', 'C', 'D'], a: 'A' },
    { q: 'What letter does "Ball" start with?', o: ['B', 'A', 'C', 'D'], a: 'B' },
    { q: 'What letter does "Cat" start with?', o: ['C', 'A', 'B', 'D'], a: 'C' },
    { q: 'What letter does "Dog" start with?', o: ['D', 'B', 'C', 'A'], a: 'D' },
    { q: 'What letter does "Sun" start with?', o: ['S', 'A', 'B', 'C'], a: 'S' },
    { q: 'What letter does "Fish" start with?', o: ['F', 'G', 'H', 'J'], a: 'F' },
    { q: 'What letter does "Grape" start with?', o: ['G', 'H', 'J', 'K'], a: 'G' },
    { q: 'What letter does "Hat" start with?', o: ['H', 'I', 'J', 'K'], a: 'H' },
    // Letter sounds
    { q: 'What sound does "B" make?', o: ['buh', 'kuh', 'duh', 'fuh'], a: 'buh' },
    { q: 'What sound does "S" make?', o: ['sss', 'mmm', 'ttt', 'ppp'], a: 'sss' },
    { q: 'What sound does "M" make?', o: ['mmm', 'nnn', 'lll', 'rrr'], a: 'mmm' },
    { q: 'What letter makes the "fff" sound?', o: ['F', 'S', 'T', 'P'], a: 'F' },
    { q: 'What letter makes the "tuh" sound?', o: ['T', 'D', 'B', 'K'], a: 'T' },
    // Counting 1-20
    { q: 'How many fingers do you have on one hand?', o: ['5', '3', '10', '4'], a: '5' },
    { q: 'What comes after 1?', o: ['2', '3', '0', '5'], a: '2' },
    { q: 'Count: 1, 2, 3, ___', o: ['4', '5', '6', '2'], a: '4' },
    { q: 'How many legs does a dog have?', o: ['4', '2', '6', '3'], a: '4' },
    { q: 'What is 2 + 1?', o: ['3', '4', '2', '5'], a: '3' },
    { q: 'What is 3 - 1?', o: ['2', '3', '1', '4'], a: '2' },
    { q: 'How many wheels does a car have?', o: ['4', '2', '6', '3'], a: '4' },
    { q: 'Count: 5, 6, 7, ___', o: ['8', '9', '10', '4'], a: '8' },
    { q: 'How many eyes do you have?', o: ['2', '1', '3', '4'], a: '2' },
    { q: 'What is 1 + 1?', o: ['2', '3', '1', '4'], a: '2' },
    { q: 'How many legs does a spider have?', o: ['8', '6', '4', '10'], a: '8' },
    // Shapes
    { q: 'What shape is a ball?', o: ['Circle', 'Square', 'Triangle', 'Star'], a: 'Circle' },
    { q: 'Which is a shape?', o: ['Square', 'Blue', 'Happy', 'Fast'], a: 'Square' },
    { q: 'How many sides does a triangle have?', o: ['3', '4', '5', '6'], a: '3' },
    { q: 'What shape has 4 equal sides?', o: ['Square', 'Circle', 'Triangle', 'Star'], a: 'Square' },
    { q: 'Which shape has 3 sides?', o: ['Triangle', 'Square', 'Circle', 'Rectangle'], a: 'Triangle' },
    // Colors
    { q: 'What color is the sky?', o: ['Blue', 'Green', 'Red', 'Yellow'], a: 'Blue' },
    { q: 'Which is a color?', o: ['Red', 'Run', 'Jump', 'Big'], a: 'Red' },
    { q: 'What color is grass?', o: ['Green', 'Blue', 'Red', 'Yellow'], a: 'Green' },
    { q: 'What color is the sun?', o: ['Yellow', 'Blue', 'Green', 'Purple'], a: 'Yellow' },
    { q: 'What color are ripe strawberries?', o: ['Red', 'Blue', 'Green', 'Yellow'], a: 'Red' },
    // Patterns
    { q: 'What comes next: red, blue, red, blue, ___?', o: ['red', 'blue', 'green', 'yellow'], a: 'red' },
    { q: 'What comes next: up, down, up, down, ___?', o: ['up', 'down', 'left', 'right'], a: 'up' },
    { q: 'What comes next: cat, dog, cat, dog, ___?', o: ['cat', 'dog', 'mouse', 'rabbit'], a: 'cat' },
    // Opposite words
    { q: 'What is the opposite of "big"?', o: ['Small', 'Tall', 'Fast', 'Hot'], a: 'Small' },
    { q: 'What is the opposite of "hot"?', o: ['Cold', 'Warm', 'Fast', 'Big'], a: 'Cold' },
    { q: 'What is the opposite of "up"?', o: ['Down', 'Left', 'Right', 'In'], a: 'Down' },
    { q: 'What is the opposite of "happy"?', o: ['Sad', 'Angry', 'Sleepy', 'Hungry'], a: 'Sad' },
    { q: 'What is the opposite of "fast"?', o: ['Slow', 'Quick', 'Tall', 'Short'], a: 'Slow' },
    // Rhyming words
    { q: 'Which word rhymes with "cat"?', o: ['Bat', 'Car', 'Cup', 'Cot'], a: 'Bat' },
    { q: 'Which word rhymes with "dog"?', o: ['Frog', 'Dig', 'Dug', 'Dad'], a: 'Frog' },
    { q: 'Which word rhymes with "sun"?', o: ['Fun', 'Fan', 'Fin', 'Fog'], a: 'Fun' },
    // General knowledge
    { q: 'Which animal says "moo"?', o: ['Cow', 'Dog', 'Cat', 'Bird'], a: 'Cow' },
    { q: 'What fruit is yellow and curved?', o: ['Banana', 'Apple', 'Grape', 'Orange'], a: 'Banana' },
    { q: 'What is hot?', o: ['Sun', 'Ice', 'Snow', 'Moon'], a: 'Sun' },
    { q: 'What falls from clouds?', o: ['Rain', 'Stars', 'Sand', 'Leaves'], a: 'Rain' },
    { q: 'Which is cold?', o: ['Ice cream', 'Fire', 'Sun', 'Oven'], a: 'Ice cream' },
    { q: 'What animal is black and white and says "neigh"?', o: ['Zebra', 'Lion', 'Bear', 'Frog'], a: 'Zebra' },
    { q: 'Which one can fly?', o: ['Bird', 'Fish', 'Dog', 'Snake'], a: 'Bird' },
    { q: 'What grows in a garden?', o: ['Flowers', 'Rocks', 'Cars', 'Shoes'], a: 'Flowers' },
    { q: 'Which season has snow?', o: ['Winter', 'Summer', 'Spring', 'Fall'], a: 'Winter' },
    { q: 'What do you drink?', o: ['Water', 'Rocks', 'Sand', 'Paper'], a: 'Water' },
    { q: 'What goes "woof"?', o: ['Dog', 'Cat', 'Fish', 'Bird'], a: 'Dog' },
    { q: 'Where do fish live?', o: ['Water', 'Sky', 'Tree', 'House'], a: 'Water' },
    { q: 'Which is big?', o: ['Elephant', 'Ant', 'Bee', 'Mouse'], a: 'Elephant' },
  ],

  G1: [
    // Addition/subtraction within 20
    { q: 'What is 5 + 3?', o: ['8', '7', '9', '6'], a: '8' },
    { q: 'What is 10 - 4?', o: ['6', '5', '7', '8'], a: '6' },
    { q: 'What is 7 + 2?', o: ['9', '8', '10', '11'], a: '9' },
    { q: 'What is 15 - 8?', o: ['7', '6', '8', '9'], a: '7' },
    { q: 'What is 9 + 6?', o: ['15', '14', '16', '13'], a: '15' },
    { q: 'What is 20 - 7?', o: ['13', '12', '14', '15'], a: '13' },
    { q: 'What is 11 + 5?', o: ['16', '15', '17', '14'], a: '16' },
    { q: 'What is 8 - 3?', o: ['5', '4', '6', '7'], a: '5' },
    { q: 'What is 6 + 9?', o: ['15', '14', '16', '13'], a: '15' },
    { q: 'What is 18 - 5?', o: ['13', '12', '14', '11'], a: '13' },
    { q: 'What is 4 + 8?', o: ['12', '11', '13', '10'], a: '12' },
    { q: 'What is 14 - 6?', o: ['8', '7', '9', '10'], a: '8' },
    // Sight words
    { q: 'Which word means "happy"?', o: ['Joyful', 'Sad', 'Angry', 'Tired'], a: 'Joyful' },
    { q: 'What is the opposite of "big"?', o: ['Small', 'Tall', 'Fast', 'Hot'], a: 'Small' },
    { q: 'What is the opposite of "hot"?', o: ['Cold', 'Warm', 'Fast', 'Big'], a: 'Cold' },
    { q: 'Which word means "very large"?', o: ['Huge', 'Tiny', 'Short', 'Thin'], a: 'Huge' },
    { q: 'Which word means "not fast"?', o: ['Slow', 'Quick', 'Rapid', 'Speedy'], a: 'Slow' },
    // CVC words
    { q: 'Which is a CVC word?', o: ['Cat', 'They', 'Jump', 'Ball'], a: 'Cat' },
    { q: 'What word do these letters make: d-o-g?', o: ['Dog', 'Dig', 'Dug', 'Dot'], a: 'Dog' },
    { q: 'What word do these letters make: p-e-n?', o: ['Pen', 'Pin', 'Pan', 'Pun'], a: 'Pen' },
    // Phonics (ch, sh, th, ck, oo, ee)
    { q: 'What sound does "sh" make?', o: ['shh', 'chh', 'thh', 'ckh'], a: 'shh' },
    { q: 'Which word starts with "ch"?', o: ['Chip', 'Ship', 'Thin', 'Pick'], a: 'Chip' },
    { q: 'Which word has "th" in it?', o: ['This', 'Chin', 'Shop', 'Pick'], a: 'This' },
    { q: 'Which word ends with "ck"?', o: ['Duck', 'Dish', 'Chin', 'Peel'], a: 'Duck' },
    { q: 'What does "oo" say in "moon"?', o: ['oo (long)', 'o (short)', 'ow', 'ou'], a: 'oo (long)' },
    { q: 'Which word has "ee" in it?', o: ['Tree', 'Top', 'Cup', 'Dog'], a: 'Tree' },
    // Blends (bl, cr, st)
    { q: 'Which word starts with "bl"?', o: ['Blue', 'Crab', 'Star', 'Stop'], a: 'Blue' },
    { q: 'Which word starts with "cr"?', o: ['Crab', 'Blow', 'Stop', 'Star'], a: 'Crab' },
    { q: 'Which word starts with "st"?', o: ['Star', 'Blue', 'Crab', 'Play'], a: 'Star' },
    // Number bonds
    { q: 'What two numbers make 10?', o: ['5 and 5', '3 and 3', '2 and 2', '4 and 4'], a: '5 and 5' },
    { q: 'What is 7 + ___ = 10?', o: ['3', '2', '4', '1'], a: '3' },
    { q: 'What is ___ + 6 = 10?', o: ['4', '3', '5', '2'], a: '4' },
    // Place value tens/ones
    { q: 'How many tens are in the number 30?', o: ['3', '30', '0', '300'], a: '3' },
    { q: 'In the number 25, what digit is in the tens place?', o: ['2', '5', '25', '7'], a: '2' },
    { q: 'In the number 47, what digit is in the ones place?', o: ['7', '4', '11', '47'], a: '7' },
    // Other
    { q: 'How many sides does a triangle have?', o: ['3', '4', '5', '6'], a: '3' },
    { q: 'What comes next: 2, 4, 6, ___?', o: ['8', '7', '9', '10'], a: '8' },
    { q: 'Which is a living thing?', o: ['Tree', 'Rock', 'Chair', 'Book'], a: 'Tree' },
    { q: 'How many months are in a year?', o: ['12', '10', '6', '24'], a: '12' },
    { q: 'What sound does a cat make?', o: ['Meow', 'Woof', 'Moo', 'Quack'], a: 'Meow' },
    { q: 'Which is a noun?', o: ['Dog', 'Run', 'Quick', 'Very'], a: 'Dog' },
    { q: 'What season comes after summer?', o: ['Fall', 'Winter', 'Spring', 'Summer'], a: 'Fall' },
    { q: 'What color do you get mixing red and blue?', o: ['Purple', 'Green', 'Orange', 'Brown'], a: 'Purple' },
    { q: 'Which is heavier?', o: ['Car', 'Feather', 'Leaf', 'Paper'], a: 'Car' },
    { q: 'How many cents in a dime?', o: ['10', '5', '25', '100'], a: '10' },
    { q: 'Which animal lives in water?', o: ['Fish', 'Cat', 'Dog', 'Bird'], a: 'Fish' },
    { q: 'What is a baby dog called?', o: ['Puppy', 'Kitten', 'Calf', 'Foal'], a: 'Puppy' },
    { q: 'What is the color of grass?', o: ['Green', 'Blue', 'Red', 'Yellow'], a: 'Green' },
    { q: 'How many days in a week?', o: ['7', '5', '10', '12'], a: '7' },
    { q: 'Which shape has 4 equal sides?', o: ['Square', 'Triangle', 'Circle', 'Pentagon'], a: 'Square' },
    { q: 'What do bees make?', o: ['Honey', 'Milk', 'Juice', 'Bread'], a: 'Honey' },
  ],

  G2: [
    // Addition/subtraction within 100
    { q: 'What is 14 + 8?', o: ['22', '20', '24', '21'], a: '22' },
    { q: 'What is 36 - 15?', o: ['21', '22', '20', '23'], a: '21' },
    { q: 'What is 15 + 27?', o: ['42', '41', '43', '40'], a: '42' },
    { q: 'What is 90 - 37?', o: ['53', '52', '54', '55'], a: '53' },
    { q: 'What is 45 + 38?', o: ['83', '82', '84', '81'], a: '83' },
    { q: 'What is 72 - 29?', o: ['43', '44', '42', '41'], a: '43' },
    { q: 'What is 56 + 17?', o: ['73', '72', '74', '71'], a: '73' },
    { q: 'What is 100 - 45?', o: ['55', '54', '56', '53'], a: '55' },
    // Skip counting
    { q: 'Count by 5s: 5, 10, 15, ___', o: ['20', '18', '22', '25'], a: '20' },
    { q: 'Count by 10s: 10, 20, 30, ___', o: ['40', '35', '45', '50'], a: '40' },
    { q: 'Count by 2s: 2, 4, 6, 8, ___', o: ['10', '9', '11', '12'], a: '10' },
    { q: 'What is 5 x 3?', o: ['15', '12', '18', '20'], a: '15' },
    { q: 'What is 9 x 4?', o: ['36', '32', '40', '45'], a: '36' },
    // Phonics digraphs
    { q: 'Which word has a digraph "sh"?', o: ['Shop', 'Stop', 'Chip', 'Pick'], a: 'Shop' },
    { q: 'Which word has "ch" in the middle?', o: ['Chicken', 'Shell', 'Thin', 'Stick'], a: 'Chicken' },
    { q: 'What does "ph" say in "phone"?', o: ['f', 'p', 'ph', 'h'], a: 'f' },
    // Compound words
    { q: 'What do "sun" + "flower" make?', o: ['Sunflower', 'Sunlight', 'Flower', 'Daylight'], a: 'Sunflower' },
    { q: 'What do "butter" + "fly" make?', o: ['Butterfly', 'Butter', 'Fly', 'Firefly'], a: 'Butterfly' },
    { q: 'What do "rain" + "bow" make?', o: ['Rainbow', 'Raindrop', 'Bow', 'Raincoat'], a: 'Rainbow' },
    // Contractions
    { q: 'What is the contraction for "do not"?', o: ["don't", "didn't", "wasn't", "can't"], a: "don't" },
    { q: 'What is the contraction for "I am"?', o: ["I'm", "Ill", "Im", "Ive"], a: "I'm" },
    { q: 'What is the contraction for "it is"?', o: ["it's", "its", "ist", "its'"], a: "it's" },
    // Measurement basics
    { q: 'How many inches in a foot?', o: ['12', '10', '6', '24'], a: '12' },
    { q: 'Which tool measures weight?', o: ['Scale', 'Ruler', 'Thermometer', 'Clock'], a: 'Scale' },
    { q: 'Which unit measures length?', o: ['Inches', 'Pounds', 'Cups', 'Seconds'], a: 'Inches' },
    // Money counting
    { q: 'How many cents in a quarter?', o: ['25', '10', '5', '50'], a: '25' },
    { q: 'What is 3 quarters + 1 dime?', o: ['85 cents', '75 cents', '45 cents', '90 cents'], a: '85 cents' },
    { q: 'How many pennies make a nickel?', o: ['5', '10', '25', '2'], a: '5' },
    // Time telling
    { q: 'How many minutes in an hour?', o: ['60', '30', '100', '120'], a: '60' },
    { q: 'What time is it when the short hand is on 3 and long hand on 12?', o: ['3:00', '12:30', '3:30', '12:00'], a: '3:00' },
    { q: 'How many hours in a day?', o: ['24', '12', '48', '36'], a: '24' },
    // Other
    { q: 'What is 72 / 8?', o: ['9', '8', '7', '10'], a: '9' },
    { q: 'Which planet do we live on?', o: ['Earth', 'Mars', 'Jupiter', 'Venus'], a: 'Earth' },
    { q: 'What is a polygon with 6 sides?', o: ['Hexagon', 'Pentagon', 'Octagon', 'Square'], a: 'Hexagon' },
    { q: 'What gas do we breathe in?', o: ['Oxygen', 'Carbon dioxide', 'Nitrogen', 'Helium'], a: 'Oxygen' },
    { q: 'How many continents are there?', o: ['7', '5', '6', '8'], a: '7' },
    { q: 'What is the freezing point of water in Celsius?', o: ['0', '100', '50', '32'], a: '0' },
    { q: 'Which is a mammal?', o: ['Whale', 'Shark', 'Snake', 'Eagle'], a: 'Whale' },
    { q: 'What is 100 / 10?', o: ['10', '5', '20', '100'], a: '10' },
    { q: 'What is the largest ocean?', o: ['Pacific', 'Atlantic', 'Indian', 'Arctic'], a: 'Pacific' },
    { q: 'How many zeros in one hundred?', o: ['2', '1', '3', '0'], a: '2' },
    { q: 'Which force keeps us on the ground?', o: ['Gravity', 'Friction', 'Magnetism', 'Electricity'], a: 'Gravity' },
    { q: 'What part of a plant absorbs water?', o: ['Roots', 'Leaves', 'Stem', 'Flower'], a: 'Roots' },
    { q: 'What type of rock is formed by volcanoes?', o: ['Igneous', 'Sedimentary', 'Metamorphic', 'Limestone'], a: 'Igneous' },
    { q: 'How many legs does an insect have?', o: ['6', '8', '4', '10'], a: '6' },
    { q: 'What is 144 / 12?', o: ['12', '11', '13', '14'], a: '12' },
    { q: 'Which is a renewable resource?', o: ['Solar energy', 'Coal', 'Oil', 'Natural gas'], a: 'Solar energy' },
    { q: 'What is 25 x 4?', o: ['100', '80', '120', '75'], a: '100' },
    { q: 'What is the largest organ in the human body?', o: ['Skin', 'Heart', 'Brain', 'Liver'], a: 'Skin' },
    { q: 'Which is a reptile?', o: ['Lizard', 'Frog', 'Fish', 'Bird'], a: 'Lizard' },
    { q: 'How many legs does a crab have?', o: ['10', '8', '6', '12'], a: '10' },
    { q: 'What do plants need to grow?', o: ['Sunlight and water', 'Rocks and sand', 'Paper and ink', 'Wind and ice'], a: 'Sunlight and water' },
  ],

  G3: [
    // Multiplication tables 1-12
    { q: 'What is 12 x 8?', o: ['96', '88', '104', '92'], a: '96' },
    { q: 'What is 15 x 6?', o: ['90', '84', '96', '78'], a: '90' },
    { q: 'What is 9 x 11?', o: ['99', '89', '109', '91'], a: '99' },
    { q: 'What is 7 x 9?', o: ['63', '54', '72', '64'], a: '63' },
    { q: 'What is 8 x 7?', o: ['56', '48', '63', '49'], a: '56' },
    { q: 'What is 11 x 11?', o: ['121', '111', '131', '101'], a: '121' },
    { q: 'What is 6 x 9?', o: ['54', '48', '63', '56'], a: '54' },
    { q: 'What is 13 x 4?', o: ['52', '48', '56', '54'], a: '52' },
    // Division basics
    { q: 'What is 144 / 12?', o: ['12', '11', '13', '14'], a: '12' },
    { q: 'What is 72 / 9?', o: ['8', '7', '9', '6'], a: '8' },
    { q: 'What is 56 / 8?', o: ['7', '6', '8', '9'], a: '7' },
    { q: 'What is 360 / 6?', o: ['60', '50', '70', '55'], a: '60' },
    { q: 'What is 48 / 6?', o: ['8', '7', '9', '6'], a: '8' },
    // Fractions intro
    { q: 'What is 1/2 + 1/4?', o: ['3/4', '2/6', '1/6', '2/4'], a: '3/4' },
    { q: 'Which fraction is larger: 1/3 or 1/4?', o: ['1/3', '1/4', 'They are equal', 'Cannot tell'], a: '1/3' },
    { q: 'What is 3/4 of 12?', o: ['9', '8', '6', '3'], a: '9' },
    // Area/perimeter
    { q: 'What is the perimeter of a rectangle with l=5, w=3?', o: ['16', '15', '8', '20'], a: '16' },
    { q: 'What is the area of a rectangle with l=6, w=4?', o: ['24', '20', '10', '12'], a: '24' },
    { q: 'How many square units in a 3x5 rectangle?', o: ['15', '16', '8', '20'], a: '15' },
    // Word problems
    { q: 'Sara has 24 stickers. She gives 8 to Tom. How many does she have left?', o: ['16', '32', '8', '24'], a: '16' },
    { q: 'A box has 6 bags of apples. Each bag has 5 apples. How many apples total?', o: ['30', '11', '36', '25'], a: '30' },
    // Vocabulary
    { q: 'What is the capital of Egypt?', o: ['Cairo', 'Alexandria', 'Giza', 'Luxor'], a: 'Cairo' },
    { q: 'What continent is Egypt in?', o: ['Africa', 'Asia', 'Europe', 'America'], a: 'Africa' },
    { q: 'Which planet is the largest?', o: ['Jupiter', 'Saturn', 'Neptune', 'Earth'], a: 'Jupiter' },
    { q: 'How many centimeters in a meter?', o: ['100', '10', '1000', '50'], a: '100' },
    // Grammar (nouns/verbs/adjectives)
    { q: 'Which word is a noun?', o: ['Book', 'Run', 'Quickly', 'Very'], a: 'Book' },
    { q: 'Which word is a verb?', o: ['Jump', 'Blue', 'Tall', 'Happy'], a: 'Jump' },
    { q: 'Which word is an adjective?', o: ['Beautiful', 'Sing', 'Table', 'Yesterday'], a: 'Beautiful' },
    // Map skills
    { q: 'What does a compass rose show?', o: ['Directions', 'Temperature', 'Distance', 'Elevation'], a: 'Directions' },
    { q: 'What color is water usually on a map?', o: ['Blue', 'Green', 'Brown', 'Yellow'], a: 'Blue' },
    // Other
    { q: 'What gas do plants absorb?', o: ['Carbon dioxide', 'Oxygen', 'Nitrogen', 'Helium'], a: 'Carbon dioxide' },
    { q: 'Which animal is a reptile?', o: ['Snake', 'Dog', 'Fish', 'Bird'], a: 'Snake' },
    { q: 'What type of rock has layers?', o: ['Sedimentary', 'Igneous', 'Metamorphic', 'Granite'], a: 'Sedimentary' },
    { q: 'What is the largest desert on Earth?', o: ['Sahara', 'Gobi', 'Kalahari', 'Arabian'], a: 'Sahara' },
    { q: 'How many bones does an adult human have?', o: ['206', '150', '300', '180'], a: '206' },
    { q: 'What is the boiling point of water in Celsius?', o: ['100', '0', '50', '212'], a: '100' },
    { q: 'Which continent has the most countries?', o: ['Africa', 'Asia', 'Europe', 'South America'], a: 'Africa' },
    { q: 'What is 15 squared?', o: ['225', '200', '250', '215'], a: '225' },
    { q: 'What is a group of fish called?', o: ['School', 'Pack', 'Herd', 'Flock'], a: 'School' },
    { q: 'Which organ pumps blood?', o: ['Heart', 'Brain', 'Lung', 'Liver'], a: 'Heart' },
    { q: 'What is 345 + 267?', o: ['612', '602', '622', '610'], a: '612' },
    { q: 'How many vowels in "education"?', o: ['5', '4', '3', '6'], a: '5' },
    { q: 'What is 17 x 4?', o: ['68', '64', '72', '76'], a: '68' },
    { q: 'What is 85 - 39?', o: ['46', '44', '48', '42'], a: '46' },
    { q: 'What is 25 x 6?', o: ['150', '140', '160', '125'], a: '150' },
    { q: 'What is 144 / 9?', o: ['16', '14', '12', '18'], a: '16' },
    { q: 'What is 9 x 8?', o: ['72', '64', '81', '63'], a: '72' },
    { q: 'What is 3/4 of 20?', o: ['15', '12', '10', '5'], a: '15' },
    { q: 'What is a quadrilateral?', o: ['A 4-sided shape', 'A 3-sided shape', 'A 5-sided shape', 'A circle'], a: 'A 4-sided shape' },
    { q: 'What is 10 x 12?', o: ['120', '110', '130', '100'], a: '120' },
  ],

  G4: [
    // Multi-digit multiplication
    { q: 'What is 156 x 3?', o: ['468', '458', '478', '448'], a: '468' },
    { q: 'What is 18 x 12?', o: ['216', '206', '226', '196'], a: '216' },
    { q: 'What is 24 x 15?', o: ['360', '350', '370', '340'], a: '360' },
    // Long division
    { q: 'What is 450 / 15?', o: ['30', '25', '35', '28'], a: '30' },
    { q: 'What is 336 / 8?', o: ['42', '40', '44', '38'], a: '42' },
    // Decimals intro
    { q: 'What is 2.5 + 3.7?', o: ['6.2', '5.2', '7.2', '6.1'], a: '6.2' },
    { q: 'What is 9.6 - 4.2?', o: ['5.4', '5.6', '4.4', '6.4'], a: '5.4' },
    { q: 'What is 0.25 x 8?', o: ['2', '1.5', '3', '0.2'], a: '2' },
    { q: 'What is 1.5 x 4?', o: ['6', '5', '4.5', '7'], a: '6' },
    // Fractions operations
    { q: 'What is 3/4 + 1/4?', o: ['1', '2/4', '4/8', '3/8'], a: '1' },
    { q: 'What is 7/8 - 3/8?', o: ['4/8 = 1/2', '3/8', '5/8', '2/8'], a: '4/8 = 1/2' },
    { q: 'What is 3/5 of 50?', o: ['30', '25', '35', '20'], a: '30' },
    { q: 'What is 5/6 x 12?', o: ['10', '8', '12', '6'], a: '10' },
    { q: 'What is 7/10 as a decimal?', o: ['0.7', '0.07', '7.0', '0.17'], a: '0.7' },
    { q: 'What is 2/3 + 1/6?', o: ['5/6', '3/6', '3/9', '2/6'], a: '5/6' },
    // Volume
    { q: 'What is the volume of a box 3cm x 4cm x 5cm?', o: ['60 cm3', '12 cm3', '15 cm3', '20 cm3'], a: '60 cm3' },
    { q: 'How many edges does a cube have?', o: ['12', '8', '6', '4'], a: '12' },
    { q: 'How many faces does a pyramid have?', o: ['5', '4', '6', '3'], a: '5' },
    // Coordinates
    { q: 'In (3, 5), which number is the x-coordinate?', o: ['3', '5', '8', '15'], a: '3' },
    { q: 'Where does (0, 0) sit on a grid?', o: ['Origin', 'Top right', 'Bottom left', 'Center'], a: 'Origin' },
    // Mythology
    { q: 'Who is the Greek god of the sea?', o: ['Poseidon', 'Zeus', 'Hades', 'Apollo'], a: 'Poseidon' },
    { q: 'Who flew too close to the sun with wax wings?', o: ['Icarus', 'Hercules', 'Perseus', 'Odysseus'], a: 'Icarus' },
    // Paragraph writing
    { q: 'What is the main idea of a paragraph?', o: ['The key point the author is making', 'The first sentence', 'The last word', 'A supporting detail'], a: 'The key point the author is making' },
    { q: 'Which is a transition word for adding info?', o: ['Furthermore', 'However', 'Therefore', 'Meanwhile'], a: 'Furthermore' },
    // Other
    { q: 'What is the equator?', o: ['An imaginary line around the middle of Earth', 'The North Pole', 'A mountain range', 'An ocean'], a: 'An imaginary line around the middle of Earth' },
    { q: 'How many degrees in a right angle?', o: ['90', '180', '45', '60'], a: '90' },
    { q: 'Which continent is Australia in?', o: ['Oceania', 'Asia', 'Africa', 'Antarctica'], a: 'Oceania' },
    { q: 'What is the longest river in the world?', o: ['Nile', 'Amazon', 'Mississippi', 'Yangtze'], a: 'Nile' },
    { q: 'What is 12 squared?', o: ['144', '124', '156', '132'], a: '144' },
    { q: 'What is the process of water turning to vapor?', o: ['Evaporation', 'Condensation', 'Precipitation', 'Freezing'], a: 'Evaporation' },
    { q: 'Which country has the most people?', o: ['India', 'China', 'USA', 'Indonesia'], a: 'India' },
    { q: 'What is the freezing point of water in Fahrenheit?', o: ['32', '0', '212', '100'], a: '32' },
    { q: 'How many states in the USA?', o: ['50', '48', '52', '45'], a: '50' },
    { q: 'What is a line of longitude called?', o: ['Meridian', 'Parallel', 'Equator', 'Tropic'], a: 'Meridian' },
    { q: 'What is the largest organ in the human body?', o: ['Skin', 'Heart', 'Brain', 'Liver'], a: 'Skin' },
    { q: 'What is 45% of 200?', o: ['90', '80', '100', '45'], a: '90' },
    { q: 'What continent is Brazil in?', o: ['South America', 'North America', 'Africa', 'Europe'], a: 'South America' },
    { q: 'How many zeros in one million?', o: ['6', '5', '7', '8'], a: '6' },
    { q: 'What is 36 x 12?', o: ['432', '422', '442', '412'], a: '432' },
    { q: 'What is 96 / 12?', o: ['8', '7', '9', '6'], a: '8' },
    { q: 'What is 3.5 + 2.8?', o: ['6.3', '5.3', '7.3', '6.2'], a: '6.3' },
    { q: 'What is 4/5 as a decimal?', o: ['0.8', '0.08', '8.0', '0.4'], a: '0.8' },
    { q: 'What is 1/3 + 1/6?', o: ['1/2', '2/9', '1/18', '2/6'], a: '1/2' },
    { q: 'What is the area of a triangle with b=8, h=5?', o: ['20', '40', '13', '25'], a: '20' },
    { q: 'What is 25% of 80?', o: ['20', '25', '15', '30'], a: '20' },
    { q: 'What is 72 / 9?', o: ['8', '7', '9', '6'], a: '8' },
    { q: 'What is 5.5 - 2.3?', o: ['3.2', '3.3', '4.2', '2.3'], a: '3.2' },
    { q: 'What is 3/8 + 1/8?', o: ['1/2', '4/16', '3/64', '4/8'], a: '1/2' },
    { q: 'What is 16 x 14?', o: ['224', '214', '234', '204'], a: '224' },
    { q: 'What is 144 / 12?', o: ['12', '11', '13', '14'], a: '12' },
  ],

  G5: [
    // Order of operations
    { q: 'What is 2 + 3 x 4?', o: ['14', '20', '24', '16'], a: '14' },
    { q: 'What is (6 + 2) x 3?', o: ['24', '18', '14', '20'], a: '24' },
    { q: 'What is 12 / 4 + 5?', o: ['8', '3', '11', '2'], a: '8' },
    // Ratios
    { q: 'What is the ratio 8:12 simplified?', o: ['2:3', '4:6', '3:4', '2:4'], a: '2:3' },
    { q: 'If there are 3 red and 5 blue marbles, what is the ratio of red to total?', o: ['3:8', '5:8', '3:5', '5:3'], a: '3:8' },
    // Percentages
    { q: 'What is 15% of 240?', o: ['36', '30', '40', '24'], a: '36' },
    { q: 'What is 72% as a fraction?', o: ['18/25', '7/25', '36/50', '72/100'], a: '18/25' },
    { q: 'What percent is 45 of 180?', o: ['25%', '20%', '30%', '15%'], a: '25%' },
    // Volume and surface area
    { q: 'What is the volume of a cube with side 4?', o: ['64', '48', '32', '16'], a: '64' },
    { q: 'What is the surface area of a cube with side 3?', o: ['54', '27', '36', '18'], a: '54' },
    { q: 'How many faces does a cylinder have?', o: ['3', '2', '4', '5'], a: '3' },
    // Earth science
    { q: 'What is photosynthesis?', o: ['Plants making food from sunlight', 'Animals eating food', 'Water evaporating', 'Rocks forming'], a: 'Plants making food from sunlight' },
    { q: 'What planet is known as the Red Planet?', o: ['Mars', 'Jupiter', 'Venus', 'Mercury'], a: 'Mars' },
    { q: 'What is the nearest star to Earth?', o: ['The Sun', 'Proxima Centauri', 'Sirius', 'Alpha Centauri'], a: 'The Sun' },
    // Ecosystems
    { q: 'What is a producer in a food chain?', o: ['A plant that makes its own food', 'An animal that eats plants', 'An animal that eats other animals', 'A decomposer'], a: 'A plant that makes its own food' },
    { q: 'What is a carnivore?', o: ['An animal that eats meat', 'An animal that eats plants', 'An omnivore', 'A herbivore'], a: 'An animal that eats meat' },
    // Essay structure
    { q: 'What are the 3 parts of an essay?', o: ['Introduction, body, conclusion', 'Title, body, references', 'Topic, details, summary', 'Beginning, middle, end'], a: 'Introduction, body, conclusion' },
    { q: 'What goes in a thesis statement?', o: ['The main argument of the essay', 'A list of facts', 'The conclusion', 'A quote from a book'], a: 'The main argument of the essay' },
    // Research skills
    { q: 'What is a primary source?', o: ['An original document or artifact', 'A textbook summary', 'An encyclopedia article', 'A blog post'], a: 'An original document or artifact' },
    { q: 'Which is the most reliable source for research?', o: ['Peer-reviewed journal', 'Wikipedia', 'Social media', 'Personal blog'], a: 'Peer-reviewed journal' },
    // Math continued
    { q: 'What is the square root of 144?', o: ['12', '14', '11', '13'], a: '12' },
    { q: 'What is 3/5 + 2/3?', o: ['19/15', '5/8', '1/2', '6/15'], a: '19/15' },
    { q: 'What is 250 x 0.04?', o: ['10', '8', '12', '20'], a: '10' },
    { q: 'How many degrees in a triangle?', o: ['180', '360', '90', '270'], a: '180' },
    { q: 'What is 11 squared?', o: ['121', '111', '131', '101'], a: '121' },
    { q: 'What is the pH of pure water?', o: ['7', '0', '14', '1'], a: '7' },
    { q: 'What is 0.6 x 0.5?', o: ['0.30', '0.35', '0.25', '0.60'], a: '0.30' },
    { q: 'What force opposes motion?', o: ['Friction', 'Gravity', 'Magnetism', 'Inertia'], a: 'Friction' },
    { q: 'What is the perimeter of a rectangle with l=8, w=5?', o: ['26', '40', '13', '30'], a: '26' },
    { q: 'What is 5/6 - 1/3?', o: ['1/2', '4/3', '3/6', '2/6'], a: '1/2' },
    { q: 'What is 3.14 x 10?', o: ['31.4', '314', '3.14', '3140'], a: '31.4' },
    { q: 'What is 1000 / 25?', o: ['40', '50', '25', '60'], a: '40' },
    { q: 'What is an isosceles triangle?', o: ['Triangle with 2 equal sides', 'Triangle with 3 equal sides', 'Triangle with no equal sides', 'Triangle with 1 right angle'], a: 'Triangle with 2 equal sides' },
    { q: 'What is 1/4 of 96?', o: ['24', '12', '48', '32'], a: '24' },
    { q: 'What element has the symbol O?', o: ['Oxygen', 'Gold', 'Iron', 'Silver'], a: 'Oxygen' },
    { q: 'What is the LCM of 4 and 6?', o: ['12', '24', '8', '18'], a: '12' },
    { q: 'What is the area of a circle formula?', o: ['pi x r^2', '2 x pi x r', 'pi x d', 'r^2'], a: 'pi x r^2' },
    { q: 'What is 4.8 / 0.6?', o: ['8', '6', '7', '9'], a: '8' },
    { q: 'What is 2.5 x 0.4?', o: ['1.0', '0.1', '2.1', '10.0'], a: '1.0' },
    { q: 'What is 60% as a fraction?', o: ['3/5', '6/100', '60/1', '30/50'], a: '3/5' },
    { q: 'What is 18% of 50?', o: ['9', '18', '8', '10'], a: '9' },
    { q: 'What is the volume of a rectangular prism 2x3x4?', o: ['24', '14', '9', '48'], a: '24' },
    { q: 'What is the difference between a planet and a star?', o: ['Stars produce light, planets do not', 'Planets are bigger', 'Stars orbit planets', 'They are the same'], a: 'Stars produce light, planets do not' },
    { q: 'What is a food chain?', o: ['A sequence of organisms eating each other', 'A chain made of food', 'A type of fence', 'A cooking recipe'], a: 'A sequence of organisms eating each other' },
    { q: 'What is a thesis statement?', o: ['The main claim of an essay', 'The title of an essay', 'The last sentence', 'A list of sources'], a: 'The main claim of an essay' },
    { q: 'What is 4/5 x 2/3?', o: ['8/15', '6/15', '8/10', '2/5'], a: '8/15' },
    { q: 'What is 3/4 - 1/2?', o: ['1/4', '2/4', '3/8', '1/2'], a: '1/4' },
    { q: 'What is 15 x 15?', o: ['225', '215', '235', '205'], a: '225' },
    { q: 'What is the order of operations acronym?', o: ['PEMDAS', 'BEDMAS', 'BOTH are correct', 'GEOMETRY'], a: 'BOTH are correct' },
    { q: 'What is a consumer in a food chain?', o: ['An organism that eats other organisms', 'A plant', 'A decomposer', 'The Sun'], a: 'An organism that eats other organisms' },
  ],

  G6: [
    // Pre-algebra
    { q: 'Solve: 3x = 24. What is x?', o: ['8', '6', '9', '7'], a: '8' },
    { q: 'Solve: x + 5 = 13. What is x?', o: ['8', '7', '9', '6'], a: '8' },
    { q: 'Solve: 2x - 4 = 10. What is x?', o: ['7', '6', '8', '5'], a: '7' },
    { q: 'What is the slope of y = 2x + 3?', o: ['2', '3', '5', '1'], a: '2' },
    // Integers
    { q: 'What is -5 + 12?', o: ['7', '-7', '17', '-17'], a: '7' },
    { q: 'What is -3 x (-7)?', o: ['21', '-21', '-10', '10'], a: '21' },
    { q: 'What is -8 - (-3)?', o: ['-5', '-11', '5', '11'], a: '-5' },
    { q: 'What is the absolute value of -15?', o: ['15', '-15', '0', '30'], a: '15' },
    // Algebraic expressions
    { q: 'Simplify: 3x + 2x', o: ['5x', '6x', '5', 'x'], a: '5x' },
    { q: 'What is 4(a + b) expanded?', o: ['4a + 4b', '4a + b', 'a + 4b', '4ab'], a: '4a + 4b' },
    { q: 'If x = 3, what is 2x^2 + 1?', o: ['19', '37', '7', '13'], a: '19' },
    // Probability
    { q: 'What is the probability of flipping heads?', o: ['1/2', '1/4', '1', '0'], a: '1/2' },
    { q: 'What is the probability of rolling a 6 on a die?', o: ['1/6', '1/3', '1/2', '6'], a: '1/6' },
    { q: 'If you draw 1 red card from 10 (4 red, 6 blue), what is the probability?', o: ['4/10', '6/10', '1/10', '10/4'], a: '4/10' },
    // Statistics
    { q: 'What is the median of 3, 7, 9, 1, 5?', o: ['5', '7', '3', '9'], a: '5' },
    { q: 'What is the mean of 4, 8, 6, 10?', o: ['7', '8', '6', '9'], a: '7' },
    { q: 'What is the mode of 2, 3, 3, 5, 7?', o: ['3', '2', '5', '4'], a: '3' },
    // Chemistry basics
    { q: 'What is the chemical formula for water?', o: ['H2O', 'CO2', 'O2', 'NaCl'], a: 'H2O' },
    { q: 'What element has the symbol O?', o: ['Oxygen', 'Gold', 'Iron', 'Silver'], a: 'Oxygen' },
    { q: 'What element has the symbol Fe?', o: ['Iron', 'Fluorine', 'Francium', 'Fermium'], a: 'Iron' },
    // World history
    { q: 'Which ancient civilization built the pyramids?', o: ['Egyptians', 'Romans', 'Greeks', 'Persians'], a: 'Egyptians' },
    { q: 'What year did World War II end?', o: ['1945', '1941', '1939', '1918'], a: '1945' },
    { q: 'What civilization invented the alphabet?', o: ['Phoenicians', 'Romans', 'Greeks', 'Chinese'], a: 'Phoenicians' },
    // Debate/persuasive writing
    { q: 'What is a claim in persuasive writing?', o: ['The main argument being made', 'A supporting fact', 'A counter-argument', 'The conclusion'], a: 'The main argument being made' },
    { q: 'What is ethos in rhetoric?', o: ['Appeal to credibility', 'Appeal to emotion', 'Appeal to logic', 'Appeal to fear'], a: 'Appeal to credibility' },
    // Math continued
    { q: 'What is the ratio 12:16 simplified?', o: ['3:4', '4:3', '6:8', '2:3'], a: '3:4' },
    { q: 'What is a prime number?', o: ['A number divisible only by 1 and itself', 'An even number', 'A number with 3 factors', 'A negative number'], a: 'A number divisible only by 1 and itself' },
    { q: 'What is 2/3 divided by 1/4?', o: ['8/3', '2/12', '1/6', '3/8'], a: '8/3' },
    { q: 'What is the area of a triangle with base 10 and height 6?', o: ['30', '60', '16', '36'], a: '30' },
    { q: 'What is 15% as a fraction?', o: ['3/20', '15/100', '1/5', '3/10'], a: '3/20' },
    { q: 'What is the circumference of a circle with radius 7? (Use pi = 22/7)', o: ['44', '22', '49', '88'], a: '44' },
    { q: 'What is 0.75 as a percent?', o: ['75%', '7.5%', '0.75%', '750%'], a: '75%' },
    { q: 'What is the GCF of 18 and 24?', o: ['6', '12', '3', '8'], a: '6' },
    { q: 'What is 4^2 + 3^2?', o: ['25', '7', '49', '14'], a: '25' },
    { q: 'What continent has the most people?', o: ['Asia', 'Africa', 'Europe', 'South America'], a: 'Asia' },
    { q: 'What is 1/2 + 3/4?', o: ['5/4', '4/6', '3/6', '2/4'], a: '5/4' },
    { q: 'How many vertices does a cube have?', o: ['8', '6', '12', '4'], a: '8' },
    { q: 'What is 6 factorial?', o: ['720', '360', '120', '48'], a: '720' },
    { q: 'What is the speed of light approximately?', o: ['300,000 km/s', '150,000 km/s', '500,000 km/s', '100,000 km/s'], a: '300,000 km/s' },
    { q: 'What is 3/5 of 120?', o: ['72', '60', '80', '48'], a: '72' },
    { q: 'What is the value of pi to 2 decimal places?', o: ['3.14', '3.41', '3.12', '3.16'], a: '3.14' },
    { q: 'What is the number system with base 2 called?', o: ['Binary', 'Decimal', 'Hexadecimal', 'Octal'], a: 'Binary' },
  ],
};

// ─── Phonics Bank ─────────────────────────────────────────────────────────
export const PHONICS_BANK = {
  letterSounds: [
    { q: 'Which letter makes the "buh" sound?', o: ['B', 'D', 'P', 'T'], a: 'B' },
    { q: 'Which letter makes the "sss" sound?', o: ['S', 'Z', 'C', 'X'], a: 'S' },
    { q: 'Which letter makes the "mmm" sound?', o: ['M', 'N', 'L', 'R'], a: 'M' },
    { q: 'Which letter makes the "puh" sound?', o: ['P', 'B', 'T', 'K'], a: 'P' },
    { q: 'Which letter makes the "tuh" sound?', o: ['T', 'D', 'F', 'G'], a: 'T' },
    { q: 'Which letter makes the "kuh" sound?', o: ['K', 'G', 'J', 'Q'], a: 'K' },
    { q: 'Which letter makes the "fff" sound?', o: ['F', 'V', 'S', 'H'], a: 'F' },
    { q: 'Which letter makes the "guh" sound?', o: ['G', 'J', 'C', 'H'], a: 'G' },
    { q: 'Which letter makes the "juh" sound?', o: ['J', 'G', 'Y', 'Z'], a: 'J' },
    { q: 'Which letter makes the "lll" sound?', o: ['L', 'R', 'N', 'M'], a: 'L' },
    { q: 'Which letter makes the "rrr" sound?', o: ['R', 'L', 'W', 'Y'], a: 'R' },
    { q: 'Which letter makes the "nnn" sound?', o: ['N', 'M', 'H', 'L'], a: 'N' },
    { q: 'Which letter makes the "vvv" sound?', o: ['V', 'F', 'B', 'W'], a: 'V' },
    { q: 'Which letter makes the "www" sound?', o: ['W', 'V', 'U', 'Y'], a: 'W' },
    { q: 'Which letter makes the "yuh" sound?', o: ['Y', 'I', 'J', 'W'], a: 'Y' },
    { q: 'Which letter makes the "zzz" sound?', o: ['Z', 'S', 'C', 'X'], a: 'Z' },
    { q: 'Which letter makes the "hhh" sound?', o: ['H', 'F', 'J', 'R'], a: 'H' },
    { q: 'Which letter makes the "uh" sound (short u)?', o: ['U', 'A', 'O', 'I'], a: 'U' },
    { q: 'Which letter makes the "ah" sound (short a)?', o: ['A', 'E', 'O', 'I'], a: 'A' },
    { q: 'Which letter makes the "eh" sound (short e)?', o: ['E', 'A', 'I', 'O'], a: 'E' },
    { q: 'Which letter makes the "ih" sound (short i)?', o: ['I', 'E', 'O', 'U'], a: 'I' },
    { q: 'Which letter makes the "oh" sound (short o)?', o: ['O', 'A', 'U', 'E'], a: 'O' },
  ],

  digraphs: [
    { q: 'What does "sh" say?', o: ['shh', 'chh', 'thh', 'ph'], a: 'shh' },
    { q: 'What does "ch" say?', o: ['chh', 'shh', 'thh', 'kh'], a: 'chh' },
    { q: 'What does "th" say?', o: ['thh (voiced)', 'shh', 'chh', 'f'], a: 'thh (voiced)' },
    { q: 'What does "ph" say?', o: ['f', 'p', 'ph', 'h'], a: 'f' },
    { q: 'What does "wh" say?', o: ['w', 'h', 'hw', 'f'], a: 'w' },
    { q: 'What does "ck" say?', o: ['k', 'ch', 's', 'sh'], a: 'k' },
    { q: 'What does "ng" say?', o: ['ng (as in sing)', 'n', 'g', 'nk'], a: 'ng (as in sing)' },
    { q: 'What does "gh" say in "night"?', o: ['silent', 'g', 'f', 'h'], a: 'silent' },
    { q: 'What does "wr" say in "write"?', o: ['r', 'w', 'wr', 'wh'], a: 'r' },
    { q: 'What does "kn" say in "knee"?', o: ['n', 'kn', 'k', 'gn'], a: 'n' },
  ],

  blends: [
    { q: 'Which word starts with "bl"?', o: ['Blue', 'Block', 'Black', 'Blow'], a: 'Blue' },
    { q: 'Which word starts with "cr"?', o: ['Crab', 'Crate', 'Crash', 'Cream'], a: 'Crab' },
    { q: 'Which word starts with "st"?', o: ['Star', 'Stop', 'Step', 'Still'], a: 'Star' },
    { q: 'Which word starts with "tr"?', o: ['Tree', 'Train', 'Trip', 'Truck'], a: 'Tree' },
    { q: 'Which word starts with "gr"?', o: ['Green', 'Grass', 'Grape', 'Grow'], a: 'Green' },
    { q: 'Which word starts with "sl"?', o: ['Sleep', 'Slide', 'Sled', 'Slope'], a: 'Sleep' },
    { q: 'Which word starts with "fr"?', o: ['Frog', 'Fresh', 'Freeze', 'Front'], a: 'Frog' },
    { q: 'Which word starts with "sp"?', o: ['Spin', 'Spit', 'Spot', 'Spill'], a: 'Spin' },
    { q: 'Which word starts with "br"?', o: ['Brown', 'Brain', 'Break', 'Bridge'], a: 'Brown' },
    { q: 'Which word starts with "gl"?', o: ['Glow', 'Glass', 'Glue', 'Glad'], a: 'Glow' },
    { q: 'Which word starts with "cl"?', o: ['Clap', 'Climb', 'Clock', 'Clown'], a: 'Clap' },
    { q: 'Which word starts with "fl"?', o: ['Fly', 'Flat', 'Flip', 'Float'], a: 'Fly' },
    { q: 'Which word starts with "pl"?', o: ['Play', 'Plan', 'Plate', 'Plug'], a: 'Play' },
    { q: 'Which word starts with "sn"?', o: ['Snow', 'Snip', 'Snap', 'Snail'], a: 'Snow' },
    { q: 'Which word starts with "sw"?', o: ['Swim', 'Swan', 'Swap', 'Sweet'], a: 'Swim' },
    { q: 'Which word starts with "dr"?', o: ['Draw', 'Drop', 'Drip', 'Dream'], a: 'Draw' },
    { q: 'Which word starts with "pr"?', o: ['Pray', 'Print', 'Prize', 'Prism'], a: 'Pray' },
    { q: 'Which word starts with "tw"?', o: ['Twin', 'Twist', 'Twice', 'Twig'], a: 'Twin' },
  ],

  shortVowels: [
    { q: 'Which word has a short "a" (as in cat)?', o: ['Cat', 'Cake', 'Cane', 'Cave'], a: 'Cat' },
    { q: 'Which word has a short "e" (as in bed)?', o: ['Bed', 'Bee', 'Beet', 'Bead'], a: 'Bed' },
    { q: 'Which word has a short "i" (as in sit)?', o: ['Sit', 'Seat', 'Sight', 'Site'], a: 'Sit' },
    { q: 'Which word has a short "o" (as in hot)?', o: ['Hot', 'Hope', 'Home', 'Hose'], a: 'Hot' },
    { q: 'Which word has a short "u" (as in bus)?', o: ['Bus', 'Busy', 'Blue', 'Bug'], a: 'Bus' },
    { q: 'Which word has a short "a" (as in map)?', o: ['Map', 'Make', 'Mail', 'Mane'], a: 'Map' },
    { q: 'Which word has a short "e" (as in pen)?', o: ['Pen', 'Peen', 'Pain', 'Pane'], a: 'Pen' },
    { q: 'Which word has a short "i" (as in pin)?', o: ['Pin', 'Pine', 'Pike', 'Pile'], a: 'Pin' },
    { q: 'Which word has a short "o" (as in dog)?', o: ['Dog', 'Dome', 'Dove', 'Doze'], a: 'Dog' },
    { q: 'Which word has a short "u" (as in cup)?', o: ['Cup', 'Cure', 'Cube', 'Cute'], a: 'Cup' },
    { q: 'Which word has a short "a" (as in ran)?', o: ['Ran', 'Rain', 'Rake', 'Rate'], a: 'Ran' },
    { q: 'Which word has a short "e" (as in red)?', o: ['Red', 'Read', 'Reed', 'Rete'], a: 'Red' },
    { q: 'Which word has a short "i" (as in dig)?', o: ['Dig', 'Dime', 'Dine', 'Dike'], a: 'Dig' },
    { q: 'Which word has a short "o" (as in fox)?', o: ['Fox', 'Fix', 'Fog', 'Fork'], a: 'Fox' },
    { q: 'Which word has a short "u" (as in fun)?', o: ['Fun', 'Few', 'Fuse', 'Fume'], a: 'Fun' },
  ],

  longVowels: [
    { q: 'Which word has a long "a" (magic e rule)?', o: ['Cake', 'Cat', 'Can', 'Cap'], a: 'Cake' },
    { q: 'Which word has a long "e" (magic e)?', o: ['These', 'The', 'Then', 'Them'], a: 'These' },
    { q: 'Which word has a long "i" (magic e)?', o: ['Kite', 'Kit', 'Kid', 'Kiss'], a: 'Kite' },
    { q: 'Which word has a long "o" (magic e)?', o: ['Hope', 'Hop', 'Hot', 'Hog'], a: 'Hope' },
    { q: 'Which word has a long "u" (magic e)?', o: ['Tube', 'Tub', 'Tug', 'Tun'], a: 'Tube' },
    { q: 'Which word has a long "a" (magic e)?', o: ['Make', 'Mat', 'Man', 'Map'], a: 'Make' },
    { q: 'Which word has a long "e" (magic e)?', o: ['Pete', 'Pet', 'Pen', 'Peg'], a: 'Pete' },
    { q: 'Which word has a long "i" (magic e)?', o: ['Time', 'Tim', 'Tip', 'Tin'], a: 'Time' },
    { q: 'Which word has a long "o" (magic e)?', o: ['Bone', 'Bon', 'Bot', 'Bog'], a: 'Bone' },
    { q: 'Which word has a long "u" (magic e)?', o: ['Cute', 'Cut', 'Cup', 'Cub'], a: 'Cute' },
    { q: 'Which word has a long "a" (magic e)?', o: ['Late', 'Lap', 'Lad', 'Lag'], a: 'Late' },
    { q: 'Which word has a long "e" (magic e)?', o: ['Steve', 'Step', 'Stem', 'Stet'], a: 'Steve' },
    { q: 'Which word has a long "i" (magic e)?', o: ['Nice', 'Nick', 'Nip', 'Nit'], a: 'Nice' },
    { q: 'Which word has a long "o" (magic e)?', o: ['Note', 'Not', 'Nod', 'Nog'], a: 'Note' },
    { q: 'Which word has a long "u" (magic e)?', o: ['Rule', 'Rug', 'Run', 'Rub'], a: 'Rule' },
  ],

  rControlled: [
    { q: 'What does "ar" say in "car"?', o: ['ar (as in car)', 'er', 'or', 'ir'], a: 'ar (as in car)' },
    { q: 'What does "er" say in "her"?', o: ['er (as in her)', 'ar', 'or', 'ur'], a: 'er (as in her)' },
    { q: 'What does "or" say in "for"?', o: ['or (as in for)', 'ar', 'er', 'ir'], a: 'or (as in for)' },
    { q: 'What does "ir" say in "bird"?', o: ['er sound', 'ar sound', 'or sound', 'ur sound'], a: 'er sound' },
    { q: 'What does "ur" say in "turn"?', o: ['er sound', 'ar sound', 'or sound', 'ir sound'], a: 'er sound' },
    { q: 'What does "air" say in "hair"?', o: ['air (as in hair)', 'ear', 'ore', 'ire'], a: 'air (as in hair)' },
    { q: 'What does "ear" say in "bear"?', o: ['air sound', 'ear sound', 'ore sound', 'ire sound'], a: 'air sound' },
    { q: 'What does "ore" say in "more"?', o: ['or sound', 'ar sound', 'er sound', 'air sound'], a: 'or sound' },
    { q: 'What does "ire" say in "fire"?', o: ['ire (as in fire)', 'ar', 'er', 'ore'], a: 'ire (as in fire)' },
    { q: 'What does "are" say in "care"?', o: ['air sound', 'ar sound', 'er sound', 'ore sound'], a: 'air sound' },
  ],
};

// ─── Words Bank ───────────────────────────────────────────────────────────
export const WORDS_BANK = {
  sightWords: [
    'the', 'and', 'is', 'it', 'you', 'that', 'was', 'for', 'are', 'but',
    'not', 'with', 'this', 'have', 'from', 'they', 'been', 'said', 'each', 'which',
    'their', 'will', 'would', 'there', 'what', 'about', 'can', 'could', 'other', 'than',
    'then', 'these', 'two', 'may', 'very', 'has', 'her', 'his', 'how', 'its',
    'now', 'old', 'see', 'way', 'who', 'did', 'get', 'let', 'say', 'she',
    'too', 'use', 'any', 'boy', 'had', 'him', 'her', 'man', 'new', 'one',
    'our', 'out', 'day', 'had', 'here', 'where', 'why', 'after', 'again', 'also',
    'always', 'around', 'because', 'before', 'came', 'come', 'every', 'find', 'first', 'give',
    'going', 'great', 'hand', 'help', 'high', 'just', 'keep', 'kind', 'know', 'last',
    'like', 'live', 'long', 'much', 'name', 'never', 'only', 'open', 'over', 'place',
    'please', 'pretty', 'pull', 'read', 'right', 'run', 'sleep', 'tell', 'their', 'upon',
    'well', 'were', 'when', 'your',
  ],

  cvcWords: [
    'cat', 'dog', 'pen', 'bus', 'red', 'big', 'hot', 'sun', 'cup', 'run',
    'hat', 'bed', 'pig', 'mud', 'ten', 'map', 'net', 'hid', 'fog', 'jug',
    'kit', 'lip', 'nut', 'ram', 'tin', 'fox', 'gum', 'hen', 'dip', 'mop',
    'box', 'fun', 'hug', 'jam', 'log', 'nap', 'pot', 'rug', 'sit', 'tap',
    'van', 'wig', 'yam', 'zip', 'bat', 'cob', 'dig', 'fan', 'gap', 'hop',
    'jab', 'kid', 'lap', 'mob', 'nod', 'pad', 'rob', 'sob', 'tub', 'web',
    'ax', 'mix', 'fix', 'six', 'yes', 'yet', 'you', 'zap', 'zig', 'zoo',
    'sad', 'bad', 'dad', 'mad', 'had', 'bag', 'tag', 'rag', 'wag', 'flag',
    'fit', 'bit', 'hit', 'pit', 'wit', 'dim', 'rim', 'him', 'slam', 'slap',
    'snap', 'clap', 'step', 'drip', 'drum', 'frog', 'skip', 'swim', 'plan', 'plot',
  ],

  familyWords: [
    'mother', 'father', 'sister', 'brother', 'grandmother', 'grandfather', 'aunt', 'uncle',
    'cousin', 'baby', 'daughter', 'son', 'family', 'parent', 'child', 'children',
    'husband', 'wife', 'niece', 'nephew', 'stepmother', 'stepfather', 'stepsister', 'stepbrother',
    'grandma', 'grandpa', 'mom', 'dad', 'auntie', 'uncle', 'twin', 'triplet',
  ],

  colorWords: [
    'red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'brown',
    'black', 'white', 'gray', 'gold', 'silver', 'beige', 'tan', 'maroon',
    'navy', 'teal', 'turquoise', 'magenta', 'violet', 'indigo', 'olive', 'lime',
    'coral', 'salmon', 'burgundy', 'ivory', 'charcoal', 'copper', 'bronze', 'crimson',
  ],

  animalWords: [
    'elephant', 'giraffe', 'dolphin', 'penguin', 'kangaroo', 'cheetah', 'flamingo', 'octopus',
    'butterfly', 'hummingbird', 'chameleon', 'hedgehog', 'platypus', 'seahorse', 'tortoise', 'peacock',
    'crocodile', 'rhinoceros', 'hippopotamus', 'chimpanzee', 'orangutan', 'jellyfish', 'scorpion', 'sparrow',
    'mongoose', 'pangolin', 'armadillo', 'squirrel', 'hamster', 'pelican', 'antelope', 'gazelle',
    'leopard', 'panther', 'tiger', 'lion', 'bear', 'wolf', 'fox', 'deer',
    'rabbit', 'horse', 'donkey', 'camel', 'llama', 'alpaca', 'goat', 'sheep',
    'chicken', 'duck', 'goose', 'turkey', 'parrot', 'eagle', 'hawk', 'owl',
    'snake', 'lizard', 'frog', 'toad', 'turtle', 'fish', 'shark', 'whale',
    'dolphin', 'seal', 'otter', 'beaver', 'mole', 'bat', 'rat', 'mouse',
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
  const baseSubjects = [
    { id: 'math', name: 'Mathematics', icon: '🧮', desc: `Math for ${gradeInfo.label}` },
    { id: 'reading', name: 'Reading', icon: '📖', desc: 'Reading & English' },
    { id: 'science', name: 'Science', icon: '🔬', desc: 'Science Discovery' },
    { id: 'social', name: 'Social Studies', icon: '🌍', desc: 'World & Geography' },
  ];

  if (grade === 'KG' || grade === 'G1') {
    baseSubjects.push({ id: 'phonics', name: 'Phonics', icon: '🔤', desc: 'Letters & Sounds' });
    baseSubjects.push({ id: 'words', name: 'Word Practice', icon: '📝', desc: 'Sight Words & Spelling' });
  }

  if (grade === 'G2' || grade === 'G3') {
    baseSubjects.push({ id: 'phonics', name: 'Phonics', icon: '🔤', desc: 'Advanced Phonics' });
    baseSubjects.push({ id: 'grammar', name: 'Grammar', icon: '✏️', desc: 'Nouns, Verbs & More' });
  }

  if (grade === 'G4' || grade === 'G5' || grade === 'G6') {
    baseSubjects.push({ id: 'grammar', name: 'Grammar & Writing', icon: '✏️', desc: 'Writing & Language Arts' });
    baseSubjects.push({ id: 'technology', name: 'Technology', icon: '💻', desc: 'Digital Literacy' });
  }

  return baseSubjects;
}

export function getPhonicsQuestions(category, count = 10) {
  const bank = PHONICS_BANK[category] || PHONICS_BANK.letterSounds;
  return shuffleArray(bank).slice(0, count).map((q) => ({
    question: q.q,
    options: shuffleArray(q.o),
    correct: q.a,
  }));
}

export function getWordList(category) {
  return WORDS_BANK[category] || WORDS_BANK.sightWords;
}
