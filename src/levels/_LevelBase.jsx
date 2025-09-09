import { useRef, useEffect } from 'react'
import { createGate } from '../components/Gate'

// LevelBase: a simple canvas-based level that accepts behaviorConfig to tweak mechanics
// Props:
// - respawnPoint, onRespawnChange, onDeath, onNextLevel, onTrollMessage
// - levelNumber, title
// - behaviorConfig: { invertZone, spikeX, fakeGate, jumpDelay, gravityFlipEvery }
export default function LevelBase({respawnPoint,onRespawnChange,onDeath,onNextLevel,onTrollMessage,levelNumber=1,title='Level',behaviorConfig={}}){
  const canvasRef = useRef(null)
  const stateRef = useRef({
    player:{x:(respawnPoint && respawnPoint.x) || 100,y:(respawnPoint && respawnPoint.y) || 520, vx:0, vy:0, onGround:false},
    invert:false,
    tick:0,
    gravity:0.6,
    // new state for advanced behaviors
    _ghostBuffer: [], // for echo ghost
    _reveal: false, // for invisible platforms
    _clones: [],
    _delayedInputs: [],
    _glitches: {}
  })

  useEffect(()=>{
  console.debug('[LevelBase] mount', levelNumber, title)
    const canvas = document.createElement('canvas')
    canvas.width = 800
    canvas.height = 600
    canvasRef.current = canvas
  const container = document.querySelector('.game-canvas')
  // clear previous canvas/content
  console.debug('[LevelBase] clearing game-canvas for level', levelNumber)
  container.innerHTML = ''
    canvas.style.imageRendering = 'pixelated'
    container.appendChild(canvas)
    const ctx = canvas.getContext('2d')

    const keys = {}
    const keydown = (e)=>{ keys[e.key]=true }
    const keyup = (e)=>{ keys[e.key]=false }
    window.addEventListener('keydown',keydown)
    window.addEventListener('keyup',keyup)

    // gate configuration: support single gate or multiple gates
  let gates = []
  if(Array.isArray(behaviorConfig.gates) && behaviorConfig.gates.length){
    for(const g of behaviorConfig.gates){ const gg = createGate({x:g.x,y:g.y,width:g.width||56,height:g.height||80,isFake:!!g.fake,label:g.label||`Exit L${levelNumber}`} ); gg.active=true; gates.push(gg) }
  } else {
    const g = createGate({x:behaviorConfig.gateX || 720,y:behaviorConfig.gateY || 480,width:behaviorConfig.gateW||56,height:behaviorConfig.gateH||80,isFake:!!behaviorConfig.fakeGate,label:`Exit L${levelNumber}`})
    g.active = true
    gates.push(g)
  }

    let raf
    function loop(){
      const s = stateRef.current
      s.tick++

      // invert zone logic (if present) toggles randomly like a glitch
      if(behaviorConfig.invertZone && s.tick % 120 === 0){ s.invert = Math.random() > 0.6 }

      // gravity flip logic (Level 3 and others)
      if(behaviorConfig.gravityFlipEvery && s.tick % (behaviorConfig.gravityFlipEvery) === 0){
        s.gravity = -s.gravity
        console.debug('[LevelBase] gravity flipped to', s.gravity, 'at tick', s.tick)
      }

      // random glitch toggles (Level 10 style)
      if(behaviorConfig.randomizeEvery && s.tick % behaviorConfig.randomizeEvery === 0){
        // toggle a random subset of glitch flags
        const map = s._glitches
        const possible = behaviorConfig.randomGlitches || ['invertZone','slippery','mirror','gravityFlip','fakeGate']
        for(const key of possible){ map[key] = Math.random() > 0.5 }
        // apply some mapped behaviors
        if(map.gravityFlip){ s.gravity = -s.gravity }
      }

      // controls
      let left = keys['ArrowLeft'] || keys['a']
      let right = keys['ArrowRight'] || keys['d']
      let up = keys['ArrowUp'] || keys['w'] || keys[' ']

      // mirror world and manual invert handling
      const mirrorActive = !!behaviorConfig.mirror || s._glitches.mirror
      const invertControls = s.invert || !!behaviorConfig.invertZone || !!s._glitches.invertZone
      if(invertControls){ const t=left; left=right; right=t }

      // delayed/random input handling
      const inputDelayRange = behaviorConfig.inputDelayRange
      const applyInput = (fn)=>{
        if(inputDelayRange && Array.isArray(inputDelayRange)){
          const ms = Math.floor((Math.random()*(inputDelayRange[1]-inputDelayRange[0]))+inputDelayRange[0])
          setTimeout(fn, ms)
        } else fn()
      }

      if(left) applyInput(()=> { s.player.vx -= 0.7 })
      if(right) applyInput(()=> { s.player.vx += 0.7 })

  s.player.vy += s.gravity
  // slippery surfaces: reduced friction
  if(behaviorConfig.slippery || s._glitches.slippery) s.player.vx *= 0.985
  else s.player.vx *= 0.85

      // jump delay (debug room) - small input lag
      // jump handling with optional fixed delay
      if(behaviorConfig.jumpDelay && up){
        if(!s._jumpDelayLast || (Date.now() - s._jumpDelayLast) > behaviorConfig.jumpDelay){
          if(s.player.onGround){ s.player.vy = -12 * (s.gravity>0?1:-1); s.player.onGround=false }
          s._jumpDelayLast = Date.now()
        }
      } else {
        if(up && s.player.onGround){ s.player.vy = -12 * (s.gravity>0?1:-1); s.player.onGround=false }
      }

      s.player.x += s.player.vx
      s.player.y += s.player.vy

      // record positions for ghost echo buffer
      if(behaviorConfig.echoGhost){
        s._ghostBuffer.push({x:s.player.x,y:s.player.y,t:Date.now()})
        // trim buffer to 5s
        while(s._ghostBuffer.length > 600) s._ghostBuffer.shift()
      }

      // ground collision (assumes ground is at y=520 when gravity positive, or 80 when inverted)
      if(s.gravity > 0){
        if(s.player.y >= 520){ s.player.y = 520; s.player.vy = 0; s.player.onGround=true }
      } else {
        if(s.player.y <= 80){ s.player.y = 80; s.player.vy = 0; s.player.onGround=true }
      }

        // trap collision (spikeX)
        const spikeX = behaviorConfig.spikeX || 400
        if(s.player.x > spikeX && s.player.x < spikeX + 40 && ((s.gravity>0 && s.player.y >= 480) || (s.gravity<0 && s.player.y <= 120))){
          onDeath && onDeath({type:'spike'})
          s.player.x = respawnPoint.x; s.player.y = respawnPoint.y
        }

        // simple platforms handling (top-only collision)
        if(Array.isArray(behaviorConfig.platforms)){
          for(const p of behaviorConfig.platforms){
            // if player horizontally overlaps and is falling onto platform
            // platforms may be invisible until reveal
            const visible = !p.invisible || s._reveal
            if(s.player.x + 32 > p.x && s.player.x < p.x + p.w){
              if(s.gravity > 0){
                if(s.player.y >= p.y && s.player.y <= p.y + 40){
                  s.player.y = p.y; s.player.vy = 0; s.player.onGround = true
                }
              } else {
                // inverted gravity: ceiling platforms
                if(s.player.y <= p.y && s.player.y >= p.y - 40){
                  s.player.y = p.y; s.player.vy = 0; s.player.onGround = true
                }
              }
            }
          }
        }

  // fake power-up: Level 2 behavior
        if(behaviorConfig.fakePowerUp){
          const fp = behaviorConfig.fakePowerUp
          if(s.player.x + 32 > fp.x && s.player.x < fp.x + fp.w && s.player.y - 40 < fp.y + fp.h && s.player.y > fp.y){
            // collided with fake power-up
            onTrollMessage && onTrollMessage('You got Godmode! ...but nothing happened')
            // remove it after pickup by shifting it offscreen
            fp.x = -9999
          }
        }

  // safe zone: Level 3 behavior - stepping in triggers trap or drop
        if(behaviorConfig.safeZone){
          const sz = behaviorConfig.safeZone
          if(s.player.x + 32 > sz.x && s.player.x < sz.x + sz.w && s.player.y - 40 < sz.y + sz.h && s.player.y > sz.y){
            // troll: safe zone actually kills or teleports into spikes
            onTrollMessage && onTrollMessage('That safe zone was a lie...')
            // send player to spike area (instant kill)
            onDeath && onDeath({type:'safezone'})
            s.player.x = respawnPoint.x; s.player.y = respawnPoint.y
          }
        }

        // reveal switch: reveal invisible platforms
        if(behaviorConfig.revealSwitch){
          const sw = behaviorConfig.revealSwitch
          if(s.player.x + 32 > sw.x && s.player.x < sw.x + sw.w && s.player.y - 40 < sw.y + sw.h && s.player.y > sw.y){
            s._reveal = true
            onTrollMessage && onTrollMessage('Platforms revealed... maybe')
            sw.x = -9999
          }
        }

        // switches: a simple switch that flips gravity when touched
        if(Array.isArray(behaviorConfig.switches)){
          for(const sw of behaviorConfig.switches){
            if(s.player.x + 32 > sw.x && s.player.x < sw.x + sw.w && s.player.y - 40 < sw.y + sw.h && s.player.y > sw.y){
              if(sw.effect === 'flipGravity'){
                s.gravity = -s.gravity
                onTrollMessage && onTrollMessage('Gravity switch triggered')
                // disable switch after activation
                sw.x = -9999
              }
            }
          }
        }

        // clones: simple moving decoys
        if(behaviorConfig.cloneCount && s._clones.length === 0){
          for(let i=0;i<behaviorConfig.cloneCount;i++) s._clones.push({x:50 + i*40, y:520, wob: Math.random()*2*Math.PI})
        }
        if(s._clones.length){
          for(const c of s._clones){ c.wob += 0.06; c.x += Math.sin(c.wob)*0.6 }
        }

      // gate collision (support multiple gates)
      const playerRect = {x:s.player.x, y:s.player.y - 40, w:32, h:40}
      for(const gate of gates){
        // moving gate support
        if(behaviorConfig.movingGate && gate && gate.x !== undefined){
          const mg = behaviorConfig.movingGate
          gate.x += (mg.dir || 1) * (mg.speed || 0.6)
          if(gate.x < (mg.min||480)) mg.dir = 1
          if(gate.x > (mg.max||720)) mg.dir = -1
        }

        if(gate.active && gate.isColliding(playerRect)){
          gate.active = false // prevent immediate retrigger
          if(gate.isFake){
            onTrollMessage && onTrollMessage('Nice try, that was the fake exit.')
            // troll: scramble player slightly
            s.player.x = Math.max(40, s.player.x - 140)
            // re-enable gate after a short cooldown so player can try again later
            setTimeout(()=>{ gate.active = true }, 2200)
          } else {
            onNextLevel && onNextLevel()
          }
        }
      }

      // draw
      ctx.fillStyle = '#000'
      ctx.fillRect(0,0,800,600)

      // ground tiles (draw depending on gravity)
      ctx.fillStyle = '#444'
      if(s.gravity > 0){ for(let i=0;i<20;i++) ctx.fillRect(i*40,560,40,40) }
      else { for(let i=0;i<20;i++) ctx.fillRect(i*40,0,40,40) }

  // draw spike
      ctx.fillStyle = '#f44'
      if(s.gravity > 0){ ctx.beginPath(); ctx.moveTo(spikeX,560); ctx.lineTo(spikeX+20,520); ctx.lineTo(spikeX+40,560); ctx.closePath(); ctx.fill() }
      else { ctx.beginPath(); ctx.moveTo(spikeX,0); ctx.lineTo(spikeX+20,40); ctx.lineTo(spikeX+40,0); ctx.closePath(); ctx.fill() }

      // draw platforms
      if(Array.isArray(behaviorConfig.platforms)){
        ctx.fillStyle = '#666'
        for(const p of behaviorConfig.platforms){ if(!p.invisible || s._reveal) ctx.fillRect(p.x, p.y, p.w, p.h) }
      }

  // draw fake power-up
      if(behaviorConfig.fakePowerUp){
        const fp = behaviorConfig.fakePowerUp
        ctx.fillStyle = '#ffcc00'
        ctx.fillRect(fp.x, fp.y, fp.w, fp.h)
        ctx.fillStyle = '#000'
        ctx.font = '10px monospace'
        ctx.fillText('GOD', fp.x+4, fp.y+14)
      }

      // draw safe zone
      if(behaviorConfig.safeZone){
        const sz = behaviorConfig.safeZone
        ctx.fillStyle = 'rgba(0,255,0,0.08)'
        ctx.fillRect(sz.x, sz.y, sz.w, sz.h)
        ctx.fillStyle = '#ff0'
        ctx.font = '10px monospace'
        ctx.fillText('SAFE?', sz.x+6, sz.y+14)
      }

      // draw reveal switch
      if(behaviorConfig.revealSwitch){ const sw = behaviorConfig.revealSwitch; ctx.fillStyle='#8f8'; ctx.fillRect(sw.x, sw.y, sw.w, sw.h) }
      // draw switches
      if(Array.isArray(behaviorConfig.switches)){
        ctx.fillStyle = '#88f'
        for(const sw of behaviorConfig.switches){ ctx.fillRect(sw.x, sw.y, sw.w, sw.h) }
      }

      // glitch/invert zone draw
      if((behaviorConfig.invertZone || s._glitches.invertZone) && s.invert) ctx.fillStyle = 'rgba(255,0,255,0.08)'
      else ctx.fillStyle = 'rgba(0,255,255,0.03)'
      ctx.fillRect(200,400,160,160)

      // draw clones
      if(s._clones.length){ ctx.fillStyle='#44f'; for(const c of s._clones){ ctx.fillRect(c.x, c.y-40, 32, 40) } }

      // draw ghost (echo) if requested: render a translucent copy from ~1s ago
      if(behaviorConfig.echoGhost && s._ghostBuffer.length){
        // find position ~1000ms ago
        const cutoff = Date.now() - (behaviorConfig.echoDelay || 1000)
        let idx = 0
        for(let i=0;i<s._ghostBuffer.length;i++){ if(s._ghostBuffer[i].t <= cutoff) idx = i }
        const gpos = s._ghostBuffer[idx]
        if(gpos){ ctx.fillStyle='rgba(200,200,255,0.28)'; ctx.fillRect(gpos.x, gpos.y-40, 32, 40) }
      }

      // draw player (with mirror visual if requested)
      if(behaviorConfig.mirror || s._glitches.mirror){
        ctx.save()
        ctx.translate(800,0)
        ctx.scale(-1,1)
        // draw mirrored scene element: player
        ctx.fillStyle = '#8cf'
        ctx.fillRect(800 - s.player.x - 32, s.player.y-40, 32, 40)
        ctx.restore()
      } else {
        ctx.fillStyle = '#8cf'
        ctx.fillRect(s.player.x, s.player.y-40, 32, 40)
      }

  // draw gates
  for(const g of gates) g.draw(ctx)

      // UI text
      ctx.fillStyle = '#ff66cc'
      ctx.font = '12px monospace'
      ctx.fillText(title,12,20)

      // small debug: show gravity
      ctx.fillStyle = '#fff'
      ctx.fillText('Gravity: ' + (s.gravity>0 ? 'normal' : 'inverted'),12,38)

      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return ()=>{
  console.debug('[LevelBase] unmount', levelNumber)
      cancelAnimationFrame(raf)
      window.removeEventListener('keydown',keydown)
      window.removeEventListener('keyup',keyup)
      if(container.contains(canvas)) container.removeChild(canvas)
    }
  },[respawnPoint,onRespawnChange,onDeath,onNextLevel,onTrollMessage,levelNumber,title,behaviorConfig])

  return null
}
