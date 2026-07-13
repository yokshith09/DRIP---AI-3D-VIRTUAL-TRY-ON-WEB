import { NextResponse } from 'next/server';
import { runTryOnWithFallback } from '@/lib/tryon';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    // 1. Enforce strict server-side API Route Protection
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (!user) {
      console.warn('[API TRY-ON] Auth check failed:', authError?.message || 'No session');
      return NextResponse.json(
        { success: false, error: `Authentication required. ${authError?.message || 'Please log in and try again.'}` },
        { status: 401 }
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

    // Log image type info for debugging
    const personImgType = personImage.startsWith('data:') ? 'base64' : personImage.startsWith('http') ? 'URL' : 'unknown';
    const garmentImgType = garmentImage.startsWith('data:') ? 'base64' : garmentImage.startsWith('http') ? 'URL' : 'unknown';
    console.log(`[API TRY-ON] Person image type: ${personImgType}, Garment image type: ${garmentImgType}`);
    console.log(`[API TRY-ON] Dispatching to multi-provider orchestrator (Category: ${garmentType})...`);

    // Check which API keys are configured
    const configuredKeys = [
      process.env.HF_TOKEN ? 'HF_TOKEN' : null,
      process.env.PIAPI_KEY ? 'PIAPI_KEY' : null,
      process.env.REPLICATE_API_TOKEN ? 'REPLICATE_API_TOKEN' : null,
    ].filter(Boolean);
    console.log(`[API TRY-ON] Configured API keys: ${configuredKeys.length > 0 ? configuredKeys.join(', ') : 'NONE (simulation mode)'}`);
    
    const result = await runTryOnWithFallback({
      personImage,
      garmentImage,
      garmentType,
    });

    console.log(`[API TRY-ON] ✓ Completed via ${result.provider} in ${result.durationMs}ms (fallback used: ${result.fallbackUsed})`);

    return NextResponse.json({
      success: true,
      resultUrl: result.resultUrl,
      provider: result.provider,
      durationMs: result.durationMs,
    });

  } catch (error: any) {
    console.error('[API TRY-ON] Route-level failure:', error?.message || error);
    console.error('[API TRY-ON] Stack:', error?.stack);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error during try-on processing.' },
      { status: 500 }
    );
  }
}
