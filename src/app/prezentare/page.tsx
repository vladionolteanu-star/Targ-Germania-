'use client';

import { useState } from 'react';
import { Image as ImageIcon, Film, MessageSquare, Lightbulb } from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';
import { useObservations } from '@/hooks/useObservations';
import { Lightbox } from '@/components/ui/Lightbox';
import type { Assignment } from '@/types/database';

export default function PrezentarePage() {
    const {
        categories, loading: catLoading,
        getAssignmentsForCategory,
    } = useCategories();

    const {
        loading: obsLoading,
        getObservationsForCategory, getUseCasesForCategory,
    } = useObservations();

    const [lightbox, setLightbox] = useState<Assignment | null>(null);

    if (catLoading || obsLoading) {
        return (
            <div className="min-h-screen bg-background pt-24 flex items-center justify-center">
                <div className="animate-pulse text-white/30 text-sm font-sans">Se încarcă prezentarea...</div>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-background pt-24 pb-16 px-4 sm:px-6 lg:px-12">
                {/* Header */}
                <header className="max-w-6xl mx-auto mb-12 text-center">
                    <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl tracking-tight text-white mb-4">
                        EuroShop 2026
                    </h1>
                    <p className="font-sans text-base sm:text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
                        Prezentare completă a categoriilor și observațiilor de la târgul EuroShop Düsseldorf
                    </p>
                </header>

                {/* Categories */}
                <div className="max-w-6xl mx-auto space-y-12">
                    {categories.map((cat) => {
                        const assignments = getAssignmentsForCategory(cat.id);
                        const observations = getObservationsForCategory(cat.id);
                        const useCases = getUseCasesForCategory(cat.id);

                        if (assignments.length === 0 && observations.length === 0 && useCases.length === 0) return null;

                        return (
                            <section key={cat.id} className="rounded-2xl border border-white/10 bg-surface/20 overflow-hidden">
                                {/* Category Header */}
                                <div className="px-5 sm:px-8 pt-6 pb-4">
                                    <h2 className="font-display text-2xl sm:text-3xl tracking-tight text-white/90">
                                        {cat.name}
                                    </h2>
                                    {cat.description && (
                                        <p className="mt-1 text-sm text-white/50 font-sans">{cat.description}</p>
                                    )}
                                </div>

                                {/* Photos Grid */}
                                {assignments.length > 0 && (
                                    <div className="px-5 sm:px-8 pb-5">
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
                                            {assignments.map((a) => (
                                                <PresentationCard
                                                    key={a.id}
                                                    assignment={a}
                                                    onClick={() => setLightbox(a)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Observations + Use Cases */}
                                {(observations.length > 0 || useCases.length > 0) && (
                                    <div className="px-5 sm:px-8 pb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {observations.length > 0 && (
                                            <div className="border-t border-white/5 pt-4">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <MessageSquare className="w-4 h-4 text-accent/70" />
                                                    <h4 className="font-sans text-xs uppercase tracking-widest text-white/50 font-bold">Observații</h4>
                                                </div>
                                                <ul className="space-y-2">
                                                    {observations.map((o) => (
                                                        <li key={o.id} className="text-sm text-white/70 font-sans leading-relaxed pl-3 border-l-2 border-accent/20">
                                                            {o.text}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {useCases.length > 0 && (
                                            <div className="border-t border-white/5 pt-4">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Lightbulb className="w-4 h-4 text-yellow-400/70" />
                                                    <h4 className="font-sans text-xs uppercase tracking-widest text-white/50 font-bold">Use Cases Mobexpert</h4>
                                                </div>
                                                <ul className="space-y-2">
                                                    {useCases.map((u) => (
                                                        <li key={u.id} className="text-sm text-white/70 font-sans leading-relaxed pl-3 border-l-2 border-yellow-400/20">
                                                            {u.text}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </section>
                        );
                    })}
                </div>
            </div>

            {/* Lightbox */}
            {lightbox && (
                <Lightbox
                    src={lightbox.thumbnail_url}
                    alt={lightbox.filename}
                    driveLink={`https://drive.google.com/file/d/${lightbox.drive_file_id}/view`}
                    onClose={() => setLightbox(null)}
                />
            )}
        </>
    );
}

function PresentationCard({ assignment, onClick }: { assignment: Assignment; onClick: () => void }) {
    const [imgError, setImgError] = useState(false);
    const isVideo = assignment.filename.match(/\.(mp4|mov|avi|webm)$/i);

    return (
        <div
            onClick={onClick}
            className="group relative aspect-square rounded-xl overflow-hidden border border-white/5 hover:border-white/20 transition-all cursor-pointer"
        >
            {imgError ? (
                <div className="w-full h-full bg-white/5 flex items-center justify-center">
                    {isVideo ? <Film className="w-8 h-8 text-white/20" /> : <ImageIcon className="w-8 h-8 text-white/20" />}
                </div>
            ) : (
                <img
                    src={assignment.thumbnail_url}
                    alt={assignment.filename}
                    loading="lazy"
                    onError={() => setImgError(true)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
            )}
            {isVideo && (
                <div className="absolute top-2 left-2 bg-black/70 rounded-md px-1.5 py-0.5 flex items-center gap-1">
                    <Film className="w-3 h-3 text-accent" /><span className="text-[10px] text-white/70 font-sans">Video</span>
                </div>
            )}
        </div>
    );
}
