# NeighbourHood App — Project Context

## Last Updated
2026-04-15 (Session 3)

## GitHub Repository
https://github.com/laibamaqsood88/P3-HDB-community-App

## What This App Is
A Singapore HDB community mobile web app called **NeighbourHood**. It connects verified HDB residents within an estate (Bishan-AMK Estate in the demo) via Singpass identity verification. Stack: React 18 + TypeScript + Vite, inline styles, Framer Motion (`motion/react`), Lucide React icons, Sonner toasts. No backend — all mock data.

## How to Run
```bash
cd "/Users/laibamaqsood/Desktop/P3 HDB community App"
npm run dev        # starts on http://localhost:5173 (or next available port)
npm run build      # production build to /dist
```

---

## File Structure
```
src/
├── styles/
│   └── theme.css                  — CSS variables + .no-scrollbar utility + Nunito font
└── app/
    ├── App.tsx                    — root: auth state, tab routing, profile overlay, cross-tab callbacks
    ├── components/
    │   └── BottomNav.tsx          — 5-tab floating pill nav
    └── pages/
        ├── LoginPage.tsx          — Singpass login screen
        ├── SignUpPage.tsx         — 6-step onboarding (exports INTEREST_CATEGORIES)
        ├── EventsPage.tsx         — Home dashboard (Tab 1)
        ├── ExplorePage.tsx        — Events + Groups + Neighbours sub-tabs (Tab 2)
        ├── ConnectPage.tsx        — Groups list + detail (used inside ExplorePage)
        ├── HelpSharePage.tsx      — Marketplace (Tab 3)
        ├── RequestsPage.tsx       — Requests page (Tab 4, exports REQUESTS_DATA + REQUESTS_CAT_EMOJIS)
        ├── MessagesPage.tsx       — Group + direct chats (Tab 5)
        ├── NeighboursPage.tsx     — Neighbours feed (used inside ExplorePage)
        └── ProfilePage.tsx        — Profile overlay (opened from Home)
index.html                         — Google Fonts Nunito import
```

---

## Global Design System

### Font
- **Nunito** — imported via Google Fonts CDN in `index.html`
- Applied globally via `body { font-family: 'Nunito', sans-serif }` in `theme.css`
- All inline style objects also specify `fontFamily: "'Nunito', sans-serif"` where needed

### Design Tokens (used in every page file)
```
BG      = '#F7F7F7'              // app background (consistent across all pages)
CARD    = '#FFFFFF'              // white card surfaces
PRIMARY = '#FF6B47'              // brand orange accent
TEXT    = '#1C1C1E'              // near-black (some older pages use '#0D0D0D')
TEXT2   = '#636366'              // medium gray
MUTED   = '#8E8E93' or '#AEAEB2' // light gray
BORDER  = 'rgba(60,60,67,0.12)' // subtle hairline border
```

### Spacing Standards
- **Top padding**: `44px` on all page headers/first content area (accounts for status bar)
- **Bottom padding**: `100px` on all main scroll containers (clears floating nav bar)
- **Card border radius**: `14px–20px`
- **Button border radius**: `12px–14px`
- **Icon size**: typically `20px–24px` for nav, `16px–20px` for inline

### Scrollbar Hiding
Apply `className="no-scrollbar"` to scrollable elements. Defined in `src/styles/theme.css`.

---

## Bottom Nav (`BottomNav.tsx` + `App.tsx`)

### Structure
- **Floating pill** — `position: absolute, bottom: 0, zIndex: 50` inside content area
- White pill container: `background: rgba(248,248,250,0.78)`, `backdropFilter: blur(40px) saturate(2) brightness(1.06)`
- **Active tab**: frosted glass pill highlight (`rgba(255,255,255,0.62)` + blur) with **orange** `#FF6B47` icon + label
- **Inactive tabs**: muted `#8E8E93` icons + labels
- Framer Motion `layoutId="activeNavPill"` spring animation between tabs
- Safe-area wrapper: `padding: '0 14px 24px'`

### Gradient Fade Layer
- `position: absolute, bottom: 0, height: 140px, zIndex: 40` — fades page content into nav
- 5-stop gradient: `transparent → rgba(245,244,240,0.18) → 0.52 → 0.82 → 0.96`
- `pointerEvents: none` so it never blocks scroll/tap

### Visibility
- **Visible**: Home, Explore (all sub-tabs), Marketplace feed, Requests feed, Messages list
- **Hidden**: all detail pages, chat screens, post forms, item/service detail, etc.
- Controlled via `showBottomNav` state in `App.tsx`
- Each page calls `onNavVisibilityChange?(visible: boolean)` callback
- App.tsx resets to `true` on tab change

### Tabs
```
events       → Home       (House icon)
explore      → Explore    (Compass icon)
marketplace  → Market     (ShoppingBag icon)
requests     → Requests   (ClipboardList icon)
messages     → Messages   (MessageCircle icon)
```

---

