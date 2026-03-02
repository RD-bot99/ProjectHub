'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export const AccountSettings: React.FC = () => {
  const { user, updateProfile, updatePassword, logout } = useAuth();
  const router = useRouter();

  const [editMode, setEditMode] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Profile form states
  const [firstName, setFirstName] = useState(user?.name?.split(' ')[0] || '');
  const [lastName, setLastName] = useState(user?.name?.split(' ').slice(1).join(' ') || '');
  const [email, setEmail] = useState(user?.email || '');

  // Password form states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUpdateProfile = async () => {
    if (!firstName.trim()) {
      alert('First name is required');
      return;
    }
    try {
      const fullName = lastName.trim() ? `${firstName} ${lastName}` : firstName;
      updateProfile({
        name: fullName,
        email,
      });
      setSuccessMessage('Profile updated successfully!');
      setEditMode(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      alert('Failed to update profile');
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('All fields are required');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }
    try {
      updatePassword(currentPassword, newPassword);
      setSuccessMessage('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordModal(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      alert('Failed to change password. Check your current password.');
    }
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
      router.push('/login');
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {successMessage && (
        <Card className="p-4 bg-accent/20 border border-accent/50">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
            <p className="text-sm font-medium text-accent">{successMessage}</p>
          </div>
        </Card>
      )}

      {/* Profile Section */}
      <Card className="p-6 border-border/50">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">Profile Information</h2>
          {!editMode && (
            <Button variant="outline" size="sm" onClick={() => setEditMode(true)}>
              Edit Profile
            </Button>
          )}
        </div>

        {!editMode ? (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Full Name</p>
              <p className="text-lg font-medium text-foreground">{user?.name || 'Not set'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Email</p>
              <p className="text-lg font-medium text-foreground">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Role</p>
              <span className="inline-block px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">
                {user?.role || 'User'}
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setEditMode(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleUpdateProfile} className="flex-1">
                Save Changes
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Security Section */}
      <Card className="p-6 border-border/50">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">Security</h2>
          <Button variant="outline" size="sm" onClick={() => setShowPasswordModal(true)}>
            Change Password
          </Button>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1C6.48 1 2 5.48 2 11s4.48 10 10 10 10-4.48 10-10S17.52 1 12 1zm-2 15l-5-5 1.41-1.41L10 12.17l7.59-7.59L19 6l-9 9z" />
            </svg>
            <div>
              <p className="font-medium text-foreground">Password Protection</p>
              <p className="text-muted-foreground">Keep your account secure with a strong password</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1C6.48 1 2 5.48 2 11s4.48 10 10 10 10-4.48 10-10S17.52 1 12 1zm-2 15l-5-5 1.41-1.41L10 12.17l7.59-7.59L19 6l-9 9z" />
            </svg>
            <div>
              <p className="font-medium text-foreground">Two-Factor Authentication</p>
              <p className="text-muted-foreground">Coming soon - Add extra layer of security</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="p-6 border border-destructive/20 bg-destructive/5">
        <h2 className="text-xl font-bold text-destructive mb-4">Danger Zone</h2>
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Once you logout, you&apos;ll need to login again to access your account.
          </p>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="w-full border-destructive/30 text-destructive hover:bg-destructive/10"
          >
            Logout
          </Button>
        </div>
      </Card>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md p-8 border-border/50">
            <h2 className="text-xl font-bold text-foreground mb-6">Change Password</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Current Password</label>
                <input
                  type="password"
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">New Password</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowPasswordModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleChangePassword} className="flex-1">
                  Update Password
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
