import { Outlet } from 'react-router-dom';
import { UserCog, BarChart3, Megaphone, Users2, Bell } from 'lucide-react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';

const NAV_ITEMS = [
  { label: 'Profile Management', to: '/dashboard/contestant/profile', icon: UserCog },
  { label: 'Analytics', to: '/dashboard/contestant/analytics', icon: BarChart3 },
  { label: 'Campaign Content', to: '/dashboard/contestant/campaign', icon: Megaphone },
  { label: 'Supporter Insights', to: '/dashboard/contestant/supporters', icon: Users2 },
  { label: 'Notifications', to: '/dashboard/contestant/notifications', icon: Bell },
];

export default function ContestantLayout() {
  return (
    <DashboardLayout navItems={NAV_ITEMS} roleLabel="Contestant" userName="Malaika Uwase">
      <Outlet />
    </DashboardLayout>
  );
}
