export const grades=["Kindergarten","Grade 1","Grade 2","Grade 3","Grade 4","Grade 5","Grade 6"];

const topics={
"Kindergarten":{
 Math:[["Counting & Numbers","Count objects to 20 and connect quantities to numerals."],["Shapes","Name circles, squares, triangles, and rectangles."],["Patterns","Find and continue simple repeating patterns."],["Addition Stories","Join small groups and describe addition with pictures."]],
 "Reading":[["Alphabet Sounds","Match uppercase and lowercase letters with their common sounds."],["Rhyming Words","Hear and identify simple rhyming pairs."],["Sight Words","Recognize common words in short sentences."],["Story Order","Put three story events in beginning, middle, and end order."]],
 Science:[["Five Senses","Use sight, hearing, touch, taste, and smell to explore."],["Living Things","Tell the difference between living and nonliving things."],["Weather","Observe sunny, rainy, cloudy, windy, and snowy weather."],["Plants","Identify basic plant parts and what plants need."]],
 "Social Studies":[["My Community","Identify helpers and places in a community."],["Rules & Fairness","Explain why classroom and community rules help people."],["Families","Recognize that families can be different and caring."],["Maps","Use simple symbols to describe familiar places."]]
},
"Grade 1":{
 Math:[["Place Value","Read and write two-digit numbers as tens and ones."],["Addition Within 20","Use strategies to add numbers within 20."],["Subtraction Within 20","Solve take-away and comparison problems within 20."],["Measurement","Compare length, weight, and capacity using direct comparisons."]],
 "Reading":[["Phonics","Use common vowel patterns to decode one-syllable words."],["Main Idea","Identify what a short informational text is mostly about."],["Characters","Describe a character using details from a story."],["Writing Sentences","Write complete sentences with capitals and punctuation."]],
 Science:[["Animal Groups","Compare animals by body parts, coverings, and behaviors."],["Light & Sound","Explore how light and sound help us observe the world."],["Seasons","Describe seasonal changes and patterns."],["Matter Around Us","Sort everyday objects by observable properties."]],
 "Social Studies":[["Citizenship","Describe ways children can help their classroom community."],["Past & Present","Distinguish things that happened long ago from today."],["Needs & Wants","Tell the difference between a need and a want."],["Directions","Use left, right, near, far, and basic map symbols."]]
},
"Grade 2":{
 Math:[["Place Value to 1,000","Represent hundreds, tens, and ones and compare three-digit numbers."],["Addition & Subtraction","Add and subtract within 1,000 using place-value strategies."],["Arrays & Equal Groups","Use repeated addition and arrays to introduce multiplication."],["Money & Time","Solve practical problems involving dollars, coins, clocks, and elapsed time."]],
 "Reading":[["Main Idea & Details","Find a text's main idea and supporting details."],["Vocabulary in Context","Use surrounding sentences to determine word meaning."],["Story Structure","Identify problem, events, solution, and lesson."],["Informational Text","Ask and answer questions using facts from a text."]],
 Science:[["Matter","Describe solids, liquids, and gases using observable properties."],["Land & Water","Compare landforms and bodies of water."],["Life Cycles","Describe stages in plant and animal life cycles."],["Forces","Explore how pushes and pulls change motion."]],
 "Social Studies":[["Government Basics","Identify leaders, rules, and services in a community."],["Geography","Use maps, legends, and symbols to locate places."],["Economics","Explain producers, consumers, goods, and services."],["Historical Sources","Use photos, objects, and stories as evidence about the past."]]
},
"Grade 3":{
 Math:[["Multiplication Facts","Build fluency with multiplication facts using patterns and strategies."],["Division","Interpret division as sharing and grouping."],["Fractions","Represent unit fractions and compare simple fractions."],["Area & Perimeter","Find area and perimeter of rectangles using appropriate units."]],
 "Reading":[["Theme","Determine a story's theme and explain it with evidence."],["Text Evidence","Answer questions using specific details from a text."],["Point of View","Compare how a narrator or speaker presents events."],["Research Basics","Gather information from multiple kid-friendly sources."]],
 Science:[["Ecosystems","Describe how organisms depend on one another and their environment."],["Weather & Climate","Use observations to distinguish weather patterns from climate."],["Forces & Motion","Describe how force, mass, and direction affect motion."],["Engineering Design","Define a problem, test solutions, and improve a design."]],
 "Social Studies":[["Regions","Compare physical and cultural features of geographic regions."],["Government Roles","Describe purposes of local, state, and national government."],["Trade","Explain how trade connects producers and consumers."],["Primary Sources","Ask questions about historical events using primary sources."]]
},
"Grade 4":{
 Math:[["Multi-Digit Multiplication","Multiply multi-digit whole numbers using place value and algorithms."],["Fractions","Add and compare fractions with common and related denominators."],["Decimals","Read, compare, and represent decimals to hundredths."],["Angles & Geometry","Classify angles and identify lines and geometric properties."]],
 "Reading":[["Theme & Summary","Determine theme and summarize a story without losing key ideas."],["Text Structure","Identify cause/effect, sequence, compare/contrast, and problem/solution."],["Figurative Language","Interpret similes, metaphors, idioms, and personification."],["Opinion Writing","State a claim and support it with organized reasons and evidence."]],
 Science:[["Energy","Identify forms of energy and how energy can change form."],["Earth Processes","Explain weathering, erosion, and deposition."],["Animal Adaptations","Connect structures and behaviors to survival."],["Electricity","Explore simple circuits, conductors, and insulators."]],
 "Social Studies":[["Constitution Basics","Explain why communities create governing documents and rules."],["Early America","Study Indigenous peoples and early settlements using evidence."],["Maps & Resources","Analyze maps and how geography affects human activity."],["Civic Participation","Describe ways people participate in a democracy."]]
},
"Grade 5":{
 Math:[["Place Value & Decimals","Perform operations with decimals using place-value reasoning."],["Fractions","Multiply fractions and solve real-world fraction problems."],["Volume","Find volume of rectangular prisms and interpret cubic units."],["Coordinate Plane","Plot and interpret points using ordered pairs."]],
 "Reading":[["Central Idea","Determine the central idea of informational text and summarize it."],["Compare Sources","Compare information and perspectives across sources."],["Narrative Craft","Analyze setting, pacing, dialogue, and point of view."],["Argument Writing","Develop a claim with reasons, evidence, and clear organization."]],
 Science:[["Matter & Its Changes","Model how matter is conserved during physical and chemical changes."],["Earth Systems","Explain interactions among geosphere, hydrosphere, atmosphere, and biosphere."],["Space Systems","Describe patterns of the Sun, Earth, Moon, and stars."],["Ecosystem Energy","Trace matter and energy through food chains and webs."]],
 "Social Studies":[["Foundations of Government","Compare purposes and structures of major government institutions."],["Civic Rights","Describe civic rights and responsibilities using historical evidence."],["Economic Choices","Analyze scarcity, trade-offs, saving, and spending."],["U.S. History","Organize major events into a chronological historical narrative."]]
},
"Grade 6":{
 Math:[["Ratios & Rates","Use ratios, unit rates, and tables to solve real-world problems."],["Expressions & Equations","Write, evaluate, and solve one-variable expressions and equations."],["Integers","Compare, add, subtract, multiply, and divide positive and negative numbers."],["Statistics","Describe distributions using center, spread, and visual displays."]],
 "Reading":[["Evidence & Inference","Distinguish explicit evidence from reasonable inferences."],["Author's Purpose","Analyze how word choice and structure develop an author's purpose."],["Argument & Claims","Evaluate claims, reasons, evidence, and counterclaims."],["Research & Synthesis","Combine information from multiple reliable sources with citations."]],
 Science:[["Cells","Explain how cells are organized and how structures support functions."],["Genetics","Describe how traits can be inherited and how variation occurs."],["Earth's Systems","Model interactions among Earth's major systems."],["Engineering & Data","Use evidence, data, and constraints to evaluate design solutions."]],
 "Social Studies":[["Ancient Civilizations","Compare government, economy, geography, and culture across ancient societies."],["Geographic Reasoning","Analyze how location, resources, and movement influence societies."],["Economics & Markets","Explain incentives, supply, demand, and trade-offs."],["Civic Institutions","Analyze how institutions make, interpret, and apply rules and laws."]]
}
};

