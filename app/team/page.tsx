'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { TeamList } from '@/components/team/TeamList';

export default function TeamPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout activeTab="team">
        <TeamList />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
