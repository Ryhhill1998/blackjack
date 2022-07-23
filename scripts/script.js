
const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const suits = ["C", "D", "S", "H"];

const valueMap = new Map();

ranks.forEach(rank => {
  if (rank === "A") return valueMap.set(rank, 11);
  if (rank === "J" || rank === "Q" || rank === "K") return valueMap.set(rank, 10);
  return valueMap.set(rank, +rank);
});

// --------------- CLASSES --------------- //

// card class
class Card {
  value;

  constructor(rank, suit) {
    this.rank = rank;
    this.suit = suit;
    this.setValue();
  }

  setValue() {
    this.value = valueMap.get(this.rank);
  }

  adjustAceVal() {
    this.value = 1;
  }
}

// deck class
class Deck {
  constructor() {
    this.cards = [];
    this.createDeck();
  }

  createDeck() {
    ranks.forEach(rank => {
      suits.forEach(suit => {
        const card = new Card(rank, suit);
        this.cards.push(card);
      });
    });
    this.shuffleDeck();
  }

  shuffleDeck() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  drawCard(num) {
    const drawnCards = [];
    for (let i = 0; i < num; i++) drawnCards.push(this.cards.pop());
    return drawnCards;
  }
}

// player class
class Player {
  cards;

  constructor(name) {
    this.name = name;
  }

  calculateTotal() {
    this.total = this.cards.reduce((sum, card) => sum + card.value, 0);
    return this.total;
  }

  showCards() {
    let output = `${this.name}: `;
    this.cards.forEach(card => {
      output += `${card.rank}${card.suit} `;
    });
    output += `Total = ${this.total}`;
    console.log(output);
  }

  hit(dealer) {
    const card = dealer.dealOne();
    this.cards.push(card);
    this.calculateTotal();
    this.showCards();
  }

  checkBust() {
    return this.total > 21;
  }

  checkForAces() {
    const ace = this.cards.find(card => card.value === 11);
    if (!ace) return false;
    ace.adjustAceVal();
    this.calculateTotal();
    return true;
  }

  checkTurnOver() {
    if (this.checkBust()) {
      if (!this.checkForAces()) return true;
      this.showCards();
    }
    return false;
  }
}

// dealer class - special type of player
class Dealer extends Player {
  constructor(name) {
    super(name);
    this.deck = new Deck();
  }

  dealOne() {
    return this.deck.drawCard(1)[0];
  }

  dealTwo() {
    return this.deck.drawCard(2);
  }
}

// game class
class Game {
  constructor() {
    this.gameOn = true;
    this.createPlayers();
    this.playGame();
  }

  createPlayers() {
    this.dealer = new Dealer("Dealer");
    this.player = new Player("Player");
  }

  dealCards() {
    this.player.cards = this.dealer.dealTwo();
    this.dealer.cards = this.dealer.dealTwo();
  }

  getTotals() {
    this.player.calculateTotal();
    this.dealer.calculateTotal();
  }

  playerTurn() {
    if (this.player.checkTurnOver()) return this.endRound(this.dealer.name);
    let move = prompt("HIT or STAND?").toLowerCase();
    while (move !== "stand") {
      this.player.hit(this.dealer);
      if (this.player.checkTurnOver()) return this.endRound(this.dealer.name);
      move = prompt("HIT or STAND?").toLowerCase();
    }
    return;
  }

  dealerTurn() {
    while (this.dealer.total < 17) {
      this.dealer.hit(this.dealer);
    }
    return;
  }

  checkWinner() {
    if (this.player.total === this.dealer.total) return "DRAW";
    if (this.player.total > this.dealer.total || this.dealer.checkBust()) return this.player.name;
    return this.dealer.name;
  }

  endRound(result) {
    this.gameOn = false;
    if (result === "DRAW") {
      console.log("DRAW");
      return;
    }
    console.log(`${result} wins!`);
  }

  playGame() {
    this.dealCards();
    this.getTotals();
    this.player.showCards();
    this.dealer.showCards();
    this.playerTurn();
    if (!this.gameOn) return;
    this.dealerTurn();
    this.endRound(this.checkWinner());
  }
}

const game = new Game();
