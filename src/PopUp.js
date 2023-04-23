import React from "react";
import "./PopUp.css";

export default function PopUp(props) {
    return (
        <div className={`bubbleMessage ${props.gameState !== '' ? "active" : ''}`}>
            {props.gameState === "Won" ? "Congratulations, you won!" : "Sorry, you lost"}
        </div>
    )
}