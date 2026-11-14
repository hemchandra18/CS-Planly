import { useState, useRef } from 'react';
import type { ProgressState } from '../dashboardState';
import {
  PROGRESS_ORDER,
  PROGRESS_META,
} from '../dashboardState';

interface DonutChartProps {
  progress: ProgressState;
  selectedSeg: (keyof ProgressState) | null;
  onSelectSeg: (seg: (keyof ProgressState) | null) => void;
}

export function DonutChart({
  progress,
  selectedSeg,
  onSelectSeg,
}: DonutChartProps) {
  const [hoveredSeg, setHoveredSeg] = useState<(keyof ProgressState) | null>(null);
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    segKey: keyof ProgressState | null;
  }>({
    visible: false,
    x: 0,
    y: 0,
    segKey: null,
  });

  const donutWrapRef = useRef<HTMLDivElement>(null);

  const total = PROGRESS_ORDER.reduce((acc, k) => acc + progress[k], 0);

  const progressPctFor = (k: keyof ProgressState) => {
    return total ? Math.round((progress[k] / total) * 100) : 0;
  };

  const segments = PROGRESS_ORDER.map((k) => ({
    key: k,
    label: PROGRESS_META[k].label,
    hex: PROGRESS_META[k].hex,
    count: progress[k],
  }));

  // Donut SVG arc calculations
  const r = 52;
  const circ = 2 * Math.PI * r;
  let acc = 0;

  const handleMouseMove = (e: React.MouseEvent, key: keyof ProgressState) => {
    if (!donutWrapRef.current) return;
    const rect = donutWrapRef.current.getBoundingClientRect();
    setTooltip({
      visible: true,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      segKey: key,
    });
  };

  const handleMouseLeave = () => {
    setHoveredSeg(null);
    setTooltip((prev) => ({ ...prev, visible: false }));
  };

  const activeKey = selectedSeg || hoveredSeg;

  return (
    <div
      className="card"
      id="progressCard"
      onClick={(e) => {
        // Deselect if clicking blank card area
        if (
          selectedSeg &&
          !(e.target as HTMLElement).closest('.donut-seg') &&
          !(e.target as HTMLElement).closest('.legend-item')
        ) {
          onSelectSeg(null);
        }
      }}
    >
      <div className="card-head">
        <div className="card-title">Plan progress</div>
        <div className="meta">Tap a segment for details</div>
      </div>

      <div className="progress-wrap">
        {/* Ring & Center Label Stack */}
        <div
          className="ring-label"
          id="donutWrap"
          ref={donutWrapRef}
          style={{ border: 'none', outline: 'none', boxShadow: 'none' }}
        >
          <svg
            className="donut-ring"
            viewBox="0 0 140 140"
            style={{
              width: '152px',
              height: '152px',
              border: 'none',
              outline: 'none',
              boxShadow: 'none',
            }}
          >
            {/* Background track circle */}
            <circle
              cx="70"
              cy="70"
              r={r}
              fill="none"
              stroke="#1d1f26"
              strokeWidth="13"
            />

            {/* Slices */}
            {segments.map((s) => {
              const frac = total ? s.count / total : 0;
              const dash = Math.max(frac * circ - (frac > 0 ? 1.2 : 0), 0);
              const rotate = -90 + (acc / Math.max(total, 1)) * 360;
              acc += s.count;

              const isSel = selectedSeg === s.key;
              const isHov = hoveredSeg === s.key;
              const dim = activeKey && activeKey !== s.key;

              return (
                <circle
                  key={s.key}
                  className={`donut-seg ${isSel ? 'active' : ''} ${isHov ? 'hovered' : ''}`}
                  cx="70"
                  cy="70"
                  r={r}
                  fill="none"
                  stroke={s.hex}
                  strokeWidth={isSel || isHov ? 17 : 13}
                  strokeDasharray={`${dash} ${circ - dash}`}
                  strokeLinecap="round"
                  transform={`rotate(${rotate} 70 70)`}
                  opacity={dim ? 0.3 : 1}
                  style={{
                    cursor: 'pointer',
                    transition:
                      'stroke-width .15s ease, opacity .15s ease, filter .15s ease',
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectSeg(selectedSeg === s.key ? null : s.key);
                  }}
                  onMouseEnter={() => setHoveredSeg(s.key)}
                  onMouseMove={(e) => handleMouseMove(e, s.key)}
                  onMouseLeave={handleMouseLeave}
                />
              );
            })}
          </svg>

          {/* Ring Center Stack */}
          <div className="ring-stack" style={{ pointerEvents: 'none' }}>
            {activeKey ? (
              <>
                <div
                  className="ring-cat"
                  style={{ color: PROGRESS_META[activeKey].hex }}
                >
                  {PROGRESS_META[activeKey].label}
                </div>
                <div className="ring-pct">{progressPctFor(activeKey)}%</div>
                <div className="ring-frac">{progress[activeKey]} tasks</div>
              </>
            ) : (
              <>
                <div className="ring-pct">{progressPctFor('completed')}%</div>
                <div className="ring-frac">complete</div>
              </>
            )}
          </div>

          {/* Floating Chart Tooltip */}
          {tooltip.visible && tooltip.segKey && (
            <div
              className="chart-tooltip show"
              id="chartTooltip"
              style={{
                left: `${tooltip.x}px`,
                top: `${tooltip.y}px`,
              }}
            >
              <b>{PROGRESS_META[tooltip.segKey].label}</b>
              <br />
              {progress[tooltip.segKey]} tasks · {progressPctFor(tooltip.segKey)}%
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="legend">
          {segments.map((s) => {
            const isSel = selectedSeg === s.key;
            const isHov = hoveredSeg === s.key;

            return (
              <div
                key={s.key}
                className={`legend-item ${isSel ? 'active' : ''} ${isHov ? 'hovered' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectSeg(selectedSeg === s.key ? null : s.key);
                }}
                onMouseEnter={() => setHoveredSeg(s.key)}
                onMouseLeave={() => setHoveredSeg(null)}
              >
                <span className="sw" style={{ background: s.hex }} />
                <span>{s.label}</span>
                <span className="pct">{progressPctFor(s.key)}%</span>
                <span className="n">{s.count}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="progress-total">
        Total tasks<b>{total}</b>
      </div>
    </div>
  );
}
