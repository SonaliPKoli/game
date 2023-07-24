let blackjackGame = {
  you: { scoreSpan: "#your-blackjack-result", div: "#your-box", score: 0 },
  dealer: {
    scoreSpan: "#dealer-blackjack-result",
    div: "#dealer-box",
    score: 0,
  },
  cards: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "K", "J", "Q", "A"],
  cardMap: {
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
    K: 10,
    J: 10,
    Q: 10,
    A: [1, 11],
  },
  wins: 0,
  losses: 0,
  draws: 0,
  isStand: false,
  turnOver: false,
};
const YOU = blackjackGame["you"];
const DEALER = blackjackGame["dealer"];
const hitSound = new Audio("sounds/swish.mp3");
const winSound = new Audio("sounds/cash.mp3");
const lossSound = new Audio("sounds/aww.mp3");
document
  .querySelector("#blackjack-hit-button")
  .addEventListener("click", blackjackHit);
document
  .querySelector("#blackjack-stand-button")
  .addEventListener("click", dealerLogic);

document
  .querySelector("#blackjack-deal-button")
  .addEventListener("click", blackjackDeal);
function blackjackHit(params) {
  if (blackjackGame["isStand"] == false) {
    let card = randomCard();
    showCard(YOU, card);
    updateScore(card, YOU);
    showScore(YOU);
  }
}
function showCard(activePlayer, card) {
  if (activePlayer["score"] <= 21) {
    let cardImage = document.createElement("img");
    cardImage.src = `images/${card}.png`;
    document.querySelector(activePlayer["div"]).appendChild(cardImage);
    hitSound.play();
  }
}
function blackjackDeal() {
  //showResult(computeWinner());
  if (blackjackGame["turnOver"] === true) {
    blackjackGame["isStand"] = false;
    let yourImages = document
      .querySelector("#your-box")
      .querySelectorAll("img");
    let dealerImages = document
      .querySelector("#dealer-box")
      .querySelectorAll("img");
    for (let i = 0; i < yourImages.length; i++) {
      yourImages[i].remove();
    }
    for (let i = 0; i < dealerImages.length; i++) {
      dealerImages[i].remove();
    }
    YOU["score"] = 0;
    DEALER["score"] = 0;
    document.querySelector("#your-blackjack-result").textContent = 0;
    document.querySelector("#dealer-blackjack-result").textContent = 0;
    document.querySelector("#your-blackjack-result").style.color = "#ffffff";
    document.querySelector("#dealer-blackjack-result").style.color = "#ffffff";
    document.querySelector("#blackjack-result").textContent = "Let's play";
    document.querySelector("#blackjack-result").style.color = "black";
    blackjackGame["turnOver"] = false;
  }
}
function randomCard() {
  let randomIndex = Math.floor(Math.random() * 13);
  return blackjackGame["cards"][randomIndex];
}

function updateScore(card, activePlayer) {
  if (card === "A") {
    // If adding 11 doesn't bust, use 11. Otherwise, use 1.
    if (activePlayer["score"] + blackjackGame["cardMap"][card][1] <= 21) {
      activePlayer["score"] += blackjackGame["cardMap"][card][1];
    } else {
      activePlayer["score"] += blackjackGame["cardMap"][card][0];
    }
  } else {
    activePlayer["score"] += blackjackGame["cardMap"][card];
  }
}

function showScore(activePlayer) {
  if (activePlayer["score"] > 21) {
    document.querySelector(activePlayer["scoreSpan"]).textContent = "BUST!";
    document.querySelector(activePlayer["scoreSpan"]).style.color = "red";
  } else {
    document.querySelector(activePlayer["scoreSpan"]).textContent =
      activePlayer["score"];
  }
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function dealerLogic() {
  blackjackGame["isStand"] = true;
  while (DEALER["score"] < 16 && blackjackGame["isStand"] === true) {
    let card = randomCard();
    showCard(DEALER, card);
    updateScore(card, DEALER);
    showScore(DEALER);
    await sleep(1000);
  }

  blackjackGame["turnOver"] = true;
  showResult(computeWinner());
}
//compute winner and return who just won
//update the wins,losses,draws
function computeWinner() {
  let winner;

  // If both players have scores greater than 21, it's a draw.
  if (YOU["score"] > 21 && DEALER["score"] > 21) {
    return "draw";
  }

  // If either player has a score greater than 21, the other player wins.
  if (YOU["score"] > 21) {
    winner = DEALER;
  } else if (DEALER["score"] > 21) {
    winner = YOU;
  } else {
    // Both players have scores less than or equal to 21, so determine the winner.
    if (YOU["score"] > DEALER["score"]) {
      winner = YOU;
    } else if (DEALER["score"] > YOU["score"]) {
      winner = DEALER;
    } else {
      winner = "draw";
    }
  }

  return winner;
}

function showResult(winner) {
  let message, messageColor;
  if (blackjackGame["turnOver"] === true) {
    if (winner == YOU) {
      blackjackGame["wins"]=blackjackGame["wins"]+1;
      document.querySelector("#wins").textContent = blackjackGame["wins"];
      message = "YOU wON!";
      
      messageColor = "GREEN";
      winSound.play();
    } else if (winner == DEALER) {
      blackjackGame["losses"]=blackjackGame["losses"]+1;
      document.querySelector("#losses").textContent = blackjackGame["losses"];
      message = "YOU LOST";
      messageColor = "red";
      lossSound.play();
    } else {
      blackjackGame["draws"]=blackjackGame["draws"]+1;
      document.querySelector("#draws").textContent = blackjackGame["draws"];
      message = "YOU DREW!";
      messageColor = "BLACK";
    }
    document.querySelector("#blackjack-result").textContent = message;
    document.querySelector("#blackjack-result").style.color = messageColor;
  }
}
