// Simple in-memory database for Vercel demo
// In a real app, you'd use a hosted database like PlanetScale or Supabase

// In-memory storage (resets on each deployment)
let users = [];

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
    }
  }
};
