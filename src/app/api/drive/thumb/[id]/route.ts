import { NextRequest, NextResponse } from 'next/server';

const DRIVE_API_KEY = process.env.GOOGLE_DRIVE_API_KEY!;

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    if (!id) {
        return NextResponse.json({ error: 'Missing file ID' }, { status: 400 });
    }

    const sizeParam = req.nextUrl.searchParams.get('size');
    const isFull = sizeParam === 'full';
    const targetSize = isFull ? 1600 : 400;

    try {
        // Use Drive API to get the file's thumbnail directly
        const metaRes = await fetch(
            `https://www.googleapis.com/drive/v3/files/${id}?fields=thumbnailLink&key=${DRIVE_API_KEY}`
        );

        if (!metaRes.ok) {
            // Fallback: try the public thumbnail endpoint
            const fallbackUrl = `https://drive.google.com/thumbnail?id=${id}&sz=w${targetSize}`;
            return NextResponse.redirect(fallbackUrl);
        }

        const meta = await metaRes.json();

        if (meta.thumbnailLink) {
            // Upscale thumbnail
            const url = meta.thumbnailLink.replace(/=s\d+$/, `=s${targetSize}`);
            const imgRes = await fetch(url);

            if (imgRes.ok) {
                const buffer = await imgRes.arrayBuffer();
                return new NextResponse(buffer, {
                    headers: {
                        'Content-Type': imgRes.headers.get('content-type') || 'image/jpeg',
                        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
                    },
                });
            }
        }

        // Final fallback: use the file content endpoint
        const contentRes = await fetch(
            `https://www.googleapis.com/drive/v3/files/${id}?alt=media&key=${DRIVE_API_KEY}`,
            { headers: { Range: 'bytes=0-524287' } } // Only first 512KB for thumbnail
        );

        if (contentRes.ok) {
            const buffer = await contentRes.arrayBuffer();
            return new NextResponse(buffer, {
                headers: {
                    'Content-Type': contentRes.headers.get('content-type') || 'image/jpeg',
                    'Cache-Control': 'public, max-age=86400, s-maxage=86400',
                },
            });
        }

        return NextResponse.json({ error: 'Could not fetch thumbnail' }, { status: 404 });
    } catch (error) {
        console.error(`Thumbnail proxy error for ${id}:`, error);
        return NextResponse.json({ error: 'Proxy error' }, { status: 500 });
    }
}
