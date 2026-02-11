import { useState, useMemo } from 'react';
import { Plus, Hash, Trash2, Edit2, Check, X, Folder, ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createGroup, deleteGroup, updateGroup } from '@/lib/actions';

interface SidebarProps {
    groups: any[];
    selectedGroupId?: string;
    onSelectGroup: (id?: string) => void;
}

interface GroupItemProps {
    group: any;
    level: number;
    selectedGroupId?: string;
    onSelectGroup: (id?: string) => void;
}

function GroupItem({ group, level, selectedGroupId, onSelectGroup }: GroupItemProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isAddingSub, setIsAddingSub] = useState(false);
    const [subName, setSubName] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');

    const handleAddSub = async () => {
        if (!subName.trim()) return;
        await createGroup(subName, group.id);
        setSubName('');
        setIsAddingSub(false);
        setIsExpanded(true);
    };

    const handleSaveEdit = async (id: string) => {
        if (!editName.trim()) return;
        await updateGroup(id, editName);
        setEditingId(null);
    };

    const hasChildren = group.children && group.children.length > 0;

    return (
        <div className="space-y-0.5">
            <div className="group relative">
                {editingId === group.id ? (
                    <div className="px-3 py-1 flex gap-1" style={{ paddingLeft: `${level * 1 + 0.75}rem` }}>
                        <input
                            autoFocus
                            className="w-full text-sm border rounded px-2 py-0.5 outline-none"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(group.id)}
                        />
                        <button onClick={() => handleSaveEdit(group.id)} className="text-primary"><Check className="w-3 h-3" /></button>
                    </div>
                ) : (
                    <div
                        className={cn(
                            "w-full text-left px-3 py-1.5 rounded-md transition-all flex items-center justify-between group/item",
                            selectedGroupId === group.id ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted text-muted-foreground"
                        )}
                        style={{ paddingLeft: `${level * 1 + 0.75}rem` }}
                    >
                        <div className="flex items-center gap-1.5 flex-1 min-w-0" onClick={() => onSelectGroup(group.id)}>
                            {hasChildren ? (
                                <button
                                    onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
                                    className="p-0.5 hover:bg-black/5 rounded"
                                >
                                    {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                                </button>
                            ) : (
                                <div className="w-4" />
                            )}
                            <Folder className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="truncate text-sm">{group.name}</span>
                        </div>

                        <div className="flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                            <button onClick={() => setIsAddingSub(true)} className="p-1 hover:text-primary"><Plus className="w-3 h-3" /></button>
                            <button onClick={() => { setEditingId(group.id); setEditName(group.name) }} className="p-1 hover:text-primary"><Edit2 className="w-3 h-3" /></button>
                            <button onClick={() => deleteGroup(group.id)} className="p-1 hover:text-destructive"><Trash2 className="w-3 h-3" /></button>
                        </div>
                    </div>
                )}
            </div>

            {isAddingSub && (
                <div className="px-3 py-1 flex gap-1" style={{ paddingLeft: `${(level + 1) * 1 + 0.75}rem` }}>
                    <input
                        autoFocus
                        className="w-full text-xs border rounded px-2 py-0.5 outline-none"
                        placeholder="Nuevo subgrupo..."
                        value={subName}
                        onChange={(e) => setSubName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddSub()}
                    />
                    <button onClick={handleAddSub} className="text-primary"><Check className="w-3 h-3" /></button>
                    <button onClick={() => setIsAddingSub(false)} className="text-destructive"><X className="w-3 h-3" /></button>
                </div>
            )}

            {isExpanded && hasChildren && (
                <div className="mt-0.5">
                    {group.children.map((child: any) => (
                        <GroupItem
                            key={child.id}
                            group={child}
                            level={level + 1}
                            selectedGroupId={selectedGroupId}
                            onSelectGroup={onSelectGroup}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function Sidebar({ groups, selectedGroupId, onSelectGroup }: SidebarProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');

    // Transform linear array to recursive tree
    const groupTree = useMemo(() => {
        const rootGroups = groups.filter(g => !g.parentId);

        const buildTree = (parents: any[]): any[] => {
            return parents.map(p => ({
                ...p,
                children: groups.filter(g => g.parentId === p.id).map(c => ({
                    ...c,
                    children: groups.filter(g => g.parentId === c.id) // Simple 2-level for now or recurse
                }))
            }));
        };

        // Better recursive tree builder
        const map = new Map(groups.map(g => [g.id, { ...g, children: [] }]));
        const roots: any[] = [];

        map.forEach(g => {
            if (g.parentId && map.has(g.parentId)) {
                map.get(g.parentId).children.push(g);
            } else {
                roots.push(g);
            }
        });

        return roots;
    }, [groups]);

    const handleAddGroup = async () => {
        if (!newGroupName.trim()) return;
        await createGroup(newGroupName);
        setNewGroupName('');
        setIsAdding(false);
    };

    return (
        <div className="w-64 border-r bg-white h-screen flex flex-col p-4 shadow-sm z-20">
            <div className="flex items-center justify-between mb-8 px-2">
                <h1 className="text-xl font-black text-slate-800 flex items-center gap-2 tracking-tight">
                    <div className="bg-primary p-1 rounded-lg">
                        <Folder className="w-5 h-5 text-white" />
                    </div>
                    NotasApp
                </h1>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar">
                <button
                    onClick={() => onSelectGroup(undefined)}
                    className={cn(
                        "w-full text-left px-3 py-2 rounded-md transition-all flex items-center gap-2 group",
                        !selectedGroupId ? "bg-primary text-white shadow-md shadow-primary/20" : "hover:bg-muted text-muted-foreground"
                    )}
                >
                    <Hash className="w-4 h-4" />
                    <span className="text-sm font-semibold">Todas las notas</span>
                </button>

                <div className="pt-6 pb-2 flex items-center justify-between px-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mis Carpetas</span>
                    <button
                        onClick={() => setIsAdding(true)}
                        className="p-1 hover:bg-muted rounded-full text-muted-foreground transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>

                {isAdding && (
                    <div className="px-3 py-2 flex gap-1">
                        <input
                            autoFocus
                            className="w-full text-sm border rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            placeholder="Nombre del grupo..."
                            value={newGroupName}
                            onChange={(e) => setNewGroupName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddGroup()}
                        />
                        <button onClick={handleAddGroup} className="bg-primary text-white p-1.5 rounded-lg"><Check className="w-4 h-4" /></button>
                        <button onClick={() => setIsAdding(false)} className="bg-muted text-muted-foreground p-1.5 rounded-lg"><X className="w-4 h-4" /></button>
                    </div>
                )}

                <div className="space-y-0.5">
                    {groupTree.map((group) => (
                        <GroupItem
                            key={group.id}
                            group={group}
                            level={0}
                            selectedGroupId={selectedGroupId}
                            onSelectGroup={onSelectGroup}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
