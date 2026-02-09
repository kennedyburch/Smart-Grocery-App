import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  name: string;
}

interface HouseholdMember {
  id: string;
  userId: string;
  householdId: string;
  role: 'owner' | 'admin' | 'member';
  joinedAt: string;
  user?: User;
}

interface Household {
  id: string;
  name: string;
  description?: string;
  inviteCode: string;
  ownerId: string;
  createdAt: string;
  updatedAt?: string;
  userRole?: string;
  memberCount?: number;
  members?: HouseholdMember[];
}

interface HouseholdStore {
  households: Household[];
  currentHouseholdId: string | null;
  currentHousehold: Household | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setCurrentHousehold: (householdId: string | null) => void;
  fetchHouseholds: () => Promise<void>;
  createHousehold: (name: string, description?: string) => Promise<Household>;
  joinHousehold: (inviteCode: string) => Promise<Household>;
  updateHousehold: (householdId: string, updates: { name?: string; description?: string }) => Promise<Household>;
  leaveHousehold: (householdId: string) => Promise<void>;
  generateNewInviteCode: (householdId: string) => Promise<string>;
  fetchHouseholdMembers: (householdId: string) => Promise<HouseholdMember[]>;
  updateMemberRole: (householdId: string, userId: string, role: string) => Promise<void>;
  removeMember: (householdId: string, userId: string) => Promise<void>;
  clearError: () => void;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const useHouseholdStore = create<HouseholdStore>((set, get) => ({
  households: [],
  currentHouseholdId: null,
  currentHousehold: null,
  isLoading: false,
  error: null,

  setCurrentHousehold: (householdId) => {
    const household = householdId 
      ? get().households.find(h => h.id === householdId) || null
      : null;
    
    set({ 
      currentHouseholdId: householdId,
      currentHousehold: household 
    });

    // Store in localStorage for persistence
    if (householdId) {
      localStorage.setItem('currentHouseholdId', householdId);
    } else {
      localStorage.removeItem('currentHouseholdId');
    }
  },

  fetchHouseholds: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/api/households`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch households');
      }

      const data = await response.json();
      const households = data.households || [];
      
      set({ households, isLoading: false });

      // Restore current household from localStorage
      const savedHouseholdId = localStorage.getItem('currentHouseholdId');
      if (savedHouseholdId && households.some((h: Household) => h.id === savedHouseholdId)) {
        get().setCurrentHousehold(savedHouseholdId);
      } else if (households.length > 0) {
        // Set first household as current if none saved
        get().setCurrentHousehold(households[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch households:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch households',
        isLoading: false 
      });
    }
  },

  createHousehold: async (name, description) => {
    set({ isLoading: true, error: null });
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/api/households`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create household');
      }

      const data = await response.json();
      const newHousehold = data.household;
      
      // Add to households list
      set(state => ({ 
        households: [...state.households, { ...newHousehold, userRole: 'owner', memberCount: 1 }],
        isLoading: false 
      }));

      // Set as current household
      get().setCurrentHousehold(newHousehold.id);
      
      return newHousehold;
    } catch (error) {
      console.error('Failed to create household:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create household',
        isLoading: false 
      });
      throw error;
    }
  },

  joinHousehold: async (inviteCode) => {
    set({ isLoading: true, error: null });
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/api/households/join`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inviteCode }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to join household');
      }

      const data = await response.json();
      const household = data.household;
      
      // Add to households list
      set(state => ({ 
        households: [...state.households, { ...household, userRole: 'member', memberCount: 1 }],
        isLoading: false 
      }));

      // Set as current household
      get().setCurrentHousehold(household.id);
      
      return household;
    } catch (error) {
      console.error('Failed to join household:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to join household',
        isLoading: false 
      });
      throw error;
    }
  },

  updateHousehold: async (householdId, updates) => {
    set({ isLoading: true, error: null });
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/api/households/${householdId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update household');
      }

      const data = await response.json();
      const updatedHousehold = data.household;
      
      // Update in households list
      set(state => ({ 
        households: state.households.map(h => 
          h.id === householdId ? { ...h, ...updatedHousehold } : h
        ),
        currentHousehold: state.currentHousehold?.id === householdId 
          ? { ...state.currentHousehold, ...updatedHousehold }
          : state.currentHousehold,
        isLoading: false 
      }));
      
      return updatedHousehold;
    } catch (error) {
      console.error('Failed to update household:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update household',
        isLoading: false 
      });
      throw error;
    }
  },

  leaveHousehold: async (householdId) => {
    set({ isLoading: true, error: null });
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/api/households/${householdId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to leave household');
      }
      
      // Remove from households list
      set(state => {
        const updatedHouseholds = state.households.filter(h => h.id !== householdId);
        const newCurrentHousehold = state.currentHouseholdId === householdId
          ? (updatedHouseholds.length > 0 ? updatedHouseholds[0].id : null)
          : state.currentHouseholdId;
          
        return {
          households: updatedHouseholds,
          currentHouseholdId: newCurrentHousehold,
          currentHousehold: newCurrentHousehold 
            ? updatedHouseholds.find(h => h.id === newCurrentHousehold) || null
            : null,
          isLoading: false
        };
      });
    } catch (error) {
      console.error('Failed to leave household:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to leave household',
        isLoading: false 
      });
      throw error;
    }
  },

  generateNewInviteCode: async (householdId) => {
    set({ isLoading: true, error: null });
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/api/generate-invite-code`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ householdId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate invite code');
      }

      const data = await response.json();
      const newInviteCode = data.inviteCode;
      
      // Update household with new invite code
      set(state => ({ 
        households: state.households.map(h => 
          h.id === householdId ? { ...h, inviteCode: newInviteCode } : h
        ),
        currentHousehold: state.currentHousehold?.id === householdId 
          ? { ...state.currentHousehold, inviteCode: newInviteCode }
          : state.currentHousehold,
        isLoading: false 
      }));
      
      return newInviteCode;
    } catch (error) {
      console.error('Failed to generate invite code:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to generate invite code',
        isLoading: false 
      });
      throw error;
    }
  },

  fetchHouseholdMembers: async (householdId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/api/household-members?householdId=${householdId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch household members');
      }

      const data = await response.json();
      return data.members || [];
    } catch (error) {
      console.error('Failed to fetch household members:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch household members'
      });
      throw error;
    }
  },

  updateMemberRole: async (householdId, userId, role) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/api/household-members?householdId=${householdId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ targetUserId: userId, newRole: role }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update member role');
      }
    } catch (error) {
      console.error('Failed to update member role:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update member role'
      });
      throw error;
    }
  },

  removeMember: async (householdId, userId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/api/household-members?householdId=${householdId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ removeUserId: userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to remove member');
      }
    } catch (error) {
      console.error('Failed to remove member:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to remove member'
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));

export default useHouseholdStore;
