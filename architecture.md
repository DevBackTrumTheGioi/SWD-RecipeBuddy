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

