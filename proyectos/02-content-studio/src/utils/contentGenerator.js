// ─── CONTENT GENERATION FORMULAS & SMART GENERATORS ─────────────────────────
import { createRng, hashString, pickRandom, shuffled } from './rng.js';
import { parseBrand } from './brandParser.js';
import {
  INDUSTRY_PALETTES, TONE_PALETTE_ADJUSTMENTS, EMOJI_SETS, POSTING_TIMES,
  INDUSTRY_HASHTAGS, FORMAT_HASHTAGS, PLATFORM_HASHTAGS,
} from '../constants/industryData.js';
import { PLATFORMS } from '../constants/platforms.js';

// ─── HEADLINE FORMULAS PER TONE ─────────────────────────────────────────────
export const HEADLINE_FORMULAS = {
  Profesional: [
    (p, v) => `${p}: La Solución Que Tu Negocio Necesita`,
    (p, v) => `${p} — Resultados Profesionales Garantizados`,
    (p, v) => `Optimiza Tu Estrategia Con ${p}`,
    (p, v) => `${p}: Eficiencia y Resultados Medibles`,
    (p, v) => `La Ventaja Competitiva de ${p}`,
    (p, v) => `${p}: Donde la Estrategia Encuentra Resultados`,
    (p, v) => `Profesionales Eligen ${p} Por una Razón`,
    (p, v) => `${p} — El Estándar de la Industria`,
    (p, v) => `Transforma Tu Operación Con ${p}`,
    (p, v) => `${p}: Inteligencia Aplicada a Tu Sector`,
    (p, v) => `El ROI Que Esperabas: ${p}`,
    (p, v) => `${p} Redefine Lo Que Es Posible`,
  ],
  Inspirador: [
    (p, v) => `${p}: Donde Comienzan los Grandes Cambios`,
    (p, v) => `Imagina Lo Que Puedes Lograr Con ${p}`,
    (p, v) => `${p} — Tu Próximo Gran Paso`,
    (p, v) => `El Futuro Que Soñaste Empieza Con ${p}`,
    (p, v) => `${p}: Despierta Tu Máximo Potencial`,
    (p, v) => `Atrévete a Más Con ${p}`,
    (p, v) => `${p} — Porque Mereces Lo Extraordinario`,
    (p, v) => `Transforma Tu Vida Con ${p}`,
    (p, v) => `Cada Gran Historia Empieza Con ${p}`,
    (p, v) => `${p}: El Impulso Que Necesitabas`,
    (p, v) => `No Esperes Más — ${p} Está Aquí`,
    (p, v) => `${p}: Haz Realidad Lo Imposible`,
  ],
  Urgente: [
    (p, v) => `Última Oportunidad: ${p} Con Acceso Limitado`,
    (p, v) => `Solo Hoy: ${p} al Mejor Precio`,
    (p, v) => `No Te Quedes Fuera — ${p} Se Agota`,
    (p, v) => `Quedan Pocas Unidades de ${p}`,
    (p, v) => `${p}: Oferta Que Expira en Horas`,
    (p, v) => `Ahora o Nunca — ${p} No Esperará`,
    (p, v) => `Últimos Lugares Para ${p}`,
    (p, v) => `Alerta: ${p} Con Precio Irrepetible`,
    (p, v) => `${p} — Tu Ventana de Oportunidad Se Cierra`,
    (p, v) => `No Pierdas Tu Acceso a ${p}`,
    (p, v) => `${p}: Actúa Antes de Que Sea Tarde`,
    (p, v) => `Tiempo Limitado — ${p} Te Espera`,
  ],
  Divertido: [
    (p, v) => `${p}: Porque La Vida Es Demasiado Corta`,
    (p, v) => `Dale Sabor a Tu Día Con ${p}`,
    (p, v) => `${p} — Tu Nuevo Favorito Oficial`,
    (p, v) => `¿Ya Probaste ${p}? Te Falta Vivir`,
    (p, v) => `${p}: La Felicidad Tiene Nombre`,
    (p, v) => `Spoiler: ${p} Va a Encantarte`,
    (p, v) => `${p} — Sonríe, Mereces Algo Bueno`,
    (p, v) => `Prepárate Para Enamorarte de ${p}`,
    (p, v) => `${p}: Alegría Garantizada o Devolvemos la Sonrisa`,
    (p, v) => `Esto No Es un Simulacro: ${p} Está Aquí`,
    (p, v) => `${p} — El Plot Twist Que Necesitabas`,
    (p, v) => `Level Up: Descubre ${p}`,
  ],
  Minimalista: [
    (p, v) => `${p}. Simple. Efectivo.`,
    (p, v) => `Menos Ruido. Más ${p}.`,
    (p, v) => `${p} — Lo Esencial.`,
    (p, v) => `La Claridad de ${p}`,
    (p, v) => `${p}. Sin Excesos.`,
    (p, v) => `Pura Esencia: ${p}`,
    (p, v) => `${p}. Nada Sobra.`,
    (p, v) => `Lo Que Necesitas: ${p}`,
    (p, v) => `${p} — Diseño Con Propósito`,
    (p, v) => `Simplifica Con ${p}`,
    (p, v) => `${p}. Menos Es Más.`,
    (p, v) => `${p} — Elegancia En Lo Simple`,
  ],
};

