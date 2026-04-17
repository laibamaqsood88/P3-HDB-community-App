# NeighbourHood App — Project Context

## Last Updated
2026-04-17 (Session 9)

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
├── imports/                       — Local image assets
│   ├── mccy-logo-v2.webp
│   ├── yoga-mat.jpg               — Marketplace id:107 Yoga Mat
│   ├── potted-snake-plant.jpg     — Marketplace id:110 Potted Snake Plant
│   ├── primary-math-tutoring.avif — Marketplace id:203 Primary Math Tutoring
│   ├── event1.png                 — Welcome banner image (ExplorePage Events sub-tab)
│   ├── events.png                 — (alias / duplicate of event1.png)
│   └── group-smile.png            — Welcome banner image (ConnectPage Groups)
└── app/
    ├── App.tsx                    — root: auth state, tab routing, profile overlay, cross-tab callbacks
    ├── components/
    │   ├── BottomNav.tsx          — 5-tab floating pill nav (has data-tour="explore-tab" etc.)
    │   └── GuidedTour.tsx         — 9-step onboarding guided tour overlay (shown on every app load)
    └── pages/
        ├── LoginPage.tsx          — Singpass login screen
        ├── SignUpPage.tsx         — 5-step onboarding (exports INTEREST_CATEGORIES)
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

## Login Page (`LoginPage.tsx`)
- Singpass login button (white card, full width)
- **"supported by" + MCCY logo**: displayed below the Singpass button — `"supported by"` muted text (12px) inline with the MCCY logo image (`src/imports/mccy-logo-v2.webp`, height 22px)
- Bottom trust strip: "Your identity is verified..." + MyInfo data badge

---

