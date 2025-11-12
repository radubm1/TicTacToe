import React, { Component } from 'react';
import Row from './Row';
import GameList from './GameList';

class FetchData extends Component {
  constructor(props) {
    super(props);
    this.loopUntilStable = this.loopUntilStable.bind(this);
  }

  componentDidUpdate(prevProps) {
    const prevFlat = prevProps.rows.reduce((acc, row) => acc.concat(row), []).map(cell => (cell === '' ? 'n' : cell));
    const currFlat = this.props.rows.reduce((acc, row) => acc.concat(row), []).map(cell => (cell === '' ? 'n' : cell));

    const userMoved = currFlat.some((cell, i) => prevFlat[i] === 'n' && cell !== 'n');

    if (userMoved && this.props.turn === 'x') {
      this.loopUntilStable(this.props.rows);
    }
  }

  loopUntilStable(rows) {
    if (!rows || !Array.isArray(rows)) return;

    const flatBoard = rows.reduce((acc, row) => acc.concat(row), []).map(cell => (cell === '' ? 'n' : cell));
    const url = 'http://localhost:8080/minimax';
    const data = { board: flatBoard };

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => {
        if (!response.ok) throw new Error('Server error: ' + response.status);
        return response.json();
      })
      .then(result => {
        const newBoard = flatBoard.map((cell, i) => (cell === 'n' ? result.board[i] : cell));
        const changed = newBoard.some((cell, i) => cell !== flatBoard[i]);

        if (changed) {
          this.props.onServerUpdate(newBoard);
        }
      })
      .catch(error => {
        console.error('Fetch error:', error.message);
      });
  }

  render() {
    return null;
  }
}

function transformTo2DArray(arr) {
  const rows = [];
  arr.forEach((item, index) => {
    if (index % 3 === 0) rows.push([]);
    rows[rows.length - 1].push(item);
  });
  return rows;
}

function checkWin(rows) {
  const combos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 4, 8], [2, 4, 6],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
  ];
  const flat = rows.reduce((acc, row) => acc.concat(row), []);
  return combos.find(([a, b, c]) => flat[a] && flat[a] === flat[b] && flat[b] === flat[c]);
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
    this.handleClick = this.handleClick.bind(this);
    this.updateBoardFromServer = this.updateBoardFromServer.bind(this);
  }

  getInitialState() {
    return {
      rows: [['', '', ''], ['', '', ''], ['', '', '']],
      turn: 'o',
      winner: undefined,
      gameList: [],
      board: ['n','n','n','n','n','n','n','n','n'],
    };
  }

  handleClick(row, square) {
    const { rows, turn, winner } = this.state;
    if (winner || rows[row][square]) return;

    const newRows = rows.map(r => r.slice());
    newRows[row][square] = turn;

    const newBoard = newRows.reduce((acc, row) => acc.concat(row), []).map(cell => (cell === '' ? 'n' : cell));
    const winCombo = checkWin(newRows);

    this.setState({
      rows: newRows,
      board: newBoard,
      turn: 'x',
      winner: winCombo,
    });
  }

  updateBoardFromServer(serverBoard) {
    const updatedRows = transformTo2DArray(serverBoard.map(cell => (cell === 'n' ? '' : cell)));
    const winCombo = checkWin(updatedRows);

    this.setState({
      board: serverBoard,
      rows: updatedRows,
      turn: 'o',
      winner: winCombo || this.state.winner,
    });
  }

  render() {
    const { rows, turn, winner, board, gameList } = this.state;

    const rowElements = rows.map((letters, i) => (
      <Row key={i} row={i} letters={letters} handleClick={this.handleClick} />
    ));

    const infoDiv = winner
      ? <div>Player {turn === 'x' ? 'o' : 'x'} wins with squares {winner.join(', ')}!</div>
      : <div>Turn: {turn}</div>;

    return (
      <div>
        {infoDiv}
        <div id="board">{rowElements}</div>
        <FetchData
          board={board}
          rows={rows}
          turn={turn}
          onServerUpdate={this.updateBoardFromServer}
        />
        <button id="reset" onClick={() => this.setState(this.getInitialState())}>Reset board</button>
        <GameList gameList={gameList} />
      </div>
    );
  }
}

export default App;
