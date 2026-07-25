import { ProcessedVideo, ChannelAnalytics, TrendTopic, VideoIdea } from '../types';

export const INITIAL_PROCESSED_VIDEOS: ProcessedVideo[] = [
  {
    id: 'vid-001',
    title: 'Creé un Canal de YouTube Automatizado con IA en 24 Horas (Resultados)',
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    status: 'published',
    scheduledDate: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    rawTranscript: `En este video probé crear un canal completo de YouTube utilizando únicamente herramientas de inteligencia artificial durante 24 horas. Desde la generación del nicho, el guion, la voz en off sintetizada, la edición automatizada de video y las miniaturas diseñadas con IA. El objetivo era verificar si un canal 100% automatizado puede generar reproducciones reales y retención de audiencia sin intervención humana continua. Analizamos las estadísticas de las primeras 48 horas, las impresiones en el feed de recomendaciones de YouTube, la tasa de clics (CTR) y el porcentaje medio reproducido. Finalmente, te muestro paso a paso el flujo exacto de trabajo que puedes replicar hoy mismo para ahorrar más de 15 horas de edición semanal.`,
    selectedTitleIndex: 0,
    titles: [
      {
        title: 'Creé un Canal de YouTube 100% con IA en 24 Horas (Ganó Esto)',
        score: 9.8,
        reasoning: 'Excelente curiosidad con marco temporal desafiante ("24 Horas") y promesa implícita de resultados monetarios ("Ganó Esto").',
      },
      {
        title: 'Probé la Automatización de YouTube con IA por 24 Horas (¿Funciona?)',
        score: 9.1,
        reasoning: 'Formato de experimento directo que genera alta identificación en creadores que buscan reducir horas de trabajo.',
      },
      {
        title: 'Cómo Crear un Canal de YouTube Automatizado con Inteligencia Artificial',
        score: 8.4,
        reasoning: 'Título altamente optimizado para búsquedas orgánicas SEO (Evergreen content).',
      },
      {
        title: 'No Grabes Más Videos: El Sistema de IA que Edita y Publica por Ti',
        score: 8.9,
        reasoning: 'Hook contundente que ataca el punto de dolor principal del creador (el agotamiento al grabar y editar).',
      },
      {
        title: 'El Futuro de YouTube: Automatización Total con IA Paso a Paso',
        score: 7.9,
        reasoning: 'Buena llamada estratégica sobre tendencias tecnológicas y visión de futuro.',
      },
    ],
    description: `🚀 En este video pongo a prueba la automatización total de YouTube utilizando IA durante 24 horas seguidas. Descubre si realmente un canal creado con inteligencia artificial puede posicionarse en el algoritmo y generar vistas reales.

📌 QUÉ APRENDERÁS EN ESTE VIDEO:
• Cómo seleccionar un nicho rentable utilizando inteligencia artificial.
• Flujo de trabajo automatizado para generar guiones y narración de alta calidad.
• Creación de miniaturas optimizadas para obtener un CTR superior al 10%.
• Análisis real de las métricas obtenidas en las primeras 48 horas de publicación.
• Recomendaciones clave para evitar penalizaciones en el algoritmo de YouTube.

💡 RECURSOS Y HERRAMIENTAS MENCIONADAS:
• YOUASSISTANT: Automatización de post-producción y SEO para YouTube.
• Registro para la prueba gratuita de la plataforma.

🔔 ¡Suscríbete al canal para no perderte los próximos experimentos con IA y estrategias de crecimiento en YouTube! Deja un comentario con tu duda sobre la automatización.

#YouTubeIA #AutomatizacionYouTube #CreadoresDeContenido #InteligenciaArtificial #SEOYouTube`,
    tags: [
      'youtube ia',
      'automatizacion youtube',
      'crear canal con ia',
      'miniaturas ia',
      'seo youtube 2026',
      'guion youtube ia',
      'ctr youtube',
      'como crecer en youtube',
      'creadores de contenido',
      'ia para youtube',
      'youtube studio',
      'productividad creador',
      'youassistant',
      'algoritmo youtube',
      'monetizar youtube',
    ],
    selectedThumbnailIndex: 0,
    thumbnailIdeas: [
      {
        id: 'thumb-1',
        concept: 'Robot Futurista vs Reloj de 24 Horas',
        archetype: 'Prueba de Ingresos & Automatización $',
        style: 'Estilo Nano Banana Viral YouTube Thumbnail, publicidad de alto CTR',
        colors: 'Azul neón, Púrpura eléctrico, Amarillo brillante',
        visualElements: 'Cerebro o robot holográfico a la derecha trabajando en una laptop; panel de YouTube con 100K vistas a la izquierda; cronómetro regresivo de 24 horas flotando en medio.',
        emotion: 'Urgencia, asombro tecnológico y alta expectativa.',
        customOverlayText: 'EN 24 HORAS: 100% IA',
        customPrompt: 'Nano Banana high-CTR 16:9 YouTube thumbnail, advertising visual composition. Cybernetic futuristic robot occupying 40% of the image frame working at a glowing laptop with $3,100 earnings badge, dark blurred background with cyan rim light, clean space for text.',
        generatedImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1280&q=80',
      },
      {
        id: 'thumb-2',
        concept: 'Cara de Creador Sorprendido con Gráfica Explosiva',
        archetype: 'Gesto de Curiosidad / Expresión Virales',
        style: 'Estilo Nano Banana Viral YouTube Thumbnail, publicidad de alto CTR',
        colors: 'Verde dólar, Rojo aviso, Blanco alto contraste',
        visualElements: 'Foto en primer plano con boca abierta apuntando a una curva verde apuntando hacia arriba; logo de YouTube y chip de IA.',
        emotion: 'Impacto directo e incredulidad exagerada.',
        customOverlayText: '¡0 HORAS DE EDICIÓN!',
        customPrompt: 'Nano Banana high-CTR thumbnail, advertising composition. Close-up portrait of creator with shocked exaggerated face occupying 45% of 16:9 frame pointing at rising chart, dark studio rim light, clean space reserved for text overlay.',
        generatedImageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1280&q=80',
      },
      {
        id: 'thumb-3',
        concept: 'División Antes vs Después de la IA',
        archetype: 'Comparación Extrema $1 vs $10M',
        style: 'Diseño en pantalla dividida mitad oscura (cansancio) vs mitad brillante (automatización)',
        colors: 'Gris oscuro cansado vs Dorado brillante reluciente',
        visualElements: 'Lado izquierdo: escritorio desordenado con taza de café fría y reloj a las 3 AM. Lado derecho: panel limpio con botón dorado de YouTube y robot trabajando.',
        emotion: 'Contraste de alivio y deseo de transformación.',
        customOverlayText: 'ANTES vs DESPUÉS',
        customPrompt: 'Nano Banana split-screen 16:9 thumbnail, left side dark tired desk, right side glowing golden success desk with creator occupying 40% center frame, high contrast advertising rim lighting, clean space for text overlay.',
        generatedImageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1280&q=80',
      },
    ],
    socialPosts: {
      twitterThread: [
        '🧵 ¿Se puede automatizar un canal de YouTube al 100% con Inteligencia Artificial? Puse a prueba este experimento durante 24 horas seguidas. Aquí están los resultados reales 👇',
        '1/5 Primero elegí un nicho de alto RPM usando modelos de lenguaje para analizar volumen de búsqueda y competencia sin saturar.',
        '2/5 Luego usé YOUASSISTANT para generar títulos con score de CTR > 9.0, descripción optimizada sin perder tiempo en formatear y etiquetas SEO.',
        '3/5 La miniatura fue generada con IA fotorrealista en formato 16:9 con overlays de texto de alto contraste.',
        '4/5 Resultado en 48h: +14,200 reproducciones orgánicas y un CTR del 11.2%. El algoritmo recomienda videos bien estructurados independientemente del método.',
        '5/5 Mira el desglose completo del proceso y copia la plantilla aquí: https://youtube.com',
      ],
      instagramReelHook: 'Dejé de editar mis videos manualmente y esto fue lo que pasó cuando la Inteligencia Artificial tomó el control total de mi canal de YouTube durante 24 horas...',
      linkedInSummary: 'La automatización de contenidos en YouTube ya no es una hipótesis de futuro: es una realidad operativa hoy. En este análisis destilo los aprendizajes de gestionar un flujo de trabajo 100% asistido por IA para producción de video, optimización SEO y diseño de miniaturas.',
    },
    script: {
      hook: '¿Qué pasaría si pudieras publicar videos en YouTube todas las semanas sin pasar una sola hora editando o escribiendo guiones?',
      intro: 'En las últimas 24 horas dejé que la Inteligencia Artificial se encargara de todo el proceso de producción de mi canal. Bienvenidos a YOUASSISTANT.',
      bodyPoints: [
        {
          title: 'Paso 1: Análisis de Transcripción y Generación de Títulos',
          text: 'La clave de un video viral reside en la promesa inicial del título. Analizamos cómo el score CTR evalúa la curiosidad del usuario.',
          visualCue: 'Mostrar captura de pantalla interactiva del dashboard analizando la transcripción en tiempo real.',
        },
        {
          title: 'Paso 2: Miniaturas con IA de Alto Impacto',
          text: 'No necesitas photoshop complejo. Las miniaturas generadas con prompts de composición capturan la atención inmediatamente.',
          visualCue: 'Zoom in a los 3 conceptos de miniaturas con cambio de texto en overlay.',
        },
        {
          title: 'Paso 3: Posicionamiento SEO y Etiquetas',
          text: 'Las etiquetas e intenciones de búsqueda le enseñan al algoritmo exactamente a quién recomendarle tu contenido.',
          visualCue: 'Gráfico animado con curva de impresiones subiendo en YouTube Analytics.',
        },
      ],
      cta: 'Si tú también quieres ahorrar más de 15 horas a la semana en tu canal, prueba YOUASSISTANT gratis en el enlace de la descripción. ¡Suscríbete para más experimentos!',
    },
    metrics: {
      estimatedImpressions: '25K - 75K en 48h',
      targetAudience: 'Creadores de contenido, Youtubers, Editores de video y Emprendedores digitales.',
      seoScore: 96,
    },
  },
  {
    id: 'vid-002',
    title: 'Las 5 Herramientas de IA Indispensables para Creadores en 24',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    status: 'scheduled',
    scheduledDate: new Date(Date.now() + 3600000 * 36).toISOString(),
    youtubeUrl: 'https://www.youtube.com/watch?v=demo2',
    rawTranscript: `Hola a todos, en este video les voy a compartir el top 5 de herramientas de inteligencia artificial que cambiaron por completo mi forma de crear contenido en internet. Analizaremos herramientas para edición automatizada de audio, generación de B-roll instantáneo, optimización de palabras clave para YouTube Studio y sintetizadores de voz fotorrealistas. Si quieres escalar la producción de tus videos sin contratar un equipo gigante, quédate hasta el final.`,
    selectedTitleIndex: 0,
    titles: [
      {
        title: '5 Herramientas de IA que Cambiarán tu Canal de YouTube en 2026',
        score: 9.5,
        reasoning: 'Formato de lista "Top 5" altamente probado en YouTube con disparador de novedad y año actualizado.',
      },
      {
        title: 'Usa Estas 5 IAs Antes de que sea Tarde para tu Canal',
        score: 9.0,
        reasoning: 'Ganchos con sesgo de aversión a la pérdida y urgencia para aumentar el porcentaje de clics.',
      },
      {
        title: 'Las Mejores Herramientas de Inteligencia Artificial para Youtubers',
        score: 8.1,
        reasoning: 'Título directo enfocado en la intención de búsqueda exacta de usuarios en YouTube.',
      },
    ],
    description: `Descubre las 5 herramientas de Inteligencia Artificial que todo creador de contenido debe utilizar para multiplicar su productividad y acelerar el crecimiento de su canal.

HERRAMIENTAS REVISADAS:
1. YOUASSISTANT - Post-producción automatizada y generación de miniaturas.
2. Descript / ElevenLabs - Edición de voz y limpieza de audio.
3. Midjourney V6 / Gemini Image - Generación de fondos y recursos gráficos.
4. Runway Gen-3 - Creación de B-Roll dinámico con video IA.
5. Claude & Gemini - Estructuración estratégica de guiones.

#HerramientasIA #Productividad #YouTube2026 #Creadores',
`,
    tags: ['herramientas ia', 'top 5 ia', 'ia para youtube', 'ia creadores', 'descript', 'midjourney', 'gemini studio'],
    selectedThumbnailIndex: 0,
    thumbnailIdeas: [
      {
        id: 'thumb-2-1',
        concept: 'Top 5 IA Iconos Flotantes',
        style: 'Ilustración 3D Neón sobre fondo oscuro con sujeto emocionado',
        colors: 'Verde neón, Violeta deep, Blanco',
        visualElements: '5 íconos brillantes flotando con números dorados del 1 al 5 alrededor del creador.',
        emotion: 'Descubrimiento y emoción tecnológica.',
        customOverlayText: 'TOP 5 IAS DE 2026',
        generatedImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1280&q=80',
      },
    ],
    socialPosts: {
      twitterThread: ['5 herramientas de IA que me ahorran +20 horas a la semana produciendo videos de YouTube 👇'],
      instagramReelHook: 'Si eres creador de contenido y no estás usando estas 5 herramientas de IA, estás perdiendo el 80% de tu tiempo...',
      linkedInSummary: 'Top 5 herramientas de Inteligencia Artificial aplicadas a la escala de contenido audiovisual en empresas y creadores individuales.',
    },
    script: {
      hook: 'Estas 5 herramientas de IA van a hacer que tu competencia parezca lenta.',
      intro: 'Analicemos las mejores opciones del mercado.',
      bodyPoints: [{ title: 'Herramienta 1', text: 'Automatización total de transcripción.', visualCue: 'Mostrar interfaz' }],
      cta: 'Suscríbete para la parte 2.',
    },
    metrics: {
      estimatedImpressions: '18K - 40K',
      targetAudience: 'Creadores tech y editores',
      seoScore: 92,
    },
  },
];

