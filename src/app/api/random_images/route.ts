import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { rateLimit } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "anonymous";

  if (!rateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429 }
    );
  }
  try {
    const { data, error } = await getSupabase().rpc("random_images", {
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
