# NeighbourHood App — Context

## Last Updated
2026-04-19 (session 8 - NeighbourLah rebrand, Larry mascot + animations, card row padding, group chat cleanup)

## GitHub Repository
https://github.com/laibamaqsood88/P3-HDB-community-App

## What This App Is
A Singapore HDB community mobile web app called **NeighbourHood** (login screen) / **NeighbourLah** (onboarding welcome screen). It connects verified HDB residents within an estate (Bishan-AMK Estate in the demo) via Singpass identity verification. Stack: React 18 + TypeScript + Vite, inline styles, Framer Motion (`motion/react`), Lucide React icons, Sonner toasts. No backend — all mock data.

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
├── assets/
│   ├── larrywithlimbs.svg         — static Larry mascot SVG (original)
│   ├── larry2.svg                 — updated Larry SVG with redesigned hands
│   └── LarryAnimated.tsx          — animated inline-SVG React component (see Larry Mascot section)
└── app/
    ├── App.tsx                    — root: auth state, tab routing, profile overlay, cross-tab callbacks
    ├── components/
    │   └── BottomNav.tsx          — 4-tab nav (Events / Explore / Marketplace / Messages)
    └── pages/
        ├── LoginPage.tsx          — Singpass login screen
        ├── SignUpPage.tsx         — 6-step onboarding (uses LarryAnimated on welcome step)
        ├── EventsPage.tsx         — Home dashboard (Tab 1)
        ├── ExplorePage.tsx        — Events + Groups sub-tabs (Tab 2)
        ├── ConnectPage.tsx        — Groups list + detail (used inside ExplorePage)
        ├── HelpSharePage.tsx      — Marketplace (Tab 3)
        ├── MessagesPage.tsx       — Group + direct chats (Tab 4)
        ├── ProfilePage.tsx        — Profile overlay (opened from Home)
        ├── RequestsPage.tsx       — Requests page
        └── NeighbourProfilePage.tsx — Shared full-screen neighbour profile overlay
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
userInterests: string[]               // interests selected during onboarding, passed to ProfilePage
userLanguages: string[]               // languages selected during onboarding (presets + custom), passed to ProfilePage + SignUpPage
onUpdateInterests(interests)          // callback from ProfilePage to update interests
onUpdateLanguages(languages)          // callback from ProfilePage to update languages
```

### Languages Data Flow
- **Onboarding**: SignUpPage captures selected languages (preset + custom from Others) → `onComplete()` callback with `spokenLanguages` param
- **App.tsx**: `setUserLanguages(spokenLanguages)` stores in state
- **ProfilePage**: Receives `userLanguages` prop (from App.tsx) and `onUpdateLanguages` callback
  - Displays selected languages in Languages Spoken section
  - Edit modal allows add/remove languages, calls `onUpdateLanguages()` on save
  - Changes propagate back to App.tsx state and persist through profile overlay
- **Dynamic Rendering**: ProfilePage only shows Languages Spoken section if `userLanguages.length > 0`

### Cross-tab Navigation Callbacks
- `openExploreEvents()` — switches to Explore tab, opens Events sub-tab
- `openExploreGroups()` — switches to Explore tab, opens Groups sub-tab
- `openExploreNeighbours()` — switches to Explore tab, opens Neighbours sub-tab
- `openGroupChat(groupId)` — switches to Messages tab, opens specific group chat
- `onOpenMarketplace()` — switches to Marketplace tab
- `onOpenDirectChat(conv)` — adds `conv` to `conversations` state, sets `initialGroupChatId` to `conv.id`, switches to Messages tab (passed to `ExplorePage` → `NeighboursTab`)
- `openNeighbourProfile(profile)` / `onOpenNeighbourProfile` — opens `NeighbourProfilePage` as an app-level slide-in overlay (zIndex 110, above Profile at zIndex 100). Passed down to EventsPage, ExplorePage (→ ConnectPage, NeighboursTab), MessagesPage.

### Neighbour Profile Overlay (`NeighbourProfilePage.tsx`)
Shared full-screen component for viewing any neighbour's profile. Triggered from 8 entry points:
1. **Home → Connect with Neighbours** — tap a neighbour card
2. **Explore → Events → Going list** — tap an attendee
3. **Explore → Groups → Group Detail** — tap a member row
4. **Explore → Neighbours** — "View Profile" button
5. **Messages → Direct chat header** — tap the name/avatar
6. **Messages → Group chat → Members sheet** — tap any member (except "You")
7. **Marketplace → Item/Service Detail → About the Neighbour** — tap the card
8. **Requests → Request Detail → About the Neighbour** — tap the card

Entry points 1–6 use the App-level `AnimatePresence` overlay. Entry points 7–8 use internal nav stacks within HelpSharePage and RequestsPage respectively.

#### Profile data completeness — all entry points now pass `interests` and `languages`
- **HelpSharePage** (Market): `seller.interests`, `seller.languages`, `seller.profileImage` (as `avatarUrl`) passed from item/service data
- **RequestsPage**: `poster.interests`, `poster.languages` passed from `POSTER_AVATARS` data
- **ConnectPage** (Groups): `GroupMember` interface has optional `interests?` and `languages?`; all 27 members across 8 groups backfilled
- **MessagesPage** (group members popup): `GroupMember` interface has optional `interests?` and `languages?`; all 31 members across 3 groups backfilled
- **ExplorePage / EventsPage**: already passing full data via `NEIGHBOURS` arrays

#### `NeighbourProfile` interface (exported)
```ts
export interface NeighbourProfile {
  name: string;
  avatar?: string;     // initials (e.g. "AL") — used for coloured circle
  avatarUrl?: string;  // real image URL — takes priority over initials
  color?: string;      // avatar background colour
  block?: string;      // e.g. "Blk 445"
  distance?: string;   // e.g. "0.3 km away"
  rating?: number;
  reviews?: number;
  interests?: string[];
  languages?: string[];
}
```

#### Layout
- Header: back button (ChevronLeft) + "Neighbour Profile" title
- Avatar (96px circle — image if `avatarUrl`, else initials)
- Name (bold)
- Details row: MapPin block · distance · ★ rating · N reviews (hidden if missing)
- Pill tab switcher: **About** | **Reviews**
- **About tab**: Interests card (coloured pills) + Languages Spoken card; empty state if neither
- **Reviews tab**: mock review cards — reviewer avatar, name, star rating, review text, source label (`"from Marketplace"` or `"from Requests"`)

#### Colors
Uses `INTEREST_COLORS` and `LANGUAGE_COLORS` maps matching ProfilePage/ExplorePage.

---

## Scroll-Animated Header Pattern (Explore, Market, Requests, Messages)

All four tab headers share the same absolute-positioning scroll animation. The pattern replaces the previous two-row height/opacity approach.

### Structure
```tsx
<div style={{ position: 'relative', height: `${EXPANDED - scrollProgress * DELTA}px`, transition: 'height 0.1s linear' }}>
  {/* Buttons: absolutely pinned — zero animation ever */}
  <div style={{ position: 'absolute', top: '44px', right: '16px', display: 'flex', gap: '8px' }}>
    {buttons}
  </div>
  {/* Title: slides up + shrinks on scroll */}
  <span style={{
    position: 'absolute', left: '16px',
    top: `${90 - scrollProgress * 46}px`,       // 90px → 44px
    fontSize: `${28 - scrollProgress * 8}px`,   // 28px → 20px
    lineHeight: '40px',                          // vertically centres with 40px buttons when collapsed
    transition: 'top 0.1s linear, font-size 0.1s linear',
  }}>PageTitle</span>
  {/* Description (Market + Requests only): fades out */}
  <span style={{ opacity: 1 - scrollProgress, transition: 'opacity 0.1s linear' }}>subtitle</span>
