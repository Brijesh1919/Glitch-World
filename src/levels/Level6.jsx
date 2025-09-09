import React from 'react'
import LevelBase from './_LevelBase'

export default function Level6(props){
  return (
    <LevelBase
      {...props}
      levelNumber={6}
      title={'Level 6 - Clone Party'}
      behaviorConfig={{
        cloneCount: 4,
        platforms: [ {x:160,y:520,w:120,h:16}, {x:360,y:480,w:120,h:16}, {x:560,y:440,w:120,h:16} ],
        spikeX:420,
        // add multiple visual gates; only one is real
        gates: [ {x:520,y:440,width:56,height:80,fake:true,label:'Fake A'}, {x:720,y:480,width:56,height:80,fake:false,label:'Real Exit'} ]
      }}
    />
  )
}
