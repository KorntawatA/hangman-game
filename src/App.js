import React from "react";
import "./App.css";
import "./Word.css";

import PopUp from "./PopUp";
import Word from "./Word";

export default function App() {
  
  const wins = parseInt(localStorage.getItem("wins"))
  const losses = parseInt(localStorage.getItem("losses"))
  const [stats, setStats] = React.useState(
    {
      wins: isNaN(wins) ? 0 : wins,
      losses: isNaN(losses) ? 0 : losses
    }
  )
  
  // An array of objects containing each letter of a word and which has been revealed
  const [wordData, setWordData] = React.useState([])
  const [input, setInput] = React.useState('')
  // The letter that was submitted (used for the bouncing animation)
  const [currAlphabet, setCurrAlphabet] = React.useState('')
  const [usedAlphabets, setUsedAlphabets] = React.useState([])
  const [attempts, setAttempts] = React.useState(7)
  const [round, setRound] = React.useState(1)
  const [gameState, setGameState] = React.useState('')

  React.useEffect(() => {
    fetch("https://random-word.ryanrk.com/api/en/word/random")
    .then(response => response.json())
    .then(jsonData => JSON.stringify(jsonData).toLowerCase().replace(/[^a-zA-Z-]+/g, '').split(''))
    .then(wordRevealed => setWordData(wordRevealed.map(w => {
      return {
        alphabet: w,
        isRevealed: w === '-' ? true : false
      }
    })))
  }, [round])
  //console.log(wordData)

  function handleChange(event) {
    setInput(event.target.value.replace(/[^a-zA-Z]+/g, '').toLowerCase())
  }

  const enterKey = 13
  function handleSubmit(event) {
    if (event.which === enterKey) {
        event.preventDefault()
        if (event.target.value.length > 0) {
          checkAnswer(event.target.value)
          setInput('')
        }
    }
  }

  function checkAnswer(answer) {
    if (!usedAlphabets.includes(answer)) {
      setUsedAlphabets(u => [...u, answer].sort())
      if (!wordData.some(w => w.alphabet === answer) && attempts > 0) {
        setAttempts(a => a - 1)
      }
    }
    if (attempts > 0) {
      setWordData(word => word.map(w => w.alphabet === answer ? {...w, isRevealed: true} : w))
    }
    setCurrAlphabet(answer)
  }
  const renderedUsedAlphabets = usedAlphabets.map(u => {
    return <div className={`alphabet ${u === currAlphabet ? "entered-alphabet" : ''}`}>{u}</div>
  })

  React.useEffect(() => {
    if (wordData.length > 0 && wordData.every(w => w.isRevealed === true)) {
      setGameState("Won")
      setStats(s => {
        return {...s, wins: s.wins + 1}
      })
      
    } else if (attempts === 0) {
      setGameState("Lost")
      setStats(s => {
        return {...s, losses: s.losses + 1}
      })
    }
  }, [wordData, attempts])
  React.useEffect(() => {
    localStorage.setItem("wins", stats.wins.toString())
    localStorage.setItem("losses", stats.losses.toString())
  }, [stats.wins, stats.losses])

  function nextRound() {
    setRound(round => round + 1)
    setInput('')
    setUsedAlphabets([])
    setAttempts(7)
    setGameState('')
  }

  return (
    <main>
      <section className="stats-container">
        <div>Wins: <strong>{stats.wins}</strong></div>
        <div>Losses: <strong>{stats.losses}</strong></div>
        <button onClick={localStorage.clear()}>Reset wins/losses</button>
      </section>
      <section className="content-container">
          <div className="word-container">
            {attempts > 0 ? <Word word={wordData}/> : wordData.map(w => <div className="alphabet">{w.alphabet}</div>)}
          </div>
        <form>
          <input
            onChange={handleChange}
            value={input}
            maxLength={attempts > 0 ? '1' : '0'}
            onKeyDown={handleSubmit}
            placeholder={(attempts === 7 && wordData.every(w => w.isRevealed === false)) && "Press Enter to submit"}>
          </input>
        </form>
        {attempts >= 0 ? <div>Guesses left: <strong>{attempts}</strong></div> : ''}
        {usedAlphabets.length > 0 ? <div className="used-row">{renderedUsedAlphabets}</div> : ''}
        <button onClick={nextRound}>Get new word</button>
        <PopUp gameState={gameState} />
      </section>
    </main>
  );
}
