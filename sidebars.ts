import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Core Architecture',
      items: ['engine', 'compute', 'workflows'],
    },
    {
      type: 'category',
      label: 'Integrations & Connectors',
      items: ['google-drive', 'whatsapp-commerce', 'threads', 'mcp-claude'],
    },
    {
      type: 'category',
      label: 'Legal & Compliance',
      items: ['terms', 'privacy', 'data-deletion'],
    },
  ],
};

export default sidebars;
