import React, { useState, useEffect } from "react";
import './GameArena.css';
import GameBoard from "../GameBoard/GameBoard";
import Score from "../Score/Score";

const GameArena = () => {
    const [score, updateScore] = useState(JSON.parse(localStorage.getItem('score')) || 0);
    const [bestScore, updateBestScore] = useState(localStorage.getItem('bestScore')|| 0)

    useEffect(() => {
        if(score > bestScore) {
            updateBestScore(score)
            localStorage.setItem('bestScore', score)
        }
        localStorage.setItem('score', score)
    }, [score])

    return (
        <div className="game-arena">
            <div className="game-arena__header">
                <h1 className="title">2048</h1>
                <div className="game-arena__score">
                <Score type="SCORE" value={score}/>
                <Score type="BEST" value={bestScore}/>
                </div>
            </div>
            <GameBoard scoreUpdater={updateScore} score={score}/>
        </div>
    );
}

export default GameArena;
