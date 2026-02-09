import { db } from '../db.js';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Content-Type', 'application/json');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse request body - handle different formats
    let body = {};
    
    if (req.body) {
      // Body already parsed by middleware
      body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    } else if (req.method === 'POST') {
      // Read raw body for serverless functions
      try {
        const rawBody = await new Promise((resolve, reject) => {
          let data = '';
          req.on('data', chunk => data += chunk);
          req.on('end', () => resolve(data));
          req.on('error', reject);
        });
        body = rawBody ? JSON.parse(rawBody) : {};
      } catch (parseError) {
        console.error('Body parsing error:', parseError);
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ 
          error: 'Invalid JSON in request body',
          details: parseError.message 
        });
      }
    }

    console.log('Parsed body:', body); // Debug log

    const { email, password } = body;

    if (!email || !password) {
      console.log('Missing credentials:', { email: !!email, password: !!password });
      res.setHeader('Content-Type', 'application/json');
      return res.status(400).json({ error: 'Email and password are required' });
    }

    console.log('Looking for user with email:', email);

    // Find user
    const user = db.users.findByEmail(email);
    console.log('Found user:', user ? { id: user.id, email: user.email, name: user.name } : 'Not found');
    
    if (!user || user.password !== password) {
      console.log('Authentication failed for:', email);
      res.setHeader('Content-Type', 'application/json');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    // Ensure proper JSON response
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
      user: userWithoutPassword,
      accessToken: 'demo-token-' + user.id,
      refreshToken: 'demo-refresh-' + user.id
    });

  } catch (error) {
    console.error('Login error:', error);
    // Ensure we always send valid JSON
    try {
      res.status(500).json({ error: 'Internal server error', details: error.message });
    } catch (jsonError) {
      // Fallback if JSON.stringify fails
      res.status(500).end('{"error":"Internal server error"}');
    }
  }
}
