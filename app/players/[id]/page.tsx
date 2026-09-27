import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPlayerById , getAllPlayerIds } from '../../../lib/data';
import RateHistoryChart from '../../../components/RateHistoryChart';
import { getTeamByPlayerName } from '../../../lib/team';

interface Props {
  params: Promise<{ id: string }>;
}
export async function generateStaticParams() {
  const ids = getAllPlayerIds(); 

  // Next.jsが求める形式（paramsオブジェクトの配列）に変換して返します
  return ids.map((id) => ({
    id: id,
  }));

}

export default async function PlayerPage({ params }: Props) {
  const { id } = await params;
  const player = getPlayerById(id);

  if (!player) {
    notFound();
  }

  // TS側のマッピングから現時点のチーム情報を取得
  const team = getTeamByPlayerName(player.name);

  // チームカラー設定
  const bgGradient = team
    ? team.bgGradient
    : 'bg-slate-50 dark:bg-slate-900';

  // 着順割合計算
  const topRate = ((player.ranks.top / player.gamesCount) * 100).toFixed(1);
  const secondRate = ((player.ranks.second / player.gamesCount) * 100).toFixed(1);
  const thirdRate = ((player.ranks.third / player.gamesCount) * 100).toFixed(1);
  const fourthRate = ((player.ranks.fourth / player.gamesCount) * 100).toFixed(1);

  return (
    <div className={`min-h-screen bg-gradient-to-b ${bgGradient} text-white transition-colors duration-500`}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* 戻るボタン */}
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800"
        >
          ← ランキング一覧に戻る
        </Link>

        {/* 選手ヘッダーカード */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">{player.name}</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">通算 {player.gamesCount} 試合</p>
            </div>
            <div className="flex gap-6 text-right">
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400 block">PL Rating</span>
                <span className="text-2xl font-black text-blue-600 dark:text-blue-400">{player.plRating.toFixed(1)}</span>
              </div>
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400 block">MSR Rating</span>
                <span className="text-2xl font-black text-purple-600 dark:text-purple-400">{player.msrRating.toFixed(1)}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 dark:border-slate-700 text-center">
            <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded">
              <span className="text-xs text-slate-500 dark:text-slate-400 block">最高 PL / MSR</span>
              <span className="text-base font-bold text-slate-800 dark:text-slate-200">
                {player.plMaxRating.toFixed(1)} / {player.msrMaxRating.toFixed(1)}
              </span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded">
              <span className="text-xs text-slate-500 dark:text-slate-400 block">1位率</span>
              <span className="text-lg font-bold text-slate-800 dark:text-slate-200">{topRate}%</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded">
              <span className="text-xs text-slate-500 dark:text-slate-400 block">2位率</span>
              <span className="text-lg font-bold text-slate-800 dark:text-slate-200">{secondRate}%</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded">
              <span className="text-xs text-slate-500 dark:text-slate-400 block">3位率</span>
              <span className="text-lg font-bold text-slate-800 dark:text-slate-200">{thirdRate}%</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded">
              <span className="text-xs text-slate-500 dark:text-slate-400 block">4位率</span>
              <span className="text-lg font-bold text-slate-800 dark:text-slate-200">{fourthRate}%</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded">
              <span className="text-xs text-slate-500 dark:text-slate-400 block">強さ(γ) / 不確実性(σ)</span>
              <span className="text-base font-bold text-slate-800 dark:text-slate-200">
                {player.gamma} / {player.msrSigma.toFixed(1)}
              </span>
            </div>
          </div>
        </div>

        {/* 2つの折れ線グラフ */}
        <div className="space-y-6">
          <RateHistoryChart
            title="🏆 Plackett-Luce レート推移（順位評価）"
            history={player.plHistory}
            dataKey="rating"
            lineName="PL Rating"
            lineColor="#3b82f6"
          />
          <RateHistoryChart
            title="⚡ MSR レート推移（素点＋対戦相手補正）"
            history={player.msrHistory}
            dataKey="msrRating"
            lineName="MSR Rating"
            lineColor="#a855f7"
          />
        </div>
      </div>
    </div>
  );
}