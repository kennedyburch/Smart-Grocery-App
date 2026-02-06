import { Express } from 'express';

export function setupRoutes(app: Express) {
  // API routes will be added here
  app.use('/api/auth', (req, res) => {
    res.json({ message: 'Auth routes coming soon' });
  });

  app.use('/api/households', (req, res) => {
    res.json({ message: 'Household routes coming soon' });
  });

  app.use('/api/items', (req, res) => {
    res.json({ message: 'Item routes coming soon' });
  });
}
