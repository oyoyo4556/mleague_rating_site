"use client";

import { getSortedPlayers, getUpdatedAt} from '../lib/data';
import {RankingTable,TeamRankingTable} from '../components/RankingTable';
import Link from 'next/link';
import { useTheme } from 'next-themes'
import { useSyncExternalStore } from 'react'

const emptySubscribe = () => () => {}
const getClientSnapshot = () => true
const getServerSnapshot = () => false


export default function Home() {
  const allPlayers = getSortedPlayers(0);
  const updatedAt = getUpdatedAt();

  const { theme, setTheme } = useTheme()

  const isMounted = useSyncExternalStore(
    emptySubscribe,
    getClientSnapshot,
    getServerSnapshot
  )

  if (!isMounted) return null

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="border-b border-slate-200 dark:border-slate-800 pb-4">
         <div className="flex justify-between items-start">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
            Mリーグ Plackett-Luce & MSR レーティング
          </h1>
          <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm text-xl"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? '🌙' : '☀️'}
          </button>
         </div>

          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            順位データや獲得ptに基づきPlackett-Luce & MSRモデルで算出した非公式レーティングサイトです。
            <span className="ml-2 inline-block font-mono text-xs bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded">
              最終更新: {updatedAt}
            </span>
          </p><br/>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          【当サイトのレーティングについて】本サイトのスコアは、Mリーグの公式戦における対戦相手の実力差や順位・ウマオカの傾斜を数理モデルによって独自に計算・補正したものです。<br/>
          ※本レーティングは「Mリーグの環境ルールにおけるスコアの獲得効率（強さ）」を示したものであり、プロ雀士としての麻雀の技術や総合的なうまさを保証・定義するものではありません。麻雀における展開の偏りや、各チームの起用戦略・対戦カードの巡り合わせといった背景をご理解の上、Mリーグをより深く楽しむためのデータエンタメとしてお楽しみください。
          </p>
          {/* 予測ページへの導線ボタン */}
          <div className="flex-shrink-0">
            <Link
              href="/predict"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg shadow transition-colors"
            >
              <span>🎲 4人対戦予測</span>
              <span className="text-xs bg-blue-500 px-1.5 py-0.5 rounded">β</span>
            </Link>
          </div>
        </header>

        <section>
          <RankingTable allPlayers={allPlayers} />
        </section>
        <section>
          <TeamRankingTable allPlayers={allPlayers}/>
        </section>

        {/*ここにgoogleアドセンスのせる*/}

        <header className="border-b border-slate-200 dark:border-slate-600 pb-8"></header>
        <div className="flex-shrink-0">
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-200">
            当サイトの説明
          </p>
          <Link
            href={`/about/pl_msr`}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline"
          >
            {"Plackett-LuceモデルとMSRの概要および対戦シミュレーションの詳細"}
          </Link>
        </div>
      </div>
    </main>
  );
}