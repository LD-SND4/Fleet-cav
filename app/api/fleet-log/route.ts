import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return NextResponse.json({ error: "Missing Supabase configuration." }, { status: 500 });
  }

  const { data, error } = await supabase
    .from("fleets")
    .select("id, label, route_name")
    .order("id");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}
