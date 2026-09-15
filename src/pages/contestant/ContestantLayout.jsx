import { Outlet } from 'react-router-dom';
import {
  UserCog, Image, Vote, Activity, TrendingUp, Trophy, Gauge,
  Megaphone, Download, Share2, Users2, PieChart, Zap, Bell, MessageCircle,
} from 'lucide-react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';

const NAV_GROUPS = [
  {
    label: 'Profile Management',
    items: [
      { label: 'Public Profile', to: '/dashboard/contestant/public-profile', icon: UserCog },
      { label: 'Media Gallery', to: '/dashboard/contestant/media-gallery', icon: Image },
      { label: 'Voting Page', to: '/dashboard/contestant/voting-page', icon: Vote },
    ],
  },
  {
    label: 'Analytics',
    items: [
      { label: 'Vote Overview', to: '/dashboard/contestant/vote-overview', icon: Activity },
      { label: 'Vote Growth', to: '/dashboard/contestant/vote-growth', icon: TrendingUp },
      { label: 'Ranking', to: '/dashboard/contestant/ranking', icon: Trophy },
      { label: 'Performance', to: '/dashboard/contestant/performance', icon: Gauge },
    ],
  },
  {
    label: 'Campaign Content',
    items: [
      { label: 'Posts', to: '/dashboard/contestant/posts', icon: Megaphone },
      { label: 'Promotional Materials', to: '/dashboard/contestant/promotional-materials', icon: Download },
      { label: 'Share & Promote', to: '/dashboard/contestant/share-promote', icon: Share2 },
    ],
  },
  {
    label: 'Supporter Insights',
    items: [
      { label: 'Supporters', to: '/dashboard/contestant/supporters', icon: Users2 },
      { label: 'Demographics', to: '/dashboard/contestant/demographics', icon: PieChart },
      { label: 'Engagement', to: '/dashboard/contestant/engagement', icon: Zap },
    ],
  },
  {
    items: [
      { label: 'Notifications', to: '/dashboard/contestant/notifications', icon: Bell },
      { label: 'Messages', to: '/dashboard/contestant/messages', icon: MessageCircle },
    ],
  },
];

export default function ContestantLayout() {
  return (
    <DashboardLayout navGroups={NAV_GROUPS} roleLabel="Contestant" userName="Malaika Uwase">
      <Outlet />
    </DashboardLayout>
  );
}
