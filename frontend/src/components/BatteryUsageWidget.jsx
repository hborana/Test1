import React, { useState } from 'react';
import AppBatterySlider from './AppBatterySlider';

export default function BatteryUsageWidget({ data }) {
  console.log('📊 BatteryUsageWidget received data:', data);

  if (!data || !data.dailyData) {
    console.error('❌ Invalid battery usage data:', data);
    return <div>Error: Invalid battery usage data</div>;
  }

  const { message, currentTime, average, today, dailyData, maxValue, apps, allApps } = data;

  console.log('📱 Apps data:', apps);
  console.log('📱 All Apps data:', allApps);

  // Interactive state
  const [showAllDay, setShowAllDay] = useState(false); // Toggle for All Day overlay
  const [showApps, setShowApps] = useState(false);
  const [hoveredBar, setHoveredBar] = useState(null);

  // Chart dimensions - more compact
  const chartWidth = 340;
  const chartHeight = 160;
  const barWidth = 30;
  const barGap = 6;
  const chartPadding = { top: 20, bottom: 40, left: 16, right: 16 };

  // Calculate bar heights based on maxValue
  const getBarHeight = (value) => {
    const availableHeight = chartHeight - chartPadding.top - chartPadding.bottom;
    const heightRatio = value / maxValue;
    return availableHeight * heightRatio;
  };

  // Calculate average line position (always based on daily usage)
  const averageLineY = chartHeight - chartPadding.bottom - getBarHeight(average);

  const handleTodayClick = () => {
    setShowApps(!showApps);
  };

  return (
    <div style={{
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border-color)',
      borderRadius: '16px',
      padding: '20px',
      maxWidth: '420px',
      fontFamily: 'BlinkMacSystemFont, "Segoe UI", sans-serif',
      color: 'var(--text-primary)',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: showApps
        ? '0 8px 24px rgba(0, 122, 255, 0.15)'
        : '0 2px 8px rgba(0, 0, 0, 0.05)'
    }}>
      {/* Message */}
      <div style={{
        fontSize: '15px',
        lineHeight: '1.5',
        marginBottom: '20px',
        color: 'var(--text-primary)'
      }}>
        {message}
      </div>

      {/* Average vs Today */}
      <div style={{
        display: 'flex',
        gap: '32px',
        marginBottom: '24px'
      }}>
        <div>
          <div style={{
            fontSize: '13px',
            color: 'var(--text-secondary)',
            marginBottom: '4px'
          }}>
            Average
          </div>
          <div style={{
            fontSize: '32px',
            fontWeight: '300',
            color: 'var(--text-secondary)'
          }}>
            {average}%
          </div>
        </div>
        <div>
          <div style={{
            fontSize: '13px',
            color: '#007AFF',
            marginBottom: '4px'
          }}>
            Today
          </div>
          <div style={{
            fontSize: '32px',
            fontWeight: '500',
            color: '#007AFF'
          }}>
            {today}%
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <svg
        width={chartWidth}
        height={chartHeight}
        style={{ overflow: 'visible' }}
      >
        {/* Average line */}
        <line
          x1={chartPadding.left}
          y1={averageLineY}
          x2={chartWidth - chartPadding.right}
          y2={averageLineY}
          stroke="var(--text-tertiary)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <text
          x={chartWidth - chartPadding.right + 5}
          y={averageLineY + 4}
          fontSize="11"
          fill="var(--text-tertiary)"
        >
          Average
        </text>

        {/* Bars for each day */}
        {dailyData.map((dayData, index) => {
          const x = chartPadding.left + index * (barWidth + barGap);

          // Daily usage (always shown)
          const dailyValue = dayData.byCurrentTime;
          const dailyHeight = getBarHeight(dailyValue);
          const dailyY = chartHeight - chartPadding.bottom - dailyHeight;

          // All day usage (shown if toggle enabled)
          const allDayValue = dayData.allDay;
          const allDayHeight = getBarHeight(allDayValue);
          const allDayY = chartHeight - chartPadding.bottom - allDayHeight;

          const isToday = dayData.isToday;
          const isHovered = hoveredBar === index;

          return (
            <g
              key={index}
              style={{ cursor: isToday ? 'pointer' : 'default' }}
              onClick={isToday ? handleTodayClick : undefined}
              onMouseEnter={() => setHoveredBar(index)}
              onMouseLeave={() => setHoveredBar(null)}
            >
              {/* All Day bar (background - lighter, only if toggle enabled) */}
              {showAllDay && (
                <rect
                  x={x}
                  y={allDayY}
                  width={barWidth}
                  height={allDayHeight}
                  rx="4"
                  fill={isToday ? 'rgba(0, 122, 255, 0.2)' : 'var(--text-tertiary)'}
                  opacity={0.3}
                  style={{
                    transition: 'all 0.3s ease'
                  }}
                />
              )}

              {/* Daily usage bar (foreground - always shown) */}
              <rect
                x={x}
                y={dailyY}
                width={barWidth}
                height={dailyHeight}
                rx="4"
                fill={isToday ? '#007AFF' : 'var(--text-tertiary)'}
                opacity={isToday ? 1 : (isHovered ? 0.6 : 0.5)}
                style={{
                  transition: 'all 0.2s ease',
                  transform: isToday && showApps
                    ? `scale(1.08)`
                    : isHovered
                    ? `scale(1.05)`
                    : 'scale(1)',
                  transformOrigin: `${x + barWidth / 2}px ${chartHeight - chartPadding.bottom}px`
                }}
              />

              {/* Hover highlight effect */}
              {isHovered && (
                <rect
                  x={x}
                  y={dailyY}
                  width={barWidth}
                  height={dailyHeight}
                  rx="4"
                  fill="white"
                  opacity="0.2"
                  style={{ pointerEvents: 'none' }}
                />
              )}

              {/* Day label */}
              <text
                x={x + barWidth / 2}
                y={chartHeight - chartPadding.bottom + 20}
                fontSize="11"
                fontWeight={isToday ? '600' : '400'}
                fill={isToday ? '#007AFF' : 'var(--text-secondary)'}
                textAnchor="middle"
              >
                {dayData.day}
              </text>

              {/* Percentage on hover */}
              {isHovered && (
                <text
                  x={x + barWidth / 2}
                  y={dailyY - 8}
                  fontSize="12"
                  fontWeight="600"
                  fill={isToday ? '#007AFF' : 'var(--text-primary)'}
                  textAnchor="middle"
                >
                  {dailyValue}%
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* View Mode Toggle - Below Chart */}
      <div style={{
        display: 'flex',
        gap: '16px',
        marginTop: '16px',
        fontSize: '12px',
        opacity: showApps ? 0.6 : 1,
        transition: 'opacity 0.3s ease'
      }}>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          cursor: 'pointer',
          color: 'var(--text-secondary)',
          userSelect: 'none'
        }}>
          <input
            type="checkbox"
            checked={showAllDay}
            onChange={() => setShowAllDay(!showAllDay)}
            style={{ cursor: 'pointer' }}
          />
          All Day
        </label>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: '#007AFF',
          fontWeight: '500',
          userSelect: 'none'
        }}>
          <div style={{
            width: '14px',
            height: '14px',
            borderRadius: '50%',
            background: '#007AFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'white'
            }} />
          </div>
          Daily by {currentTime}
        </div>
      </div>

      {/* Expansion hint for today's bar */}
      {!showApps && (
        <div style={{
          marginTop: '12px',
          fontSize: '11px',
          color: 'var(--text-tertiary)',
          textAlign: 'center',
          opacity: 0.7,
          animation: 'pulse 2s ease-in-out infinite'
        }}>
          Click today's bar to see app usage
        </div>
      )}

      {/* App Breakdown Section - Slider */}
      <div style={{
        maxHeight: showApps ? '500px' : '0',
        overflow: 'hidden',
        transition: 'max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        <div style={{
          paddingTop: '20px',
          borderTop: showApps ? '1px solid var(--border-color)' : 'none',
          marginTop: showApps ? '20px' : '0',
          opacity: showApps ? 1 : 0,
          transform: showApps ? 'translateY(0)' : 'translateY(-20px)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          transitionDelay: showApps ? '0.1s' : '0s'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px'
          }}>
            <div style={{
              fontSize: '15px',
              fontWeight: '600',
              color: 'var(--text-primary)'
            }}>
              App and System Activity
            </div>
            <button
              onClick={handleTodayClick}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#007AFF',
                fontSize: '13px',
                cursor: 'pointer',
                padding: '4px 8px',
                borderRadius: '6px',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 122, 255, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              Collapse
            </button>
          </div>

          {/* App Slider - Separate Component */}
          <AppBatterySlider apps={apps} allApps={allApps} />
        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
}
