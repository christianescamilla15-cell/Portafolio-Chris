# 📱 MindScrolling — Reemplaza el doom-scrolling con filosofía

> App mobile anti doom-scrolling que transforma el scroll infinito en reflexión intencional. Sistema de recomendación híbrido con embeddings semánticos, análisis de sentimiento filosófico e insights semanales generados con Claude API.

---

## ¿Por qué existe?

Las plataformas como YouTube, Instagram y TikTok optimizan para engagement y adicción. MindScrolling optimiza para pensamiento. Cada swipe entrena un modelo que entiende tu perfil filosófico y te muestra contenido que te hace reflexionar, no contenido que te engancha.

## Arquitectura del feed

```
Usuario hace swipe / like / vault / dwell
            ↓
    Señales de comportamiento
    (like×3, vault×5, swipe×1, skip−2, dwell)
            ↓
    ¿Tiene vector de preferencia?
    /                      \
  SÍ                        NO
   ↓                         ↓
Feed Híbrido            Feed Conductual
Semantic similarity     Category affinity
(pgvector HNSW <5ms)   (pesos por señales)
+ category affinity
+ dwell signal
+ exploration noise
```

## Características técnicas

- **pgvector + HNSW** — Búsqueda de similitud semántica en <5ms sobre 13,000+ frases
- **Voyage AI embeddings** — Vectores 512 dims con EMA update por evento de alta señal
- **Claude API (Haiku)** — Insights semanales personalizados cacheados 24h
- **Flutter cross-platform** — 97+ archivos Dart, arquitectura limpia por capas, Riverpod
- **Modelo freemium** — RevenueCat + 7 días trial + unlock $4.99 MXN $79
- **Multi-idioma** — Detección automática ES/EN, 13,000+ frases curadas
- **Scrum ligero** — Sprint 7 activo, Build Score 82/100, Deploy en Railway

## Mapa filosófico

El sistema construye un perfil intelectual del usuario en 4 dimensiones:

| Dirección | Categoría | Representa |
|-----------|-----------|------------|
| ↑ Arriba | Sabiduría / Estoicismo | Resiliencia interior |
| → Derecha | Disciplina / Crecimiento | Logro personal |
| ← Izquierda | Reflexión / Vida | Emoción y significado |
| ↓ Abajo | Filosofía / Existencial | Ideas y verdad |

## Quick Start

```bash
# Backend
cd backend
cp .env.example .env   # SUPABASE_URL, ANTHROPIC_API_KEY, VOYAGE_API_KEY
npm install
npm run embed-quotes   # Genera embeddings (una vez)
npm run dev            # http://localhost:3000

# Flutter
cd flutter_app
flutter pub get
flutter run
```

## Stack

`Flutter` `Node.js` `Fastify` `Supabase` `pgvector` `Voyage AI` `Claude API (Haiku)` `RevenueCat` `Railway`

---

[![Portfolio](https://img.shields.io/badge/Portfolio-ch65--portfolio-6366F1?style=flat)](https://ch65-portfolio.vercel.app)
[![Releases](https://img.shields.io/badge/APK-v1.4-green?style=flat)](https://github.com/christianescamilla15-cell/MindScrolling/releases/tag/v1.4)
