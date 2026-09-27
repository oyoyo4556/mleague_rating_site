'use client';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

// 必須の共通プロパティだけを定義
interface BaseHistoryItem {
  gameId: number;
  gamesPlayed: number;
}

// ジェネリクス T で任意の履歴型を受け取る
interface Props<T extends BaseHistoryItem> {
  title: string;
  history: T[];
  dataKey: keyof T & string; // Tのキー（"rating" や "msrRating"）のみ指定可能にする
  lineName?: string;
  lineColor?: string;
}

export default function RateHistoryChart<T extends BaseHistoryItem>({
  title,
  history,
  dataKey,
  lineName = 'Rating',
  lineColor = '#3b82f6',
}: Props<T>) {
  const chartData = history.map((h) => ({
    game: `${h.gamesPlayed}戦目`,
    value: Number(h[dataKey]), // 数値として取得
  }));

  return (
    <div className="w-full h-80 bg-white dark:bg-slate-800 p-4 rounded-lg shadow border border-transparent dark:border-slate-700">
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
          <XAxis dataKey="game" stroke="#94a3b8" fontSize={12} />
          <YAxis
            domain={['dataMin - 20', 'dataMax + 20']}
            stroke="#94a3b8"
            fontSize={12}
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
            itemStyle={{ color: lineColor }}
          />
          <Line
            type="monotone"
            dataKey="value"
            name={lineName}
            stroke={lineColor}
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}