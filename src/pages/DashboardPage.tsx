import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Users, Clock, Plus, TrendingUp, Check } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      // Simplified to just set loading state
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Hello, Sarah! 👋</h1>
            <p className="text-gray-600 mt-2">Ready to manage your grocery list?</p>
          </div>
          <Link 
            to="/shop"
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center"
          >
            + Start Shopping
          </Link>
        </div>

        {/* Dashboard Grid */}
        <div className="space-y-6">
          {/* Top Row: Your Household and Smart Suggestions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Your Household */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Household</h3>
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-teal-50 rounded-lg">
                  <ShoppingCart className="h-5 w-5 text-teal-500 mr-3" />
                  <span className="text-sm font-medium text-gray-900">7 items on your list</span>
                </div>
                
                <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                  <Clock className="h-5 w-5 text-blue-500 mr-3" />
                  <span className="text-sm font-medium text-gray-900">Last shopped: 2 days ago</span>
                </div>
                
                <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                  <span className="text-yellow-500 mr-3">💡</span>
                  <span className="text-sm font-medium text-gray-900">3 new suggestions</span>
                </div>
                
                <div className="flex items-center p-3 bg-gray-100 rounded-lg">
                  <span className="text-green-500 mr-3">✅</span>
                  <span className="text-sm font-medium text-gray-900">12 items bought this week</span>
                </div>
                
                <div className="flex items-center p-3 bg-purple-100 rounded-lg">
                  <span className="text-purple-500 mr-3">💰</span>
                  <span className="text-sm font-medium text-gray-900">Total estimated spend: $87</span>
                </div>
              </div>
            </div>

            {/* Smart Suggestions */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <TrendingUp className="h-5 w-5 text-teal-500 mr-2" />
                  Smart Suggestions (Top 3)
                </h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">🥛 Milk</p>
                    <p className="text-sm text-gray-600">Usually every 7 days</p>
                    <p className="text-sm text-gray-600">Last: 5 days ago</p>
                  </div>
                  <button
                    className="bg-teal-500 text-white px-3 py-1 rounded-md text-sm hover:bg-teal-600 transition-colors whitespace-nowrap"
                  >
                    Add to list
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">☕ Coffee</p>
                    <p className="text-sm text-gray-600">Usually every 2 weeks</p>
                    <p className="text-sm text-gray-600">Last: 2 weeks ago</p>
                  </div>
                  <button
                    className="bg-teal-500 text-white px-3 py-1 rounded-md text-sm hover:bg-teal-600 transition-colors whitespace-nowrap"
                  >
                    Add to list
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">🥚 Eggs</p>
                    <p className="text-sm text-gray-600">Running low based on your recipes this week</p>
                  </div>
                  <button
                    className="bg-teal-500 text-white px-3 py-1 rounded-md text-sm hover:bg-teal-600 transition-colors whitespace-nowrap"
                  >
                    Add to list
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row: Recent Activity and Who's Online */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Recent Activity Feed */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Clock className="h-5 w-5 text-teal-500 mr-2" />
                Recent Activity (Last 24hrs)
              </h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 border-l-4 border-blue-500 bg-blue-50">
                <div className="text-blue-600">
                  <Plus className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium text-gray-900">Jamie</span> added <span className="font-medium">Tomatoes</span>
                  </p>
                  <p className="text-xs text-gray-500">2 min ago</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 border-l-4 border-green-500 bg-green-50">
                <div className="text-green-600">
                  <Check className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium text-gray-900">Alex</span> checked off <span className="font-medium">Bread</span>
                  </p>
                  <p className="text-xs text-gray-500">1 hour ago</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 border-l-4 border-blue-500 bg-blue-50">
                <div className="text-blue-600">
                  <Plus className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium text-gray-900">You</span> added <span className="font-medium">Spinach</span>
                  </p>
                  <p className="text-xs text-gray-500">3 hours ago</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <Link to="/activity" className="text-sm text-teal-600 hover:text-teal-700">
                View all activity →
              </Link>
            </div>
          </div>

          {/* Who's Online */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Users className="h-5 w-5 text-purple-500 mr-2" />
              Who's Online (Family & Roommates)
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-900 font-medium">You (Sarah)</span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  🟢 Online
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-900">Jamie</span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  ⚫ Last seen: 2 min ago
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-900">Alex</span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  ⚫ Last seen: 1 hour ago
                </span>
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <button className="text-sm text-teal-600 hover:text-teal-700">
                Invite family member →
              </button>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
