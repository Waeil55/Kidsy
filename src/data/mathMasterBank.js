// ============================================================================
// MATH MASTER BANK - 500+ DEDICATED QUESTIONS PER GRADE (3,500 TOTAL)
// Strictly isolated by grade level (K, 1, 2, 3, 4, 5, 6)
// Progressive difficulty, clear hints, smart distractors, and step-by-step explanations
// ============================================================================

function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// ----------------------------------------------------------------------------
// GRADE K MATH ENGINE (500 Questions: Counting, + / - to 10, Shapes, Compare)
// ----------------------------------------------------------------------------
function generateGradeKMath() {
  const list = [];
  const shapes = ['Circle ⭕', 'Square ⬛', 'Triangle 🔺', 'Rectangle 📄', 'Star ⭐', 'Heart ❤️'];
  const colors = ['Red 🔴', 'Blue 🔵', 'Green 🟢', 'Yellow 🟡', 'Orange 🟠', 'Purple 🟣'];

  for (let i = 1; i <= 500; i++) {
    const type = i % 5;
    let prompt = '';
    let correct = '';
    let wrongs = [];
    let explanation = '';
    let category = 'Counting & Numbers';
    let hint = '';

    if (type === 0) {
      // Counting
      const count = (i % 20) + 1;
      const emoji = (i % 2 === 0) ? '🍎' : '⭐';
      prompt = `Count the items:\n${emoji.repeat(count)}\nHow many are there?`;
      correct = `${count}`;
      wrongs = [`${count + 1}`, `${Math.max(1, count - 1)}`, `${count + 2}`];
      explanation = `Count them one by one: there are exactly ${count} ${emoji}!`;
      category = 'Counting';
      hint = 'Point to each item with your finger as you count.';
    } else if (type === 1) {
      // Basic Addition within 10
      const a = (i % 6) + 1;
      const b = (i % 5) + 1;
      prompt = `What is ${a} + ${b}?`;
      correct = `${a + b}`;
      wrongs = [`${a + b + 1}`, `${Math.max(1, a + b - 1)}`, `${a + b + 2}`];
      explanation = `Start at ${a} and count forward ${b} more: you get ${a + b}!`;
      category = 'Addition';
      hint = `Think: ${a} fingers plus ${b} more fingers.`;
    } else if (type === 2) {
      // Basic Subtraction within 10
      const a = (i % 6) + 4;
      const b = (i % 4) + 1;
      prompt = `What is ${a} - ${b}?`;
      correct = `${a - b}`;
      wrongs = [`${a - b + 1}`, `${Math.max(0, a - b - 1)}`, `${a - b + 2}`];
      explanation = `Start with ${a} and take away ${b}: you have ${a - b} left!`;
      category = 'Subtraction';
      hint = `Count backward ${b} steps from ${a}.`;
    } else if (type === 3) {
      // Shapes & Patterns
      const shp = shapes[i % shapes.length];
      prompt = `Which shape has 3 straight sides and 3 corners?`;
      if (i % 2 === 0) {
        prompt = `Which shape is completely round with no sharp corners?`;
        correct = 'Circle ⭕';
        wrongs = ['Square ⬛', 'Triangle 🔺', 'Rectangle 📄'];
        explanation = 'A circle is round like a ball or pancake with 0 corners.';
      } else {
        correct = 'Triangle 🔺';
        wrongs = ['Circle ⭕', 'Square ⬛', 'Rectangle 📄'];
        explanation = 'A triangle has 3 sides and 3 points (tri means three!).';
      }
      category = 'Shapes & Geometry';
      hint = 'Count the points and straight edges.';
    } else {
      // Comparing Numbers
      const a = (i % 15) + 1;
      const b = ((i + 3) % 15) + 1;
      if (a === b) {
        prompt = `Which number is EQUAL to ${a}?`;
        correct = `${a}`;
        wrongs = [`${a + 1}`, `${a + 2}`, `${a - 1}`];
        explanation = `${a} is equal to ${a}!`;
      } else {
        const bigger = Math.max(a, b);
        const smaller = Math.min(a, b);
        prompt = `Which number is BIGGER (greater): ${smaller} or ${bigger}?`;
        correct = `${bigger}`;
        wrongs = [`${smaller}`, `${smaller - 1}`, 'Both are the same'];
        explanation = `${bigger} is more than ${smaller}!`;
      }
      category = 'Comparing';
      hint = 'Think about which number is further along on the number line.';
    }

    const choices = shuffleArray([correct, ...wrongs]);
    list.push({
      id: `math-k-${i}`,
      grade: 'K',
      number: i,
      category,
      prompt,
      choices,
      answer: choices.indexOf(correct),
      explanation,
      hint
    });
  }
  return list;
}

