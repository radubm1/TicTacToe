import fetch from 'isomorphic-fetch';
import { Component } from 'react';
import React from 'react';
import Row from './Row';
import FetchData from './FetchData';
import GameList from './GameList';

let gameStore = [];

function getInitialState() {
  return {
    rows: [
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ],
    turn: 'o',
    winner: undefined,
    gameList: gameStore,
    board: ['n','n','n','n','n','n','n','n','n']
  };
}

function checkWin(rows,board,app) {
  let { setState } = app.state;
  const combos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 4, 8],
    [2, 4, 6],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
  ];

  const flattened = rows.reduce((acc, row) => acc.concat(row), []);

  //app.setState(getData(flattened));
  app.setState(updateState(rows,board));

  return combos.find(combo => (
    flattened[combo[0]] !== '' &&
    flattened[combo[0]] === flattened[combo[1]] &&
    flattened[combo[1]] === flattened[combo[2]]
  ));
  
}

function transformTo2DArray(arr) {
  let rows = [];
  arr.forEach((item, index) => {
    if (index % 3 === 0) rows.push([]);
      rows[rows.length - 1].push(item);
    });
  //console.log(result);
  return rows;
}

function updateState(rows,board){
  let newBoard=[];
  let updBoard=[];
  const oneRows = rows.reduce((acc, val) => acc.concat(val), []);
  oneRows.map(x=>{((x=='o')||(x=='x'))?newBoard.push(x):newBoard.push('n')})
  board.map((item,index)=>{(item!='n')?newBoard[index]=item:item});
  newBoard.map((item,index)=>{(item!='n')?updBoard[index]=item:updBoard[index]=''});
  let updRows = transformTo2DArray(updBoard);
  return {
      rows:updRows,
      board:newBoard,
  };  
}

class App extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = getInitialState();
  }

  handleClick(row, square) {
    let { turn, winner } = this.state;
    let { board, setData } = this.state;
    let { rows } = this.state;
    const squareInQuestion = rows[row][square];

    if (this.state.winner) return;
    if (squareInQuestion) return;

    rows[row][square] = turn;
    turn = 'o';//turn === 'x' ? 'o' : 'x';
    winner = checkWin(rows,board,this);
    
    //data = { board: ['x','n','n','n','n','n','n','o','n'] };
    
    this.setState({
      turn,
      winner
    });
    
    //console.log(board);
  }

  render() {
    const {board, state, setState} = this.state;
    const {rows, turn, winner, gameList} = this.state;
    const handleClick = this.handleClick;

    const rowElements = rows.map((letters, i) => (
      <Row key={i} row={i} letters={letters} handleClick={handleClick} />
    ));

    let infoDiv;
    if (winner) {
      let winTurn = turn === 'x' ? 'o' : 'x';
      infoDiv = (
        <div>
          <div>Player {winTurn} wins with squares {winner.join(', ')}!</div>
        </div>
      );
    } else {
      infoDiv = <div>Turn: {turn}</div>;
    }

    return (
      <div>
        {infoDiv}
        <div id="board">
          {rowElements}
        </div>
        <FetchData rows={rows} board={board}/>
        <button id="reset" onClick={() => this.setState(getInitialState())}>Reset board</button>
        <button id="refresh" onClick={() => this.setState(updateState(rows,board))}>Refresh board</button>
        <GameList gameList={gameList} />
      </div>
    );
  }
}

export default App;
