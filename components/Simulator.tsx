'use client';

import { useState, useMemo } from 'react';
import { PlayerData } from '../types/rating';
import { simulateMatch, SimulationResult } from '../lib/data';
import { getPlayerYomi } from '../lib/yomi';

interface Props {
  allPlayers: PlayerData[];
}

type SortType = 'rate' | 'name' | 'team';

export default function Simulator({ allPlayers }: Props) {
  const [selectedIds, setSelectedIds] = useState<number[]>([
    allPlayers[0]?.id ?? 1,
    allPlayers[1]?.id ?? 2,
    allPlayers[2]?.id ?? 3,
    allPlayers[3]?.id ?? 4,
  ]);

  // 並び替え状態（初期値はレート順）
  const [sortType, setSortType] = useState<SortType>('rate');

  // ドロップダウン用のソート済みプレイヤーリスト
  const sortedDropdownPlayers = useMemo(() => {
    const players = [...allPlayers];
    if (sortType === 'name') {
      return players.sort((a, b) => {
        const yomiA = getPlayerYomi(a.name);
        const yomiB = getPlayerYomi(b.name);
        return yomiA.localeCompare(yomiB, 'ja');
      });
    }
    if (sortType === 'team') {
      return players;
    }
    return players.sort((a, b) => b.plRating - a.plRating);
  }, [allPlayers, sortType]);

  const handleSelect = (index: number, id: number) => {
    const next = [...selectedIds];
    next[index] = id;
    setSelectedIds(next);
  };

  const selectedPlayers = selectedIds
    .map((id) => allPlayers.find((p) => p.id === id))
    .filter((p): p is PlayerData => p !== undefined);

  const results: SimulationResult[] =
    selectedPlayers.length === 4 ? simulateMatch(selectedPlayers) : [];

  return (
    <div className="space-y-6">
      {/* 選手選択エリア */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow space-y-4 border border-transparent dark:border-slate-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">卓組（4選手）を選択</h2>

          {/* ソート切り替えボタン */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-bold">リスト並び順:</span>
            <button
              onClick={() => setSortType('rate')}
              className={`px-2.5 py-1 rounded font-bold transition-colors ${
                sortType === 'rate'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              レート順
            </button>
            <button
              onClick={() => setSortType('name')}
              className={`px-2.5 py-1 rounded font-bold transition-colors ${
                sortType === 'name'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              あいうえお順
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((seatIndex) => (
            <div key={seatIndex} className="space-y-1">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400">
                選手 {seatIndex + 1}
              </label>
              <select
                value={selectedIds[seatIndex]}
                onChange={(e) => handleSelect(seatIndex, Number(e.target.value))}
                className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {sortedDropdownPlayers.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (R{p.plRating.toFixed(0)})
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* 予測シミュレーション結果 */}
      {results.length === 4 && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow space-y-4 border border-transparent dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">対戦予想（着順確率分布）</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {results.map((res) => {
              const formattedPt = res.expectedPoints > 0 
                ? `+${res.expectedPoints.toFixed(1)}` 
                : res.expectedPoints.toFixed(1);

              return (
              <div
                  key={res.seatIndex}
                  className="border border-slate-200 dark:border-slate-700 p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50 space-y-3 shadow-sm"
              >
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-lg">{res.player.name}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-0.5">
                    Rating: <span className="font-bold text-slate-800 dark:text-slate-200">{res.player.plRating.toFixed(1)}  </span>
                    /  <span className="font-bold text-slate-800 dark:text-slate-200">{res.player.msrRating.toFixed(1)}</span>
                  </p>
                </div>

                {/* 平均期待着順 & 期待獲得pt */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-blue-50 dark:bg-blue-950/50 p-2.5 rounded-lg text-center border border-blue-100 dark:border-blue-900/40">
                    <span className="text-[10px] text-blue-800 dark:text-blue-300 block font-bold">期待着順</span>
                    <span className="text-xl font-black text-blue-800 dark:text-blue-300">
                      {res.expectedRank} <span className="text-xs font-bold">位</span>
                    </span>
                  </div>

                  <div className="bg-emerald-50 dark:bg-emerald-950/50 p-2.5 rounded-lg text-center border border-emerald-100 dark:border-emerald-900/40">
                    <span className="text-[10px] text-emerald-800 dark:text-emerald-300 block font-bold">期待pt</span>
                    <span className={`text-xl font-black ${res.expectedPoints >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                      {formattedPt} <span className="text-xs font-bold">pt</span>
                    </span>
                  </div>
                </div>

                {/* 1位〜4位率 */}
                <div className="space-y-1 text-xs font-semibold">
                  {[
                    { label: '1位率', val: res.winRate, color: 'text-blue-600 dark:text-blue-400', barHex: 'rgba(59, 130, 246, 0.25)' },
                    { label: '2位率', val: res.secondRate, color: 'text-slate-700 dark:text-slate-300', barHex: 'rgba(148, 163, 184, 0.2)' },
                    { label: '3位率', val: res.thirdRate, color: 'text-slate-700 dark:text-slate-300', barHex: 'rgba(148, 163, 184, 0.2)' },
                    { label: '4位率', val: res.fourthRate, color: 'text-red-600 dark:text-red-400', barHex: 'rgba(239, 68, 68, 0.25)' },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex justify-between items-center px-2 py-1 rounded transition-all"
                      style={{
                        background: `linear-gradient(to right, ${item.barHex} ${item.val}%, transparent ${item.val}%)`,
                      }}
                    >
                      <span className="text-slate-700 dark:text-slate-300">{item.label}</span>
                      <span className={`font-bold ${item.color}`}>{item.val}%</span>
                    </div>
                  ))}
                </div>
              </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}