// ----------------------------------------------------------------------------
// GRADE 1 MATH ENGINE (500 Questions: + / - to 20, Place Value, Time, Bonds)
// ----------------------------------------------------------------------------
function generateGrade1Math() {
  const list = [];
  for (let i = 1; i <= 500; i++) {
    const type = i % 5;
    let prompt = '';
    let correct = '';
    let wrongs = [];
    let explanation = '';
    let category = 'Addition & Subtraction';
    let hint = '';

    if (type === 0) {
      // Addition up to 20
      const a = (i % 10) + 5;
      const b = (i % 8) + 2;
      prompt = `What is ${a} + ${b}?`;
      correct = `${a + b}`;
      wrongs = [`${a + b + 1}`, `${a + b - 1}`, `${a + b + 2}`];
      explanation = `${a} + ${b} = ${a + b}. You can make 10 first!`;
      category = 'Addition to 20';
      hint = 'Break apart the smaller number to make a ten.';
    } else if (type === 1) {
      // Subtraction within 20
      const a = (i % 10) + 11;
      const b = (i % 8) + 2;
      prompt = `What is ${a} - ${b}?`;
      correct = `${a - b}`;
      wrongs = [`${a - b + 1}`, `${a - b - 1}`, `${a - b + 2}`];
      explanation = `${a} - ${b} = ${a - b}. Count back from ${a}.`;
      category = 'Subtraction to 20';
      hint = `Think: ${b} + what number equals ${a}?`;
    } else if (type === 2) {
      // Number Bonds to 10 or 20
      const target = (i % 2 === 0) ? 10 : 20;
      const part = (i % (target - 2)) + 1;
      const missing = target - part;
      prompt = `Number Bond: ${part} + _____ = ${target}`;
      correct = `${missing}`;
      wrongs = [`${missing + 1}`, `${Math.max(1, missing - 1)}`, `${missing + 2}`];
      explanation = `${part} plus ${missing} makes ${target}!`;
      category = 'Number Bonds';
      hint = `Subtract ${part} from ${target}.`;
    } else if (type === 3) {
      // Place Value (Tens and Ones)
      const tens = (i % 8) + 1;
      const ones = (i % 9) + 1;
      const val = tens * 10 + ones;
      prompt = `What number is ${tens} tens and ${ones} ones?`;
      correct = `${val}`;
      wrongs = [`${ones * 10 + tens}`, `${val + 10}`, `${val - 1}`];
      explanation = `${tens} tens = ${tens * 10}, plus ${ones} ones = ${val}.`;
      category = 'Place Value';
      hint = `Write ${tens} in the tens column and ${ones} in the ones column.`;
    } else {
      // Telling Time & 1-step Word Problems
      if (i % 2 === 0) {
        const hour = (i % 12) + 1;
        prompt = `The short hour hand points to ${hour}, and the long minute hand points to 12. What time is it?`;
        correct = `${hour}:00`;
        wrongs = [`${(hour % 12) + 1}:00`, `${hour}:30`, `12:00`];
        explanation = `When the long hand is on 12, it is exactly ${hour} o'clock (${hour}:00)!`;
        category = 'Telling Time';
        hint = 'The short hand shows the hour.';
      } else {
        const apples = (i % 8) + 3;
        const eaten = (i % 3) + 1;
        prompt = `Story Math: Leo had ${apples} cookies. He ate ${eaten} cookies with milk. How many cookies are left?`;
        correct = `${apples - eaten}`;
        wrongs = [`${apples - eaten + 1}`, `${apples + eaten}`, `${apples - eaten - 1}`];
        explanation = `${apples} cookies minus ${eaten} eaten leaves ${apples - eaten} cookies.`;
        category = 'Word Problems';
        hint = 'Take away the cookies that were eaten.';
      }
    }

    const choices = shuffleArray([correct, ...wrongs]);
    list.push({
      id: `math-1-${i}`,
      grade: '1',
      number: i,
      category,
      prompt,
      choices,
      answer: choices.indexOf(correct),
      explanation,
      hint
    });
  }
  return list;
}

