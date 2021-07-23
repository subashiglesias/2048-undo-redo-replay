import React, {useState, useEffect} from "react";

import {getNewBoard, generateRandom, move, checkWin, isOver} from '../../utils/helpers';
import undoImage from './../../images/undo.svg'
import redoImage from './../../images/redo.svg'
import replayImage from './../../images/replay.svg'
import newImage from './../../images/new.svg'
import './GameBoard.css';

const Cell = ({number}) => {
    return (
        <div className={`cell cell-${number}`}>{number > 0 ? number : ""}</div>
    );
};


const GameBoard = ({scoreUpdater, score}) => {
    const [board, updateBoard] = useState(JSON.parse(localStorage.getItem('board')) || generateRandom((getNewBoard())));
    const [history, setHistory] = useState(JSON.parse(localStorage.getItem('history')) || {
        board: [board],
        score: [score]
    });
    const [actionCount, setActionCount] = useState(0);
    const [replayAction, setReplayAction] = useState(0);

    useEffect(() => {
        if (history.board.length > 1) {
            updateBoard(history.board[history.board.length - 1])
            scoreUpdater(history.score[history.score.length - 1])
        }
    }, [])

    useEffect(() => {
        localStorage.setItem("board", JSON.stringify(board))
    }, [board])

    useEffect(() => {
        localStorage.setItem("history", JSON.stringify(history))
    }, [history])

    useEffect(() => {
        window.addEventListener("keydown", onKeyDown);

        return () => {
            window.removeEventListener("keydown", onKeyDown);
        };
    });

    const checkEndGame = (final) => {
        if (checkWin(final)) {
            if(window.confirm("You won!! \n would you like to start again ?")) {
                newGame();
            }
        } else if (isOver(final)) {
            if(window.confirm("Game over!! \n would you like to start again ?")) {
                newGame();
            }
        }
    };

    const cleanUpActions = () => {
        if (actionCount) {
            setHistory(prevState => {
                let newHis = Object.assign([], prevState.board);
                let newScore = Object.assign([], prevState.score)
                newHis.length = history.board.length - actionCount;
                newScore.length = history.score.length - actionCount;
                return {...prevState, board: newHis, score: newScore}
            })
            setActionCount(0)
        }
    }

    const onKeyDown = (e) => {
        if(!replayAction)
        switch (e.key) {
            case "ArrowLeft":
                cleanUpActions();
                move(board, 'Left', scoreUpdater, score, setHistory, updateBoard);
                checkEndGame(board);
                break;
            case "ArrowRight":
                cleanUpActions()
                move(board, 'Right', scoreUpdater, score, setHistory, updateBoard);
                checkEndGame(board);
                break;
            case "ArrowUp":
                cleanUpActions();
                move(board, 'Up', scoreUpdater, score, setHistory, updateBoard);
                checkEndGame(board);
                break;
            case "ArrowDown":
                cleanUpActions();
                move(board, 'Down', scoreUpdater, score, setHistory, updateBoard);
                checkEndGame(board)
                break;
            default:
        }

    };

    const undo = () => {
        updateBoard(() => history.board[history.board.length - actionCount - 2])
        scoreUpdater(() => history.score[history.board.length - actionCount - 2])
        setActionCount(prevState => prevState + 1)
    }

    const redo = () => {
        updateBoard(() => history.board[history.board.length - actionCount])
        scoreUpdater(() => history.score[history.board.length - actionCount])
        setActionCount(prevState => prevState - 1)
    }

    const replay = () => {
        setReplayAction(() => 1)
        for (let i = 0; i < history.board.length; i++) {
            setTimeout(() => {
                updateBoard(() => history.board[i]);
                scoreUpdater(() => history.score[i]);
                if (i === history.board.length - 1) setReplayAction(() => 0)
            }, i * 2 * 1000)
        }

    }

    const newGame = () => {
        setHistory(prevState => {
            let newHis = Object.assign([], prevState.board);
            let newScore = Object.assign([], prevState.score)
            newHis.length = 1;
            newScore.length = 1;
            return {...prevState, board: newHis, score: newScore}
        })
        updateBoard(() => history.board[0]);
        scoreUpdater(() => history.score[0]);
    }

    return (
        <div className="game-board">
            <p className="game-arena__description">Join the numbers and get to <b>2048</b> tile!</p>
            <button ><img height={8} className={replayAction ? 'new disabled' : 'new'}  src={newImage} alt={'newGame'} onClick={newGame}/></button>
            <div className="game-board__area">
                {board.map((row, i) => {
                    return (
                        <div key={`row-${i}`} className="row">
                            {row.map((cell, j) => (
                                <Cell key={`cell-${i}-${j}`} number={cell}/>
                            ))}
                        </div>
                    );
                })}
            </div>
            <div className="game-board__controls">
                <button><img className={(actionCount === history.board.length - 1 || replayAction) ? 'disabled' : ''}
                    src={undoImage} alt={'undo'} onClick={undo}/></button>
                <button><img className={(history.board.length === 1) ? 'disabled' : ''} src={replayImage} alt={'replay'} onClick={replay}/></button>
                <button><img className={(actionCount === 0 || replayAction) ? 'disabled' : ''} src={redoImage}
                                                                                         alt={'redo'} onClick={redo}/></button>
            </div>
        </div>
    );
};

export default GameBoard;
