# 📱 Movies App - Comprehensive Documentation

## 🏗️ Project Overview

The **Movies App** is a React Native application built with Expo Router and styled using NativeWind (Tailwind CSS for React Native). This documentation provides a complete guide to the project structure, configuration, and development patterns.

### 🛠️ Tech Stack
- **Framework**: React Native 0.79.5
- **Development Platform**: Expo SDK 54.0.12
- **Routing**: Expo Router 6.0.10
- **Styling**: NativeWind 4.1.21 + Tailwind CSS 3.4.0
- **Language**: TypeScript 5.8.3
- **Package Manager**: NPM 10.9.2

---

## 📁 Project Structure

```
movies/
├── 📱 App Configuration
│   ├── app.json                 # Expo app configuration
│   ├── babel.config.js          # Babel configuration with NativeWind
│   ├── metro.config.js          # Metro bundler with NativeWind integration
│   ├── tailwind.config.js       # Tailwind CSS configuration
│   ├── global.css               # Global Tailwind styles
│   └── nativewind-env.d.ts      # TypeScript definitions for NativeWind
│
├── 🎨 Styling & Code Quality
│   ├── eslint.config.js         # ESLint configuration
│   ├── prettier.config.js       # Prettier with Tailwind plugin
│   └── tsconfig.json            # TypeScript configuration
│
├── 🗂️ Source Code
│   ├── app/                     # Expo Router app directory
│   │   ├── _layout.tsx          # Root layout component
│   │   ├── index.tsx            # Home screen
│   │   ├── (tabs)/              # Tab navigation group
│   │   │   ├── _layout.tsx      # Tab layout (empty)
│   │   │   ├── index.tsx        # Home tab (empty)
│   │   │   ├── search.tsx       # Search tab (empty)
│   │   │   ├── profile.tsx      # Profile tab (empty)
│   │   │   └── save.tsx         # Saved items tab (empty)
│   │   └── movie/
│   │       └── [id].tsx         # Dynamic movie detail page (empty)
│   │
│   ├── components/              # Reusable UI components
│   │   ├── Container.tsx        # Safe area container wrapper
│   │   ├── EditScreenInfo.tsx   # Development info component
│   │   └── ScreenContent.tsx    # Screen content template
│   │
│   └── assets/                  # Static assets
│       ├── adaptive-icon.png    # Android adaptive icon
│       ├── favicon.png          # Web favicon
│       ├── icon.png             # App icon
│       └── splash.png           # Splash screen image
│
├── 📋 Configuration Files
│   ├── package.json             # Dependencies and scripts
│   └── cesconfig.jsonc          # Create Expo Stack configuration
```

---

## ⚙️ Configuration Analysis

### 1. **Package.json Dependencies**

#### Core Dependencies
```json
{
  "dependencies": {
    "babel-preset-expo": "^14.0.0",         // Expo Babel preset
    "expo": "^54.0.12",                     // Expo SDK
    "expo-constants": "~18.0.9",            // Device constants
    "expo-linking": "~8.0.8",               // Deep linking
    "expo-router": "~6.0.10",               // File-based routing
    "expo-status-bar": "~3.0.8",            // Status bar component
    "nativewind": "4.1.21",                 // Tailwind for RN
    "react": "19.0.0",                      // React core
    "react-native": "0.79.5",               // React Native
    "react-native-reanimated": "~3.17.4",   // Animations
    "react-native-safe-area-context": "~5.6.0", // Safe area
    "react-native-screens": "~4.16.0"       // Native screens
  }
}
```

#### Development Dependencies
```json
{
  "devDependencies": {
    "@babel/core": "^7.20.0",               // Babel compiler
    "@types/react": "~19.0.10",             // React TypeScript types
    "eslint": "^9.25.1",                    // Code linting
    "eslint-config-expo": "~9.2.0",         // Expo ESLint config
    "eslint-config-prettier": "^10.1.2",    // Prettier ESLint integration
    "prettier": "^3.2.5",                   // Code formatting
    "prettier-plugin-tailwindcss": "^0.5.11", // Tailwind class sorting
    "tailwindcss": "^3.4.0",                // Tailwind CSS
    "typescript": "~5.8.3"                  // TypeScript compiler
  }
}
```

### 2. **NativeWind Configuration**

