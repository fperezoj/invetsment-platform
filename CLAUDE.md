# Investment Platform — Contexto para Claude

Plataforma web para asesores de inversión independientes. Frontend en
**React + TypeScript + Tailwind CSS** con datos mock; el backend se conectará
en fase 2.

---

## Stack técnico

| Capa            | Tecnología                                      |
|-----------------|-------------------------------------------------|
| Framework       | React 18 + Vite 5                               |
| Tipado          | TypeScript 5 (strict)                           |
| Estilos         | Tailwind CSS 3 + clsx / tailwind-merge          |
| Routing         | React Router 6 (layout anidado con `<Outlet>`)  |
| Gráficas        | Recharts                                        |
| Iconos          | Lucide React                                    |
| Alias de imports| `@/` → `src/`                                   |

Arrancar: `npm run dev` · Build: `npm run build`

---

## Módulos principales

| Ruta                    | Módulo              | Descripción                                        |
|-------------------------|---------------------|----------------------------------------------------|
| `/`                     | Dashboard           | KPIs, lista de clientes, acciones rápidas          |
| `/kyc`                  | KYC                 | Cuestionario de perfil de riesgo con scoring       |
| `/benchmark-saa`        | Benchmark SAA       | Optimizador y presentación del SAA al cliente      |
| `/mesa-dinero`          | Mesa de Dinero      | Vistas tácticas auto-balanceadas por bloque        |
| `/optimizador-tactico`  | Optimizador Táctico | Propuesta de trades por cliente                    |
| `/ips`                  | IPS                 | Generación y edición del Investment Policy Statement|

Cada módulo tiene su carpeta en `src/modules/<nombre>/` con la página principal
(`<Nombre>Page.tsx`). Los componentes reutilizables van en `src/components/`.

---

## Taxonomía de clases de activo

Esta es la taxonomía **canónica** del negocio. Actualizar `src/data/assetClasses.ts`
y `src/types/index.ts` para que reflejen exactamente estos IDs y categorías:

| ID              | Nombre de negocio          | Categoría (`AssetClass.category`) |
|-----------------|----------------------------|-----------------------------------|
| `rvl`           | RV Local                   | `renta_variable`                  |
| `rvi_des`       | RVI Desarrollada           | `renta_variable`                  |
| `rvi_em`        | RVI Emergente              | `renta_variable`                  |
| `alt_local`     | Alt. Local                 | `alternativos`                    |
| `alt_int`       | Alt. Internacional         | `alternativos`                    |
| `rfl`           | RF Local                   | `renta_fija`                      |
| `rfi_hg`        | RFI High Grade             | `renta_fija`                      |
| `rfi_hy`        | RFI High Yield             | `renta_fija`                      |
| `cash`          | Cash / Fondeo              | `efectivo`                        |

> **Nota:** Los datos mock actuales usan IDs legacy (`acciones_mx`, `bonos_usd`, etc.).
> Migrar en un solo paso cuando se actualicen los datos; no mezclar taxonomías.

---

## Regla de auto-balance — Mesa de Dinero

Las vistas tácticas operan **por bloque** (una por clase de activo). La suma de
todas las desviaciones (`magnitude` en pp) sobre el SAA **debe ser cero** después
de cada edición:

```
Σ magnitude_i = 0   para todo TacticalPortfolio
```

**Lógica de compensación automática:**

1. El usuario edita la vista de un bloque (p. ej. `rvl`: +3 pp).
2. El sistema distribuye −3 pp proporcionalmente entre los bloques restantes
   que tengan `view !== 'neutral'` o, si no hay ninguno, los reduce en partes iguales.
3. Si el reparto deja algún bloque fuera de sus límites `[minWeight, maxWeight]`,
   se recalcula clampando al límite y redistribuyendo el residuo.
4. El resultado final debe tener suma = 0 antes de permitir guardar o publicar.

Implementar este algoritmo en `src/lib/rebalance.ts` (a crear). La UI muestra
un indicador de desbalance en tiempo real mientras el usuario edita.

---

## Optimizador Táctico — modelo conceptual

El backend usará **cvxpy** para resolver:

