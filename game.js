// Prompt for user input
const readlineSync = require('readline-sync');

// Information data
const { version, date } = require('./package.json');

// Card contents
const suits = ['Herz', 'Pik', 'Kreuz', 'Karo'];
const ranks = ['A', 'K', 'D', 'B', '10', '9', '8', '7', '6', '5', '4', '3', '2'];
const values = [11, 10, 10, 10, 10, 9, 8, 7, 6, 5, 4, 3, 2];

// Create every possible combination of suit and rank
let cards = [];

// Deck
let deck = [];

// Create cards
for (let suit of suits) {
    let i = 0;
  for (let rank of ranks) {
    const value = values[i];
    cards.push({ suit, rank, value });
    i++;
  }
}

// Wait function to delay execution
function sleep(ms) {
    const wakeUpTime = Date.now() + ms;
    while (Date.now() < wakeUpTime) {}
}

// Create a deck of multiple card sets
function getDeck(stacks) {
    for (let i = 0; i < stacks; i++) {
        for (let card of cards) {
            deck.push(card);           
        }
    }
}

// Shuffle deck
function shuffle(iterations) {
    for (let i = 0; i < iterations; i++) {        
        for (let i = deck.length-1; i > 0; i--) {
            let j = Math.floor(Math.random() * i);
            let temp = deck[i];
            deck[i] = deck[j];
            deck[j] = temp;
        }
    }
}

// Print a single card 
function printCard(card) {
    console.log('-----------');
    console.log('| ' + getSymbol(card.suit) + '       |');
    console.log('|         |');
    if (card.rank == 10) {
        console.log('|    ' +  card.rank + '   |');
    } else {
        console.log('|    ' +  card.rank + '    |');
    }
    console.log('|         |');
    console.log('|       ' + getSymbol(card.suit) + ' |');
    console.log('-----------');
}

// Draw cards from deck
function drawCard(deck) {
    if (deck.length == 0) {
        console.log("No more cards in deck!");
        console.log("Shuffling deck...");
        getDeck(4);
        shuffle(1000);
        console.log("Deck has cards: +" + deck.length );
    }
    return deck.pop();
}

// Get symbol for card
function getSymbol(suit) {
    switch (suit) {
        case 'Herz':
            return '♥';
        case 'Pik':
            return '♠';
        case 'Kreuz':
            return '♣';
        case 'Karo':
            return '♦';
    }
}

// Calculate hand value
function calcHand(hand) {
    let sum = 0;
    for (let card of hand) {
        sum += card.value;
    }
    if (sum > 21) {
        for (let card of hand) {
            if (card.rank == 'A' && sum > 21) {
                sum -= 10;
            }
        }
    }
    return sum;
}

// Print hand
function printHand(hand) {
    let output = ['','','','','','',''];
    for (let card of hand) {
        output[0] += '----------- ';
        output[1] += '| ' + getSymbol(card.suit) + '       | ';
        output[2] += '|         | ';
        if (card.rank == 10) {
            output[3] += '|    ' +  card.rank + '   | ';
        }
        else {
            output[3] += '|    ' +  card.rank + '    | ';
        }
        output[4] += '|         | ';
        output[5] += '|       ' + getSymbol(card.suit) + ' | ';
        output[6] += '----------- ';
    }
    for (let line of output) {
        console.log(line);
    }
}

// Statistics class
class Stats {
    constructor() {
        this.wins = 0;
        this.losses = 0;
        this.draws = 0;
        this.blackjacks = 0;
    }
    getGames() {
        return this.wins + this.losses + this.draws;
    }
    getWinrate() {
        return Math.round((this.wins / this.getGames()) * 100);
    }
    addWin() {
        this.wins++;
    }
    addLoss() {
        this.losses++;
    }
    addDraw() {
        this.draws++;
    }
    addBlackjack() {
        this.blackjacks++;
    }
    addGame() {
        this.games++;
    }
    printStats() {
        sleep(200);
        console.log('---STATS---');
        sleep(200);
        console.log('Wins: ' + this.wins);
        sleep(200);
        console.log('Losses: ' + this.losses);
        sleep(200);
        console.log('Draws: ' + this.draws);
        sleep(200);
        console.log('Blackjacks: ' + this.blackjacks);
        sleep(200);
        console.log('Games played: ' + this.getGames());
        sleep(200);
        console.log('Winrate: ' + this.getWinrate() + '%');
        sleep(500);
    }
}

function printEnd(playerHand, dealerHand) {
    console.log("Your hand was:");
    printHand(playerHand);
    console.log("Your total was: " + calcHand(playerHand));
    console.log("Dealer hand was:");
    printHand(dealerHand);
    console.log("Dealer total was: " + calcHand(dealerHand));
}

