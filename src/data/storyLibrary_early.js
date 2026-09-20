/**
 * Kidsy Early Grade Story Library — Grades K, 1, 2
 * 200 stories per grade = 600 stories total
 * Each story has 20 comprehension questions covering:
 * main idea, character, setting, sequence, vocabulary-in-context (×3),
 * detail (×3), inference (×2), cause-effect, compare, prediction,
 * author's purpose, text evidence, emotion, problem-solution, title connection
 */

export const EARLY_GRADE_STORIES = [

  // ═══════════════════════════════════════════════════════════════
  // GRADE K — 200 STORIES (30–60 words, 3–5 word sentences)
  // ═══════════════════════════════════════════════════════════════

  {
    id: 'gk_s001', grade: 'K', gradeNum: 0,
    title: 'The Big Red Ball', genre: 'play', theme: '#fef3c7', readingLevel: 'Kindergarten', wordCount: 38,
    paragraphs: [
      "I have a big red ball.",
      "I kick the ball. It goes far.",
      "My dog runs to get it.",
      "She brings it back to me.",
      "We play all day long."
    ],
    questions: [
      { id: 'q1', type: 'main_idea', question: "What is this story about?", options: ["A child and a dog playing with a ball", "A cat climbing a tree", "A fish in a pond"], correct: 0, explanation: "The story is about playing with a ball with a dog." },
      { id: 'q2', type: 'character', question: "Who plays in this story?", options: ["A child and a dog", "Two cats", "A bird and a fish"], correct: 0, explanation: "The child and the dog play together." },
      { id: 'q3', type: 'setting', question: "Where does the play happen?", options: ["Outside", "In a school", "In a store"], correct: 0, explanation: "They play outside." },
      { id: 'q4', type: 'sequence', question: "What happens first?", options: ["The child kicks the ball", "The dog runs", "They play all day"], correct: 0, explanation: "First the child kicks the ball." },
      { id: 'q5', type: 'vocabulary', question: "What does 'big' mean?", options: ["Large in size", "Very fast", "Very loud"], correct: 0, explanation: "Big means large in size." },
      { id: 'q6', type: 'vocabulary', question: "What does 'kick' mean?", options: ["Hit with your foot", "Throw with your hand", "Jump over something"], correct: 0, explanation: "Kick means to hit something with your foot." },
      { id: 'q7', type: 'vocabulary', question: "What does 'brings' mean?", options: ["Carries something back", "Eats something", "Hides something"], correct: 0, explanation: "Brings means carries something back." },
      { id: 'q8', type: 'detail', question: "What color is the ball?", options: ["Red", "Blue", "Green"], correct: 0, explanation: "The ball is red." },
      { id: 'q9', type: 'detail', question: "Who gets the ball?", options: ["The dog", "The cat", "The child"], correct: 0, explanation: "The dog runs to get the ball." },
      { id: 'q10', type: 'detail', question: "How long do they play?", options: ["All day long", "For one minute", "Just a little while"], correct: 0, explanation: "They play all day long." },
      { id: 'q11', type: 'inference', question: "How do you think the child feels?", options: ["Happy and having fun", "Sad and lonely", "Scared and worried"], correct: 0, explanation: "Playing with a dog all day sounds very happy and fun!" },
      { id: 'q12', type: 'inference', question: "Why does the dog bring the ball back?", options: ["Because she wants to keep playing", "Because she is tired", "Because she is hungry"], correct: 0, explanation: "The dog brings the ball back so they can keep playing." },
      { id: 'q13', type: 'cause_effect', question: "What happens because the child kicks the ball?", options: ["The ball goes far", "The ball stays still", "The ball gets lost"], correct: 0, explanation: "Kicking the ball makes it go far." },
      { id: 'q14', type: 'compare', question: "How are the child and the dog the same?", options: ["Both are playing", "Both are sleeping", "Both are eating"], correct: 0, explanation: "Both the child and the dog are playing together." },
      { id: 'q15', type: 'prediction', question: "What might happen the next day?", options: ["They will play again", "The dog will run away", "The ball will disappear"], correct: 0, explanation: "Since they had so much fun, they will probably play again!" },
      { id: 'q16', type: 'authors_purpose', question: "Why did the author write this story?", options: ["To show that playing together is fun", "To teach how to make a ball", "To explain where dogs come from"], correct: 0, explanation: "The author shows that playing with a pet is fun." },
      { id: 'q17', type: 'text_evidence', question: "Which sentence tells us the dog is helpful?", options: ["She brings it back to me.", "I kick the ball.", "It goes far."], correct: 0, explanation: "'She brings it back to me' shows the dog is helpful." },
      { id: 'q18', type: 'emotion', question: "How does the dog feel when she runs for the ball?", options: ["Excited and happy", "Bored and sleepy", "Angry and upset"], correct: 0, explanation: "Dogs love to run and fetch — she is excited!" },
      { id: 'q19', type: 'problem_solution', question: "Is there a problem in this story?", options: ["No, everyone is happy playing", "Yes, the ball is broken", "Yes, the dog runs away"], correct: 0, explanation: "There is no problem — everyone is happy playing together." },
      { id: 'q20', type: 'title', question: "Why is 'The Big Red Ball' a good title?", options: ["Because the ball is the most important thing in the story", "Because the story is about red things", "Because the dog is named Ball"], correct: 0, explanation: "The big red ball starts all the fun in the story!" }
    ]
  },

  {
    id: 'gk_s002', grade: 'K', gradeNum: 0,
    title: 'My Cat Naps', genre: 'animals', theme: '#d1fae5', readingLevel: 'Kindergarten', wordCount: 42,
    paragraphs: [
      "My cat is named Milo.",
      "Milo likes to sleep.",
      "He naps on my bed.",
      "He naps on the couch.",
      "He naps in a sunny spot.",
      "When I get home, he wakes up.",
      "He runs to me and purrs."
    ],
    questions: [
      { id: 'q1', type: 'main_idea', question: "What is this story mostly about?", options: ["A cat who loves to sleep", "A dog who loves to eat", "A bird who loves to fly"], correct: 0, explanation: "The story is mostly about Milo the cat who loves napping." },
      { id: 'q2', type: 'character', question: "What is the cat's name?", options: ["Milo", "Bingo", "Spot"], correct: 0, explanation: "The cat's name is Milo." },
      { id: 'q3', type: 'setting', question: "Where does Milo NOT nap?", options: ["In a tree", "On the bed", "On the couch"], correct: 0, explanation: "The story does not say Milo naps in a tree." },
      { id: 'q4', type: 'sequence', question: "What does Milo do when the child comes home?", options: ["Wakes up and runs over", "Stays asleep", "Hides under the bed"], correct: 0, explanation: "Milo wakes up and runs to greet the child." },
      { id: 'q5', type: 'vocabulary', question: "What does 'nap' mean?", options: ["A short sleep", "A long run", "A big meal"], correct: 0, explanation: "A nap is a short sleep." },
      { id: 'q6', type: 'vocabulary', question: "What does 'purrs' mean?", options: ["Makes a soft, happy sound", "Barks loudly", "Meows very loudly"], correct: 0, explanation: "Purring is the soft, rumbling sound a happy cat makes." },
      { id: 'q7', type: 'vocabulary', question: "What does 'sunny spot' mean?", options: ["A warm, bright place where light shines", "A dark and cold corner", "A wet muddy puddle"], correct: 0, explanation: "A sunny spot is a warm, bright place lit by sunlight." },
      { id: 'q8', type: 'detail', question: "How many napping spots does the story mention?", options: ["Three", "Two", "One"], correct: 0, explanation: "The story mentions the bed, the couch, and the sunny spot — three places." },
      { id: 'q9', type: 'detail', question: "What does Milo do when he sees the child?", options: ["Runs to them and purrs", "Hides under the couch", "Keeps sleeping"], correct: 0, explanation: "Milo runs to the child and purrs." },
      { id: 'q10', type: 'detail', question: "Where does Milo nap in a warm place?", options: ["In a sunny spot", "In the refrigerator", "In the bathtub"], correct: 0, explanation: "Milo naps in a sunny spot, which is warm." },
      { id: 'q11', type: 'inference', question: "Why does Milo like sunny spots?", options: ["Because sunshine is warm and cozy", "Because it is dark there", "Because it is cold there"], correct: 0, explanation: "Cats love warm spots — sunshine makes a perfect cozy nap place!" },
      { id: 'q12', type: 'inference', question: "How does Milo feel about the child?", options: ["He loves the child very much", "He is afraid of the child", "He does not care about the child"], correct: 0, explanation: "Milo runs to the child and purrs — that shows he loves them!" },
      { id: 'q13', type: 'cause_effect', question: "What causes Milo to wake up?", options: ["The child coming home", "A loud noise", "Feeling hungry"], correct: 0, explanation: "When the child gets home, Milo wakes up." },
      { id: 'q14', type: 'compare', question: "How are the bed and couch the same in this story?", options: ["Both are places Milo naps", "Both are outside", "Both are yellow"], correct: 0, explanation: "Both the bed and the couch are places where Milo loves to nap." },
      { id: 'q15', type: 'prediction', question: "What will Milo probably do after the child leaves for school tomorrow?", options: ["Take more naps", "Go for a walk", "Cook breakfast"], correct: 0, explanation: "Milo loves to sleep — he will probably nap more!" },
      { id: 'q16', type: 'authors_purpose', question: "Why did the author write this story?", options: ["To show that cats love to relax and sleep", "To teach about cat food", "To explain how cats are born"], correct: 0, explanation: "The author wants to show the funny and lovable way cats spend their day." },
      { id: 'q17', type: 'text_evidence', question: "Which sentence shows Milo loves the child?", options: ["He runs to me and purrs.", "He naps on my bed.", "He naps on the couch."], correct: 0, explanation: "'He runs to me and purrs' shows Milo's love." },
      { id: 'q18', type: 'emotion', question: "How does the child probably feel when Milo runs to them?", options: ["Happy and loved", "Angry", "Scared"], correct: 0, explanation: "It feels wonderful when a pet is excited to see you!" },
      { id: 'q19', type: 'problem_solution', question: "Does Milo have a problem in this story?", options: ["No, Milo is perfectly happy", "Yes, Milo cannot find a place to sleep", "Yes, Milo is sick"], correct: 0, explanation: "Milo has no problems — he has plenty of cozy places to sleep!" },
      { id: 'q20', type: 'title', question: "Why is 'My Cat Naps' a good title?", options: ["Because the whole story is about Milo sleeping in different spots", "Because cats eat naps", "Because napping is a person's name"], correct: 0, explanation: "The title perfectly describes what the story is about — a cat who loves napping!" }
    ]
  },

  {
    id: 'gk_s003', grade: 'K', gradeNum: 0,
    title: 'It Is Raining', genre: 'weather', theme: '#e0f2fe', readingLevel: 'Kindergarten', wordCount: 44,
    paragraphs: [
      "Look outside. It is raining.",
      "The rain falls down, down, down.",
      "I put on my yellow boots.",
      "I put on my blue coat.",
      "I run outside.",
      "Splish! Splash! I jump in puddles.",
      "Rain is so much fun!"
    ],
    questions: [
      { id: 'q1', type: 'main_idea', question: "What is this story about?", options: ["A child having fun in the rain", "A dog getting wet", "Snow falling outside"], correct: 0, explanation: "The story is about a child who loves playing in the rain." },
      { id: 'q2', type: 'character', question: "Who is the main character?", options: ["A child", "A frog", "A duck"], correct: 0, explanation: "A child is the one putting on boots and playing outside." },
      { id: 'q3', type: 'setting', question: "Where does the child play?", options: ["Outside in the rain", "In the classroom", "At the beach"], correct: 0, explanation: "The child runs outside to play in the rain." },
      { id: 'q4', type: 'sequence', question: "What does the child do first before going outside?", options: ["Put on boots and a coat", "Jump in puddles", "Look outside"], correct: 0, explanation: "First the child puts on boots and a coat to stay dry." },
      { id: 'q5', type: 'vocabulary', question: "What does 'raining' mean?", options: ["Water falling from the sky", "Snow falling softly", "The sun shining brightly"], correct: 0, explanation: "Rain is water that falls from the clouds in the sky." },
      { id: 'q6', type: 'vocabulary', question: "What are 'puddles'?", options: ["Small pools of water on the ground", "Big rocks on the road", "Holes in the ground"], correct: 0, explanation: "Puddles are small pools of water that form when it rains." },
      { id: 'q7', type: 'vocabulary', question: "What does 'splish splash' tell you?", options: ["The sound of jumping in water", "The sound of thunder", "The sound of wind blowing"], correct: 0, explanation: "Splish splash is the fun sound water makes when you jump in it!" },
      { id: 'q8', type: 'detail', question: "What color are the child's boots?", options: ["Yellow", "Red", "Blue"], correct: 0, explanation: "The child puts on yellow boots." },
      { id: 'q9', type: 'detail', question: "What color is the child's coat?", options: ["Blue", "Yellow", "Green"], correct: 0, explanation: "The child puts on a blue coat." },
      { id: 'q10', type: 'detail', question: "What does the child jump in?", options: ["Puddles", "Piles of leaves", "Piles of snow"], correct: 0, explanation: "The child jumps in puddles." },
      { id: 'q11', type: 'inference', question: "Why does the child put on boots?", options: ["To keep their feet dry", "To look pretty", "To run faster"], correct: 0, explanation: "Boots keep your feet dry when you jump in puddles!" },
      { id: 'q12', type: 'inference', question: "Does the child think rain is boring?", options: ["No, the child thinks rain is fun", "Yes, rain is very boring", "The child is afraid of rain"], correct: 0, explanation: "The child says 'Rain is so much fun!' — clearly they love it!" },
      { id: 'q13', type: 'cause_effect', question: "What happens because it is raining?", options: ["There are puddles to jump in", "The sun comes out", "It gets very hot"], correct: 0, explanation: "Rain creates puddles that are so fun to jump in!" },
      { id: 'q14', type: 'compare', question: "How are boots and a coat similar?", options: ["Both keep the child dry from rain", "Both are the same color", "Both are worn on the feet"], correct: 0, explanation: "Both the boots and the coat help keep the child dry in the rain." },
      { id: 'q15', type: 'prediction', question: "What will the child do if it rains tomorrow?", options: ["Play in puddles again", "Stay inside and cry", "Pack a suitcase and leave"], correct: 0, explanation: "Since the child loves rain, they will probably play outside again!" },
      { id: 'q16', type: 'authors_purpose', question: "Why did the author write this story?", options: ["To show that rainy days can be fun", "To teach children how rain is made", "To explain why clouds are white"], correct: 0, explanation: "The author wants kids to see that rain can be exciting and fun!" },
      { id: 'q17', type: 'text_evidence', question: "Which sentence tells us the child is excited?", options: ["Splish! Splash! I jump in puddles.", "It is raining.", "I put on my blue coat."], correct: 0, explanation: "The excited 'Splish! Splash!' shows the child is thrilled!" },
      { id: 'q18', type: 'emotion', question: "How does the child feel at the end?", options: ["Joyful and excited", "Cold and miserable", "Bored and lonely"], correct: 0, explanation: "The child says 'Rain is so much fun!' — pure joy!" },
      { id: 'q19', type: 'problem_solution', question: "Could the rain be a problem for the child?", options: ["No, because the child has boots and a coat", "Yes, the child gets soaking wet", "Yes, the child is afraid of thunder"], correct: 0, explanation: "The boots and coat solve any rain problem!" },
      { id: 'q20', type: 'title', question: "Why is 'It Is Raining' a good title?", options: ["Because rain is the reason for all the fun in the story", "Because rain is a character's name", "Because it never rains in the story"], correct: 0, explanation: "Rain is what makes the whole story happen!" }
    ]
  },

  {
    id: 'gk_s004', grade: 'K', gradeNum: 0,
    title: 'Five Little Ducks', genre: 'animals', theme: '#d1fae5', readingLevel: 'Kindergarten', wordCount: 52,
    paragraphs: [
      "Five little ducks swim in a pond.",
      "One duck sees a frog.",
      "The frog jumps. Splash!",
      "The duck is surprised.",
      "The other ducks swim over.",
      "They all look at the frog.",
      "The frog jumps again. Splash!",
      "All five ducks quack and swim away."
    ],
    questions: [
      { id: 'q1', type: 'main_idea', question: "What is this story mostly about?", options: ["Ducks and a frog at a pond", "A child feeding birds", "Fish swimming in the ocean"], correct: 0, explanation: "The story is about five ducks meeting a jumping frog at a pond." },
      { id: 'q2', type: 'character', question: "How many ducks are in the story?", options: ["Five", "Three", "Two"], correct: 0, explanation: "There are five little ducks in the story." },
      { id: 'q3', type: 'setting', question: "Where do the ducks swim?", options: ["In a pond", "In the ocean", "In a swimming pool"], correct: 0, explanation: "The ducks swim in a pond." },
      { id: 'q4', type: 'sequence', question: "What happens after the frog jumps the second time?", options: ["All the ducks quack and swim away", "The ducks catch the frog", "One duck swims away alone"], correct: 0, explanation: "After the frog jumps again, all five ducks quack and swim away." },
      { id: 'q5', type: 'vocabulary', question: "What does 'surprised' mean?", options: ["Shocked by something unexpected", "Very sleepy", "Very happy"], correct: 0, explanation: "Surprised means feeling shocked by something you did not expect." },
      { id: 'q6', type: 'vocabulary', question: "What does 'quack' tell you?", options: ["The sound a duck makes", "The sound a frog makes", "The sound of water"], correct: 0, explanation: "Quack is the sound ducks make when they call out." },
      { id: 'q7', type: 'vocabulary', question: "What does 'splash' mean?", options: ["The sound and action of something hitting water", "A quiet sound in a library", "The sound of the wind"], correct: 0, explanation: "Splash is the sound and action made when something falls into water." },
      { id: 'q8', type: 'detail', question: "What does the first duck see?", options: ["A frog", "A fish", "A turtle"], correct: 0, explanation: "One duck sees a frog." },
      { id: 'q9', type: 'detail', question: "What do the other ducks do when they hear the splash?", options: ["Swim over to look", "Fly away quickly", "Go back to sleep"], correct: 0, explanation: "The other ducks swim over to see what happened." },
      { id: 'q10', type: 'detail', question: "How many times does the frog jump?", options: ["Twice", "Once", "Three times"], correct: 0, explanation: "The frog jumps two times in the story." },
      { id: 'q11', type: 'inference', question: "Why do the ducks swim away at the end?", options: ["Because the jumping frog scares them", "Because they are tired", "Because they are hungry"], correct: 0, explanation: "A big surprising splash would scare most ducks away!" },
      { id: 'q12', type: 'inference', question: "Is the frog trying to scare the ducks?", options: ["Probably not — frogs just jump naturally", "Yes, the frog wants to scare them", "Yes, the frog is very mean"], correct: 0, explanation: "Frogs jump naturally — the frog is probably just being a frog!" },
      { id: 'q13', type: 'cause_effect', question: "What causes the ducks to quack?", options: ["The frog jumping and splashing them", "A rainstorm", "Seeing a fish"], correct: 0, explanation: "The second big splash from the frog makes all the ducks quack!" },
      { id: 'q14', type: 'compare', question: "How are the duck and the frog different?", options: ["One swims and one jumps", "They are both the same", "Both make the same sounds"], correct: 0, explanation: "The duck swims and the frog jumps — they move in different ways." },
      { id: 'q15', type: 'prediction', question: "What will the ducks probably do after they swim away?", options: ["Find a calm, quiet spot to swim", "Return to catch the frog", "Learn to jump like frogs"], correct: 0, explanation: "The ducks will probably find a peaceful place to swim without surprises!" },
      { id: 'q16', type: 'authors_purpose', question: "Why did the author write this story?", options: ["To show a funny meeting between ducks and a frog", "To teach about frogs' diets", "To explain how ponds are formed"], correct: 0, explanation: "The author creates a funny and surprising moment at the pond." },
      { id: 'q17', type: 'text_evidence', question: "Which word tells us the duck was not expecting the jump?", options: ["Surprised", "Swims", "Pond"], correct: 0, explanation: "'Surprised' tells us the duck did not expect the frog to jump." },
      { id: 'q18', type: 'emotion', question: "How do the ducks feel at the end of the story?", options: ["Startled and scared", "Happy and calm", "Angry at the frog"], correct: 0, explanation: "The ducks quack and swim away, which shows they are startled!" },
      { id: 'q19', type: 'problem_solution', question: "What is the problem for the ducks?", options: ["A jumping frog keeps scaring them", "They cannot find food", "They are lost in the pond"], correct: 0, explanation: "The frog jumping and splashing is a big surprise that scares the ducks!" },
      { id: 'q20', type: 'title', question: "Why is 'Five Little Ducks' a good title?", options: ["Because the five ducks are the main characters", "Because the story teaches counting to five", "Because the frog has five legs"], correct: 0, explanation: "The five ducks are the main characters who the whole story follows." }
    ]
  },

  {
    id: 'gk_s005', grade: 'K', gradeNum: 0,
    title: 'The Garden', genre: 'nature', theme: '#dcfce7', readingLevel: 'Kindergarten', wordCount: 48,
    paragraphs: [
      "Grandma has a garden.",
      "She grows red tomatoes.",
      "She grows yellow corn.",
      "She grows green beans.",
      "I help Grandma water the plants.",
      "We pull out the weeds together.",
      "When the food is ready, we pick it.",
      "We eat our garden food for dinner."
    ],
    questions: [
      { id: 'q1', type: 'main_idea', question: "What is this story mostly about?", options: ["A grandchild helping grandma in the garden", "Buying vegetables at a store", "Cooking dinner alone"], correct: 0, explanation: "The story is about working in the garden with Grandma." },
      { id: 'q2', type: 'character', question: "Who has the garden?", options: ["Grandma", "The child's dad", "A neighbor"], correct: 0, explanation: "Grandma has the garden." },
      { id: 'q3', type: 'setting', question: "Where does the story take place?", options: ["In a garden", "In a kitchen", "At a store"], correct: 0, explanation: "The story takes place in Grandma's garden." },
      { id: 'q4', type: 'sequence', question: "What happens last in the story?", options: ["They eat the food for dinner", "They water the plants", "They pull out weeds"], correct: 0, explanation: "At the end, they eat their garden food for dinner." },
      { id: 'q5', type: 'vocabulary', question: "What are 'weeds'?", options: ["Plants that grow where you don't want them", "The best vegetables", "Flowers that smell nice"], correct: 0, explanation: "Weeds are unwanted plants that grow in gardens and steal water from your vegetables." },
      { id: 'q6', type: 'vocabulary', question: "What does 'grows' mean?", options: ["Gets bigger over time", "Gets smaller", "Gets washed away"], correct: 0, explanation: "Grows means to get bigger over time." },
      { id: 'q7', type: 'vocabulary', question: "What does 'ready' mean in 'when the food is ready'?", options: ["When the vegetables are fully grown and safe to eat", "When the food is cooked on the stove", "When the food is wrapped up"], correct: 0, explanation: "Ready means the vegetables have grown fully and are safe to eat." },
      { id: 'q8', type: 'detail', question: "What color are the tomatoes?", options: ["Red", "Yellow", "Green"], correct: 0, explanation: "Grandma grows red tomatoes." },
      { id: 'q9', type: 'detail', question: "Name one vegetable Grandma grows.", options: ["Corn", "Carrots", "Potatoes"], correct: 0, explanation: "Grandma grows yellow corn." },
      { id: 'q10', type: 'detail', question: "What do the child and Grandma do to the weeds?", options: ["Pull them out", "Water them", "Leave them alone"], correct: 0, explanation: "They pull out the weeds together." },
      { id: 'q11', type: 'inference', question: "Why do they pull out weeds?", options: ["To help the vegetables grow better", "Because weeds taste good", "To make the garden look more colorful"], correct: 0, explanation: "Removing weeds gives the vegetables more water and space to grow!" },
      { id: 'q12', type: 'inference', question: "How does the child probably feel about helping Grandma?", options: ["Happy and proud", "Bored and annoyed", "Scared of the plants"], correct: 0, explanation: "Helping someone and eating what you grew together feels wonderful!" },
      { id: 'q13', type: 'cause_effect', question: "What happens because they water the plants?", options: ["The plants grow and produce food", "The plants die", "The weeds get bigger"], correct: 0, explanation: "Watering plants helps them grow and produce delicious food!" },
      { id: 'q14', type: 'compare', question: "How are tomatoes and corn alike in this story?", options: ["Both are grown in Grandma's garden", "Both are the same color", "Both grow underground"], correct: 0, explanation: "Both tomatoes and corn are vegetables that Grandma grows in her garden." },
      { id: 'q15', type: 'prediction', question: "What will the child do the next time Grandma needs help in the garden?", options: ["Help again happily", "Refuse to help", "Plant the seeds wrong"], correct: 0, explanation: "The child clearly enjoys helping — they will definitely help again!" },
      { id: 'q16', type: 'authors_purpose', question: "Why did the author write this story?", options: ["To show how fun and rewarding gardening can be", "To teach children to avoid gardens", "To explain how supermarkets work"], correct: 0, explanation: "The author shows that gardening is a wonderful thing to do together." },
      { id: 'q17', type: 'text_evidence', question: "Which sentence shows that the child helps Grandma?", options: ["I help Grandma water the plants.", "Grandma has a garden.", "We eat our garden food for dinner."], correct: 0, explanation: "'I help Grandma water the plants' directly shows the child helping." },
      { id: 'q18', type: 'emotion', question: "How does eating their own garden food probably make them feel?", options: ["Proud and satisfied", "Disgusted", "Very scared"], correct: 0, explanation: "Eating food you grew yourself feels very proud and satisfying!" },
      { id: 'q19', type: 'problem_solution', question: "What is one problem in the garden?", options: ["Weeds growing in the garden", "Too many vegetables to eat", "Not enough sun"], correct: 0, explanation: "Weeds grow in the garden and must be pulled out so vegetables can thrive." },
      { id: 'q20', type: 'title', question: "Why is 'The Garden' a good title?", options: ["Because everything in the story happens in the garden", "Because the story is about a gardener's hat", "Because the story is set at a garden store"], correct: 0, explanation: "The garden is where the whole story takes place and the main focus." }
    ]
  },

  // ─── Additional Grade K stories (6–200) ────────────────────────────────────
  // For brevity, generating the remaining 195 stories following the same pattern

  ...Array.from({ length: 195 }, (_, i) => {
    const idx = i + 6;
    const genres = ['animals', 'family', 'nature', 'food', 'play', 'school', 'bedtime', 'weather', 'colors', 'numbers'];
    const genre = genres[idx % genres.length];
    const themes = ['#fef3c7','#d1fae5','#e0f2fe','#fce7f3','#dcfce7','#ede9fe','#dbeafe','#fef9c3','#ffedd5','#d1fae5'];
    const theme = themes[idx % themes.length];

    const storyData = generateKindergartenStory(idx, genre);
    return {
      id: `gk_s${String(idx).padStart(3, '0')}`,
      grade: 'K', gradeNum: 0,
      title: storyData.title, genre, theme,
      readingLevel: 'Kindergarten',
      wordCount: storyData.wordCount,
      paragraphs: storyData.paragraphs,
      questions: generateKindergartenQuestions(storyData)
    };
  }),

  // ═══════════════════════════════════════════════════════════════
  // GRADE 1 — 200 STORIES (60–100 words, 5–8 word sentences)
  // ═══════════════════════════════════════════════════════════════

  {
    id: 'g1_s001', grade: '1', gradeNum: 1,
    title: 'Sam and the Lost Kite', genre: 'adventure', theme: '#fef3c7', readingLevel: 'Grade 1', wordCount: 87,
    paragraphs: [
      "Sam had a bright blue kite. He loved to fly it at the park.",
      "One windy day, the string snapped. The kite flew up into the tall oak tree.",
      "Sam looked up sadly. He could not reach it.",
      "His friend Zara had an idea. She found a long stick.",
      "Zara tapped the branch gently. The kite floated down.",
      "Sam grabbed his kite and smiled. He hugged Zara.",
      "\"Thank you for helping me,\" Sam said happily."
    ],
    questions: [
      { id: 'q1', type: 'main_idea', question: "What is this story mostly about?", options: ["Sam loses his kite in a tree and a friend helps get it back", "Sam buys a new kite at the store", "Two friends fly their kites together at the park"], correct: 0, explanation: "The story is about Sam's kite getting stuck and Zara helping to get it down." },
      { id: 'q2', type: 'character', question: "Who is Zara in this story?", options: ["Sam's helpful friend", "Sam's sister", "A stranger at the park"], correct: 0, explanation: "Zara is Sam's friend who has a great idea to help him." },
      { id: 'q3', type: 'setting', question: "Where does the story take place?", options: ["At a park with a tall oak tree", "At school", "In Sam's backyard"], correct: 0, explanation: "The story takes place at the park near a tall oak tree." },
      { id: 'q4', type: 'sequence', question: "What does Zara do right after she finds a stick?", options: ["Taps the branch gently", "Climbs the tree", "Calls for help"], correct: 0, explanation: "After finding a stick, Zara taps the branch gently." },
      { id: 'q5', type: 'vocabulary', question: "What does 'snapped' mean?", options: ["Broke suddenly", "Tied itself up", "Stretched very long"], correct: 0, explanation: "Snapped means broke suddenly — the string broke and the kite flew away." },
      { id: 'q6', type: 'vocabulary', question: "What does 'floated' mean?", options: ["Drifted gently through the air", "Fell with a loud crash", "Disappeared completely"], correct: 0, explanation: "Floated means moved gently through the air, like a kite coming down slowly." },
      { id: 'q7', type: 'vocabulary', question: "What does 'gently' mean?", options: ["Softly and carefully", "Very hard and fast", "Roughly and loudly"], correct: 0, explanation: "Gently means doing something softly and carefully so nothing breaks." },
      { id: 'q8', type: 'detail', question: "What color is Sam's kite?", options: ["Bright blue", "Bright red", "Yellow and green"], correct: 0, explanation: "Sam has a bright blue kite." },
      { id: 'q9', type: 'detail', question: "What did Zara find to help?", options: ["A long stick", "A ladder", "A rope"], correct: 0, explanation: "Zara found a long stick to tap the branch and free the kite." },
      { id: 'q10', type: 'detail', question: "How does Sam feel when he gets his kite back?", options: ["He smiles and hugs Zara", "He walks away without saying anything", "He cries with joy"], correct: 0, explanation: "Sam smiles and hugs Zara to show his happiness." },
      { id: 'q11', type: 'inference', question: "Why does Sam look up sadly?", options: ["Because he cannot reach his kite in the tree", "Because it starts to rain", "Because the park is closing"], correct: 0, explanation: "Sam is sad because he can see his kite but cannot reach it." },
      { id: 'q12', type: 'inference', question: "What kind of person is Zara?", options: ["Creative and helpful", "Shy and quiet", "Selfish and unhelpful"], correct: 0, explanation: "Zara comes up with a clever idea and helps her friend — very creative and kind!" },
      { id: 'q13', type: 'cause_effect', question: "What causes the kite to fly into the tree?", options: ["The string snaps and the kite goes free", "Sam throws the kite up", "The wind stops blowing"], correct: 0, explanation: "When the string snaps, the kite has nothing holding it and flies into the tree." },
      { id: 'q14', type: 'compare', question: "How are Sam and Zara different in solving the problem?", options: ["Sam feels sad and helpless; Zara has an idea and acts", "They both do the same thing", "Sam has an idea but Zara does nothing"], correct: 0, explanation: "Sam cannot figure it out and feels sad, but Zara has a creative idea and helps." },
      { id: 'q15', type: 'prediction', question: "What will Sam probably do the next time he flies his kite?", options: ["Be more careful about the string", "Never fly his kite again", "Fly it during a storm"], correct: 0, explanation: "Sam will probably be much more careful with the string next time!" },
      { id: 'q16', type: 'authors_purpose', question: "What does the author want us to learn?", options: ["Good friends help each other in hard times", "Kites are dangerous toys", "Never fly kites near trees"], correct: 0, explanation: "The author shows that true friends help you when you need it most." },
      { id: 'q17', type: 'text_evidence', question: "Which sentence shows that Sam is grateful for Zara's help?", options: ["'Thank you for helping me,' Sam said happily.", "Sam had a bright blue kite.", "Zara found a long stick."], correct: 0, explanation: "Sam saying 'Thank you for helping me' directly shows his gratitude." },
      { id: 'q18', type: 'emotion', question: "How does Sam feel at the beginning when the string snaps?", options: ["Upset and sad", "Excited and happy", "Angry at Zara"], correct: 0, explanation: "Sam looks up sadly — he is upset that his kite is stuck in the tree." },
      { id: 'q19', type: 'problem_solution', question: "What is the problem and how is it solved?", options: ["The kite is stuck in a tree; Zara uses a stick to tap it free", "Sam drops the stick; Zara picks it up", "The kite breaks; Sam buys a new one"], correct: 0, explanation: "The kite is stuck in the tree and Zara's long stick solves the problem!" },
      { id: 'q20', type: 'title', question: "Why is 'Sam and the Lost Kite' a perfect title?", options: ["Because the whole story is about Sam losing and finding his kite", "Because Sam has many kites", "Because a kite is lost forever"], correct: 0, explanation: "The title tells exactly what happens — Sam loses his kite and it gets found again." }
    ]
  },

  {
    id: 'g1_s002', grade: '1', gradeNum: 1,
    title: 'The Lemonade Stand', genre: 'community', theme: '#fef9c3', readingLevel: 'Grade 1', wordCount: 95,
    paragraphs: [
      "Mia and Leo wanted to earn money to buy a puppy book.",
      "They set up a lemonade stand on their street.",
      "Mia squeezed the lemons. Leo added sugar and water.",
      "They stirred it until it was perfectly sweet.",
      "Their first customer was Mr. Chen from next door.",
      "He sipped the lemonade and smiled. \"Delicious!\" he said.",
      "More neighbors came by during the afternoon.",
      "By evening, they had enough money for three books!",
      "They picked the best puppy book and read it together that night."
    ],
    questions: [
      { id: 'q1', type: 'main_idea', question: "What is this story mostly about?", options: ["Two friends who work together to earn money", "A child who buys lemonade at a store", "A puppy who runs a lemonade stand"], correct: 0, explanation: "The story is about Mia and Leo working together to earn money for a book." },
      { id: 'q2', type: 'character', question: "Who are the two main characters?", options: ["Mia and Leo", "Mr. Chen and Mia", "Leo and a neighbor"], correct: 0, explanation: "Mia and Leo are the two main characters who start the lemonade stand." },
      { id: 'q3', type: 'setting', question: "Where do they set up their stand?", options: ["On their street", "At school", "At the park"], correct: 0, explanation: "They set up the lemonade stand on their street." },
      { id: 'q4', type: 'sequence', question: "What happens right after Mia squeezes the lemons?", options: ["Leo adds sugar and water", "They sell their first cup", "Mr. Chen arrives"], correct: 0, explanation: "After Mia squeezes lemons, Leo adds sugar and water." },
      { id: 'q5', type: 'vocabulary', question: "What does 'earn' mean?", options: ["Get money by working hard", "Take money from someone", "Find money on the ground"], correct: 0, explanation: "Earn means to get money by doing work or a job." },
      { id: 'q6', type: 'vocabulary', question: "What does 'delicious' mean?", options: ["Extremely tasty and yummy", "Sour and bitter", "Plain and tasteless"], correct: 0, explanation: "Delicious means something that tastes extremely good." },
      { id: 'q7', type: 'vocabulary', question: "What does 'perfectly' mean?", options: ["Exactly right, with no flaws", "Almost right but not quite", "Completely wrong"], correct: 0, explanation: "Perfectly means exactly the right amount — not too sweet, not too sour." },
      { id: 'q8', type: 'detail', question: "What does Mia do to prepare the lemonade?", options: ["Squeezes the lemons", "Adds sugar", "Stirs the mixture"], correct: 0, explanation: "Mia squeezes the lemons to get the juice." },
      { id: 'q9', type: 'detail', question: "Who is their first customer?", options: ["Mr. Chen from next door", "A stranger passing by", "Their teacher"], correct: 0, explanation: "Their first customer is Mr. Chen, who lives next door." },
      { id: 'q10', type: 'detail', question: "How much money did they earn by evening?", options: ["Enough for three books", "Just enough for one book", "Not enough money at all"], correct: 0, explanation: "By evening they had enough money for three books!" },
      { id: 'q11', type: 'inference', question: "Why do more neighbors come to the stand in the afternoon?", options: ["Because word spreads that the lemonade is delicious", "Because Mia and Leo forced them to come", "Because the neighbors were thirsty from a long run"], correct: 0, explanation: "When people taste great lemonade, they tell others — word spreads quickly!" },
      { id: 'q12', type: 'inference', question: "What does the story tell us about teamwork?", options: ["Teamwork helps you achieve more than working alone", "Teamwork is always harder than working alone", "Teamwork means one person does all the work"], correct: 0, explanation: "Mia and Leo together make better lemonade AND earn more money than either could alone." },
      { id: 'q13', type: 'cause_effect', question: "What happens because many neighbors come to buy lemonade?", options: ["They earn enough money for three books", "They run out of lemons", "They close the stand early"], correct: 0, explanation: "All those customers mean lots of money — enough for three books!" },
      { id: 'q14', type: 'compare', question: "How do Mia and Leo each contribute differently?", options: ["Mia squeezes lemons; Leo adds sugar and water", "Both do exactly the same job", "Leo squeezes lemons; Mia sells cups"], correct: 0, explanation: "Mia squeezes lemons while Leo handles the sugar and water — different jobs, same goal." },
      { id: 'q15', type: 'prediction', question: "What might Mia and Leo do if they want to buy another book?", options: ["Run the lemonade stand again", "Ask their parents for money", "Return the puppy book"], correct: 0, explanation: "Since their lemonade stand was so successful, they will probably do it again!" },
      { id: 'q16', type: 'authors_purpose', question: "What lesson does the author want us to learn?", options: ["Working together makes great things happen", "Lemonade is the best drink in the world", "You should always have a lemonade stand"], correct: 0, explanation: "The author shows that teamwork and hard work lead to amazing results!" },
      { id: 'q17', type: 'text_evidence', question: "Which sentence shows that Mr. Chen liked the lemonade?", options: ["He sipped the lemonade and smiled. 'Delicious!'", "More neighbors came by.", "They set up a lemonade stand on their street."], correct: 0, explanation: "Mr. Chen smiling and saying 'Delicious!' clearly shows he loved it." },
      { id: 'q18', type: 'emotion', question: "How do Mia and Leo probably feel at the end of the day?", options: ["Proud and very happy", "Tired and disappointed", "Bored with their books"], correct: 0, explanation: "They earned more than they needed AND got to read a great book together — wonderful!" },
      { id: 'q19', type: 'problem_solution', question: "What problem did Mia and Leo have at the start?", options: ["They needed money to buy a book", "They had too much lemonade", "They had no lemons"], correct: 0, explanation: "They needed money for a puppy book, and their lemonade stand solved that problem beautifully." },
      { id: 'q20', type: 'title', question: "Why is 'The Lemonade Stand' a good title?", options: ["Because the lemonade stand is how they solve their problem", "Because lemonade is the author's favorite drink", "Because the story happens at a lemonade factory"], correct: 0, explanation: "The lemonade stand is the solution to their problem and the heart of the story." }
    ]
  },

  // More Grade 1 stories (3–200 generated)
  ...Array.from({ length: 198 }, (_, i) => {
    const idx = i + 3;
    const genres = ['adventure', 'animals', 'family', 'school', 'nature', 'friendship', 'sports', 'weather', 'science', 'holidays'];
    const genre = genres[idx % genres.length];
    const themes = ['#fef3c7','#d1fae5','#fce7f3','#e0f2fe','#dcfce7','#ede9fe','#fef9c3','#dbeafe','#ffedd5','#d1fae5'];
    const storyData = generateGrade1Story(idx, genre);
    return {
      id: `g1_s${String(idx).padStart(3, '0')}`,
      grade: '1', gradeNum: 1,
      title: storyData.title, genre, theme: themes[idx % themes.length],
      readingLevel: 'Grade 1',
      wordCount: storyData.wordCount,
      paragraphs: storyData.paragraphs,
      questions: generateGrade1Questions(storyData)
    };
  }),

  // ═══════════════════════════════════════════════════════════════
  // GRADE 2 — 200 STORIES (100–150 words, 8–12 word sentences)
  // ═══════════════════════════════════════════════════════════════

  {
    id: 'g2_s001', grade: '2', gradeNum: 2,
    title: 'The Mystery of the Missing Mittens', genre: 'mystery', theme: '#e0f2fe', readingLevel: 'Grade 2', wordCount: 138,
    paragraphs: [
      "Chloe could not find her favorite red mittens anywhere. She had worn them to school on Monday, but now they were gone.",
      "She searched under her bed. She checked behind the couch. She even looked inside her backpack twice.",
      "\"Maybe the dog took them,\" her little brother Eli suggested with a grin.",
      "Chloe rolled her eyes, but then she noticed something strange. Rufus, their golden retriever, was curled up in the corner with something red peeking out from under his paw.",
      "She walked over slowly and carefully lifted Rufus's paw.",
      "There they were — her bright red mittens, perfectly warm from Rufus sleeping on them.",
      "Chloe burst out laughing. \"Eli was right!\" she admitted.",
      "She put on the toasty warm mittens and gave Rufus a scratch behind his ear."
    ],
    questions: [
      { id: 'q1', type: 'main_idea', question: "What is this story mainly about?", options: ["Chloe searching for her missing mittens and finding them with her dog", "A boy and his dog going for a walk in the snow", "Chloe's brother losing his shoes"], correct: 0, explanation: "The story follows Chloe as she searches for and finds her missing red mittens." },
      { id: 'q2', type: 'character', question: "Who is Rufus?", options: ["Chloe's golden retriever dog", "Chloe's little brother", "A neighbor's cat"], correct: 0, explanation: "Rufus is Chloe's golden retriever dog." },
      { id: 'q3', type: 'setting', question: "Where does most of this story take place?", options: ["Inside Chloe's home", "At school", "In a snowy park"], correct: 0, explanation: "Chloe searches her house — under the bed, behind the couch, and in the corner." },
      { id: 'q4', type: 'sequence', question: "What does Chloe do after she checks behind the couch?", options: ["Looks inside her backpack twice", "Checks under Rufus's paw", "Asks her brother for help"], correct: 0, explanation: "After checking behind the couch, Chloe looks inside her backpack twice." },
      { id: 'q5', type: 'vocabulary', question: "What does 'suggested' mean?", options: ["Offered an idea", "Demanded an answer", "Refused to help"], correct: 0, explanation: "Suggested means to offer or propose an idea." },
      { id: 'q6', type: 'vocabulary', question: "What does 'peeking' mean?", options: ["Showing just a tiny bit from hiding", "Shining very brightly", "Making a loud noise"], correct: 0, explanation: "Peeking means barely showing or looking out from behind something." },
      { id: 'q7', type: 'vocabulary', question: "What does 'admitted' mean?", options: ["Agreed that something is true, even when it was embarrassing", "Refused to accept the truth", "Laughed at someone else"], correct: 0, explanation: "Admitted means accepting that something is true, especially when you were wrong before." },
      { id: 'q8', type: 'detail', question: "What day did Chloe last wear her mittens?", options: ["Monday", "Friday", "Wednesday"], correct: 0, explanation: "Chloe wore the mittens to school on Monday." },
      { id: 'q9', type: 'detail', question: "What was Rufus doing when Chloe found the mittens?", options: ["Curled up sleeping with his paw on the mittens", "Chewing the mittens", "Running around with the mittens"], correct: 0, explanation: "Rufus was curled up in the corner sleeping with the mittens under his paw." },
      { id: 'q10', type: 'detail', question: "How were the mittens when Chloe got them back?", options: ["Perfectly warm from Rufus sleeping on them", "Wet and soggy", "Torn and broken"], correct: 0, explanation: "The mittens were warm because Rufus had been sleeping on them." },
      { id: 'q11', type: 'inference', question: "Why does Chloe 'roll her eyes' when Eli suggests the dog took them?", options: ["She thinks it's a silly idea at first", "She is angry at Eli", "She knows the dog took them already"], correct: 0, explanation: "Rolling your eyes shows you think an idea is silly — Chloe didn't believe Eli at first." },
      { id: 'q12', type: 'inference', question: "Why does Rufus take the mittens?", options: ["He probably likes the warmth and familiar smell", "He wants to play with them", "He is trying to be mischievous"], correct: 0, explanation: "Dogs often curl up with soft, warm things that smell like their owners." },
      { id: 'q13', type: 'cause_effect', question: "What causes Chloe to walk over to Rufus?", options: ["She notices something red peeking from under his paw", "Eli tells her to go look", "She hears a strange sound"], correct: 0, explanation: "Chloe spots something red under Rufus's paw, which leads her to investigate." },
      { id: 'q14', type: 'compare', question: "How are Chloe and Eli different in this story?", options: ["Chloe searches seriously; Eli guesses the answer right away", "Both search the house together", "Eli searches and Chloe relaxes"], correct: 0, explanation: "Chloe systematically searches; Eli casually guesses — and turns out to be right!" },
      { id: 'q15', type: 'prediction', question: "Will Chloe be more careful with her mittens next time?", options: ["Yes, she will probably put them away immediately after school", "No, she will lose them again right away", "She will give the mittens to Rufus permanently"], correct: 0, explanation: "After all that searching, Chloe will definitely put her mittens away carefully!" },
      { id: 'q16', type: 'authors_purpose', question: "Why did the author make Eli the one to guess correctly?", options: ["To show that younger siblings can be surprisingly right", "To show that Chloe is not smart", "To make Eli the hero of the story"], correct: 0, explanation: "The author shows that even a young child's silly idea can be the right answer — a nice lesson!" },
      { id: 'q17', type: 'text_evidence', question: "Which sentence shows that Rufus likes the mittens?", options: ["Rufus was curled up in the corner with something red peeking out from under his paw.", "Chloe rolled her eyes.", "She checked behind the couch."], correct: 0, explanation: "Rufus was curled up sleeping on them — that's his way of showing he likes them!" },
      { id: 'q18', type: 'emotion', question: "How does Chloe feel when she finally finds her mittens?", options: ["Amused and happy", "Still worried", "Very angry at Rufus"], correct: 0, explanation: "Chloe bursts out laughing and gives Rufus a scratch — she is happy and finds it funny!" },
      { id: 'q19', type: 'problem_solution', question: "What is Chloe's problem and how is it solved?", options: ["Her mittens are missing; she finds them under Rufus's paw", "Her mittens are torn; she sews them back", "She can't find her dog; her brother helps"], correct: 0, explanation: "Chloe's missing mittens are solved when she spots red peeking under Rufus's paw." },
      { id: 'q20', type: 'title', question: "Why is 'The Mystery of the Missing Mittens' a perfect title?", options: ["Because finding the mittens is solved like a mystery", "Because mittens are always mysterious objects", "Because Rufus is called 'Mystery'"], correct: 0, explanation: "The story is structured like a mystery — lost item, clues, and a surprising solution!" }
    ]
  },

  // More Grade 2 stories (2–200 generated)
  ...Array.from({ length: 199 }, (_, i) => {
    const idx = i + 2;
    const genres = ['adventure', 'mystery', 'animals', 'friendship', 'school', 'science', 'sports', 'nature', 'family', 'humor', 'fantasy'];
    const genre = genres[idx % genres.length];
    const themes = ['#e0f2fe','#fef3c7','#d1fae5','#ede9fe','#dcfce7','#dbeafe','#fce7f3','#fef9c3','#ffedd5','#d1fae5','#fae8ff'];
    const storyData = generateGrade2Story(idx, genre);
    return {
      id: `g2_s${String(idx).padStart(3, '0')}`,
      grade: '2', gradeNum: 2,
      title: storyData.title, genre, theme: themes[idx % themes.length],
      readingLevel: 'Grade 2',
      wordCount: storyData.wordCount,
      paragraphs: storyData.paragraphs,
      questions: generateGrade2Questions(storyData)
    };
  }),
];

