/*import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  return NextResponse.redirect(new URL("/about", request.url));
}*/

import { auth } from "@/app/_lib/auth";

export const proxy = auth;

export const config = {
  matcher: ["/account/:path*"],
};
