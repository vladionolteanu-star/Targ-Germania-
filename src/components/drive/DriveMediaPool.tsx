'use client';

import { useState } from 'react';
import { Search, Image as ImageIcon, Film, ChevronDown, ChevronUp } from 'lucide-react';
import { Lightbox } from '@/components/ui/Lightbox';
import type { DriveFile } from '@/types/database';

interface DriveMediaPoolProps {
    files: DriveFile[];
    loading: boolean;
    searchQuery: string;
    onSearchChange: (q: string) => void;
    totalCount: number;
    unassignedCount: number;
    onDragStart: (file: DriveFile) => void;
}

export function DriveMediaPool({
    files,
    loading,
    searchQuery,
    onSearchChange,
    totalCount,
    unassignedCount,
    onDragStart,
}: DriveMediaPoolProps) {
    const [lightboxFile, setLightboxFile] = useState<DriveFile | null>(null);
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <>
            {/* ═══ MOBILE: Collapsible horizontal strip ═══ */}
            <div className="lg:hidden bg-surface/60 backdrop-blur-md border-b border-white/10">
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="w-full px-4 py-3 flex items-center justify-between"
                >
                    <div className="flex items-center gap-3">
                        <ImageIcon className="w-5 h-5 text-accent/70" />
                        <span className="font-display text-base text-white/90">Sursă Media</span>
                        <span className="bg-accent/20 text-accent text-xs px-2 py-0.5 rounded-full font-bold">
                            {unassignedCount}
                        </span>
                        <span className="text-xs text-white/40 font-sans">neasociate</span>
                    </div>
                    {mobileOpen ? (
                        <ChevronUp className="w-5 h-5 text-white/40" />
                    ) : (
                        <ChevronDown className="w-5 h-5 text-white/40" />
                    )}
                </button>

                {mobileOpen && (
                    <div className="px-4 pb-4">
                        {/* Search */}
                        <div className="relative mb-3">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                            <input
                                type="text"
                                placeholder="Caută după nume..."
                                value={searchQuery}
                                onChange={(e) => onSearchChange(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white/80 placeholder:text-white/30 focus:outline-none focus:border-accent/50 transition-colors"
                            />
                        </div>

                        {/* Horizontal scroll grid */}
                        {loading ? (
                            <div className="animate-pulse text-white/30 text-sm font-sans text-center py-6">Se încarcă din Drive...</div>
                        ) : files.length === 0 ? (
                            <div className="text-white/30 text-sm font-sans text-center py-6">
                                {searchQuery ? 'Niciun rezultat' : 'Toate fișierele sunt asociate!'}
                            </div>
                        ) : (
                            <div className="overflow-x-auto -mx-1 pb-2">
                                <div className="flex gap-2 px-1" style={{ width: 'max-content' }}>
                                    {files.slice(0, 50).map((file) => (
                                        <DriveFileCard
                                            key={file.id}
                                            file={file}
                                            onDragStart={() => onDragStart(file)}
                                            onClick={() => setLightboxFile(file)}
                                            mobile
                                        />
                                    ))}
                                    {files.length > 50 && (
                                        <div className="w-16 h-16 rounded-lg bg-white/5 flex items-center justify-center text-white/30 text-xs font-sans shrink-0">
                                            +{files.length - 50}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ═══ DESKTOP: Sticky sidebar ═══ */}
            <aside className="hidden lg:flex w-[340px] xl:w-[380px] shrink-0 bg-surface/40 backdrop-blur-md border-r border-white/10 flex-col h-[calc(100vh-80px)] sticky top-20">
                {/* Header */}
                <div className="p-4 border-b border-white/10">
                    <h2 className="font-display text-lg tracking-tight text-white/90 mb-1">
                        Sursă Media
                    </h2>
                    <div className="flex items-center gap-2 text-xs text-white/50 font-sans">
                        <span className="bg-accent/20 text-accent px-2 py-0.5 rounded-full font-bold">
                            {unassignedCount}
                        </span>
                        <span>neasociate din {totalCount} total</span>
                    </div>
                </div>

                {/* Search */}
                <div className="p-3 border-b border-white/5">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input
                            type="text"
                            placeholder="Caută după nume..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white/80 placeholder:text-white/30 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-colors"
                        />
                    </div>
                </div>

                {/* File Grid */}
                <div className="flex-1 overflow-y-auto p-3">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="animate-pulse text-white/30 text-sm font-sans">Se încarcă din Drive...</div>
                        </div>
                    ) : files.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-white/30 text-sm font-sans gap-2">
                            <ImageIcon className="w-8 h-8" />
                            <span>{searchQuery ? 'Niciun rezultat găsit' : 'Toate fișierele sunt asociate!'}</span>
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 gap-2">
                            {files.map((file) => (
                                <DriveFileCard
                                    key={file.id}
                                    file={file}
                                    onDragStart={() => onDragStart(file)}
                                    onClick={() => setLightboxFile(file)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </aside>

            {/* Lightbox */}
            {lightboxFile && (
                <Lightbox
                    src={lightboxFile.thumbnailUrl}
                    alt={lightboxFile.name}
                    driveLink={lightboxFile.webViewLink}
                    onClose={() => setLightboxFile(null)}
                />
            )}
        </>
    );
}

function DriveFileCard({
    file,
    onDragStart,
    onClick,
    mobile,
}: {
    file: DriveFile;
    onDragStart: () => void;
    onClick: () => void;
    mobile?: boolean;
}) {
    const [imgError, setImgError] = useState(false);
    const isVideo = file.mimeType.startsWith('video/');

    const sizeClass = mobile
        ? 'w-16 h-16 shrink-0 rounded-lg'
        : 'aspect-square rounded-lg';

    return (
        <div
            draggable
            onDragStart={(e) => {
                e.dataTransfer.setData('application/json', JSON.stringify(file));
                e.dataTransfer.effectAllowed = 'move';
                onDragStart();
            }}
            onClick={onClick}
            className={`group relative overflow-hidden cursor-grab active:cursor-grabbing border border-white/5 hover:border-accent/40 transition-all ${sizeClass}`}
            title={file.name}
        >
            {imgError ? (
                <div className="w-full h-full bg-white/5 flex items-center justify-center">
                    {isVideo ? (
                        <Film className="w-5 h-5 text-white/30" />
                    ) : (
                        <ImageIcon className="w-5 h-5 text-white/30" />
                    )}
                </div>
            ) : (
                <img
                    src={file.thumbnailUrl}
                    alt={file.name}
                    loading="lazy"
                    onError={() => setImgError(true)}
                    className="w-full h-full object-cover"
                />
            )}

            {isVideo && (
                <div className="absolute top-1 right-1 bg-black/70 rounded p-0.5">
                    <Film className="w-3 h-3 text-accent" />
                </div>
            )}

            {!mobile && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-1.5">
                    <span className="text-[10px] text-white/80 truncate leading-tight font-sans">
                        {file.name}
                    </span>
                </div>
            )}
        </div>
    );
}
