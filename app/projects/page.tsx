'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProjectsList } from '@/components/projects/ProjectsList';

export default function ProjectsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout activeTab="projects">
        <ProjectsList />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
