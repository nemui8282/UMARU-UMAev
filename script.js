/* --- 設定データ --- */
const HORSE_TYPES = {

  // 1. Green (緑)
  green: {
    horseSrc: "assets/horses/green.png",
    soilSrc:  "assets/gr/greengr.png",
    pullTime: 3000,
    maxDistance: 80,
    transformOrigin: "center center",
    
    // ★サイズは0.7倍のまま
    horseWidth: (180 * 0.7) + "px", 
    // ★位置のズレはリセット！
    horseBottom: 23,   // 土より少しだけ深く(23px)埋める
    horseLeft:   0,    // ズレなし
    
    soilWidth:  (200 * 0.7) + "px",
    soilBottom: 0,     // 基準位置
    soilLeft:   0,     // ズレなし
  },

  // 2. Yellow (黄)
  yellow: {
    horseSrc: "assets/horses/yellow.png",
    soilSrc:  "assets/gr/yellowgr.png",
    pullTime: 3000,
    maxDistance: 80,
    transformOrigin: "center center",
    horseWidth: (180 * 0.6) + "px",
    horseBottom: 0,
    horseLeft:   0,

    soilWidth:  (200 * 0.65) + "px",
    soilBottom: 0,
    soilLeft:   -8,
  },

  // 3. Purple (紫)
  purple: {
    horseSrc: "assets/horses/purple.png",
    soilSrc:  "assets/gr/purplegr.png",
    pullTime: 3000,
    maxDistance: 80,
    transformOrigin: "center center",
    horseWidth: (180 * 0.7) + "px",
    horseBottom: 23,
    horseLeft:   0,
    soilWidth:  (200 * 0.75) + "px",
    soilBottom: 10,
    soilLeft:   0,
  },

  // 4. Blue (青)
  blue: {
    horseSrc: "assets/horses/blue.png",
    soilSrc:  "assets/gr/bluegr.png",
    pullTime: 3000,
    maxDistance: 80,
    transformOrigin: "center center",
    horseWidth: (180 * 0.7) + "px",
    horseBottom: 23,
    horseLeft:   0,

    soilWidth:  (200 * 0.7) + "px",
    soilBottom: 20,
    soilLeft:   0,
  },

  // 5. Orange (橙)
  orange: {
    horseSrc: "assets/horses/orange.png",
    soilSrc:  "assets/gr/orangegr.png",
    pullTime: 3000,
    maxDistance: 80,
    transformOrigin: "center center",
    horseWidth: (180 * 0.7) + "px",
    horseBottom: 23,
    horseLeft:   0,

    soilWidth:  (200 * 0.7) + "px",
    soilBottom: 20,
    soilLeft:   0,
  },

  // 6. Pink (ピンク)
  pink: {
    horseSrc: "assets/horses/pink.png",
    soilSrc:  "assets/gr/pinkgr.png",
    pullTime: 3000,
    maxDistance: 80,
    transformOrigin: "center center",
    horseWidth: (180 * 0.7) + "px",
    horseBottom: 23,
    horseLeft:   0,
    soilWidth:  (200 * 0.7) + "px",
    soilBottom: 1,
    soilLeft:   0,
  },

  // 7. Lightgreen (黄緑)
  lightgreen: {
    horseSrc: "assets/horses/lightgreen.png",
    soilSrc:  "assets/gr/lightgreengr.png",
    pullTime: 3000,
    maxDistance: 80,
    transformOrigin: "center center",
    horseWidth: (180 * 0.6) + "px",
    horseBottom: 23,
    horseLeft:   0,

    soilWidth:  (200 * 0.6) + "px",
    soilBottom: 22.5,
    soilLeft:   0,
  },

  // 8. Red (赤)
  red: {
    horseSrc: "assets/horses/red.png",
    soilSrc:  "assets/gr/redgr.png",
    pullTime: 3000,
    maxDistance: 80,
    transformOrigin: "center center",
    horseWidth: (180 * 0.7) + "px",
    horseBottom: 23,
    horseLeft:   0,
    soilWidth:  (200 * 0.7) + "px",
    soilBottom: 14,
    soilLeft:   0,
  },

  // 9. Cyan (水色)
  cyan: {
    horseSrc: "assets/horses/cyan.png",
    soilSrc:  "assets/gr/cyangr.png",
    pullTime: 3000,
    maxDistance: 80,
    transformOrigin: "center center",
    horseWidth: (180 * 0.6) + "px",
    horseBottom: 23,
    horseLeft:   5,

    soilWidth:  (200 * 0.65) + "px",
    soilBottom: 18,
    soilLeft:   0,
  },
};

