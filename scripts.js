const cards = document.querySelectorAll(".memory-card");
let clickCounter = 0;

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

let message = "";

let initTimerMin = 10;
let initTimerSec = 0;

let timerMin = 10;
let timerSec = 0;

let isTimerStarted = false;

let totalPairMatched = 0;
let toBeMatchedPairToEndGame = 6;

let timerInterVal;

let isGameOver = false;

let starObtained = 0;

function gameInit() {
    document.getElementById("timer-countdown").innerHTML = "10" + " : " + "00";
    document.getElementById("game-over").style.display = "none";
}
gameInit();

function increaseClickCounterAndShow() {
    clickCounter += 1;
    document.getElementById("click-count-value").innerHTML = clickCounter;
}

function flipCard() {
    if (!isTimerStarted) {
        startTimer();
        isTimerStarted = true;
    }
    if (lockBoard) return;
    increaseClickCounterAndShow();
    if (this === firstCard) return;

    this.classList.add("flip");

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;

        return;
    }

    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;
    isMatch ? disableCardAndShowMatchedMessage() : unflipCards();
}

function disableCardAndShowMatchedMessage() {
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);
    totalPairMatched += 1;
    if (!checkIfGameIsOver(timerMin) &&
        totalPairMatched === toBeMatchedPairToEndGame
    ) {
        document.getElementById("game-over").style.display = "block";
        getStarObtained();
        stopTimer();
        const totalSecToCompleteGame =
            initTimerSec + initTimerMin * 60 - (timerSec + timerMin * 60);
        const timeTaken = formatSeconds(totalSecToCompleteGame);
        document.getElementById(
            "game-over-message"
        ).innerHTML = `Congratulations ! you won. You have obtained ${starObtained} star(s)`;
        document.getElementById(
            "game-over-time"
        ).innerHTML = `Time Taken: ${timeTaken}`;
        return;
    }
    showMessage("HURRAY! Card Matched");
    resetBoard();
}

function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
        firstCard.classList.remove("flip");
        secondCard.classList.remove("flip");

        resetBoard();
    }, 1500);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

(function shuffle() {
    cards.forEach((card) => {
        let randomPos = Math.floor(Math.random() * 12);
        card.style.order = randomPos;
    });
})();

cards.forEach((card) => card.addEventListener("click", flipCard));

function resetButton() {
    location.reload();
}

function showMessage(message) {
    document.getElementById("message").innerHTML = message;
    setTimeout(() => {
        document.getElementById("message").innerHTML = "";
    }, 3000);
}

function startTimer() {
    timerInterVal = setInterval(function() {
        document.getElementById("timer-countdown").innerHTML =
            timerMin + " : " + timerSec;
        checkIfGameIsOver(timerMin);
        if (timerSec == 0) {
            timerMin--;
            timerSec = 60;
        }
        timerSec--;
    }, 1000);
}

function checkIfGameIsOver(min) {
    if (min < 0) {
        stopTimer();
        isGameOver = true;
        document.getElementById("game-over").style.display = "block";
        return true;
    }
}

function stopTimer() {
    clearInterval(timerInterVal);
}

function getStarObtained() {
    if (timerMin >= initTimerMin - 2) {
        starObtained = 5;
    } else if (timerMin >= initTimerMin - 4) {
        starObtained = 4;
    } else if (timerMin >= initTimerMin - 6) {
        starObtained = 3;
    } else if (timerMin >= initTimerMin - 8) {
        starObtained = 2;
    } else {
        starObtained = 1;
    }
}

function formatSeconds(s) {
    let minutes = ~~(s / 60);
    let seconds = ~~(s % 60);
    return minutes + ":" + seconds;
}