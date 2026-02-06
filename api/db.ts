// Simple in-memory database for Vercel demo
// In a real app, you'd use a hosted database like PlanetScale or Supabase

interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  createdAt: string;
}

// In-memory storage (resets on each deployment)
let users: User[] = [];

export const db = {
  users: {
    create: (user: Omit<User, 'id' | 'createdAt'>) => {
      const newUser: User = {
        ...user,
        id: Math.random().toString(36).substring(2),
        createdAt: new Date().toISOString()
      };
      users.push(newUser);
      return newUser;
    },
    
    findByEmail: (email: string) => {
      return users.find(user => user.email === email);
    },
    
    findById: (id: string) => {
      return users.find(user => user.id === id);
    }
  }
};
