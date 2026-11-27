# BFOUNDATION.RW — React + SCSS Build

A componentized recreation of the BFOUNDATION.RW landing page, built with React (Vite) and SCSS.

## Setup

```bash
npm install
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`).

### Connecting to the backend API

The site talks to the BFOUNDATION.RW backend (Express + PostgreSQL, separate repository).
Its address is read from `VITE_API_URL` **at build time**:

```bash
cp .env.example .env.local      # VITE_API_URL=http://localhost:5000/api/v1 for a local backend
npm run dev
```

- **Docker / Dokploy:** pass it as a build argument, e.g. `VITE_API_URL=https://api.bfoundation.rw/api/v1`
  (see `Dockerfile` and `docker-compose.yml`). Rebuild after changing it.
- The backend must allow this site's address in its `FRONTEND_URL` (CORS), e.g.
  `FRONTEND_URL=https://bfoundation.rw,http://localhost:5173`.
- API code lives in `src/api/client.js` (base URL, tokens, automatic token refresh, error messages,
  file downloads, page-view tracking), `src/auth/` (`AuthContext` = who is logged in, `RequireRole` = dashboard
  protection), `src/hooks/useApi.js` and `src/hooks/useUnread.js` (notification / message badges).

**What is connected:** every page except the payment screens (Fan → Vote checkout and Purchased Votes,
Admin → Payments), which stay as previews until Paypack payments are switched on. Contestants never see
exact vote counts: their analytics show levels, ranks and percentages (only admins see real numbers).

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

`/dashboard/fan/*` (`pages/fan/FanLayout.jsx` + shared `components/dashboard/DashboardLayout.jsx`, with a notification bell):

| Sidebar item | Route | What it does |
|---|---|---|
| Profile | `/dashboard/fan/profile` | Account details, optional gender / birth year / province, invite-friends link (bonus votes), password |
| Contestants | `/dashboard/fan/contestants` | Real contestants: profile, photos, posts (❤️ + comments), favorite, message, free vote |
| Messages | `/dashboard/fan/messages` | Private chat with contestants (`components/messaging/MessagingPanel.jsx`) |
| Vote History | `/dashboard/fan/vote-history` | Votes cast |
| Purchased Votes | `/dashboard/fan/purchased-votes` | Preview (payments not switched on) |
| Favorite Contestants | `/dashboard/fan/favorites` | Followed contestants |
| My Nominations | `/dashboard/fan/nominations` | Nominations submitted and supported |
| Notifications | `/dashboard/fan/notifications` | In-app notifications (`components/dashboard/NotificationsList.jsx`) |
| Event Tickets | `/dashboard/fan/event-tickets` | Tickets with QR codes |

### Admin Dashboard

`/dashboard/admin/*` (`AdminLayout.jsx`). Moderators see the same pages but can't create, approve or delete, and don't see Security.

| Sidebar item | Route |
|---|---|
| Contestants · Applications · Nominations · Categories · Votes · Hall of Fame | `/dashboard/admin/contestants`, `…/applications`, `…/nominations`, `…/categories`, `…/votes`, `…/hall-of-fame` |
| Events · Sponsors · Payments (preview) · Analytics | `…/events`, `…/sponsors`, `…/payments`, `…/analytics` |
| Users · Inbox & Newsletter · Security | `…/users`, `…/inbox`, `…/security` |

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

Highlights (all connected to the API):
- **Public Profile / Media Gallery**: bio, links, photos uploaded to the server (first photo = cover).
- **Voting Page / Share & Promote / Promotional Materials**: the voting link `/vote?contestant=<id>`, its QR code,
  share buttons (clicks and shares are counted), and six downloadable SVG graphics with name, photo and QR.
- **Analytics and Supporter Insights**: levels, ranks, percentages and ranges only, never exact vote counts.
- **Posts**: updates that followers are notified about; fans react and comment.
- **Messages / Notifications**: same components as the fan dashboard.

### Choosing a dashboard at login

The login form (`components/auth/Login.jsx`) has a three-way **Fan / Contestant / Admin** toggle at the top. The backend checks the password **and** that the account has the selected role, then the user lands in their own dashboard. Dashboards are protected: logged-out visitors are sent to the login form, and other roles to their own dashboard. Sign-up is Fan-only; contestants are created by admins (directly, or by approving an application from the Apply page).

### Auth flows

The login/sign-up modal (`components/auth/AuthModal.jsx`) has four modes: `login`, `signup`, `forgot` (password reset), and `verify` (email verification). Sign-up success automatically transitions into the verify-email screen; "Forgot password?" on the login form emails a link to the `/reset-password` page (`pages/ResetPasswordPage.jsx`). All four share `AuthForm.scss`.

## Notes

- Icons come from `lucide-react`; routing from `react-router-dom`; charts from `chart.js` + `react-chartjs-2` (all in `package.json`).
- The countdown timer runs on real `Date` math (set in `RwandaHighlight.jsx` via `VOTE_DEADLINE`) — wire it up to your actual campaign end date.
- Reusable primitives live in `src/components/ui/` (`StatCard`, `Badge`, `DataTable`, `ChartCard`, `Modal`), `src/components/dashboard/` (`DashboardLayout` — supports flat or grouped `navGroups` — plus `DashboardClock` and shared `DashboardPage.scss`), and `src/components/messaging/` (`MessagingPanel`, shared by the Fan and Contestant dashboards).
- **Connected to the API:** login / sign-up / email verification / forgot & reset password / logout; Categories, Contestants, Vote (free vote), Apply, Nominate, Community Nominations (support), Events (free tickets); Fan Profile (+ change password), Vote History, Event Tickets (QR codes); Contestant Public Profile (+ change password) and Media Gallery (photo upload); Admin Contestants (add, suspend, verify), Categories, Applications (approve / reject), Votes (stats, adjustments), Events (create, cancel, door check-in).
- **Still demo data** (placeholder arrays at the top of the file, `// TODO` markers): paid votes checkout and purchased votes (online payments are not switched on yet), messages, favorites, notifications, sponsors, Hall of Fame, contact form, analytics, and the contestant analytics/campaign pages.
- Colors, spacing, and fonts are centralized in `src/styles/_variables.scss` — change tokens there to re-theme the whole site.
- Fully responsive: nav wraps and stacks under ~992px, all grids collapse further down to mobile, and the dashboard sidebar becomes a horizontal bar on small screens.
