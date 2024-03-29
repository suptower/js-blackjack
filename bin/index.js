#!/usr/bin/env node --no-warnings
// Terminal styling
import chalk from "chalk";

// Prompt for user input
import readlineSync from "readline-sync";

// persist conf
import Conf from "conf";

// import functions from deckHandler.js
import { DeckHandler } from "./deckHandler.js";

// import functions from moneyManager.js
import { MoneyManager } from "./moneyManager.js";

// import functions from stats.js
import { Stats } from "./stats.js";

// import util functions
import { Util } from "./util.js";

// import autodecide
import { autodecide } from "./autodecide.js";

// Information data
import { readFileSync } from "fs";
// use import.meta.url
import { fileURLToPath } from "url";
import path, { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(readFileSync(path.join(__dirname, "../package.json"), "utf-8"));
const version = packageJson.version;
const date = packageJson.date;

// conf schema
const schema = {
  stackSize: {
    type: "number",
    default: 4,
  },
  startMoney: {
    type: "number",
    default: 1000,
  },
};

// Create a new conf instance
const config = new Conf({ projectName: "blackjack", schema });

const moneyManager = new MoneyManager();

const deckHandler = new DeckHandler();

const stats = new Stats();

const util = new Util();

function printEnd(playerHand, dealerHand) {
  console.log("Game summary: (Game " + stats.getGames() + ")");
  console.log("Your hand was:");
  util.printHand(playerHand);
  console.log("Your total was: " + util.calcHand(playerHand));
  console.log("Dealer hand was:");
  util.printHand(dealerHand);
  console.log("Dealer total was: " + util.calcHand(dealerHand));
}

// Start game
function play(autoplay) {
  moneyManager.setMoney(moneyManager.getStartMoney());
  console.clear();
  let game = true;
  let currentBet = 0;
  let insurance = false;
  let surrender = false;
  deckHandler.shuffle(1000);
  while (game) {
    insurance = false;
    if (!moneyManager.checkMoney()) {
      console.log("You are out of money!");
      util.sleep(1000);
      game = false;
      break;
    }
    stats.addGame();
    console.clear();
    // Set bet by getNextBet if autoplay, else ask for bet
    if (autoplay) {
      currentBet = moneyManager.getNextBet();
    } else {
      console.log("You have " + chalk.green(moneyManager.getMoney() + "€"));
      currentBet = readlineSync.questionInt("Place your bet (2 - " + moneyManager.getMoney() + "): ");
      while (currentBet < 2 || currentBet > moneyManager.getMoney()) {
        console.log("Invalid bet!");
        currentBet = readlineSync.questionInt("Place your bet (2 - " + moneyManager.getMoney() + "): ");
      }
    }
    console.log("You bet " + currentBet + "€");
    util.sleep(500);
    // set last bet and subtract money
    moneyManager.setLastBet(currentBet);
    moneyManager.subMoney(currentBet);
    const dealerHand = [];
    const playerHand = [];
    console.log("Both players are drawing their first cards...");
    util.sleep(1000);
    // Draw initial 2 cards for each player
    for (let i = 0; i < 2; i++) {
      dealerHand.push(deckHandler.drawCard());
      playerHand.push(deckHandler.drawCard());
    }
    // Print cards
    console.log("Visible Dealer card:");
    util.printCard(dealerHand[0]);
    util.sleep(500);
    console.log("Player:");
    util.printHand(playerHand);
    // Check for blackjack
    let playerturn = true;
    let dealerturn = false;
    while (playerturn) {
      if (
        util.calcHand(playerHand) === 21 ||
        (playerHand.length === 5 && util.calcHand(playerHand) < 21) ||
        util.calcHand(playerHand) > 21
      ) {
        playerturn = false;
        dealerturn = true;
        util.sleep(500);
      } else {
        console.log(
          "Your hand value: " +
            chalk.green(util.calcHand(playerHand)) +
            " | Dealer hand value: " +
            chalk.yellow(dealerHand[0].value),
        );
        console.log("----------------------------------");
        // Ask player for action or autoplay
        let action = 0;
        // 0 = Hit, 1 = Stand, 2 = Show hands, 3 = Insurance, 4 = Double down
        const actionOptions = [chalk.green("Hit"), chalk.red("Stand"), chalk.blue("Show hands"), chalk.magenta("Clue")];
        if (autoplay) {
          console.log("Autoplaying...");
          util.sleep(250);
          action = autodecide(playerHand, dealerHand);
        } else {
          if (playerHand.length === 2) {
            // Check for further actions
            // Surrender only possible on first turn
            actionOptions.push(chalk.bgRed.white("Surrender"));
            // Check for insurance
            if (dealerHand[0].rank === "A") {
              actionOptions.push(chalk.yellow("Insurance"));
            }
            // Check for double down
            if (moneyManager.getMoney() >= currentBet) {
              actionOptions.push(chalk.blue("Double down"));
            }
            // Check if player can split
            if (util.isPair(playerHand)) {
              // Needs further work, not planned right now
              // actionOptions.push('Split')
            }
          }
          action = readlineSync.keyInSelect(actionOptions, "What do you want to do?", { cancel: false });
          switch (actionOptions[action]) {
            case chalk.green("Hit"):
              action = 0;
              break;
            case chalk.red("Stand"):
              action = 1;
              break;
            case chalk.blue("Show hands"):
              action = 2;
              break;
            case chalk.yellow("Insurance"):
              action = 3;
              break;
            case chalk.blue("Double down"):
              action = 4;
              break;
            case chalk.magenta("Clue"):
              action = 5;
              break;
            case chalk.bgRed.white("Surrender"):
              action = 6;
              break;
            default:
              action = 1;
              break;
          }
        }
        if (action === 0) {
          console.clear();
          console.log("You are drawing a card...");
          util.sleep(1300);
          playerHand.push(deckHandler.drawCard());
          console.log("You draw:");
          util.printCard(playerHand[playerHand.length - 1]);
          util.sleep(500);
          console.log("Your hand:");
          util.printHand(playerHand);
          util.sleep(500);
          console.log("Visible Dealer card:");
          util.printCard(dealerHand[0]);
        } else if (action === 1) {
          playerturn = false;
          dealerturn = true;
          console.clear();
          console.log("You stand with a hand value of: " + util.calcHand(playerHand));
          util.sleep(1000);
        } else if (action === 2) {
          console.clear();
          console.log("Showing hands...");
          util.sleep(1000);
          console.log("Your hand:");
          util.printHand(playerHand);
          console.log("Visible Dealer card:");
          util.printCard(dealerHand[0]);
        } else if (action === 3) {
          console.clear();
          let insuranceBet = 0;
          if (currentBet / 2 > moneyManager.getMoney()) {
            insuranceBet = moneyManager.getMoney();
          } else {
            insuranceBet = currentBet / 2;
          }
          console.log("You buy insurance for " + insuranceBet + "€");
          util.sleep(1000);
          moneyManager.subMoney(currentBet / 2);
          playerturn = false;
          insurance = true;
        } else if (action === 4) {
          console.clear();
          console.log("You double down for " + currentBet + "€");
          util.sleep(1000);
          moneyManager.subMoney(currentBet);
          currentBet = currentBet * 2;
          playerHand.push(deckHandler.drawCard());
          console.log("You draw:");
          util.printCard(playerHand[playerHand.length - 1]);
          util.sleep(500);
          console.log("Your hand:");
          util.printHand(playerHand);
          util.sleep(500);
          console.log("Visible Dealer card:");
          util.printCard(dealerHand[0]);
          playerturn = false;
          dealerturn = true;
        } else if (action === 5) {
          console.clear();
          const clue = autodecide(playerHand, dealerHand);
          switch (clue) {
            case 0:
              console.log("Recommended action based on your hand and the visible dealer card: " + chalk.green("Hit"));
              break;
            case 1:
              console.log("Recommended action based on your hand and the visible dealer card: " + chalk.red("Stand"));
              break;
            case 4:
              console.log(
                "Recommended action based on your hand and the visible dealer card: " + chalk.blue("Double down"),
              );
              break;
            default:
              console.log("Recommended action based on your hand and the visible dealer card: " + chalk.red("Stand"));
              break;
          }
          util.sleep(1000);
          console.log("Showing hands...");
          util.sleep(1000);
          console.log("Your hand:");
          util.printHand(playerHand);
          console.log("Visible Dealer card:");
          util.printCard(dealerHand[0]);
        } else if (action === 6) {
          playerturn = false;
          dealerturn = false;
          surrender = true;
        }
      }
    }
    while (dealerturn) {
      // Reveal second card
      console.log("Dealer hand:");
      util.printHand(dealerHand);
      console.log("Dealer total: " + util.calcHand(dealerHand));
      if (util.calcHand(dealerHand) >= 17 || dealerHand.length === 5) {
        dealerturn = false;
      } else {
        console.log("Dealer draws...");
        util.sleep(2000);
        console.clear();
        console.log("Dealer draws:");
        dealerHand.push(deckHandler.drawCard());
        util.printCard(dealerHand[dealerHand.length - 1]);
        util.sleep(1000);
      }
    }
    util.sleep(1500);
    console.clear();
    // WIN CONDITIONS
    // Blackjack pays 3:2, other wins pay 1:1, Tie returns bet
    if (surrender) {
      // Player surrendered
      surrender = false;
      console.clear();
      console.log("You surrender and get half your bet back");
      util.sleep(1000);
      moneyManager.addMoney(currentBet / 2);
    } else if (util.calcHand(playerHand) === 21 && util.calcHand(dealerHand) !== 21 && dealerHand.length !== 5) {
      // Player has blackjack or dealer doesn't
      console.log("You have a Blackjack! You win!");
      stats.addWin();
      stats.addBlackjack();
      console.log("You won " + currentBet * 2.5 + "!");
      moneyManager.addMoney(currentBet * 2.5);
      moneyManager.setDidWin(true);
      console.log("You have " + moneyManager.getMoney() + "€.");
    } else if (
      playerHand.length === 5 &&
      util.calcHand(playerHand) < 21 &&
      util.calcHand(dealerHand) !== 21 &&
      dealerHand.length < 5
    ) {
      // Player has 5 cards and dealer doesn't
      console.log("You have 5 cards and a total of " + util.calcHand(playerHand) + "! You win!");
      stats.addWin();
      console.log("You won " + currentBet * 2 + "!");
      moneyManager.addMoney(currentBet * 2);
      moneyManager.setDidWin(true);
      console.log("You have " + moneyManager.getMoney() + "€.");
    } else if (util.calcHand(playerHand) > util.calcHand(dealerHand) && util.calcHand(playerHand) <= 21) {
      // Player has higher hand value than dealer
      console.log("You have a higher hand value than the dealer! You win!");
      stats.addWin();
      console.log("You won " + currentBet * 2 + "!");
      moneyManager.addMoney(currentBet * 2);
      moneyManager.setDidWin(true);
    } else if (
      util.calcHand(dealerHand) === 21 &&
      util.calcHand(playerHand) !== 21 &&
      playerHand.length !== 5 &&
      util.calcHand(playerHand) < 21
    ) {
      // Dealer has blackjack and player doesn't
      console.log("Dealer has a Blackjack! Dealer wins!");
      stats.addLoss();
      stats.addBlackjack();
      if (insurance && dealerHand.length === 2) {
        console.log("You win your insurance bet back!");
        moneyManager.addMoney(currentBet / 2);
      }
    } else if (
      dealerHand.length === 5 &&
      util.calcHand(dealerHand) < 21 &&
      util.calcHand(playerHand) !== 21 &&
      playerHand.length < 5
    ) {
      // Dealer has 5 cards and player doesn't
      console.log("Dealer has 5 cards! Dealer wins!");
      stats.addLoss();
    } else if (util.calcHand(playerHand) > 21 && util.calcHand(dealerHand) <= 21) {
      // Player went over 21
      console.log("You went over 21! Dealer wins!");
      stats.addLoss();
    } else if (util.calcHand(dealerHand) > 21 && util.calcHand(playerHand) <= 21) {
      // Dealer went over 21
      console.log("Dealer went over 21! You win!");
      stats.addWin();
      console.log("You won " + currentBet * 2 + "!");
      moneyManager.addMoney(currentBet * 2);
      moneyManager.setDidWin(true);
      console.log("You have " + moneyManager.getMoney() + "€.");
    } else if (util.calcHand(dealerHand) > util.calcHand(playerHand) && util.calcHand(dealerHand) <= 21) {
      // Dealer has higher hand value than player
      console.log("Dealer has a higher hand value than you! Dealer wins!");
      stats.addLoss();
    } else {
      // Tie
      console.log("It's a tie!");
      stats.addDraw();
      console.log("You got your bet of " + currentBet + "€ back.");
      moneyManager.addMoney(currentBet);
      moneyManager.setDidWin(false);
      moneyManager.setLastBet(currentBet / 2);
      console.log("You have " + moneyManager.getMoney() + "€.");
    }
    // Print game end screen
    printEnd(playerHand, dealerHand);
    if (!readlineSync.keyInYN("Do you want to play again?")) {
      game = false;
      // Print stats
      stats.printStats(moneyManager);
      util.sleep(500);
      start = readlineSync.keyInPause("Press any key to go back to the main menu.");
      menu = "h";
    } else {
      game = true;
    }
  }
  util.sleep(50);
  console.clear();
  menu = "h";
}

// MENU VAR
// h = home
// r = rules
// s = start
// a = autoplay
// i = info
// o = options
// q = quit
let menu = "h";
let start = 0;
while (menu !== "x") {
  switch (menu) {
    case "h": {
      console.clear();
      console.log("WELCOME TO BLACKJACK!");
      console.log("---------------------");
      const menuInputs = ["Start", "Autoplay", "Rules", "Info", "Options", "Quit"];
      start = readlineSync.keyInSelect(menuInputs, "What do you want to do?", {
        cancel: false,
      });
      switch (start) {
        case 0:
          menu = "s";
          break;
        case 1:
          menu = "a";
          break;
        case 2:
          menu = "r";
          break;
        case 3:
          menu = "i";
          break;
        case 4:
          menu = "o";
          break;
        case 5:
          menu = "q";
          break;
        default:
          console.log("Invalid input. Please try again.");
          menu = "h";
          break;
      }
      break;
    }
    case "r":
      console.clear();
      console.log("RULES:");
      console.log("------");
      console.log(
        "Each participant attempts to beat the dealer by getting a count as close to 21 as possible, without going over 21.",
      );
      console.log(
        "The value of a hand is the sum of the card values. Players are allowed to draw additional cards to improve their hands.",
      );
      console.log(
        "At the start of the game, the dealer gives the player two cards face up. The dealer then gives himself two cards, one face up and one face down.",
      );
      console.log(
        'If a player\'s first two cards are an ace and a "ten-card" (a picture card or 10), giving a count of 21 in two cards, this is a natural or "blackjack".',
      );
      console.log(
        'If the dealer\'s face-up card is an ace, the player is offered the option of taking "insurance" before the dealer checks the hole card.',
      );
      console.log(
        "Insurance is a side bet that the dealer has blackjack and is treated independently of the main wager. It pays 2:1.",
      );
      console.log(
        "It is up to each individual player if an ace is worth 1 or 11. Face cards are 10 and any other card is its pip value.",
      );
      console.log("Each turn, the player decides whether to hit (take another card) or stand (take no more cards).");
      console.log("You can draw cards by pressing H, stand by pressing S and show both hands by pressing C.");
      console.log(
        "If you have a hand value of 21 you have a Blackjack and you win automatically IF the dealer does not also have a Blackjack.",
      );
      console.log("A hand value above 21 is a bust.");
      console.log(
        "If you have 5 cards and did not bust you win IF the dealer does not also have 5 cards and a hand value of less than 21.",
      );
      console.log("If you bust and the dealer does not you lose.");
      console.log("If the dealer busts and you do not you win.");
      console.log("If you and the dealer have the same hand value it is a tie.");
      console.log("The game will also be a tie if both you and the dealer bust.");
      console.log("The dealer will draw cards until he has a hand value of 17 or more.");
      console.log("----------------------------------");
      console.log("The stack size is the amount of decks used in the game. The default is 4.");
      console.log("You can change the stack size in the options menu. Valid stack sizes are 1-16.");
      console.log("----------------------------------");
      console.log("The autoplay function will play the game for you.");
      console.log("The decision to hit or stand in autoplay is based on known blackjack strategy.");
      console.log("----------------------------------");
      console.log("\n");
      readlineSync.keyInPause("Press any key to go back to the main menu.");
      menu = "h";
      break;
    case "s":
      play(false);
      break;
    case "a": {
      console.clear();
      let newStartingBet = readlineSync.questionInt(
        "What is your starting bet? (1 - " + moneyManager.getMoney() + ") ?: ",
      );
      while (newStartingBet < 1 || newStartingBet > moneyManager.getMoney()) {
        console.log("Invalid input. Please try again.");
        newStartingBet = readlineSync.questionInt(
          "What is your starting bet? (1 - " + moneyManager.getMoney() + ") ?: ",
        );
      }
      moneyManager.setStartBet(newStartingBet);
      play(true);
      break;
    }
    case "i":
      console.clear();
      console.log("INFORMATION:");
      console.log("------------");
      console.log("BLACKJACK IN JAVASCRIPT BY SUPTOWER");
      console.log("----------------------------------");
      console.log("Version: " + version + " (" + date + ")");
      console.log("GitHub: https://github.com/suptower/js-blackjack");
      console.log("----------------------------------");
      console.log("\n");
      readlineSync.keyInPause("Press any key to go back to the main menu.");
      menu = "h";
      break;
    case "o": {
      console.clear();
      console.log("OPTIONS");
      console.log("---------------------");
      const optionInputs = ["Change stack size", "Reset stats", "Starting money", "Back"];
      start = readlineSync.keyInSelect(optionInputs, "What do you want to do?", { cancel: false });
      switch (start) {
        case 0: {
          console.clear();
          let newStackSize = readlineSync.questionInt("Enter new stack size (1-16) [DEFAULT: 4 | CURRENT: " + config.get("stackSize") + "] : ");
          while (newStackSize < 1 || newStackSize > 16) {
            console.log("Invalid stack size. Please try again.");
            newStackSize = readlineSync.questionInt("Enter new stack size (1-16) [DEFAULT: 4 | CURRENT: " + config.get("stackSize") + "] : ");
          }
          console.log("Changing stack size to " + newStackSize + "...");
          util.sleep(1000);
          config.set("stackSize", newStackSize);
          console.log("Stack size changed!");
          util.sleep(1000);
          newStackSize = readlineSync.keyInPause("Press any key to go back to the main menu.");
          menu = "h";
          break;
        }
        case 1:
          console.clear();
          console.log("Resetting stats...");
          util.sleep(1000);
          stats.reset();
          console.log("Stats reset!");
          util.sleep(1000);
          readlineSync.keyInPause("Press any key to go back to the main menu.");
          menu = "h";
          break;
        case 2: {
          console.clear();
          let newStartingMoney = readlineSync.questionInt("Enter new starting money (2-50.000) [DEFAULT: 1.000 | CURRENT: " + config.get("startMoney") + "] : ");
          while (newStartingMoney < 2 || newStartingMoney > 50000) {
            console.log("Invalid starting money. Please try again.");
            newStartingMoney = readlineSync.questionInt("Enter new starting money (2-50.000) [DEFAULT: 1.000] : ");
          }
          console.log("Changing starting money to " + newStartingMoney + "...");
          util.sleep(1000);
          config.set("startMoney", newStartingMoney);
          moneyManager.setStartMoney(newStartingMoney);
          console.log("Starting money changed!");
          util.sleep(1000);
          readlineSync.keyInPause("Press any key to go back to the main menu.");
          menu = "h";
          break;
        }
        case 3:
          menu = "h";
          break;
        default:
          console.log("Invalid input. Please try again.");
          menu = "o";
          break;
      }
      break;
    }
    case "q":
      console.clear();
      console.log("Thanks for playing!");
      console.log("-------------------");
      util.sleep(1500);
      console.clear();
      menu = "x";
      break;
    default:
      console.log("Invalid input. Please try again.");
      menu = "h";
      break;
  }
}
