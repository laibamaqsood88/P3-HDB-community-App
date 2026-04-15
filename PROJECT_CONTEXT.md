# NeighbourHood App — Project Context

## Last Updated
2026-04-15

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
    │   └── BottomNav.tsx          — 5-tab nav (Events / Explore / Marketplace / Requests / Messages)
    └── pages/
        ├── LoginPage.tsx          — Singpass login screen
        ├── SignUpPage.tsx         — 6-step onboarding (exports INTEREST_CATEGORIES)
        ├── EventsPage.tsx         — Home dashboard (Tab 1)
        ├── ExplorePage.tsx        — Events + Groups + Neighbours sub-tabs (Tab 2)
        ├── ConnectPage.tsx        — Groups list + detail (used inside ExplorePage)
        ├── HelpSharePage.tsx      — Marketplace (Tab 3)
        ├── RequestsPage.tsx       — Requests page (Tab 4, exports REQUESTS_DATA + REQUESTS_CAT_EMOJIS)
        ├── MessagesPage.tsx       — Group + direct chats (Tab 5)
        └── ProfilePage.tsx        — Profile overlay (opened from Home)
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
Font: 'Nunito', sans-serif
```

### Scrollbar Hiding
Apply `className="no-scrollbar"` to any scrollable element to hide the scrollbar while keeping scroll functionality. Defined in `src/styles/theme.css`.

---

## Auth Flow (`App.tsx`)
- `authScreen` state: `'login'` → `'signup'` → `'main'`
- **LoginPage** → calls `onLogin()` → goes to signup
- **SignUpPage** → calls `onComplete({ dob, familyStatus, interests })` → enters main app; sets `userInterests` state
- Main app has `activeTab` state and a `showProfile` overlay

### App.tsx State
```ts
activeTab: 'events' | 'explore' | 'marketplace' | 'requests' | 'messages'
showProfile: boolean
savedEvents: number[]
wishlist: number[]
userInterests: string[]           // from onboarding, synced to ProfilePage
myPosts: any[]
conversations: any[]
initialGroupChatId: number | undefined
initialRequestId: number | undefined
initialEventId: number | undefined
initialMarketplaceItemId: number | undefined
exploreInitialSubTab: 'events' | 'groups' | 'neighbours'
```

### Cross-tab Navigation (App.tsx callbacks)
- `openExploreGroups()` — switches to Explore tab, opens Groups sub-tab
- `openExploreNeighbours()` — switches to Explore tab, opens Neighbours sub-tab
- `openGroupChat(groupId)` — switches to Messages tab, opens specific group chat
- `openRequest(id)` — `setInitialRequestId(id || undefined)`, switches to Requests tab
- Profile `onOpenEvent(id)` — sets `initialEventId`, switches to Explore (events sub-tab)
- Profile `onOpenMarketplaceItem(id)` — sets `initialMarketplaceItemId`, switches to Marketplace tab
- Profile `onOpenRequest(id)` — calls `openRequest(id)`
- `key` prop forces remount on ExplorePage, HelpSharePage, RequestsPage when their `initial*Id` changes

---

## Tab 1 — Home Dashboard (`EventsPage.tsx`)

### Header
- Profile avatar button (orange "Y") **top-left** → opens Profile overlay
- App name "NeighbourHood" centered
- Bell icon **top-right** → opens **notification bottom sheet**

### Notification System
- 6 notifications with `route` field
- Notification routes: `{ to: 'event', eventId }` | `{ to: 'group', groupId }` | `{ to: 'marketplace' }` | `{ to: 'messages', convId }`
- "Neighbour replied to your request" → `{ to: 'messages', convId: 5 }` → opens conversation #5
- Unread count badge on bell icon; "Mark all read" button in sheet

### Content Sections (scrollable, no scrollbar)
1. **Greeting** — "Good morning ☀️", estate + Verified badge
2. **Your Interest Groups** — horizontal scroll + "More →"; clicking opens group chat in Messages tab
3. **Latest Requests** — horizontal scroll of 5 compact cards (200px wide each), no trust score; tapping calls `onOpenRequest(r.id)` → navigates to full request detail in Requests tab; "See all ›" button beside title calls `onOpenRequest(0)` → shows full Requests feed
4. **Marketplace Picks** — horizontal scroll of 4 items/services
5. **Recommended Events** — vertical list; tapping navigates to Explore tab
6. **Connect with Neighbours** — list of nearby neighbours; "View Profile" opens a bottom sheet showing name, block (no unit number), distance, interests as coloured pills, "Say Hello" button

### Sub-tabs
- **Upcoming** — shows all above sections
- **Signed Up** — list of events user registered for (no "signed up" subtitle text)

### Props
```ts
{
  onOpenProfile, onOpenEvent, onOpenGroups, onOpenGroupChat,
  onOpenMarketplace, savedEvents, onOpenNeighbours, onOpenRequest
}
```

---

## Tab 2 — Explore (`ExplorePage.tsx`)

### Sub-tabs: Events | Groups | Neighbours

### Events Sub-tab
- Search bar + Filter button
- Category pills: All, Fitness, Cooking, Gardening, Board Games, Wellness, Age filter
- Featured event card (large image) + upcoming list
- **Event Detail screen**: Date row, Location row, Organizer card, About card, Hosting/Going panels, Price + Attend toggle
- **Going Breakdown screen**: two horizontal bar charts (By Household Type, By Language Spoken) + Neighbours Attending list
  - `FAMILY_STATUS_BREAKDOWN`: Single, Couple, Living with kids, Living with parents, Multigenerational, Senior (60+)
  - `LANGUAGE_BREAKDOWN`: English, Mandarin, Malay, Tamil, Multilingual
  - Neighbours Attending: shows avatar initials, name, block + distance only (no family status pill)

### Search Overlay (when search bar is tapped)
- Header row: X button | Events / Groups / Neighbours tabs | Search button
- White card below with a single text input (no left icon, no location row)

### Groups Sub-tab (`ConnectPage.tsx`)
- Groups list with cover image cards (category badge, name, description, members, location, "View →")
- Group detail: hero image, back button, category badge, name, members count, info cards (Meets, Location), About, tags, Members section, Join/Leave button
- **Members section** on detail page: shows `GroupMember[]` (avatar initials, name, block) as a static list; count in header matches list length; no popup or "+more" button
- `GroupMember` type: `{ name: string; block: string; avatar: string; color: string }`
- All 8 groups have `membersList` populated: Morning Runners Club (6), Peranakan Cooking Circle (5), Community Garden Guild (7), Board Game Crew (5), Seniors Wellness Circle (5), Parents & Kids Playgroup (6), Photography Walkers (4), Neighbourhood Book Club (5)
- 8 groups: Morning Runners Club, Peranakan Cooking Circle, Community Garden Guild, Board Game Crew, Seniors Wellness Circle, Parents & Kids Playgroup, Photography Walkers, Neighbourhood Book Club
- Search bar + category filter pills; "My Groups" horizontal scroll (joined groups)

### Neighbours Sub-tab
- List of nearby neighbours showing avatar, name, **block number only** (no unit number), distance
- Format: `{n.unit.split(' #')[0]} · {n.distance}` (e.g., "Blk 445 · 2 min walk")
- "View Profile" button → opens bottom sheet showing name, block+distance, interests as coloured pills, "Say Hello" button
- No "Profile coming soon!" toast

---

## Tab 3 — Marketplace (`HelpSharePage.tsx`)
- Header: "Marketplace"
- Two tabs: **Requests** | **Items & Services**
- Search bar; filter chips on Items & Services: All | Items | Services
- Items in 2-column grid; Services in vertical list
- Each detail page has: wishlist heart button, reviews section
- Post flows: Request, List an Item, Offer a Service
- Item IDs: 101–104 (items), 201–204 (services)
- Props: `{ onAddPost, initialItemId?: number }` — `initialItemId` opens directly to item/service detail

---

## Tab 4 — Requests (`RequestsPage.tsx`)
- Exports: `REQUESTS_DATA` (alias for `INITIAL_REQUESTS`), `REQUESTS_CAT_EMOJIS` (alias for `CAT_EMOJIS`)
- Props: `{ onAddPost, initialRequestId?: number }` — `initialRequestId` opens directly to request detail
- `initialRequestId = undefined` → shows full requests feed
- `openRequest(0)` in App.tsx → `0 || undefined` = `undefined` → shows feed (used by "See all" in Home)

### Post a Request form fields
Title → Category → Type of Request → Description → **Location** (placeholder: "Location of request") → Post expires on

### Request Detail page
- Location shown once inside the `CollectionPointMap` component, labelled **"Location"** (not "Meetup Location")

---

## Tab 5 — Messages (`MessagesPage.tsx`)
- Header: "Messages" + bell icon
- Filter tabs: All | Groups | Marketplace | Direct
- **Conversations**:
  - ID 1: Morning Runners Club (group, green `#16A34A`)
  - ID 2: Backyard Gardeners (group, green `#059669`)
  - ID 3: Board Game Sundays (group, purple `#7C3AED`)
  - ID 4: IKEA Bookshelf (marketplace)
  - ID 5: Plant Watering Request (marketplace/direct) ← target for "neighbour replied to your request" notification
  - Neighbour #2 (direct)
