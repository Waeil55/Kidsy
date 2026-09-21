const wordPartsData = [
    {
        title: "Prefix: un- (Not)",
        instr: "Find the word that means 'NOT'.",
        qs: [
            { q: "NOT happy", opts: ["Unhappy", "Rehappy", "Prehappy", "Dishappy"], c: 0 },
            { q: "NOT kind", opts: ["Rekind", "Unkind", "Prekind", "Diskind"], c: 1 },
            { q: "NOT safe", opts: ["Unsafe", "Resafe", "Presafe", "Dissafe"], c: 0 },
            { q: "NOT lucky", opts: ["Relucky", "Unlucky", "Prelucky", "Dislucky"], c: 1 },
            { q: "NOT fair", opts: ["Unfair", "Refair", "Prefair", "Disfair"], c: 0 }
        ]
    },
    {
        title: "Prefix: re- (Again)",
        instr: "Find the word that means 'AGAIN'.",
        qs: [
            { q: "Play AGAIN", opts: ["Unplay", "Replay", "Preplay", "Misplay"], c: 1 },
            { q: "Read AGAIN", opts: ["Unread", "Reread", "Preread", "Misread"], c: 1 },
            { q: "Write AGAIN", opts: ["Unwrite", "Rewrite", "Prewrite", "Miswrite"], c: 1 },
            { q: "Fill AGAIN", opts: ["Unfill", "Refill", "Prefill", "Disfill"], c: 1 },
            { q: "Tell AGAIN", opts: ["Untell", "Retell", "Pretell", "Mistell"], c: 1 }
        ]
    },
    {
        title: "Prefix: pre- (Before)",
        instr: "Find the word that means 'BEFORE'.",
        qs: [
            { q: "View BEFORE", opts: ["Preview", "Review", "Unview", "Disview"], c: 0 },
            { q: "Heat BEFORE", opts: ["Preheat", "Reheat", "Unheat", "Disheat"], c: 0 },
            { q: "School BEFORE", opts: ["Preschool", "Reschool", "Unschool", "Disschool"], c: 0 },
            { q: "Pay BEFORE", opts: ["Prepay", "Repay", "Unpay", "Dispay"], c: 0 },
            { q: "Test BEFORE", opts: ["Pretest", "Retest", "Untest", "Distest"], c: 0 }
        ]
    },
    {
        title: "Suffix: -ful (Full of)",
        instr: "Find the word that means 'FULL OF'.",
        qs: [
            { q: "Full of HELP", opts: ["Helpless", "Helpful", "Helpness", "Helply"], c: 1 },
            { q: "Full of CARE", opts: ["Careless", "Careful", "Careness", "Carely"], c: 1 },
            { q: "Full of CHEER", opts: ["Cheerless", "Cheerful", "Cheerness", "Cheerly"], c: 1 },
            { q: "Full of COLOR", opts: ["Colorless", "Colorful", "Colorness", "Colorly"], c: 1 },
            { q: "Full of HOPE", opts: ["Hopeless", "Hopeful", "Hopeness", "Hopely"], c: 1 }
        ]
    },
    {
        title: "Suffix: -less (Without)",
        instr: "Find the word that means 'WITHOUT'.",
        qs: [
            { q: "Without HOME", opts: ["Homeful", "Homeless", "Homeness", "Homely"], c: 1 },
            { q: "Without FEAR", opts: ["Fearful", "Fearless", "Fearness", "Fearly"], c: 1 },
            { q: "Without USE", opts: ["Useful", "Useless", "Useness", "Usely"], c: 1 },
            { q: "Without PAIN", opts: ["Painful", "Painless", "Painness", "Painly"], c: 1 },
            { q: "Without CLOUD", opts: ["Cloudful", "Cloudless", "Cloudness", "Cloudly"], c: 1 }
        ]
    },
    {
        title: "Suffix: -er (One who)",
        instr: "Find the person who does the action.",
        qs: [
            { q: "One who TEACHES", opts: ["Teaching", "Teacher", "Teachly", "Teachful"], c: 1 },
            { q: "One who PAINTS", opts: ["Painting", "Painter", "Paintly", "Paintful"], c: 1 },
            { q: "One who SINGS", opts: ["Singing", "Singer", "Singly", "Singful"], c: 1 },
            { q: "One who HELPS", opts: ["Helping", "Helper", "Helply", "Helpful"], c: 1 },
            { q: "One who WORKS", opts: ["Working", "Worker", "Workly", "Workful"], c: 1 }
        ]
    },
    {
        title: "Suffix: -ly (In a way)",
        instr: "How is the action done?",
        qs: [
            { q: "In a QUICK way", opts: ["Quickly", "Quicker", "Quickest", "Quickness"], c: 0 },
            { q: "In a SLOW way", opts: ["Slowly", "Slower", "Slowest", "Slowness"], c: 0 },
            { q: "In a LOUD way", opts: ["Loudly", "Louder", "Loudest", "Loudness"], c: 0 },
            { q: "In a SOFT way", opts: ["Softly", "Softer", "Softest", "Softness"], c: 0 },
            { q: "In a KIND way", opts: ["Kindly", "Kinder", "Kindest", "Kindness"], c: 0 }
        ]
    },
    {
        title: "Prefix: dis- (Opposite)",
        instr: "Find the opposite word.",
        qs: [
            { q: "Opposite of LIKE", opts: ["Unlike", "Dislike", "Relike", "Prelike"], c: 1 },
            { q: "Opposite of AGREE", opts: ["Unagree", "Disagree", "Reagree", "Preagree"], c: 1 },
            { q: "Opposite of TRUST", opts: ["Untrust", "Distrust", "Retrust", "Pretrust"], c: 1 },
            { q: "Opposite of APPEAR", opts: ["Unappear", "Disappear", "Reappear", "Preappear"], c: 1 },
            { q: "Opposite of OBEY", opts: ["Unobey", "Disobey", "Reobey", "Preobey"], c: 1 }
        ]
    },
    {
        title: "Suffix: -er vs -est",
        instr: "Comparing two or more.",
        qs: [
            { q: "MORE tall", opts: ["Tallest", "Taller", "Tallly", "Tallness"], c: 1 },
            { q: "MOST tall", opts: ["Taller", "Tallest", "Tally", "Tallness"], c: 1 },
            { q: "MORE fast", opts: ["Fastest", "Faster", "Fastly", "Fastness"], c: 1 },
            { q: "MOST fast", opts: ["Faster", "Fastest", "Fastly", "Fastness"], c: 1 },
            { q: "MORE small", opts: ["Smallest", "Smaller", "Smally", "Smallness"], c: 1 }
        ]
    },
    {
        title: "Prefix: mis- (Wrong)",
        instr: "Find the word for 'WRONG'.",
        qs: [
            { q: "Spell WRONG", opts: ["Prespell", "Misspell", "Unspell", "Respell"], c: 1 },
            { q: "Lead WRONG", opts: ["Prelead", "Mislead", "Unlead", "Relead"], c: 1 },
            { q: "Place WRONG", opts: ["Preplace", "Misplace", "Unplace", "Replace"], c: 1 },
            { q: "Understand WRONG", opts: ["Preunderstand", "Misunderstand", "Ununderstand", "Reunderstand"], c: 1 },
            { q: "Behave WRONG", opts: ["Prebehave", "Misbehave", "Unbehave", "Rebehave"], c: 1 }
        ]
    }
];

export { wordPartsData };