// ----------------------------------------------------------------------------
// GRADE 2 MATH ENGINE (500 Questions: 2-digit +/- Regrouping, Money, Skip Count)
// ----------------------------------------------------------------------------
function generateGrade2Math() {
  const list = [];
  for (let i = 1; i <= 500; i++) {
    const type = i % 5;
    let prompt = '';
    let correct = '';
    let wrongs = [];
    let explanation = '';
    let category = '2-Digit Math';
    let hint = '';

    if (type === 0) {
      // 2-digit addition with regrouping
      const a = 20 + (i % 50);
      const b = 15 + ((i * 3) % 45);
      prompt = `Solve: ${a} + ${b} = ?`;
      correct = `${a + b}`;
      wrongs = [`${a + b + 10}`, `${a + b - 10}`, `${a + b + 2}`];
      explanation = `Add the ones: ${(a % 10) + (b % 10)}. Regroup 1 ten if needed. Total = ${a + b}.`;
      category = 'Addition with Regrouping';
      hint = 'Add the ones first, then add the tens.';
    } else if (type === 1) {
      // 2-digit subtraction with regrouping
      const a = 50 + (i % 45);
      const b = 15 + ((i * 2) % 30);
      prompt = `Solve: ${a} - ${b} = ?`;
      correct = `${a - b}`;
      wrongs = [`${a - b + 10}`, `${a - b - 10}`, `${a - b + 2}`];
      explanation = `Subtract the ones (borrow 1 ten if needed). ${a} - ${b} = ${a - b}.`;
      category = 'Subtraction with Regrouping';
      hint = 'If the top ones digit is smaller, borrow from the tens.';
    } else if (type === 2) {
      // Money & Coins
      const quarters = (i % 4);
      const dimes = (i % 5);
      const nickels = (i % 3);
      const pennies = (i % 5);
      const totalCents = quarters * 25 + dimes * 10 + nickels * 5 + pennies * 1;
      prompt = `How much money is ${quarters} quarter${quarters === 1 ? '' : 's'}, ${dimes} dime${dimes === 1 ? '' : 's'}, and ${nickels} nickel${nickels === 1 ? '' : 's'}?`;
      correct = `${totalCents - pennies}¢`;
      wrongs = [`${totalCents - pennies + 10}¢`, `${totalCents - pennies - 5}¢`, `${totalCents - pennies + 15}¢`];
      explanation = `Quarter = 25¢, Dime = 10¢, Nickel = 5¢. Sum = ${totalCents - pennies}¢!`;
      category = 'Money & Coins';
      hint = 'Count by 25s for quarters, 10s for dimes, and 5s for nickels.';
    } else if (type === 3) {
      // Skip Counting by 2s, 5s, 10s, 100s
      const step = (i % 3 === 0) ? 5 : (i % 3 === 1) ? 10 : 2;
      const start = step * ((i % 10) + 1);
      prompt = `Skip counting by ${step}s: ${start}, ${start + step}, ${start + step * 2}, _____ ?`;
      correct = `${start + step * 3}`;
      wrongs = [`${start + step * 3 + step}`, `${start + step * 3 - 1}`, `${start + step * 4}`];
      explanation = `Add ${step} to ${start + step * 2}: you get ${start + step * 3}!`;
      category = 'Skip Counting';
      hint = `Add ${step} to find the next number in the pattern.`;
    } else {
      // Time to 5 minutes
      const min = ((i % 11) + 1) * 5;
      const hour = (i % 12) + 1;
      prompt = `If the hour hand is just past ${hour} and the minute hand points to ${min / 5}, what time is it?`;
      correct = `${hour}:${min < 10 ? '0' + min : min}`;
      wrongs = [`${hour}:${min + 5}`, `${hour}:${Math.max(5, min - 5)}`, `${(hour % 12) + 1}:${min}`];
      explanation = `Each clock number is 5 minutes. ${min / 5} × 5 = ${min} minutes. It is ${hour}:${min < 10 ? '0' + min : min}.`;
      category = 'Telling Time';
      hint = 'Multiply the minute hand number by 5.';
    }

    const choices = shuffleArray([correct, ...wrongs]);
    list.push({
      id: `math-2-${i}`,
      grade: '2',
      number: i,
      category,
      prompt,
      choices,
      answer: choices.indexOf(correct),
      explanation,
      hint
    });
  }
  return list;
}

