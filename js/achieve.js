window.Achieve = (() => {
  const KEY = "mukai-achieve-v1";
  const LIST = [
    { id: "start", name: "夜が始まる", hint: "ゲームを始める" },
    { id: "shop", name: "代金は頂くよ", hint: "店を開く" },
    { id: "buy", name: "買い物上手", hint: "品を一つ買う" },
    { id: "junk", name: "ぼったくり被害者", hint: "ジャンクを買う" },
    { id: "fail", name: "効かなかった夜", hint: "品が空振りする" },
    { id: "item", name: "行商の恩恵", hint: "戦闘で品を使う" },
    { id: "samhain", name: "南瓜退散", hint: "サウィンを退ける" },
    { id: "shigure", name: "門を破る", hint: "時雨を退ける" },
    { id: "yozakura", name: "花は散る", hint: "夜桜を退ける" },
    { id: "eishi", name: "闇を見る", hint: "永視を退ける" },
    { id: "tokka", name: "統を拒む", hint: "統華を退ける" },
    { id: "join", name: "名も無き助勢", hint: "永視の参戦を見る" },
    { id: "over", name: "一度の敗北", hint: "ゲームオーバー" },
    { id: "score1", name: "千の歩み", hint: "スコア1000" },
    { id: "score5", name: "五千灯", hint: "スコア5000" },
    { id: "combo20", name: "二十連", hint: "連撃20" },
    { id: "graze", name: "擦過の夜", hint: "弾を擦る" },
    { id: "heal", name: "薬の味", hint: "回復する" },
    { id: "wall", name: "土塁守り", hint: "壁が壊れるのを見る" },
    { id: "phone", name: "掌の都", hint: "スマホで遊ぶ" },
    { id: "pc", name: "机上の夜", hint: "パソコンで遊ぶ" },
    { id: "talk", name: "触れてはいけない", hint: "標題の天瀬に触れる" },
    { id: "board", name: "門前の落書き", hint: "掲示板に書く" },
    { id: "news", name: "晩報を読む", hint: "新聞を開く" },
    { id: "guide", name: "二次の心得", hint: "ガイドラインを開く" },
    { id: "pause", name: "一時の休息", hint: "戦闘を止める" },
    { id: "skill", name: "札を切る", hint: "技を使う" },
    { id: "secret1", name: "月を七度", hint: "隠し" },
    { id: "secret2", name: "版を叩く", hint: "隠し" },
    { id: "secret3", name: "夢の綴り", hint: "隠し" }
  ];
  let got = {};
  function load() {
    try { got = JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch (e) { got = {}; }
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(got)); } catch (e) {}
  }
  function unlock(id) {
    if (!id || got[id]) return;
    const row = LIST.find((x) => x.id === id);
    if (!row) return;
    got[id] = Date.now();
    save();
    if (window.toast) window.toast("実績　" + row.name);
  }
  function paint() {
    const box = document.getElementById("achieveList");
    if (!box) return;
    box.innerHTML = LIST.map((row) => {
      const on = !!got[row.id];
      return "<li class=\"" + (on ? "is-on" : "") + "\"><b>" + (on ? row.name : "？？？") + "</b><small>" + (on ? row.hint : "未解除") + "</small></li>";
    }).join("");
    const meta = document.getElementById("achieveMeta");
    if (meta) meta.textContent = Object.keys(got).length + " / " + LIST.length;
  }
  function open() {
    const sheet = document.getElementById("achieveSheet");
    if (!sheet) return;
    sheet.hidden = !sheet.hidden;
    paint();
  }
  load();
  return { LIST, unlock, paint, open, got: () => got };
})();
