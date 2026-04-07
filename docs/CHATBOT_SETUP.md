# 🤖 Integración de Chatbot Multi-Agente

## Configuración

### 1. Obtener API Key gratuita de OpenRouter

1. Ve a: **https://openrouter.ai/keys**
2. Regístrate / Inicia sesión
3. Click en **"Create Key"**
4. Copia la key

### 2. Modelos gratuitos disponibles

| Modelo | Context | Calidad |
|--------|---------|---------|
| `meta-llama/llama-3-8b-instruct` | 8K | ⭐⭐⭐⭐⭐ |
| `mistralai/mistral-7b-instruct` | 8K | ⭐⭐⭐⭐ |
| `openchat/openchat-7b` | 8K | ⭐⭐⭐⭐ |
| `deepseek/deepseek-coder-33b-instruct` | 16K | ⭐⭐⭐⭐⭐ |

### 3. Alternativas gratuitas

#### Google Gemini (requiere API key)
```javascript
const CHAT_CONFIG = {
  apiEndpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
  // Nota: Requiere API key de Google AI Studio
};
```

#### Groq (muy rápido, gratuito)
```javascript
const CHAT_CONFIG = {
  apiEndpoint: 'https://api.groq.com/openai/v1/chat/completions',
  model: 'llama-3.1-8b-instant',
  // Gratis con alto rate limit
};
```

### 4. Sin API Key (modo demo)

El chatbot incluye respuestas predefinidas para preguntas frecuentes:
- Saludos
- Servicios
- Precios
- Equipo
- Contacto
- Chatbots

---

## Personalización

### Cambiar el prompt del sistema

Edita `js/chatbot.js`:

```javascript
const CHAT_CONFIG = {
  systemPrompt: `Tu prompt personalizado aquí...`
};
```

### Cambiar el modelo

```javascript
const CHAT_CONFIG = {
  model: 'mistralai/mistral-7b-instruct'
};
```

### Agregar más respuestas fallback

Edita la función `getFallbackResponse()` para agregar más casos.

---

## Deploy

```bash
git add .
git commit -m "feat: agregar chatbot multi-agente con OpenRouter"
git push
```

El deploy es automático via Vercel.

---

## Características del Chatbot

- ✅ Widget flotante con animación de pulso
- ✅ Ventana de chat con scroll
- ✅ Indicador de "escribiendo..."
- ✅ Persistencia de mensajes en localStorage
- ✅ Diseño responsive (móvil)
- ✅ Respuestas fallback sin API
- ✅ Integración con OpenRouter (modelos gratuitos)
- ✅ Tema oscuro integrado con el portfolio

---

## Kostenlose APIs (Alternativas)

| Servicio | Link | Free Tier |
|----------|------|-----------|
| OpenRouter | openrouter.ai | $1 gratis/mes |
| Groq | console.groq.com | Alto límite |
| Together AI | together.ai | $5 gratis |
| Cohere | cohere.com | 1000 llamadas/mes |

---

**Desarrollado por:** HC-Backend-Expert  
**Fecha:** 2026-04-06
