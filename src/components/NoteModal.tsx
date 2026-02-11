'use client';

import { useState, useEffect } from 'react';
import { X, Save, Type, AlignLeft, Hash } from 'lucide-react';
import { createNote, updateNote } from '@/lib/actions';
import { cn } from '@/lib/utils';

interface NoteModalProps {
    note?: any;
    isOpen: boolean;
    onClose: () => void;
    groups: any[];
    defaultGroupId?: string;
}

export default function NoteModal({ note, isOpen, onClose, groups, defaultGroupId }: NoteModalProps) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [groupId, setGroupId] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (note) {
            setTitle(note.title);
            setContent(note.content);
            setGroupId(note.groupId || undefined);
        } else {
            setTitle('');
            setContent('');
            setGroupId(defaultGroupId);
        }
    }, [note, defaultGroupId, isOpen]);

    if (!isOpen) return null;

    const handleSave = async () => {
        if (!title.trim()) return;

        if (note) {
            await updateNote(note.id, { title, content, groupId: groupId || null });
        } else {
            await createNote({ title, content, groupId });
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-4 border-b bg-white relative overflow-hidden">
                    {/* Fun Animation: Avocado & Alien */}
                    <div className="absolute inset-x-0 bottom-0 pointer-events-none flex justify-center items-end h-full z-0 opacity-20">
                        <div className="flex items-center gap-12 animate-bounce">
                            <span className="text-4xl animate-pulse">🥑</span>
                            <span className="text-5xl animate-[bounce_1s_infinite] inline-block scale-x-[-1]">👽</span>
                            <span className="text-4xl animate-pulse delay-75">🥑</span>
                        </div>
                    </div>

                    <h2 className="font-bold text-lg relative z-10 flex items-center gap-2">
                        {note ? 'Editar nota' : 'Nueva nota'}
                        <span className="animate-spin duration-1000">🥑</span>
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-muted rounded-full text-muted-foreground relative z-10"><X className="w-5 h-5" /></button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-2"><Type className="w-3 h-3" /> Título</label>
                        <input
                            autoFocus
                            className="w-full text-2xl font-bold bg-transparent border-none outline-none placeholder:text-muted-foreground/30"
                            placeholder="Escribe un título..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-2"><Hash className="w-3 h-3" /> Grupo</label>
                        <select
                            className="w-full bg-muted border-none rounded-lg px-3 py-2 text-sm outline-none appearance-none"
                            value={groupId || ''}
                            onChange={(e) => setGroupId(e.target.value || undefined)}
                        >
                            <option value="">Sin grupo</option>
                            {(() => {
                                const buildOptions = (items: any[], level = 0): React.ReactNode[] => {
                                    const options: React.ReactNode[] = [];
                                    items.forEach(g => {
                                        options.push(
                                            <option key={g.id} value={g.id}>
                                                {"\u00A0".repeat(level * 4)}{g.name}
                                            </option>
                                        );
                                        const children = groups.filter(child => child.parentId === g.id);
                                        if (children.length > 0) {
                                            options.push(...buildOptions(children, level + 1));
                                        }
                                    });
                                    return options;
                                };
                                const roots = groups.filter(g => !g.parentId);
                                return buildOptions(roots);
                            })()}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-2"><AlignLeft className="w-3 h-3" /> Contenido</label>
                        <textarea
                            className="w-full min-h-[300px] bg-transparent border-none outline-none resize-none text-lg leading-relaxed placeholder:text-muted-foreground/30"
                            placeholder="¿Qué tienes en mente?"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </div>
                </div>

                <div className="p-4 border-t bg-slate-50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 rounded-xl font-semibold text-sm text-slate-500 hover:bg-white hover:text-slate-900 border border-transparent hover:border-slate-200 transition-all"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-md flex items-center gap-2 active:scale-95"
                    >
                        <Save className="w-4 h-4" />
                        Guardar Nota
                    </button>
                </div>
            </div>
        </div>
    );
}