## Auth Flow (`App.tsx`)
- `authScreen`: `'login'` → `'signup'` → `'main'`
- **LoginPage** → `onLogin()` → signup
- **SignUpPage** → `onComplete({ dob, familyStatus, interests })` → main app; sets `userInterests`
- Main app: `activeTab` + `showProfile` overlay

### App.tsx State
```ts
activeTab: 'events' | 'explore' | 'marketplace' | 'requests' | 'messages'
showProfile: boolean
showBottomNav: boolean
savedEvents: number[]
savedMarketplaceItems: any[]
wishlist: number[]
userInterests: string[]
myPosts: any[]
conversations: any[]
initialGroupChatId: number | undefined
initialRequestId: number | undefined
initialEventId: number | undefined
initialMarketplaceItemId: number | undefined
exploreInitialSubTab: 'events' | 'groups' | 'neighbours'
```

### Cross-tab Navigation Callbacks
```ts
openExploreGroups()              // → Explore tab, Groups sub-tab
openExploreNeighbours()          // → Explore tab, Neighbours sub-tab
openGroupChat(groupId)           // → Messages tab, specific group chat
openRequest(id)                  // → Requests tab (id=0 → feed, id>0 → detail)
onOpenEvent(id)                  // → Explore tab, event detail
onOpenMarketplaceItem(id)        // → Marketplace tab, item/service detail
```

---

## Tab 1 — Home Dashboard (`EventsPage.tsx`)

### Header
- Profile avatar button (orange "Y") top-left → opens Profile overlay
- "NeighbourHood" centered
- Bell icon top-right → notification bottom sheet (unread count badge)

### Notification System
- 6 notifications with `route` field
- Routes: `{ to: 'event', eventId }` | `{ to: 'group', groupId }` | `{ to: 'marketplace' }` | `{ to: 'messages', convId }`
- "Mark all read" button in sheet

### Content Sections (scrollable)
1. **Greeting** — "Good morning ☀️", estate, Verified badge
2. **Your Interest Groups** — horizontal scroll; tapping opens group chat in Messages tab
3. **Latest Requests** — horizontal scroll, compact cards (200px wide); tapping → `onOpenRequest(id)`; "See all" → `onOpenRequest(0)` → Requests feed
4. **Marketplace Picks** — horizontal scroll of 4 items/services
5. **Recommended Events** — vertical list; tapping → Explore tab
6. **Connect with Neighbours** — horizontal scroll cards (220px wide):
   - Category sticker tag (top-left, rotated -1.5deg, inside card)
   - 72×72px square photo (left) + name + location (right)
   - 👋 Say Hello outline button (orange border, white bg)
   - No "View Profile" button

### MOCK_NEIGHBOURS data (EventsPage)
```ts
{ id, name, distance, unit, interests: string[], avatar, color, avatarUrl, lastActive }
```
Real Unsplash photos used. Interest tag shows `interests[0]`.

### Sub-tabs: Upcoming | Signed Up

---

## Tab 2 — Explore (`ExplorePage.tsx`)

### Sub-tabs: Events | Groups | Neighbours

### Events Sub-tab
- Search bar + filter button
- Category pills: All, Fitness, Cooking, Gardening, Board Games, Wellness
- Featured event card (large image) + upcoming list
- Event Detail: date, location, organizer, about, going breakdown charts
- Going Breakdown: By Household Type + By Language charts; Neighbours Attending list (avatar, name, block+distance only)

### Groups Sub-tab (→ `ConnectPage.tsx`)
- 8 groups: Morning Runners Club, Peranakan Cooking Circle, Community Garden Guild, Board Game Crew, Seniors Wellness Circle, Parents & Kids Playgroup, Photography Walkers, Neighbourhood Book Club
- Group detail: hero image, category badge (Lucide icon + text), name, info cards (Clock icon + MapPin icon), About, tags, Members list, Join/Leave button
- Category icons mapped via `getGroupIconElement(emoji, color, size)` helper

### Neighbours Sub-tab (→ `NeighboursPage.tsx`)
- Neighbour cards redesigned to match reference:
  - Category sticker tag top-left (inside card, rotated -1.5deg)
  - Square photo + name/location side by side
  - 👋 Say Hello button (outline, orange border)
- NEIGHBOURS data has: `{ id, name, avatarUrl, sharedInterests, allInterests, sharedCount, proximity, distance, verified, avatarColor }`
- Real Unsplash photos

---

## Tab 3 — Marketplace (`HelpSharePage.tsx`)
- Sub-tabs: **Items** | **Services**
- Items: 2-column grid (IDs 101–110)
- Services: vertical list (IDs 201–210)
- FAB button: `position: absolute, bottom: 96px, zIndex: 60` (above nav)
- Filter panel: `zIndex: 61`
- NavStack screens: `'feed' | 'item-detail' | 'service-detail' | 'neighbour-profile' | 'poster-notif' | 'mutual-confirm' | 'chat' | 'category-select' | 'item-post-photo' | 'item-post-form' | 'service-post' | 'post-success'`
- Props: `{ onAddPost, initialItemId?, savedItems, onSaveToggle, onNavVisibilityChange }`

