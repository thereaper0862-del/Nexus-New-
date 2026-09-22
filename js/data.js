/* ============================================================
   NEXUS ARCADE — game catalog
   ------------------------------------------------------------
   How to edit: change url/embed below. `embed` is used for the
   in-hub player; `url` is the launch page. A blank `embed` just
   opens `url` in a new tab. A blank `url` shows "add a URL" UI.
   ============================================================ */

const GRADS = {
  cyan:  ['#09c6f9', '#0e6eff'],
  violet:['#7c5cff', '#ff2d95'],
  pink:  ['#ff2d95', '#7c5cff'],
  green: ['#00e5a0', '#0e8cff'],
  gold:  ['#ffe14d', '#ff7a00'],
  sunset:['#ff6a3d', '#ff2d6f'],
  ice:   ['#4de8ff', '#7c5cff'],
  night: ['#2b2b55', '#0b0b1d'],
};

const DEFAULT_CATALOG = [
  /* ---------------- CLOUD STREAM ---------------- */
  {
    id: 'gfnow', title: 'GeForce NOW', icon: '🌀',
    category: 'cloud', genres: ['Streaming', 'Cloud'],
    url: 'https://play.geforcenow.com/', embed: 'https://play.geforcenow.com/',
    desc: 'Stream your PC library from NVIDIA servers. Supports Steam, Epic, Ubisoft & more.',
    grad: 'green',
  },
  {
    id: 'xcloud', title: 'Xbox Cloud Gaming', icon: '🎮',
    category: 'cloud', genres: ['Streaming', 'Cloud'],
    url: 'https://www.xbox.com/en-US/play', embed: 'https://www.xbox.com/en-US/play',
    desc: 'Play hundreds of Game Pass titles straight from the browser. Controller recommended.',
    grad: 'green',
  },
  {
    id: 'luna', title: 'Amazon Luna', icon: '☁️',
    category: 'cloud', genres: ['Streaming', 'Cloud'],
    url: 'https://luna.amazon.com/', embed: 'https://luna.amazon.com/',
    desc: 'Amazon\'s cloud gaming platform with instant start channels and Luna+.',
    grad: 'cyan',
  },
  {
    id: 'steamlink', title: 'Steam Remote Play', icon: '🖥️',
    category: 'cloud', genres: ['Streaming', 'Self-host'],
    url: 'https://store.steampowered.com/remoteplay', embed: '',
    desc: 'Stream games from your own PC over your network or the internet with Steam.',
    grad: 'ice',
  },
  {
    id: 'moonlight', title: 'Moonlight / Sunshine', icon: '🌙',
    category: 'cloud', genres: ['Streaming', 'Self-host'],
    url: '', embed: '',
    desc: 'Self-hosted low-latency streaming. Pair with Sunshine on your host PC, then set its IP in Settings.',
    grad: 'night',
    dynamic: 'moonlight',
  },

  /* ---------------- QUICK PLAY (web games) ---------------- */
  {
    id: 'g2048', title: '2048', icon: '🔢',
    category: 'quick', genres: ['Puzzle'],
    url: 'https://gabrielecirulli.github.io/2048/', embed: 'https://gabrielecirulli.github.io/2048/',
    desc: 'Slide tiles, merge numbers, chase the 2048 tile. The classic open-source web puzzle.',
    grad: 'gold',
  },
  {
    id: 'hextris', title: 'Hextris', icon: '⬡',
    category: 'quick', genres: ['Arcade', 'Puzzle'],
    url: 'https://hextris.io/', embed: 'https://hextris.io/',
    desc: 'Hexagon-stacking arcade addict. Rotate, grab, and keep the center clear.',
    grad: 'pink',
  },
  {
    id: 'cow', title: 'Find the Invisible Cow', icon: '🐄',
    category: 'quick', genres: ['Casual', 'Sound'],
    url: 'https://findtheinvisiblecow.com/', embed: 'https://findtheinvisiblecow.com/',
    desc: 'Passive sound game: move your cursor to find the hidden cow. Turn audio on!',
    grad: 'green',
  },
  {
    id: 'chess', title: 'Chess vs Computer', icon: '♟️',
    category: 'quick', genres: ['Strategy', 'Tabletop'],
    url: 'https://www.chess.com/play/computer', embed: '',
    desc: 'Practice against the computer at your level, free. Learn, analyze, level up.',
    grad: 'night',
  },
  {
    id: 'gn_slope', title: 'Slope', icon: '📉',
    category: 'quick', genres: ['Arcade', 'Runner'],
    url: 'https://genizymath.github.io/iframe/198.html', embed: 'https://genizymath.github.io/iframe/198.html',
    desc: 'Roll down an endless neon slope at impossible speeds. Dodge the red orbs. Verified from the GN-Math catalog.',
    grad: 'cyan',
  },
  {
    id: 'gn_geo', title: 'Geometry Dash', icon: '🔷',
    category: 'quick', genres: ['Rhythm', 'Platformer'],
    url: 'https://genizymath.github.io/iframe/785-upd3.html', embed: 'https://genizymath.github.io/iframe/785-upd3.html',
    desc: 'Square jumps to the beat. The roblox-grade remake straight from the GN-Math catalog.',
    grad: 'violet',
  },
  {
    id: 'gn_tetris', title: 'Tetris', icon: '🧱',
    category: 'quick', genres: ['Puzzle', 'Arcade'],
    url: 'https://genizymath.github.io/iframe/733.html', embed: 'https://genizymath.github.io/iframe/733.html',
    desc: 'Stack and clear lines with falling tetrominoes. A crisp modern build verified from GN-Math.',
    grad: 'gold',
  },

  /* ---------------- RETRO & PORTS ---------------- */
  {
    id: 'emux', title: 'Retro Console Core', icon: '🕹️',
    category: 'retro', genres: ['Emulation', 'BYOR'],
    url: 'https://emulatorjs.org/', embed: '',
    desc: 'Bring your own ROM: EmulatorJS runs NES / SNES / GB / GBA / PSX in the browser. Host ROMs in /data/roms.',
    grad: 'violet',
  },
  {
    id: 'js13k', title: 'js13kGames Archive', icon: '🧊',
    category: 'retro', genres: ['Arcade', 'Indie'],
    url: 'https://js13kgames.com/', embed: '',
    desc: 'Thousands of tiny games built in 13KB or less. Pure retro web-game energy.',
    grad: 'cyan',
  },
  {
    id: 'port_cuphead', title: 'Cuphead (Full Web Port)', icon: '🎩',
    category: 'retro', genres: ['Run & Gun', 'Port'],
    url: 'https://genizymath.github.io/games/cuphead/', embed: 'https://genizymath.github.io/iframe/465-fix.html',
    desc: 'The complete fan-made Unity WebGL port of Cuphead from the GN-Math catalog — full levels and bosses, not a demo. Desktop recommended.',
    grad: 'sunset',
  },
  {
    id: 'port_doom', title: 'DOOM (1993) Browser Port', icon: '💀',
    category: 'retro', genres: ['FPS', 'Port'],
    url: 'https://genizymath.github.io/games/doom/', embed: 'https://genizymath.github.io/iframe/203-a.html',
    desc: 'The original 1993 classic running in your browser via js-dos, shipped with the GN-Math catalog. Keyboard + mouse.',
    grad: 'pink',
  },
  {
    id: 'port_doom2', title: 'Doom II: Hell on Earth', icon: '☠️',
    category: 'retro', genres: ['FPS', 'Port'],
    url: 'https://genizymath.github.io/games/doom-2/', embed: 'https://genizymath.github.io/iframe/602.html',
    desc: 'The full 1994 sequel with new weapons, enemies, and levels, running in-browser via js-dos. Verified from GN-Math.',
    grad: 'violet',
  },
  {
    id: 'port_sonicmania', title: 'Sonic Mania', icon: '🦔',
    category: 'retro', genres: ['Platformer', 'Port'],
    url: 'https://genizymath.github.io/games/sonic-mania/', embed: 'https://genizymath.github.io/iframe/590-f.html',
    desc: 'The fan-beloved 2D Sonic revival, playable in the browser right now. From the GN-Math catalog.',
    grad: 'cyan',
  },
  {
    id: 'port_mario', title: 'Super Mario Bros', icon: '🍄',
    category: 'retro', genres: ['Platformer', 'Port'],
    url: 'https://genizymath.github.io/games/super-mario-bros/', embed: 'https://genizymath.github.io/iframe/508.html',
    desc: 'The 1985 original that started it all, faithfully emulated in the browser. Verified from GN-Math.',
    grad: 'sunset',
  },
  {
    id: 'port_hotline', title: 'Hotline Miami', icon: '🐔',
    category: 'retro', genres: ['Action', 'Port'],
    url: 'https://genizymath.github.io/games/hotline-miami/', embed: 'https://genizymath.github.io/iframe/217-cf.html',
    desc: 'Ultra-violent neon top-down action, playable via emulation right in the browser. From the GN-Math catalog.',
    grad: 'pink',
  },
  {
    id: 'port_undertale', title: 'Undertale', icon: '💛',
    category: 'retro', genres: ['RPG', 'Port'],
    url: 'https://genizymath.github.io/games/undertale/', embed: 'https://genizymath.github.io/iframe/184.html',
    desc: 'The beloved indie RPG about mercy and monsters, playable in-browser. Verified from GN-Math.',
    grad: 'gold',
  },
  {
    id: 'port_vicecity', title: 'GTA: Vice City Full Web Edition', icon: '🚗',
    category: 'retro',
    genres: ['Sandbox', 'Port'],
    url: 'https://genizymath.github.io/games/grand-theft-auto-vice-city/', embed: 'https://genizymath.github.io/iframe/652.html',
    desc: 'Complete reVC fan port of the 2002 classic — all 80+ missions, vehicles, weapons and cheats. Verified from the GN-Math catalog.',
    grad: 'cyan',
  },
];