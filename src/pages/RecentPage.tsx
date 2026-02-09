import { useState, useEffect } from 'react';
import { Calendar, User } from 'lucide-react';
import useAuthStore from '../stores/authStore';
import { mockGroceryAPI } from '../lib/mockGroceryAPI';

interface PurchaseHistory {
  id: string;
  itemName: string;
  category: string;
  purchasedBy: string;
  purchasedAt: string;
}

export function RecentPage() {
  const { user } = useAuthStore();
  const [purchases, setPurchases] = useState<PurchaseHistory[]>([]);
  const [filteredPurchases, setFilteredPurchases] = useState<PurchaseHistory[]>([]);
  const [timeFilter, setTimeFilter] = useState('This Week');
  const [personFilter, setPersonFilter] = useState('Everyone');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPurchases();
  }, []);

  useEffect(() => {
    filterPurchases();
  }, [purchases, timeFilter, personFilter]);

  const fetchPurchases = async () => {
    try {
      setIsLoading(true);
      const data = await mockGroceryAPI.getPurchaseHistory();
      setPurchases(data);
    } catch (error) {
      console.error('Failed to fetch purchases:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterPurchases = () => {
    let filtered = [...purchases];

    // Apply time filter
    const now = new Date();
    if (timeFilter === 'This Week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(purchase => new Date(purchase.purchasedAt) >= weekAgo);
    } else if (timeFilter === 'This Month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(purchase => new Date(purchase.purchasedAt) >= monthAgo);
    }

    // Apply person filter
    if (personFilter !== 'Everyone') {
      const userMap: { [key: string]: string } = {
        'Sarah (You)': 'sarah-001',
        'Jamie': 'jamie-002',
        'Alex': 'alex-003'
      };
      const userId = userMap[personFilter];
      if (userId) {
        filtered = filtered.filter(purchase => purchase.purchasedBy === userId);
      }
    }

    setFilteredPurchases(filtered);
  };

  const getUserName = (userId: string) => {
    const userMap: { [key: string]: string } = {
      'sarah-001': 'Sarah',
      'jamie-002': 'Jamie',
      'alex-003': 'Alex'
    };
    const name = userMap[userId] || 'Unknown';
    return userId === user?.id ? `${name} (You)` : name;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
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

  const groupPurchasesByDate = (purchases: PurchaseHistory[]) => {
    const grouped = purchases.reduce((acc, purchase) => {
      const date = formatDate(purchase.purchasedAt);
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(purchase);
      return acc;
    }, {} as { [key: string]: PurchaseHistory[] });

    return grouped;
  };

  const groupedPurchases = groupPurchasesByDate(filteredPurchases);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading purchase history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 sm:items-center sm:justify-between">
            <h1 className="text-2xl font-bold text-gray-900">📊 Recent Purchases</h1>
            
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4 sm:items-center">
              {/* Time Filter */}
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 bg-white w-full sm:w-48"
                >
                  <option value="All Time">All Time</option>
                  <option value="This Week">This Week</option>
                  <option value="This Month">This Month</option>
                </select>
              </div>

              {/* Person Filter */}
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  value={personFilter}
                  onChange={(e) => setPersonFilter(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 bg-white w-full sm:w-48"
                >
                  <option value="Everyone">Everyone</option>
                  <option value="Sarah (You)">Sarah (You)</option>
                  <option value="Jamie">Jamie</option>
                  <option value="Alex">Alex</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredPurchases.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No purchases found</h3>
            <p className="text-gray-600">
              {purchases.length === 0 
                ? "No purchase history yet. Start shopping to see your history here!"
                : "Try adjusting your filters to see more results"
              }
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedPurchases).map(([date, datePurchases]) => (
              <div key={date}>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                  {date}
                </h2>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h3 className="text-md font-medium text-gray-900">Shopping Trip</h3>
                      <span className="text-sm text-gray-500">{datePurchases.length} items</span>
                    </div>
                  </div>
                  
                  <div className="divide-y divide-gray-100">
                    {datePurchases.map((purchase) => (
                      <div key={purchase.id} className="px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <span className="text-2xl">{getCategoryIcon(purchase.category)}</span>
                          <div>
                            <p className="font-medium text-gray-900">{purchase.itemName}</p>
                            <p className="text-sm text-gray-500">
                              {purchase.category} • Purchased by {getUserName(purchase.purchasedBy)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">
                            {new Date(purchase.purchasedAt).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default RecentPage;
