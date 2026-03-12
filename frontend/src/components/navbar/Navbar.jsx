import React, { useState } from 'react';
import { Search, Bell, ChevronDown, User, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils/cn';
import NotificationsDropdown from './NotificationsDropdown';

export default function Navbar({ onMenuClick }) {
  const { user } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-slate-200 bg-white/80 px-4 shadow-sm backdrop-blur sm:px-6">
      <div className="flex flex-1 items-center gap-3">
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-100 sm:hidden"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div
          className={cn(
            'flex items-center rounded-xl border bg-slate-50 transition-all',
            searchOpen ? 'w-full sm:w-96 border-primary-300' : 'w-full sm:w-80 border-slate-200'
          )}
        >
          <Search className="ml-3 h-4 w-4 shrink-0 text-slate-400" />
          <input
            type="search"
            placeholder="Search projects, tasks..."
            onFocus={() => setSearchOpen(true)}
            onBlur={() => setSearchOpen(false)}
            className="w-full border-0 bg-transparent py-2.5 pl-2 pr-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative">
          <button
            type="button"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Notifications"
            onClick={() => {
              setNotifOpen((v) => !v);
              setProfileOpen(false);
            }}
          >
            <Bell className="h-5 w-5" />
          </button>
          <NotificationsDropdown open={notifOpen} onClose={() => setNotifOpen(false)} />
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen((o) => !o)}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-100"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-600">
              <User className="h-4 w-4" />
            </div>
            <span className="max-w-[120px] truncate text-sm font-medium text-slate-700">
              {user?.name || user?.email || 'User'}
            </span>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>
          {profileOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                aria-hidden
                onClick={() => setProfileOpen(false)}
              />
              <div className="absolute right-0 top-full z-20 mt-1 w-48 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                <div className="border-b border-slate-100 px-3 py-2">
                  <p className="truncate text-sm font-medium text-slate-900">
                    {user?.name || 'User'}
                  </p>
                  <p className="truncate text-xs text-slate-500">{user?.email}</p>
                </div>
                <button
                  type="button"
                  className="w-full px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-50"
                  onClick={() => setProfileOpen(false)}
                >
                  Profile
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
