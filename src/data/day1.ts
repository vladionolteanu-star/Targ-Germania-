import fs from 'fs';
import path from 'path';

export type MediaType = 'image' | 'video';

export interface ColleaguePOV {
    id: string;
    name: string;
    role?: string;
    comment: string;
}

export interface MediaItem {
    id: string;
    filename: string;
    type: MediaType;
    caption: string;
    povs?: ColleaguePOV[];
}

export interface CategoryData {
    id: string;
    title: string;
    description?: string;
    items: MediaItem[];
}

export const getDay1Data = (): CategoryData[] => {
    const filePath = path.join(process.cwd(), 'src/data/day1.json');
    try {
        const fileContents = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(fileContents);
    } catch (error) {
        console.error("Failed to read day1.json:", error);
        return [];
    }
};

export const getAllMedia = (): MediaItem[] => {
    const categories = getDay1Data();
    return categories.flatMap(c => c.items);
};
