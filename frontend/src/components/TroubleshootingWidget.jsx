import React, { useState } from 'react';

export default function TroubleshootingWidget({ data }) {
  const { title, icon, steps, videoUrl, videoTitle, isLocalVideo } = data;

  // Track which steps are checked
  const [checkedSteps, setCheckedSteps] = useState({});

  const handleCheckboxChange = (stepId) => {
    setCheckedSteps(prev => ({
      ...prev,
      [stepId]: !prev[stepId]
    }));
  };

  // Calculate progress
  const completedCount = Object.values(checkedSteps).filter(Boolean).length;
  const progressPercentage = (completedCount / steps.length) * 100;

  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '16px',
      padding: '24px',
      maxWidth: '500px',
      margin: '8px 0',
      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
      color: 'white'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '16px'
      }}>
        <span style={{ fontSize: '36px' }}>{icon}</span>
        <div>
          <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '4px' }}>
            {title}
          </h3>
          <div style={{ fontSize: '13px', opacity: 0.9 }}>
            {completedCount} of {steps.length} completed
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.2)',
        borderRadius: '10px',
        height: '8px',
        marginBottom: '20px',
        overflow: 'hidden'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          height: '100%',
          width: `${progressPercentage}%`,
          transition: 'width 0.3s ease',
          borderRadius: '10px'
        }} />
      </div>

      {/* Video Tutorial Section */}
      {videoUrl && (
        <div style={{
          marginBottom: '20px',
          borderRadius: '12px',
          overflow: 'hidden',
          background: 'rgba(0, 0, 0, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          {videoTitle && (
            <div style={{
              padding: '12px 16px',
              background: 'rgba(255, 255, 255, 0.1)',
              fontSize: '14px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>🎥</span>
              {videoTitle}
            </div>
          )}
          <div style={{
            position: 'relative',
            paddingBottom: isLocalVideo ? '0' : '56.25%', // 16:9 for iframe, auto for video
            height: isLocalVideo ? 'auto' : 0,
            overflow: 'hidden'
          }}>
            {isLocalVideo ? (
              // Local video file with controls
              <video
                controls
                style={{
                  width: '100%',
                  display: 'block',
                  maxHeight: '400px'
                }}
              >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              // YouTube embed
              <iframe
                src={videoUrl.replace('watch?v=', 'embed/')}
                title={videoTitle || 'Tutorial Video'}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none'
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
        </div>
      )}

      {/* Troubleshooting Steps */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {steps.map((step) => (
          <label
            key={step.id}
            style={{
              display: 'flex',
              alignItems: 'start',
              gap: '12px',
              padding: '14px',
              background: checkedSteps[step.id]
                ? 'rgba(255, 255, 255, 0.15)'
                : 'rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              textDecoration: checkedSteps[step.id] ? 'line-through' : 'none',
              opacity: checkedSteps[step.id] ? 0.7 : 1
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = checkedSteps[step.id]
                ? 'rgba(255, 255, 255, 0.15)'
                : 'rgba(255, 255, 255, 0.08)';
            }}
          >
            {/* Custom Checkbox */}
            <div
              style={{
                width: '22px',
                height: '22px',
                minWidth: '22px',
                borderRadius: '6px',
                border: '2px solid white',
                background: checkedSteps[step.id] ? 'white' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                marginTop: '2px'
              }}
            >
              {checkedSteps[step.id] && (
                <span style={{
                  color: '#667eea',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}>
                  ✓
                </span>
              )}
            </div>

            {/* Hidden native checkbox for accessibility */}
            <input
              type="checkbox"
              checked={checkedSteps[step.id] || false}
              onChange={() => handleCheckboxChange(step.id)}
              style={{ display: 'none' }}
            />

            {/* Step Text */}
            <span style={{
              fontSize: '15px',
              lineHeight: '1.5',
              flex: 1
            }}>
              {step.text}
            </span>
          </label>
        ))}
      </div>

      {/* Completion Message */}
      {completedCount === steps.length && (
        <div style={{
          marginTop: '20px',
          padding: '16px',
          background: 'rgba(16, 185, 129, 0.2)',
          border: '2px solid rgba(16, 185, 129, 0.4)',
          borderRadius: '12px',
          textAlign: 'center',
          animation: 'fadeIn 0.5s ease'
        }}>
          <span style={{ fontSize: '24px', marginBottom: '8px', display: 'block' }}>
            🎉
          </span>
          <div style={{ fontSize: '16px', fontWeight: 600 }}>
            All steps completed!
          </div>
          <div style={{ fontSize: '13px', opacity: 0.9, marginTop: '4px' }}>
            If the issue persists, contact support
          </div>
        </div>
      )}
    </div>
  );
}
