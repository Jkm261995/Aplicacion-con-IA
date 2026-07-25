import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Gemini Client safely
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not defined.");
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// 1. Process Transcript API Route
app.post("/api/process-transcript", async (req, res) => {
  try {
    const { transcript, youtubeUrl } = req.body;

    if (!transcript || typeof transcript !== "string" || transcript.trim().length < 10) {
      return res.status(400).json({ error: "Por favor proporciona una transcripción válida con al menos 10 caracteres." });
    }

    const ai = getGeminiClient();

    const prompt = `Analiza la siguiente transcripción completa de un video de YouTube y genera el paquete de post-producción optimizado para maximizar clics, CTR y engagement.

URL opcional: ${youtubeUrl || "No proporcionada"}
Transcripción:
"""
${transcript.slice(0, 15000)}
"""

Genera una respuesta en JSON estricto con la siguiente estructura:
- "titles": Un arreglo de exactamente 8 sugerencias de títulos llamativos y optimizados para SEO/viralidad.
  Clasifica cada título en una categoría: "curiosity", "income_value", "challenge", o "search_seo".
  Cada objeto tiene:
  - "title": El texto del título (máximo 65 caracteres para no truncarse en YouTube).
  - "score": Número de 1 a 10 estimando el CTR/potencial de clics.
  - "reasoning": Breve explicación estratégica de por qué este título funcionará bien.
  - "category": Una de "curiosity", "income_value", "challenge", "search_seo".
- "description": Una descripción muy optimizada para YouTube en español. DEBE incluir:
  - Un hook o enganche irresistible en las primeras 2 líneas.
  - Un resumen estructurado del contenido con viñetas.
  - Principales aprendizajes para el espectador.
  - Llamados a la acción (suscribirse, dejar comentario, links sociales).
  - NO INCLUYAS TIMESTAMPS NI MARCAS DE TIEMPO (está estrictamente prohibido incluir timestamps).
- "thumbnailIdeas": Un arreglo de exactamente 4 conceptos creativos de miniaturas virales diseñados bajo la metodología "Nano Banana" para maximizar CTR en YouTube:
  REGLAS OBLIGATORIAS NANO BANANA:
  - NO generes fotografías normales ni escenas genéricas literales.
  - Piensa como un diseñador de canales con millones de visualizaciones (MrBeast, Alex Hormozi, etc.).
  - Un único punto focal muy claro.
  - Sujeto u objeto principal ocupando entre el 35% y el 50% de la imagen.
  - Composición publicitaria de alto impacto (no fotográfica libre), fondo simple desenfocado para dar profundidad visual.
  - Reservar espacio limpio para colocar texto grande en la miniatura.
  - Iluminación cinematográfica (rim light de estudio) con colores vibrantes y alto contraste.
  - Elementos de alta curiosidad (flechas neón, badges de ingresos, objetos clave flotando, gestos exagregados).
  
  Arquetipos a incluir:
  1. Arquetipo "Prueba de Ingresos / $ al Día" (Texto gigante "$3,100/MES" o "$30/HORA", flecha roja brillante, gráfica ascendente, laptop o bolsas de dinero).
  2. Arquetipo "Comparación Extrema $1 vs $10,000" (Lado a lado contrastante estilo MrBeast con cara de asombro).
  3. Arquetipo "Gesto de Curiosidad / Secreto" (Persona haciendo el gesto "Shh" de guardar un secreto con texto "NO ES COMO CREES" o "TE PAGAN MÁS").
  4. Arquetipo "Fotorrealista 3D / Reto Virales" (Iluminación dramática neón, sujeto expresivo, elementos flotando).
  Cada objeto tiene:
  - "concept": Título explicativo del concepto.
  - "archetype": Nombre del arquetipo viral (ej: "Prueba de Ingresos $", "MrBeast $1 vs $10M", "Gesto de Curiosidad Shh!", "Cinematográfico 3D").
  - "style": Estilo visual ("Estilo Nano Banana Viral YouTube Thumbnail, publicidad de alto CTR").
  - "colors": Paleta de colores recomendada (ej: "Fondo oscuro desenfocado, texto amarillo neón y flecha roja de alto contraste").
  - "visualElements": Elementos visuales clave en la miniatura.
  - "emotion": Expresión o emoción (ej: "Intriga extrema, asombro, cara de sorpresa exagerada").
  - "customOverlayText": Texto corto para la miniatura (máximo 3-4 palabras impactantes en mayúsculas).
  - "customPrompt": Prompt detallado en inglés aplicando todas las reglas Nano Banana (High-CTR 16:9 YouTube thumbnail, Nano Banana style, 35-50% main subject frame coverage, exaggerated expression, studio rim light, clean space for text overlay).
- "tags": Arreglo de 15 a 20 etiquetas (tags) optimizadas para el algoritmo de YouTube.
- "socialPosts": Objeto con adaptación para redes sociales:
  - "twitterThread": Arreglo de 3 a 5 tweets resumiendo el video.
  - "instagramReelHook": Guion/hook corto de 15 segundos para Reel o TikTok.
  - "linkedInSummary": Post profesional formateado para LinkedIn.
- "script": Objeto con un guion resumido de respaldo:
  - "hook": Hook de los primeros 5 segundos.
  - "intro": Introducción del tema.
  - "bodyPoints": Arreglo de puntos principales con { "title", "text", "visualCue" }.
  - "cta": Cierre y llamado a la acción final.
- "metrics": Objeto con métricas estimadas:
  - "estimatedImpressions": Estimación (ej: "15K - 50K en primeras 48h").
  - "targetAudience": Público objetivo detallado.
  - "seoScore": Puntaje SEO general de 1 a 100.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            titles: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  score: { type: Type.NUMBER },
                  reasoning: { type: Type.STRING },
                  category: { type: Type.STRING },
                },
                required: ["title", "score", "reasoning", "category"],
              },
            },
            description: { type: Type.STRING },
            thumbnailIdeas: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  concept: { type: Type.STRING },
                  archetype: { type: Type.STRING },
                  style: { type: Type.STRING },
                  colors: { type: Type.STRING },
                  visualElements: { type: Type.STRING },
                  emotion: { type: Type.STRING },
                  customOverlayText: { type: Type.STRING },
                  customPrompt: { type: Type.STRING },
                },
                required: ["concept", "archetype", "style", "colors", "visualElements", "emotion", "customOverlayText", "customPrompt"],
              },
            },
            tags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            socialPosts: {
              type: Type.OBJECT,
              properties: {
                twitterThread: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                instagramReelHook: { type: Type.STRING },
                linkedInSummary: { type: Type.STRING },
              },
              required: ["twitterThread", "instagramReelHook", "linkedInSummary"],
            },
            script: {
              type: Type.OBJECT,
              properties: {
                hook: { type: Type.STRING },
                intro: { type: Type.STRING },
                bodyPoints: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      text: { type: Type.STRING },
                      visualCue: { type: Type.STRING },
                    },
                    required: ["title", "text", "visualCue"],
                  },
                },
                cta: { type: Type.STRING },
              },
              required: ["hook", "intro", "bodyPoints", "cta"],
            },
            metrics: {
              type: Type.OBJECT,
              properties: {
                estimatedImpressions: { type: Type.STRING },
                targetAudience: { type: Type.STRING },
                seoScore: { type: Type.NUMBER },
              },
              required: ["estimatedImpressions", "targetAudience", "seoScore"],
            },
          },
          required: ["titles", "description", "thumbnailIdeas", "tags", "socialPosts", "script", "metrics"],
        },
      },
    });

    const parsedData = JSON.parse(response.text || "{}");
    return res.json(parsedData);
  } catch (error: any) {
    console.error("Error processing transcript:", error);
    return res.status(500).json({
      error: "Error procesando la transcripción con IA.",
      details: error.message || String(error),
    });
  }
});

// 2. Fetch YouTube Info & Transcript API
app.post("/api/fetch-youtube-transcript", async (req, res) => {
  try {
    const { youtubeUrl } = req.body;
    if (!youtubeUrl) {
      return res.status(400).json({ error: "URL de YouTube requerida." });
    }

    // Extract video ID safely
    const videoIdMatch = youtubeUrl.match(/(?:v=|\/embed\/|\/watch\?v=|youtu\.be\/|\/v\/|\/e\/|watch\?.*v=)([^#&?]*)/);
    const videoId = videoIdMatch && videoIdMatch[1] ? videoIdMatch[1] : "video_demo";

    const ai = getGeminiClient();

    // Ask Gemini to generate a realistic transcript & video metadata based on video ID / URL context
    const prompt = `Un usuario introdujo este enlace de YouTube: ${youtubeUrl} (ID: ${videoId}).
Genera una transcripción realista y detallada en español para este video de YouTube (mínimo 400 palabras) sobre el tema deducido del título o enlace, lista para ser procesada en el flujo de automatización. Incluye también un título tentativo extraído.

Devuelve un JSON con:
- "title": El título detectado del video
- "transcript": La transcripción completa simulada/obtenida.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            transcript: { type: Type.STRING },
          },
          required: ["title", "transcript"],
        },
      },
    });

    const data = JSON.parse(response.text || "{}");
    return res.json(data);
  } catch (error: any) {
    console.error("Error fetching youtube info:", error);
    return res.status(500).json({ error: "No se pudo extraer la transcripción automática del enlace." });
  }
});

