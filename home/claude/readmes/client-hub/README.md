# 🏢 ClientHub — Portal de Clientes No-Code con IA

> Portal web completo construido con arquitectura No-Code (Softr + Airtable) sin backend tradicional. Los clientes gestionan proyectos, facturas, tickets y documentos desde un solo lugar, con un asistente IA contextual integrado.

---

## Módulos

| Módulo | Descripción |
|--------|-------------|
| **Proyectos** | Estado, progreso, presupuesto ejercido y fechas de entrega |
| **Facturas** | Historial, montos, estados de pago y descarga en PDF |
| **Soporte** | Tickets con prioridad, estado y formulario para crear nuevos |
| **Documentos** | Archivos descargables organizados por proyecto |

## Asistente IA contextual

El botón "Asistente IA" en el sidebar abre un chat con Claude que tiene acceso al contexto real del cliente:

- Proyectos activos y su estado
- Facturas pendientes con montos
- Tickets abiertos con prioridad

Ejemplos de preguntas que responde:
> *"¿Cuánto tengo pendiente de pago?"*
> *"¿Cuál es el estado de mi app móvil?"*
> *"¿Tengo tickets sin resolver?"*

## Arquitectura No-Code

```
Softr (Frontend visual)
    ↕ API
Airtable (Base de datos)
    ↕ Webhooks
Make.com (Automatizaciones)
    ↕ API
Claude API (Asistente IA)
```

Sin backend propio. Sin servidor que mantener. Desplegado en minutos.

## Instalación (versión React demo)

```bash
git clone https://github.com/christianescamilla15-cell/client-hub-nocode
cd client-hub-nocode
npm install
cp .env.example .env
npm run dev   # http://localhost:3005
```

## Variables de entorno

```env
VITE_ANTHROPIC_API_KEY=sk-ant-...
VITE_AIRTABLE_API_KEY=...
VITE_AIRTABLE_BASE_ID=...
```

## Deploy en producción con Softr

1. Crea una base en Airtable con las tablas: Proyectos, Facturas, Tickets, Documentos
2. Conecta Softr a tu base de Airtable
3. Configura el asistente IA vía webhook de Make.com → Claude API
4. Publica en tu dominio personalizado

## Stack

`Softr` `Airtable` `Make.com` `Claude API` `Stripe` `React (demo)`

---

[![Portfolio](https://img.shields.io/badge/Portfolio-ch65--portfolio-6366F1?style=flat)](https://ch65-portfolio.vercel.app)
