import React from 'react'

export default function DeathScreen({visible,reason}){
  if(!visible) return null
  return (
    <div style={{position:'absolute',left:0,top:0,right:0,bottom:0,background:'rgba(0,0,0,0.8)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',zIndex:999}}>
      <div style={{textAlign:'center',fontFamily:'monospace'}}>
        <div style={{fontSize:18}}>Game Over</div>
        <div style={{marginTop:8}}>You died: {reason}</div>
      </div>
    </div>
  )
}
