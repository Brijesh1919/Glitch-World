import React from 'react'
import LevelBase from './_LevelBase'

// Level1: Inverted Controls inside GlitchZone
export default function Level1(props){
  return (
    <LevelBase
      {...props}
      levelNumber={1}
      title={'Level 1 - Glitch Zone: Inverted Controls'}
      behaviorConfig={{
  invertZone:true,
  spikeX:400,
  fakeGate:false,
  platforms:[ {x:260,y:520,w:80,h:16} ]
      }}
    />
  )
}
