'use client';

import { useState, useRef, useEffect } from 'react';
import { Trash2, Edit3, Check, X, Image as ImageIcon, Film, Plus, MessageSquare, Lightbulb } from 'lucide-react';
import { Lightbox } from '@/components/ui/Lightbox';
import type { Assignment, DriveFile, Observation } from '@/types/database';

interface CategorySectionProps {
    id: string;
    name: string;
    description: string;
    assignments: Assignment[];
    observations: Observation[];
    useCases: Observation[];
    onDrop: (categoryId: string, file: DriveFile) => void;
    onRemoveAssignment: (assignmentId: string) => void;
    onRename: (id: string, name: string) => void;
    onDelete: (id: string) => void;
    onAddObservation: (text: string, type: 'observation' | 'use_case', categoryId: string) => void;
    onUpdateObservation: (id: string, text: string) => void;
    onDeleteObservation: (id: string) => void;
}

export function CategorySection({
    id, name, description, assignments,
    observations, useCases,
    onDrop, onRemoveAssignment, onRename, onDelete,
    onAddObservation, onUpdateObservation, onDeleteObservation,
}: CategorySectionProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(name);
    const [isDragOver, setIsDragOver] = useState(false);
    const [lightboxAssignment, setLightboxAssignment] = useState<Assignment | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    const handleSaveName = () => {
        if (editName.trim() && editName !== name) onRename(id, editName.trim());
        setIsEditing(false);
    };

    const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; setIsDragOver(true); };
    const handleDragLeave = () => setIsDragOver(false);
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        try {
            const data = e.dataTransfer.getData('application/json');
            if (data) { const file: DriveFile = JSON.parse(data); onDrop(id, file); }
        } catch (err) { console.error('Drop error:', err); }
    };

    return (
        <>
            <section
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative rounded-2xl border-2 transition-all duration-200 ${isDragOver
                    ? 'border-accent bg-accent/5 shadow-lg shadow-accent/10'
                    : 'border-white/5 bg-surface/20 hover:border-white/10'}`}
            >
                {/* Category Header */}
                <div className="p-5 pb-3 flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        {isEditing ? (
                            <div className="flex items-center gap-2">
                                <input ref={inputRef} value={editName} onChange={(e) => setEditName(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === 'Enter') handleSaveName(); if (e.key === 'Escape') setIsEditing(false); }}
                                    className="bg-white/5 border border-accent/40 rounded-lg px-3 py-1.5 text-lg font-display text-white/90 focus:outline-none focus:ring-2 focus:ring-accent/30 w-full"
                                />
                                <button onClick={handleSaveName} className="text-accent hover:text-white p-1.5 transition-colors"><Check className="w-4 h-4" /></button>
                                <button onClick={() => setIsEditing(false)} className="text-white/40 hover:text-white p-1.5 transition-colors"><X className="w-4 h-4" /></button>
                            </div>
                        ) : (
                            <h3 onClick={() => { setEditName(name); setIsEditing(true); }}
                                className="font-display text-xl lg:text-2xl tracking-tight text-white/90 cursor-pointer hover:text-accent transition-colors group"
                                title="Click pentru a redenumi">
                                {name}
                                <Edit3 className="inline ml-2 w-4 h-4 opacity-0 group-hover:opacity-50 transition-opacity" />
                            </h3>
                        )}
                        <span className="text-xs text-white/40 font-sans">
                            {assignments.length} {assignments.length === 1 ? 'fișier' : 'fișiere'}
                        </span>
                    </div>
                    <button onClick={() => { if (confirm(`Ștergi categoria "${name}"? Pozele vor reveni în pool.`)) onDelete(id); }}
                        className="text-white/20 hover:text-red-400 p-2 transition-colors shrink-0" title="Șterge categoria">
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>

                {/* Photos Grid */}
                <div className="px-3 sm:px-5 pb-4">
                    {assignments.length === 0 ? (
                        <div className={`flex flex-col items-center justify-center py-10 rounded-xl border-2 border-dashed transition-colors ${isDragOver ? 'border-accent text-accent' : 'border-white/10 text-white/20'}`}>
                            <ImageIcon className="w-8 h-8 mb-2" />
                            <span className="text-sm font-sans">Trage poze aici din panoul stânga</span>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
                            {assignments.map((a) => (
                                <AssignmentCard key={a.id} assignment={a}
                                    onRemove={() => onRemoveAssignment(a.id)}
                                    onClick={() => setLightboxAssignment(a)} />
                            ))}
                            <div className={`aspect-square rounded-xl border-2 border-dashed flex items-center justify-center transition-colors ${isDragOver ? 'border-accent/60 bg-accent/5' : 'border-white/5'}`}>
                                <span className="text-white/15 text-xs font-sans text-center px-2">+ Trage aici</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Observații */}
                <div className="px-3 sm:px-5 pb-4">
                    <InlineTextBlock
                        title="Observații"
                        icon={<MessageSquare className="w-4 h-4" />}
                        items={observations}
                        type="observation"
                        categoryId={id}
                        onAdd={onAddObservation}
                        onUpdate={onUpdateObservation}
                        onDelete={onDeleteObservation}
                    />
                </div>

                {/* Use Cases Mobexpert */}
                <div className="px-3 sm:px-5 pb-5">
                    <InlineTextBlock
                        title="Use Cases Mobexpert"
                        icon={<Lightbulb className="w-4 h-4" />}
                        items={useCases}
                        type="use_case"
                        categoryId={id}
                        onAdd={onAddObservation}
                        onUpdate={onUpdateObservation}
                        onDelete={onDeleteObservation}
                    />
                </div>
            </section>

            {lightboxAssignment && (
                <Lightbox
                    src={lightboxAssignment.thumbnail_url}
                    alt={lightboxAssignment.filename}
                    driveLink={`https://drive.google.com/file/d/${lightboxAssignment.drive_file_id}/view`}
                    onClose={() => setLightboxAssignment(null)}
                />
            )}
        </>
    );
}