// エンディング画像を裏でこっそり読み込んでおく魔法
const preloadEnding = new Image();
preloadEnding.src = "assets/endingEV.png"; // 画像のパス

/* --- 音素材の準備 --- *///////////////////////////////////////////////////////////////////
const SOUND_PATHS = {
  click: "assets/click.mp3",
  hyuun: "assets/hyuun.mp3"
};

// 音を鳴らす関数（安全装置付き）
const playSe = (name) => {
  // 毎回新しく作る（一番バグが起きにくい）
  const audio = new Audio(SOUND_PATHS[name]);
  
  // 再生を試みる
  audio.play().catch(e => {
    // iPhoneなどで「ダメ！」と言われても
    // エラーを出さずに「はいそうですか」とスルーする
    // (これでゲームが止まることはありません)
  });
};
/////////////////////////////////////////////////////////////////////////////

const screen = document.getElementById("screen");

/* --- グローバル変数: 抜けた馬の数 --- */
let pulledCount = 0; // ★ここに追加！最初は0匹

/* --- 馬生成関数 (カウンター機能付き) --- */
const spawnHorse = (type, x, y, index) => {
  const data = HORSE_TYPES[type];
  if (!data) return;

  // 1. 要素を作る
  const wrap = document.createElement("div");
  wrap.className = "horse-wrap";
  wrap.style.left = x;
  wrap.style.bottom = y;
  wrap.style.zIndex = index + 10; 

  const soil = document.createElement("img");
  soil.className = "soil";
  soil.src = data.soilSrc;
  soil.style.width = data.soilWidth;
  soil.style.bottom = `${data.soilBottom}px`;
  soil.style.marginLeft = `${data.soilLeft}px`; // 0なら効かないが念のため

  const horse = document.createElement("img");
  horse.className = "horse";
  horse.src = data.horseSrc;
  horse.draggable = false;
  horse.style.width = data.horseWidth;
  horse.style.transform = 'translate(-50%, 0)'; 
  horse.style.bottom = `${data.horseBottom}px`;
  horse.style.marginLeft = `${data.horseLeft}px`;

  wrap.appendChild(soil);
  wrap.appendChild(horse);
  screen.appendChild(wrap);

  // 2. メモリ
  let timer = null;
  let startTime = null;
  let isPulling = false;

  // 3. 動作
  const startPull = (e) => {
    if (horse.classList.contains("pulled")) return;
    if (e.type === "touchstart") e.preventDefault();
    if (isPulling) return;

    horse.style.transition = 'none';
    isPulling = true;
    startTime = Date.now();

    timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / data.pullTime, 1);
      const currentMove = data.maxDistance * progress;
      
      horse.style.transform = `translate(-50%, -${currentMove}px)`;

      // ▼▼▼ 追加：引っ張ってる間、小刻みに震える (Androidのみ) ▼▼▼
      // 20msごとに実行されるので、短い振動を連続させて「ジジジ…」という感触にする
      if (window.navigator.vibrate) window.navigator.vibrate(15);

      if (progress >= 1) {
        finishPull();
      }
    }, 20);
  };

  const cancelPull = () => {
    if (horse.classList.contains("pulled")) return;
    if (!isPulling) return;

    clearInterval(timer);
    isPulling = false;

    // ▼▼▼ 追加：指を離したら振動ストップ ▼▼▼
    if (window.navigator.vibrate) window.navigator.vibrate(0);

    horse.style.transition = 'transform 0.1s ease-out';
    horse.style.transform = `translate(-50%, 0px)`;
  };

  const finishPull = () => {
    clearInterval(timer);
    isPulling = false;

    setTimeout(() =>{
      playSe("hyuun");
    },990);

    // ▼▼▼ 追加：抜けた瞬間「ブブッ！」と強めに震える ▼▼▼
    if (window.navigator.vibrate) window.navigator.vibrate(200);
    
    // ★ここに追加！カウントアップ処理
    pulledCount++; // 数を1増やす
    updateCounter(); // 画面の表示を更新

    // もし9匹(POSITIONSの数)と一致したら、エンディングへ
    if (pulledCount === POSITIONS.length) {
      // 最後の馬が飛んでいくのを少し(3秒)待ってから画面切り替え
      setTimeout(startEnding, 2000);
    }
    
    console.log("1匹抜けた！合計: " + pulledCount);

    const pulledY = data.maxDistance;

    horse.style.transformOrigin = data.transformOrigin;
    horse.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    horse.style.transform = `translate(-50%, -${pulledY}px) rotate(180deg)`;

    setTimeout(() => {
      horse.classList.add("pulled");
      horse.style.transition = ''; 
    }, 1000);
  };

  // 4. イベント
  horse.addEventListener("touchstart", startPull, { passive: false });
  horse.addEventListener("touchend", cancelPull);
  horse.addEventListener("touchcancel", cancelPull);
  horse.addEventListener("mousedown", startPull);
  horse.addEventListener("mouseup", cancelPull);
  horse.addEventListener("mouseleave", cancelPull);
};