function makeQuestions(subject,title,grade){
 const q={
  Math:[["Which idea is most closely connected to this lesson?",["A mathematical representation","A random guess","A fictional character"],0],["Which approach is most useful when solving a math problem?",["Show your reasoning","Skip all work","Change the question"],0]],
  Reading:[["What should a reader do first when a text is difficult?",["Use context and reread","Stop immediately","Ignore the details"],0],["Which is evidence from a text?",["A detail stated or supported by the text","A random opinion","An unrelated fact"],0]],
  Science:[["What makes a scientific explanation useful?",["Evidence and observations","A guess with no evidence","A copied answer"],0],["What should you do after an investigation?",["Use evidence to explain what happened","Hide the results","Change the data"],0]],
  "Social Studies":[["What is useful when studying society and history?",["Evidence from sources","Only rumors","Guessing dates"],0],["Why do people use maps and timelines?",["To organize and understand information","To make facts less clear","To replace evidence"],0]]
 };
 return q[subject]||q.Reading;
}
export const curriculum=Object.fromEntries(Object.entries(topics).map(([grade,subjects])=>[
 grade,Object.fromEntries(Object.entries(subjects).map(([subject,arr])=>[
   subject,arr.flatMap(([title,summary],unitIndex)=>[0,1,2].map(n=>({
     title:n===0?title:`${title}: Practice ${n}`,
     summary:n===0?summary:`Apply ${title.toLowerCase()} skills with guided practice and a real-world example.`,
     type:subject,
     emoji:subject==="Math"?"🔢":subject==="Reading"?"📚":subject==="Science"?"🔬":"🌎",
     questions:makeQuestions(subject,title,grade)
   })))
 ]))
]));

