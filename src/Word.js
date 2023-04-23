import React from "react";
import "./Word.css";

export default function Word(props) {
    
    const displayedWord = props.word.map(w => <div className="alphabet">{w.isRevealed ? w.alphabet : "?"}</div>)

    return (
        displayedWord
    );
}
