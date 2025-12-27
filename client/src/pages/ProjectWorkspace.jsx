import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, FileText, CheckSquare, X, User, MoreVertical } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
    DndContext,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableTaskItem = ({ task, onClick }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: task._id || task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
        cursor: 'grab',
        touchAction: 'none'
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="glass-panel"
        >
            <div style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                    <h4 style={{ fontSize: '1rem', margin: 0, flex: 1 }}>{task.title}</h4>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    {task.description}
                </p>
                {task.assignee && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        <User size={14} />
                        {task.assignee.username || 'Unassigned'}
                    </div>
                )}
            </div>
        </div>
    );
};

const ProjectWorkspace = () => {
    const { id } = useParams();
    const { isAuthenticated, user } = useAuth();
    const [workspace, setWorkspace] = useState({ kanban: { todo: [], inProgress: [], done: [] }, notes: [] });
    const [loading, setLoading] = useState(true);
    const [newTask, setNewTask] = useState({ title: '', description: '', column: 'todo' });
    const [newNote, setNewNote] = useState('');
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [showNoteModal, setShowNoteModal] = useState(false);
    const [activeId, setActiveId] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        fetchWorkspace();
    }, [id]);

    const fetchWorkspace = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/projects/${id}/workspace`);
            if (res.ok) {
                const data = await res.json();
                setWorkspace(data);
            }
        } catch (err) {
            console.error('Error fetching workspace:', err);
        } finally {
            setLoading(false);
        }
    };

    const addTask = async () => {
        if (!newTask.title.trim()) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:5000/api/projects/${id}/workspace/kanban`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
                body: JSON.stringify({ column: newTask.column, task: { title: newTask.title, description: newTask.description } })
            });
            if (res.ok) {
                const data = await res.json();
                setWorkspace({ ...workspace, kanban: data });
                setNewTask({ title: '', description: '', column: 'todo' });
                setShowTaskModal(false);
            }
        } catch (err) {
            console.error('Error adding task:', err);
        }
    };

    const addNote = async () => {
        if (!newNote.trim()) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:5000/api/projects/${id}/workspace/notes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
                body: JSON.stringify({ content: newNote })
            });
            if (res.ok) {
                const data = await res.json();
                setWorkspace({ ...workspace, notes: data });
                setNewNote('');
                setShowNoteModal(false);
            }
        } catch (err) {
            console.error('Error adding note:', err);
        }
    };

    const moveTask = async (taskId, targetColumn) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:5000/api/projects/${id}/workspace/kanban/move`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
                body: JSON.stringify({ taskId, targetColumn })
            });
            if (res.ok) {
                const data = await res.json();
                setWorkspace({ ...workspace, kanban: data });
            }
        } catch (err) {
            console.error('Error moving task:', err);
        }
    };

    const findContainer = (id) => {
        if (id in workspace.kanban) {
            return id;
        }

        // Ensure tasks exist and have IDs
        const container = Object.keys(workspace.kanban).find(key =>
            workspace.kanban[key].find(task => (task._id || task.id) === id)
        );
        return container;
    };

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragOver = (event) => {
        const { active, over } = event;
        const overId = over ? over.id : null;

        if (!overId || active.id === overId) return;

        const activeContainer = findContainer(active.id);
        const overContainer = findContainer(overId);

        if (!activeContainer || !overContainer || activeContainer === overContainer) {
            return;
        }

        // Optimistic update for Drag Over (moving between columns)
        setWorkspace((prev) => {
            const activeItems = prev.kanban[activeContainer];
            const overItems = prev.kanban[overContainer];
            const activeIndex = activeItems.findIndex(i => (i._id || i.id) === active.id);
            const overIndex = overItems.findIndex(i => (i._id || i.id) === overId);

            let newIndex;
            if (overId in prev.kanban) {
                newIndex = overItems.length + 1;
            } else {
                const isBelowOverItem =
                    over &&
                    active.rect.current.translated &&
                    active.rect.current.translated.top > over.rect.top + over.rect.height;

                const modifier = isBelowOverItem ? 1 : 0;
                newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
            }

            return {
                ...prev,
                kanban: {
                    ...prev.kanban,
                    [activeContainer]: [...prev.kanban[activeContainer].filter(item => item !== activeItems[activeIndex])],
                    [overContainer]: [
                        ...prev.kanban[overContainer].slice(0, newIndex),
                        activeItems[activeIndex],
                        ...prev.kanban[overContainer].slice(newIndex, prev.kanban[overContainer].length)
                    ]
                }
            };
        });
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;
        const activeContainer = findContainer(active.id);
        const overContainer = findContainer(over ? over.id : null);

        if (activeContainer && overContainer && activeContainer !== overContainer) {
            // API call to persist the move
            await moveTask(active.id, overContainer);
        }

        setActiveId(null);
    };

    const columns = [
        { key: 'todo', label: 'To Do', color: '#6b7280' },
        { key: 'inProgress', label: 'In Progress', color: '#3b82f6' },
        { key: 'done', label: 'Done', color: '#10b981' }
    ];

    const dropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({
            styles: {
                active: {
                    opacity: '0.5',
                },
            },
        }),
    };

    if (loading) return <div className="container" style={{ padding: '2rem' }}>Loading workspace...</div>;

    return (
        <div className="container" style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h1 style={{ fontSize: '2rem' }}>Project Workspace</h1>
                {isAuthenticated && (
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button onClick={() => setShowTaskModal(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Plus size={18} /> Add Task
                        </button>
                        <button onClick={() => setShowNoteModal(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FileText size={18} /> Add Note
                        </button>
                    </div>
                )}
            </div>

            {/* Kanban Board */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
                    <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <CheckSquare size={24} /> Kanban Board
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                        {columns.map(column => (
                            <div key={column.key} style={{ minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
                                <div style={{
                                    padding: '1rem',
                                    background: `${column.color}20`,
                                    borderTop: `3px solid ${column.color}`,
                                    borderRadius: '8px',
                                    marginBottom: '1rem'
                                }}>
                                    <h3 style={{ margin: 0, color: column.color }}>{column.label}</h3>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                        {workspace.kanban[column.key]?.length || 0} tasks
                                    </span>
                                </div>

                                <SortableContext
                                    id={column.key}
                                    items={(workspace.kanban[column.key] || []).map(t => t._id || t.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                                        {workspace.kanban[column.key]?.map((task) => (
                                            <SortableTaskItem key={task._id || task.id} task={task} />
                                        ))}
                                    </div>
                                </SortableContext>
                            </div>
                        ))}
                    </div>
                </div>

                <DragOverlay dropAnimation={dropAnimation}>
                    {activeId ? (
                        <div className="glass-panel" style={{ padding: '1rem', transform: 'rotate(3deg)', cursor: 'grabbing' }}>
                            Task Dragging...
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>

            {/* Notes Section */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
                <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FileText size={24} /> Shared Notes
                </h2>
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {workspace.notes?.length > 0 ? (
                        workspace.notes.map((note, idx) => (
                            <div key={idx} style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ fontWeight: '600', color: 'var(--primary)' }}>
                                        {note.author?.username || 'Anonymous'}
                                    </span>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                        {new Date(note.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p style={{ color: 'var(--text-muted)', whiteSpace: 'pre-wrap' }}>{note.content}</p>
                            </div>
                        ))
                    ) : (
                        <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                            No notes yet. Add one to get started!
                        </p>
                    )}
                </div>
            </div>

            {/* Add Task Modal */}
            {showTaskModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)',
                    display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
                }}>
                    <div className="glass-panel" style={{ width: '90%', maxWidth: '500px', padding: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h2>Add Task</h2>
                            <button onClick={() => setShowTaskModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}>
                                <X size={24} />
                            </button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <input
                                className="glass-input"
                                placeholder="Task Title"
                                value={newTask.title}
                                onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                                required
                            />
                            <textarea
                                className="glass-input"
                                placeholder="Description"
                                rows={3}
                                value={newTask.description}
                                onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                            />
                            <select
                                className="glass-input"
                                value={newTask.column}
                                onChange={e => setNewTask({ ...newTask, column: e.target.value })}
                            >
                                <option value="todo">To Do</option>
                                <option value="inProgress">In Progress</option>
                                <option value="done">Done</option>
                            </select>
                            <button onClick={addTask} className="btn-primary">Add Task</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Note Modal */}
            {showNoteModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)',
                    display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
                }}>
                    <div className="glass-panel" style={{ width: '90%', maxWidth: '500px', padding: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h2>Add Note</h2>
                            <button onClick={() => setShowNoteModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}>
                                <X size={24} />
                            </button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <textarea
                                className="glass-input"
                                placeholder="Write your note..."
                                rows={6}
                                value={newNote}
                                onChange={e => setNewNote(e.target.value)}
                                required
                            />
                            <button onClick={addNote} className="btn-primary">Add Note</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectWorkspace;
