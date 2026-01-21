import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  // 1. Validation: Check if environment variables exist
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Supabase Environment Variables are missing. Check your .env.local file.",
    );
  }

  try {
    const cookieStore = await cookies();

    return createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            /**
             * NOTE: Next.js Server Components mein cookies.set() error throw karta hai.
             * Is liye hum sirf Middleware ya Server Actions mein hi cookies set kar sakte hain.
             */
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch (error) {
            // Ye catch block Server Components mein crash hone se rokta hai.
            // Isay ignore karna hi professional practice hai yahan.
          }
        },
      },
    });
  } catch (error) {
    console.error("Failed to initialize Supabase Server Client:", error);
    throw error;
  }
}
