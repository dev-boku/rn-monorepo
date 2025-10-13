# NoBrainer - Flashcard Learning App

A modern, AI-powered flashcard application built with React Native and Expo.

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Start the development server
pnpm start

# Run on specific platform
pnpm ios        # iOS simulator
pnpm android    # Android emulator
pnpm web        # Web browser
```

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run simple unit tests (recommended for CI)
pnpm test:simple

# Run tests in watch mode
pnpm test:watch

# Generate coverage report
pnpm test:coverage
```

## 📁 Project Structure

```
apps/no-brainer/
├── app/                    # Expo Router screens
│   ├── _layout.tsx        # Root layout
│   ├── index.tsx          # Home screen
│   ├── deck/              # Deck management
│   ├── study/             # Study sessions
│   └── card/              # Card creation
├── src/
│   ├── components/        # UI components
│   │   └── ui/           # Reusable UI elements
│   ├── lib/              # Utilities & core logic
│   │   ├── database.ts   # SQLite database
│   │   ├── srs.ts        # Spaced Repetition System
│   │   ├── id.ts         # ID generation
│   │   └── utils.ts      # Helper functions
│   ├── store/            # Zustand state management
│   │   ├── deck-store.ts
│   │   ├── card-store.ts
│   │   └── review-store.ts
│   └── types/            # TypeScript types
└── assets/               # Static assets
```

## 🛠 Tech Stack

- **Framework**: React Native 0.81.4 + Expo 54
- **Language**: TypeScript 5.9
- **Routing**: Expo Router 6.0 (file-based)
- **Database**: SQLite (expo-sqlite)
- **State Management**: Zustand 5.0
- **Testing**: Jest 29 + jest-expo 54
- **Linting**: ESLint + TypeScript ESLint

## 📚 Key Features

### Phase 0 ✅ (Completed)
- ✅ Project setup with Expo 54 + React Native 0.81.4
- ✅ File-based routing with Expo Router
- ✅ SQLite database with full schema
- ✅ Zustand state management
- ✅ Test environment with Jest
- ✅ UI component library
- ✅ Dark/Light theme support

### Phase 1 🚧 (In Progress)
- 🚧 Deck management (CRUD)
- 🚧 Card creation and editing
- 🚧 Study flow with SRS algorithm
- 🚧 Local notifications
- 🚧 Basic statistics

## 🧠 SRS Algorithm

The app uses a simplified Spaced Repetition System with fixed intervals:

- **Intervals**: 1, 4, 7, 14 days
- **Hard**: Reset to 1 day (step 0)
- **Good**: Advance to next step (1→4→7→14)
- **Easy**: Jump 2 steps (1→7, 4→14)

## 📊 Database Schema

### Tables
- **decks**: Deck metadata
- **cards**: Flashcard content (front/back)
- **review_states**: SRS state per card
- **review_sessions**: Study session statistics

### Relationships
- Decks → Cards (1:many)
- Cards → Review States (1:1)
- Decks → Review Sessions (1:many)

## 🔧 Development Commands

```bash
# Lint code
pnpm lint

# Check Expo configuration
npx expo-doctor

# Clear cache
npx expo start --clear
```

## 📝 Known Issues

- React Native 0.76 has Flow type compatibility issues with jest-expo
  - Workaround: Use `test:simple` script for basic unit tests
- React 19 + react-test-renderer compatibility issues
  - Component rendering tests may need additional configuration

## 📖 Documentation

- [TASKS.md](../../docs/no-brainer/TASKS.md) - Development roadmap
- [PRD.md](../../docs/no-brainer/PRD.md) - Product requirements
- [Expo Docs](https://docs.expo.dev/)

## 🤝 Contributing

This is a monorepo project. See the root [CLAUDE.md](../../CLAUDE.md) for workspace setup instructions.

## 📄 License

Private project - All rights reserved
