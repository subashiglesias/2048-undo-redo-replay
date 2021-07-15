import React, { useState, useEffect } from "react";

import {getNewBoard, generateRandom, move, checkWin, isOver} from '../../utils/helpers'
import './GameBoard.css';

const Cell = ({ number }) => {
    return (
        <div className={`cell cell-${number}`}>{number > 0 ? number : ""}</div>
    );
};


const GameBoard = ({scoreUpdater}) => {
    const [board, updateBoard] = useState(generateRandom((getNewBoard())));
    const [history, setHistory] = useState([board]);
    const [actionCount, setActionCount] = useState(0)

    useEffect(() => {
        window.addEventListener("keydown", onKeyDown);

        return () => {
            window.removeEventListener("keydown", onKeyDown);
        };
    });

    const checkEndGame = (final) => {
        if (checkWin(final)) {
            console.log("You win!");
        } else if (isOver(final)) {
            console.log("Game over!");
        }
    };

    const onKeyDown = (e) => {
        switch (e.key) {
            case "ArrowLeft":
                move(board, 'Left', scoreUpdater, updateBoard, setHistory);
                checkEndGame(board)
                break;
            case "ArrowRight":
                move(board, 'Right', scoreUpdater, updateBoard, setHistory);
                checkEndGame(board)
                break;
            case "ArrowUp":
                move(board, 'Up', scoreUpdater, updateBoard, setHistory);
                checkEndGame(board)
                break;
            case "ArrowDown":
                move(board, 'Down', scoreUpdater, updateBoard, setHistory);
                checkEndGame(board)
                break;
            default:
        }

    };

    const undo = () => {
        updateBoard(() => history[history.length - actionCount - 2])
        setActionCount(prevState => prevState+1)
    }

    const redo = () => {
        updateBoard(() => history[history.length - actionCount])
        setActionCount(prevState => prevState-1)
    }

    const replay = () => {
        
    }

    return (
            <div className="game-board">
                {board.map((row, i) => {
                    return (
                        <div key={`row-${i}`} className="row">
                            {row.map((cell, j) => (
                                <Cell key={`cell-${i}-${j}`} number={cell} />
                            ))}
                        </div>
                    );
                })}
                <button type='button' onClick={undo} disabled={actionCount === history.length-1}>Undo</button>
                <button type='button' >Replay</button>
                <button type='button' onClick={redo} disabled={actionCount === 0}>Redo</button>
            </div>
    );
};

export default GameBoard;