// ─── SUBHEADLINE FORMULAS ───────────────────────────────────────────────────
export const SUBHEADLINE_FORMULAS = {
  Profesional: [
    (b, a) => b ? `La solución profesional para ${b}` : "Resultados medibles desde el primer día",
    (b, a) => a ? `Diseñado para ${a} que buscan excelencia` : "La herramienta que los líderes confían",
    (b, a) => b ? `Potencia tu capacidad de ${b} con tecnología probada` : "Eficiencia operativa al siguiente nivel",
    (b, a) => "Miles de profesionales ya optimizaron su flujo de trabajo",
    (b, a) => b ? `Maximiza tus resultados: ${b}` : "Rendimiento superior, resultados consistentes",
  ],
  Inspirador: [
    (b, a) => b ? `Descubre cómo ${b} puede cambiar todo` : "El cambio que estabas esperando empieza aquí",
    (b, a) => a ? `Creado para ${a} con grandes sueños` : "Atrévete a imaginar algo diferente",
    (b, a) => b ? `Más que un producto: tu camino hacia ${b}` : "Cada gran logro empieza con una decisión",
    (b, a) => "Únete a miles que ya transformaron su realidad",
    (b, a) => "Tu mejor versión está a un paso de distancia",
  ],
  Urgente: [
    (b, a) => b ? `Aprovecha ahora y logra ${b} antes que nadie` : "La oportunidad no espera — actúa ya",
    (b, a) => "Solo quedan horas para acceder a esta oferta exclusiva",
    (b, a) => b ? `Miles ya están disfrutando de ${b} — ¿y tú?` : "No dejes pasar esta oportunidad única",
    (b, a) => "Cada minuto que esperas, alguien más lo aprovecha",
    (b, a) => "Cupos limitados — la demanda supera toda expectativa",
  ],
  Divertido: [
    (b, a) => b ? `Porque ${b} debería ser divertido` : "La vida es corta para cosas aburridas",
    (b, a) => a ? `Hecho con amor para ${a} como tú` : "Prepárate para tu nueva obsesión favorita",
    (b, a) => "Advertencia: puede causar sonrisas involuntarias",
    (b, a) => b ? `${b}... pero con estilo y buena vibra` : "Tu dosis diaria de felicidad en un solo lugar",
    (b, a) => "Lo probaste una vez y ya no hay vuelta atrás",
  ],
  Minimalista: [
    (b, a) => b ? `${b}. Sin complicaciones.` : "Lo esencial, sin distracciones.",
    (b, a) => "Diseño intencional. Funcionalidad pura.",
    (b, a) => "Cada detalle, con propósito.",
    (b, a) => b ? `Solo lo que necesitas para ${b}` : "Simplicidad que funciona.",
    (b, a) => "Menos pasos. Mejores resultados.",
  ],
};

