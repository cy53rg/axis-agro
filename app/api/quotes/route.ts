import { NextResponse } from "next/server";
import { Resend } from "resend";

import { createAdminClient } from "@/lib/supabase/admin";
import { quoteSchema } from "@/lib/validations/quote";

// Simple in-memory rate limiter (resets on serverless cold starts)
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT = 3; 
const WINDOW_MS = 60000; 

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildEmailHtml(data: {
  name: string;
  phone: string;
  email?: string;
  service_type: string;
  quantity?: string;
  message: string;
  submittedAt: string;
}) {
  return `
    <h2>New Quote Request</h2>
    <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>
    <p><strong>Email:</strong> ${escapeHtml(data.email || "Not provided")}</p>
    <p><strong>Service interested in:</strong> ${escapeHtml(data.service_type)}</p>
    <p><strong>Quantity:</strong> ${escapeHtml(data.quantity || "Not specified")}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(data.message).replace(/\n/g, "<br>")}</p>
    <p><strong>Date submitted:</strong> ${escapeHtml(data.submittedAt)}</p>
    <hr>
    <p><em>Log in to admin panel to view and respond.</em></p>
  `;
}

export async function POST(request: Request) {
  // Rate Limiting Logic
  const ip = request.headers.get("x-forwarded-for") || "unknown_ip";
  const now = Date.now();
  const userRate = rateLimitMap.get(ip);

  if (userRate && now - userRate.lastReset < WINDOW_MS) {
    if (userRate.count >= RATE_LIMIT) {
      return NextResponse.json(
        { success: false, message: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }
    userRate.count += 1;
  } else {
    rateLimitMap.set(ip, { count: 1, lastReset: now });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const result = quoteSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      {
        success: false,
        errors: result.error.flatten(),
      },
      { status: 400 }
    );
  }

  const data = result.data;

  try {
    const supabase = createAdminClient();

    const { error: dbError } = await supabase.from("quote_requests").insert({
      name: data.name,
      phone: data.phone,
      email: data.email || null,
      service_type: data.service_type,
      quantity: data.quantity || null,
      message: data.message,
    });

    if (dbError) {
      console.error("[quotes] Database insert failed:", dbError.message);
      return NextResponse.json(
        { success: false, message: "Failed to submit quote request" },
        { status: 500 }
      );
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    const resendApiKey = process.env.RESEND_API_KEY;

    if (adminEmail && resendApiKey) {
      try {
        const resend = new Resend(resendApiKey);
        const submittedAt = new Date().toLocaleString("en-GB", {
          timeZone: "Africa/Lagos",
          dateStyle: "long",
          timeStyle: "short",
        });

        await resend.emails.send({
          from:
            process.env.RESEND_FROM ??
            "Axis Agro Website <onboarding@resend.dev>",
          to: adminEmail,
          subject: `New Quote Request: ${data.service_type} from ${data.name}`,
          html: buildEmailHtml({
            name: data.name,
            phone: data.phone,
            email: data.email,
            service_type: data.service_type,
            quantity: data.quantity,
            message: data.message,
            submittedAt,
          }),
        });
      } catch (emailError) {
        console.error("[quotes] Email notification failed:", emailError);
      }
    } else {
      console.warn(
        "[quotes] Skipping email notification: ADMIN_EMAIL or RESEND_API_KEY not set"
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Quote submitted successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[quotes] Unexpected error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export function GET() {
  return NextResponse.json(
    { success: false, message: "Method not allowed" },
    { status: 405 }
  );
}