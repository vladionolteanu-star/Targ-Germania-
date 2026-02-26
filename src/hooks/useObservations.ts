'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Observation } from '@/types/database';

export function useObservations() {
    const [allObservations, setAllObservations] = useState<Observation[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAll = useCallback(async () => {
        const { data, error } = await supabase
            .from('observations')
            .select('*')
            .order('order');

        if (data) setAllObservations(data as unknown as Observation[]);
        if (error) console.error('Error fetching observations:', error);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchAll();

        const channel = supabase
            .channel('observations-realtime')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'observations' }, () => {
                fetchAll();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [fetchAll]);

    const addObservation = async (text: string, type: 'observation' | 'use_case', categoryId: string) => {
        const filtered = allObservations.filter(o => o.type === type && o.category_id === categoryId);
        const maxOrder = filtered.reduce((max, o) => Math.max(max, o.order), -1);

        const { error } = await supabase
            .from('observations')
            .insert({ text, type, category_id: categoryId, order: maxOrder + 1 });

        if (error) console.error('Error adding observation:', error);
    };

    const updateObservation = async (id: string, text: string) => {
        const { error } = await supabase
            .from('observations')
            .update({ text })
            .eq('id', id);

        if (error) console.error('Error updating observation:', error);
    };

    const deleteObservation = async (id: string) => {
        const { error } = await supabase
            .from('observations')
            .delete()
            .eq('id', id);

        if (error) console.error('Error deleting observation:', error);
    };

    const getObservationsForCategory = (categoryId: string) =>
        allObservations.filter(o => o.category_id === categoryId && o.type === 'observation');

    const getUseCasesForCategory = (categoryId: string) =>
        allObservations.filter(o => o.category_id === categoryId && o.type === 'use_case');

    return {
        loading,
        addObservation,
        updateObservation,
        deleteObservation,
        getObservationsForCategory,
        getUseCasesForCategory,
    };
}
