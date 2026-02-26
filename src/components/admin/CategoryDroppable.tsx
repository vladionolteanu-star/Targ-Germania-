"use client";

import { useState } from "react";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { MediaGrid } from "@/components/media/MediaGrid";
import type { MediaItem } from "@/data/day1";
import { Upload } from "lucide-react";

interface CategoryDroppableProps {
    categoryId: string;
    items: MediaItem[];
    isEditing: boolean;
    onUpload: (categoryId: string, file: File) => void;
}

export function CategoryDroppable({ categoryId, items, isEditing, onUpload }: CategoryDroppableProps) {
    const { setNodeRef } = useDroppable({
        id: categoryId,
        data: {
            type: "Category",
            categoryId,
        }
    });

    return (
        <div ref={setNodeRef} className={`relative min-h-[200px] transition-colors ${isEditing ? 'border-2 border-dashed border-white/5 p-4 -m-4 rounded-xl' : ''}`}>
            <SortableContext items={items.map(i => i.id)} strategy={rectSortingStrategy}>
                <MediaGrid items={items} categoryId={categoryId} isEditing={isEditing} />
            </SortableContext>

            {isEditing && (
                <div className="mt-8 flex justify-center">
                    <label className="cursor-pointer group flex flex-col items-center gap-2 p-8 border-2 border-dashed border-white/20 hover:border-accent hover:bg-white/5 transition-all rounded-xl w-full max-w-sm">
                        <Upload className="w-6 h-6 text-white/50 group-hover:text-accent transition-colors" />
                        <span className="text-sm font-sans uppercase tracking-widest text-white/50 group-hover:text-accent font-bold">Încarcă Imagine/Video</span>
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*,video/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) onUpload(categoryId, file);
                            }}
                        />
                    </label>
                </div>
            )}
        </div>
    );
}
