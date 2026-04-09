# 🎨 ContentStudio — Generador de Contenido Visual con IA

> Genera copy de marketing completo + prompts para DALL-E 3 en segundos. Soporta Instagram, Twitter/X, LinkedIn y Facebook con dimensiones y formatos correctos por plataforma.

---

## ¿Qué genera por solicitud?

Con solo describir tu producto o servicio, ContentStudio produce:

| Elemento | Descripción |
|----------|-------------|
| **Headline** | Título principal impactante (máx 10 palabras) |
| **Subheadline** | Subtítulo complementario |
| **Cuerpo** | Texto persuasivo de 2-3 oraciones |
| **CTA** | Llamada a la acción directa |
| **Hashtags** | 5 hashtags relevantes listos para copiar |
| **Paleta de colores** | 3 colores hex coherentes con el mensaje |
| **Prompt DALL-E 3** | Descripción detallada para generar la imagen |
| **Timing** | Mejor hora para publicar y por qué |

## Plataformas soportadas

| Plataforma | Dimensiones | Ratio |
|------------|------------|-------|
| Instagram | 1080×1080 | 1:1 |
| Twitter/X | 1200×675 | 16:9 |
| LinkedIn | 1200×627 | 1.91:1 |
| Facebook | 1200×630 | 1.91:1 |

## Instalación

```bash
git clone https://github.com/christianescamilla15-cell/content-studio-ai
cd content-studio-ai
npm install
cp .env.example .env
npm run dev   # http://localhost:3002
```

## Variables de entorno

```env
VITE_ANTHROPIC_API_KEY=sk-ant-...
VITE_OPENAI_API_KEY=sk-...   # Para generar imágenes con DALL-E 3
```

## Integración con Make.com

El prompt DALL-E generado es compatible con el nodo de OpenAI en Make.com. Puedes conectar ContentStudio a un workflow que:
1. Recibe el contenido generado
2. Llama a DALL-E 3 con el prompt
3. Publica automáticamente en Buffer o Hootsuite
4. Registra en Notion como contenido programado

## Stack

`React` `Claude API` `DALL-E 3` `Make.com`

---

[![Portfolio](https://img.shields.io/badge/Portfolio-ch65--portfolio-6366F1?style=flat)](https://ch65-portfolio.vercel.app)
