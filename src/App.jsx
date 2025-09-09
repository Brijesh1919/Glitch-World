import React, { useState } from 'react'
import GameManager from './components/GameManager'
import Dashboard from './components/Dashboard'

export default function App() {
  const [started, setStarted] = useState(false)
  return (
    <div className="app-root">
      {!started ? (
        <Dashboard onStart={()=>setStarted(true)} />
      ) : (
        <>
          <h1 className="title">GLITCH WORLD</h1>
          <GameManager />
        </>
      )}
    </div>
  )
}
