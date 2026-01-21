import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { userId, email, fullName, companyId, role } = await request.json();

    // Hash password if provided
    let passwordHash = null;
    if (request.headers.get("password")) {
      passwordHash = await bcrypt.hash(request.headers.get("passsword")!, 10);
    }

    // Create user in users table
    const { data: user, error } = await supabase
      .from("users")
      .insert([
        {
          id: userId,
          email,
          full_name: fullName,
          company_id: companyId,
          role: role || "employee",
          password_hash: passwordHash,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(user);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
