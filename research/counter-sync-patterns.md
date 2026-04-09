# Counter & Metrics Sync Patterns — Research Results

> Fuentes: TanStack Query, Zustand, React 19 useOptimistic, PostgreSQL counter cache, SSE

## TOP 5 Patterns (ranked by fit for NexusForge)

### 1. TanStack Query Cascade Invalidation — PRIMARY MECHANISM
- `queryKeys.js` factory with hierarchical keys
- `onMutate`: optimistic update + snapshot for rollback
- `onSettled`: invalidate all related queries in one shot
- One mutation → 5 parallel refetches across pages

### 2. Zustand Event Bus — CROSS-PAGE NOTIFICATIONS
- `useExecutionStore` as global event bus (not data store)
- `notifyRunCompleted(execution)` → triggers TanStack invalidation
- `subscribeWithSelector` for fine-grained re-renders
- Bridges pages that aren't mounted simultaneously

### 3. PostgreSQL Counter Cache — INSTANT KPIs
- `runs_count` column on automations table with trigger
- O(1) read vs O(n) COUNT(*) scan
- Performance: <1ms vs 150ms-3.7s at scale

### 4. useTaskPoller Hook — STAY ON PAGE
- Poll /tasks/{id} every 1.5s
- Show inline progress without navigation
- On complete: cascade invalidate + show result inline

### 5. SSE (Server-Sent Events) — REAL-TIME PROGRESS
- For tasks >3s, push progress updates
- EventSource client in React
- Better than polling for long-running automations

## Implementation Priority for NexusForge

Week 1: queryKeys.js factory + onSettled cascade invalidation
Week 2: Zustand event bus + useTaskPoller (stay on page)
Week 3: Counter cache triggers + materialized view for KPIs

## Full Data Flow

```
User clicks "Run"
  → onMutate: optimistic +1
  → API: POST /automations/{id}/run → task_id
  → useTaskPoller starts (1.5s)
  → Task completes
  → Zustand: notifyRunCompleted()
  → TanStack: invalidate automations, dashboard, executions, analytics
  → All 7-9 pages auto-refetch
  → No manual wiring
```
