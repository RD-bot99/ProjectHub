'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DashboardContent } from '@/components/dashboard/DashboardContent';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout activeTab="dashboard">
        <DashboardContent />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
