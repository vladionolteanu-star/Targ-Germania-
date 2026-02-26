export interface Database {
    public: {
        Tables: {
            categories: {
                Row: {
                    id: string;
                    name: string;
                    description: string;
                    order: number;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    name: string;
                    description?: string;
                    order?: number;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    name?: string;
                    description?: string;
                    order?: number;
                    created_at?: string;
                };
                Relationships: [];
            };
            assignments: {
                Row: {
                    id: string;
                    category_id: string;
                    drive_file_id: string;
                    filename: string;
                    thumbnail_url: string;
                    caption: string;
                    order: number;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    category_id: string;
                    drive_file_id: string;
                    filename: string;
                    thumbnail_url: string;
                    caption?: string;
                    order?: number;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    category_id?: string;
                    drive_file_id?: string;
                    filename?: string;
                    thumbnail_url?: string;
                    caption?: string;
                    order?: number;
                    created_at?: string;
                };
                Relationships: [];
            };
            observations: {
                Row: {
                    id: string;
                    text: string;
                    type: string;
                    category_id: string;
                    order: number;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    text: string;
                    type: string;
                    category_id: string;
                    order?: number;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    text?: string;
                    type?: string;
                    category_id?: string;
                    order?: number;
                    created_at?: string;
                };
                Relationships: [];
            };
        };
        Views: Record<string, never>;
        Functions: Record<string, never>;
        Enums: Record<string, never>;
        CompositeTypes: Record<string, never>;
    };
}

export type Category = Database['public']['Tables']['categories']['Row'];
export type Assignment = Database['public']['Tables']['assignments']['Row'];
export type Observation = Database['public']['Tables']['observations']['Row'];

export interface DriveFile {
    id: string;
    name: string;
    mimeType: string;
    thumbnailUrl: string;
    webViewLink: string;
}
