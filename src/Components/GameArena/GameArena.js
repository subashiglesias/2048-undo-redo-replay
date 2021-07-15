import React, { useState, useEffect } from "react";
import './GameArena.css';
import GameBoard from "../GameBoard/GameBoard";
import Score from "../Score/Score";

const GameArena = () => {
    const [score, updateScore] = useState(0);
    const [bestScore, updateBestScore] = useState(localStorage.getItem('bestScore')|| 0)

    useEffect(() => {
        if(score > bestScore) {
            updateBestScore(score)
            localStorage.setItem('bestScore', score)
        }
    }, [score])

    return (
        <div className="game-arena">
            <div className="game-arena__header">
                <h1>2048</h1>
                <Score type="Score" value={score}/>
                <Score type="Best" value={bestScore}/>
            </div>
            <GameBoard scoreUpdater={updateScore}/>
        </div>
    );
}

export default GameArena;