</div>
```

### Per-page heights
| Page     | Expanded | Collapsed | Delta | Notes |
|----------|----------|-----------|-------|-------|
| Explore  | 132px    | 92px      | 40px  | No description |
| Messages | 132px    | 92px      | 40px  | No description; `newChatRef` wraps entire container |
| Market   | 152px    | 92px      | 60px  | Description "Buy, sell or offer services" fades |
| Requests | 168px    | 92px      | 76px  | Description "Ask neighbours for help" fades |

### scrollProgress
`Math.min(scrollTop / 60, 1)` — driven by `onScroll` on the page's scrollable content div.

### Height math
- Expanded = 44 (status bar) + 40 (buttons) + 6 (gap) + 28 (title) + bottom padding + optional description
- Collapsed = 92px (44 + 40 + 8) — title has slid up to share the buttons row

---

## Tab 1 — Home Dashboard (`EventsPage.tsx`)

### Header
- Profile avatar button (real photo — Unsplash `photo-1507003211169`) top-left → opens Profile overlay
- App name "NeighbourHood" centered
- Bell icon top-right → opens notification bottom sheet

### Notification System
- 6 notifications (event, group, marketplace types)
- Each has a `route` field: `{ to: 'event', eventId }` | `{ to: 'group', groupId }` | `{ to: 'marketplace' }`
- Unread count badge on bell icon; "Mark all read" button in sheet

### Content Sections
1. **Greeting** — "Good morning ☀️", estate + Verified badge
2. **Your Interest Groups** — horizontal scroll (Morning Runners, Backyard Gardeners, Board Game Sundays) + "More →"
3. **Community Latest Requests** — single card showing newest marketplace request
4. **Marketplace Picks** — horizontal scroll of 4 recommended items/services
5. **My Events** — heading row with **"Find more events ›"** button + horizontal scroll row that **always** contains registered event cards followed by the **"Find an event" CTA card** (purple dashed, 148px wide, animated orb icon). CTA card always visible regardless of how many events are registered. Row has equal `paddingTop` and `paddingBottom` (4px each).
6. **My Groups** — heading row with **"Find more groups ›"** button + horizontal scroll row that **always** contains joined group cards followed by the **"Find a group" CTA card** (green dashed, 148px wide, animated orb icon). CTA card always visible regardless of how many groups are joined. Row has equal `paddingTop` and `paddingBottom` (6px each).
7. **Community Latest Requests** horizontal scroll — up to 5 request cards
8. **Recommended Events** — vertical list of event cards

### Sub-tabs
- **Upcoming** — shows all above sections
- **Signed Up** — list of events user registered for

### Props
```ts
{ onOpenProfile, onOpenEvent, onOpenGroups, onOpenGroupChat, onOpenMarketplace,
  onOpenNeighbours, onOpenRequest, onOpenNeighbourProfile, onSayHello,
  joinedGroups, savedEvents, onOpenExploreEvents }