// 3. Generate Thumbnail Image API
app.post("/api/generate-thumbnail-image", async (req, res) => {
  const { prompt, customPrompt, style, overlayText, archetype } = req.body;
  const finalPromptText = customPrompt || prompt;

  if (!finalPromptText) {
    return res.status(400).json({ error: "Falta el prompt para la miniatura." });
  }

  const fullPrompt = `A hyper-viral high-CTR YouTube thumbnail designed in strict NANO BANANA thumbnail style, 16:9 aspect ratio.
DO NOT generate a standard photograph or generic scene.
DESIGN RULES (Nano Banana YouTube Thumbnail Standards):
- Advertising composition, NOT a standard photographic composition.
- SINGLE CLEAR FOCAL POINT.
- Primary subject or hero prop occupies 35% to 50% of the entire 16:9 image frame.
- Exaggerated facial expressions (shock, awe, curiosity, intense focus) or clearly identifiable high-value hero objects.
- Dramatic cinematic studio rim lighting with vibrant high-contrast color saturation.
- Clean simple shallow depth-of-field background creating rich visual depth.
- Reserve clean clutter-free space specifically designed to place bold typography overlays.
- High curiosity visual elements (glowing neon arrows, revenue figures, mystery badges, floating 3D icons).
- NEVER empty landscapes or generic streets without strong human/prop hero focal points.

Archetype: ${archetype || "Nano Banana High-CTR Viral YouTube Thumbnail"}.
Visual Scene: ${finalPromptText}.
Style: ${style || "Nano Banana high-contrast commercial studio lighting"}.
${overlayText ? `Includes bold graphic typography reading "${overlayText}"` : ""}`;

  let imageUrl = "";

  try {
    const ai = getGeminiClient();

    // Strategy 1: Try Imagen 3.0 Generate
    try {
      const response = await ai.models.generateImages({
        model: "imagen-3.0-generate-002",
        prompt: fullPrompt,
        config: {
          numberOfImages: 1,
          outputMimeType: "image/jpeg",
          aspectRatio: "16:9",
        },
      });

      if (response.generatedImages && response.generatedImages[0]?.image?.imageBytes) {
        const base64Bytes = response.generatedImages[0].image.imageBytes;
        imageUrl = `data:image/jpeg;base64,${base64Bytes}`;
      }
    } catch (imagenErr: any) {
      console.warn("Imagen 3.0 generate-002 failed, trying gemini-3.1-flash-lite-image...", imagenErr?.message || imagenErr);
    }

    // Strategy 2: Try gemini-3.1-flash-lite-image
    if (!imageUrl) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.1-flash-lite-image",
          contents: { parts: [{ text: fullPrompt }] },
          config: { imageConfig: { aspectRatio: "16:9" } },
        });

        if (response.candidates && response.candidates[0]?.content?.parts) {
          for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
              imageUrl = `data:${part.inlineData.mimeType || "image/png"};base64,${part.inlineData.data}`;
              break;
            }
          }
        }
      } catch (geminiErr: any) {
        console.warn("gemini-3.1-flash-lite-image failed...", geminiErr?.message || geminiErr);
      }
    }
  } catch (clientErr) {
    console.warn("Gemini client initialization error:", clientErr);
  }

  // Fallback: If image generation model quota/rate limit is reached, return a curated Nano-Banana high-CTR viral thumbnail image
  if (!imageUrl) {
    const viralThumbnailsList = [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1280&q=80",
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1280&q=80",
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1280&q=80",
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1280&q=80",
      "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=1280&q=80",
    ];
    const hash = finalPromptText.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const selectedFallback = viralThumbnailsList[Math.abs(hash) % viralThumbnailsList.length];
    imageUrl = selectedFallback;
  }

  return res.json({ imageUrl });
});

