import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase.rpc("random_images", {
      match_count: 8,
    });

    if (error) {
      console.error("Supabase error:", error);
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
    console.error("Random images error:", err);
    return NextResponse.json(
      { error: "Sorry, try again later." },
      { status: 500 }
    );
  }
}
