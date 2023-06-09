'use strict';

const mainBoard = document.querySelector('.main-board');
const cells = document.querySelectorAll('.cell');
const playerScoreDisplay = document.querySelector('.player-score');
const tieScoreDisplay = document.querySelector('.tie-score');
const computerScoreDisplay = document.querySelector('.computer-score');

const Board = function () {
  let gameboard = Array(9).fill(null);

  const getBoard = () => gameboard;

  const setBoard = (playerTurn, location) => {
    if (location < 0
      || location > 8
      || gameboard[location] !== null) return false;

    const token = playerTurn ? 'X' : 'O';
    gameboard = gameboard.map((square, i) => {
      return (i === location) ? token : square;
    });

    return true;
  };

  const reset = () => {
    gameboard = Array(9).fill(null);
    cells.forEach((cell) => {
      cell.classList.remove('blinking');
      cell.firstElementChild.classList.remove('animate');
    })
    playerScoreDisplay.classList.remove('animate');
    computerScoreDisplay.classList.remove('animate');
    tieScoreDisplay.classList.remove('animate');
  };

  return {
    getBoard,
    setBoard,
    reset,
  }
};

const GameController = (function (board) {
  let isPlaying = true;
  let isSleeping = false;
  let isPlayerTurn = true;
  let playerScore = 0;
  let computerScore = 0;
  let tie = 0;
  let winner;
  let cellIndexes;

  const displayBoard = function (loc = null) {
    const currentBoard = board.getBoard();

    cells.forEach((cell, i) => {
      cell.firstElementChild.textContent = currentBoard[i];
    });

    animateCell();

    playerScoreDisplay.textContent = playerScore;
    tieScoreDisplay.textContent = tie;
    computerScoreDisplay.textContent = computerScore;

    function animateCell() {
      if (loc !== null) {
        cells[loc].firstElementChild.classList.add('animate');
      }
    }
  }

  const newGame = function (playerTurn = true) {
    isPlaying = true;
    isPlayerTurn = playerTurn;
    resetGame();
    board.reset();
    displayBoard();
  }

  const resetGame = function () {
    isPlaying = true;
    isPlayerTurn = playerTurn;
    playerScore = 0;
    computerScore = 0;
    tie = 0;
  }

  const getTurn = () => isPlayerTurn ? 'Player' : 'Computer';

  const makeMove = function (location) {
    if (!board.setBoard(isPlayerTurn, location)) return false;

    displayBoard(location);

    isPlayerTurn = !isPlayerTurn;

    [winner, ...cellIndexes] = checkForWinner(board.getBoard());

    if (winner) {
      if (winner === 'X') {
        ++playerScore;
        playerScoreDisplay.classList.add('animate');
      } else {
        ++computerScore;
        computerScoreDisplay.classList.add('animate');
      }
      isPlaying = false;
      animateMatchedCells(cellIndexes);
      displayBoard();
      return;
    } else if (!board.getBoard().includes(null)) {
      ++tie;
      tieScoreDisplay.classList.add('animate');
      isPlaying = false;
      displayBoard();
      return;
    }

    return true;
  }

  const nextRound = function () {
    isPlaying = true;
    board.reset();
    displayBoard();
    if (GameController.getTurn() === 'Computer') computerMove();
  }

  function checkForWinner(cells) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
        return [cells[a], a, b, c];
      }
    }
    return [null];
  }

  function animateMatchedCells([a, b, c]) {
    cells[a].classList.add('blinking');
    cells[b].classList.add('blinking');
    cells[c].classList.add('blinking');
  }

  return {
    newGame,
    getTurn,
    makeMove,
    nextRound,
    resetGame,
    isPlaying: () => isPlaying,
    getBoard: () => board.getBoard(),
    getIsSleeping: () => isSleeping,
    setIsSleeping: (value) => isSleeping = value,
  }
})(Board());


mainBoard.addEventListener('click', handleClick);

function handleClick(e) {
  if (!GameController.isPlaying()) {
    GameController.nextRound();
    return;
  };
  if (!e.target.matches('.cell')) return;
  if (GameController.getIsSleeping()) {
    e.stopPropagation();
    return;
  };

  const moveSuccessAndIsPlaying =
    GameController.makeMove(parseInt(e.target.dataset.cellId, 10))
    && GameController.isPlaying();

  if (moveSuccessAndIsPlaying) {
    computerMove();
  }
}

function computerMove() {
  GameController.setIsSleeping(true);
  move();

  function move() {
    setTimeout(() => {
      const availableMoves = GameController.getBoard().reduce(
        (moves, v, i) => v === null ? [...moves, i] : moves, []
      );
      const location = availableMoves[Math.floor(Math.random() * availableMoves.length)];
      GameController.makeMove(parseInt(location, 10));
      GameController.setIsSleeping(false);
    }, 650);
  }
}