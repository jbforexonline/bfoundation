import { Outlet } from 'react-router-dom';
import {
  Users, LayoutGrid, Vote, CreditCard, CalendarDays, Handshake, ClipboardList, BarChart3,
  Megaphone, Trophy, UserCog, Inbox, ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import DashboardLayout from '../../components/dashboard/DashboardLayout';

const NAV_GROUPS = [
  {
    label: 'Competition',
    items: [
      { label: 'Contestants', to: '/dashboard/admin/contestants', icon: Users },
      { label: 'Applications', to: '/dashboard/admin/applications', icon: ClipboardList },
      { label: 'Nominations', to: '/dashboard/admin/nominations', icon: Megaphone },
      { label: 'Categories', to: '/dashboard/admin/categories', icon: LayoutGrid },
      { label: 'Votes', to: '/dashboard/admin/votes', icon: Vote },
      { label: 'Hall of Fame', to: '/dashboard/admin/hall-of-fame', icon: Trophy },
    ],
  },
  {
    label: 'Business',
    items: [
      { label: 'Events', to: '/dashboard/admin/events', icon: CalendarDays },
      { label: 'Sponsors', to: '/dashboard/admin/sponsors', icon: Handshake },
      { label: 'Payments', to: '/dashboard/admin/payments', icon: CreditCard },
      { label: 'Analytics', to: '/dashboard/admin/analytics', icon: BarChart3 },
    ],
  },
  {
    label: 'People',
    items: [
      { label: 'Users', to: '/dashboard/admin/users', icon: UserCog },
      { label: 'Inbox & Newsletter', to: '/dashboard/admin/inbox', icon: Inbox },
    ],
  },
];
// Activity log and fraud flags: admins only (moderators don't see this menu item).
const SECURITY = { label: 'Security', to: '/dashboard/admin/security', icon: ShieldCheck };

export default function AdminLayout() {
  const { user } = useAuth();
  const groups =
    user?.role === 'ADMIN'
      ? NAV_GROUPS.map((g) => (g.label === 'People' ? { ...g, items: [...g.items, SECURITY] } : g))
      : NAV_GROUPS;
  return (
    <DashboardLayout navGroups={groups} roleLabel={user?.role === 'MODERATOR' ? 'Moderator' : 'Admin'}>
      <Outlet />
    </DashboardLayout>
  );
}
