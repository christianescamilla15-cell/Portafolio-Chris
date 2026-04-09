# Execution Tracking Architecture — Research Results

> Fuentes: Temporal.io, n8n, Inngest, Databricks, ClickHouse, PostgreSQL pg_ivm

## TOP 3 Arquitecturas (rankeadas por fit para NexusForge)

### RANK 1: Unified Polymorphic Execution Table (n8n/Databricks) — ADOPTAR YA
- Una sola tabla `workflow_runs` con columna `execution_type`
- Valores: dag_workflow, automation_run, swarm_run, api_triggered, scheduled_job
- Metadata type-specific en JSONB (no schema changes para nuevos tipos)
- n8n usa `mode` column, Databricks usa `trigger_type`, Inngest usa `function_id`

### RANK 2: Event Sourcing + CQRS (Temporal.io) — PARA v2.0
- Tabla append-only `execution_events` (nunca UPDATE)
- Proyecciones construyen las vistas de lectura
- Audit trail completo, replay posible
- Demasiado heavy para ahora, perfecto cuando >500 runs/día

### RANK 3: Counter Projections (ClickHouse/PostgreSQL triggers) — ADOPTAR YA
- Tabla `user_execution_stats` con contadores pre-computados
- Trigger en PostgreSQL actualiza contadores en cada INSERT/UPDATE
- Dashboard KPIs leen un row, no hacen COUNT(*) en toda la tabla
- De 100-500ms a <1ms por query

## Plan de implementación

### Paso 1 (esta semana): Unified Table (Rank 1)
- Agregar execution_type, automation_id, input_data, output_data, metadata a workflow_runs
- Migrar automation_results → workflow_runs con execution_type='automation_run'
- Crear automation_results como VIEW

### Paso 2 (esta semana): Counter Projections (Rank 3)
- Crear user_execution_stats table
- Trigger AFTER INSERT OR UPDATE en workflow_runs
- Stats Cards leen de user_execution_stats (1 row lookup)

### Paso 3 (futuro): Event Sourcing (Rank 2)
- Cuando runs/día > 500
- execution_events append-only
- workflow_runs se convierte en proyección
