import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AppContent } from '../context/AppContext';
import { FiEdit, FiTrash2, FiSearch, FiPlus, FiGrid, FiList } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

// Link to uploaded assignment file (local path provided)
const ASSIGNMENT_PDF = 'http://localhost:5173/Frontend Developer Task.pdf';

export default function TasksDashboard() {
  const { backendUrl } = useContext(AppContent);

  // data
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);

  // UI state
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [view, setView] = useState('cards'); // cards | list

  // form / modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', status: 'pending' });

  // fetch tasks
  const fetchTasks = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/tasks/all`, { withCredentials: true });
      if (data?.success) {
        setTasks(data.tasks);
      }
    } catch (err) {
      console.error('fetchTasks error', err?.response || err.message);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  // apply search & filter
  useEffect(() => {
    let out = [...tasks];
    if (search.trim()) {
      const q = search.toLowerCase();
      out = out.filter(t => (t.title || '').toLowerCase().includes(q) || (t.description || '').toLowerCase().includes(q));
    }
    if (filter !== 'all') out = out.filter(t => t.status === filter);

    setFilteredTasks(out);
  }, [search, filter, tasks]);

  const openCreate = () => {
    setEditing(null);
    setForm({ title: '', description: '', status: 'pending' });
    setModalOpen(true);
  };

  const openEdit = (task) => {
    setEditing(task._id);
    setForm({ title: task.title, description: task.description, status: task.status });
    setModalOpen(true);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(`${backendUrl}/api/tasks/update/${editing}`, form, { withCredentials: true });
      } else {
        await axios.post(`${backendUrl}/api/tasks/create`, form, { withCredentials: true });
      }
      setModalOpen(false);
      fetchTasks();
    } catch (err) {
      console.error('submitForm', err?.response || err.message);
    }
  };

  const removeTask = async (id) => {
    if (!confirm('Delete this task?')) return;
    try {
      await axios.delete(`${backendUrl}/api/tasks/delete/${id}`, { withCredentials: true });
      fetchTasks();
    } catch (err) { console.error(err); }
  };

  const statusClasses = (s) => {
    switch (s) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">

        {/* SIDEBAR */}
        <aside className={`bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow border 'hidden lg:block'`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Workspace</h3>
          </div>

          <nav className="space-y-2 text-sm">
            <button onClick={openCreate} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-600 text-white hover:brightness-105 transition">
              <FiPlus /> New Task
            </button>

            <div className="mt-4">
              <h4 className="text-xs font-semibold text-gray-500 uppercase">Filters</h4>
              <div className="mt-2 space-y-2">
                {['all','pending','in-progress','completed'].map(f => (
                  <button key={f} onClick={() => setFilter(f)} className={`w-full text-left px-3 py-2 rounded-lg ${filter === f ? 'bg-indigo-50 border border-indigo-200' : 'hover:bg-gray-50'}`}>
                    <span className="capitalize">{f === 'all' ? 'All' : f.replace('-', ' ')}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-xs font-semibold text-gray-500 uppercase">Resources</h4>
              <a href={ASSIGNMENT_PDF} download className="block mt-2 text-sm text-indigo-600 hover:underline">Download assignment PDF</a>
            </div>
          </nav>
        </aside>

        {/* MAIN */}
        <main className="">
          <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
              <p className="text-gray-500">| Manage your tasks</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center bg-white border rounded-lg px-3 py-2 shadow-sm">
                <FiSearch className="text-gray-400 mr-2" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tasks..." className="outline-none text-sm" />
              </div>

              <div className="inline-flex items-center bg-white border rounded-lg px-2 py-1 shadow-sm">
                <button onClick={() => setView('cards')} className={`p-2 ${view === 'cards' ? 'text-indigo-600' : 'text-gray-500'}`}><FiGrid/></button>
                <button onClick={() => setView('list')} className={`p-2 ${view === 'list' ? 'text-indigo-600' : 'text-gray-500'}`}><FiList/></button>
              </div>
            </div>
          </header>

          {/* CONTENT */}
          <section>
            <AnimatePresence mode="wait">
              {filteredTasks.length === 0 ? (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-8 bg-white rounded-2xl shadow text-center text-gray-500">
                  No tasks yet — create one!
                </motion.div>
              ) : (
                <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`grid gap-4 ${view === 'cards' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                  {filteredTasks.map(t => (
                    <motion.article key={t._id} layout whileHover={{ y: -4 }} className="bg-white rounded-2xl p-4 shadow-sm border">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{t.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{t.description}</p>
                        </div>

                        <div className="flex flex-col items-end gap-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusClasses(t.status)}`}>{t.status}</span>
                          <div className="flex gap-2">
                            <button onClick={() => openEdit(t)} className="p-2 rounded-md hover:bg-gray-100"><FiEdit/></button>
                            <button onClick={() => removeTask(t._id)} className="p-2 rounded-md hover:bg-gray-100 text-red-600"><FiTrash2/></button>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 text-xs text-gray-400">Created: {new Date(t.createdAt).toLocaleString()}</div>
                    </motion.article>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </section>

        </main>
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={() => setModalOpen(false)} />

            <motion.div initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: 20 }} className="relative bg-white rounded-2xl p-6 w-full max-w-md z-50 shadow-lg">
              <h3 className="text-lg font-semibold mb-3">{editing ? 'Edit Task' : 'New Task'}</h3>

              <form onSubmit={submitForm} className="space-y-3">
                <input value={form.title} onChange={(e) => setForm(s => ({...s, title: e.target.value}))} placeholder="Title" className="w-full border rounded-lg px-3 py-2" />
                <textarea value={form.description} onChange={(e) => setForm(s => ({...s, description: e.target.value}))} placeholder="Description" className="w-full border rounded-lg px-3 py-2" />

                <select value={form.status} onChange={(e) => setForm(s => ({...s, status: e.target.value}))} className="w-full border rounded-lg px-3 py-2">
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>

                <div className="flex justify-end gap-2 mt-4">
                  <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg border">Cancel</button>
                  <button type="submit" className="px-4 py-2 rounded-lg bg-indigo-600 text-white">Save</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
