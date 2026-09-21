const storiesData = [
    {
        title: "The Three Little Pigs",
        instr: "Read the story and answer the questions!",
        passage: "Three little pigs left home. The first pig built a house of straw. The second pig built a house of sticks. The third pig worked hard and built a house of bricks. The big bad wolf came and huffed and puffed. He blew down the straw house and the stick house. But he could not blow down the brick house! The wolf ran away. The three pigs lived safely in the brick house.",
        qs: [
            { qText: "What did the first pig build his house with?", opts: ["Sticks", "Straw", "Bricks", "Mud"], c: 1 },
            { qText: "What did the third pig build his house with?", opts: ["Straw", "Paper", "Bricks", "Leaves"], c: 2 },
            { qText: "Which house could the wolf NOT blow down?", opts: ["Straw house", "Stick house", "Brick house", "All houses"], c: 2 },
            { qText: "What happened to the wolf at the end?", opts: ["He came in", "He ran away", "He stayed", "He slept"], c: 1 }
        ]
    },
    {
        title: "Goldilocks and the Three Bears",
        instr: "Read Goldilocks' adventure!",
        passage: "Goldilocks walked through the forest and found a little cottage. Inside were three bowls of porridge. She tasted the big bowl — too hot! She tasted the medium bowl — too cold! She tasted the small bowl — just right! She ate it all up. Then she tried three chairs. The big one was too hard. The middle one was too soft. The small one was just right, but it broke! She went upstairs and tried the beds. The small bed was just right. She fell fast asleep. When the three bears came home, they found Goldilocks! She woke up and ran away.",
        qs: [
            { qText: "What was wrong with the big bowl of porridge?", opts: ["Too cold", "Too hot", "Too salty", "Too small"], c: 1 },
            { qText: "Which bowl was just right?", opts: ["Big bowl", "Medium bowl", "Small bowl", "None"], c: 2 },
            { qText: "What happened to the small chair?", opts: ["It flew", "It broke", "It vanished", "It turned red"], c: 1 },
            { qText: "What did Goldilocks do when the bears came home?", opts: ["She slept", "She sang", "She woke up and ran away", "She cooked"], c: 2 }
        ]
    },
    {
        title: "The Magic School Bus Field Trip",
        instr: "Journey inside the human body!",
        passage: "Ms. Frizzle had the most unusual classroom in the world. One day she said, 'Today we will study the human body — from the inside!' The magic bus shrank to the size of a cell and flew into Carlos's nose. They traveled through his bloodstream, past red blood cells, past white blood cells fighting germs. They saw the heart pumping blood. They traveled through his lungs and watched air exchange happen. Finally, Carlos sneezed and the bus flew back out! 'Now THAT is how you do a field trip!' said Ms. Frizzle.",
        qs: [
            { qText: "Where did the magic bus travel?", opts: ["To space", "Into Carlos's nose", "To the ocean", "Underground"], c: 1 },
            { qText: "What were the white blood cells doing?", opts: ["Sleeping", "Fighting germs", "Cooking", "Dancing"], c: 1 },
            { qText: "What organ did they see pumping blood?", opts: ["Lungs", "Brain", "Heart", "Stomach"], c: 2 },
            { qText: "How did the bus exit the body?", opts: ["Carlos sneezed", "Carlos jumped", "It flew backwards", "It melted"], c: 0 }
        ]
    },
    {
        title: "Desert Animals",
        instr: "Discover life in harsh environments!",
        passage: "Deserts may look empty, but they are full of life! Camels can survive without water for weeks because they store energy in their humps. The fennec fox has enormous ears that release heat to cool its body. Rattlesnakes are nocturnal — they hunt at night when it is cool. The saguaro cactus stores hundreds of gallons of water after rain. Even bacteria and tiny insects make their homes in the sand. The desert may be harsh, but life always finds a way!",
        qs: [
            { qText: "Where do camels store energy?", opts: ["In their legs", "In their humps", "In their ears", "In their tails"], c: 1 },
            { qText: "Why does the fennec fox have enormous ears?", opts: ["To fly", "To release heat", "To swim", "To dig"], c: 1 },
            { qText: "When do rattlesnakes hunt?", opts: ["In the morning", "At noon", "At night", "Never"], c: 2 },
            { qText: "What does the saguaro cactus store?", opts: ["Food", "Water", "Sand", "Rocks"], c: 1 }
        ]
    },
    {
        title: "Charlotte's Web",
        instr: "A story about true friendship!",
        passage: "Wilbur was a small white pig who lived on a farm. He was afraid of dying. But Charlotte, a large gray spider who lived in the barn, was his best friend. Charlotte decided to help Wilbur. She spun words in her web: 'SOME PIG.' The farmer was amazed! He thought Wilbur was a very special pig. Charlotte worked all summer spinning messages. Because of her friendship, Wilbur lived a long and happy life.",
        qs: [
            { qText: "Who was Charlotte?", opts: ["A pig", "A duck", "A gray spider", "A cat"], c: 2 },
            { qText: "What words did Charlotte spin in her web first?", opts: ["BEST PIG", "SOME PIG", "BIG PIG", "RUN PIG"], c: 1 },
            { qText: "Where did Wilbur live?", opts: ["In a city", "On a farm", "In a forest", "In a zoo"], c: 1 },
            { qText: "Why did Wilbur live a long happy life?", opts: ["Because of Charlotte's friendship", "He ran away", "He hid", "He flew"], c: 0 }
        ]
    },
    {
        title: "The Very Hungry Caterpillar",
        instr: "Follow the caterpillar's transformation!",
        passage: "On Monday, the caterpillar ate one apple. On Tuesday it ate two pears. On Wednesday it ate three plums. On Thursday it ate four strawberries. On Friday it ate five oranges. Then it built a cozy cocoon around itself. Two weeks later, a beautiful butterfly came out!",
        qs: [
            { qText: "What did the caterpillar eat on Monday?", opts: ["One apple", "Two pears", "Three plums", "Five oranges"], c: 0 },
            { qText: "How many strawberries did it eat on Thursday?", opts: ["Two", "Three", "Four", "Five"], c: 2 },
            { qText: "What did it build around itself?", opts: ["A nest", "A cozy cocoon", "A box", "A house"], c: 1 },
            { qText: "What came out two weeks later?", opts: ["A bird", "A bee", "A beautiful butterfly", "A moth"], c: 2 }
        ]
    },
    {
        title: "Marie Curie: Pioneer of Science",
        instr: "Learn about the legendary scientist!",
        passage: "Marie Curie was born in Poland in 1867, when women were not allowed to attend university. She saved money for years, then moved to Paris to study science. She discovered two new elements: polonium (named after Poland) and radium. She was the FIRST woman to win a Nobel Prize — and then she won a SECOND one in a different field! Despite facing discrimination as a woman in science, she never gave up. Her research on radioactivity, though it eventually harmed her health, transformed modern medicine and physics.",
        qs: [
            { qText: "Where was Marie Curie born?", opts: ["France", "Poland", "England", "USA"], c: 1 },
            { qText: "What two elements did she discover?", opts: ["Gold & Silver", "Polonium & Radium", "Oxygen & Hydrogen", "Iron & Copper"], c: 1 },
            { qText: "How many Nobel Prizes did she win?", opts: ["One", "Two", "Three", "Four"], c: 1 },
            { qText: "What field did her research transform?", opts: ["Music", "Modern medicine and physics", "Art", "Sports"], c: 1 }
        ]
    },
    {
        title: "Harriet Tubman: Hero of Freedom",
        instr: "The story of the Underground Railroad!",
        passage: "Harriet Tubman was born into slavery around 1822. She escaped north to freedom in 1849. But she couldn't stay free while others suffered. She returned south NINETEEN times, using the Underground Railroad — a secret network of safe houses and helpers — to guide over 300 enslaved people to freedom. She was never caught and never lost a passenger. During the Civil War, she served as a spy and nurse for the Union Army. She is one of the greatest heroes in American history.",
        qs: [
            { qText: "What network did Harriet Tubman use?", opts: ["The Highway", "The Underground Railroad", "The Canal", "The River"], c: 1 },
            { qText: "How many times did she return south to guide others?", opts: ["Five", "Ten", "Nineteen", "Fifty"], c: 2 },
            { qText: "How many passengers did she lose?", opts: ["Ten", "Five", "Zero / None", "Two"], c: 2 },
            { qText: "What role did she serve during the Civil War?", opts: ["Captain", "Spy and nurse", "Chef", "General"], c: 1 }
        ]
    }
];

export { storiesData };
