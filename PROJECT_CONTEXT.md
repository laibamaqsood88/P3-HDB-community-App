# NeighbourHood App — Project Context

## Last Updated
2026-04-14

## GitHub Repository
https://github.com/laibamaqsood88/P3-HDB-community-App

## What This App Is
A Singapore HDB community mobile web app called **NeighbourHood**. It connects verified HDB residents within an estate (Bishan-AMK Estate in the demo) via Singpass identity verification. Stack: React 18 + TypeScript + Vite, inline styles, Framer Motion (`motion/react`), Lucide React icons, Sonner toasts. No backend — all mock data.

## How to Run
```bash
cd /Users/nurleeyana/Desktop/P3
npm run dev        # starts on http://localhost:5173
```
Preview server config: `.claude/launch.json` (port 5173, `npm run dev`).

---

## File Structure
```
src/
├── styles/
│   └── theme.css                  — CSS variables + .no-scrollbar utility
└── app/
    ├── App.tsx                    — root: auth state, tab routing, profile overlay, cross-tab callbacks
    ├── components/
    │   └── BottomNav.tsx          — 4-tab nav (Events / Explore / Marketplace / Messages)
    └── pages/
        ├── LoginPage.tsx          — Singpass login screen
        ├── SignUpPage.tsx         — 6-step onboarding
        ├── EventsPage.tsx         — Home dashboard (Tab 1)
        ├── ExplorePage.tsx        — Events + Groups sub-tabs (Tab 2)
        ├── ConnectPage.tsx        — Groups list + detail (used inside ExplorePage)
        ├── HelpSharePage.tsx      — Marketplace (Tab 3)
        ├── MessagesPage.tsx       — Group + direct chats (Tab 4)
        ├── ProfilePage.tsx        — Profile overlay (opened from Home)
        └── RequestsPage.tsx       — Requests page (new)
```

---

## Design Tokens (used in every file)
```
BG      = '#F5F4F0'   // beige background
CARD    = '#FFFFFF'   // white cards
PRIMARY = '#FF6B47'   // orange accent
TEXT    = '#0D0D0D'   // near-black
TEXT2   = '#6B6B72'   // medium gray
MUTED   = '#AEAEB2'   // light gray
BORDER  = '#EDEDEC'   // light border
Font: 'DM Sans', sans-serif
```

### Scrollbar Hiding
Apply `className="no-scrollbar"` to any scrollable element to hide the scrollbar while keeping scroll functionality. Defined in `src/styles/theme.css`.

---

## Auth Flow (`App.tsx`)
- `authScreen` state: `'login'` → `'signup'` → `'main'`
- **LoginPage** → calls `onLogin()` → goes to signup
- **SignUpPage** → calls `onComplete()` → enters main app
- Main app has `activeTab` state and a `showProfile` overlay

### Cross-tab Navigation (App.tsx callbacks)
- `openExploreGroups()` — switches to Explore tab, opens Groups sub-tab
- `openGroupChat(groupId)` — switches to Messages tab, opens specific group chat (passes `initialConvId` + `key` to force remount)
- `onOpenMarketplace()` — switches to Marketplace tab

---

## Tab 1 — Home Dashboard (`EventsPage.tsx`)

### Header
- Profile avatar button (orange "Y") **top-left** → opens Profile overlay
- App name "NeighbourHood" centered
- Bell icon **top-right** → opens **notification bottom sheet**

### Notification System
- 6 notifications (event, group, marketplace types; no lift/community notices)
- Each has a `route` field: `{ to: 'event', eventId }` | `{ to: 'group', groupId }` | `{ to: 'marketplace' }`
- Unread count badge on bell icon
- "Mark all read" button in sheet
- Clicking a notification routes to the relevant page/screen

### Content Sections (scrollable, no scrollbar)
1. **Greeting** — "Good morning ☀️", estate + Verified badge
2. **Your Interest Groups** — horizontal scroll (Morning Runners, Backyard Gardeners, Board Game Sundays) + "More →"; clicking a group card opens its group chat in Messages tab
3. **Latest Request** — single card showing newest marketplace request with trust score dots + expiry badge; tapping opens bottom-sheet detail ("I Can Help!" CTA)
4. **Marketplace Picks** — horizontal scroll of 4 recommended items/services; tapping opens bottom-sheet detail ("I Want This!" / "Request This Service" CTA)
5. **Recommended Events** — vertical list of event cards (image thumbnails); tapping navigates to Explore tab
6. **Saved Events** — shown if any saved
7. **My Wishlist** — horizontal scroll of saved marketplace items

### Sub-tabs
- **Upcoming** — shows all above sections
- **Signed Up** — list of events user registered for

### Props
```ts
{ onOpenProfile, onOpenEvent, onOpenGroups, onOpenGroupChat, onOpenMarketplace, savedEvents }
```

---

## Tab 2 — Explore (`ExplorePage.tsx`)

### Sub-tabs: Events | Groups

