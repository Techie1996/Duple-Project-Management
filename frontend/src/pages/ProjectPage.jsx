import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, LayoutGrid, ArrowLeft } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { CardSkeleton } from '../components/ui/Skeleton';
import { getProject, getBoards, createBoard } from '../services/api';

export default function ProjectPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const [projRes, boardsRes] = await Promise.all([
          getProject(projectId).catch(() => ({ data: { name: 'Project' } })),
          getBoards(projectId).catch(() => ({ data: [] }))
        ]);
        if (cancelled) return;
        setProject(projRes?.data ?? projRes ?? { name: 'Project' });
        const list = boardsRes?.data ?? boardsRes?.boards ?? [];
        setBoards(Array.isArray(list) ? list : []);
      } catch {
        if (!cancelled) setBoards([]);
        setProject({ name: 'Project' });
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [projectId]);

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    if (!newBoardName.trim()) return;
    setCreating(true);
    try {
      const res = await createBoard(projectId, { name: newBoardName.trim() });
      const board = res?.data ?? res;
      if (board?.id ?? board?._id) {
        setBoards((prev) => [...prev, { ...board, name: board.name || newBoardName }]);
        setCreateOpen(false);
        setNewBoardName('');
        navigate(`/projects/${projectId}/board/${board.id ?? board._id}`);
      }
    } catch {
      const mock = { id: `board-${Date.now()}`, name: newBoardName.trim() };
      setBoards((prev) => [...prev, mock]);
      setCreateOpen(false);
      setNewBoardName('');
      navigate(`/projects/${projectId}/board/${mock.id}`);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">{project?.name ?? 'Project'}</h1>
          <p className="text-sm text-slate-500">Boards</p>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <>
          <div className="mb-4 flex justify-end">
            <Button onClick={() => setCreateOpen(true)}>
              <Plus className="h-4 w-4" />
              New Board
            </Button>
          </div>
          {boards.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 py-16"
            >
              <LayoutGrid className="h-14 w-14 text-slate-300" />
              <p className="mt-4 text-slate-600">No boards yet</p>
              <Button className="mt-6" onClick={() => setCreateOpen(true)}>
                <Plus className="h-4 w-4" />
                Create Board
              </Button>
            </motion.div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {boards.map((board) => (
                <motion.div
                  key={board.id ?? board._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card
                    hover
                    onClick={() => navigate(`/projects/${projectId}/board/${board.id ?? board._id}`)}
                  >
                    <h3 className="font-semibold text-slate-900">{board.name}</h3>
                    <p className="mt-1 text-sm text-slate-500">Open board</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}

      <AnimatePresence>
        {createOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900 bg-opacity-50 p-4"
            onClick={() => setCreateOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
            >
              <h2 className="text-lg font-semibold text-slate-900">Create board</h2>
              <form onSubmit={handleCreateBoard} className="mt-4">
                <input
                  type="text"
                  placeholder="Board name"
                  value={newBoardName}
                  onChange={(e) => setNewBoardName(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  autoFocus
                />
                <div className="mt-4 flex justify-end gap-2">
                  <Button type="button" variant="secondary" onClick={() => setCreateOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" loading={creating} disabled={!newBoardName.trim()}>
                    Create
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
