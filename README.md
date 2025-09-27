# Secret Cocktail Menu App

A premium Progressive Web App that helps users discover their perfect cocktail through a magical, gamified taste preference quiz.

## 📁 Project Structure

```
secret-cocktail-menu/
├── docs/                          # Business documentation
│   ├── EXECUTIVE_SUMMARY.md       # Investor presentation
│   └── NORTH_STAR_ROADMAP.md      # Product roadmap
├── public/                        # Public assets
├── src/
│   ├── assets/
│   │   └── data/                  # Static data files
│   │       └── secret_menu_mvp_cocktails.json
│   ├── components/
│   │   ├── features/              # Feature-specific components
│   │   │   ├── QuizFlow.tsx       # Quiz functionality
│   │   │   └── Results.tsx        # Results display
│   │   ├── pages/                 # Page components
│   │   │   └── LandingPage.tsx    # Landing page
│   │   ├── ui/                    # Reusable UI components
│   │   │   ├── animations.ts      # Animation utilities
│   │   │   └── PremiumButton.tsx  # Button component
│   │   └── index.ts               # Component exports
│   ├── constants/                 # Application constants
│   │   └── index.ts
│   ├── context/                   # React context providers
│   │   └── QuizContext.tsx
│   ├── hooks/                     # Custom React hooks
│   │   ├── useQuiz.ts
│   │   └── index.ts
│   ├── services/                  # Business logic & external services
│   │   ├── analytics.ts           # Analytics tracking
│   │   ├── recommendationEngine.ts # Cocktail recommendations
│   │   ├── soundEffects.ts        # Audio feedback
│   │   └── index.ts
│   ├── types/                     # TypeScript type definitions
│   │   └── index.ts
│   ├── App.tsx                    # Main app component
│   ├── index.css                  # Global styles
│   └── main.tsx                   # App entry point
├── .kiro/specs/                   # Development specifications
└── [config files]                # Vite, TypeScript, Tailwind configs
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation & Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```
   
3. **Open in browser:**
   - Local: `http://localhost:5173`
   - Network: `http://[your-ip]:5173` (for mobile testing)

### 📱 Mobile Testing
The dev server runs with `--host` flag, so you can test on your phone:
1. Find your computer's IP address
2. On your phone, go to `http://[your-ip]:5173`
3. Test the premium mobile experience

## 🏗️ Architecture Principles

### Component Organization
- **Pages**: Top-level route components
- **Features**: Business logic components
- **UI**: Reusable, generic components
- **Services**: External integrations and business logic
- **Hooks**: Reusable React logic
- **Constants**: Application-wide constants

### Import Strategy
- Use barrel exports (`index.ts`) for clean imports
- Relative imports within same directory level
- Absolute imports from `src/` for cross-cutting concerns

### Code Organization
- **Separation of Concerns**: UI, business logic, and data are separated
- **Single Responsibility**: Each file has one clear purpose
- **Dependency Direction**: Components depend on services, not vice versa

## 🚀 Deployment

### Automatic Deployment with Vercel

1. **Create GitHub repository:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Premium cocktail discovery app"
   git branch -M main
   git remote add origin https://github.com/[username]/secret-cocktail-menu.git
   git push -u origin main
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect Vite and deploy
   - Get your live URL: `your-app-name.vercel.app`

## 🎨 Design System

### Premium Color Palette
- **Premium Black**: Deep, sophisticated backgrounds
- **Magical Purple**: Interactive elements and accents  
- **Premium Gold**: Luxury highlights and text
- **Premium Silver**: Secondary text and borders

### Typography
- **Headlines**: Playfair Display (elegant serif)
- **Body**: Inter (clean, modern sans-serif)

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS with custom premium design system
- **Build**: Vite with hot module replacement
- **PWA**: Service Worker + Web App Manifest
- **Deployment**: Vercel with automatic deployments
- **Analytics**: Comprehensive tracking system

## 📊 Key Features

### Phase 1 (Complete)
- ✅ Premium Tesla/Rolex-inspired design
- ✅ 5-question sophisticated quiz with 50 unique responses
- ✅ Real cocktail database with 100+ recipes
- ✅ 90-98% match scores
- ✅ Adjacent cocktail navigation
- ✅ PWA capabilities with offline support
- ✅ Comprehensive analytics
- ✅ Premium sound effects and haptic feedback

### Future Phases
- 🔄 Secret Shuffle (random discovery)
- 🔄 Ingredient Spotlight (inventory integration)
- 🔄 Mood Compass (AI-powered recommendations)

## 📋 Documentation

- **Business Documents**: See `docs/` folder
- **Technical Specs**: See `.kiro/specs/` folder
- **API Documentation**: Generated from TypeScript types

## 🎯 Development Workflow

1. **Code locally** with instant visual feedback
2. **Push to GitHub** when reaching checkpoints  
3. **Auto-deploy to Vercel** within 30 seconds
4. **Share live URL** to show anyone, anywhere
5. **Generate QR codes** for easy bar testing

Perfect for showing investors, testing in real bars, and collaborating with your team!

---

## 🧩 Environment Variables

- `VITE_GA_MEASUREMENT_ID`: Google Analytics 4 Measurement ID (e.g., `G-XXXXXXX`). If set, the app auto-loads GA4, sends SPA page views on route changes, and forwards custom events through the analytics service.

## 📈 Analytics & A/B Testing

- Analytics lives in `src/services/analytics.ts`.
  - Page views are tracked on route changes.
  - Helper functions are exported for quiz and recommendation events.
- A/B testing lives in `src/services/abTesting.ts`.
  - Use `getABVariant('experiment-name', ['control', 'variant'])` to get a deterministic per-visitor variant. Exposure is auto-tracked to analytics.

## 🔗 QR Code Generator

- Route: `/qr`
- Generate QR codes for table tents/posters with:
  - Target path (e.g., `/quiz`, `/shuffle`)
  - UTM params (`utm_source`, `utm_medium`, `utm_campaign`)
  - `table` id for per-table attribution
  - Size and margin controls
  - SVG download and copy-link

## 🧰 Tooling

- Lint: `npm run lint`
- Format: `npm run format`
- Build: `npm run build`
- Tests: `npm run test` (CI: `npm run test:ci`)
