# Pantry Pal - Application Sitemap

## Current Application Structure

### Main Navigation Tabs

```
Pantry Pal App
├── 🏠 Dashboard (/)
├── 📝 List (/list)
├── 🛒 Shop (/shop)
└── 📊 Recent (/recent)
```

### Authentication Flow

```
Authentication System
├── 🔐 Login (/login)
├── ✍️ Signup (/signup)
└── 🛡️ Protected Routes (Dashboard, List, Shop, Recent)
```

## Detailed Page Breakdown

### 🏠 Dashboard Page (`/` and `/dashboard`)
**Purpose:** Central hub with household overview and quick actions

**Layout:**
```
Header Section
├── Personal Greeting: "Hello, Sarah! 👋"
├── Subtitle: "Ready to manage your grocery list?"
└── Primary CTA: "Start Shopping" (→ Shop page)

Main Content (2×2 Grid)
├── Row 1:
│   ├── Your Household (Household statistics)
│   └── Smart Suggestions (Top 3 suggestions with add buttons)
└── Row 2:
    ├── Recent Activity (Last 24hrs activity feed)
    └── Who's Online (Household member status)
```

**Key Components:**
- **Household Statistics:** 
  - 7 items on list (teal background)
  - Last shopped: 2 days ago (blue background)
  - 3 new suggestions (yellow background)
  - 12 items bought this week (gray background)
  - Total estimated spend: $87 (purple background)

- **Smart Suggestions (Top 3):**
  - Milk (🥛) - "Usually every 7 days"
  - Coffee (☕) - "Usually every 2 weeks" 
  - Eggs (🥚) - "Running low based on your recipes"

- **Recent Activity Feed:**
  - Jamie added Tomatoes (blue theme)
  - Alex checked off Bread (green theme)
  - Color-coded by action type

**Navigation:** Links to all main sections

### 📝 List Page (`/list`)
**Purpose:** Primary shopping list management with Smart Suggestions

**Layout:**
```
Header Section
├── Page Title: "📝 Shopping List"
└── Search Bar: "Search your list..."

Main Content
├── Smart Suggestions (Conditional - 3-column grid)
│   ├── Shows only unselected suggestions
│   ├── Dynamic removal when items added
│   └── Auto-restore when suggestion items deleted
├── Items List / Empty State
│   ├── Item count header: "X items on your list"
│   ├── Individual items with metadata
│   │   ├── Checkbox (circle icon)
│   │   ├── Item name (large text)
│   │   ├── Added by + timestamp
│   │   └── Delete button (trash icon)
│   └── Search results / No items messaging
└── Inline Add Input (Always present at bottom)
    ├── Circle checkbox placeholder
    └── "+ Add an item..." input field
```

**Smart Suggestions Behavior:**
- **Default:** Shows Milk, Coffee, Eggs with descriptions
- **On Add:** Removes suggestion, shifts remaining items left
- **On Delete:** If deleted item was a suggestion, restores to suggestions
- **When Empty:** Hides entire suggestions section

**States:**
- **Empty State:** Encouraging message with inline add
- **Search No Results:** "No items match your search" 
- **Items Present:** Full list with inline add at bottom

### 🛒 Shop Page (`/shop`)
**Purpose:** Organized shopping experience with categories

**Planned Layout:**
```
Header Section
├── Page Title: "🛒 Shopping Mode"
├── Shopping Status: "Sarah is shopping..." 
└── Progress Indicator

Main Content
├── Categories Section
│   ├── Produce
│   ├── Dairy
│   ├── Meat & Seafood
│   ├── Pantry
│   └── Other
└── Active Shopping Features
    ├── Real-time check-offs
    ├── Store layout optimization
    └── Completion tracking
```

**Current Status:** Placeholder implementation

### 📊 Recent Page (`/recent`)
**Purpose:** Shopping history and analytics

**Planned Layout:**
```
Header Section
├── Page Title: "📊 Recent Activity"
└── Time filter controls

Main Content
├── Shopping History
│   ├── Recent shopping trips
│   ├── Items purchased timeline
│   └── Spending trends
├── Pattern Analysis
│   ├── Most frequently bought items
│   ├── Shopping frequency patterns
│   └── Suggestion accuracy metrics
└── Household Insights
    ├── Member contribution stats
    ├── Shopping efficiency metrics
    └── Cost optimization suggestions
```

**Current Status:** Placeholder implementation

## Authentication & User Management

### 🔐 Login Page (`/login`)
**Purpose:** User authentication entry point

**Layout:**
```
Centered Form
├── Pantry Pal Branding
├── Login Form
│   ├── Email/Username field
│   ├── Password field
│   └── Submit button
├── Forgot Password Link
└── Signup Link ("Don't have an account?")
```

