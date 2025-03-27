"use client"
import "./GameOver.css"

export default function GameOver({ highestScore, overlayStyle, modalStyle, resetGame }) {
  return (
    <div id="overlay" style={overlayStyle}>
      <div id="game-over-modal" style={modalStyle}>
        <h2>Game Over!</h2>
        <h3>Highest Score: {highestScore}</h3>
        <p>You clicked the same color twice.</p>
        <button onClick={resetGame}>Play Again</button>
      </div>
    </div>
  )
}