```

---

## Tab 2 — Explore (`ExplorePage.tsx`)

### Shared Header (all sub-tabs)
- Title "Explore" + Search icon button (circular) + Filter button (circular, `SlidersHorizontal`, orange when active with count badge)
- **Sub-tabs**: Events | Groups | Neighbours — underline style, active tab **black** (`TEXT` colour), inactive `MUTED`. Indicator bar `background: TEXT` (black, not orange).
- Header hidden entirely when Groups sub-tab shows a group detail page

### Search Mode (liquid glass overlay)
- Tapping the search icon enters search mode
- Header background becomes **transparent** (no white), border removed — back button and subtabs render directly on the glass
- **Back button** (`ChevronLeft`, white icon, `rgba(255,255,255,0.20)` pill background) replaces the title text in the top row
- Subtabs remain visible above the popup in white/faded-white; tapping a subtab in search mode changes **both** `searchScopeTab` AND the active content sub-tab
- **Full-screen backdrop**: `rgba(10,10,20,0.45)` + `backdropFilter: blur(16px)` covers whole page at `zIndex: 200`; header is at `zIndex: 202` so it shows above the blur
- **White popup card**: `position: absolute, top: 144px, left/right: 12px`, `borderRadius: 16px`, `zIndex: 201` — floats below the header with clear spacing
  - Search input (autofocus)
  - `✕` button to clear text (no Cancel button — Back button in header handles exit)
  - **Recent Searches** list: label + rows each with `SquareArrowOutUpRight` icon; tapping a row triggers that search
- Tapping the backdrop dismisses search mode

### Sub-tabs: Events | Groups | Neighbours

#### Events Sub-tab
- **"Welcome to Events"** bordered card above the events list
- Filter button → bottom sheet filter panel:
  - **Interests** (collapsible INTEREST_CATEGORIES dropdowns — 5 categories from onboarding, 17 interests total)
  - **Age Groups**
  - **Distance** (Any Distance / < 0.5 km / < 1 km) — single-select chips
  - Language and Family Status sections **removed**
- Events listed in date-grouped horizontal Luma-style cards
- **Event Detail**: Date row, Location row, Organizer card, About card, Hosting/Going panels, Price + Attend toggle
- **Going Breakdown screen**: Stacked bar chart by family status + neighbours attending list

#### Groups Sub-tab (`ConnectPage.tsx`)
- 8 groups: Morning Runners Club, **Cooking & Sharing Circle** (renamed from Peranakan Cooking Circle), Community Garden Guild, Board Game Crew, Seniors Wellness Circle, Parents & Kids Playgroup, Photography Walkers, Neighbourhood Book Club
- Filter panel: **Category section removed**; only Interest accordion (collapsible INTEREST_CATEGORIES) remains
- "My Groups" horizontal scroll
- Group detail: hero image, name, members, MEETS + LOCATION info, About, hashtags, Join/Leave button
- **Header + bottom nav hidden on group detail**
- **Member rows** tappable → opens NeighbourProfilePage overlay with full `interests` and `languages` data

#### Neighbours Sub-tab
- Lists `MOCK_NEIGHBOURS` with name, unit, distance, interests, last active time
- Filter panel: Distance / Interests (collapsible INTEREST_CATEGORIES) / Preferences (Shared Interests, Recently Active — **emojis removed** from labels)
- Each card: interest pills, **Message** + **View Profile** buttons

---

## Tab 3 — Marketplace (`HelpSharePage.tsx`)

### Overview
- Two tabs: **Items** | **Services** — underline style, not pill/toggle
- **Header**: title "Market", Search icon button + Filter button + **+** (Post) button — **+ button is rightmost**
- **Search mode**: same liquid glass overlay pattern as Explore. Header transparent on glass, back button (white ChevronLeft) replaces title, Items/Services subtabs remain visible above popup in white. White popup at `top: 144px`.
- Both Items and Services use a **2-column grid**
- Save system: **Bookmark icon only**. State lifted to `App.tsx`
- Post button → Category Select → Item or Service post flow

### Props
```ts
{
  onAddPost?: (post: any) => void;
  initialItemId?: number;
  savedItems?: number[];                         // from App.tsx (savedMarketplaceIds)
  onSaveToggle?: (id: number, item: any) => void; // from App.tsx (onMarketplaceSaveToggle)
}
```

### Mock Item Data (IDs 101–110)
Each item has:
```ts
{
  id, itemType: 'item', name, condition, distance, postedTime, price,
  category, brand, verified, description,
  collectionAddress,   // exact "Blk X Street Y, #NN-NN, Singapore XXXXXX"
  collectionDistance,  // kept for reference but not displayed
  image,               // Unsplash URL
  seller: { name, avatarColor, rating, reviews, profileImage, block, interests, languages }
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

### Mock Service Data (IDs 201–210)
Each service has:
```ts
{
  id, itemType: 'service', name, rate, distance, postedTime,
  category, availability, verified, trust, trustNote,
  description, responseTime, completedServices, yearsExperience,
  image,   // Unsplash URL
  provider: { name, avatarColor, rating, reviews, profileImage, block, interests, languages }
}
```

Services: Dog Walking (201), Babysitting (202), Primary Math Tutoring (203), Elderly Companion (204), Home Cleaning (205), Basic Plumbing Repair (206), Grocery Errand Run (207), Secondary English Tutor (208), Cat Boarding (209), Furniture Assembly (210)

### ItemCard (2-col grid)
Strict layout order:
1. Image thumbnail (120 px height) — bookmark icon top-right
2. Title
3. Price (green if Free)
4. Distance ("X km away")
5. Posted time (relative)
6. Seller info row: **real profile photo** (`<img>` from `seller.profileImage`, 24px circle) + name; falls back to coloured initial if no image

### ServiceCard (2-col grid — mirrors ItemCard exactly)
Strict layout order:
1. Image thumbnail (120 px height) — bookmark icon top-right
2. Title
3. Rate (green if Free — e.g. "$15 per walk", "Free")
4. Distance ("X km away")
5. Posted time (relative)
6. Provider info row: **real profile photo** (`<img>` from `provider.profileImage`, 24px circle) + name; falls back to coloured initial if no image

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
7. **About the Neighbour** — tappable card: **real profile photo** (48px circle from `seller.profileImage`), name, star rating, review count
8. Sticky footer: "Chat" button only

### ServiceDetail (service detail page)
Layout order:
1. Hero image (full-width, 260 px) — floating back button + bookmark
2. Title
3. Rate (green if Free)
4. **Details** section — rows card: Category · Availability · Posted
5. Description
6. **Location** — `CollectionPointMap` with `distanceText={item.distance}` (shows distance, not address; labelled "Service Area")
7. **About the Neighbour** — tappable card: **real profile photo** (48px circle from `provider.profileImage`), name, star rating, reviews, years experience
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
- Navigated to from Home (Community Latest Requests card) or Profile (My Posts)
- **Header**: title "Requests", description "Ask neighbours for help", Search icon + Filter + **+ button (rightmost)**; uses absolute-position scroll pattern (168→92px)
- **Seed data**: 7 requests (ids 1–7). IDs 1–5 original; id 6 = "Anyone have a foldable ladder to lend?" (Borrow, Items Needed); id 7 = "Help with grocery run for elderly mum" (Free Request, Errands)
- **Search mode**: liquid glass overlay, header transparent on glass, back button (white ChevronLeft) replaces title, no subtabs (single-level header). White popup at `top: 106px` (shorter than pages with subtabs).
- Filter button: circular (46px), opens filter bottom sheet (categories, type, distance, sort)
- **Request cards**: type badge top-left + save button top-right; distance ("x km away") on its own line; title; description snippet; poster avatar + name; time ago
- **Request detail**: full description, collection point map, **About the Neighbour** tappable card → opens NeighbourProfilePage; Chat button
- Post flow: title, category, type (Borrow / Free / Paid), description, expiry, location

## Tab 4 — Messages (`MessagesPage.tsx`)
- **Header**: title "Messages", Search icon + **+ button (rightmost, orange/PRIMARY background)**; uses absolute-position scroll pattern (132→92px); `newChatRef` wraps full container for click-outside detection
- **Search mode**: liquid glass overlay, header transparent on glass, back button (white ChevronLeft) replaces title. Filter tabs (All/Groups/Market/Requests/Neighbour) remain visible above popup in white/faded-white. White popup at `top: 144px`.
- **Filter tabs**: `All | Groups | Market | Requests | Neighbour` — underline style
  - `'Market'` maps to `type === 'marketplace'`
  - `'Neighbour'` maps to `type === 'direct'`
- **Group avatars**: if the `Conversation` has `imageUrl`, an `<img>` is rendered instead of the coloured initials circle. The small `Users` badge icon still overlays bottom-right.
- **Direct chat header**: tapping the name/avatar opens NeighbourProfilePage overlay
- **Group chat members sheet**: tapping any member (except "You") opens NeighbourProfilePage overlay

### Conversation interface
```ts
interface Conversation {
  id: number;
  type: 'group' | 'marketplace' | 'request' | 'direct';
  name: string;
  avatar: string;        // initials fallback
  avatarBg: string;      // background colour for initials circle
  imageUrl?: string;     // group cover photo (renders <img> when present)
  lastMessage: string;
  time: string;
  unread: number;
  tag: string | null;
  subtitle?: string;     // seller/provider name for marketplace chats
  memberCount?: number;
  meetFrequency?: string;
  location?: string;
}
```

### Static conversations (CONVERSATIONS)
- ID 1: **Morning Runners** (group) — `imageUrl`: Unsplash running photo (`photo-1571008887538-b36bb32f4571`)
- ID 2: **Backyard Gardeners** (group) — `imageUrl`: Unsplash garden photo (`photo-1621460248083-6271cc4437a8`)
- ID 3: IKEA Bookshelf (marketplace)
- ID 4: Neighbour #2 (direct)
- ID 5: Plant Watering Request (request)

### Dynamic groups (from Explore → join)
When a user joins a group from ExplorePage, `onJoinGroup` in App.tsx creates a conv with `imageUrl: group.image`, so the Messages avatar uses the same photo shown in the Explore groups page. `extraMapped` in MessagesPage passes through `imageUrl: c.imageUrl`.

### GroupMember interface
```ts
interface GroupMember {
  name: string; avatar: string; avatarBg: string; role?: string;
  interests?: string[]; languages?: string[];
}
```
All 31 members across 3 group chats have `interests` and `languages` populated (thematically: runners → Fitness, gardeners → Gardening, board gamers → Gaming). Tapping a member in the members popup passes `interests` and `languages` to `onOpenNeighbourProfile`.

### Group chat screen
Two tabs: **Chat** | **Activity Board**
- Activity Board: 📍 Next Meetup, 📋 Upcoming Plan, 🎯 Group Goal
- ~~Discoverability notice~~ removed (the orange banner "This group is discoverable by verified estate residents with the X interest tag" has been deleted)

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
- **Rewards & Badges**: shows count `(unlocked/total)`, **2×2 grid** of **rounded rectangle** badges (borderRadius: 12px, 100% width, 90px height). All 4 badges always visible — no "View more" button.
- **Languages Spoken section** (shows only if languages selected during onboarding)
  - Displays selected languages as coloured pills with language-specific background and text colors
  - Uses LANGUAGE_COLORS mapping for visual distinction (English, Chinese, Malay, Tamil, Japanese, Korean, French, Spanish, German)
  - Edit button opens bottom sheet modal for language management
  - Positioned directly above Interests section
- **My Interests section** (editable)
- Rewards & Badges (2×2 grid): Event Joiner ✓, Group Member ✓, Trader ✓, Community Builder 🔒
- Saved Items screen (clickable cards → navigates to correct tab/item)
- My Posts (Requests/Listings with status)
- Settings screen (Notification Preferences, Privacy, Verification, Help)

### Edit Languages Bottom Sheet Modal
- Opened via Edit button on Languages Spoken section
- Three sections:
  1. **Selected Languages** (top): #FFF8F6 background with orange border, displays selected languages as large coloured pills with × remove button
  2. **Common Languages**: preset language buttons (English, Chinese, Malay, Tamil) that toggle between colored and white states
  3. **Browse Languages**: search input with dropdown showing 100+ predefined world languages with checkmarks (✓) for selected ones, highlight background for selection indication
- 8px padding below suggestions dropdown
- Changes reflected immediately in popup state
- Saves persist to ProfilePage and App.tsx state on modal close

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
  userLanguages?: string[];            // from App.tsx — languages selected during onboarding
  onUpdateLanguages?: (languages: string[]) => void;  // callback to update App.tsx state
  savedMarketplaceItems?: any[];       // from App.tsx — dynamically bookmarked items/services
}
```

### Language Colors (LANGUAGE_COLORS)
```ts
English:   { bg: '#E0F2FE', text: '#0369A1' }
Chinese:   { bg: '#FEF08A', text: '#A16207' }
Malay:     { bg: '#D1FAE5', text: '#065F46' }
Tamil:     { bg: '#FCE7F3', text: '#BE185D' }
Japanese:  { bg: '#FED7AA', text: '#9A3412' }
Korean:    { bg: '#DDD6FE', text: '#4C1D95' }
French:    { bg: '#F0FDF4', text: '#166534' }
Spanish:   { bg: '#FEE2E2', text: '#7F1D1D' }
German:    { bg: '#E0E7FF', text: '#3730A3' }
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

