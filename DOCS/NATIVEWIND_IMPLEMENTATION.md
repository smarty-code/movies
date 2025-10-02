# 🎬 Movies App - NativeWind Implementation Documentation

## 📖 Overview

This document provides comprehensive documentation for the NativeWind v4.1.21 implementation in the Movies application built with Expo Router v6 and React Native 0.79.5.

## 🏗️ Project Architecture

```
movies/
├── 📁 app/                    # Expo Router pages
│   ├── _layout.tsx           # Root layout with CSS import
│   ├── index.tsx             # Home screen
│   ├── (tabs)/               # Tab navigation group
│   │   ├── _layout.tsx       # Tab layout
│   │   ├── index.tsx         # Tab home
│   │   ├── profile.tsx       # Profile tab
│   │   ├── save.tsx          # Saved movies tab
│   │   └── search.tsx        # Search tab
│   └── movie/
│       └── [id].tsx          # Dynamic movie detail page
├── 📁 components/            # Reusable components
│   ├── Container.tsx         # NativeWind styled container
│   ├── EditScreenInfo.tsx    # Info component
│   └── ScreenContent.tsx     # Screen content wrapper
├── 📁 assets/                # Static assets
├── 🎨 global.css             # Tailwind CSS imports
├── ⚙️ tailwind.config.js     # Tailwind configuration
├── ⚙️ babel.config.js        # Babel configuration
├── ⚙️ metro.config.js        # Metro bundler configuration
└── 📄 nativewind-env.d.ts    # TypeScript definitions
```

## 🔧 Configuration Files

### 1. Package Dependencies

```json
{
  "dependencies": {
    "babel-preset-expo": "^14.0.0",
    "expo": "^54.0.12",
    "expo-constants": "~18.0.9",
    "expo-linking": "~8.0.8", 
    "expo-router": "~6.0.10",
    "expo-status-bar": "~3.0.8",
    "nativewind": "4.1.21",           // ✨ Core NativeWind package
    "react": "19.0.0",
    "react-native": "0.79.5",
    "react-native-reanimated": "~3.17.4",
    "react-native-safe-area-context": "~5.6.0",
    "react-native-screens": "~4.16.0"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0",
    "@types/react": "~19.0.10",
    "eslint": "^9.25.1",
    "eslint-config-expo": "~9.2.0",
    "eslint-config-prettier": "^10.1.2",
    "prettier": "^3.2.5",
    "prettier-plugin-tailwindcss": "^0.5.11",  // ✨ Tailwind class sorting
    "tailwindcss": "^3.4.0",                   // ✨ Core Tailwind package
    "typescript": "~5.8.3"
  }
}
```

### 2. Tailwind Configuration (`tailwind.config.js`)

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  // 🎯 Content paths - Critical for class detection
  content: [
    './App.{js,ts,tsx}',           // Root App component
    './components/**/*.{js,ts,tsx}' // All component files
  ],

  // 🚀 NativeWind v4 preset - Required for React Native compatibility
  presets: [require('nativewind/preset')],
  
  // 🎨 Custom theme configuration
  theme: {
    extend: {
      colors: {
        // Primary brand colors
        primary: "#030014",    // Deep dark blue
        secondary: "#151312",  // Dark brown
        
        // Light theme variations
        light: {
          100: "#D6C7FF",     // Light purple
          200: "#A8B5DB",     // Light blue-gray
          300: "#9CA4AB",     // Medium gray
        },
        
        // Dark theme variations
        dark: {
          100: "#221F3D",     // Dark purple
          200: "#0F0D23",     // Very dark blue
        },
        
        // Accent color
        accent: "#AB8BFF",    // Purple accent
      },
    },
  },
  plugins: [],
};
```

### 3. Babel Configuration (`babel.config.js`)

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      // 🔥 Critical: jsxImportSource for NativeWind v4
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",  // NativeWind Babel preset
    ],
  };
};
```

**Key Points:**
- `jsxImportSource: "nativewind"` - Essential for v4 compatibility
- Order matters: Expo preset first, then NativeWind preset

### 4. Metro Configuration (`metro.config.js`)

```javascript
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// 🎨 NativeWind Metro integration with CSS input
module.exports = withNativeWind(config, { input: './global.css' });
```

**Key Points:**
- `withNativeWind()` wrapper enables CSS processing
- `input: './global.css'` specifies the main CSS file

### 5. Global CSS (`global.css`)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**Purpose:**
- Imports all Tailwind CSS layers
- Processed by Metro bundler
- Must be imported in root layout

### 6. TypeScript Definitions (`nativewind-env.d.ts`)

