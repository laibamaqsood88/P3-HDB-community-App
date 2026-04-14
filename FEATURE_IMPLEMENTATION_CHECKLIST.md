# Feature Implementation Checklist

**App: NeighbourHood** | **Last Checked: 2026-04-14**

---

## Feature 1: Events Filtered by Interest, Age & Cultural Background

### ✅ Implemented Features:
- ✅ Interest tags on user profile set during onboarding (Step 3 in SignUpPage)
- ✅ Events can be filtered by event type/category (Fitness, Cooking, Gardening, Board Games, Wellness)
- ✅ Category pills: All, Fitness, Cooking, Gardening, Board Games, Wellness
- ✅ Each event listing shows target audience (e.g., "Adults 25–45", "Families", "Seniors 55+")
- ✅ Each event shows expected attendees count
- ✅ Each event shows language of conduct (English, Mandarin, English/Mandarin, etc.)
- ✅ Each event shows signup count
- ✅ Verified resident badge visible on events
- ✅ Events redirect to external form via in-app browser (mock flow)
- ✅ Save button to bookmark events (toggleSave function)
- ✅ Share button present (Share2 icon with flow to share screen)
- ✅ Search functionality (searchQuery filter)

### ⚠️ Partially Implemented / TODO:
- 🟡 **Demographic filters covering age group, language, family status** — UI exists (Filter button with age/language/family status options in ExplorePage.tsx), but not all filtering logic is fully wired:
  - Age groups: `AGE_GROUPS = ['All Ages', '20–35', '35–50', '55+', 'Families']` defined
  - Languages: `LANGUAGES = ['English', 'Mandarin', 'Malay', 'Tamil', 'Multilingual']` defined
  - Family Status: `FAMILY_STATUS = ['Individual', 'Families', 'Parents', 'Seniors']` defined
  - **Issue:** Only interest/language filters are applied in the `filteredEvents` logic (line 110–115). Age group and family status filters exist in state but are **not applied** to filter results.
  
- 🟡 **Ability to see which verified neighbours are attending** — Neighbours list exists (ConnectPage.tsx shows neighbours), but **NOT integrated into event detail page**. Event detail page does not show "verified neighbours attending this event."

- 🟡 **Once clicked, show neighbour profile** — Not implemented in event context.

- 🟡 **Tapping Register Now triggers reminder prompt (1 day, 3 days, 1 week)** — Reminder UI exists with `setReminderOption` but is **not fully functional**. The reminder selection does not actually trigger a notification or calendar event.

- 🟡 **Share via WhatsApp, Telegram, etc.** — Share screen exists but currently shows mock implementation. No actual deep linking or recipient detection for Singpass verification flow.

- 🟡 **Aggregates RC/CC and resident-created events** — Currently all events are treated equally. No distinction in source (RC vs CC vs resident).

- ❌ **Push notifications for new events matching saved interest tags** — Not implemented (would require backend).

---

## Feature 2: Connecting Neighbours With Shared Interests

### Stage 1 — Automatic Matching ✅ Mostly Implemented
- ✅ During onboarding, user sets interests (SignUpPage Step 3)
- ✅ User selects from predefined list: Running, Gardening, Board Games, Cooking, Reading, Cycling, Pets, Photography, Music, Fitness, Hiking, Yoga
- ✅ App shows "Here's your neighbourhood" with matched groups during onboarding (RecommendationsStep in SignUpPage)
- ✅ Automatically surfaces relevant interest groups during onboarding

### ⚠️ Stage 1 — Partial / TODO:
- 🟡 **App automatically surfaces messages like "X neighbours near you also enjoy running"** — Not implemented in main feed. Only shown in ConnectPage when viewing neighbours.

### Stage 2 — Discovering Matches ✅ Mostly Implemented
- ✅ Dedicated "Connect" tab in Explore page (ExplorePage with activeSubTab === 'connect')
- ✅ ConnectPage.tsx: Scrollable list of matched neighbour cards
- ✅ Each card shows:
  - ✅ Interests in common
  - ✅ Number of shared interests
  - ✅ Proximity indicator (Same Block, Nearby in Estate)
  - ✅ Verified resident badge
  - ❌ **No personal details shown** (name shown, but could be anonymized further)
  
- 🟡 **Proactive push notification "3 neighbours near you also enjoy running"** — Not implemented.

- ✅ User taps card to view full interest profile (goTo('detail', neighbour))
- ✅ User can tap "Invite" button (renamed from "Jio")
- ✅ Structured prompts: "Want to run together sometime?" — **Not fully shown as pre-written prompts**, but chat interface exists
- ✅ Recipient gets notification (toast shown)
- ✅ In-app chat without exchanging contact details (Chat screen in ConnectPage)

