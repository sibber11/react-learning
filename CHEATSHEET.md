# Vue → React Cheatsheet

Written for a Vue 3 (Composition API) developer. Checked against react.dev docs for React 19 (this project: React 19.3, TypeScript, Vite).

## The one mental shift

| | Vue | React |
|---|---|---|
| `setup()` / `<script setup>` | runs **once** per component instance | the whole component function runs on **every render** |
| Reactivity | tracked: Vue knows which refs you read and updates only that | explicit: you call a setter, React re-runs the function and diffs the result |
| State | mutable (`count.value++`) | **immutable**: replace, never mutate (`setCount(c => c + 1)`) |

Everything below follows from this. A React component is a pure function: `(props, state) => JSX`. Locals are recreated each render; state survives because React stores it for you.

## Core mapping

| Vue 3 | React | Notes |
|---|---|---|
| `ref(0)` / `reactive({})` | `const [n, setN] = useState(0)` | No `.value`. Setter replaces the value. Objects/arrays: copy, don't mutate. |
| `count.value++` | `setCount(c => c + 1)` | Use the updater form when the new value depends on the old. |
| `computed(() => a.value * 2)` | `const doubled = a * 2` | Just compute in render. `useMemo` only for measured slowness. |
| `watch(src, cb)` | usually **no effect**: do it in the event handler | See "Effects are not watchers" below. |
| `watchEffect` | `useEffect(() => {...}, [deps])` | For syncing with external systems only. |
| `onMounted` | `useEffect(() => {...}, [])` | |
| `onUnmounted` | cleanup function returned from `useEffect` | |
| `onUpdated` | `useEffect` with deps | |
| `nextTick` | `flushSync` (rare) / `useEffect` / `useLayoutEffect` | Rarely needed. |
| `<template ref="el">` + `el.value` | `const el = useRef<HTMLDivElement>(null)` + `el.current` | Changing a ref does **not** re-render. |
| `defineProps` | function parameter: `function Card({ title }: Props)` | Props are read-only. |
| `defineEmits` / `emit('save', x)` | callback prop: `onSave: (x) => void` | Called as `onSave(x)`. |
| default slot | `children` prop | `<Card>content</Card>` |
| named slots / scoped slots | props that hold JSX / render-prop functions | `header={<h1/>}`, `renderItem={(item) => <li/>}` |
| `provide` / `inject` | `createContext` + `useContext` (or `use`) | Every consumer re-renders when the value changes. |
| composable (`useFoo()`) | custom hook (`useFoo()`) | Same idea. Must start with `use`. Follow the rules of hooks. |
| Pinia store | Context + `useReducer`, or Zustand | Zustand is closest to Pinia in feel. |
| Vue Router | React Router (or TanStack Router) | Separate package. |
| `<Transition>` | CSS transitions / `motion` library | No built-in equivalent. |
| `<Teleport>` | `createPortal(children, domNode)` | From `react-dom`. |
| `<KeepAlive>` | `<Activity>` (newer) | Check current docs before relying on it. |
| `<Suspense>` | `<Suspense>` | Similar, plus `use(promise)`. |
| `defineExpose` | `useImperativeHandle` | Rare. |
| `v-bind="$attrs"` | `{...rest}` spread | `function Btn({ variant, ...rest }) { return <button {...rest} /> }` |

## Template directives → JSX

JSX is JavaScript, not a template language. No directives: use plain JS.

```tsx
// v-if / v-else
{isLoggedIn ? <Dashboard /> : <Login />}
{isAdmin && <AdminPanel />}         // careful: `{count && <X/>}` renders "0" when count is 0

// v-for  (key is required, same reason as :key)
{todos.map(t => <li key={t.id}>{t.text}</li>)}

// v-show
<div style={{ display: open ? 'block' : 'none' }} />

// :class / :style
<div className={clsx('btn', active && 'active')} style={{ color: 'red' }} />

// @click
<button onClick={() => setCount(c => c + 1)} />

// v-model  → controlled input: value + onChange, written by hand
<input value={name} onChange={e => setName(e.target.value)} />

// v-html
<div dangerouslySetInnerHTML={{ __html: html }} />   // name is a warning, sanitize first
```

