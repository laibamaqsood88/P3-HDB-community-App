# NeighbourHood App — Project Context

## Last Updated
2026-04-14

## GitHub Repository
https://github.com/laibamaqsood88/P3-HDB-community-App

## What This App Is
A Singapore HDB community mobile web app called **NeighbourHood**. It connects verified HDB residents within an estate (Bishan-AMK Estate in the demo) via Singpass identity verification. Stack: React 18 + TypeScript + Vite, inline styles, Framer Motion (motion/react), Lucide React icons, Sonner toasts. No backend — all mock data.

## How to Run
```bash
cd "/Users/laibamaqsood/Desktop/P3 HDB community App"
npm install        # if node_modules missing
npm run dev        # starts on http://localhost:5173
```
Preview server config: `.claude/launch.json` (port 5173, `npm run dev`).

---

## Current App State (as of last session)

### Auth Flow
- **Login page** (`LoginPage.tsx`) — Singpass-only red button, calls `onLogin()`
- **Sign-up onboarding** (`SignUpPage.tsx`) — 6 steps:
  - Step 0: Welcome screen
  - Step 1: Date of Birth (date input)
  - Step 2: Family Status (single select: Individual, Couple, Family with Young Kids, Family with Teenagers, Single Parent, Empty Nester, Senior)
  - Step 3: Interests (multi-select: Running, Gardening, Board Games, Cooking, Reading, Cycling, Pets, Photography, Music, Fitness, Hiking, Yoga)
  - Step 4: Loading spinner (auto-advances to Step 5 after 2000ms)
  - Step 5: Recommendations — horizontal scroll carousel of top 3 interest groups + top 3 recommended events → "Get Started" calls `onComplete()`
- **App.tsx** starts at `authScreen: 'login'` → `'signup'` → `'main'`

### Bottom Navigation (BottomNav.tsx)
4 tabs: **Events · Explore · Marketplace · Messages**
Icons: Calendar, Compass, ShoppingBag, MessageCircle

### Tab 1 — Events (Home Dashboard) `EventsPage.tsx`
- Profile avatar button (orange "Y" circle) **top-left** → opens Profile overlay
- Notification bell icon **top-right** (shows red dot)
- "Good morning ☀️" greeting, Bishan-AMK Estate + Verified badge
- Two sub-tabs: **Upcoming** | **Signed Up**
- **Upcoming tab:**
  - "Your Interest Groups" horizontal carousel (Morning Runners, Backyard Gardeners, Board Game Sundays) + "More →" arrow
  - "Recommended Events" vertical list (3 events with image thumbnails)
  - "Saved Events" section (shows if any saved; cards are clickable → navigates to Explore)
  - "My Wishlist" section (horizontal scroll of saved marketplace items)
- **Signed Up tab:** list of registered events with green "Registered ✓" badge
- Props: `{ onOpenProfile, onOpenEvent, savedEvents }`

### Tab 2 — Explore `ExplorePage.tsx`
Two segments inside the page: **Events** | **Connect**

**Events segment:**
- Search bar + Filter button
- Category pills: All, Fitness, Cooking, Gardening, Board Games, Wellness
- Featured event card (large image) + upcoming list
- Event detail page includes: Calendar, MapPin, Globe, Users, **Family Status** fields
- Full flow: detail → share → singpass → recipient-detail → register → browser

**Connect segment (formerly Neighbours):**
- Interest filter pills
- Neighbour cards with **real photos** (Unsplash) + colored avatar fallback
- Top Matches horizontal scroll
- Clicking neighbour → profile screen with **"Invite"** button (NOT "Jio")
- Invite flow → chat
- Group discovery sheet
- Group Space (chat + activity tabs)
- "Interest Groups I'm In" section
- Group create screen
- All "Jio" renamed to "Invite" throughout

**Neighbours data** (6 neighbours with names: Alex T., Mei L., Raj K., Sarah C., Jun W., Nurul A.)

### Tab 3 — Marketplace `HelpSharePage.tsx`
- Header: "Marketplace" (renamed from "Help & Share")
- Two tabs: **Requests** | **Items & Services** (merged listings + services)
- Search bar: "Search requests, items and services..."
- Filter chips on Items & Services tab: All | Items | Services
- Items shown in 2-column grid; Services in vertical list
- Each detail page has:
  - **Wishlist heart button** (save/unsave with toast)
  - **Reviews section** (3 mock reviews with star ratings + avatar)
- Post flows: Request, List an Item, Offer a Service
- Props: `{ wishlist?: number[], onWishlistToggle?: (id: number) => void }`
- Item IDs: 101–104 (items), 201–204 (services), 1–4 (requests)

