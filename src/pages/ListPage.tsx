import { useState, useEffect } from 'react';
import { Search, Trash2, TrendingUp } from 'lucide-react';
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

export function ListPage() {
  const { user } = useAuthStore();
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<GroceryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [newItemName, setNewItemName] = useState('');
  const [addedSuggestions, setAddedSuggestions] = useState<string[]>([]);

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [items, searchTerm]);

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const data = await mockGroceryAPI.getItems();
      setItems(data);
    } catch (error) {
      console.error('Failed to fetch items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = items.filter(item => !item.isCompleted);

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  };

  const getUserName = (userId: string) => {
    const userMap: { [key: string]: string } = {
      'sarah-001': 'Sarah',
      'jamie-002': 'Jamie',
      'alex-003': 'Alex'
    };
    return userMap[userId] || 'Unknown';
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffMinutes < 5) {
      return 'Just now';
    } else if (diffMinutes < 60) {
      return `${diffMinutes} min ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays === 1) return 'Yesterday';
      return `${diffDays} days ago`;
    }
  };

  const addItem = async () => {
    if (!newItemName.trim()) return;
    
    try {
      await mockGroceryAPI.addItem(newItemName.trim(), user?.id || 'sarah-001');
      setNewItemName('');
      fetchItems();
    } catch (error) {
      console.error('Failed to add item:', error);
    }
  };

  const handleInlineKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addItem();
    }
  };

  const allSuggestions = [
    { name: 'Milk', emoji: '🥛', description: 'Every 7 days' },
    { name: 'Coffee', emoji: '☕', description: 'Every 2 weeks' },
    { name: 'Eggs', emoji: '🥚', description: 'Running low' }
  ];

  const availableSuggestions = allSuggestions.filter(
    suggestion => !addedSuggestions.includes(suggestion.name)
  );

  const addSuggestionToList = async (itemName: string) => {
    try {
      await mockGroceryAPI.addItem(itemName, user?.id || 'sarah-001');
      setAddedSuggestions(prev => [...prev, itemName]);
      fetchItems();
    } catch (error) {
      console.error('Failed to add suggestion:', error);
    }
  };

  const deleteItem = async (itemId: string) => {
    try {
      // Find the item being deleted to check if it was a Smart Suggestion
      const itemToDelete = items.find(item => item.id === itemId);
      
      await mockGroceryAPI.deleteItem(itemId);
      
      // If the deleted item was originally from Smart Suggestions, move it back
      if (itemToDelete) {
        const suggestionNames = allSuggestions.map(s => s.name);
        if (suggestionNames.includes(itemToDelete.name)) {
          setAddedSuggestions(prev => prev.filter(name => name !== itemToDelete.name));
        }
      }
      
      fetchItems();
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  const toggleItem = async () => {
    // This would update the item's completed status
    try {
      // For now, just remove from UI by re-fetching
      fetchItems();
    } catch (error) {
      console.error('Failed to toggle item:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            {/* Title */}
            <h1 className="text-2xl font-bold text-slate-900">📝 Shopping List</h1>

            {/* Search */}
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search your list..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Smart Suggestions */}
        {availableSuggestions.length > 0 && (
          <div className="mb-6 bg-white rounded-lg shadow-sm p-4 border border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-slate-900 flex items-center">
                <TrendingUp className="h-4 w-4 text-teal-500 mr-2" />
                Smart Suggestions
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {availableSuggestions.map((suggestion) => (
                <div key={suggestion.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-md">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{suggestion.emoji}</span>
                    <div>
                      <p className="font-medium text-slate-900 text-sm">{suggestion.name}</p>
                      <p className="text-xs text-slate-500">{suggestion.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => addSuggestionToList(suggestion.name)}
                    className="bg-teal-500 text-white px-2 py-1 rounded text-xs hover:bg-teal-600 transition-colors"
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {filteredItems.length === 0 && items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-slate-100">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">Your list is empty!</h3>
              <p className="text-slate-600 mb-6">Add your first item below to get started</p>
            </div>
            
            {/* Inline Add Item for Empty State */}
            <div className="px-6 py-4 bg-slate-50 hover:bg-slate-100 transition-colors border-t border-slate-100">
              <div className="flex items-center space-x-4">
                <div className="w-6 h-6 border-2 border-slate-300 rounded-full hover:border-teal-500 transition-colors flex items-center justify-center">
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="+ Add an item..."
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    onKeyPress={handleInlineKeyPress}
                    className="w-full bg-transparent border-none outline-none font-medium text-slate-700 text-lg placeholder-slate-400 focus:placeholder-slate-300"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">No items match your search</h3>
            <p className="text-slate-600">Try adjusting your search term</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-slate-100">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900">
                {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} on your list
              </h3>
            </div>
            <div className="divide-y divide-slate-100">
              {filteredItems.map((item) => (
                <div key={item.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50">
                  <div className="flex items-center space-x-4 flex-1">
                    <button 
                      onClick={() => toggleItem()}
                      className="w-6 h-6 border-2 border-slate-300 rounded-full hover:border-teal-500 transition-colors flex items-center justify-center"
                    >
                      {/* Checkbox circle */}
                    </button>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900 text-lg">{item.name}</p>
                      <p className="text-sm text-slate-500">
                        Added by {getUserName(item.addedBy)} • {getTimeAgo(item.addedAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => deleteItem(item.id)}
                      className="p-2 hover:bg-slate-100 rounded transition-colors"
                    >
                      <Trash2 className="h-4 w-4 text-slate-400 hover:text-red-600" />
                    </button>
                  </div>
                </div>
              ))}
              
              {/* Inline Add Item */}
              <div className="px-6 py-4 bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-6 h-6 border-2 border-slate-300 rounded-full hover:border-teal-500 transition-colors flex items-center justify-center">
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="+ Add an item..."
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      onKeyPress={handleInlineKeyPress}
                      className="w-full bg-transparent border-none outline-none font-medium text-slate-700 text-lg placeholder-slate-400 focus:placeholder-slate-300"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ListPage;
