export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const hostname = url.hostname;
    
    if (hostname === "is-a.software" || hostname === "www.is-a.software") {
      return fetch(request);
    }

    try {
      const subdomain = hostname.replace(/\.is-a\.software$/i, "");

      const res = await fetch("https://raw.is-a.software/domains.json", {
        headers: { "User-Agent": "is-a-worker" },
        cf: { cacheTtl: 60 },
      });

      if (!res.ok) {
        return new Response("Failed to fetch domain list.", { status: 502 });
      }

      const domains = await res.json();

      const registered = domains.some(
        (entry) =>
          entry.domain &&
          entry.domain.toLowerCase() === subdomain.toLowerCase()
      );

      if (registered) {
        return fetch(request);
      }

      let asset = await env.ASSETS.fetch(request);

      if (asset.status === 404) {
        asset = await env.ASSETS.fetch(
          new Request("https://is-a.software/index.html", request)
        );
      }

      return asset;
    } catch (err) {
      return new Response("Internal error: " + err.message, {
        status: 500,
      });
    }
  },
};
