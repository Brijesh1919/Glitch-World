import React from 'react'
import LevelBase from './_LevelBase'

export default function Level9(props){
  return (
    <LevelBase
      {...props}
      levelNumber={9}
      title={'Level 9 - Reverse World'}
      behaviorConfig={{
        mirror: true,
        invertZone: true,
        platforms: [ {x:120,y:520,w:160,h:16}, {x:360,y:480,w:160,h:16}, {x:600,y:440,w:120,h:16} ],
        spikeX:420,
        fakeGate:false
      }}
    />
  )
}
