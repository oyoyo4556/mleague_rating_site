export interface PlayerRanks {
  top: number;
  second: number;
  third: number;
  fourth: number;
}

// 履歴データの型
export interface PlHistoryItem {
  gameId: number;
  gamesPlayed: number;
  rating: number;
}

export interface MsrHistoryItem {
  gameId: number;
  gamesPlayed: number;
  msrRating: number;
  sigma: number;
}

// 選手データの型
export interface PlayerData {
  id: number;
  name: string;
  gamma: number;

  // Plackett-Luce 系
  plRating: number;
  plMaxRating: number;
  plMinRating: number;
  plHistory: PlHistoryItem[];

  // MSR 系
  msrRating: number;
  msrMaxRating: number;
  msrMinRating: number;
  msrSigma: number;
  msrHistory: MsrHistoryItem[];

  // 共通スタッツ
  gamesCount: number;
  ranks: {
    top: number;
    second: number;
    third: number;
    fourth: number;
  };
}

export interface RatingsJSON {
  updatedAt: string;
  players: Record<string, PlayerData>;
}