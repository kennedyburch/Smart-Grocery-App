// Mock grocery list API for demo purposes
// This simulates a backend API without needing a real server

interface GroceryItem {
  id: string;
  name: string;
  category: string;
  addedBy: string;
  addedAt: string;
  isCompleted: boolean;
  householdId: string;
}

interface ShoppingSuggestion {
  id: string;
  itemName: string;
  category: string;
  lastPurchased: string;
  frequency: number; // days between purchases
  confidence: number; // 0-1 score
}

interface PurchaseHistory {
  id: string;
  itemName: string;
  category: string;
  purchasedBy: string;
  purchasedAt: string;
  householdId: string;
}

// Category mapping for auto-categorization
const CATEGORY_KEYWORDS = {
  'Produce': ['apple', 'banana', 'lettuce', 'tomato', 'onion', 'potato', 'carrot', 'spinach', 'avocado', 'lemon'],
  'Dairy': ['milk', 'cheese', 'yogurt', 'butter', 'cream', 'eggs'],
  'Meat': ['chicken', 'beef', 'pork', 'fish', 'salmon', 'turkey', 'bacon', 'sausage'],
  'Pantry': ['rice', 'pasta', 'bread', 'flour', 'sugar', 'salt', 'pepper', 'oil', 'coffee', 'tea'],
  'Frozen': ['ice cream', 'frozen pizza', 'frozen vegetables', 'frozen berries'],
  'Snacks': ['chips', 'cookies', 'crackers', 'nuts', 'candy'],
  'Other': []
};

// Auto-categorize items based on keywords
function categorizeItem(itemName: string): string {
  const lowerName = itemName.toLowerCase();
  
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(keyword => lowerName.includes(keyword))) {
      return category;
    }
  }
  
  return 'Other';
}

// Mock data storage (in real app, this would be in database)
let mockItems: GroceryItem[] = [
  {
    id: 'item-1',
    name: 'Olive Oil',
    category: 'Pantry',
    addedBy: 'alex-003',
    addedAt: '2026-02-06T09:00:00Z',
    isCompleted: false,
    householdId: 'apartment-household-1'
  },
  {
    id: 'item-2', 
    name: 'Butter',
    category: 'Dairy',
    addedBy: 'alex-003',
    addedAt: '2026-02-06T09:15:00Z',
    isCompleted: false,
    householdId: 'apartment-household-1'
  },
  {
    id: 'item-3',
    name: 'Chicken Thighs', 
    category: 'Meat',
    addedBy: 'alex-003',
    addedAt: '2026-02-06T09:30:00Z',
    isCompleted: false,
    householdId: 'apartment-household-1'
  },
  {
    id: 'item-4',
    name: 'Bananas',
    category: 'Produce', 
    addedBy: 'jamie-002',
    addedAt: '2026-02-06T10:00:00Z',
    isCompleted: false,
    householdId: 'apartment-household-1'
  }
];

let mockPurchaseHistory: PurchaseHistory[] = [
  {
    id: 'hist-1',
    itemName: 'Milk',
    category: 'Dairy',
    purchasedBy: 'sarah-001',
    purchasedAt: '2026-01-30T10:00:00Z', // 7 days ago
    householdId: 'apartment-household-1'
  },
  {
    id: 'hist-2', 
    itemName: 'Bread',
    category: 'Pantry',
    purchasedBy: 'jamie-002',
    purchasedAt: '2026-02-01T15:00:00Z', // 5 days ago
    householdId: 'apartment-household-1'
  },
  {
    id: 'hist-3',
    itemName: 'Coffee',
    category: 'Pantry', 
    purchasedBy: 'alex-003',
    purchasedAt: '2026-01-28T09:00:00Z', // 9 days ago
    householdId: 'apartment-household-1'
  },
  {
    id: 'hist-4',
    itemName: 'Milk',
    category: 'Dairy',
    purchasedBy: 'sarah-001', 
    purchasedAt: '2026-01-23T10:00:00Z', // 14 days ago
    householdId: 'apartment-household-1'
  },
  {
    id: 'hist-5',
    itemName: 'Bananas',
    category: 'Produce',
    purchasedBy: 'jamie-002',
    purchasedAt: '2026-01-31T14:00:00Z', // 6 days ago
    householdId: 'apartment-household-1'
  },
  {
    id: 'hist-6',
    itemName: 'Chicken Thighs',
    category: 'Meat',
    purchasedBy: 'alex-003',
    purchasedAt: '2026-01-29T16:00:00Z', // 8 days ago
    householdId: 'apartment-household-1'
  }
];

// Mock API functions
export const mockGroceryAPI = {
  // Get all items
  getItems: async (): Promise<GroceryItem[]> => {
    await new Promise(resolve => setTimeout(resolve, 200)); // Simulate API delay
    return [...mockItems];
  },

  // Add new item
  addItem: async (name: string, userId: string): Promise<GroceryItem> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newItem: GroceryItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      category: categorizeItem(name),
      addedBy: userId,
      addedAt: new Date().toISOString(),
      isCompleted: false,
      householdId: 'apartment-household-1'
    };
    
    mockItems.push(newItem);
    return newItem;
  },

  // Toggle item completion
  toggleItem: async (itemId: string): Promise<GroceryItem> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const item = mockItems.find(i => i.id === itemId);
    if (!item) throw new Error('Item not found');
    
    item.isCompleted = !item.isCompleted;
    return item;
  },

  // Delete item
  deleteItem: async (itemId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    mockItems = mockItems.filter(i => i.id !== itemId);
  },

  // Get smart suggestions
  getSuggestions: async (): Promise<ShoppingSuggestion[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const suggestions: ShoppingSuggestion[] = [];
    const now = new Date();
    
    // Check if items are already in current shopping list
    const currentItemNames = mockItems.map(item => item.name.toLowerCase());
    
    // Check if milk was purchased recently (within last 3 days)
    const recentMilkPurchase = mockPurchaseHistory.find(purchase => 
      purchase.itemName.toLowerCase() === 'milk' && 
      (now.getTime() - new Date(purchase.purchasedAt).getTime()) / (1000 * 60 * 60 * 24) <= 3
    );
    
    // Only suggest milk if it's not already in the list AND hasn't been purchased recently
    if (!currentItemNames.includes('milk') && !recentMilkPurchase) {
      suggestions.push({
        id: 'suggestion-milk',
        itemName: 'Milk',
        category: 'Dairy',
        lastPurchased: '2026-01-30T10:00:00Z', // 7 days ago
        frequency: 7, // Usually bought every 7 days
        confidence: 0.85
      });
    }

    return suggestions;
  },

  // Complete shopping (move items to purchase history)
  finishShopping: async (userId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const completedItems = mockItems.filter(item => item.isCompleted);
    
    // Move completed items to purchase history
    completedItems.forEach(item => {
      mockPurchaseHistory.push({
        id: `hist-${Date.now()}-${item.id}`,
        itemName: item.name,
        category: item.category,
        purchasedBy: userId,
        purchasedAt: new Date().toISOString(),
        householdId: 'apartment-household-1'
      });
    });
    
    // Remove completed items from list
    mockItems = mockItems.filter(item => !item.isCompleted);
  },

  // Get purchase history (for debugging/display)
  getPurchaseHistory: async (): Promise<PurchaseHistory[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...mockPurchaseHistory].sort((a, b) => 
      new Date(b.purchasedAt).getTime() - new Date(a.purchasedAt).getTime()
    );
  }
};