// Automatically play game by using blackjack strategy
function autoplay(playerHand, dealerHand) {
    // Check if player has only two cards
    if (playerHand.length == 2) {
        // Check if player has an Ace
        if (containsAce(playerHand)) {
            switch (calcHand(playerHand)) {
                case 12:
                case 13:
                case 14:
                case 15:
                case 16:
                case 17:
                    return 0;
                    break;
            }
                
        }
    } else {
    }
        
}

function containsAce(hand) {
    for (let card of hand) {
        if (card.rank == 'A') {
            return true;
        }
    }
    return false;
}

// Start game
function play(autoplay) {
    console.clear();
    let game = true;
    const stats = new Stats();
    getDeck(4);
    shuffle(1000);
    while (game) {
        stats.addGame();
        console.clear();
        let dealerHand = [];
        let playerHand = [];
        console.log("Both players are drawing their first cards...");
        sleep(1000);
        // Draw initial 2 cards for each player
        for (let i = 0; i < 2; i++) {
            dealerHand.push(drawCard(deck));
            playerHand.push(drawCard(deck));
        }
        // Print cards
        console.log('Visible Dealer card:');
        printCard(dealerHand[0]);
        sleep(500);
        console.log('Player:');
        printHand(playerHand);
        // Check for blackjack
        let playerturn = true;
        let dealerturn = false;
        while (playerturn) {
            if (calcHand(playerHand) == 21 || (playerHand.length == 5 && calcHand(playerHand) < 21 || calcHand(playerHand) > 21)) {	
                playerturn = false;
                dealerturn = true;
                sleep(500);
            }
            else {
                console.log("Your hand value: " + calcHand(playerHand) + " | Dealer hand value: " + dealerHand[0].value);
                console.log("----------------------------------");
                // Ask player for action or autoplay
                if (autoplay) {
                    let action = autoplay(playerHand, dealerHand);
                } else {
                    const actionOptions = ['Hit', 'Stand', 'Show hands'];
                    let action = readlineSync.keyInSelect(actionOptions, 'What do you want to do?', {cancel: false});
                }
                if (action == 0) {
                    console.clear();
                    console.log("You are drawing a card...");
                    sleep(1300);
                    playerHand.push(drawCard(deck));
                    console.log("You draw:");
                    printCard(playerHand[playerHand.length-1]);
                    sleep(500);
                    console.log("Your hand:");
                    printHand(playerHand);
                    sleep(500);
                    console.log('Visible Dealer card:');
                    printCard(dealerHand[0]);
                } else if (action == 1) {
                    playerturn = false;
                    dealerturn = true;
                    console.clear();
                    console.log("You stand with a hand value of: " + calcHand(playerHand));
                    sleep(1000);
                } else if (action == 2) {
                    console.clear();
                    console.log("Showing hands...");
                    sleep(1000);
                    console.log("Your hand:");
                    printHand(playerHand);
                    console.log('Visible Dealer card:');
                    printCard(dealerHand[0]);
                }
            }
        }
        while (dealerturn) {
            // Reveal second card
            console.log("Dealer hand:");
            printHand(dealerHand);
            console.log("Dealer total: " + calcHand(dealerHand));
            if (calcHand(dealerHand) >= 17 || dealerHand.length == 5) {
                dealerturn = false;
            } else {
                console.log("Dealer draws...");
                sleep(2000);
                console.clear();
                console.log("Dealer draws:");
                dealerHand.push(drawCard(deck));
                printCard(dealerHand[dealerHand.length-1]);
                sleep(1000);
            }
        }
        sleep(1500);
        console.clear();
        // WIN CONDITIONS
        // Player has blackjack or dealer doesn't
        if (calcHand(playerHand) == 21 && calcHand(dealerHand) != 21) {
            console.log("You have a Blackjack! You win!");
            stats.addWin();
            stats.addBlackjack();
        }
        // Player has 5 cards and dealer doesn't
        else if (playerHand.length == 5 && calcHand(playerHand) < 21 && calcHand(dealerHand) != 21 && dealerHand.length < 5) {
            console.log("You have 5 cards and a total of " + calcHand(playerHand) + "! You win!");
            stats.addWin();
        }
        // Player has higher hand value than dealer
        else if (calcHand(playerHand) > calcHand(dealerHand) && calcHand(playerHand) <= 21) {
            console.log("You have a higher hand value than the dealer! You win!");
            stats.addWin();
        }
        // Dealer has blackjack and player doesn't
        else if (calcHand(dealerHand) == 21 && calcHand(playerHand) != 21) {
            console.log("Dealer has a Blackjack! Dealer wins!");
            stats.addLoss();
            stats.addBlackjack();
        }
        // Dealer has 5 cards and player doesn't
        else if (dealerHand.length == 5 && calcHand(dealerHand) < 21 && calcHand(playerHand) != 21 && playerHand.length < 5) {
            console.log("Dealer has 5 cards! Dealer wins!");
            stats.addLoss();
        }
        // Player went over 21 
        else if (calcHand(playerHand) > 21 && calcHand(dealerHand) <= 21) {
            console.log("You went over 21! Dealer wins!");
            stats.addLoss();
        }
        // Dealer went over 21 
        else if (calcHand(dealerHand) > 21 && calcHand(playerHand) <= 21) {
            console.log("Dealer went over 21! You win!");
            stats.addWin();
        }
        // Dealer has higher hand value than player
        else if (calcHand(dealerHand) > calcHand(playerHand) && calcHand(dealerHand) <= 21) {
            console.log("Dealer has a higher hand value than you! Dealer wins!");
            stats.addLoss();
        }
        // Tie 
        else {
            console.log("It's a tie!");
            stats.addDraw();
        }
        // Print game end screen
        printEnd(playerHand, dealerHand);
        if (!readlineSync.keyInYN('Do you want to play again?')) {
            game = false;
            // Print stats
            stats.printStats();
            sleep(500);
            start = readlineSync.keyInPause('Press any key to go back to the main menu.');
            menu = 'h';
        } else {
            game = true;
        }
    }
}

