// Prompt for user input
const readlineSync = require('readline-sync')

// Information data
const { version, date } = require('./package.json')

// Card contents
const suits = ['Herz', 'Pik', 'Kreuz', 'Karo']
const ranks = ['A', 'K', 'D', 'B', '10', '9', '8', '7', '6', '5', '4', '3', '2']
const values = [11, 10, 10, 10, 10, 9, 8, 7, 6, 5, 4, 3, 2]

// Create every possible combination of suit and rank
const cards = []

// Deck
const deck = []

// Define stack size, can be customized in main menu via options
let stackSize = 4

// Create cards
for (const suit of suits) {
  let i = 0
  for (const rank of ranks) {
    const value = values[i]
    cards.push({ suit, rank, value })
    i++
  }
}

// Wait function to delay execution
function sleep (ms) {
  const wakeUpTime = Date.now() + ms
  while (Date.now() < wakeUpTime) {
    // This is blocking code
  }
}

// Create a deck of multiple card sets
function getDeck (stacks) {
  for (let i = 0; i < stacks; i++) {
    for (const card of cards) {
      deck.push(card)
    }
  }
}

// Shuffle deck
function shuffle (iterations) {
  for (let i = 0; i < iterations; i++) {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i)
      const temp = deck[i]
      deck[i] = deck[j]
      deck[j] = temp
    }
  }
}

// Print a single card
function printCard (card) {
  console.log('-----------')
  console.log('| ' + getSymbol(card.suit) + '       |')
  console.log('|         |')
  if (card.rank === '10') {
    // Padding has to be adapted for 10
    console.log('|    ' + card.rank + '   |')
  } else {
    console.log('|    ' + card.rank + '    |')
  }
  console.log('|         |')
  console.log('|       ' + getSymbol(card.suit) + ' |')
  console.log('-----------')
}

// Draw cards from deck
function drawCard (deck) {
  if (deck.length === 0) {
    console.log('No more cards in deck!')
    console.log('Shuffling deck...')
    getDeck(stackSize)
    shuffle(1000)
    console.log('Deck has cards: +' + deck.length)
  }
  return deck.pop()
}

// Get symbol for card
function getSymbol (suit) {
  switch (suit) {
    case 'Herz':
      return '♥'
    case 'Pik':
      return '♠'
    case 'Kreuz':
      return '♣'
    case 'Karo':
      return '♦'
  }
}

// Calculate hand value
function calcHand (hand) {
  let sum = 0
  for (const card of hand) {
    sum += card.value
  }
  if (sum > 21) {
    for (const card of hand) {
      if (card.rank === 'A' && sum > 21) {
        sum -= 10
      }
    }
  }
  return sum
}

// Print hand
function printHand (hand) {
  const output = ['', '', '', '', '', '', '']
  for (const card of hand) {
    output[0] += '----------- '
    output[1] += '| ' + getSymbol(card.suit) + '       | '
    output[2] += '|         | '
    if (card.rank === '10') {
      // Padding has to be adapted for 10
      output[3] += '|    ' + card.rank + '   | '
    } else {
      output[3] += '|    ' + card.rank + '    | '
    }
    output[4] += '|         | '
    output[5] += '|       ' + getSymbol(card.suit) + ' | '
    output[6] += '----------- '
  }
  for (const line of output) {
    console.log(line)
  }
}

// Statistics class
class Stats {
  constructor () {
    this.wins = 0
    this.losses = 0
    this.draws = 0
    this.blackjacks = 0
  }

  getGames () {
    return this.wins + this.losses + this.draws
  }

  getWinrate () {
    return Math.round((this.wins / this.getGames()) * 100)
  }

  addWin () {
    this.wins++
  }

  addLoss () {
    this.losses++
  }

  addDraw () {
    this.draws++
  }

  addBlackjack () {
    this.blackjacks++
  }

  addGame () {
    this.games++
  }

  getRevenue (moneyNow, startingMoney) {
    return moneyNow - startingMoney
  }

  getAverageRevenue (moneyNow, startingMoney) {
    return Math.round((this.getRevenue(moneyNow, startingMoney) / this.getGames()) * 100) / 100
  }

