import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { embedQuery } from "@/lib/embedding";

export async function POST(request: NextRequest) {
  let query: string;
  try {
    const body = await request.json();
    query = body.query;
    if (!query || typeof query !== "string" || query.trim() === "") {
      return NextResponse.json(
        { error: "Query is required" },
        { status: 400 }
      );
    }
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  try {
    const embedding = await embedQuery(query.trim());

    const { data, error } = await supabase.rpc("search_images", {
      query_embedding: embedding,
      match_count: 8,
    });

    if (error) {
      console.error("Search error:", error);
      return NextResponse.json(
        { error: "Sorry, try again later." },
        { status: 500 }
      );
    }

    const images = (data ?? []).map(
      (row: { url: string }) =>
        `/api/image?key=${encodeURIComponent(row.url)}`
    );

    return NextResponse.json({ images });
  } catch (err) {
    console.error("Search error:", err);
    return NextResponse.json(
      { error: "Sorry, try again later." },
      { status: 500 }
    );
  }
}
