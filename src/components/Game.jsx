import React, { useState, useCallback } from 'react'
import Level from './Level'
import HUD from './HUD'
import FakeErrorModal from './FakeErrorModal'

export default function Game(){
  const [levelIndex, setLevelIndex] = useState(0)
  const [respawnPoint, setRespawnPoint] = useState({x:100,y:400})
  const [showFakeError, setShowFakeError] = useState(false)
  const [trollMessage, setTrollMessage] = useState(null)

  const handleDeath = useCallback((reason) => {
    if(Math.random() < 0.35){
      setShowFakeError(true)
      setTimeout(()=>setShowFakeError(false), 2000 + Math.random()*3000)
    }
  },[])

  function goToNextLevel(){
    setLevelIndex(i => i + 1)
  }

  function showTroll(msg,ms=2000){
    setTrollMessage(msg)
    setTimeout(()=>setTrollMessage(null), ms)
  }

  return (
    <div>
      <div className="game-canvas">
        <Level
          key={levelIndex}
          seed={levelIndex}
          levelIndex={levelIndex}
          respawnPoint={respawnPoint}
          onRespawnChange={setRespawnPoint}
          onDeath={handleDeath}
          onNextLevel={goToNextLevel}
          onTrollMessage={(m) => showTroll(m,2500)}
        />
      </div>
      <HUD />
      {showFakeError && <FakeErrorModal />}
      {trollMessage && (
        <div style={{position:'absolute',left:20,top:60,color:'#ff66cc',fontFamily:'monospace',zIndex:999}}>{trollMessage}</div>
      )}
    </div>
  )
}
