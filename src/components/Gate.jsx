// Gate helper and component for canvas-based levels
// Exports a factory `createGate` which returns an object with draw(ctx) and isColliding(playerRect)

export function isColliding(ax,ay,aw,ah,bx,by,bw,bh){
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by
}

export function createGate({x=740,y=440,width=40,height=80,isFake=false,label='Exit'}){
  return {
    x,y,width,height,isFake,label,
    draw(ctx){
      // simple green gate with slight animated stripe
      ctx.save()
      ctx.fillStyle = isFake ? '#559955' : '#22ff66'
      ctx.fillRect(x,y,width,height)
      ctx.fillStyle = 'rgba(0,0,0,0.12)'
      ctx.fillRect(x+4,y+8, width-8, 10)
      ctx.restore()
    },
    isColliding(player){
      return isColliding(player.x, player.y, player.w, player.h, x, y, width, height)
    }
  }
}

export default function Gate(){
  // This component is intended to be used by canvas-based levels via createGate
  return null
}