### Events Sub-tab
- Search bar + Filter button
- Category pills: All, Fitness, Cooking, Gardening, Board Games, Wellness, Age filter
- Featured event card (large image) + upcoming list
- **Event Detail screen** (matches Home tab style):
  - Date row card, Location row card
  - Organizer card (photo + star rating + review count)
  - About card
  - Hosting panel + Going panel (clickable → Going breakdown screen)
  - Price + Attend toggle button
- **Going Breakdown screen**:
  - Stacked bar chart by family status (6 categories)
  - Neighbours attending list (avatar initials, name, unit, status)
- Full detail flow: detail → share → singpass → recipient-detail → register → browser

### Groups Sub-tab (`ConnectPage.tsx`)
- Groups list with cover image cards (category badge, name, description, members, location, "View →")
- Group detail: hero image, back button, category badge, name, members, MEETS + LOCATION info cards, About, hashtag tags, Join/Leave button
- 8 groups: Morning Runners Club, Peranakan Cooking Circle, Community Garden Guild, Board Game Crew, Seniors Wellness Circle, Parents & Kids Playgroup, Photography Walkers, Neighbourhood Book Club
- Search bar + category filter pills
- "My Groups" horizontal scroll (joined groups)
- No visible scrollbars

---

## Tab 3 — Marketplace (`HelpSharePage.tsx`)
- Header: "Marketplace"
- Two tabs: **Requests** | **Items & Services**
- Search bar
- Filter chips on Items & Services: All | Items | Services
- Items in 2-column grid; Services in vertical list
- Each detail page has: wishlist heart button, reviews section (3 mock reviews)
- Post flows: Request, List an Item, Offer a Service
- Item IDs: 101–104 (items), 201–204 (services), 1–4 (requests)
- Props: `{ wishlist?: number[], onWishlistToggle?: (id: number) => void }`

---

## Tab 4 — Messages (`MessagesPage.tsx`)
- Header: "Messages" + bell icon
- Filter tabs: All | Groups | Marketplace | Direct
- **Conversations**:
  - ID 1: Morning Runners Club (group, green `#16A34A`)
  - ID 2: Backyard Gardeners (group, green `#059669`)
  - ID 3: Board Game Sundays (group, purple `#7C3AED`)
  - IKEA Bookshelf (marketplace)
  - Neighbour #2 (direct)
  - Plant Watering Request (marketplace)
- **Group chat screen** has two tabs: **Chat** | **Activity Board** (default: Chat)
  - Activity Board shows: 📍 Next Meetup, 📋 Upcoming Plan, 🎯 Group Goal + discoverability notice
- Props: `{ initialConvId?: number }` — opens directly to a specific group chat
- `key={initialGroupChatId}` on MessagesPage forces remount when switching group

### GROUP_ACTIVITY mock data
```ts
1: { meetup: 'Saturday 7 AM · Bishan-AMK Park Pavilion', members: 14 }
2: { meetup: 'Saturday 8 AM · Rooftop Garden, Blk 450', members: 9 }
3: { meetup: 'Sunday 2 PM · RC Multi-Purpose Hall, Blk 447', members: 11 }
```

---

## Profile Overlay (`ProfilePage.tsx`)
- Opened via avatar button on Home tab (not in bottom nav)
- Orange gradient hero, avatar "Y", Singpass Verified badge, estate pill
- Stats: Events Saved, Neighbours Jio'd, Exchanges Done
- My Interests section
- Rewards & Badges (2×2 grid): Event Joiner ✓, Group Member ✓, Trader ✓, Community Builder 🔒
- Saved Events (clickable → Explore)
- My Posts (Requests/Listings with status)
- Account settings menu
- Props: `{ onClose?: () => void, onOpenEvent?: (id: number) => void }`

---

## Login Page (`LoginPage.tsx`)
- Animated canvas background (orange blobs)
- 🏘️ logo icon
- App name: **NeighbourHood**
- Tagline: "Connect with neighbours"
- Small text: "Estate-verified · Privacy-first · Singpass secured"
- **"Log in with singpass" button** — positioned directly below the tagline text
- Privacy note + 🦁 Singpass badge at bottom
- No feature pills (removed: Verified Residents Only, Your Estate Only, Real Connections)

---

## Onboarding (`SignUpPage.tsx`)
6 steps: Welcome → Date of Birth → Family Status → Interests → Loading → Recommendations

### Step: Interests ("What are you into?")
- Search bar filters interests in real-time
- **Selected interests appear as removable coloured pills directly below the search bar** (horizontally scrollable, no scrollbar visible)
- Interests grouped by collapsible category dropdowns (animated expand/collapse with `AnimatePresence`)
- Category header shows orange count badge when items selected inside
- When searching: flat pill list shown instead of categories
- "Find my community →" button disabled until ≥1 interest selected

### Interest Categories & Colors
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

## Known Limitations
- No real Singpass integration (UI only)
- No backend / API — all mock data
- Saved events state in EventsPage does not sync to ProfilePage (separate state)
- `HelpSharePage` wishlist props not fully wired in `App.tsx`
- No real push notifications
