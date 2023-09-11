import { Util } from "./util.js";

const util = new Util();

// Automatically play game by using blackjack strategy, return 0 = Hit, 1 = Stand, 2 = Show hands, 3 = Insurance, 4 = Double down
export function autodecide(playerHand, dealerHand) {
  util.sleep(1000);
  // Check if player has only two cards
  if (playerHand.length === 2 && util.containsAce(playerHand)) {
    switch (util.calcHand(playerHand)) {
      case 12:
      case 13:
      case 14:
      case 15:
      case 16:
      case 17:
        if (dealerHand[0].value === 4 || dealerHand[0].value === 5 || dealerHand[0].value === 6) {
          return 4;
        } else {
          return 0;
        }
      case 18:
        if (dealerHand[0].value === 9 || dealerHand[0].value === 10 || dealerHand[0].value === 11) {
          return 0;
        } else if (dealerHand[0].value === 2 || dealerHand[0].value === 7 || dealerHand[0].value === 8) {
          return 1;
        } else {
          return 4;
        }
      default:
        return 1;
    }
  } else {
    switch (util.calcHand(playerHand)) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
      case 8:
        return 0;
      case 9:
        if (
          dealerHand[0].value === 3 ||
          dealerHand[0].value === 4 ||
          dealerHand[0].value === 5 ||
          dealerHand[0].value === 6
        ) {
          return 4;
        } else {
          return 0;
        }
      case 10:
        if (playerHand.length === 2 && util.isPair(playerHand) && dealerHand[0].value >= 2 && dealerHand[0].value <= 6) {
          // Hand is 5,5 and dealer between 2 and 6
          return 4;
        } else if (dealerHand[0].value === 10 || dealerHand[0].value === 11) {
          return 0;
        } else {
          return 4;
        }
      case 11:
        return 0;
      case 12:
        if (dealerHand[0].value === 4 || dealerHand[0].value === 5 || dealerHand[0].value === 6) {
          return 1;
        } else {
          return 0;
        }
      case 13:
      case 14:
      case 15:
      case 16:
        if (
          dealerHand[0].value === 2 ||
          dealerHand[0].value === 3 ||
          dealerHand[0].value === 4 ||
          dealerHand[0].value === 5 ||
          dealerHand[0].value === 6
        ) {
          return 0;
        } else {
          return 1;
        }
      default:
        return 1;
    }
  }
}