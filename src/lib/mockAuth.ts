// Mock authentication for demo purposes
// This simulates a backend API response without needing a real server

interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// Mock user data matching our PantryPal personas
const mockUsers: User[] = [
  {
    id: 'sarah-001',
    email: 'sarah@pantrypal.com',
    name: 'Sarah',
    createdAt: '2024-01-15T08:00:00Z'
  },
  {
    id: 'jamie-002', 
    email: 'jamie@pantrypal.com',
    name: 'Jamie',
    createdAt: '2024-01-15T08:00:00Z'
  },
  {
    id: 'alex-003',
    email: 'alex@pantrypal.com', 
    name: 'Alex',
    createdAt: '2024-01-15T08:00:00Z'
  }
];

// Mock login function that simulates API delay
export const mockLogin = async (email: string, password: string): Promise<LoginResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Find user
  const user = mockUsers.find(u => u.email === email);
  
  if (!user) {
    throw new Error('User not found');
  }
  
  // Simple password validation (for demo - obviously not secure)
  const expectedPassword = user.name.toLowerCase() + '123';
  if (password !== expectedPassword) {
    throw new Error('Invalid password');
  }
  
  return {
    user,
    accessToken: `demo-token-${user.id}-${Date.now()}`,
    refreshToken: `demo-refresh-${user.id}-${Date.now()}`
  };
};

// Mock register function
export const mockRegister = async (name: string, email: string, password: string): Promise<LoginResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Check if user already exists
  if (mockUsers.find(u => u.email === email)) {
    throw new Error('User already exists');
  }
  
  // Basic password validation (for demo purposes)
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }
  
  // Create new user
  const newUser: User = {
    id: `user-${Date.now()}`,
    email,
    name,
    createdAt: new Date().toISOString()
  };
  
  // In a real app, this would be saved to a database
  mockUsers.push(newUser);
  
  return {
    user: newUser,
    accessToken: `demo-token-${newUser.id}-${Date.now()}`,
    refreshToken: `demo-refresh-${newUser.id}-${Date.now()}`
  };
};
