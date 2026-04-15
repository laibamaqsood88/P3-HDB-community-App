# NeighbourHood App — Context

## Last Updated
2026-04-15 (session 2)

## GitHub Repository
https://github.com/laibamaqsood88/P3-HDB-community-App

## What This App Is
A Singapore HDB community mobile web app called **NeighbourHood**. It connects verified HDB residents within an estate (Bishan-AMK Estate in the demo) via Singpass identity verification. Stack: React 18 + TypeScript + Vite, inline styles, Framer Motion (`motion/react`), Lucide React icons, Sonner toasts. No backend — all mock data.

## How to Run
```bash
cd "C:\Users\User\Desktop\p3 v2"
npm run dev        # starts on http://localhost:5173
```

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
        └── RequestsPage.tsx       — Requests page
```

---

## Design Tokens
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

Apply `className="no-scrollbar"` to any scrollable element to hide scrollbars while keeping scroll functionality.

---

## Auth Flow (`App.tsx`)
- `authScreen` state: `'login'` → `'signup'` → `'main'`
- **LoginPage** → calls `onLogin()` → goes to signup
- **SignUpPage** → calls `onComplete()` → enters main app
- Main app has `activeTab` state and a `showProfile` overlay

### App.tsx State
```ts
savedMarketplaceItems: any[]          // full item/service objects that have been bookmarked
savedMarketplaceIds: number[]         // derived from savedMarketplaceItems for SaveButton checks
onMarketplaceSaveToggle(id, item)     // adds/removes full item object from savedMarketplaceItems
```

### Cross-tab Navigation Callbacks
- `openExploreGroups()` — switches to Explore tab, opens Groups sub-tab
- `openGroupChat(groupId)` — switches to Messages tab, opens specific group chat
- `onOpenMarketplace()` — switches to Marketplace tab
- `onOpenDirectChat(conv)` — adds `conv` to `conversations` state, sets `initialGroupChatId` to `conv.id`, switches to Messages tab (passed to `ExplorePage` → `NeighboursTab`)

---

## Tab 1 — Home Dashboard (`EventsPage.tsx`)

### Header
- Profile avatar button (orange "Y") top-left → opens Profile overlay
- App name "NeighbourHood" centered
- Bell icon top-right → opens notification bottom sheet

### Notification System
- 6 notifications (event, group, marketplace types)
- Each has a `route` field: `{ to: 'event', eventId }` | `{ to: 'group', groupId }` | `{ to: 'marketplace' }`
- Unread count badge on bell icon; "Mark all read" button in sheet

### Content Sections
1. **Greeting** — "Good morning ☀️", estate + Verified badge
2. **Your Interest Groups** — horizontal scroll (Morning Runners, Backyard Gardeners, Board Game Sundays) + "More →"
3. **Latest Request** — single card showing newest marketplace request
4. **Marketplace Picks** — horizontal scroll of 4 recommended items/services
5. **Recommended Events** — vertical list of event cards
6. **Saved Events** — shown if any saved
7. **My Wishlist** — horizontal scroll of saved marketplace items

### Sub-tabs
- **Upcoming** — shows all above sections
- **Signed Up** — list of events user registered for

### Props
```ts
{ onOpenProfile, onOpenEvent, onOpenGroups, onOpenGroupChat, onOpenMarketplace, onOpenNeighbours, onOpenRequest, savedEvents }
```

---

## Tab 2 — Explore (`ExplorePage.tsx`)

### Shared Header (all sub-tabs)
- Explore-style **search pill**: rounded pill (border-radius 50px), search icon left, label text, shows `"query"` subtitle when active, clear X button, box-shadow. Tapping opens a full-screen search overlay.
- **Filter button**: circular (46px), `SlidersHorizontal` icon, orange when active with count badge
- **Sub-tabs**: underline style — `2.5px solid PRIMARY` on active, transparent otherwise; `PRIMARY` colour when active, `MUTED` when not
- No location subtitle ("Singapore" removed) — label shows filter context only

### Sub-tabs: Events | Groups | Neighbours

#### Events Sub-tab
- Search bar + Filter button
- Category pills: All, Fitness, Cooking, Gardening, Board Games, Wellness, Age filter
- Featured event card (large image) + upcoming list
- **Event Detail**: Date row, Location row, Organizer card, About card, Hosting/Going panels, Price + Attend toggle
- **Going Breakdown screen**: Stacked bar chart by family status + neighbours attending list

#### Groups Sub-tab (`ConnectPage.tsx`)
- 8 groups: Morning Runners Club, Peranakan Cooking Circle, Community Garden Guild, Board Game Crew, Seniors Wellness Circle, Parents & Kids Playgroup, Photography Walkers, Neighbourhood Book Club
- Search bar + category filter pills
- "My Groups" horizontal scroll
- Group detail: hero image, name, members, MEETS + LOCATION info, About, hashtags, Join/Leave button

#### Neighbours Sub-tab
- Lists `MOCK_NEIGHBOURS` (8 neighbours) with name, unit, distance, interests, last active time
- Search + filter (distance / shared interests / recently active)
- Each card shows interest pills (shared ones highlighted), **Message** button + View Profile button
- **Message button**: creates a direct conversation object, calls `onOpenDirectChat(conv)` → adds conv to `extraConversations` in `MessagesPage` and switches app to Messages tab, opening that chat
- No "Connect" button — removed in favour of Message

---

## Tab 3 — Marketplace (`HelpSharePage.tsx`)

### Overview
- Two tabs: **Items** | **Services** — underline style (matching Explore page tabs), not pill/toggle
- **Header**: no location pin, no large "Marketplace" heading, no description subtitle
- **Search bar**: explore-style rounded pill (border-radius 50px, shadow, search icon, inline input, clear X). Filter button is circular (46px).
- Both Items and Services use a **2-column grid**
- Save system: **Bookmark icon only** (no hearts anywhere). State lifted to `App.tsx` and synced to Profile → Saved Items
- Post button (orange FAB) → Category Select → Item or Service post flow

### Props
```ts
{
  onAddPost?: (post: any) => void;
  initialItemId?: number;
  savedItems?: number[];                         // from App.tsx (savedMarketplaceIds)
  onSaveToggle?: (id: number, item: any) => void; // from App.tsx (onMarketplaceSaveToggle)
}
```

### Mock Item Data (IDs 101–104)
Each item has:
```ts
{
  id, itemType: 'item', name, condition, distance, postedTime, price,
  category, brand, verified, description,
  collectionAddress,   // exact "Blk X Street Y, #NN-NN, Singapore XXXXXX"
  collectionDistance,  // kept for reference but not displayed
  image,               // Unsplash URL
  seller: { name, avatarColor, rating, reviews }
}
```

Condition values: `'brand new' | 'like new' | 'lightly used' | 'well used' | 'heavily used'`

Condition colours (`CONDITION_COLORS`):
```ts
'brand new':    { bg: '#EDE9FE', text: '#7C3AED' }
'like new':     { bg: '#DCFCE7', text: '#16A34A' }
'lightly used': { bg: '#DBEAFE', text: '#2563EB' }
'well used':    { bg: '#FEF3C7', text: '#D97706' }
'heavily used': { bg: '#FEE2E2', text: '#DC2626' }
```

### Mock Service Data (IDs 201–204)
Each service has:
```ts
{
  id, itemType: 'service', name, rate, distance, postedTime,
  category, availability, verified, trust, trustNote,
  description, responseTime, completedServices, yearsExperience,
  image,   // Unsplash URL
  provider: { name, avatarColor, rating, reviews }
}
```

Services: Dog Walking (201), Babysitting (202), Primary Math Tutoring (203), Elderly Companion (204)

### ItemCard (2-col grid)
Strict layout order:
1. Image thumbnail (120 px height) — bookmark icon top-right
2. Title
3. Price (green if Free)
4. Distance ("X km away")
5. Posted time (relative)
6. Seller info row: circular avatar + name

### ServiceCard (2-col grid — mirrors ItemCard exactly)
Strict layout order:
1. Image thumbnail (120 px height) — bookmark icon top-right
2. Title
3. Rate (green if Free — e.g. "$15 per walk", "Free")
4. Distance ("X km away")
5. Posted time (relative)
6. Provider info row: circular avatar + name

No star ratings, exchange counts, or trust badges on the card.

### ItemDetail (item detail page)
Layout order:
1. Hero image (full-width, 260 px) — floating back button (top-left) + bookmark (top-right)
2. Title
3. Price
4. **Details** section — rows card (BG background, dividers):
   - Condition (coloured value from CONDITION_COLORS)
   - Brand (if present)
   - Posted
   - Category
5. Description
6. **Collection Point** — `CollectionPointMap` with exact `collectionAddress` in footer
7. **About the Neighbour** — tappable card: avatar, name, star rating, review count
8. Sticky footer: "Chat" button only

### ServiceDetail (service detail page)
Layout order:
1. Hero image (full-width, 260 px) — floating back button + bookmark
2. Title
3. Rate (green if Free)
4. **Details** section — rows card: Category · Availability · Posted
5. Description
6. **Location** — `CollectionPointMap` with `distanceText={item.distance}` (shows distance, not address; labelled "Service Area")
7. **About the Neighbour** — tappable card: avatar, name, star rating, reviews, years experience
8. **Trust & Verification** — rows card: Verified Resident · Credentials (if trust) · Response Time · Completed Services
9. Sticky footer: "Chat" button only

No reviews section on either detail page.

### CollectionPointMap component
```ts
function CollectionPointMap({ address?, distanceText? })
```
- If `distanceText` is provided → footer label = "Service Area", footer text = distanceText
- If `address` is provided → footer label = "Collection Point", footer text = address
- Used in ItemDetail (`address` prop) and ServiceDetail (`distanceText` prop)

### SaveButton component
```tsx
function SaveButton({ itemId, savedItems, onSaveToggle, size?, style? })
```
- Shows `Bookmark` icon (outline = unsaved, filled orange = saved)
- `onClick` calls `onSaveToggle(itemId)` and shows Sonner toast

### Create Item Flow
1. **ItemPhotoUploadScreen** — tap to add photos (up to 3); "Continue" enabled when ≥1 photo
2. **AI Loading screen** — 2.2s spinner "Analysing your photos..." → auto-fills title, description, category
3. **ItemPostScreen** — form order:
   - Images (tiles + `+` tile → `PhotoPickerSheet` bottom sheet, up to 6)
   - Title
   - Category (dropdown from `ITEM_CATEGORIES`)
   - Condition (pill selector)
   - Description (AI pre-filled, editable)
   - Price toggle (For free / For sale → price input)
   - Brand (optional)
   - Collection Address (MapPin + textarea, exact address)

### Create Service Flow
**ServicePostScreen** — form order:
1. Images (tiles + `+` tile → `PhotoPickerSheet`, up to 6)
2. Service Title
3. Category (dropdown from `SERVICE_CATEGORIES`)
4. Availability (textarea)
5. Description (optional, textarea)
6. Pricing (Free / Charge a fee → rate input + /hour or /session toggle)
7. Years of Experience
8. Certifications (optional)
9. Relevant Skills (optional)
10. Service Location (`CollectionPointMap` tile + text input below)

### PhotoPickerSheet component
Spring-animated bottom sheet (AnimatePresence):
- Handle bar + "Add Photo" title
- "Take Photo" (orange) + "Library" (purple) action buttons
- 3-column recent photos grid (9 mock Unsplash photos)
- Cancel button
- Opens when `+` tile is tapped in image grids

### HelpScreen nav stack type
```ts
type HelpScreen =
  | 'feed' | 'item-detail' | 'service-detail'
  | 'poster-notif' | 'mutual-confirm' | 'chat'
  | 'category-select' | 'item-post-photo' | 'item-post-form' | 'service-post'
  | 'post-success'
