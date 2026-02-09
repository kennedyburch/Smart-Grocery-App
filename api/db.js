// Simple in-memory database for Vercel demo
// In a real app, you'd use a hosted database like PlanetScale or Supabase

// In-memory storage (resets on each deployment)
let users = [];
let households = [];
let householdMembers = [];
let items = [];
let purchaseHistory = [];

// Generate unique invite codes
const generateInviteCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Initialize Sarah's persona data
function initializeSarahsData() {
  if (users.length === 0) {
    // Create Sarah, Jamie, and Alex - the 3 roommates
    const sarah = {
      id: 'sarah-user-1',
      name: 'Sarah',
      email: 'sarah@pantrypal.com',
      password: 'sarah123',
      createdAt: new Date().toISOString()
    };
    
    const jamie = {
      id: 'jamie-user-2',
      name: 'Jamie',
      email: 'jamie@pantrypal.com', 
      password: 'jamie123',
      createdAt: new Date().toISOString()
    };
    
    const alex = {
      id: 'alex-user-3',
      name: 'Alex',
      email: 'alex@pantrypal.com',
      password: 'alex123',
      createdAt: new Date().toISOString()
    };

    users.push(sarah, jamie, alex);

    // Create their shared apartment household  
    const apartment = {
      id: 'apartment-household-1',
      name: 'PantryPal Apartment',
      description: 'Sarah, Jamie & Alex - Shared grocery list',
      ownerId: 'sarah-user-1',
      inviteCode: 'PPAL01',
      createdAt: new Date().toISOString()
    };
    households.push(apartment);

    // Add all 3 as household members (equal members, no complex permissions)
    const sarahMember = {
      id: 'member-sarah-1',
      userId: 'sarah-user-1',
      householdId: 'apartment-household-1',
      role: 'member',
      joinedAt: new Date().toISOString()
    };
    
    const jamieMember = {
      id: 'member-jamie-2', 
      userId: 'jamie-user-2',
      householdId: 'apartment-household-1',
      role: 'member',
      joinedAt: new Date().toISOString()
    };
    
    const alexMember = {
      id: 'member-alex-3',
      userId: 'alex-user-3', 
      householdId: 'apartment-household-1',
      role: 'member',
      joinedAt: new Date().toISOString()
    };

    householdMembers.push(sarahMember, jamieMember, alexMember);

    // Add some sample items to their list
    const sampleItems = [
      {
        id: 'item-1',
        name: 'Spinach',
        category: 'Produce',
        isChecked: false,
        addedBy: 'sarah-user-1',
        householdId: 'apartment-household-1',
        createdAt: new Date().toISOString()
      },
      {
        id: 'item-2',
        name: 'Tomatoes',
        category: 'Produce', 
        isChecked: false,
        addedBy: 'jamie-user-2',
        householdId: 'apartment-household-1',
        createdAt: new Date().toISOString()
      },
      {
        id: 'item-3',
        name: 'Eggs',
        category: 'Dairy',
        isChecked: false,
        addedBy: 'alex-user-3',
        householdId: 'apartment-household-1', 
        createdAt: new Date().toISOString()
      },
      {
        id: 'item-4',
        name: 'Yogurt',
        category: 'Dairy',
        isChecked: false,
        addedBy: 'sarah-user-1',
        householdId: 'apartment-household-1',
        createdAt: new Date().toISOString()
      }
    ];
    items.push(...sampleItems);

    // Add some purchase history for smart suggestions
    const historyData = [
      { 
        id: 'hist-1',
        itemName: 'Milk',
        householdId: 'apartment-household-1',
        purchasedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
      },
      {
        id: 'hist-2', 
        itemName: 'Milk',
        householdId: 'apartment-household-1',
        purchasedAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString() // 11 days ago
      }
    ];
    purchaseHistory.push(...historyData);
  }
}

// Initialize Sarah's data on module load
initializeSarahsData();

