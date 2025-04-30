import fetch from 'isomorphic-fetch';
import React,{useState,useEffect} from 'react';
import { Component } from 'react';
import Row from './Row';
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
    board: ['o','n','n','n','n','n','n','n','n']
  };
}

function checkWin(rows) {
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

  return combos.find(combo => (
    flattened[combo[0]] !== '' &&
    flattened[combo[0]] === flattened[combo[1]] &&
    flattened[combo[1]] === flattened[combo[2]]
  ));
}

function getData(arr) {
    const url = 'http://localhost:8080/minimax';
    let data={board: []};
    let respClone;
    let objResponse = null;
    arr.map(x=>{data.board.push(x)});
    console.log(data.board);
    fetch(url
      ,{
        headers : { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(data),
        method: "POST"
      }
      )
        .then(function(response){
          respClone = response.clone();
		      return response.json();
        })
        .catch(error => {
          respClone.text()
          .then(function extractJSON(text) {
            const regex = /{.*?}/g;
            const matches = text.match(regex);

            if (matches) {
              matches.forEach(jsonStr => {
                try {
                  objResponse = JSON.parse(jsonStr)
                  console.log(objResponse.board);
                } catch ({ name, message }) {
                    console.log(name); // "TypeError"
                    console.log(message); // "oops"
                }
              });
          }
            return objResponse;
          })
          .then(function newBoard(obj) {
            //console.log(data.board);
            obj.board.map((item,index)=>{(data.board[index]=='n')?data.board[index]=item:item});
          })
        });
  return {
    board: data.board
  };
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
    winner = checkWin(rows);
    
    //data = { board: ['x','n','n','n','n','n','n','o','n'] };
        
    const oneRows = rows.reduce((acc, val) => acc.concat(val), []);

    let newBoard=[];

    oneRows.map(x=>{((x=='o')||(x=='x'))?newBoard.push(x):newBoard.push('n')})

    board.map((item,index)=>{(item!='n')?newBoard[index]=item:item});

    let updBoard=[];

    newBoard.map((item,index)=>{(item!='n')?updBoard[index]=item:updBoard[index]=''});

    let updRows = transformTo2DArray(updBoard);

    this.setState({
      rows:updRows,
      turn,
      winner,
      board:newBoard
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
        <ul>
          {board.map((x,i)=>(<li key={i}>{x}</li>))}
        </ul>
        <button id="reset" onClick={() => this.setState(getInitialState())}>Reset board</button>
        <button id="get" onClick={()=> this.setState(getData(board))}>Get board</button>
        <GameList gameList={gameList} />
      </div>
    );
  }
}

export default App;