## Auth Flow (`App.tsx`)
- `authScreen`: `'login'` → `'signup'` → `'main'`
- **LoginPage** → `onLogin()` → signup
- **SignUpPage** → `onComplete({ familyStatus, interests, spokenLanguages })` → main app; sets `userInterests` + `userLanguages`
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
userLanguages: string[]
myPosts: any[]
conversations: any[]
joinedGroups: any[]              // groups joined via Explore → ConnectPage; each entry is { ...Group, convId: number }
initialGroupChatId: number | undefined
initialRequestId: number | undefined
initialEventId: number | undefined
initialMarketplaceItemId: number | undefined
exploreInitialSubTab: 'events' | 'groups' | 'neighbours'
neighbourProfile: NeighbourProfile | null
```

### Cross-tab Navigation Callbacks
```ts
openExploreGroups()              // → Explore tab, Groups sub-tab
openExploreNeighbours()          // → Explore tab, Neighbours sub-tab
openGroupChat(groupId)           // → Messages tab, specific group chat (accepts both static & convId)
openRequest(id)                  // → Requests tab (id=0 → feed, id>0 → detail)
onOpenEvent(id)                  // → Explore tab, event detail
onOpenMarketplaceItem(id)        // → Marketplace tab, item/service detail
openNeighbourProfile(profile)    // → NeighbourProfilePage overlay (zIndex: 110)
onOpenMarketplaceListing(id)     // → Marketplace tab item/service detail (from Messages listing banner tap)
onOpenRequestListing(id)         // → Requests tab detail (from Messages listing banner tap)
```

### Wired Action Buttons → Messages Tab
All three create a conversation object, call `onAddConversation`, `setInitialGroupChatId`, and `setActiveTab('messages')`:

- **HelpSharePage `onOpenChat(item)`** — Marketplace/service "Chat" button
  - Creates `type: 'marketplace'` conv with item title + `subtitle` = seller/provider name
  - Services: `avatarBg: '#7C3AED'`; Items: `avatarBg: '#3B82F6'`
- **ExplorePage → ConnectPage `onJoinGroup(group)`** — "Join Group" button
  - Creates `type: 'group'` conv with group name, `memberCount`, `meetFrequency`, `location`
  - Also appends `{ ...group, convId }` to `joinedGroups` state (so it appears in Home My Groups)
- **EventsPage `onSayHello(neighbour)`** — "Say Hello" button on neighbour cards
  - Creates `type: 'direct'` conv with neighbour name + avatar color

---

## Tab 1 — Home Dashboard (`EventsPage.tsx`)

### Header
- Profile avatar button (orange "R" or photo) top-left → opens Profile overlay
- "NeighbourHood" centered
- Bell icon top-right → notification bottom sheet (unread count badge)

### Notification System
- 6 notifications with `route` field
- Routes: `{ to: 'event', eventId }` | `{ to: 'group', groupId }` | `{ to: 'marketplace' }` | `{ to: 'messages', convId }`
- "Mark all read" button in sheet

### Content Sections (scrollable, in this order)
1. **Greeting** — "Good morning ☀️", estate, Verified badge
2. **My Events** — horizontal scroll of upcoming events the user joined
3. **My Groups** — horizontal scroll of dynamically joined groups; always includes a grey "Find a group" `+` box at the right end (navigates to Explore > Groups); no "More >" button
4. **Latest Requests** — horizontal scroll, compact cards (200px wide); tapping → `onOpenRequest(id)`; "See all" → `onOpenRequest(0)` → Requests feed
5. **Connect with Neighbours** — horizontal scroll cards (220px wide):
   - Category sticker tag (top-left, rotated -1.5deg, inside card)
   - 72×72px square photo (left) + name + location (right)
   - 👋 **Say Hello** outline button → wired to create a direct conversation in Messages tab
   - No "View Profile" button
   - Label: "**10 neighbours in your estate**"

### MOCK_NEIGHBOURS data (EventsPage)
```ts
{ id, name, distance, unit, interests: string[], avatar, color, avatarUrl, lastActive }
```
Real Unsplash photos used. Interest tag shows `interests[0]`.

### My Groups — Dynamic Rendering
- Reads `joinedGroups` prop (from `App.tsx` state) — empty by default on new account
- **Empty state**: only the grey dashed "Find a group" box is shown (same card size as group cards, `minHeight: 167px`)
- **With groups**: joined group cards rendered left-to-right + grey box always last
- Group card uses `COLOR_GRADIENT` map (keyed by `categoryColor`) + `EMOJI_ICON_MAP` (keyed by `group.emoji`) to render like the original INTEREST_GROUPS cards (lucide icon, gradient bg, white text)
- Clicking a joined group card calls `onOpenGroupChat(group.convId)` → Messages tab

### Props
```ts
onOpenProfile, onOpenEvent, onOpenGroups, onOpenGroupChat, onOpenMarketplace,
savedEvents, onOpenNeighbours, onOpenRequest, onOpenNeighbourProfile, onSayHello,
joinedGroups  // any[] — each item: { ...Group from ConnectPage, convId: number }
```

---

## Tab 2 — Explore (`ExplorePage.tsx`)

### Sub-tabs: Events | Groups | Neighbours

### Header Scroll Animation (all sub-tabs)
- `scrollProgress` state (0–1) updated via `handleScroll` passed to all three sub-tab scroll containers
- Header title shrinks from 28px → 20px and padding compresses as user scrolls down
- `data-tour` attributes on sub-tab buttons: `data-tour="events-subtab"`, `"groups-subtab"`, `"neighbours-subtab"`

### Events Sub-tab
- **Welcome banner**: uses local image `src/imports/event1.png` (3D icon style) with bold title "Welcome to Events"
- Search bar + filter button
- Category pills: All, Fitness, Cooking, Gardening, Board Games, Wellness
- Featured event card (large image) + upcoming list
- **3 featured events**: Durian Party, 1 Day Trip to Johor Bahru, Hari Raya Dinner with Community and MP
- Event Detail: date, location, organizer, about, going breakdown charts
- Going Breakdown: By Household Type + By Language charts; Neighbours Attending list (avatar, name, block+distance only)
- **By Household Type labels**: `['Living alone', 'Couple', 'Family with children', 'With parents', 'Shared housing', 'Multigenerational']`
- **Attend button** → navigates to **Confirm Attendance screen** (not a direct toggle):
  - Shows event summary (image, category badge, title, date/time, location)
  - Reminder options: `'1 day before' | '3 hours before' | '30 minutes before' | 'No reminder'`
  - External sign-up CTA button at bottom → `toast.success("Opening sign-up page…")`
  - On confirm: sets `isRegistered = true`, shows "Attending" state on button

### Groups Sub-tab (→ `ConnectPage.tsx`)
- **Welcome banner**: uses local image `src/imports/group-smile.png` (3D icon style) with bold title "Welcome to Groups"
- 8 groups: Morning Runners Club, Peranakan Cooking Circle, Community Garden Guild, Board Game Crew, Seniors Wellness Circle, Parents & Kids Playgroup, Photography Walkers, Neighbourhood Book Club
- **Group feed card UI**:
  - Left: **circular image** (72×72px, `borderRadius: '50%'`) — WhatsApp-style
  - Right column: interest/category tag pill (inline, above member count) → group name → description
  - Right edge: Joined badge + ChevronRight
- **Group detail**: hero image, category badge (Lucide icon + text), name, **Meets card only** (no Location card), About section, Members list, Join/Leave button
  - Meets section styled same as About section (no icon, same card/label/text style)
  - No hashtags/tags section below About
  - No MapPin/location text on feed cards
- **Join Group** button → wired via `onJoinGroup` prop → creates group conversation in Messages tab

### Neighbours Sub-tab (→ `NeighboursPage.tsx`)
- Label: "**10 neighbours in your estate**" (removed "with shared interests" suffix)
- Neighbour cards: category sticker tag top-left (rotated -1.5deg), square photo + name/location, 👋 Say Hello button
- NEIGHBOURS data: `{ id, name, avatarUrl, sharedInterests, allInterests, sharedCount, proximity, distance, verified, avatarColor }`

### Props added to ExplorePage
```ts
onJoinGroup?: (group: Group) => void   // passed down to ConnectPage
onOpenNeighbourProfile?: (profile) => void
```

---

## Tab 3 — Marketplace (`HelpSharePage.tsx`)
- Sub-tabs: **Items** | **Services**
- Items: 2-column grid (IDs 101–110)
- Services: vertical list (IDs 201–210)
- **+ button**: orange circle in header (left of search button) — replaces old floating FAB
- Filter panel: `zIndex: 61`
- NavStack screens: `'feed' | 'item-detail' | 'service-detail' | 'neighbour-profile' | 'poster-notif' | 'mutual-confirm' | 'chat' | 'category-select' | 'item-post-photo' | 'item-post-form' | 'service-post' | 'post-success'`
- **Chat button** on item/service detail → calls `onOpenChat(item)` → creates marketplace conversation in Messages tab
- Props: `{ onAddPost, initialItemId?, savedItems, onSaveToggle, onNavVisibilityChange, onOpenChat? }`

### Local Image Imports (src/imports/)
Some item/service cards use local images instead of Unsplash URLs:
```ts
import yogaMatImg from '../../imports/yoga-mat.jpg';           // id:107 Yoga Mat
import snakePlantImg from '../../imports/potted-snake-plant.jpg'; // id:110 Potted Snake Plant
import primaryMathImg from '../../imports/primary-math-tutoring.avif'; // id:203 Primary Math Tutoring
```
Pattern: `image: yogaMatImg` (imported variable, not a URL string).

---

## Tab 4 — Requests (`RequestsPage.tsx`)
- Exports: `REQUESTS_DATA`, `REQUESTS_CAT_EMOJIS`
- Props: `{ onAddPost, initialRequestId?, onNavVisibilityChange }`
- **+ button**: orange circle in header (left of search button) — replaces old floating FAB
- Category icon map: `CAT_ICON_MAP` using Lucide icons (HomeIcon, ShoppingCart, Wrench, Package, BookOpen, Handshake, ShoppingBag, SearchIcon)
- Privacy notices use Lock icon instead of 🔒 emoji
- **Request listing cards**: Horizontal rectangular layout with **square image** on left (consistent sizing), type badge overlay on image, bookmark save button (top-right), distance label, poster face photo (20px circle). No orange icon, no verified checkmark.
- **Request detail page**: Marketplace-style layout — full-width 260px image header with back (38×38px) + save (38×38px) buttons, type badge, details table, description, location+map, About the Neighbour clickable card, Chat button. Neighbour profile sub-screen with avatar, stats, active request, reviews.
- **Post request form**: Image upload section above Title (tile grid with + button, photo picker bottom sheet), MapPin icon on left of location field, no Suggested category chips.
- Saved state: `savedRequests: number[]` lifted to `RequestsPage`, passed as props to `RequestsFeed`

### POSTER_AVATARS — Real Face Photos
All 5 poster avatars have `avatarUrl` set to Unsplash face photos:
```ts
{ name: 'Sarah T.',   color: '#8B5CF6', initials: 'ST', avatarUrl: 'photo-1438761681033-6461ffad8d80' }
{ name: 'Ahmad K.',   color: '#3B82F6', initials: 'AK', avatarUrl: 'photo-1506794778202-cad84cf45f1d' }
{ name: 'Mei Lin',    color: '#F97316', initials: 'ML', avatarUrl: 'photo-1544005313-94ddf0286df2' }
{ name: 'Ravi S.',    color: '#22C55E', initials: 'RS', avatarUrl: 'photo-1500648767791-00dcc994a43e' }
{ name: 'Jennifer L.',color: '#EC4899', initials: 'JL', avatarUrl: 'photo-1494790108377-be9c29b29330' }
```
(Full URL pattern: `https://images.unsplash.com/photo-{hash}?w=200&h=200&fit=crop&crop=face`)