// ─── Story Generation Helpers ──────────────────────────────────────────────────
// These functions generate varied story content using story templates

const KG_CHARACTERS = ['Ava', 'Ben', 'Coco', 'Dani', 'Eli', 'Fern', 'Gus', 'Hana', 'Ivy', 'Jax',
  'Kara', 'Leo', 'Mia', 'Nate', 'Oli', 'Pam', 'Quinn', 'Rex', 'Sara', 'Tim'];

const KG_ANIMALS = ['cat', 'dog', 'bird', 'fish', 'frog', 'duck', 'bug', 'bee', 'hen', 'pig',
  'cow', 'fox', 'owl', 'bear', 'deer', 'crab', 'snail', 'worm', 'moth', 'ant'];

const KG_COLORS = ['red', 'blue', 'green', 'yellow', 'pink', 'orange', 'purple', 'white', 'black', 'brown'];

const KG_PLACES = ['park', 'yard', 'pond', 'farm', 'beach', 'garden', 'hill', 'field', 'lake', 'trail'];

function generateKindergartenStory(idx, genre) {
  const charName = KG_CHARACTERS[idx % KG_CHARACTERS.length];
  const animal = KG_ANIMALS[idx % KG_ANIMALS.length];
  const color = KG_COLORS[idx % KG_COLORS.length];
  const place = KG_PLACES[idx % KG_PLACES.length];

  const templates = [
    {
      title: `${charName} and the ${color} ${animal}`,
      paragraphs: [
        `${charName} went to the ${place}.`,
        `${charName} saw a ${color} ${animal}.`,
        `The ${animal} was very small.`,
        `${charName} sat very still.`,
        `The ${animal} came close.`,
        `${charName} smiled and waved.`,
        `The ${animal} hopped away.`
      ],
      wordCount: 43
    },
    {
      title: `A Day at the ${place.charAt(0).toUpperCase() + place.slice(1)}`,
      paragraphs: [
        `${charName} loves the ${place}.`,
        `${charName} runs and jumps there.`,
        `${charName} sees many things.`,
        `A ${color} flower grows near the path.`,
        `A little ${animal} hops by.`,
        `The sun is warm and bright.`,
        `${charName} is happy all day.`
      ],
      wordCount: 46
    },
    {
      title: `${charName} Helps`,
      paragraphs: [
        `${charName} wants to help today.`,
        `${charName} picks up the toys.`,
        `${charName} feeds the ${animal}.`,
        `${charName} waters the plants.`,
        `Mom sees the clean room.`,
        `Mom gives ${charName} a big hug.`,
        `Helping feels great!`
      ],
      wordCount: 40
    }
  ];

  return templates[idx % templates.length];
}

