import { createClient } from '@blinkdotnew/sdk';

// Initialize Blink client with project ID
export const blink = createClient({
  projectId: 'text-to-pdf-generator-pro-ypy3enpv',
  authRequired: true
});

export default blink;