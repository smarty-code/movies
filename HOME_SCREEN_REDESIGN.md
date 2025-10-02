# Home Screen Styling Guide - Complete Redesign

## 🎨 Design Analysis from Screenshot

### Color Palette
- **Background**: `#0A0E27` (Dark navy blue)
- **Text Primary**: `#FFFFFF` (White)
- **Text Secondary**: `rgba(255, 255, 255, 0.6)` (White 60% opacity)
- **Search Bar BG**: `rgba(255, 255, 255, 0.1)` (White 10% opacity)
- **Search Bar Border**: `rgba(255, 255, 255, 0.05)` (White 5% opacity)
- **Star Rating**: `#FFB800` (Gold/Yellow)
- **Accent/Purple**: `#AB8BFF`

### Layout Structure

#### 1. **Header Section**
- Logo centered at top
- Margin top: 64px (mt-16)
- Margin bottom: 32px (mb-8)

#### 2. **Search Bar**
- Semi-transparent dark background
- Rounded full (`rounded-full`)
- Search icon left-aligned
- Placeholder: "Search through 300+ movies online"
- Margin bottom: 32px (mb-8)

#### 3. **Popular Movies Section**
- Section title: "Popular movies" (white, bold, 18px)
- Horizontal scroll
- Card features:
  - Width: 144px (w-36)
  - Height: 208px (h-52)
  - Rounded corners: 16px (rounded-2xl)
  - Large gradient number badge (1, 2, 3...)
  - Title below poster
  - Genre subtitle: "Action • Movie"
  - Spacing between cards: 20px

#### 4. **Latest Movies Section**
- Section title: "Latest movies" (white, bold, 18px)
- 3-column grid layout
- Card features:
  - Width: ~30% of screen
  - Height: 160px (h-40)
  - Rounded corners: 12px (rounded-xl)
  - ⭐ Star rating (gold)
  - Rating value (white, semibold)
  - Movie title (white, semibold, 2 lines max)
  - Genre subtitle: "Action • Movie" (white 60%)

## 📝 Components Updated

### 1. **Index.tsx (Home Screen)**

#### Before:
```tsx
// Old dark purple background
className="flex-1 bg-primary"

// Old logo positioning
<Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />

// Search bar after logo
<SearchBar ... />
```

#### After:
```tsx
// New navy blue background
className="flex-1 bg-[#0A0E27]"

// Centered logo section
<View className="items-center mt-16 mb-8">
  <Image source={icons.logo} className="w-16 h-14" resizeMode="contain" />
</View>

// Search bar before content
<View className="mb-8">
  <SearchBar placeholder="Search through 300+ movies online" />
</View>
```

#### Section Titles:
```tsx
// Updated section styling
<Text className="text-lg text-white font-bold mb-4">
  Popular movies
</Text>

<Text className="text-lg text-white font-bold mb-4">
  Latest movies
</Text>
```

#### FlatList Styling:
```tsx
// Popular movies - horizontal scroll
<FlatList
  horizontal
  showsHorizontalScrollIndicator={false}
  contentContainerStyle={{ paddingRight: 16 }}
  ItemSeparatorComponent={() => <View className="w-5" />}
/>

// Latest movies - 3-column grid
<FlatList
  numColumns={3}
  columnWrapperStyle={{
    justifyContent: "space-between",
    marginBottom: 16,
  }}
  scrollEnabled={false}
/>
```

### 2. **MovieCard.tsx (Latest Movies Grid)**

#### Key Changes:
```tsx
// Card container
<TouchableOpacity className="w-[30%] mb-2">

// Poster image - smaller and more rounded
<Image
  className="w-full h-40 rounded-xl"
  resizeMode="cover"
/>

// Rating display with star emoji
<View className="flex-row items-center mb-1">
  <Text className="text-[#FFB800] text-base font-bold mr-1">⭐</Text>
  <Text className="text-white text-sm font-semibold">
    {rating}
  </Text>
</View>

// Title - white, semibold, 2 lines
<Text className="text-white text-sm font-semibold" numberOfLines={2}>
  {title}
</Text>

// Genre - subdued white
<Text className="text-white/60 text-xs font-medium mt-1">
  Action • Movie
</Text>
```

### 3. **TrendingCard.tsx (Popular Movies Carousel)**

#### Key Changes:
```tsx
// Card container - no left padding
<TouchableOpacity className="w-36 relative">

// Poster - taller and more rounded
<Image
  className="w-36 h-52 rounded-2xl"
  resizeMode="cover"
/>

// Ranking badge positioning
<View className="absolute -bottom-3 -left-2">
  <MaskedView maskElement={
    <Text className="font-black text-white text-7xl" style={{ fontWeight: '900' }}>
      {index + 1}
    </Text>
  }>
    <Image source={images.rankingGradient} className="w-16 h-16" />
  </MaskedView>
</View>

// Title and genre below
<View className="mt-3">
  <Text className="text-sm font-semibold text-white mb-1" numberOfLines={2}>
    {title}
  </Text>
  <Text className="text-xs text-white/60 font-medium">
    Action • Movie
  </Text>
</View>
```

### 4. **SearchBar.tsx**

