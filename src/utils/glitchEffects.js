export function randomShake(container, intensity=4){
  if(!container) return
  const ox = (Math.random()*2-1)*intensity
  const oy = (Math.random()*2-1)*intensity
  container.x = (container.x||0) + ox
  container.y = (container.y||0) + oy
}
