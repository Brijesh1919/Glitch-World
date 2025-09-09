import React from 'react'
import LevelBase from './_LevelBase'

export default function Level5(props){
  return (
    <LevelBase
      {...props}
      levelNumber={5}
      title={'Level 5 - Missing Textures'}
      behaviorConfig={{
        platforms: [ {x:120,y:520,w:140,h:16, invisible:true}, {x:300,y:480,w:120,h:16, invisible:true}, {x:520,y:440,w:140,h:16, invisible:true} ],
        revealSwitch: {x:60,y:520,w:36,h:36},
        fakePowerUp: {x:220,y:520,w:28,h:16},
        fakeGate:false,
        spikeX:360
      }}
    />
  )
}
