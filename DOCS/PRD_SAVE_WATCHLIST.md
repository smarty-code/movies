# Product Requirements Document (PRD)
## Save/Watchlist Feature

---

## 1. Executive Summary

### Overview
A feature that allows users to save movies to their personal watchlist for later viewing. Users can add/remove movies from any screen and view all saved movies in a dedicated "Save" tab.

### Business Goals
- Increase user engagement and retention
- Provide personalized movie collection
- Encourage users to return to the app
- Create a sense of ownership and personalization

### Success Metrics
- Number of movies saved per user
- Save tab visit frequency
- Conversion from browsing to saving
- User retention after first save

---

## 2. User Stories

### Core User Stories
1. **As a user**, I want to save movies I'm interested in, so I can watch them later
2. **As a user**, I want to see all my saved movies in one place, so I can easily find them
3. **As a user**, I want to remove movies from my saved list, so I can manage my collection
4. **As a user**, I want my saved movies to persist across app sessions, so I don't lose my list
5. **As a user**, I want to save movies from movie details page, so I can bookmark while browsing

### Secondary User Stories
6. **As a user**, I want to see if a movie is already saved, so I don't save duplicates
7. **As a user**, I want to see how many movies I've saved, so I can track my collection
8. **As a user**, I want saved movies to load quickly, so I don't wait unnecessarily
9. **As a user**, I want the save button to be easily accessible, so I can save with one tap

---

## 3. Feature Requirements

### 3.1 Database Schema

**Appwrite Collection: `saved_movies`**

```typescript
{
  user_id: string,           // Future: for multi-user support
  movie_id: number,           // Unique movie identifier
  title: string,              // Movie title
  poster_url: string,         // Movie poster image URL
  saved_at: string,           // ISO timestamp
  vote_average: number,       // Movie rating
  release_date: string,       // Release date
}
```

**Indexes Required:**
- `movie_id` - Unique index (prevent duplicates)
- `saved_at` - Descending index (sort by most recent)

### 3.2 UI Components

#### A. Save Button (Movie Details Page)
**Location:** Bottom of movie details page (alongside "Visit Homepage" button)

