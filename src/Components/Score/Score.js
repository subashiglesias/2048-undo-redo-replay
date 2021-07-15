import React from "react";
import './Score.css';

const Score = ({type, value}) => {
    return (
        <div className="score">
            <h5>{type}</h5>
            <h4>{value}</h4>
        </div>
    );
}

export default Score;