// ----------------------------------------------------------------------------
// GRADE 3 MATH ENGINE (500 Questions: Multiplication 0-10, Division, Fractions, 3-digit)
// ----------------------------------------------------------------------------
function generateGrade3Math() {
  const list = [];
  for (let i = 1; i <= 500; i++) {
    const type = i % 5;
    let prompt = '';
    let correct = '';
    let wrongs = [];
    let explanation = '';
    let category = 'Multiplication';
    let hint = '';

    if (type === 0) {
      // Multiplication Facts (0 to 10)
      const a = (i % 9) + 2;
      const b = ((i * 3) % 9) + 2;
      prompt = `Multiply: ${a} × ${b} = ?`;
      correct = `${a * b}`;
      wrongs = [`${a * b + a}`, `${a * b - b}`, `${a * b + 4}`];
      explanation = `${a} groups of ${b} equals ${a * b}!`;
      category = 'Multiplication Facts';
      hint = `Think of ${a} equal rows with ${b} items in each row.`;
    } else if (type === 1) {
      // Division Facts
      const b = (i % 8) + 2;
      const q = ((i * 2) % 8) + 2;
      const a = b * q;
      prompt = `Divide: ${a} ÷ ${b} = ?`;
      correct = `${q}`;
      wrongs = [`${q + 1}`, `${Math.max(1, q - 1)}`, `${q + 2}`];
      explanation = `Because ${b} × ${q} = ${a}, ${a} ÷ ${b} = ${q}!`;
      category = 'Division Facts';
      hint = `Ask: what number times ${b} equals ${a}?`;
    } else if (type === 2) {
      // 3-Digit Addition & Subtraction
      if (i % 2 === 0) {
        const x = 200 + (i % 400);
        const y = 150 + ((i * 2) % 350);
        prompt = `Calculate: ${x} + ${y} = ?`;
        correct = `${x + y}`;
        wrongs = [`${x + y + 10}`, `${x + y - 10}`, `${x + y + 100}`];
        explanation = `Add hundreds, tens, and ones: ${x} + ${y} = ${x + y}.`;
        category = '3-Digit Operations';
        hint = 'Line up place values vertically and add from right to left.';
      } else {
        const x = 500 + (i % 400);
        const y = 120 + ((i * 3) % 300);
        prompt = `Calculate: ${x} - ${y} = ?`;
        correct = `${x - y}`;
        wrongs = [`${x - y + 10}`, `${x - y - 10}`, `${x - y + 20}`];
        explanation = `Regroup where needed: ${x} - ${y} = ${x - y}.`;
        category = '3-Digit Operations';
        hint = 'Remember to borrow when the top digit is smaller than the bottom digit.';
      }
    } else if (type === 3) {
      // Introduction to Fractions
      const denoms = [2, 3, 4, 6, 8];
      const d = denoms[i % denoms.length];
      const n = (i % (d - 1)) + 1;
      prompt = `A pizza is cut into ${d} equal slices. Maya ate ${n} slices. What fraction of the pizza did she eat?`;
      correct = `${n}/${d}`;
      wrongs = [`${d}/${n}`, `${n + 1}/${d}`, `${n}/${d + 1}`];
      explanation = `The denominator (bottom number) is ${d} total parts, and the numerator (top number) is ${n} parts eaten: ${n}/${d}!`;
      category = 'Fractions';
      hint = 'Numerator = parts chosen, Denominator = total parts.';
    } else {
      // Area & Perimeter of Rectangles
      const length = (i % 8) + 3;
      const width = (i % 6) + 2;
      if (i % 2 === 0) {
        prompt = `A garden rectangle has a length of ${length} ft and a width of ${width} ft. What is its AREA?`;
        correct = `${length * width} sq ft`;
        wrongs = [`${(length + width) * 2} sq ft`, `${length * width + 4} sq ft`, `${length * 2 + width} sq ft`];
        explanation = `Area = length × width = ${length} × ${width} = ${length * width} square feet.`;
        category = 'Area & Perimeter';
        hint = 'Area = length times width.';
      } else {
        prompt = `A picture frame is ${length} inches long and ${width} inches wide. What is its PERIMETER?`;
        correct = `${(length + width) * 2} inches`;
        wrongs = [`${length * width} inches`, `${length + width} inches`, `${(length + width) * 2 + 2} inches`];
        explanation = `Perimeter is the distance all the way around: 2 × (${length} + ${width}) = ${(length + width) * 2} inches.`;
        category = 'Area & Perimeter';
        hint = 'Add all 4 sides together.';
      }
    }

    const choices = shuffleArray([correct, ...wrongs]);
    list.push({
      id: `math-3-${i}`,
      grade: '3',
      number: i,
      category,
      prompt,
      choices,
      answer: choices.indexOf(correct),
      explanation,
      hint
    });
  }
  return list;
}

