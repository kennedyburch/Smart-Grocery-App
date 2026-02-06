import { Express } from 'express';
import authRoutes from './auth.js';

export function setupRoutes(app: Express) {
  // Authentication routes
  app.use('/api/auth', authRoutes);

  // Placeholder routes (to be implemented)
  app.use('/api/households', (req, res) => {
    res.json({ message: 'Household routes coming soon' });
  });

  app.use('/api/items', (req, res) => {
    res.json({ message: 'Item routes coming soon' });
  });
}
