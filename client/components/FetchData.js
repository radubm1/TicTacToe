// Import *useState* and *useEffect*
import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';

const FetchData = (props) => {
  let { board, rows } = props;
    // Create out useEffect function
  useEffect(() => {
    const url = 'http://localhost:8080/minimax';
    let data={board: []};
    let respClone;
    let objResponse = null;

    const flattened = rows.reduce((acc, row) => acc.concat(row), []);
    flattened.map((item)=>{(item=='')?data.board.push('n'):data.board.push(item)});
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
            return data;
          })
          .then(function setBoard(data){
            return data.board.map((item,index)=>board[index]=item);
          })
      })
  },[rows]);

  return (
    <div id="FetchData">
        <ul>
          {board.map((x,i)=>(<li key={i}>{x}</li>))}
        </ul>
    </div>
  );
}

FetchData.propTypes = {
  board: PropTypes.arrayOf(PropTypes.string).isRequired,
  rows: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired
};

export default FetchData;