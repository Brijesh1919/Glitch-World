import  { useRef, useEffect } from 'react'
import { createGate } from './Gate'

export default function Level({respawnPoint,onRespawnChange,onDeath,onNextLevel,onTrollMessage}){
  const canvasRef = useRef(null)
  const stateRef = useRef({
    player:{x:respawnPoint.x,y:respawnPoint.y, vx:0, vy:0, onGround:false},
    invert:false,
    tick:0
  })

  useEffect(()=>{
    const canvas = document.createElement('canvas')
    canvas.width = 800
    canvas.height = 600
    canvasRef.current = canvas
    const container = document.querySelector('.game-canvas')
    container.innerHTML = ''
    canvas.style.imageRendering = 'pixelated'
    container.appendChild(canvas)
    const ctx = canvas.getContext('2d')

  const keys = {}
    const keydown = (e)=>{ keys[e.key]=true }
    const keyup = (e)=>{ keys[e.key]=false }
    window.addEventListener('keydown',keydown)
    window.addEventListener('keyup',keyup)

  // create a gate on the right side of the level
  // `isFake` can be toggled to create fake vs real gates. Change `isFake: true` to make it a troll gate.
  const gate = createGate({x:720,y:480,width:56,height:80,isFake:false,label:'Exit Gate'})

  // simple game loop
    let raf
    function loop(){
      const s = stateRef.current
      s.tick++
      // random glitch toggle for invert zone demo
      if(s.tick % 120 === 0){
        s.invert = Math.random() > 0.6
      }

      // controls
      let left = keys['ArrowLeft'] || keys['a']
      let right = keys['ArrowRight'] || keys['d']
      let up = keys['ArrowUp'] || keys['w'] || keys[' ']
      if(s.invert){ const t=left; left=right; right=t }

      if(left) s.player.vx -= 0.7
      if(right) s.player.vx += 0.7

      s.player.vy += 0.6
      s.player.vx *= 0.85

      if(up && s.player.onGround){ s.player.vy = -12; s.player.onGround=false }

      s.player.x += s.player.vx
      s.player.y += s.player.vy

      // ground collision
      if(s.player.y >= 520){ s.player.y = 520; s.player.vy = 0; s.player.onGround=true }

      // trap collision
      if(s.player.x > 400 && s.player.x < 440 && s.player.y >= 480){
        onDeath && onDeath({type:'spike'})
        s.player.x = respawnPoint.x; s.player.y = respawnPoint.y
      }

      // gate collision detection
      // player rectangle: x, y-40 (top), width 32, height 40
      const playerRect = {x: s.player.x, y: s.player.y-40, w:32, h:40}
      if(gate.isColliding(playerRect)){
        // If gate is fake, show a troll message and optionally teleport back
        if(gate.isFake){
          onTrollMessage && onTrollMessage('Nice try, that was the fake exit.')
          // example troll behavior: push player back a bit
          s.player.x = Math.max(40, s.player.x - 120)
        } else {
          // real gate: advance to next level
          onNextLevel && onNextLevel()
        }
      }

      // clear
      ctx.fillStyle = '#000'
      ctx.fillRect(0,0,800,600)

      // draw ground tiles
      ctx.fillStyle = '#444'
      for(let i=0;i<20;i++) ctx.fillRect(i*40,560,40,40)

      // draw spike
      ctx.fillStyle = '#f44'
      ctx.beginPath(); ctx.moveTo(400,560); ctx.lineTo(420,520); ctx.lineTo(440,560); ctx.closePath(); ctx.fill()

  // draw glitch zone
      if(s.invert) ctx.fillStyle = 'rgba(255,0,255,0.08)'
      else ctx.fillStyle = 'rgba(0,255,255,0.03)'
      ctx.fillRect(200,400,160,160)

      // draw player
      ctx.fillStyle = '#8cf'
      ctx.fillRect(s.player.x, s.player.y-40, 32, 40)

  // draw gate
  gate.draw(ctx)

      // UI
      ctx.fillStyle = '#ff66cc'
      ctx.font = '12px monospace'
      ctx.fillText('Level 1 - Glitch Zone: Inverted Controls',12,20)

      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return ()=>{
      cancelAnimationFrame(raf)
      window.removeEventListener('keydown',keydown)
      window.removeEventListener('keyup',keyup)
      if(container.contains(canvas)) container.removeChild(canvas)
    }
  },[respawnPoint,onRespawnChange,onDeath])

  return null
}