// ─── BODY COPY FORMULAS ─────────────────────────────────────────────────────
export const BODY_FORMULAS = {
  Profesional: [
    (p, b, a, d) => `${p} no es una solución genérica. Está diseñado específicamente para ${a || "profesionales exigentes"} que necesitan ${b || "resultados reales y medibles"}. Con ${d.slice(0, 2).join(" y ") || "tecnología de vanguardia"}, tu equipo alcanzará un nuevo estándar de productividad. ¿Estás listo para dar el siguiente paso?`,
    (p, b, a, d) => `En un mercado donde cada decisión cuenta, ${p} se convierte en tu aliado estratégico. ${b ? `Logra ${b} sin complicaciones.` : "Optimiza cada proceso con precisión."} Más de 10,000 ${a || "profesionales"} ya confían en esta solución. Los números hablan por sí solos.`,
    (p, b, a, d) => `La diferencia entre bueno y extraordinario es la herramienta correcta. ${p} integra ${d.slice(0, 3).join(", ") || "innovación y eficiencia"} para que ${a || "tu equipo"} ${b ? `pueda ${b}` : "supere cualquier expectativa"}. Implementación rápida, resultados inmediatos, ROI comprobado.`,
  ],
  Inspirador: [
    (p, b, a, d) => `Imagina un mundo donde ${b || "tus metas se vuelven realidad sin esfuerzo"}. ${p} hace eso posible para ${a || "personas como tú que buscan algo más"}. No se trata solo de ${d[0] || "un producto"}, se trata de transformar la manera en que vives y trabajas. Tu momento es ahora.`,
    (p, b, a, d) => `Cada gran cambio empieza con una decisión valiente. ${p} nació para ${a || "quienes se atreven a soñar en grande"} y no se conforman con lo ordinario. ${b ? `Descubre cómo ${b} puede redefinir tu día a día.` : "El futuro que imaginas está más cerca de lo que crees."} Este es tu momento.`,
    (p, b, a, d) => `${p} es más que ${d[0] || "tecnología"}: es la promesa de un futuro mejor. Para ${a || "quienes buscan evolucionar"}, ${b ? `la posibilidad de ${b}` : "cada día trae nuevas oportunidades"}. Miles ya dieron ese paso y no miraron atrás. ¿Qué estás esperando?`,
  ],
  Urgente: [
    (p, b, a, d) => `ATENCIÓN ${a ? a.toUpperCase() : ""}:  La oportunidad de acceder a ${p} con condiciones exclusivas se cierra pronto. ${b ? `Mientras lees esto, otros ya están aprovechando ${b}.` : "Cada segundo cuenta."} No esperes a que sea demasiado tarde — la demanda está superando las expectativas.`,
    (p, b, a, d) => `${p} está generando una demanda sin precedentes. ${b ? `Quienes ya lo tienen disfrutan de ${b} todos los días.` : "Los resultados están superando todas las predicciones."} Para ${a || "quienes actúan rápido"}, aún hay tiempo. Pero no mucho. Asegura tu lugar AHORA.`,
    (p, b, a, d) => `Solo quedan horas. ${p} está disponible por tiempo limitado con acceso completo a ${d.slice(0, 2).join(" y ") || "todas las funciones premium"}. ${a ? `Si eres ${a}` : "Si buscas resultados"}, ${b ? `y quieres ${b}` : ""}, este es el momento de actuar. No habrá segunda oportunidad.`,
  ],
  Divertido: [
    (p, b, a, d) => `Okay, seamos honestos: ${a || "todos"} necesitamos algo que ${b || "nos haga la vida más fácil y divertida"}. ${p} es exactamente eso, pero mejor. Con ${d[0] || "un toque especial"} que no encontrarás en ningún otro lugar. Pruébalo y agradécenos después.`,
    (p, b, a, d) => `Plot twist: ${p} existe y es todo lo que ${a || "siempre quisiste"} pero no sabías que necesitabas. ${b ? `¿${b}? Check.` : "¿Funciona? Absolutamente."} ¿Es divertido? Demasiado. ¿Deberías probarlo? La respuesta es sí, siempre sí. De nada.`,
    (p, b, a, d) => `Alerta de spoiler: una vez que pruebes ${p}, todo lo demás te parecerá aburrido. ${b ? `Porque ${b} nunca fue tan fácil ni tan entretenido.` : "Es adictivamente bueno."} ${a ? `Creado para ${a} con buen gusto.` : "Para quienes saben lo que quieren."} Tu yo del futuro te lo agradecerá.`,
  ],
  Minimalista: [
    (p, b, a, d) => `${p}. ${b ? `${b.charAt(0).toUpperCase() + b.slice(1)}.` : "Sin complicaciones."} ${a ? `Para ${a}.` : "Para ti."} Nada más, nada menos.`,
    (p, b, a, d) => `Simplicidad radical. ${p} elimina lo innecesario y deja solo lo que funciona. ${b ? `Resultado: ${b}.` : "Resultado: eficiencia pura."} Punto.`,
    (p, b, a, d) => `${p}. ${d[0] ? `${d[0].charAt(0).toUpperCase() + d[0].slice(1)}` : "Diseño"}. ${d[1] || "Propósito"}. ${b || "Resultados"}. Todo lo que necesitas, concentrado en su forma más pura.`,
  ],
};