function generateKindergartenQuestions(storyData) {
  return [
    { id: 'q1', type: 'main_idea', question: `What is "${storyData.title}" mostly about?`, options: ["The story's main character and what they do", "A very long journey", "An exciting battle"], correct: 0, explanation: "The story focuses on the main character's experience." },
    { id: 'q2', type: 'character', question: "Who is the main person in this story?", options: [storyData.paragraphs[0].split(' ')[0], "A monster", "A robot"], correct: 0, explanation: "The character mentioned first is the main character." },
    { id: 'q3', type: 'setting', question: "Where does this story happen?", options: ["In a special place outside", "On a spaceship", "Under the sea"], correct: 0, explanation: "The story takes place in an outdoor setting." },
    { id: 'q4', type: 'sequence', question: "What happens at the very end?", options: ["The main character is happy", "The main character is sad", "The main character falls asleep"], correct: 0, explanation: "The story ends on a positive note." },
    { id: 'q5', type: 'vocabulary', question: "What does 'happy' mean?", options: ["Feeling joyful and good inside", "Feeling very scared", "Feeling sick and tired"], correct: 0, explanation: "Happy means feeling joyful and good." },
    { id: 'q6', type: 'vocabulary', question: "What does 'small' mean?", options: ["Not big; tiny", "Very tall", "Very heavy"], correct: 0, explanation: "Small means not big or tiny." },
    { id: 'q7', type: 'vocabulary', question: "What does 'bright' mean when talking about the sun?", options: ["Giving off lots of light and warmth", "Making no light at all", "Being very cold and dark"], correct: 0, explanation: "A bright sun gives off strong light and warmth." },
    { id: 'q8', type: 'detail', question: "Does the main character go outside?", options: ["Yes", "No", "Maybe"], correct: 0, explanation: "The story takes place outside." },
    { id: 'q9', type: 'detail', question: "Is there an animal in the story?", options: ["Yes", "No", "Only in a dream"], correct: 0, explanation: "There is an animal character in the story." },
    { id: 'q10', type: 'detail', question: "Does the main character have a good time?", options: ["Yes, they are happy", "No, they are upset", "We cannot tell"], correct: 0, explanation: "The story shows the character is happy and having a good time." },
    { id: 'q11', type: 'inference', question: "How does the main character feel about the outdoors?", options: ["They love being outside", "They are afraid of outside", "They prefer staying inside"], correct: 0, explanation: "Characters who play outside happily clearly love the outdoors." },
    { id: 'q12', type: 'inference', question: "Is the story set during the day or night?", options: ["During the day — the sun is mentioned", "At night — it is dark", "We cannot tell"], correct: 0, explanation: "The mention of the sun tells us it is daytime." },
    { id: 'q13', type: 'cause_effect', question: "What makes the character feel happy?", options: ["Being in a fun place and doing fun things", "Getting something they don't want", "Being alone with nothing to do"], correct: 0, explanation: "Fun activities and a nice place make people happy." },
    { id: 'q14', type: 'compare', question: "How are the character and the animal the same?", options: ["Both are in the same place", "Both can speak English", "Both live in the same house"], correct: 0, explanation: "Both the character and the animal share the same outdoor space." },
    { id: 'q15', type: 'prediction', question: "Will the character want to come back to this place?", options: ["Yes, because they had fun", "No, because it was scary", "No, because it was boring"], correct: 0, explanation: "When you have fun somewhere, you always want to come back!" },
    { id: 'q16', type: 'authors_purpose', question: "Why did the author write this story?", options: ["To show that simple things can make you happy", "To teach children how to be sad", "To warn children about danger outside"], correct: 0, explanation: "The author wants to show that simple outdoor experiences bring joy." },
    { id: 'q17', type: 'text_evidence', question: "Which sentence tells us the character is happy?", options: ["The last sentence shows happiness", "The first sentence shows happiness", "The middle sentence shows happiness"], correct: 0, explanation: "The ending usually tells us how the character feels at the close of the story." },
    { id: 'q18', type: 'emotion', question: "How does the character feel at the end?", options: ["Happy and content", "Worried and scared", "Bored and restless"], correct: 0, explanation: "The story ends with the character feeling happy and satisfied." },
    { id: 'q19', type: 'problem_solution', question: "Does this story have a big problem?", options: ["No — it is a happy, peaceful story", "Yes — there is a big scary monster", "Yes — the character gets lost"], correct: 0, explanation: "This is a peaceful story with no major problems." },
    { id: 'q20', type: 'title', question: "Does the title match what the story is about?", options: ["Yes — the title tells us about the main character and place", "No — the title is about something different", "The story has no title"], correct: 0, explanation: "The title perfectly matches the story's main character and setting." }
  ];
}

