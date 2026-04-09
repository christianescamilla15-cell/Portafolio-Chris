// ─── INDUSTRY COLOR PALETTES ────────────────────────────────────────────────
export const INDUSTRY_PALETTES = {
  tech:       [["#0066FF", "#00D4AA", "#1A1A2E"], ["#6366F1", "#8B5CF6", "#0F172A"], ["#00B4D8", "#0077B6", "#03045E"], ["#3B82F6", "#10B981", "#111827"]],
  food:       [["#FF6B35", "#F7C948", "#2D1810"], ["#E63946", "#F1FAEE", "#457B9D"], ["#BC4749", "#F2E8CF", "#386641"], ["#FF8C42", "#FFD166", "#2B2D42"]],
  health:     [["#06D6A0", "#118AB2", "#073B4C"], ["#52B788", "#40916C", "#1B4332"], ["#80ED99", "#57CC99", "#22577A"], ["#38A3A5", "#57CC99", "#C7F9CC"]],
  finance:    [["#1B4332", "#2D6A4F", "#D4AF37"], ["#0D1B2A", "#1B3A4B", "#3A7CA5"], ["#14213D", "#FCA311", "#E5E5E5"], ["#003049", "#D62828", "#F77F00"]],
  education:  [["#4361EE", "#3A0CA3", "#F72585"], ["#7209B7", "#560BAD", "#480CA8"], ["#4CC9F0", "#4895EF", "#3F37C9"], ["#FF6D00", "#FF9E00", "#240046"]],
  fashion:    [["#2B2D42", "#8D99AE", "#EF233C"], ["#000000", "#D4AF37", "#FFFFFF"], ["#FF006E", "#8338EC", "#3A86FF"], ["#1A1A1A", "#C9184A", "#FFD6FF"]],
  beauty:     [["#FF69B4", "#FFB6C1", "#2D1B2E"], ["#D4A5A5", "#9C6644", "#F5E6CC"], ["#E0AAFF", "#C77DFF", "#7B2D8E"], ["#FF85A1", "#FBB1BD", "#2D1B2E"]],
  realestate: [["#1B4332", "#588157", "#DAD7CD"], ["#3C2A21", "#D5CEA3", "#1A120B"], ["#14213D", "#FCA311", "#E5E5E5"], ["#606C38", "#283618", "#FEFAE0"]],
  travel:     [["#00B4D8", "#0077B6", "#CAF0F8"], ["#FF6B6B", "#FFE66D", "#4ECDC4"], ["#F4A261", "#E76F51", "#264653"], ["#06D6A0", "#118AB2", "#EF476F"]],
  marketing:  [["#FF6B6B", "#4ECDC4", "#1A1A2E"], ["#E63946", "#457B9D", "#F1FAEE"], ["#FF006E", "#FB5607", "#FFBE0B"], ["#7209B7", "#3A0CA3", "#4361EE"]],
  general:    [["#E8C547", "#D4A017", "#1A1A2E"], ["#6366F1", "#8B5CF6", "#1E1B4B"], ["#F59E0B", "#EF4444", "#1F2937"], ["#10B981", "#3B82F6", "#111827"]],
};

// Override palette mood by tone
export const TONE_PALETTE_ADJUSTMENTS = {
  Minimalista: [["#1A1A1A", "#4A4A4A", "#8A8A8A"], ["#0A0A0A", "#333333", "#666666"], ["#2D2D2D", "#555555", "#888888"], ["#1C1C1C", "#3D3D3D", "#6E6E6E"]],
};