// ----------------------------------------------------------------------------
// GRADE 4 MATH ENGINE (500 Questions: Multi-Digit × / ÷, Equivalent Fractions, Decimals, Angles)
// ----------------------------------------------------------------------------
function generateGrade4Math() {
  const list = [];
  for (let i = 1; i <= 500; i++) {
    const type = i % 5;
    let prompt = '';
    let correct = '';
    let wrongs = [];
    let explanation = '';
    let category = 'Multiplication & Division';
    let hint = '';

    if (type === 0) {
      // 2-digit by 2-digit multiplication
      const a = 15 + (i % 25);
      const b = 12 + ((i * 2) % 20);
      prompt = `Multiply: ${a} × ${b} = ?`;
      correct = `${a * b}`;
      wrongs = [`${a * b + 10}`, `${a * b - 12}`, `${a * b + 24}`];
      explanation = `${a} × ${b} = ${a * b}. Use area model or partial products.`;
      category = 'Multi-Digit Multiplication';
      hint = `Multiply ${a} by the ones digit of ${b}, then by the tens digit.`;
    } else if (type === 1) {
      // Long division with remainders
      const divisor = (i % 5) + 3;
      const quotient = 12 + (i % 20);
      const remainder = (i % (divisor - 1)) + 1;
      const dividend = divisor * quotient + remainder;
      prompt = `Divide: ${dividend} ÷ ${divisor} = ?`;
      correct = `${quotient} R${remainder}`;
      wrongs = [`${quotient + 1} R${remainder}`, `${quotient} R${remainder + 1}`, `${quotient - 1} R${remainder}`];
      explanation = `${divisor} goes into ${dividend} ${quotient} times with a remainder of ${remainder}.`;
      category = 'Division with Remainders';
      hint = `Check: (${divisor} × ${quotient}) + ${remainder} = ${dividend}.`;
    } else if (type === 2) {
      // Equivalent Fractions
      const baseN = (i % 4) + 1;
      const baseD = baseN + (i % 3) + 1;
      const mult = (i % 3) + 2;
      prompt = `Which fraction is equivalent to ${baseN}/${baseD}?`;
      correct = `${baseN * mult}/${baseD * mult}`;
      wrongs = [`${baseN * mult + 1}/${baseD * mult}`, `${baseN}/${baseD * mult}`, `${baseN * mult}/${baseD}`];
      explanation = `Multiply top and bottom by ${mult}: (${baseN} × ${mult})/(${baseD} × ${mult}) = ${baseN * mult}/${baseD * mult}.`;
      category = 'Equivalent Fractions';
      hint = 'Multiply the numerator and denominator by the same number.';
    } else if (type === 3) {
      // Adding Fractions with Like Denominators
      const d = (i % 6) + 5;
      const a = (i % 3) + 1;
      const b = (i % 3) + 1;
      prompt = `Add the fractions: ${a}/${d} + ${b}/${d} = ?`;
      correct = `${a + b}/${d}`;
      wrongs = [`${a + b}/${d * 2}`, `${a + b + 1}/${d}`, `${a * b}/${d}`];
      explanation = `Keep the same denominator and add numerators: ${a} + ${b} = ${a + b}, so ${a + b}/${d}.`;
      category = 'Fraction Addition';
      hint = 'Do not add the denominators; keep them the same.';
    } else {
      // Decimals and Angles
      if (i % 2 === 0) {
        const dec = (i % 90) + 10;
        prompt = `Write as a decimal: ${dec}/100 = ?`;
        correct = `0.${dec}`;
        wrongs = [`${dec}.0`, `0.0${dec}`, `1.${dec}`];
        explanation = `${dec} hundredths is written as 0.${dec}!`;
        category = 'Decimals';
        hint = 'Hundredths has two digits after the decimal point.';
      } else {
        const deg = 45 + (i % 100);
        if (deg < 90) {
          prompt = `An angle measures ${deg}°. What kind of angle is it?`;
          correct = 'Acute angle (< 90°)';
          wrongs = ['Right angle (90°)', 'Obtuse angle (> 90°)', 'Straight angle (180°)'];
          explanation = `Angles smaller than 90° are acute angles (sharp and small!).`;
        } else {
          prompt = `An angle measures 120°. What kind of angle is it?`;
          correct = 'Obtuse angle (> 90°)';
          wrongs = ['Acute angle (< 90°)', 'Right angle (90°)', 'Reflex angle'];
          explanation = 'Angles greater than 90° but less than 180° are obtuse angles.';
        }
        category = 'Geometry & Angles';
        hint = 'A right angle is exactly 90 degrees like a square corner.';
      }
    }

    const choices = shuffleArray([correct, ...wrongs]);
    list.push({
      id: `math-4-${i}`,
      grade: '4',
      number: i,
      category,
      prompt,
      choices,
      answer: choices.indexOf(correct),
      explanation,
      hint
    });
  }
  return list;
}

