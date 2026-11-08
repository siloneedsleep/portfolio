import { NextResponse, type NextRequest } from "next/server";
import { profile } from "@/data/profile";
import {
  escapeHtml,
  isHoneypotTriggered,
  validateContactPayload,
} from "@/lib/contact-validation";
import { contactRateLimiter } from "@/lib/rate-limit";

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  return "unknown";
}

export async function POST(request: NextRequest) {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return NextResponse.json(
      { ok: false, code: "INVALID_CONTENT_TYPE" },
      { status: 415 },
    );
  }

  let body: Record<string, unknown>;
  try {
    const parsed = (await request.json()) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return NextResponse.json({ ok: false, code: "INVALID_PAYLOAD" }, { status: 400 });
    }
    body = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, code: "INVALID_JSON" }, { status: 400 });
  }

  if (isHoneypotTriggered(body.website)) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const clientIp = getClientIp(request);
  const limit = contactRateLimiter.check(`contact:${clientIp}`, 5, 15 * 60 * 1000);
  if (!limit.allowed) {
    return NextResponse.json(
      { ok: false, code: "RATE_LIMITED" },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfterSeconds) },
      },
    );
  }

  const validation = validateContactPayload(body);
  if (!validation.ok) {
    return NextResponse.json(
      { ok: false, code: "VALIDATION_ERROR", errors: validation.errors },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json(
      { ok: false, code: "NOT_CONFIGURED" },
      { status: 503 },
    );
  }

  const toEmail = process.env.CONTACT_TO_EMAIL?.trim() || profile.email;
  const fromEmail =
    process.env.CONTACT_FROM_EMAIL?.trim() || "Silo Portfolio <onboarding@resend.dev>";

  const { name, email, message } = validation.data;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: email,
        subject: `[Portfolio] New inquiry from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        html: `<p><strong>Name:</strong> ${escapeHtml(name)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><p><strong>Message:</strong></p><pre style="font-family:sans-serif;white-space:pre-wrap;">${escapeHtml(message)}</pre>`,
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      return NextResponse.json(
        { ok: false, code: "DELIVERY_FAILED" },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    const isTimeout = error instanceof Error && error.name === "TimeoutError";
    return NextResponse.json(
      { ok: false, code: isTimeout ? "TIMEOUT" : "DELIVERY_FAILED" },
      { status: isTimeout ? 504 : 502 },
    );
  }
}
