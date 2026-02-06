// Demo configuration - set VITE_DEMO_MODE=true for frontend-only demo
export const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';

export const demoUser = {
  id: 'demo-user-id',
  email: 'demo@example.com',
  name: 'Demo User',
  createdAt: new Date().toISOString()
};

export const demoAuthResponse = {
  user: demoUser,
  accessToken: 'demo-token',
  refreshToken: 'demo-refresh-token'
};
