# TanStack Router - Folder Structure Guide

This project demonstrates how to organize complex features with file-based routing in TanStack Router.

## Project Structure

```
src/
├── routes/                          # File-based routing (only .tsx route files)
│   ├── __root.tsx                  # Root layout (wraps all routes)
│   ├── index.tsx                   # Home page (/)
│   ├── about.tsx                   # About page (/about)
│   ├── dashboard.tsx               # Dashboard page (/dashboard)
│   └── dashboard/                  # Nested dashboard routes
│       ├── settings.tsx            # Settings page (/dashboard/settings)
│       └── analytics.tsx           # Analytics page (/dashboard/analytics)
│
├── features/                        # Feature-based organization
│   └── dashboard/                  # Dashboard feature
│       ├── components/             # React components
│       │   ├── DashboardHeader.tsx
│       │   └── StatsCard.tsx
│       ├── hooks/                  # Custom hooks
│       │   └── useDashboardData.ts
│       ├── types/                  # TypeScript types
│       │   └── dashboard.types.ts
│       └── utils/                  # Utility functions
│           └── formatters.ts
│
└── routeTree.gen.ts                # Auto-generated route tree (don't edit)
```

## Key Concepts

### 1. Routes Folder (`src/routes/`)
- **Only contains route files** (`.tsx` files that define pages)
- File names map directly to URLs:
  - `index.tsx` → `/`
  - `about.tsx` → `/about`
  - `dashboard.tsx` → `/dashboard`
  - `dashboard/settings.tsx` → `/dashboard/settings`

### 2. Features Folder (`src/features/`)
- **Contains all non-route code** (components, hooks, utils, types)
- Organized by feature/domain
- Prevents TanStack Router warnings about non-route files

### 3. Route File Structure

Each route file should:
```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/your-route')({
  component: YourComponent,
})

function YourComponent() {
  // Your component code
}
```

## Example Routes

### Home Page
- **File**: `src/routes/index.tsx`
- **URL**: `/`
- **Description**: Landing page with "Launching Soon" message

### Dashboard
- **File**: `src/routes/dashboard.tsx`
- **URL**: `/dashboard`
- **Features**: Stats cards, data loading, header navigation

### Dashboard Settings
- **File**: `src/routes/dashboard/settings.tsx`
- **URL**: `/dashboard/settings`
- **Features**: Account settings form, preferences toggles

### Dashboard Analytics
- **File**: `src/routes/dashboard/analytics.tsx`
- **URL**: `/dashboard/analytics`
- **Features**: Analytics metrics, traffic sources visualization

## Best Practices

### ✅ DO:
- Put route files in `src/routes/`
- Put components, hooks, utils in `src/features/`
- Use feature-based organization for complex functionality
- Import shared code from features folder

### ❌ DON'T:
- Don't put non-route files (components, hooks, utils) in `src/routes/`
- Don't manually edit `routeTree.gen.ts`
- Don't use deeply nested folder structures unnecessarily

## Adding a New Feature

1. Create the route file:
   ```
   src/routes/my-feature.tsx
   ```

2. Create the feature folder:
   ```
   src/features/my-feature/
   ├── components/
   ├── hooks/
   ├── types/
   └── utils/
   ```

3. Import from features in your route:
   ```tsx
   import { MyComponent } from '../features/my-feature/components/MyComponent'
   ```

## Testing

Run the development server:
```bash
npm run dev
```

Build the project:
```bash
npm run build
```

Visit the routes:
- http://localhost:5173/ (Home)
- http://localhost:5173/dashboard (Dashboard)
- http://localhost:5173/dashboard/settings (Settings)
- http://localhost:5173/dashboard/analytics (Analytics)
