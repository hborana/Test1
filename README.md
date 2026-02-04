# Surface

A standalone AI chat application with tools for weather, URLs, time, and more.

## 🎯 What This Is

This is a **standalone web application** where you chat directly in the browser. It uses:
- OpenAI API for chat
- MCP (Model Context Protocol) for tools
- React for the UI

## 🏗️ Architecture

```
┌──────────────┐
│  React UI    │  ← You chat here at localhost:3000
│  (Frontend)  │
└──────┬───────┘
       │
       ↓
┌──────────────┐      ┌──────────────┐
│  Express     │◄────►│ MCP Server   │
│  Backend     │      │  (Tools)     │
│  + OpenAI    │      │              │
└──────────────┘      └──────────────┘
```

## 🚀 Quick Start

### Step 1: Install Dependencies (Already Done!)

All dependencies are installed. You're ready to go!

### Step 2: Start Backend

**Terminal 1:**
```bash
cd /Users/himani/Developer/mcp-ui-chat-standalone-backup/backend
npm start
```

You should see:
```
✅ Connected to MCP server
✅ Available MCP tools: get_weather, open_url, get_current_time
🚀 Surface Backend Running!
📍 Backend URL: http://localhost:3001
```

### Step 3: Start Frontend

**Terminal 2:**
```bash
cd /Users/himani/Developer/mcp-ui-chat-standalone-backup/frontend
npm run dev
```

You should see:
```
VITE ready in XXX ms
➜  Local:   http://localhost:3000/
```

### Step 4: Open Browser

Go to **http://localhost:3000**

You'll see a beautiful chat interface!

## 💬 Try These Examples

- "What's the weather in Tokyo?"
- "Open apple.com"
- "What time is it?"
- "Show me the weather in Paris"

## 📁 Project Structure

```
mcp-ui-chat-standalone-backup/
├── backend/
│   ├── server.js          # Express + OpenAI + MCP client
│   ├── package.json
│   └── .env               # OpenAI API key
├── mcp-server/
│   └── index.js           # MCP server with tools
└── frontend/
    ├── src/
    │   ├── App.jsx        # Main chat component
    │   ├── components/    # Weather, URL, Time widgets
    │   └── index.css      # Styles
    └── package.json
```

## 🛠️ How It Works

1. You type a message in the React UI
2. Frontend sends it to backend (`/api/chat`)
3. Backend calls OpenAI with available tools
4. OpenAI decides if it needs to call a tool
5. Backend calls MCP server for tool execution
6. MCP server returns data
7. Backend sends result back to frontend
8. Frontend renders the widget

## 🔧 Available Tools

### 1. get_weather
- **Parameter:** location (string)
- **Returns:** Mock weather data
- **Widget:** Purple gradient card with temp, condition, humidity, wind

### 2. open_url
- **Parameter:** url (string)
- **Returns:** URL info
- **Widget:** Embedded iframe viewer

### 3. get_current_time
- **No parameters**
- **Returns:** Current time, date, timezone
- **Widget:** Pink gradient time display

## ⚙️ Configuration

### Backend (.env)

Already configured with your OpenAI API key:
```
OPENAI_API_KEY="your-key-here"
PORT=3001
```

## 🐛 Troubleshooting

### Backend won't start

**Error: "MCP client not initialized"**
- Make sure MCP server dependencies are installed
- Check that `mcp-server/index.js` exists

**Error: OpenAI API key invalid**
- Check your API key in `backend/.env`
- Make sure it starts with `sk-`

### Frontend won't connect

**Error: Network Error**
- Make sure backend is running on port 3001
- Check CORS is enabled in backend

### Widgets not showing

**Tools aren't being called**
- Check OpenAI API key is valid
- Look at backend console for errors
- Try asking more specific questions

## 🎨 Features

- ✅ Real-time chat with AI
- ✅ Dynamic widget rendering
- ✅ Beautiful gradient UI
- ✅ Mock weather data (no external API needed)
- ✅ URL embedding in iframe
- ✅ Current time display
- ✅ Conversation history
- ✅ Loading states
- ✅ Error handling

## 📝 Notes

- This is a LOCAL app - no deployment needed
- OpenAI API calls are made from the backend
- MCP server runs automatically with backend
- All data is mock/simulated (weather)
- Works completely offline except for OpenAI calls

## 🔄 Stopping the App

Press `Ctrl+C` in both terminal windows to stop the servers.

## 💡 Next Steps

Want to add more tools?

1. Edit `mcp-server/index.js` - add new tool
2. Create widget in `frontend/src/components/`
3. Update `App.jsx` to render new widget
4. Restart both servers

That's it!

---

**Enjoy your standalone chat app!** 🎉