/* --- カウンター表示システム (新規追加) --- */
const setupCounter = () => {
  const div = document.createElement("div");
  div.id = "counter-display"; // IDをつけておく
  div.className = "pixel-text"; // ドット文字スタイルを適用
  
  // 位置と見た目
  div.style.top = "5%";      // 画面の上の方
  div.style.left = "50%";    // 真ん中
  div.style.fontSize = "40px"; // 大きく！
  div.style.color = "white";
  
  // 最初の表示 (/ 0 \)
  div.innerText = "/ 0 \\"; 
  
  document.getElementById("screen").appendChild(div);
};

// 表示を更新する関数
const updateCounter = () => {
  const counter = document.getElementById("counter-display");
  if (counter) {
    // ここで / 1 \ のような見た目を作る
    counter.innerText = `/ ${pulledCount} \\`;
  }
};

/* --- メイン処理：9匹生み出す！ --- */
/* --- 9匹の配置座標リスト (デザイン画に合わせた座標) --- */
const POSITIONS = [
  // 1段目 (上)
  { left: "20%", bottom: "73%" }, // 左上 (Cyan)
  { left: "80%", bottom: "72%" }, // 右上 (Red)
  { left: "45%", bottom: "60%" }, // 中央上 (Pink)

  // 2段目 (中)
  { left: "78%", bottom: "51.5%" }, // 右中 (Orange)
  { left: "18%", bottom: "50%" }, // 左中 (Lightgreen)
  { left: "50%", bottom: "35%" }, // 中央 (Blue)

  // 3段目 (下 - テキスト枠の上あたり)
  { left: "81%", bottom: "26%" }, // 右下 (Green)
  { left: "20%", bottom: "23%" }, // 左下 (Purple)
  { left: "46%", bottom: "17%" }, // 中央下 (Yellow)
];


/* --- 色の順番リスト (座標の並び順に対応) --- */
const COLOR_ORDER = [
  // 1段目 (奥)
  "cyan", "red", "pink",
  
  // 2段目 (中)
  "orange", "lightgreen", "blue",
  
  // 3段目 (手前)
  "green", "purple", "yellow"
];