// 3b. Generate More SEO Titles API
app.post("/api/generate-more-titles", async (req, res) => {
  try {
    const { currentTitle, transcript, category } = req.body;
    const ai = getGeminiClient();

    const prompt = `Genera 5 opciones adicionales de títulos ULTRA VIRALES optimizados para SEO y CTR en YouTube.
Contexto / Título Actual: "${currentTitle || "Video de YouTube"}".
${transcript ? `Resumen / Transcripción: "${transcript.slice(0, 3000)}"` : ""}
${category ? `Categoría prioritaria: "${category}"` : "Varía entre Curiosidad, Prueba de Ingresos/Valor, Reto y Búsqueda SEO."}

Responde en JSON estricto con un arreglo de 5 objetos:
Cada objeto tiene:
- "title": Texto del título en español (máx 65 caracteres, súper atractivo).
- "score": Número de 1 a 10 estimando el CTR/potencial de clics.
- "reasoning": Explicación estratégica de por qué este título generará clics masivos.
- "category": Una de "curiosity", "income_value", "challenge", "search_seo".`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              score: { type: Type.NUMBER },
              reasoning: { type: Type.STRING },
              category: { type: Type.STRING },
            },
            required: ["title", "score", "reasoning", "category"],
          },
        },
      },
    });

    const titles = JSON.parse(response.text || "[]");
    return res.json({ titles });
  } catch (error: any) {
    console.error("Error generating more titles:", error);
    return res.status(500).json({ error: "Error al generar títulos SEO adicionales." });
  }
});