// ─── CTA FORMULAS ───────────────────────────────────────────────────────────
export const CTA_BY_FORMAT = {
  Producto: ["Compra ahora", "Consíguelo hoy", "Lo quiero", "Agregar al carrito", "Descúbrelo ya", "Ver producto", "Comprar con descuento", "Obtener el mío"],
  Servicio: ["Agenda tu consulta", "Solicita una demo", "Reserva tu sesión", "Empieza gratis", "Habla con un experto", "Cotiza sin compromiso", "Prueba 14 días gratis", "Conectar ahora"],
  Evento: ["Reserva tu lugar", "Inscríbete ahora", "Asegura tu entrada", "Quiero asistir", "Regístrate gratis", "Separa tu asiento", "No te lo pierdas", "Confirmar asistencia"],
  Oferta: ["Aprovechar oferta", "Canjea tu descuento", "Activar promoción", "Compra con 50% OFF", "Última oportunidad", "Reclamar mi oferta", "Usar código ahora", "Ahorrar hoy"],
  Branding: ["Conócenos", "Descubre nuestra historia", "Explora la marca", "Sé parte de esto", "Únete al movimiento", "Vive la experiencia", "Conoce nuestra misión", "Únete a la comunidad"],
};

// ─── SYSTEM PROMPT (kept for API mode) ──────────────────────────────────────
export const buildSystemPrompt = (platform, tone, format) => `
Eres un experto en marketing digital y copywriting. Generas contenido de alta conversión para redes sociales.

Plataforma objetivo: ${platform}
Tono deseado: ${tone}
Tipo de contenido: ${format}

Responde ÚNICAMENTE con un JSON válido con esta estructura exacta (sin markdown, sin texto extra):
{
  "headline": "Título principal impactante (máx 10 palabras)",
  "subheadline": "Subtítulo que complementa (máx 15 palabras)",
  "body": "Cuerpo del mensaje persuasivo (2-3 oraciones)",
  "cta": "Llamada a la acción (máx 5 palabras)",
  "hashtags": ["hashtag1", "hashtag2", "hashtag3", "hashtag4", "hashtag5"],
  "emoji_set": ["emoji1", "emoji2", "emoji3"],
  "dalle_prompt": "Detailed image generation prompt in English for DALL-E 3, describing a professional marketing visual for this content. Include style, lighting, composition. Minimum 50 words.",
  "color_palette": ["#hexcode1", "#hexcode2", "#hexcode3"],
  "posting_time": "Mejor hora para publicar y por qué (1 oración)"
}
`;

