// Shopping status API endpoint
import { db } from './db.js';

// In-memory shopping status (resets on deployment)
let shoppingStatus = {};

// Simple auth check (simplified for MVP)
function verifyAuth(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new Error('No authorization header');
  }
  
  const token = authHeader.replace('Bearer ', '');
  
  // Extract user ID from token (simplified for demo)
  if (token.startsWith('demo-token-')) {
    return { userId: token.replace('demo-token-', '') };
  }
  
  throw new Error('Invalid token');
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const auth = verifyAuth(req);
    const userId = auth.userId;

    // For Sarah's MVP, we'll use the fixed apartment household
    const householdId = 'apartment-household-1';

    switch (req.method) {
      case 'GET':
        // Get current shopping status
        const currentShopper = shoppingStatus[householdId];
        
        if (currentShopper) {
          const user = db.users.findById(currentShopper.userId);
          return res.status(200).json({
            success: true,
            isShopping: true,
            shopper: {
              id: currentShopper.userId,
              name: user ? user.name : 'Unknown',
              startedAt: currentShopper.startedAt
            }
          });
        } else {
          return res.status(200).json({
            success: true,
            isShopping: false,
            shopper: null
          });
        }

      case 'POST':
        // Start shopping
        if (shoppingStatus[householdId]) {
          return res.status(400).json({
            success: false,
            error: 'Someone is already shopping'
          });
        }

        const user = db.users.findById(userId);
        shoppingStatus[householdId] = {
          userId: userId,
          userName: user ? user.name : 'Unknown',
          startedAt: new Date().toISOString()
        };

        return res.status(200).json({
          success: true,
          message: 'Shopping started',
          shopper: shoppingStatus[householdId]
        });

      case 'DELETE':
        // Stop shopping (clear checked items)
        if (!shoppingStatus[householdId] || shoppingStatus[householdId].userId !== userId) {
          return res.status(400).json({
            success: false,
            error: 'You are not currently shopping'
          });
        }

        // Clear checked items
        const checkedItems = db.items.findByHouseholdId(householdId).filter(item => item.isChecked);
        checkedItems.forEach(item => {
          db.items.delete(item.id);
        });

        // Clear shopping status
        delete shoppingStatus[householdId];

        return res.status(200).json({
          success: true,
          message: 'Shopping completed',
          itemsCleared: checkedItems.length
        });

      default:
        return res.status(405).json({
          success: false,
          error: 'Method not allowed'
        });
    }

  } catch (error) {
    console.error('Shopping status API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}
