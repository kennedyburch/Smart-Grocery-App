import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Users, Plus, Clock } from 'lucide-react';
import useAuthStore from '../stores/authStore';

export const DashboardPage: React.FC = () => {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">P</span>
                </div>
                <span className="ml-2 text-xl font-bold text-gray-900">Pantry Pal</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Welcome, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
            <p className="mt-2 text-gray-600">
              Quick access to your shared apartment grocery list
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            <Link
              to="/list"
              className="relative group bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 hover:border-teal-300"
            >
              <div>
                <span className="rounded-lg inline-flex p-3 bg-teal-50 text-teal-700 ring-4 ring-white">
                  <ShoppingCart className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Shopping List
                  <span className="text-teal-600 block text-sm font-normal group-hover:text-teal-700">
                    Add items and see what your roommates need
                  </span>
                </h3>
              </div>
            </Link>

            <Link
              to="/household"
              className="relative group bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 hover:border-purple-300"
            >
              <div>
                <span className="rounded-lg inline-flex p-3 bg-purple-50 text-purple-700 ring-4 ring-white">
                  <Users className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Manage Household
                  <span className="text-purple-600 block text-sm font-normal group-hover:text-purple-700">
                    Roommate settings and household info
                  </span>
                </h3>
              </div>
            </Link>

            <Link
              to="/list"
              className="relative group bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 hover:border-blue-300"
            >
              <div>
                <span className="rounded-lg inline-flex p-3 bg-blue-50 text-blue-700 ring-4 ring-white">
                  <Clock className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Recent Purchases
                  <span className="text-blue-600 block text-sm font-normal group-hover:text-blue-700">
                    See what you and your roommates bought recently
                  </span>
                </h3>
              </div>
            </Link>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Your Apartment</h2>
            </div>
            <div className="p-6">
              <div className="text-center py-6">
                <Users className="mx-auto h-12 w-12 text-teal-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Sarah, Jamie & Alex</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Your 3-bedroom apartment grocery sharing setup
                </p>
                <div className="mt-6">
                  <Link
                    to="/list"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Items to List
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