// ─── DALL-E PROMPT BUILDER ──────────────────────────────────────────────────
export function buildDallePrompt(parsed, platform, tone, palette, rng) {
  const platformDims = PLATFORMS.find(p => p.id === platform);
  const aspectDesc = platform === "instagram" ? "square 1:1 aspect ratio" :
    platform === "twitter" ? "wide 16:9 landscape aspect ratio" :
    "wide 1.91:1 landscape aspect ratio";

  const toneStyles = {
    Profesional: "Clean, corporate aesthetic with sharp lines, professional lighting, and a sophisticated color scheme. Minimalist but impactful composition.",
    Inspirador: "Warm, uplifting atmosphere with golden hour lighting, expansive spaces, and an aspirational feel. Ethereal and empowering mood.",
    Urgente: "High-contrast, bold visual with dynamic angles, intense colors, and a sense of movement. Eye-catching and immediate impact.",
    Divertido: "Bright, playful colors with whimsical elements, creative typography, and a lighthearted atmosphere. Fun and engaging composition.",
    Minimalista: "Ultra-clean composition with ample white space, geometric elements, and a monochromatic palette. Zen-like simplicity and elegance.",
  };

  const industrySubjects = {
    tech: "sleek technology devices, digital interfaces, and futuristic elements",
    food: "beautifully plated dishes, fresh ingredients, and warm kitchen ambiance",
    health: "serene natural settings, wellness imagery, and calming botanical elements",
    finance: "abstract representations of growth, upward trends, and premium materials",
    education: "open books, illuminated spaces, and pathways of knowledge",
    fashion: "editorial-style fashion photography, fabric textures, and bold styling",
    beauty: "soft skin textures, luxurious cosmetic products, and gentle lighting",
    realestate: "architectural photography, modern interiors, and lifestyle spaces",
    travel: "breathtaking landscapes, exotic destinations, and adventure elements",
    marketing: "creative workspace, dynamic graphics, and brand storytelling elements",
    general: "modern lifestyle elements, abstract geometric forms, and premium textures",
  };

  const subject = industrySubjects[parsed.detectedIndustry] || industrySubjects.general;
  const style = toneStyles[tone] || toneStyles.Profesional;

  return `Professional marketing visual for "${parsed.productName}" — a ${parsed.descriptors.slice(0, 4).join(", ")} brand. Scene features ${subject}. ${style} Color palette: ${palette.join(", ")}. Designed for ${platformDims.label} social media (${aspectDesc}, ${platformDims.dims} pixels). Include space for text overlay. 8K resolution, photorealistic rendering, commercial advertising quality, depth of field, cinematic composition.`;
}

