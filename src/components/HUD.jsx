import React from 'react'

export default function HUD(){
  return (
    <div className="hud">
      <div style={{color:'#8f8',fontSize:12}}>Lives: 
        <span style={{marginLeft:6}}>∞</span>
      </div>
      <div style={{color:'#f6f',fontSize:11}}>Troll messages will appear here.</div>
    </div>
  )
}
