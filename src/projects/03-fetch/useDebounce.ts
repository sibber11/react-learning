// YOUR TURN (step 3). Returns `value`, but only after it has stopped changing for `delayMs`.
//
//   const [query, setQuery] = useState('')
//   const debouncedQuery = useDebounce(query, 400)   // lags behind `query` while typing
//
// This is a legit useEffect: it syncs with an outside system (a timer), so it needs cleanup.

import { useEffect, useState } from "react"

// Vue's version of this is a watch() + setTimeout + clearTimeout, or a debounced ref.
export function useDebounce<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const id = setTimeout(() => {
      setDebounced(value)
    }, delayMs)
    return () => clearTimeout(id);
  }, [value, delayMs])

  return debounced
}
