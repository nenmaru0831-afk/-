window.Story = (() => {
  const CHAR = {
    天瀬: { src: "assets/images/chars/amase.png", full: "天瀬 若葉", alias: "灯を忘れた番人" },
    甘楽: { src: "assets/images/chars/kanra.webp", srcAmase: "assets/images/chars/kanra_amase.png", full: "甘楽 藍依", alias: "拡声する夜歩き" },
    サウィン: { src: "assets/images/chars/samhain.webp", full: "サウィン", alias: "一夜限りの南瓜" },
    夜桜: { src: "assets/images/chars/yozakura.webp", full: "夜桜 降花", alias: "花影のメイド" },
    永視: { src: "assets/images/chars/eishi.webp", full: "緋ノ瀬 永視", voided: true, alias: "見えない妹" },
    統華: { src: "assets/images/chars/tokka.png", full: "緋ノ瀬 統華", light: true, alias: "統都を束ねる嬢" },
    時雨: { src: "assets/images/chars/kyasha.webp", full: "時雨 華奢", alias: "赤帽の門衛" }
  };

  function fullName(speaker) {
    if (!speaker) return "";
    if (speaker.includes("＆")) {
      return speaker.split("＆").map((part) => CHAR[part]?.full || part).join("＆");
    }
    return CHAR[speaker]?.full || speaker;
  }

  const L = (speaker, text, present, bg) => ({ type: "line", speaker, text, present, bg });
  const S = (label, note, bg) => ({ type: "banner", label, note, bg });
  const B = (kind) => ({ type: "battle", kind });

  const STORY = [
    S("第一場", "夜の始まり", "church.jpg"),
    L("天瀬", "あら、もう夜なのね", ["天瀬", "甘楽"]),
    L("甘楽", "おはよう、昼夜逆転", ["天瀬", "甘楽"]),
    L("天瀬", "昼夜逆転って誰のことよ", ["天瀬", "甘楽"]),
    L("甘楽", "私の隣にいる奴のことかな", ["天瀬", "甘楽"]),
    L("サウィン", "私のこと？", ["甘楽", "サウィン"]),
    L("甘楽", "うわっ、誰あんた", ["甘楽", "サウィン"]),
    L("サウィン", "気づいてなかったの？", ["天瀬", "サウィン"]),
    L("天瀬", "そりゃ小さいから分からないわよ", ["天瀬", "サウィン"]),
    L("天瀬", "生憎、今私は休んでるからさっさと帰ることね", ["天瀬", "サウィン"]),
    L("甘楽", "あれ、さっきまでお前休んで...", ["天瀬", "甘楽"]),
    L("天瀬", "仕事がないのよ、本来の役目も、今は休止中だし。", ["天瀬", "甘楽"]),
    L("サウィン", "じゃあ私が仕事を増やしてあげる！", ["天瀬", "サウィン"]),
    B("samhain"),
    S("第一場のあと", "", "night.jpg"),
    L("天瀬", "急に襲い掛かかってくるなんて命知らずね", ["天瀬", "甘楽"]),
    L("甘楽", "天瀬、そんなことより都から大勢がどこかに向ってるぞ", ["天瀬", "甘楽"]),
    L("天瀬", "...はぁ。", ["天瀬", "甘楽"]),
    L("天瀬", "いくか", ["天瀬", "甘楽"]),

    S("第二場", "都の列", "procession.jpg"),
    L("甘楽", "落ちても知らないからな", ["天瀬", "甘楽"]),
    L("天瀬", "しょうがないでしょ、私飛べないんだから", ["天瀬", "甘楽"]),
    L("甘楽", "どうやら都の奴らはあそこの建物に向ってみるみたい", ["天瀬", "甘楽"]),
    L("天瀬", "富豪の家みたいね", ["天瀬", "甘楽"]),
    L("甘楽", "すぐお金として見るわね…", ["天瀬", "甘楽"]),
    L("甘楽", "...", ["天瀬", "甘楽"]),
    L("甘楽", "着いた", ["天瀬", "甘楽"], "gate.jpg"),
    L("天瀬", "やっぱ早いわね", ["天瀬", "甘楽"]),
    L("時雨", "空から飛んでくるとは驚きました", ["天瀬", "時雨"]),
    L("甘楽", "率直に聞く、この列は何？", ["甘楽", "時雨"]),
    L("時雨", "ふむ...。その質問をするということは", ["甘楽", "時雨"]),
    L("時雨", "あなたはお嬢様のファンじゃないようで？", ["天瀬", "時雨"]),
    L("天瀬", "答えないということは", ["天瀬", "時雨"]),
    L("天瀬", "あなたはこれの首謀者ということで？", ["天瀬", "時雨"]),
    L("時雨", "違います。これはお嬢様の...", ["天瀬", "時雨"]),
    L("時雨", "あっ", ["天瀬", "時雨"]),
    L("天瀬", "なるほど首謀者はこの中ね。通らせてもらいますよ～", ["天瀬", "時雨"]),
    L("時雨", "させるかあっ！", ["天瀬", "時雨"]),
    B("shigure"),
    S("第二場のあと", "", "gate.jpg"),
    L("天瀬", "甘楽、あんたも仕事しなさいよ", ["天瀬", "甘楽"]),
    L("甘楽", "いや、私はただの付き添い", ["天瀬", "甘楽"]),
    L("天瀬", "じゃあ私が仕事を増やしてあげる", ["天瀬", "甘楽"]),
    L("甘楽", "さっきのやつと同じこと言ったなあ", ["天瀬", "甘楽"]),

    S("第三場", "館のホール", "hall.jpg"),
    L("天瀬", "うわ広...", ["天瀬", "甘楽"]),
    L("甘楽", "天瀬、上に続く階と下に続く階があるけど", ["天瀬", "甘楽"]),
    L("天瀬", "よし、アンタは下を調査しなさい", ["天瀬", "甘楽"]),
    L("甘楽", "さっそく仕事押し付けた", ["天瀬", "甘楽"]),
    L("天瀬", "いいじゃない、時間短縮よ", ["天瀬", "甘楽"]),
    L("甘楽", "あーはいはい...", ["天瀬", "甘楽"]),
    L("天瀬", "よーし、これで私の仕事も減って楽になるわ", ["天瀬"]),
    L("夜桜", "そうね、私の仕事も減って助かるわ", ["天瀬", "夜桜"]),
    L("天瀬", "あなたがさっきの門番が言ってた\"お嬢様\"？", ["天瀬", "夜桜"]),
    L("夜桜", "残念。あなたが言っているお嬢様ではないわ。", ["天瀬", "夜桜"]),
    L("天瀬", "ならお嬢様の代わりにあなたに聞きたいことがある", ["天瀬", "夜桜"]),
    L("天瀬", "あの百鬼夜行のような人間の列は何？", ["天瀬", "夜桜"]),
    L("夜桜", "この世界がお嬢様を中心に一つになり始めてるって言ったら分かる？", ["天瀬", "夜桜"]),
    L("天瀬", "よーするに夢界洲の独裁者になりたいっていうわけね", ["天瀬", "夜桜"]),
    L("天瀬", "私に地獄に落とされる覚悟はあるようで？", ["天瀬", "夜桜"]),
    L("夜桜", "\"地獄に落ちる\"ね...", ["天瀬", "夜桜"]),
    L("夜桜", "...なら", ["天瀬", "夜桜"]),
    L("夜桜", "地獄への道連れに、あなた以上の適役はいなかったわ。", ["天瀬", "夜桜"]),
    B("yozakura"),
    S("第三場のあと", "", "hall.jpg"),
    L("天瀬", "私はまだ天国にも地獄にも行く気はないわ", ["天瀬", "夜桜"]),
    L("天瀬", "まだやりたいことがたくさんあるんだから", ["天瀬", "夜桜"]),
    L("夜桜", "じゃあ、またその時かしら", ["天瀬", "夜桜"]),

    S("第四場", "甘楽視点・地下", "basement.jpg"),
    L("甘楽", "なんかここ暗いな...", ["甘楽"]),
    L("甘楽", "地下の電気代ケチってるのかここは", ["甘楽"]),
    L("永視", "...え、誰", ["甘楽", "永視"]),
    L("甘楽", "どうも、電気工事士です", ["甘楽", "永視"]),
    L("永視", "その服装は無理があるわよ...", ["甘楽", "永視"]),
    L("甘楽", "で、アンタの姿が見えないんだけど", ["甘楽", "永視"]),
    L("永視", "...", ["甘楽", "永視"]),
    L("永視", "あなたがずっと目を瞑ってるだけじゃない？", ["甘楽", "永視"]),
    L("甘楽", "いやいやいやいや", ["甘楽", "永視"]),
    L("甘楽", "バッチバチにあけてるって", ["甘楽", "永視"]),
    L("永視", "...私から離れたほうがいいわよ", ["甘楽", "永視"]),
    L("甘楽", "...？", ["甘楽", "永視"]),
    L("甘楽", "アンタが、この暗闇の原因ってことね", ["甘楽", "永視"]),
    L("永視", "私に近づく奴らはみんなこうよ", ["甘楽", "永視"]),
    L("永視", "誰も私の姿を一度も見たことがない", ["甘楽", "永視"]),
    L("甘楽", "お姉様...？ってことはアンタは妹？", ["甘楽", "永視"]),
    L("永視", "そうよ、てか私から離れ...", ["甘楽", "永視"]),
    L("永視", "...何構えてんの", ["甘楽", "永視"]),
    L("甘楽", "何って...これから勝負するんでしょ", ["甘楽", "永視"]),
    L("永視", "何も見えないまま勝負に挑むなんて", ["甘楽", "永視"]),
    L("永視", "負けは分かっているのに", ["甘楽", "永視"]),
    L("甘楽", "私の権能を知ってから言うことね", ["甘楽", "永視"]),
    B("eishi"),

    S("第五場", "天瀬視点・館の屋上", "roof.jpg"),
    L("天瀬", "随分とお金持ちの館を構えているようね", ["天瀬", "統華"]),
    L("統華", "あらありがとう。", ["天瀬", "統華"]),
    L("天瀬", "アンタがこの変な行列を作った首謀者かしら？", ["天瀬", "統華"]),
    L("統華", "失礼ね、私の握手会だわ。", ["天瀬", "統華"]),
    L("天瀬", "人間じゃない奴が握手会開いても誰も来ないわ", ["天瀬", "統華"]),
    L("統華", "その発言...私のファンじゃないようね", ["天瀬", "統華"]),
    L("天瀬", "ファン？あー、なんかあの門番が言ってたやつね", ["天瀬", "統華"]),
    L("統華", "メイドも門番も使い物にならないわね...", ["天瀬", "統華"]),
    L("天瀬", "あんたが雇ったやつらでしょ", ["天瀬", "統華"]),
    L("天瀬", "仲間って言うだけで絆は血より薄いのね。", ["天瀬", "統華"]),
    L("統華", "別に、仲間ではないわ。", ["天瀬", "統華"]),
    L("天瀬", "あら、さっそく仲間割れかしら？", ["天瀬", "統華"]),
    L("統華", "血は水よりも濃い、でも私達家族の絆は血よりも濃いの。", ["天瀬", "統華"]),
    L("天瀬", "家族...ね。", ["天瀬", "統華"]),
    L("天瀬", "で、早くこの行列やめさせてもらえる？", ["天瀬", "統華"]),
    L("統華", "無理と言ったら？", ["天瀬", "統華"]),
    L("天瀬", "この館を私の家にする", ["天瀬", "統華"]),
    L("統華", "よほど自分の家に困っているようね", ["天瀬", "統華"]),
    L("統華", "私の計画に協力したら部屋一つぐらい貸してあげてもいいのよ", ["天瀬", "統華"]),
    L("天瀬", "無理と言ったら？", ["天瀬", "統華"]),
    L("統華", "あなたも支配下に治める", ["天瀬", "統華"]),
    L("天瀬＆統華", "...", ["天瀬", "統華"]),
    L("統華", "要するに...", ["天瀬", "統華"]),
    L("天瀬", "勝負ってことね", ["天瀬", "統華"]),
    B("tokka"),
    { type: "end" }
  ];

  let index = 0;
  let playing = false;
  const seenIntro = {};
  let currentBg = "church.jpg";
  let els = {};
  let typing = false;
  let typedFull = "";
  let typeTimer = 0;
  let autoTimer = 0;
  let forceBattleTimer = 0;
  const log = [];
  const seenLine = {};

  function qs(id) {
    return document.getElementById(id);
  }

  function applyBg(name) {
    if (name) currentBg = name;
    if (els.bg) {
      els.bg.style.backgroundImage = `url("assets/images/bg/${currentBg}")`;
    }
  }

  function setSprites(present, speaker) {
    const box = els.sprites;
    box.innerHTML = "";
    let list = (present || []).slice(0, 2);
    els.root?.classList.toggle("eishi-dark", list.includes("永視"));
    const pairAmaseKanra = list.includes("天瀬") && list.includes("甘楽") && list.length === 2;
    if (pairAmaseKanra) list = ["天瀬", "甘楽"];
    list.forEach((name, i) => {
      const info = CHAR[name];
      if (!info) return;
      const wrap = document.createElement("div");
      wrap.className = "vn-sprite" + (info.light ? " is-light" : "") + (info.voided ? " is-void" : "") + (name === "甘楽" && pairAmaseKanra ? " is-kanra-amase" : "") + (name === "時雨" ? " is-shigure" : "");
      if (speaker && (speaker === name || speaker.includes(name))) wrap.classList.add("is-talk");
      else wrap.classList.add("is-idle");
      const img = document.createElement("img");
      img.src = (name === "甘楽" && pairAmaseKanra && info.srcAmase) ? info.srcAmase : info.src;
      img.alt = info.full || name;
      wrap.appendChild(img);
      if (list.length === 1) wrap.classList.add("pos-c");
      else wrap.classList.add(i === 0 ? "pos-l" : "pos-r");
      box.appendChild(wrap);
    });
  }

  function render() {
    const beat = STORY[index];
    if (!beat) return finish();
    window.clearInterval(typeTimer);
    window.clearTimeout(autoTimer);

    els.banner.hidden = true;
    els.ui.hidden = false;
    els.battle.hidden = true;
    els.root.classList.remove("eishi-dark");
    if (beat.bg) applyBg(beat.bg);
    if (beat.present && beat.present.includes("サウィン")) applyBg("church.jpg");
    if (beat.type === "battle" && beat.kind === "samhain") applyBg("church.jpg");
    if (beat.present && beat.present.includes("統華")) applyBg("roof.jpg");
    if (beat.type === "battle" && beat.kind === "tokka") applyBg("roof.jpg");
    if (beat.present && beat.present.includes("夜桜")) applyBg("hall.jpg");
    if (beat.type === "battle" && beat.kind === "yozakura") applyBg("hall.jpg");
    if (beat.type === "banner") {
      els.ui.hidden = true;
      els.sprites.innerHTML = "";
      els.banner.hidden = false;
      els.bannerLabel.textContent = beat.label || "";
      els.bannerNote.textContent = beat.note || "";
      return;
    }

    if (beat.type === "battle") {
      els.ui.hidden = true;
      els.sprites.innerHTML = "";
      if (window.Battle) {
        window.Battle.start(beat.kind || "samhain", () => {
          index += 1;
          if (window.Records && window.Records.setContinue) window.Records.setContinue(index);
          else try { localStorage.setItem("mukai-continue", String(index)); } catch (e) {}
          if (window.refreshContinue) window.refreshContinue();
          render();
        });
      } else if (els.battle) {
        els.battle.hidden = false;
      }
      return;
    }

    if (beat.type === "end") {
      els.ui.hidden = false;
      setSprites(["天瀬", "統華"], "天瀬");
      els.name.textContent = "";
      els.text.textContent = "（ここまで。クリックでタイトルへ）";
      return;
    }

    setSprites(beat.present, beat.speaker);
    paintName(beat.speaker);
    showCharIntro(beat.speaker);
    typeLine(beat.text || "", beat.speaker || "");
  }

  function showCharIntro(speaker) {
    const key = speaker && speaker.split("＆")[0];
    const info = CHAR[key];
    const box = document.getElementById("vnIntro");
    if (!box || !info || seenIntro[key]) return;
    seenIntro[key] = true;
    const themeOf = { サウィン: "samhain", 時雨: "shigure", 夜桜: "yozakura", 永視: "eishi", 統華: "tokka" };
    if (themeOf[key] && window.Battle && window.Battle.playTheme) window.Battle.playTheme(themeOf[key]);
    const alias = document.getElementById("vnIntroAlias");
    const name = document.getElementById("vnIntroName");
    if (alias) alias.textContent = info.alias || "";
    if (name) name.textContent = info.full || key;
    box.hidden = false;
    box.classList.remove("is-play");
    void box.offsetWidth;
    box.classList.add("is-play");
    window.setTimeout(() => { box.hidden = true; box.classList.remove("is-play"); }, 2400);
  }

  function paintName(speaker) {
    const who = !speaker ? "narr"
      : speaker.includes("＆") ? "dual"
      : speaker.startsWith("天瀬") ? "amase"
      : speaker.startsWith("甘楽") ? "kanra"
      : speaker.startsWith("サウィン") ? "samhain"
      : speaker.startsWith("永視") ? "eishi"
      : speaker.startsWith("夜桜") ? "yozakura"
      : speaker.startsWith("時雨") ? "shigure"
      : speaker.startsWith("統華") ? "tokka"
      : "narr";
    els.name.className = "vn-name who-" + who;
    els.name.textContent = fullName(speaker) || "——";
  }

  let lastWho = "";
  function toggleLog() {
    const box = document.getElementById("vnLog");
    if (!box) return;
    if (!box.hidden) { box.hidden = true; return; }
    box.hidden = false;
    box.innerHTML = log.slice(-24).map((row) => "<p><b>" + row.n + "</b> " + row.t + "</p>").join("") || "<p>まだ言葉がありません</p>";
    box.scrollTop = box.scrollHeight;
  }

  function typeLine(text, who) {
    lastWho = who || "";
    log.push({ n: fullName(who) || "——", t: text });
    if (log.length > 80) log.shift();
    window.clearInterval(typeTimer);
    window.clearTimeout(autoTimer);
    typedFull = text;
    const key = (who || "") + "|" + text;
    const skip = window.Settings && window.Settings.get("skipRead") && seenLine[key];
    seenLine[key] = true;
    const ms = skip ? 0 : (window.Settings ? window.Settings.textMs() : 18);
    if (ms <= 0) {
      els.text.textContent = text;
      typing = false;
      queueAuto();
      return;
    }
    let i = 0;
    typing = true;
    els.text.textContent = "";
    typeTimer = window.setInterval(() => {
      i += 1;
      els.text.textContent = typedFull.slice(0, i);
      if (i % 2 === 1 && window.Settings) window.Settings.talk(who);
      if (i >= typedFull.length) {
        window.clearInterval(typeTimer);
        typing = false;
        queueAuto();
      }
    }, ms);
  }

  function queueAuto() {
    const wait = window.Settings ? window.Settings.autoMs() : 0;
    if (!wait) return;
    autoTimer = window.setTimeout(() => next(), wait);
  }

  function next() {
    if (!playing) return;
    if (typing) {
      window.clearInterval(typeTimer);
      typing = false;
      els.text.textContent = typedFull;
      if (window.Settings) window.Settings.talk(lastWho);
      queueAuto();
      return;
    }
    if (window.Settings) window.Settings.talk(lastWho);
    window.clearTimeout(autoTimer);
    const beat = STORY[index];
    if (beat && beat.type === "end") {
      finish();
      return;
    }
    index += 1;
    if (index >= STORY.length) finish();
    else render();
  }

  function finish() {
    playing = false;
    typing = false;
    window.clearInterval(typeTimer);
    window.clearTimeout(autoTimer);
    window.clearTimeout(forceBattleTimer);
    if (window.Battle) window.Battle.stop();
    els.root.hidden = true;
    document.querySelector(".stage")?.classList.remove("in-story");
    if (window.refreshContinue) window.refreshContinue();
  }

  function start(from) {
    els = {
      root: qs("vn"),
      bg: document.querySelector("#vn .vn-bg"),
      sprites: qs("vnSprites"),
      banner: qs("vnBanner"),
      bannerLabel: qs("vnBannerLabel"),
      bannerNote: qs("vnBannerNote"),
      battle: qs("vnBattle"),
      ui: qs("vnUi"),
      name: qs("vnName"),
      text: qs("vnText")
    };
    if (!els.root) return;
    index = Math.max(0, Number(from) || 0);
    playing = true;
    Object.keys(seenIntro).forEach((k) => { delete seenIntro[k]; });
    for (let i = 0; i < index; i += 1) {
      const beat = STORY[i];
      if (beat && beat.type === "line" && beat.speaker) {
        const key = beat.speaker.split("＆")[0];
        if (CHAR[key]) seenIntro[key] = true;
      }
    }
    currentBg = "church.jpg";
    for (let i = index; i >= 0; i -= 1) {
      const beat = STORY[i];
      if (beat && beat.bg) { currentBg = beat.bg; break; }
      if (beat && beat.type === "banner" && beat.bg) { currentBg = beat.bg; break; }
    }
    applyBg(currentBg);
    els.root.hidden = false;
    document.querySelector(".stage")?.classList.add("in-story");
    els.root.onclick = (e) => {
      if (window.Battle && window.Battle.isPlaying()) return;
      if (e.target.closest && e.target.closest(".battle-over, .battle-hud, #battleCanvas")) return;
      e.preventDefault();
      next();
    };
    render();
  }

  function onAdvance(e) {
    if (!playing) return false;
    if (window.Battle && window.Battle.isPlaying()) return true;
    if (e) e.preventDefault();
    next();
    return true;
  }

  function onEscape() {
    if (!playing) return false;
    if (window.Battle && window.Battle.isActive()) {
      window.Battle.togglePause();
      return true;
    }
    if (window.Battle) window.Battle.stop();
    finish();
    return true;
  }

  function resetTalk() {
    finish();
    Object.keys(seenIntro).forEach((k) => { delete seenIntro[k]; });
    try {
      localStorage.removeItem("mukai-continue");
      Object.keys(localStorage).forEach((k) => {
        if (k.indexOf("mukai-continue") === 0) localStorage.removeItem(k);
      });
    } catch (e) {}
    if (window.refreshContinue) window.refreshContinue();
  }
  return { start, onAdvance, onEscape, finish, toggleLog, resetTalk, isPlaying: () => playing };
})();