Other differences:
- `class` → `className`, `for` → `htmlFor`. Events are camelCase (`onClick`, `onChange`).
- `onChange` on an input fires on every keystroke (like Vue's `input`), not on blur.
- Component must return **one root**, or wrap in `<>...</>` (fragment). Vue 3 allows multiple roots, React doesn't.
- Components are capitalized (`<Card />`). Lowercase means HTML element.
- No `.prevent` / `.stop` modifiers: call `e.preventDefault()` yourself.

## Effects are not watchers

Biggest trap for Vue devs. `useEffect` is for **synchronizing with something outside React** (network subscription, DOM API, timer, third-party widget). It is not "run this when X changes".

```tsx
// Bad (Vue habit): derived state via effect, extra render, easy to get out of sync
const [fullName, setFullName] = useState('')
useEffect(() => setFullName(first + ' ' + last), [first, last])

// Good: compute during render
const fullName = first + ' ' + last
```

```tsx
// Bad: reacting to a user action inside an effect
useEffect(() => { if (submitted) post(data) }, [submitted])

// Good: do it in the handler
function onSubmit() { post(data) }
```

Rules of thumb:
- Value derived from props/state → compute in render.
- Caused by a user event → put it in the event handler.
- Reset state when a prop changes → give the component a `key`: `<Profile key={userId} />`.
- Effect left → talking to the outside world, and it needs cleanup:

```tsx
useEffect(() => {
  const id = setInterval(tick, 1000)
  return () => clearInterval(id)   // like onUnmounted, but also runs before re-running
}, [])
```

- **Dependency array must list everything the effect reads.** Don't lie to it. The linter flags missing deps.
- In dev, `<StrictMode>` runs effects twice (mount → cleanup → mount) on purpose to surface missing cleanup. Not a bug.
- Fetching data in raw effects is fragile (race conditions). Prefer TanStack Query, or React Router loaders, once you leave toy examples.

## Other gotchas

1. **Stale closures.** A handler captures the state of the render it was created in. `setCount(count + 1)` three times in a row adds 1, not 3. Use `setCount(c => c + 1)`.
2. **State updates are batched and async.** `setX(5); console.log(x)` logs the old value. New value is visible next render.
3. **Mutation silently fails.** `todos.push(x); setTodos(todos)` does nothing: same reference. Use `setTodos([...todos, x])`, `.filter`, `.map`, or `structuredClone`.
4. **Props destructuring is fine.** Unlike Vue 3, it doesn't lose reactivity, because there is no reactivity system to lose.
5. **Hooks rules:** call only at the top level of a component or custom hook. Never inside `if`, loops, or after an early `return`. React identifies state by call order.
6. **Don't define components inside components.** It creates a new component type each render and resets its state.
7. **Re-render = function re-run, children included.** Re-rendering a parent re-renders all children by default, even if their props didn't change. That is normal and usually fast. `memo`, `useMemo`, `useCallback` are optimizations, not defaults.
8. **React Compiler** (opt-in tool) auto-memoizes, making manual `memo`/`useMemo`/`useCallback` mostly unnecessary. This project does **not** have it enabled; learn without it first.
9. **Keys:** use stable ids, not array index, when the list can reorder.
10. **Not a framework.** Router, data fetching, forms, state management, SSR are all separate choices.

## React 19 specifics

- `ref` is a normal prop for function components. `forwardRef` no longer needed.
- Context can be rendered directly: `<ThemeContext value={theme}>` (no `.Provider`).
- `use(ThemeContext)` or `use(promise)` can read context/promises, and unlike other hooks may be called inside conditionals.
- Form actions: `<form action={fn}>`, `useActionState`, `useFormStatus`, `useOptimistic`.

## TypeScript snippets

```tsx
type CardProps = {
  title: string
  count?: number                        // optional prop
  onSave: (id: number) => void          // "emit"
  children?: React.ReactNode            // default slot
}

function Card({ title, count = 0, onSave, children }: CardProps) {
  const [open, setOpen] = useState(false)               // inferred boolean
  const [user, setUser] = useState<User | null>(null)   // explicit when ambiguous
  const input = useRef<HTMLInputElement>(null)
  return <section>{children}</section>
}
```

Custom hook (≈ composable):

```tsx
function useToggle(initial = false) {
  const [on, setOn] = useState(initial)
  const toggle = () => setOn(v => !v)
  return [on, toggle] as const
}
```

Side by side, a counter:

```vue
<script setup>
import { ref, computed } from 'vue'
const count = ref(0)
const double = computed(() => count.value * 2)
</script>
<template>
  <button @click="count++">{{ count }} x2 = {{ double }}</button>
</template>
```

```tsx
import { useState } from 'react'

export function Counter() {
  const [count, setCount] = useState(0)
  const double = count * 2
  return (
    <button onClick={() => setCount(c => c + 1)}>
      {count} x2 = {double}
    </button>
  )
}
```

## Learning order

1. Components, props, JSX, lists, conditionals
2. `useState` + immutable updates + event handlers
3. Controlled forms
4. `useEffect` (cleanup, deps), and learn when **not** to use it
5. `useRef`, custom hooks
6. Context, `useReducer`
7. React Router, data fetching (TanStack Query)
8. Performance: `memo`/`useMemo`, profiler, then compiler

Reference: https://react.dev/learn (the "You Might Not Need an Effect" page is required reading).
