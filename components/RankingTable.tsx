
'use client';

import { useState, useMemo,Fragment } from 'react';
import Link from 'next/link';
import { PlayerData } from '../types/rating';
import {
  calculateMaxRatingDeviations,
  calculatePlayerForm,
  PlayerWithDeviation,
  PlayerWithForm,
  getTeamRankings,
} from '../lib/data';

interface Props {
  allPlayers: PlayerData[];
}

type SystemType = 'pl' | 'msr'; // 式の切り替え (Plackett-Luce vs MSR)
type SubTabType = 'current' | 'max' | 'hot';

export function RankingTable({ allPlayers }: Props) {
  const [system, setSystem] = useState<SystemType>('pl');
  const [subTab, setSubTab] = useState<SubTabType>('current');
  const [minGames, setMinGames] = useState<number>(0);

  // 試合数フィルタ ＆ モード・タブに応じた集計・ソート
const displayPlayers = useMemo(() => {
    const filtered = allPlayers.filter((p) => p.gamesCount >= minGames);

    if (subTab === 'current') {
      return filtered.sort((a, b) => {
        const valA = system === 'msr' ? a.msrRating : a.plRating;
        const valB = system === 'msr' ? b.msrRating : b.plRating;
        return valB - valA;
      });
    }

    if (subTab === 'max') {
      // 第一引数に選手リスト、第二引数にモード ('pl' | 'msr') を渡すだけ
      return calculateMaxRatingDeviations(filtered, system);
    }

    if (subTab === 'hot') {
      // 好調順計算もモードを渡すだけ
      const withForm = calculatePlayerForm(filtered, 4, system);//数値を変えれば試合数を変えられる
      return withForm.sort((a, b) => b.formChange - a.formChange);
    }

    return filtered;
  }, [allPlayers, system, subTab, minGames]);

  return (
    <div className="space-y-4">
      {/* 1. レーティング方式のメインタブ切り替え */}
      <div className="flex border-b border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setSystem('pl')}
          className={`py-2.5 px-5 font-bold text-sm sm:text-base transition-colors border-b-2 -mb-px ${
            system === 'pl'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          🏆 Plackett-Luce 方式（着順重視）
        </button>
        <button
          onClick={() => setSystem('msr')}
          className={`py-2.5 px-5 font-bold text-sm sm:text-base transition-colors border-b-2 -mb-px flex items-center gap-1.5 ${
            system === 'msr'
              ? 'border-purple-600 text-purple-600 dark:text-purple-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          ⚡ MSR 方式（素点＋ウマオカ＋相手補正）
          <span className="text-[10px] bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 px-1.5 py-0.5 rounded font-mono">
            New
          </span>
        </button>
      </div>

      {/* 2. サブタブ ＆ 試合数フィルタ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
        {/* サブタブボタン群 */}
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setSubTab('current')}
            className={`px-3 py-1.5 font-bold text-sm rounded-lg transition-colors ${
              subTab === 'current'
                ? system === 'msr' ? 'bg-purple-600 text-white shadow' : 'bg-blue-600 text-white shadow'
                : 'border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            現在レート
          </button>
          <button
            onClick={() => setSubTab('max')}
            className={`px-3 py-1.5 font-bold text-sm rounded-lg transition-colors ${
              subTab === 'max'
                ? system === 'msr' ? 'bg-purple-600 text-white shadow' : 'bg-blue-600 text-white shadow'
                : 'border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            最高レート（偏差値）
          </button>
          <button
            onClick={() => setSubTab('hot')}
            className={`px-3 py-1.5 font-bold text-sm rounded-lg transition-colors ${
              subTab === 'hot'
                ? 'bg-orange-600 text-white shadow'
                : 'border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            🔥 好調ランキング
          </button>
        </div>

        {/* 規定試合数入力 */}
        <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm self-start sm:self-auto">
          <label htmlFor="minGames" className="text-xs font-bold text-slate-600 dark:text-slate-300 whitespace-nowrap">
            規定試合数:
          </label>
          <input
            id="minGames"
            type="number"
            min={0}
            max={500}
            value={minGames}
            onChange={(e) => setMinGames(Math.max(0, Number(e.target.value)))}
            className="w-16 px-2 py-0.5 border border-slate-300 dark:border-slate-300 rounded text-sm font-bold text-right text-slate-800 dark:text-slate-600 bg-slate-50 dark:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">試合以上</span>
        </div>
      </div>

      {/* 注釈メッセージ */}
      {system === 'pl' && subTab === 'current' && (
        <div className="p-3 bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 text-xs rounded-lg border border-blue-200 dark:border-blue-900/50">
          💡 <strong>Plackett-Luceについて：</strong>
          着順データのみに基づく相対評価のレーティングです。15試合以上のデータが溜まるまでは1500で固定しております。
        </div>
      )}
      {system === 'pl' && subTab === 'max' && (
        <div className="p-3 bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 text-xs rounded-lg border border-blue-200 dark:border-blue-900/50">
          💡 <strong>最高レートについて：</strong>
          到達したレートの最大値です。データ数が少ないとブレが大きい為、30試合以上から記録しております。
          また、相対評価モデルであるため再計算のたびに微変動します。なので偏差値も合わせて表記しております。
        </div>
      )}
      {system === 'pl' && subTab === 'hot' && (
        <div className="p-3 bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 text-xs rounded-lg border border-blue-200 dark:border-blue-900/50">
          💡 <strong>好調について：</strong>
          Mリーグ全体の直近20戦においてのポイント変動をランキング化したものです。相対評価モデルであるため、
          試合に出場していない選手が上位に来ることもあります。
        </div>
      )}

      {system === 'msr' && (
        <div className="p-3 bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-300 text-xs rounded-lg border border-purple-200 dark:border-purple-900/50">
          ⚡ <strong>MSR（M-league Score Rating）について：</strong>
          卓の平均レートから「対局前の獲得期待pt」を算出し、実際の「素点＋ウマオカ獲得pt」とのギャップ（成果）を評価するモデルです。格上からの大トップや、格下からの失点をレート変動へ反映します。
        </div>
      )}

      {/* テーブル本体 */}
      <div className="w-full overflow-x-auto bg-white dark:bg-slate-800 rounded-lg shadow">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-300">
              <th className="p-3 text-center w-16">順位</th>
              <th className="p-3">選手名</th>

              {subTab === 'current' && (
                <>
                  <th className="p-3 text-right">現在 {system === 'msr' ? 'MSR' : 'Rating'}</th>
                  <th className="p-3 text-right text-slate-600 dark:text-slate-200">最高 {system === 'msr' ? 'MSR' : 'Rating'}</th>
                  {system === 'msr' && <th className="p-3 text-right text-slate-500 dark:text-slate-400">σ (不確実性)</th>}
                </>
              )}

              {subTab === 'max' && (
                <>
                  <th className="p-3 text-right">最高 {system === 'msr' ? 'MSR' : 'Rating'}</th>
                  <th className="p-3 text-right text-blue-600 dark:text-blue-400">最高レート偏差値</th>
                </>
              )}

              {subTab === 'hot' && (
                <>
                  <th className="p-3 text-right">現在 {system === 'msr' ? 'MSR' : 'Rating'}</th>
                  <th className="p-3 text-right font-bold">直近変動量</th>
                </>
              )}

              <th className="p-3 text-right">試合数</th>
              <th className="p-3 text-center">1位</th>
              <th className="p-3 text-center">2位</th>
              <th className="p-3 text-center">3位</th>
              <th className="p-3 text-center">4位</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {displayPlayers.map((player, index) => {

              const rank = index + 1;
              const isMsr = system === 'msr';

              const curVal = isMsr ? player.msrRating : player.plRating;
              const maxVal = isMsr ? player.msrMaxRating : player.plMaxRating;

              const maxDev = 'maxRatingDeviation' in player ? (player as PlayerWithDeviation).maxRatingDeviation : null;
              const formChange = 'formChange' in player ? (player as PlayerWithForm).formChange : null;

              return (
                <tr key={player.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="p-3 text-center font-bold text-slate-600 dark:text-slate-200">{rank}</td>
                  <td className="p-3 font-medium">
                    <Link
                      href={`/players/${player.id}`}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline"
                    >
                      {player.name}
                    </Link>
                  </td>

                  {subTab === 'current' && (
                    <>
                      <td className="p-3 text-right font-bold text-slate-900 dark:text-slate-100 text-lg">
                        {curVal.toFixed(1)}
                      </td>
                      <td className="p-3 text-right text-slate-400 dark:text-slate-300 text-sm">
                        {maxVal.toFixed(1)}
                      </td>
                      {isMsr && (
                        <td className="p-3 text-right text-slate-400 dark:text-slate-400 text-xs font-mono">
                          {player.msrSigma?.toFixed(1) ?? '-'}
                        </td>
                      )}
                    </>
                  )}

                  {subTab === 'max' && (
                    <>
                      <td className="p-3 text-right font-bold text-slate-900 dark:text-slate-100 text-lg">
                        {maxVal.toFixed(1)}
                      </td>
                      <td className="p-3 text-right font-bold text-blue-600 dark:text-blue-400 text-lg">
                        {maxDev !== null ? maxDev.toFixed(1) : '-'}
                      </td>
                    </>
                  )}

                  {subTab === 'hot' && (
                    <>
                      <td className="p-3 text-right font-medium text-slate-700 dark:text-slate-300">
                        {curVal.toFixed(1)}
                      </td>
                      <td
                        className={`p-3 text-right font-black text-lg ${
                          formChange !== null && formChange > 0
                            ? 'text-red-600 dark:text-red-400'
                            : formChange !== null && formChange < 0
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {formChange !== null ? (formChange > 0 ? `+${formChange.toFixed(1)}` : formChange.toFixed(1)) : '-'}
                      </td>
                    </>
                  )}

                  <td className="p-3 text-right text-slate-600 dark:text-slate-200">{player.gamesCount}</td>
                  <td className="p-3 text-center text-slate-700 dark:text-slate-300">{player.ranks.top}</td>
                  <td className="p-3 text-center text-slate-700 dark:text-slate-300">{player.ranks.second}</td>
                  <td className="p-3 text-center text-slate-700 dark:text-slate-300">{player.ranks.third}</td>
                  <td className="p-3 text-center text-slate-700 dark:text-slate-300">{player.ranks.fourth}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function TeamRankingTable({ allPlayers }: Props) {
  const [system, setSystem] = useState<SystemType>('pl');
  const [expandedTeamId, setExpandedTeamId] = useState<string | null>(null);

  // 指定された方式（PL / MSR）でチームランキングを計算
  const teamRankings = useMemo(() => {
    return getTeamRankings(allPlayers, system);
  }, [allPlayers, system]);

  // アコーディオンの開閉処理
  const toggleExpand = (teamId: string) => {
    setExpandedTeamId((prev) => (prev === teamId ? null : teamId));
  };

  return (
    <div className="space-y-4">
      {/* 1. レート方式切り替えタブ */}
      <div className="flex border-b border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setSystem('pl')}
          className={`py-2.5 px-5 font-bold text-sm sm:text-base transition-colors border-b-2 -mb-px ${
            system === 'pl'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          🏆 PL 方式（チーム平均）
        </button>
        <button
          onClick={() => setSystem('msr')}
          className={`py-2.5 px-5 font-bold text-sm sm:text-base transition-colors border-b-2 -mb-px flex items-center gap-1.5 ${
            system === 'msr'
              ? 'border-purple-600 text-purple-600 dark:text-purple-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          ⚡ MSR 方式（チーム平均）
          <span className="text-[10px] bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 px-1.5 py-0.5 rounded font-mono">
            New
          </span>
        </button>
      </div>

      {/* 注釈 */}
      <div className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs rounded-lg border border-slate-200 dark:border-slate-700">
        💡 <strong>チーム順位について：</strong>
        所属している所属全選手の {system === 'msr' ? 'MSR' : 'PL Rating'} の平均値で算出したランキングです。チーム行をクリックすると所属選手の個別レートを確認できます。
      </div>

      {/* 2. チーム順位テーブル */}
      <div className="w-full overflow-x-auto bg-white dark:bg-slate-800 rounded-lg shadow">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-300">
              <th className="p-3 text-center w-16">順位</th>
              <th className="p-3">チーム名</th>
              <th className="p-3 text-right">
                平均 {system === 'msr' ? 'MSR' : 'PL'}
              </th>
              <th className="p-3 text-right">所属人数</th>
              <th className="p-3 text-right">総試合数</th>
              <th className="p-3 text-center w-16">詳細</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {teamRankings.map((item, index) => {
              const rank = index + 1;
              const isExpanded = expandedTeamId === item.team.id;

              return (
                <Fragment key={item.team.id}>
                  {/* チーム行 */}
                  <tr
                    key={item.team.id}
                    onClick={() => toggleExpand(item.team.id)}
                    className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
                  >
                    <td className="p-3 text-center font-bold text-slate-600 dark:text-slate-200">
                      {rank}
                    </td>
                    <td className="p-3 font-bold">
                      <div className="flex items-center gap-2">
                        {/* primaryColorをカラーインジケーターとして使用 */}
                        <span
                          className="w-3 h-3 rounded-full inline-block shrink-0"
                          style={{ backgroundColor: item.team.primaryColor }}
                        />
                        <span className="text-slate-900 dark:text-slate-100 text-base">
                          {item.team.name}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 text-right font-black text-slate-900 dark:text-slate-100 text-lg">
                      {item.averageRating.toFixed(1)}
                    </td>
                    <td className="p-3 text-right text-slate-600 dark:text-slate-400">
                      {item.playerCount} 人
                    </td>
                    <td className="p-3 text-right text-slate-600 dark:text-slate-400">
                      {item.totalGames} 試合
                    </td>
                    <td className="p-3 text-center text-slate-400 dark:text-slate-500 font-bold">
                      {isExpanded ? '▲' : '▼'}
                    </td>
                  </tr>

                  {/* 展開時の所属選手リスト（アコーディオン） */}
                  {isExpanded && (
                    <tr key={`${item.team.id}-expanded`}>
                      <td colSpan={6} className="bg-slate-50/80 dark:bg-slate-900/40 p-4 border-y border-slate-200 dark:border-slate-700">
                        <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
                          【{item.team.name}】 所属選手一覧（{system === 'msr' ? 'MSR' : 'PL'} 順）
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {item.players.map((p) => {
                            const val = system === 'msr' ? p.msrRating : p.plRating;
                            return (
                              <div
                                key={p.id}
                                className="flex justify-between items-center bg-white dark:bg-slate-800 p-2.5 rounded border border-slate-200 dark:border-slate-700"
                              >
                                <Link
                                  href={`/players/${p.id}`}
                                  className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                  {p.name}
                                </Link>
                                <div className="text-right">
                                  <span className="font-bold text-slate-800 dark:text-slate-200">
                                    {val.toFixed(1)}
                                  </span>
                                  <span className="text-xs text-slate-400 ml-2">
                                    ({p.gamesCount}戦)
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}