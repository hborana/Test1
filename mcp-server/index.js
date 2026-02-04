#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// United States city to timezone mapping
const cityTimezones = {
  // Eastern Time Zone (ET)
  'new york': 'America/New_York',
  'boston': 'America/New_York',
  'washington': 'America/New_York',
  'miami': 'America/New_York',
  'atlanta': 'America/New_York',
  'philadelphia': 'America/New_York',

  // Central Time Zone (CT)
  'chicago': 'America/Chicago',
  'dallas': 'America/Chicago',
  'houston': 'America/Chicago',
  'austin': 'America/Chicago',

  // Mountain Time Zone (MT)
  'denver': 'America/Denver',
  'phoenix': 'America/Phoenix',

  // Pacific Time Zone (PT)
  'los angeles': 'America/Los_Angeles',
  'san francisco': 'America/Los_Angeles',
  'seattle': 'America/Los_Angeles',
  'san diego': 'America/Los_Angeles',

  // Alaska Time Zone (AKT)
  'anchorage': 'America/Anchorage',

  // Hawaii-Aleutian Time Zone (HST)
  'honolulu': 'Pacific/Honolulu',
};

// Get timezone for a city (case-insensitive)
function getTimezoneForCity(location) {
  const cityKey = location.toLowerCase();
  return cityTimezones[cityKey] || 'UTC'; // Default to UTC if city not found
}

// Mock weather data generator
function getWeather(location) {
  const conditions = ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy'];
  const timezone = getTimezoneForCity(location);

  // Determine if it's night time in that timezone
  const now = new Date();
  const localHour = parseInt(now.toLocaleTimeString('en-US', {
    timeZone: timezone,
    hour: '2-digit',
    hour12: false
  }));
  const isNight = localHour >= 20 || localHour < 6;

  return {
    location,
    temperature: Math.floor(Math.random() * 30) + 10,
    condition: conditions[Math.floor(Math.random() * conditions.length)],
    humidity: Math.floor(Math.random() * 50) + 40,
    windSpeed: Math.floor(Math.random() * 20) + 5,
    timezone: timezone,
    isNight: isNight,
  };
}

// URL handler
function openUrl(url) {
  try {
    const urlObj = new URL(url);
    return {
      url,
      title: `Content from ${urlObj.hostname}`,
      description: `Displaying content from ${url}`,
      canEmbed: true,
      hostname: urlObj.hostname,
    };
  } catch (error) {
    return {
      url,
      error: 'Invalid URL format',
      canEmbed: false,
    };
  }
}