**States:**
- **Not Saved:** 
  - Icon: Bookmark outline (🔖)
  - Text: "Save to Watchlist"
  - Color: Purple (#AB8BFF)
  - Action: Save movie

- **Already Saved:**
  - Icon: Bookmark filled (📑)
  - Text: "Saved"
  - Color: Gold (#FFB800)
  - Action: Remove from watchlist

**Behavior:**
- Single tap to save/remove
- Instant visual feedback
- Toast/notification on success
- Haptic feedback on press

#### B. Save Tab Screen
**Layout:**
```
┌─────────────────────────────┐
│  [Logo]                     │
│                             │
│  My Watchlist               │
│  {count} movies saved       │
│                             │
│  ┌─────┐ ┌─────┐ ┌─────┐  │
│  │Movie│ │Movie│ │Movie│  │  ← 3-column grid
│  │ [X] │ │ [X] │ │ [X] │  │  ← Remove button
│  └─────┘ └─────┘ └─────┘  │
│                             │
│  ┌─────┐ ┌─────┐ ┌─────┐  │
│  │Movie│ │Movie│ │Movie│  │
│  └─────┘ └─────┘ └─────┘  │
└─────────────────────────────┘
```

**Components:**
- Logo at top
- Title: "My Watchlist"
- Counter: "{X} movies saved"
- Movie grid (3 columns)
- Remove button (X) on each card
- Empty state when no movies saved

#### C. Empty State
```
┌─────────────────────────────┐
│                             │
│       🔖                    │
│   No movies saved yet       │
│                             │
│   Start building your       │
│   watchlist by saving       │
│   movies you want to watch  │
│                             │
│   [Browse Movies]           │
│                             │
└─────────────────────────────┘
```

### 3.3 User Flows

#### Flow 1: Save a Movie
```
User on Movie Details Page
    ↓
Taps "Save to Watchlist" button
    ↓
Button shows loading state
    ↓
Movie saved to Appwrite
    ↓
Cache invalidated
    ↓
Button changes to "Saved" (gold)
    ↓
Success notification shown
```

#### Flow 2: View Saved Movies
```
User taps "Save" tab
    ↓
Check cache for saved movies
    ↓
If cached: Load instantly
If not: Fetch from Appwrite
    ↓
Display movies in grid
    ↓
Show count at top
```

#### Flow 3: Remove a Movie
```
User taps X button on saved movie
    ↓
Confirmation dialog appears
    ↓
User confirms removal
    ↓
Movie removed from Appwrite
    ↓
Cache invalidated
    ↓
Movie removed from UI
    ↓
Count updated
```

---

## 4. Technical Specifications

### 4.1 API Functions

**`services/appwrite.ts` - New Functions**

```typescript
// Save a movie to watchlist
saveMo vie(movie: Movie): Promise<void>

// Remove a movie from watchlist
unsaveMovie(movieId: number): Promise<void>

// Check if a movie is saved
isMovieSaved(movieId: number): Promise<boolean>

// Get all saved movies
getSavedMovies(): Promise<SavedMovie[]>

// Get saved movies count
getSavedMoviesCount(): Promise<number>
```

### 4.2 Caching Strategy

**Cache Keys:**
- `saved_movies` - All saved movies list
- `saved_movie_{id}` - Individual save status
- `saved_count` - Total count

**Cache Durations:**
- Saved movies list: 5 minutes (changes frequently)
- Save status: 10 minutes
- Count: 5 minutes

**Cache Invalidation:**
- When movie saved → Invalidate all save caches
- When movie removed → Invalidate all save caches
- Ensures UI stays in sync

### 4.3 State Management

**Save Tab Component:**
```typescript
const [savedMovies, setSavedMovies] = useState<SavedMovie[]>([]);
const [loading, setLoading] = useState(true);
const [refreshing, setRefreshing] = useState(false);
```

**Movie Details Component:**
```typescript
const [isSaved, setIsSaved] = useState(false);
const [isSaving, setIsSaving] = useState(false);
```

### 4.4 Performance Optimizations

1. **Optimistic Updates:** UI updates before API call completes
2. **Debouncing:** Prevent rapid save/unsave toggles
3. **Lazy Loading:** Load saved movies on tab focus
4. **Image Caching:** Reuse cached poster images
5. **Batch Operations:** Support multi-select delete (future)

---

## 5. Design Specifications

### 5.1 Colors
- **Primary Action:** Purple (#AB8BFF)
- **Saved State:** Gold (#FFB800)
- **Remove Button:** Red (#F87171)
- **Background:** Navy (#0A0E27)
- **Text Primary:** White (#FFFFFF)
- **Text Secondary:** Gray (rgba(255, 255, 255, 0.6))

### 5.2 Typography
- **Page Title:** 24px, Bold, White
- **Movie Count:** 14px, Regular, Gray
- **Empty State Title:** 18px, Bold, White
- **Empty State Description:** 14px, Regular, Gray
- **Button Text:** 16px, Semibold, White

### 5.3 Spacing
- Screen padding: 16px
- Section margins: 24px
- Card spacing: 12px
- Button padding: 16px vertical, 24px horizontal

### 5.4 Components Consistency
- Follows existing MovieCard design
- Uses same rounded corners (16px)
- Maintains 3-column grid layout
- Consistent button styling
- Same loading indicators

---

## 6. User Experience

### 6.1 Feedback Mechanisms
- **Visual:** Button state changes (color, icon)
- **Textual:** Success/error messages
- **Haptic:** Vibration on save/remove
- **Audio:** Optional sound effects (future)

### 6.2 Error Handling
- Network errors: Show retry button
- Duplicate saves: Silent ignore
- Failed removes: Restore UI state
- Database errors: User-friendly messages

### 6.3 Loading States
- Initial load: Full-screen spinner
- Saving: Button spinner
- Refreshing: Pull-to-refresh indicator
- Removing: Card fade-out animation

---

## 7. Edge Cases

### 7.1 Scenarios
1. **Save while offline:** Queue and sync later
2. **Duplicate saves:** Check before saving
3. **Movie deleted:** Handle gracefully
4. **Database full:** Show storage limit message
5. **Corrupted data:** Refresh from source
6. **No internet:** Show cached data

### 7.2 Validation
- Movie ID must be valid
- Poster URL must exist
- Title must not be empty
- Timestamps must be valid
- No duplicate entries

---

## 8. Testing Checklist

### 8.1 Functional Testing
- [ ] Save movie from details page
- [ ] Remove movie from save tab
- [ ] View all saved movies
- [ ] Empty state displays correctly
- [ ] Count updates accurately
- [ ] Cache works correctly
- [ ] Button states update properly

### 8.2 Performance Testing
- [ ] Load time < 1 second (cached)
- [ ] Save action < 500ms
- [ ] Remove action < 500ms
- [ ] Smooth scrolling in grid
- [ ] No memory leaks

### 8.3 UI/UX Testing
- [ ] Consistent with app design
- [ ] Buttons easily tappable
- [ ] Visual feedback on actions
- [ ] Error messages clear
- [ ] Navigation intuitive

---

## 9. Implementation Phases

### Phase 1: Database & API (Priority: HIGH)
**Duration:** 1-2 hours
- Create Appwrite collection
- Implement save/unsave functions
- Add cache integration
- Test API functions

### Phase 2: Movie Details Save Button (Priority: HIGH)
**Duration:** 1 hour
- Add save button to details page
- Implement save/unsave logic
- Add loading states
- Test button interactions

### Phase 3: Save Tab Screen (Priority: HIGH)
**Duration:** 2-3 hours
- Create save tab layout
- Implement movie grid
- Add remove functionality
- Add empty state
- Test complete flow

### Phase 4: Polish & Optimization (Priority: MEDIUM)
**Duration:** 1 hour
- Add animations
- Optimize performance
- Add error handling
- User testing

### Phase 5: Future Enhancements (Priority: LOW)
**Future Releases:**
- Multi-select delete
- Sort/filter options
- Share watchlist
- Export to file
- Sync across devices

---

## 10. Success Criteria

### Launch Criteria
✅ Users can save movies
✅ Users can view saved movies
✅ Users can remove saved movies
✅ Data persists across sessions
✅ Cache reduces load times
✅ No critical bugs
✅ Consistent with design system

### KPIs (After 1 Week)
- 50%+ of users save at least 1 movie
- 3+ average saved movies per user
- < 2% error rate on save/unsave
- < 1 second load time (cached)

---

## 11. Dependencies

### Technical
- Appwrite Database (existing)
- AsyncStorage (existing)
- React Native (existing)
- Expo Router (existing)

### Design
- Icons: Bookmark outline/filled
- Empty state illustration
- Loading indicators

---

## 12. Risks & Mitigation

### Risks
1. **Database limits:** Appwrite free tier limits
   - **Mitigation:** Monitor usage, implement cleanup

2. **Cache sync issues:** UI out of sync with database
   - **Mitigation:** Smart invalidation, refresh on focus

3. **Poor performance:** Large watchlists slow
   - **Mitigation:** Pagination, lazy loading

4. **User confusion:** Don't understand save vs trending
   - **Mitigation:** Clear labels, onboarding tooltips

---

## 13. Future Considerations

### Post-MVP Features
- **Notes:** Add personal notes to saved movies
- **Tags:** Organize with custom tags
- **Priority:** Mark as "must watch" vs "maybe"
- **Watched:** Mark movies as watched
- **Recommendations:** Get suggestions from watchlist
- **Sharing:** Share watchlist with friends
- **Collections:** Create themed collections
- **Notifications:** Remind to watch saved movies

---

## 14. Documentation

### Developer Documentation
- API function reference
- Cache strategy explanation
- Component props documentation
- Testing guidelines

### User Documentation
- How to save movies
- How to manage watchlist
- FAQ section
- Troubleshooting guide

---

## Approval & Sign-off

**Product Manager:** _________________
**Engineering Lead:** _________________
**Design Lead:** _________________
**Date:** October 3, 2025

---

**Document Version:** 1.0
**Last Updated:** October 3, 2025
**Status:** Ready for Implementation
