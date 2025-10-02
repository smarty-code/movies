# Troubleshooting TrendingCard Image Loading

## 🔍 What Was Fixed

### 1. **Appwrite Service** (`services/appwrite.ts`)
- ✅ Now handles both WatchMode (full URLs) and TMDB (paths) when saving to database
- ✅ Automatically detects if `poster_path` starts with 'http'
- ✅ Constructs proper URL for TMDB paths

### 2. **TrendingCard Component** (`components/TrendingCard.tsx`)
- ✅ Added debug logging to track image loading
- ✅ Added `onError` and `onLoad` handlers to Image component
- ✅ Better fallback handling for missing posters

## 📊 Debug Output

Check your Metro bundler console for these logs:

```
📽️ TrendingCard - Movie: [Title], Poster URL: [URL]
✅ Successfully loaded image for [Title]
```

Or if there's an issue:
```
⚠️ No poster_url for movie: [Title]
❌ Failed to load image for [Title]: [Error]
```

## 🔧 Common Issues & Solutions

### Issue 1: Images Not Loading from Appwrite
**Symptoms:** Placeholder images showing for trending movies

**Solution:**
1. Check if you have data in Appwrite database
2. Open Metro bundler console
3. Look for logs showing what `poster_url` values are being fetched

### Issue 2: Old TMDB URLs in Database
**Symptoms:** Some images load, others don't (mixed results)

**Why:** Your Appwrite database might have old TMDB URLs that are blocked in your region

**Solution:**
```bash
# Option 1: Clear and rebuild trending data
# - Open your Appwrite console
# - Delete all documents in your collection
# - Search for movies again to rebuild with WatchMode URLs

# Option 2: Test if TMDB images are accessible
curl -I https://image.tmdb.org/t/p/w500/SOME_PATH.jpg
# If this fails with timeout (exit code 28), TMDB is blocked
```

### Issue 3: WatchMode Movies Not Appearing in Trending
**Symptoms:** No trending movies showing after switching to WatchMode

**Why:** Trending movies come from Appwrite database based on search history

**How it works:**
1. User searches for a movie → calls WatchMode API
2. User clicks on a movie → `updateSearchCount` is called
3. Movie is saved to Appwrite with search count
4. Top 5 movies by count appear in "Trending Movies"

**Solution:**
- Search for some movies using the WatchMode API
- Click on movie results to trigger `updateSearchCount`
- The new movies will appear in trending with WatchMode CDN URLs

## 🧪 Testing Steps

### 1. Check What's in Your Database
```typescript
// In your Appwrite console:
// - Go to your database
// - Open the collection
// - Check the documents
// - Look at the poster_url field values
```

### 2. Test TrendingCard with Debug Logs
```bash
# Start your app with clear cache
npm start -c

# In Metro console, watch for:
📽️ TrendingCard - Movie: [Title], Poster URL: [URL]
```

### 3. Verify Image URLs
Check if the URLs in console are:
- ✅ `https://cdn.watchmode.com/...` (WatchMode - should work)
- ⚠️ `https://image.tmdb.org/...` (TMDB - might be blocked in your region)
- ❌ `undefined` or empty (missing data)

## 💡 Expected Behavior

### After Fix:
1. **New Searches (WatchMode)**
   - Search for a movie → WatchMode API called
   - Click on result → Saved to Appwrite with WatchMode CDN URL
   - Appears in trending with working poster

2. **Old Data (TMDB)**
   - If your region blocks TMDB, these will fail to load
   - Shows placeholder image instead
   - Console shows error: `❌ Failed to load image`

3. **Mixed State**
   - Old trending movies: TMDB URLs (may not work)
   - New trending movies: WatchMode URLs (should work)
   - Gradually replaces old data as you search

## 🎯 Quick Fix Summary

**Before:**
```typescript
// Always used TMDB format
poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`
```

**After:**
```typescript
// Detects URL type automatically
const posterUrl = movie.poster_path?.startsWith('http')
  ? movie.poster_path // WatchMode: full URL
  : `https://image.tmdb.org/t/p/w500${movie.poster_path}`; // TMDB: construct
```

## 📱 Next Steps

1. **Check Metro Console** - Look for the debug logs
2. **Verify Appwrite Data** - Check what's in your database
3. **Test New Searches** - Search for movies to rebuild trending with WatchMode URLs
4. **Clear Old Data** (optional) - Delete old TMDB entries if they're causing issues

---

**Still having issues?** Share the console logs showing the `📽️ TrendingCard` output!
