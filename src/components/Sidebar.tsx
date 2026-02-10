'use client';

import { useState } from 'react';
import { Plus, Hash, Trash2, Edit2, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createGroup, deleteGroup, updateGroup } from '@/lib/actions';

interface SidebarProps {
    groups: any[];
    selectedGroupId?: string;
    onSelectGroup: (id?: string) => void;
}

export default function Sidebar({ groups, selectedGroupId, onSelectGroup }: SidebarProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');

    const handleAddGroup = async () => {
        if (!newGroupName.trim()) return;
        await createGroup(newGroupName);
        setNewGroupName('');
        setIsAdding(false);
    };

    const handleEdit = (group: any) => {
        setEditingId(group.id);
        setEditName(group.name);
    };

    const handleSaveEdit = async (id: string) => {
        if (!editName.trim()) return;
        await updateGroup(id, editName);
        setEditingId(null);
    };

    return (
        <div className="w-64 border-r bg-white h-screen flex flex-col p-4">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-xl font-bold text-primary flex items-center gap-2">
                    <Edit2 className="w-5 h-5" />
                    NotasApp
                </h1>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1">
                <button
                    onClick={() => onSelectGroup(undefined)}
                    className={cn(
                        "w-full text-left px-3 py-2 rounded-md transition-colors flex items-center gap-2",
                        !selectedGroupId ? "bg-primary text-white" : "hover:bg-muted text-muted-foreground"
                    )}
                >
                    <Hash className="w-4 h-4" />
                    Todas las notas
                </button>

                <div className="pt-4 pb-2 flex items-center justify-between px-3">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Grupos</span>
                    <button
                        onClick={() => setIsAdding(true)}
                        className="p-1 hover:bg-muted rounded text-muted-foreground"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>

                {isAdding && (
                    <div className="px-3 py-2 flex gap-1">
                        <input
                            autoFocus
                            className="w-full text-sm border rounded px-2 py-1 outline-none focus:ring-1 focus:ring-primary"
                            value={newGroupName}
                            onChange={(e) => setNewGroupName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddGroup()}
                        />
                        <button onClick={handleAddGroup} className="text-primary p-1"><Check className="w-4 h-4" /></button>
                        <button onClick={() => setIsAdding(false)} className="text-destructive p-1"><X className="w-4 h-4" /></button>
                    </div>
                )}

                {groups.map((group) => (
                    <div key={group.id} className="group relative">
                        {editingId === group.id ? (
                            <div className="px-3 py-2 flex gap-1">
                                <input
                                    autoFocus
                                    className="w-full text-sm border rounded px-2 py-1 outline-none"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(group.id)}
                                />
                                <button onClick={() => handleSaveEdit(group.id)} className="text-primary"><Check className="w-4 h-4" /></button>
                            </div>
                        ) : (
                            <button
                                onClick={() => onSelectGroup(group.id)}
                                className={cn(
                                    "w-full text-left px-3 py-2 rounded-md transition-colors flex items-center justify-between pr-8",
                                    selectedGroupId === group.id ? "bg-primary/10 text-primary border border-primary/20" : "hover:bg-muted text-muted-foreground"
                                )}
                            >
                                <span className="flex items-center gap-2">
                                    <Hash className="w-4 h-4" />
                                    {group.name}
                                </span>
                                <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                                    {group._count.notes}
                                </span>
                            </button>
                        )}

                        <div className="absolute right-2 top-1.5 opacity-0 group-hover:opacity-100 flex gap-1 bg-white/80 backdrop-blur-sm rounded">
                            <button onClick={() => handleEdit(group)} className="p-1 text-muted-foreground hover:text-primary"><Edit2 className="w-3 h-3" /></button>
                            <button onClick={() => deleteGroup(group.id)} className="p-1 text-muted-foreground hover:text-destructive"><Trash2 className="w-3 h-3" /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
