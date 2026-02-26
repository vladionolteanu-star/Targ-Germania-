import { listDriveFiles } from '@/lib/drive';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Debug: log env vars availability
        const hasApiKey = !!process.env.GOOGLE_DRIVE_API_KEY;
        const hasFolderId = !!process.env.GOOGLE_DRIVE_FOLDER_ID;

        if (!hasApiKey || !hasFolderId) {
            return NextResponse.json(
                {
                    error: 'Missing environment variables',
                    debug: { hasApiKey, hasFolderId },
                },
                { status: 500 }
            );
        }

        const files = await listDriveFiles();
        return NextResponse.json(files);
    } catch (error) {
        console.error('Failed to list Drive files:', error);
        return NextResponse.json(
            { error: 'Failed to fetch Drive files', detail: String(error) },
            { status: 500 }
        );
    }
}
