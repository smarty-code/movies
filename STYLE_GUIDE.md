# 🎨 Visual Style Guide - NativeWind Implementation

## Color System

### Primary Colors
```tsx
// Background
bg-[#0A0E27]         // Navy blue - main background
bg-white/10          // Search bar, cards background
bg-white/5           // Subtle borders

// Text
text-white           // Primary headings, titles
text-white/60        // Secondary text, subtitles
text-white/40        // Tertiary text, hints
text-[#FFB800]       // Gold - star ratings
```

### Usage Examples
```tsx
// Section Title
<Text className="text-lg text-white font-bold mb-4">
  Popular movies
</Text>

// Movie Title
<Text className="text-sm text-white font-semibold">
  Gladiator II
</Text>

// Genre/Subtitle
<Text className="text-xs text-white/60 font-medium">
  Action • Movie
</Text>

// Star Rating
<Text className="text-[#FFB800] text-base font-bold">⭐</Text>
```

---

## Typography Scale

### Font Sizes
```tsx
text-lg    → 18px    // Section titles
text-base  → 16px    // Star emoji
text-sm    → 14px    // Movie titles, ratings
text-xs    → 12px    // Genres, subtitles
text-7xl   → 72px    // Ranking numbers
```

### Font Weights
```tsx
font-black     → 900    // Ranking numbers
font-bold      → 700    // Section titles
font-semibold  → 600    // Movie titles, ratings
font-medium    → 500    // Genres, subtitles
```

### Complete Examples
```tsx
// Section Header
<Text className="text-lg text-white font-bold mb-4">
  Latest movies
</Text>

// Movie Title (Grid)
<Text className="text-sm text-white font-semibold" numberOfLines={2}>
  Mufasa: The Lion King
</Text>

// Rating Display
<View className="flex-row items-center">
  <Text className="text-[#FFB800] text-base font-bold">⭐</Text>
  <Text className="text-white text-sm font-semibold ml-1">4.6</Text>
</View>

// Genre Label
<Text className="text-xs text-white/60 font-medium">
  Action • Movie
</Text>

// Ranking Number
<Text className="text-7xl text-white font-black" style={{ fontWeight: '900' }}>
  1
</Text>
```

---

## Spacing System

### Margin Scale
```tsx
mt-16  → 64px     // Logo top margin
mb-10  → 40px     // Section bottom margin
mb-8   → 32px     // Logo/Search spacing
mb-4   → 16px     // Title to content
mb-2   → 8px      // Small gaps
mb-1   → 4px      // Tight spacing
```

### Padding Scale
```tsx
px-4   → 16px     // Screen horizontal padding
px-5   → 20px     // Search bar horizontal
py-3.5 → 14px     // Search bar vertical
py-3   → 12px     // Card padding
```

### Gap/Spacing
```tsx
// Horizontal card spacing
ItemSeparatorComponent={() => <View className="w-5" />}  // 20px

// Grid spacing
columnWrapperStyle={{
  justifyContent: "space-between",
  marginBottom: 16
}}
```

---

## Border Radius Scale

### Values
```tsx
rounded-full  → 9999px   // Search bar (fully rounded)
rounded-2xl   → 16px     // Trending cards
rounded-xl    → 12px     // Movie cards
```

### Usage
```tsx
// Search Bar
<View className="rounded-full border border-white/5">

// Trending Poster
<Image className="rounded-2xl" />

// Movie Grid Poster
<Image className="rounded-xl" />
```

---

## Layout Patterns

### Centered Logo Section
```tsx
<View className="items-center mt-16 mb-8">
  <Image 
    source={icons.logo} 
    className="w-16 h-14" 
    resizeMode="contain" 
  />
</View>
```

### Search Bar
```tsx
<View className="mb-8">
  <View className="flex-row items-center bg-white/10 rounded-full px-5 py-3.5 border border-white/5">
    <Image className="w-5 h-5" tintColor="#8A8FA8" />
    <TextInput 
      className="flex-1 ml-3 text-white text-sm"
      placeholderTextColor="#8A8FA8"
    />
  </View>
</View>
```

