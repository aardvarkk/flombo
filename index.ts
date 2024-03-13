import { readFileSync } from "fs";

const HIDE = false;

const data = readFileSync("flags.txt", "utf8")
  .split("\n")
  .filter((line) => line.length > 0)
  .map((line) => line.split("\t"));

for (let t = 0; t < data.length; t++) {
  const target = data[t][3];

  // Score all countries as "starts" according to how many letters in from the start it shares with the target
  const startScores = data.map((country, idx) => {
    if (idx === t) return 0;
    let score = 0;
    for (let i = 0; i < target.length; i++) {
      if (country[3][i] === target[i]) {
        score++;
      } else {
        break;
      }
    }
    // Whole word is contained ("Samoa" in "American Samoa", which is not interesting)
    if (score === target.length) {
      score = 0;
    }
    return score;
  });

  // Do the same but as "ends" (from the end)
  const endScores = data.map((country, idx) => {
    if (idx === t) return 0;
    let score = 0;
    for (let i = 0; i < target.length; i++) {
      if (
        country[3][country[3].length - 1 - i] === target[target.length - 1 - i]
      ) {
        score++;
      } else {
        break;
      }
    }
    // Whole word is contained ("Samoa" in "American Samoa", which is not interesting)
    if (score === target.length) {
      score = 0;
    }
    return score;
  });

  // See if we can find a start score and end score where indexes aren't the same
  // where the total score is >= length of the target
  for (let i = 0; i < startScores.length; ++i) {
    for (let j = 0; j < endScores.length; ++j) {
      if (i !== j && startScores[i] + endScores[j] >= target.length) {
        const idx = HIDE ? 1 : 3;
        const start = data[i][idx];
        const end = data[j][idx];
        const result = data[t][idx];
        console.log(`${start}  +  ${end}  =  ${result}`);
      }
    }
  }
}
