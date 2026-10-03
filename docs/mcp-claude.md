---
sidebar_position: 8
---

# Claude Desktop Integration (MCP)

SERA OS exposes a fully compliant **Model Context Protocol (MCP)** server, allowing you to control your personal SERA agent directly from **Claude Desktop** by Anthropic. Once connected, Claude gains access to your SERA memory, Google Drive vault, social media (Threads), WhatsApp commerce, and automated scheduling all through natural conversation.

## How It Works

```
┌───────────────────────────────────────────┐
│           Claude Desktop (Client)         │
│   Natural language conversation with      │
│   access to your SERA tools               │
├───────────────────────────────────────────┤
│         MCP Protocol (Streamable HTTP)    │
│          https://mcp.seraos.xyz           │
├───────────────────────────────────────────┤
│          SERA MCP Server                  │
│   Authentication · Tool Routing           │
│   Credit Metering · Session Management    │
├───────────────────────────────────────────┤
│          SERA Agent Runtime               │
│   Memory · Drive · Meta Threads           │
│   WhatsApp Commerce · Scheduling          │
└───────────────────────────────────────────┘
```

SERA implements the MCP specification using the official `@modelcontextprotocol/sdk` server library. The transport layer is **Streamable HTTP**, meaning Claude Desktop connects to a single URL with no additional setup required.

## Getting Started

Connecting SERA to Claude Desktop takes less than two minutes:

### Step 1 Open the SERA Dashboard

Navigate to [app.seraos.xyz](https://app.seraos.xyz) and sign in with your Email or Google account. Go to the **Connections** page from the sidebar.

### Step 2 Copy the MCP Server URL

In the **Claude** connection card, click **Copy MCP URL**. The URL is:

```
https://mcp.seraos.xyz
```

### Step 3 — Generate a Link Code

Click **Generate Link Code** on the same card. SERA will display a **6-digit OTP code** that expires after a short period. This code securely links your Claude session to your SERA account without exposing any API keys.

### Step 4 — Add SERA to Claude Desktop

Open **Claude Desktop → Settings → MCP Servers** and add a new server with the URL from Step 2. When Claude connects for the first time, SERA will prompt you to enter the 6-digit link code from Step 3 via an OAuth authorization flow. Once authorized, the connection is persistent you won't need to re-enter the code.

Your Claude Desktop configuration will look like this:

```json
{
  "mcpServers": {
    "sera": {
      "url": "https://mcp.seraos.xyz"
    }
  }
}
```

That's it. Claude now has access to all of your SERA capabilities.

## Available Tools

Once connected, Claude can invoke the following SERA tools through natural language:

### Agent & Communication

| Tool | Description |
|------|-------------|
| `sera_chat` | Send a message or task instruction to your SERA agent and receive a full reasoning response. |
| `sera_billing_status` | Check your remaining SERA Agent Credits and subscription status. |

### WhatsApp & Commerce

| Tool | Description |
|------|-------------|
| `sera_whatsapp_send_catalog` | Send a single or multi-product catalog message to customer chats over WhatsApp Business API. |
| `sera_whatsapp_stock_sync` | Synchronize inventory quantities and availability with your product catalog. |
| `sera_whatsapp_order_status` | Retrieve recent order tickets, customer inquiries, and fulfillment states. |

### Governance & Proposal Approval

| Tool | Description |
|------|-------------|
| `sera_proposal_approve` | Approve and immediately execute a pending proposal directly from Claude. |
| `sera_proposal_reject` | Reject or cancel an active pending proposal. |
| `sera_proposal_list` | List all pending governance proposals currently waiting for your approval. |

### Memory & Knowledge

| Tool | Description |
|------|-------------|
| `sera_memory_read` | Read your agent's confirmed long-term beliefs, facts, and working memory. |
| `sera_memory_write` | Save a preference, fact, or insight into SERA's persistent long-term memory. |

### Google Drive (Second Brain)

| Tool | Description |
|------|-------------|
| `sera_gdrive_write` | Write a document or note to your Google Drive SERA Vault. |
| `sera_gdrive_append` | Append text content to an existing document, journal, or log in your Google Drive SERA Vault without overwriting existing data. |
| `sera_gdrive_delete` | Delete an obsolete document, draft, or spreadsheet from your Google Drive SERA Vault. |
| `sera_gdrive_read` | Read a file from your Google Drive SERA Vault. |
| `sera_gdrive_list` | List or fuzzy search files inside your SERA Vault folder. |
| `sera_gdrive_create_sheet` | Create a professionally formatted Excel spreadsheet (`.xlsx`) with executive headers, frozen top pane, status badge pills, smart multi-currency detection (`₹` INR, `$` USD, `€` EUR, `£` GBP, `¥` JPY, `S$` SGD, `RM` MYR, `Rp` IDR), and live SUM formulas. |

### Social Media

| Tool | Description |
|------|-------------|
| `sera_threads_publish` | Publish a post to your connected Meta Threads account. Supports text and images (including images from Google Drive). |

### Automation

| Tool | Description |
|------|-------------|
| `sera_schedule_create` | Create a 24/7 background scheduled task or cron job (e.g. recurring social media posts, hourly price alerts). |

## Example Conversations in Claude

Once SERA is connected, you can interact naturally:

> **You:** "Summarize the latest sales log in my Google Drive."  
> **Claude:** *calls `sera_gdrive_read`* → "The latest sales sheet shows 34 orders processed today via WhatsApp, totaling Rp 4.250.000."

> **You:** "Draft an announcement about our new collection for Threads."  
> **Claude:** *calls `sera_threads_publish`* → "I've drafted the update and created proposal `prop-1042` with the product image from your Drive. Would you like me to publish it?"  
> **You:** "Yes, proceed."  
> **Claude:** *calls `sera_proposal_approve`* → "Published to Meta Threads! (Post ID: `th_9482...`)."

> **You:** "Save a note in my Drive with our Q4 content calendar preferences."  
> **Claude:** *calls `sera_gdrive_write`* → "Saved to your SERA Vault as `content_calendar_preferences.md`."

## Security Model

- **OAuth 2.1 Authorization**: Claude authenticates via a standard OAuth flow with PKCE. No API keys are stored in plaintext on your machine.
- **Link Code Binding**: The 6-digit OTP code ensures only your authorized Claude session can access your SERA agent.
- **Scoped Access**: Each MCP session is bound to a single SERA user account. Claude cannot access other users' data.
- **Governance Proposals**: Sensitive operations (publishing posts, bulk catalog updates) always create visual proposals that require explicit approval on the SERA dashboard.
- **Credit Metering**: Every tool call consumes SERA Agent Credits, preventing runaway usage.

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Claude says "SERA is not connected" | Re-open [app.seraos.xyz](https://app.seraos.xyz) → Connections → Generate a new Link Code and re-authorize. |
| Tool calls return "credits depleted" | Top up your SERA Agent Credits on the Billing page. |
| Connection drops after a while | Refresh the MCP server in Claude Desktop settings. The OAuth token auto-refreshes, but Claude may need a reconnect. |
