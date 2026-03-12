import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { Calendar, User, Flag } from 'lucide-react';
import { cn } from '../../utils/cn';

const priorityColors = {
  low: 'bg-slate-100 text-slate-600',
  medium: 'bg-amber-100 text-amber-800',
  high: 'bg-red-100 text-red-700'
};

export default function TaskCard({ task, onClick }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task.id ?? task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  const priority = (task.priority || 'medium').toLowerCase();
  const due = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : null;

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      {...attributes}
      {...listeners}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(task);
      }}
      className={cn(
        'cursor-grab rounded-lg border border-slate-200 bg-white p-4 shadow-card active:cursor-grabbing',
        'hover:shadow-card-hover transition-shadow',
        isDragging && 'opacity-90 shadow-lg z-50'
      )}
    >
      <h4 className="font-medium text-slate-900 line-clamp-1">{task.title}</h4>
      {task.description && (
        <p className="mt-1 text-sm text-slate-500 line-clamp-2">{task.description}</p>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {task.priority && (
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-medium',
              priorityColors[priority] || priorityColors.medium
            )}
          >
            <Flag className="h-3 w-3" />
            {task.priority}
          </span>
        )}
        {due && (
          <span className="flex items-center gap-1 text-xs text-slate-500">
            <Calendar className="h-3 w-3" />
            {due}
          </span>
        )}
        {task.assignedTo && (
          <div
            className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-xs font-medium text-primary-700"
            title={task.assignedTo?.name ?? task.assignedTo}
          >
            {(task.assignedTo?.name ?? task.assignedTo ?? '?').charAt(0).toUpperCase()}
          </div>
        )}
      </div>
    </motion.div>
  );
}
