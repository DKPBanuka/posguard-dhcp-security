import React from 'react';

interface SeverityDonutProps {
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
}

export const SeverityDonut: React.FC<SeverityDonutProps> = ({
  criticalCount,
  highCount,
  mediumCount,
  lowCount,
}) => {
  const total = criticalCount + highCount + mediumCount + lowCount || 1;

  // Donut geometry
  const radius = 58;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;

  // Slices: Critical (rose-500), High (orange-500), Medium (amber-400), Low (sky-400)
  const segments = [
    { label: 'Critical', count: criticalCount, color: '#f43f5e', textClass: 'text-rose-500' },
    { label: 'High', count: highCount, color: '#ea580c', textClass: 'text-orange-600' },
    { label: 'Medium', count: mediumCount, color: '#f59e0b', textClass: 'text-amber-500' },
    { label: 'Low', count: lowCount, color: '#38bdf8', textClass: 'text-sky-400' },
  ];

  let cumulativePercent = 0;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-soft flex flex-col justify-between">
      <div>
        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
          Alerts by Severity
        </h4>
        <p className="text-xs text-slate-400 dark:text-slate-500">
          Distribution across active session
        </p>
      </div>

      <div className="flex items-center justify-around my-2">
        {/* SVG Donut */}
        <div className="relative w-36 h-36 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 150 150">
            {/* Background circle */}
            <circle
              cx="75"
              cy="75"
              r={radius}
              fill="transparent"
              stroke="currentColor"
              className="text-slate-100 dark:text-slate-800"
              strokeWidth={strokeWidth}
            />

            {segments.map((seg, i) => {
              if (seg.count === 0) return null;
              const fraction = seg.count / (total === 1 && criticalCount + highCount + mediumCount + lowCount === 0 ? 1 : total);
              const strokeDasharray = `${fraction * circumference} ${circumference}`;
              const strokeDashoffset = -cumulativePercent * circumference;
              cumulativePercent += fraction;

              return (
                <circle
                  key={i}
                  cx="75"
                  cy="75"
                  r={radius}
                  fill="transparent"
                  stroke={seg.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />
              );
            })}
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white leading-none">
              {criticalCount + highCount + mediumCount + lowCount}
            </span>
            <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase mt-0.5">
              Total Alerts
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-2 text-xs">
          {segments.map((seg) => (
            <div key={seg.label} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: seg.color }}></span>
                <span className="text-slate-600 dark:text-slate-400 font-medium">{seg.label}</span>
              </div>
              <span className="font-bold text-slate-800 dark:text-slate-200">{seg.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="text-[11px] text-slate-400 dark:text-slate-500 text-center pt-2 border-t border-slate-100 dark:border-slate-800/80">
        Calculated from active in-memory detector state
      </div>
    </div>
  );
};
