# Pantry Pal Design System

## Brand Identity

### Brand Name
**Pantry Pal** - Your Smart Grocery Companion

### Logo & Visual Identity
- **Primary Logo:** "P" in circular badge (evolved from "S" to represent Pantry)
- **Color Palette:** Teal-focused with supporting colors for clarity and warmth
- **Personality:** Friendly, intelligent, efficient, and family-oriented

## Color System

### Primary Colors
```css
/* Teal Family - Primary Brand */
--teal-50: #f0fdfa    /* Light backgrounds, success states */
--teal-100: #ccfbf1   /* Subtle highlights */
--teal-500: #14b8a6   /* Primary actions, icons */
--teal-600: #0d9488   /* Hover states */

/* Blue Family - Secondary Actions */
--blue-50: #eff6ff    /* Information backgrounds */
--blue-500: #3b82f6   /* "Start Shopping" CTA */
--blue-600: #2563eb   /* Blue hover states */
```

### Supporting Colors
```css
/* Grays - Interface Foundation */
--gray-50: #f9fafb    /* Page backgrounds */
--gray-100: #f3f4f6   /* Card borders, dividers */
--gray-400: #9ca3af   /* Icons, placeholder text */
--gray-600: #4b5563   /* Secondary text */
--gray-900: #111827   /* Primary text */

/* Status Colors */
--green-500: #10b981  /* Success, completed items */
--yellow-50: #fffbeb  /* Warning backgrounds */
--yellow-500: #f59e0b /* Suggestions, alerts */
--red-600: #dc2626    /* Delete actions, errors */
--purple-100: #f3e8ff /* Statistics, spending */
--purple-500: #8b5cf6 /* Cost indicators */
```

## Typography

### Font Family
```css
/* Primary: System Font Stack */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
```

### Type Scale
```css
/* Headings */
--text-3xl: 1.875rem;  /* 30px - Page titles */
--text-2xl: 1.5rem;    /* 24px - Section headers */
--text-xl: 1.25rem;    /* 20px - Card titles */
--text-lg: 1.125rem;   /* 18px - List headers, primary text */

/* Body Text */
--text-base: 1rem;     /* 16px - Standard body text */
--text-sm: 0.875rem;   /* 14px - Secondary text, metadata */
--text-xs: 0.75rem;    /* 12px - Labels, timestamps */
```

### Font Weights
```css
--font-bold: 700;      /* Page titles, CTAs */
--font-semibold: 600;  /* Section headers, important text */
--font-medium: 500;    /* List items, buttons */
--font-normal: 400;    /* Body text, descriptions */
```

## Layout System

### Container Widths
```css
--max-width-7xl: 80rem;  /* 1280px - Main content container */
```

### Spacing Scale (Tailwind-based)
```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
```

### Grid System
- **Mobile:** Single column (grid-cols-1)
- **Desktop:** Two columns (md:grid-cols-2) for dashboard
- **Smart Suggestions:** Three columns (md:grid-cols-3)

## Component Patterns

### Cards
```css
/* Standard Card */
.card {
  background: white;
  border-radius: 0.5rem;    /* 8px */
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  border: 1px solid #f3f4f6; /* gray-100 */
  padding: 1.5rem;          /* 24px */
}
```

### Buttons

#### Primary Button (CTAs)
```css
.btn-primary {
  background: #3b82f6;     /* blue-500 */
  color: white;
  padding: 0.75rem 1.5rem; /* py-3 px-6 */
  border-radius: 0.5rem;
  font-weight: 500;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background: #2563eb;     /* blue-600 */
}
```

#### Secondary Button (Add to List)
```css
.btn-secondary {
  background: #14b8a6;     /* teal-500 */
  color: white;
  padding: 0.25rem 0.5rem; /* py-1 px-2 */
  border-radius: 0.25rem;
  font-size: 0.75rem;      /* text-xs */
  transition: background-color 0.2s;
}

.btn-secondary:hover {
  background: #0d9488;     /* teal-600 */
}
```

#### Icon Button (Actions)
```css
.btn-icon {
  padding: 0.5rem;         /* p-2 */
  background: transparent;
  border-radius: 0.25rem;
  transition: background-color 0.2s;
}

.btn-icon:hover {
  background: #f3f4f6;     /* gray-100 */
}
```

