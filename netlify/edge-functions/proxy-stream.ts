import type { Context } from "@netlify/edge-functions";

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);
  const target = url.searchParams.get("target");

  if (!target) {
    return new Response("Missing target param", { status: 400 });
  }

  try {
    const response = await fetch(target, {
      method: "GET",
      // Important to headers to avoid some anti-bot checks or ensure accept
      headers: {
        "User-Agent": "RadioProxy/1.0"
      }
    });

    if (!response.body) {
         return new Response("No content", { status: 500 });
    }

    // Pass through core headers
    const newHeaders = new Headers(response.headers);
    newHeaders.set("Access-Control-Allow-Origin", "*");
    // Ensure content type is preserved
    
    return new Response(response.body, {
      headers: newHeaders,
      status: response.status,
      statusText: response.statusText,
    });
  } catch (err) {
    return new Response(`Proxy error: ${err}`, { status: 500 });
  }
};
