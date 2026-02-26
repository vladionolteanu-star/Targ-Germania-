'use client';

import { useEffect, useCallback } from 'react';
import { X, ExternalLink } from 'lucide-react';

interface LightboxProps {
    src: string;
    alt: string;
    driveLink?: string;
    onClose: () => void;
}

export function Lightbox({ src, alt, driveLink, onClose }: LightboxProps) {
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        },
        [onClose]
    );

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [handleKeyDown]);

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
            onClick={onClose}
        >
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-6 right-6 text-white/60 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors z-10"
            >
                <X className="w-6 h-6" />
            </button>

            {/* Drive Link */}
            {driveLink && (
                <a
                    href={driveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-6 left-6 text-white/60 hover:text-accent bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors z-10 flex items-center gap-2"
                    title="Deschide în Google Drive"
                >
                    <ExternalLink className="w-5 h-5" />
                    <span className="text-sm font-sans hidden sm:inline">Deschide în Drive</span>
                </a>
            )}

            {/* Image */}
            <img
                src={src.startsWith('/api/drive/thumb') ? `${src}?size=full` : src}
                alt={alt}
                onClick={(e) => e.stopPropagation()}
                className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
            />

            {/* Filename */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/70 rounded-lg px-4 py-2">
                <span className="text-sm text-white/70 font-sans">{alt}</span>
            </div>
        </div>
    );
}
