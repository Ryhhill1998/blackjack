
const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const suits = ["C", "D", "S", "H"];

const valueMap = new Map();

ranks.forEach(rank => {
  if (rank === "A") return valueMap.set(rank, 11);
  if (rank === "J" || rank === "Q" || rank === "K") return valueMap.set(rank, 10);
  return valueMap.set(rank, +rank);
});

console.log(valueMap);

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

class Dealer {
  cards;

  constructor() {
    this.deck = new Deck();
  }

  dealOne() {
    return this.deck.drawCard(1);
  }

  dealTwo() {
    return this.deck.drawCard(2);
  }

  calculateTotal() {
    this.total = this.cards.reduce((sum, card) => {
      return sum + card.value
    }, 0);
    return this.total;
  }

  hit() {
    const [card] = dealer.dealOne();
    this.cards.push(card);
    this.calculateTotal();
    return this;
  }

  stand() {
    return this;
  }
}

const dealer = new Dealer();

class Player {
  cards;
  total;

  calculateTotal() {
    this.total = this.cards.reduce((sum, card) => sum + card.value, 0);
    return this.total;
  }

  hit() {
    const [card] = dealer.dealOne();
    this.cards.push(card);
    this.calculateTotal();
    return this;
  }

  stand() {
    return this;
  }
}

const player = new Player();

class Game {
  constructor() {
    this.playGame();
  }

  dealCards() {
    player.cards = dealer.dealTwo();
    dealer.cards = dealer.dealTwo();
    console.log(player.cards);
  }

  getTotals() {
    player.calculateTotal();
    dealer.calculateTotal();
  }

  playerTurn() {
    let move = (prompt("HIT or STAND?")).toLowerCase();
    while (move !== "stand") {
      player.hit();
      console.log(player.cards);
      if (this.checkBust(player)) this.adjustForAces(player);
      if (this.checkBust(player)) return;
      move = (prompt("HIT or STAND?")).toLowerCase();
    }
  }

  dealerTurn() {
    if (dealer.total < 17) return dealer.hit();
    return dealer.stand();
  }

  checkBust(object) {
    return object.total > 21;
  }

  findAce(cards) {
    return cards.find(card => card.value === 11);
  }

  adjustForAces(object) {
    const ace = this.findAce(player.cards);
    if (!ace) return;
    ace.adjustAceVal();
    return object.calculateTotal();
  }

  playGame() {
    const round = 1;

    this.dealCards();
    this.getTotals();
    this.playerTurn();

    // while (round < 5) {
    //   this.dealCards();
    //   this.getTotals();
    //   this.playerTurn();
    //   this.dealerTurn();
    //   i++
    // }
  }
}

const game = new Game();