export const db = {
  users: {
    create: (user) => {
      const newUser = {
        ...user,
        id: Math.random().toString(36).substring(2),
        createdAt: new Date().toISOString()
      };
      users.push(newUser);
      return newUser;
    },
    
    findByEmail: (email) => {
      return users.find(user => user.email === email);
    },
    
    findById: (id) => {
      return users.find(user => user.id === id);
    },

    findAll: () => {
      return users;
    }
  },

  items: {
    create: (itemData) => {
      const newItem = {
        ...itemData,
        id: Math.random().toString(36).substring(2),
        createdAt: new Date().toISOString()
      };
      items.push(newItem);
      return newItem;
    },

    findByHouseholdId: (householdId) => {
      return items.filter(item => item.householdId === householdId);
    },

    findById: (id) => {
      return items.find(item => item.id === id);
    },

    update: (id, updates) => {
      const index = items.findIndex(item => item.id === id);
      if (index !== -1) {
        items[index] = { ...items[index], ...updates, updatedAt: new Date().toISOString() };
        return items[index];
      }
      return null;
    },

    delete: (id) => {
      const index = items.findIndex(item => item.id === id);
      if (index !== -1) {
        return items.splice(index, 1)[0];
      }
      return null;
    }
  },

  purchaseHistory: {
    create: (historyData) => {
      const newHistory = {
        ...historyData,
        id: Math.random().toString(36).substring(2),
        purchasedAt: new Date().toISOString()
      };
      purchaseHistory.push(newHistory);
      return newHistory;
    },

    findByHouseholdId: (householdId) => {
      return purchaseHistory.filter(hist => hist.householdId === householdId);
    },

    findByItemName: (itemName, householdId) => {
      return purchaseHistory.filter(hist => 
        hist.itemName.toLowerCase() === itemName.toLowerCase() && 
        hist.householdId === householdId
      );
    },

    getFrequency: (itemName, householdId) => {
      const history = this.findByItemName(itemName, householdId);
      if (history.length < 2) return null;
      
      // Sort by date
      history.sort((a, b) => new Date(b.purchasedAt) - new Date(a.purchasedAt));
      
      // Calculate average days between purchases
      const intervals = [];
      for (let i = 1; i < history.length; i++) {
        const daysDiff = (new Date(history[i-1].purchasedAt) - new Date(history[i].purchasedAt)) / (1000 * 60 * 60 * 24);
        intervals.push(daysDiff);
      }
      
      return intervals.reduce((a, b) => a + b, 0) / intervals.length;
    }
  },

  households: {
    create: (householdData) => {
      const newHousehold = {
        ...householdData,
        id: Math.random().toString(36).substring(2),
        inviteCode: generateInviteCode(),
        createdAt: new Date().toISOString()
      };
      households.push(newHousehold);
      return newHousehold;
    },

    findById: (id) => {
      return households.find(household => household.id === id);
    },

    findByInviteCode: (inviteCode) => {
      return households.find(household => household.inviteCode === inviteCode);
    },

    update: (id, updates) => {
      const index = households.findIndex(household => household.id === id);
      if (index !== -1) {
        households[index] = { ...households[index], ...updates, updatedAt: new Date().toISOString() };
        return households[index];
      }
      return null;
    },

    delete: (id) => {
      const index = households.findIndex(household => household.id === id);
      if (index !== -1) {
        const deleted = households[index];
        households.splice(index, 1);
        // Clean up household members
        householdMembers = householdMembers.filter(member => member.householdId !== id);
        return deleted;
      }
      return null;
    }
  },

  householdMembers: {
    create: (memberData) => {
      const newMember = {
        ...memberData,
        id: Math.random().toString(36).substring(2),
        joinedAt: new Date().toISOString()
      };
      householdMembers.push(newMember);
      return newMember;
    },

    findByHouseholdId: (householdId) => {
      return householdMembers.filter(member => member.householdId === householdId);
    },

    findByUserId: (userId) => {
      return householdMembers.filter(member => member.userId === userId);
    },

    findByUserAndHousehold: (userId, householdId) => {
      return householdMembers.find(member => 
        member.userId === userId && member.householdId === householdId
      );
    },

    updateRole: (userId, householdId, role) => {
      const member = householdMembers.find(member => 
        member.userId === userId && member.householdId === householdId
      );
      if (member) {
        member.role = role;
        member.updatedAt = new Date().toISOString();
        return member;
      }
      return null;
    },

    remove: (userId, householdId) => {
      const index = householdMembers.findIndex(member => 
        member.userId === userId && member.householdId === householdId
      );
      if (index !== -1) {
        const removed = householdMembers[index];
        householdMembers.splice(index, 1);
        return removed;
      }
      return null;
    },

    // Get households with member details for a user
    getUserHouseholdsWithDetails: (userId) => {
      const userMemberships = householdMembers.filter(member => member.userId === userId);
      return userMemberships.map(membership => {
        const household = households.find(h => h.id === membership.householdId);
        const members = householdMembers.filter(m => m.householdId === membership.householdId);
        const memberUsers = members.map(member => {
          const user = users.find(u => u.id === member.userId);
          return {
            ...member,
            user: user ? { id: user.id, email: user.email, name: user.name } : null
          };
        });
        
        return {
          ...household,
          userRole: membership.role,
          memberCount: members.length,
          members: memberUsers
        };
      });
    }
  }
};