### Section with Title
```tsx
<View className="mb-10">
  <Text className="text-lg text-white font-bold mb-4">
    Section Title
  </Text>
  {/* Content */}
</View>
```

### Horizontal Scroll
```tsx
<FlatList
  horizontal
  showsHorizontalScrollIndicator={false}
  contentContainerStyle={{ paddingRight: 16 }}
  ItemSeparatorComponent={() => <View className="w-5" />}
  data={data}
  renderItem={renderItem}
  keyExtractor={(item) => item.id}
/>
```

### 3-Column Grid
```tsx
<FlatList
  data={data}
  renderItem={renderItem}
  keyExtractor={(item) => item.id}
  numColumns={3}
  columnWrapperStyle={{
    justifyContent: "space-between",
    marginBottom: 16,
  }}
  scrollEnabled={false}
/>
```

---

## Card Components

### Trending Card (Popular Movies)
```tsx
<TouchableOpacity className="w-36 relative">
  {/* Poster */}
  <Image 
    source={{ uri: posterUrl }}
    className="w-36 h-52 rounded-2xl"
    resizeMode="cover"
  />

  {/* Ranking Badge */}
  <View className="absolute -bottom-3 -left-2">
    <MaskedView maskElement={
      <Text className="text-7xl font-black text-white">1</Text>
    }>
      <Image source={gradientImage} className="w-16 h-16" />
    </MaskedView>
  </View>

  {/* Title & Genre */}
  <View className="mt-3">
    <Text className="text-sm font-semibold text-white mb-1" numberOfLines={2}>
      Movie Title
    </Text>
    <Text className="text-xs text-white/60 font-medium">
      Action • Movie
    </Text>
  </View>
</TouchableOpacity>
```

**Key Specs:**
- Width: 144px (w-36)
- Poster: 144x208px, rounded-2xl
- Badge: Positioned at -12px bottom, -8px left
- Text: 14px semibold title, 12px medium genre

### Movie Card (Latest Movies Grid)
```tsx
<TouchableOpacity className="w-[30%] mb-2">
  {/* Poster */}
  <Image 
    source={{ uri: posterUrl }}
    className="w-full h-40 rounded-xl"
    resizeMode="cover"
  />

  {/* Content */}
  <View className="mt-2">
    {/* Rating */}
    <View className="flex-row items-center mb-1">
      <Text className="text-[#FFB800] text-base font-bold mr-1">⭐</Text>
      <Text className="text-white text-sm font-semibold">4.6</Text>
    </View>

    {/* Title */}
    <Text className="text-white text-sm font-semibold" numberOfLines={2}>
      Movie Title
    </Text>

    {/* Genre */}
    <Text className="text-white/60 text-xs font-medium mt-1">
      Action • Movie
    </Text>
  </View>
</TouchableOpacity>
```

**Key Specs:**
- Width: 30% of container
- Poster: Dynamic width x 160px, rounded-xl
- Rating: Gold star emoji + white text
- Text: 14px semibold title, 12px medium genre

---

## Image Handling

### Poster URLs
```tsx
const getPosterUrl = () => {
  if (!poster_path) {
    return "https://placehold.co/600x400/1a1a1a/FFFFFF.png";
  }
  
  // WatchMode: Full URL
  if (poster_path.startsWith('http')) {
    return poster_path;
  }
  
  // TMDB: Construct URL
  return `https://image.tmdb.org/t/p/w500${poster_path}`;
};
```

### Image Properties
```tsx
<Image 
  source={{ uri: getPosterUrl() }}
  className="w-36 h-52 rounded-2xl"
  resizeMode="cover"  // Ensures proper aspect ratio
  onError={(error) => console.error('Failed to load')}
  onLoad={() => console.log('Loaded successfully')}
/>
```

---

## Loading States

### Loading Indicator
```tsx
<View className="flex-1 items-center justify-center mt-20">
  <ActivityIndicator 
    size="large" 
    color="#AB8BFF" 
    className="mb-4" 
  />
  <Text className="text-white/60 text-sm">
    Loading movies...
  </Text>
