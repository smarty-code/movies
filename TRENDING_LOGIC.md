# Trending Movies Logic - Impl### 3. **Getting Movie View Count** (`services/appwrite.ts`)
```typescript
getMovieViewCount(movieId: number): Promise<number>
```
- **When called**: When a movie details page loads
- **What it does**: Fetches the current view count for a specific movie
- **Returns**: The view count number (or 0 if the movie hasn't been viewed yet)

### 4. **Updating Movie Details Page** (`app/movie/[id].tsx`)
- Added `useEffect` hook that triggers when movie data loads
- Automatically calls `updateMovieViewCount()` with movie information
- Fetches and displays the current view count using `getMovieViewCount()`
- Shows view count in a badge next to the rating (👁️ X views)
- Runs silently in the background without blocking the UI

### 5. **Auto-Refresh Home Screen** (`app/(tabs)/index.tsx`)de

## 📊 Overview
The trending/popular movies feature tracks which movies users visit the most. Every time a user opens a movie details page, the view count for that movie increases by 1, and the home screen shows the top 5 most visited movies in the "Popular movies" section.

## 🔄 How It Works

### 1. **Tracking Movie Views** (`services/appwrite.ts`)
```typescript
updateMovieViewCount(movie: Movie)
```
- **When called**: Automatically triggered when a user opens a movie details page
- **What it does**: 
  - Checks if the movie exists in the database (by `movie_id`)
  - If exists: Increments the `count` by 1
  - If new: Creates a new entry with `count = 1`
- **Database fields stored**:
  - `movie_id`: Unique movie identifier
  - `title`: Movie title
  - `count`: Number of times the movie has been viewed
  - `poster_url`: Movie poster image URL (handles both WatchMode and TMDB formats)

### 2. **Getting Trending Movies** (`services/appwrite.ts`)
```typescript
getTrendingMovies(): Promise<TrendingMovie[]>
```
- **When called**: On home screen load and when screen comes into focus
- **What it does**: Fetches the top 5 movies with the highest view counts
- **Returns**: Array of `TrendingMovie` objects sorted by `count` (descending)

### 3. **Getting Movie View Count** (`services/appwrite.ts`)
```typescript
getMovieViewCount(movieId: number): Promise<number>
```
- **When called**: When a movie details page loads
- **What it does**: Fetches the current view count for a specific movie
- **Returns**: The view count number (or 0 if the movie hasn't been viewed yet)

### 3. **Updating Movie Details Page** (`app/movie/[id].tsx`)
- Added `useEffect` hook that triggers when movie data loads
- Automatically calls `updateMovieViewCount()` with movie information
- Runs silently in the background without blocking the UI

### 4. **Auto-Refresh Home Screen** (`app/(tabs)/index.tsx`)
- Uses `useFocusEffect` hook from Expo Router
- Uses a `useRef` to track first focus and prevent infinite loops
- Only refreshes when returning from another screen (not on initial load)
- Shows updated view counts and movie rankings in real-time

## 🗄️ Database Schema

### Appwrite Collection Structure
```typescript
{
  movie_id: number,        // Unique identifier for the movie
  title: string,           // Movie title
  count: number,           // View count (how many times visited)
  poster_url: string       // Full URL to movie poster image
}
```

### Required Indexes
- **movie_id**: Unique index for fast lookups and preventing duplicates
- **count**: Descending index for sorting by popularity

## 🎯 User Flow

1. **User opens a movie details page**
   ```
   User clicks movie → Movie details page loads → useEffect triggers → updateMovieViewCount() called
   ```

2. **Database updates**
   ```
   Check if movie exists → Yes: count++ | No: Create new entry with count=1
   ```

3. **User navigates back to home**
   ```
   Home screen focused → useFocusEffect triggers → refetchTrending() → UI updates with new data
   ```

4. **Result**
   ```
   Popular movies section shows top 5 most visited movies with updated rankings
   ```

## 📱 UI Updates

### Home Screen (`app/(tabs)/index.tsx`)
- **Popular movies** section displays trending movies in a horizontal carousel
- Each card shows:
  - Movie poster
  - Ranking badge (1-5) with gradient background
  - Movie title
  - Star rating
- Auto-refreshes when screen comes into focus

### Movie Details (`app/movie/[id].tsx`)
- View count tracking is **automatic** and **invisible** to users
- **View count badge**: Shows "👁️ X views" next to the star rating
- Updates in real-time when the page loads
- Console logs show when view count is updated (visible in development)

## 🔧 Environment Setup

Make sure you have these in your `.env` file:
```env
EXPO_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
EXPO_PUBLIC_APPWRITE_DATABASE_ID=your_database_id
EXPO_PUBLIC_APPWRITE_COLLECTION_ID=your_collection_id
```

## 🎨 Key Features

✅ **Automatic tracking** - No manual intervention needed  
✅ **Real-time updates** - Home screen refreshes when focused  
✅ **Dual API support** - Works with both WatchMode and TMDB image URLs  
✅ **Error handling** - Fails gracefully without breaking the UI  
✅ **Performance** - Uses indexes for fast database queries  
✅ **Console logging** - Easy debugging with detailed logs  

## 🐛 Debugging

Check the console for these log messages:

### Successful View Count Update
```
✅ Updated view count for: Movie Title (42 views)
```

### New Movie Entry Created
```
✅ Created new entry for: Movie Title (1 view)
```

### View Count Fetched
```
👁️ View count for "Movie Title": 5
```

### Trending Movies Fetched
```
📊 Fetched 5 trending movies
```

### Home Screen Refresh
```
🔄 Home screen focused - refreshing trending movies...
```

### Errors
```
❌ Error updating movie view count: [error details]
❌ Error fetching trending movies: [error details]
```

## 🚀 Testing

1. **Test view counting**:
   - Open a movie details page
   - Check console for "✅ Updated view count" message
   - Navigate back to home screen
   - Verify movie appears in Popular movies section

2. **Test ranking**:
   - Visit different movies multiple times
   - Return to home screen after each visit
   - Verify Popular movies section reorders based on view counts

3. **Test real-time updates**:
   - Have app open on home screen
   - Switch to another tab, then back to home
   - Verify "🔄 Home screen focused" message appears
   - Confirm trending movies refresh

## 📝 Notes

- The old `updateSearchCount()` function is kept for backward compatibility but now redirects to `updateMovieViewCount()`
- The `searchTerm` field is no longer used - removed from `TrendingMovie` interface
- View counts persist in the database and accumulate over time
- Maximum 5 trending movies shown on home screen (can be changed in `getTrendingMovies()` limit)
