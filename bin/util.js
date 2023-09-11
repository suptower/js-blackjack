// utility functions

// terminal styling
import chalk from "chalk";

// Wait function to delay execution
export function sleep(ms) {
  const wakeUpTime = Date.now() + ms;
  while (Date.now() < wakeUpTime) {
    // This is blocking code
  }
}

// Print a single card
function printCard(card) {
  console.log(chalk.bgWhite.white("-----------"));
  console.log(chalk.bgWhite.white("| ") + getSymbol(card.suit) + chalk.bgWhite.white("       |"));
  console.log(chalk.bgWhite.white("|         |"));
  if (card.rank === "10") {
    // Padding has to be adapted for 10
    console.log(chalk.bgWhite.white("|    ") + getRank(card) + chalk.bgWhite.white("   |"));
  } else {
    console.log(chalk.bgWhite.white("|    ") + getRank(card) + chalk.bgWhite.white("    |"));
  }
  console.log(chalk.bgWhite.white("|         |"));
  console.log(chalk.bgWhite.white("|       ") + getSymbol(card.suit) + chalk.bgWhite.white(" |"));
  console.log(chalk.bgWhite.white("-----------"));
}

// Get symbol for card
function getSymbol(suit) {
  switch (suit) {
    case "Herz":
      return chalk.bgWhite.red("♥");
    case "Pik":
      return chalk.bgWhite.black("♠");
    case "Kreuz":
      return chalk.bgWhite.black("♣");
    case "Karo":
      return chalk.bgWhite.red("♦");
  }
}

// Auxiliary function to get colored rank
function getRank(card) {
  switch (card.suit) {
    case "Herz":
      return chalk.bgWhite.red(card.rank);
    case "Pik":
      return chalk.bgWhite.black(card.rank);
    case "Kreuz":
      return chalk.bgWhite.black(card.rank);
    case "Karo":
      return chalk.bgWhite.red(card.rank);
  }
}

// Calculate hand value
function calcHand(hand) {
  let sum = 0;
  for (const card of hand) {
    sum += card.value;
  }
  if (sum > 21) {
    for (const card of hand) {
      if (card.rank === "A" && sum > 21) {
        sum -= 10;
      }
    }
  }
  return sum;
}

// Print hand
function printHand(hand) {
  const output = ["", "", "", "", "", "", ""];
  for (const card of hand) {
    output[0] += chalk.bgWhite.white("-----------");
    output[1] += chalk.bgWhite.white("| ") + getSymbol(card.suit) + chalk.bgWhite.white("       |");
    output[2] += chalk.bgWhite.white("|         |");
    if (card.rank === "10") {
      // Padding has to be adapted for 10
      output[3] += chalk.bgWhite.white("|    ") + getRank(card) + chalk.bgWhite.white("   |");
    } else {
      output[3] += chalk.bgWhite.white("|    ") + getRank(card) + chalk.bgWhite.white("    |");
    }
    output[4] += chalk.bgWhite.white("|         |");
    output[5] += chalk.bgWhite.white("|       ") + getSymbol(card.suit) + chalk.bgWhite.white(" |");
    output[6] += chalk.bgWhite.white("-----------");
  }
  for (const line of output) {
    console.log(line);
  }
}

// Check if hand contains Ace
function containsAce(hand) {
  for (const card of hand) {
    if (card.rank === "A") {
      return true;
    }
  }
  return false;
}

// Check if hand has two identical cards
function isPair(hand) {
  if (hand.length === 2) {
    if (hand[0].rank === hand[1].rank) {
      return true;
    }
  }
  return false;
}

export class Util {
  sleep(ms) {
    sleep(ms);
  }

  printCard(card) {
    printCard(card);
  }

  getSymbol(suit) {
    return getSymbol(suit);
  }

  getRank(card) {
    return getRank(card);
  }

  calcHand(hand) {
    return calcHand(hand);
  }

  printHand(hand) {
    printHand(hand);
  }

  containsAce(hand) {
    return containsAce(hand);
  }

  isPair(hand) {
    return isPair(hand);
  }
}