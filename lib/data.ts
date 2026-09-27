import ratingsData from '../public/mleague_ratings.json';
import { PlayerData, RatingsJSON } from '../types/rating';
import { TEAMS, PLAYER_TEAM_MAP, TeamConfig } from './team';

const data = ratingsData as RatingsJSON;

export type RatingType = 'pl' | 'msr';

export interface PlayerWithForm extends PlayerData {
  formChange: number; // 直近からのレート変動量
}

export interface PlayerWithDeviation extends PlayerData {
  maxRatingDeviation: number;
}

export function getUpdatedAt(): string {
  return data.updatedAt;
}

/**
 * 指定した試合数（minGames）以上の選手を取得（現在レート順）
 */
export function getSortedPlayers(minGames: number = 0): PlayerData[] {
  const players = Object.values(data.players);
  return players.filter((p) => p.gamesCount >= minGames);
}

/**
 * 指定した試合数（minGames）以上の選手を対象に、その集団内での最高レート偏差値を算出（最高レート順）
 */
export function calculateMaxRatingDeviations(
  players: PlayerData[],
  type: RatingType = 'pl'
): PlayerWithDeviation[] {
  if (players.length === 0) return [];

  // 対象の最高レート値を取り出す
  const getMaxRating = (p: PlayerData) => (type === 'msr' ? p.msrMaxRating : p.plMaxRating);

  const maxRatings = players.map(getMaxRating);
  const avg = maxRatings.reduce((a, b) => a + b, 0) / maxRatings.length;
  const std = Math.sqrt(
    maxRatings.reduce((sq, n) => sq + Math.pow(n - avg, 2), 0) / maxRatings.length
  );

  return players
    .map((p) => {
      const targetMax = getMaxRating(p);
      const deviation = std === 0 ? 50 : 50 + (10 * (targetMax - avg)) / std;
      return { ...p, maxRatingDeviation: deviation };
    })
    .sort((a, b) => getMaxRating(b) - getMaxRating(a));
}

/**
 * 【共通化】直近の調子（レート変動量）計算関数
 * 指定されたレート方式（'pl' | 'msr'）に応じた履歴データを参照して直近変動量を算出します。
 */
export function calculatePlayerForm(
  players: PlayerData[],
  checkPointOffset: number = 2,
  type: RatingType = 'pl'
): PlayerWithForm[] {
  return players.map((player) => {
    if (type === 'msr') {
      const history = player.msrHistory || [];
      if (history.length <= checkPointOffset) {
        return { ...player, formChange: 0 };
      }
      const current = player.msrRating;
      const past = history[history.length - 1 - checkPointOffset]?.msrRating ?? current;
      return { ...player, formChange: current - past };
    } else {
      const history = player.plHistory || [];
      if (history.length <= checkPointOffset) {
        return { ...player, formChange: 0 };
      }
      const current = player.plRating;
      const past = history[history.length - 1 - checkPointOffset]?.rating ?? current;
      return { ...player, formChange: current - past };
    }
  });
}


export function getMaxRatingSortedPlayers(minGames: number = 0): PlayerWithDeviation[] {
  const filtered = Object.values(data.players).filter((p) => p.gamesCount >= minGames);
  return calculateMaxRatingDeviations(filtered);
}

export function getPlayerById(id: string): PlayerData | null {
  return data.players[id] || null;
}

export function getAllPlayerIds(): string[] {
  return Object.keys(data.players);
}

export interface SimulationResult {
  seatIndex: number;
  player: PlayerData;
  expectedRank: number; // 平均期待着順
  winRate: number;      // 1位率 (%)
  secondRate: number;   // 2位率 (%)
  thirdRate: number;    // 3位率 (%)
  fourthRate: number;   // 4位率 (%)
  oppAvgRating: number;   // 相手3人の平均Rating 
  expectedPoints: number; // 期待獲得ポイント pt 
}

const RATING_TO_POINT_K = 0.0391;

/**
 * 4人の選手データからPlackett-Luceの着順分布を計算する（重複選択対応）
 */
