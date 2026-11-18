// Reading Plus 單字打怪王 - Phaser 版
// 核心戰鬥 + 圖鑑

const WIDTH = 390;
const HEIGHT = 700;

class BootScene extends Phaser.Scene {
  constructor() {
    super("Boot");
  }

  preload() {
    // 載入怪物圖片，失敗也不卡住
    this.load.on("loaderror", function (file) {
      console.warn("圖片載入失敗:", file.src);
    });
    MONSTERS.forEach(m => {
      this.load.image(m.id, m.img);
    });
  }

  create() {
    this.scene.start("Menu");
  }
}

class MenuScene extends Phaser.Scene {
  constructor() {
    super("Menu");
  }

  create() {
    const { width, height } = this.scale;

    // 背景
    this.add.rectangle(0, 0, width, height, 0x0d1626).setOrigin(0);

    // 標題
    this.add.text(width / 2, 120, "單字打怪王", {
      fontFamily: "Noto Sans TC, sans-serif",
      fontSize: "42px",
      fontStyle: "bold",
      color: "#edf2fa"
    }).setOrigin(0.5);

    this.add.text(width / 2, 175, "Phaser 版", {
      fontFamily: "Noto Sans TC, sans-serif",
      fontSize: "18px",
      color: "#9babc4"
    }).setOrigin(0.5);

    // 開始戰鬥按鈕
    const battleBtn = this.createButton(width / 2, 320, "開始戰鬥", 0x3b82f6, () => {
      this.scene.start("Select");
    });

    // 圖鑑按鈕
    this.createButton(width / 2, 400, "怪物圖鑑", 0x7a4be0, () => {
      this.scene.start("Collection");
    });

    // 說明
    this.add.text(width / 2, height - 80, "答對單字即可攻擊怪物\n字母會一個一個飛出去", {
      fontFamily: "Noto Sans TC, sans-serif",
      fontSize: "14px",
      color: "#5b6f87",
      align: "center"
    }).setOrigin(0.5);
  }

  createButton(x, y, label, color, callback) {
    const bg = this.add.rectangle(x, y, 240, 56, color, 1)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", callback)
      .on("pointerover", () => bg.setFillStyle(color, 0.85))
      .on("pointerout", () => bg.setFillStyle(color, 1));

    this.add.text(x, y, label, {
      fontFamily: "Noto Sans TC, sans-serif",
      fontSize: "22px",
      fontStyle: "bold",
      color: "#ffffff"
    }).setOrigin(0.5);

    return bg;
  }
}

class SelectScene extends Phaser.Scene {
  constructor() {
    super("Select");
  }

  create() {
    const { width, height } = this.scale;

    this.add.rectangle(0, 0, width, height, 0x0d1626).setOrigin(0);

    this.add.text(width / 2, 50, "選擇要挑戰的怪物", {
      fontFamily: "Noto Sans TC, sans-serif",
      fontSize: "24px",
      fontStyle: "bold",
      color: "#edf2fa"
    }).setOrigin(0.5);

    // 返回
    const back = this.add.text(30, 30, "← 返回", {
      fontFamily: "Noto Sans TC, sans-serif",
      fontSize: "16px",
      color: "#9babc4"
    }).setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.scene.start("Menu"));

    // 怪物列表
    const startY = 110;
    const gap = 70;

    MONSTERS.forEach((m, i) => {
      const y = startY + i * gap;
      const row = this.add.rectangle(width / 2, y, 340, 60, 0x15213a)
        .setInteractive({ useHandCursor: true })
        .on("pointerdown", () => {
          this.scene.start("Battle", { monsterId: m.id });
        })
        .on("pointerover", () => row.setFillStyle(0x1e2d4a))
        .on("pointerout", () => row.setFillStyle(0x15213a));

      // 小圖示
      if (this.textures.exists(m.id)) {
        this.add.image(50, y, m.id).setDisplaySize(48, 48);
      }

      this.add.text(95, y - 12, m.zh, {
        fontFamily: "Noto Sans TC, sans-serif",
        fontSize: "18px",
        fontStyle: "bold",
        color: "#edf2fa"
      });

      this.add.text(95, y + 12, `${m.en}  ·  HP ${m.maxHp}`, {
        fontFamily: "Noto Sans TC, sans-serif",
        fontSize: "13px",
        color: "#9babc4"
      });
    });
  }
}

class BattleScene extends Phaser.Scene {
  constructor() {
    super("Battle");
  }

  init(data) {
    this.monsterId = data.monsterId || "bathtub";
    this.monster = MONSTERS.find(m => m.id === this.monsterId) || MONSTERS[0];
    this.hp = this.monster.maxHp;
    this.maxHp = this.monster.maxHp;
    this.currentWord = null;
    this.inputStr = "";
    this.isAnimating = false;
    this.letters = [];
  }

