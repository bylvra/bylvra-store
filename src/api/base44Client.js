import { createClient } from 'base44';

export const base44 = createClient({
  appId: import.meta.env.VITE_APP_ID || '6a0bd6cb3aacbe39bd424575',
});
