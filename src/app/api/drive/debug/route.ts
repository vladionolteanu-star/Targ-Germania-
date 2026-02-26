import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    const DRIVE_API_KEY = process.env.GOOGLE_DRIVE_API_KEY;
    const DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;

    const debug: Record<string, unknown> = {
        hasApiKey: !!DRIVE_API_KEY,
        apiKeyPrefix: DRIVE_API_KEY ? DRIVE_API_KEY.substring(0, 10) + '...' : 'MISSING',
        hasFolderId: !!DRIVE_FOLDER_ID,
        folderIdValue: DRIVE_FOLDER_ID || 'MISSING',
        timestamp: new Date().toISOString(),
    };

    if (!DRIVE_API_KEY || !DRIVE_FOLDER_ID) {
        return NextResponse.json({ error: 'Missing env vars', debug }, { status: 500 });
    }

    try {
        const url = `https://www.googleapis.com/drive/v3/files?key=${DRIVE_API_KEY}&q=%27${DRIVE_FOLDER_ID}%27+in+parents+and+trashed+%3D+false&fields=nextPageToken,files(id,name,mimeType)&pageSize=5`;

        debug.requestUrl = url.replace(DRIVE_API_KEY, 'KEY_HIDDEN');

        const res = await fetch(url, { cache: 'no-store' });
        const text = await res.text();

        debug.responseStatus = res.status;
        debug.responseHeaders = Object.fromEntries(res.headers.entries());

        try {
            debug.responseBody = JSON.parse(text);
        } catch {
            debug.responseText = text.substring(0, 500);
        }

        return NextResponse.json(debug);
    } catch (error) {
        debug.fetchError = String(error);
        return NextResponse.json(debug, { status: 500 });
    }
}
