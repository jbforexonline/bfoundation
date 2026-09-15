# BFOUNDATION.RW — React + SCSS Build

A componentized recreation of the BFOUNDATION.RW landing page, built with React (Vite) and SCSS.

## Setup

```bash
npm install
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`).

To build for production:

```bash
npm run build
```

## Structure

```
src/
  components/
    Header.jsx / .scss          — top nav (React Router links), search, log in / sign up
    Footer.jsx / .scss          — links, newsletter, socials
    PageHero.jsx / .scss        — shared banner used at the top of every sub-page
    Hero.jsx / .scss            — homepage headline, CTAs, pillars
    HallOfFame.jsx / .scss      — homepage 3-winner podium card
    RwandaHighlight.jsx / .scss — Rwanda outline (low-poly, Lake Kivu coastline) + countdown
    CountdownTimer.jsx / .scss  — live-ticking countdown (real timer logic)
    StatsBar.jsx / .scss        — 4-stat strip
    FanChallenge.jsx / .scss    — "Ultimate Fan Challenge" banner
    Categories.jsx / .scss      — 10-category grid
    GiveBack.jsx / .scss        — prize math strip
    HowItWorks.jsx / .scss      — homepage 5-step process
    auth/
      AuthModal.jsx / .scss     — shared login/sign-up shell (brand panel + form)
      Login.jsx                 — email/password, remember me, social buttons
      SignUp.jsx                — full sign-up form incl. country + validation
      AuthForm.scss             — shared field/button styles for all forms
  pages/
    Home.jsx                    — composes the homepage sections
    HallOfFamePage.jsx / .scss   — full winner archive with year tabs
    NominatePage.jsx / .scss    — nomination form + "how it works" aside
    VotePage.jsx / .scss        — category tabs + interactive voting
    HowToVotePage.jsx / .scss   — 4-step guide + FAQ accordion
    ContactPage.jsx / .scss     — contact form + info card
  styles/
    _variables.scss             — color/type/spacing tokens
    _base.scss                  — resets, global element styles, .btn, .section
  App.jsx / App.scss            — shared layout: Header + <Outlet /> + Footer + AuthModal
  routes.jsx                    — route table (all pages render inside App)
  main.jsx                      — React Router root (createBrowserRouter)
```

## Routing

Every page in the header — plus everything reachable from the new **Explore BFOUNDATION** section on the homepage — is its own route and its own file under `src/pages/`, all rendering inside the shared `App` layout so the Header, Footer, and auth modal never re-mount:

| Section | Route | Page component |
|---|---|---|
| Home | `/` | `pages/Home.jsx` |
| Contestants | `/contestants` | `pages/ContestantsPage.jsx` |
| Categories | `/categories` | `pages/CategoriesPage.jsx` |
| Hall of Fame | `/hall-of-fame` | `pages/HallOfFamePage.jsx` |
| Sponsors | `/sponsors` | `pages/SponsorsPage.jsx` |
| Events | `/events` | `pages/EventsPage.jsx` |
| Apply (contestant application) | `/apply` | `pages/ApplicationPage.jsx` |
| About | `/about` | `pages/AboutPage.jsx` |
| Nominatee... (suggest a contestant) | `/nominate` | `pages/NominatePage.jsx` |
| Community Nominations | `/community-nominations` | `pages/CommunityNominationsPage.jsx` |
| Vote | `/vote` | `pages/VotePage.jsx` |
| How to Vote | `/how-to-vote` | `pages/HowToVotePage.jsx` |
| Contact Us | `/contact` | `pages/ContactPage.jsx` |

### Fan Dashboard

`/dashboard/fan/*` is a separate sidebar-driven layout (`pages/fan/FanLayout.jsx` + shared `components/dashboard/DashboardLayout.jsx`):

| Sidebar item | Route |
|---|---|
| Profile | `/dashboard/fan/profile` |
| Contestants | `/dashboard/fan/contestants` |
| Messages | `/dashboard/fan/messages` |
| Vote History | `/dashboard/fan/vote-history` |
| Purchased Votes | `/dashboard/fan/purchased-votes` |
| Favorite Contestants | `/dashboard/fan/favorites` |
| Notifications | `/dashboard/fan/notifications` |
| Event Tickets | `/dashboard/fan/event-tickets` |

- **Contestants** is a searchable, filterable list where each row expands in place into the contestant's full profile (bio, gallery, links) with **Message** and **Vote Now** actions.
- **Message** opens `/dashboard/fan/messages` (built on the shared `components/messaging/MessagingPanel.jsx`) with that contestant's thread pre-selected.
- **Vote Now** opens `/dashboard/fan/vote` (`FanVoteCheckoutPage.jsx`) — the paid-votes flow: a votes/price table (1 → 2,000 RWF, 10 → 20,000 RWF, 50 → 90,000 RWF, 100 → 180,000 RWF, 500 → 800,000 RWF) plus a Mobile Money / Cards / International Payments method switch, each with its own fields. Submitting shows a success screen — no real payment gateway is wired up (see the `// TODO` in that file).

