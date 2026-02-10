'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

// NOTE ACTIONS
export async function createNote(data: { title: string; content: string; groupId?: string }) {
    const note = await db.note.create({
        data: {
            title: data.title,
            content: data.content,
            groupId: data.groupId || null,
        },
    });
    revalidatePath('/');
    return note;
}

export async function updateNote(id: string, data: { title?: string; content?: string; groupId?: string | null }) {
    const note = await db.note.update({
        where: { id },
        data: {
            ...data,
            groupId: data.groupId === undefined ? undefined : data.groupId,
        },
    });
    revalidatePath('/');
    return note;
}

export async function deleteNote(id: string) {
    await db.note.delete({ where: { id } });
    revalidatePath('/');
}

export async function getNotes(groupId?: string) {
    return await db.note.findMany({
        where: groupId ? { groupId } : {},
        include: { group: true },
        orderBy: { createdAt: 'desc' },
    });
}

// GROUP ACTIONS
export async function createGroup(name: string) {
    const existing = await db.group.findUnique({ where: { name } });
    if (existing) return existing;

    const group = await db.group.create({ data: { name } });
    revalidatePath('/');
    return group;
}

export async function updateGroup(id: string, name: string) {
    const group = await db.group.update({
        where: { id },
        data: { name },
    });
    revalidatePath('/');
    return group;
}

export async function deleteGroup(id: string) {
    // NOTES will have their groupId set to NULL by Prisma relation (if configured as optional)
    // Or we can manually handle it if needed. The schema has group Group? (optional)
    await db.group.delete({ where: { id } });
    revalidatePath('/');
}

export async function getGroups() {
    return await db.group.findMany({
        include: { _count: { select: { notes: true } } },
        orderBy: { name: 'asc' },
    });
}