`PosterAvatar` component renders `<img>` when `avatarUrl` is set, fallback to initials. Used in:
- Feed card: 20px inline circle next to poster name
- Detail page "About the Neighbour": 48px circle
- Both have `overflow: 'hidden'` on the container div

### Request Card Images
- id:1 "Need someone to water my plants" → `photo-1771810506686-f70bafda1a16` (plants + dog outdoor scene)

---

## Tab 5 — Messages (`MessagesPage.tsx`)
- Header: "Messages" + **`+` button** (left of search) + search button
  - `+` button opens a "New chat" popup with two options:
    - **New group** → calls `onNewGroup` → Explore > Groups sub-tab
    - **New neighbour** → calls `onNewNeighbour` → Explore > Neighbours sub-tab
  - Popup dismisses on outside click
- Filter tabs: All | Groups | Marketplace | Requests | Direct
- Conversations: 5 items (IDs 1-5); avatars use 2-letter initials, no emojis
- Group chat: Chat | Activity Board tabs
- Activity Board icons: MapPin, ClipboardList, Target (Lucide, no emojis)
- Props: `{ initialConvId?, extraConversations?, onNavVisibilityChange, onOpenNeighbourProfile?, onNewGroup?, onNewNeighbour? }`

### Extended Conversation Interface
```ts
interface Conversation {
  id: number;
  type: 'group' | 'direct' | 'marketplace' | 'request';
  name: string;
  subtitle?: string;       // shown above title (smaller, muted) — for marketplace/request chats
  avatar: string;
  avatarBg: string;
  lastMessage: string;
  time: string;
  unread: number;
  tag?: string | null;
  memberCount?: number;    // used in group chat header fallback
  meetFrequency?: string;  // used in group activity board fallback
  location?: string;       // used in group activity board fallback
  imageUrl?: string;       // poster/seller face photo shown in avatar
  interests?: string[];    // shown in neighbour profile opened from chat avatar
  languages?: string[];    // shown in neighbour profile opened from chat avatar
  listingId?: number;      // id of the linked marketplace item or request (for banner tap navigation)
}
```

