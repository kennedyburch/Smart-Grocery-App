import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Users, Clock, Plus, TrendingUp } from 'lucide-react';
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

interface ShoppingSuggestion {
  id: string;
  itemName: string;
  category: string;
  lastPurchased: string;
  frequency: number;
  confidence: number;
}

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [suggestions, setSuggestions] = useState<ShoppingSuggestion[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const [itemsData, suggestionsData] = await Promise.all([
        mockGroceryAPI.getItems(),
        mockGroceryAPI.getSuggestions()
      ]);
      
      setItems(itemsData);
      setSuggestions(suggestionsData.slice(0, 3)); // Top 3 suggestions
      
      // Create recent activity from items (mock activity feed)
      const activity = itemsData.slice(-3).reverse().map((item) => ({
        action: 'added',
        item: item.name,
        user: getUserName(item.addedBy),
        time: getTimeAgo(item.addedAt),
        isCurrentUser: item.addedBy === user?.id
      }));
      setRecentActivity(activity);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
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

    if (diffMinutes < 60) {
      return `${diffMinutes} min ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    }
  };

  const addSuggestionToList = async (suggestion: ShoppingSuggestion) => {
    try {
      await mockGroceryAPI.addItem(suggestion.itemName, user?.id || 'sarah-001');
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error('Failed to add suggestion:', error);
    }
  };

  const getOnlineStatus = () => {
    return [
      { name: 'Sarah (You)', online: true, isCurrentUser: true },
      { name: 'Jamie', online: true, isCurrentUser: false },
      { name: 'Alex', online: false, isCurrentUser: false }
    ];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Pantry Pal</h1>
            <p className="text-gray-600 mt-1">Simple Shared Lists</p>
            <div className="mt-4">
              <h2 className="text-xl text-gray-800">Hi {user?.name}! 👋</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <ShoppingCart className="h-8 w-8 text-teal-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Items on List</p>
                <p className="text-2xl font-bold text-gray-900">{items.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Last Shopped</p>
                <p className="text-2xl font-bold text-gray-900">2 days ago</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Shopping Status</p>
                  <p className="text-lg font-semibold text-gray-900">No one shopping</p>
                </div>
              </div>
              <Link 
                to="/shop"
                className="bg-teal-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-teal-600 transition-colors"
              >
                Start Shopping 🛒
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Smart Suggestions */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <TrendingUp className="h-5 w-5 text-teal-500 mr-2" />
                Smart Suggestions
              </h3>
            </div>
            
            <div className="space-y-4">
              {suggestions.length > 0 ? (
                suggestions.map((suggestion) => (
                  <div key={suggestion.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">
                        {suggestion.itemName === 'Milk' ? '🥛' : 
                         suggestion.itemName === 'Coffee Beans' ? '☕' :
                         suggestion.itemName === 'Eggs' ? '🥚' : '📦'} {suggestion.itemName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {suggestion.itemName === 'Milk' ? 'Usually every 7 days. Last: 5 days ago' :
                         suggestion.itemName === 'Coffee Beans' ? 'Usually every 2 weeks' :
                         'Running low based on your pattern'}
                      </p>
                    </div>
                    <button
                      onClick={() => addSuggestionToList(suggestion)}
                      className="bg-teal-500 text-white px-3 py-1 rounded-md text-sm hover:bg-teal-600 transition-colors"
                    >
                      Add to List
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No suggestions right now</p>
              )}
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Clock className="h-5 w-5 text-blue-500 mr-2" />
              Recent Activity
            </h3>
            
            <div className="space-y-3">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">{activity.user}</span> added{' '}
                        <span className="font-medium">{activity.item}</span>
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No recent activity</p>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link 
                to="/list"
                className="w-full bg-teal-500 text-white px-4 py-3 rounded-lg hover:bg-teal-600 transition-colors flex items-center justify-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Item
              </Link>
              <Link 
                to="/shop"
                className="w-full bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Start Shopping
              </Link>
            </div>
          </div>

          {/* Who's Online */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Users className="h-5 w-5 text-purple-500 mr-2" />
              Who's Online
            </h3>
            <div className="space-y-2">
              {getOnlineStatus().map((person, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-900">{person.name}</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    person.online 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {person.online ? '🟢 Online' : '🔴 Offline'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