export const INITIAL_CHANNEL_ANALYTICS: ChannelAnalytics = {
  subscribers: 48520,
  subscriberGrowth: 12.4,
  viewsLast28Days: 384200,
  viewsGrowth: 18.7,
  avgCTR: 8.9,
  avgRetention: '58.4%',
  estimatedRevenue: 2140,
  topPerformingVideos: [
    { id: '1', title: 'Creé un Canal de YouTube 100% con IA en 24 Horas', views: 142000, ctr: 11.2, retention: '62%' },
    { id: '2', title: 'Cómo Optimizar tus Títulos para el Algoritmo', views: 89000, ctr: 9.8, retention: '56%' },
    { id: '3', title: 'Guía Definitiva de Miniaturas con Alto CTR', views: 64500, ctr: 10.4, retention: '59%' },
  ],
  recentActivity: [
    { date: 'Lun', views: 12400, subscribers: 180 },
    { date: 'Mar', views: 14100, subscribers: 210 },
    { date: 'Mié', views: 13800, subscribers: 195 },
    { date: 'Jue', views: 16200, subscribers: 260 },
    { date: 'Vie', views: 18900, subscribers: 310 },
    { date: 'Sáb', views: 22400, subscribers: 420 },
    { date: 'Dom', views: 20100, subscribers: 380 },
  ],
};

