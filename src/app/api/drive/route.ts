import { listDriveFiles } from '@/lib/drive';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const files = await listDriveFiles();
        return NextResponse.json(files);
    } catch (error) {
        console.error('Failed to list Drive files:', error);
        return NextResponse.json(
            { error: 'Failed to fetch Drive files' },
            { status: 500 }
        );
    }
}
