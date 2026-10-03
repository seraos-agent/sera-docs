---
sidebar_position: 1
---

# Introduction to SERA OS

Welcome to the **SERA OS** documentation.

SERA (Systematic Execution & Reasoning Agent) is a universal AI agent engine designed to be **secure**, **autonomous**, and **verifiable**. Unlike standard text-generation chatbots, SERA evaluates real-world state, formulates actionable plans, and securely executes workflows on behalf of the user — all while maintaining strict constitutional guardrails.

## Why SERA?

Modern AI assistants can generate text, but they cannot *act* in the real world. SERA bridges this gap by combining:

- **Cognitive reasoning** with **real execution capabilities** (document intelligence, multi-channel messaging, workspace automation).
- **Policy-enforced autonomy** that prevents rogue agent behavior.
- **Verifiable execution traces** so every action the agent takes can be audited.

## Architecture Overview

SERA OS is organized into layered components, each with a clear responsibility:

```
┌─────────────────────────────────────────┐
│              Server Layer               │
│   (Socket.IO, HTTP, CLI Adapters)       │
├─────────────────────────────────────────┤
│              Runtime Layer              │
│   Runtime · GoalBridge · Coordinators   │
├─────────────────────────────────────────┤
│              Core Engine                │
│   WorldState · Planner · DialogueEngine │
│   IntentEngine · ConstitutionEngine     │
│   GoalEngine · Reflection · Telemetry  │
├─────────────────────────────────────────┤
│           Capabilities Layer            │
│   Google Drive · WhatsApp Commerce       │
│   Communication · Meta Threads · MCP    │
└─────────────────────────────────────────┘
```

### Key Principle: Runtime is the Composition Root

The `Runtime` class (`src/runtime/Runtime.ts`) is the single place where all engines are instantiated and wired together. The server layer (`src/server/index.ts`) is only a boundary adapter it does not own any business logic.

```typescript
// Runtime.ts — The Composition Root
export class Runtime {
  public worldStateService!: WorldStateService;
  public dialogueEngine!: DialogueEngine;
  public proposalManager!: ProposalManager;
  // ... all engines are properties of Runtime
}
```

### Key Principle: WorldState Owns Reality

The `WorldStateService` is the **single source of truth** for the entire environment. Cognitive components (Dialogue, Planner, Reflection) only *query* reality they never own it or cache it independently.

```typescript
// WorldState receives reality through events, not direct queries
eventBus.on(EventTypes.DOMAIN_WORKSPACE_STATE, (event) => {
  this.state.workspace = {
    folderId: event.payload.folderId,
    syncedFilesCount: event.payload.syncedFilesCount,
    quality: {
      updatedAt: Date.now(),
      source: 'EventBus/DOMAIN_WORKSPACE_STATE',
      freshness: 'FRESH',
      confidence: 1.0
    }
  };
});
```

## Core Pillars

| Pillar | Description | Learn More |
|--------|-------------|------------|
| **Agent Engine** | The cognitive core: reasoning, planning, and execution orchestration. | [Agent Engine →](./engine) |
| **WhatsApp Commerce** | Automated catalogs, customer orders, and inventory sync via WhatsApp. | [WhatsApp Commerce →](./whatsapp-commerce) |
| **Action Workflows** | Standardized templates for multi-step task execution. | [Workflows →](./workflows) |
| **Verifiable Compute** | Cryptographic proof that agents executed the intended logic. | [Verifiable Compute →](./compute) |

## Getting Started

Experience SERA OS directly via our cloud application or explore our integration guides:

1. **Access the Cloud Workspace:**
   Visit **[app.seraos.xyz](https://app.seraos.xyz)** to enter the active workspace.

2. **Explore Core Systems:**
   Read through the [Architecture & Cognitive Engine](./engine) to understand autonomous reasoning and execution loops.