## Larry Mascot (`src/assets/LarryAnimated.tsx`)
Animated inline-SVG React component used on the onboarding welcome step.

### Usage
```tsx
import { LarryAnimated } from '../../assets/LarryAnimated';
<LarryAnimated size={140} />
```

### SVG source
Based on `larry2.svg` (viewBox `0 0 492 566`) — updated hand design with spread fingers. Static fallback: `larrywithlimbs.svg` (viewBox `0 0 483 566`).

### Animations (all on a 1.6s loop)
| Class | Element | Animation |
|---|---|---|
| `.larry-jump` | Body + arms `<g>` | `larryJump`: fast launch to -38px, brief hang at peak, snap land, pause |
| `.larry-hat` | Hat `<g>` (rendered last, always on top) | `larryHatFloat`: smooth `ease-in-out` arc to -56px, 0.13s delay so hat lags and overshoots body |
| `.larry-arm-left` | Left arm `<g>` | `larryWaveLeft`: rotates 0°→10°→0°, `transform-origin: 100% 30%` (shoulder pivot) |
| `.larry-arm-right` | Right arm `<g>` | `larryWaveRight`: rotates 0°→-10°→0°, `transform-origin: 0% 30%` |

### Key implementation details
- Hat `<g>` is rendered **after** the jump group so it always paints on top of the body
- Arms are **inside** the jump group so they jump with the body; rotation is relative to the translated parent
- `overflow: visible` on the SVG allows arms/hat to animate outside the element bounds
- `transform-box: fill-box` on arm groups makes `transform-origin` relative to each arm's own bounding box