- **Group chat screen**: Chat | Activity Board tabs
  - Activity Board: 📍 Next Meetup, 📋 Upcoming Plan, 🎯 Group Goal
- Props: `{ initialConvId?: number, extraConversations?: any[] }`
- `key={initialGroupChatId}` forces remount when switching group

---

## Profile Overlay (`ProfilePage.tsx`)
- Opened via avatar button on Home tab (not in bottom nav)
- `activeSection`: `'main' | 'settings' | 'saved-items' | 'my-posts'`
- Props:
  ```ts
  {
    onClose?: () => void
    onOpenEvent?: (id: number) => void
    onOpenMarketplaceItem?: (id: number) => void
    onOpenRequest?: (id: number) => void
    myPosts?: any[]
    userInterests?: string[]          // from App.tsx, synced from onboarding
    onUpdateInterests?: (interests: string[]) => void
  }
  ```

### Main Screen Layout
- Orange gradient hero; avatar "Y" at `marginTop: '52px'` (avoids X button overlap); Singpass Verified badge; estate pill
- **No stats row** (removed: Events Saved, Neighbours Jio'd, Exchanges Done)
- **My Interests** — shows live `userInterests` as coloured pills; `+Edit` button opens interest edit bottom sheet using `INTEREST_CATEGORIES` from SignUpPage; changes sync back via `onUpdateInterests`
- **Rewards & Badges** (2×2 grid): Event Joiner ✓, Group Member ✓, Trader ✓, Community Builder 🔒
- **Saved Items** — settings-style nav row (Bookmark icon + ChevronRight) → `SavedItemsScreen`
- **My Posts** — settings-style nav row (FileText icon + ChevronRight) → `MyPostsScreen`
- **No Account section** on main page (moved to Settings)

### SavedItemsScreen
- Search bar + filter tabs: All | Events | Marketplace | Requests
- Each item has `sourceId`; tapping calls the correct navigation callback:
  - Events → `onOpenEvent(sourceId)`
  - Marketplace → `onOpenMarketplaceItem(sourceId)`
  - Requests → `onOpenRequest(sourceId)`
- SAVED_ITEMS sourceIds: Event 1 → sourceId:1, Event 2 → sourceId:2, Item 3 → sourceId:101, Request 4 → sourceId:1

### MyPostsScreen
- Search bar + filter tabs: All | Marketplace | Requests
- Shows active and expired posts (expired have badge)
- Tapping post → `PostDetailScreen`

### PostDetailScreen
- Actions: Edit Details (bottom sheet), Mark as Sold, View Chat, Delete (confirm sheet)
- Expired requests: Renew Request action (date picker sheet)

### SettingsScreen
- Account section (moved from main): Edit Profile, Change Password, Linked Accounts, Delete Account
- Notifications section
- Privacy & Security section
- Help & Support section

---

## Onboarding (`SignUpPage.tsx`)
6 steps: Welcome → Date of Birth → Family Status → Interests → Loading → Recommendations

### Exports
```ts
export const INTEREST_CATEGORIES: { name: string; interests: string[] }[]
```
Used by ProfilePage for the interest edit bottom sheet.

### Step: Interests ("What are you into?")
- Search bar filters interests in real-time
- Selected interests appear as removable coloured pills below search bar (horizontally scrollable)
- Interests grouped by collapsible category dropdowns (AnimatePresence)
- Category header shows orange count badge when items selected inside
- "Find my community →" button disabled until ≥1 interest selected
- No confetti emoji anywhere on this page

### Interest Categories & Colors (NEIGHBOUR_INTEREST_COLORS in ExplorePage)
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

## Navigation Patterns

### NavStack Pattern
Pages use `useState<NavFrame[]>` where `NavFrame = { screen: string; data?: any }`. Back button pops the last frame.

### Bottom Sheet Pattern
```tsx
<AnimatePresence>
  {showSheet && (
    <>
      <motion.div /* backdrop */ onClick={() => setShowSheet(false)} />
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        /* sheet content */
      />
    </>
  )}
</AnimatePresence>
```

### Cross-tab from Profile
Profile → App.tsx callbacks → set `initial*Id` state → change `activeTab` → target page receives `initialItemId`/`initialRequestId` prop → `key` prop forces remount → page starts at detail screen

---

## Known Limitations
- No real Singpass integration (UI only)
- No backend / API — all mock data
- Saved events state in EventsPage does not sync to ProfilePage (separate state)
- `HelpSharePage` wishlist props not fully wired in `App.tsx`
- No real push notifications
- ConnectPage `membersList` shows a subset of the total `members` count (mock data only)