  create() {
    const { width, height } = this.scale;

    // 背景
    this.add.rectangle(0, 0, width, height, 0x0d1626).setOrigin(0);

    // 返回
    this.add.text(20, 20, "← 離開", {
      fontFamily: "Noto Sans TC, sans-serif",
      fontSize: "16px",
      color: "#9babc4"
    }).setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.scene.start("Select"));

    // 怪物名稱
    this.add.text(width / 2, 50, this.monster.zh, {
      fontFamily: "Noto Sans TC, sans-serif",
      fontSize: "22px",
      fontStyle: "bold",
      color: "#edf2fa"
    }).setOrigin(0.5);

    // 怪物圖片
    this.monsterImg = this.add.image(width / 2, 200, this.monster.id)
      .setDisplaySize(180, 180);

    // 血條背景
    this.hpBarBg = this.add.rectangle(width / 2, 310, 260, 18, 0x24344f);
    this.hpBar = this.add.rectangle(width / 2 - 130, 310, 260, 18, 0x3dd68c)
      .setOrigin(0, 0.5);

    this.hpText = this.add.text(width / 2, 335, `${this.hp} / ${this.maxHp}`, {
      fontFamily: "Noto Sans TC, sans-serif",
      fontSize: "14px",
      color: "#9babc4"
    }).setOrigin(0.5);

    // 單字區域
    this.wordLabel = this.add.text(width / 2, 390, "", {
      fontFamily: "Noto Sans TC, sans-serif",
      fontSize: "16px",
      color: "#9babc4"
    }).setOrigin(0.5);

    this.wordDisplay = this.add.text(width / 2, 430, "", {
      fontFamily: "Noto Sans TC, sans-serif",
      fontSize: "32px",
      fontStyle: "bold",
      color: "#edf2fa"
    }).setOrigin(0.5);

    this.inputDisplay = this.add.text(width / 2, 480, "", {
      fontFamily: "Noto Sans TC, sans-serif",
      fontSize: "28px",
      color: "#ffc83d"
    }).setOrigin(0.5);

    this.hintText = this.add.text(width / 2, 530, "輸入英文單字後按 Enter", {
      fontFamily: "Noto Sans TC, sans-serif",
      fontSize: "14px",
      color: "#5b6f87"
    }).setOrigin(0.5);

    // 結果提示
    this.resultText = this.add.text(width / 2, 580, "", {
      fontFamily: "Noto Sans TC, sans-serif",
      fontSize: "20px",
      fontStyle: "bold",
      color: "#3dd68c"
    }).setOrigin(0.5);

    // 鍵盤輸入
    this.input.keyboard.on("keydown", this.onKey, this);

