import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Comprobar presencia de cookie de sesión de Better Auth para redirección rápida
  const sessionToken =
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("__Secure-better-auth.session_token")?.value;

  // Redirección rápida en cliente para rutas protegidas si no hay token
  // NOTA: Como especifica el plan, cada Server Component y Server Action
  // vuelve a validar la sesión y el rol de forma estricta en el servidor.
  if (pathname.startsWith("/admin") && !sessionToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