  printStats (moneymgmt) {
    sleep(200)
    console.log('---STATS---')
    sleep(200)
    console.log('Wins: ' + this.wins)
    sleep(200)
    console.log('Losses: ' + this.losses)
    sleep(200)
    console.log('Draws: ' + this.draws)
    sleep(200)
    console.log('Blackjacks: ' + this.blackjacks)
    sleep(200)
    console.log('Games played: ' + this.getGames())
    sleep(200)
    console.log('Winrate: ' + this.getWinrate() + '%')
    sleep(500)
    console.log('Revenue: ' + this.getRevenue(moneymgmt.getMoney(), moneymgmt.getStartMoney()))
    sleep(200)
    console.log('Average revenue per game: ' + this.getAverageRevenue(moneymgmt.getMoney(), moneymgmt.getStartMoney()))
    sleep(200)
  }

  reset () {
    this.wins = 0
    this.losses = 0
    this.draws = 0
    this.blackjacks = 0
  }
}

const stats = new Stats()

// Class for managing money
class MoneyManager {
  constructor () {
    this.money = 1000
    this.startMoney = 1000
    this.startBet = 0
    this.lastBet = 0
    this.didWin = false
  }

  getMoney () {
    return this.money
  }

  getStartMoney () {
    return this.startMoney
  }

  getStartBet () {
    return this.startBet
  }

  getLastBet () {
    return this.lastBet
  }

  getDidWin () {
    return this.didWin
  }

  setMoney (money) {
    this.money = money
  }

  setStartMoney (startMoney) {
    this.startMoney = startMoney
  }

  setStartBet (startBet) {
    this.startBet = startBet
  }

  setLastBet (lastBet) {
    this.lastBet = lastBet
  }

  setDidWin (didWin) {
    this.didWin = didWin
  }

  addMoney (money) {
    this.money += money
  }

  subMoney (money) {
    this.money -= money
  }

  printMoney () {
    console.log('You have ' + this.money + '€.')
  }

  // Double the bet if lost, reset if won
  getNextBet () {
    if (this.getLastBet() === 0) {
      return this.startBet
    }
    if (this.didWin) {
      this.didWin = false
      return this.startBet
    } else {
      if (this.getLastBet() * 2 > this.getMoney()) {
        return this.getMoney()
      }
      return this.getLastBet() * 2
    }
  }

  reset () {
    this.money = this.startMoney
    this.startBet = 0
    this.lastBet = 0
    this.didWin = false
  }

  // Unable to bet if money is less than 2
  checkMoney () {
    if (this.getMoney() < 2) {
      return false
    }
    return true
  }
}

const moneyManager = new MoneyManager()

function printEnd (playerHand, dealerHand) {
  console.log('Game summary: (Game ' + stats.getGames() + ')')
  console.log('Your hand was:')
  printHand(playerHand)
  console.log('Your total was: ' + calcHand(playerHand))
  console.log('Dealer hand was:')
  printHand(dealerHand)
  console.log('Dealer total was: ' + calcHand(dealerHand))
}

// Automatically play game by using blackjack strategy, return 0 = Hit, 1 = Stand, 2 = Show hands, 3 = Insurance, 4 = Double down
function autodecide (playerHand, dealerHand) {
  sleep(1000)
  console.log('Autoplaying...')
  // Check if player has only two cards
  if (playerHand.length === 2 && containsAce(playerHand)) {
    switch (calcHand(playerHand)) {
      case 12:
      case 13:
      case 14:
      case 15:
      case 16:
      case 17:
        if (dealerHand[0].value === 4 || dealerHand[0].value === 5 || dealerHand[0].value === 6) {
          return 4
        } else {
          return 0
        }
      case 18:
        if (dealerHand[0].value === 9 || dealerHand[0].value === 10 || dealerHand[0].value === 11) {
          return 0
        } else if (dealerHand[0].value === 2 || dealerHand[0].value === 7 || dealerHand[0].value === 8) {
          return 1
        } else {
          return 4
        }
      default:
        return 1
    }
  } else {
    switch (calcHand(playerHand)) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
      case 8:
        return 0
      case 9:
        if (dealerHand[0].value === 3 || dealerHand[0].value === 4 || dealerHand[0].value === 5 || dealerHand[0].value === 6) { 
          return 4
        } else {
          return 0
        }
      case 10:
        if (playerHand.length === 2 && isPair(playerHand) && (dealerHand[0].value >= 2 && dealerHand[0].value <= 6)) {
          // Hand is 5,5 and dealer between 2 and 6
          return 4
        } else if (dealerHand[0].value === 10 || dealerHand[0].value === 11) {
          return 0
        } else {
          return 4
        }
      case 11:
        return 0
      case 12:
        if (dealerHand[0].value === 4 || dealerHand[0].value === 5 || dealerHand[0].value === 6) {
          return 1
        } else {
          return 0
        }
      case 13:
      case 14:
      case 15:
      case 16:
        if (dealerHand[0].value === 2 || dealerHand[0].value === 3 || dealerHand[0].value === 4 || dealerHand[0].value === 5 || dealerHand[0].value === 6) {
          return 0
        } else {
          return 1
        }
      default:
        return 1
    }
  }
}

