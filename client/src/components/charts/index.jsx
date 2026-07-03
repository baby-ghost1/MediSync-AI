import { useState } from "react";
import { cn } from "@/utils/cn";

const defaultColors = [
  "#3B82F6", "#10B981", "#F59E0B", "#EF4444",
  "#8B5CF6", "#EC4899", "#14B8A6", "#F97316",
];

const BarChart = ({
  data = [],
  height = 300,
  barWidth = 40,
  spacing = 8,
  showValues = true,
  showAxis = true,
  colors = defaultColors,
  className,
}) => {
  const [hovered, setHovered] = useState(null);
  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const totalWidth = data.length * (barWidth + spacing);

  return (
    <div className={cn("relative", className)} style={{ height }}>
      {showAxis && (
        <div className="absolute inset-x-0 top-0 bottom-8 flex flex-col justify-between pointer-events-none">
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
            <div key={ratio} className="flex items-center border-t border-dashed border-[var(--border)]">
              <span className="-ml-10 text-xs text-[var(--muted-foreground)]">{Math.round(maxVal * (1 - ratio))}</span>
            </div>
          ))}
        </div>
      )}

      <svg width={Math.max(totalWidth, 100)} height={height - 32} className="ml-10">
        {data.map((d, i) => {
          const h = (d.value / maxVal) * (height - 48);
          const x = i * (barWidth + spacing);
          const y = height - 48 - h - 8;
          const isHovered = hovered === i;
          const color = d.color || colors[i % colors.length];
          return (
            <g key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="transition-all"
            >
              <rect
                x={x} y={y}
                width={barWidth} height={h}
                rx={6} ry={6}
                fill={isHovered ? color : `${color}CC`}
                className="transition-all duration-200 cursor-pointer"
                style={{ filter: isHovered ? `drop-shadow(0 4px 8px ${color}44)` : "none" }}
              />
              <text x={i * (barWidth + spacing) + barWidth / 2} y={height - 28} textAnchor="middle" className="fill-[var(--muted-foreground)] text-xs">{d.label}</text>
              {showValues && (
                <text x={i * (barWidth + spacing) + barWidth / 2} y={y - 6} textAnchor="middle" className="fill-[var(--foreground)] text-xs font-medium">{d.value}</text>
              )}
              {isHovered && d.tooltip && (
                <foreignObject x={x - 20} y={y - 50} width={barWidth + 40} height={36}>
                  <div className="flex items-center justify-center rounded-lg bg-[var(--foreground)] px-3 py-1.5 text-xs text-[var(--background)] shadow-lg">{d.tooltip}</div>
                </foreignObject>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

const LineChart = ({
  data = [],
  height = 300,
  showPoints = true,
  showAxis = true,
  smooth = true,
  strokeColor = "#3B82F6",
  fillColor = "rgba(59, 130, 246, 0.08)",
  className,
}) => {
  const [hovered, setHovered] = useState(null);
  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const width = Math.max(data.length * 60, 100);
  const padding = { top: 20, right: 20, bottom: 36, left: 50 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const points = data.map((d, i) => ({
    x: padding.left + (i / Math.max(data.length - 1, 1)) * chartW,
    y: padding.top + chartH - (d.value / maxVal) * chartH,
    ...d,
  }));

  const linePath = points.map((p, i) =>
    i === 0 ? `M ${p.x} ${p.y}` : smooth
      ? ` C ${(points[i - 1].x + p.x) / 2} ${points[i - 1].y}, ${(points[i - 1].x + p.x) / 2} ${p.y}, ${p.x} ${p.y}`
      : ` L ${p.x} ${p.y}`
  ).join(" ");

  const areaPath = linePath + ` L ${points[points.length - 1].x} ${padding.top + chartH} L ${points[0].x} ${padding.top + chartH} Z`;

  return (
    <div className={cn("relative", className)} style={{ height }}>
      {showAxis && (
        <div className="absolute inset-x-0 top-0 bottom-8 flex flex-col justify-between pointer-events-none" style={{ left: 50, right: 20 }}>
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
            <div key={ratio} className="flex items-center border-t border-dashed border-[var(--border)]">
              <span className="-ml-12 text-xs text-[var(--muted-foreground)]">{Math.round(maxVal * (1 - ratio))}</span>
            </div>
          ))}
        </div>
      )}

      <svg width={width} height={height} className="w-full">
        <path d={areaPath} fill={fillColor} />
        <path d={linePath} fill="none" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {showPoints && points.map((p, i) => (
          <circle
            key={i}
            cx={p.x} cy={p.y} r={hovered === i ? 6 : 4}
            fill="var(--card)" stroke={strokeColor} strokeWidth="2.5"
            className="transition-all duration-200 cursor-pointer"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          />
        ))}

        {points.map((p, i) => (
          <text key={i} x={p.x} y={height - 10} textAnchor="middle" className="fill-[var(--muted-foreground)] text-xs">{p.label}</text>
        ))}

        {hovered !== null && (
          <g>
            <line x1={points[hovered].x} y1={padding.top} x2={points[hovered].x} y2={padding.top + chartH} stroke={strokeColor} strokeWidth="1" strokeDasharray="4,4" opacity={0.5} />
            <rect x={points[hovered].x - 24} y={points[hovered].y - 42} width={48} height={28} rx={8} className="fill-[var(--foreground)]" />
            <text x={points[hovered].x} y={points[hovered].y - 24} textAnchor="middle" className="fill-[var(--background)] text-xs font-medium">{points[hovered].value}</text>
          </g>
        )}
      </svg>
    </div>
  );
};

const PieChart = ({
  data = [],
  size = 220,
  innerRadius = 60,
  showLegend = true,
  colors = defaultColors,
  className,
}) => {
  const [hovered, setHovered] = useState(null);
  const total = data.reduce((s, d) => s + d.value, 0);
  const cx = size / 2 + 20;
  const cy = size / 2 + 10;
  const outerR = size / 2;

  const slices = data.reduce((acc, d, i) => {
    const startAngle = acc.length > 0 ? acc[acc.length - 1].startAngle + acc[acc.length - 1].angle : 0;
    const angle = (d.value / total) * 360;
    const midAngle = startAngle + angle / 2;
    const rad = (midAngle * Math.PI) / 180;
    const labelX = cx + (outerR + 24) * Math.cos(rad);
    const labelY = cy + (outerR + 24) * Math.sin(rad);
    const color = d.color || colors[i % colors.length];

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = ((startAngle + angle) * Math.PI) / 180;

    const x1 = cx + outerR * Math.cos(startRad);
    const y1 = cy + outerR * Math.sin(startRad);
    const x2 = cx + outerR * Math.cos(endRad);
    const y2 = cy + outerR * Math.sin(endRad);

    const largeArc = angle > 180 ? 1 : 0;

    const path = angle >= 360
      ? `M ${cx} ${cy - outerR} A ${outerR} ${outerR} 0 1 1 ${cx - 0.01} ${cy - outerR} Z`
      : `M ${cx} ${cy} L ${x1} ${y1} A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2} ${y2} Z`;

    acc.push({ path, labelX, labelY, angle, color, midAngle, startAngle, ...d, i });
    return acc;
  }, []);

  return (
    <div className={cn("flex flex-col items-center gap-6 sm:flex-row sm:items-start", className)}>
      <svg width={size + 60} height={size + 30}>
        {slices.map((s) => (
          <g key={s.i}>
            <path
              d={s.path}
              fill={hovered === s.i ? s.color : `${s.color}CC`}
              strokeWidth={2}
              className="stroke-[var(--card)] transition-all duration-200 cursor-pointer"
              style={{ transform: hovered === s.i ? `scale(1.04)` : "scale(1)", transformOrigin: `${cx}px ${cy}px` }}
              onMouseEnter={() => setHovered(s.i)}
              onMouseLeave={() => setHovered(null)}
            />
            {innerRadius > 0 && (
              <circle cx={cx} cy={cy} r={innerRadius} fill="var(--card)" />
            )}
            {hovered === s.i && (
              <text x={cx} y={cy + 4} textAnchor="middle" className="fill-[var(--foreground)] text-sm font-bold">
                {Math.round((s.value / total) * 100)}%
              </text>
            )}
          </g>
        ))}
      </svg>

      {showLegend && (
        <div className="space-y-2.5">
          {slices.map((s) => (
            <div key={s.i} className="flex items-center gap-3" onMouseEnter={() => setHovered(s.i)} onMouseLeave={() => setHovered(null)}>
              <div className="h-3 w-3 rounded-full" style={{ background: s.color }} />
              <span className="text-sm text-[var(--muted-foreground)]">{s.label}</span>
              <span className="text-sm font-medium text-[var(--foreground)]">{s.value}</span>
              <span className="text-xs text-[var(--muted-foreground)]">({Math.round((s.value / total) * 100)}%)</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export { BarChart, LineChart, PieChart };
