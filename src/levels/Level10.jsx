import React from 'react'
import LevelBase from './_LevelBase'

export default function Level10(props){
  return (
    <LevelBase
      {...props}
      levelNumber={10}
      title={'Level 10 - Glitch Core'}
      behaviorConfig={{
        // chaos: randomize various glitches every few seconds
        randomizeEvery: 600,
        randomGlitches: ['invertZone','slippery','mirror','gravityFlip','fakeGate'],
        platforms: [ {x:120,y:520,w:160,h:16}, {x:320,y:480,w:160,h:16}, {x:520,y:440,w:160,h:16} ],
        spikeX:380,
        // moving gate so player must chase it
        movingGate: {min:480,max:720,speed:1.2,dir:1},
        gateX: 720,
        fakeGate:false
      }}
    />
  )
}
