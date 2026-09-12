import { Navigate } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import HallOfFamePage from './pages/HallOfFamePage';
import NominatePage from './pages/NominatePage';
import VotePage from './pages/VotePage';
import HowToVotePage from './pages/HowToVotePage';
import ContactPage from './pages/ContactPage';
import CategoriesPage from './pages/CategoriesPage';
import ContestantsPage from './pages/ContestantsPage';
import SponsorsPage from './pages/SponsorsPage';
import EventsPage from './pages/EventsPage';
import ApplicationPage from './pages/ApplicationPage';
import AboutPage from './pages/AboutPage';
import CommunityNominationsPage from './pages/CommunityNominationsPage';
import FanLayout from './pages/fan/FanLayout';
import FanProfilePage from './pages/fan/FanProfilePage';
import FanVoteHistoryPage from './pages/fan/FanVoteHistoryPage';
import FanPurchasedVotesPage from './pages/fan/FanPurchasedVotesPage';
import FanFavoritesPage from './pages/fan/FanFavoritesPage';
import FanNotificationsPage from './pages/fan/FanNotificationsPage';
import FanEventTicketsPage from './pages/fan/FanEventTicketsPage';
import AdminLayout from './pages/admin/AdminLayout';
import AdminContestantsPage from './pages/admin/AdminContestantsPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminVotesPage from './pages/admin/AdminVotesPage';
import AdminPaymentsPage from './pages/admin/AdminPaymentsPage';
import AdminEventsPage from './pages/admin/AdminEventsPage';
import AdminSponsorsPage from './pages/admin/AdminSponsorsPage';
import AdminApplicationsPage from './pages/admin/AdminApplicationsPage';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';
import ContestantLayout from './pages/contestant/ContestantLayout';
import ContestantProfileManagementPage from './pages/contestant/ContestantProfileManagementPage';
import ContestantAnalyticsPage from './pages/contestant/ContestantAnalyticsPage';
import ContestantCampaignContentPage from './pages/contestant/ContestantCampaignContentPage';
import ContestantSupporterInsightsPage from './pages/contestant/ContestantSupporterInsightsPage';
import ContestantNotificationsPage from './pages/contestant/ContestantNotificationsPage';

// Public pages render inside <App /> (shared Header/Footer/auth modal via <Outlet />).
// The Fan Dashboard below is a separate top-level route with its own self-contained shell.
const routes = [
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },

      // Public Website
      { path: 'contestants', element: <ContestantsPage /> },
      { path: 'categories', element: <CategoriesPage /> },
      { path: 'hall-of-fame', element: <HallOfFamePage /> },
      { path: 'sponsors', element: <SponsorsPage /> },
      { path: 'events', element: <EventsPage /> },
      { path: 'apply', element: <ApplicationPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'nominate', element: <NominatePage /> },
      { path: 'community-nominations', element: <CommunityNominationsPage /> },
      { path: 'vote', element: <VotePage /> },
      { path: 'how-to-vote', element: <HowToVotePage /> },
      { path: 'contact', element: <ContactPage /> },
    ],
  },

  // Fan Dashboard — deliberately NOT nested under <App />, so it renders
  // its own self-contained shell instead of the public Header/Footer.
  {
    path: '/dashboard/fan',
    element: <FanLayout />,
    children: [
      { index: true, element: <Navigate to="profile" replace /> },
      { path: 'profile', element: <FanProfilePage /> },
      { path: 'vote-history', element: <FanVoteHistoryPage /> },
      { path: 'purchased-votes', element: <FanPurchasedVotesPage /> },
      { path: 'favorites', element: <FanFavoritesPage /> },
      { path: 'notifications', element: <FanNotificationsPage /> },
      { path: 'event-tickets', element: <FanEventTicketsPage /> },
    ],
  },

  // Admin Dashboard — same self-contained shell, no site Header/Footer.
  {
    path: '/dashboard/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <Navigate to="contestants" replace /> },
      { path: 'contestants', element: <AdminContestantsPage /> },
      { path: 'categories', element: <AdminCategoriesPage /> },
      { path: 'votes', element: <AdminVotesPage /> },
      { path: 'payments', element: <AdminPaymentsPage /> },
      { path: 'events', element: <AdminEventsPage /> },
      { path: 'sponsors', element: <AdminSponsorsPage /> },
      { path: 'applications', element: <AdminApplicationsPage /> },
      { path: 'analytics', element: <AdminAnalyticsPage /> },
    ],
  },

  // Contestant Dashboard — same self-contained shell, no site Header/Footer.
  {
    path: '/dashboard/contestant',
    element: <ContestantLayout />,
    children: [
      { index: true, element: <Navigate to="profile" replace /> },
      { path: 'profile', element: <ContestantProfileManagementPage /> },
      { path: 'analytics', element: <ContestantAnalyticsPage /> },
      { path: 'campaign', element: <ContestantCampaignContentPage /> },
      { path: 'supporters', element: <ContestantSupporterInsightsPage /> },
      { path: 'notifications', element: <ContestantNotificationsPage /> },
    ],
  },
];

export default routes;
