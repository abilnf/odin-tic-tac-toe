function Player(symbol, name, isComputer) {
  return { symbol, name, isComputer }
}

const board = (function () {
  const cells = [null, null, null, null, null, null, null, null, null]

  const place = (player, cell) => {
    if (cells[cell]) return false
    cells[cell] = player
    return true
  }

  const getCell = (cell) => {
    return cells[cell]
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

  return { place, getCell, checkResult }
})()

const uiController = (function () {
  const updateBoard = () => {
    for (let i = 0; i < 9; i++) {
      let player = board.getCell(i)
      if (player) {
        document.getElementById(`${i}`).textContent = player.symbol
      }
    }
  }

  return { updateBoard }
})()

const gameController = (function () {
  let players = [Player('X', 'Nils', false), Player('O', 'Luka', false)]

  let currentMove = 0

  const cellClicked = cell => {
    if (board.place(players[currentMove], cell)) {
      currentMove = currentMove ? 0 : 1
      uiController.updateBoard()

      const winner = board.checkResult()
      if (winner) {
        console.log(winner)
        if (winner === 'TIE') {
        } else {

        }
      }
    }
  }

  return { cellClicked }
})()

document.querySelectorAll('.cell').forEach(button => {
  button.addEventListener('click', e => {
    gameController.cellClicked(button.getAttribute('id'))
  })
})