```typescript
/// <reference types="nativewind/types" />
```

**Purpose:**
- Provides TypeScript support for className props
- Enables IntelliSense for Tailwind classes

### 7. TypeScript Configuration (`tsconfig.json`)

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]  // Path mapping (optional)
    }
  }
}
```

### 8. Prettier Configuration (`prettier.config.js`)

```javascript
module.exports = {
  printWidth: 100,
  tabWidth: 2,
  singleQuote: true,
  bracketSameLine: true,
  trailingComma: 'es5',

  // 🎨 Tailwind CSS class sorting
  plugins: [require.resolve('prettier-plugin-tailwindcss')],
  tailwindAttributes: ['className'],
};
```

## 📱 Implementation Examples

### 1. Root Layout with CSS Import (`app/_layout.tsx`)

```tsx
import { Stack } from 'expo-router';
import './../global.css';  // 🔥 Critical: Import CSS in root layout
import { StatusBar, Text, View } from 'react-native';

export default function RootLayout() {
  return (
   <>
      <StatusBar hidden={true} />
      <Stack>
        <Stack.Screen
          name="index"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="movie/[id]"
          options={{ headerShown: false }}
        />
      </Stack>
    </>
  );
}
```

**Key Implementation Details:**
- CSS import must be in the root layout
- Import path: `'./../global.css'` (relative to app folder)
- StatusBar configuration for full-screen experience

### 2. Basic Screen with NativeWind (`app/index.tsx`)

```tsx
import { View, Text, StyleSheet } from 'react-native';
import './../global.css';  // Secondary import (good practice)

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text className="text-blue-700 text-5xl font-bold">Home</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

**Implementation Notes:**
- Mixing StyleSheet and className is supported
- className takes precedence over StyleSheet for same properties
- Text styling works with Tailwind classes

### 3. Reusable Container Component (`components/Container.tsx`)

```tsx
import { SafeAreaView } from 'react-native';

export const Container = ({ children }: { children: React.ReactNode }) => {
  return <SafeAreaView className={styles.container}>{children}</SafeAreaView>;
};

const styles = {
  container: 'flex flex-1 m-6',  // 🎨 Tailwind classes as string
};
```

**Design Patterns:**
- Using object for class organization
- SafeAreaView with NativeWind classes
- Flexible margin and flex properties

## 🎨 Styling Patterns

### 1. Color Usage Examples

```tsx
// Using custom theme colors
<View className="bg-primary">           {/* #030014 */}
<View className="bg-secondary">         {/* #151312 */}
<View className="bg-light-100">         {/* #D6C7FF */}
<View className="bg-dark-200">          {/* #0F0D23 */}
<View className="bg-accent">            {/* #AB8BFF */}

// Text colors
<Text className="text-primary">
<Text className="text-light-200">
<Text className="text-dark-100">
```

### 2. Layout Patterns

```tsx
// Flex layouts
<View className="flex-1">                    {/* flex: 1 */}
<View className="flex-row">                  {/* flexDirection: 'row' */}
<View className="items-center">              {/* alignItems: 'center' */}
<View className="justify-center">            {/* justifyContent: 'center' */}

// Positioning
<View className="absolute top-0 left-0">     {/* Absolute positioning */}
<View className="relative">                  {/* Relative positioning */}

// Spacing
<View className="p-4">                       {/* padding: 16 */}
<View className="m-6">                       {/* margin: 24 */}
<View className="px-2 py-4">                 {/* paddingX: 8, paddingY: 16 */}
```

### 3. Typography Patterns

```tsx
// Text sizing
<Text className="text-xs">       {/* fontSize: 12 */}
<Text className="text-sm">       {/* fontSize: 14 */}
<Text className="text-base">     {/* fontSize: 16 */}
<Text className="text-lg">       {/* fontSize: 18 */}
<Text className="text-xl">       {/* fontSize: 20 */}
<Text className="text-2xl">      {/* fontSize: 24 */}
<Text className="text-5xl">      {/* fontSize: 48 */}

// Font weights
<Text className="font-thin">     {/* fontWeight: '100' */}
<Text className="font-light">    {/* fontWeight: '300' */}
<Text className="font-normal">   {/* fontWeight: '400' */}
<Text className="font-medium">   {/* fontWeight: '500' */}
<Text className="font-semibold"> {/* fontWeight: '600' */}
<Text className="font-bold">     {/* fontWeight: '700' */}

// Text alignment
<Text className="text-left">
<Text className="text-center">
<Text className="text-right">
```

## 🚀 Development Workflow