```
min  (w - w_target)' Σ (w - w_target)
s.t. Σ w_i = 1
     w_lb_i ≤ w_i ≤ w_ub_i
     |w_i - w_saa_i| ≤ maxDesvio_i
```

En el **frontend** (fase 1) se simula con JavaScript puro:

- `targetWeight` = `saaPeso + magnitude` (vista táctica del bloque).
- `deltaWeight` = `targetWeight - currentWeight`.
- Trade propuesto si `|deltaWeight| > umbralRebalanceo` (default: 0.5 pp).
- Estimación de monto: `|deltaWeight / 100| × totalValue`.
- Lógica ubicada en `src/lib/optimizer.ts` (a crear cuando se extienda).

No acoplar la UI directamente a cálculos de optimización; siempre pasar por
funciones puras en `src/lib/`.

---

## Convención de naming

| Contexto                         | Idioma   | Ejemplos                                      |
|----------------------------------|----------|-----------------------------------------------|
| Variables / tipos de negocio     | Español  | `perfil`, `vistaTactica`, `pesoObjetivo`      |
| Código (funciones, props, hooks) | Inglés   | `computeTrades`, `selectedClientId`, `onSave` |
| Rutas de archivo                 | Inglés   | `BenchmarkPage.tsx`, `rebalance.ts`           |
| Labels visibles al usuario       | Español  | `"Sobreponderar"`, `"Perfil de Riesgo"`       |
| Comentarios en lógica compleja   | Inglés   | `// distribute residual proportionally`       |

---

## Datos mock (fase 1)

Todos los datos viven en `src/data/`. **No hacer fetch de red** hasta fase 2.

| Archivo                   | Contenido                                              |
|---------------------------|--------------------------------------------------------|
| `assetClasses.ts`         | Catálogo de clases de activo con colores               |
| `benchmarks.ts`           | SAA por cada perfil de riesgo (pesos, min, max, stats) |
| `clients.ts`              | 5 clientes con AUM, perfil y asesor                    |
| `kyc.ts`                  | 8 preguntas, opciones, función `scoreToProfile()`      |
| `tacticalPortfolio.ts`    | Vista táctica publicada Q1 2025                        |
| `portfolios.ts`           | Posiciones actuales y objetivo por cliente             |
| `ips.ts`                  | Documento IPS con secciones editables                  |

Al conectar el backend (fase 2), reemplazar las importaciones directas por
hooks (`useBenchmarks()`, `useClients()`, etc.) sin tocar los componentes de UI.

---

## Perfiles de riesgo y scoring KYC

8 preguntas, 1–5 puntos cada una (mínimo: 8, máximo: 40):

| Puntaje  | Perfil        |
|----------|---------------|
| 8 – 14   | Conservador   |
| 15 – 20  | Moderado      |
| 21 – 26  | Balanceado    |
| 27 – 32  | Crecimiento   |
| 33 – 40  | Agresivo      |

Función en `src/data/kyc.ts`: `scoreToProfile(score: number): RiskProfile`.

---

## Componentes UI compartidos

Todos en `src/components/ui/`. No instalar librerías de componentes externas;
construir sobre Tailwind + Headless UI si se necesita accesibilidad avanzada.

| Componente  | Props clave                                                  |
|-------------|--------------------------------------------------------------|
| `Button`    | `variant` (primary/secondary/ghost/danger), `size` (sm/md/lg)|
| `Card`      | Composición: `Card > CardHeader > CardTitle + CardContent`   |
| `Badge`     | `variant` (default/success/warning/danger/info), `style`     |
| `StatCard`  | `label`, `value`, `sub`, `trend` (up/down/neutral)           |

---

## Decisiones de arquitectura

- **Sin Redux / Zustand por ahora.** Estado local con `useState` + props drilling.
  Si el estado crece, usar React Context antes de añadir una librería externa.
- **Sin React Query por ahora.** Los datos mock se importan directamente.
  Al conectar el backend, introducir TanStack Query.
- **Recharts** para todas las gráficas. No mezclar con otras librerías de charts.
- **Funciones puras** para toda lógica de negocio (rebalanceo, optimización,
  scoring KYC) en `src/lib/`. Los componentes solo consumen resultados.
- **Build limpio requerido** (`tsc && vite build` sin errores) antes de cada commit.
