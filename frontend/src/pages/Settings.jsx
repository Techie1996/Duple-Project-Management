import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Shield, Monitor } from 'lucide-react';
import { Card } from '../components/ui/Card';
import Toggle from '../components/ui/Toggle';

const STORAGE_KEY = 'pmtool_settings_v1';

export default function Settings() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    weeklyDigest: false,
    twoFactorAuth: false,
    sessionTimeout: true,
    compactMode: false
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSettings((s) => ({ ...s, ...JSON.parse(raw) }));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">Settings</h1>
      <div className="grid max-w-3xl gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100">
                <User className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <h2 className="font-medium text-slate-900">Profile</h2>
                <p className="text-sm text-slate-500">Account details and preferences</p>
              </div>
            </div>
            <div className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <Toggle
                checked={settings.compactMode}
                onChange={(v) => setSettings((s) => ({ ...s, compactMode: v }))}
                label="Compact mode"
                description="Tighter spacing across the app"
              />
              <Toggle
                checked={settings.sessionTimeout}
                onChange={(v) => setSettings((s) => ({ ...s, sessionTimeout: v }))}
                label="Auto sign-out"
                description="Sign out after inactivity (recommended on shared devices)"
              />
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <Card className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                <Bell className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <h2 className="font-medium text-slate-900">Notifications</h2>
                <p className="text-sm text-slate-500">Control how you receive updates</p>
              </div>
            </div>
            <div className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <Toggle
                checked={settings.emailNotifications}
                onChange={(v) => setSettings((s) => ({ ...s, emailNotifications: v }))}
                label="Email notifications"
                description="Task assignments, mentions, and project invites"
              />
              <Toggle
                checked={settings.pushNotifications}
                onChange={(v) => setSettings((s) => ({ ...s, pushNotifications: v }))}
                label="In-app notifications"
                description="Show updates in the notifications dropdown"
              />
              <Toggle
                checked={settings.weeklyDigest}
                onChange={(v) => setSettings((s) => ({ ...s, weeklyDigest: v }))}
                label="Weekly digest"
                description="A summary of your activity each week"
              />
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                <Shield className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <h2 className="font-medium text-slate-900">Security</h2>
                <p className="text-sm text-slate-500">Protect your account</p>
              </div>
            </div>
            <div className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <Toggle
                checked={settings.twoFactorAuth}
                onChange={(v) => setSettings((s) => ({ ...s, twoFactorAuth: v }))}
                label="Two-factor authentication"
                description="Add an extra layer of protection to your account"
              />
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                <Monitor className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <h2 className="font-medium text-slate-900">Appearance</h2>
                <p className="text-sm text-slate-500">UI preferences</p>
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              Theme switching can be added next (light/dark/system). Your current UI is optimized for a
              clean SaaS light theme.
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
