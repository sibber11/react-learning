// YOUR TURN. Implement a generic useLocalStorage hook (Vue: a composable around a ref + watch).
//
// Rules for yourself (all from CHEATSHEET.md):
//   1. Read storage ONCE, via lazy init: useState(() => read()). Not on every render.
//   2. Writing to storage is a side effect: do it in useEffect, with [key, value] as deps.
//   3. localStorage only holds strings: JSON.stringify on write, JSON.parse on read.
//   4. Never trust storage. Wrap parse in try/catch and fall back to initialValue.
//      Wrap setItem in try/catch too (storage can be full or blocked).
//   5. Return a tuple [value, setValue], same shape as useState, so callers feel no difference.
//
// Done when:
//   - First visit (nothing stored) returns initialValue.
//   - Reload keeps the value.
//   - Corrupt JSON in DevTools > Application > Local Storage does not crash the app.
//   - Stretch: listen to the window 'storage' event so a second tab stays in sync
//     (add the listener in useEffect and remove it in the cleanup).

import { useEffect, useState } from "react"

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  validate?: (value: unknown) => value is T,
) {
  function read(): T {
    try {
      const stored = localStorage.getItem(key)
      if (stored !== null) {
        const parsed: unknown = JSON.parse(stored)
        if (!validate || validate(parsed)) return parsed as T
      }
    } catch {
      // blocked storage or corrupt JSON: fall back to initialValue
    }
    return initialValue
  }

  const [value, setValue] = useState<T>(() => read())

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // storage full or blocked: keep working in memory
    }
  }, [key, value])

  return [value, setValue] as const
}