### ✍️ Signup Page (`/signup`)
**Purpose:** New user registration

**Layout:**
```
Multi-step Form
├── Personal Information
│   ├── Name
│   ├── Email
│   └── Password
├── Household Setup
│   ├── Household name
│   ├── Invite roommates/family
│   └── Role selection
└── Welcome & Onboarding
    ├── App overview
    ├── Feature highlights
    └── First list creation
```

**Current Status:** Basic form implemented

## Component Architecture

### Shared Components
- **Navigation:** Tab-based navigation with active state indicators
- **Search:** Consistent search input with live filtering
- **Cards:** Standardized card layout for dashboard sections
- **Buttons:** Primary (blue), secondary (teal), icon buttons
- **Loading States:** Consistent spinner design
- **Empty States:** Encouraging messaging with clear next steps

### Page-Specific Components
- **Smart Suggestions:** Reusable suggestion cards with add functionality
- **Item List:** Grocery item display with actions
- **Inline Add:** Always-present add input with Enter key support
- **Activity Feed:** Timeline-style activity display
- **Statistics Cards:** Colored background info cards

## Data Flow & State Management

### Global State (Zustand)
```
Auth Store
├── user: User object
├── isAuthenticated: boolean
├── login: function
└── logout: function
```

### Local State (React Hooks)
```
List Page State
├── items: GroceryItem[]
├── filteredItems: GroceryItem[]
├── searchTerm: string
├── newItemName: string
├── addedSuggestions: string[]
└── isLoading: boolean

Dashboard State
├── isLoading: boolean
└── dashboardData: mixed
```

### Mock API Endpoints
```
Mock Grocery API
├── getItems(): Promise<GroceryItem[]>
├── addItem(name, userId): Promise<void>
├── deleteItem(itemId): Promise<void>
└── updateItem(itemId, updates): Promise<void>
```

## File Structure

```
src/
├── components/
│   └── ProtectedRoute.tsx
├── lib/
│   ├── api.ts
│   ├── demo.ts
│   └── mockGroceryAPI.ts
├── pages/
│   ├── DashboardPage.tsx ✅ Complete
│   ├── ListPage.tsx ✅ Complete with Smart Suggestions
│   ├── SignupPage.tsx ✅ Basic implementation
│   ├── ShopPage.tsx 🚧 Placeholder
│   └── RecentPage.tsx 🚧 Placeholder
├── stores/
│   └── authStore.ts
├── App.tsx ✅ Navigation & routing
├── main.tsx ✅ App bootstrap
└── index.css ✅ Tailwind styles
```

## URL Structure & Routing

### Public Routes
- `/login` - User authentication
- `/signup` - New user registration

### Protected Routes (Require Authentication)
- `/` - Dashboard (default route)
- `/dashboard` - Dashboard (explicit route)
- `/list` - Shopping list management
- `/shop` - Shopping mode (in development)
- `/recent` - History and analytics (in development)

### Route Protection
- **PublicOnlyRoute:** Redirects authenticated users to dashboard
- **ProtectedRoute:** Redirects unauthenticated users to login

## Responsive Behavior

### Mobile Layout (< 768px)
- **Single column** layout for all pages
- **Full-width** components
- **Touch-optimized** button sizes
- **Simplified** navigation

### Desktop Layout (≥ 768px)
- **Two-column** grid for dashboard
- **Three-column** Smart Suggestions
- **Sidebar** navigation (future)
- **Enhanced** interaction patterns

## Future Sitemap Extensions

### Planned Pages
- **Settings** (`/settings`) - User preferences and household management
- **Profile** (`/profile`) - Personal account settings
- **Household** (`/household`) - Manage household members and permissions
- **Recipes** (`/recipes`) - Meal planning integration
- **Stores** (`/stores`) - Store preferences and layouts

### Integration Points
- **PWA Manifest** - Native app-like experience
- **Push Notifications** - Real-time updates
- **Voice Commands** - Hands-free item addition
- **Grocery APIs** - Direct ordering and delivery

## Technical Notes

### Performance Considerations
- **Code splitting** by page/feature
- **Lazy loading** for non-critical components
- **Image optimization** for future photo features
- **Bundle size monitoring** for mobile performance

### SEO & Accessibility
- **Semantic HTML** structure
- **Proper heading hierarchy** (h1 → h3)
- **ARIA labels** for screen readers
- **Focus management** for keyboard navigation
- **Color contrast** compliance (AA/AAA standards)

### Security
- **Protected routes** with authentication checks
- **Input sanitization** for user-generated content
- **HTTPS enforcement** for production
- **Session management** with secure tokens

---

**Last Updated:** February 8, 2026  
**Application Version:** 1.0  
**Next Sitemap Review:** March 8, 2026
