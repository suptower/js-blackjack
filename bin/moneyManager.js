// Persist conf
import Conf from 'conf';

const config = new Conf({ projectName: "blackjack"});

// Class for managing money
export class MoneyManager {
  constructor() {
    this.startMoney = config.get("startMoney");
    this.money = this.startMoney;
    this.startBet = 0;
    this.lastBet = 0;
    this.didWin = false;
  }

  getMoney() {
    return this.money;
  }

  getStartMoney() {
    return this.startMoney;
  }

  getStartBet() {
    return this.startBet;
  }

  getLastBet() {
    return this.lastBet;
  }

  getDidWin() {
    return this.didWin;
  }

  setMoney(money) {
    this.money = money;
  }

  setStartMoney(startMoney) {
    this.startMoney = startMoney;
  }

  setStartBet(startBet) {
    this.startBet = startBet;
  }

  setLastBet(lastBet) {
    this.lastBet = lastBet;
  }

  setDidWin(didWin) {
    this.didWin = didWin;
  }

  addMoney(money) {
    this.money += money;
  }

  subMoney(money) {
    this.money -= money;
  }

  printMoney() {
    console.log("You have " + this.money + "€.");
  }

  // Double the bet if lost, reset if won
  getNextBet() {
    if (this.getLastBet() === 0) {
      return this.startBet;
    }
    if (this.didWin) {
      this.didWin = false;
      return this.startBet;
    } else {
      if (this.getLastBet() * 2 > this.getMoney()) {
        return this.getMoney();
      }
      return this.getLastBet() * 2;
    }
  }

  reset() {
    this.money = this.startMoney;
    this.startBet = 0;
    this.lastBet = 0;
    this.didWin = false;
  }

  // Unable to bet if money is less than 2
  checkMoney() {
    if (this.getMoney() < 2) {
      return false;
    }
    return true;
  }
}