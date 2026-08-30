import { NextResponse } from 'next/server';
import { runTryOnWithFallback } from '@/lib/tryon';
import { createClient } from '@/lib/supabase/server';

// Helper: Upload base64 or local image to a temporary public host (uguu.se)
// If upload fails or times out, safely return the original input without crashing
async function getPublicUrl(imageInput: string): Promise<string> {
  if (!imageInput) return '';
  if (imageInput.startsWith('http://') || imageInput.startsWith('https://')) return imageInput;
  
  let buffer: Buffer;
  let mime = 'image/jpeg';
  let filename = 'image.jpg';

  try {
    if (imageInput.startsWith('data:')) {
      const commaIdx = imageInput.indexOf(',');
      const header = imageInput.slice(0, commaIdx);
      const data = imageInput.slice(commaIdx + 1);
      const mimeMatch = header.match(/data:(.*?);/);
      if (mimeMatch) mime = mimeMatch[1];
      filename = `image.${mime.split('/')[1] || 'jpg'}`;
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

    console.log(`[API TRY-ON] Uploading ${filename} to temporary host...`);
    const formData = new FormData();
    const blob = new Blob([new Uint8Array(buffer)], { type: mime });
    formData.append('files[]', blob, filename);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout
    
    const res = await fetch('https://uguu.se/upload.php', { 
      method: 'POST', 
      body: formData,
      signal: controller.signal 
    });
    clearTimeout(timeoutId);
    
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.files && data.files.length > 0) {
        return data.files[0].url;
      }
    }
  } catch (uploadErr: any) {
    console.warn('[API TRY-ON] Temporary host upload warning:', uploadErr.message);
  }

  // Gracefully fallback to the original image URI
  return imageInput;
}

export async function POST(req: Request) {
  try {
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
    console.error('[API TRY-ON] Execution error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Virtual fitting failed' },
      { status: 500 }
    );
  }
}
