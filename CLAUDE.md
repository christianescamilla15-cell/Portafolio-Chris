# Portafolio IA & Automatización — Christian Hernandez

## Estructura
- `setup.py` — punto de entrada principal, configura y lanza proyectos
- `proyectos/01-chatbot-multiagente/` — Chatbot con 5 agentes IA (React + Node.js + n8n + Claude API)
- `proyectos/02-content-studio/` — Generador de contenido (React + Claude API + DALL-E 3)
- `proyectos/03-finance-ai/` — Dashboard financiero (React + Claude API + Python)
- `proyectos/04-hr-scout/` — Filtrado CVs con LLMs (React + Claude API + FastAPI)
- `proyectos/05-client-hub/` — Portal clientes No-Code (React + Airtable + Claude API)
- `multi-agent-system/` — Sistema de 6 agentes que construye los proyectos

## Stack común
- Frontend: React 18 + Vite 5
- API IA: Claude API (Anthropic)
- Puertos: 3001-3005 (uno por proyecto)

## Convenciones
- Español para UI/comentarios, inglés para código (variables, funciones)
- Cada proyecto es independiente con su propio package.json
- Variables de entorno en `.env` (nunca commitear)
- Usar `npm run dev` para desarrollo, `npm run build` para producción

## Testing
- Ejecutar tests con `npm test` en cada proyecto
- Verificar build con `npm run build` antes de considerar completo
- Probar en http://localhost:{puerto} que la UI funcione

## Workflow de desarrollo
1. Crear/editar código fuente
2. Instalar dependencias si se agregan nuevas
3. Ejecutar dev server para verificar
4. Corregir errores automáticamente
5. Repetir hasta que funcione