---

## Onboarding (`SignUpPage.tsx`)
6 steps: Welcome → Family Status → Interests → Spoken Language → Loading → Recommendations

### Welcome Step layout
- **Title**: "Welcome to NeighbourLah" (rebranded from NeighbourHood)
- **Icon**: `<LarryAnimated size={140} />` replaces the old home icon
- All content (mascot, title, subtitle) is vertically centred between the top of the screen and the Continue button using a `flex: 1, justifyContent: 'center'` wrapper
- **Continue button**: `alignSelf: 'stretch'` on the button's wrapper div ensures it spans full screen width even when the parent uses `alignItems: 'center'`

### Family Status Step
- 6 options: Single, Couple, Living with kids, Living with parents, Multigenerational, Senior (60 and above)
- Single-select with orange highlight + checkmark on selection
- "Next" button disabled until selection made

### Interests Step
- Search bar filters interests in real-time
- Selected interests appear as removable coloured pills below search bar
- Interests grouped by collapsible category dropdowns (AnimatePresence)
- Category header shows orange count badge when items selected
- "Find my community →" button disabled until ≥1 interest selected

### Spoken Language Step
- **Preset Languages**: 4 options: English, Chinese, Malay, Tamil (pill/button style, single-select with orange highlight + checkmark)
- **Others Section**: 
  - Text input search bar that filters from 100+ predefined world languages (AUTOCOMPLETE_LANGUAGES)
  - Selected languages from "Others" section display as removable coloured chips above search input
  - Each chip has orange border (#FF6B47) and background (#FFF0EC) with × close button
  - Only predefined languages can be selected (no custom language entry)
  - Dropdown shows checkmarks (✓) for selected languages and highlights background for selection indication
  - 8px padding below suggestions dropdown for visual spacing
- Must select at least 1 language (preset or from Others) to proceed
- "Next" button disabled until a selection is made

### Interest Categories & Colors
```
Social & Community:
  Community Volunteering:       bg #FEE2E2, text #DC2626
  Cultural Heritage & Festivals: bg #FEF3C7, text #B45309

Fitness & Wellness:
  Fitness & Sports:           bg #DCFCE7, text #16A34A
  Yoga & Mindfulness:         bg #F3E8FF, text #9333EA
  Outdoor Activities:         bg #CCFBF1, text #0D9488

Arts & Creativity:
  Arts & Crafts:              bg #FCE7F3, text #DB2777
  Music & Performing Arts:    bg #FFE4E6, text #E11D48
  Dance:                      bg #EDE9FE, text #7C3AED

Learning & Skills:
  Cooking & Baking:           bg #FEF3C7, text #D97706
  Technology & Digital Skills: bg #DBEAFE, text #2563EB
  DIY & Home Improvement:     bg #F1F5F9, text #475569
  Language Learning:          bg #CFFAFE, text #0891B2

Lifestyle & Hobbies:
  Pets & Animals:             bg #FEF9C3, text #CA8A04
  Gardening & Plants:         bg #D1FAE5, text #059669
  Gaming:                     bg #E0E7FF, text #4F46E5
  Fashion & Beauty:           bg #FCE7F3, text #BE185D
  Photography:                bg #FAE8FF, text #A21CAF
```

---

## Shared Search Mode Pattern (Explore, Market, Requests, Messages)

All four tabs use the same liquid glass search overlay. When search icon is tapped:

### Visual structure
```
Header (zIndex 202, transparent bg, no border)
  Top row:  [← Back (white, rgba(255,255,255,0.20) bg)]
  Subtabs:  [Tab1] [Tab2] ...  (white active, rgba(255,255,255,0.55) inactive)

Backdrop (zIndex 200): rgba(10,10,20,0.45) + blur(16px) — inset:0, tapping dismisses
Popup card (zIndex 201):
  top: 144px (pages with subtabs) | top: 106px (Requests — no subtabs)
  left/right: 12px, borderRadius: 16px, background: white
  ├─ Search input (autoFocus)
  ├─ [✕] clear button (only when text present)
  └─ Recent Searches list (SquareArrowOutUpRight icon on each row)
```

### State
- `searchOpen` / `searchMode` — controls overlay visibility
- `recentSearches: string[]` — persists within session (max 6 entries)
- `submitSearch(q)` — saves to recents, sets `searchQuery`, closes overlay
- Tapping Back button clears query + closes

### Explore-specific
- Subtabs scope the search: tapping Events/Groups/Neighbours in search mode changes both `searchScopeTab` AND `activeSubTab`
- Scope tabs were inside the popup previously — now only in the header

---

## Header Button Order Convention
All page headers follow: `[Title] → [Search] → [Filter] → [+/Post]`
- **+/Post button is always the rightmost** button
- **Messages + button** uses `background: PRIMARY` (orange)
- **Explore**: Search + Filter (no + button)
- **Market**: Search + Filter + Post (+)
- **Requests**: Search + Filter + Post (+)
- **Messages**: Search + New Chat (+, orange)

---

## Known Limitations
- No real Singpass integration (UI only)
- No backend / API — all mock data
- Saved events state in EventsPage does not sync to ProfilePage (separate state)
- No real push notifications
- Chunk size >500 KB (build warning only, not blocking)