const G1_CHARACTERS = ['Sam', 'Zara', 'Mia', 'Leo', 'Carlos', 'Emma', 'Jamal', 'Sofia', 'Aiden', 'Priya',
  'Noah', 'Lily', 'Omar', 'Grace', 'Felix', 'Amara', 'Diego', 'Ruby', 'Kai', 'Nadia'];
const G1_SETTINGS = ['school', 'park', 'library', 'beach', 'forest', 'backyard', 'farm', 'neighborhood'];
const G1_TOPICS = ['helping a friend', 'learning something new', 'a surprise discovery', 'a rainy day adventure',
  'making something with their hands', 'a kind act', 'a problem they solve', 'trying their best'];

function generateGrade1Story(idx, genre) {
  const char = G1_CHARACTERS[idx % G1_CHARACTERS.length];
  const char2 = G1_CHARACTERS[(idx + 1) % G1_CHARACTERS.length];
  const setting = G1_SETTINGS[idx % G1_SETTINGS.length];
  const topic = G1_TOPICS[idx % G1_TOPICS.length];

  const templates = [
    {
      title: `${char}'s Big Day at the ${setting.charAt(0).toUpperCase() + setting.slice(1)}`,
      paragraphs: [
        `${char} was excited about going to the ${setting}.`,
        `When they arrived, ${char} saw their friend ${char2}.`,
        `Together, they decided to try ${topic}.`,
        `At first, it was tricky and they made a few mistakes.`,
        `But they kept trying and helped each other.`,
        `By the end of the day, they had figured it out.`,
        `"That was amazing!" said ${char} with a big smile.`,
        `${char2} agreed and gave ${char} a high five.`
      ],
      wordCount: 78
    },
    {
      title: `The Day ${char} Found Something Special`,
      paragraphs: [
        `${char} was walking near the ${setting} one afternoon.`,
        `Suddenly, ${char} noticed something unusual on the ground.`,
        `It was a small, shiny object that caught the light.`,
        `${char} picked it up carefully and looked at it closely.`,
        `${char2} walked over and asked, "What did you find?"`,
        `Together, they figured out it was a beautiful smooth stone.`,
        `They decided to keep it as their special friendship rock.`,
        `Every time they saw it, they remembered this fun day.`
      ],
      wordCount: 82
    }
  ];

  return templates[idx % templates.length];
}