### Stage 3 — Formalising Into a Group ✅ Mostly Implemented
- ✅ Plus button to create group (GroupCreateScreen in ConnectPage)
- ✅ Give it a name and interest tag
- ✅ Invite matched connections
- ✅ Group has chat and activity board showing upcoming plans
- ✅ Group is discoverable by other residents with same interest (GroupFeedScreen)
- ✅ Groups only form after connections (mock data shows groups exist)
- ✅ No obligation to join — members can browse and leave

---

## Feature 3: Help Requests, Item Sharing & Services

### ✅ Implemented Features:
- ✅ Structured listing categories: Free items, items for sale, services
- ✅ Services subcategories: Dog Walking, Babysitting, Math Tutoring, Elderly Companion
- ✅ Scoped to verified estate residents only (Verified badge shown)
- ✅ Requests categories: Plant Care, Moving Help, Carpool, Food Share (structured, not freeform)
- ✅ Time-bounded help requests (expiresIn shown: "2 days", "1 day", "5 days", "3 hours")
- ✅ Two-tab structure: **Requests** | **Items & Services**
- ✅ Search bar: "Search requests, items and services..."
- ✅ Filter chips on Items & Services: All | Items | Services
- ✅ Responder expresses interest → both confirm before contact details shared (ExpressInterest → PosterNotification → MutualConfirm → Chat)
- ✅ Trust signals: Verified badge, response rate, past exchange history
- ✅ **Pet sitting and babysitting highlighted with trust signals** (DBS checked badge on babysitter)
- ✅ Scoped to estate first
- ✅ Closed, bounded interaction
- ✅ Wishlist functionality (save items)
- ✅ Reviews section (3 mock reviews with star ratings + avatars)

### ⚠️ Partially Implemented / TODO:
- 🟡 **Matching mechanism** — Currently requires manual browsing. No smart matching algorithm that matches "need babysitter Saturday" with "offer babysitting service."

- 🟡 **Reviews system** — Mock reviews shown but not fully integrated. No ability to leave reviews after exchange.

---

## Cross-Cutting Features

### ✅ Implemented:
- ✅ Singpass verification (LoginPage with "Singpass Login" button)
- ✅ Separate entry points: Events tab, Explore (Events + Connect), Marketplace, Messages
- ✅ Verified resident badge visible across all profiles, posts, listings
- ✅ Ability to report posts/listings — **UI not fully shown but could be added**
- ✅ Low-engagement browsing — users can browse without committing
- ✅ Privacy: Unit number not shown, only block level (e.g., "Blk 445")

### ⚠️ Partially Implemented / TODO:
- 🟡 **Push notifications personalised by interest tags** — Not implemented (would require backend service).
- 🟡 **Opt-in notification preferences** — Not implemented.
- 🟡 **Report posts/listings/users** — UI not visible but button slots are present in detail pages.

---

## Summary Table

| Feature | Status | Notes |
|---------|--------|-------|
| **Feature 1: Event Filtering** | 🟡 70% | Core filtering by interest works. Age/family status filters exist but don't apply. Neighbour attendance list not integrated. |
| **Feature 2: Neighbour Matching** | ✅ 85% | Connect tab with neighbour cards, chat, and groups all work. Missing push notifications and proximity-based messages in feed. |
| **Feature 3: Help/Items/Services** | ✅ 80% | Full UI and flow complete. Missing smart matching algorithm. |
| **Cross-Cutting** | 🟡 75% | Singpass UI, separate tabs, badges all present. Missing push notifications and reporting UI. |

---

## High-Priority Fixes Needed

1. **Event Filtering** — Wire up age group and family status filters to actually filter results
2. **Event Attendees** — Add neighbour avatars/list to event detail showing who's attending
3. **Smart Matching** — Implement algorithm to match requests with services/items
4. **Reminder Functionality** — Actually trigger reminders for events (1/3/7 days)
5. **Reporting** — Add report button and flow to detail pages

---

## Code Locations

- **Events:** `src/app/pages/ExplorePage.tsx` (lines 41–115)
- **Neighbours/Connect:** `src/app/pages/ConnectPage.tsx` (new file from latest pull)
- **Marketplace:** `src/app/pages/HelpSharePage.tsx`
- **Onboarding:** `src/app/pages/SignUpPage.tsx`
- **Profile:** `src/app/pages/ProfilePage.tsx`
- **Messages:** `src/app/pages/MessagesPage.tsx`