// ─── SMART HEADLINE GENERATOR ───────────────────────────────────────────────
export function generateSmartHeadline(brand, tone, format, lang, rng) {
  const { productName, benefit, audience, descriptors, numbers } = brand;

  const templates = {
    professional: {
      es: [
        benefit ? `${productName}: ${benefit.charAt(0).toUpperCase() + benefit.slice(1)}` : `${productName} — La Solución Profesional`,
        audience ? `Diseñado para ${audience}` : `La herramienta que tu equipo necesita`,
        numbers[0] ? `${productName}: Resultados en ${numbers[0]}` : `${productName}: Resultados que importan`,
        benefit ? `${productName} — ${benefit.charAt(0).toUpperCase() + benefit.slice(1)}` : `${productName}: Eficiencia Comprobada`,
      ],
      en: [
        benefit ? `${productName}: ${benefit.charAt(0).toUpperCase() + benefit.slice(1)}` : `${productName} — The Professional Solution`,
        audience ? `Built for ${audience}` : `The tool your team needs`,
        numbers[0] ? `${productName}: Results in ${numbers[0]}` : `${productName}: Results that matter`,
        benefit ? `${productName} — ${benefit.charAt(0).toUpperCase() + benefit.slice(1)}` : `${productName}: Proven Efficiency`,
      ]
    },
    inspirational: {
      es: [
        `Transforma tu ${audience || 'día'} con ${productName}`,
        benefit ? `Imagina ${benefit}` : `El cambio empieza aquí`,
        `${productName}: Más que una herramienta, una experiencia`,
        audience ? `${audience}: Tu próximo gran paso es ${productName}` : `${productName}: Donde comienzan los grandes cambios`,
      ],
      en: [
        `Transform your ${audience || 'day'} with ${productName}`,
        benefit ? `Imagine ${benefit}` : `Change starts here`,
        `${productName}: More than a tool, an experience`,
        audience ? `${audience}: Your next big step is ${productName}` : `${productName}: Where great changes begin`,
      ]
    },
    urgent: {
      es: [
        `¡No esperes más! ${productName} ya está aquí`,
        numbers[0] ? `Solo ${numbers[0]} para ver resultados` : `Resultados desde el primer día`,
        audience ? `${audience}: Esta es tu oportunidad` : `Tu oportunidad es ahora`,
        benefit ? `Últimos lugares: ${benefit}` : `${productName} — Oferta por tiempo limitado`,
      ],
      en: [
        `Don't wait! ${productName} is here`,
        numbers[0] ? `Just ${numbers[0]} to see results` : `Results from day one`,
        audience ? `${audience}: This is your chance` : `Your opportunity is now`,
        benefit ? `Last spots: ${benefit}` : `${productName} — Limited time offer`,
      ]
    },
    fun: {
      es: [
        `${productName}: Porque la vida es mejor con tecnología 🚀`,
        benefit ? `¿Y si pudieras ${benefit}? Ahora puedes` : `Prepárate para lo increíble`,
        `Dale un upgrade a tu ${audience || 'rutina'}`,
        `${productName} — Tu nuevo favorito oficial 🎉`,
      ],
      en: [
        `${productName}: Because life is better with tech 🚀`,
        benefit ? `What if you could ${benefit}? Now you can` : `Get ready for something amazing`,
        `Upgrade your ${audience || 'routine'}`,
        `${productName} — Your new favorite thing 🎉`,
      ]
    },
    minimalist: {
      es: [
        productName,
        benefit ? benefit.charAt(0).toUpperCase() + benefit.slice(1) : `Simple. Efectivo. ${productName}`,
        audience ? `Para ${audience}` : `Menos es más`,
        `${productName}. Nada sobra.`,
      ],
      en: [
        productName,
        benefit ? benefit.charAt(0).toUpperCase() + benefit.slice(1) : `Simple. Effective. ${productName}`,
        audience ? `For ${audience}` : `Less is more`,
        `${productName}. Nothing wasted.`,
      ]
    }
  };

  const toneMap = { 'profesional': 'professional', 'inspirador': 'inspirational', 'urgente': 'urgent', 'divertido': 'fun', 'minimalista': 'minimalist', 'professional': 'professional', 'inspirational': 'inspirational', 'urgent': 'urgent', 'fun': 'fun', 'minimalist': 'minimalist' };
  const toneKey = toneMap[tone.toLowerCase()] || 'professional';
  const langKey = (lang === 'en') ? 'en' : 'es';
  const toneTemplates = templates[toneKey]?.[langKey] || templates.professional[langKey];

  return pickRandom(shuffled(toneTemplates, rng), rng);
}

