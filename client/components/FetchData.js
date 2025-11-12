import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const FetchData = ({ rows }) => {
  const [board, setBoard] = useState(() =>
    rows.flat().map(cell => (cell === '' ? 'n' : cell))
  );

  useEffect(() => {
    const incomingBoard = rows.flat().map(cell => (cell === '' ? 'n' : cell));

    // Detect new user move (difference between incoming and current board)
    const hasNewMove = incomingBoard.some((cell, i) => {
      return board[i] === 'n' && cell !== 'n';
    });

    if (!hasNewMove) return;

    const url = 'http://localhost:8080/minimax';
    const data = { board: incomingBoard };

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => {
        if (!response.ok) throw new Error(`Server error: ${response.status}`);
        return response.json();
      })
      .then(objResponse => {
        const newBoard = board.map((cell, i) =>
          cell === '' || cell === 'n' ? objResponse.board[i] : cell
        );
        setBoard(newBoard);
      })
      .catch(error => {
        console.error('Fetch error:', error.message);
      });
  }, [rows]);

  return (
    <div id="FetchData">
      <ul>
        {board.map((x, i) => (
          <li key={i}>{x}</li>
        ))}
      </ul>
    </div>
  );
};

FetchData.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
};

export default FetchData;
