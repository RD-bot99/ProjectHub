'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { TasksList } from '@/components/tasks/TasksList';

export default function TasksPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout activeTab="tasks">
        <TasksList />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
