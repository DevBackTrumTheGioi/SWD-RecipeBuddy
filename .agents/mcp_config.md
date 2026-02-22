# MCP Context Linking Configuration

## 🛠 Setup Instructions

### 1. Filesystem MCP (Read Docs & Code)
*   **Command**: `npx -y @modelcontextprotocol/server-filesystem d:/SWDxxx/RecipeBuddy`
*   **Purpose**: Allows AI to deep-scan `analysis.md`, `architecture.md`, and local logs without copy-pasting.

### 2. PostgreSQL MCP (Live Schema & Data)
*   **Command**: `npx -y @modelcontextprotocol/server-postgres postgresql://postgres:[PASSWORD]@db.[PROJECT-ID].supabase.co:5432/postgres`
*   **Purpose**: AI verifies table structures and constraints before suggesting migrations.

## 📁 Configuration Path (Claude Desktop)
Add the following to `%APPDATA%\Claude\claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "recipe-buddy-fs": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "d:/SWDxxx/RecipeBuddy"]
    },
    "recipe-buddy-db": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://postgres:YOUR_PASSWORD@db.YOUR_ID.supabase.co:5432/postgres"]
    }
  }
}
```

## 🚀 How to use
When you prompt: *"Viết hàm thanh toán"*, the AI will:
1.  **Read** LPBank integration docs via `recipe-buddy-fs`.
2.  **Verify** the `transactions` table via `recipe-buddy-db`.
3.  **Generate** code that matches your live environment perfectly.
