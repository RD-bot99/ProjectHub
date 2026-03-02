'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ImageCarousel } from './ImageCarousel';

interface LandingPageProps {
  isAuthenticated?: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({ isAuthenticated = false }) => {
  const features = [
    {
      icon: '👥',
      title: 'Team Collaboration',
      description: 'Bring your team together with real-time collaboration and communication tools',
    },
    {
      icon: '📊',
      title: 'Project Management',
      description: 'Plan, organize, and track projects with intuitive dashboards and analytics',
    },
    {
      icon: '✅',
      title: 'Task Tracking',
      description: 'Break down work into manageable tasks with priorities and deadlines',
    },
    {
      icon: '⚡',
      title: 'Workflow Automation',
      description: 'Streamline your workflow with automated processes and notifications',
    },
    {
      icon: '👁️',
      title: 'Real-time Updates',
      description: 'Stay in sync with live updates and instant notifications',
    },
    {
      icon: '🔒',
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security for your data and projects',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation - Only show for unauthenticated users */}
      {!isAuthenticated && (
        <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="text-2xl font-bold text-primary">ProjectHub</div>
            <div className="flex gap-4">
              <Link href="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </nav>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden w-full">
        {/* Decorative Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-50 z-0 pointer-events-none"></div>

        {/* Hero Content Container */}
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center z-10 min-h-[500px] flex flex-col items-center justify-center">
          
          {/* Floating UI Elements (Hidden on small screens) */}
          <div className="hidden lg:block absolute inset-0 pointer-events-none">
            {/* Top Left: Sticky Note */}
            <div className="absolute top-10 left-10 w-48 bg-yellow-100 border border-yellow-200 shadow-md p-4 rotate-[-6deg] rounded-sm flex flex-col gap-2">
              <div className="w-4 h-4 rounded-full bg-red-400 absolute -top-2 left-1/2 -translate-x-1/2 shadow-sm"></div>
              <p className="text-yellow-800 text-xs font-medium font-sans leading-relaxed">
                Take notes to keep track of crucial details, and accomplish more tasks with ease.
              </p>
            </div>
            
            {/* Left Box: Checkbox icon floating */}
            <div className="absolute top-36 left-8 bg-white/70 backdrop-blur-md border border-white/50 shadow-xl rounded-2xl p-4 flex items-center justify-center w-16 h-16">
              <div className="w-8 h-8 rounded-md bg-blue-500 flex items-center justify-center shadow-inner">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            {/* Bottom Left: Today's Tasks */}
            <div className="absolute bottom-4 left-10 bg-white/80 backdrop-blur-xl border border-white shadow-2xl rounded-2xl p-4 w-64 translate-y-8">
              <h3 className="font-bold text-sm text-gray-800 mb-3">Today's tasks</h3>
              <div className="space-y-3">
                <div className="bg-gray-50/50 rounded p-2">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-4 h-4 rounded bg-orange-400 text-white text-[10px] flex items-center justify-center">8</span>
                    <span className="text-xs font-medium text-gray-700">New Ideas for campaign</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[60%] rounded-full"></div>
                  </div>
                </div>
                <div className="bg-gray-50/50 rounded p-2">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-4 h-4 rounded bg-emerald-400 text-white text-[10px] flex items-center justify-center">3</span>
                    <span className="text-xs font-medium text-gray-700">Design PPT #4</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-full rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Right: Reminders */}
            <div className="absolute top-12 right-10 bg-white/80 backdrop-blur-xl border border-white shadow-2xl rounded-2xl p-5 w-64 z-10">
              <h3 className="font-bold text-sm text-gray-800 mb-4">Reminders</h3>
              <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3">
                <p className="text-xs font-semibold text-gray-800">Today's Meeting</p>
                <p className="text-[10px] text-gray-500 mb-2">Call with marketing team</p>
                <div className="flex items-center gap-1 text-[10px] text-blue-600 bg-blue-100/50 w-fit px-2 py-1 rounded">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  13:00 - 13:45
                </div>
              </div>
            </div>

            {/* Top Right Clock Icon overlay */}
            <div className="absolute top-24 right-64 bg-white border border-gray-100 shadow-lg rounded-2xl p-3 flex items-center justify-center z-20">
               <svg className="w-8 h-8 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <circle cx="12" cy="12" r="10" strokeWidth="2" />
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2" />
               </svg>
            </div>

            {/* Bottom Right: Integrations */}
            <div className="absolute bottom-8 right-10 bg-white/80 backdrop-blur-xl border border-white shadow-2xl rounded-2xl p-5 w-64">
              <h3 className="font-bold text-sm text-gray-800 mb-3">100+ Integrations</h3>
              <div className="flex justify-center gap-3">
                {/* Mock Icons for Integrations */}
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-red-500 font-bold text-lg">M</div>
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-green-500 font-bold text-lg">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521h-6.313A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522v-2.521zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.523-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.52H15.165z"/></svg>
                </div>
                <div className="w-10 h-10 bg-blue-500 rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-white font-bold text-sm">31</div>
              </div>
            </div>
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold text-foreground mb-6 text-balance relative z-[15]">
            {isAuthenticated ? 'Welcome to ProjectHub' : 'Organize Your Team, Accelerate Your Projects'}
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-balance max-w-2xl mx-auto relative z-[15] bg-background/50 backdrop-blur-sm p-4 rounded-xl">
            {isAuthenticated 
              ? 'Manage your projects, collaborate with your team, and deliver results faster.'
              : 'ProjectHub helps teams collaborate, manage projects, and deliver results faster with powerful tools designed for modern teams.'}
          </p>
          {!isAuthenticated && (
            <div className="flex gap-4 justify-center flex-wrap relative z-[15]">
              <Link href="/register">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white rounded-md">Start Free Trial</Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="rounded-md">Sign In</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Image Carousel Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">See ProjectHub in Action</h2>
          <p className="text-muted-foreground">Discover how teams use ProjectHub to transform their workflow</p>
        </div>
        <ImageCarousel />
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">Powerful Features Built for Teams</h2>
          <p className="text-muted-foreground text-lg">Everything you need to manage projects and collaborate effectively</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 border-border/50 hover:border-primary/50 transition-colors">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary/10 border-y border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">10K+</div>
              <p className="text-muted-foreground">Active Users</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <p className="text-muted-foreground">Teams</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">50K+</div>
              <p className="text-muted-foreground">Projects</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">99.9%</div>
              <p className="text-muted-foreground">Uptime</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Only show for unauthenticated users */}
      {!isAuthenticated && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-4xl font-bold text-foreground mb-6">Ready to Transform Your Workflow?</h2>
          <p className="text-xl text-muted-foreground mb-8 text-balance">
            Join thousands of teams using ProjectHub to manage their projects better.
          </p>
          <Link href="/register">
            <Button size="lg" className="text-lg px-8 py-6">
              Get Started Free
            </Button>
          </Link>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-card border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Features</a></li>
                <li><a href="#" className="hover:text-foreground">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">About</a></li>
                <li><a href="#" className="hover:text-foreground">Blog</a></li>
                <li><a href="#" className="hover:text-foreground">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Documentation</a></li>
                <li><a href="#" className="hover:text-foreground">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Privacy</a></li>
                <li><a href="#" className="hover:text-foreground">Terms</a></li>
                <li><a href="#" className="hover:text-foreground">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>© 2026 ProjectHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