// Check if hand contains Ace
function containsAce (hand) {
  for (const card of hand) {
    if (card.rank === 'A') {
      return true
    }
  }
  return false
}

// Check if hand has two identical cards
function isPair (hand) {
  if (hand.length === 2) {
    if (hand[0].rank === hand[1].rank) {
      return true
    }
  }
  return false
}

// Start game
function play (autoplay) {
  moneyManager.setMoney(moneyManager.getStartMoney())
  console.clear()
  let game = true
  let currentBet = 0
  let insurance = false
  getDeck(stackSize)
  shuffle(1000)
  while (game) {
    insurance = false
    if (!moneyManager.checkMoney()) {
      console.log('You are out of money!')
      sleep(1000)
      game = false
      break
    }
    stats.addGame()
    console.clear()
    // Set bet by getNextBet if autoplay, else ask for bet
    if (autoplay) {
      currentBet = moneyManager.getNextBet()
    } else {
      console.log('You have ' + moneyManager.getMoney() + '€')
      currentBet = readlineSync.questionInt('Place your bet (2 - ' + moneyManager.getMoney() + '): ')
      while (currentBet < 2 || currentBet > moneyManager.getMoney()) {
        console.log('Invalid bet!')
        currentBet = readlineSync.questionInt('Place your bet (2 - ' + moneyManager.getMoney() + '): ')
      }
    }
    console.log('You bet ' + currentBet + '€')
    sleep(500)
    // set last bet and subtract money
    moneyManager.setLastBet(currentBet)
    moneyManager.subMoney(currentBet)
    const dealerHand = []
    const playerHand = []
    console.log('Both players are drawing their first cards...')
    sleep(1000)
    // Draw initial 2 cards for each player
    for (let i = 0; i < 2; i++) {
      dealerHand.push(drawCard(deck))
      playerHand.push(drawCard(deck))
    }
    // Print cards
    console.log('Visible Dealer card:')
    printCard(dealerHand[0])
    sleep(500)
    console.log('Player:')
    printHand(playerHand)
    // Check for blackjack
    let playerturn = true
    let dealerturn = false
    while (playerturn) {
      if (calcHand(playerHand) === 21 || (playerHand.length === 5 && calcHand(playerHand) < 21) || calcHand(playerHand) > 21) {
        playerturn = false
        dealerturn = true
        sleep(500)
      } else {
        console.log('Your hand value: ' + calcHand(playerHand) + ' | Dealer hand value: ' + dealerHand[0].value)
        console.log('----------------------------------')
        // Ask player for action or autoplay
        let action = 0
        // 0 = Hit, 1 = Stand, 2 = Show hands, 3 = Insurance, 4 = Double down
        const actionOptions = ['Hit', 'Stand', 'Show hands']
        if (autoplay) {
          action = autodecide(playerHand, dealerHand)
        } else {
          if (playerHand.length === 2) {
            // Check for further actions
            // Check for insurance
            if (dealerHand[0].rank === 'A') {
              actionOptions.push('Insurance')
            }
            // Check for double down
            if (moneyManager.getMoney() >= currentBet) {
              actionOptions.push('Double down')
            }
            // Check if player can split
            if (isPair(playerHand)) {
              // Needs further work, not planned right now
              // actionOptions.push('Split')
            }
          }
          action = readlineSync.keyInSelect(actionOptions, 'What do you want to do?', { cancel: false })
          switch (actionOptions[action]) {
            case 'Hit':
              action = 0
              break
            case 'Stand':
              action = 1
              break
            case 'Show hands':
              action = 2
              break
            case 'Insurance':
              action = 3
              break
            case 'Double down':
              action = 4
              break
            default:
              action = 1
              break
          }
        }
        if (action === 0) {
          console.clear()
          console.log('You are drawing a card...')
          sleep(1300)
          playerHand.push(drawCard(deck))
          console.log('You draw:')
          printCard(playerHand[playerHand.length - 1])
          sleep(500)
          console.log('Your hand:')
          printHand(playerHand)
          sleep(500)
          console.log('Visible Dealer card:')
          printCard(dealerHand[0])
        } else if (action === 1) {
          playerturn = false
          dealerturn = true
          console.clear()
          console.log('You stand with a hand value of: ' + calcHand(playerHand))
          sleep(1000)
        } else if (action === 2) {
          console.clear()
          console.log('Showing hands...')
          sleep(1000)
          console.log('Your hand:')
          printHand(playerHand)
          console.log('Visible Dealer card:')
          printCard(dealerHand[0])
        } else if (action === 3) {
          console.clear()
          let insuranceBet = 0
          if (currentBet / 2 > moneyManager.getMoney()) {
            insuranceBet = moneyManager.getMoney()
          } else {
            insuranceBet = currentBet / 2
          }
          console.log('You buy insurance for ' + insuranceBet + '€')
          sleep(1000)
          moneyManager.subMoney(currentBet / 2)
          playerturn = false
          insurance = true
        } else if (action === 4) {
          console.clear()
          console.log('You double down for ' + currentBet + '€')
          sleep(1000)
          moneyManager.subMoney(currentBet)
          currentBet = currentBet * 2
          playerHand.push(drawCard(deck))
          console.log('You draw:')
          printCard(playerHand[playerHand.length - 1])
          sleep(500)
          console.log('Your hand:')
          printHand(playerHand)
          sleep(500)
          console.log('Visible Dealer card:')
          printCard(dealerHand[0])
          playerturn = false
          dealerturn = true
        }
      }
    }
    while (dealerturn) {
      // Reveal second card
      console.log('Dealer hand:')
      printHand(dealerHand)
      console.log('Dealer total: ' + calcHand(dealerHand))
      if (calcHand(dealerHand) >= 17 || dealerHand.length === 5) {
        dealerturn = false
      } else {
        console.log('Dealer draws...')
        sleep(2000)
        console.clear()
        console.log('Dealer draws:')
        dealerHand.push(drawCard(deck))
        printCard(dealerHand[dealerHand.length - 1])
        sleep(1000)
      }
    }
    sleep(1500)
    console.clear()
    // WIN CONDITIONS
    // Blackjack pays 3:2, other wins pay 1:1, Tie returns bet
    if (calcHand(playerHand) === 21 && calcHand(dealerHand) !== 21) {
      // Player has blackjack or dealer doesn't
      console.log('You have a Blackjack! You win!')
      stats.addWin()
      stats.addBlackjack()
      console.log('You won ' + currentBet * 2.5 + '!')
      moneyManager.addMoney(currentBet * 2.5)
      moneyManager.setDidWin(true)
      console.log('You have ' + moneyManager.getMoney() + '€.')
    } else if (playerHand.length === 5 && calcHand(playerHand) < 21 && calcHand(dealerHand) !== 21 && dealerHand.length < 5) {
      // Player has 5 cards and dealer doesn't
      console.log('You have 5 cards and a total of ' + calcHand(playerHand) + '! You win!')
      stats.addWin()
      console.log('You won ' + currentBet * 2 + '!')
      moneyManager.addMoney(currentBet * 2)
      moneyManager.setDidWin(true)
      console.log('You have ' + moneyManager.getMoney() + '€.')
    } else if (calcHand(playerHand) > calcHand(dealerHand) && calcHand(playerHand) <= 21) {
      // Player has higher hand value than dealer
      console.log('You have a higher hand value than the dealer! You win!')
      stats.addWin()
      console.log('You won ' + currentBet * 2 + '!')
      moneyManager.addMoney(currentBet * 2)
      moneyManager.setDidWin(true)
    } else if (calcHand(dealerHand) === 21 && calcHand(playerHand) !== 21) {
      // Dealer has blackjack and player doesn't
      console.log('Dealer has a Blackjack! Dealer wins!')
      stats.addLoss()
      stats.addBlackjack()
      if (insurance && dealerHand.length === 2) {
        console.log('You win your insurance bet back!')
        moneyManager.addMoney(currentBet / 2)
      }
    } else if (dealerHand.length === 5 && calcHand(dealerHand) < 21 && calcHand(playerHand) !== 21 && playerHand.length < 5) {
      // Dealer has 5 cards and player doesn't
      console.log('Dealer has 5 cards! Dealer wins!')
      stats.addLoss()
    } else if (calcHand(playerHand) > 21 && calcHand(dealerHand) <= 21) {
      // Player went over 21
      console.log('You went over 21! Dealer wins!')
      stats.addLoss()
    } else if (calcHand(dealerHand) > 21 && calcHand(playerHand) <= 21) {
      // Dealer went over 21
      console.log('Dealer went over 21! You win!')
      stats.addWin()
      console.log('You won ' + currentBet * 2 + '!')
      moneyManager.addMoney(currentBet * 2)
      moneyManager.setDidWin(true)
      console.log('You have ' + moneyManager.getMoney() + '€.')
    } else if (calcHand(dealerHand) > calcHand(playerHand) && calcHand(dealerHand) <= 21) {
      // Dealer has higher hand value than player
      console.log('Dealer has a higher hand value than you! Dealer wins!')
      stats.addLoss()
    } else {
      // Tie
      console.log("It's a tie!")
      stats.addDraw()
      console.log('You got your bet of ' + currentBet + '€ back.')
      moneyManager.addMoney(currentBet)
      moneyManager.setDidWin(false)
      moneyManager.setLastBet(currentBet / 2)
      console.log('You have ' + moneyManager.getMoney() + '€.')
    }
    // Print game end screen
    printEnd(playerHand, dealerHand)
    if (!readlineSync.keyInYN('Do you want to play again?')) {
      game = false
      // Print stats
      stats.printStats(moneyManager)
      sleep(500)
      start = readlineSync.keyInPause('Press any key to go back to the main menu.')
      menu = 'h'
    } else {
      game = true
    }
  }
  sleep(500)
  console.clear()
  console.log('Going back to main menu...')
  sleep(1000)
  menu = 'h'
}