// ----------------------------------------------------------------------------
// GRADE 5 MATH ENGINE (500 Questions: Unlike Fractions, Decimals, Volume, PEMDAS)
// ----------------------------------------------------------------------------
function generateGrade5Math() {
  const list = [];
  for (let i = 1; i <= 500; i++) {
    const type = i % 5;
    let prompt = '';
    let correct = '';
    let wrongs = [];
    let explanation = '';
    let category = 'Fractions & Decimals';
    let hint = '';

    if (type === 0) {
      // Adding Fractions with Unlike Denominators (e.g. 1/2 + 1/4)
      prompt = `Solve: 1/2 + 1/4 = ?`;
      correct = '3/4';
      wrongs = ['2/6', '1/3', '2/4'];
      explanation = 'Common denominator is 4: 2/4 + 1/4 = 3/4.';
      category = 'Unlike Fractions';
      hint = 'Find a common denominator before adding.';
    } else if (type === 1) {
      // Multiplying Fractions (e.g. 2/3 × 3/4)
      prompt = `Multiply: 2/3 × 3/5 = ?`;
      correct = '6/15 (2/5)';
      wrongs = ['5/8', '6/8', '1/5'];
      explanation = 'Multiply numerators: 2 × 3 = 6. Multiply denominators: 3 × 5 = 15. 6/15 simplifies to 2/5.';
      category = 'Multiplying Fractions';
      hint = 'Multiply straight across top and bottom.';
    } else if (type === 2) {
      // Decimal Operations
      const a = (1.2 + (i % 5)).toFixed(1);
      const b = (0.3 + (i % 3)).toFixed(1);
      const sum = (parseFloat(a) + parseFloat(b)).toFixed(1);
      prompt = `Solve: ${a} + ${b} = ?`;
      correct = `${sum}`;
      wrongs = [`${(parseFloat(sum) + 0.2).toFixed(1)}`, `${(parseFloat(sum) - 0.1).toFixed(1)}`, `${(parseFloat(sum) + 1.0).toFixed(1)}`];
      explanation = `Line up the decimal points and add: ${a} + ${b} = ${sum}.`;
      category = 'Decimal Operations';
      hint = 'Align the decimal points vertically before adding.';
    } else if (type === 3) {
      // Volume of Rectangular Prisms
      const l = (i % 5) + 3;
      const w = (i % 4) + 2;
      const h = (i % 4) + 2;
      const vol = l * w * h;
      prompt = `What is the VOLUME of a rectangular prism with length = ${l} cm, width = ${w} cm, and height = ${h} cm?`;
      correct = `${vol} cm³`;
      wrongs = [`${vol + 12} cm³`, `${(l + w + h) * 2} cm³`, `${vol - 8} cm³`];
      explanation = `Volume = length × width × height = ${l} × ${w} × ${h} = ${vol} cubic centimeters.`;
      category = 'Volume';
      hint = 'Volume = length × width × height.';
    } else {
      // Order of Operations (PEMDAS)
      const a = (i % 4) + 2;
      const b = (i % 3) + 2;
      const c = (i % 5) + 1;
      const ans = a + b * c;
      prompt = `Evaluate: ${a} + ${b} × ${c} = ?`;
      correct = `${ans}`;
      wrongs = [`${(a + b) * c}`, `${ans + 2}`, `${ans - 2}`];
      explanation = `According to PEMDAS, do multiplication first: ${b} × ${c} = ${b * c}. Then add ${a}: ${a} + ${b * c} = ${ans}.`;
      category = 'Order of Operations';
      hint = 'Remember PEMDAS: Multiply before you Add!';
    }

    const choices = shuffleArray([correct, ...wrongs]);
    list.push({
      id: `math-5-${i}`,
      grade: '5',
      number: i,
      category,
      prompt,
      choices,
      answer: choices.indexOf(correct),
      explanation,
      hint
    });
  }
  return list;
}