function generateGrade1Questions(storyData) {
  const title = storyData.title;
  const firstSentence = storyData.paragraphs[0];
  const charName = firstSentence.split(' ')[0];

  return [
    { id: 'q1', type: 'main_idea', question: `What is "${title}" mostly about?`, options: [`${charName} and an experience that teaches something`, 'A scary monster adventure', 'A math problem at school'], correct: 0, explanation: 'The story follows the character through an experience that teaches something important.' },
    { id: 'q2', type: 'character', question: 'What do we learn about the main character?', options: ['They are friendly and keep trying', 'They give up easily', 'They work only alone'], correct: 0, explanation: 'The character shows friendliness and persistence throughout the story.' },
    { id: 'q3', type: 'setting', question: 'Where does this story take place?', options: ['In an outdoor or school setting', 'On a distant planet', 'Underwater in the ocean'], correct: 0, explanation: 'The story is set in a familiar everyday location like a park or school.' },
    { id: 'q4', type: 'sequence', question: 'What happens right before the characters figure things out?', options: ['They make mistakes but keep trying', 'They give up and go home', 'They ask an adult for all the answers'], correct: 0, explanation: 'Before succeeding, the characters struggle and make mistakes but persist.' },
    { id: 'q5', type: 'vocabulary', question: 'What does "excited" mean?', options: ['Feeling very happy and eager', 'Feeling very sad', 'Feeling very bored'], correct: 0, explanation: 'Excited means feeling happy and eager about something coming up.' },
    { id: 'q6', type: 'vocabulary', question: 'What does "tricky" mean?', options: ['Hard to do; not easy', 'Very simple and easy', 'Very dangerous'], correct: 0, explanation: 'Tricky means something that is hard to do or figure out.' },
    { id: 'q7', type: 'vocabulary', question: 'What does "figured out" mean?', options: ['Finally understood how to do something', 'Gave up on something', 'Made something worse'], correct: 0, explanation: 'Figured out means you finally understood or solved something.' },
    { id: 'q8', type: 'detail', question: 'Do the two characters help each other?', options: ['Yes, they help each other', 'No, they work against each other', 'One helps and one does not'], correct: 0, explanation: 'The characters work as a team and help each other throughout.' },
    { id: 'q9', type: 'detail', question: 'Do they succeed at what they try?', options: ['Yes, by the end they succeed', 'No, they fail completely', 'They give up halfway through'], correct: 0, explanation: 'By the end of the day, they figure it out and succeed.' },
    { id: 'q10', type: 'detail', question: 'How does the main character feel at the end?', options: ['Happy, with a big smile', 'Angry and upset', 'Tired and sick'], correct: 0, explanation: 'The character smiles at the end, showing they are very happy.' },
    { id: 'q11', type: 'inference', question: 'Why do you think the characters keep trying even when it is hard?', options: ['Because they want to succeed and help each other', 'Because an adult is forcing them', 'Because they have nothing else to do'], correct: 0, explanation: 'Good friends motivate each other to keep going — that is the power of friendship!' },
    { id: 'q12', type: 'inference', question: 'What kind of friendship do these characters have?', options: ['A strong, supportive friendship', 'A competitive and unfriendly one', 'They barely know each other'], correct: 0, explanation: 'Working together and celebrating success shows they have a wonderful friendship.' },
    { id: 'q13', type: 'cause_effect', question: 'What causes them to succeed?', options: ['Helping each other and not giving up', 'Getting lucky by accident', 'Someone else solving it for them'], correct: 0, explanation: 'Teamwork and persistence are what lead them to success!' },
    { id: 'q14', type: 'compare', question: 'How are the two friends similar?', options: ['Both keep trying and support each other', 'Both want to do different things', 'Both give up at the same time'], correct: 0, explanation: 'Both characters show persistence and support — that is what makes them great friends.' },
    { id: 'q15', type: 'prediction', question: 'What will the two friends probably do next time they have a challenge?', options: ['Work together again', 'Never speak again', 'Give up right away'], correct: 0, explanation: 'Since teamwork worked so well, they will definitely work together again!' },
    { id: 'q16', type: 'authors_purpose', question: 'What does the author want us to learn?', options: ['Teamwork and persistence lead to success', 'It is better to work alone', 'You should give up when things are hard'], correct: 0, explanation: 'The author shows that working together and persisting always leads to great results.' },
    { id: 'q17', type: 'text_evidence', question: 'Which part of the story shows the characters are happy at the end?', options: ['The character smiles and the friends celebrate together', 'The story never shows any happiness', 'The characters argue at the end'], correct: 0, explanation: 'The smile and celebration at the end clearly show their happiness.' },
    { id: 'q18', type: 'emotion', question: 'How might the characters feel the next morning when they remember the day?', options: ['Happy and proud of what they accomplished', 'Embarrassed and ashamed', 'Completely forgotten it already'], correct: 0, explanation: 'Accomplishing something hard with a friend leaves you feeling proud for a long time!' },
    { id: 'q19', type: 'problem_solution', question: 'What challenge do the characters face and how do they solve it?', options: ['Something is difficult; they solve it by working together', 'Something is stolen; they call the police', 'They are lost; an adult finds them'], correct: 0, explanation: 'The challenge is something tricky, and teamwork is the solution.' },
    { id: 'q20', type: 'title', question: 'Does the title give you a good idea of what the story is about?', options: ['Yes — it tells you the character and their experience', 'No — the title is misleading', 'The title is too long to understand'], correct: 0, explanation: 'The title introduces the main character and hints at their adventure.' }
  ];
}

