import React from 'react'
import LevelBase from './_LevelBase'

// Level2: Debug Room with fake power-up and jump delay
export default function Level2(props){
  return (
    <LevelBase
      {...props}
      levelNumber={2}
      title={'Level 2 - Debug Room: Broken Power-ups'}
      behaviorConfig={{
        invertZone:false,
        spikeX:320,
        // make this a real exit so players can progress sequentially
        fakeGate:false,
        jumpDelay: 300, // ms delay introduced to jumps
        platforms: [ {x:160,y:460,w:120,h:16}, {x:340,y:520,w:120,h:16} ],
        fakePowerUp: {x:220,y:420,w:28,h:16}
      }}
    />
  )
}
