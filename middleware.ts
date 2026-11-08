import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);

function buildCsp(nonce: string, isDev: boolean, isHttps: boolean): string {
  const directives = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
    "form-action 'self'",
  ];

  if (isHttps) {
    directives.push("upgrade-insecure-requests");
  }

  return directives.join("; ");
}

export default function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const isDev = process.env.NODE_ENV === "development";
  const isHttps =
    request.nextUrl.protocol === "https:" ||
    request.headers.get("x-forwarded-proto") === "https";
  const cspHeader = buildCsp(nonce, isDev, isHttps);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("content-security-policy", cspHeader);

  const modifiedRequest = new NextRequest(request.url, {
    headers: requestHeaders,
  });

  const response = handleI18nRouting(modifiedRequest);
  response.headers.set("Content-Security-Policy", cspHeader);
  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|_vercel|.*\\..*).*)"],
};
