---
sidebar_position: 4
---

# Action Workflows

Action Workflows are the execution backbone of SERA OS. Instead of relying on the LLM to write low-level code on the fly, SERA uses **structured workflow definitions** to ensure safety, determinism, and auditability.

## How Workflows Work

Every user request follows a structured pipeline from natural language to real execution:

```
"Summarize quarterly report in Google Drive and draft a Threads post..."
        │
        ▼
┌─────────────────┐
│  DialogueEngine  │  Classifies intent
└─────────────────┘
        │
        ▼
┌─────────────────┐
│   IntentEngine   │  Creates structured Intent
└─────────────────┘
        │
        ▼
┌─────────────────┐
│  GoalSynthesizer │  Converts Intent → Goal
└─────────────────┘
        │
        ▼
┌─────────────────┐
│     Planner      │  Generates PlanSteps
└─────────────────┘
        │
        ▼
┌─────────────────┐
│ ConstitutionEngine│  Policy validation & Safety guards
└─────────────────┘
        │
        ▼
┌─────────────────┐
│   GoalBridge     │  Real-world execution
└─────────────────┘
        │
        ▼
    GOAL_RESULT event
```

## Plan Structure

The `Planner` generates a `Plan` composed of sequential `PlanStep` objects:

```typescript
interface PlanStep {
  id: string;            // e.g., "step-1"
  description: string;   // Human-readable description
  action: string;        // Tool name: DRIVE_SUMMARIZE_DOCUMENT, THREADS_CREATE_POST, etc.
  payload: object;       // Parameters for the tool
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
}

interface Plan {
  goalId: string;
  steps: PlanStep[];
  strategy: StrategyProfile;
}
```

## Available Actions

SERA currently supports these built-in workflow actions:

| Action | Description | Capability |
|--------|-------------|------------|
| `DRIVE_SEARCH_FILES` | Search and locate documents in the user's sandboxed Google Drive vault | Google Drive |
| `DRIVE_SUMMARIZE_DOCUMENT` | Extract and synthesize key points from multi-page documents | Document Intelligence |
| `THREADS_CREATE_POST` | Draft a post with text and media for Meta Threads | Social Media |
| `THREADS_SCHEDULE_POST` | Schedule publishing for a specific future timestamp | Social Media |
| `WHATSAPP_SEND_CATALOG` | Dispatch Single or Multi-Product catalogs to customer conversations | WhatsApp Commerce |
| `WHATSAPP_SYNC_STOCK` | Synchronize inventory stock levels between warehouse and WhatsApp catalog | WhatsApp Commerce |
| `EVALUATE_CONDITION` | Evaluate a logical condition against current WorldState | Core Engine |
| `EXECUTE_UI_COMMAND` | Trigger an explicit confirmation proposal on the user dashboard | Communication |

## LLM-Powered Dynamic Planning

When a goal cannot be mapped to a single action, the Planner delegates to the LLM to generate a multi-step plan:

```typescript
const prompt = `Generate a JSON array of execution steps for: "${goal.description}".
Available tools: DRIVE_SEARCH_FILES, DRIVE_SUMMARIZE_DOCUMENT, THREADS_CREATE_POST, EVALUATE_CONDITION.
Each step must have: id, description, action, payload, status.

CRITICAL: For sensitive actions, "requiresConfirmation" MUST be true.
Always require explicit user approval before publishing or modifying external resources.`;
```

The LLM generates the plan, but execution is still governed by the `ConstitutionEngine` — the LLM cannot bypass human approval or policy constraints.

## Experience-Informed Planning

The Planner consults Working Memory before generating plans. If a tool has failed consistently in the past, the Planner uses an alternative:

```typescript
const toolFailureBeliefs = semanticBeliefs.filter((b) => 
  b.epistemicStatus === 'CONFIRMED' && 
  b.content.includes(intendedTool) && 
  b.content.includes('failed consistently')
);

if (toolFailureBeliefs.length > 0) {
  console.log(`Warning: Tool '${intendedTool}' fails consistently. Falling back.`);
  intendedTool = 'mock-read-tool';
}
```

This means SERA **learns from its own failures** and avoids repeating mistakes.

## Execution Traces

Every workflow execution produces an `ExecutionTrace` — a complete audit log of what happened:

```typescript
interface ExecutionTrace {
  goalId: string;
  steps: ExecutionStepResult[];
  startedAt: number;
  completedAt: number;
  outcome: 'SUCCESS' | 'PARTIAL_FAILURE' | 'FAILURE';
}
```

These traces are stored in the `ExecutionTraceStore` and can be reviewed by the `ReflectionEngine` for post-execution analysis.