// MENU VAR
// h = home
// r = rules
// s = start
// a = autoplay
// i = info
// o = options
// q = quit
let menu = 'h'
let start = 0
while (menu !== 'x') {
  switch (menu) {
    case 'h': {
      console.clear()
      console.log('WELCOME TO BLACKJACK!')
      console.log('---------------------')
      const menuInputs = ['Start', 'Autoplay', 'Rules', 'Info', 'Options', 'Quit']
      start = readlineSync.keyInSelect(menuInputs, 'What do you want to do?', { cancel: false })
      switch (start) {
        case 0:
          menu = 's'
          break
        case 1:
          menu = 'a'
          break
        case 2:
          menu = 'r'
          break
        case 3:
          menu = 'i'
          break
        case 4:
          menu = 'o'
          break
        case 5:
          menu = 'q'
          break
        default:
          console.log('Invalid input. Please try again.')
          menu = 'h'
          break
      }
      break
    }
    case 'r':
      console.clear()
      console.log('RULES:')
      console.log('------')
      console.log('Each participant attempts to beat the dealer by getting a count as close to 21 as possible, without going over 21.')
      console.log('The value of a hand is the sum of the card values. Players are allowed to draw additional cards to improve their hands.')
      console.log('At the start of the game, the dealer gives the player two cards face up. The dealer then gives himself two cards, one face up and one face down.')
      console.log('If a player\'s first two cards are an ace and a "ten-card" (a picture card or 10), giving a count of 21 in two cards, this is a natural or "blackjack".')
      console.log('If the dealer\'s face-up card is an ace, the player is offered the option of taking "insurance" before the dealer checks the hole card.')
      console.log('Insurance is a side bet that the dealer has blackjack and is treated independently of the main wager. It pays 2:1.')
      console.log('It is up to each individual player if an ace is worth 1 or 11. Face cards are 10 and any other card is its pip value.')
      console.log('Each turn, the player decides whether to hit (take another card) or stand (take no more cards).')
      console.log('You can draw cards by pressing H, stand by pressing S and show both hands by pressing C.')
      console.log('If you have a hand value of 21 you have a Blackjack and you win automatically IF the dealer does not also have a Blackjack.')
      console.log('A hand value above 21 is a bust.')
      console.log('If you have 5 cards and did not bust you win IF the dealer does not also have 5 cards and a hand value of less than 21.')
      console.log('If you bust and the dealer does not you lose.')
      console.log('If the dealer busts and you do not you win.')
      console.log('If you and the dealer have the same hand value it is a tie.')
      console.log('The game will also be a tie if both you and the dealer bust.')
      console.log('The dealer will draw cards until he has a hand value of 17 or more.')
      console.log('----------------------------------')
      console.log('The stack size is the amount of decks used in the game. The default is 4.')
      console.log('You can change the stack size in the options menu. Valid stack sizes are 1-16.')
      console.log('----------------------------------')
      console.log('The autoplay function will play the game for you.')
      console.log('The decision to hit or stand in autoplay is based on known blackjack strategy.')
      console.log('----------------------------------')
      console.log('\n')
      readlineSync.keyInPause('Press any key to go back to the main menu.')
      menu = 'h'
      break
    case 's':
      play(false)
      break
    case 'a': {
      console.clear()
      let newStartingBet = readlineSync.questionInt('What is your starting bet? (1 - ' + moneyManager.getMoney() + ') ?: ')
      while (newStartingBet < 1 || newStartingBet > moneyManager.getMoney()) {
        console.log('Invalid input. Please try again.')
        newStartingBet = readlineSync.questionInt('What is your starting bet? (1 - ' + moneyManager.getMoney() + ') ?: ')
      }
      moneyManager.setStartBet(newStartingBet)
      play(true)
      break
    }
    case 'i':
      console.clear()
      console.log('INFORMATION:')
      console.log('------------')
      console.log('BLACKJACK IN JAVASCRIPT BY SUPTOWER')
      console.log('----------------------------------')
      console.log('Version: ' + version + ' (' + date + ')')
      console.log('GitHub: https://github.com/suptower/js-blackjack')
      console.log('----------------------------------')
      console.log('\n')
      readlineSync.keyInPause('Press any key to go back to the main menu.')
      menu = 'h'
      break
    case 'o': {
      console.clear()
      console.log('OPTIONS')
      console.log('---------------------')
      const optionInputs = ['Change stack size', 'Reset stats', 'Starting money', 'Back']
      start = readlineSync.keyInSelect(optionInputs, 'What do you want to do?', { cancel: false })
      switch (start) {
        case 0: {
          console.clear()
          let newStackSize = readlineSync.questionInt('Enter new stack size (1-16) [DEFAULT: 4] : ')
          while (newStackSize < 1 || newStackSize > 16) {
            console.log('Invalid stack size. Please try again.')
            newStackSize = readlineSync.questionInt('Enter new stack size (1-16) [DEFAULT: 4] : ')
          }
          console.log('Changing stack size to ' + newStackSize + '...')
          sleep(1000)
          stackSize = newStackSize
          console.log('Stack size changed!')
          sleep(1000)
          newStackSize = readlineSync.keyInPause('Press any key to go back to the main menu.')
          menu = 'h'
          break
        }
        case 1:
          console.clear()
          console.log('Resetting stats...')
          sleep(1000)
          stats.reset()
          console.log('Stats reset!')
          sleep(1000)
          readlineSync.keyInPause('Press any key to go back to the main menu.')
          menu = 'h'
          break
        case 2: {
          console.clear()
          let newStartingMoney = readlineSync.questionInt('Enter new starting money (2-50.000) [DEFAULT: 1.000] : ')
          while (newStartingMoney < 2 || newStartingMoney > 50000) {
            console.log('Invalid starting money. Please try again.')
            newStartingMoney = readlineSync.questionInt('Enter new starting money (2-50.000) [DEFAULT: 1.000] : ')
          }
          console.log('Changing starting money to ' + newStartingMoney + '...')
          sleep(1000)
          moneyManager.setStartMoney(newStartingMoney)
          console.log('Starting money changed!')
          sleep(1000)
          readlineSync.keyInPause('Press any key to go back to the main menu.')
          menu = 'h'
          break
        }
        case 3:
          menu = 'h'
          break
        default:
          console.log('Invalid input. Please try again.')
          menu = 'o'
          break
      }
      break
    }
    case 'q':
      console.clear()
      console.log('Thanks for playing!')
      console.log('-------------------')
      sleep(1500)
      console.clear()
      menu = 'x'
      break
    default:
      console.log('Invalid input. Please try again.')
      menu = 'h'
      break
  }
}