You reach the dashboard by logging in or completing sign-up (both redirect there), or directly via the "Fan Dashboard (demo)" link in the footer.

### Admin Dashboard

`/dashboard/admin/*` uses the same `AdminLayout.jsx` + shared `DashboardLayout.jsx` pattern:

| Sidebar item | Route |
|---|---|
| Contestants | `/dashboard/admin/contestants` |
| Categories | `/dashboard/admin/categories` |
| Votes | `/dashboard/admin/votes` |
| Payments | `/dashboard/admin/payments` |
| Events | `/dashboard/admin/events` |
| Sponsors | `/dashboard/admin/sponsors` |
| Applications | `/dashboard/admin/applications` |
| Analytics | `/dashboard/admin/analytics` |

Categories, Votes, Payments, Sponsors, and Events each have an **"+ Add"** button that opens a shared `components/ui/Modal.jsx` with a small form; submitting prepends a new row to that page's table (client-side state only — see the `// TODO` in each page for where the real "create" endpoint goes). Contestants and Applications keep their approve/suspend/reject actions. Analytics uses real `chart.js` charts via `react-chartjs-2` (`components/ui/ChartCard.jsx`). Reach it via the "Admin Dashboard (demo)" link in the footer.

### Contestant Dashboard

`/dashboard/contestant/*` — same shell, via `pages/contestant/ContestantLayout.jsx`, with a **grouped** sidebar (`DashboardLayout` renders `navGroups` with section labels, not just a flat list):

| Group | Sidebar item | Route |
|---|---|---|
| Profile Management | Public Profile | `/dashboard/contestant/public-profile` |
| | Media Gallery | `/dashboard/contestant/media-gallery` |
| | Voting Page | `/dashboard/contestant/voting-page` |
| Analytics | Vote Overview | `/dashboard/contestant/vote-overview` |
| | Vote Growth | `/dashboard/contestant/vote-growth` |
| | Ranking | `/dashboard/contestant/ranking` |
| | Performance | `/dashboard/contestant/performance` |
| Campaign Content | Posts | `/dashboard/contestant/posts` |
| | Promotional Materials | `/dashboard/contestant/promotional-materials` |
| | Share & Promote | `/dashboard/contestant/share-promote` |
| Supporter Insights | Supporters | `/dashboard/contestant/supporters` |
| | Demographics | `/dashboard/contestant/demographics` |
| | Engagement | `/dashboard/contestant/engagement` |
| (ungrouped) | Notifications | `/dashboard/contestant/notifications` |
| | Messages | `/dashboard/contestant/messages` |

Highlights:
- **Media Gallery** is a real (client-side) photo upload — pick one or more image files, they render immediately via `FileReader`, and you can set any photo as the cover or remove it. Nothing is uploaded to a server yet (see the `// TODO`).
- **Messages** uses the same `MessagingPanel` as the Fan dashboard, showing fans as contacts instead of contestants.
- **Share & Promote** opens real share intents (WhatsApp/Facebook/X) for the contestant's voting link.
- Vote Overview / Growth / Ranking / Performance and Demographics/Engagement reuse `StatCard`, `ChartCard`, and `DataTable`.

Reach it via the "Contestant Dashboard (demo)" link in the footer.

### Choosing a dashboard at login

The login form (`components/auth/Login.jsx`) has a three-way **Fan / Contestant / Admin** toggle at the top. Whichever is selected when you submit determines which dashboard you land in — `AuthModal.jsx` maps the chosen role to its dashboard path. Sign-up stays Fan-only, since that's the public registration flow.

### Auth flows

The login/sign-up modal (`components/auth/AuthModal.jsx`) has four modes: `login`, `signup`, `forgot` (password reset), and `verify` (email verification). Sign-up success automatically transitions into the verify-email screen; "Forgot password?" on the login form switches to the reset-password screen. All four share `AuthForm.scss`.

## Notes

- Icons come from `lucide-react`; routing from `react-router-dom`; charts from `chart.js` + `react-chartjs-2` (all in `package.json`).
- The countdown timer runs on real `Date` math (set in `RwandaHighlight.jsx` via `VOTE_DEADLINE`) — wire it up to your actual campaign end date.
- Reusable primitives live in `src/components/ui/` (`StatCard`, `Badge`, `DataTable`, `ChartCard`, `Modal`), `src/components/dashboard/` (`DashboardLayout` — supports flat or grouped `navGroups` — plus `DashboardClock` and shared `DashboardPage.scss`), and `src/components/messaging/` (`MessagingPanel`, shared by the Fan and Contestant dashboards).
- Contestants, sponsors, events, nominations, and dashboard data are placeholder arrays at the top of each page file — replace them with real API data when you connect a backend.
- Every form and every admin "Add" action validates client-side and logs its payload to the console with a `// TODO` marking where to wire in your real endpoint. None of it persists across a page refresh.
- Colors, spacing, and fonts are centralized in `src/styles/_variables.scss` — change tokens there to re-theme the whole site.
- Fully responsive: nav wraps and stacks under ~992px, all grids collapse further down to mobile, and the dashboard sidebar becomes a horizontal bar on small screens.
