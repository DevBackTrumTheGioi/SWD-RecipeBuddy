# RecipeBuddy Architecture

## Directory Structure
```text
src/
├── api/              # Supabase client, queries, mutations
├── assets/           # Static images, global fonts
├── components/       # Standard components
│   ├── ui/           # Atomic components (Button, Input, Card)
│   ├── recipes/      # Recipe-specific components
│   └── common/       # Navbar, Footer, Layout
├── hooks/            # Custom React hooks (useAuth, useRecipes)
├── lib/              # Third-party configurations (supabase.js)
├── pages/            # Page components (Home, RecipeDetail, Profile)
├── store/            # State management (Zustand/Context)
├── types/            # TypeScript definitions (if applicable)
└── utils/            # Helper functions (formatting, validation)
```

## Layer Analysis
| Layer | Responsibility | Technology |
| :--- | :--- | :--- |
| **Presentation** | UI Rendering & Mobile-First UX | React, Tailwind v4 |
| **Logic** | State & Interaction | Hooks, Context API |
| **Data Access** | CRUD & Real-time | Supabase JS Client |
| **Security** | Auth & Permissions | Supabase Auth, RLS |

## Key Patterns
- **Container/Presenter**: Separate data fetching from UI rendering.
- **Atomic Design**: Structure components from atoms to organisms.
- **Service Layer**: Centralized Supabase interactions for maintainability.
