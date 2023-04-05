'use strict';

const Board = function () {
  let gameboard = Array(9).fill(null);

  const getBoard = () => gameboard;

  const setBoard = (playerTurn, location) => {
    if (location < 0
      || location > 8
      || gameboard[location]) return false;

    const token = playerTurn ? 'X' : 'O';
    gameboard = gameboard.map((square, i) => {
      return (i === location) ? token : square;
    });

    return true;
  };

  const reset = () => {
    gameboard = Array(9).fill(null);
  };

  return {
    getBoard,
    setBoard,
    reset,
  }
};

const GameController = (function (board) {
  let isPlayerTurn;
  let playerScore = 0;
  let computerScore = 0;
  let round = 1;
  let winner;

  const displayBoard = function () {
    console.log('Round: ' + round);
    console.log('Player Score: ' + playerScore, 'Computer Score: ' + computerScore);
    const currentBoard = board.getBoard();
    console.log(currentBoard[0], currentBoard[1], currentBoard[2]);
    console.log(currentBoard[3], currentBoard[4], currentBoard[5]);
    console.log(currentBoard[6], currentBoard[7], currentBoard[8]);
  }

  const newGame = function (playerTurn = true) {
    isPlayerTurn = playerTurn;
    playerScore = 0;
    computerScore = 0;
    round = 1;
    board.reset();
    displayBoard();
  }

  const getTurn = () => isPlayerTurn ? 'Player' : 'Computer';

  const makeMove = function (location) {
    if (!board.setBoard(isPlayerTurn, location)) return;

    displayBoard();

    winner = checkForWinner(board.getBoard());
    if (winner) {
      console.log('winner is ' + winner);
      if (winner === 'X') {
        ++playerScore;
      } else {
        ++computerScore;
      }
      return;
    } else if (!board.getBoard().includes(null)) {
      console.log('It\'s a tie');
      return;
    }

    isPlayerTurn = !isPlayerTurn;
  }

  const nextRound = function () {
    isPlayerTurn = winner === 'X' ? false : true;
    ++round;
    board.reset();
    displayBoard();
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
        return cells[a];
      }
    }
    return null;
  }

  return {
    newGame,
    getTurn,
    makeMove,
    nextRound,
  }
})(Board());
