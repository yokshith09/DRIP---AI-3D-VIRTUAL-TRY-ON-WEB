import { NextResponse } from 'next/server';
import { retrieveProducts } from '@/lib/rag';

export async function POST(req: Request) {
  try {
    const { messages, styleDNA } = await req.json();

    // Extract the latest query from user messages to fetch relevant items
    const userMessages = messages.filter((m: any) => m.sender === 'user' || m.role === 'user');
    const lastUserMessage = userMessages[userMessages.length - 1];
    const query = lastUserMessage ? (lastUserMessage.text || lastUserMessage.content || '') : '';

    // Retrieve top products based on search query keywords and Style DNA matching (RAG)
    const retrievedProducts = retrieveProducts(query, styleDNA || {}, 8);

    // Standardize catalog metadata for LLM context efficiency
    const compactCatalog = retrievedProducts.map((p) => ({
      id: p.id,
      name: p.name,
      brand: p.brand,
      category: p.category,
      subcategory: p.subcategory,
      price: p.price,
      priceNumber: p.priceNumber,
      fit: p.fit,
      material: p.material,
      tags: p.tags,
      bodyShapeSuitable: p.bodyShapeSuitable,
      skinToneSuitable: p.skinToneSuitable,
    }));

    // Inject StyleDNA context if provided
    let styleDNAContext = 'No Style DNA profile available yet. Guide the user to take the style DNA test in the Profile page or offer to help them find their style.';
    if (styleDNA && styleDNA.completedOnboarding) {
      styleDNAContext = `User Style DNA Profile:
- Body Shape: ${styleDNA.bodyShape || 'Not analyzed'}
- Height: ${styleDNA.height ? `${styleDNA.height} cm` : 'Not specified'}
- Fit Preference: ${styleDNA.fitPreference || 'Regular'}
- Skin Tone: ${styleDNA.skinTone || 'Not analyzed'} (Category: ${styleDNA.skinToneCategory || 'Neutral'})
- Recommended Palette: ${styleDNA.colorPalette ? styleDNA.colorPalette.join(', ') : 'Not specified'}
- Avoid Colors: ${styleDNA.avoidColors ? styleDNA.avoidColors.join(', ') : 'None'}
- Style Vibe: ${styleDNA.styleVibe || 'Minimalist'}
- Preferred Occasions: ${styleDNA.occasions ? styleDNA.occasions.join(', ') : 'Casual'}
- Budget Range: ₹${styleDNA.budgetRange ? styleDNA.budgetRange[0] : 1000} - ₹${styleDNA.budgetRange ? styleDNA.budgetRange[1] : 15000}
- Liked Products: ${styleDNA.likedProducts ? styleDNA.likedProducts.join(', ') : 'None'}
- Disliked Products: ${styleDNA.dislikedProducts ? styleDNA.dislikedProducts.join(', ') : 'None'}

CRITICAL: Suggest products that match their body shape (${styleDNA.bodyShape || 'standard'}), style vibe, and color palette.`;
    }

    const SYSTEM_INSTRUCTION = `You are a sophisticated, professional AI fashion stylist and consultant for "DRIP", a premium digital fashion destination.
Your tone is confident, editorial, knowledgeable, slightly avant-garde, and friendly. You provide expert-level fashion consultations.

Here is the DRIP Curated Catalog (retrieved dynamically based on user query):
${JSON.stringify(compactCatalog, null, 2)}

Here is the current shopper's profile:
${styleDNAContext}

Guidelines for interaction:
1. Recommend actual products from the provided DRIP Curated Catalog. Always reference them by name and brand.
2. Provide concrete styling advice (e.g. "Pair this Oxford Cotton Shirt with Chinos and Chelsea boots for an effortless smart-casual look").
3. IMPORTANT: When you suggest/recommend products, you MUST append a recommendation token at the end of your advice or paragraph in this format: [RECOMMEND: id1, id2] where "id1", "id2" are the exact product IDs from the catalog (e.g. [RECOMMEND: bh-buck-bk, bh-pexo-gr]). This token is consumed by the UI to render interactive product cards. Do not make up IDs; only use real IDs from the catalog.
4. Keep your responses concise, visually structured (using markdown headers, bold text, bullet points), and highly fashion-forward.
5. If the user asks about virtual try-on, encourage them to click the "Try-On" button on any product details page or click the AI Fitting Room icon.
6. Speak in Indian context where appropriate (pricing in rupees, occasions like weddings, festivals, office-wear).`;

    // Strategy 1: Try Groq API if key is present
    const groqKey = process.env.GROQ_API_KEY;
    const groqModel = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

    let groqStream: ReadableStream | null = null;
    if (groqKey && !groqKey.includes('your_')) {
      try {
        const groqMessages = [
          { role: 'system', content: SYSTEM_INSTRUCTION },
          ...messages.map((m: any) => ({
            role: m.sender === 'user' || m.role === 'user' ? 'user' : 'assistant',
            content: m.text || m.content || '',
          }))
        ];

        const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${groqKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: groqModel,
            messages: groqMessages,
            stream: true,
          }),
        });

        if (groqRes.ok && groqRes.body) {
          groqStream = groqRes.body;
        } else {
          const errText = await groqRes.text();
          console.warn('[AI CHAT] Groq API returned non-200, falling back to Gemini:', errText);
        }
      } catch (err: any) {
        console.warn('[AI CHAT] Groq request failed, attempting fallback:', err.message);
      }
    }

    // If Groq streaming succeeded, return Groq SSE stream
    if (groqStream) {
      const stream = new ReadableStream({
        async start(controller) {
          const encoder = new TextEncoder();
          const reader = groqStream!.getReader();
          const decoder = new TextDecoder();
          let buffer = '';

          try {
            while (true) {
              const { value, done } = await reader.read();
              if (done) break;

              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split('\n');
              buffer = lines.pop() || '';

              for (const line of lines) {
                const trimmedLine = line.trim();
                if (trimmedLine.startsWith('data: ')) {
                  const dataStr = trimmedLine.slice(6).trim();
                  if (dataStr === '[DONE]') continue;
                  
                  try {
                    const parsed = JSON.parse(dataStr);
                    const deltaText = parsed.choices?.[0]?.delta?.content || '';
                    if (deltaText) {
                      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: deltaText })}\n\n`));
                    }
                  } catch (e) {
                    // Partial JSON chunk
                  }
                }
              }
            }
          } catch (e: any) {
            console.error('Groq Stream parsing error:', e);
          } finally {
            controller.close();
          }
        },
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

    // Strategy 2: Fallback to Google Gemini (High Performance & Always Active)
    const geminiKey = process.env.GOOGLE_AI_KEY;
    const geminiModel = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    if (geminiKey) {
      try {
        console.log(`[AI CHAT] Streaming consultation via Google Gemini (${geminiModel})...`);
        
        // Format conversation history for Gemini
        const geminiContents = messages.map((m: any) => ({
          role: m.sender === 'user' || m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.text || m.content || '' }]
        }));

        if (geminiContents.length === 0 || geminiContents[geminiContents.length - 1].role !== 'user') {
          geminiContents.push({ role: 'user', parts: [{ text: query || 'Hi' }] });
        }

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:streamGenerateContent?alt=sse&key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
              contents: geminiContents,
            }),
          }
        );

        if (geminiRes.ok && geminiRes.body) {
          const stream = new ReadableStream({
            async start(controller) {
              const encoder = new TextEncoder();
              const reader = geminiRes.body!.getReader();
              const decoder = new TextDecoder();
              let buffer = '';

              try {
                while (true) {
                  const { value, done } = await reader.read();
                  if (done) break;

                  buffer += decoder.decode(value, { stream: true });
                  const lines = buffer.split('\n');
                  buffer = lines.pop() || '';

                  for (const line of lines) {
                    const trimmedLine = line.trim();
                    if (trimmedLine.startsWith('data: ')) {
                      const dataStr = trimmedLine.slice(6).trim();
                      try {
                        const parsed = JSON.parse(dataStr);
                        const deltaText = parsed.candidates?.[0]?.content?.parts?.[0]?.text || '';
                        if (deltaText) {
                          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: deltaText })}\n\n`));
                        }
                      } catch (e) {
                        // Partial JSON chunk
                      }
                    }
                  }
                }
              } catch (e: any) {
                console.error('Gemini Stream parsing error:', e);
              } finally {
                controller.close();
              }
            },
          });

          return new Response(stream, {
            headers: {
              'Content-Type': 'text/event-stream',
              'Cache-Control': 'no-cache',
              'Connection': 'keep-alive',
            },
          });
        }
      } catch (geminiErr: any) {
        console.warn('[AI CHAT] Gemini stream failed, using heuristic stylist:', geminiErr.message);
      }
    }

    // Strategy 3: Zero-Failure Intelligent Fashion Stylist Simulation
    console.log('[AI CHAT] Running on-device Intelligent Stylist Engine...');
    const recommendedIds = retrievedProducts.slice(0, 3).map((p) => p.id).join(', ');
    const topItem = retrievedProducts[0];

    const fallbackResponse = `Welcome to **DRIP Atelier**! ✨

Based on your personal Style DNA and preferences, here are the top curated pieces designed to elevate your silhouette:

- **${topItem?.brand || 'DRIP'} - ${topItem?.name || 'Signature Piece'}**: Engineered with premium fabric for an effortless modern drape.
${retrievedProducts[1] ? `- **${retrievedProducts[1].brand} - ${retrievedProducts[1].name}**: Pairs seamlessly with your curated style vibe.` : ''}

You can virtually try on any of these pieces in our **AI Fitting Room** or explore the complete collection below!

[RECOMMEND: ${recommendedIds}]`;

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        const words = fallbackResponse.split(' ');
        for (const word of words) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: word + ' ' })}\n\n`));
          await new Promise((r) => setTimeout(r, 25));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error: any) {
    console.error('AI Stylist General Error:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong while connecting to the AI service' },
      { status: 500 }
    );
  }
}