// ─── EMOJIS BY TONE ─────────────────────────────────────────────────────────
export const EMOJI_SETS = {
  Profesional:  [["💼", "📊", "✅"], ["🎯", "📈", "💡"], ["🏆", "🔑", "⚡"], ["📋", "🤝", "💎"]],
  Inspirador:   [["✨", "🌟", "💫"], ["🚀", "🌈", "💪"], ["🎯", "🔥", "⭐"], ["🦋", "🌻", "💖"]],
  Urgente:      [["⚡", "🔥", "⏰"], ["🚨", "💥", "⏳"], ["❗", "🔴", "⚡"], ["🏃", "💨", "🎯"]],
  Divertido:    [["🎉", "🎊", "🥳"], ["😎", "🤩", "💃"], ["🎪", "🌈", "✨"], ["🦄", "🍕", "🎮"]],
  Minimalista:  [["◾", "▪", "●"], ["◽", "○", "◆"], ["■", "□", "▲"], ["▫", "◉", "◈"]],
};

// ─── POSTING TIMES ──────────────────────────────────────────────────────────
export const POSTING_TIMES = {
  instagram: [
    "Miércoles y viernes 11:00-13:00 hrs — el engagement en Instagram alcanza su pico durante la hora de almuerzo, cuando los usuarios hacen scroll pasivo buscando inspiración visual.",
    "Martes y jueves 18:00-20:00 hrs — mayor actividad post-trabajo. Tu audiencia busca contenido aspiracional después de su jornada laboral.",
    "Sábados 10:00-11:00 hrs — el fin de semana empieza relajado y los usuarios dedican más tiempo a explorar contenido nuevo en su feed.",
    "Lunes 7:00-9:00 hrs — inicio de semana, usuarios revisan Instagram durante el desayuno o camino al trabajo. Ideal para contenido motivacional.",
  ],
  twitter: [
    "Lunes a viernes 8:00-9:00 hrs — Twitter/X tiene su mayor actividad durante el commute matutino. Los usuarios buscan noticias y actualizaciones rápidas.",
    "Miércoles 12:00-13:00 hrs — punto medio de la semana laboral, genera la mayor interacción en hilos y contenido de opinión profesional.",
    "Martes y jueves 17:00-18:00 hrs — fin de jornada laboral, los usuarios participan más activamente en conversaciones y debates de nicho.",
    "Domingos 19:00-21:00 hrs — momento de reflexión y planificación semanal. Ideal para hilos educativos y contenido largo.",
  ],
  linkedin: [
    "Martes a jueves 7:30-8:30 hrs — los profesionales revisan LinkedIn antes de iniciar su jornada. Momento clave para contenido B2B y thought leadership.",
    "Miércoles 10:00-11:00 hrs — hora pico de decisores y C-level. Ideal para anuncios corporativos y casos de estudio.",
    "Martes 12:00-13:00 hrs — la pausa del almuerzo es perfecta para artículos y posts extensos que generan debate profesional.",
    "Jueves 15:00-16:00 hrs — los profesionales buscan inspiración para cerrar la semana. Buen momento para storytelling empresarial.",
  ],
  facebook: [
    "Jueves y viernes 13:00-16:00 hrs — la audiencia de Facebook tiene mayor actividad en las tardes de fin de semana laboral, consumiendo contenido variado.",
    "Domingos 11:00-13:00 hrs — contenido de marca tiene alto engagement cuando la audiencia está relajada y navegando sin prisa.",
    "Miércoles 12:00-14:00 hrs — el punto medio de la semana muestra picos de interacción en videos y carruseles visuales.",
    "Sábados 9:00-11:00 hrs — mañana de fin de semana, los usuarios exploran marketplace y descubren nuevas marcas.",
  ],
};