// Time handler
function getCurrentTime() {
  const now = new Date();
  return {
    time: now.toLocaleTimeString(),
    date: now.toLocaleDateString(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timestamp: now.toISOString(),
  };
}

// Troubleshooting handler
function getTroubleshooting(issue) {
  const troubleshootingGuides = {
    'iphone charging': {
      title: 'iPhone Not Charging',
      icon: '🔌',
      steps: [
        { id: 1, text: 'Check the charging cable for damage or fraying' },
        { id: 2, text: 'Try a different power adapter or USB port' },
        { id: 3, text: 'Clean the iPhone charging port with a soft brush' },
        { id: 4, text: 'Restart your iPhone (hold power button, slide to power off)' },
        { id: 5, text: 'Try charging with a different cable to isolate the issue' },
      ]
    },
    'wifi connection': {
      title: 'WiFi Connection Issues',
      icon: '📶',
      steps: [
        { id: 1, text: 'Turn WiFi off and back on in Settings' },
        { id: 2, text: 'Restart your router by unplugging for 30 seconds' },
        { id: 3, text: 'Forget the network and reconnect with password' },
        { id: 4, text: 'Reset Network Settings (Settings > General > Reset)' },
        { id: 5, text: 'Check if other devices can connect to WiFi' },
      ]
    },
    'battery drain': {
      title: 'Fast Battery Drain',
      icon: '🔋',
      steps: [
        { id: 1, text: 'Check Battery Health in Settings > Battery' },
        { id: 2, text: 'Reduce screen brightness and enable Auto-Brightness' },
        { id: 3, text: 'Close unused apps running in background' },
        { id: 4, text: 'Disable Background App Refresh for unused apps' },
        { id: 5, text: 'Turn off Location Services for apps that don\'t need it' },
      ]
    },
    'app crash': {
      title: 'App Keeps Crashing',
      icon: '📱',
      steps: [
        { id: 1, text: 'Force close the app and reopen it' },
        { id: 2, text: 'Check for app updates in the App Store' },
        { id: 3, text: 'Restart your iPhone completely' },
        { id: 4, text: 'Delete and reinstall the app' },
        { id: 5, text: 'Check if iOS needs updating (Settings > General > Software Update)' },
      ]
    },
    'forgot password': {
      title: 'Reset Your Password',
      icon: '🔑',
      steps: [
        { id: 1, text: 'Go to the login page and click "Forgot Password"' },
        { id: 2, text: 'Enter the email address associated with your account' },
        { id: 3, text: 'Check your email for the password reset link (check spam folder too)' },
        { id: 4, text: 'Click the reset link and create a new strong password' },
        { id: 5, text: 'Log in with your new password' },
      ],
      videoUrl: './videos/forgetpw.mp4',
      videoTitle: 'How to Reset Your Account Password',
      isLocalVideo: true
    },
    'default': {
      title: 'General Troubleshooting',
      icon: '🔧',
      steps: [
        { id: 1, text: 'Restart your device' },
        { id: 2, text: 'Check for software updates' },
        { id: 3, text: 'Clear cache and temporary files' },
        { id: 4, text: 'Check internet connection' },
        { id: 5, text: 'Contact support if issue persists' },
      ]
    }
  };

  // Match the issue to a guide
  const issueLower = issue.toLowerCase();
  let guide = troubleshootingGuides.default;

  if (issueLower.includes('charg') || issueLower.includes('power')) {
    guide = troubleshootingGuides['iphone charging'];
  } else if (issueLower.includes('wifi') || issueLower.includes('internet') || issueLower.includes('network')) {
    guide = troubleshootingGuides['wifi connection'];
  } else if (issueLower.includes('battery') || issueLower.includes('drain')) {
    guide = troubleshootingGuides['battery drain'];
  } else if (issueLower.includes('crash') || issueLower.includes('freeze') || issueLower.includes('stuck')) {
    guide = troubleshootingGuides['app crash'];
  } else if (issueLower.includes('password') || issueLower.includes('forgot') || issueLower.includes('reset')) {
    guide = troubleshootingGuides['forgot password'];
  }

  return guide;
}

// Mock battery usage data generator
function getBatteryUsage() {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTime = `${currentHour}:${currentMinute.toString().padStart(2, '0')}${currentHour >= 12 ? 'PM' : 'AM'}`;

  const days = ['T', 'W', 'T', 'F', 'S', 'S', 'M', 'T'];
  const dayNames = ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Today'];

  // Mock app battery usage data
  const appData = [
    { name: 'Safari', icon: '🌐', screenTime: '1h', backgroundTime: null, percentage: 10, color: '#007AFF' },
    { name: 'Phone', icon: '📞', screenTime: '33m', backgroundTime: null, percentage: 9, color: '#34C759' },
    { name: 'Mail', icon: '📧', screenTime: '32m', backgroundTime: '16m', percentage: 8, color: '#007AFF' },
    { name: 'Messages', icon: '💬', screenTime: '28m', backgroundTime: '12m', percentage: 7, color: '#34C759' },
    { name: 'Photos', icon: '🖼️', screenTime: '25m', backgroundTime: null, percentage: 6, color: '#FF3B30' },
    { name: 'Music', icon: '🎵', screenTime: '45m', backgroundTime: '30m', percentage: 5, color: '#FF2D55' },
  ];

  // Additional apps for "View All"
  const allAppData = [
    ...appData,
    { name: 'Instagram', icon: '📷', screenTime: '22m', backgroundTime: '8m', percentage: 4, color: '#E4405F' },
    { name: 'YouTube', icon: '📺', screenTime: '18m', backgroundTime: null, percentage: 3, color: '#FF0000' },
    { name: 'Maps', icon: '🗺️', screenTime: '15m', backgroundTime: '5m', percentage: 3, color: '#007AFF' },
    { name: 'Settings', icon: '⚙️', screenTime: '12m', backgroundTime: null, percentage: 2, color: '#8E8E93' },
    { name: 'Calendar', icon: '📅', screenTime: '10m', backgroundTime: '3m', percentage: 2, color: '#FF3B30' },
    { name: 'Notes', icon: '📝', screenTime: '8m', backgroundTime: null, percentage: 1, color: '#FFD60A' },
    { name: 'Weather', icon: '⛅', screenTime: '5m', backgroundTime: '2m', percentage: 1, color: '#007AFF' },
    { name: 'Podcasts', icon: '🎙️', screenTime: '20m', backgroundTime: '15m', percentage: 2, color: '#8E2DE2' },
  ];


  // Generate realistic battery usage data for each day
  const dailyUsage = days.map((day, index) => {
    const isToday = index === days.length - 1;
    const allDayUsage = isToday ?
      Math.floor(Math.random() * 20) + 35 : // Today: 35-55%
      Math.floor(Math.random() * 25) + 30;  // Other days: 30-55%

    const byCurrentTimeUsage = isToday ?
      Math.floor(Math.random() * 15) + 35 : // Today by current time: 35-50%
      Math.floor(Math.random() * 20) + 30;  // Other days by current time: 30-50%

    return {
      day,
      dayName: dayNames[index],
      allDay: allDayUsage,
      byCurrentTime: byCurrentTimeUsage,
      isToday
    };
  });

  const todayData = dailyUsage[dailyUsage.length - 1];
  const averageByCurrentTime = Math.floor(
    dailyUsage.slice(0, -1).reduce((sum, d) => sum + d.byCurrentTime, 0) / (dailyUsage.length - 1)
  );

  const difference = todayData.byCurrentTime - averageByCurrentTime;
  const message = Math.abs(difference) <= 5
    ? `You're using a similar amount of battery today as you usually do by ${currentTime}.`
    : difference > 0
    ? `You're using more battery today than usual by ${currentTime}. ${difference}% above average.`
    : `You're using less battery today than usual by ${currentTime}. ${Math.abs(difference)}% below average.`;

  return {
    message,
    currentTime,
    average: averageByCurrentTime,
    today: todayData.byCurrentTime,
    dailyData: dailyUsage,
    maxValue: Math.max(...dailyUsage.map(d => Math.max(d.allDay, d.byCurrentTime))),
    apps: appData,
    allApps: allAppData
  };
}

// Video player handler
function playVideo(url) {
  // Sample videos if no URL provided
  const sampleVideos = {
    'demo': {
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      title: 'Big Buck Bunny',
      description: 'A large and lovable rabbit deals with three tiny bullies, led by a flying squirrel, who are determined to squelch his happiness.',
      thumbnail: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
      isEmbed: false
    },
    'nature': {
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      title: 'Elephants Dream',
      description: 'An abstract animated short about two protagonists trapped in a mechanical world.',
      thumbnail: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg',
      isEmbed: false
    },
    'default': {
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      title: 'For Bigger Blazes',
      description: 'A sample video showcasing high-quality video playback.',
      thumbnail: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg',
      isEmbed: false
    }
  };

  // Helper function to convert YouTube watch URL to embed URL
  function convertToEmbedUrl(urlString) {
    try {
      const urlObj = new URL(urlString);

      // YouTube watch URL: https://www.youtube.com/watch?v=VIDEO_ID
      if (urlObj.hostname.includes('youtube.com') && urlObj.searchParams.has('v')) {
        const videoId = urlObj.searchParams.get('v');
        return {
          url: `https://www.youtube.com/embed/${videoId}`,
          isEmbed: true
        };
      }

      // YouTube short URL: https://youtu.be/VIDEO_ID
      if (urlObj.hostname === 'youtu.be') {
        const videoId = urlObj.pathname.slice(1);
        return {
          url: `https://www.youtube.com/embed/${videoId}`,
          isEmbed: true
        };
      }

      // Vimeo: https://vimeo.com/VIDEO_ID
      if (urlObj.hostname.includes('vimeo.com') && !urlObj.pathname.includes('/video/')) {
        const videoId = urlObj.pathname.split('/').filter(Boolean)[0];
        return {
          url: `https://player.vimeo.com/video/${videoId}`,
          isEmbed: true
        };
      }

      // Already an embed URL or direct video file
      return {
        url: urlString,
        isEmbed: urlString.includes('/embed/') || urlString.includes('player.vimeo.com')
      };
    } catch (e) {
      return {
        url: urlString,
        isEmbed: false
      };
    }
  }

  // If URL is a sample video name, use sample
  if (url && sampleVideos[url.toLowerCase()]) {
    return sampleVideos[url.toLowerCase()];
  }

  // If URL provided, convert and use it
  if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
    const { url: convertedUrl, isEmbed } = convertToEmbedUrl(url);
    return {
      url: convertedUrl,
      title: 'Video Player',
      description: 'Playing your video',
      thumbnail: null,
      isEmbed: isEmbed
    };
  }

  // Default to demo video
  return sampleVideos.default;
}