export const INITIAL_TRENDS: TrendTopic[] = [
  {
    id: 'tr-1',
    niche: 'Tecnología e IA',
    title: 'Agentes de IA Autónomos en YouTube',
    searchVolume: '520K búsquedas/mes',
    growth: '+240% esta semana',
    competition: 'Media',
    suggestedAngle: 'Crea un experimento donde un agente de IA gestiona la comunidad y publica respuestas solo.',
    tags: ['agentes ia', 'ia autonoma', 'automatizacion', 'futuro ia'],
  },
  {
    id: 'tr-2',
    niche: 'Creación de Contenido',
    title: 'Miniaturas 3D Minimalistas',
    searchVolume: '310K búsquedas/mes',
    growth: '+180% esta semana',
    competition: 'Baja',
    suggestedAngle: 'Muestra el proceso de simplificar miniaturas recargadas para duplicar la tasa de clics.',
    tags: ['miniaturas youtube', 'diseno miniaturas', 'ctr youtube', 'photoshop ia'],
  },
  {
    id: 'tr-3',
    niche: 'Productividad',
    title: 'Flujos de Trabajo de 1 Persona con IA',
    searchVolume: '410K búsquedas/mes',
    growth: '+135% esta semana',
    competition: 'Media',
    suggestedAngle: 'Demuestra cómo reemplazar un equipo de 3 personas usando sistemas integrados.',
    tags: ['solopreneur', 'productividad ia', 'negocios digitales', 'sistemas de trabajo'],
  },
  {
    id: 'tr-4',
    niche: 'Monetización',
    title: 'YouTube Shorts a Videos Largos Funnel',
    searchVolume: '290K búsquedas/mes',
    growth: '+95% esta semana',
    competition: 'Baja',
    suggestedAngle: 'Estrategia exacta para convertir vistas de Shorts en suscriptores fieles para videos de 10 minutos.',
    tags: ['youtube shorts', 'monetizar shorts', 'crecer en youtube', 'funnel contenido'],
  },
];

