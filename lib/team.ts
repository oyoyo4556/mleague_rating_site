
export interface TeamConfig {
  id: string;
  name: string;
  // 背景色・テキスト色など必要に応じて定義
  bgGradient: string; // 例: Tailwindのグラデーションクラス
  primaryColor: string; // HEXコード（インラインスタイル用）
  textColor: string;
}

// チーム一覧とデザイン設定
export const TEAMS: Record<string, TeamConfig> = {
  driven: {
    id: 'driven',
    name: '赤坂ドリブンズ',
    bgGradient: 'bg-[#00A859] dark:bg-slate-900 to-slate-600 dark:to-slate-900',
    primaryColor: '#00A859',
    textColor: 'text-green-400',
  },
  ex: {
    id: 'ex',
    name: 'EX風林火山',
    bgGradient: 'bg-[#E60012] dark:bg-slate-900 to-slate-900 dark:to-slate-900',
    primaryColor: '#E60012',
    textColor: 'text-red-400',
  },
  sakura: {
    id: 'sakura',
    name: 'KADOKAWAサクラナイツ',
    bgGradient: 'bg-[#f7c2e6] dark:bg-slate-900 to-white dark:to-slate-900',
    primaryColor: '#f7c2e6',
    textColor: 'text-pink-400',
  },
  fight: {
    id: 'fight',
    name: 'KONAMI麻雀格闘倶楽部',
    bgGradient: 'bg-gradient-to-b bg-[#E6007E] dark:bg-slate-900 to-white dark:to-slate-900 border-8 border-solid border-[#20429a] dark:border-slate-900',
    primaryColor: '#E6007E',
    textColor: 'text-amber-400',
  },
  abemas: {
    id: 'abemas',
    name: '渋谷ABEMAS',
    bgGradient: 'bg-[#E4BD7A]/70 dark:bg-slate-900 to-slate-900 dark:to-slate-900',
    primaryColor: '#E4BD7A',
    textColor: 'text-yellow-400',
  },
  phoenix: {
    id: 'phoenix',
    name: 'セガサミーフェニックス',
    bgGradient: 'bg-[#EE7B00] dark:bg-slate-900 to-slate-900 dark:to-slate-900',
    primaryColor: '#EE7B00',
    textColor: 'text-orange-400',
  },
  raiden: {
    id: 'raiden',
    name: 'TEAM RAIDEN / 雷電',
    bgGradient: 'from-yellow-400 dark:bg-slate-900 to-slate-900 dark:to-slate-900',
    primaryColor: '#FFD700',
    textColor: 'text-yellow-300',
  },
  pirates: {
    id: 'pirates',
    name: 'U-NEXT PIRATES',
    bgGradient: 'from-blue-400/80 dark:from-slate-900 to-slate-900 dark:to-slate-900',
    primaryColor: '#0088CE',
    textColor: 'text-blue-400',
  },
  beast: {
    id: 'beast',
    name: 'BEAST X',
    bgGradient: 'bg-[#0d265b] dark:bg-slate-900 border-4 border-solid border-[#7DA183] dark:border-slate-900',
    primaryColor: '#0d265b',
    textColor: 'text-blue-900',
  },
  earth: {
    id: 'earth',
    name: 'アースジェッツ',
    bgGradient: 'bg-gradient-to-r from-[#ee1c23]/70 from-50% dark:from-slate-900 to-[#058046]/70 to-50% dark:to-slate-900',
    primaryColor: '#058046',
    textColor: 'text-green-400',

  }
};

// 選手名（または選手ID）と チームID の紐付け（現時点・最新）
// ※ JSONの `name`（例: "園田賢"）あるいは `id` とキーを合わせます
export const PLAYER_TEAM_MAP: Record<string, string> = {
  // 赤坂ドリブンズ
  '園田賢': 'driven',
  '鈴木たろう': 'driven',
  '浅見真紀': 'driven',
  '渡辺太': 'driven',

  // EX風林火山
  '永井孝典': 'ex',
  '二階堂亜樹': 'ex',
  '勝又健志': 'ex',
  '内川幸太郎': 'ex',

  // KADOKAWAサクラナイツ
  '尻無濱航': 'sakura',
  '岡田紗佳': 'sakura',
  '阿久津翔太': 'sakura',
  '堀慎吾': 'sakura',

  // KONAMI麻雀格闘倶楽部
  '佐々木寿人': 'fight',
  '高宮まり': 'fight',
  '伊達朱里紗': 'fight',
  '滝沢和典': 'fight',

  // 渋谷ABEMAS
  '多井隆晴': 'abemas',
  '白鳥翔': 'abemas',
  '松本吉弘': 'abemas',
  '日向藍子': 'abemas',

  // セガサミーフェニックス
  '茅森早香': 'phoenix',
  '醍醐大': 'phoenix',
  '竹内元太': 'phoenix',
  '佐野ひなこ': 'phoenix',

  // TEAM RAIDEN / 雷電
  '瀬戸熊直樹': 'raiden',
  '黒沢咲': 'raiden',
  '本田朋広': 'raiden',
  '萩原聖人': 'raiden',

  // U-NEXT PIRATES
  '朝倉康心': 'pirates',
  '瑞原明奈': 'pirates',
  '鈴木優': 'pirates',
  '仲林圭': 'pirates',

  // BEAST X
  '下石戟': 'beast',
  '東城りお': 'beast',
  '鈴木大介': 'beast',
  '中田花奈': 'beast',

  //アースジェッツ
  '石井一馬': 'earth',
  '三浦智博': 'earth',
  '逢川恵夢': 'earth',
  'HIRO柴田': 'earth',

};

/**
 * 選手名からチーム設定を取得するヘルパー関数
 */
export function getTeamByPlayerName(playerName: string): TeamConfig | null {
  const teamId = PLAYER_TEAM_MAP[playerName];
  if (!teamId) return null;
  return TEAMS[teamId] || null;
}