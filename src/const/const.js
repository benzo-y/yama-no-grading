const PHYSICAL = [1,2,3,4,5,6,7,8,9,10];
const TECHNOLOGICAL = ["A","B","C","D","E"];

const MATRIX_AXIS = {
  physical: [
    { grade: 10, body: "体力度：10", tooltip: "2～3泊以上が適当" },
    { grade:  9, body: "体力度：9",  tooltip: "2～3泊以上が適当" },
    { grade:  8, body: "体力度：8",  tooltip: "2～3泊以上が適当" },
    { grade:  7, body: "体力度：7",  tooltip: "1～2泊以上が適当" },
    { grade:  6, body: "体力度：6",  tooltip: "1～2泊以上が適当" },
    { grade:  5, body: "体力度：5",  tooltip: "1泊以上が適当" },
    { grade:  4, body: "体力度：4",  tooltip: "1泊以上が適当" },
    { grade:  3, body: "体力度：3",  tooltip: "日帰りが可能" },
    { grade:  2, body: "体力度：2",  tooltip: "日帰りが可能" },
    { grade:  1, body: "体力度：1",  tooltip: "日帰りが可能" },
  ],
  technological: [
    { grade: "A", body: "技術的難易度：A", tooltip: `登山道<br>
                            ◇概ね整備済<br>
                            ◇転んだ場合でも転落・滑落の可能性は低い。<br>
                            ◇道迷いの心配は少ない。<br>
                            <br>
                            技術・能力<br>
                            ◇登山の装備が必要`
    },
    { grade: "B", body: "技術的難易度：B", tooltip: `登山道<br>
                            ◇沢、崖、場所により雪渓などを通過<br>
                            ◇急な登下降がある。<br>
                            ◇道が分かりにくい所がある。<br>
                            ◇転んだ場合の転落・滑落事故につながる場所がある。<br>
                            <br>
                            技術・能力<br>
                            ◇登山経験が必要<br>
                            ◇地図読み能力があることが望ましい。`
    },
    { grade: "C", body: "技術的難易度：C", tooltip: `登山道<br>
                            ◇ハシゴ・くさり場、また、場所により雪渓や渡渉箇所がある。<br>
                            ◇ミスをすると転落・滑落などの事故になる場所がある。<br>
                            ◇案内標識が不十分な箇所も含まれる。<br>
                            <br>
                            技術・能力<br>
                            ◇地図読み能力、ハシゴ・くさり場などを通過できる身体能力が必要`
    },
    { grade: "D", body: "技術的難易度：D", tooltip: `登山道<br>
                            ◇厳しい岩稜や不安定なガレ場、ハシゴ・くさり場、藪漕ぎを必要とする箇所、場所により雪渓や渡渉箇所がある。<br>
                            ◇手を使う急な登下降がある。<br>
                            ◇ハシゴ・くさり場や案内標識などの人工的な補助は限定的で、転落・滑落の危険箇所が多い。<br>
                            <br>
                            技術・能力<br>
                            ◇地図読み能力、岩場、雪渓を安定して通過できるバランス能力や技術が必要<br>
                            ◇ルートファインディングの技術が必要`
    },
    { grade: "E", body: "技術的難易度：E", tooltip: `登山道<br>
                            ◇緊張を強いられる厳しい岩稜の登下降が続き、転落・滑落の危険箇所が連続する。<br>
                            ◇深い藪漕ぎを必要とする箇所が連続する場合がある。<br>
                            <br>
                            技術・能力<br>
                            ◇地図読み能力、岩場、雪渓を安定して通過できるバランス能力や技術が必要<br>
                            ◇ルートファインディングの技術、高度な判断力が必要<br>
                            ◇登山者によってはロープを使わないと危険な場所もある`
    },
  ],
};


const PUBLISHER = {
  nagano: "長野",
  yamanashi: "山梨",
  shizuoka: "静岡",
  niigata: "新潟",
  gunma: "群馬",
  gifu: "岐阜",
  tochigi: "栃木",
  ishizuchisankei: "石鎚山系",
  akita: "秋田",
  toyama: "富山",
  hyaku: "百名山",
  other: "その他",
};

const PUBLISHER_ITEMS = Object.entries(PUBLISHER).map(arr => {
  return {value:arr[0], name:arr[1]}
});

const CLIMBED_ICON_COLOR = {
  on: "yellow darken-3",
  off: "grey lighten-1"
}
const CLIMBED_ICON_ITEMS = [
  {value:true, color: CLIMBED_ICON_COLOR.on},
  {value:false, color: CLIMBED_ICON_COLOR.off},
];

export { PHYSICAL, TECHNOLOGICAL, MATRIX_AXIS, PUBLISHER, PUBLISHER_ITEMS, CLIMBED_ICON_COLOR, CLIMBED_ICON_ITEMS };