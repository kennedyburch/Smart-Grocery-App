// Shopping list items API endpoint
import { db } from './db.js';

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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const auth = verifyAuth(req);
    const userId = auth.userId;

    // Parse request body for POST/PUT requests
    let body = {};
    if (req.method === 'POST' || req.method === 'PUT') {
      if (req.body) {
        body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      } else {
        const rawBody = await new Promise((resolve) => {
          let data = '';
          req.on('data', chunk => data += chunk);
          req.on('end', () => resolve(data));
        });
        body = rawBody ? JSON.parse(rawBody) : {};
      }
    }

    // For Sarah's MVP, we'll use the fixed apartment household
    const householdId = 'apartment-household-1';

    switch (req.method) {
      case 'GET':
        // Get all items for the household
        const items = db.items.findByHouseholdId(householdId);
        
        // Enrich with user names
        const itemsWithUsers = items.map(item => {
          const user = db.users.findById(item.addedBy);
          return {
            ...item,
            addedByName: user ? user.name : 'Unknown'
          };
        });

        return res.status(200).json({
          success: true,
          items: itemsWithUsers
        });

      case 'POST':
        // Add new item
        const { name, category } = body;
        
        if (!name) {
          return res.status(400).json({
            success: false,
            error: 'Item name is required'
          });
        }

        // Auto-categorize item if not provided
        const itemCategory = category || categorizeItem(name);

        const newItem = db.items.create({
          name: name.trim(),
          category: itemCategory,
          isChecked: false,
          addedBy: userId,
          householdId: householdId
        });

        const user = db.users.findById(userId);
        const itemWithUser = {
          ...newItem,
          addedByName: user ? user.name : 'Unknown'
        };

        return res.status(201).json({
          success: true,
          item: itemWithUser
        });

      case 'PUT':
        // Update item (toggle checked status)
        const itemId = req.url?.split('/').pop();
        const { isChecked } = body;
        
        if (!itemId) {
          return res.status(400).json({
            success: false,
            error: 'Item ID is required'
          });
        }

        const updatedItem = db.items.update(itemId, { isChecked });
        
        if (!updatedItem) {
          return res.status(404).json({
            success: false,
            error: 'Item not found'
          });
        }

        // If item was checked (purchased), add to history
        if (isChecked && !updatedItem.isChecked) {
          db.purchaseHistory.create({
            itemName: updatedItem.name,
            householdId: householdId
          });
        }

        const userForUpdate = db.users.findById(updatedItem.addedBy);
        const updatedItemWithUser = {
          ...updatedItem,
          addedByName: userForUpdate ? userForUpdate.name : 'Unknown'
        };

        return res.status(200).json({
          success: true,
          item: updatedItemWithUser
        });

      case 'DELETE':
        // Delete item
        const deleteItemId = req.url?.split('/').pop();
        
        if (!deleteItemId) {
          return res.status(400).json({
            success: false,
            error: 'Item ID is required'
          });
        }

        const deletedItem = db.items.delete(deleteItemId);
        
        if (!deletedItem) {
          return res.status(404).json({
            success: false,
            error: 'Item not found'
          });
        }

        return res.status(200).json({
          success: true,
          message: 'Item deleted successfully'
        });

      default:
        return res.status(405).json({
          success: false,
          error: 'Method not allowed'
        });
    }
  } catch (error) {
    console.error('Items API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}

// Simple auto-categorization (Sarah's MVP version)
function categorizeItem(itemName) {
  const name = itemName.toLowerCase();
  
  const categories = {
    'Produce': ['spinach', 'tomatoes', 'lettuce', 'apples', 'bananas', 'carrots', 'onions', 'potatoes'],
    'Dairy': ['milk', 'eggs', 'cheese', 'yogurt', 'butter'],
    'Pantry': ['coffee', 'tea', 'rice', 'pasta', 'bread', 'flour', 'sugar', 'salt'],
    'Meat': ['chicken', 'beef', 'fish', 'pork', 'turkey'],
    'Frozen': ['ice cream', 'frozen vegetables', 'frozen fruit'],
    'Personal': ['shampoo', 'soap', 'toothpaste', 'toilet paper']
  };

  for (const [category, items] of Object.entries(categories)) {
    if (items.some(item => name.includes(item))) {
      return category;
    }
  }

  return 'Other';
}