### Dynamic Conversation Rendering
- **Marketplace/Request chats**: conversation list row + chat header show `conv.subtitle` (seller/poster name) in smaller muted text above the item/service title
- **Listing banner tap**: inside a marketplace or request chat, tapping the item banner (with `SquareArrowOutUpRight` link icon) calls `onOpenMarketplaceListing(conv.listingId)` or `onOpenRequestListing(conv.listingId)` to navigate to the full detail page
- **Chat avatar tap** (non-group): opens `NeighbourProfilePage` with poster/seller's photo, interests, languages
- **New group chats** (dynamically joined, `id = Date.now()`): group chat activity board falls back to `conv.meetFrequency`, `conv.location`, `conv.memberCount` since `GROUP_ACTIVITY[conv.id]` won't exist
- **New group members**: falls back to `[{ name: 'You', avatar: 'YO', avatarBg: '#FF6B47', role: 'Member' }]` when `GROUP_MEMBERS[conv.id]` is undefined
- `extraMapped` preserves all new fields: `subtitle`, `memberCount`, `meetFrequency`, `location`, `imageUrl`, `interests`, `languages`, `listingId`

### Props (updated)
```ts
{ initialConvId?, extraConversations?, onNavVisibilityChange,
  onOpenNeighbourProfile?, onNewGroup?, onNewNeighbour?,
  onOpenMarketplaceListing?: (id: number) => void,   // navigate to HelpSharePage item/service
  onOpenRequestListing?: (id: number) => void }       // navigate to RequestsPage detail
```

### Static Conversations (listingIds)
- id:3 IKEA Bookshelf (marketplace) → `listingId: 101`
- id:5 Plant Watering Request (request) → `listingId: 1`

---

## Profile Overlay (`ProfilePage.tsx`)
- Opened via avatar button on Home tab
- Props: `{ onClose, onOpenEvent, onOpenMarketplaceItem, onOpenRequest, myPosts, userInterests, onUpdateInterests, userLanguages, onUpdateLanguages, savedMarketplaceItems }`
- Sections: `'main' | 'settings' | 'saved-items' | 'my-posts'`

