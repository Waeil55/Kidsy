// Utility for Coin Images - Using Raw Merola Repo links
const COIN_URLS = {
    c1: "https://raw.githubusercontent.com/Waeil55/Merola/main/1.PNG",
    c5: "https://raw.githubusercontent.com/Waeil55/Merola/main/5.PNG",
    c10: "https://raw.githubusercontent.com/Waeil55/Merola/main/10.PNG",
    c25: "https://raw.githubusercontent.com/Waeil55/Merola/main/25.PNG",
    c100: "https://raw.githubusercontent.com/Waeil55/Merola/main/1dollar.PNG"
};

const getCoin = (key) => {
    const sizes = { c10: '3.5em', c1: '3.8em', c5: '4.2em', c25: '4.8em', c100: '5.2em' }; 
    return `<img src="${COIN_URLS[key]}" class="coin-img align-middle inline-block mx-1 object-contain max-w-[20vw]" style="height: ${sizes[key]}" alt="${key}">`;
};

// Clock SVG Generator
function getClockSVG(h, m) {
    const hDeg = (h % 12 + m / 60) * 30;
    const mDeg = m * 6;
    return `
    <div class="inline-block bg-white p-2 rounded-full border-4 border-purple-200 shadow-lg">
        <svg width="150" height="150" viewBox="0 0 100 100" class="mx-auto">
            <circle cx="50" cy="50" r="45" fill="#FFF" stroke="#673AB7" stroke-width="4"/>
            ${[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((n, i) => {
                const ang = (i * 30) * Math.PI / 180;
                return `<text x="${50 + 35 * Math.sin(ang)}" y="${54 - 35 * Math.cos(ang)}" font-size="9" text-anchor="middle" fill="#673AB7" font-weight="900" style="font-family:'Comic Neue'">${n}</text>`;
            }).join('')}
            <line x1="50" y1="50" x2="50" y2="28" stroke="#2D3436" stroke-width="5" stroke-linecap="round" transform="rotate(${hDeg} 50 50)"/>
            <line x1="50" y1="50" x2="50" y2="15" stroke="#E91E63" stroke-width="3" stroke-linecap="round" transform="rotate(${mDeg} 50 50)"/>
            <circle cx="50" cy="50" r="3" fill="#673AB7"/>
        </svg>
    </div>`;
}

// Fixed Shape SVG Generator - High Visibility for Grade 2
function getShapeSVG(type) {
    const shapes = {
        circle: '<circle cx="50" cy="50" r="40" fill="#FF7675" stroke="#D63031" stroke-width="5"/>',
        square: '<rect x="15" y="15" width="70" height="70" fill="#74B9FF" stroke="#0984E3" stroke-width="5"/>',
        triangle: '<polygon points="50,10 90,90 10,90" fill="#55EFC4" stroke="#00B894" stroke-width="5"/>',
        rectangle: '<rect x="10" y="25" width="80" height="50" fill="#FDCB6E" stroke="#E17055" stroke-width="5"/>',
        star: '<polygon points="50,5 63,35 95,35 70,55 80,85 50,65 20,85 30,55 5,35 37,35" fill="#A29BFE" stroke="#6C5CE7" stroke-width="5"/>',
        sphere: '<circle cx="50" cy="50" r="40" fill="#81ECEC" stroke="#00CEC9" stroke-width="5"/>',
        cube: '<path d="M20 30 l30 -15 l30 15 v40 l-30 15 l-30 -15 z" fill="#FAB1A0" stroke="#E17055" stroke-width="5"/><path d="M20 30 l30 15 l30 -15 M50 45 v40" fill="none" stroke="#E17055" stroke-width="4"/>',
        cone: '<ellipse cx="50" cy="80" rx="30" ry="10" fill="#FFEAA7" stroke="#FDCB6E" stroke-width="5"/><path d="M20 80 L50 20 L80 80" fill="#FFEAA7" stroke="#FDCB6E" stroke-width="5"/>',
        cylinder: '<ellipse cx="50" cy="25" rx="30" ry="10" fill="#81ECEC" stroke="#00CEC9" stroke-width="5"/><path d="M20 25 v50 a30 10 0 0 0 60 0 v-50" fill="#81ECEC" stroke="#00CEC9" stroke-width="5"/><ellipse cx="50" cy="75" rx="30" ry="10" fill="none" stroke="#00CEC9" stroke-width="5" stroke-dasharray="4"/>',
        pyramid: '<polygon points="50,10 90,80 10,80" fill="#D63031" stroke="#2D3436" stroke-width="5"/><line x1="50" y1="10" x2="50" y2="80" stroke="#2D3436" stroke-width="4"/>'
    };
    return `<svg width="150" height="150" viewBox="0 0 100 100" class="mx-auto block drop-shadow-lg">${shapes[type] || ''}</svg>`;
}