export function simulateMatch(players: PlayerData[]): SimulationResult[] {
  if (players.length !== 4) return [];

  // 0, 1, 2, 3 の席順インデックスの全24通りの順列を生成
  const getPermutations = <T>(arr: T[]): T[][] => {
    if (arr.length === 0) return [[]];
    return arr.flatMap((v, i) =>
      getPermutations([...arr.slice(0, i), ...arr.slice(i + 1)]).map((p) => [v, ...p])
    );
  };

  const seatIndices = [0, 1, 2, 3];
  const permutations = getPermutations(seatIndices);
  
  // 各席順（seatIndex）の選手が各着順（0〜3位）になる確率 [seatIndex][rankIndex]
  const rankProbs: number[][] = Array.from({ length: 4 }, () => [0, 0, 0, 0]);

  for (const perm of permutations) {
    // perm は例: [2, 0, 3, 1] （2番席が1位、0番席が2位...）
    const g0 = players[perm[0]].gamma;
    const g1 = players[perm[1]].gamma;
    const g2 = players[perm[2]].gamma;
    const g3 = players[perm[3]].gamma;

    const prob =
      (g0 / (g0 + g1 + g2 + g3)) *
      (g1 / (g1 + g2 + g3)) *
      (g2 / (g2 + g3));

    // 席順ごとの着順確率を加算
    perm.forEach((seatIdx, rankIndex) => {
      rankProbs[seatIdx][rankIndex] += prob;
    });
  }

  return players.map((player, seatIdx) => {
    const p1 = rankProbs[seatIdx][0] * 100;
    const p2 = rankProbs[seatIdx][1] * 100;
    const p3 = rankProbs[seatIdx][2] * 100;
    const p4 = rankProbs[seatIdx][3] * 100;
    
    const expectedRank =
      1 * rankProbs[seatIdx][0] +
      2 * rankProbs[seatIdx][1] +
      3 * rankProbs[seatIdx][2] +
      4 * rankProbs[seatIdx][3];

    const oppSum = players
      .reduce((sum, p) => sum + p.msrRating, 0);
    const AveRating = oppSum /4 ;
    // --- 期待獲得ポイント (pt) 計算 ---
    // (自分のRating - 卓の平均Rating) * K
    const expectedPoints = (player.msrRating - AveRating) * RATING_TO_POINT_K;

    return {
      seatIndex: seatIdx,
      player,
      winRate: Math.round(p1 * 10) / 10,
      secondRate: Math.round(p2 * 10) / 10,
      thirdRate: Math.round(p3 * 10) / 10,
      fourthRate: Math.round(p4 * 10) / 10,
      expectedRank: Math.round(expectedRank * 100) / 100,
      oppAvgRating: Math.round(oppSum * 10) / 10,
      expectedPoints: Math.round(expectedPoints * 10) / 10,
    };
  });
}

export interface TeamRankingItem {
  team: TeamConfig;
  playerCount: number;
  totalGames: number;
  averageRating: number;
  players: PlayerData[];
}
/**
 * チームごとの平均レートランキングを取得
 */
export function getTeamRankings(
  players: PlayerData[],
  type: RatingType = 'pl'
): TeamRankingItem[] {
  // 1. TEAMS の全チームをベースに初期化
  const teamItemsMap = new Map<string, TeamRankingItem>();

  Object.values(TEAMS).forEach((team) => {
    teamItemsMap.set(team.id, {
      team,
      playerCount: 0,
      totalGames: 0,
      averageRating: 0,
      players: [],
    });
  });

  // 2. 選手を PLAYER_TEAM_MAP に従って各チームへ分配
  for (const player of players) {
    const teamId = PLAYER_TEAM_MAP[player.name];
    if (!teamId || !teamItemsMap.has(teamId)) continue;

    const item = teamItemsMap.get(teamId)!;
    item.players.push(player);
  }

  // 3. 各チームの平均レートと総試合数を計算
  const result: TeamRankingItem[] = [];

  teamItemsMap.forEach((item) => {
    const playerCount = item.players.length;
    if (playerCount === 0) return; // 選手がいないチームは除外（必要に応じて残すことも可能）

    // PL / MSR の切り替え計算
    const totalRating = item.players.reduce((sum, p) => {
      return sum + (type === 'msr' ? p.msrRating : p.plRating);
    }, 0);

    const totalGames = item.players.reduce((sum, p) => sum + p.gamesCount, 0);

    // チーム内選手をレート順にソート
    item.players.sort((a, b) =>
      type === 'msr' ? b.msrRating - a.msrRating : b.plRating - a.plRating
    );

    result.push({
      ...item,
      playerCount,
      totalGames,
      averageRating: totalRating / playerCount,
    });
  });

  // 4. チーム平均レートが高い順にソートして返却
  return result.sort((a, b) => b.averageRating - a.averageRating);
}