import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import useAuthStore from '../stores/authStore';
import { mockGroceryAPI } from '../lib/mockGroceryAPI';

interface GroceryItem {
  id: string;
  name: string;
  category: string;
  addedBy: string;
  addedAt: string;
  isCompleted: boolean;
}

export function ShopPage() {
  const { user } = useAuthStore();
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [isShopping, setIsShopping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [newItemName, setNewItemName] = useState('');

  useEffect(() => {
    fetchItems();
    checkShoppingStatus();
  }, []);

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const data = await mockGroceryAPI.getItems();
      setItems(data); // Keep all items, don't filter completed ones
    } catch (error) {
      console.error('Failed to fetch items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkShoppingStatus = async () => {
    // For now, we'll manage shopping state locally
    // In a real app, this would check server state
  };

  const startShopping = async () => {
    setIsShopping(true);
  };

  const finishShopping = async () => {
    try {
      await mockGroceryAPI.finishShopping(user?.id || 'sarah-001');
      setIsShopping(false);
      fetchItems(); // Refresh to show updated list
    } catch (error) {
      console.error('Failed to finish shopping:', error);
    }
  };

  const toggleItem = async (itemId: string) => {
    try {
      await mockGroceryAPI.toggleItem(itemId);
      fetchItems(); // Refresh to show updated states
    } catch (error) {
      console.error('Failed to toggle item:', error);
    }
  };

  const addQuickItem = async () => {
    if (!newItemName.trim()) return;
    
    try {
      await mockGroceryAPI.addItem(newItemName.trim(), user?.id || 'sarah-001');
      setNewItemName('');
      setShowQuickAdd(false);
      fetchItems();
    } catch (error) {
      console.error('Failed to add item:', error);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Produce': return '🥬';
      case 'Dairy': return '🥛';
      case 'Meat': return '🍖';
      case 'Pantry': return '🥫';
      default: return '📦';
    }
  };

  const groupItemsByCategory = (items: GroceryItem[]) => {
    const grouped = items.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {} as { [key: string]: GroceryItem[] });

    return grouped;
  };

  const completedItems = items.filter(item => item.isCompleted);
  const uncompletedItems = items.filter(item => !item.isCompleted);
  const groupedItems = groupItemsByCategory(items);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading shopping list...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-slate-900">
            🛒 {isShopping ? 'Shopping Mode' : 'Shop'}
          </h1>
        </div>
      </div>

      {/* Shopping Status Bar */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {!isShopping ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-medium text-slate-900">Ready to shop?</p>
                <p className="text-sm text-slate-600">Start shopping to check off items as you go</p>
              </div>
              <button
                onClick={startShopping}
                disabled={uncompletedItems.length === 0}
                className="bg-teal-500 text-white px-6 py-3 rounded-lg hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-medium text-slate-900">You're shopping! 🛒</p>
                <p className="text-sm text-slate-600">
                  Progress: {completedItems.length} of {items.length} items
                </p>
              </div>
              <button
                onClick={finishShopping}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Done Shopping
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Someone Else Shopping Banner */}
      {!isShopping && (
        <div className="bg-blue-50 border-b border-blue-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <p className="text-center text-blue-800">No one is shopping right now 🛒</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {items.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🛒</div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">No items to shop for!</h3>
            <p className="text-slate-600 mb-6">Add items in the List tab</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedItems).map(([category, categoryItems]) => (
              <div key={category} className="bg-white rounded-lg shadow-sm border border-slate-100">
                <div className="px-6 py-4 border-b border-slate-100">
                  <h3 className="text-lg font-semibold text-slate-900 flex items-center">
                    <span className="text-2xl mr-3">{getCategoryIcon(category)}</span>
                    {category.toUpperCase()}
                  </h3>
                </div>
                <div className="divide-y divide-slate-100">
                  {categoryItems.map((item) => (
                    <div 
                      key={item.id} 
                      className={`px-6 py-4 flex items-center space-x-4 ${
                        item.isCompleted ? 'bg-green-50' : 'hover:bg-slate-50'
                      }`}
                    >
                      {isShopping && (
                        <button
                          onClick={() => toggleItem(item.id)}
                          className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors cursor-pointer ${
                            item.isCompleted
                              ? 'bg-green-500 border-green-500 text-white'
                              : 'border-slate-300 hover:border-teal-500'
                          }`}
                        >
                          {item.isCompleted && (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                      )}
                      <div className={item.isCompleted ? 'line-through text-slate-500' : ''}>
                        <p className="font-medium">{item.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Add Section */}
        {isShopping && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-slate-100 p-6">
            <button
              onClick={() => setShowQuickAdd(!showQuickAdd)}
              className="w-full text-teal-600 border-2 border-dashed border-teal-300 rounded-lg py-4 hover:bg-teal-50 transition-colors"
            >
              <Plus className="h-5 w-5 inline-block mr-2" />
              Forgot something?
            </button>
            
            {showQuickAdd && (
              <div className="mt-4 flex space-x-3">
                <input
                  type="text"
                  placeholder="Enter item name..."
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addQuickItem()}
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                  autoFocus
                />
                <button
                  onClick={addQuickItem}
                  disabled={!newItemName.trim()}
                  className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ShopPage;
