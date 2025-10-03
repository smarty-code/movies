# Contributing to Movies App

First off, thank you for considering contributing to Movies App! It's people like you that make this project better.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Process](#development-process)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if possible**
- **Include your environment details** (OS, device, React Native version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Explain why this enhancement would be useful**
- **List any similar features in other apps**

### Pull Requests

- Fill in the required template
- Follow the coding standards
- Include appropriate test coverage
- Update documentation as needed
- End all files with a newline

## Development Process

### Setting Up Development Environment

1. **Fork the repository**
   ```bash
   git clone https://github.com/your-username/movies-app.git
   cd movies-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

4. **Start development server**
   ```bash
   npm start
   ```

### Project Structure

```
movies/
├── app/              # Screens (Expo Router)
├── components/       # Reusable components
├── services/         # API and business logic
├── constants/        # Constants and configurations
├── interfaces/       # TypeScript interfaces
└── assets/          # Images, fonts, icons
```

## Coding Standards

### TypeScript

- **Use TypeScript** for all new files
- **Define interfaces** for all data structures
- **Use strict mode** (already enabled)
- **Avoid `any` type** - use proper types

```typescript
// ✅ Good
interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
}

const movie: Movie = {...};

// ❌ Bad
const movie: any = {...};
```

### React Native / React

- **Use functional components** with hooks
- **Use meaningful component names**
- **Keep components small and focused**
- **Extract reusable logic into custom hooks**

```typescript
// ✅ Good
const MovieCard = ({ movie, onPress }: MovieCardProps) => {
  return <TouchableOpacity onPress={onPress}>...</TouchableOpacity>;
};

// ❌ Bad
export default function Component1(props: any) {
  // 500 lines of code
}
```

### Styling (NativeWind)

- **Use NativeWind classes** for styling
- **Follow Tailwind conventions**
- **Use custom colors** from the design system
- **Keep styles consistent**

```typescript
// ✅ Good
<View className="flex-1 bg-primary px-4">
  <Text className="text-xl font-bold text-white">Title</Text>
</View>

// ❌ Bad
<View style={{ flex: 1, backgroundColor: '#000', paddingHorizontal: 16 }}>
  <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#FFF' }}>Title</Text>
</View>
```

### File Naming

- **Components:** PascalCase (`MovieCard.tsx`)
- **Services:** camelCase (`api.ts`, `cacheService.ts`)
- **Hooks:** camelCase with `use` prefix (`useFetch.ts`)
- **Interfaces:** PascalCase (`interfaces.d.ts`)

### Code Organization

```typescript
// Import order:
// 1. React / React Native
import { View, Text } from 'react-native';
import { useState, useEffect } from 'react';

// 2. Third-party libraries
import { Stack } from 'expo-router';

// 3. Local imports (components)
import { MovieCard } from '@/components/MovieCard';

// 4. Local imports (services)
import { fetchMovies } from '@/services/api';

// 5. Types
import type { Movie } from '@/interfaces/interfaces';
```

## Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat:** New feature
- **fix:** Bug fix
- **docs:** Documentation changes
- **style:** Code style changes (formatting, etc.)
- **refactor:** Code refactoring
- **perf:** Performance improvements
- **test:** Adding or updating tests
- **chore:** Maintenance tasks

### Examples

```bash
feat(search): add real-time search functionality

Implemented debounced search with 300ms delay
Added loading states and error handling
Updated search UI with new design

Closes #123

---

fix(cache): resolve cache invalidation issue

Fixed bug where trending cache wasn't clearing
after view count updates

Fixes #456

---

docs(readme): update installation instructions

Added prerequisites section
Updated environment variable setup
Added troubleshooting guide
```

## Pull Request Process

1. **Update the README.md** with details of changes if needed
2. **Update documentation** in the `/DOCS` folder if applicable
3. **Follow the PR template**
4. **Ensure all checks pass**
   - Linting: `npm run lint`
   - Type checking: `npx tsc --noEmit`
   - Format: `npm run format`
5. **Request review** from maintainers
6. **Address review comments** promptly
7. **Squash commits** if requested

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested on iOS
- [ ] Tested on Android
- [ ] Tested on Web

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed code
- [ ] Commented complex code
- [ ] Updated documentation
- [ ] No new warnings
- [ ] Added tests (if applicable)
```

## Style Guide

### Code Formatting

We use Prettier with the following configuration:

```json
{
  "printWidth": 100,
  "tabWidth": 2,
  "singleQuote": true,
  "trailingComma": "es5",
  "bracketSameLine": true
}
```

**Format code before committing:**
```bash
npm run format
```

### ESLint

We use ESLint with Expo config:

```bash
npm run lint
```

Fix auto-fixable issues:
```bash
npm run format  # Runs ESLint fix + Prettier
```

## Testing

### Manual Testing

Before submitting a PR, please test:

1. **Functionality**
   - Does it work as expected?
   - Are edge cases handled?

2. **UI/UX**
   - Does it match the design?
   - Is it responsive?
   - Are animations smooth?

3. **Performance**
   - Are there any performance issues?
   - Is caching working correctly?

4. **Compatibility**
   - Test on iOS (if possible)
   - Test on Android
   - Test on different screen sizes

### Future: Automated Testing

We plan to add:
- Unit tests (Jest)
- Component tests (React Native Testing Library)
- E2E tests (Detox)

## Documentation

When adding new features, please update:

1. **README.md** - For user-facing changes
2. **DOCS/** - For technical documentation
3. **Code comments** - For complex logic
4. **Type definitions** - Keep TypeScript interfaces updated

## Questions?

Feel free to:
- Open an issue for discussion
- Ask in pull request comments
- Contact maintainers directly

## Recognition

Contributors will be added to the README.md file! 🎉

---

**Thank you for contributing! 🚀**