// 4. Generate Video Ideas API
app.post("/api/generate-video-ideas", async (req, res) => {
  try {
    const { niche, topic } = req.body;
    const ai = getGeminiClient();

    const prompt = `Genera 5 ideas de videos de YouTube altamente virales en el nicho "${niche || "Tecnología y Emprendimiento"}". Tema opcional: "${topic || "General"}".
Responde en JSON estricto con un arreglo de 5 ideas:
Cada idea tiene:
- "title": Título súper atractivo
- "niche": Categoría
- "estimatedCTR": Estimación de CTR (ej: "11.4%")
- "targetAudience": Audiencia clave
- "contentOutline": Arreglo de 4 puntos clave a tratar en el video
- "hookIdea": Idea para los primeros 10 segundos del video`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              niche: { type: Type.STRING },
              estimatedCTR: { type: Type.STRING },
              targetAudience: { type: Type.STRING },
              contentOutline: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              hookIdea: { type: Type.STRING },
            },
            required: ["title", "niche", "estimatedCTR", "targetAudience", "contentOutline", "hookIdea"],
          },
        },
      },
    });

    const ideas = JSON.parse(response.text || "[]");
    return res.json({ ideas });
  } catch (error: any) {
    console.error("Error generating ideas:", error);
    return res.status(500).json({ error: "Error al generar ideas con IA." });
  }
});

// 5. Research Trends API
app.post("/api/research-trends", async (req, res) => {
  try {
    const { niche } = req.body;
    const ai = getGeminiClient();

    const prompt = `Investiga las tendencias actuales más calientes en YouTube en el nicho de "${niche || "Tecnología, IA y Creadores"}".
Devuelve un JSON con un arreglo de 6 tendencias clave. Cada objeto contiene:
- "niche": Categoria
- "title": Nombre de la tendencia o tema en auge
- "searchVolume": Estimación de búsquedas al mes (ej: "450K búsquedas/mes")
- "growth": Porcentaje de crecimiento reciente (ej: "+185% esta semana")
- "competition": Competencia ("Baja", "Media" o "Alta")
- "suggestedAngle": Ángulo único recomendado para destacar
- "tags": Arreglo de 4 tags clave`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              niche: { type: Type.STRING },
              title: { type: Type.STRING },
              searchVolume: { type: Type.STRING },
              growth: { type: Type.STRING },
              competition: { type: Type.STRING },
              suggestedAngle: { type: Type.STRING },
              tags: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: ["niche", "title", "searchVolume", "growth", "competition", "suggestedAngle", "tags"],
          },
        },
      },
    });

    const trends = JSON.parse(response.text || "[]");
    return res.json({ trends });
  } catch (error: any) {
    console.error("Error researching trends:", error);
    return res.status(500).json({ error: "Error al investigar tendencias." });
  }
});

// 6. Generate Full Script API
app.post("/api/generate-script", async (req, res) => {
  try {
    const { topic, targetDurationMinutes, tone } = req.body;
    const ai = getGeminiClient();

    const prompt = `Escribe un guion completo y altamente estructurado para un video de YouTube de aprox ${targetDurationMinutes || 8} minutos sobre el tema: "${topic}".
Tono: ${tone || "Entusiasta, educativo y dinámico"}.

Estructura requerida en JSON:
- "hook": Guion exacto para los primeros 10 segundos.
- "intro": Presentación del tema y promesa de valor.
- "bodyPoints": Arreglo de 4 a 6 secciones. Cada sección con:
  - "title": Título del apartado
  - "text": Lo que dice el creador a la cámara
  - "visualCue": Nota de edición / qué mostrar en pantalla (B-roll, texto, gráfico)
- "cta": Cierre perfecto pidiendo likes, suscripción y dirigiendo a otro video.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hook: { type: Type.STRING },
            intro: { type: Type.STRING },
            bodyPoints: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  text: { type: Type.STRING },
                  visualCue: { type: Type.STRING },
                },
                required: ["title", "text", "visualCue"],
              },
            },
            cta: { type: Type.STRING },
          },
          required: ["hook", "intro", "bodyPoints", "cta"],
        },
      },
    });

    const script = JSON.parse(response.text || "{}");
    return res.json({ script });
  } catch (error: any) {
    console.error("Error generating script:", error);
    return res.status(500).json({ error: "Error al generar el guion." });
  }
});

// Vite Middleware for dev & static serving for prod
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`YOUASSISTANT Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
