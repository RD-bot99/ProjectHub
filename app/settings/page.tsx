'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AccountSettings } from '@/components/settings/AccountSettings';

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout activeTab="settings">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your account preferences and security</p>
          <AccountSettings />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
