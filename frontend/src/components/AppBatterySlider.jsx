import React, { useState } from 'react';

export default function AppBatterySlider({ apps, allApps }) {
  console.log('🔍 AppBatterySlider received - apps:', apps, 'allApps:', allApps);

  const [showAllApps, setShowAllApps] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Determine which apps to display
  const displayApps = showAllApps ? (allApps || apps) : apps;

  // Slider navigation
  const appsPerSlide = 3;
  const totalSlides = Math.ceil((displayApps?.length || 0) / appsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const handleViewAllClick = () => {
    setShowAllApps(!showAllApps);
    setCurrentSlide(0);
  };

  if (!displayApps || displayApps.length === 0) {
    return (
      <div style={{
        padding: '20px',
        textAlign: 'center',
        color: 'var(--text-secondary)'
      }}>
        No app data available
      </div>
    );
  }

  return (
    <div>
      {/* Slider Container */}
      <div style={{
        position: 'relative',
        background: 'var(--bg-tertiary)',
        borderRadius: '16px',
        padding: '24px 48px',
        border: '1px solid var(--border-color)',
        minHeight: '280px'
      }}>
        {/* Previous Button */}
        <button
          onClick={prevSlide}
          disabled={totalSlides <= 1}
          style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            cursor: totalSlides <= 1 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: totalSlides <= 1 ? 0.3 : 1,
            transition: 'all 0.2s ease',
            zIndex: 10,
            color: 'var(--text-primary)'
          }}
          onMouseEnter={(e) => {
            if (totalSlides > 1) {
              e.currentTarget.style.background = '#007AFF';
              e.currentTarget.style.borderColor = '#007AFF';
              e.currentTarget.style.color = 'white';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--bg-secondary)';
            e.currentTarget.style.borderColor = 'var(--border-color)';
            e.currentTarget.style.color = 'var(--text-primary)';
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M10 12L6 8L10 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Slides */}
        <div style={{
          overflow: 'hidden',
          position: 'relative'
        }}>
          <div style={{
            display: 'flex',
            transform: `translateX(-${currentSlide * 100}%)`,
            transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
          }}>
            {Array.from({ length: totalSlides }).map((_, slideIndex) => (
              <div
                key={slideIndex}
                style={{
                  minWidth: '100%',
                  display: 'flex',
                  gap: '16px',
                  justifyContent: 'center'
                }}
              >
                {displayApps
                  ?.slice(slideIndex * appsPerSlide, (slideIndex + 1) * appsPerSlide)
                  .map((app, appIndex) => (
                    <div
                      key={appIndex}
                      style={{
                        flex: '1',
                        maxWidth: '140px',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '12px',
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 122, 255, 0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      {/* App Icon */}
                      <div style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '16px',
                        background: `linear-gradient(135deg, ${app.color}22, ${app.color}44)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '36px'
                      }}>
                        {app.icon}
                      </div>

                      {/* App Name */}
                      <div style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: 'var(--text-primary)',
                        textAlign: 'center'
                      }}>
                        {app.name}
                      </div>

                      {/* Battery Percentage */}
                      <div style={{
                        fontSize: '28px',
                        fontWeight: '700',
                        color: app.percentage > 5 ? '#FF3B30' : '#007AFF'
                      }}>
                        {app.percentage}%
                      </div>

                      {/* Screen Time */}
                      <div style={{
                        fontSize: '11px',
                        color: 'var(--text-secondary)',
                        textAlign: 'center',
                        lineHeight: '1.4'
                      }}>
                        <div>Screen: {app.screenTime}</div>
                        {app.backgroundTime && (
                          <div>BG: {app.backgroundTime}</div>
                        )}
                      </div>

                      {/* Battery Bar */}
                      <div style={{
                        width: '100%',
                        height: '6px',
                        background: 'var(--border-color)',
                        borderRadius: '3px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${app.percentage * 10}%`,
                          height: '100%',
                          background: `linear-gradient(90deg, ${app.percentage > 5 ? '#FF3B30' : '#007AFF'}, ${app.percentage > 5 ? '#FF6B60' : '#3395FF'})`,
                          borderRadius: '3px',
                          transition: 'width 0.5s ease'
                        }} />
                      </div>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </div>

        {/* Next Button */}
        <button
          onClick={nextSlide}
          disabled={totalSlides <= 1}
          style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            cursor: totalSlides <= 1 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: totalSlides <= 1 ? 0.3 : 1,
            transition: 'all 0.2s ease',
            zIndex: 10,
            color: 'var(--text-primary)'
          }}
          onMouseEnter={(e) => {
            if (totalSlides > 1) {
              e.currentTarget.style.background = '#007AFF';
              e.currentTarget.style.borderColor = '#007AFF';
              e.currentTarget.style.color = 'white';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--bg-secondary)';
            e.currentTarget.style.borderColor = 'var(--border-color)';
            e.currentTarget.style.color = 'var(--text-primary)';
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M6 4L10 8L6 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Slide Indicators (Dots) */}
      {totalSlides > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          marginTop: '16px'
        }}>
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              style={{
                width: currentSlide === index ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                background: currentSlide === index ? '#007AFF' : 'var(--border-color)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* View All / Show Less Toggle */}
      {allApps && allApps.length > apps.length && (
        <div
          onClick={handleViewAllClick}
          style={{
            marginTop: '16px',
            padding: '12px',
            fontSize: '14px',
            fontWeight: '500',
            color: '#007AFF',
            background: 'rgba(0, 122, 255, 0.08)',
            border: '1px solid rgba(0, 122, 255, 0.2)',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(0, 122, 255, 0.15)';
            e.currentTarget.style.borderColor = 'rgba(0, 122, 255, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(0, 122, 255, 0.08)';
            e.currentTarget.style.borderColor = 'rgba(0, 122, 255, 0.2)';
          }}
        >
          <span>{showAllApps ? 'Show Top 6 Apps' : `View All ${allApps?.length || 14} Apps`}</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            style={{
              transform: showAllApps ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease'
            }}
          >
            <path
              d="M4 6L8 10L12 6"
              stroke="#007AFF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
