import { NextResponse } from 'next/server';
import dns from 'dns';
import { promisify } from 'util';

const dnsLookup = promisify(dns.lookup);

// Checks if the resolved IP belongs to a private, loopback, or link-local address range
export function isPrivateIP(ip: string): boolean {
  // Normalize IPv4-mapped IPv6 (e.g., ::ffff:127.0.0.1)
  let cleanIp = ip.toLowerCase();
  if (cleanIp.startsWith('::ffff:')) {
    cleanIp = cleanIp.slice(7);
  }

  const parts = cleanIp.split('.').map(Number);
  if (parts.length === 4 && parts.every((p) => !isNaN(p) && p >= 0 && p <= 255)) {
    // Localhost / Loopback (127.0.0.0/8)
    if (parts[0] === 127) return true;
    // Private Network Class A (10.0.0.0/8)
    if (parts[0] === 10) return true;
    // Carrier-Grade NAT (100.64.0.0/10)
    if (parts[0] === 100 && parts[1] >= 64 && parts[1] <= 127) return true;
    // Private Network Class B (172.16.0.0/12)
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
    // Private Network Class C (192.168.0.0/16)
    if (parts[0] === 192 && parts[1] === 168) return true;
    // Link-local / Autoconfiguration (169.254.0.0/16)
    if (parts[0] === 169 && parts[1] === 254) return true;
    // Multicast & Reserved (224.0.0.0/4)
    if (parts[0] >= 224) return true;
    // Unspecified / Broadcast (0.0.0.0)
    if (parts[0] === 0) return true;
  }
  
  // IPv6 check (Loopback, Link-local, Unique Local Address, Multicast)
  if (
    cleanIp === '::1' || 
    cleanIp === '::' ||
    cleanIp.startsWith('fe80:') || 
    cleanIp.startsWith('fc00:') || 
    cleanIp.startsWith('fd00:') ||
    cleanIp.startsWith('ff00:')
  ) {
    return true;
  }

  return false;
}

// Escapes special characters to prevent cross-site scripting (XSS)
function sanitizeText(str: string): string {
  return str
    .replace(/<[^>]*>/g, '') // Strip HTML tags
    .replace(/[&<>"']/g, (m) => {
      const escapeMap: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
      };
      return escapeMap[m];
    })
    .trim();
}

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ success: false, error: 'Product URL is required' }, { status: 400 });
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch (_) {
      return NextResponse.json({ success: false, error: 'Invalid URL format' }, { status: 400 });
    }

    // Security Check 1: Port Restrictions (Only allow standard web traffic)
    const port = parsedUrl.port;
    if (port && port !== '80' && port !== '443') {
      return NextResponse.json({ success: false, error: 'Only ports 80 and 443 are allowed.' }, { status: 400 });
    }

    // Security Check 2: Protocol Enforcement (Only allow HTTP/HTTPS)
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      return NextResponse.json({ success: false, error: 'Only HTTP and HTTPS protocols are allowed.' }, { status: 400 });
    }

    // Security Check 3: SSRF Mitigation (IP Resolution & Blacklisting)
    try {
      const lookupResult = await dnsLookup(parsedUrl.hostname);
      if (isPrivateIP(lookupResult.address)) {
        return NextResponse.json({ success: false, error: 'Access to local or private IP addresses is blocked.' }, { status: 403 });
      }
    } catch (dnsErr) {
      return NextResponse.json({ success: false, error: 'Could not resolve the target hostname.' }, { status: 400 });
    }

    // Security Check 4: Timeout enforcement (aborts slow responses)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5-second timeout

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
      },
      signal: controller.signal,
      redirect: 'error', // Block automatic redirects to prevent redirect-based SSRF bypass
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Target page returned status: ${response.status}`);
    }

    // Security Check 5: Size Limit Capping (Abort if headers specify > 2MB)
    const MAX_PAGE_BYTES = 2 * 1024 * 1024; // 2MB
    const contentLength = response.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > MAX_PAGE_BYTES) {
      return NextResponse.json({ success: false, error: 'Garment page exceeds size limit of 2MB.' }, { status: 400 });
    }

    // Security Check 6: Webpage Content-Type verification
    const contentType = response.headers.get('content-type') || '';
    if (
      !contentType.includes('text/html') && 
      !contentType.includes('text/plain') && 
      !contentType.includes('application/xhtml+xml')
    ) {
      return NextResponse.json({ success: false, error: 'Target URL is not a valid webpage.' }, { status: 400 });
    }

    // Read body as stream with byte limit enforcement to protect against memory exhaustion on chunked transfers
    let html = '';
    if (response.body) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let totalBytes = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          totalBytes += value.length;
          if (totalBytes > MAX_PAGE_BYTES) {
            reader.cancel();
            return NextResponse.json({ success: false, error: 'Garment page body exceeds size limit of 2MB.' }, { status: 400 });
          }
          html += decoder.decode(value, { stream: true });
        }
      }
      html += decoder.decode();
    } else {
      html = await response.text();
    }

    // Regex scanners for open-graph title and image details
    const ogImageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) || 
                         html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
    
    const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i) ||
                         html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:title["']/i);

    const titleTagMatch = html.match(/<title>([^<]+)<\/title>/i);

    const rawImageUrl = ogImageMatch ? ogImageMatch[1] : null;
    const rawTitle = ogTitleMatch ? ogTitleMatch[1] : (titleTagMatch ? titleTagMatch[1] : 'Custom Style');

    if (!rawImageUrl) {
      return NextResponse.json({
        success: false,
        error: 'Could not automatically scan a high-resolution product image on this page. Third-party sites sometimes block scrapers.',
      });
    }

    // Security Check 7: Image URL validation (Must be HTTP/HTTPS to prevent XSS script urls, resolve relative URLs)
    let resolvedImgUrl: string;
    try {
      const verifiedImgUrl = new URL(rawImageUrl, parsedUrl);
      if (verifiedImgUrl.protocol !== 'http:' && verifiedImgUrl.protocol !== 'https:') {
        return NextResponse.json({ success: false, error: 'Scraped image URL protocol is not secure.' }, { status: 400 });
      }
      resolvedImgUrl = verifiedImgUrl.href;
    } catch (_) {
      return NextResponse.json({ success: false, error: 'Scraped image URL is invalid or malformed.' }, { status: 400 });
    }

    // Extract brand name from hostname
    let brand = 'IMPORTED';
    try {
      brand = parsedUrl.hostname.replace('www.', '').split('.')[0].toUpperCase();
    } catch (_) {}

    return NextResponse.json({
      success: true,
      product: {
        id: `imported-${Date.now()}`,
        name: sanitizeText(rawTitle).substring(0, 50),
        brand: sanitizeText(brand),
        image: resolvedImgUrl,
        price: '—',
        category: 'imports',
      }
    });
  } catch (err: any) {
    if (err.name === 'AbortError') {
      return NextResponse.json({ success: false, error: 'Request timed out. Target website was too slow to respond.' }, { status: 504 });
    }
    return NextResponse.json({ success: false, error: err.message || 'Scraper failed to load page' });
  }
}