    // 開始第一題
    this.nextWord();
  }

  nextWord() {
    this.currentWord = Phaser.Utils.Array.GetRandom(WORDS);
    this.inputStr = "";
    this.isAnimating = false;

    this.wordLabel.setText(this.currentWord.zh + "  ·  " + this.currentWord.def);
    this.wordDisplay.setText("_ ".repeat(this.currentWord.en.length).trim());
    this.inputDisplay.setText("");
    this.resultText.setText("");
    this.hintText.setText("輸入英文單字後按 Enter");
  }

  onKey(event) {
    if (this.isAnimating) return;

    const key = event.key;

    if (key === "Enter") {
      this.checkAnswer();
      return;
    }

    if (key === "Backspace") {
      this.inputStr = this.inputStr.slice(0, -1);
      this.inputDisplay.setText(this.inputStr);
      return;
    }

    if (/^[a-zA-Z]$/.test(key) && this.inputStr.length < 20) {
      this.inputStr += key.toLowerCase();
      this.inputDisplay.setText(this.inputStr);
    }
  }

  checkAnswer() {
    if (!this.inputStr) return;

    const correct = this.inputStr === this.currentWord.en;

    if (correct) {
      this.resultText.setColor("#3dd68c").setText("答對了！攻擊！");
      this.launchLetters();
    } else {
      this.resultText.setColor("#ff7a7f").setText("答錯了！怪物反擊！");
      this.monsterAttack();
    }
  }

  launchLetters() {
    this.isAnimating = true;
    const word = this.currentWord.en;
    const startX = this.scale.width / 2;
    const startY = 480;
    const targetY = 200;

    let delay = 0;
    const letterDamage = Math.floor(12 + Math.random() * 8);

    word.split("").forEach((ch, i) => {
      this.time.delayedCall(delay, () => {
        const letter = this.add.text(startX - (word.length * 12) + i * 24, startY, ch.toUpperCase(), {
          fontFamily: "Noto Sans TC, sans-serif",
          fontSize: "28px",
          fontStyle: "bold",
          color: "#ffc83d"
        }).setOrigin(0.5);

        this.tweens.add({
          targets: letter,
          y: targetY + Phaser.Math.Between(-20, 20),
          x: startX + Phaser.Math.Between(-40, 40),
          scale: 1.4,
          alpha: 0.3,
          duration: 450,
          ease: "Cubic.easeOut",
          onComplete: () => {
            letter.destroy();
            // 最後一個字母造成傷害
            if (i === word.length - 1) {
              this.dealDamage(letterDamage * word.length);
            }
          }
        });
      });
      delay += 80;
    });
  }

  dealDamage(dmg) {
    this.hp = Math.max(0, this.hp - dmg);
    this.updateHpBar();

    // 受擊效果
    this.tweens.add({
      targets: this.monsterImg,
      x: this.monsterImg.x + 12,
      duration: 50,
      yoyo: true,
      repeat: 3
    });

    this.monsterImg.setTint(0xff6666);
    this.time.delayedCall(200, () => this.monsterImg.clearTint());

    if (this.hp <= 0) {
      this.time.delayedCall(600, () => this.win());
    } else {
      this.time.delayedCall(800, () => {
        this.isAnimating = false;
        this.nextWord();
      });
    }
  }

  monsterAttack() {
    this.isAnimating = true;

    this.tweens.add({
      targets: this.monsterImg,
      scale: 1.15,
      duration: 200,
      yoyo: true,
      onComplete: () => {
        this.resultText.setColor("#ff7a7f").setText("被反擊了！再試一次");
        this.time.delayedCall(900, () => {
          this.isAnimating = false;
          this.inputStr = "";
          this.inputDisplay.setText("");
          this.resultText.setText("");
        });
      }
    });
  }

  updateHpBar() {
    const ratio = this.hp / this.maxHp;
    this.hpBar.width = 260 * ratio;
    this.hpText.setText(`${this.hp} / ${this.maxHp}`);

    if (ratio < 0.3) this.hpBar.setFillStyle(0xff7a7f);
    else if (ratio < 0.6) this.hpBar.setFillStyle(0xffc83d);
    else this.hpBar.setFillStyle(0x3dd68c);
  }

  win() {
    this.isAnimating = true;
    this.resultText.setColor("#ffc83d").setText("勝利！怪物被打倒了！");

    this.tweens.add({
      targets: this.monsterImg,
      alpha: 0,
      scale: 0.5,
      duration: 800,
      onComplete: () => {
        this.time.delayedCall(600, () => {
          this.scene.start("Select");
        });
      }
    });
  }
}

class CollectionScene extends Phaser.Scene {
  constructor() {
    super("Collection");
  }

  create() {
    const { width, height } = this.scale;

    this.add.rectangle(0, 0, width, height, 0x0d1626).setOrigin(0);

    this.add.text(width / 2, 40, "怪物圖鑑", {
      fontFamily: "Noto Sans TC, sans-serif",
      fontSize: "26px",
      fontStyle: "bold",
      color: "#edf2fa"
    }).setOrigin(0.5);

    this.add.text(20, 20, "← 返回", {
      fontFamily: "Noto Sans TC, sans-serif",
      fontSize: "16px",
      color: "#9babc4"
    }).setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.scene.start("Menu"));

    // 簡單網格
    const cols = 2;
    const cardW = 160;
    const cardH = 180;
    const startX = 30;
    const startY = 90;
    const gapX = 20;
    const gapY = 20;

    MONSTERS.forEach((m, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = startX + col * (cardW + gapX) + cardW / 2;
      const y = startY + row * (cardH + gapY) + cardH / 2;

      const card = this.add.rectangle(x, y, cardW, cardH, 0x15213a, 1);

      if (this.textures.exists(m.id)) {
        this.add.image(x, y - 25, m.id).setDisplaySize(100, 100);
      }

      this.add.text(x, y + 55, m.zh, {
        fontFamily: "Noto Sans TC, sans-serif",
        fontSize: "16px",
        fontStyle: "bold",
        color: "#edf2fa"
      }).setOrigin(0.5);

      this.add.text(x, y + 75, m.en, {
        fontFamily: "Noto Sans TC, sans-serif",
        fontSize: "12px",
        color: "#9babc4"
      }).setOrigin(0.5);
    });
  }
}

// 遊戲設定
const config = {
  type: Phaser.AUTO,
  width: WIDTH,
  height: HEIGHT,
  parent: "game-container",
  backgroundColor: "#0D1626",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [BootScene, MenuScene, SelectScene, BattleScene, CollectionScene],
  dom: {
    createContainer: true
  }
};

try {
  const game = new Phaser.Game(config);
  console.log("Game started successfully");
} catch (e) {
  console.error("Game start failed:", e);
  var el = document.getElementById("status");
  if (el) {
    el.style.display = "block";
    el.style.color = "#ff7a7f";
    el.innerHTML = "遊戲啟動失敗<br>" + e.message;
  }
}
