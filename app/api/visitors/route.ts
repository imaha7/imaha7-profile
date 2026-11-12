import { NextRequest, NextResponse } from "next/server";

const VISITOR_COOKIE = "imaha7_visitor";
const ACTIVE_WINDOW_MS = 90_000;

const TRACK_VISITOR_SCRIPT = `
  local is_new = redis.call('SADD', KEYS[1], ARGV[1])
  if is_new == 1 then
    redis.call('INCR', KEYS[2])
  end
  redis.call('ZADD', KEYS[3], ARGV[2], ARGV[1])
  redis.call('ZREMRANGEBYSCORE', KEYS[3], '-inf', ARGV[3])
  return { redis.call('ZCARD', KEYS[3]), redis.call('GET', KEYS[2]) or '0' }
`;

function isVisitorId(value: string | undefined): value is string {
  return value !== undefined && /^[\da-f]{8}(?:-[\da-f]{4}){3}-[\da-f]{12}$/i.test(value);
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (origin) {
    try {
      if (new URL(origin).origin !== new URL(request.url).origin) {
        return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
    }
  }

  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!redisUrl || !redisToken) {
    return NextResponse.json(
      { error: "Visitor analytics are not configured." },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }

  const existingVisitorId = request.cookies.get(VISITOR_COOKIE)?.value;
  const visitorId = isVisitorId(existingVisitorId)
    ? existingVisitorId
    : crypto.randomUUID();
  const now = Date.now();

  try {
    const response = await fetch(`${redisUrl.replace(/\/+$/, "")}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${redisToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        [
          "EVAL",
          TRACK_VISITOR_SCRIPT,
          "3",
          "imaha7:visitors:unique",
          "imaha7:visitors:total",
          "imaha7:visitors:active",
          visitorId,
          String(now),
          String(now - ACTIVE_WINDOW_MS),
        ],
      ]),
      cache: "no-store",
      signal: AbortSignal.timeout(5_000),
    });

    if (!response.ok) {
      throw new Error(`Upstash returned HTTP ${response.status}.`);
    }

    const results: unknown = await response.json();
    if (
      !Array.isArray(results) ||
      typeof results[0] !== "object" ||
      results[0] === null ||
      !("result" in results[0]) ||
      !Array.isArray(results[0].result) ||
      results[0].result.length !== 2
    ) {
      throw new Error("Upstash returned an invalid visitor count response.");
    }

    const [onlineVisitors, totalVisitors] = results[0].result.map(Number);
    if (
      !Number.isSafeInteger(onlineVisitors) ||
      onlineVisitors < 0 ||
      !Number.isSafeInteger(totalVisitors) ||
      totalVisitors < 0
    ) {
      throw new Error("Upstash returned invalid visitor counts.");
    }

    const nextResponse = NextResponse.json(
      { onlineVisitors, totalVisitors },
      { headers: { "Cache-Control": "no-store" } }
    );

    if (visitorId !== existingVisitorId) {
      nextResponse.cookies.set(VISITOR_COOKIE, visitorId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
      });
    }

    return nextResponse;
  } catch (error) {
    console.error("Unable to update visitor analytics.", error);
    return NextResponse.json(
      { error: "Visitor analytics are temporarily unavailable." },
      { status: 502, headers: { "Cache-Control": "no-store" } }
    );
  }
}
