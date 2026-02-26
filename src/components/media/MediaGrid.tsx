"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, MessageSquare, User, GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { MediaItem } from "@/data/day1";

function SortableCell({ item, index, isEditing, onClick }: { item: MediaItem, index: number, isEditing?: boolean, onClick: () => void }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: item.id,
        data: { type: "MediaItem", item },
        disabled: !isEditing,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
        zIndex: isDragging ? 50 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className="relative group/sortable h-full w-full">
            {isEditing && (
                <div
                    {...attributes}
                    {...listeners}
                    className="absolute top-2 left-2 z-50 p-2 bg-background/80 backdrop-blur rounded cursor-grab active:cursor-grabbing opacity-0 group-hover/sortable:opacity-100 transition-opacity"
                >
                    <GripVertical className="text-white w-5 h-5" />
                </div>
            )}

            <motion.div
                layoutId={`container-${item.id}`}
                onClick={onClick}
                className="group relative cursor-pointer overflow-hidden bg-surface aspect-[4/5] h-full w-full"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
                {item.type === "image" ? (
                    <Image
                        src={`/media/day1/${item.filename}`}
                        alt={item.caption}
                        fill
                        className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="relative w-full h-full">
                        <video
                            src={`/media/day1/${item.filename}`}
                            className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                            muted
                            loop
                            playsInline
                            onMouseOver={(e) => (e.target as HTMLVideoElement).play()}
                            onMouseOut={(e) => {
                                const v = e.target as HTMLVideoElement;
                                v.pause();
                                v.currentTime = 0;
                            }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-12 h-12 rounded-full bg-background/50 backdrop-blur-md flex items-center justify-center text-white">
                                <Play className="w-5 h-5 ml-1" />
                            </div>
                        </div>
                    </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <p className="font-sans text-sm text-white/90 line-clamp-2">
                        {item.caption}
                    </p>
                </div>

                {item.povs && item.povs.length > 0 && (
                    <div className="absolute top-4 right-4 bg-accent text-background text-xs font-bold px-3 py-1 uppercase tracking-widest flex items-center gap-2">
                        <MessageSquare className="w-3 h-3" />
                        {item.povs.length} Note{item.povs.length > 1 ? 's' : ''}
                    </div>
                )}
            </motion.div>
        </div>
    );
}

export const MediaGrid = ({ items, categoryId, isEditing }: { items: MediaItem[], categoryId: string, isEditing?: boolean }) => {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const selectedItem = items.find((item) => item.id === selectedId);

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {items.map((item, index) => (
                    <SortableCell
                        key={item.id}
                        item={item}
                        index={index}
                        isEditing={isEditing}
                        onClick={() => setSelectedId(item.id)}
                    />
                ))}
            </div>

            <AnimatePresence>
                {selectedItem && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 bg-background/95 backdrop-blur-xl"
                    >
                        <button
                            onClick={() => setSelectedId(null)}
                            className="absolute top-8 right-8 text-white/70 hover:text-accent transition-colors z-[110]"
                        >
                            <X className="w-8 h-8" />
                        </button>

                        <div className="w-full max-w-7xl h-full flex flex-col lg:flex-row gap-8 lg:gap-16 items-center lg:items-stretch">
                            <motion.div
                                layoutId={`container-${selectedItem.id}`}
                                className="relative w-full lg:w-2/3 h-[50vh] lg:h-full bg-surface overflow-hidden shadow-2xl"
                            >
                                {selectedItem.type === "image" ? (
                                    <Image
                                        src={`/media/day1/${selectedItem.filename}`}
                                        alt={selectedItem.caption}
                                        fill
                                        className="object-contain"
                                        sizes="100vw"
                                        priority
                                    />
                                ) : (
                                    <video
                                        src={`/media/day1/${selectedItem.filename}`}
                                        className="w-full h-full"
                                        controls
                                        autoPlay
                                        playsInline
                                    />
                                )}
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="w-full lg:w-1/3 flex flex-col justify-center gap-8 overflow-y-auto pr-4 pb-12 lg:pb-0"
                            >
                                <div>
                                    <h3 className="text-accent text-xs font-bold tracking-[0.2em] uppercase mb-4">Observation</h3>
                                    <p className="font-display text-2xl lg:text-3xl leading-snug text-white">
                                        &quot;{selectedItem.caption}&quot;
                                    </p>
                                </div>

                                {selectedItem.povs && selectedItem.povs.length > 0 && (
                                    <div className="mt-8 space-y-6 border-t border-white/10 pt-8">
                                        <h3 className="text-white/50 text-xs font-bold tracking-[0.2em] uppercase">Colleague Perspectives</h3>
                                        {selectedItem.povs.map((pov) => (
                                            <div key={pov.id} className="bg-surface/50 p-6 border-l-2 border-accent">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                                        <User className="w-4 h-4 text-white/70" />
                                                    </div>
                                                    <div>
                                                        <p className="font-sans text-sm font-bold text-white">{pov.name}</p>
                                                        {pov.role && <p className="text-xs text-white/50">{pov.role}</p>}
                                                    </div>
                                                </div>
                                                <p className="font-sans text-sm text-white/80 leading-relaxed italic">
                                                    &quot;{pov.comment}&quot;
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