```
Navigation via `navStack: NavFrame[]` push/pop pattern.

### Category Lists
```ts
ITEM_CATEGORIES = [
  'All', 'Babies & Kids', 'Beauty', 'Car Accessories', 'Computers & Tech',
  'Food & Drinks', 'Furniture', 'Health', 'Learning', 'Luxury',
  "Men's Fashion", 'Pet Supplies', 'Photography', 'Sports Equipment',
  'TV & Home Appliances', "Women's Fashion"
]

SERVICE_CATEGORIES = [
  'All', 'Home Help', 'Repairs', 'Cleaning Services', 'Moving',
  'Babysitting & Childcare', 'Pet Care', 'Elderly Companion Care',
  'Tutoring & Coaching', 'Tech Support'
]
```

---

## Requests (`RequestsPage.tsx`)
- Navigated to from Home (Latest Request card) or Profile (My Posts)
- **Header**: no location pin, no large "Requests" heading, no description subtitle
- **Search bar**: explore-style rounded pill (same structure as Marketplace/Messages)
- Filter button: circular (46px), opens filter bottom sheet (categories, type, distance, sort)
- Request cards: category emoji + title, type badge, poster avatar + name, expiry, location
- Request detail: full description, collection point map, Chat button
- Post flow: title, category, type (Borrow / Free / Paid), description, expiry, location

## Tab 4 — Messages (`MessagesPage.tsx`)
- **Header**: no large "Messages" heading
- **Search pill**: explore-style rounded pill — filters conversation list by name in real time
- **Filter tabs**: All | Groups | Marketplace | Direct — underline style (matching Explore page)
- No bell icon
- Conversations:
  - ID 1: Morning Runners Club (group, `#16A34A`)
  - ID 2: Backyard Gardeners (group, `#059669`)
  - ID 3: Board Game Sundays (group, `#7C3AED`)
  - IKEA Bookshelf (marketplace)
  - Neighbour #2 (direct)
  - Plant Watering Request (marketplace)
