window.Settings = (() => {
  const KEY = "yumekai-settings-v4";
  const DEFAULTS = {
    window: "n",
    auto: false,
    se: true,
    bgmVol: "m",
    heart: false,
    device: "pc",
    skipRead: false,
    motion: true,
    text: "n",
    slot: "1"
  };

  let data = { ...DEFAULTS };

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) data = { ...DEFAULTS, ...JSON.parse(raw) };
    } catch (e) {
      data = { ...DEFAULTS };
    }
  }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { /* ignore */ }
  }

  function apply() {
    const ui = document.getElementById("vnUi");
    if (ui) {
      ui.classList.remove("win-l", "win-n", "win-h");
      ui.classList.add(`win-${data.window}`);
    }
    window.dispatchEvent(new Event("resize"));
    document.body.classList.toggle("is-still", data.motion === false);
  }

  function get(key) {
    return data[key];
  }

  function set(key, value) {
    data[key] = value;
    save();
    apply();
  }

  function textMs() {
    return { s: 36, n: 18, f: 8 }[data.text] ?? 18;
  }

  function autoMs() {
    return data.auto ? 3000 : 0;
  }

  function battleMod() {
    return { speed: 1, fire: 1, hp: 1 };
  }

  function battleLimit() {
    return 180000;
  }

  function battleLives() {
    return 3;
  }

  function bgmVolume() {
    return { x: 0, l: 0.7, m: 1, h: 1 }[data.bgmVol] ?? 1;
  }

  function moodLevel() {
    return data.mood || "n";
  }

  let audio;
  function ctx() {
    if (!audio) audio = new (window.AudioContext || window.webkitAudioContext)();
    if (audio.state === "suspended") audio.resume();
    return audio;
  }

  function tone(freq, dur, type, gain, delay) {
    if (!data.se) return;
    try {
      const ac = ctx();
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.type = type || "sine";
      o.frequency.value = freq;
      const t = ac.currentTime + (delay || 0);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime((gain || 0.05) * 3.2, t + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g);
      g.connect(ac.destination);
      o.start(t);
      o.stop(t + dur + 0.02);
    } catch (e) { /* ignore */ }
  }

  function beep(freq) {
    tone(freq || 720, 0.07, "sine", 0.04, 0);
  }

  function shot() {
    if (!data.se) return;
    try {
      const ac = ctx();
      const t = ac.currentTime;
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.type = "triangle";
      o.frequency.setValueAtTime(520, t);
      o.frequency.exponentialRampToValueAtTime(1480, t + 0.08);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.12, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);
      o.connect(g);
      g.connect(ac.destination);
      o.start(t);
      o.stop(t + 0.12);
      tone(2100, 0.04, "sine", 0.02, 0.02);
    } catch (e) { /* ignore */ }
  }

  function hover() {
    tone(784, 0.07, "sine", 0.045, 0);
    tone(1175, 0.09, "triangle", 0.035, 0.045);
    tone(1568, 0.07, "sine", 0.022, 0.09);
  }

  function talk(who) {
    const map = {
      天瀬: [880, 1046],
      甘楽: [740, 830],
      サウィン: [620, 698],
      時雨: [520, 587],
      夜桜: [784, 880],
      永視: [466, 523],
      統華: [698, 784]
    };
    const pair = map[who] || [700, 784];
    const f = pair[Math.random() < 0.5 ? 0 : 1];
    tone(f, 0.05, "sine", 0.05, 0);
    tone(f * 1.5, 0.035, "triangle", 0.028, 0.02);
  }

  function skillCue(kind) {
    if (kind === "beam") {
      tone(880, 0.16, "sawtooth", 0.04, 0);
      tone(180, 0.18, "triangle", 0.02, 0.04);
    } else if (kind === "spread") {
      tone(520, 0.08, "square", 0.035, 0);
      tone(660, 0.1, "triangle", 0.025, 0.04);
      tone(880, 0.06, "square", 0.018, 0.08);
    } else if (kind === "purge") {
      tone(180, 0.28, "sawtooth", 0.045, 0);
      tone(520, 0.16, "triangle", 0.025, 0.08);
    } else {
      tone(392, 0.1, "triangle", 0.035, 0);
      tone(523, 0.12, "triangle", 0.03, 0.08);
    }
  }

  function announce() {
    tone(392, 0.1, "triangle", 0.04, 0);
    tone(523, 0.12, "triangle", 0.035, 0.08);
    tone(659, 0.14, "triangle", 0.03, 0.16);
  }

  function noise(dur, gain) {
    if (!data.se) return;
    try {
      const ac = ctx();
      const len = Math.max(1, Math.floor(ac.sampleRate * dur));
      const buf = ac.createBuffer(1, len, ac.sampleRate);
      const ch = buf.getChannelData(0);
      for (let i = 0; i < len; i += 1) ch[i] = Math.random() * 2 - 1;
      const src = ac.createBufferSource();
      src.buffer = buf;
      const g = ac.createGain();
      const t = ac.currentTime;
      g.gain.setValueAtTime(Math.max(0.0001, gain || 0.04), t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      src.connect(g);
      g.connect(ac.destination);
      src.start(t);
      src.stop(t + dur + 0.02);
    } catch (e) { /* ignore */ }
  }

  function fx(name) {
    if (!data.se) return;
    const n = name || "tick";
    if (n === "dead") { noise(0.09, 0.05); tone(220, 0.12, "square", 0.03, 0); tone(110, 0.16, "sawtooth", 0.02, 0.03); }
    else if (n === "dead_big") { noise(0.18, 0.06); tone(90, 0.28, "sawtooth", 0.04, 0); tone(180, 0.2, "triangle", 0.03, 0.05); }
    else if (n === "hit") { tone(1400, 0.04, "square", 0.025, 0); noise(0.04, 0.03); }
    else if (n === "hurt") { noise(0.12, 0.06); tone(160, 0.16, "sawtooth", 0.04, 0); tone(90, 0.2, "sine", 0.03, 0.04); }
    else if (n === "graze") { tone(1860, 0.05, "sine", 0.025, 0); tone(2400, 0.04, "triangle", 0.018, 0.02); }
    else if (n === "laser") { tone(320, 0.22, "sawtooth", 0.035, 0); tone(880, 0.16, "triangle", 0.025, 0.04); noise(0.1, 0.03); }
    else if (n === "snipe") { tone(980, 0.08, "square", 0.03, 0); tone(1480, 0.2, "sine", 0.04, 0.06); noise(0.08, 0.04); }
    else if (n === "lock") { tone(440, 0.1, "triangle", 0.03, 0); tone(220, 0.14, "sine", 0.025, 0.08); }
    else if (n === "guard") { tone(523, 0.1, "triangle", 0.03, 0); tone(784, 0.12, "sine", 0.025, 0.06); }
    else if (n === "art") { tone(196, 0.16, "sawtooth", 0.04, 0); tone(392, 0.14, "triangle", 0.03, 0.05); tone(784, 0.1, "sine", 0.02, 0.1); }
    else if (n === "skill") { tone(659, 0.08, "triangle", 0.035, 0); tone(880, 0.1, "sine", 0.028, 0.05); }
    else if (n === "wave") { tone(392, 0.1, "triangle", 0.03, 0); tone(523, 0.12, "triangle", 0.03, 0.08); tone(659, 0.14, "triangle", 0.028, 0.16); }
    else if (n === "win") { tone(523, 0.12, "triangle", 0.04, 0); tone(659, 0.12, "triangle", 0.04, 0.08); tone(784, 0.16, "triangle", 0.04, 0.16); tone(1046, 0.22, "sine", 0.035, 0.26); }
    else if (n === "lose") { tone(196, 0.22, "sawtooth", 0.04, 0); tone(147, 0.28, "triangle", 0.035, 0.1); noise(0.2, 0.04); }
    else if (n === "count") { tone(880, 0.12, "square", 0.035, 0); }
    else if (n === "go") { tone(523, 0.08, "triangle", 0.03, 0); tone(1046, 0.16, "sine", 0.04, 0.06); }
    else if (n === "pause") { tone(330, 0.08, "sine", 0.03, 0); tone(262, 0.1, "sine", 0.025, 0.06); }
    else if (n === "status") { tone(698, 0.07, "triangle", 0.028, 0); tone(466, 0.1, "sine", 0.022, 0.05); }
    else if (n === "clone") { tone(300, 0.1, "square", 0.03, 0); tone(450, 0.1, "square", 0.025, 0.07); }
    else if (n === "ring") { tone(420, 0.14, "triangle", 0.03, 0); tone(840, 0.1, "sine", 0.02, 0.08); }
    else if (n === "rain") { noise(0.16, 0.035); tone(980, 0.06, "sine", 0.018, 0.02); }
    else if (n === "mark") { tone(1175, 0.08, "square", 0.03, 0); tone(1568, 0.1, "sine", 0.022, 0.06); }
    else if (n === "crush") { tone(80, 0.22, "sawtooth", 0.045, 0); noise(0.14, 0.05); }
    else if (n === "invert") { tone(400, 0.08, "square", 0.03, 0); tone(250, 0.1, "square", 0.028, 0.07); }
    else if (n === "explode") { noise(0.14, 0.06); tone(120, 0.18, "sawtooth", 0.04, 0); }
    else if (n === "spark") { tone(2100, 0.04, "sine", 0.022, 0); tone(2800, 0.03, "triangle", 0.016, 0.02); }
    else if (n === "whoosh") { noise(0.12, 0.04); tone(240, 0.12, "sine", 0.02, 0); }
    else if (n === "petal") { tone(988, 0.07, "sine", 0.025, 0); tone(1318, 0.08, "triangle", 0.02, 0.04); }
    else if (n === "dark") { tone(90, 0.24, "sine", 0.04, 0); tone(60, 0.28, "triangle", 0.03, 0.06); }
    else if (n === "gold") { tone(784, 0.08, "triangle", 0.03, 0); tone(1175, 0.1, "sine", 0.025, 0.05); }
    else if (n === "pump") { tone(196, 0.1, "square", 0.03, 0); tone(247, 0.08, "triangle", 0.022, 0.05); }
    else if (n === "tick") { tone(880, 0.04, "sine", 0.02, 0); }
    else { tone(520, 0.06, "triangle", 0.025, 0); }
  }

  function panelHtml(mode) {
    const opt = (key, val, label) =>
      `<button type="button" class="set-opt${String(data[key]) === String(val) ? " on" : ""}" data-k="${key}" data-v="${val}">${label}</button>`;
    return `
      <div class="settings-grid">
        <p>会話ウィンドウ</p>
        <div class="set-row">${opt("window", "l", "薄")}${opt("window", "n", "並")}${opt("window", "h", "濃")}</div>
        <p>自動送り</p>
        <div class="set-row">${opt("auto", true, "入")}${opt("auto", false, "切")}</div>
        <p>効果音</p>
        <div class="set-row">${opt("se", true, "入")}${opt("se", false, "切")}</div>
        <p>BGMの音量</p>
        <div class="set-row">${opt("bgmVol", "x", "無")}${opt("bgmVol", "l", "小")}${opt("bgmVol", "m", "中")}${opt("bgmVol", "h", "大")}</div>
        ${mode === "battle" ? "" : `<p>ワンハートモード</p><div class="set-row">${opt("heart", true, "入")}${opt("heart", false, "切")}</div>`}
        <p>既読スキップ</p>
        <div class="set-row">${opt("skipRead", true, "入")}${opt("skipRead", false, "切")}</div>
        <p>動きを抑える</p>
        <div class="set-row">${opt("motion", false, "入")}${opt("motion", true, "切")}</div>
        <p>文字速度</p>
        <div class="set-row">${opt("text", "s", "遅")}${opt("text", "n", "並")}${opt("text", "f", "速")}</div>
        <p>記録スロット</p>
        <div class="set-row">${opt("slot", "1", "一")}${opt("slot", "2", "二")}${opt("slot", "3", "三")}</div>
        <p class="set-note" id="setRecord"></p>
        <div class="set-row"><button type="button" class="set-opt" id="setHelp">操作一覧</button><button type="button" class="set-opt" id="setExport">記録を書き出す</button></div>
      </div>
    `;
  }

  function bindPanel(root, mode) {
    root.querySelectorAll(".set-opt").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!btn.dataset.k) return;
        let val = btn.dataset.v;
        if (val === "true") val = true;
        else if (val === "false") val = false;
        set(btn.dataset.k, val);
        root.innerHTML = panelHtml(mode);
        bindPanel(root, mode);
      });
    });
    const rec = root.querySelector("#setRecord");
    if (rec && window.Records) rec.textContent = window.Records.summary();
    const help = root.querySelector("#setHelp");
    if (help) help.addEventListener("click", (e) => { e.stopPropagation(); window.App && window.App.showHelp && window.App.showHelp(); });
    const exp = root.querySelector("#setExport");
    if (exp) exp.addEventListener("click", (e) => { e.stopPropagation(); window.Records && window.Records.export(); });
  }

  function coin() {
    tone(980, 0.08, "sine", 0.09, 0);
    tone(1310, 0.1, "triangle", 0.08, 0.05);
    tone(1760, 0.14, "sine", 0.06, 0.1);
  }

  load();
  window.addEventListener("DOMContentLoaded", apply);
  apply();

  return {
    get, set, apply, textMs, autoMs, battleMod, battleLimit, battleLives, bgmVolume, moodLevel,
    beep, hover, coin, shot, talk, skillCue, announce, fx, panelHtml, bindPanel
  };
})();
