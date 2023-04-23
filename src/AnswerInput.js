import React from "react";

export default function AnswerInput(props) {
    
    const enterKey = 13

    function handleSubmit(event) {
        if (event.which === enterKey) {
            event.preventDefault()
            console.log(event.target.value)
            props.checkAnswer(event.target.value)
        }
    }

    return (
        <form>
            <input onKeyDown={handleSubmit}></input>
        </form>
    )
}
