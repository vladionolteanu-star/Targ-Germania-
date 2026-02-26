import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

// Function to save category data to the local day1.json
export async function POST(req: Request) {
    // Security Note: In a production CMS, this needs authentication. 
    // Since this is designed as a local-only editing tool before deploying static to Vercel,
    // we restrict it to local environment or allow it as an admin feature.
    if (process.env.NODE_ENV !== "development") {
        return NextResponse.json({ error: "Unauthorized. Edit mode is only available locally." }, { status: 403 });
    }

    try {
        const data = await req.json();
        const filePath = path.join(process.cwd(), "src/data/day1.json");

        // Write data back to file
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");

        return NextResponse.json({ success: true, message: "Data saved successfully." });
    } catch (error) {
        console.error("Failed to save day1.json", error);
        return NextResponse.json({ error: "Failed to save data." }, { status: 500 });
    }
}