// ─── SMART SUBHEADLINE GENERATOR ────────────────────────────────────────────
export function generateSmartSubheadline(brand, tone, lang, rng) {
  const { productName, benefit, audience, descriptors, numbers } = brand;
  const langKey = (lang === 'en') ? 'en' : 'es';

  const templates = {
    es: [
      audience && benefit ? `La solución para ${audience} que necesitan ${benefit}` : null,
      audience ? `Creado especialmente para ${audience}` : null,
      benefit ? `Descubre cómo ${benefit} puede cambiar todo` : null,
      descriptors.length ? `Con tecnología ${descriptors.slice(0, 2).join(' y ')}` : null,
      numbers[0] ? `Resultados comprobados: ${numbers[0]}` : null,
      `${productName} — la herramienta que marca la diferencia`,
    ],
    en: [
      audience && benefit ? `The solution for ${audience} who need ${benefit}` : null,
      audience ? `Built specifically for ${audience}` : null,
      benefit ? `Discover how ${benefit} can change everything` : null,
      descriptors.length ? `Powered by ${descriptors.slice(0, 2).join(' & ')} technology` : null,
      numbers[0] ? `Proven results: ${numbers[0]}` : null,
      `${productName} — the tool that makes the difference`,
    ]
  };

  const candidates = (templates[langKey] || templates.es).filter(Boolean);
  return pickRandom(shuffled(candidates, rng), rng);
}

// ─── SMART BODY GENERATOR ───────────────────────────────────────────────────
export function generateSmartBody(brand, tone, format, lang, rng) {
  const { productName, benefit, audience, descriptors, numbers } = brand;

  const parts = [];

  if (lang === 'en') {
    if (audience) parts.push(`Built specifically for ${audience}.`);
    if (benefit) parts.push(`${productName} lets you ${benefit}.`);
    if (descriptors.length) parts.push(`Powered by ${descriptors.join(', ')} technology.`);
    if (numbers.length) parts.push(`Proven results: ${numbers.join(', ')}.`);
    if (!parts.length) parts.push(`${productName} is the solution you've been looking for. Discover how it can transform the way you work.`);
  } else {
    if (audience) parts.push(`Diseñado especialmente para ${audience}.`);
    if (benefit) parts.push(`${productName} te permite ${benefit}.`);
    if (descriptors.length) parts.push(`Con tecnología ${descriptors.join(', ')}.`);
    if (numbers.length) parts.push(`Resultados comprobados: ${numbers.join(', ')}.`);
    if (!parts.length) parts.push(`${productName} es la solución que estabas buscando. Descubre cómo puede transformar tu forma de trabajar.`);
  }

  return parts.join(' ');
}

// ─── SMART CTA GENERATOR ───────────────────────────────────────────────────
export function generateSmartCTA(brand, format, lang, rng) {
  const { productName, numbers } = brand;

  const ctas = {
    es: {
      Producto: [`Descubre ${productName}`, 'Lo quiero ahora', 'Ver producto'],
      Servicio: ['Agenda tu consulta gratis', 'Solicita una demo', 'Empieza gratis'],
      Evento: ['Reserva tu lugar ahora', 'Inscríbete ya', 'Quiero asistir'],
      Oferta: [numbers[0] ? `Prueba gratis por ${numbers[0]}` : 'Empieza gratis hoy', 'Aprovechar oferta', 'Activar promoción'],
      Branding: [`Conoce ${productName}`, 'Descubre nuestra historia', 'Únete al movimiento'],
    },
    en: {
      Producto: [`Discover ${productName}`, 'I want it now', 'View product'],
      Servicio: ['Book your free consultation', 'Request a demo', 'Start free'],
      Evento: ['Reserve your spot now', 'Sign up now', 'I want to attend'],
      Oferta: [numbers[0] ? `Try free for ${numbers[0]}` : 'Start free today', 'Grab this offer', 'Activate promotion'],
      Branding: [`Meet ${productName}`, 'Discover our story', 'Join the movement'],
    }
  };

  const langKey = (lang === 'en') ? 'en' : 'es';
  const formatCtas = ctas[langKey]?.[format] || ctas[langKey]?.Producto || ctas.es.Producto;
  return pickRandom(shuffled(formatCtas, rng), rng);
}