// Create MCP server
const server = new Server(
  {
    name: 'mcp-ui-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'get_weather',
        description: 'Get current weather information for a location',
        inputSchema: {
          type: 'object',
          properties: {
            location: {
              type: 'string',
              description: 'City name or location (e.g., "San Francisco" or "New York")',
            },
          },
          required: ['location'],
        },
      },
      {
        name: 'open_url',
        description: 'Open and display a website URL in an embedded viewer',
        inputSchema: {
          type: 'object',
          properties: {
            url: {
              type: 'string',
              description: 'Full URL to open (must include http:// or https://)',
            },
          },
          required: ['url'],
        },
      },
      {
        name: 'get_current_time',
        description: 'Get the current time and date',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'get_troubleshooting',
        description: 'Get interactive troubleshooting steps for fixing technical PROBLEMS and ISSUES (iPhone not charging, WiFi not working, app crashes, etc.). Use this ONLY when user has a problem to fix.',
        inputSchema: {
          type: 'object',
          properties: {
            issue: {
              type: 'string',
              description: 'Description of the problem (e.g., "iPhone not charging", "WiFi connection issues")',
            },
          },
          required: ['issue'],
        },
      },
      {
        name: 'get_battery_usage',
        description: 'Show battery usage STATISTICS and ANALYTICS with a visual bar chart displaying daily usage patterns over the week. Use this when user wants to see/check/view their battery usage data or statistics.',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'play_video',
        description: 'Play a video with full controls (play/pause, volume, seek, fullscreen). Use this when user wants to watch/play/show a video.',
        inputSchema: {
          type: 'object',
          properties: {
            url: {
              type: 'string',
              description: 'Video URL (http/https) or sample video name ("demo", "nature"). If not provided, plays default sample video.',
            },
          },
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'get_weather': {
        const result = getWeather(args.location);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'open_url': {
        const result = openUrl(args.url);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'get_current_time': {
        const result = getCurrentTime();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'get_troubleshooting': {
        const result = getTroubleshooting(args.issue);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'get_battery_usage': {
        const result = getBatteryUsage();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'play_video': {
        const result = playVideo(args.url || 'default');
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({ error: error.message }),
        },
      ],
      isError: true,
    };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('MCP UI Server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
