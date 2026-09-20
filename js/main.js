(() => {
  const canvas = document.getElementById("fx");
  const ctx = canvas.getContext("2d");
  let w = 0;
  let h = 0;
  let sparks = [];
  let bats = [];

  function resize() {
    const stage = document.querySelector(".stage");
    w = canvas.width = stage ? stage.clientWidth : window.innerWidth;
    h = canvas.height = stage ? stage.clientHeight : window.innerHeight;

    const mood = window.Settings ? window.Settings.moodLevel() : "n";
    const sparkMul = mood === "q" ? 0.35 : mood === "f" ? 1.6 : 1;
    const sparkCount = Math.max(8, Math.min(140, Math.floor(((w * h) / 18000) * sparkMul)));
    sparks = Array.from({ length: sparkCount }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.6 + 0.3,
      tw: Math.random() * Math.PI * 2,
      s: Math.random() * 0.02 + 0.008,
      hue: Math.random() < 0.7 ? "255, 170, 80" : "255, 230, 180"
    }));

    const batCount = mood === "q" ? 2 : mood === "f" ? 12 : 7;
    bats = Array.from({ length: batCount }, (_, i) => ({
      x: Math.random() * w,
      y: 40 + Math.random() * (h * 0.35),
      vx: (Math.random() * 0.4 + 0.15) * (i % 2 ? 1 : -1),
      amp: 8 + Math.random() * 14,
      t: Math.random() * Math.PI * 2,
      scale: 0.55 + Math.random() * 0.55
    }));
  }

  function drawBat(x, y, s, t) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s, s);
    ctx.fillStyle = "rgba(18, 10, 16, 0.72)";
    const flap = Math.sin(t * 6) * 0.35;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-16, -8 + flap * 10, -26, 2 + flap * 6);
    ctx.quadraticCurveTo(-10, 2, 0, 4);
    ctx.quadraticCurveTo(10, 2, 26, 2 + flap * 6);
    ctx.quadraticCurveTo(16, -8 + flap * 10, 0, 0);
    ctx.fill();
    ctx.restore();
  }

  function tick() {
    ctx.clearRect(0, 0, w, h);

    for (const sp of sparks) {
      sp.tw += sp.s;
      const a = 0.2 + Math.abs(Math.sin(sp.tw)) * 0.8;
      ctx.beginPath();
      ctx.fillStyle = `rgba(${sp.hue}, ${a})`;
      ctx.arc(sp.x, sp.y, sp.r, 0, Math.PI * 2);
      ctx.fill();
    }

    for (const b of bats) {
      b.t += 0.02;
      b.x += b.vx;
      if (b.x < -40) b.x = w + 40;
      if (b.x > w + 40) b.x = -40;
      const y = b.y + Math.sin(b.t) * b.amp;
      drawBat(b.x, y, b.scale, b.t);
    }

    requestAnimationFrame(tick);
  }

  window.addEventListener("resize", resize);
  resize();
  tick();

  const buttons = [...document.querySelectorAll(".menu button")];
  let index = 0;

  function visButtons() {
    return buttons.filter((b) => !b.hidden);
  }

  function setActive(i, sound) {
    const vis = visButtons();
    if (!vis.length) return;
    let target = buttons[i] && !buttons[i].hidden ? buttons[i] : null;
    if (!target) {
      const pos = Math.max(0, vis.findIndex((b) => b === buttons[index]));
      const dir = i > index ? 1 : i < index ? -1 : 0;
      target = vis[(pos + dir + vis.length) % vis.length];
    }
    const next = buttons.indexOf(target);
    if (sound && next !== index && window.Settings) window.Settings.hover();
    index = next < 0 ? 0 : next;
    buttons.forEach((b, n) => b.classList.toggle("active", n === index));
  }

  const messages = {
    start: {
      title: "スタート",
      body: "ハロウィンだけの夜が、静かに始まります。\n（この雛形では演出のみ。本編への接続は後ほどお付けできます）"
    },
    settings: {
      title: "設定",
      body: "音量・文字速度・画面モード。\n今夜の居心地は、ご主人様のお好みで。"
    },
    guideline: {
      title: "【夢界CONCEPT 二次創作ガイドライン】",
      body: ""
    },
    credits: {
      title: "製作者より",
      body: "製作 NEN\n夢界CONCEPT\nこの夜に、一言を添える場所でございます。"
    }
  };

  const overlay = document.getElementById("overlay");
  const dialogTitle = document.getElementById("dialogTitle");
  const dialogBody = document.getElementById("dialogBody");

  function openDialog(action, mode) {
    if (window.Fx) window.Fx.slash();
    if (action === "start" && window.Story) {
      if (isMaint()) return;
      if (newsSheet) newsSheet.hidden = true;
      if (commentSheet) commentSheet.hidden = true;
      window.Story.start(0);
      return;
    }
    if (action === "continue" && window.Story) {
      if (isMaint()) return;
      if (newsSheet) newsSheet.hidden = true;
      if (commentSheet) commentSheet.hidden = true;
      const at = window.Records ? window.Records.getContinue() : 0;
      if (at > 0) window.Story.start(at);
      else window.Story.start(0);
      return;
    }
    const msg = messages[action];
    if (!msg) return;
    dialogTitle.textContent = msg.title;
    overlay.classList.toggle("is-doc", action === "guideline");
    overlay.classList.toggle("is-settings", action === "settings");
    if (action === "guideline") {
      const src = document.getElementById("guideline-source");
      dialogBody.innerHTML = src ? src.innerHTML : "";
    } else if (action === "settings" && window.Settings) {
      dialogBody.innerHTML = window.Settings.panelHtml(mode);
      window.Settings.bindPanel(dialogBody, mode);
    } else {
      dialogBody.textContent = msg.body;
    }
    overlay.classList.add("open");
    document.getElementById("dialogClose").focus();
  }

  function closeDialog() {
    overlay.classList.remove("open", "is-doc", "is-settings");
    buttons[index].focus();
  }

  const titleEl = document.querySelector(".title");
  let taps = 0;
  if (titleEl) {
    titleEl.style.cursor = "pointer";
    titleEl.addEventListener("click", () => {
      taps += 1;
      if (taps < 5) return;
      taps = 0;
      const box = document.getElementById("titleTrick");
      if (!box) return;
      box.hidden = false;
      box.querySelectorAll(".candy").forEach((n) => n.remove());
      for (let i = 0; i < 16; i += 1) {
        const c = document.createElement("span");
        c.className = "candy";
        c.textContent = i % 3 === 0 ? "🎃" : i % 3 === 1 ? "🍬" : "🦇";
        c.style.left = (6 + Math.random() * 88) + "%";
        c.style.animationDelay = (Math.random() * 0.6) + "s";
        box.appendChild(c);
      }
      window.setTimeout(() => { box.hidden = true; }, 2400);
    });
  }

  const SEED_POSTS = [
    { n: "門前の誰か", t: "握手会だって。列の先、見えない。", at: "10/31 18:02" },
    { n: "名無しの夜歩き", t: "教会の方で南瓜の帽子を見た", at: "10/31 18:11" },
    { n: "灯油屋", t: "屋上に灯、まだ残ってるぞ", at: "10/31 18:24" }
  ];
  function loadComments() {
    try {
      const raw = JSON.parse(localStorage.getItem("mukai-board") || "[]");
      return Array.isArray(raw) ? raw : [];
    } catch (e) { return []; }
  }
  function saveComments(rows) {
    try { localStorage.setItem("mukai-board", JSON.stringify(rows.slice(0, 80))); } catch (err) {}
  }
  function paintComments() {
    const list = document.getElementById("commentList");
    if (!list) return;
    const rows = SEED_POSTS.concat(loadComments());
    list.innerHTML = rows.map((row, i) => {
      const name = String(row.n || "名無し").replace(/[<>]/g, "");
      const text = String(row.t || "").replace(/[<>]/g, "");
      const at = row.at || "";
      return "<li><b>" + (i + 1) + "</b> <em>" + name + "</em> <small>" + at + "</small><p>" + text + "</p></li>";
    }).join("");
    list.scrollTop = list.scrollHeight;
  }
  const newsSheet = document.getElementById("newsSheet");
  const commentSheet = document.getElementById("commentSheet");
  document.querySelector(".sns-news")?.addEventListener("click", () => {
    if (newsSheet) newsSheet.hidden = !newsSheet.hidden;
    if (commentSheet) commentSheet.hidden = true;
  });
  function isOnline() {
    return navigator.onLine !== false;
  }
  function syncBoardNet() {
    const on = isOnline();
    const off = document.getElementById("boardOffline");
    const form = document.getElementById("commentForm");
    const list = document.getElementById("commentList");
    const meta = document.getElementById("boardMeta");
    if (off) off.hidden = on;
    if (form) form.hidden = !on;
    if (list) list.hidden = !on;
    if (meta) meta.textContent = on ? "接続中　・　名無しでも書き込める" : "回線がありません";
  }
  document.querySelector(".sns-comment")?.addEventListener("click", () => {
    if (commentSheet) commentSheet.hidden = !commentSheet.hidden;
    if (newsSheet) newsSheet.hidden = true;
    syncBoardNet();
    if (isOnline()) paintComments();
  });
  window.addEventListener("online", () => { syncBoardNet(); if (commentSheet && !commentSheet.hidden) paintComments(); });
  window.addEventListener("offline", syncBoardNet);
  if (isOnline()) {
    const font = document.createElement("link");
    font.rel = "stylesheet";
    font.href = "https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Shippori+Mincho:wght@500;700&family=Zen+Maru+Gothic:wght@400;500;700&display=swap";
    document.head.appendChild(font);
  }
  document.querySelectorAll("[data-close]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const el = document.getElementById(btn.dataset.close);
      if (el) el.hidden = true;
    });
  });
  document.getElementById("commentForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!isOnline()) {
      syncBoardNet();
      return;
    }
    const input = document.getElementById("commentInput");
    const nameEl = document.getElementById("commentName");
    const text = (input && input.value || "").trim();
    if (!text) return;
    const name = ((nameEl && nameEl.value) || "").trim() || "名無し";
    const now = new Date();
    const at = (now.getMonth() + 1) + "/" + now.getDate() + " " + String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0");
    const rows = loadComments();
    rows.push({ n: name.slice(0, 12), t: text.slice(0, 80), at });
    saveComments(rows);
    if (input) input.value = "";
    paintComments();
  });

  buttons.forEach((btn, i) => {
    btn.addEventListener("mouseenter", () => setActive(i, true));
    btn.addEventListener("click", () => openDialog(btn.dataset.action));
  });

  document.getElementById("dialogClose").addEventListener("click", closeDialog);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeDialog();
  });

  window.addEventListener("keydown", (e) => {
    if ((e.key === "f" || e.key === "F") && !e.ctrlKey && e.target.tagName !== "INPUT") {
      const stage = document.querySelector(".stage");
      if (!document.fullscreenElement && stage && stage.requestFullscreen) stage.requestFullscreen().catch(() => {});
      else if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
      return;
    }
    if ((e.key === "m" || e.key === "M") && e.target.tagName !== "INPUT") {
      if (window.Settings) window.Settings.set("se", !window.Settings.get("se"));
      if (window.Records && window.Records.toast) window.Records.toast(window.Settings.get("se") ? "効果音 入" : "効果音 切");
      return;
    }
    if (window.Battle && window.Battle.isActive && window.Battle.isActive()) {
      return;
    }
    if (window.Story && window.Story.isPlaying()) {
      if (e.key === "Escape") window.Story.onEscape();
      else if (e.key === "l" || e.key === "L") window.Story.toggleLog && window.Story.toggleLog();
      else if (e.key === "t" || e.key === "T") {
        if (window.Settings) {
          window.Settings.set("auto", !window.Settings.get("auto"));
          if (window.Records && window.Records.toast) window.Records.toast(window.Settings.get("auto") ? "自動送り 入" : "自動送り 切");
        }
      }
      else if (e.key === "Control" || e.key === "Enter" || e.key === " ") window.Story.onAdvance(e);
      return;
    }
    if (e.key === "?" || e.key === "/") {
      if (window.App && window.App.showHelp) window.App.showHelp();
      return;
    }
    if ((e.key === "f" || e.key === "F") && !e.ctrlKey) {
      const stage = document.querySelector(".stage");
      if (!document.fullscreenElement && stage && stage.requestFullscreen) stage.requestFullscreen().catch(() => {});
      else if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
      return;
    }
    if (e.key === "m" || e.key === "M") {
      if (window.Settings) window.Settings.set("se", !window.Settings.get("se"));
      if (window.Records && window.Records.toast) window.Records.toast(window.Settings.get("se") ? "効果音 入" : "効果音 切");
      return;
    }
    if (overlay.classList.contains("open")) {
      if (e.key === "Escape" || e.key === "Enter") closeDialog();
      return;
    }
    if (e.key === "ArrowDown" || e.key === "s") {
      e.preventDefault();
      setActive(index + 1, true);
    }
    if (e.key === "ArrowUp" || e.key === "w") {
      e.preventDefault();
      setActive(index - 1, true);
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openDialog(buttons[index].dataset.action);
    }
  });

  window.Fx = {
    spawn(kind, x, y) {
      const layer = document.getElementById("fxLayer");
      if (!layer) return;
      const n = document.createElement("i");
      n.className = kind === "ring" ? "fx-ring" : kind === "slash" ? "fx-slash" : "fx-pop";
      if (kind !== "slash") {
        n.style.left = x + "px";
        n.style.top = y + "px";
      }
      layer.appendChild(n);
      window.setTimeout(() => n.remove(), 560);
    },
    atEvent(e, kind) {
      const stage = document.querySelector(".stage");
      if (!stage) return;
      const r = stage.getBoundingClientRect();
      this.spawn(kind || "pop", e.clientX - r.left, e.clientY - r.top);
    },
    flash(cls) {
      document.body.classList.add(cls);
      window.setTimeout(() => document.body.classList.remove(cls), 180);
    },
    slash() { this.spawn("slash", 0, 0); }
  };
  document.querySelector(".stage")?.addEventListener("click", (e) => {
    if (window.Fx) window.Fx.atEvent(e, Math.random() < 0.4 ? "ring" : "pop");
    const btn = e.target.closest("button");
    if (btn) {
      btn.classList.remove("is-press");
      void btn.offsetWidth;
      btn.classList.add("is-press");
    }
  });

  window.App = {
    openSettings(mode) { openDialog("settings", mode); },
    showHelp() {
      const el = document.getElementById("helpSheet");
      if (el) el.hidden = !el.hidden;
    }
  };

  function isMaint() {
    const h = (new Date().getUTCHours() + 9) % 24;
    return h >= 3 && h < 6;
  }
  let wasMaint = isMaint();
  function applyMaint() {
    const g = document.getElementById("maintGate");
    const on = isMaint();
    if (g) g.hidden = !on;
    document.body.classList.toggle("is-maint", on);
    if (on && !wasMaint) {
      if (window.Story && window.Story.resetTalk) window.Story.resetTalk();
      if (window.Battle && window.Battle.stop) window.Battle.stop();
    }
    wasMaint = on;
    return on;
  }
  applyMaint();
  window.setInterval(applyMaint, 30000);

  const gate = document.getElementById("deviceGate");
  const stage = document.querySelector(".stage");
  function applyDevice(dev) {
    if (window.Settings) window.Settings.set("device", dev);
    document.body.classList.toggle("is-phone", dev === "phone");
    if (stage) stage.classList.toggle("is-phone", dev === "phone");
    if (dev === "phone") {
      try {
        const ori = screen.orientation || screen.mozOrientation;
        if (ori && ori.lock) ori.lock("portrait").catch(() => {});
        else if (screen.lockOrientation) screen.lockOrientation("portrait");
      } catch (e) { /* ignore */ }
    }
  }
  if (gate) {
    gate.querySelectorAll("[data-dev]").forEach((btn) => {
      btn.addEventListener("click", () => {
        applyDevice(btn.dataset.dev);
        gate.hidden = true;
      });
    });
  }

  const REC_KEY = "mukai-records-v1";
  const CHAPTERS = [
    [39, "第一場のあと"],
    [65, "第二場のあと"],
    [91, "第三場のあと"],
    [120, "第四場のあと"],
    [999, "終幕前"]
  ];
  window.Records = (() => {
    let rec = { score: 0, time: 0, deaths: 0, clears: {}, nohit: {}, combo: 0 };
    try { rec = { ...rec, ...JSON.parse(localStorage.getItem(REC_KEY) || "{}") }; } catch (e) {}
    function save() { try { localStorage.setItem(REC_KEY, JSON.stringify(rec)); } catch (e) {} }
    function chapter(at) {
      for (let i = 0; i < CHAPTERS.length; i += 1) if (at < CHAPTERS[i][0]) return CHAPTERS[i][1];
      return "続き";
    }
    function toast(msg) {
      const el = document.getElementById("toast");
      if (!el) return;
      el.hidden = false;
      el.textContent = msg;
      window.clearTimeout(el._t);
      el._t = window.setTimeout(() => { el.hidden = true; }, 2200);
    }
    function contKey() {
      const slot = (window.Settings && window.Settings.get("slot")) || "1";
      return "mukai-continue-" + slot;
    }
    return {
      rec: () => rec,
      save,
      toast,
      contKey,
      getContinue() {
        try {
          const n = Number(localStorage.getItem(contKey()) || localStorage.getItem("mukai-continue") || 0);
          return n > 0 ? n : 0;
        } catch (e) { return 0; }
      },
      setContinue(i) {
        try { localStorage.setItem(contKey(), String(i)); } catch (e) {}
        toast("記録しました");
      },
      export() {
        const blob = new Blob([JSON.stringify({ rec, at: this.getContinue() }, null, 2)], { type: "application/json" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "toto-kii-record.json";
        a.click();
        toast("記録を書き出しました");
      },
      addScore(n) { rec.score = Math.max(rec.score, n | 0); save(); },
      death() { rec.deaths += 1; save(); },
      clear(kind, nohit) {
        const first = !rec.clears[kind];
        rec.clears[kind] = true;
        if (nohit) rec.nohit[kind] = true;
        save();
        if (first) toast("退散成功を記録");
        if (nohit) toast("無傷の退散");
      },
      combo(n) { rec.combo = Math.max(rec.combo || 0, n | 0); save(); },
      tick() { rec.time += 1; if (rec.time % 15 === 0) save(); },
      chapter,
      summary() {
        const n = Object.keys(rec.clears || {}).length;
        const m = Math.floor((rec.time || 0) / 60);
        return "最高点 " + (rec.score || 0) + "　退散 " + n + "/5　敗北 " + (rec.deaths || 0) + "　時間 " + m + "分　連撃 " + (rec.combo || 0);
      }
    };
  })();

  window.refreshContinue = function () {
    const btn = document.getElementById("continueBtn");
    const at = window.Records ? window.Records.getContinue() : 0;
    if (btn) {
      const show = at > 0;
      const label = show ? "続きからスタート（" + window.Records.chapter(at) + "）" : "";
      const changed = (btn.hidden === show) || (show && btn.textContent !== label);
      btn.hidden = !show;
      if (show) btn.textContent = label;
      if (changed && show) {
        btn.classList.remove("is-in");
        void btn.offsetWidth;
        btn.classList.add("is-in");
      }
      if (!show) btn.classList.remove("is-in");
    }
    if (btn && btn.hidden && buttons[index] === btn) setActive(0);
  };
  const lines = ["もう夜なのね。", "触らないで。", "仕事は休止中よ。", "甘楽はどこ。", "……何。"];
  const ama = document.getElementById("titleAmase");
  const bub = document.getElementById("titleBubble");
  if (ama && bub) {
    ama.addEventListener("click", (e) => {
      e.stopPropagation();
      bub.hidden = false;
      bub.textContent = lines[Math.floor(Math.random() * lines.length)];
      window.clearTimeout(ama._t);
      ama._t = window.setTimeout(() => { bub.hidden = true; }, 1800);
    });
  }
  window.refreshContinue();
  setActive(0);
  window.setInterval(() => { if (window.Records) { window.Records.tick(); window.refreshContinue(); } }, 1000);

  window.setTimeout(() => {
    const stage = document.querySelector(".stage");
    if (stage) {
      stage.classList.remove("is-intro");
      stage.classList.add("is-ready");
    }
  }, 3400);
})();