// ─── INDUSTRY HASHTAGS ──────────────────────────────────────────────────────
export const INDUSTRY_HASHTAGS = {
  tech: ["tech", "innovacion", "digital", "ia", "futurodigital", "startup", "software", "automatizacion", "transformaciondigital"],
  food: ["foodie", "gastronomia", "comidacasera", "recetas", "cheflife", "healthyfood", "delicioso", "gourmet"],
  health: ["bienestar", "saludmental", "fitness", "vidaSaludable", "wellness", "mindfulness", "autocuidado", "salud"],
  finance: ["finanzas", "inversion", "dinero", "libertadfinanciera", "ahorro", "fintech", "educacionfinanciera"],
  education: ["educacion", "aprendizaje", "cursoonline", "formacion", "conocimiento", "desarrollo", "skillup"],
  fashion: ["moda", "estilo", "outfit", "tendencias", "fashion", "lookdeldia", "diseño", "streetstyle"],
  beauty: ["belleza", "skincare", "glowup", "beauty", "cuidadopersonal", "rutina", "selfcare"],
  realestate: ["bienesraices", "inversion", "hogar", "propiedades", "inmobiliaria", "tuhogar", "departamentos"],
  travel: ["viajes", "destinos", "aventura", "travel", "turismo", "explora", "wanderlust", "vacaciones"],
  marketing: ["marketingdigital", "estrategia", "redessociales", "branding", "contenido", "growthhacking"],
  general: ["trending", "viral", "novedades", "descubre", "imperdible", "recomendado", "tendencia"],
};

export const FORMAT_HASHTAGS = {
  Producto: ["nuevolanzamiento", "producto", "musthave", "compraonline", "tienda"],
  Servicio: ["servicio", "consultoria", "profesional", "agendatu", "expertos"],
  Evento: ["evento", "networking", "conferencia", "noteloPierdas", "envivo"],
  Oferta: ["oferta", "descuento", "promocion", "precioEspecial", "ultimahora"],
  Branding: ["marca", "identidad", "branding", "historia", "proposito"],
};

export const PLATFORM_HASHTAGS = {
  instagram: ["instagood", "photooftheday", "explore"],
  twitter: ["thread", "tech", "opinion"],
  linkedin: ["linkedin", "business", "networking"],
  facebook: ["fb", "comunidad", "compartir"],
};

// ─── INDUSTRY KEYWORDS FOR DETECTION ────────────────────────────────────────
export const INDUSTRY_KEYWORDS = {
  tech: ["app", "software", "plataforma", "digital", "tecnología", "ia", "inteligencia artificial", "saas", "api", "datos", "cloud", "nube", "startup", "código", "automatización", "algoritmo", "machine learning"],
  food: ["comida", "restaurante", "cocina", "chef", "receta", "alimento", "orgánico", "gourmet", "café", "bebida", "menú", "panadería", "delivery", "snack", "saludable"],
  health: ["salud", "bienestar", "meditación", "fitness", "yoga", "médico", "clínica", "terapia", "nutrición", "ejercicio", "mental", "estrés", "deporte", "gym", "vitamina", "suplemento"],
  finance: ["finanzas", "inversión", "ahorro", "dinero", "banco", "crédito", "capital", "trading", "crypto", "contabilidad", "presupuesto", "fondos", "patrimonio", "financiero"],
  education: ["curso", "educación", "aprendizaje", "clase", "profesor", "estudiante", "universidad", "academia", "capacitación", "formación", "enseñanza", "taller", "diplomado", "certificación"],
  fashion: ["moda", "ropa", "diseño", "estilo", "colección", "tendencia", "boutique", "accesorio", "joyería", "calzado", "textil", "prenda", "outfit"],
  beauty: ["belleza", "skincare", "maquillaje", "cosmético", "cuidado personal", "cabello", "piel", "spa", "tratamiento facial", "crema", "sérum"],
  realestate: ["inmobiliaria", "casa", "departamento", "propiedad", "terreno", "renta", "hipoteca", "condominio", "hogar", "arquitectura", "construcción"],
  travel: ["viaje", "turismo", "hotel", "destino", "aventura", "vacaciones", "vuelo", "hospedaje", "tour", "experiencia"],
  marketing: ["marketing", "publicidad", "marca", "branding", "campaña", "redes sociales", "contenido", "copywriting", "seo", "estrategia digital"],
};