// 右クリック禁止
window.oncontextmenu = function(e) { e.preventDefault(); e.stopPropagation(); return false; };


/* script.js *//////////////////////////////////////////////////////////////////////

/* --- 装飾品（画像）のデータ --- */
const DECO_DATA = [
  // 1. 下の黒い枠 (kuro.png)
  {
    src: "assets/deco/kuro.png",
    width: "90%",
    left: "50%",
    bottom: "7%",
    zIndex: 20
  },
  // 2. 右上の吹き出し (up.png)
  {
    src: "assets/deco/up.png",
    width: "18%",
    left: "70%",
    bottom: "74%",
    zIndex: 30
  },
  // 3. 左下のQR枠 (down.png)
  {
    src: "assets/deco/down.png",
    width: "28%",
    left: "23%",
    bottom: "25.5%",
    zIndex: 35
  }
];

/* --- テキスト（文字）のデータ --- */
// ★ここで文字の場所やサイズを一括管理！
const TEXT_DATA = [
  // 1. 上の吹き出し (up.png用)
  {
    id: "text-up",
    x: "72.5%",       // setupBalloonで調整していた座標を採用
    y: "75.5%", 
    fontSize: "9.5px", // 小さめ
    color: "black",
    messages: [
      "・・・",
      "うま が"
    ]
  },

  // 2. 下の吹き出し (down.png用)
  {
    id: "text-down",
    x: "20%",         // 画像のleft(23%)に合わせて真ん中に
    y: "27.5%",         // 画像(25.5%)より少し上に表示
    fontSize: "12px", // 上と合わせる
    color: "black",
    messages: [
      "・・・",
      "9頭..."
    ]
  },

  // 3. 下の黒枠 (kuro.png用)
  {
    id: "text-board",
    x: "50%",         // 真ん中
    y: "11%",         // setupMessageBoardで調整していた座標を採用
    fontSize: "18px",
    color: "white",
    messages: [
      `あけましておめでとうござ<span class="red-text">うま</span>す<span class="blinking-cursor">▼</span>`,
      `長押しで うま れます<span class="blinking-cursor">▼</span>`,
      `全部 うま れると…`
    ]
  }
];

/* --- 仕組みの部分　画像を表示する関数 --- */
const spawnDeco = () => {
  DECO_DATA.forEach(data => {
    const img = document.createElement("img");
    img.src = data.src;
    
    // スタイル設定
    img.style.position = "absolute";
    img.style.transform = "translate(-50%, 0)";
    img.style.pointerEvents = "none";
    
    img.style.width  = data.width;
    img.style.left   = data.left;
    img.style.bottom = data.bottom;
    img.style.zIndex = data.zIndex;
    
    document.getElementById("screen").appendChild(img);
  });
};

/* --- 文字を表示して切り替える関数 --- */
const setupTextSystem = () => {
  TEXT_DATA.forEach(data => {
    // 要素を作成
    const div = document.createElement("div");
    div.id = data.id;
    div.className = "pixel-text"; // CSSクラスを適用
    
    // 位置と見た目
    div.style.left = data.x;
    div.style.bottom = data.y;
    div.style.fontSize = data.fontSize;
    div.style.color = data.color;
    
    // メッセージの管理
    let step = 0;
    div.innerHTML = data.messages[0]; // 最初のメッセージを表示
    
    // クリック時の動作
    div.addEventListener("click", () => {

      playSe("click"); //click.mp3鳴らす


      step++;
      // 次のメッセージがあれば表示
      if (step < data.messages.length) {
        div.innerHTML = data.messages[step];
      } else {
        // 最後まで行ったら何もしない（あるいは step=0 でループさせてもOK）
      }
    });

    document.getElementById("screen").appendChild(div);
  });
};

/* --- 最後に実行！ --- */