// ----------------------------------------------------------------------------
// GRADE 6 MATH ENGINE (500 Questions: Ratios, Percentages, Integers, Algebra, Stats)
// ----------------------------------------------------------------------------
function generateGrade6Math() {
  const list = [];
  for (let i = 1; i <= 500; i++) {
    const type = i % 5;
    let prompt = '';
    let correct = '';
    let wrongs = [];
    let explanation = '';
    let category = 'Ratios & Algebra';
    let hint = '';

    if (type === 0) {
      // Unit Rate & Ratios
      const items = (i % 4) + 2;
      const unitPrice = (i % 5) + 3;
      const totalCost = items * unitPrice;
      prompt = `If ${items} notebooks cost $${totalCost}, what is the UNIT RATE (cost per notebook)?`;
      correct = `$${unitPrice} per notebook`;
      wrongs = [`$${unitPrice + 1} per notebook`, `$${unitPrice - 1} per notebook`, `$${unitPrice * 2} per notebook`];
      explanation = `Divide total cost by number of notebooks: $${totalCost} ÷ ${items} = $${unitPrice}.`;
      category = 'Ratios & Unit Rates';
      hint = 'Divide the total cost by the number of items.';
    } else if (type === 1) {
      // Percentages
      const pct = (i % 4 === 0) ? 10 : (i % 4 === 1) ? 20 : (i % 4 === 2) ? 25 : 50;
      const base = 40 + (i % 10) * 10;
      const ans = (pct / 100) * base;
      prompt = `What is ${pct}% of ${base}?`;
      correct = `${ans}`;
      wrongs = [`${ans + 5}`, `${Math.max(1, ans - 5)}`, `${ans * 2}`];
      explanation = `${pct}% = ${pct / 100}. ${pct / 100} × ${base} = ${ans}.`;
      category = 'Percentages';
      hint = 'Convert the percent to a decimal or fraction and multiply.';
    } else if (type === 2) {
      // Negative Numbers & Integers
      const a = -10 + (i % 8);
      const b = (i % 9) + 2;
      const sum = a + b;
      prompt = `Evaluate: ${a} + ${b} = ?`;
      correct = `${sum}`;
      wrongs = [`${sum + 2}`, `${sum - 3}`, `${-Math.abs(sum)}`];
      explanation = `Start at ${a} on the number line and move right ${b} units to reach ${sum}.`;
      category = 'Integers';
      hint = 'Moving right on the number line adds positive numbers.';
    } else if (type === 3) {
      // Solving 1-Step Equations
      const x = (i % 15) + 3;
      const c = (i % 10) + 4;
      prompt = `Solve for x: x + ${c} = ${x + c}`;
      correct = `x = ${x}`;
      wrongs = [`x = ${x + 2}`, `x = ${x - 2}`, `x = ${x + c}`];
      explanation = `Subtract ${c} from both sides: x = ${x + c} - ${c} = ${x}.`;
      category = 'Algebra';
      hint = 'Do the opposite operation to isolate x on one side.';
    } else {
      // Statistics: Mean, Median, Mode, Range
      prompt = `Find the MEAN (average) of the numbers: 4, 8, 6.`;
      correct = '6';
      wrongs = ['7', '5', '8'];
      explanation = `Add the numbers: 4 + 8 + 6 = 18. Divide by count (3): 18 ÷ 3 = 6.`;
      category = 'Statistics';
      hint = 'Add all the numbers and divide by how many numbers there are.';
    }

    const choices = shuffleArray([correct, ...wrongs]);
    list.push({
      id: `math-6-${i}`,
      grade: '6',
      number: i,
      category,
      prompt,
      choices,
      answer: choices.indexOf(correct),
      explanation,
      hint
    });
  }
  return list;
}

