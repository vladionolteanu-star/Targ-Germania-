"use client";
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import type { MediaItem } from "@/data/day1";

interface Props {
    id: string;
    item: MediaItem;
    categoryId: string;
    isEditing: boolean;
    children: React.ReactNode;
}

export function SortableItem({ id, item, categoryId, isEditing, children }: Props) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id,
        data: {
            type: "MediaItem",
            item,
            categoryId,
        },
        disabled: !isEditing,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        zIndex: isDragging ? 100 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className="relative group/sortable">
            {isEditing && (
                <div
                    {...attributes}
                    {...listeners}
                    className="absolute top-2 left-2 z-50 p-2 bg-background/80 backdrop-blur rounded cursor-grab active:cursor-grabbing opacity-0 group-hover/sortable:opacity-100 transition-opacity"
                >
                    <GripVertical className="text-white w-4 h-4" />
                </div>
            )}
            {children}
        </div>
    );
}
