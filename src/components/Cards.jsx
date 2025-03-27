"use client"

import { useEffect, useState } from "react"
import "./Cards.css"

function Card({ hexCode, name, handleClick }) {
  // Convert color names to more fun/creative names
  const getColorName = (originalName) => {
    // Map of common colors to more fun names
    const colorMap = {
      Red: "Ruby Red",
      Blue: "Ocean Blue",
      Green: "Emerald Green",
      Yellow: "Sunshine Yellow",
      Purple: "Royal Purple",
      Orange: "Tangerine",
      Pink: "Bubblegum Pink",
      Brown: "Chocolate",
      Gray: "Silver Mist",
      Black: "Midnight",
      White: "Pearl White",
      Teal: "Tropical Teal",
      Cyan: "Sky Blue",
      Magenta: "Electric Pink",
      Lime: "Lime Zest",
      Maroon: "Berry Wine",
      Navy: "Deep Sea",
      Olive: "Olive Grove",
    }

    // Check if the original name contains any of our mapped colors
    for (const [standard, fancy] of Object.entries(colorMap)) {
      if (originalName.toLowerCase().includes(standard.toLowerCase())) {
        return fancy
      }
    }

    // If no match, return the original with "Vibrant" prefix
    return `Vibrant ${originalName}`
  }

  return (
    <div className="card" data-color={hexCode} onClick={handleClick}>
      <div className="color" style={{ backgroundColor: hexCode }}></div>
      <p className="color-text" style={{ color: hexCode }}>
        {getColorName(name)}
      </p>
    </div>
  )
}

const randomBetween = (min, max) => min + Math.floor(Math.random() * (max - min + 1))

const shuffleArray = (arr) => {
  let j, x, i
  for (i = arr.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1))
    x = arr[i]
    arr[i] = arr[j]
    arr[j] = x
  }
  return arr
}

export default function Cards({ level, gameState, setGameState, setScore, score }) {
  const [colorsArray, setColorsArray] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const generateColorsArray = async (level) => {
    setIsLoading(true)
    let newColors = []
    const previousRGBs = []
    for (let i = 0; i < level + 3; i++) {
      let r = randomBetween(0, 254)
      let g = randomBetween(0, 254)
      let b = randomBetween(0, 254)
      let rgb = `${r},${g},${b}`
      while (previousRGBs.includes(rgb)) {
        r = randomBetween(0, 254)
        g = randomBetween(0, 254)
        b = randomBetween(0, 254)
        rgb = `${r},${g},${b}`
      }
      previousRGBs.push(rgb)
      const response = await fetch(`https://www.thecolorapi.com/id?rgb=${r},${g},${b}`)
      const data = await response.json()
      newColors = [...newColors, { hex: data.hex.value, name: data.name.value, isClicked: false }]
    }
    setColorsArray(newColors)
    setIsLoading(false)
  }

  const handleCardClick = (e) => {
    const hexCode = e.currentTarget.dataset.color
    const array = [...colorsArray]
    array.map((color) => {
      if (color.hex === hexCode) {
        if (color.isClicked) {
          setGameState("game over")
        } else {
          color.isClicked = true
          setScore(score + 1)
        }
      }
      return color
    })
    setColorsArray(shuffleArray(array))
    checkIfAllAreClicked() && setGameState("next level")
  }

  const checkIfAllAreClicked = () => {
    for (let i = 0; i < colorsArray.length; i++) {
      if (!colorsArray[i].isClicked) {
        return false
      }
    }
    return true
  }

  useEffect(() => {
    generateColorsArray(level)
  }, [level])

  useEffect(() => {
    gameState === "new game" && generateColorsArray(level)

    return () => {
      setGameState("")
    }
  }, [gameState, level, setGameState])

  return (
    <div id="cards">
      {isLoading ? (
        <div className="loading">Loading colors...</div>
      ) : (
        colorsArray.map((color) => {
          return <Card key={color.hex} hexCode={color.hex} name={color.name} handleClick={handleCardClick} />
        })
      )}
    </div>
  )
}

