import { NextResponse } from 'next/server';
import { runTryOnWithFallback } from '@/lib/tryon';
import { createClient } from '@/lib/supabase/server';
import { checkRateLimit, getClientIp } from '../../../lib/rateLimit';

// Helper: Upload base64 or local image to secure private Supabase storage and get a temporary signed URL.
// Replaces insecure third-party temporary uploaders (uguu.se) to ensure user biometric and body photo privacy.
async function getPublicUrl(imageInput: string): Promise<string> {
  if (!imageInput) return '';
  if (imageInput.startsWith('http://') || imageInput.startsWith('https://')) return imageInput;
  
  let buffer: Buffer;
  let mime = 'image/jpeg';
  let filename = `tryon-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;

  try {
    if (imageInput.startsWith('data:')) {
      const commaIdx = imageInput.indexOf(',');
      const header = imageInput.slice(0, commaIdx);
      const data = imageInput.slice(commaIdx + 1);
      const mimeMatch = header.match(/data:(.*?);/);
      if (mimeMatch) mime = mimeMatch[1];
      const ext = mime.split('/')[1] || 'jpg';
      filename = `tryon-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      buffer = Buffer.from(data, 'base64');
    } else if (imageInput.startsWith('/')) {
      const fs = await import('fs');
      const path = await import('path');
      const filepath = path.join(process.cwd(), 'public', imageInput);
      if (fs.existsSync(filepath)) {
        buffer = fs.readFileSync(filepath);
        if (imageInput.endsWith('.png')) mime = 'image/png';
        if (imageInput.endsWith('.webp')) mime = 'image/webp';
        filename = path.basename(imageInput);
      } else {
        return imageInput;
      }
    } else {
      return imageInput;
    }

    // Attempt secure upload to private Supabase Storage if service key is configured
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const { createClient: createSupabaseJs } = await import('@supabase/supabase-js');
        const supabase = createSupabaseJs(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.SUPABASE_SERVICE_ROLE_KEY
        );

        const bucketName = 'tryon-temp';
        const { error: uploadErr } = await supabase.storage
          .from(bucketName)
          .upload(filename, buffer, { contentType: mime, upsert: true });

        if (!uploadErr) {
          // Generate 1-hour secure signed URL
          const { data: signedData, error: signErr } = await supabase.storage
            .from(bucketName)
            .createSignedUrl(filename, 3600);

          if (!signErr && signedData?.signedUrl) {
            console.log(`[API TRY-ON] ✓ Successfully generated private signed URL for ${filename}`);
            return signedData.signedUrl;
          }
        } else {
          console.warn('[API TRY-ON] Supabase storage upload warning:', uploadErr.message);
        }
      } catch (storageErr: any) {
        console.warn('[API TRY-ON] Storage signed URL error:', storageErr.message);
      }
    }
  } catch (err: any) {
    console.warn('[API TRY-ON] Image processing warning:', err.message);
  }

  // Gracefully fallback to the original image URI without compromising privacy via untrusted third parties
  return imageInput;
}

export async function POST(req: Request) {
  try {
    const clientIp = getClientIp(req);

    // Apply Rate Limiting (Phase 3): 10 try-ons per 10 minutes per IP
    const rateLimit = checkRateLimit(`tryon:${clientIp}`, 10, 10 * 60 * 1000);
    if (!rateLimit.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded. Too many virtual try-on requests. Please try again later.',
        },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil(rateLimit.resetMs / 1000).toString(),
          },
        }
      );
    }

    const body = await req.json();
    
    // Support both 'personImage' (new) and 'modelImage' (old) variable keys
    const personImage = body.personImage || body.modelImage;
    const garmentImage = body.garmentImage;
    const garmentType = body.garmentType || 'upper';

    if (!personImage) {
      return NextResponse.json(
        { success: false, error: 'Missing required field: personImage (user body photo).' },
        { status: 400 }
      );
    }

    if (!garmentImage) {
      return NextResponse.json(
        { success: false, error: 'Missing required field: garmentImage.' },
        { status: 400 }
      );
    }

    // 1. Check authentication (allow demo try-on for guests)
    let user: any = null;
    try {
      const supabase = await createClient();
      const { data } = await supabase.auth.getUser();
      user = data?.user || null;
    } catch (authErr: any) {
      console.warn('[API TRY-ON] Session check warning:', authErr.message);
    }

    const isAdmin = user?.email === 'admin@drip.com';
    const tryonsUsed = user?.user_metadata?.tryons_used || 0;

    if (user && !isAdmin && tryonsUsed >= 5) {
      return NextResponse.json(
        { success: false, error: 'You have reached your limit of free virtual try-ons.' },
        { status: 403 }
      );
    }

    console.log(`[API TRY-ON] Formatting images for API providers...`);
    const processedPersonImage = await getPublicUrl(personImage);
    const processedGarmentImage = await getPublicUrl(garmentImage);

    console.log(`[API TRY-ON] Dispatching to multi-provider orchestrator (Category: ${garmentType})...`);
    
    const result = await runTryOnWithFallback({
      personImage: processedPersonImage,
      garmentImage: processedGarmentImage,
      garmentType,
    });

    console.log(`[API TRY-ON] ✓ Completed via ${result.provider} in ${result.durationMs}ms`);

    // Increment usage for authenticated non-admin users
    if (user && !isAdmin && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const { createClient: createSupabaseJs } = await import('@supabase/supabase-js');
        const adminAuthClient = createSupabaseJs(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY
        );
        await adminAuthClient.auth.admin.updateUserById(user.id, {
          user_metadata: { tryons_used: tryonsUsed + 1 }
        });
      } catch (incErr: any) {
        console.warn('[API TRY-ON] Failed to increment tryons_used:', incErr.message);
      }
    }

    return NextResponse.json({
      success: true,
      resultUrl: result.resultUrl,
      provider: result.provider,
      durationMs: result.durationMs,
      fallbackUsed: result.fallbackUsed,
    });

  } catch (error: any) {
    console.error('[API TRY-ON] Critical error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error during virtual try-on execution.' },
      { status: 500 }
    );
  }
}
