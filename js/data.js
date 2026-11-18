// 怪物資料
const MONSTERS = [
  {
    id: "bathtub",
    zh: "浴缸冰怪",
    en: "Ice Tub",
    type: "ice",
    maxHp: 80,
    img: "assets/monsters/bathtub.jpg",
    color: 0x7ec8ff
  },
  {
    id: "mop_cabinet",
    zh: "拖把櫃怪",
    en: "Mop Cabinet",
    type: "mech",
    maxHp: 90,
    img: "assets/monsters/mop_cabinet.jpg",
    color: 0xc4a484
  },
  {
    id: "blanket",
    zh: "毛毯怪",
    en: "Blanket",
    type: "forest",
    maxHp: 70,
    img: "assets/monsters/blanket.jpg",
    color: 0xff8c42
  },
  {
    id: "word_eater",
    zh: "吞字魔王",
    en: "Word Eater",
    type: "boss",
    maxHp: 150,
    img: "assets/monsters/word_eater.jpg",
    color: 0x9b59b6
  },
  {
    id: "broom",
    zh: "掃把怪",
    en: "Broom",
    type: "forest",
    maxHp: 75,
    img: "assets/monsters/broom.jpg",
    color: 0xd4a574
  },
  {
    id: "vacuum",
    zh: "吸塵器怪",
    en: "Vacuum",
    type: "mech",
    maxHp: 85,
    img: "assets/monsters/vacuum.jpg",
    color: 0x5dade2
  },
  {
    id: "pillow",
    zh: "枕頭怪",
    en: "Pillow",
    type: "sky",
    maxHp: 65,
    img: "assets/monsters/pillow.jpg",
    color: 0xaed6f1
  },
  {
    id: "clock",
    zh: "時鐘怪",
    en: "Clock",
    type: "mech",
    maxHp: 80,
    img: "assets/monsters/clock.jpg",
    color: 0x85929e
  }
];

// 簡易單字資料（之後可擴充）
const WORDS = [
  { en: "happy", zh: "開心的", def: "feeling or showing pleasure" },
  { en: "brave", zh: "勇敢的", def: "ready to face danger" },
  { en: "quiet", zh: "安靜的", def: "making little or no noise" },
  { en: "bright", zh: "明亮的", def: "giving out or reflecting light" },
  { en: "strong", zh: "強壯的", def: "having power or force" },
  { en: "gentle", zh: "溫柔的", def: "mild in temperament or behavior" },
  { en: "clever", zh: "聰明的", def: "quick to understand" },
  { en: "honest", zh: "誠實的", def: "free of deceit; truthful" },
  { en: "kind", zh: "善良的", def: "having a friendly nature" },
  { en: "proud", zh: "驕傲的", def: "feeling deep pleasure or satisfaction" },
  { en: "calm", zh: "平靜的", def: "not showing or feeling nervousness" },
  { en: "wise", zh: "有智慧的", def: "having experience and knowledge" },
  { en: "funny", zh: "有趣的", def: "causing laughter or amusement" },
  { en: "loyal", zh: "忠誠的", def: "giving constant support" },
  { en: "patient", zh: "有耐心的", def: "able to accept delay without becoming annoyed" }
];

// 類型對應顏色
const TYPE_COLORS = {
  ice: 0x7ec8ff,
  mech: 0xaeb6bf,
  forest: 0x82e0aa,
  sky: 0xaed6f1,
  boss: 0xbb8fce
};
