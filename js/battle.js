window.Battle = (() => {
  const THEMES = {
    samhain: { name: "サウィン", fill: "#f07828", shot: "#ffd38a" },
    shigure: { name: "時雨 華奢", fill: "#c43a3a", shot: "#ff9a9a" },
    yozakura: { name: "夜桜 降花", fill: "#d47aa8", shot: "#ffd0e6" },
    eishi: { name: "緋ノ瀬 永視", fill: "#6b4ad4", shot: "#cbb6ff" },
    tokka: { name: "緋ノ瀬 統華", fill: "#8b1e2d", shot: "#ffb3a0" }
  };

  const BOSS = { boss: true, speed: 1.35, fire: 0.035, hp: 22 };
  const BOSS_HP = { samhain: 260, shigure: 370, yozakura: 440, eishi: 480, tokka: 580 };
  const AMASE_SKILLS = [
    { id: "ofuda", name: "隠れている者は誰？" },
    { id: "bolt", name: "選ばれた貴方に。" },
    { id: "purge", name: "無干渉ワード" }
  ];
  const KANRA_SKILLS = [
    { id: "yell", name: "近距離・超音波" },
    { id: "call", name: "広範囲・電磁波" },
    { id: "order", name: "血の衝撃波" }
  ];
  const SAMHAIN_ARTS = [
    "ハーベスト・ブレイズ",
    "エールの祈り",
    "サウィン落下中",
    "パンプキンレーザー"
  ];

  const LIMIT = 180000;
  const BGM = {
    samhain: "assets/audio/samhain.mp3",
    shigure: "assets/audio/shigure.mp3",
    yozakura: "assets/audio/yozakura.mp3",
    eishi: "assets/audio/eishi.mp3",
    tokka: "assets/audio/tokka.mp3"
  };
  const BGM_MS = {
    samhain: 118256,
    shigure: 89051,
    yozakura: 125910,
    eishi: 85656,
    tokka: 117394
  };
  const BGM_TITLE = {
    samhain: "気まぐれパンプキン",
    shigure: "その記憶はすべてを語った",
    yozakura: "あのメイドは私の憧れだった",
    eishi: "統制ディストピアに反旗を翻せ",
    tokka: "指導エールによる統制を。"
  };
  const BGM_WHO = {
    samhain: "サウィン テーマ曲",
    shigure: "時雨 華奢 テーマ曲",
    yozakura: "夜桜 降花 テーマ曲",
    eishi: "緋ノ瀬 永視 テーマ曲",
    tokka: "緋ノ瀬 統華 テーマ曲"
  };
  let bgm = null;
  let bgmKind = null;
  let bgmLoops = 0;
  let canvas;
  let ctx;
  let running = false;
  let over = false;
  let raf = 0;
  let theme = THEMES.samhain;
  let kindNow = "samhain";
  let wave = 0;
  let lives = 3;
  let player;
  let shots = [];
  let foes = [];
  let bombs = [];
  let dir = 1;
  let keys = {};
  let cooldown = 0;
  let skillCd = { s0: 0, s1: 0, s2: 0 };
  let invuln = 0;
  let flash = 0;
  let rings = [];
  let bolts = [];
  let parts = [];
  let pops = [];
  let artT = 0;
  let artI = 0;
  let banner = "";
  let bannerT = 0;
  let onWin = null;
  let deadline = 0;
  let w = 0;
  let h = 0;
  let winning = false;
  let winTimer = 0;
  let overTimer = 0;
  let introTimer = 0;
  let introing = false;
  let clones = [];
  let lastBossAt = 0;
  let lastNormAt = 0;
  let normI = 0;
  let paused = false;
  let pauseAt = 0;
  let countTimer = 0;
  let joining = false;
  let joinDone = false;
  let allyOn = false;
  let allyCd = 0;
  let veilT = 0;
  let visT = 0;
  let visDone = false;
  let hurtT = 0;
  let trails = [];
  let lastComboMark = 0;
  let statuses = [];
  let lasers = [];
  let tickN = 0;
  let zones = [];
  let walls = null;
  let marks = [];
  let pullT = 0;
  let scopeT = 0;
  let scopeFrom = null;
  let bunkers = [];
  let saucer = null;
  let saucerAt = 0;
  let gruntMax = 1;
  let pickups = [];
  let grazeN = 0;
  let spot = null;
  let joinI = 0;
  const JOIN_LINES = [
    ["永視", "何手こずってんの…"],
    ["天瀬", "誰よ、あんた"],
    ["永視", "名乗る暇は今はないでしょ"],
    ["天瀬", "あなたもこいつの仲間なら相手するけど"],
    ["永視", "誰もあなたの敵とは言ってない。"],
    ["天瀬", "…？"],
    ["永視", "早く終わらせたいなら"],
    ["永視", "仲間は多くいたほうがいいでしょ"]
  ];
  let cloneShotAt = 0;
  const imgSamhainBoss = new Image();
  imgSamhainBoss.src = "assets/images/chars/samhain_boss.png";
  const imgAmaseBack = new Image();
  imgAmaseBack.src = "assets/images/chars/amase_back.png";
  const imgKanraBack = new Image();
  imgKanraBack.src = "assets/images/chars/kanra_back.png";
  const imgBossMap = {
    samhain: imgSamhainBoss,
    shigure: new Image(),
    yozakura: new Image(),
    eishi: new Image(),
    tokka: new Image()
  };
  imgBossMap.shigure.src = "assets/images/chars/shigure_boss.png";
  imgBossMap.yozakura.src = "assets/images/chars/yozakura_boss.png";
  imgBossMap.eishi.src = "assets/images/chars/eishi_boss.png";
  imgBossMap.tokka.src = "assets/images/chars/tokka_boss.png";
  let hp = 100;
  let maxHp = 100;
  let shotsFired = 0;
  let shotsHit = 0;
  let totalScore = 0;
  let combo = 0;
  let comboT = 0;
  let floats = [];
  let takenHit = false;
  let hideHud = false;

  const SAMHAIN_PATTERNS = ["fan3", "aim", "fan5", "rain", "aim3", "ring", "sweep", "seed",
    "spiral", "cross", "meteor", "cage", "wave", "lance", "bloom", "pincer", "clock", "mirror", "clone"];
  const SAMHAIN_NAMES = {
    fan3: "トリックショット",
    aim: "パンプキンエイム",
    fan5: "フェスティバル・リバーサル",
    rain: "ナイトフォールカーテン",
    aim3: "デュアル・パンプキン",
    ring: "グリム・ランタン",
    sweep: "シャドウステップ",
    seed: "パンプキン・リーパー",
    spiral: "ハーベスト・ブレイズ",
    cross: "エールの祈り",
    meteor: "サウィン落下中",
    cage: "笑わない仮装行列",
    wave: "祝祭の残響は誰の声？",
    lance: "灯火が選んだ犠牲",
    bloom: "実験で死んだ娘",
    pincer: "挟撃宴",
    clock: "聖母の贈り物は。",
    mirror: "パンプキンレーザー",
    clone: "サードミラージュ"
  };
  const BOSS_SKILLS = {
    samhain: [
      ["invert", "逆転祝祭"], ["mark", "南瓜の印"], ["seedspray", "ナイトフォールカーテン"],
      ["crush", "ランタン檻"], ["spiral", "ハーベスト・ブレイズ"], ["fallpump", "サウィン落下中"],
      ["mirror", "パンプキンレーザー"], ["slice", "十字切断"], ["clone", "サードミラージュ"], ["seed", "パンプキン・リーパー"]
    ],
    shigure: [
      ["stamp", "門衛の一瞥"], ["snipe", "スナイパー"], ["hush", "却下の沈黙"], ["ticket", "却下の雨"],
      ["lock", "通行止め"], ["denywall", "血の検札"], ["crush", "閉じた門"], ["laser", "華奢の審判"],
      ["gatefire", "立ち入り禁止"], ["slice", "最終通告"]
    ],
    yozakura: [
      ["blossomfan", "散華の扇"], ["field", "花影"], ["petalstorm", "夜桜嵐"], ["wave", "花吹雪"],
      ["aim3", "双花"], ["pull", "輪舞"], ["crush", "花の檻"], ["invert", "残香の惑い"],
      ["fallpetal", "落花"], ["laser", "咲き誇れ"]
    ],
    eishi: [
      ["dark", "暗闇"], ["mark", "権能の指"], ["voiddrip", "闇雨"], ["hush", "沈黙の輪"],
      ["slice", "尾の一閃"], ["fallshadow", "墜落する姉の影"], ["crush", "檻の記憶"], ["laser", "見えない視線"],
      ["twinlook", "双翼"], ["clock", "眠らない針"]
    ],
    tokka: [
      ["goldmarch", "統率の扇"], ["aim", "握手の弾"], ["wave", "行列"], ["pull", "金の輪"],
      ["slice", "号令"], ["goldrain", "屋上の雨"], ["decree", "支配"], ["invert", "血は水より"],
      ["laser", "部屋一つ"], ["hush", "決着"]
    ]
  };

  function mod() {
    return window.Settings ? window.Settings.battleMod() : { speed: 1, fire: 1, hp: 1 };
  }

  function bankScore() {
    const rate = shotsFired ? shotsHit / shotsFired : 0;
    const leftSec = wave >= 3 && deadline ? Math.max(0, deadline - Date.now()) / 1000 : 0;
    totalScore += Math.round(rate * 1000 + leftSec * 10);
    shotsFired = 0;
    shotsHit = 0;
  }

  function hud() {
    const waveEl = document.getElementById("battleWave");
    const lifeEl = document.getElementById("battleLives");
    const msgEl = document.getElementById("battleMsg");
    const boss = foes.find((f) => f.boss);
    if (waveEl) waveEl.textContent = "";
    if (lifeEl) lifeEl.textContent = "";
    const hpText = document.getElementById("battleHpText");
    const hpBar = document.getElementById("battleHpFill");
    if (hpText) hpText.textContent = `体力 ${Math.max(0, hp)}/${maxHp}`;
    if (hpBar) hpBar.style.width = (Math.max(0, hp) / Math.max(1, maxHp) * 100) + "%";
    const hpWrap = document.querySelector(".battle-hp");
    if (hpWrap) hpWrap.classList.toggle("is-low", hp / Math.max(1, maxHp) < 0.28);
    if (msgEl) msgEl.textContent = "";
    const rate = shotsFired ? shotsHit / shotsFired : 0;
    const leftSec = wave >= 3 && deadline ? Math.max(0, deadline - Date.now()) / 1000 : 180;
    const live = Math.round(rate * 1000 + leftSec * 10);
    const scoreEl = document.getElementById("battleScore");
    if (scoreEl) scoreEl.textContent = "SCORE " + totalScore;
    const timerEl = document.getElementById("battleTimer");
    if (timerEl) {
      if (wave >= 3 && deadline) {
        const left = Math.max(0, deadline - Date.now());
        const m = Math.floor(left / 60000);
        const s = Math.floor((left % 60000) / 1000);
        timerEl.hidden = false;
        timerEl.textContent = m + ":" + String(s).padStart(2, "0");
        timerEl.classList.remove("is-warn");
      } else {
        timerEl.hidden = true;
      }
    }
  }

  function spawnBoss() {
    const bh = Math.min(200, h * 0.44);
    const bw = Math.round(bh * 0.55);
    foes = [{
      boss: true,
      x: w / 2,
      y: h * 0.14,
      s: bw,
      bw,
      bh,
      hp: BOSS_HP[kindNow] || 100,
      max: BOSS_HP[kindNow] || 100,
      t: 0,
      vx: 1.6,
      vy: 0.8,
      turnAt: 0
    }];
    dir = 1;
    bombs = [];
    clones = [];
    bunkers = [];
    saucer = null;
    lastBossAt = 0;
    cloneShotAt = 0;
    artI = Math.floor(Math.random() * 10);
    banner = "";
    bannerT = 0;
    if (!(bgmKind === kindNow && bgm && !bgm.paused)) playBossBgm();
    deadline = Date.now() + LIMIT;
    hud();
  }

  function spawnBunkers() {
    bunkers = [];
    for (let i = 0; i < 4; i += 1) {
      bunkers.push({
        x: w * (0.18 + i * 0.21),
        y: h * 0.76,
        bw: 52,
        bh: 28,
        hp: 8,
        max: 8
      });
    }
  }
  function spawnGrunts() {
    const rows = wave === 1 ? 4 : 5;
    const cols = wave === 1 ? 8 : 9;
    const gapX = w / (cols + 1);
    const list = [];
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        list.push({
          boss: false,
          kind: kindNow,
          row: r,
          col: c,
          x: gapX * (c + 1),
          y: h * 0.16 + r * (h * 0.09),
          s: 28 + r * 3,
          hp: wave,
          max: wave,
          t: 0
        });
      }
    }
    foes = list;
    gruntMax = list.length;
    dir = 1;
    bombs = [];
    banner = "";
    pickups = [];
    spawnBunkers();
    saucer = null;
    bannerT = 0;
    hud();
  }

  function spawnWave(n) {
    wave = n;
    if (n >= 3) spawnBoss();
    else spawnGrunts();
  }

  function pushPumpkin(x, y, vx, vy, size) {
    bombs.push({
      x, y,
      v: vy * 0.16,
      vx: vx * 0.16,
      pumpkin: kindNow === "samhain",
      kind: kindNow,
      r: Math.max(4, (size || 14) * 0.38)
    });
  }

  function fireDan(x, y, ang, spd, size, spin) {
    if (bombs.length > 80) return;
    const slow = spd * 0.4;
    bombs.push({
      x, y,
      vx: Math.cos(ang) * slow,
      v: Math.sin(ang) * slow,
      kind: kindNow,
      pumpkin: kindNow === "samhain",
      r: Math.max(6.4, (size || 11) * 0.58),
      spin: spin || 0
    });
  }
  function fireBossNormal(boss) {
    const now = performance.now();
    if (now - lastNormAt < 820) return;
    lastNormAt = now;
    const cx = boss.x;
    const cy = boss.y + (boss.bh || boss.s) * 0.36;
    const ang0 = Math.atan2(Math.max(36, player.y - cy), player.x - cx);
    const phase = (normI++) % 4;
    const rot = tickN * 0.05;
    if (kindNow === "samhain") {
      if (phase === 0) {
        for (let arm = 0; arm < 3; arm += 1) {
          for (let i = 0; i < 8; i += 1) fireDan(cx, cy, rot + arm * 2.094 + i * 0.08, 1.6 + i * 0.18, 12, 0.012);
        }
      } else if (phase === 1) {
        for (let i = 0; i < 18; i += 1) fireDan(cx, cy, rot + i * 0.349, 2.35, 11, 0);
        for (let i = 0; i < 18; i += 1) fireDan(cx, cy, -rot + i * 0.349, 1.7, 10, 0);
      } else if (phase === 2) {
        for (let i = -6; i <= 6; i += 1) fireDan(cx, cy, ang0 + i * 0.11, 3.15, 12, 0);
      } else {
        for (let i = 0; i < 12; i += 1) fireDan(cx, cy, ang0 + Math.sin(i) * 0.4, 2.6 + (i % 3) * 0.25, 11, 0.008);
      }
    } else if (kindNow === "shigure") {
      if (phase === 0) {
        for (let c = -3; c <= 3; c += 1) {
          for (let k = 0; k < 4; k += 1) fireDan(cx + c * 18, cy, Math.PI / 2 + c * 0.04, 2.2 + k * 0.35, 10, 0);
        }
      } else if (phase === 1) {
        for (let i = 0; i < 16; i += 1) fireDan(cx, cy, i * 0.393 + rot, 2.5, 11, -0.01);
      } else if (phase === 2) {
        for (let i = -5; i <= 5; i += 1) fireDan(cx, cy, ang0 + i * 0.09, 3.2, 11, 0);
      } else {
        for (let i = 0; i < 10; i += 1) {
          fireDan(cx, cy, rot + i * 0.63, 2.1, 10, 0.016);
          fireDan(cx, cy, -rot + i * 0.63, 2.1, 10, -0.016);
        }
      }
    } else if (kindNow === "yozakura") {
      if (phase === 0) {
        for (let p = 0; p < 5; p += 1) {
          for (let i = 0; i < 6; i += 1) fireDan(cx, cy, rot + p * 1.256 + i * 0.06, 1.8 + i * 0.16, 11, 0.01);
        }
      } else if (phase === 1) {
        for (let i = 0; i < 20; i += 1) fireDan(cx, cy, i * 0.314 + rot * 0.5, 2.15, 10, 0);
      } else if (phase === 2) {
        for (let i = -7; i <= 7; i += 1) fireDan(cx, cy, ang0 + i * 0.1, 2.7, 11, 0.006);
      } else {
        for (let i = 0; i < 14; i += 1) fireDan(cx, cy, rot + i * 0.45, 2.0, 10, 0.02);
      }
    } else if (kindNow === "eishi") {
      if (phase === 0) {
        for (let i = 0; i < 14; i += 1) fireDan(cx, cy, i * 0.449 + rot, 1.55, 12, 0);
        for (let i = 0; i < 14; i += 1) fireDan(cx, cy, i * 0.449 - rot, 2.2, 10, 0);
      } else if (phase === 1) {
        for (let i = -3; i <= 3; i += 1) fireDan(cx, cy, ang0 + i * 0.16, 2.3, 13, 0);
      } else if (phase === 2) {
        for (let i = 0; i < 16; i += 1) fireDan(cx, cy, rot * 0.7 + i * 0.393, 1.8, 11, 0.014);
      } else {
        for (let i = 0; i < 8; i += 1) fireDan(cx, cy, ang0 + i * 0.785, 2.0, 12, -0.01);
      }
    } else {
      if (phase === 0) {
        for (let layer = 0; layer < 3; layer += 1) {
          for (let i = -4; i <= 4; i += 1) fireDan(cx, cy, ang0 + i * (0.1 + layer * 0.02), 2.6 + layer * 0.45, 12, 0);
        }
      } else if (phase === 1) {
        for (let i = 0; i < 22; i += 1) fireDan(cx, cy, i * 0.286 + rot, 2.4, 11, 0);
      } else if (phase === 2) {
        for (let i = 0; i < 12; i += 1) {
          fireDan(cx, cy, rot + i * 0.524, 2.2, 11, 0.012);
          fireDan(cx, cy, -rot + i * 0.524 + 0.26, 1.7, 10, -0.012);
        }
      } else {
        for (let i = -6; i <= 6; i += 1) fireDan(cx, cy, ang0 + i * 0.08, 3.3, 12, 0);
      }
    }
  }

  function fireBossArt(boss) {
    const now = Date.now();
    if (lastBossAt && now - lastBossAt < 8000) return;
    if (bombs.length > 220) return;
    lastBossAt = now;
    const cx = boss.x;
    const cy = boss.y + (boss.bh || boss.s) * 0.42;
    const px = player.x;
    const py = player.y;
    const ang0 = Math.atan2(Math.max(40, py - cy), px - cx);
    const aim = (ox, spd) => {
      const dx = px + (ox || 0) - cx;
      const dy = Math.max(40, py - cy);
      const len = Math.hypot(dx, dy) || 1;
      return [dx / len * spd, dy / len * spd];
    };
    const pack = BOSS_SKILLS[kindNow] || BOSS_SKILLS.samhain;
    const pair = pack[artI % pack.length];
    artI += 1;
    const id = pair[0];
    announceSkill(pair[1], (THEMES[kindNow] || {}).name || "");
    playCast(kindNow + "-" + id);
    if (window.Settings && window.Settings.fx) {
      const map = { laser: "laser", mirror: "laser", slice: "laser", snipe: "snipe", lock: "lock", crush: "crush", invert: "invert", mark: "mark", rain: "rain", ring: "ring", clone: "clone", dark: "dark", field: "petal", pull: "whoosh", hush: "status", fan3: "art", seed: "pump", meteor: "explode" };
      window.Settings.fx(map[id] || "art");
    }
    if (kindNow !== "eishi") flash = 16;
    showCutin(kindNow, "r");
    burst(cx, cy, 28, kindNow === "yozakura" ? "#ffb0c8" : kindNow === "eishi" ? "#6a40a0" : "#ff8a3d");
    const beam = (x0, y0, x1, y1, life, tint) => lasers.push({ x0, y0, x1, y1, life: life || 52, hit: false, tint: tint || kindNow });
    if (id === "dark") {
      veilT = 300;
      spot = { x: player.x, y: player.y - 22, life: 300 };
      const cover = document.getElementById("battleVeil");
      if (cover) {
        cover.hidden = false;
        cover.classList.remove("is-on");
        void cover.offsetWidth;
        cover.classList.add("is-on");
      }
    } else if (id === "fan3") {
      for (let i = -8; i <= 8; i += 1) pushPumpkin(cx, cy, i * 0.95, 5.6, 14);
      for (let i = -7; i <= 7; i += 1) pushPumpkin(cx, cy, i * 0.75, 4.0, 12);
      for (let i = -5; i <= 5; i += 1) pushPumpkin(cx, cy, i * 0.55, 2.8, 11);
    } else if (id === "fan5") {
      for (let i = -8; i <= 8; i += 1) pushPumpkin(cx, cy, i * 0.7, 5.2, 14);
      for (let i = -6; i <= 6; i += 1) pushPumpkin(cx, cy, i * 0.85, 3.6, 12);
    } else if (id === "aim") {
      [[6.4, 16], [5.6, 14], [5.0, 13], [4.4, 12], [3.8, 11]].forEach((p) => {
        const v = aim(0, p[0]);
        pushPumpkin(cx, cy, v[0], v[1], p[1]);
      });
      [-140, -90, -45, 45, 90, 140].forEach((off) => {
        const v = aim(off, 5.0);
        pushPumpkin(cx, cy, v[0], v[1], 13);
      });
    } else if (id === "aim3") {
      [-160, -120, -80, -40, 0, 40, 80, 120, 160].forEach((off) => {
        const v = aim(off, 5.6);
        pushPumpkin(cx, cy, v[0], v[1], 14);
      });
    } else if (id === "rain") {
      const n = kindNow === "tokka" ? 32 : 28;
      for (let i = 0; i < n; i += 1) {
        const x = 10 + i * ((w - 20) / (n - 1));
        pushPumpkin(x, 12 + (i % 3) * 10, (Math.random() - 0.5) * 1.8, 5.6 + Math.random() * 2.2, 13);
      }
    } else if (id === "ring") {
      for (let i = 0; i < 28; i += 1) {
        const a = (Math.PI * 2 * i) / 28 + 0.12;
        pushPumpkin(cx, boss.y, Math.cos(a) * 3.6, Math.sin(a) * 3.6, 13);
      }
      for (let i = 0; i < 18; i += 1) {
        const a = (Math.PI * 2 * i) / 18;
        pushPumpkin(cx, boss.y, Math.cos(a) * 2.2, Math.sin(a) * 2.2, 11);
      }
    } else if (id === "sweep") {
      for (let i = 0; i < 12; i += 1) {
        pushPumpkin(cx, cy, -(0.35 + i * 0.5), 4.0 + i * 0.16, 13);
        pushPumpkin(cx, cy, (0.35 + i * 0.5), 4.0 + i * 0.16, 13);
      }
    } else if (id === "seed") {
      const v = aim(0, 4.4);
      pushPumpkin(cx, cy, v[0], v[1], 22);
      for (let i = -5; i <= 5; i += 1) if (i) pushPumpkin(cx, cy, i * 0.7, 4.6, 13);
      [-80, 80].forEach((off) => {
        const vv = aim(off, 4.8);
        pushPumpkin(cx, cy, vv[0], vv[1], 16);
      });
    } else if (id === "spiral") {
      for (let i = 0; i < 22; i += 1) {
        const a = i * 0.32 + 0.2;
        pushPumpkin(cx, cy, Math.cos(a) * 2.8, 2.6 + Math.sin(a) * 2.2, 12);
      }
    } else if (id === "cross") {
      for (let i = -4; i <= 4; i += 1) {
        pushPumpkin(cx, cy, i * 1.15, 5.2, 13);
        pushPumpkin(cx, cy, i * 1.15, 3.6, 12);
      }
    } else if (id === "meteor") {
      for (let i = 0; i < 24; i += 1) {
        pushPumpkin(12 + i * (w / 24), 10 + (i % 2) * 16, (Math.random() - 0.5) * 1.1, 6.2 + Math.random() * 1.2, 14);
      }
    } else if (id === "cage") {
      for (let i = 0; i < 10; i += 1) {
        pushPumpkin(24, 20 + i * (h * 0.06), 3.4, 0.35, 12);
        pushPumpkin(w - 24, 20 + i * (h * 0.06), -3.4, 0.35, 12);
      }
      const v = aim(0, 5.2);
      pushPumpkin(cx, cy, v[0], v[1], 16);
    } else if (id === "wave") {
      for (let i = 0; i < 18; i += 1) pushPumpkin(16 + i * ((w - 32) / 17), cy, Math.sin(i * 0.5) * 2.4, 4.6, 13);
    } else if (id === "lance") {
      const v = aim(0, 7.2);
      pushPumpkin(cx, cy, v[0], v[1], 18);
      pushPumpkin(cx, cy, v[0] * 0.7, v[1] * 0.7, 14);
      [-40, 40].forEach((off) => {
        const vv = aim(off, 5.8);
        pushPumpkin(cx, cy, vv[0], vv[1], 13);
      });
    } else if (id === "bloom") {
      for (let i = 0; i < 18; i += 1) {
        const a = (Math.PI * i) / 17 + 0.15;
        pushPumpkin(cx, cy, Math.cos(a) * 3.4, 2.4 + Math.abs(Math.sin(a)) * 2.8, 12);
      }
    } else if (id === "pincer") {
      [40, w - 40].forEach((x) => {
        const dx = px - x;
        const dy = Math.max(40, py - h * 0.18);
        const len = Math.hypot(dx, dy) || 1;
        pushPumpkin(x, h * 0.16, dx / len * 5.2, dy / len * 5.2, 15);
      });
      pushPumpkin(cx, cy, 0, 5.0, 16);
    } else if (id === "clock") {
      for (let i = 0; i < 20; i += 1) {
        const a = (Math.PI * 2 * i) / 20 - Math.PI / 2;
        pushPumpkin(cx, boss.y, Math.cos(a) * 3.2, Math.sin(a) * 3.2 + 1.2, 12);
      }
    } else if (id === "mirror" || id === "laser") {
      if (kindNow === "samhain") {
        beam(cx, cy, px, h - 8, 56, "samhain");
        beam(cx - 22, cy, px - 90, h - 8, 56, "samhain");
        beam(cx + 22, cy, px + 90, h - 8, 56, "samhain");
        beam(cx, cy, 20, h - 8, 40, "samhain");
        beam(cx, cy, w - 20, h - 8, 40, "samhain");
        addStatus("guard", "防御波", 600, "guard");
      } else if (kindNow === "shigure") {
        [0.18, 0.38, 0.5, 0.62, 0.82].forEach((p) => beam(w * p, 8, w * p, h - 8, 44, "shigure"));
      } else if (kindNow === "yozakura") {
        beam(8, 8, w - 8, h - 8, 48, "yozakura");
        beam(w - 8, 8, 8, h - 8, 48, "yozakura");
        beam(cx, cy, px, py, 40, "yozakura");
      } else if (kindNow === "eishi") {
        beam(8, py - 8, w - 8, py - 8, 64, "eishi");
        addStatus("dark", "暗闇", 200, "dark");
      } else {
        beam(8, 8, px, h - 8, 50, "tokka");
        beam(w - 8, 8, px, h - 8, 50, "tokka");
        beam(8, h - 8, px, 20, 50, "tokka");
        beam(w - 8, h - 8, px, 20, 50, "tokka");
      }
    } else if (id === "slice") {
      if (kindNow === "samhain") {
        beam(8, 20, w - 8, h - 20, 40, "samhain");
        beam(w - 8, 20, 8, h - 20, 40, "samhain");
      } else if (kindNow === "shigure") {
        [py - 40, py, py + 40].forEach((y) => beam(8, y, w - 8, y, 34, "shigure"));
      } else if (kindNow === "yozakura") {
        for (let i = 0; i < 6; i += 1) beam(w * (i / 5), 8, w * (1 - i / 5), h - 8, 36, "yozakura");
      } else if (kindNow === "eishi") {
        beam(8, h * 0.35, w - 8, h * 0.35, 30, "eishi");
        beam(8, h * 0.55, w - 8, h * 0.55, 38, "eishi");
        beam(8, h * 0.75, w - 8, h * 0.75, 46, "eishi");
      } else {
        beam(8, py, w - 8, py, 40, "tokka");
        beam(px, 8, px, h - 8, 40, "tokka");
        beam(8, 8, w - 8, h - 8, 32, "tokka");
        beam(w - 8, 8, 8, h - 8, 32, "tokka");
      }
    } else if (id === "invert") {
      addStatus("invert", "左右反転", kindNow === "tokka" ? 360 : 280, "invert");
      if (kindNow === "samhain") { addStatus("burn", "南瓜熱", 160, "burn"); for (let i = 0; i < 10; i += 1) pushPumpkin(20 + i * (w / 10), 16, 0, 5.4, 12); }
      if (kindNow === "yozakura") zones.push({ x: w / 2, y: h * 0.7, r: 70, life: 220, kind: "drain" });
      if (kindNow === "tokka") { pullT = 160; addStatus("pull", "吸引", 160, "pull"); }
    } else if (id === "seedspray") {
      for (let i = 0; i < 16; i += 1) fireDan(16 + i * ((w - 32) / 15), 18, Math.PI / 2 + Math.sin(i) * 0.2, 2.4 + (i % 3) * 0.3, 13, 0.01);
    } else if (id === "fallpump") {
      for (let i = 0; i < 8; i += 1) fireDan(30 + i * ((w - 60) / 7), 8, Math.PI / 2, 1.6 + i * 0.12, 20, 0);
    } else if (id === "stamp") {
      [0.2, 0.5, 0.8].forEach((p) => {
        for (let k = 0; k < 6; k += 1) fireDan(w * p, 10 + k * 8, Math.PI / 2, 2.8, 11, 0);
      });
    } else if (id === "ticket") {
      for (let i = 0; i < 10; i += 1) fireDan(cx - 40 + (i % 5) * 20, cy, ang0 + (i > 4 ? 0.2 : -0.2), 3.0, 12, 0);
    } else if (id === "denywall") {
      for (let i = 0; i < 14; i += 1) fireDan(20 + i * ((w - 40) / 13), h * 0.42, 0.15 * (i % 2 ? 1 : -1), 0.8, 12, 0);
    } else if (id === "gatefire") {
      fireDan(20, h * 0.2, ang0, 3.4, 14, 0);
      fireDan(w - 20, h * 0.2, ang0, 3.4, 14, 0);
      for (let i = 0; i < 6; i += 1) fireDan(cx, cy, Math.PI / 2 + (i - 2.5) * 0.12, 2.6, 12, 0);
    } else if (id === "blossomfan") {
      for (let p = 0; p < 5; p += 1) {
        for (let i = 0; i < 7; i += 1) fireDan(cx, cy, p * 1.256 + i * 0.05, 1.7 + i * 0.2, 11, 0.012);
      }
    } else if (id === "petalstorm") {
      for (let i = 0; i < 20; i += 1) fireDan(10 + Math.random() * (w - 20), 8, Math.PI / 2 + (Math.random() - 0.5) * 0.5, 1.8 + Math.random(), 10, 0.02);
    } else if (id === "fallpetal") {
      for (let i = 0; i < 12; i += 1) fireDan(24 + i * ((w - 48) / 11), 6, Math.PI / 2 + Math.sin(i * 0.8) * 0.35, 2.0, 12, 0.015);
    } else if (id === "voiddrip") {
      for (let i = 0; i < 9; i += 1) fireDan(30 + i * ((w - 60) / 8), 12 + (i % 2) * 20, Math.PI / 2, 1.3 + (i % 3) * 0.2, 13, 0.006);
    } else if (id === "fallshadow") {
      for (let i = 0; i < 6; i += 1) fireDan(w * (0.15 + i * 0.14), 4, ang0 * 0.2 + Math.PI / 2, 1.5, 16, 0);
    } else if (id === "twinlook") {
      const a1 = Math.atan2(player.y - 40, player.x - 24);
      const a2 = Math.atan2(player.y - 40, player.x - (w - 24));
      for (let i = 0; i < 5; i += 1) {
        fireDan(24, 40, a1 + (i - 2) * 0.08, 2.8, 12, 0);
        fireDan(w - 24, 40, a2 + (i - 2) * 0.08, 2.8, 12, 0);
      }
    } else if (id === "goldmarch") {
      for (let row = 0; row < 3; row += 1) {
        for (let i = 0; i < 9; i += 1) fireDan(20 + i * ((w - 40) / 8), 20 + row * 16, Math.PI / 2, 2.2 + row * 0.25, 11, 0);
      }
    } else if (id === "goldrain") {
      for (let i = 0; i < 18; i += 1) fireDan(14 + i * ((w - 28) / 17), 8, Math.PI / 2 + (i % 2 ? 0.12 : -0.12), 2.8, 11, 0);
    } else if (id === "decree") {
      for (let i = 0; i < 16; i += 1) fireDan(cx, cy, i * 0.393, 2.4, 12, 0);
      fireDan(cx, cy, ang0, 3.6, 16, 0);
    } else if (id === "snipe") {
      scopeT = 84;
      scopeFrom = { x: cx, y: 8 };
      addStatus("mark", "狙撃印", 84, "mark");
      addStatus("lock", "拘束", 50, "lock");
    } else if (id === "lock") {
      addStatus("lock", "拘束", 200, "lock");
      [px - 30, px, px + 30].forEach((x) => beam(x, 8, x, h - 8, 28, "shigure"));
    } else if (id === "hush") {
      addStatus("curse", "呪詛", 360, "curse");
      addStatus("hush", "射撃封じ", 260, "hush");
      if (kindNow === "shigure") addStatus("lock", "拘束", 120, "lock");
      if (kindNow === "eishi") { veilT = 180; addStatus("dark", "暗闇", 180, "dark"); }
      if (kindNow === "tokka") addStatus("rule", "統制", 240, "rule");
    } else if (id === "pull") {
      pullT = kindNow === "tokka" ? 280 : 220;
      addStatus("pull", "吸引", pullT, "pull");
      if (kindNow === "yozakura") {
        zones.push({ x: cx, y: cy + 20, r: 80, life: 220, kind: "drain" });
        for (let a = 0; a < Math.PI * 2; a += 0.45) pushPumpkin(cx, cy, Math.cos(a) * 2.2, Math.sin(a) * 2.2, 11);
      }
      if (kindNow === "tokka") {
        beam(cx, cy, px, py, 40, "tokka");
        beam(8, h / 2, w - 8, h / 2, 30, "tokka");
      }
    } else if (id === "crush") {
      walls = { l: 8, r: w - 8, life: kindNow === "shigure" ? 200 : 260, gift: true };
      addStatus("crush", "狭間", walls.life, "crush");
      if (kindNow === "samhain") for (let i = 0; i < 12; i += 1) pushPumpkin(30 + i * ((w - 60) / 11), 14, 0, 5.8, 12);
      if (kindNow === "yozakura") marks.push({ x: px, y: py - 22, life: 60, r: 24 });
      if (kindNow === "eishi") { veilT = 160; addStatus("dark", "暗闇", 160, "dark"); }
    } else if (id === "mark") {
      if (kindNow === "samhain") {
        marks.push({ x: px, y: py - 22, life: 64, r: 26 });
        marks.push({ x: px - 50, y: py - 22, life: 78, r: 22 });
        marks.push({ x: px + 50, y: py - 22, life: 78, r: 22 });
      } else {
        marks.push({ x: px, y: py - 22, life: 56, r: 30 });
        beam(cx, cy, px, py - 22, 48, "eishi");
      }
      addStatus("mark", "印", 78, "mark");
    } else if (id === "field") {
      zones.push({ x: px, y: py - 20, r: 52, life: 280, kind: "drain" });
      zones.push({ x: w / 2, y: h * 0.55, r: 40, life: 220, kind: "drain" });
      pickups.push({ x: w * 0.2, y: h * 0.4, val: 0, hp: 18, life: 260, kind: "heart" });
      addStatus("field", "花域", 280, "field");
    } else if (id === "clone") {
      const life = 280;
      clones = [
        { x: Math.max(30, boss.x - w * 0.22), y: boss.y + 10, vx: -1.1, vy: 0.5, life },
        { x: Math.min(w - 30, boss.x + w * 0.22), y: boss.y + 10, vx: 1.1, vy: 0.5, life }
      ];
      cloneShotAt = 0;
    }
    tagSkill(id);
  }

  function addStatus(id, name, life, icon) {
    const hit = statuses.find((s) => s.id === id);
    if (hit) { hit.life = Math.max(hit.life, life); hit.max = Math.max(hit.max || life, life); return; }
    statuses.push({ id, name, life, max: life, icon: icon || id });
    paintStatus();
  }
  function giveHeal(n, x, y) {
    if (n <= 0 || hp <= 0) return;
    hp = Math.min(maxHp, hp + n);
    floats.push({ x: x || player.x, y: y || player.y - 30, v: -1.1, life: 28, t: "+" + n });
    rings.push({ x: x || player.x, y: y || player.y - 18, r: 8, max: 50, life: 16 });
    if (window.Settings && window.Settings.fx) window.Settings.fx("guard");
    hud();
  }
  function hasStatus(id) { return statuses.some((s) => s.id === id && s.life > 0); }
  function tagSkill(id) {
    if (kindNow === "samhain" && id === "rain") addStatus("wet", "夜の帳", 240, "wet");
    if (kindNow === "samhain" && id === "ring") addStatus("burn", "南瓜熱", 180, "burn");
    if (kindNow === "samhain" && id === "fan3") addStatus("double", "倍弾", 480, "double");
    if (kindNow === "samhain" && id === "seed") addStatus("rage", "逆上", 360, "rage");
    if (kindNow === "samhain" && id === "spiral") addStatus("luck", "金運", 420, "luck");
    if (kindNow === "shigure" && (id === "ring" || id === "cage" || id === "mirror")) addStatus("seal", "通行止め", 300, "seal");
    if (kindNow === "shigure" && id === "aim") addStatus("curse", "呪詛", 360, "curse");
    if (kindNow === "shigure" && id === "fan3") addStatus("haste", "早足", 360, "haste");
    if (kindNow === "yozakura") addStatus("bloom", "花毒", 360, "bloom");
    if (kindNow === "yozakura" && id === "rain") addStatus("regen", "再灯", 360, "regen");
    if (kindNow === "yozakura" && id === "bloom") addStatus("drain", "吸魂", 360, "drain");
    if (kindNow === "eishi" && id === "dark") addStatus("dark", "暗闇", 300, "dark");
    if (kindNow === "eishi" && (id === "ring" || id === "rain")) addStatus("mist", "霧視", 300, "mist");
    if (kindNow === "eishi" && id === "aim") addStatus("ward", "鉄壁", 180, "ward");
    if (kindNow === "tokka") addStatus("rule", "統制", 280, "rule");
    if (kindNow === "tokka" && id === "fan3") addStatus("bless", "祝福", 360, "bless");
    if (kindNow === "tokka" && id === "rain") addStatus("slowb", "遅弾", 300, "slowb");
    if (id === "meteor") addStatus("ice", "氷結", 200, "ice");
    if (id === "pincer") addStatus("grav", "重力", 200, "grav");
    if (id === "clock") addStatus("static", "静電気", 180, "static");
    if (id === "wave") addStatus("thirst", "渇き", 200, "thirst");
    if (id === "spiral") addStatus("flash", "点滅", 160, "flash");
    if (id === "seed") addStatus("spread", "拡散", 220, "spread");
    if (id === "aim" || id === "aim3") addStatus("tiny", "縮小", 200, "tiny");
    if (id === "fan3") addStatus("stiff", "硬直", 140, "stiff");
    if (id === "clone") addStatus("reflect", "反射", 200, "reflect");
    if (id === "dark") addStatus("lamp", "灯護", 240, "lamp");
  }
  function paintStatus() {
    const box = document.getElementById("battleStatus");
    if (!box) return;
    const live = statuses.filter((s) => s.life > 0);
    box.hidden = !live.length;
    box.innerHTML = live.map((s) => {
      const sec = Math.ceil(s.life / 60);
      return '<li class="st st-' + s.icon + '"><i></i><b>' + s.name + '</b><em>' + sec + 's</em></li>';
    }).join("");
  }
  function applyHit(dmg, src) {
    if (hasStatus("ward")) { invuln = 90; dmg = Math.max(1, Math.ceil(dmg * 0.2)); }
    if (hasStatus("guard")) dmg = Math.max(1, Math.ceil(dmg * 0.3));
    if (hasStatus("bless")) dmg = Math.max(1, Math.ceil(dmg * 0.75));
    if (hasStatus("rage") || hasStatus("thirst")) dmg = Math.ceil(dmg * 1.35);
    if (hasStatus("static")) dmg += 2;
    if (hasStatus("lamp") || hasStatus("reflect")) dmg = Math.max(1, Math.ceil(dmg * 0.8));
    if (hasStatus("seal")) dmg += 3;
    hp -= dmg;
    takenHit = true;
    combo = 0;
    hurtT = 18;
    invuln = 40;
    if (window.Fx) window.Fx.flash("fx-hurt");
    if (window.Settings && window.Settings.fx) window.Settings.fx("hurt");
    if (src === "samhain" || src === "pumpkin") addStatus("burn", "南瓜熱", 180, "burn");
    if (src === "yozakura") addStatus("bloom", "花毒", 240, "bloom");
    if (src === "shigure") addStatus("seal", "通行止め", 160, "seal");
    if (src === "tokka") addStatus("rule", "統制", 200, "rule");
    if (src === "eishi") addStatus("dark", "暗闇", 180, "dark");
    hud();
    paintStatus();
    if (hp <= 0) { hp = 0; gameOver("hp"); }
  }
  function tickStatus() {
    statuses.forEach((s) => { s.life -= 1; });
    if (hasStatus("poison") || hasStatus("bloom") || hasStatus("burn")) {
      if (tickN % 40 === 0 && hp > 0 && !over && !winning) {
        hp -= hasStatus("guard") ? 0 : 1;
        if (hp <= 0) { hp = 0; gameOver("hp"); }
      }
    }
    if ((hasStatus("regen") || hasStatus("bless")) && tickN % 30 === 0 && hp > 0 && !over) {
      hp = Math.min(maxHp, hp + (hasStatus("regen") ? 4 : 2));
      hud();
    }
    if (hasStatus("ward") && invuln < 20) invuln = 20;
    statuses = statuses.filter((s) => s.life > 0);
    if (tickN % 10 === 0) paintStatus();
  }

  function setTrackLabel(kind) {
    const el = document.getElementById("battleTrack");
    const name = document.getElementById("battleTrackName");
    const who = document.getElementById("battleTrackWho");
    const title = kind && BGM_TITLE[kind] ? BGM_TITLE[kind] : "";
    if (!el) return;
    if (!title) {
      el.hidden = true;
      if (name) name.textContent = "";
      if (who) who.textContent = "";
      return;
    }
    if (who) who.textContent = BGM_WHO[kind] || "テーマ曲";
    if (name) name.textContent = title;
    el.hidden = false;
    el.style.animation = "none";
    void el.offsetWidth;
    el.style.animation = "";
  }

  function stopBgm() {
    if (bgm) {
      bgm.onended = null;
      bgm.pause();
      bgm.src = "";
      bgm = null;
    }
    bgmKind = null;
    setTrackLabel("");
  }

  function themeLen() {
    if (bgm && isFinite(bgm.duration) && bgm.duration > 0) return bgm.duration * 1000;
    return BGM_MS[kindNow] || LIMIT;
  }

  function syncLimitFromBgm() {
    deadline = Date.now() + LIMIT;
  }

  function onBgmEnded() {
    if (winning || over) return;
    if (bgm) {
      bgm.currentTime = 0;
      bgm.play().catch(() => {});
    }
  }

  function playTheme(kind) {
    const vol = window.Settings ? window.Settings.bgmVolume() : 0.55;
    if (vol <= 0) {
      stopBgm();
      return;
    }
    if (bgmKind === kind && bgm) {
      setTrackLabel(kind);
      if (bgm.paused) bgm.play().catch(() => {});
      return;
    }
    stopBgm();
    const src = BGM[kind];
    if (!src) return;
    bgm = new Audio(src);
    bgm.loop = false;
    bgm.volume = vol;
    bgmKind = kind;
    bgmLoops = 0;
    bgm.onended = onBgmEnded;
    setTrackLabel(kind);
    bgm.play().catch(() => {});
  }

  function playBossBgm() {
    playTheme(kindNow);
  }

  function resetPlayer() {
    player = { x: w / 2, y: h * 0.88, s: 16 };
  }

  function drawGrunt(f) {
    const x = f.x;
    const y = f.y;
    const s = f.s;
    if (kindNow === "samhain") {
      ctx.fillStyle = f.row === 0 ? "#ff8a3d" : f.row === 1 ? "#e07012" : "#c4520c";
      ctx.beginPath();
      ctx.arc(x, y, s * 0.55, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#2f6b24";
      ctx.fillRect(x - 2, y - s * 0.72, 4, 7);
      ctx.fillStyle = "#1a0900";
      ctx.beginPath();
      ctx.moveTo(x - 5, y - 1);
      ctx.lineTo(x - 1, y + 2);
      ctx.lineTo(x - 5, y + 3);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(x + 5, y - 1);
      ctx.lineTo(x + 1, y + 2);
      ctx.lineTo(x + 5, y + 3);
      ctx.fill();
    } else if (kindNow === "shigure") {
      ctx.fillStyle = "#c43a3a";
      ctx.beginPath();
      ctx.moveTo(x, y - s * 0.6);
      ctx.lineTo(x + s * 0.5, y);
      ctx.lineTo(x, y + s * 0.6);
      ctx.lineTo(x - s * 0.5, y);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#ffe4e4";
      ctx.fillRect(x - 2, y - 3, 4, 6);
    } else if (kindNow === "yozakura") {
      ctx.fillStyle = "#f0a8c8";
      for (let i = 0; i < 5; i += 1) {
        const a = (Math.PI * 2 * i) / 5 - Math.PI / 2;
        ctx.beginPath();
        ctx.ellipse(x + Math.cos(a) * s * 0.28, y + Math.sin(a) * s * 0.28, s * 0.22, s * 0.14, a, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = "#ffe4f0";
      ctx.beginPath();
      ctx.arc(x, y, s * 0.12, 0, Math.PI * 2);
      ctx.fill();
    } else if (kindNow === "eishi") {
      ctx.fillStyle = "#120c18";
      ctx.fillRect(x - s * 0.4, y - s * 0.15, s * 0.8, s * 0.45);
      ctx.fillRect(x - s * 0.22, y - s * 0.5, s * 0.44, s * 0.4);
      ctx.fillStyle = "#6b4ad4";
      ctx.fillRect(x - s * 0.16, y - s * 0.28, 4, 3);
      ctx.fillRect(x + s * 0.08, y - s * 0.28, 4, 3);
    } else {
      ctx.fillStyle = "#8b1e2d";
      ctx.fillRect(x - s * 0.35, y - s * 0.2, s * 0.7, s * 0.55);
      ctx.fillStyle = "#f0c27a";
      ctx.fillRect(x - 3, y - s * 0.42, 6, 8);
    }
  }

  function skillList() {
    return kindNow === "eishi" ? KANRA_SKILLS : AMASE_SKILLS;
  }

  function paintSkills() {
    const list = skillList();
    document.querySelectorAll("#skillBar [data-sk]").forEach((el, i) => {
      const sk = list[i];
      if (sk) el.innerHTML = "<b>" + (i + 1) + "</b> " + sk.name + " <em data-cd></em>";
    });
  }

  function showCutin(who, side, mirror) {
    const box = document.getElementById("battleCutin");
    const img = document.getElementById("battleCutinImg");
    if (!box || !img) return;
    const src = {
      amase: "assets/images/chars/amase.png",
      kanra: "assets/images/chars/kanra.webp",
      samhain: "assets/images/chars/samhain.webp",
      shigure: "assets/images/chars/kyasha.webp",
      yozakura: "assets/images/chars/yozakura.webp",
      eishi: "assets/images/chars/eishi.webp",
      tokka: "assets/images/chars/tokka.png"
    }[who];
    if (!src) return;
    img.src = src;
    box.className = "battle-cutin from-" + (side === "l" ? "l" : "r") + (mirror ? " is-mirror" : "");
    box.hidden = false;
    window.clearTimeout(showCutin._t);
    showCutin._t = window.setTimeout(() => { box.hidden = true; }, 860);
  }

  function announceSkill(name, sub) {
    const el = document.getElementById("battleAnnounce");
    if (!el) return;
    el.hidden = false;
    el.innerHTML = (sub ? "<small>" + sub + "</small>" : "") + name;
    el.style.animation = "none";
    void el.offsetWidth;
    el.style.animation = "artNameIn 0.85s cubic-bezier(0.16, 0.84, 0.22, 1) both";
    window.clearTimeout(announceSkill._t);
    announceSkill._t = window.setTimeout(() => { el.hidden = true; }, 1600);
    if (window.Settings) window.Settings.announce();
  }

  function playCast(kind) {
    const el = document.getElementById("battleCast");
    const wrap = document.getElementById("vnBattle");
    if (el) {
      el.hidden = false;
      el.dataset.fx = kind || "cast";
      el.classList.remove("is-play");
      void el.offsetWidth;
      el.classList.add("is-play");
      window.clearTimeout(playCast._t);
      playCast._t = window.setTimeout(() => { el.hidden = true; el.classList.remove("is-play"); }, 720);
    }
    if (wrap) {
      wrap.classList.remove("is-cast");
      void wrap.offsetWidth;
      wrap.classList.add("is-cast");
      wrap.classList.add("cast-" + (kind || "cast").split("-")[0]);
      window.clearTimeout(playCast._w);
      playCast._w = window.setTimeout(() => {
        wrap.classList.remove("is-cast");
        wrap.classList.remove("cast-samhain", "cast-shigure", "cast-yozakura", "cast-eishi", "cast-tokka", "cast-ally");
      }, 520);
    }
  }

  function burst(x, y, n, color) {
    for (let i = 0; i < n; i += 1) {
      const a = Math.random() * Math.PI * 2;
      const sp = Math.random() * 2.8 + 0.6;
      parts.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 18 + Math.random() * 10, color: color || "#ffe08a" });
    }
  }

  function useSkill(i) {
    const sk = skillList()[i];
    if (!sk) return;
    const key = "s" + i;
    if (skillCd[key] > 0) return;
    if (hasStatus("curse")) return;
    skillCd[key] = i === 2 ? 1500 : i === 1 ? 1200 : 900;
    const px = player.x;
    const py = player.y;
    if (kindNow !== "eishi") flash = Math.max(flash, 6);
    rings.push({ x: px, y: py, r: 8, max: 70, life: 18 });
    burst(px, py, 10, "#ffe08a");
    announceSkill(sk.name, kindNow === "eishi" ? "甘楽 藍依" : "天瀬 若葉");
    const chip = document.querySelector('#skillBar [data-sk="s' + i + '"]');
    if (chip) { chip.classList.remove("is-fire"); void chip.offsetWidth; chip.classList.add("is-fire"); }
    if (window.Fx) window.Fx.slash();
    playCast("ally");
    if (window.Settings && window.Settings.fx) window.Settings.fx("skill");
    showCutin(kindNow === "eishi" ? "kanra" : "amase", "l");
    if (sk.id === "ofuda") {
      for (let n = 0; n < 7; n += 1) {
        shots.push({ x: px + (n - 3) * 7, y: py - 10, v: -6.4, vx: (n - 3) * 0.95, dmg: 3, special: true });
      }
      for (let n = -1; n <= 1; n += 1) {
        shots.push({ x: px + n * 10, y: py - 4, v: -7.2, vx: n * 0.4, dmg: 3, wide: true });
      }
      if (window.Settings) window.Settings.skillCue("beam");
    } else if (sk.id === "bolt") {
      const boss = foes.find((f) => f.boss) || foes[0];
      const tx = boss ? boss.x : w / 2;
      const ty = boss ? boss.y : h * 0.22;
      bolts.push({ x: tx, y: ty, life: 14 });
      if (boss) boss.hp -= 5;
      if (kindNow !== "eishi") flash = 8;
      hud();
      if (window.Settings) window.Settings.skillCue("spread");
    } else if (sk.id === "purge") {
      bombs = [];
      invuln = 40;
      foes.forEach((f) => { f.hp -= f.boss ? 2 : 1; });
      rings.push({ x: px, y: py, r: 12, max: 180, life: 28 });
      flash = 10;
      hud();
      if (window.Settings) window.Settings.skillCue("purge");
    } else if (sk.id === "yell") {
      for (let n = -4; n <= 4; n += 1) {
        shots.push({ x: px, y: py - 8, v: -6.2, vx: n * 1.1, dmg: 1, wide: true });
      }
      if (window.Settings) window.Settings.skillCue("beam");
    } else if (sk.id === "call") {
      for (let n = 0; n < 8; n += 1) {
        shots.push({ x: 30 + n * ((w - 60) / 7), y: h * 0.78, v: -4.6, vx: 0, dmg: 1, special: true });
      }
      if (window.Settings) window.Settings.skillCue("spread");
    } else if (sk.id === "order") {
      bombs = [];
      const boss = foes[0];
      if (boss) boss.hp -= 6;
      rings.push({ x: px, y: py, r: 16, max: 200, life: 28 });
      flash = 16;
      hud();
      if (window.Settings) window.Settings.skillCue("purge");
    }
  }

  function gameOver(reason) {
    if (over || winning) return;
    bankScore();
    if (window.Records) {
      window.Records.death();
      window.Records.addScore(totalScore);
    }
    running = false;
    over = true;
    if (window.Settings && window.Settings.fx) window.Settings.fx("lose");
    window.cancelAnimationFrame(raf);
    const panel = document.getElementById("battleOver");
    const note = document.querySelector("#battleOver span");
    if (panel) panel.hidden = false;
    if (note) {
      note.innerHTML = (reason === "hp"
        ? "体力が尽きました"
        : "制限時間を超えました") + "<br><b id=\"overTick\">残り10秒でタイトル画面に戻ります</b>";
    }
    banner = reason === "hp" ? "敗北" : "時間切れ";
    stopBgm();
    hud();
    window.clearTimeout(overTimer);
    window.clearInterval(overTimer);
    window.clearInterval(overTimer);
    let left = 10;
    overTimer = window.setInterval(() => {
      left -= 1;
      const tick = document.getElementById("overTick");
      if (tick) tick.textContent = left > 0
        ? ("残り" + left + "秒でタイトル画面に戻ります")
        : "タイトル画面に戻ります";
      if (left <= 0) {
        window.clearInterval(overTimer);
        quitToTitle();
      }
    }, 1000);
  }

  function tick() {
    if (paused) return;
    if (!running) return;
    if (wave >= 3 && deadline && Date.now() >= deadline) {
      gameOver();
      return;
    }
    hud();
    if (kindNow === "eishi" && wave >= 3 && deadline && !visDone) {
      const left = deadline - Date.now();
      if (left <= 60000 && left > 0) {
        visDone = true;
        visT = 240;
        announceSkill("可視化", "甘楽 藍依");
        showCutin("kanra", "l");
        const boss = foes.find((f) => f.boss);
        rings.push({ x: player.x, y: player.y, r: 10, max: 220, life: 36 });
        if (boss) rings.push({ x: boss.x, y: boss.y, r: 8, max: 160, life: 32 });
      }
    }
    if (kindNow === "tokka" && !joinDone && !joining && !(window.Settings && window.Settings.get("heart"))) {
      const boss = foes.find((f) => f.boss);
      const left = deadline ? deadline - Date.now() : 999999;
      if ((hp <= 50) || (wave >= 3 && left <= 30000 && boss && boss.hp >= 200)) {
        hp = Math.max(hp, 1);
        beginJoinTalk();
        return;
      }
    }
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = kindNow === "yozakura" ? "rgba(18, 8, 12, 0.28)" : "rgba(8,6,12,0.45)";
    ctx.fillRect(0, 0, w, h);

    const m = mod();
    const spec = BOSS;

    if (!player) resetPlayer();
    tickN += 1;
    tickStatus();
    if (spot && spot.life > 0) {
      spot.life -= 1;
      spot.x += (player.x - spot.x) * 0.04;
      spot.y += (player.y - 22 - spot.y) * 0.04;
      if (Math.hypot(player.x - spot.x, player.y - 22 - spot.y) > 54 && tickN % 24 === 0 && invuln <= 0) applyHit(4, "eishi");
      if (spot.life <= 0) spot = null;
    }
    if (scopeT > 0) {
      scopeT -= 1;
      if (scopeT === 0 && scopeFrom) {
        lasers.push({ x0: scopeFrom.x, y0: scopeFrom.y, x1: player.x, y1: player.y - 22, life: 28, hit: false, tint: "shigure" });
        lasers.push({ x0: w / 2, y0: 4, x1: player.x, y1: player.y - 22, life: 22, hit: false, tint: "shigure" });
        applyHit(26, "shigure");
        burst(player.x, player.y - 22, 22, "#ff4a4a");
        playCast("shigure-snipe");
        scopeFrom = null;
      }
    }
    const focus = !!keys.Shift;
    let spd = focus ? 1.8 : 3.4;
    if (hasStatus("wet") || hasStatus("seal")) spd *= 0.62;
    if (hasStatus("haste")) spd *= 1.35;
    if (hasStatus("ice") || hasStatus("grav") || hasStatus("stiff")) spd *= 0.55;
    if (hasStatus("lock")) spd = 0;
    let left = keys.ArrowLeft || keys.a;
    let right = keys.ArrowRight || keys.d;
    if (hasStatus("invert")) { const t = left; left = right; right = t; }
    if (left) player.x -= spd;
    if (right) player.x += spd;
    if (pullT > 0) {
      pullT -= 1;
      const boss = foes.find((f) => f.boss);
      if (boss) player.x += boss.x > player.x ? 0.9 : -0.9;
      if (pullT === 1 && boss) {
        for (let i = 0; i < 14; i += 1) fireDan(boss.x, boss.y, i * 0.449, 2.1, 12, 0.01);
        pickups.push({ x: boss.x, y: boss.y + 20, val: 0, hp: 14, life: 220, kind: "heart" });
      }
    }
    if (walls) {
      walls.life -= 1;
      walls.l = Math.min(walls.l + 0.55, w * 0.38);
      walls.r = Math.max(walls.r - 0.55, w * 0.62);
      if (player.x < walls.l + 10 || player.x > walls.r - 10) {
        if (invuln <= 0) applyHit(8, kindNow);
      }
      if (walls.life <= 0) {
        if (walls.gift) pickups.push({ x: w / 2, y: h * 0.62, val: 0, hp: 16, life: 240, kind: "heart" });
        walls = null;
      }
    }
    player.x = Math.max(14, Math.min(w - 14, player.x));
    trails.push({ x: player.x, y: player.y, life: 10 });
    if (trails.length > 8) trails.shift();

    if (cooldown > 0) cooldown -= 1;
    if (invuln > 0) invuln -= 1;
    Object.keys(skillCd).forEach((k) => {
      if (skillCd[k] > 0) skillCd[k] -= 1;
    });
    const bar = document.getElementById("skillBar");
    if (bar) {
      bar.querySelectorAll("[data-sk]").forEach((el) => {
        el.classList.toggle("is-cd", skillCd[el.dataset.sk] > 0);
        el.classList.toggle("is-ready", !skillCd[el.dataset.sk]);
        const cdEl = el.querySelector("[data-cd]");
        if (cdEl) {
          const left = skillCd[el.dataset.sk] || 0;
          cdEl.textContent = left > 0 ? (left / 60).toFixed(1) + "s" : "OK";
        }
      });
    }
    if ((keys[" "] || keys.Spacebar) && cooldown <= 0 && !hasStatus("hush")) {
      const dmg = hasStatus("rage") ? 2 : 1;
      shots.push({ x: player.x, y: player.y - 12, v: -6.2, vx: 0, dmg });
      if (hasStatus("double")) shots.push({ x: player.x + 10, y: player.y - 10, v: -6.2, vx: 0.4, dmg });
      shotsFired += 1;
      cooldown = hasStatus("rule") ? 18 : 12;
      if (window.Settings) window.Settings.shot();
    }
    if (keys["1"] && skillCd.s0 <= 0) useSkill(0);
    if (keys["2"] && skillCd.s1 <= 0) useSkill(1);
    if (keys["3"] && skillCd.s2 <= 0) useSkill(2);

    pickups.forEach((p) => {
      const dx = player.x - p.x, dy = player.y - 18 - p.y;
      const len = Math.hypot(dx, dy) || 1;
      p.x += dx / len * 4.2;
      p.y += dy / len * 4.2;
      p.life -= 1;
      if (len < 16) {
        if (p.kind === "bomb") {
          bombs = bombs.filter((b) => Math.hypot(b.x - player.x, b.y - player.y) > 90);
          totalScore += p.val || 40;
          rings.push({ x: player.x, y: player.y - 18, r: 10, max: 90, life: 18 });
          floats.push({ x: p.x, y: p.y, v: -1, life: 24, t: "祓" });
        } else if (p.kind === "heart" || p.hp) giveHeal(p.hp || 12, p.x, p.y);
        else { totalScore += p.val; floats.push({ x: p.x, y: p.y, v: -1, life: 24, t: "+" + p.val }); }
        p.life = 0;
      }
    });
    pickups = pickups.filter((p) => p.life > 0);

    shots.forEach((s) => {
      s.y += s.v;
      s.x += s.vx || 0;
    });
    shots = shots.filter((s) => s.y > -10 && s.x > -10 && s.x < w + 10);

    const liveBoss = foes.find((f) => f.boss);
    if (liveBoss) {
      const boss = liveBoss;
      if (boss) {
        boss.t += 1;
        if (true) {
          const now = performance.now();
          if (!boss.turnAt || now >= boss.turnAt) {
            if (Math.random() < 0.28) {
              boss.vx = 0;
              boss.vy = 0;
              boss.turnAt = now + 1100 + Math.random() * 1200;
            } else {
              const ang = Math.random() * Math.PI * 2;
              const spd = 0.55 + Math.random() * 0.55;
              boss.vx = Math.cos(ang) * spd;
              boss.vy = Math.sin(ang) * spd;
              boss.turnAt = now + 900 + Math.random() * 1100;
            }
          }
          boss.x += boss.vx || 0;
          boss.y += boss.vy || 0;
          const bw = boss.bw || boss.s;
          const bh = boss.bh || boss.s;
          const minX = 20 + bw / 2;
          const maxX = w - 20 - bw / 2;
          const minY = h * 0.1;
          const maxY = h * 0.38;
          if (boss.x < minX) { boss.x = minX; boss.vx = Math.abs(boss.vx); }
          if (boss.x > maxX) { boss.x = maxX; boss.vx = -Math.abs(boss.vx); }
          if (boss.y < minY) { boss.y = minY; boss.vy = Math.abs(boss.vy); }
          if (boss.y > maxY) { boss.y = maxY; boss.vy = -Math.abs(boss.vy); }
          fireBossArt(boss);
          fireBossNormal(boss);
          if (!winning && !over && tickN % 420 === 80 && foes.filter((f) => !f.boss).length < 4) {
            for (let i = 0; i < 2; i += 1) {
              foes.push({ boss: false, kind: kindNow, row: 0, col: i, x: w * (0.35 + i * 0.3), y: h * 0.15, s: 28, hp: 2, max: 2, t: 0, vx: i ? 1.2 : -1.2 });
            }
          }
          foes.forEach((f) => {
            if (f.boss) return;
            if (!f.vx) f.vx = 1.1;
            f.x += f.vx;
            f.y = h * 0.15;
            if (f.x < 36) { f.x = 36; f.vx = Math.abs(f.vx); }
            if (f.x > w - 36) { f.x = w - 36; f.vx = -Math.abs(f.vx); }
          });
          clones = clones.filter((c) => c.life > 0);
          clones.forEach((c) => {
            c.life -= 1;
            c.x += c.vx;
            c.y += c.vy;
            if (c.x < 20 || c.x > w - 20) c.vx *= -1;
            if (c.y < h * 0.08 || c.y > h * 0.36) c.vy *= -1;
          });
          if (clones.length && now - cloneShotAt > 700) {
            cloneShotAt = now;
            clones.forEach((c) => {
              const dx = player.x - c.x;
              const dy = Math.max(30, player.y - c.y);
              const len = Math.hypot(dx, dy) || 1;
              pushPumpkin(c.x, c.y, dx / len * 3.4, dy / len * 3.4, 13);
              pushPumpkin(c.x, c.y, dx / len * 2.6 - 0.8, dy / len * 2.6, 11);
              pushPumpkin(c.x, c.y, dx / len * 2.6 + 0.8, dy / len * 2.6, 11);
            });
          }
        } else {
          boss.x += dir * spec.speed * m.speed;
          boss.y = h * 0.22 + Math.sin(boss.t * 0.04) * 10;
          if (boss.x < boss.s * 0.6 || boss.x > w - boss.s * 0.6) dir *= -1;
          if (Math.random() < spec.fire * m.fire) {
            [-2.2, 0, 2.2].forEach((vx) => {
              bombs.push({ x: boss.x, y: boss.y + boss.s * 0.35, v: 2.8, vx });
            });
          }
        }
      }
    } else {
      let hitEdge = false;
      foes.forEach((f) => {
        const haste = 1 + (1 - foes.length / Math.max(1, gruntMax)) * 1.35;
        f.x += dir * spec.speed * m.speed * haste;
        if (f.x < 12 || f.x > w - 12) hitEdge = true;
      });
      if (hitEdge) {
        dir *= -1;
        foes.forEach((f) => { f.x += dir * 4; });
      }
      const nowS = performance.now();
      if (!saucer && nowS - saucerAt > 4200 && Math.random() < 0.012) {
        saucer = { x: -20, y: h * 0.08, vx: 2.2, hp: 1 };
        saucerAt = nowS;
      }
      if (saucer) {
        saucer.x += saucer.vx;
        if (saucer.x > w + 24) saucer = null;
      }
      foes.forEach((f) => {
        if (Math.random() >= (spec.fire * m.fire * 1.2) / Math.max(1, foes.length * 0.65)) return;
        if (bombs.length > 200) return;
        const base = Math.atan2(Math.max(24, player.y - f.y), player.x - f.x);
        if (kindNow === "samhain") {
          for (let i = -2; i <= 2; i += 1) fireDan(f.x, f.y + 6, Math.PI / 2 + i * 0.18, 2.1 + wave * 0.15, 10, 0.006);
        } else if (kindNow === "shigure") {
          fireDan(f.x, f.y + 6, Math.PI / 2, 2.4 + wave * 0.2, 10, 0);
          fireDan(f.x, f.y + 6, Math.PI / 2 + (f.col % 2 ? -0.22 : 0.22), 2.2, 9, 0);
        } else if (kindNow === "yozakura") {
          for (let i = -1; i <= 1; i += 1) fireDan(f.x, f.y + 6, Math.PI / 2 + i * 0.32, 2.0, 10, 0.01);
        } else if (kindNow === "eishi") {
          fireDan(f.x, f.y + 6, base, 1.7, 11, 0.008);
          fireDan(f.x, f.y + 6, base + 0.4, 1.5, 9, -0.008);
        } else {
          for (let i = -2; i <= 2; i += 1) fireDan(f.x, f.y + 6, Math.PI / 2 + i * 0.14, 2.3, 10, 0);
        }
      });
    }

    const bmul = hasStatus("slowb") ? 0.58 : 1;
    bombs.forEach((b) => {
      if (b.spin) {
        const spd = Math.hypot(b.vx || 0, b.v || 0) || 2;
        const ang = Math.atan2(b.v || 0, b.vx || 0) + b.spin;
        b.vx = Math.cos(ang) * spd;
        b.v = Math.sin(ang) * spd;
      }
      b.y += b.v * bmul;
      b.x += (b.vx || 0) * bmul;
    });
    bombs = bombs.filter((b) => {
      let hit = false;
      bunkers.forEach((k) => {
        if (k.hp > 0 && Math.abs(b.x - k.x) < (k.bw || 16) / 2 && Math.abs(b.y - k.y) < (k.bh || 14) / 2) {
          k.hp -= 1;
          hit = true;
        }
      });
      return !hit && b.y < h + 16 && b.y > -20 && b.x > -20 && b.x < w + 20;
    });
    bunkers = bunkers.filter((k) => k.hp > 0);

    shots.forEach((s) => {
      if (saucer && saucer.hp > 0 && Math.abs(s.x - saucer.x) < 16 && Math.abs(s.y - saucer.y) < 10) {
        saucer.hp = 0;
        s.y = -20;
        totalScore += 300;
        pickups.push({ x: saucer.x, y: saucer.y, val: 0, hp: 24, life: 300, kind: "heart" });
        if (window.Settings && window.Settings.fx) window.Settings.fx("gold");
      }
      bunkers.forEach((k) => {
        if (k.hp > 0 && Math.abs(s.x - k.x) < (k.bw || 16) / 2 && Math.abs(s.y - k.y) < (k.bh || 14) / 2) {
          k.hp -= 1;
          s.y = -20;
        }
      });
      marks.forEach((m) => {
        if (m.life > 0 && Math.abs(s.x - m.x) < (m.r || 20) && Math.abs(s.y - m.y) < (m.r || 20)) {
          m.life = 0;
          s.y = -20;
          giveHeal(10, m.x, m.y);
        }
      });
      foes.forEach((f) => {
        const hx = f.boss ? (f.bw || f.s) * 0.28 : f.s;
        const hy = f.boss ? (f.bh || f.s) * 0.38 : f.s;
        const pad = s.wide ? 10 : 0;
        if (f.hp > 0 && Math.abs(s.x - f.x) < hx + pad && Math.abs(s.y - f.y) < hy + pad) {
          f.hp -= s.dmg || 1;
          if (window.Settings && window.Settings.fx) window.Settings.fx(f.hp <= 0 ? (f.boss ? "dead_big" : "dead") : "hit");
          if (!s.ally) {
            shotsHit += 1;
            combo += 1;
            totalScore += 8;
            if (hasStatus("luck")) totalScore += 20;
            if (hasStatus("drain")) hp = Math.min(maxHp, hp + 1);
            comboT = 90;
            floats.push({ x: s.x, y: s.y, v: -1.2, life: 28, t: String(s.dmg || 1) });
            if (window.Records) window.Records.combo(combo);
          }
          pops.push({ x: s.x, y: s.y, life: f.boss ? 18 : 16, s: f.boss ? 22 : f.s });
          if (!f.boss && f.hp <= 0) {
            pickups.push({ x: f.x, y: f.y, val: 20 + wave * 10 + (f.row || 0) * 5, life: 300 });
            if (Math.random() < 0.28) pickups.push({ x: f.x + 8, y: f.y - 6, val: 0, hp: 10, life: 300, kind: "heart" });
            if (Math.random() < 0.12) pickups.push({ x: f.x - 8, y: f.y - 8, val: 40, life: 280, kind: "bomb" });
          }
          s.y = -20;
          hud();
        }
      });
    });
    foes = foes.filter((f) => f.hp > 0);

    bombs.forEach((b) => {
      const focus = !!(keys.Shift || keys.ShiftLeft || keys.ShiftRight);
      const hitR = (focus || hasStatus("tiny")) ? 3.2 : 6;
      const hitY = player.y - 22;
      const dx = Math.abs(b.x - player.x);
      const dy = Math.abs(b.y - hitY);
      if (!b.grazed && dx < 22 && dy < 22 && !(dx < hitR && dy < hitR)) {
        b.grazed = true;
        totalScore += 8;
        floats.push({ x: b.x, y: b.y, v: -0.8, life: 18, t: "擦" });
        grazeN += 1;
        if (grazeN >= 8) { grazeN = 0; giveHeal(8, player.x, player.y - 24); }
        if (window.Settings && window.Settings.fx) window.Settings.fx("graze");
      }
      if (invuln <= 0 && dx < hitR && dy < hitR) {
        b.y = h + 20;
        applyHit(b.pumpkin ? 16 : 10, b.kind || kindNow);
      }
    });

    const hitY = player.y - 22;
    lasers.forEach((L) => {
      L.life -= 1;
      if (L.hit || invuln > 0 || L.life <= 0) return;
      const ax = L.x1 - L.x0, ay = L.y1 - L.y0;
      const bx = player.x - L.x0, by = hitY - L.y0;
      const len = Math.hypot(ax, ay) || 1;
      const t = Math.max(0, Math.min(1, (bx * ax + by * ay) / (len * len)));
      const px = L.x0 + ax * t, py = L.y0 + ay * t;
      if (Math.hypot(player.x - px, hitY - py) < (hasStatus("guard") ? 4 : 7)) {
        L.hit = true;
        applyHit(hasStatus("guard") ? 6 : 22, kindNow);
      }
    });
    lasers = lasers.filter((L) => L.life > 0);
    marks.forEach((m) => {
      m.life -= 1;
      if (m.life === 1) {
        if (Math.hypot(player.x - m.x, player.y - 22 - m.y) < m.r + 8 && invuln <= 0) applyHit(18, kindNow);
        burst(m.x, m.y, 14, "#ffb060");
      }
    });
    marks = marks.filter((m) => m.life > 0);
    zones.forEach((z) => {
      z.life -= 1;
      if (Math.hypot(player.x - z.x, player.y - 22 - z.y) < z.r && tickN % 20 === 0) applyHit(3, kindNow);
    });
    zones = zones.filter((z) => z.life > 0);

    if (over || winning) return;

    const bossLive = foes.some((f) => f.boss && f.hp > 0);
    if (wave >= 3 && !bossLive && !winning) {
      foes = [];
      running = false;
      winning = true;
      banner = "勝利";
      if (window.Settings && window.Settings.fx) window.Settings.fx("win");
      bankScore();
      if (window.Records) {
        window.Records.addScore(totalScore);
        window.Records.clear(kindNow, !takenHit);
      }
      const word = document.getElementById("battleOutroWord");
      if (word) word.textContent = ((THEMES[kindNow] || {}).name || "敵") + "撃破";
      stopBgm();
      hud();
      const outro = document.getElementById("battleOutro");
      if (outro) {
        outro.hidden = false;
        outro.className = "battle-outro kind-" + kindNow;
      }
      window.clearTimeout(winTimer);
      winTimer = window.setTimeout(() => {
        const done = onWin;
        stop();
        if (done) done();
      }, 1250);
    } else if (foes.length === 0 && !winning && wave < 3) {
      spawnWave(wave + 1);
    }

    if (allyOn && kindNow === "tokka") {
      if (allyCd > 0) allyCd -= 1;
      else {
        allyCd = 600;
        const boss = foes.find((f) => f.boss);
        const tx = boss ? boss.x : w / 2;
        const ax = w / 2;
        const ay = h + 6;
        const pack = ["aim", "rain", "ring", "sweep", "pincer"];
        const kind = pack[Math.floor(Math.random() * pack.length)];
        showCutin("eishi", "l", true);
        announceSkill(kind === "aim" ? "権能の指" : kind === "rain" ? "闇雨" : kind === "ring" ? "沈黙の輪" : kind === "sweep" ? "尾の一閃" : "双翼", "緋ノ瀬 永視");
        if (kind === "aim" && boss) {
          const dx = tx - ax;
          const dy = boss.y - ay;
          const len = Math.hypot(dx, dy) || 1;
          pushPumpkin(ax, h - 8, dx / len * 3.2, dy / len * 3.2, 16);
        } else if (kind === "rain") {
          for (let i = 0; i < 8; i += 1) pushPumpkin(24 + i * ((w - 48) / 7), h - 8, (Math.random() - 0.5) * 1.2, -4.2, 13);
        } else if (kind === "ring" && boss) {
          for (let a = 0; a < Math.PI * 2; a += 0.7) pushPumpkin(tx, boss.y, Math.cos(a) * 2.4, Math.sin(a) * 2.4, 12);
        } else if (kind === "sweep") {
          for (let i = 0; i < 6; i += 1) pushPumpkin(ax, h - 8, -2.2 + i * 0.9, -3.6, 13);
        } else {
          pushPumpkin(20, h - 8, 2.8, -3.8, 13);
          pushPumpkin(w - 20, h - 8, -2.8, -3.8, 13);
        }
      }
    }

    trails.forEach((t, i) => {
      ctx.globalAlpha = 0.12 * ((i + 1) / trails.length);
      const selfImg0 = kindNow === "eishi" ? imgKanraBack : imgAmaseBack;
      const ph0 = Math.min(86, h * 0.2);
      const pw0 = ph0 * (198 / 434);
      if (selfImg0 && selfImg0.complete) ctx.drawImage(selfImg0, t.x - pw0 / 2, t.y - ph0 * 0.72, pw0, ph0);
      ctx.globalAlpha = 1;
    });
    const ph = Math.min(86, h * 0.2);
    const pw = ph * (198 / 434);
    const selfImg = kindNow === "eishi" ? imgKanraBack : imgAmaseBack;
    if (selfImg && selfImg.complete && selfImg.naturalWidth) {
      ctx.drawImage(selfImg, player.x - pw / 2, player.y - ph * 0.72, pw, ph);
    }
    if (hasStatus("guard")) {
      ctx.strokeStyle = "rgba(120, 200, 255, 0.7)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(player.x, player.y - 18, 22 + Math.sin(tickN / 6) * 2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = "rgba(180, 230, 255, 0.35)";
      ctx.beginPath();
      ctx.arc(player.x, player.y - 18, 16, 0, Math.PI * 2);
      ctx.stroke();
    }
    lasers.forEach((L) => {
      const a = Math.max(0.2, L.life / 52);
      const tint = L.tint || kindNow;
      const glow = tint === "yozakura" ? "255,120,170" : tint === "eishi" ? "90,40,140" : tint === "shigure" ? "200,40,50" : tint === "tokka" ? "232,196,80" : "255,140,30";
      ctx.strokeStyle = "rgba(" + glow + "," + (0.22 * a) + ")";
      ctx.lineWidth = 16;
      ctx.beginPath(); ctx.moveTo(L.x0, L.y0); ctx.lineTo(L.x1, L.y1); ctx.stroke();
      ctx.strokeStyle = "rgba(" + glow + "," + (0.7 * a) + ")";
      ctx.lineWidth = 6;
      ctx.beginPath(); ctx.moveTo(L.x0, L.y0); ctx.lineTo(L.x1, L.y1); ctx.stroke();
      ctx.strokeStyle = "rgba(255,250,230," + a + ")";
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(L.x0, L.y0); ctx.lineTo(L.x1, L.y1); ctx.stroke();
      ctx.fillStyle = "rgba(255,240,200," + a + ")";
      ctx.beginPath(); ctx.arc(L.x0, L.y0, 5 + (1 - a) * 10, 0, Math.PI * 2); ctx.fill();
    });
    if (walls) {
      ctx.fillStyle = "rgba(120, 16, 28, 0.38)";
      ctx.fillRect(0, 0, walls.l, h);
      ctx.fillRect(walls.r, 0, w - walls.r, h);
      ctx.fillStyle = "rgba(255, 210, 140, 0.85)";
      ctx.fillRect(walls.l - 3, 0, 5, h);
      ctx.fillRect(walls.r - 2, 0, 5, h);
      ctx.strokeStyle = "rgba(255,180,80,0.35)";
      ctx.setLineDash([6, 8]);
      ctx.strokeRect(walls.l, 8, walls.r - walls.l, h - 16);
      ctx.setLineDash([]);
    }
    marks.forEach((m) => {
      const p = 1 - m.life / 70;
      ctx.strokeStyle = "rgba(255,140,40," + (0.45 + p) + ")";
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(m.x, m.y, m.r * (0.4 + p * 0.7), 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(m.x - m.r, m.y); ctx.lineTo(m.x + m.r, m.y);
      ctx.moveTo(m.x, m.y - m.r); ctx.lineTo(m.x, m.y + m.r);
      ctx.stroke();
    });
    zones.forEach((z) => {
      const pulse = 1 + Math.sin(tickN / 7) * 0.06;
      ctx.fillStyle = "rgba(180, 40, 90, 0.16)";
      ctx.beginPath(); ctx.arc(z.x, z.y, z.r * pulse, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "rgba(255,160,190,0.45)";
      ctx.beginPath(); ctx.arc(z.x, z.y, z.r * pulse, 0, Math.PI * 2); ctx.stroke();
    });
    if (spot) {
      ctx.strokeStyle = "rgba(180,140,255,0.45)";
      ctx.beginPath(); ctx.arc(spot.x, spot.y, 54, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = "rgba(40,20,80,0.12)";
      ctx.beginPath(); ctx.arc(spot.x, spot.y, 54, 0, Math.PI * 2); ctx.fill();
    }
    if (scopeT > 0) {
      const sx = player.x, sy = player.y - 22;
      ctx.strokeStyle = "rgba(255,60,60," + (0.45 + (scopeT % 12) / 20) + ")";
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(sx, sy, 26, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(sx, sy, 10, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(sx - 40, sy); ctx.lineTo(sx + 40, sy);
      ctx.moveTo(sx, sy - 40); ctx.lineTo(sx, sy + 40);
      ctx.stroke();
      ctx.strokeStyle = "rgba(255,80,80,0.22)";
      ctx.beginPath();
      ctx.moveTo(scopeFrom ? scopeFrom.x : w / 2, 4);
      ctx.lineTo(sx, sy);
      ctx.stroke();
    }
    if (hasStatus("invert")) {
      ctx.strokeStyle = "rgba(180,220,255,0.25)";
      ctx.setLineDash([4, 6]);
      ctx.strokeRect(8, 8, w - 16, h - 16);
      ctx.setLineDash([]);
    }
    ctx.fillStyle = "#ff3a3a";
    ctx.beginPath();
    ctx.arc(player.x, player.y - 22, 3, 0, Math.PI * 2);
    ctx.fill();
    pops = pops.filter((p) => p.life > 0);
    pops.forEach((p) => {
      p.life -= 1;
      ctx.strokeStyle = "rgba(255,220,160," + (p.life / 16) + ")";
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.s * (1.2 + (16 - p.life) * 0.12), 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "rgba(255,180,80," + (p.life / 22) + ")";
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3 + (16 - p.life) * 0.4, 0, Math.PI * 2);
      ctx.fill();
    });
    if (!selfImg || !selfImg.naturalWidth) {
      ctx.fillStyle = "#f4e2c0";
      ctx.beginPath();
      ctx.moveTo(player.x, player.y - 12);
      ctx.lineTo(player.x - 11, player.y + 8);
      ctx.lineTo(player.x + 11, player.y + 8);
      ctx.closePath();
      ctx.fill();
    }

    ctx.fillStyle = theme.shot;
    shots.forEach((s) => {
      const bw = s.wide ? 5 : 3;
      const bh = s.wide ? 14 : 9;
      ctx.fillRect(s.x - bw / 2, s.y - bh / 2, bw, bh);
    });
    if (invuln > 0) {
      ctx.strokeStyle = "rgba(255, 226, 170, 0.55)";
      ctx.beginPath();
      ctx.arc(player.x, player.y, 18, 0, Math.PI * 2);
      ctx.stroke();
    }
    if (flash > 0) {
      ctx.fillStyle = "rgba(255, 236, 180," + (flash / 18) + ")";
      ctx.fillRect(0, 0, w, h);
      flash -= 1;
    }
    rings = rings.filter((r) => r.life > 0);
    rings.forEach((r) => {
      r.life -= 1;
      r.r += (r.max - r.r) * 0.18;
      ctx.strokeStyle = "rgba(255, 224, 168," + (r.life / 28) + ")";
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
      ctx.stroke();
    });
    bolts = bolts.filter((b) => b.life > 0);
    bolts.forEach((b) => {
      b.life -= 1;
      ctx.strokeStyle = "rgba(255, 240, 200," + (b.life / 16) + ")";
      ctx.beginPath();
      ctx.moveTo(player.x, player.y - 8);
      ctx.lineTo(b.x + (Math.random() * 8 - 4), b.y);
      ctx.stroke();
    });
    parts.forEach((p) => {
      p.life -= 1;
      p.x += p.vx;
      p.y += p.vy;
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, p.life / 20);
      ctx.fillRect(p.x, p.y, 2, 2);
      ctx.globalAlpha = 1;
    });
    parts = parts.filter((p) => p.life > 0);

    foes.forEach((f) => {
      if (f.boss) {
        const pic = imgBossMap[kindNow];
        const bw = f.bw || f.s;
        const bh = f.bh || f.s * 1.6;
        if (pic && pic.complete && pic.naturalWidth) {
          ctx.save();
          if (kindNow === "eishi" && !visDone) ctx.filter = "brightness(0)";
          ctx.drawImage(pic, f.x - bw / 2, f.y - bh * 0.12, bw, bh);
          ctx.restore();
        } else {
          ctx.fillStyle = theme.fill;
          ctx.fillRect(f.x - bw / 2, f.y, bw, bh * 0.5);
        }
        clones.forEach((c) => {
          if (!pic || !pic.naturalWidth) return;
          ctx.globalAlpha = 0.45;
          ctx.drawImage(pic, c.x - bw * 0.36, c.y - bh * 0.1, bw * 0.72, bh * 0.72);
          ctx.globalAlpha = 1;
        });
        const barW = Math.min(320, w * 0.72);
        const bx = (w - barW) / 2;
        const by = 48;
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(bx - 3, by - 3, barW + 6, 16);
        ctx.fillStyle = "#3a1408";
        ctx.fillRect(bx, by, barW, 10);
        ctx.fillStyle = theme.shot;
        ctx.fillRect(bx, by, barW * (f.hp / f.max), 10);
        ctx.fillStyle = "#ffe7c2";
        ctx.font = "700 15px 'Shippori Mincho', serif";
        ctx.textAlign = "center";
        ctx.fillText(f.hp + " / " + f.max, w / 2, by - 6);
      } else {
        drawGrunt(f);
      }
    });
    bunkers.forEach((k) => {
      const a = Math.max(0.35, k.hp / (k.max || 8));
      const bw = k.bw || 52, bh = k.bh || 28;
      ctx.globalAlpha = 0.55 + a * 0.4;
      if (kindNow === "samhain") {
        ctx.fillStyle = "#e07012";
        ctx.beginPath(); ctx.ellipse(k.x, k.y, bw / 2, bh / 2, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#1a0900";
        ctx.beginPath(); ctx.arc(k.x - 8, k.y - 3, 3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(k.x + 8, k.y - 3, 3, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#2f6b24";
        ctx.fillRect(k.x - 3, k.y - bh / 2 - 6, 6, 8);
      } else if (kindNow === "shigure") {
        ctx.fillStyle = "#8a1c24";
        ctx.fillRect(k.x - bw / 2, k.y - bh / 2, bw, bh);
        ctx.fillStyle = "#e8c484";
        ctx.fillRect(k.x - bw / 2, k.y - bh / 2, bw, 4);
      } else if (kindNow === "yozakura") {
        ctx.fillStyle = "#f0a8c8";
        ctx.beginPath(); ctx.ellipse(k.x, k.y, bw / 2, bh / 2, 0, 0, Math.PI * 2); ctx.fill();
      } else if (kindNow === "eishi") {
        ctx.fillStyle = "rgba(40,20,70,0.9)";
        ctx.beginPath(); ctx.ellipse(k.x, k.y, bw / 2, bh / 2, 0, 0, Math.PI * 2); ctx.fill();
      } else {
        ctx.fillStyle = "#e8c484";
        ctx.fillRect(k.x - bw / 2, k.y - bh / 2, bw, bh);
        ctx.fillStyle = "#7a1c28";
        ctx.fillRect(k.x - 3, k.y - bh / 2, 6, bh);
      }
      ctx.globalAlpha = 1;
    });
    pickups.forEach((p) => {
      ctx.fillStyle = p.kind === "heart" ? "#ff8aa0" : "#ffe08a";
      ctx.beginPath(); ctx.arc(p.x, p.y, 4.5, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = p.kind === "heart" ? "rgba(255,140,160,0.8)" : "rgba(255,220,140,0.7)";
      ctx.beginPath(); ctx.arc(p.x, p.y, 7, 0, Math.PI * 2); ctx.stroke();
    });
    if (saucer && saucer.hp > 0) {
      const x = saucer.x, y = saucer.y;
      if (kindNow === "samhain") {
        ctx.fillStyle = "#e07012";
        ctx.beginPath(); ctx.arc(x, y, 14, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#1a0900";
        ctx.beginPath(); ctx.arc(x - 5, y - 2, 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(x + 5, y - 2, 2, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#2f6b24";
        ctx.fillRect(x - 2, y - 16, 4, 6);
      } else if (kindNow === "shigure") {
        ctx.fillStyle = "#8a1c24";
        ctx.fillRect(x - 16, y - 5, 32, 10);
        ctx.fillStyle = "#e8c484";
        ctx.fillRect(x - 16, y - 7, 32, 3);
      } else if (kindNow === "yozakura") {
        ctx.fillStyle = "#f0a8c8";
        ctx.beginPath(); ctx.ellipse(x, y, 16, 7, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.beginPath(); ctx.arc(x, y - 2, 4, 0, Math.PI * 2); ctx.fill();
      } else if (kindNow === "eishi") {
        ctx.fillStyle = "rgba(40,20,70,0.9)";
        ctx.beginPath(); ctx.ellipse(x, y, 15, 6, 0, 0, Math.PI * 2); ctx.fill();
      } else {
        ctx.fillStyle = "#e8c484";
        ctx.beginPath(); ctx.ellipse(x, y, 16, 6, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#7a1c28";
        ctx.fillRect(x - 2, y - 6, 4, 12);
      }
    }
    ctx.fillStyle = "rgba(232,196,132,0.35)";
    ctx.fillRect(8, h - 10, w - 16, 2);

    bombs.forEach((b) => {
      const r = b.r || 5;
      const k = b.kind || (b.pumpkin ? "samhain" : kindNow);
      if (k === "samhain") {
        ctx.fillStyle = "#e07012";
        ctx.beginPath();
        ctx.arc(b.x, b.y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#ffb24a";
        ctx.beginPath();
        ctx.arc(b.x - 1, b.y - 1, r * 0.45, 0, Math.PI * 2);
        ctx.fill();
      } else if (k === "shigure") {
        ctx.fillStyle = "#c43a3a";
        ctx.beginPath();
        ctx.moveTo(b.x, b.y - r);
        ctx.lineTo(b.x + r * 0.85, b.y);
        ctx.lineTo(b.x, b.y + r);
        ctx.lineTo(b.x - r * 0.85, b.y);
        ctx.closePath();
        ctx.fill();
      } else if (k === "yozakura") {
        ctx.fillStyle = "#f0a8c8";
        for (let i = 0; i < 5; i += 1) {
          const a = (Math.PI * 2 * i) / 5;
          ctx.beginPath();
          ctx.ellipse(b.x + Math.cos(a) * r * 0.45, b.y + Math.sin(a) * r * 0.45, r * 0.38, r * 0.22, a, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = "#ffe4f0";
        ctx.beginPath();
        ctx.arc(b.x, b.y, r * 0.2, 0, Math.PI * 2);
        ctx.fill();
      } else if (k === "eishi") {
        ctx.fillStyle = "rgba(70, 40, 120, 0.9)";
        ctx.beginPath();
        ctx.arc(b.x, b.y, r * 1.1, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#1a0c22";
        ctx.beginPath();
        ctx.arc(b.x, b.y, r * 0.55, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = "#8b1e2d";
        ctx.fillRect(b.x - r * 0.7, b.y - r * 0.7, r * 1.4, r * 1.4);
        ctx.fillStyle = "#f0c27a";
        ctx.fillRect(b.x - r * 0.28, b.y - r * 0.28, r * 0.56, r * 0.56);
      }
    });

    if (visT > 0) visT -= 1;
    if (hurtT > 0) {
      hurtT -= 1;
      ctx.fillStyle = "rgba(180, 20, 30," + (0.38 * (hurtT / 18)) + ")";
      ctx.fillRect(0, 0, w, h);
    }

    if (veilT > 0) {
      veilT -= 1;
      ctx.fillStyle = "rgba(0, 0, 0," + (0.97 * Math.min(1, veilT / 20)) + ")";
      ctx.fillRect(0, 0, w, h);
      if (veilT <= 0) {
        const cover = document.getElementById("battleVeil");
        if (cover) {
          cover.classList.remove("is-on");
          cover.hidden = true;
        }
      }
    }

    if (bannerT > 0) {
      bannerT -= 1;
      ctx.fillStyle = "rgba(255,236,210,0.9)";
      ctx.font = "700 22px 'Shippori Mincho', serif";
      ctx.textAlign = "center";
      ctx.fillText(banner, w / 2, h * 0.46);
    }

    if (hasStatus("mist")) {
      ctx.fillStyle = "rgba(20, 16, 28, 0.28)";
      ctx.fillRect(0, 0, w, h);
    }
    if (hp / Math.max(1, maxHp) < 0.28) {
      ctx.fillStyle = "rgba(120, 8, 18, 0.22)";
      ctx.fillRect(0, 0, w, 16);
      ctx.fillRect(0, h - 16, w, 16);
      ctx.fillRect(0, 0, 16, h);
      ctx.fillRect(w - 16, 0, 16, h);
    }

    if (comboT > 0) comboT -= 1;
    else combo = 0;
    floats = floats.filter((n) => {
      n.y += n.v;
      n.life -= 1;
      ctx.fillStyle = "rgba(255,230,180," + Math.max(0, n.life / 28) + ")";
      ctx.font = "700 14px 'Shippori Mincho', serif";
      ctx.textAlign = "center";
      ctx.fillText(n.t, n.x, n.y);
      return n.life > 0;
    });
    if (combo > 1 && comboT > 0) {
      ctx.fillStyle = "#ffe7c2";
      ctx.font = "700 16px Cinzel, serif";
      ctx.textAlign = "left";
      ctx.fillText(combo + " HIT", 12, h - 18);
    }

    const wrap = document.getElementById("vnBattle");
    if (wrap) wrap.classList.toggle("hide-hud", hideHud);

    raf = window.requestAnimationFrame(tick);
  }

  function resize() {
    if (!canvas) return;
    const box = canvas.parentElement;
    w = canvas.width = Math.max(320, Math.floor(box.clientWidth || 640));
    h = canvas.height = Math.max(180, Math.floor(box.clientHeight || 360));
  }

  function onKey(e) {
    if (joining && e.type === "keydown" && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      advanceJoin();
      return;
    }
    if (e.key === "Escape" && e.type === "keydown") {
      e.preventDefault();
      togglePause();
      return;
    }
    if ((e.key === "h" || e.key === "H") && e.type === "keydown") {
      hideHud = !hideHud;
      return;
    }
    if ((e.key === "r" || e.key === "R") && e.type === "keydown") {
      start(kindNow, onWin);
      return;
    }
    keys.Shift = !!e.shiftKey;
    if (paused || !running) {
      if (e.type === "keyup") {
        const k = normKey(e);
        keys[k] = false;
        keys[e.key] = false;
      }
      return;
    }
    const k = normKey(e);
    keys[k] = e.type === "keydown";
    keys[e.key] = e.type === "keydown";
    if (["ArrowLeft", "ArrowRight", " ", "a", "A", "d", "D", "1", "2", "3"].includes(e.key)) e.preventDefault();
  }

  function normKey(e) {
    if (e.key === "A" || e.key === "a") return "a";
    if (e.key === "D" || e.key === "d") return "d";
    return e.key;
  }

  function showPauseBtn(on) {
    const b = document.getElementById("battlePauseBtn");
    if (b) b.hidden = !on;
  }

  function paintJoinLine() {
    const name = document.getElementById("joinName");
    const text = document.getElementById("joinText");
    const line = JOIN_LINES[joinI];
    if (!line) return;
    if (name) name.textContent = line[0] === "永視" ? "緋ノ瀬 永視" : "天瀬 若葉";
    if (text) text.textContent = line[1];
  }

  function endJoinTalk() {
    const box = document.getElementById("battleJoin");
    if (box) box.hidden = true;
    const anim = document.getElementById("battleJoinAnim");
    if (anim) {
      anim.hidden = false;
      anim.classList.remove("is-play");
      void anim.offsetWidth;
      anim.classList.add("is-play");
    }
    window.setTimeout(() => {
      if (anim) anim.hidden = true;
      joining = false;
      joinDone = true;
      allyOn = true;
      startCount();
    }, 2200);
  }

  function advanceJoin() {
    if (!joining) return;
    joinI += 1;
    if (joinI >= JOIN_LINES.length) endJoinTalk();
    else paintJoinLine();
  }

  function beginJoinTalk() {
    if (joining || joinDone) return;
    joining = true;
    running = false;
    joinI = 0;
    bombs = [];
    showPauseBtn(false);
    setPausePanel(false);
    const box = document.getElementById("battleJoin");
    if (box) box.hidden = false;
    paintJoinLine();
  }

  function setPausePanel(on) {
    const el = document.getElementById("battlePause");
    if (el) el.hidden = !on;
  }

  function togglePause() {
    const wrap = document.getElementById("vnBattle");
    if (!wrap || wrap.hidden) return;
    if (over || winning || introing || joining) return;
    if (togglePause._lock && Date.now() - togglePause._lock < 250) return;
    togglePause._lock = Date.now();
    paused = !paused;
    if (paused) {
      pauseAt = Date.now();
      running = false;
      if (bgm) bgm.pause();
      const sub = document.getElementById("pauseSub");
      if (sub) sub.textContent = "SCORE " + totalScore + "　連撃 " + combo;
      const wrap = document.getElementById("vnBattle");
      if (wrap) wrap.classList.add("is-paused");
      setPausePanel(true);
    } else {
      if (deadline) deadline += Date.now() - pauseAt;
      running = true;
      if (bgm && bgm.src) bgm.play().catch(() => {});
      const wrapOn = document.getElementById("vnBattle");
      if (wrapOn) wrapOn.classList.remove("is-paused");
      setPausePanel(false);
      window.cancelAnimationFrame(raf);
      raf = window.requestAnimationFrame(tick);
    }
  }

  function startCount() {
    const el = document.getElementById("battleCount");
    let n = 3;
    showPauseBtn(false);
    if (el) {
      el.hidden = false;
      el.className = "battle-count is-tick";
      el.textContent = String(n);
    }
    window.clearInterval(countTimer);
    countTimer = window.setInterval(() => {
      n -= 1;
      if (n <= 0) {
        window.clearInterval(countTimer);
        if (el) {
          el.textContent = "開戦";
          if (window.Settings && window.Settings.fx) window.Settings.fx("go");
          el.className = "battle-count is-go";
          window.setTimeout(() => { el.hidden = true; el.className = "battle-count"; }, 420);
        }
        running = true;
        if (!joinDone) deadline = 0;
        showPauseBtn(true);
        window.cancelAnimationFrame(raf);
        raf = window.requestAnimationFrame(tick);
      } else if (el) {
        el.className = "battle-count is-tick";
        void el.offsetWidth;
        el.textContent = String(n);
        if (window.Settings && window.Settings.fx) window.Settings.fx("count");
      }
    }, 1000);
  }

  function start(kind, win) {
    canvas = document.getElementById("battleCanvas");
    if (!canvas) return;
    ctx = canvas.getContext("2d");
    theme = THEMES[kind] || THEMES.samhain;
    kindNow = kind || "samhain";
    onWin = win;
    window.removeEventListener("keydown", onKey);
    window.removeEventListener("keyup", onKey);
    running = false;
    introing = true;
    over = false;
    winning = false;
    paused = false;
    setPausePanel(false);
    showPauseBtn(false);
    window.clearTimeout(winTimer);
    window.clearTimeout(overTimer);
    window.clearInterval(overTimer);
    window.clearTimeout(introTimer);
    const panel = document.getElementById("battleOver");
    if (panel) panel.hidden = true;
    lives = 3;
    const heart = window.Settings && window.Settings.get("heart");
    maxHp = heart ? 1 : 200;
    hp = maxHp;
    shotsFired = 0;
    shotsHit = 0;
    combo = 0;
    comboT = 0;
    floats = [];
    takenHit = false;
    hideHud = false;
    statuses = [];
    lasers = [];
    tickN = 0;
    zones = [];
    walls = null;
    marks = [];
    pullT = 0;
    scopeT = 0;
    scopeFrom = null;
    paintStatus();
    joinDone = !!heart;
    joining = false;
    allyOn = false;
    allyCd = 0;
    veilT = 0;
    visT = 0;
    visDone = false;
    hurtT = 0;
    wave = 1;
    shots = [];
    bombs = [];
    keys = {};
    skillCd = { s0: 0, s1: 0, s2: 0 };
    invuln = 0;
    flash = 0;
    rings = [];
    bolts = [];
    parts = [];
    pops = [];
    artT = 0;
    artI = 0;
    paintSkills();
    const phone = window.Settings && window.Settings.get("device") === "phone";
    ["touchMove", "touchShot"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.hidden = !phone;
    });
    const wrap = document.getElementById("vnBattle");
    if (wrap) {
      wrap.hidden = false;
      wrap.className = "vn-battle kind-" + kindNow;
    }
    resize();
    resetPlayer();
    spawnWave(1);
    const intro = document.getElementById("battleIntro");
    const introName = document.getElementById("battleIntroName");
    if (intro) {
      intro.hidden = false;
      intro.className = "battle-intro kind-" + kindNow;
      if (introName) introName.textContent = (THEMES[kindNow] || THEMES.samhain).name;
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKey);
    window.cancelAnimationFrame(raf);
    introTimer = window.setTimeout(() => {
      introing = false;
      if (intro) intro.hidden = true;
      startCount();
    }, 1900);
  }

  function bindOver() {
    const retry = document.getElementById("battleRetry");
    const title = document.getElementById("battleTitle");
    if (retry && !retry.dataset.bound) {
      retry.dataset.bound = "1";
      retry.addEventListener("click", (e) => {
        e.stopPropagation();
        start(kindNow, onWin);
      });
    }
    if (title && !title.dataset.bound) {
      title.dataset.bound = "1";
      title.addEventListener("click", (e) => {
        e.stopPropagation();
        quitToTitle();
      });
    }
    const resume = document.getElementById("pauseResume");
    const toTitle = document.getElementById("pauseTitle");
    const toSet = document.getElementById("pauseSettings");
    if (resume && !resume.dataset.bound) {
      resume.dataset.bound = "1";
      resume.addEventListener("click", (e) => { e.stopPropagation(); if (paused) togglePause(); });
    }
    if (toTitle && !toTitle.dataset.bound) {
      toTitle.dataset.bound = "1";
      toTitle.addEventListener("click", (e) => { e.stopPropagation(); quitToTitle(); });
    }
    const pauseRetry = document.getElementById("pauseRetry");
    if (pauseRetry && !pauseRetry.dataset.bound) {
      pauseRetry.dataset.bound = "1";
      pauseRetry.addEventListener("click", (e) => {
        e.stopPropagation();
        start(kindNow, onWin);
      });
    }
    if (toSet && !toSet.dataset.bound) {
      toSet.dataset.bound = "1";
      toSet.addEventListener("click", (e) => {
        e.stopPropagation();
        if (window.App && window.App.openSettings) window.App.openSettings("battle");
      });
    }
    if (!window._keyClearBound) {
      window._keyClearBound = true;
      window.addEventListener("blur", () => { keys = {}; });
      document.addEventListener("visibilitychange", () => { if (document.hidden) keys = {}; });
    }
    const pauseBtn = document.getElementById("battlePauseBtn");
    if (pauseBtn && !pauseBtn.dataset.bound) {
      pauseBtn.dataset.bound = "1";
      pauseBtn.addEventListener("click", (e) => { e.stopPropagation(); togglePause(); });
    }
    const pads = [document.getElementById("touchMove"), document.getElementById("touchShot")];
    pads.forEach((pad) => {
    if (pad && !pad.dataset.bound) {
      pad.dataset.bound = "1";
      pad.querySelectorAll("[data-touch]").forEach((btn) => {
        const setHold = (on) => {
          const t = btn.dataset.touch;
          if (t === "left") keys.ArrowLeft = on;
          if (t === "right") keys.ArrowRight = on;
          if (t === "shot") keys[" "] = on;
        };
        btn.addEventListener("pointerdown", (e) => {
          e.preventDefault();
          e.stopPropagation();
          const t = btn.dataset.touch;
          if (t === "s0") useSkill(0);
          else if (t === "s1") useSkill(1);
          else if (t === "s2") useSkill(2);
          else setHold(true);
        });
        ["pointerup", "pointerleave", "pointercancel"].forEach((ev) => {
          btn.addEventListener(ev, () => setHold(false));
        });
      });
    }
    });
    const joinBox = document.getElementById("battleJoin");
    if (joinBox && !joinBox.dataset.bound) {
      joinBox.dataset.bound = "1";
      joinBox.addEventListener("click", (e) => { e.stopPropagation(); advanceJoin(); });
    }
  }

  function quitToTitle() {
    stop();
    if (window.Story && window.Story.finish) window.Story.finish();
  }

  function stop() {
    running = false;
    over = false;
    winning = false;
    window.clearTimeout(winTimer);
    window.clearTimeout(overTimer);
    window.clearInterval(overTimer);
    window.clearTimeout(introTimer);
    window.clearInterval(countTimer);
    introing = false;
    paused = false;
    setPausePanel(false);
    const count = document.getElementById("battleCount");
    if (count) count.hidden = true;
    const veil = document.getElementById("battleVeil");
    if (veil) { veil.hidden = true; veil.classList.remove("is-on"); }
    const intro = document.getElementById("battleIntro");
    if (intro) intro.hidden = true;
    const outro = document.getElementById("battleOutro");
    if (outro) outro.hidden = true;
    stopBgm();
    window.cancelAnimationFrame(raf);
    window.removeEventListener("keydown", onKey);
    window.removeEventListener("keyup", onKey);
    const wrap = document.getElementById("vnBattle");
    if (wrap) wrap.hidden = true;
    ["touchMove", "touchShot"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.hidden = true;
    });
    const panel = document.getElementById("battleOver");
    if (panel) panel.hidden = true;
  }

  bindOver();

  return {
    start,
    stop,
    playTheme,
    stopBgm,
    togglePause,
    isActive: () => {
      const wrap = document.getElementById("vnBattle");
      return !!(wrap && !wrap.hidden);
    },
    isPlaying: () => running || over || winning || introing || paused
  };
})();
