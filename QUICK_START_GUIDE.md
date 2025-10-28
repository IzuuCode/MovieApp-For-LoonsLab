# MovieVerse - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/IzuuCode/MovieApp-For-LoonsLab.git

# 2. Navigate to project directory
cd MovieApp-For-LoonsLab

# 3. Install dependencies
npm install

# 4. Start development server
npm run dev

# 5. Open browser to http://localhost:5173
```

---

## 📖 Understanding the App

### What Does It Do?
MovieVerse lets you:
- **Search** for movies using the TMDb database
- **Browse** trending movies
- **View** detailed information (cast, ratings, trailers)
- **Save** your favorite movies
- **Toggle** between light and dark themes

### How to Use It

1. **Home Page** - Start here to see trending movies
2. **Search Bar** - Type a movie name and press Enter
3. **Movie Cards** - Click any movie to see details
4. **Heart Icon** - Save movies to favorites (requires login)
4. **Login** - Click Login and enter any username/password (demo mode)
5. **Favorites** - Access your saved movies (after login)
6. **Theme Toggle** - Click sun/moon icon to switch themes

---

## 🗂️ Project Structure at a Glance

```
src/
├── components/         # Reusable UI pieces
│   ├── Navbar.tsx     # Top navigation bar
│   ├── MovieCard.tsx  # Individual movie display
│   └── ...
├── pages/             # Full page views
│   ├── HomePage.tsx   # Main landing page
│   ├── MovieDetailsPage.tsx  # Movie details
│   └── ...
├── context/           # Global state (theme, auth, movies)
├── services/          # API calls to TMDb
└── types/             # TypeScript type definitions
```

---

## 🔑 Key Concepts

### 1. Context API (Global State)
The app uses React Context for state that needs to be shared everywhere:
- **ThemeContext** - Light/dark mode setting
- **AuthContext** - User login status
- **MovieContext** - Movie data, search results, favorites

### 2. Component Hierarchy
```
App
├── ThemeProvider (dark/light mode)
│   └── AuthProvider (login state)
│       └── MovieProvider (movie data)
│           └── Router (navigation)
│               ├── Navbar
│               ├── Pages (Home, Details, Login, Favorites)
│               └── Footer
```

### 3. Data Flow Example: Searching Movies
```
User types "Inception" 
  → Navbar updates searchQuery state
  → User presses Enter
  → searchMoviesAction() called in MovieContext
  → API request to TMDb via movieService.ts
  → Results stored in MovieContext
  → HomePage re-renders with results
  → MovieGrid displays results as MovieCards
```

---

## 🛠️ Common Tasks

### Adding a New Feature

1. **Determine the right place:**
   - UI component? → `src/components/`
   - Full page? → `src/pages/`
   - API call? → `src/services/`
   - Global state? → `src/context/`

2. **Follow the pattern:**
   - Look at similar existing code
   - Use TypeScript types
   - Handle loading and error states
   - Test in both light and dark modes

### Modifying the API Integration

All API calls are in `src/services/movieService.ts`:

```typescript
// Example: Adding a new API function
export const getPopularMovies = async (): Promise<SearchResults> => {
  try {
    const response = await api.get('/movie/popular');
    return response.data;
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    throw new Error('Failed to fetch popular movies');
  }
};
```

### Styling Components

The app uses **Tailwind CSS** utility classes:

```typescript
// Responsive design example
<div className="
  grid                          // Use CSS Grid
  grid-cols-2                  // 2 columns on mobile
  md:grid-cols-4               // 4 columns on medium screens
  gap-6                        // Space between items
  dark:bg-gray-900             // Dark mode background
">
```

---

## 🧪 Testing Your Changes

```bash
# Lint your code
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📚 Learn More

For detailed documentation, see:
- **[CODE_EXPLANATION.md](./CODE_EXPLANATION.md)** - Complete technical guide
- **[README.md](./README.md)** - Project overview and features

---

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request with clear description

---

## ⚡ Useful Commands

```bash
npm run dev        # Start development server
npm run build      # Create production build
npm run lint       # Check code quality
npm run preview    # Test production build locally
```

---

## 🐛 Troubleshooting

**Issue:** Dependencies not installing  
**Solution:** Delete `node_modules` and `package-lock.json`, then run `npm install`

**Issue:** Build fails  
**Solution:** Check for TypeScript errors with `npm run lint`

**Issue:** API not working  
**Solution:** Verify API key in `src/services/movieService.ts`

**Issue:** Styles not applying  
**Solution:** Ensure Tailwind is configured in `tailwind.config.js`

---

## 💡 Tips for Beginners

1. **Start with the HomePage** - It shows how data flows from API → Context → UI
2. **Understand Context** - This is how global state works in React
3. **Check the Network tab** - See actual API calls in browser DevTools
4. **Use TypeScript** - The types will guide you and prevent errors
5. **Read CODE_EXPLANATION.md** - It explains everything in detail

---

**Happy Coding! 🎬**