// MENU VAR
// h = home
// r = rules
// s = start
// i = info
// q = quit
let menu = 'h';
let start = 0;
while (menu != 'x') {
    switch (menu) {
        case 'h':
            console.clear();
            console.log('WELCOME TO BLACKJACK!');
            console.log('---------------------');
            var menuInputs = ['Start', 'Autoplay', 'Rules', 'Info', 'Quit'];
            start = readlineSync.keyInSelect(menuInputs, 'What do you want to do?', {cancel: false});
            switch (start) {
                case 0:
                    menu = 's';
                    break;
                case 1:
                    menu = 'a';
                    break;
                case 2:
                    menu = 'r';
                    break;
                case 3:
                    menu = 'i';
                    break;
                case 4:
                    menu = 'q';
                    break;
                default:
                    console.log("Invalid input. Please try again.");
                    menu = 'h';
                    break;
            }
            break;
        case 'r':
                console.clear();
                console.log('RULES:');
                console.log('------');
                console.log('Each participant attempts to beat the dealer by getting a count as close to 21 as possible, without going over 21.');
                console.log('The value of a hand is the sum of the card values. Players are allowed to draw additional cards to improve their hands.');
                console.log('At the start of the game, the dealer gives the player two cards face up. The dealer then gives himself two cards, one face up and one face down.');
                console.log('If a player\'s first two cards are an ace and a "ten-card" (a picture card or 10), giving a count of 21 in two cards, this is a natural or "blackjack".')
                console.log('It is up to each individual player if an ace is worth 1 or 11. Face cards are 10 and any other card is its pip value.');
                console.log('Each turn, the player decides whether to hit (take another card) or stand (take no more cards).');
                console.log('You can draw cards by pressing H, stand by pressing S and show both hands by pressing C.');
                console.log('If you have a hand value of 21 you have a Blackjack and you win automatically IF the dealer does not also have a Blackjack.');
                console.log('A hand value above 21 is a bust.');
                console.log('If you have 5 cards and did not bust you win IF the dealer does not also have 5 cards and a hand value of less than 21.');
                console.log('If you bust and the dealer does not you lose.');
                console.log('If the dealer busts and you do not you win.');
                console.log('If you and the dealer have the same hand value it is a tie.');
                console.log('The game will also be a tie if both you and the dealer bust.');
                console.log('The dealer will draw cards until he has a hand value of 17 or more.');
                console.log('----------------------------------');
                console.log('\n');
                let pause1 = readlineSync.keyInPause('Press any key to go back to the main menu.');
                menu = 'h';
                break;
        case 's':
            play(false);
            break;
        case 'a':
            autoplay(true);
            break;
        case 'i':
            console.clear();
            console.log('INFORMATION:');
            console.log('------------');
            console.log('BLACKJACK IN JAVASCRIPT BY SUPTOWER');
            console.log('----------------------------------');
            console.log('Version: ' + version + ' (' + date + ')');
            console.log('GitHub: https://github.com/suptower/js-blackjack');
            console.log('----------------------------------');
            console.log('\n');
            let pause2 = readlineSync.keyInPause('Press any key to go back to the main menu.');
            menu = 'h';
            break;
        case 'q':
            console.clear();
            console.log('Thanks for playing!');
            console.log('-------------------');
            sleep(1500);
            console.clear();
            menu = 'x';
            break;
        default:
            console.log("Invalid input. Please try again.");
            menu = 'h';
            break;
    }
}


