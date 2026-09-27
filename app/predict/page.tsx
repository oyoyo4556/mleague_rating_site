import Link from 'next/link';
import { getSortedPlayers } from '../../lib/data';
import Simulator from '../../components/Simulator';

export default function PredictPage() {
  const allPlayers = getSortedPlayers();

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800"
        >
          ← ランキング一覧に戻る
        </Link>

        <header className="border-b border-slate-200 pb-4">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-200 tracking-tight">
            Mリーグ 勝率・着順予測シミュレーター
          </h1>
          
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Plackett-Luce確率モデルに基づき、任意の4名の対戦における期待着順と着順分布を算出します。雀風や席順は考慮しておりません。
            また、MSRの数値から獲得ポイント期待値も計算してます。卓内の平均MSR値と本人のMSR値の差が1あたり0.35~0.4ptです。
          </p>
        </header>

        <Simulator allPlayers={allPlayers} />
      </div>
    </main>
  );
}