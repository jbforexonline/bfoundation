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

// Fan Dashboard
import FanLayout from './pages/fan/FanLayout';
import FanProfilePage from './pages/fan/FanProfilePage';
import FanContestantsPage from './pages/fan/FanContestantsPage';
import FanMessagesPage from './pages/fan/FanMessagesPage';
import FanVoteHistoryPage from './pages/fan/FanVoteHistoryPage';
import FanPurchasedVotesPage from './pages/fan/FanPurchasedVotesPage';
import FanFavoritesPage from './pages/fan/FanFavoritesPage';
import FanNotificationsPage from './pages/fan/FanNotificationsPage';
import FanEventTicketsPage from './pages/fan/FanEventTicketsPage';
import FanVoteCheckoutPage from './pages/fan/FanVoteCheckoutPage';

// Admin Dashboard
import AdminLayout from './pages/admin/AdminLayout';
import AdminContestantsPage from './pages/admin/AdminContestantsPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminVotesPage from './pages/admin/AdminVotesPage';
import AdminPaymentsPage from './pages/admin/AdminPaymentsPage';
import AdminEventsPage from './pages/admin/AdminEventsPage';
import AdminSponsorsPage from './pages/admin/AdminSponsorsPage';
import AdminApplicationsPage from './pages/admin/AdminApplicationsPage';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';

// Contestant Dashboard
import ContestantLayout from './pages/contestant/ContestantLayout';
import ContestantPublicProfilePage from './pages/contestant/ContestantPublicProfilePage';
import ContestantMediaGalleryPage from './pages/contestant/ContestantMediaGalleryPage';
import ContestantVotingPagePage from './pages/contestant/ContestantVotingPagePage';
import ContestantVoteOverviewPage from './pages/contestant/ContestantVoteOverviewPage';
import ContestantVoteGrowthPage from './pages/contestant/ContestantVoteGrowthPage';
import ContestantRankingPage from './pages/contestant/ContestantRankingPage';
import ContestantPerformancePage from './pages/contestant/ContestantPerformancePage';
import ContestantPostsPage from './pages/contestant/ContestantPostsPage';
import ContestantPromotionalMaterialsPage from './pages/contestant/ContestantPromotionalMaterialsPage';
import ContestantSharePromotePage from './pages/contestant/ContestantSharePromotePage';
import ContestantSupportersPage from './pages/contestant/ContestantSupportersPage';
import ContestantDemographicsPage from './pages/contestant/ContestantDemographicsPage';
import ContestantEngagementPage from './pages/contestant/ContestantEngagementPage';
import ContestantNotificationsPage from './pages/contestant/ContestantNotificationsPage';
import ContestantMessagesPage from './pages/contestant/ContestantMessagesPage';

// Public pages render inside <App /> (shared Header/Footer/auth modal via <Outlet />).
// Each dashboard below is a separate top-level route tree with its own self-contained shell.
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

  // Fan Dashboard
  {
    path: '/dashboard/fan',
    element: <FanLayout />,
    children: [
      { index: true, element: <Navigate to="profile" replace /> },
      { path: 'profile', element: <FanProfilePage /> },
      { path: 'contestants', element: <FanContestantsPage /> },
      { path: 'messages', element: <FanMessagesPage /> },
      { path: 'vote', element: <FanVoteCheckoutPage /> },
      { path: 'vote-history', element: <FanVoteHistoryPage /> },
      { path: 'purchased-votes', element: <FanPurchasedVotesPage /> },
      { path: 'favorites', element: <FanFavoritesPage /> },
      { path: 'notifications', element: <FanNotificationsPage /> },
      { path: 'event-tickets', element: <FanEventTicketsPage /> },
    ],
  },

  // Admin Dashboard
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

  // Contestant Dashboard
  {
    path: '/dashboard/contestant',
    element: <ContestantLayout />,
    children: [
      { index: true, element: <Navigate to="public-profile" replace /> },
      { path: 'public-profile', element: <ContestantPublicProfilePage /> },
      { path: 'media-gallery', element: <ContestantMediaGalleryPage /> },
      { path: 'voting-page', element: <ContestantVotingPagePage /> },
      { path: 'vote-overview', element: <ContestantVoteOverviewPage /> },
      { path: 'vote-growth', element: <ContestantVoteGrowthPage /> },
      { path: 'ranking', element: <ContestantRankingPage /> },
      { path: 'performance', element: <ContestantPerformancePage /> },
      { path: 'posts', element: <ContestantPostsPage /> },
      { path: 'promotional-materials', element: <ContestantPromotionalMaterialsPage /> },
      { path: 'share-promote', element: <ContestantSharePromotePage /> },
      { path: 'supporters', element: <ContestantSupportersPage /> },
      { path: 'demographics', element: <ContestantDemographicsPage /> },
      { path: 'engagement', element: <ContestantEngagementPage /> },
      { path: 'notifications', element: <ContestantNotificationsPage /> },
      { path: 'messages', element: <ContestantMessagesPage /> },
    ],
  },
];

export default routes;