// 20 Questions for Coin Lab (10 pages)
const initialCoinData = [
    { q: `Count:<br>${getCoin('c1')} + ${getCoin('c1')}`, opts: ["1 cent", "2 cents", "3 cents", "5 cents"], c: 1 },
    { q: `Count:<br>${getCoin('c5')} + ${getCoin('c5')}`, opts: ["5 cents", "10 cents", "15 cents", "20 cents"], c: 1 },
    { q: `Count:<br>${getCoin('c10')} + ${getCoin('c1')}`, opts: ["10 cents", "11 cents", "12 cents", "9 cents"], c: 1 },
    { q: `Count:<br>${getCoin('c25')} + ${getCoin('c25')}`, opts: ["25 cents", "50 cents", "75 cents", "$1.00"], c: 1 },
    { q: `Count:<br>${getCoin('c10')} + ${getCoin('c10')}`, opts: ["10 cents", "20 cents", "30 cents", "15 cents"], c: 1 },
    { q: `Count:<br>${getCoin('c25')} + ${getCoin('c10')}`, opts: ["30 cents", "35 cents", "40 cents", "25 cents"], c: 1 },
    { q: `Count:<br>${getCoin('c5')} + ${getCoin('c1')} + ${getCoin('c1')}`, opts: ["5 cents", "6 cents", "7 cents", "8 cents"], c: 2 },
    { q: `Count:<br>${getCoin('c10')} + ${getCoin('c5')}`, opts: ["10 cents", "15 cents", "20 cents", "25 cents"], c: 1 },
    { q: `Count:<br>${getCoin('c25')} + ${getCoin('c25')} + ${getCoin('c25')}`, opts: ["50 cents", "75 cents", "$1.00", "25 cents"], c: 1 },
    { q: `Count:<br>${getCoin('c1')} + ${getCoin('c1')} + ${getCoin('c1')}`, opts: ["2 cents", "3 cents", "4 cents", "5 cents"], c: 1 },
    { q: `Count:<br>${getCoin('c10')} + ${getCoin('c10')} + ${getCoin('c10')}`, opts: ["20 cents", "30 cents", "40 cents", "10 cents"], c: 1 },
    { q: `Count:<br>${getCoin('c5')} + ${getCoin('c5')} + ${getCoin('c5')}`, opts: ["10 cents", "15 cents", "20 cents", "5 cents"], c: 1 },
    { q: `Count:<br>${getCoin('c25')} + ${getCoin('c5')}`, opts: ["25 cents", "30 cents", "35 cents", "40 cents"], c: 1 },
    { q: `Count:<br>${getCoin('c10')} + ${getCoin('c5')} + ${getCoin('c1')}`, opts: ["15 cents", "16 cents", "17 cents", "10 cents"], c: 1 },
    { q: `Count:<br>${getCoin('c25')} + ${getCoin('c25')} + ${getCoin('c25')} + ${getCoin('c25')}`, opts: ["75 cents", "$1.00", "$1.25", "$2.00"], c: 1 },
    { q: `Count:<br>${getCoin('c10')} + ${getCoin('c10')} + ${getCoin('c5')}`, opts: ["20 cents", "25 cents", "30 cents", "15 cents"], c: 1 },
    { q: `Count:<br>${getCoin('c25')} + ${getCoin('c1')} + ${getCoin('c1')}`, opts: ["25 cents", "26 cents", "27 cents", "28 cents"], c: 2 },
    { q: `Count:<br>${getCoin('c5')} + ${getCoin('c5')} + ${getCoin('c1')}`, opts: ["10 cents", "11 cents", "12 cents", "13 cents"], c: 1 },
    { q: `Count:<br>${getCoin('c10')} + ${getCoin('c10')} + ${getCoin('c1')}`, opts: ["20 cents", "21 cents", "22 cents", "10 cents"], c: 1 },
    { q: `Count:<br>${getCoin('c10')} + ${getCoin('c5')} + ${getCoin('c5')}`, opts: ["15 cents", "20 cents", "25 cents", "10 cents"], c: 1 }
];

