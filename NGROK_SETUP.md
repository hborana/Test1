# Using ngrok to Expose Local Server to ChatGPT

## Why You Need This

ChatGPT cannot access `localhost` URLs because:
- ChatGPT runs on OpenAI's servers (in the cloud)
- `localhost` only works on your computer
- You need a **public HTTPS URL**

## Quick Setup with ngrok

### Step 1: Install ngrok

```bash
# On Mac
brew install ngrok

# Or download from https://ngrok.com/download
```

### Step 2: Start Your Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```
Keep this running!

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```
Keep this running!

### Step 3: Create ngrok Tunnels

**Terminal 3 - Backend Tunnel:**
```bash
ngrok http 3001
```

You'll see something like:
```
Forwarding https://abcd-123-456.ngrok-free.app -> http://localhost:3001
```

**Copy this URL!** (the https one)

**Terminal 4 - Frontend Tunnel:**
```bash
ngrok http 3000
```

You'll see:
```
Forwarding https://wxyz-789-012.ngrok-free.app -> http://localhost:3000
```

**Copy this URL too!**

### Step 4: Update Backend Configuration

Edit `backend/.env`:
```bash
WIDGET_BASE_URL=https://wxyz-789-012.ngrok-free.app
```
(Use YOUR frontend ngrok URL)

**Restart the backend server** (Terminal 1)

### Step 5: Register in ChatGPT

1. Go to **ChatGPT** → **Settings** → **Apps & Connectors**
2. Enable **Developer Mode** (in Advanced Settings)
3. Click **Create an App**
4. Enter:
   - **Name**: Surface
   - **MCP Server URL**:
     ```
     https://abcd-123-456.ngrok-free.app/mcp/messages?api_key=my-secure-api-key-123
     ```
     (Use YOUR backend ngrok URL)
   - **Auth**: No Auth
5. Click **Create**

### Step 6: Test It!

In ChatGPT, ask:
- "What's the weather in Tokyo?"
- "Open TLDR.tech"

## Important Notes

- ngrok free URLs change every time you restart ngrok
- Keep all 4 terminals running while testing
- If you restart ngrok, you'll need to update ChatGPT with the new URL

## Alternative: ngrok Account (Recommended)

Sign up at https://ngrok.com (free) to get:
- Static URLs that don't change
- Longer session times
- Better features

After signing up:
```bash
ngrok config add-authtoken YOUR_AUTH_TOKEN
ngrok http --domain=your-static-domain.ngrok-free.app 3001
```

## Troubleshooting

**ngrok not found:**
```bash
brew install ngrok
```

**"ERR_NGROK_108" or timeout:**
- Free ngrok URLs may have rate limits
- Sign up for a free account

**Widgets not loading:**
- Make sure you updated `WIDGET_BASE_URL` in backend/.env
- Restart backend after changing .env
- Check both ngrok tunnels are running