#### Babel Configuration (`babel.config.js`)
```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      // Critical: JSX import source for NativeWind v4
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",  // NativeWind Babel preset
    ],
  };
};
```

#### Metro Configuration (`metro.config.js`)
```javascript
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Integrate NativeWind with Metro bundler
module.exports = withNativeWind(config, { input: './global.css' });
```

#### Tailwind Configuration (`tailwind.config.js`)
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  // Content scanning for Tailwind classes
  content: ['./App.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],

  // NativeWind v4 preset (required)
  presets: [require('nativewind/preset')],
  
  theme: {
    extend: {
      // Custom color palette
      colors: {
        primary: "#030014",      // Dark primary
        secondary: "#151312",    // Dark secondary
        light: {
          100: "#D6C7FF",        // Light purple
          200: "#A8B5DB",        // Light blue
          300: "#9CA4AB",        // Light gray
        },
        dark: {
          100: "#221F3D",        // Dark purple
          200: "#0F0D23",        // Darker purple
        },
        accent: "#AB8BFF",       // Purple accent
      },
    },
  },
  plugins: [],
};
```

### 3. **TypeScript Configuration**

#### Main Config (`tsconfig.json`)
```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,              // Strict type checking
    "baseUrl": ".",              // Base path for imports
    "paths": {
      "@/*": ["src/*"]           // Path alias (optional)
    }
  }
}
```

#### NativeWind Types (`nativewind-env.d.ts`)
```typescript
/// <reference types="nativewind/types" />
```

### 4. **Code Quality Configuration**

#### ESLint (`eslint.config.js`)
```javascript
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,                    // Expo ESLint rules
  {
    ignores: ['dist/*'],         // Ignore build directory
  },
  {
    rules: {
      'react/display-name': 'off', // Disable display name rule
    },
  },
]);
```

#### Prettier (`prettier.config.js`)
```javascript
module.exports = {
  printWidth: 100,               // Line width
  tabWidth: 2,                   // Tab size
  singleQuote: true,             // Use single quotes
  bracketSameLine: true,         // Brackets on same line
  trailingComma: 'es5',          // Trailing commas

  // Tailwind CSS class sorting
  plugins: [require.resolve('prettier-plugin-tailwindcss')],
  tailwindAttributes: ['className'],
};
```

---

## 🧩 Component Architecture

### 1. **Root Layout (`app/_layout.tsx`)**
```tsx
import { Stack } from 'expo-router';
import './../global.css'  // Import global Tailwind styles
import { StatusBar } from 'react-native';

