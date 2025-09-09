import React from 'react'
import LevelBase from './_LevelBase'

export default function Level4(props){
  return (
    <LevelBase
      {...props}
      levelNumber={4}
      title={'Level 4 - Echo Chamber'}
      behaviorConfig={{
        echoGhost: true,
        echoDelay: 1000,
        platforms: [ {x:120,y:520,w:200,h:16}, {x:380,y:480,w:160,h:16}, {x:600,y:440,w:120,h:16} ],
        spikeX: 440,
        fakeGate:false
      }}
    />
  )
}
