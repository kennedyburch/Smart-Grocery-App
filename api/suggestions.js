// Smart suggestions API endpoint
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
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  try {
    const auth = verifyAuth(req);
    
    // For Sarah's MVP, we'll use the fixed apartment household
    const householdId = 'apartment-household-1';

    // Get current items to avoid suggesting duplicates
    const currentItems = db.items.findByHouseholdId(householdId);
    const currentItemNames = currentItems.map(item => item.name.toLowerCase());

    // Get purchase history for frequency analysis
    const history = db.purchaseHistory.findByHouseholdId(householdId);
    
    const suggestions = [];

    // Group history by item name
    const itemHistories = {};
    history.forEach(purchase => {
      const itemName = purchase.itemName.toLowerCase();
      if (!itemHistories[itemName]) {
        itemHistories[itemName] = [];
      }
      itemHistories[itemName].push(purchase);
    });

    // Analyze each item's purchase pattern
    for (const [itemName, purchases] of Object.entries(itemHistories)) {
      // Skip if already on current list
      if (currentItemNames.includes(itemName)) {
        continue;
      }

      // Need at least 2 purchases for pattern analysis
      if (purchases.length < 2) {
        continue;
      }

      // Calculate frequency
      const frequency = db.purchaseHistory.getFrequency(itemName, householdId);
      if (!frequency) continue;

      // Get most recent purchase
      const sortedPurchases = purchases.sort((a, b) => new Date(b.purchasedAt) - new Date(a.purchasedAt));
      const lastPurchase = new Date(sortedPurchases[0].purchasedAt);
      const daysSinceLastPurchase = (new Date() - lastPurchase) / (1000 * 60 * 60 * 24);

      // Suggest if 80% of average cycle has passed
      const suggestionThreshold = frequency * 0.8;
      
      if (daysSinceLastPurchase >= suggestionThreshold) {
        const confidence = Math.min(95, Math.round((daysSinceLastPurchase / frequency) * 100));
        
        suggestions.push({
          itemName: itemName.charAt(0).toUpperCase() + itemName.slice(1), // Capitalize
          frequency: Math.round(frequency),
          daysSinceLastPurchase: Math.round(daysSinceLastPurchase),
          confidence: confidence,
          message: `You usually buy this every ${Math.round(frequency)} days. Last purchased ${Math.round(daysSinceLastPurchase)} days ago.`,
          category: categorizeItem(itemName)
        });
      }
    }

    // Sort suggestions by confidence (highest first)
    suggestions.sort((a, b) => b.confidence - a.confidence);

    return res.status(200).json({
      success: true,
      suggestions: suggestions.slice(0, 3) // Limit to top 3 suggestions
    });

  } catch (error) {
    console.error('Suggestions API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}

// Simple auto-categorization (same as items.js)
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
