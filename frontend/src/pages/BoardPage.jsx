import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import BoardColumn from '../components/board/BoardColumn';
import TaskCard from '../components/task/TaskCard';
import TaskModal from '../components/modals/TaskModal';
import {
  getTasks,
  createTask,
  updateTask,
  updateTaskStatus
} from '../services/api';

const DEFAULT_COLUMNS = [
  { id: 'todo', name: 'Todo' },
  { id: 'in_progress', name: 'In Progress' },
  { id: 'done', name: 'Done' }
];

function groupTasksByColumn(tasks, columns) {
  const map = {};
  columns.forEach((col) => {
    map[col.id] = [];
  });
  (tasks || []).forEach((t) => {
    const colId = t.boardId ?? t.status ?? t.columnId ?? 'todo';
    if (!map[colId]) map[colId] = [];
    map[colId].push(t);
  });
  return map;
}

export default function BoardPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [columns] = useState(DEFAULT_COLUMNS);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [saving, setSaving] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [members, setMembers] = useState([]);

  const loadTasks = useCallback(() => {
    getTasks(projectId)
      .then((res) => {
        const list = res?.data ?? res?.tasks ?? [];
        setTasks(Array.isArray(list) ? list : []);
      })
      .catch(() => setTasks([]))
      .finally(() => setLoading(false));
  }, [projectId]);

  useEffect(() => {
    setLoading(true);
    loadTasks();
  }, [loadTasks]);

  const grouped = groupTasksByColumn(tasks, columns);
  const activeTask = activeId ? tasks.find((t) => (t.id ?? t._id) === activeId) : null;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 }
    })
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const resolveColumnId = (overId) => {
    if (columns.some((c) => c.id === overId)) return overId;
    const t = tasks.find((task) => (task.id ?? task._id) === overId);
    return t ? (t.boardId ?? t.status ?? 'todo') : 'todo';
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;
    const taskId = active.id;
    const newColumnId = resolveColumnId(over.id);
    const task = tasks.find((t) => (t.id ?? t._id) === taskId);
    if (!task || (task.boardId ?? task.status) === newColumnId) return;
    setTasks((prev) =>
      prev.map((t) =>
        (t.id ?? t._id) === taskId ? { ...t, boardId: newColumnId, status: newColumnId } : t
      )
    );
    try {
      await updateTaskStatus(projectId, taskId, newColumnId);
    } catch {
      setTasks((prev) =>
        prev.map((t) =>
          (t.id ?? t._id) === taskId ? { ...t, boardId: task.boardId ?? task.status, status: task.status } : t
        )
      );
    }
  };

  const handleSaveTask = async (payload) => {
    setSaving(true);
    try {
      if (editingTask) {
        await updateTask(projectId, editingTask.id ?? editingTask._id, payload);
        setTasks((prev) =>
          prev.map((t) =>
            (t.id ?? t._id) === (editingTask.id ?? editingTask._id)
              ? { ...t, ...payload }
              : t
          )
        );
      } else {
        const res = await createTask(projectId, payload);
        const created = res?.data ?? res;
        if (created) setTasks((prev) => [...prev, { ...created, ...payload }]);
      }
      setModalOpen(false);
      setEditingTask(null);
      loadTasks();
    } catch {
      if (!editingTask) {
        const mock = {
          id: `task-${Date.now()}`,
          _id: `task-${Date.now()}`,
          ...payload
        };
        setTasks((prev) => [...prev, mock]);
        setModalOpen(false);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(`/projects/${projectId}`)}
          className="flex items-center gap-2 rounded-lg p-2 text-slate-600 hover:bg-slate-100"
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </button>
        <Button onClick={() => { setEditingTask(null); setModalOpen(true); }}>
          <Plus className="h-4 w-4" />
          Create Task
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-1 gap-4 overflow-x-auto pb-4">
          {columns.map((col) => (
            <BoardColumn
              key={col.id}
              column={col}
              tasks={grouped[col.id] ?? []}
              onTaskClick={(task) => {
                setEditingTask(task);
                setModalOpen(true);
              }}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? (
            <TaskCard task={activeTask} />
          ) : null}
        </DragOverlay>
      </DndContext>

      <AnimatePresence>
        <TaskModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditingTask(null);
          }}
          task={editingTask}
          columns={columns}
          members={members}
          onSave={handleSaveTask}
          saving={saving}
        />
      </AnimatePresence>
    </div>
  );
}
