function Player(symbol, name, isAI) {
  return { symbol, name, isAI }
}

const board = (function () {
  let cells = [null, null, null, null, null, null, null, null, null]

  const place = (player, cell) => {
    if (cells[cell]) return false
    cells[cell] = player
    return true
  }

  const getCell = (cell) => {
    return cells[cell]
  }

  const clear = () => {
    cells = [null, null, null, null, null, null, null, null, null]
  }

  const checkResult = () => {
    function checkRow(row) {
      let last = null;
      for (let i = 0; i < 3; i++) {
        const current = cells[row * 3 + i]
        if (!current || (last && last !== current)) {
          return null
        }
        last = current
      }
      return last
    }

    function checkColumn(column) {
      let last = null;
      for (let i = 0; i < 3; i++) {
        const current = cells[i * 3 + column]
        if (!current || (last && last !== current)) {
          return null
        }
        last = current
      }
      return last
    }

    function checkDiagonals(direction) {
      let last = null;
      for (let i = 0; i < 3; i++) {
        let row = i
        let column = direction ? i : 2 - i
        const current = cells[row * 3 + column]
        if (!current || (last && last !== current)) {
          return null
        }
        last = current
      }
      return last
    }

    for (let i = 0; i < 3; i++) {
      let winner = checkRow(i) || checkColumn(i) || (i < 2 ? checkDiagonals(i) : null)
      if (winner) return winner
    }

    if (cells.reduce((result, current) => result && current, true)) return 'tie'
  }

  return { place, getCell, checkResult, clear }
})()

const uiController = (function () {
  const updateBoard = () => {
    for (let i = 0; i < 9; i++) {
      let player = board.getCell(i)
      document.getElementById(`${i}`).textContent = player ? player.symbol : ''
    }
  }

  const getPlayerName = player => {
    return document.querySelector(`#playername${player}`).value
  }

  const getBeginner = () => {
    return document.querySelector(`#playerstart1`).checked ? 0 : 1
  }

  const showWinner = winner => {
    if (winner === 'tie') {
      document.querySelector('#winnername').textContent = `It's a tie!`
    } else {
      document.querySelector('#winnername').textContent = `${winner.name} Won! Congrats!`
    }
    document.querySelector('.modal-container').classList.toggle('modal-container--hidden')
  }

  const isAI = player => {
    return document.querySelector(`#playerai${player}`).checked ? 0 : 1
  }

  return { updateBoard, getPlayerName, getBeginner, showWinner, isAI }
})()

const gameController = (function () {
  let players = [Player('X', 'Nils', false), Player('O', 'Luka', false)]

  let currentMove = 0

  const cellClicked = cell => {
    if (board.checkResult()) return
    if (board.place(players[currentMove], cell)) {
      currentMove = currentMove ? 0 : 1
      uiController.updateBoard()

      const winner = board.checkResult()
      if (winner) {
        uiController.showWinner(winner)
      }
    }
  }

  const start = () => {
    board.clear()
    uiController.updateBoard()
    for (let i = 0; i < 2; i++) {
      players[i].name = uiController.getPlayerName(i + 1)
      players[i].isAI = uiController.isAI(i + 1)
    }
    currentMove = uiController.getBeginner()
  }

  return { cellClicked, start }
})()

document.querySelectorAll('.cell').forEach(button => {
  button.addEventListener('click', e => {
    gameController.cellClicked(button.getAttribute('id'))
  })
})

document.querySelector('#start').addEventListener('click', e => {
  gameController.start()
})

document.querySelector('.modal-container').addEventListener('click', function (e) {
  this.classList.toggle('modal-container--hidden')
})

window.addEventListener('load', e => {
  document.querySelector('body').classList.toggle('preload')
})

gameController.start()