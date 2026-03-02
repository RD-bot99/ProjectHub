'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { HomeHeader } from '@/components/home/HomeHeader';
import { LandingPage } from '@/components/home/LandingPage';

export default function HomePage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <HomeHeader />
        <main className="pt-0">
          <LandingPage isAuthenticated={true} />
        </main>
      </div>
    </ProtectedRoute>
  );
}
