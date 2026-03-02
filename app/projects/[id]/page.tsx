import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProjectDetail } from '@/components/projects/ProjectDetail';

interface ProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;

  return (
    <ProtectedRoute>
      <DashboardLayout activeTab="projects">
        <ProjectDetail projectId={id} />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
