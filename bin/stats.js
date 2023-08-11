import { sleep } from "./util.js";

// Statistics class
export class Stats {
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

  getRevenue(moneyNow, startingMoney) {
    return moneyNow - startingMoney;
  }

  getAverageRevenue(moneyNow, startingMoney) {
    return Math.round((this.getRevenue(moneyNow, startingMoney) / this.getGames()) * 100) / 100;
  }

  printStats(moneymgmt) {
    sleep(200);
    console.log("---STATS---");
    sleep(200);
    console.log("Wins: " + this.wins);
    sleep(200);
    console.log("Losses: " + this.losses);
    sleep(200);
    console.log("Draws: " + this.draws);
    sleep(200);
    console.log("Blackjacks: " + this.blackjacks);
    sleep(200);
    console.log("Games played: " + this.getGames());
    sleep(200);
    console.log("Winrate: " + this.getWinrate() + "%");
    sleep(500);
    console.log("Revenue: " + this.getRevenue(moneymgmt.getMoney(), moneymgmt.getStartMoney()));
    sleep(200);
    console.log("Average revenue per game: " + this.getAverageRevenue(moneymgmt.getMoney(), moneymgmt.getStartMoney()));
    sleep(200);
  }

  reset() {
    this.wins = 0;
    this.losses = 0;
    this.draws = 0;
    this.blackjacks = 0;
  }
}