const gridContainer = document.querySelector(".grid-container");
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let score = 0;
let matches = 0; // Track the number of matches made

// Update the score display
document.querySelector(".score").textContent = score;

// Fetch card data and initialize the game
fetch("./data/cards.json")
  .then((res) => res.json())
  .then((data) => {
    cards = [...data, ...data]; // Duplicate cards for matching
    shuffleCards();
    generateCards();
  });

// Shuffle the cards
function shuffleCards() {
  let currentIndex = cards.length;
  while (currentIndex !== 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // Swap the cards
    [cards[currentIndex], cards[randomIndex]] = [cards[randomIndex], cards[currentIndex]];
  }
}

// Generate card elements and add event listeners
function generateCards() {
  for (let card of cards) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.setAttribute("data-name", card.name);
    cardElement.innerHTML = `
      <div class="front">
        <img class="front-image" src="${card.image}" alt="${card.name}"/>
      </div>
      <div class="back"></div>
    `;
    gridContainer.appendChild(cardElement);
    cardElement.addEventListener("click", flipCard);
  }
}

// Flip a card
function flipCard() {
  if (lockBoard || this === firstCard) return;

  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this; // Store the first card
    return;
  }

  secondCard = this; // Store the second card
  lockBoard = true; // Lock the board while checking for matches

  checkForMatch();
}

// Check if the flipped cards match
function checkForMatch() {
  const isMatch = firstCard.dataset.name === secondCard.dataset.name;
  if (isMatch) {
    score += 10; // Points for a match
    matches++; // Increment matches
    document.querySelector(".score").textContent = score;

    // Bonus points for consecutive matches
    if (matches > 1) {
      score += 5 * (matches - 1); // Increase bonus for each consecutive match
    }
    disableCards();
  } else {
    score -= 2; // Deduct points for a mismatch
    document.querySelector(".score").textContent = score;
    unflipCards();
    matches = 0; // Reset matches on a mismatch
  }
}

// Disable matched cards
function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);
  resetBoard();
}

// Unflip cards after a timeout if they don't match
function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetBoard();
  }, 1000);
}

// Reset the board for the next turn
function resetBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

// Restart the game
function restart() {
  resetBoard();
  shuffleCards();
  score = 0;
  matches = 0; // Reset matches
  document.querySelector(".score").textContent = score;
  gridContainer.innerHTML = ""; // Clear existing cards
  generateCards(); // Generate new cards
}

// Add event listener to restart button (if you have one)
const restartButton = document.querySelector(".restart-button");
if (restartButton) {
  restartButton.addEventListener("click", restart);
}
