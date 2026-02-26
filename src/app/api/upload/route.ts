import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(req: Request) {
    if (process.env.NODE_ENV !== "development") {
        return NextResponse.json({ error: "Unauthorized. Edit mode is only available locally." }, { status: 403 });
    }

    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided." }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Ensure the filename is safe and unique
        const originalName = file.name.replace(/\s+/g, "_");
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        const ext = path.extname(originalName);
        const safeFilename = path.basename(originalName, ext) + "-" + uniqueSuffix + ext;

        const uploadDir = path.join(process.cwd(), "public/media/day1");
        // Ensure dir exists
        await fs.mkdir(uploadDir, { recursive: true });

        const filePath = path.join(uploadDir, safeFilename);

        await fs.writeFile(filePath, buffer);

        return NextResponse.json({
            success: true,
            filename: safeFilename,
            type: file.type.startsWith("video/") ? "video" : "image"
        });

    } catch (error) {
        console.error("Failed to upload file", error);
        return NextResponse.json({ error: "Failed to upload file." }, { status: 500 });
    }
}
