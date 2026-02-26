'use client';

import { useState, useEffect } from 'react';
import type { DriveFile } from '@/types/database';

export function useDriveFiles(assignedIds: Set<string>) {
    const [allFiles, setAllFiles] = useState<DriveFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        async function fetchFiles() {
            try {
                const res = await fetch('/api/drive');
                if (!res.ok) throw new Error('Failed to fetch Drive files');
                const files: DriveFile[] = await res.json();
                setAllFiles(files);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        }

        fetchFiles();
    }, []);

    const unassignedFiles = allFiles.filter(f => !assignedIds.has(f.id));

    const filteredFiles = searchQuery
        ? unassignedFiles.filter(f =>
            f.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : unassignedFiles;

    return {
        allFiles,
        unassignedFiles,
        filteredFiles,
        loading,
        error,
        searchQuery,
        setSearchQuery,
        totalCount: allFiles.length,
        unassignedCount: unassignedFiles.length,
    };
}
