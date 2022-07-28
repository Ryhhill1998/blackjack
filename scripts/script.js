const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const suits = ["C", "D", "S", "H"];

const valueMap = new Map();

ranks.forEach(rank => {
  if (rank === "A") return valueMap.set(rank, 11);
  if (rank === "J" || rank === "Q" || rank === "K") return valueMap.set(rank, 10);
  return valueMap.set(rank, +rank);
});

// --------------- DOM ELEMENTS --------------- //
const hitBtn = document.querySelector(".btn--hit");
const standBtn = document.querySelector(".btn--stand");
const dealBtn = document.querySelector(".btn--deal");

// --------------- CLASSES --------------- //

// card class
class Card {
  value;

  constructor(rank, suit) {
    this.rank = rank;
    this.suit = suit;
    this.imgSrc = `images/${this.suit}/${this.rank}.png`;
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
    for (let i = 0; i < num; i++) {
      if (!this.cards.length) this.createDeck();
      drawnCards.push(this.cards.pop());
    }
    return drawnCards;
  }
}

// player class
class Player {
  cards = [];

  constructor(name) {
    this.name = name;
  }

  calculateTotal() {
    this.total = this.cards.reduce((sum, card) => sum + card.value, 0);
    return this.total;
  }

  displayTotal() {
    document.querySelector(`.value--${this.name}`).innerHTML = this.calculateTotal();
  }

  showCards() {
    const div = document.querySelector(`.cards--${this.name}`);
    div.innerHTML = "";

    this.cards.forEach(card => {
      const html = `
        <div class="card card--${this.name}">
          <img class="card-img" src="${card.imgSrc}">
        </div>
      `;
      div.insertAdjacentHTML("afterbegin", html);
    });

    const sign = this.name === "dealer" ? "-" : "";

    document.querySelectorAll(`.card--${this.name}`).forEach((card, i) => {
      if (i > 0) {
        card.style.position = "absolute";
        card.style.transform = `translateX(${sign}${(i * 30)}px)`;
      }
    });

    this.displayTotal();
  }

  addCard(dealer) {
    const card = dealer.dealOne();
    this.cards.push(card);
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

  clearCards() {
    this.cards = [];
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
    this.createPlayers();
    hitBtn.addEventListener("click", this.hit.bind(this));
    standBtn.addEventListener("click", this.stand.bind(this));
  }

  createPlayers() {
    this.dealer = new Dealer("dealer");
    this.player = new Player("player");
  }

  dealCards() {
    this.player.cards = this.dealer.dealTwo();
    this.player.showCards();
    this.dealer.cards = this.dealer.dealTwo();
    this.dealer.showCards();
  }

  dealerTurn() {
    while (this.dealer.total < 17) {
      this.dealer.addCard(this.dealer);
    }
  }

  checkWinner() {
    if (this.player.total === this.dealer.total) return "DRAW";
    if (this.player.total > this.dealer.total || this.dealer.checkBust()) return this.player.name;
    return this.dealer.name;
  }

  endRound(result) {
    this.gameOn = false;
    this.disableButtons();
    if (result === "DRAW") {
      console.log("DRAW");
      return;
    }
    console.log(`${result} wins!`);
    this.disableButtons();
  }

  reset() {
    this.dealer.clearCards();
    this.player.clearCards();
  }

  enableButtons() {
    dealBtn.disabled = true;
    hitBtn.disabled = false;
    standBtn.disabled = false;
  }

  disableButtons() {
    dealBtn.disabled = false;
    hitBtn.disabled = true;
    standBtn.disabled = true;
  }

  hit() {
    this.player.addCard(this.dealer);
    if (this.player.checkTurnOver()) this.endRound(this.dealer.name);
  }

  stand() {
    this.disableButtons();
    if (!this.gameOn) return;
    this.dealerTurn();
    this.endRound(this.checkWinner());
  }

  startGame() {
    this.reset();
    this.gameOn = true;
    this.dealCards();
    this.enableButtons();
  }
}

const game = new Game();

dealBtn.addEventListener("click", e => {
  game.startGame(e);
});
