import React, { useState } from 'react';

export const TrafficChart: React.FC = () => {
  const times = ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'];
  
  // Data points matching screenshot 1
  const totalData = [18, 22, 28, 20, 26, 32, 27, 42, 31, 35];
  const normalData = [14, 16, 21, 15, 20, 25, 21, 33, 24, 27];
  const suspiciousData = [3, 4, 6, 4, 5, 6, 5, 8, 5, 7];
  const unclassifiedData = [1, 2, 1, 1, 1, 1, 1, 1, 2, 1];

  const [hoverIndex, setHoverIndex] = useState<number | null>(7);

  // SVG dimensions
  const width = 600;
  const height = 180;
  const paddingX = 40;
  const paddingY = 25;
  const maxY = 50;

  const getPoints = (data: number[]) => {
    return data.map((val, idx) => {
      const x = paddingX + (idx / (data.length - 1)) * (width - paddingX * 2);
      const y = height - paddingY - (val / maxY) * (height - paddingY * 2);
      return { x, y, val };
    });
  };

  const toPathD = (points: { x: number; y: number }[]) => {
    return points.reduce((acc, curr, idx, arr) => {
      if (idx === 0) return `M ${curr.x} ${curr.y}`;
      // Smooth cubic bezier
      const prev = arr[idx - 1];
      const cx1 = prev.x + (curr.x - prev.x) / 2;
      const cy1 = prev.y;
      const cx2 = prev.x + (curr.x - prev.x) / 2;
      const cy2 = curr.y;
      return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${curr.x} ${curr.y}`;
    }, '');
  };

  const totalPoints = getPoints(totalData);
  const normalPoints = getPoints(normalData);
  const suspiciousPoints = getPoints(suspiciousData);
  const unclassifiedPoints = getPoints(unclassifiedData);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-soft">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
            Network Traffic (Events over Time)
          </h4>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Simulated throughput across 24h POS transaction window
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            <span className="text-slate-600 dark:text-slate-400 font-medium">Total Events</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-slate-600 dark:text-slate-400 font-medium">Normal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="text-slate-600 dark:text-slate-400 font-medium">Suspicious</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400"></span>
            <span className="text-slate-600 dark:text-slate-400 font-medium">Unclassified</span>
          </div>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="relative w-full h-52 sm:h-56">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
        >
          {/* Horizontal Gridlines */}
          {[0, 10, 20, 30, 40, 50].map((tick) => {
            const y = height - paddingY - (tick / maxY) * (height - paddingY * 2);
            return (
              <g key={tick}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="currentColor"
                  className="text-slate-100 dark:text-slate-800"
                  strokeDasharray={tick === 0 ? undefined : "3 3"}
                  strokeWidth="1"
                />
                <text
                  x={paddingX - 8}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[10px] fill-slate-400 font-mono"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {/* Area under Total curve */}
          <path
            d={`${toPathD(totalPoints)} L ${width - paddingX} ${height - paddingY} L ${paddingX} ${height - paddingY} Z`}
            className="fill-blue-500/5 dark:fill-blue-500/10"
          />

          {/* Lines */}
          <path
            d={toPathD(unclassifiedPoints)}
            fill="none"
            stroke="#818cf8"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d={toPathD(suspiciousPoints)}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d={toPathD(normalPoints)}
            fill="none"
            stroke="#10b981"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d={toPathD(totalPoints)}
            fill="none"
            stroke="#2563eb"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Active Hover Column & Dots */}
          {hoverIndex !== null && totalPoints[hoverIndex] && (
            <g>
              <line
                x1={totalPoints[hoverIndex].x}
                y1={paddingY}
                x2={totalPoints[hoverIndex].x}
                y2={height - paddingY}
                stroke="#94a3b8"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              <circle
                cx={totalPoints[hoverIndex].x}
                cy={totalPoints[hoverIndex].y}
                r="4.5"
                className="fill-blue-600 stroke-white dark:stroke-slate-900"
                strokeWidth="2"
              />
              <circle
                cx={normalPoints[hoverIndex].x}
                cy={normalPoints[hoverIndex].y}
                r="3.5"
                className="fill-emerald-600 stroke-white dark:stroke-slate-900"
                strokeWidth="1.5"
              />
              <circle
                cx={suspiciousPoints[hoverIndex].x}
                cy={suspiciousPoints[hoverIndex].y}
                r="3.5"
                className="fill-amber-500 stroke-white dark:stroke-slate-900"
                strokeWidth="1.5"
              />
            </g>
          )}

          {/* Invisible interactive hover rects */}
          {totalPoints.map((pt, i) => (
            <rect
              key={i}
              x={pt.x - 20}
              y={0}
              width={40}
              height={height}
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={() => setHoverIndex(i)}
            />
          ))}

          {/* X Axis Time Labels */}
          {times.map((time, i) => {
            const x = paddingX + (i / (times.length - 1)) * (width - paddingX * 2);
            return (
              <text
                key={time}
                x={x}
                y={height - 6}
                textAnchor="middle"
                className="text-[10px] fill-slate-400 font-mono"
              >
                {time}
              </text>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoverIndex !== null && (
          <div
            className="absolute top-2 right-4 bg-slate-900/90 text-white dark:bg-white/95 dark:text-slate-900 px-3 py-1.5 rounded-lg text-xs shadow-lg backdrop-blur-sm pointer-events-none flex items-center gap-3 transition-opacity"
          >
            <span className="font-semibold">{times[Math.min(hoverIndex, times.length - 1)]}</span>
            <div className="flex items-center gap-2">
              <span className="text-blue-400 dark:text-blue-600 font-bold">Total: {totalData[hoverIndex]}</span>
              <span className="text-amber-400 dark:text-amber-600 font-bold">Suspicious: {suspiciousData[hoverIndex]}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