### Tab 4 — Messages `MessagesPage.tsx`
- Header: "Messages" + bell icon
- Filter tabs: All | Groups | Marketplace | Direct
- 5 mock conversations: Morning Runners (group), Backyard Gardeners (group), IKEA Bookshelf (marketplace), Neighbour #2 (direct), Plant Watering Request (marketplace)
- Tapping a conversation opens a chat screen (slide-in animation)
- Chat has message bubbles (me=orange right, them=white left, system=green pill)

### Profile `ProfilePage.tsx` (shown as overlay from Home tab)
- Accessed via profile avatar button on Events tab (not in bottom nav)
- Orange gradient hero header, avatar "Y", Singpass Verified badge, estate pill
- Stats: Events Saved, Neighbours Jio'd, Exchanges Done
- **My Interests** section
- **Rewards & Badges** section (2×2 grid):
  - 🎟️ Event Joiner — UNLOCKED
  - 👥 Group Member — UNLOCKED
  - 🛍️ Trader — UNLOCKED (5 exchanges)
  - 🌟 Community Builder — LOCKED (grayed out)
- **Saved Events** — clickable cards (call `onOpenEvent`)
- **My Posts** — Requests/Listings with status
- **Account** settings menu
- Props: `{ onClose?: () => void, onOpenEvent?: (id: number) => void }`

---

## Design Tokens (used in every file)
```
BG      = '#F5F4F0'   // beige background
CARD    = '#FFFFFF'   // white cards
PRIMARY = '#FF6B47'   // orange
TEXT    = '#0D0D0D'   // dark
TEXT2   = '#6B6B72'   // gray
MUTED   = '#AEAEB2'   // light gray
BORDER  = '#EDEDEC'   // light border
Font: 'DM Sans', sans-serif
```

## Interest Tag Colors
```
Running:      bg #FFF0EC, text #FF6B47
Gardening:    bg #D1FAE5, text #059669
Board Games:  bg #EDE9FE, text #7C3AED
Cooking:      bg #FEF3C7, text #D97706
Reading:      bg #DBEAFE, text #2563EB
Cycling:      bg #CCFBF1, text #0D9488
Pets:         bg #FEF9C3, text #CA8A04
Photography:  bg #FAE8FF, text #A21CAF
Music:        bg #FFE4E6, text #E11D48
Fitness:      bg #DCFCE7, text #16A34A
Hiking:       bg #D1FAE5, text #059669
Yoga:         bg #F3E8FF, text #9333EA
```

---

## File Structure
```
src/
└── app/
    ├── App.tsx                    — root, auth state, tab state, profile overlay
    ├── components/
    │   └── BottomNav.tsx          — 4-tab nav (events/explore/marketplace/messages)
    └── pages/
        ├── LoginPage.tsx          — Singpass login
        ├── SignUpPage.tsx         — 6-step onboarding
        ├── EventsPage.tsx         — Home dashboard
        ├── ExplorePage.tsx        — Events + Connect segments
        ├── HelpSharePage.tsx      — Marketplace
        ├── MessagesPage.tsx       — Consolidated chats
        ├── ProfilePage.tsx        — Profile overlay
        └── NeighboursPage.tsx     — (legacy, no longer used in nav)
```

---

## Known Issues / Not Yet Done
- `NeighboursPage.tsx` is now unused (superseded by Connect segment in ExplorePage) — can be deleted
- `HelpSharePage` wishlist props not fully wired in `App.tsx` (wishlist state exists but not passed)
- No real Singpass integration (UI only)
- No backend / API (all mock data)
- Notification bell shows toast only, no real notification list
- Saved events from EventsPage don't persist to ProfilePage (separate state)

---

## What Was Done Last Session (2026-04-13/14)
1. Created GitHub repo: https://github.com/laibamaqsood88/P3-HDB-community-App
2. Renamed "Help & Share" → "Marketplace" in bottom nav
3. Renamed "Neighbours" → "Connect" in bottom nav
4. Implemented the full feature list:
   - Singpass-only login page
   - 3-question onboarding with loading + recommendations
   - Notification bell on home
   - Profile button moved to top-left of home, removed from bottom nav
   - Rewards & Badges section in Profile
   - Saved events clickable
   - Chat/Messages tab (consolidated)
   - Wishlist section
   - Interest Groups section on home with "More" arrow
   - Events sub-tabs: Upcoming + Signed Up
   - Explore tab with Events + Connect segments
   - Family Status field on event detail
   - Neighbour photos on circular icons
   - Jio → Invite rename
   - Marketplace: merged Items & Services, search bar, reviews, wishlist save