export default function RootLayout() {
  return (
   <>
      <StatusBar hidden={true} />
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="movie/[id]" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
```

**Key Features:**
- ✅ Imports global CSS for NativeWind
- ✅ Configures Expo Router stack navigation
- ✅ Hides status bar and headers
- ✅ Defines app-wide navigation structure

### 2. **Home Screen (`app/index.tsx`)**
```tsx
import { View, Text, StyleSheet } from 'react-native';
import './../global.css'

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text className='text-blue-700 text-5xl font-bold'>Home</Text>
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

**Key Features:**
- ✅ Demonstrates NativeWind className usage
- ✅ Mixes traditional StyleSheet with Tailwind
- ✅ Shows proper CSS import pattern

### 3. **Container Component (`components/Container.tsx`)**
```tsx
import { SafeAreaView } from 'react-native';

export const Container = ({ children }: { children: React.ReactNode }) => {
  return <SafeAreaView className={styles.container}>{children}</SafeAreaView>;
};

const styles = {
  container: 'flex flex-1 m-6',  // Pure Tailwind classes
};
```

**Key Features:**
- ✅ Reusable safe area wrapper
- ✅ Uses string-based Tailwind classes
- ✅ TypeScript-enabled with proper props

### 4. **Screen Content Template (`components/ScreenContent.tsx`)**
```tsx
import React from 'react';
import { Text, View } from 'react-native';
import { EditScreenInfo } from './EditScreenInfo';

type ScreenContentProps = {
  title: string;
  path: string;
  children?: React.ReactNode;
};

export const ScreenContent = ({ title, path, children }: ScreenContentProps) => {
  return (
    <View className={styles.container}>
      <Text className={styles.title}>{title}</Text>
      <View className={styles.separator} />
      <EditScreenInfo path={path} />
      {children}
    </View>
  );
};

const styles = {
  container: `items-center flex-1 justify-center bg-white`,
  separator: `h-[1px] my-7 w-4/5 bg-gray-200`,
  title: `text-xl font-bold`,
};
```

**Key Features:**
- ✅ Template string Tailwind classes
- ✅ TypeScript props interface
- ✅ Composable design with children
- ✅ Reusable layout patterns

### 5. **Development Info Component (`components/EditScreenInfo.tsx`)**
```tsx
import { Text, View } from 'react-native';

export const EditScreenInfo = ({ path }: { path: string }) => {
  const title = 'Open up the code for this screen:';
  const description = 'Change any of the text, save the file, and your app will automatically update.';

  return (
    <View>
      <View className={styles.getStartedContainer}>
        <Text className={styles.getStartedText}>{title}</Text>
        <View className={styles.codeHighlightContainer + styles.homeScreenFilename}>
          <Text className='text-5xl text-blue-700'>{path}</Text>
        </View>
        <Text className={styles.getStartedText}>{description}</Text>
      </View>
    </View>
  );
};

const styles = {
  codeHighlightContainer: `rounded-md px-1`,
  getStartedContainer: `items-center mx-12`,
  getStartedText: `text-lg leading-6 text-center`,
  helpContainer: `items-center mx-5 mt-4`,
  helpLink: `py-4`,
  helpLinkText: `text-center`,
  homeScreenFilename: `my-2`,
};
```

**Key Features:**
- ✅ Development helper component
- ✅ String concatenation of Tailwind classes
- ✅ Mixed inline and style object patterns

---

## 🎨 Styling Patterns

### 1. **NativeWind Class Usage Patterns**

#### Direct className (Recommended)
```tsx
<Text className="text-xl font-bold text-blue-600">Title</Text>
```

#### Style Object with Template Strings
```tsx
const styles = {
  container: `flex-1 items-center justify-center bg-white`,
  title: `text-2xl font-bold text-gray-800`,
};

<View className={styles.container}>
  <Text className={styles.title}>Hello</Text>
</View>
```

#### Dynamic Classes
```tsx
const isActive = true;
<View className={`p-4 rounded-lg ${isActive ? 'bg-blue-500' : 'bg-gray-300'}`}>
```

### 2. **Custom Color System**
The project defines a comprehensive color palette:

```javascript
colors: {
  primary: "#030014",      // Main brand color
  secondary: "#151312",    // Secondary brand color
  light: {
    100: "#D6C7FF",        // Light variants
    200: "#A8B5DB", 
    300: "#9CA4AB",
  },
  dark: {
    100: "#221F3D",        // Dark variants
    200: "#0F0D23",
  },
  accent: "#AB8BFF",       // Accent color
}
```

**Usage Examples:**
```tsx
<View className="bg-primary p-4">
  <Text className="text-light-100 text-lg">Primary Background</Text>
</View>

<View className="bg-accent rounded-lg p-6">
  <Text className="text-dark-200">Accent Card</Text>
</View>
```

---

## 🚀 Development Workflow

### 1. **Available Scripts**
```json
{
  "start": "expo start",                    // Start development server
  "android": "expo start --android",       // Run on Android
  "ios": "expo start --ios",               // Run on iOS  
  "web": "expo start --web",               // Run on web
  "prebuild": "expo prebuild",             // Generate native code
  "lint": "eslint \"**/*.{js,jsx,ts,tsx}\" && prettier -c \"**/*.{js,jsx,ts,tsx,json}\"",
  "format": "eslint \"**/*.{js,jsx,ts,tsx}\" --fix && prettier \"**/*.{js,jsx,ts,tsx,json}\" --write"
}
```

### 2. **Development Commands**

#### Start Development
```bash
npm start           # Start Expo development server
npm run android     # Run on Android device/emulator
npm run ios         # Run on iOS device/simulator
npm run web         # Run in web browser
```

#### Code Quality
```bash
npm run lint        # Check code style and errors
npm run format      # Auto-fix and format code
```

#### Build & Deploy
```bash
npm run prebuild    # Generate native code
expo build          # Build for production
```

### 3. **File Creation Patterns**

#### New Screen Component
```tsx
// app/new-screen.tsx
import { View, Text } from 'react-native';

export default function NewScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-primary">
      <Text className="text-light-100 text-2xl font-bold">
        New Screen
      </Text>
    </View>
  );
}
```

#### New Reusable Component
```tsx
// components/Button.tsx
import { Pressable, Text } from 'react-native';

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
};

export const Button = ({ title, onPress, variant = 'primary' }: ButtonProps) => {
  const baseStyles = 'px-6 py-3 rounded-lg items-center';
  const variantStyles = {
    primary: 'bg-accent',
    secondary: 'bg-secondary border border-light-300',
  };

  return (
    <Pressable 
      className={`${baseStyles} ${variantStyles[variant]}`}
      onPress={onPress}
    >
      <Text className={variant === 'primary' ? 'text-white' : 'text-light-100'}>
        {title}
      </Text>
    </Pressable>
  );
};
```

---

## 🔧 Configuration Best Practices

### 1. **NativeWind v4 Requirements Checklist**
- ✅ **JSX Import Source**: `jsxImportSource: "nativewind"` in Babel
- ✅ **NativeWind Preset**: `presets: [require('nativewind/preset')]`
- ✅ **Metro Integration**: `withNativeWind(config, { input: './global.css' })`
- ✅ **Global CSS Import**: Import in root layout
- ✅ **Content Paths**: Proper paths in `tailwind.config.js`
- ✅ **TypeScript Definitions**: `nativewind-env.d.ts`

### 2. **Performance Optimizations**
- Use `content` paths efficiently in Tailwind config
- Enable Prettier plugin for class sorting
- Utilize template strings for reusable styles
- Implement proper component composition

### 3. **Code Organization**
```
components/
├── ui/              # Basic UI components (Button, Input, etc.)
├── layout/          # Layout components (Container, Header, etc.)
├── features/        # Feature-specific components
└── shared/          # Shared utility components
```

---

## 🐛 Troubleshooting

### Common Issues & Solutions

#### **Issue 1: Styles not applying**
```bash
# Clear Metro cache
npx expo start --clear

# Verify imports
# ✅ Import global.css in root layout
# ✅ Check content paths in tailwind.config.js
```

#### **Issue 2: TypeScript errors with className**
```bash
# Ensure nativewind-env.d.ts exists
/// <reference types="nativewind/types" />
```

#### **Issue 3: Metro bundler issues**
```bash
# Reset Metro cache and node_modules
rm -rf node_modules
npm install
npx expo start --clear
```

#### **Issue 4: Build errors**
```bash
# Check Babel configuration
# Verify jsxImportSource is set correctly
```

### Development Tips
1. **Use Expo Go app** for quick testing
2. **Enable hot reload** for faster development
3. **Use TypeScript strictly** for better development experience
4. **Implement proper error boundaries**
5. **Test on multiple devices/screen sizes**

---

## 📚 Additional Resources

### Documentation Links
- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [NativeWind v4 Docs](https://www.nativewind.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Native](https://reactnative.dev/)

### Community Resources
- [Expo Discord](https://discord.gg/expo)
- [React Native Community](https://reactnative.dev/community/overview)
- [NativeWind GitHub](https://github.com/nativewind/nativewind)

---

## 🎯 Next Steps & Roadmap

### Immediate Todos
1. **Implement Tab Navigation** - Complete `(tabs)/_layout.tsx`
2. **Create Movie Detail Screen** - Implement `movie/[id].tsx`
3. **Add Search Functionality** - Build `(tabs)/search.tsx`
4. **User Profile Screen** - Develop `(tabs)/profile.tsx`
5. **Saved Movies Feature** - Create `(tabs)/save.tsx`

### Enhanced Features
1. **API Integration** - Connect to movie database
2. **State Management** - Implement Zustand or Redux Toolkit
3. **Offline Support** - Add caching and offline capabilities
4. **Push Notifications** - Integrate Expo Notifications
5. **Authentication** - Add user login/registration
6. **Dark Mode** - Implement theme switching

### Performance & Production
1. **Image Optimization** - Implement lazy loading
2. **Bundle Optimization** - Code splitting and tree shaking
3. **Error Tracking** - Integrate Sentry or Bugsnag
4. **Analytics** - Add user behavior tracking
5. **Testing** - Unit tests with Jest and React Native Testing Library
6. **CI/CD Pipeline** - Automated builds and deployments

---

*This documentation is generated for the Movies App project using Expo Router, NativeWind, and TypeScript. Keep this documentation updated as the project evolves.*