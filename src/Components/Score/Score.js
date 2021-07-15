import React from "react";
import './Score.css';

const Score = ({type, value}) => {
    return (
        <div className="score">
            <h3>{type}</h3>
            <h2>{value}</h2>
        </div>
    );
}

export default Score;
