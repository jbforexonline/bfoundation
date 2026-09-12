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
| Vote History | `/dashboard/fan/vote-history` |
| Purchased Votes | `/dashboard/fan/purchased-votes` |
| Favorite Contestants | `/dashboard/fan/favorites` |
| Notifications | `/dashboard/fan/notifications` |
| Event Tickets | `/dashboard/fan/event-tickets` |

You reach it by logging in or completing sign-up (both redirect there), or directly via the "Fan Dashboard (demo)" link in the footer.

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

Contestants, Categories, Sponsors, and Applications have working approve/suspend/reject actions (client-side state only). Analytics uses real `chart.js` charts via `react-chartjs-2` (`components/ui/ChartCard.jsx`), styled to match the site's dark/gold palette. Reach it via the "Admin Dashboard (demo)" link in the footer.

### Contestant Dashboard

`/dashboard/contestant/*` — same shell again, via `pages/contestant/ContestantLayout.jsx`:

| Sidebar item | Route |
|---|---|
| Profile Management | `/dashboard/contestant/profile` |
| Analytics | `/dashboard/contestant/analytics` |
| Campaign Content | `/dashboard/contestant/campaign` |
| Supporter Insights | `/dashboard/contestant/supporters` |
| Notifications | `/dashboard/contestant/notifications` |

Analytics reuses `ChartCard` for a votes-this-week line chart and a votes-by-source bar chart. Campaign Content lets you post an update (title + message) that gets prepended to the list client-side. Reach it via the "Contestant Dashboard (demo)" link in the footer.

### Choosing a dashboard at login

The login form (`components/auth/Login.jsx`) has a three-way **Fan / Contestant / Admin** toggle at the top. Whichever is selected when you submit determines which dashboard you land in — `AuthModal.jsx` maps the chosen role to its dashboard path. Sign-up stays Fan-only, since that's the public registration flow.

### Auth flows

The login/sign-up modal (`components/auth/AuthModal.jsx`) now has four modes: `login`, `signup`, `forgot` (password reset), and `verify` (email verification). Sign-up success automatically transitions into the verify-email screen; "Forgot password?" on the login form switches to the reset-password screen. All four share `AuthForm.scss`.

## Notes

- Icons come from `lucide-react`; routing from `react-router-dom` (both already in `package.json`).
- The countdown timer runs on real `Date` math (set in `RwandaHighlight.jsx` via `VOTE_DEADLINE`) — wire it up to your actual campaign end date.
- The Rwanda outline in `RwandaHighlight.jsx` is a stylized low-poly silhouette (straighter borders on the north/east/south, a jagged west edge for the Lake Kivu coastline) with a small pulsing marker for Kigali.
- Reusable primitives live in `src/components/ui/` (`StatCard`, `Badge`, `DataTable`, `ChartCard`) and `src/components/dashboard/` (`DashboardLayout`, `DashboardClock`, shared `DashboardPage.scss`) — both the Fan and Admin dashboards are built from these.
- Contestants, sponsors, events, nominations, and fan-dashboard data are placeholder arrays at the top of each page file — replace them with real API data when you connect a backend.
- Every form (Login, Sign Up, Forgot Password, Nominate, Apply, Contact) validates client-side and logs its payload to the console with a `// TODO` marking where to wire in your real endpoint.
- Colors, spacing, and fonts are centralized in `src/styles/_variables.scss` — change tokens there to re-theme the whole site.
- Fully responsive: nav wraps and stacks under ~992px, all grids collapse further down to mobile, and the dashboard sidebar becomes a horizontal bar on small screens.
