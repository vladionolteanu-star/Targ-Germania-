import type { DriveFile } from '@/types/database';

const DRIVE_API_KEY = process.env.GOOGLE_DRIVE_API_KEY!;
const DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID!;

const SUPPORTED_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'video/mp4',
    'video/quicktime',
];

interface DriveApiFile {
    id: string;
    name: string;
    mimeType: string;
    thumbnailLink?: string;
    webViewLink?: string;
}

interface DriveApiResponse {
    files: DriveApiFile[];
    nextPageToken?: string;
}

export async function listDriveFiles(): Promise<DriveFile[]> {
    const allFiles: DriveFile[] = [];
    let pageToken: string | undefined;

    do {
        const params = new URLSearchParams({
            key: DRIVE_API_KEY,
            q: `'${DRIVE_FOLDER_ID}' in parents and trashed = false`,
            fields: 'nextPageToken, files(id, name, mimeType, thumbnailLink, webViewLink)',
            pageSize: '100',
            orderBy: 'name',
        });

        if (pageToken) {
            params.set('pageToken', pageToken);
        }

        const res = await fetch(
            `https://www.googleapis.com/drive/v3/files?${params.toString()}`,
            { next: { revalidate: 120 } }
        );

        if (!res.ok) {
            console.error('Drive API error:', await res.text());
            break;
        }

        const data: DriveApiResponse = await res.json();

        for (const file of data.files) {
            if (!SUPPORTED_TYPES.includes(file.mimeType)) continue;

            allFiles.push({
                id: file.id,
                name: file.name,
                mimeType: file.mimeType,
                thumbnailUrl: `/api/drive/thumb/${file.id}`,
                webViewLink: file.webViewLink || `https://drive.google.com/file/d/${file.id}/view`,
            });
        }

        pageToken = data.nextPageToken;
    } while (pageToken);

    return allFiles;
}

export function getDriveThumbnailUrl(fileId: string, size = 400): string {
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w${size}`;
}

export function getDriveFullImageUrl(fileId: string): string {
    return `https://lh3.googleusercontent.com/d/${fileId}`;
}

export function isVideoMimeType(mimeType: string): boolean {
    return mimeType.startsWith('video/');
}
