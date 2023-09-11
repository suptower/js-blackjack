// persist conf
import Conf from 'conf';

// Create a new Conf instance
const config = new Conf({ projectName: "blackjack"});

// Card contents
const suits = ["Herz", "Pik", "Kreuz", "Karo"];
const ranks = ["A", "K", "D", "B", "10", "9", "8", "7", "6", "5", "4", "3", "2"];
const values = [11, 10, 10, 10, 10, 9, 8, 7, 6, 5, 4, 3, 2];

// Create every possible combination of suit and rank
const cards = [];

// Create cards
for (const suit of suits) {
  let i = 0;
  for (const rank of ranks) {
    const value = values[i];
    cards.push({ suit, rank, value });
    i++;
  }
}

// Create a deck of multiple card sets
function getDeck(stacks) {
  const deck = [];
  for (let i = 0; i < stacks; i++) {
    for (const card of cards) {
      deck.push(card);
    }
  }
  return deck;
}

// Shuffle deck
function shuffle(deck, iterations) {
  for (let i = 0; i < iterations; i++) {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i);
      const temp = deck[i];
      deck[i] = deck[j];
      deck[j] = temp;
    }
  }
  return deck;
}

// Draw cards from deck
function drawCard(deck) {
  if (deck.length === 0) {
    console.log("No more cards in deck!");
    console.log("Shuffling deck...");
    DeckHandler.getNewDeck(DeckHandler.getStackSize(), 1000)
    console.log("Deck has cards: +" + deck.length);
  }
  return deck.pop();
}

export class DeckHandler {
  constructor() {
    this.stackSize = config.get("stackSize");
    this.deck = shuffle(getDeck(this.stackSize), 1000);
  }

  drawCard() {
    return drawCard(this.deck);
  }

  shuffle(iterations) {
    this.deck = shuffle(this.deck, iterations);
  }

  getDeck() {
    return this.deck;
  }

  getNewDeck(stacks, iterations) {
    this.deck = shuffle(getDeck(stacks), iterations);
  }

  updateStackSize() {
    this.stackSize = config.get("stackSize");
  }

  getStackSize() {
    return this.stackSize;
  }
}