import React, { useState, useCallback } from 'react'
import { useEffect } from 'react'
import Level1 from '../levels/Level1'
import Level2 from '../levels/Level2'
import Level3 from '../levels/Level3'
import Level4 from '../levels/Level4'
import Level5 from '../levels/Level5'
import Level6 from '../levels/Level6'
import Level7 from '../levels/Level7'
import Level8 from '../levels/Level8'
import Level9 from '../levels/Level9'
import Level10 from '../levels/Level10'
import HUD from './HUD'
import FakeErrorModal from './FakeErrorModal'

export default function GameManager(){
  const [currentLevel, setCurrentLevel] = useState(1)
  const [respawnPoint, setRespawnPoint] = useState({x:100,y:520})
  const [trollMessage, setTrollMessage] = useState(null)
  const [showFakeError, setShowFakeError] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(()=>{
    console.debug('[GameManager] currentLevel is', currentLevel)
  },[currentLevel])

  const goToNextLevel = useCallback(()=>{
    if(isTransitioning) return
    setIsTransitioning(true)
    // show temporary loading/troll message before switching
    setTrollMessage('Loading more bugs...')
    setTimeout(()=>{
      setTrollMessage(null)
      setCurrentLevel(c => Math.min(99, c+1))
      // reset respawn for new level (can be customized per-level)
      setRespawnPoint({x:100,y:520})
      setIsTransitioning(false)
    }, 900)
  },[isTransitioning])

  const showTroll = useCallback((msg,ms=2200)=>{
    setTrollMessage(msg)
    setTimeout(()=>setTrollMessage(null), ms)
  },[])

  const handleDeath = useCallback((reason)=>{
    // Occasionally show a fake error overlay on death
    if(Math.random() < 0.25){
      setShowFakeError(true)
      setTimeout(()=>setShowFakeError(false), 1500 + Math.random()*2000)
    }
  },[])

  // Expose quick debug helpers to the browser console so you can skip/clear levels easily
  useEffect(()=>{
  // Debug helpers were intentionally removed to require players to complete levels in order.
  // If you need them during development, re-enable the following lines:
  // window.setLevel = (n) => { if(typeof n === 'number' && n >= 1){ setCurrentLevel(n) } }
  // window.nextLevel = () => setCurrentLevel(c => c + 1)
  return ()=>{}
  },[])

  return (
    <div>
  <div className="game-canvas">
        {currentLevel === 1 && (
          <Level1
            key={1}
            respawnPoint={respawnPoint}
            onRespawnChange={setRespawnPoint}
            onDeath={handleDeath}
            onNextLevel={goToNextLevel}
            onTrollMessage={showTroll}
          />
        )}
        {currentLevel === 2 && (
          <Level2
            key={2}
            respawnPoint={respawnPoint}
            onRespawnChange={setRespawnPoint}
            onDeath={handleDeath}
            onNextLevel={goToNextLevel}
            onTrollMessage={showTroll}
          />
        )}
        {currentLevel === 3 && (
          <Level3
            key={3}
            respawnPoint={respawnPoint}
            onRespawnChange={setRespawnPoint}
            onDeath={handleDeath}
            onNextLevel={goToNextLevel}
            onTrollMessage={showTroll}
          />
        )}
        {currentLevel === 4 && (
          <Level4
            key={4}
            respawnPoint={respawnPoint}
            onRespawnChange={setRespawnPoint}
            onDeath={handleDeath}
            onNextLevel={goToNextLevel}
            onTrollMessage={showTroll}
          />
        )}
        {currentLevel === 5 && (
          <Level5
            key={5}
            respawnPoint={respawnPoint}
            onRespawnChange={setRespawnPoint}
            onDeath={handleDeath}
            onNextLevel={goToNextLevel}
            onTrollMessage={showTroll}
          />
        )}
        {currentLevel === 6 && (
          <Level6
            key={6}
            respawnPoint={respawnPoint}
            onRespawnChange={setRespawnPoint}
            onDeath={handleDeath}
            onNextLevel={goToNextLevel}
            onTrollMessage={showTroll}
          />
        )}
        {currentLevel === 7 && (
          <Level7
            key={7}
            respawnPoint={respawnPoint}
            onRespawnChange={setRespawnPoint}
            onDeath={handleDeath}
            onNextLevel={goToNextLevel}
            onTrollMessage={showTroll}
          />
        )}
        {currentLevel === 8 && (
          <Level8
            key={8}
            respawnPoint={respawnPoint}
            onRespawnChange={setRespawnPoint}
            onDeath={handleDeath}
            onNextLevel={goToNextLevel}
            onTrollMessage={showTroll}
          />
        )}
        {currentLevel === 9 && (
          <Level9
            key={9}
            respawnPoint={respawnPoint}
            onRespawnChange={setRespawnPoint}
            onDeath={handleDeath}
            onNextLevel={goToNextLevel}
            onTrollMessage={showTroll}
          />
        )}
        {currentLevel === 10 && (
          <Level10
            key={10}
            respawnPoint={respawnPoint}
            onRespawnChange={setRespawnPoint}
            onDeath={handleDeath}
            onNextLevel={goToNextLevel}
            onTrollMessage={showTroll}
          />
        )}
        {/* Future levels: add more components and cases */}
      </div>

  {/* small DOM overlay showing current level for debugging */}
  <div style={{position:'absolute',right:20,top:12,color:'#9f9',fontFamily:'monospace',zIndex:1000}}>{`Level ${currentLevel}`}</div>

      <HUD />
      {showFakeError && <FakeErrorModal />}
      {isTransitioning && (
        <div style={{position:'absolute',left:0,top:0,right:0,bottom:0,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(0,0,0,0.85)',zIndex:9999}}>
          <div style={{color:'#ff66cc',fontFamily:'monospace',padding:20,border:'4px solid #330033'}}>Loading more bugs...</div>
        </div>
      )}
      {trollMessage && (
        <div style={{position:'absolute',left:20,top:60,color:'#ff66cc',fontFamily:'monospace',zIndex:999}}>{trollMessage}</div>
      )}
    </div>
  )
}
