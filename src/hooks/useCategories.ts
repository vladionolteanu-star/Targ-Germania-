'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Category, Assignment } from '@/types/database';

export function useCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAll = useCallback(async () => {
        const [catRes, assRes] = await Promise.all([
            supabase.from('categories').select('*').order('order'),
            supabase.from('assignments').select('*').order('order'),
        ]);

        if (catRes.data) setCategories(catRes.data as unknown as Category[]);
        if (assRes.data) setAssignments(assRes.data as unknown as Assignment[]);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchAll();

        const catChannel = supabase
            .channel('categories-realtime')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, () => {
                fetchAll();
            })
            .subscribe();

        const assChannel = supabase
            .channel('assignments-realtime')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'assignments' }, () => {
                fetchAll();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(catChannel);
            supabase.removeChannel(assChannel);
        };
    }, [fetchAll]);

    const addCategory = async (name: string) => {
        const maxOrder = categories.reduce((max, c) => Math.max(max, c.order), -1);
        const { data, error } = await supabase
            .from('categories')
            .insert({ name, description: '', order: maxOrder + 1 })
            .select()
            .single();

        if (error) console.error('Error adding category:', error);
        return data;
    };

    const updateCategory = async (id: string, updates: Partial<Pick<Category, 'name' | 'description' | 'order'>>) => {
        const { error } = await supabase
            .from('categories')
            .update(updates)
            .eq('id', id);

        if (error) console.error('Error updating category:', error);
    };

    const deleteCategory = async (id: string) => {
        const { error } = await supabase
            .from('categories')
            .delete()
            .eq('id', id);

        if (error) console.error('Error deleting category:', error);
    };

    const assignFile = async (
        categoryId: string,
        driveFileId: string,
        filename: string,
        thumbnailUrl: string,
        caption = ''
    ) => {
        const catAssignments = assignments.filter(a => a.category_id === categoryId);
        const maxOrder = catAssignments.reduce((max, a) => Math.max(max, a.order), -1);

        const { error } = await supabase
            .from('assignments')
            .insert({
                category_id: categoryId,
                drive_file_id: driveFileId,
                filename,
                thumbnail_url: thumbnailUrl,
                caption,
                order: maxOrder + 1,
            });

        if (error) console.error('Error assigning file:', error);
    };

    const unassignFile = async (assignmentId: string) => {
        const { error } = await supabase
            .from('assignments')
            .delete()
            .eq('id', assignmentId);

        if (error) console.error('Error unassigning file:', error);
    };

    const moveAssignment = async (assignmentId: string, newCategoryId: string) => {
        const catAssignments = assignments.filter(a => a.category_id === newCategoryId);
        const maxOrder = catAssignments.reduce((max, a) => Math.max(max, a.order), -1);

        const { error } = await supabase
            .from('assignments')
            .update({ category_id: newCategoryId, order: maxOrder + 1 })
            .eq('id', assignmentId);

        if (error) console.error('Error moving assignment:', error);
    };

    const getAssignmentsForCategory = (categoryId: string) =>
        assignments.filter(a => a.category_id === categoryId);

    const assignedDriveFileIds = new Set(assignments.map(a => a.drive_file_id));

    return {
        categories,
        assignments,
        loading,
        addCategory,
        updateCategory,
        deleteCategory,
        assignFile,
        unassignFile,
        moveAssignment,
        getAssignmentsForCategory,
        assignedDriveFileIds,
    };
}