// ----------------------------------------------------------------------------
// CACHED MASTER MATH REPOSITORY (3,500 Questions Total)
// ----------------------------------------------------------------------------
const CACHED_MATH = {};

export function getGradeMathQuestions(grade, limit = 500, category = 'all') {
  const g = String(grade || '3').toUpperCase();
  if (!CACHED_MATH[g]) {
    if (g === 'K') CACHED_MATH[g] = generateGradeKMath();
    else if (g === '1') CACHED_MATH[g] = generateGrade1Math();
    else if (g === '2') CACHED_MATH[g] = generateGrade2Math();
    else if (g === '3') CACHED_MATH[g] = generateGrade3Math();
    else if (g === '4') CACHED_MATH[g] = generateGrade4Math();
    else if (g === '5') CACHED_MATH[g] = generateGrade5Math();
    else if (g === '6') CACHED_MATH[g] = generateGrade6Math();
    else CACHED_MATH[g] = generateGrade3Math();
  }

  let questions = CACHED_MATH[g];
  if (category && category !== 'all') {
    questions = questions.filter(q => q.category.toLowerCase().includes(category.toLowerCase()));
  }
  return questions.slice(0, limit);
}

export function getMathQuiz(grade, count = 10, category = 'all') {
  const pool = getGradeMathQuestions(grade, 500, category);
  const shuffled = shuffleArray(pool);
  return shuffled.slice(0, count);
}

export function getMathCategories(grade) {
  const pool = getGradeMathQuestions(grade, 500);
  const cats = new Set(pool.map(q => q.category));
  return ['all', ...Array.from(cats)];
}
