export function generateLevelConfig(level) {
  const difficulty = Math.min(1, level / 50); // Scale from 0 to 1 based on level, capping at level 50 for max difficulty.

  const config = {
    platforms: [],
    spikes: [],
    glitches: {},
  };

  // Base platform
  config.platforms.push({ x: 100, y: 520, w: 80, h: 16 });

  // Number of platforms increases with level
  const numPlatforms = 2 + Math.floor(level / 3);
  for (let i = 0; i < numPlatforms; i++) {
    config.platforms.push({
      x: 150 + Math.random() * 500,
      y: 150 + Math.random() * 350,
      w: 60 + Math.random() * 60,
      h: 16,
    });
  }

  // Number of spikes increases
  const numSpikes = 1 + Math.floor(level / 5);
  for (let i = 0; i < numSpikes; i++) {
    config.spikes.push({
      x: 200 + Math.random() * 500,
    });
  }

  // Introduce glitches based on level
  if (level > 3) {
    config.invertZone = Math.random() < difficulty * 0.5;
  }
  if (level > 5) {
    config.slippery = Math.random() < difficulty * 0.3;
  }
  if (level > 8) {
    // Gravity flip becomes more frequent
    if (Math.random() < difficulty * 0.2) {
      config.gravityFlipEvery = Math.max(120, 600 - level * 10);
    }
  }
  if (level > 10) {
    config.fakeGate = Math.random() < 0.2;
  }
  if (level > 12) {
    config.mirror = Math.random() < difficulty * 0.25;
  }
  if (level > 15) {
    config.cloneCount = Math.floor(Math.random() * (level / 5));
  }
  if (level > 20) {
    config.movingGate = {
      speed: 0.5 + Math.random() * difficulty,
      min: 400,
      max: 750,
      dir: Math.random() > 0.5 ? 1 : -1
    };
  }

  return config;
}