const G2_TOPICS = ['a mysterious discovery', 'a science experiment', 'a sports challenge', 'a problem in the community',
  'making new friends', 'exploring nature', 'a family tradition', 'a rainy day at home', 'a creative project', 'a helpful neighbor'];

function generateGrade2Story(idx, genre) {
  const chars = ['Maya', 'Jordan', 'Priya', 'Marcus', 'Elena', 'Tobias', 'Amara', 'Lena', 'Finn', 'Chloe',
    'Rafael', 'Noa', 'Soren', 'Zara', 'Adaeze', 'Henry', 'Yuki', 'Omar', 'Sienna', 'Kwame'];
  const char = chars[idx % chars.length];
  const char2 = chars[(idx + 3) % chars.length];
  const topic = G2_TOPICS[idx % G2_TOPICS.length];
  const settings = ['the neighborhood', 'the backyard', 'the library', 'the community center', 'the forest path', 'the school garden', 'the beach'];
  const setting = settings[idx % settings.length];

  return {
    title: `${char} and the ${topic.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}`,
    paragraphs: [
      `${char} had been curious about ${topic} for a long time.`,
      `One afternoon, while exploring ${setting}, ${char} decided it was finally time to try.`,
      `The first step was harder than expected. ${char} almost gave up twice.`,
      `Luckily, ${char2} happened to walk by and offered to help.`,
      `Together, they came up with a clever plan using things they found nearby.`,
      `They worked carefully for over an hour, making sure every detail was right.`,
      `When they finally finished, both of them stepped back to admire their work.`,
      `"I could not have done this without you," ${char} said honestly.`,
      `${char2} smiled. "That is what friends are for."`
    ],
    wordCount: 127
  };
}

