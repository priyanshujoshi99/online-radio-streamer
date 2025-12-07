import type { Context } from "@netlify/edge-functions";

export default async function handler(request: Request, context: Context) {
  // Extract path suffix after /radio/
  const url = new URL(request.url);
  const path = url.pathname.replace(/^\/radio\//, ""); 
  const targetUrl = `https://akashvani.gov.in/radio/${path}${url.search}`;

  try {
    const response = await fetch(targetUrl, {
      headers: { "Accept-Encoding": "identity" }
    });
    
    // Reconstruct headers
    const newHeaders = new Headers(response.headers);
    newHeaders.delete("X-Frame-Options");
    newHeaders.delete("Content-Security-Policy");
    newHeaders.delete("X-Content-Type-Options"); 
    newHeaders.delete("Access-Control-Allow-Origin");

    newHeaders.set("Access-Control-Allow-Origin", "*");
    
    // Inject script only for HTML responses
    const contentType = newHeaders.get("content-type") || "";
    let body = response.body;

    if (contentType.includes("text/html")) {
        let text = await response.text();
        const scriptTag = '<script src="https://cdn.jsdelivr.net/npm/iframe-resizer@5.5.7/js/iframeResizer.contentWindow.min.js"></script>';
        if (text.includes('</body>')) {
            text = text.replace('</body>', `${scriptTag}</body>`);
        } else {
            text += scriptTag;
        }
        return new Response(text, {
            status: response.status,
            statusText: response.statusText,
            headers: newHeaders,
        });
    }

    return new Response(body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  } catch (err) {
    return new Response("Error fetching Akashvani content: " + err, { status: 500 });
  }
}
