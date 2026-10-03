---
sidebar_position: 8
---

# WhatsApp Commerce & Catalog Integration

SERA OS provides native conversational commerce capabilities powered by the Meta WhatsApp Business Cloud API. This capability empowers merchants, service providers, and business owners to manage interactive product catalogs, automate customer order processing, and dispatch live order tickets directly within WhatsApp chats.

## Architecture & System Design

The WhatsApp Commerce subsystem is decoupled into a modular capability architecture:

```
┌────────────────────────────────────────────────────────┐
│                      Runtime                           │
│     (Dialogue Engine / Agent Cognitive Kernel)         │
├────────────────────────────────────────────────────────┤
│             WhatsAppCapability (Tools)                 │
│  - WHATSAPP_SEND_PRODUCT (Single Product Card)         │
│  - WHATSAPP_SEND_CATALOG (Multi-Product Menu)          │
│  - WHATSAPP_ORDER_DISPATCH (Order Ticket Routing)      │
│  - WHATSAPP_UPDATE_STOCK (Inventory Sync)              │
├────────────────────────┬───────────────────────────────┤
│ WhatsAppCatalogService │      StoreProfileService      │
│ (Meta Graph API / SPM) │ (Business Hours & Coverage)   │
├────────────────────────┴───────────────────────────────┤
│            WhatsAppManager & Webhook Router            │
│  (Session Pairing, Message Ingestion & Media Pipeline) │
└────────────────────────────────────────────────────────┘
```

## Key Capabilities

### 1. Interactive Catalog & Product Showcase
- **Single Product Messages (SPM)**: Sends native WhatsApp product cards (`WHATSAPP_SEND_PRODUCT`) allowing buyers to tap, view images, inspect prices in IDR, and add items directly to their WhatsApp shopping cart.
- **Multi-Product Messages (MPM)**: Dispatches categorized multi-product catalogs (`WHATSAPP_SEND_CATALOG`) scoped strictly to a specific merchant or brand, preventing cross-store confusion.
- **Services & Goods Support**: Fully adaptable for tangible products (e.g. food, retail goods) as well as appointment-based services.

### 2. Conversational Order Intake & Dispatch
- **Automated Cart Parsing**: When a buyer submits a cart via WhatsApp, SERA parses incoming order items, quantities, and customer notes into a structured order object (`ParsedIncomingOrder`).
- **Merchant Order Ticket Dispatch**: SERA formats a structured order summary and dispatches it directly to the merchant's personal WhatsApp number with interactive response action buttons (`[Terima Pesanan]` / `[Tolak Pesanan]`).
- **Flexible Fulfillment & Payment**: Supports standard merchant delivery workflows (`DELIVERY` vs `SELF_PICKUP`) and merchant-direct payment methods (QRIS, Bank Transfer, or COD).

### 3. Real-Time Inventory & Daily Quotas
- **Dynamic Stock Updates**: Merchants can update stock using natural language (e.g., *"stok menu hari ini 20 porsi"*).
- **Auto Out-of-Stock**: When inventory reaches zero, the system automatically marks the SKU as unavailable in the WhatsApp catalog to prevent overbooking.

### 4. Store Profiles & Operational Hours
- **Operational Boundaries**: Merchants configure business hours, store locations, and service radius.
- **Holiday & Away Modes**: SERA respects merchant holiday schedules, providing automated courtesy replies and pausing active order intake when the store is closed.

## Security & Operational Boundaries

1. **Merchant-Direct Settlement**:
   SERA acts strictly as a software and workflow enabler. Customer payments for products or services flow directly between the buyer and the merchant's designated payment rail (merchant QRIS or direct bank transfer). SERA never acts as an unlicensed intermediary fund custodian.
2. **Explicit Verification**:
   Order confirmations and cancellations require explicit merchant interaction via secure webhook button clicks or agent dialogue confirmation.
3. **Encrypted Token Management**:
   All Meta Business tokens, catalog IDs, and webhook verification tokens are stored using authenticated AES-256-GCM encryption managed by the platform `SecretManager`.