document.addEventListener("DOMContentLoaded", () => {
  // 1. 準備完了したらここが動く
  console.log("全部読み込んだよ！ゲームスタート！");

  // 2. 装飾や文字を表示
  spawnDeco();
  setupTextSystem();
  setupCounter();
  
  // 3. 馬を9匹生成
  POSITIONS.forEach((pos, index) => {
    // もし色が足りなかったらループさせる安全策
    const colorName = COLOR_ORDER[index % COLOR_ORDER.length];
    
    // 馬を生み出す
    spawnHorse(colorName, pos.left, pos.bottom, index);
  });
});


/* --- エンディング演出 --- */////////////////////////////////////////////////////////
const startEnding = () => {
  const screen = document.getElementById("screen");
  
  // 1. 画面の要素をすべて消す (背景色はそのまま)
  screen.innerHTML = ""; 

  // 2. ロード画面 (...) を作成
  const loader = document.createElement("div");
  loader.className = "pixel-text"; // ドット文字クラスを流用
  loader.style.top = "50%";
  loader.style.left = "50%";
  loader.style.fontSize = "40px";
  // ドットを3つ並べる
  loader.innerHTML = '<span class="loading-dot">.</span><span class="loading-dot">.</span><span class="loading-dot">.</span>';
  screen.appendChild(loader);

  // 3. 3秒後に画像をフェードイン表示
  setTimeout(() => {
    // ロード画面を消す
    loader.remove();

    // (A)エンディング画像を作成
    const endImage = document.createElement("img");
    endImage.src = "assets/endingEV.png"; 
    
    // スタイル設定
    endImage.style.position = "absolute";
    endImage.style.top = "50%";
    endImage.style.left = "50%";
    endImage.style.transform = "translate(-50%, -50%)"; // 真ん中揃え
    
    // 画像サイズ (画面幅の90%など、お好みで)
    endImage.style.width = "90%"; 
    endImage.style.height = "auto"; // 縦横比を維持
    
    // --- フェードインの仕込み ---
    endImage.style.opacity = "0"; // 最初は透明にしておく
    // 1.5秒かけてふわっと表示させる設定
    endImage.style.transition = "opacity 1.5s ease-in-out";
    
    screen.appendChild(endImage);

    // 少しだけ待ってから、透明度を1(不透明)にする
    // (すぐにやるとtransitionが効かないことがあるため)
    setTimeout(() => {
      endImage.style.opacity = "1";
    }, 50); // 0.05秒後に実行

    //(B)リプレイボタン
    setTimeout(() => {
      // ボタンを作る
      const replayBtn = document.createElement("div");
      replayBtn.className = "pixel-text"; 
      replayBtn.innerText = "リプレイ"; // ボタンの文字
      
      // ボタンのデザイン（位置、色、枠線）
      replayBtn.style.bottom = "15%"; // 画面の下の方
      replayBtn.style.left = "50%";
      replayBtn.style.fontSize = "15px";
      replayBtn.style.color = "white";
      replayBtn.style.cursor = "pointer"; // 指カーソルにする
      // replayBtn.style.border = "2px solid white"; // 白い枠線
      // replayBtn.style.padding = "10px 20px"; // 文字の周りの余白
      // replayBtn.style.backgroundColor = "rgba(0,0,0,0.3)"; // 背景を半透明の黒に
      
      // ふわっと出す準備
      replayBtn.style.opacity = "0";
      replayBtn.style.transition = "opacity 1s";
      
      // ★クリックした時の動作★
      replayBtn.addEventListener("click", () => {
        // 1. 音を鳴らす
        playSe("click");
        
        // 2. 音を聞かせるために0.3秒だけ待ってから...
        setTimeout(() => {
          // ★ページを再読み込み！（＝ゲームリセット）
          location.reload(); 
        }, 300);
      });

      screen.appendChild(replayBtn);

      // ボタンを表示
      setTimeout(() => {
        replayBtn.style.opacity = "1";
      }, 50);

    }, 5000);

  }, 3000); // 3秒待機


};





