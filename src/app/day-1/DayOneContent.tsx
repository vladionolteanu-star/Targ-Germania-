"use client";

import { useEditMode } from "@/components/admin/EditProvider";
import { Plus } from "lucide-react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    DragOverEvent,
    DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { CategoryDroppable } from "@/components/admin/CategoryDroppable";

export function DayOneContent({ totalItems }: { totalItems: number }) {
    const { cmsData, setCmsData, isEditing } = useEditMode();

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const addCategory = () => {
        const title = prompt("Numele noii categorii:");
        if (!title) return;

        setCmsData([
            ...cmsData,
            {
                id: `cat-${Date.now()}`,
                title,
                description: "",
                items: [],
            },
        ]);
    };

    const handleUpload = async (categoryId: string, file: File) => {
        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Upload failed");
            const { filename, type } = await res.json();

            const cap = prompt("Adaugă o descriere/titlu pentru imagine:") || "Fără descriere";

            setCmsData((prev) =>
                prev.map((c) => {
                    if (c.id === categoryId) {
                        return {
                            ...c,
                            items: [
                                ...c.items,
                                { id: `item-${Date.now()}`, filename, type, caption: cap },
                            ],
                        };
                    }
                    return c;
                })
            );
        } catch (e) {
            console.error(e);
            alert("A apărut o eroare la upload.");
        }
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeContainerId = active.data.current?.sortable?.containerId;
        const overId = over.id;

        const overContainerId =
            over.data.current?.type === "Category"
                ? over.id
                : over.data.current?.sortable?.containerId;

        if (!activeContainerId || !overContainerId || activeContainerId === overContainerId) {
            return;
        }

        setCmsData((prev) => {
            const activeCategoryIndex = prev.findIndex((c) => c.id === activeContainerId);
            const overCategoryIndex = prev.findIndex((c) => c.id === overContainerId);

            const activeCategory = prev[activeCategoryIndex];
            const overCategory = prev[overCategoryIndex];

            const activeItemIndex = activeCategory.items.findIndex((i) => i.id === active.id);
            const overItemIndex =
                over.data.current?.type === "Category"
                    ? overCategory.items.length + 1
                    : overCategory.items.findIndex((i) => i.id === overId);

            const item = activeCategory.items[activeItemIndex];

            // Remove from active
            const newActiveItems = [...activeCategory.items];
            newActiveItems.splice(activeItemIndex, 1);

            // Add to over
            const newOverItems = [...overCategory.items];
            newOverItems.splice(overItemIndex >= 0 ? overItemIndex : newOverItems.length, 0, item);

            const newCmsData = [...prev];
            newCmsData[activeCategoryIndex] = { ...activeCategory, items: newActiveItems };
            newCmsData[overCategoryIndex] = { ...overCategory, items: newOverItems };

            return newCmsData;
        });
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeContainerId = active.data.current?.sortable?.containerId;
        const overContainerId =
            over.data.current?.type === "Category"
                ? over.id
                : over.data.current?.sortable?.containerId;

        if (activeContainerId && overContainerId && activeContainerId === overContainerId) {
            const categoryIndex = cmsData.findIndex((c) => c.id === activeContainerId);
            if (categoryIndex !== -1) {
                const category = cmsData[categoryIndex];
                const oldIndex = category.items.findIndex((i) => i.id === active.id);
                const newIndex = category.items.findIndex((i) => i.id === over.id);

                if (oldIndex !== newIndex) {
                    setCmsData((prev) => {
                        const newCmsData = [...prev];
                        newCmsData[categoryIndex] = {
                            ...category,
                            items: arrayMove(category.items, oldIndex, newIndex),
                        };
                        return newCmsData;
                    });
                }
            }
        }
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <main className="min-h-screen pt-32 pb-24 px-6 lg:px-12 bg-background selection:bg-accent selection:text-background relative">
                <header className="mb-24 lg:mb-32">
                    <p className="font-sans text-accent text-sm tracking-[0.3em] uppercase mb-6">
                        Arhiva // Ziua 1 // 22.02.2026
                    </p>
                    <h1 className="font-display text-5xl lg:text-7xl xl:text-[8vw] leading-[0.9] tracking-tighter uppercase text-white/90">
                        Sintaxa <br /> <span className="text-white/30 italic">Spațială.</span>
                    </h1>
                    <div className="mt-12 lg:w-1/2">
                        <p className="font-sans text-lg text-white/70 text-balance leading-relaxed">
                            Observații din zona de expoziție. Documentând {totalItems} de materiale variind
                            de la arhitectură sustenabilă până la integrarea afișajelor digitale și a sistemelor inteligente destinate magazinelor.
                        </p>
                    </div>
                </header>

                <div className="space-y-32 lg:space-y-48">
                    {cmsData.map((category) => (
                        <section key={category.id} className="relative">
                            <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start lg:items-end mb-12 relative group">
                                {isEditing && (
                                    <button
                                        onClick={() => {
                                            const newTitle = prompt("Editează titlul categoriei:", category.title);
                                            if (newTitle) {
                                                setCmsData(
                                                    cmsData.map((c) =>
                                                        c.id === category.id ? { ...c, title: newTitle } : c
                                                    )
                                                );
                                            }
                                        }}
                                        className="absolute -left-12 top-0 text-accent opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        Editează
                                    </button>
                                )}
                                <div className="lg:w-1/3">
                                    <h2 className="font-display text-4xl lg:text-5xl tracking-tight text-white/90">
                                        {category.title}
                                    </h2>
                                </div>
                                {category.description && (
                                    <div className="lg:w-1/2">
                                        <p className="font-sans text-sm tracking-wide text-white/50 uppercase border-l border-accent pl-4">
                                            {category.description}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <CategoryDroppable
                                categoryId={category.id}
                                items={category.items}
                                isEditing={isEditing}
                                onUpload={handleUpload}
                            />
                        </section>
                    ))}

                    {isEditing && (
                        <div className="pt-16 border-t border-dashed border-white/20 flex justify-center">
                            <button
                                onClick={addCategory}
                                className="flex items-center gap-4 text-white/50 hover:text-accent font-sans text-sm uppercase tracking-widest transition-colors py-8"
                            >
                                <Plus className="w-6 h-6" /> Adaugă Categorie Nouă
                            </button>
                        </div>
                    )}
                </div>

                <footer className="mt-32 pt-16 border-t border-white/10 flex justify-between items-center text-white/50 font-sans text-sm uppercase tracking-widest">
                    <span>Sfârșitul Zilei 1</span>
                    <span className="hover:text-accent cursor-not-allowed transition-colors">
                        Ziua 2 (În curând) →
                    </span>
                </footer>
            </main>
        </DndContext>
    );
}
