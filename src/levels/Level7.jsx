import React from 'react'
import LevelBase from './_LevelBase'

export default function Level7(props){
  return (
    <LevelBase
      {...props}
      levelNumber={7}
      title={'Level 7 - Delay Hell'}
      behaviorConfig={{
        inputDelayRange: [100,500],
        platforms: [ {x:120,y:520,w:120,h:16}, {x:320,y:480,w:120,h:16}, {x:520,y:440,w:120,h:16} ],
        spikeX:360,
        fakeGate:false
      }}
    />
  )
}
