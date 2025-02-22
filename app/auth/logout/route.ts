import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  await supabase.auth.signOut();

  const requestUrl = new URL(request.url);
  const origin = requestUrl.origin;
  const redirectTo = '/sign-in';

   return NextResponse.redirect(`${origin}${redirectTo}`);
}