---

## Tab 4 — Requests (`RequestsPage.tsx`)
- Exports: `REQUESTS_DATA`, `REQUESTS_CAT_EMOJIS`
- Props: `{ onAddPost, initialRequestId?, onNavVisibilityChange }`
- FAB: `position: absolute, zIndex: 60` (above nav)
- Category icon map: `CAT_ICON_MAP` using Lucide icons (HomeIcon, ShoppingCart, Wrench, Package, BookOpen, Handshake, ShoppingBag, SearchIcon)
- Privacy notices use Lock icon instead of 🔒 emoji
- Post form fields: Title → Category → Type → Description → Location → Expires on

---

## Tab 5 — Messages (`MessagesPage.tsx`)
- Header: "Messages" + bell icon
- Filter tabs: All | Groups | Marketplace | Direct
- Conversations: 6 items (IDs 1-6); avatars use 2-letter initials, no emojis
- Group chat: Chat | Activity Board tabs
- Activity Board icons: MapPin, ClipboardList, Target (Lucide, no emojis)
- Props: `{ initialConvId?, extraConversations?, onNavVisibilityChange }`

---

## Profile Overlay (`ProfilePage.tsx`)
- Opened via avatar on Home tab
- Props: `{ onClose, onOpenEvent, onOpenMarketplaceItem, onOpenRequest, myPosts, userInterests, onUpdateInterests }`
- Sections: `'main' | 'settings' | 'saved-items' | 'my-posts'`
- Main: gradient hero, avatar, Singpass badge, My Interests (live from App.tsx), Rewards/Badges grid, Saved Items row, My Posts row
- Badges use CalendarDays, Users, ShoppingBag, Lock icons (no emojis)
- Settings: Account, Notifications, Privacy, Help sections

---

## Onboarding (`SignUpPage.tsx`)
6 steps: Welcome → Date of Birth → Family Status → Interests → Loading → Recommendations

### Exports
```ts
export const INTEREST_CATEGORIES: { name: string; interests: string[] }[]
```

### Welcome screen
- Home icon (Lucide) in orange gradient container (no 🏘️ emoji)
- "Welcome to NeighbourHood" (no emoji)

### Interest step
- Search bar, collapsible category dropdowns, selected pills, orange count badges
- "Find my community →" disabled until ≥1 interest

---

## Icon Policy (No Emojis)
All emoji have been replaced with Lucide React icons throughout the app:
- 🏘️ → `<Home />` (LoginPage, SignUpPage)
- 📍 → `<MapPin />` (NeighboursPage, ConnectPage, ExplorePage)
- 💬 → `<MessageCircle />` (ExplorePage share sheet)
- 📋 → `<ClipboardList />` / `<Copy />`
- 🔒 → `<Lock />` (RequestsPage privacy notices)
- 📸 → `<Camera />` (ConnectPage group icon)
- 📚 → `<BookOpen />`
- 🧘 → `<Smile />`  (yoga/wellness group)
- 🎯 → `<Target />` (group activity board)
- Toast messages: emoji removed from success toasts

---

## Navigation Patterns

### NavStack Pattern
```ts
useState<{ screen: string; params?: any }[]>([{ screen: 'feed' }])
const goTo = (screen, params?) => setNavStack(p => [...p, { screen, params }])
const goBack = () => setNavStack(p => p.slice(0, -1))
const current = navStack[navStack.length - 1]
```

### Bottom Sheet Pattern
```tsx
<AnimatePresence>
  {showSheet && (
    <>
      <motion.div /* backdrop */ style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 19 }} onClick={() => setShowSheet(false)} />
      <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        style={{ position: 'absolute', left: 0, right: 0, bottom: 0, borderRadius: '20px 20px 0 0', zIndex: 20 }}
      />
    </>
  )}
</AnimatePresence>
```

### Z-index Layers
```
Page content:     0
Gradient fade:   40
Bottom nav pill: 50
FAB buttons:     60
Filter panels:   61
Profile overlay: 100+
```

---

## Responsive Layout
- All page wrappers: `width: '100%'`, `height: '100%'`
- Root: `width: '100vw'`, `height: '100svh'`, `overflow: 'hidden'`
- Horizontal scroll rows: `display: 'flex'`, `overflowX: 'auto'`, cards use `flexShrink: 0` with fixed widths (fine for scroll)
- Two-column grids: `width: 'calc(50% - 6px)'`
- No hardcoded `width: '390px'` or similar viewport-specific values
- Buttons/inputs: `width: '100%'`

---

## Known Limitations
- No real Singpass integration (UI only)
- No backend / API — all mock data
- Saved events state in EventsPage does not sync to ProfilePage
- No real push notifications
- ConnectPage `membersList` shows a subset of total `members` count (mock only)
