import React from 'react'
import LevelBase from './_LevelBase'

// Level3: Gravity Hell — gravity flips periodically
export default function Level3(props){
  return (
    <LevelBase
      {...props}
      levelNumber={3}
      title={'Level 3 - Gravity Hell: Welcome to the upside down'}
      behaviorConfig={{
        invertZone:false,
        spikeX:440,
        fakeGate:false,
        gravityFlipEvery: 600, // frames ~10s at 60fps
        safeZone: {x:260,y:480,w:120,h:60},
        switches: [ {x:500,y:520,w:24,h:24,effect:'flipGravity'} ]
      }}
    />
  )
}
