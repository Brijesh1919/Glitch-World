import React from 'react'

export default function Dashboard({onStart}){
  return (
    <div className="dashboard-root">
      <div className="title-wrap">
        <div className="pixel-title">GLITCH WORLD</div>
        <div className="pixel-sub">PLAY ON YOUR RISK</div>
      </div>

      <div className="promo">
        <div className="troll">404</div>
        <div className="promo-text">Welcome to the corrupted arcade. Expect bugs.</div>
      </div>

      <div className="dashboard-actions">
        <button className="btn-play" onClick={onStart}>PLAY</button>
      </div>

      <div className="footer-note">Press arrow keys to move, Space to jump</div>
    </div>
  )
}
