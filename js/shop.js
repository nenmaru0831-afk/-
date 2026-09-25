window.Bag = (() => {
  const ITEMS = [
    { id: "potion_s", name: "薄紅ポーション", price: 40, desc: "体力を18戻す", fx: "heal18", mark: "紅" },
    { id: "potion_m", name: "灯油薬", price: 80, desc: "体力を32戻す", fx: "heal32", mark: "灯" },
    { id: "potion_l", name: "南瓜スープ", price: 140, desc: "体力を55戻す", fx: "heal55", mark: "汁" },
    { id: "elixir", name: "満天の雫", price: 220, desc: "体力を全快に近づける", fx: "heal80", mark: "雫" },
    { id: "guard", name: "紙のお守り", price: 60, desc: "6秒防御", fx: "guard", mark: "守" },
    { id: "ward", name: "鉄の護符", price: 120, desc: "10秒強防御", fx: "ward", mark: "鉄" },
    { id: "haste", name: "砂糖靴", price: 70, desc: "8秒加速", fx: "haste", mark: "靴" },
    { id: "double", name: "二連火薬", price: 90, desc: "8秒二連射", fx: "double", mark: "弐" },
    { id: "bomb", name: "祓い鈴", price: 100, desc: "近くの弾を払う", fx: "bomb", mark: "鈴" },
    { id: "purge", name: "塩の塊", price: 130, desc: "画面の弾を大きく払う", fx: "purge", mark: "塩" },
    { id: "time", name: "砂時計の欠片", price: 150, desc: "制限を少し延ばす", fx: "time", mark: "砂" },
    { id: "lamp", name: "懐中の灯", price: 85, desc: "暗闇を薄める", fx: "lamp", mark: "灯" },
    { id: "focus", junk: true, name: "絡まった糸", price: 55, desc: "当たりを小さく", fx: "tiny", mark: "針" },
    { id: "rage", junk: true, name: "ただ辛いだけ", price: 75, desc: "攻撃を少し強く", fx: "rage", mark: "辛" },
    { id: "luck", junk: true, name: "三ツ葉の偽札", price: 65, desc: "得点が増える", fx: "luck", mark: "葉" },
    { id: "regen", name: "苔玉", price: 95, desc: "しばらく回復", fx: "regen", mark: "苔" },
    { id: "veil", name: "霧の瓶", price: 110, desc: "敵弾を遅くする", fx: "slowb", mark: "霧" },
    { id: "invuln", name: "金の鈴", price: 180, desc: "短い無敵", fx: "invuln", mark: "金" },
    { id: "ofuda", junk: true, name: "書き損じの札", price: 50, desc: "弱い弾を撃つ", fx: "shot", mark: "札" },
    { id: "candy", junk: true, name: "賞味期限切れの飴", price: 20, desc: "ごく少し回復", fx: "heal8", mark: "菓" },
    { id: "stone", junk: true, name: "ただの石ころ", price: 10, desc: "ほとんど意味がない", fx: "stone", mark: "石" },
    { id: "mirror", name: "割れた鏡", price: 125, desc: "被弾を少し返す", fx: "reflect", mark: "鏡" },
    { id: "tea", junk: true, name: "ぬるい番茶", price: 35, desc: "足取りを直す", fx: "tea", mark: "茶" },
    { id: "clock", name: "止まった懐中時計", price: 160, desc: "敵の術を遅らせる", fx: "artslow", mark: "時計" },
    { id: "ribbon", junk: true, name: "使えるかわからない箒", price: 280, desc: "見た目だけ", fx: "none", mark: "紐" },
    { id: "map", junk: true, name: "先月の地図", price: 30, desc: "迷う", fx: "invert", mark: "図" },
    { id: "bell", junk: true, name: "鳴らない猫鈴", price: 70, desc: "雑魚を少し怯ませる", fx: "stun", mark: "猫" },
    { id: "oil", junk: true, name: "空の灯油缶", price: 55, desc: "弾に火がつく（得点）", fx: "luck", mark: "油" },
    { id: "seed", junk: true, name: "噛めない種", price: 25, desc: "回復はごくわずか", fx: "heal6", mark: "種" },
    { id: "contract", junk: true, name: "読めない契約書", price: 480, desc: "体力を削って大弾幕払い", fx: "pact", mark: "契" }
  ];

  let gold = 1000;
  let owned = {};

  function reset() {
    gold = 1000;
    owned = {};
  }
  function count(id) { return owned[id] || 0; }
  function add(id, n) { owned[id] = count(id) + (n || 1); }
  function take(id) {
    if (count(id) <= 0) return false;
    owned[id] -= 1;
    if (owned[id] <= 0) delete owned[id];
    return true;
  }
  function buy(id) {
    const it = ITEMS.find((x) => x.id === id);
    if (!it || gold < it.price) return false;
    gold -= it.price;
    add(id, 1);
    if (window.Settings && window.Settings.coin) window.Settings.coin();
    if (window.Achieve) {
      window.Achieve.unlock("buy");
      if (it.junk) window.Achieve.unlock("junk");
    }
    return true;
  }
  function listOwned() {
    return ITEMS.filter((it) => count(it.id) > 0).map((it) => ({ ...it, n: count(it.id) }));
  }
  function use(id) {
    if (!take(id)) return false;
    if (window.Battle && window.Battle.useItem) window.Battle.useItem(id);
    if (window.paintBattleBag) window.paintBattleBag();
    return true;
  }

  function open(onDone) {
    const sheet = document.getElementById("shopSheet");
    if (!sheet) { if (onDone) onDone(); return; }
    if (window.Achieve) window.Achieve.unlock("shop");
    sheet.hidden = false;
    paint();
    const done = document.getElementById("shopDone");
    if (done) {
      done.onclick = (e) => {
        e.stopPropagation();
        sheet.hidden = true;
        if (onDone) onDone();
      };
    }
  }
  function paint() {
    const goldEl = document.getElementById("shopGold");
    if (goldEl) goldEl.textContent = "所持金　" + gold;
    const grid = document.getElementById("shopGrid");
    if (!grid) return;
    grid.innerHTML = ITEMS.map((it) => {
      const can = gold >= it.price;
      return '<button type="button" class="shop-item ico-' + it.id + (can ? "" : " is-off") + (it.junk ? " is-junk" : "") + '" data-id="' + it.id + '">'
        + '<i class="ico"></i><b>' + it.name + '</b><small>' + it.desc + '</small><em>' + it.price + '</em>'
        + '<span>所持 ' + count(it.id) + '</span></button>';
    }).join("");
    grid.querySelectorAll("[data-id]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (buy(btn.dataset.id)) paint();
      });
    });
  }

  return { ITEMS, reset, buy, use, count, listOwned, gold: () => gold, open, paint };
})();