export const INITIAL_IDEAS: VideoIdea[] = [
  {
    id: 'idea-1',
    title: 'Por Qué el 90% de los Canales de IA Fracasan (y Cómo Evitarlo)',
    niche: 'Estrategia de YouTube',
    estimatedCTR: '12.8%',
    targetAudience: 'Creadores principiantes intentando monetizar con contenido automatizado.',
    hookIdea: 'Muestra una captura con 0 reproducciones vs una con 500K vistas: "La diferencia es solo 1 ajuste en la primera hora..."',
    contentOutline: [
      'Error #1: Usar voces sintéticas robóticas sin modulación de emoción.',
      'Error #2: Copiar miniaturas genéricas saturadas de texto.',
      'Error #3: No optimizar el hook de los primeros 15 segundos.',
      'Solución: El flujo de trabajo con YOUASSISTANT para retención sostenida.',
    ],
  },
  {
    id: 'idea-2',
    title: 'Probé Escribir un Guión con IA en 5 Segundos (Experimento en Vivo)',
    niche: 'Inteligencia Artificial',
    estimatedCTR: '10.5%',
    targetAudience: 'Entusiastas de la productividad y creadores que sufren bloqueo de escritor.',
    hookIdea: 'Pone un cronómetro de 5 segundos en pantalla y le da enter a la IA.',
    contentOutline: [
      'Comparativa de velocidad: Escribir a mano (4h) vs Generador de Guiones YOUASSISTANT (5s).',
      'Análisis de la estructura del guión generado (Hook, Puntos Clave, B-Roll, CTA).',
      'Grabación de demostración sin ediciones previas.',
      'Vedicto final y recomendaciones de prompt.',
    ],
  },
];
