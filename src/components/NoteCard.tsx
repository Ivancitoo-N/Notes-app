'use client';

import { useState } from 'react';
import { Trash2, Edit2, Calendar, Hash } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { deleteNote } from '@/lib/actions';

interface NoteCardProps {
    note: any;
    onEdit: (note: any) => void;
}

export default function NoteCard({ note, onEdit }: NoteCardProps) {
    return (
        <div className="bg-white rounded-xl border border-border p-5 shadow-sm hover:shadow-md transition-shadow group relative flex flex-col h-full">
            <div className="flex justify-between items-start mb-3">
                {note.group && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Hash className="w-2.5 h-2.5" />
                        {note.group.name}
                    </span>
                )}
                {!note.group && <span className="h-4"></span>}
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => onEdit(note)}
                        className="p-1.5 hover:bg-muted rounded-full text-muted-foreground hover:text-primary"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => deleteNote(note.id)}
                        className="p-1.5 hover:bg-muted rounded-full text-muted-foreground hover:text-destructive"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <h3 className="font-bold text-lg mb-2 line-clamp-2 leading-tight">{note.title}</h3>
            <p className="text-muted-foreground text-sm line-clamp-4 flex-1">{note.content}</p>

            <div className="mt-4 pt-4 border-t flex items-center gap-2 text-[10px] text-muted-foreground">
                <Calendar className="w-3 h-3" />
                {formatDate(new Date(note.createdAt))}
            </div>
        </div>
    );
}
