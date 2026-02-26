"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import type { CategoryData } from "@/data/day1";
import { Edit3, Check, MousePointer2 } from "lucide-react";

interface EditContextType {
    isEditing: boolean;
    toggleEdit: () => void;
    cmsData: CategoryData[];
    setCmsData: React.Dispatch<React.SetStateAction<CategoryData[]>>;
    saveToServer: () => Promise<void>;
    isSaving: boolean;
}

const EditContext = createContext<EditContextType | undefined>(undefined);

export function EditProvider({ children, initialData }: { children: React.ReactNode, initialData: CategoryData[] }) {
    const [isEditing, setIsEditing] = useState(false);
    const [cmsData, setCmsData] = useState<CategoryData[]>(initialData);
    const [isSaving, setIsSaving] = useState(false);
    const [isLocal, setIsLocal] = useState(false);

    useEffect(() => {
        // Check if we are running locally to show the edit toggle
        if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
            setIsLocal(true);
        }
    }, []);

    const toggleEdit = () => setIsEditing(!isEditing);

    const saveToServer = async () => {
        setIsSaving(true);
        try {
            const res = await fetch("/api/data", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(cmsData),
            });
            if (!res.ok) throw new Error("Failed to save data");
            alert("Modificările au fost salvate cu succes local!");
        } catch (e) {
            console.error(e);
            alert("Eroare la salvarea datelor.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <EditContext.Provider value={{ isEditing, toggleEdit, cmsData, setCmsData, saveToServer, isSaving }}>
            {children}

            {/* Floating Admin Control (Local Only) */}
            {isLocal && (
                <div className="fixed bottom-6 right-6 z-[200] flex gap-2 mix-blend-difference">
                    {isEditing && (
                        <button
                            onClick={saveToServer}
                            disabled={isSaving}
                            className="px-4 py-2 bg-accent text-background rounded-full font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-white transition-colors"
                        >
                            {isSaving ? "Se salvează..." : <><Check className="w-4 h-4" /> Salvează</>}
                        </button>
                    )}
                    <button
                        onClick={toggleEdit}
                        className={`px-4 py-2 rounded-full font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-colors ${isEditing ? "bg-white text-background" : "bg-surface/50 text-white backdrop-blur border border-white/20 hover:border-accent"
                            }`}
                    >
                        {isEditing ? <><MousePointer2 className="w-4 h-4" /> Ieși din Edit Mode</> : <><Edit3 className="w-4 h-4" /> Mod Editare CMS</>}
                    </button>
                </div>
            )}
        </EditContext.Provider>
    );
}

export function useEditMode() {
    const context = useContext(EditContext);
    if (context === undefined) {
        throw new Error("useEditMode must be used within an EditProvider");
    }
    return context;
}