export const activities=[
 {title:"Drawing Board",emoji:"🎨",type:"Creative",summary:"Draw, trace, and practice visual thinking.",questions:[["Which tool is useful for drawing?",["Pencil","Clock","Ruler"],0]]},
 {title:"Shapes",emoji:"🔷",type:"Math",summary:"Recognize and describe common 2D and 3D shapes.",questions:[["How many sides does a triangle have?",["2","3","4"],1]]},
 {title:"Fruit & Veggies",emoji:"🍎",type:"Science",summary:"Sort fruits and vegetables and explore healthy choices.",questions:[["Which is a fruit?",["Apple","Carrot","Broccoli"],0]]},
 {title:"Colors",emoji:"🖐️",type:"Art",summary:"Learn color names, mixing, and visual patterns.",questions:[["Which two colors make green?",["Blue + yellow","Red + black","Pink + white"],0]]},
 {title:"Animals",emoji:"🐮",type:"Science",summary:"Explore animal groups, habitats, and adaptations.",questions:[["Where does a fish normally live?",["Water","Desert","Sky"],0]]},
 {title:"Picture Puzzle",emoji:"🧩",type:"Puzzle",summary:"Use clues to solve picture and logic puzzles.",questions:[["What comes next: 1, 2, 3, ?",["4","7","10"],0]]},
 {title:"Sports",emoji:"🏀",type:"Health",summary:"Practice counting, movement, teamwork, and rules.",questions:[["What helps a team?",["Cooperation","Ignoring teammates","Breaking rules"],0]]},
 {title:"Birds",emoji:"🐦",type:"Science",summary:"Learn how birds are adapted for flight and habitats.",questions:[["What do most birds use to fly?",["Wings","Fins","Roots"],0]]},
 {title:"Coloring Page",emoji:"🖍️",type:"Creative",summary:"Create a calm coloring activity.",questions:[["Which is a warm color?",["Red","Blue","Purple"],0]]},
 {title:"Word Puzzle",emoji:"🧩",type:"Reading",summary:"Match words, meanings, and clues.",questions:[["Which word means the opposite of hot?",["Cold","Fast","Bright"],0]]}
];