import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// MCP Client setup
let mcpClient = null;
let mcpTools = [];

async function initializeMCPClient() {
  try {
    const mcpServerPath = path.join(__dirname, '../mcp-server/index.js');

    const transport = new StdioClientTransport({
      command: 'node',
      args: [mcpServerPath],
    });

    mcpClient = new Client(
      {
        name: 'mcp-ui-client',
        version: '1.0.0',
      },
      {
        capabilities: {},
      }
    );

    await mcpClient.connect(transport);
    console.log('✅ Connected to MCP server');

    // List available tools
    const toolsResponse = await mcpClient.listTools();
    mcpTools = toolsResponse.tools;
    console.log('✅ Available MCP tools:', mcpTools.map(t => t.name).join(', '));
  } catch (error) {
    console.error('❌ Failed to initialize MCP client:', error);
  }
}

// Convert MCP tools to OpenAI function format
function convertMCPToolsToOpenAIFunctions() {
  return mcpTools.map(tool => ({
    name: tool.name,
    description: tool.description,
    parameters: tool.inputSchema,
  }));
}

// Call MCP tool
async function callMCPTool(toolName, toolArgs) {
  try {
    const result = await mcpClient.callTool({
      name: toolName,
      arguments: toolArgs,
    });

    // Parse the text content from MCP response
    if (result.content && result.content[0]?.text) {
      return JSON.parse(result.content[0].text);
    }
    return result;
  } catch (error) {
    console.error('Error calling MCP tool:', error);
    return { error: error.message };
  }
}

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!mcpClient) {
      return res.status(500).json({ error: 'MCP client not initialized' });
    }

    const messages = [
      {
        role: 'system',
        content: 'You are a helpful assistant that can provide weather information, open websites, and answer questions. Use the available tools when appropriate.',
      },
      ...conversationHistory,
      { role: 'user', content: message },
    ];

    // Convert MCP tools to OpenAI functions
    const functions = convertMCPToolsToOpenAIFunctions();

    // Call OpenAI with function calling
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      functions: functions,
      function_call: 'auto',
    });

    const responseMessage = response.choices[0].message;

    // Check if OpenAI wants to call a function
    if (responseMessage.function_call) {
      const functionName = responseMessage.function_call.name;
      const functionArgs = JSON.parse(responseMessage.function_call.arguments);

      console.log(`🔧 Calling MCP tool: ${functionName}`, functionArgs);

      // Call the MCP tool
      const toolResult = await callMCPTool(functionName, functionArgs);

      // Return the function call result
      return res.json({
        type: 'tool_call',
        toolName: functionName,
        toolArgs: functionArgs,
        toolResult: toolResult,
        message: responseMessage.content || '',
      });
    }

    // No function call, return normal text response
    res.json({
      type: 'text',
      message: responseMessage.content,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    mcpConnected: mcpClient !== null,
    toolsAvailable: mcpTools.length,
  });
});

// Initialize MCP client before starting server
initializeMCPClient().then(() => {
  app.listen(PORT, () => {
    console.log('\n' + '='.repeat(60));
    console.log('🚀 Surface Backend Running!');
    console.log('='.repeat(60));
    console.log(`\n📍 Backend URL: http://localhost:${PORT}`);
    console.log(`📍 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`\n💬 Ready for chat requests from frontend!`);
    console.log('='.repeat(60) + '\n');
  });
}).catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
