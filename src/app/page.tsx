'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import NoteCard from '@/components/NoteCard';
import NoteModal from '@/components/NoteModal';
import { Plus, Search, Terminal } from 'lucide-react';
import { getNotes, getGroups } from '@/lib/actions';

export default function Home() {
  const [selectedGroupId, setSelectedGroupId] = useState<string | undefined>(undefined);
  const [notes, setNotes] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<any>(undefined);

  const refreshData = async () => {
    const [fetchedNotes, fetchedGroups] = await Promise.all([
      getNotes(selectedGroupId),
      getGroups()
    ]);
    setNotes(fetchedNotes);
    setGroups(fetchedGroups);
  };

  useEffect(() => {
    refreshData();
  }, [selectedGroupId]);

  const filteredNotes = notes.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.content.toLowerCase().includes(search.toLowerCase())
  );

  const openNewNote = () => {
    setEditingNote(undefined);
    setIsModalOpen(true);
  };

  const openEditNote = (note: any) => {
    setEditingNote(note);
    setIsModalOpen(true);
  };

  return (
    <main className="flex min-h-screen bg-background">
      <Sidebar
        groups={groups}
        selectedGroupId={selectedGroupId}
        onSelectGroup={setSelectedGroupId}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white/50 backdrop-blur-md border-b flex items-center justify-between px-8 z-10">
          <div className="flex-1 max-w-xl">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                className="w-full bg-muted border-none rounded-full pl-10 pr-4 py-2.5 text-sm outline-none ring-primary focus:ring-2 transition-all bg-white"
                placeholder="Buscar notas..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <button
            onClick={openNewNote}
            className="ml-6 bg-primary text-white pl-4 pr-6 py-2.5 rounded-full font-bold text-sm hover:translate-y-[-2px] hover:shadow-lg hover:shadow-primary/25 transition-all flex items-center gap-2 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Nueva Nota
          </button>
        </header>

        {/* Notes Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                  {selectedGroupId ? groups.find(g => g.id === selectedGroupId)?.name : 'Todas tus notas'}
                </h2>
                <p className="text-muted-foreground text-sm mt-1">
                  Gestiona tus ideas y proyectos de forma eficiente.
                </p>
              </div>
            </div>

            {filteredNotes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredNotes.map((note) => (
                  <NoteCard key={note.id} note={note} onEdit={openEditNote} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[50vh] text-center border-2 border-dashed rounded-3xl p-12 bg-white/50">
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                  <Terminal className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold">No se encontraron notas</h3>
                <p className="text-muted-foreground max-w-xs mx-auto mt-2">
                  Empieza creando tu primera nota o seleccionando un grupo diferente.
                </p>
                <button
                  onClick={openNewNote}
                  className="mt-6 text-primary font-bold hover:underline"
                >
                  Crear primera nota →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <NoteModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); refreshData(); }}
        note={editingNote}
        groups={groups}
        defaultGroupId={selectedGroupId}
      />

      {/* Floating Action Button (FAB) */}
      {!isModalOpen && (
        <button
          onClick={openNewNote}
          className="fixed bottom-8 right-8 w-16 h-16 bg-slate-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40 group"
          title="Nueva Nota"
        >
          <Plus className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300" />
        </button>
      )}
    </main>
  );
}
