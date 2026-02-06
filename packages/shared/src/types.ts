// Database Models
export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Household {
  id: string;
  name: string;
  inviteCode: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface HouseholdMember {
  id: string;
  userId: string;
  householdId: string;
  role: Role;
  joinedAt: Date;
}

export interface Item {
  id: string;
  name: string;
  quantity?: string;
  category: Category;
  isChecked: boolean;
  checkedAt?: Date;
  checkedBy?: string;
  notes?: string;
  householdId: string;
  addedById: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Suggestion {
  id: string;
  itemName: string;
  category: Category;
  confidence: number; // 0.0 to 1.0
  reason: string;
  householdId: string;
  createdAt: Date;
  acceptedAt?: Date;
  rejectedAt?: Date;
}

export interface PurchaseHistory {
  id: string;
  itemName: string;
  category: Category;
  purchasedAt: Date;
  purchasedBy: string;
  householdId: string;
}

// Enums
export enum Role {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
  VIEWER = 'VIEWER'
}

export enum Category {
  PRODUCE = 'PRODUCE',
  DAIRY = 'DAIRY',
  MEAT = 'MEAT',
  BAKERY = 'BAKERY',
  PANTRY = 'PANTRY',
  FROZEN = 'FROZEN',
  BEVERAGES = 'BEVERAGES',
  SNACKS = 'SNACKS',
  HOUSEHOLD = 'HOUSEHOLD',
  PERSONAL_CARE = 'PERSONAL_CARE',
  BABY = 'BABY',
  PET = 'PET',
  OTHER = 'OTHER',
  UNCATEGORIZED = 'UNCATEGORIZED'
}

// API Types
export interface ApiResponse<T = any> {
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
    };
  };
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// WebSocket Events
export interface RealtimeOperation {
  id: string;
  type: 'item:add' | 'item:update' | 'item:delete' | 'item:check' | 'item:uncheck';
  payload: any;
  timestamp: number;
  householdId: string;
  userId: string;
}

export interface ClientEvents {
  'item:add': (data: { name: string; quantity?: string; category?: Category }) => void;
  'item:update': (data: { itemId: string; updates: Partial<Item> }) => void;
  'item:delete': (data: { itemId: string }) => void;
  'item:check': (data: { itemId: string }) => void;
  'item:uncheck': (data: { itemId: string }) => void;
  'shopping:start': () => void;
  'shopping:end': () => void;
  'presence:heartbeat': () => void;
}

export interface ServerEvents {
  'item:added': (item: Item) => void;
  'item:updated': (item: Item) => void;
  'item:deleted': (itemId: string) => void;
  'item:checked': (itemId: string, checkedBy: string) => void;
  'item:unchecked': (itemId: string) => void;
  'suggestion:new': (suggestion: Suggestion) => void;
  'shopping:started': (userId: string, userName: string) => void;
  'shopping:ended': (userId: string) => void;
  'presence:update': (users: { id: string; name: string }[]) => void;
  'error': (error: { code: string; message: string }) => void;
}

// Request/Response Types
export interface CreateUserRequest {
  email: string;
  password: string;
  name?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreateHouseholdRequest {
  name: string;
}

export interface JoinHouseholdRequest {
  inviteCode: string;
}

export interface CreateItemRequest {
  name: string;
  quantity?: string;
  category?: Category;
  notes?: string;
}

export interface UpdateItemRequest {
  name?: string;
  quantity?: string;
  category?: Category;
  notes?: string;
}
