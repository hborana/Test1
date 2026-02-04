import React, { useState, useEffect } from "react";

export default function WeatherWidget({ data }) {
  const {
    location,
    temperature,
    condition,
    humidity,
    windSpeed,
    isNight,
    timezone = 'UTC', // Get timezone from weather data
  } = data;

  // Real-time clock that updates every second
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second

    return () => clearInterval(timer);
  }, []);

  // Format time for the specific timezone (HH:MM)
  const time = currentTime.toLocaleTimeString('en-US', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  // Format date for the specific timezone (Day DD Mon)
  const dateLabel = currentTime.toLocaleDateString('en-US', {
    timeZone: timezone,
    weekday: 'short',
    day: '2-digit',
    month: 'short'
  });

  const getWeatherEmoji = (cond) => {
    const emojiMap = {
      Sunny: "☀️",
      Cloudy: "☁️",
      Rainy: "🌧️",
      "Partly Cloudy": "⛅",
      Snow: "❄️",
      Fog: "🌫️",
    };
    return emojiMap[cond] || "🌤️";
  };

  const getTheme = ({ condition, temperature, isNight }) => {
    // “pill” backgrounds similar to the thumbnail
    if (isNight) {
      return {
        bg: "linear-gradient(135deg, #0B2A4A 0%, #0A1B2E 60%, #08121F 100%)",
        accent: "rgba(255,255,255,0.18)",
      };
    }
    if (condition === "Sunny" || temperature >= 32) {
      return {
        bg: "linear-gradient(135deg, #F36A5F 0%, #F7A84E 70%, #F9D36A 100%)",
        accent: "rgba(255,255,255,0.22)",
      };
    }
    if (condition === "Rainy") {
      return {
        bg: "linear-gradient(135deg, #2E3C4E 0%, #1F2B38 60%, #141E28 100%)",
        accent: "rgba(255,255,255,0.16)",
      };
    }
    if (condition === "Cloudy") {
      return {
        bg: "linear-gradient(135deg, #3B8DCB 0%, #2C6BA6 55%, #1F4E7C 100%)",
        accent: "rgba(255,255,255,0.18)",
      };
    }
    // default “cool” blue
    return {
      bg: "linear-gradient(135deg, #87B8E7 0%, #6EA4D8 55%, #4C86BD 100%)",
      accent: "rgba(255,255,255,0.18)",
    };
  };

  const theme = getTheme({ condition, temperature, isNight });

  return (
    <div
      style={{
        width: 340,
        height: 78,
        borderRadius: 18,
        padding: "12px 16px",
        color: "white",
        background: theme.bg,
        boxShadow: "0 10px 24px rgba(0,0,0,0.14)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* subtle highlight like the thumbnail */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(80px 60px at 82% 18%, rgba(255,255,255,0.22), rgba(255,255,255,0) 60%)",
          pointerEvents: "none",
        }}
      />

      {/* LEFT */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, zIndex: 1 }}>
        <div style={{ fontSize: 22, lineHeight: 1 }}>{getWeatherEmoji(condition)}</div>

        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 10,
            }}
          >
            <div style={{ fontSize: 34, fontWeight: 800, lineHeight: 1 }}>
              {temperature}°
            </div>
            <div style={{ fontSize: 12, opacity: 0.9, letterSpacing: 0.2 }}>
              {condition}
            </div>
          </div>

          <div style={{ fontSize: 11, opacity: 0.85 }}>
            {location}
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div
        style={{
          zIndex: 1,
          textAlign: "right",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 4,
          paddingLeft: 14,
          borderLeft: `1px solid ${theme.accent}`,
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 800, lineHeight: 1 }}>
          {time}
        </div>
        <div style={{ fontSize: 11, opacity: 0.9, lineHeight: 1 }}>
          {dateLabel}
        </div>
        <div style={{ fontSize: 10, opacity: 0.85, lineHeight: 1 }}>
          💧 {humidity}% · 💨 {windSpeed} km/h
        </div>
      </div>
    </div>
  );
}








// import React from 'react';

// export default function WeatherWidget({ data }) {
//   const { location, temperature, condition, humidity, windSpeed } = data;

//   const getWeatherEmoji = (condition) => {
//     const emojiMap = {
//       'Sunny': '☀️',
//       'Cloudy': '☁️',
//       'Rainy': '🌧️',
//       'Partly Cloudy': '⛅',
//     };
//     return emojiMap[condition] || '🌤️';
//   };

//   return (
//     <div style={{
//       background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//       color: 'white',
//       borderRadius: '16px',
//       padding: '24px',
//       boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
//       maxWidth: '350px',
//       margin: '8px 0'
//     }}>
//       <div style={{
//         display: 'flex',
//         alignItems: 'center',
//         gap: '12px',
//         marginBottom: '16px'
//       }}>
//         <span style={{ fontSize: '48px' }}>{getWeatherEmoji(condition)}</span>
//         <h3 style={{ fontSize: '20px', fontWeight: 600 }}>{location}</h3>
//       </div>
//       <div style={{ fontSize: '56px', fontWeight: 700, marginBottom: '8px' }}>
//         {temperature}°C
//       </div>
//       <div style={{ fontSize: '18px', opacity: 0.9, marginBottom: '20px' }}>
//         {condition}
//       </div>
//       <div style={{
//         display: 'flex',
//         gap: '16px',
//         paddingTop: '16px',
//         borderTop: '1px solid rgba(255, 255, 255, 0.2)'
//       }}>
//         <div style={{ flex: 1 }}>
//           <div style={{ fontSize: '13px', opacity: 0.8 }}>💧 Humidity</div>
//           <div style={{ fontSize: '16px', fontWeight: 600 }}>{humidity}%</div>
//         </div>
//         <div style={{ flex: 1 }}>
//           <div style={{ fontSize: '13px', opacity: 0.8 }}>💨 Wind Speed</div>
//           <div style={{ fontSize: '16px', fontWeight: 600 }}>{windSpeed} km/h</div>
//         </div>
//       </div>
//     </div>
//   );
// }
