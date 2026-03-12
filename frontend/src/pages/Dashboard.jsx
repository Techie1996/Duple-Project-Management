import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Users, Calendar, FolderKanban } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { CardSkeleton } from '../components/ui/Skeleton';
import { getProjects, createProject } from '../services/api';

function ProjectsGrid({ projects, navigate }) {
  return (
    <motion.div
      layout
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
    >
      <AnimatePresence>
        {projects.map((project) => {
          const projectId = project.id ?? project._id;
          return (
            <motion.div
              key={projectId}
              variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
            >
              <Card hover onClick={() => navigate('/projects/' + projectId)}>
                <h3 className="font-semibold text-slate-900">{project.name}</h3>
                <div className="mt-3 flex items-center gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {project.memberCount ?? project.members?.length ?? 0} members
                  </span>
                  {project.updatedAt && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(project.updatedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getProjects()
      .then((res) => {
        const list = res?.data ?? res?.projects ?? [];
        if (!cancelled) setProjects(Array.isArray(list) ? list : []);
      })
      .catch(() => {
        if (!cancelled) setProjects([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    try {
      const res = await createProject({ name: newName.trim() });
      const proj = res?.data ?? res;
      if (proj?.id || proj?._id) {
        setProjects((prev) => [...prev, { ...proj, name: proj.name || newName }]);
        setCreateOpen(false);
        setNewName('');
        navigate(`/projects/${proj.id ?? proj._id}`);
      }
    } catch {
      // Mock add for demo when backend not ready
      const mock = { id: `mock-${Date.now()}`, name: newName.trim(), memberCount: 1, updatedAt: new Date().toISOString() };
      setProjects((prev) => [...prev, mock]);
      setCreateOpen(false);
      setNewName('');
      navigate(`/projects/${mock.id}`);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">
            Your projects at a glance.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          Create Project
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-100 py-16"
        >
          <FolderKanban className="h-14 w-14 text-slate-300" />
          <p className="mt-4 text-slate-600">No projects yet</p>
          <p className="mt-1 text-sm text-slate-500">Create your first project to get started</p>
          <Button className="mt-6" onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            Create Project
          </Button>
        </motion.div>
      ) : (
        <ProjectsGrid projects={projects} navigate={navigate} />
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
              <h2 className="text-lg font-semibold text-slate-900">Create project</h2>
              <form onSubmit={handleCreate} className="mt-4">
                <input
                  type="text"
                  placeholder="Project name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  autoFocus
                />
                <div className="mt-4 flex justify-end gap-2">
                  <Button type="button" variant="secondary" onClick={() => setCreateOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" loading={creating} disabled={!newName.trim()}>
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
