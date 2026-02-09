# Pantry Pal Design System

## Color System

### Recent Activity Section

The Recent Activity section uses a consistent color system to indicate different types of actions:

#### **Blue Color Scheme** - Item Added
- **Usage**: When any user adds an item to the list
- **Colors**: 
  - Border: `border-blue-500` 
  - Background: `bg-blue-50`
  - Icon color: `text-blue-600`
- **Icon**: Plus icon (`<Plus />`)
- **Examples**: 
  - "Jamie added Tomatoes"
  - "You added Spinach"

#### **Green Color Scheme** - Item Checked Off  
- **Usage**: When any user checks off/completes an item from the list
- **Colors**:
  - Border: `border-green-500`
  - Background: `bg-green-50` 
  - Icon color: `text-green-600`
- **Icon**: Check icon (`<Check />`)
- **Examples**:
  - "Alex checked off Bread"

### Household Statistics Section

The Your Household section uses various background colors to categorize different types of information:

#### **Colored Backgrounds** - Category-Specific Information
- **Teal** (`bg-teal-50`): Shopping list status
- **Blue** (`bg-blue-50`): Timeline/date information  
- **Yellow** (`bg-yellow-50`): Suggestions/recommendations
- **Purple** (`bg-purple-50`): Financial information

#### **Neutral Background** - General Statistics
- **Soft Light Grey** (`bg-gray-100`): General achievement/completion statistics
- **Usage**: For statistics that don't fit into specific categories but need subtle visual distinction
- **Note**: Slightly darker than Smart Suggestions boxes (`bg-gray-50`) for hierarchy

### Background Color Hierarchy
1. **White** (`bg-white`): Card backgrounds, primary content areas
2. **Very Light Grey** (`bg-gray-50`): Smart Suggestions, subtle content areas  
3. **Soft Light Grey** (`bg-gray-100`): Neutral statistics, secondary information
4. **Colored Light Tints** (`bg-{color}-50`): Category-specific information

### Design Principles

1. **Consistency**: All "add" actions use blue, all "complete" actions use green
2. **Visual Hierarchy**: The colored left border provides quick visual scanning
3. **Accessibility**: Color combinations maintain proper contrast ratios
4. **Semantic Meaning**: 
   - Blue = Addition/New content
   - Green = Completion/Success

### Implementation Notes

- Use Tailwind CSS utility classes for consistency
- Border is always 4px width (`border-l-4`)
- Background uses the lightest shade (50) of the color
- Icon uses the medium shade (500-600) of the color
- Text content remains neutral gray for readability

---

*Last updated: February 8, 2026*
