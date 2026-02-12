import React, { useState, useEffect } from 'react';
import { Plus, ShoppingCart, Check, Users } from 'lucide-react';
import { mockGroceryAPI } from '../lib/mockGroceryAPI';
import useAuthStore from '../stores/authStore';

interface Item {
  id: string;
  name: string;
  category: string;
  isChecked: boolean;
  addedBy: string;
  addedByName: string;
  createdAt: string;
}

interface Suggestion {
  itemName: string;
  frequency: number;
  daysSinceLastPurchase: number;
  confidence: number;
  message: string;
  category: string;
}

interface ShoppingSatus {
  isShopping: boolean;
  shopper?: {
    id: string;
    name: string;
    startedAt: string;
  };
}

interface PurchaseHistoryItem {
  id: string;
  itemName: string;
  category: string;
  purchasedBy: string;
  purchasedAt: string;
  householdId: string;
}

const ShoppingListPage: React.FC = () => {
  const { user } = useAuthStore();
  const [items, setItems] = useState<Item[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [shoppingStatus, setShoppingStatus] = useState<ShoppingSatus>({ isShopping: false });
  const [purchaseHistory, setPurchaseHistory] = useState<PurchaseHistoryItem[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch data
  useEffect(() => {
    fetchItems();
    fetchSuggestions();
    fetchShoppingStatus();
    fetchPurchaseHistory();
    
    // Set up polling for real-time updates (every 3 seconds)
    const interval = setInterval(() => {
      fetchItems();
      fetchShoppingStatus();
      fetchPurchaseHistory();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const fetchItems = async () => {
    try {
      const mockItems = await mockGroceryAPI.getItems();
      // Convert mock items to component item format
      const convertedItems: Item[] = mockItems.map(item => ({
        id: item.id,
        name: item.name,
        category: item.category,
        isChecked: item.isCompleted,
        addedBy: item.addedBy,
        addedByName: item.addedBy === 'sarah-001' ? 'Sarah' : item.addedBy === 'jamie-002' ? 'Jamie' : 'Alex',
        createdAt: item.addedAt
      }));
      setItems(convertedItems);
      setIsLoading(false);
      setError(null);
    } catch (error) {
      console.error('Failed to fetch items:', error);
      setError('Failed to load items');
      setIsLoading(false);
    }
  };

  const fetchSuggestions = async () => {
    try {
      const mockSuggestions = await mockGroceryAPI.getSuggestions();
      console.log('Fetched suggestions:', mockSuggestions); // Debug log
      
      // Convert mock suggestions to component format
      const convertedSuggestions: Suggestion[] = mockSuggestions.map(suggestion => ({
        itemName: suggestion.itemName,
        frequency: suggestion.frequency,
        daysSinceLastPurchase: Math.floor((new Date().getTime() - new Date(suggestion.lastPurchased).getTime()) / (1000 * 60 * 60 * 24)),
        confidence: suggestion.confidence,
        message: `You usually buy this every ${suggestion.frequency} days`,
        category: suggestion.category
      }));
      
      console.log('Converted suggestions:', convertedSuggestions); // Debug log
      setSuggestions(convertedSuggestions);
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
    }
  };

  const fetchShoppingStatus = async () => {
    try {
      // For now, shopping status is just based on local state
      // In a real app, this would track who is currently shopping
      // For demo, we'll just use the current state
    } catch (error) {
      console.error('Failed to fetch shopping status:', error);
    }
  };

  const fetchPurchaseHistory = async () => {
    try {
      const history = await mockGroceryAPI.getPurchaseHistory();
      setPurchaseHistory(history);
    } catch (error) {
      console.error('Failed to fetch purchase history:', error);
    }
  };

  const addItem = async (itemName: string) => {
    if (!itemName.trim() || !user) return;
    
    setIsAddingItem(true);
    try {
      const newItem = await mockGroceryAPI.addItem(itemName.trim(), user.id);
      
      // Convert to component format and add to state
      const convertedItem: Item = {
        id: newItem.id,
        name: newItem.name,
        category: newItem.category,
        isChecked: newItem.isCompleted,
        addedBy: newItem.addedBy,
        addedByName: user.name,
        createdAt: newItem.addedAt
      };
      
      setItems(prev => [...prev, convertedItem]);
      setNewItemName('');
      setError(null);
      
      // Refresh suggestions to remove duplicates
      fetchSuggestions();
    } catch (error) {
      console.error('Failed to add item:', error);
      setError('Failed to add item');
    } finally {
      setIsAddingItem(false);
    }
  };

  const toggleItemChecked = async (itemId: string, currentStatus: boolean) => {
    try {
      await mockGroceryAPI.toggleItem(itemId);
      
      // Update local state
      setItems(prev => prev.map(item => 
        item.id === itemId ? { ...item, isChecked: !currentStatus } : item
      ));
    } catch (error) {
      console.error('Failed to update item:', error);
      setError('Failed to update item');
    }
  };

  const startShopping = async () => {
    try {
      if (!user) return;
      
      setShoppingStatus({
        isShopping: true,
        shopper: {
          id: user.id,
          name: user.name,
          startedAt: new Date().toISOString()
        }
      });
      setError(null);
    } catch (error) {
      console.error('Failed to start shopping:', error);
      setError('Failed to start shopping');
    }
  };

  const finishShopping = async () => {
    try {
      if (!user) return;
      
      // Complete shopping - move checked items to purchase history
      await mockGroceryAPI.finishShopping(user.id);
      
      // Refresh all data to see changes
      fetchItems();
      fetchSuggestions(); // Refresh suggestions with new purchase data
      fetchPurchaseHistory(); // Refresh purchase history to show new items
      
      setShoppingStatus({ isShopping: false });
      setError(null);
    } catch (error) {
      console.error('Failed to finish shopping:', error);
      setError('Failed to finish shopping');
    }
  };

  const addSuggestion = (suggestion: Suggestion) => {
    addItem(suggestion.itemName);
  };

  const dismissSuggestion = (suggestionIndex: number) => {
    setSuggestions(suggestions.filter((_, index) => index !== suggestionIndex));
  };

  // Group items by category
  const groupedItems = items.reduce((groups, item) => {
    const category = item.category || 'Other';
    if (!groups[category]) groups[category] = [];
    groups[category].push(item);
    return groups;
  }, {} as Record<string, Item[]>);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading your list...</p>
        </div>
      </div>
    );
  }

  const checkedItemsCount = items.filter(item => item.isChecked).length;
  const totalItemsCount = items.length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="ml-2 text-xl font-bold text-slate-800">Pantry Pal</span>
            </div>
            
            {/* Shopping Mode Toggle */}
            {shoppingStatus.isShopping ? (
              <button
                onClick={finishShopping}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center"
              >
                <Check className="h-4 w-4 mr-2" />
                Done Shopping
              </button>
            ) : (
              <button
                onClick={startShopping}
                className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-medium flex items-center"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Start Shopping
              </button>
            )}
          </div>

          {/* Shopping Status */}
          {shoppingStatus.isShopping && (
            <div className="mt-3 bg-teal-50 border border-teal-200 rounded-lg p-3">
              <div className="flex items-center">
                <ShoppingCart className="h-5 w-5 text-teal-600 mr-2" />
                <span className="text-teal-800">
                  <strong>{shoppingStatus.shopper?.name}</strong> is shopping...
                </span>
              </div>
              {checkedItemsCount > 0 && (
                <div className="mt-2">
                  <div className="text-sm text-teal-600">
                    Progress: {checkedItemsCount} of {totalItemsCount}
                  </div>
                  <div className="mt-1 w-full bg-teal-200 rounded-full h-2">
                    <div 
                      className="bg-teal-600 h-2 rounded-full transition-all"
                      style={{ width: `${(checkedItemsCount / totalItemsCount) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            <div className="flex justify-between items-center">
              <span>{error}</span>
              <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">×</button>
            </div>
          </div>
        )}

        {/* Smart Suggestions */}
        {suggestions.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-slate-900 mb-3 flex items-center">
              💡 Smart Suggestions
            </h3>
            <div className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <div key={index} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <span className="font-medium text-slate-900">🥛 {suggestion.itemName}</span>
                      </div>
                      <p className="text-sm text-slate-600 mt-1">{suggestion.message}</p>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => addSuggestion(suggestion)}
                        className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 rounded text-sm"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => dismissSuggestion(index)}
                        className="bg-slate-300 hover:bg-slate-400 text-slate-700 px-3 py-1 rounded text-sm"
                      >
                        Skip
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add New Item */}
        <div className="mb-6 bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex space-x-3">
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addItem(newItemName)}
              placeholder="Add an item (e.g., milk, eggs, coffee)..."
              className="flex-1 border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              disabled={isAddingItem}
            />
            <button
              onClick={() => addItem(newItemName)}
              disabled={isAddingItem || !newItemName.trim()}
              className="bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white px-6 py-3 rounded-lg font-medium flex items-center"
            >
              {isAddingItem ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              ) : (
                <Plus className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Shopping List */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200">
          <div className="px-4 py-4 border-b border-slate-200">
            <h2 className="text-lg font-medium text-slate-900">
              📝 Shopping List ({items.filter(item => !item.isChecked).length})
            </h2>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="mx-auto h-12 w-12 text-slate-400" />
              <h3 className="mt-2 text-sm font-medium text-slate-900">No items yet</h3>
              <p className="mt-1 text-sm text-slate-500">Add your first item to get started!</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {Object.entries(groupedItems).map(([category, categoryItems]) => (
                <div key={category} className="p-4">
                  <h4 className="text-sm font-medium text-slate-700 mb-3">
                    {getCategoryEmoji(category)} {category}
                  </h4>
                  <div className="space-y-2">
                    {categoryItems.map((item) => (
                      <div
                        key={item.id}
                        className={`flex items-center p-3 rounded-lg border transition-colors ${
                          item.isChecked 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <button
                          onClick={() => toggleItemChecked(item.id, item.isChecked)}
                          className={`mr-3 w-5 h-5 rounded border-2 flex items-center justify-center ${
                            item.isChecked
                              ? 'bg-green-600 border-green-600 text-white'
                              : 'border-slate-300 hover:border-teal-500'
                          }`}
                        >
                          {item.isChecked && <Check className="h-3 w-3" />}
                        </button>
                        
                        <div className="flex-1">
                          <span className={`font-medium ${item.isChecked ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                            {item.name}
                          </span>
                          <div className="text-xs text-slate-500 mt-1">
                            Added by {item.addedByName}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Purchase History */}
        {purchaseHistory.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow-sm border border-slate-200 p-4">
            <h3 className="text-lg font-medium text-slate-900 mb-3">
              📋 Recent Purchases (Last 30 Days)
            </h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {purchaseHistory.filter(purchase => {
                const daysSince = Math.floor((new Date().getTime() - new Date(purchase.purchasedAt).getTime()) / (1000 * 60 * 60 * 24));
                return daysSince <= 30;
              }).map((purchase) => {
                const purchaserName = purchase.purchasedBy === 'sarah-001' ? 'Sarah' : 
                                     purchase.purchasedBy === 'jamie-002' ? 'Jamie' : 'Alex';
                const timeAgo = Math.floor((new Date().getTime() - new Date(purchase.purchasedAt).getTime()) / (1000 * 60 * 60 * 24));
                
                return (
                  <div key={purchase.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-b-0">
                    <div className="flex items-center">
                      <span className="text-slate-400 mr-2">✓</span>
                      <span className="text-sm text-slate-700">{purchase.itemName}</span>
                      <span className="ml-2 text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                        {purchase.category}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500">
                      {purchaserName} • {timeAgo === 0 ? 'Today' : `${timeAgo}d ago`}
                    </div>
                  </div>
                );
              })}
            </div>
            {purchaseHistory.filter(purchase => {
              const daysSince = Math.floor((new Date().getTime() - new Date(purchase.purchasedAt).getTime()) / (1000 * 60 * 60 * 24));
              return daysSince <= 30;
            }).length === 0 && (
              <p className="text-sm text-slate-500 text-center py-4">No purchases in the last 30 days</p>
            )}
          </div>
        )}

        {/* Roommates */}
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-2 flex items-center">
            <Users className="h-4 w-4 mr-2" />
            Roommates
          </h3>
          <div className="flex space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">S</span>
              </div>
              <span className="text-sm text-slate-600">Sarah</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">J</span>
              </div>
              <span className="text-sm text-slate-600">Jamie</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">A</span>
              </div>
              <span className="text-sm text-slate-600">Alex</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function getCategoryEmoji(category: string): string {
  const emojis: Record<string, string> = {
    'Produce': '🥬',
    'Dairy': '🥛', 
    'Pantry': '🥫',
    'Meat': '🥩',
    'Frozen': '❄️',
    'Personal': '🧴',
    'Other': '📦'
  };
  return emojis[category] || '📦';
}

export default ShoppingListPage;
