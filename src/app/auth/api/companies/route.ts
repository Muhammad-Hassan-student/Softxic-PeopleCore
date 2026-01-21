import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { error } from "console";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { name, slug } = await request.json();

    // Check if comapany already exist
    const { data: existing } = await supabase
      .from("companies")
      .select("id")
      .eq("slug", slug)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "Companies with this name already exists" },
        { status: 400 },
      );
    }

    // Create company
    const { data: company, error } = await supabase
      .from("companies")
      .insert([
        {
          name,
          slug,
          trial_ends_at: new Date(Date.now() + 30 * 24 * 60 * 1000), // 30 days trial
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(company);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