### 1. Scripts Available

```bash
# Start development server
npm run start

# Platform-specific development
npm run android
npm run ios
npm run web

# Code quality
npm run lint          # ESLint + Prettier check
npm run format        # ESLint fix + Prettier format
```

### 2. Development Best Practices

#### Class Organization
```tsx
// ✅ Good: Organized classes
<View className="flex-1 items-center justify-center bg-primary p-4 rounded-lg">

// ✅ Better: Multi-line for readability
<View className="
  flex-1 items-center justify-center 
  bg-primary p-4 rounded-lg 
  shadow-lg border border-accent
">

// ✅ Best: Template literals for complex cases
<View className={`
  flex-1 items-center justify-center
  ${isActive ? 'bg-accent' : 'bg-primary'}
  p-4 rounded-lg shadow-lg
`}>
```

#### TypeScript Integration
```tsx
// Type-safe props with className
interface ButtonProps {
  title: string;
  onPress: () => void;
  className?: string;
}

const Button = ({ title, onPress, className = '' }: ButtonProps) => (
  <TouchableOpacity 
    onPress={onPress}
    className={`bg-accent px-4 py-2 rounded ${className}`}
  >
    <Text className="text-white font-semibold">{title}</Text>
  </TouchableOpacity>
);
```

### 3. Debugging Styles

#### Common Issues & Solutions

```tsx
// ❌ Problem: Styles not applying
<Text className="text-blue-500">Not working</Text>

// ✅ Solutions:
// 1. Check CSS import in root layout
// 2. Verify content paths in tailwind.config.js
// 3. Clear Metro cache: npx expo start --clear
// 4. Check babel configuration

// ❌ Problem: TypeScript errors
<Text className="text-custom-color">Error</Text>

// ✅ Solution: Add to tailwind.config.js theme
theme: {
  extend: {
    colors: {
      'custom-color': '#123456'
    }
  }
}
```

## 📊 Performance Considerations

### 1. Bundle Size Impact
- NativeWind adds ~50KB to bundle size
- Tailwind CSS classes are tree-shaken automatically
- Only used classes are included in final bundle

### 2. Runtime Performance
- Minimal runtime overhead
- Styles are compiled at build time
- No runtime CSS parsing

### 3. Development Experience
- IntelliSense support for Tailwind classes
- Prettier plugin for automatic class sorting
- Hot reload works seamlessly

## 🔍 Troubleshooting Guide

### Common Issues

1. **Styles not applying**
   ```bash
   # Clear Metro cache
   npx expo start --clear
   
   # Check imports
   # Verify tailwind.config.js content paths
   # Ensure babel configuration is correct
   ```

2. **TypeScript errors**
   ```bash
   # Verify nativewind-env.d.ts exists
   # Check tsconfig.json extends expo/tsconfig.base
   # Restart TypeScript service in VS Code
   ```

3. **Build errors**
   ```bash
   # Update dependencies
   npm update
   
   # Clean install
   rm -rf node_modules package-lock.json
   npm install
   ```

### Debug Commands

```bash
# Check NativeWind installation
npm list nativewind

# Verify Tailwind CSS
npm list tailwindcss

# Test Metro configuration
npx expo start --clear --verbose
```

## 📚 Additional Resources

### Documentation Links
- [NativeWind v4 Documentation](https://nativewind.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Expo Router Documentation](https://docs.expo.dev/router/)

### Recommended Extensions (VS Code)
- Tailwind CSS IntelliSense
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- ESLint

### Useful Tools
- [Tailwind CSS Color Generator](https://tailwindcss.com/docs/customizing-colors)
- [Tailwind CSS Cheat Sheet](https://tailwindcomponents.com/cheatsheet/)
- [React Native Styling Guide](https://reactnative.dev/docs/style)

---

## 📋 Quick Reference

### Essential Commands
```bash
# Install NativeWind
npm install nativewind tailwindcss

# Development
npm run start
npm run format

# Clear cache
npx expo start --clear
```

### Key Files Checklist
- ✅ `global.css` - Tailwind imports
- ✅ `tailwind.config.js` - Configuration
- ✅ `babel.config.js` - Babel setup
- ✅ `metro.config.js` - Metro integration
- ✅ `nativewind-env.d.ts` - TypeScript support
- ✅ CSS import in root layout

### Version Compatibility
- **NativeWind**: v4.1.21
- **Expo**: v54.0.12
- **React Native**: 0.79.5
- **Tailwind CSS**: v3.4.0

---

*Last updated: October 2025*
*Project: Movies App*
*NativeWind Version: 4.1.21*