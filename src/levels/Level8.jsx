import React from 'react'
import LevelBase from './_LevelBase'

export default function Level8(props){
  return (
    <LevelBase
      {...props}
      levelNumber={8}
      title={'Level 8 - Slide World'}
      behaviorConfig={{
        slippery: true,
        platforms: [ {x:100,y:520,w:160,h:16}, {x:320,y:480,w:160,h:16}, {x:560,y:440,w:120,h:16} ],
        spikeX:400,
        fakeGate:false
      }}
    />
  )
}