- **Group chat screen** has two tabs: **Chat** | **Activity Board**
  - Activity Board: 📍 Next Meetup, 📋 Upcoming Plan, 🎯 Group Goal + discoverability notice
- Props: `{ initialConvId?: number; extraConversations?: any[] }` — opens directly to a specific conversation (searches both `extraConversations` and static `CONVERSATIONS`)

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
- Stats: Items Saved, Neighbours Jio'd, Exchanges Done
- My Interests section (editable)
- Rewards & Badges (2×2 grid): Event Joiner ✓, Group Member ✓, Trader ✓, Community Builder 🔒
- Saved Items screen (clickable cards → navigates to correct tab/item)
- My Posts (Requests/Listings with status)
- Settings screen (Notification Preferences, Privacy, Verification, Help)

### Props
```ts
{
  onClose?: () => void;
  onOpenEvent?: (id: number) => void;
  onOpenMarketplaceItem?: (id: number) => void;
  onOpenRequest?: (id: number) => void;
  myPosts?: any[];
  userInterests?: string[];
  onUpdateInterests?: (interests: string[]) => void;
  savedMarketplaceItems?: any[];   // from App.tsx — dynamically bookmarked items/services
}
```

### Saved Items Screen (`SavedItemsScreen`)
- Tabs: All | Events | Marketplace | Requests
- Search bar
- **Dynamic marketplace items**: converted from `savedMarketplaceItems` prop at render time; shown first in list
- **Static entries**: Events and Requests from hardcoded `SAVED_ITEMS` (Items/Services entries removed from static list — now fully dynamic)
- Tapping a card: Events → `onOpenEvent`, Items/Services → `onOpenMarketplaceItem`, Requests → `onOpenRequest`
- Saved item card shape: 80×72 px image thumbnail + type badge + category badge + title + sub text + filled bookmark icon

---

## Login Page (`LoginPage.tsx`)
- Animated canvas background (orange blobs)
- App name: **NeighbourHood**, tagline: "Connect with neighbours"
- "Log in with singpass" button below tagline
- Privacy note + Singpass badge at bottom

---

## Onboarding (`SignUpPage.tsx`)
6 steps: Welcome → Date of Birth → Family Status → Interests → Loading → Recommendations

### Interests Step
- Search bar filters interests in real-time
- Selected interests appear as removable coloured pills below search bar
- Interests grouped by collapsible category dropdowns (AnimatePresence)
- Category header shows orange count badge when items selected
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
- No real push notifications
- Chunk size >500 KB (build warning only, not blocking)
