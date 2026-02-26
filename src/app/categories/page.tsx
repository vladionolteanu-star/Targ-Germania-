'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';
import { useDriveFiles } from '@/hooks/useDriveFiles';
import { useObservations } from '@/hooks/useObservations';
import { DriveMediaPool } from '@/components/drive/DriveMediaPool';
import { CategorySection } from '@/components/categories/CategorySection';
import type { DriveFile } from '@/types/database';

export default function CategoriesPage() {
    const {
        categories, loading: catLoading,
        addCategory, updateCategory, deleteCategory,
        assignFile, unassignFile,
        getAssignmentsForCategory, assignedDriveFileIds,
    } = useCategories();

    const {
        filteredFiles, loading: driveLoading,
        searchQuery, setSearchQuery,
        totalCount, unassignedCount,
    } = useDriveFiles(assignedDriveFileIds);

    const {
        loading: obsLoading,
        addObservation, updateObservation, deleteObservation,
        getObservationsForCategory, getUseCasesForCategory,
    } = useObservations();

    const [newCatName, setNewCatName] = useState('');
    const [showNewCat, setShowNewCat] = useState(false);

    const handleDrop = (categoryId: string, file: DriveFile) => {
        assignFile(categoryId, file.id, file.name, file.thumbnailUrl);
    };

    const handleAddCategory = async () => {
        const name = newCatName.trim();
        if (!name) return;
        await addCategory(name);
        setNewCatName('');
        setShowNewCat(false);
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-background">
            {/* Left Panel — Drive Media Pool */}
            <DriveMediaPool
                files={filteredFiles}
                loading={driveLoading}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                totalCount={totalCount}
                unassignedCount={unassignedCount}
                onDragStart={() => { }}
            />

            {/* Right Panel — Categories */}
            <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
                <header className="mb-10">
                    <h1 className="font-display text-4xl lg:text-5xl tracking-tight text-white/90">
                        Categorii EuroShop
                    </h1>
                    <p className="mt-3 font-sans text-sm text-white/50 max-w-lg">
                        Trage pozele din panoul stânga și plasează-le în categoriile potrivite.
                        Click pe numele categoriei pentru a-l edita. Modificările se sincronizează în timp real.
                    </p>
                </header>

                {catLoading ? (
                    <div className="text-white/30 text-sm font-sans animate-pulse">Se încarcă categoriile...</div>
                ) : (
                    <div className="space-y-6">
                        {categories.map((cat) => (
                            <CategorySection
                                key={cat.id}
                                id={cat.id}
                                name={cat.name}
                                description={cat.description}
                                assignments={getAssignmentsForCategory(cat.id)}
                                observations={getObservationsForCategory(cat.id)}
                                useCases={getUseCasesForCategory(cat.id)}
                                onDrop={handleDrop}
                                onRemoveAssignment={unassignFile}
                                onRename={(id, name) => updateCategory(id, { name })}
                                onDelete={deleteCategory}
                                onAddObservation={addObservation}
                                onUpdateObservation={updateObservation}
                                onDeleteObservation={deleteObservation}
                            />
                        ))}

                        {/* Add Category */}
                        {showNewCat ? (
                            <div className="rounded-2xl border-2 border-dashed border-accent/30 bg-accent/5 p-5">
                                <div className="flex items-center gap-3">
                                    <input autoFocus value={newCatName}
                                        onChange={(e) => setNewCatName(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === 'Enter') handleAddCategory(); if (e.key === 'Escape') setShowNewCat(false); }}
                                        placeholder="Numele categoriei noi..."
                                        className="flex-1 bg-white/5 border border-white/20 rounded-lg px-4 py-2.5 text-white/90 placeholder:text-white/30 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 font-sans"
                                    />
                                    <button onClick={handleAddCategory} disabled={!newCatName.trim()}
                                        className="bg-accent text-background px-5 py-2.5 rounded-lg font-bold text-sm uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                                        Adaugă
                                    </button>
                                    <button onClick={() => setShowNewCat(false)}
                                        className="text-white/40 hover:text-white px-3 py-2.5 transition-colors text-sm">Anulează</button>
                                </div>
                            </div>
                        ) : (
                            <button onClick={() => setShowNewCat(true)}
                                className="w-full py-6 rounded-2xl border-2 border-dashed border-white/10 hover:border-accent/40 text-white/30 hover:text-accent flex items-center justify-center gap-3 transition-all group">
                                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
                                <span className="font-sans text-sm uppercase tracking-widest font-bold">Adaugă Categorie Nouă</span>
                            </button>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
