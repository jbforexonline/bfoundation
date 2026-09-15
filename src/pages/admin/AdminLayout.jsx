import { Outlet } from 'react-router-dom';
import {
  Users, LayoutGrid, Vote, CreditCard, CalendarDays, Handshake, ClipboardList, BarChart3,
} from 'lucide-react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';

const NAV_GROUPS = [
  {
    items: [
      { label: 'Contestants', to: '/dashboard/admin/contestants', icon: Users },
      { label: 'Categories', to: '/dashboard/admin/categories', icon: LayoutGrid },
      { label: 'Votes', to: '/dashboard/admin/votes', icon: Vote },
      { label: 'Payments', to: '/dashboard/admin/payments', icon: CreditCard },
      { label: 'Events', to: '/dashboard/admin/events', icon: CalendarDays },
      { label: 'Sponsors', to: '/dashboard/admin/sponsors', icon: Handshake },
      { label: 'Applications', to: '/dashboard/admin/applications', icon: ClipboardList },
      { label: 'Analytics', to: '/dashboard/admin/analytics', icon: BarChart3 },
    ],
  },
];

export default function AdminLayout() {
  return (
    <DashboardLayout navGroups={NAV_GROUPS} roleLabel="Admin" userName="System Admin">
      <Outlet />
    </DashboardLayout>
  );
}
