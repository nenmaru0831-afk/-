window.Story = (() => {
  const CHAR = {
    天瀬: { src: "assets/images/chars/amase.webp", full: "天瀬 若葉", alias: "灯を忘れた番人" },
    甘楽: { src: "assets/images/chars/kanra.webp", srcAmase: "assets/images/chars/kanra_amase.webp", full: "甘楽 藍依", alias: "拡声する夜歩き" },
    サウィン: { src: "assets/images/chars/samhain.webp", full: "サウィン", alias: "一夜限りの南瓜" },
    夜桜: { src: "assets/images/chars/yozakura.webp", full: "夜桜 降花", alias: "花影のメイド" },
    永視: { src: "assets/images/chars/eishi.webp", full: "緋ノ瀬 永視", voided: true, alias: "見えない妹" },
    統華: { src: "assets/images/chars/tokka.webp", full: "緋ノ瀬 統華", light: true, alias: "統都を束ねる嬢" },
    時雨: { src: "assets/images/chars/kyasha.webp", full: "時雨 華奢", alias: "赤帽の門衛" },
    叶: { src: "assets/images/chars/kano.webp", full: "小望 叶", alias: "代金は頂くよ" },
    ラピス: { src: "assets/images/chars/lapis.webp", full: "ラピス・タイムナイト", alias: "時刻を知る影" }
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
    L("天瀬", "あら、もう夜なのね。", ["天瀬", "甘楽"]),
    L("甘楽", "やっと起きたか昼夜逆転。", ["天瀬", "甘楽"]),
    L("天瀬", "はぁ？昼夜逆転って誰の事よ", ["天瀬", "甘楽"]),
    L("甘楽", "私の隣にいるやつのことかな！", ["天瀬", "甘楽"]),
    L("サウィン", "あ、私のこと？", ["甘楽", "サウィン"]),
    L("甘楽", "うわっ、誰あんた。", ["甘楽", "サウィン"]),
    L("サウィン", "気づいてなかったんだ", ["甘楽", "サウィン"]),
    L("甘楽", "そりゃあここに来る奴なんて私くらいだからさ", ["甘楽", "サウィン"]),
    L("天瀬", "バカにしてる？", ["天瀬", "甘楽"]),
    L("天瀬", "来て悪いけど、今はもう閉まってるわ。", ["天瀬", "サウィン"]),
    L("サウィン", "暇だから来たんだよ！一緒に遊びましょ？", ["天瀬", "サウィン"]),
    L("天瀬", "いやだから私休んでるって", ["天瀬", "サウィン"]),
    L("甘楽", "まあまあ、さっきまで爆睡してたんだし相手しても…", ["天瀬", "甘楽"]),
    L("天瀬", "言っておくけど、あんたも不法侵入してるからね", ["天瀬", "甘楽"]),
    B("samhain"),
    S("第一場のあと", "", "night.jpg"),
    L("サウィン", "ふげぇ…", ["天瀬", "サウィン"]),
    L("天瀬", "喋ってる途中で突然襲い掛かるとはいい度胸ね", ["天瀬", "甘楽"]),
    L("甘楽", "まあ、いい準備運動になったんじゃない？", ["天瀬", "甘楽"]),
    L("天瀬", "ったく、いくわよ。", ["天瀬", "甘楽"]),

    S("第二場", "都の列", "procession.jpg"),
    L("甘楽", "落ちても知らないからね", ["天瀬", "甘楽"]),
    L("天瀬", "しょうがないでしょ、私飛べないんだから。", ["天瀬", "甘楽"]),
    L("甘楽", "それにしてもすっごい行列ね。", ["天瀬", "甘楽"]),
    L("天瀬", "私のところにも行列ができたらなぁ…", ["天瀬", "甘楽"]),
    L("甘楽", "それは一生無理", ["天瀬", "甘楽"]),
    L("天瀬", "は？", ["天瀬", "甘楽"]),
    L("叶", "おーい、そこの二人ー！", ["天瀬", "甘楽"], "night.jpg"),
    L("天瀬", "誰よ、こんな忙しいときに", ["天瀬", "甘楽"]),
    L("甘楽", "いったん地上に降りるか", ["天瀬", "甘楽"]),
    L("天瀬", "あら、叶じゃない。", ["天瀬", "叶"], "night.jpg"),
    L("叶", "久しぶりだね。ところでこの行列は何か知ってる？", ["天瀬", "叶"]),
    L("甘楽", "ちょうどこれから調査に向かうところだったんだよ", ["甘楽", "叶"]),
    L("叶", "そうなのか？じゃあもし敵に遭遇した時の為に商品持っていきなよ", ["甘楽", "叶"]),
    L("天瀬", "さっき急に襲い掛かってくる美味しそうな奴とは遭遇したけどね。", ["天瀬", "叶"]),
    L("甘楽", "タダでくれるの？叶にしては優しいな。", ["甘楽", "叶"]),
    L("叶", "あ、代金は頂くよ。", ["甘楽", "叶"]),
    L("甘楽", "このぼったくり屋め", ["甘楽", "叶"]),
    L("天瀬", "いろいろあるわね、何を買おうかしら。", ["天瀬", "叶"], "shop.jpg"),
    L("甘楽", "ちゃんと選んでよ？このあと何があるかわからないんだから。", ["甘楽", "叶"], "shop.jpg"),
    { type: "shop" },

    L("甘楽", "よし、着いたわ", ["天瀬", "甘楽"], "gate.jpg"),
    L("時雨", "空から飛んでくるとは驚きました。", ["天瀬", "時雨"]),
    L("時雨", "あなた達もお嬢様の元へ？", ["天瀬", "時雨"]),
    L("天瀬", "おじょうさま？", ["天瀬", "時雨"]),
    L("天瀬", "知らないけど、この行列は何？", ["天瀬", "時雨"]),
    L("時雨", "その質問をするということは、あなた達はお嬢様の権能にかかっていないようですね。", ["天瀬", "時雨"]),
    L("甘楽", "ようするに、原因はこの邸宅に住んでるやつの仕業ってことか", ["甘楽", "時雨"]),
    L("天瀬", "じゃ、通らせてもらいますよー", ["天瀬", "時雨"]),
    L("時雨", "そう簡単には通しません！", ["天瀬", "時雨"]),
    B("shigure"),
    S("第二場のあと", "", "gate.jpg"),
    L("時雨", "つ、強い…。", ["天瀬", "時雨"]),
    L("天瀬", "そりゃあ、ここを守るやつは強いのが普通でしょ", ["天瀬", "時雨"]),
    L("天瀬", "あと甘楽、なんで私だけが仕事しなきゃいけないのよ", ["天瀬", "甘楽"]),
    L("甘楽", "いや別に私は付き添いで来ただけ。", ["天瀬", "甘楽"]),

    S("第三場", "館のホール", "hall.jpg"),
    L("天瀬", "外見から見たよりすごく広いわ、不思議。", ["天瀬", "甘楽"]),
    L("甘楽", "上に続く階段と下に続く階段があるけどどうする？", ["天瀬", "甘楽"]),
    L("天瀬", "よし、あんたは下に行きなさい。", ["天瀬", "甘楽"]),
    L("甘楽", "さっそく仕事押し付けた", ["天瀬", "甘楽"]),
    L("天瀬", "いいでしょ、時間短縮。", ["天瀬", "甘楽"]),
    L("甘楽", "あーはいはい。", ["天瀬", "甘楽"]),
    L("天瀬", "よーし、これで私の仕事も減って少しは楽になるわ", ["天瀬"]),
    L("夜桜", "そうね、私の仕事も減って助かるわ", ["天瀬", "夜桜"]),
    L("天瀬", "あなたがこの邸宅の主？", ["天瀬", "夜桜"]),
    L("夜桜", "残念、あなたが言っているお嬢様ではないわ。", ["天瀬", "夜桜"]),
    L("天瀬", "じゃあ代わりに答えてほしいことがある。", ["天瀬", "夜桜"]),
    L("天瀬", "あの人間や妖精の百鬼夜行のような行列は何？", ["天瀬", "夜桜"]),
    L("夜桜", "お嬢様がこの世界の中心になるって言えばわかる？", ["天瀬", "夜桜"]),
    L("天瀬", "夢界州の独裁者になりたいってわけね。", ["天瀬", "夜桜"]),
    L("天瀬", "私に地獄に落とされる覚悟はあるようね？", ["天瀬", "夜桜"]),
    L("夜桜", "地獄に落ちる？", ["天瀬", "夜桜"]),
    L("夜桜", "…なら", ["天瀬", "夜桜"]),
    L("夜桜", "地獄への道ずれに、あなた以上の適役はいなかったわ。", ["天瀬", "夜桜"]),
    B("yozakura"),
    S("第三場のあと", "", "hall.jpg"),
    L("天瀬", "私はまだ天国にも地獄にも行く気はない。", ["天瀬", "夜桜"]),
    L("天瀬", "今のあんたに言えることは見逃してあげるということね。", ["天瀬", "夜桜"]),
    L("夜桜", "まだまだ私は半熟ということですか…。", ["天瀬", "夜桜"]),

    S("第四場", "甘楽視点・地下", "basement.jpg"),
    L("甘楽", "暗いな…地下の電気代ケチってるのかここは。", ["甘楽"]),
    L("ラピス", "事情を知ってから言ってほしい言葉ね", ["甘楽", "ラピス"]),
    L("甘楽", "うわっ、だからビックリするからやめてほしいわ…", ["甘楽", "ラピス"]),
    L("ラピス", "ふふ。あなたは来客かしら？", ["甘楽", "ラピス"]),
    L("甘楽", "来客…ではないかな？", ["甘楽", "ラピス"]),
    L("甘楽", "私たちは異象を調査しに来た。", ["甘楽", "ラピス"]),
    L("ラピス", "異象？なにか事件でもあったのかしら？", ["甘楽", "ラピス"]),
    L("甘楽", "とぼけても無駄よ。あんた達のせいで地上が大変なことになってる。", ["甘楽", "ラピス"]),
    L("ラピス", "なるほど…。それであなた達がここで来た…と？", ["甘楽", "ラピス"]),
    L("甘楽", "そうさ。あんたがこれの元凶なのか知らないが", ["甘楽", "ラピス"]),
    L("甘楽", "少なくとも、敵なのは間違いないな？", ["甘楽", "ラピス"]),
    L("ラピス", "あなたから見たらそうかもしれないわね。", ["甘楽", "ラピス"]),
    L("ラピス", "でも実は私たちも…", ["甘楽", "ラピス"]),
    L("永視", "え、誰…", ["甘楽", "永視"]),
    L("甘楽", "どうも、電気工事士です。", ["甘楽", "永視"]),
    L("永視", "その服装で言えないでしょ…", ["甘楽", "永視"]),
    L("ラピス", "永視。今この人とお話し中だから戻ってなさい。", ["ラピス", "永視"]),
    L("甘楽", "親子か？", ["甘楽", "永視"]),
    L("永視", "違う。", ["甘楽", "永視"]),
    L("甘楽", "にしても、余計にさっきまで話していたやつの姿が暗いんだが", ["甘楽", "ラピス"]),
    L("ラピス", "察しが悪いわね。", ["甘楽", "ラピス"]),
    L("甘楽", "あー今良くなったわ！この暗闇の原因はさっき喋ってた奴だな？", ["甘楽", "永視"]),
    L("ラピス", "察しがいいわね。", ["甘楽", "ラピス"]),
    L("甘楽", "まぁ話している時間はない。二人とも退治させてもらう。", ["甘楽", "永視"]),
    L("永視", "悪いやつが来たってことね。", ["甘楽", "永視"]),
    B("eishi"),
    S("第四場のあと", "", "basement.jpg"),
    L("甘楽", "お前の保護者が見当たらなかったんだが…", ["甘楽", "永視"]),
    L("永視", "ラピスのこと？多分地上に行ったわよ。", ["甘楽", "永視"]),
    L("甘楽", "逃げられたか…", ["甘楽", "永視"]),
    L("永視", "さぁね？", ["甘楽", "永視"]),
    L("永視", "まぁ私も用事を思い出したし、先に上に行ってるわ。", ["甘楽", "永視"]),
    L("甘楽", "…", ["甘楽"]),
    L("甘楽", "暗闇が晴れた。", ["甘楽"]),

    S("第五場", "天瀬視点・館の屋上", "roof.jpg"),
    L("天瀬", "思ったより警備が堅かったわね。", ["天瀬", "統華"]),
    L("統華", "メイドも門番も使い物にならないわね", ["天瀬", "統華"]),
    L("天瀬", "どうやら今度こそあんたがこの異象の首謀者ね？", ["天瀬", "統華"]),
    L("天瀬", "ダメもとで聞くけど、はやく解散してもらえる？", ["天瀬", "統華"]),
    L("統華", "無理と言ったら？", ["天瀬", "統華"]),
    L("天瀬", "それはあなたも分かっているでしょ。", ["天瀬", "統華"]),
    L("統華", "私の計画に協力したら特別に見逃してあげるわよ。", ["天瀬", "統華"]),
    L("天瀬", "見逃す？あんたが見逃しても私は抵抗を続けるけどね。", ["天瀬", "統華"]),
    L("統華", "ではこの世界を統べるのがどちらが相応しいか決めましょうか。", ["天瀬", "統華"]),
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
    if (list.includes("ラピス") && list.includes("永視")) list = ["ラピス", "永視"];
    list.forEach((name, i) => {
      const info = CHAR[name];
      if (!info) return;
      const wrap = document.createElement("div");
      wrap.className = "vn-sprite" + (info.light ? " is-light" : "") + (info.voided ? " is-void" : "") + (name === "甘楽" && pairAmaseKanra ? " is-kanra-amase" : "") + (name === "時雨" ? " is-shigure" : "") + (name === "叶" ? " is-kano" : "") + (name === "ラピス" ? " is-lapis" : "");
      if (speaker && (speaker === name || speaker.includes(name))) wrap.classList.add("is-talk");
      else wrap.classList.add("is-idle");
      const img = document.createElement("img");
      img.src = (name === "甘楽" && pairAmaseKanra && info.srcAmase) ? info.srcAmase : info.src;
      img.alt = info.full || name;
      wrap.appendChild(img);
      const pairLapisEishi = list.includes("ラピス") && list.includes("永視");
      if (pairLapisEishi) wrap.classList.add(name === "永視" ? "pos-r is-behind" : "pos-r is-front");
      else if (list.length === 1) wrap.classList.add("pos-c");
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
    if (beat.type === "shop") {
      applyBg("shop.jpg");
      els.ui.hidden = true;
      if (window.Bag) {
        window.Bag.open(() => {
          index += 1;
          render();
        });
      } else {
        index += 1;
        render();
      }
      return;
    }
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
      : speaker.startsWith("叶") || speaker.startsWith("小望") ? "kano"
      : speaker.startsWith("ラピス") ? "lapis"
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
    const shop = document.getElementById("shopSheet");
    if (shop && !shop.hidden) return;
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
    if (!(Number(from) > 0) && window.Bag) window.Bag.reset();
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
