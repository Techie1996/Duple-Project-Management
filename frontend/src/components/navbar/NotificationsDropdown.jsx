import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, Circle } from 'lucide-react';

const demoNotifications = [
  { id: 'n1', title: 'Task assigned', body: 'You were assigned “Landing page polish”.', time: '2m' },
  { id: 'n2', title: 'Board updated', body: '“Sprint 12” board columns were reordered.', time: '1h' },
  { id: 'n3', title: 'Project invite', body: 'You were added to “Marketing Ops”.', time: '1d' }
];

export default function NotificationsDropdown({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={onClose} aria-hidden />
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="absolute right-0 top-full z-20 mt-2 w-[340px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-slate-500" />
                <p className="text-sm font-semibold text-slate-900">Notifications</p>
              </div>
              <button
                type="button"
                className="text-xs font-medium text-primary-600 hover:text-primary-700"
                onClick={onClose}
              >
                Mark all read
              </button>
            </div>
            <div className="max-h-[360px] overflow-auto">
              {demoNotifications.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  className="w-full px-4 py-3 text-left hover:bg-slate-50"
                  onClick={onClose}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <Circle className="h-2.5 w-2.5 fill-primary-600 text-primary-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-medium text-slate-900">{n.title}</p>
                        <span className="shrink-0 text-xs text-slate-400">{n.time}</span>
                      </div>
                      <p className="mt-0.5 line-clamp-2 text-sm text-slate-600">{n.body}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <div className="border-t border-slate-100 px-4 py-3">
              <button
                type="button"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                onClick={onClose}
              >
                <Check className="h-4 w-4" />
                View all
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

