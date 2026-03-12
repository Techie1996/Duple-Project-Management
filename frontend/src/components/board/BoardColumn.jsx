import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import TaskCard from '../task/TaskCard';

export default function BoardColumn({ column, tasks, onTaskClick }) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <motion.div
      layout
      className="flex h-full min-w-[280px] max-w-[320px] flex-col rounded-xl border border-slate-200 bg-slate-50/50"
    >
      <div className="border-b border-slate-200 px-4 py-3">
        <h3 className="font-semibold text-slate-800">{column.name}</h3>
        <span className="text-sm text-slate-500">{tasks.length} tasks</span>
      </div>
      <div
        ref={setNodeRef}
        className={cn(
          'flex-1 space-y-3 overflow-auto p-4 transition-colors',
          isOver && 'bg-primary-50/50'
        )}
      >
        <SortableContext items={(tasks || []).map((t) => t.id ?? t._id)} strategy={verticalListSortingStrategy}>
          {(tasks || []).map((task) => (
            <TaskCard
              key={task.id ?? task._id}
              task={task}
              onClick={onTaskClick}
            />
          ))}
        </SortableContext>
      </div>
    </motion.div>
  );
}