/* ─── Inline Text Block (Observations / Use Cases) ─── */

function InlineTextBlock({
    title, icon, items, type, categoryId,
    onAdd, onUpdate, onDelete,
}: {
    title: string;
    icon: React.ReactNode;
    items: Observation[];
    type: 'observation' | 'use_case';
    categoryId: string;
    onAdd: (text: string, type: 'observation' | 'use_case', categoryId: string) => void;
    onUpdate: (id: string, text: string) => void;
    onDelete: (id: string) => void;
}) {
    const [newText, setNewText] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editText, setEditText] = useState('');

    const handleAdd = () => {
        if (!newText.trim()) return;
        onAdd(newText.trim(), type, categoryId);
        setNewText('');
    };

    const saveEdit = () => {
        if (editingId && editText.trim()) onUpdate(editingId, editText.trim());
        setEditingId(null);
    };

    return (
        <div className="border-t border-white/5 pt-4">
            <div className="flex items-center gap-2 mb-3">
                <span className="text-accent/70">{icon}</span>
                <h4 className="font-sans text-xs uppercase tracking-widest text-white/50 font-bold">{title}</h4>
                {items.length > 0 && (
                    <span className="text-[10px] bg-white/10 text-white/40 px-1.5 py-0.5 rounded-full">{items.length}</span>
                )}
            </div>

            <div className="space-y-2">
                {items.map((item) => (
                    <div key={item.id} className="group flex items-start gap-2">
                        {editingId === item.id ? (
                            <>
                                <textarea autoFocus value={editText} onChange={(e) => setEditText(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); saveEdit(); } if (e.key === 'Escape') setEditingId(null); }}
                                    className="flex-1 bg-white/5 border border-accent/30 rounded-lg px-3 py-1.5 text-xs text-white/80 font-sans resize-none focus:outline-none focus:ring-1 focus:ring-accent/20"
                                    rows={2} />
                                <button onClick={saveEdit} className="text-accent hover:text-white p-1 transition-colors"><Check className="w-3 h-3" /></button>
                                <button onClick={() => setEditingId(null)} className="text-white/40 hover:text-white p-1 transition-colors"><X className="w-3 h-3" /></button>
                            </>
                        ) : (
                            <>
                                <p className="flex-1 text-xs text-white/60 font-sans leading-relaxed whitespace-pre-wrap">{item.text}</p>
                                <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                    <button onClick={() => { setEditingId(item.id); setEditText(item.text); }}
                                        className="text-white/30 hover:text-accent p-1 transition-colors"><Edit3 className="w-3 h-3" /></button>
                                    <button onClick={() => { if (confirm('Ștergi?')) onDelete(item.id); }}
                                        className="text-white/30 hover:text-red-400 p-1 transition-colors"><Trash2 className="w-3 h-3" /></button>
                                </div>
                            </>
                        )}
                    </div>
                ))}

                {/* Add new */}
                <div className="flex gap-2">
                    <input
                        value={newText}
                        onChange={(e) => setNewText(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); }}
                        placeholder={type === 'observation' ? 'Adaugă observație...' : 'Adaugă use case...'}
                        className="flex-1 bg-white/5 border border-white/5 rounded-lg px-3 py-1.5 text-xs text-white/70 font-sans placeholder:text-white/15 focus:outline-none focus:border-accent/30 transition-colors"
                    />
                    <button onClick={handleAdd} disabled={!newText.trim()}
                        className="text-accent/50 hover:text-accent disabled:text-white/10 p-1.5 transition-colors">
                        <Plus className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ─── Assignment Card ─── */

function AssignmentCard({ assignment, onRemove, onClick }: { assignment: Assignment; onRemove: () => void; onClick: () => void; }) {
    const [imgError, setImgError] = useState(false);
    const isVideo = assignment.filename.match(/\.(mp4|mov|avi|webm)$/i);

    return (
        <div onClick={onClick} className="group relative aspect-square rounded-xl overflow-hidden border border-white/5 hover:border-white/20 transition-all cursor-pointer">
            {imgError ? (
                <div className="w-full h-full bg-white/5 flex items-center justify-center">
                    {isVideo ? <Film className="w-8 h-8 text-white/20" /> : <ImageIcon className="w-8 h-8 text-white/20" />}
                </div>
            ) : (
                <img src={assignment.thumbnail_url} alt={assignment.filename} loading="lazy" onError={() => setImgError(true)} className="w-full h-full object-cover" />
            )}
            {isVideo && (
                <div className="absolute top-2 left-2 bg-black/70 rounded-md px-1.5 py-0.5 flex items-center gap-1">
                    <Film className="w-3 h-3 text-accent" /><span className="text-[10px] text-white/70 font-sans">Video</span>
                </div>
            )}
            <button onClick={(e) => { e.stopPropagation(); onRemove(); }}
                className="absolute top-2 right-2 bg-black/70 hover:bg-red-500 text-white/60 hover:text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all" title="Elimină din categorie">
                <X className="w-3 h-3" />
            </button>
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] text-white/70 truncate block font-sans">{assignment.filename}</span>
            </div>
        </div>
    );
}