</View>
```

### Error State
```tsx
<View className="flex-1 items-center justify-center mt-20 px-4">
  <Text className="text-red-400 text-base font-semibold mb-2">
    Error loading movies
  </Text>
  <Text className="text-white/60 text-sm text-center">
    {errorMessage}
  </Text>
  <Text className="text-white/40 text-xs text-center mt-4">
    Please check your API key
  </Text>
</View>
```

### Empty State
```tsx
<View className="flex-1 items-center justify-center mt-10">
  <Text className="text-white/60 text-sm">
    No movies found
  </Text>
</View>
```

---

## Responsive Considerations

### Fixed Widths (Horizontal Scroll)
```tsx
// Use fixed width for consistent card sizes
className="w-36"  // 144px - trending cards
```

### Percentage Widths (Grid)
```tsx
// Use percentage for responsive grid
className="w-[30%]"  // Automatically adjusts to screen width
```

### Column Wrapper
```tsx
// Space-between ensures even distribution
columnWrapperStyle={{
  justifyContent: "space-between",  // Auto-spacing
  marginBottom: 16,                  // Consistent vertical rhythm
}}
```

---

## Common Patterns

### Star Rating Display
```tsx
<View className="flex-row items-center mb-1">
  <Text className="text-[#FFB800] text-base font-bold mr-1">⭐</Text>
  <Text className="text-white text-sm font-semibold">
    {(vote_average / 2).toFixed(1)}
  </Text>
</View>
```

### Genre Label with Bullet
```tsx
<Text className="text-white/60 text-xs font-medium mt-1">
  Action • Movie
</Text>
```

### Gradient Number Badge
```tsx
<View className="absolute -bottom-3 -left-2">
  <MaskedView
    maskElement={
      <Text 
        className="text-7xl font-black text-white" 
        style={{ fontWeight: '900' }}
      >
        {index + 1}
      </Text>
    }
  >
    <Image 
      source={images.rankingGradient} 
      className="w-16 h-16" 
      resizeMode="cover"
    />
  </MaskedView>
</View>
```

---

## Accessibility Tips

### Text Contrast
- White text on navy blue: ✅ WCAG AAA (contrast ratio > 7:1)
- White 60% on navy blue: ✅ WCAG AA (contrast ratio > 4.5:1)
- Gold on navy blue: ✅ WCAG AA (contrast ratio > 4.5:1)

### Touch Targets
- Minimum: 44x44 points (Apple HIG)
- Card heights: 208px+ (trending), 160px+ (grid)
- Spacing: 20px between cards

### Text Sizing
- Minimum: 12px for body text (labels OK)
- Preferred: 14px+ for primary content
- Large: 18px+ for headings

---

## Quick Reference

### Most Common Classes
```tsx
// Layout
className="flex-1"
className="flex-row items-center"
className="justify-between"
className="absolute -bottom-3 -left-2"

// Spacing
className="mt-16 mb-8"
className="px-4"
className="mb-4"
className="mr-1"

// Text
className="text-lg text-white font-bold"
className="text-sm text-white font-semibold"
className="text-xs text-white/60 font-medium"

// Backgrounds
className="bg-[#0A0E27]"
className="bg-white/10"

// Borders
className="rounded-full"
className="rounded-2xl"
className="rounded-xl"
className="border border-white/5"

// Images
className="w-36 h-52 rounded-2xl"
className="w-full h-40 rounded-xl"
className="w-16 h-16"
```

---

## Pro Tips

1. **Use opacity modifiers** instead of separate colors
   - ✅ `text-white/60` 
   - ❌ Define new color in config

2. **Arbitrary values for exact matches**
   - ✅ `bg-[#0A0E27]`
   - ❌ Approximate with theme colors

3. **Percentage widths for grids**
   - ✅ `w-[30%]` with `space-between`
   - ❌ Fixed widths that don't adapt

4. **Emoji over icons when possible**
   - ✅ `<Text>⭐</Text>` (better accessibility)
   - ❌ Complex icon components

5. **Negative positioning for overlays**
   - ✅ `absolute -bottom-3 -left-2`
   - ❌ Complex transform calculations

---

**Happy Styling! 🎨**
