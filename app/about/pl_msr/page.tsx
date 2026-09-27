import Link from 'next/link';
import fs from 'fs'
import path from 'path'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import remarkBreaks from 'remark-breaks'

function getMarkdownData() {
  const filepath = path.join(process.cwd(), 'app/about/pl_msr', 'explain.md')
  const explain_pl = fs.readFileSync(filepath, 'utf8')
  
  const filepath_msr = path.join(process.cwd(), 'app/about/pl_msr', 'explain_msr.md')
  const explain_msr = fs.readFileSync(filepath_msr, 'utf8')

  const filepath_simu = path.join(process.cwd(), 'app/about/pl_msr', 'explain_simu.md')
  const explain_simu = fs.readFileSync(filepath_simu, 'utf8')

  return { explain_pl, explain_msr , explain_simu }
}

export default function AboutPage() {
  const { explain_pl, explain_msr, explain_simu } = getMarkdownData()
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* ナビゲーション */}
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800"
        >
          ← ランキング一覧に戻る
        </Link>

        {/* ヘッダー */}
        <header className="border-b border-slate-200 dark:border-slate-700 pb-4">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            レーティングモデルの仕組みと仕様
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            当サイトで採用している2つの評価指標（PL方式・MSR方式）および対戦シミュレーションの計算アルゴリズムについて解説します。
          </p>
        </header>

        <div className="space-y-6 text-slate-700 dark:text-slate-300">
          {/* 1. PL方式の解説 */}
          <section className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow space-y-4 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <span className="text-xl">🏆</span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                1. Plackett-Luce (PL) モデル（順位評価）
              </h2>
            </div>
            <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed [&>p]:mb-4">
              <ReactMarkdown 
                remarkPlugins={[remarkMath,remarkBreaks]} 
                rehypePlugins={[rehypeKatex]}
                  components={{
                  ul: ({ children }) => <ul className="space-y-3 mt-4">{children}</ul>,
                  li: ({ children }) => (
                  <li className="list-none relative pl-5 text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-3 rounded border-l-4 border-slate-300 dark:border-slate-600 leading-relaxed">
                    {/* 左側に目立たない小さなドットを配置 */}
                   <span className="absolute left-2 top-[20px] w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full" />
                    {children}
                  </li>
                  ),
                  }}
              >
                {explain_pl}
              </ReactMarkdown>
            </div>
            <ul className="list-disc list-inside text-xs space-y-1 text-slate-600 dark:text-slate-400">
              <li>素点やウマオカを無視し、<strong>「着順（1着〜4着）」の結果のみ</strong>を評価対象とします。</li>
              <li>着順予測シミュレーターの基礎確率として利用されています。</li>
            </ul>
          </section>

          {/* 2. MSR方式の解説 */}
          <section className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow space-y-4 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚡</span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                2. MSR (M-league Score Rating) モデル（素点＋対戦相手補正）
              </h2>
            </div>
            <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed [&>p]:mb-4">
              <ReactMarkdown 
                remarkPlugins={[remarkMath,remarkBreaks]} 
                rehypePlugins={[rehypeKatex]}
                  components={{
                  ul: ({ children }) => <ul className="space-y-3 mt-4">{children}</ul>,
                  li: ({ children }) => (
                  <li className="list-none relative pl-5 text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-3 rounded border-l-4 border-slate-300 dark:border-slate-600 leading-relaxed">
                    {/* 左側に目立たない小さなドットを配置 */}
                   <span className="absolute left-2 top-[20px] w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full" />
                    {children}
                  </li>
                  ),
                  }}
              >
                {explain_msr}
              </ReactMarkdown>
            </div>
          </section>

          {/* 3. シミュレーターと期待pt */}
          <section className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow space-y-4 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <span className="text-xl">🎲</span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                3. シミュレーターと「期待pt」の算出
              </h2>
            </div>
            <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed [&>p]:mb-4">
              <ReactMarkdown 
                remarkPlugins={[remarkMath,remarkBreaks]} 
                rehypePlugins={[rehypeKatex]}
                  components={{
                  ul: ({ children }) => <ul className="space-y-3 mt-4">{children}</ul>,
                  li: ({ children }) => (
                  <li className="list-none relative pl-5 text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-3 rounded border-l-4 border-slate-300 dark:border-slate-600 leading-relaxed">
                    {/* 左側に目立たない小さなドットを配置 */}
                   <span className="absolute left-2 top-[20px] w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full" />
                    {children}
                  </li>
                  ),
                  }}
              >
                {explain_simu}
              </ReactMarkdown>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}