// 80 Questions for Time Lab (10 pages)
function generateTimeData() {
    const list = [];
    const pool = ["1:00", "4:30", "10:15", "6:00", "12:45", "8:20", "2:15", "9:50", "3:35", "7:05"];
    for (let i = 0; i < 80; i++) {
        const h = (i % 12) + 1;
        const m = (i * 5) % 60;
        const correct = `${h}:${m.toString().padStart(2, '0')}`;
        const distractors = pool.filter(d => d !== correct);
        const rawOpts = [correct, distractors[0], distractors[1], distractors[2]];
        const opts = shuffle([...rawOpts]);
        list.push({ q: `What time is it?<br>${getClockSVG(h, m)}`, opts: opts, c: opts.indexOf(correct) });
    }
    return list;
}

// 100 Questions for Math Lab (10 pages)
function generateMathData() {
    const list = [];
    for (let i = 0; i < 100; i++) {
        const op = i % 2 === 0 ? '+' : '-';
        let a, b, res;
        if (op === '+') { a = Math.floor(Math.random() * 50) + 1; b = Math.floor(Math.random() * 50) + 1; res = a + b; }
        else { a = Math.floor(Math.random() * 80) + 20; b = Math.floor(Math.random() * (a - 1)) + 1; res = a - b; }
        const correct = res.toString();
        const wrongSet = new Set([
            (res + 2).toString(),
            Math.max(0, res - 3).toString(),
            (res + 5).toString()
        ]);
        wrongSet.delete(correct);
        const distractors = Array.from(wrongSet);
        while (distractors.length < 3) distractors.push((res + distractors.length + 10).toString());
        const opts = shuffle([correct, distractors[0], distractors[1], distractors[2]]);
        list.push({ q: `Solve:<br><span class="text-5xl font-black">${a} ${op} ${b} = ?</span>`, opts: opts, c: opts.indexOf(correct) });
    }
    return list;
}

// 50 Questions for Shapes Lab (10 pages)
function generateShapesData() {
    const list = [];
    const names = ["circle", "square", "triangle", "rectangle", "star", "sphere", "cube", "cone", "cylinder", "pyramid"];
    for (let i = 0; i < 50; i++) {
        const type = names[i % names.length];
        const correct = type.charAt(0).toUpperCase() + type.slice(1);
        const wrongs = ["Box", "Point", "Line", "Ball", "Flat", "Big", "Ring", "Oval"].filter(w => w !== correct);
        const opts = shuffle([correct, wrongs[0], wrongs[1], wrongs[2]]);
        list.push({ q: `Identify this shape:<br>${getShapeSVG(type)}`, opts: opts, c: opts.indexOf(correct) });
    }
    return list;
}

// 100 Questions for Grammar Lab (10 pages)
function generateGrammarData() {
    const nouns = ["Dog", "Apple", "Teacher", "School", "Book", "Park", "Cat", "Ball", "Car", "Tree", "Bird", "House"];
    const verbs = ["Run", "Jump", "Eat", "Sleep", "Sing", "Dance", "Write", "Read", "Swim", "Play", "Laugh", "Talk"];
    const list = [];
    for (let i = 0; i < 100; i++) {
        const isNoun = i % 2 === 0;
        const word = isNoun ? nouns[Math.floor(Math.random() * nouns.length)] : verbs[Math.floor(Math.random() * verbs.length)];
        list.push({ q: `Is "<b>${word}</b>" a Noun or a Verb?`, opts: ["Noun", "Verb"], c: isNoun ? 0 : 1 });
    }
    return list;
}


