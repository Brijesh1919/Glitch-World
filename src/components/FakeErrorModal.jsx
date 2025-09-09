import React from 'react'

export default function FakeErrorModal(){
  const style = {
    position:'absolute',left:0,top:0,right:0,bottom:0,display:'flex',alignItems:'center',justifyContent:'center',
    background:'rgba(0,0,0,0.6)',color:'#fff',zIndex:9999,fontFamily:'monospace'
  }
  return (
    <div style={style}>
      <div style={{background:'#001122',padding:20,border:'4px solid #220033'}}>
        <div style={{color:'#ff6666',fontWeight:'700'}}>Unity has crashed (simulated)</div>
        <div style={{marginTop:8}}>Attempting to restart... [OK]</div>
      </div>
    </div>
  )
}