// ─── SMART HASHTAG GENERATOR ────────────────────────────────────────────────
export function generateSmartHashtags(brand, lang, platform, format, rng) {
  const { productName, audience, descriptors } = brand;
  const tags = [];
  const seen = new Set();
  const addTag = (t) => { if (t && !seen.has(t.toLowerCase())) { seen.add(t.toLowerCase()); tags.push(t); } };

  const cleanName = productName.replace(/[^a-zA-ZáéíóúñÁÉÍÓÚÑ0-9]/g, '');
  if (cleanName.length > 3) addTag(cleanName);

  descriptors.slice(0, 2).forEach(d => addTag(d.replace(/\s/g, '')));

  if (audience) {
    const cleanAud = audience.split(' ').slice(0, 2).join('').replace(/[^a-zA-ZáéíóúñÁÉÍÓÚÑ]/g, '');
    if (cleanAud.length > 3) addTag(cleanAud);
  }

  const industryTags = shuffled(INDUSTRY_HASHTAGS[brand.detectedIndustry] || INDUSTRY_HASHTAGS.general, rng);
  const formatTags = shuffled(FORMAT_HASHTAGS[format] || FORMAT_HASHTAGS.Producto, rng);
  const platTags = shuffled(PLATFORM_HASHTAGS[platform] || PLATFORM_HASHTAGS.instagram, rng);

  industryTags.slice(0, 2).forEach(addTag);
  formatTags.slice(0, 1).forEach(addTag);
  platTags.slice(0, 1).forEach(addTag);

  const genericES = ['Innovación', 'Tecnología', 'NegociosDigitales', 'Productividad', 'Emprendimiento'];
  const genericEN = ['Innovation', 'Technology', 'DigitalBusiness', 'Productivity', 'Entrepreneurship'];
  const generic = lang === 'en' ? genericEN : genericES;
  let gi = 0;
  while (tags.length < 5 && gi < generic.length) { addTag(generic[gi]); gi++; }

  return tags.slice(0, 7);
}

// ─── MAIN GENERATOR FUNCTION ────────────────────────────────────────────────
export function generateSmartContent(brand, platform, tone, format, generationCount, lang) {
  const parsed = parseBrand(brand);
  const seed = hashString(brand + platform + tone + format) + generationCount * 7919;
  const rng = createRng(seed);

  const detectedLang = lang || (parsed.raw.match(/\b(the|for|with|and|that|which)\b/i) ? 'en' : 'es');

  const headline = generateSmartHeadline(parsed, tone, format, detectedLang, rng);
  const subheadline = generateSmartSubheadline(parsed, tone, detectedLang, rng);
  const body = generateSmartBody(parsed, tone, format, detectedLang, rng);
  const cta = generateSmartCTA(parsed, format, detectedLang, rng);
  const hashtags = generateSmartHashtags(parsed, detectedLang, platform, format, rng);

  let palettes;
  if (tone === "Minimalista") {
    palettes = TONE_PALETTE_ADJUSTMENTS.Minimalista;
  } else {
    palettes = INDUSTRY_PALETTES[parsed.detectedIndustry] || INDUSTRY_PALETTES.general;
  }
  const color_palette = pickRandom(shuffled(palettes, rng), rng);

  const emojiOptions = EMOJI_SETS[tone] || EMOJI_SETS.Profesional;
  const emoji_set = pickRandom(shuffled(emojiOptions, rng), rng);

  const dalle_prompt = buildDallePrompt(parsed, platform, tone, color_palette, rng);

  const times = POSTING_TIMES[platform] || POSTING_TIMES.instagram;
  const posting_time = pickRandom(shuffled(times, rng), rng);

  return { headline, subheadline, body, cta, hashtags, emoji_set, dalle_prompt, color_palette, posting_time };
}
