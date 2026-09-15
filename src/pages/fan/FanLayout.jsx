import { Outlet } from 'react-router-dom';
import { User, History, ShoppingCart, Heart, Bell, Ticket, Users, MessageCircle } from 'lucide-react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';

const NAV_GROUPS = [
  {
    items: [
      { label: 'Profile', to: '/dashboard/fan/profile', icon: User },
      { label: 'Contestants', to: '/dashboard/fan/contestants', icon: Users },
      { label: 'Messages', to: '/dashboard/fan/messages', icon: MessageCircle },
      { label: 'Vote History', to: '/dashboard/fan/vote-history', icon: History },
      { label: 'Purchased Votes', to: '/dashboard/fan/purchased-votes', icon: ShoppingCart },
      { label: 'Favorite Contestants', to: '/dashboard/fan/favorites', icon: Heart },
      { label: 'Notifications', to: '/dashboard/fan/notifications', icon: Bell },
      { label: 'Event Tickets', to: '/dashboard/fan/event-tickets', icon: Ticket },
    ],
  },
];

export default function FanLayout() {
  return (
    <DashboardLayout navGroups={NAV_GROUPS} roleLabel="Fan" userName="Joyce U.">
      <Outlet />
    </DashboardLayout>
  );
}
