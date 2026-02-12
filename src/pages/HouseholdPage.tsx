import React, { useState, useEffect } from 'react';
import { Users, Plus, Settings, Copy, UserPlus } from 'lucide-react';
import useHouseholdStore from '../stores/householdStore';

const HouseholdPage: React.FC = () => {
  const {
    households,
    currentHousehold,
    isLoading,
    error,
    fetchHouseholds,
    createHousehold,
    joinHousehold,
    setCurrentHousehold,
    generateNewInviteCode,
    clearError
  } = useHouseholdStore();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [newHouseholdName, setNewHouseholdName] = useState('');
  const [newHouseholdDescription, setNewHouseholdDescription] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchHouseholds();
  }, [fetchHouseholds]);

  const handleCreateHousehold = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHouseholdName.trim()) return;

    setIsSubmitting(true);
    try {
      await createHousehold(newHouseholdName.trim(), newHouseholdDescription.trim());
      setNewHouseholdName('');
      setNewHouseholdDescription('');
      setShowCreateModal(false);
    } catch (error) {
      // Error is handled by store
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleJoinHousehold = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim()) return;

    setIsSubmitting(true);
    try {
      await joinHousehold(inviteCode.trim().toUpperCase());
      setInviteCode('');
      setShowJoinModal(false);
    } catch (error) {
      // Error is handled by store
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyInviteCode = async () => {
    if (currentHousehold?.inviteCode) {
      await navigator.clipboard.writeText(currentHousehold.inviteCode);
      // Could add toast notification here
    }
  };

  const handleGenerateNewInviteCode = async () => {
    if (currentHousehold) {
      try {
        await generateNewInviteCode(currentHousehold.id);
        setShowInviteModal(false);
      } catch (error) {
        // Error is handled by store
      }
    }
  };

  if (isLoading && households.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading households...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Households</h1>
            <p className="mt-2 text-slate-600">
              Manage your households and collaborate on grocery lists
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:flex-shrink-0 space-x-3">
            <button
              onClick={() => setShowJoinModal(true)}
              className="inline-flex items-center px-4 py-2 border border-slate-300 rounded-md shadow-sm bg-white text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Join Household
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm bg-teal-600 text-sm font-medium text-white hover:bg-teal-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Household
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            <div className="flex justify-between items-center">
              <span>{error}</span>
              <button
                onClick={clearError}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Current Household */}
        {currentHousehold && (
          <div className="mt-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-slate-900">
                      Current Household
                    </h3>
                    <div className="mt-1">
                      <h2 className="text-2xl font-bold text-teal-600">
                        {currentHousehold.name}
                      </h2>
                      {currentHousehold.description && (
                        <p className="text-slate-600 mt-1">{currentHousehold.description}</p>
                      )}
                      <div className="mt-2 flex items-center text-sm text-slate-500">
                        <Users className="h-4 w-4 mr-1" />
                        {currentHousehold.memberCount || 1} member{(currentHousehold.memberCount || 1) !== 1 ? 's' : ''}
                        <span className="mx-2">•</span>
                        <span className="capitalize">{currentHousehold.userRole}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setShowInviteModal(true)}
                      className="inline-flex items-center px-3 py-2 border border-slate-300 shadow-sm text-sm leading-4 font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Invite
                    </button>
                    <button className="inline-flex items-center px-3 py-2 border border-slate-300 shadow-sm text-sm leading-4 font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* All Households List */}
        <div className="mt-8">
          <h3 className="text-lg leading-6 font-medium text-slate-900 mb-4">
            All Households
          </h3>
          {households.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-slate-400" />
              <h3 className="mt-2 text-sm font-medium text-slate-900">No households</h3>
              <p className="mt-1 text-sm text-slate-500">
                Get started by creating a household or joining an existing one.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {households.map((household) => (
                <div
                  key={household.id}
                  className={`relative bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer border-2 ${
                    currentHousehold?.id === household.id
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  onClick={() => setCurrentHousehold(household.id)}
                >
                  <div>
                    <h4 className="text-lg font-medium text-slate-900">
                      {household.name}
                    </h4>
                    {household.description && (
                      <p className="mt-1 text-sm text-slate-600">
                        {household.description}
                      </p>
                    )}
                    <div className="mt-3 flex items-center text-sm text-slate-500">
                      <Users className="h-4 w-4 mr-1" />
                      {household.memberCount || 1} member{(household.memberCount || 1) !== 1 ? 's' : ''}
                      <span className="mx-2">•</span>
                      <span className="capitalize">{household.userRole}</span>
                    </div>
                  </div>
                  {currentHousehold?.id === household.id && (
                    <div className="absolute top-4 right-4">
                      <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Household Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-slate-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
              <h3 className="text-lg font-medium text-slate-900 mb-4">
                Create New Household
              </h3>
              <form onSubmit={handleCreateHousehold}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                    Household Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={newHouseholdName}
                    onChange={(e) => setNewHouseholdName(e.target.value)}
                    className="mt-1 block w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="Enter household name"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="description" className="block text-sm font-medium text-slate-700">
                    Description (Optional)
                  </label>
                  <textarea
                    id="description"
                    value={newHouseholdDescription}
                    onChange={(e) => setNewHouseholdDescription(e.target.value)}
                    rows={3}
                    className="mt-1 block w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="Enter household description"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !newHouseholdName.trim()}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Creating...' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Join Household Modal */}
        {showJoinModal && (
          <div className="fixed inset-0 bg-slate-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
              <h3 className="text-lg font-medium text-slate-900 mb-4">
                Join Household
              </h3>
              <form onSubmit={handleJoinHousehold}>
                <div className="mb-6">
                  <label htmlFor="inviteCode" className="block text-sm font-medium text-slate-700">
                    Invite Code
                  </label>
                  <input
                    type="text"
                    id="inviteCode"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                    className="mt-1 block w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="Enter 6-character invite code"
                    maxLength={6}
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowJoinModal(false)}
                    className="px-4 py-2 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !inviteCode.trim()}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Joining...' : 'Join'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Invite Modal */}
        {showInviteModal && currentHousehold && (
          <div className="fixed inset-0 bg-slate-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
              <h3 className="text-lg font-medium text-slate-900 mb-4">
                Invite Members to {currentHousehold.name}
              </h3>
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Share this invite code:
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={currentHousehold.inviteCode}
                    readOnly
                    className="block w-full border border-slate-300 rounded-md px-3 py-2 bg-slate-50 text-center font-mono text-lg tracking-wider"
                  />
                  <button
                    onClick={copyInviteCode}
                    className="px-3 py-2 border border-slate-300 rounded-md hover:bg-slate-50"
                    title="Copy to clipboard"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  Share this code with people you want to invite to your household.
                </p>
              </div>
              <div className="flex justify-between">
                <button
                  onClick={handleGenerateNewInviteCode}
                  className="px-4 py-2 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50"
                >
                  Generate New Code
                </button>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HouseholdPage;