### Input Fields
```css
.input-field {
  width: 100%;
  padding: 0.75rem;        /* py-3 */
  border: 1px solid #d1d5db; /* gray-300 */
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.input-field:focus {
  outline: none;
  border-color: #14b8a6;   /* teal-500 */
  box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.1);
}
```

## Iconography

### Icon Library
**Lucide React** - Consistent, minimal icons

### Common Icons & Usage
```javascript
// Navigation & Actions
ShoppingCart  // Shopping mode, cart status
Plus         // Add item actions  
Search       // Search functionality
Trash2       // Delete actions

// Status & Information  
TrendingUp   // Smart suggestions
Clock        // Recent activity, timing
Users        // Household management
Check        // Completed items

// Visual Enhancement
📝 // Lists (emoji for personality)
🥛 // Milk suggestions
☕ // Coffee suggestions  
🥚 // Egg suggestions
👋 // Friendly greetings
```

## Page Layout Patterns

### Dashboard Layout
```
Header (Greeting + CTA)
├── Grid Row 1: Household Stats | Smart Suggestions
└── Grid Row 2: Recent Activity | Who's Online
```

### List Page Layout
```
Header (Title + Search)
├── Smart Suggestions (Conditional)
├── Empty State OR Items List
└── Inline Add (Always Present)
```

## Interaction Patterns

### Smart Suggestions Behavior
1. **Default State:** Show up to 3 suggestions in grid
2. **On Add:** Remove suggestion immediately, shift remaining left
3. **On Delete:** If deleted item was a suggestion, restore to suggestions
4. **Empty State:** Hide suggestions section completely

### List Management
1. **Inline Add:** Always-present input at bottom of list
2. **Item Actions:** Hover reveals delete button
3. **Real-time Updates:** Immediate UI feedback on all actions

### Search & Filtering
1. **Live Search:** Filter as user types
2. **No Results State:** Clear messaging with search reset
3. **Search Scope:** Only active (non-completed) items

## Responsive Behavior

### Breakpoints
- **Mobile:** < 768px (md breakpoint)
- **Desktop:** ≥ 768px

### Layout Adaptations
- **Mobile:** Single column, stacked layout
- **Desktop:** Two-column grid, sidebar navigation
- **Smart Suggestions:** 1 column mobile → 3 columns desktop

## Animation & Transitions

### Standard Transitions
```css
transition: all 0.2s ease-in-out;
```

### Hover States
- **Buttons:** Background color change
- **Cards:** Subtle background shift to gray-50
- **Icons:** Color change (gray-400 → specific color)

### Loading States
```css
/* Spinner */
.loading-spinner {
  animation: spin 1s linear infinite;
  border: 2px solid #f3f4f6;
  border-top: 2px solid #14b8a6;
  border-radius: 50%;
}
```

## Accessibility

### Color Contrast
- **Primary text (gray-900) on white:** AAA compliant
- **Secondary text (gray-600) on white:** AA compliant  
- **Button text on colored backgrounds:** AAA compliant

### Focus Management
- **Focus rings:** Teal-500 with opacity
- **Keyboard navigation:** Tab order follows visual hierarchy
- **Screen readers:** Semantic HTML structure

### Interactive Elements
- **Touch targets:** Minimum 44px for mobile
- **Button labels:** Clear, action-oriented text
- **Form labels:** Associated with inputs properly

## Content Guidelines

### Voice & Tone
- **Friendly:** "Hello, Sarah! 👋"
- **Helpful:** "Smart Suggestions" not "AI Recommendations"
- **Clear:** "7 items on your list" not "You have 7 items"
- **Encouraging:** "Ready to manage your grocery list?"

### Error Messages
- **Constructive:** Explain what happened and how to fix it
- **Friendly:** Avoid technical jargon
- **Actionable:** Provide clear next steps

### Microcopy
- **Empty states:** Encouraging and helpful
- **Loading states:** Informative but brief
- **Success messages:** Confirming but not overwhelming

## Technical Implementation

### CSS Framework
**Tailwind CSS** - Utility-first approach for rapid development

### State Management
- **React Hooks:** useState, useEffect for local state
- **Zustand:** Global auth state management
- **Context Pattern:** For shared component state

### API Pattern
**Mock API Layer** - Simulates real backend with consistent interfaces

This design system ensures consistency across all Pantry Pal interfaces while maintaining the friendly, efficient user experience that Sarah and her roommates need.

---

*Last updated: February 8, 2026*