### Main Profile Screen
- **Header**: plain background (no orange gradient), centered "Profile" title
- **Avatar**: Rachel's Unsplash photo (`photo-1494790108377-be9c29b29330`), circular, 80×80px — female photo; user renamed from Richard → **Rachel**
- **Edit badge**: pencil icon button (bottom-right of avatar) → opens photo edit bottom sheet
  - Bottom sheet: current photo preview + 3 options (Take Photo, Choose from Library, Remove Photo)
- **Name**: "Rachel" (centered, below avatar)
- **Estate tag pill**: below name (no Singpass Verified badge on main screen)
- No Singpass Verified banner anywhere on profile
- My Interests (live from App.tsx), Rewards/Badges grid, Saved Items row, My Posts row
- Badges use CalendarDays, Users, ShoppingBag, Lock icons (no emojis)

### Settings Screen
- Back button: **ChevronLeft** icon (not X)
- Title: centered, 18px font size
- All setting row icons: grey background (`#F2F2F7` bg, MUTED color)
- Sections: Account, Notifications, Privacy, **Log Out** (above About), About
- No duplicate Settings list item; no Singpass Verified banner

---

## Guided Tour (`GuidedTour.tsx`)
- **9-step onboarding overlay** shown on every app load (not gated behind a "seen" flag)
- Mounted in `App.tsx` above the NeighbourProfile overlay, outside the main content div
- Props: `{ onNavigate(tab), onNavigateSubTab(subTab) }`
- Two step types: `'modal'` (centred card, no spotlight) and `'spotlight'` (dark backdrop + cutout highlight)
- Spotlight targets DOM elements via `data-tour` attribute, reads `getBoundingClientRect()` for positioning
- Tooltip side: `'above'` or `'below'` the spotlight cutout

### Tour Steps (in order)
| # | id | type | title |
|---|---|---|---|
| 1 | `welcome` | modal | "Welcome to your Community 👋" |
| 2 | `explore-tab` | spotlight | "Explore Your Community" → navigates to Explore tab |
| 3 | `events-subtab` | spotlight | "Discover Events" → navigates to Events sub-tab |
| 4 | `groups-subtab` | spotlight | "Join Groups" → navigates to Groups sub-tab |
| 5 | `neighbours-subtab` | spotlight | "Meet Your Neighbours" → navigates to Neighbours sub-tab |
| 6 | `marketplace-tab` | spotlight | "Help & Share Marketplace" → navigates to Market tab |
| 7 | `requests-tab` | spotlight | "Community Requests" → navigates to Requests tab |
| 8 | `messages-tab` | spotlight | "Stay Connected" → navigates to Messages tab |
| 9 | `done` | modal | "You're all set!" |

### data-tour Attributes
- `BottomNav.tsx`: each nav button has `data-tour="{tab}-tab"` (e.g. `data-tour="explore-tab"`)
- `ExplorePage.tsx`: each sub-tab button has `data-tour="{subtab}-subtab"`
- `RequestsPage.tsx`: Requests tab button (in BottomNav handles this)

---

## Onboarding (`SignUpPage.tsx`)
5 steps: Welcome → Date of Birth → Family Status → Interests → Loading
*(Step 5 "Here's your neighbourhood" / RecommendationsStep has been removed)*

After the loading screen completes, `onComplete()` is called directly (no navigation to recommendations).

### Exports
```ts
export const INTEREST_CATEGORIES: { name: string; interests: string[] }[]
```

### Welcome screen
- Home icon (Lucide) in orange gradient container (no 🏘️ emoji)
- "Welcome to NeighbourHood" (no emoji)

### Family Status Step
- Question: **"What is your current living situation?"**
- Options:
  ```
  Living alone
  Couple (no children)
  Family with children
  Living with parents
  Shared housing (roommates/housemates)
  Multigenerational household
  ```

### Interest step
- Search bar, collapsible category dropdowns, selected pills, orange count badges
- "Find my community →" disabled until ≥1 interest

### Spoken Languages step
- 4 preset options: English, Chinese, Malay, Tamil
- **Others** option: expands a search-with-autocomplete input for custom languages
- Selected "other" language chips display **below the Others button** even when section is collapsed (with × to remove)
- Count badge on Others button shows how many other languages are selected

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
Page content:         0
Gradient fade:       40
Bottom nav pill:     50
Filter panels:       61
Messages + popup:   100
Profile overlay:    100
NeighbourProfile:   110
```
Note: FAB buttons removed from Marketplace and Requests — replaced by header `+` buttons.

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