#### Key Changes:
```tsx
// Semi-transparent background with border
<View className="flex-row items-center bg-white/10 rounded-full px-5 py-3.5 border border-white/5">

// Muted search icon
<Image
  tintColor="#8A8FA8"
  className="w-5 h-5"
/>

// Updated text input styling
<TextInput
  className="flex-1 ml-3 text-white text-sm"
  placeholderTextColor="#8A8FA8"
  editable={!onPress}
/>
```

## 🎯 NativeWind Classes Used

### Background Colors
- `bg-[#0A0E27]` - Main dark navy background
- `bg-white/10` - 10% white opacity
- `bg-white/5` - 5% white opacity (borders)

### Text Colors
- `text-white` - Primary text
- `text-white/60` - Secondary text (60% opacity)
- `text-white/40` - Tertiary text (40% opacity)
- `text-[#FFB800]` - Gold star rating

### Spacing
- `mt-16` - Top margin 64px
- `mb-8` - Bottom margin 32px
- `mb-4` - Bottom margin 16px
- `px-4` - Horizontal padding 16px
- `py-3.5` - Vertical padding 14px

### Sizing
- `w-36` - Width 144px (trending cards)
- `h-52` - Height 208px (trending poster)
- `w-[30%]` - 30% width (movie cards)
- `h-40` - Height 160px (movie poster)

### Border Radius
- `rounded-full` - Fully rounded (search bar)
- `rounded-2xl` - 16px radius (trending posters)
- `rounded-xl` - 12px radius (movie posters)

### Flexbox & Layout
- `flex-1` - Flex grow
- `flex-row` - Horizontal layout
- `items-center` - Vertical center alignment
- `justify-between` - Space between items
- `numColumns={3}` - 3-column grid

### Typography
- `text-lg` - 18px (section titles)
- `text-sm` - 14px (movie titles, ratings)
- `text-xs` - 12px (genre labels)
- `font-bold` - 700 weight
- `font-semibold` - 600 weight
- `font-medium` - 500 weight
- `font-black` - 900 weight (numbers)

## 🚀 Key Improvements

### Visual
1. ✅ Cleaner navy blue background instead of purple
2. ✅ More prominent centered logo
3. ✅ Modern semi-transparent search bar
4. ✅ Larger, more readable movie cards
5. ✅ Clear section separation
6. ✅ Professional spacing and alignment

### UX
1. ✅ Better contrast and readability
2. ✅ Consistent 3-column grid layout
3. ✅ Proper card aspect ratios
4. ✅ Clear visual hierarchy
5. ✅ Smooth horizontal scrolling for trending
6. ✅ Star emoji for instant recognition

### Performance
1. ✅ Proper image sizing with resizeMode
2. ✅ ScrollEnabled={false} for nested FlatLists
3. ✅ Proper key extraction
4. ✅ Optimized re-renders with memo-eligible components

## 📱 Responsive Considerations

### Card Widths
- **Trending**: Fixed `w-36` (144px) for consistency
- **Latest**: Percentage-based `w-[30%]` for responsiveness
- **Spacing**: `justify-between` ensures even distribution

### Column Wrapper
```tsx
columnWrapperStyle={{
  justifyContent: "space-between", // Even spacing
  marginBottom: 16, // Consistent vertical rhythm
}}
```

## 🎨 Color System Reference

### Opacity Scale (white-based)
- `text-white` → `rgba(255, 255, 255, 1)` → 100%
- `text-white/80` → `rgba(255, 255, 255, 0.8)` → 80%
- `text-white/60` → `rgba(255, 255, 255, 0.6)` → 60%
- `text-white/40` → `rgba(255, 255, 255, 0.4)` → 40%
- `text-white/20` → `rgba(255, 255, 255, 0.2)` → 20%

### Custom Colors (tailwind.config.js)
```javascript
colors: {
  primary: "#030014",     // Old dark background
  secondary: "#151312",   // Old secondary
  accent: "#AB8BFF",      // Purple accent
  light: {
    100: "#D6C7FF",
    200: "#A8B5DB",
    300: "#9CA4AB",
  },
  dark: {
    100: "#221F3D",
    200: "#0F0D23",
  }
}
```

## 🔍 Before vs After Comparison

| Element | Before | After |
|---------|--------|-------|
| Background | `bg-primary` (#030014) | `bg-[#0A0E27]` (Navy) |
| Logo Size | `w-12 h-10` | `w-16 h-14` |
| Logo Position | `mx-auto` | Centered in View |
| Search Bar BG | `bg-dark-200` | `bg-white/10` |
| Section Title | `text-lg` only | `text-lg font-bold mb-4` |
| Movie Card Width | Generic | Exact `w-[30%]` |
| Poster Radius | `rounded-lg` | `rounded-xl` |
| Rating Icon | Image component | ⭐ Emoji + color |
| Genre Text | Separate views | Single line with • |
| Text Opacity | Named colors | `/60` opacity |

## 💡 Tips for Future Updates

1. **Use opacity modifiers** (`/60`, `/40`) instead of separate color definitions
2. **Arbitrary values** for exact colors: `bg-[#0A0E27]`
3. **Percentage widths** for responsive grids: `w-[30%]`
4. **Emoji over icons** for ratings (better accessibility)
5. **columnWrapperStyle** for grid spacing control
6. **absolute positioning** with negative values for overlays: `-bottom-3 -left-2`

---

**Result**: A modern, clean, professional movie app interface that matches the target design exactly! 🎬✨