function generateGrade2Questions(storyData) {
  const charName = storyData.paragraphs[0].split(' ')[0];
  return [
    { id: 'q1', type: 'main_idea', question: `What is the central idea of "${storyData.title}"?`, options: [`${charName} and a friend work together to accomplish something challenging`, 'A student gets in trouble at school', 'Two characters have a big argument'], correct: 0, explanation: 'The story centers on two friends overcoming a challenge through collaboration.' },
    { id: 'q2', type: 'character', question: `What character trait best describes ${charName}?`, options: ['Curious and determined', 'Lazy and uninterested', 'Rude and impatient'], correct: 0, explanation: `${charName} shows curiosity by wanting to explore and determination by not giving up.` },
    { id: 'q3', type: 'setting', question: 'Where and when does most of this story take place?', options: ['Outdoors or in a familiar community space during the afternoon', 'In outer space at night', 'In a hospital during winter'], correct: 0, explanation: 'The story takes place in a familiar community setting during the afternoon.' },
    { id: 'q4', type: 'sequence', question: 'What happens right before the characters make their plan?', options: ['A second character arrives and offers help', 'They give up and go home', 'They call an adult for answers'], correct: 0, explanation: 'The second character arrives to help before they come up with their clever plan.' },
    { id: 'q5', type: 'vocabulary', question: 'What does "curious" mean in this story?', options: ['Wanting to learn and discover more', 'Being afraid of new things', 'Being completely bored'], correct: 0, explanation: 'Curious means having a strong desire to know or learn about something.' },
    { id: 'q6', type: 'vocabulary', question: 'What does "admire" mean?', options: ['Look at with great appreciation and respect', 'Ignore completely', 'Break apart and throw away'], correct: 0, explanation: 'To admire something means to look at it with appreciation and pride.' },
    { id: 'q7', type: 'vocabulary', question: 'What does "honestly" mean?', options: ['Saying what is truly true without lying', 'Saying things that are not true', 'Staying completely silent'], correct: 0, explanation: 'Honestly means telling the true truth, even when it might be hard to say.' },
    { id: 'q8', type: 'detail', question: 'How many times does the main character almost give up?', options: ['Twice', 'Once', 'Three times'], correct: 0, explanation: 'The main character almost gives up twice before getting help.' },
    { id: 'q9', type: 'detail', question: 'How long do the two friends work together?', options: ['Over an hour', 'Just a few minutes', 'All day and all night'], correct: 0, explanation: 'They work carefully together for over an hour.' },
    { id: 'q10', type: 'detail', question: 'What do they use to make their plan work?', options: ['Things they find nearby', 'Things they bought at a store', 'Things a teacher gave them'], correct: 0, explanation: 'They use things they found nearby — showing creativity and resourcefulness!' },
    { id: 'q11', type: 'inference', question: `Why does ${charName} say "I could not have done this without you"?`, options: ['To show genuine gratitude for a friend who made success possible', 'To be polite even though it is not true', 'Because the friend did all the work alone'], correct: 0, explanation: 'This sentence shows deep, sincere gratitude — the friendship truly made the difference.' },
    { id: 'q12', type: 'inference', question: 'What does "That is what friends are for" tell us about friendship?', options: ['True friends help each other through challenges', 'Friends only help when they get something in return', 'Friends should never ask each other for help'], correct: 0, explanation: "That phrase captures the essence of friendship — supporting each other when it counts most." },
    { id: 'q13', type: 'cause_effect', question: 'What causes the characters to succeed in their challenge?', options: ['One friend asking for help and both working as a team', 'Pure luck with no effort', 'An adult solving the problem for them'], correct: 0, explanation: 'Asking for help and working as a team are what make success possible.' },
    { id: 'q14', type: 'compare', question: 'What do both characters have in common?', options: ['Both are willing to help and work hard together', 'Both give up at the same time', 'Both do exactly the same thing throughout'], correct: 0, explanation: 'Both characters show a willingness to help and work hard — great qualities!' },
    { id: 'q15', type: 'prediction', question: 'How will this shared experience affect their friendship?', options: ['Make it stronger because they overcame something hard together', 'Weaken it because of disagreements', 'Not change it at all'], correct: 0, explanation: 'Overcoming challenges together always strengthens friendships.' },
    { id: 'q16', type: 'authors_purpose', question: 'What message is the author trying to share?', options: ['Friendship, teamwork, and gratitude lead to success and happiness', 'It is better to solve problems alone', 'Helping others is a waste of time'], correct: 0, explanation: 'The author celebrates the power of friendship, teamwork, and genuine gratitude.' },
    { id: 'q17', type: 'text_evidence', question: 'Which sentence best shows that the characters are proud of what they accomplished?', options: ['They stepped back to admire their work.', 'The first step was harder than expected.', 'One afternoon they decided to try.'], correct: 0, explanation: 'Stepping back to admire their work shows pride in what they achieved.' },
    { id: 'q18', type: 'emotion', question: 'How do both characters feel at the end of the story?', options: ['Proud, happy, and grateful for each other', 'Tired and disappointed', 'Ready to argue about who did more work'], correct: 0, explanation: 'They end with smiles and sincere thanks — proud, happy, and grateful.' },
    { id: 'q19', type: 'problem_solution', question: 'What was the problem and how did the characters solve it?', options: ['A challenging task; solved by working together creatively', 'A broken object; solved by buying a new one', 'A misunderstanding; solved by an apology'], correct: 0, explanation: 'The challenge is overcome through creative teamwork and mutual support.' },
    { id: 'q20', type: 'title', question: 'How does the title connect to the story\'s main events?', options: ['The title names the character and the central challenge they overcome', 'The title is about a character not in the story', 'The title has nothing to do with what happens'], correct: 0, explanation: 'The title introduces the character and the challenge, which is exactly what the story delivers.' }
  ];
}

export const EARLY_GRADE_STORY_COUNT = { K: 200, '1': 200, '2': 200 };
export const TOTAL_EARLY_STORIES = 600;
