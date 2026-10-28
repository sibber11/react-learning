import { useEffect, useState } from 'react'
import { searchUsers, type User } from './api'
import { useDebounce } from './useDebounce'


// YOUR TURN. Build it in steps. Do each step, run it, and break it on purpose before moving on.
// api.ts gives you searchUsers(query, signal). Latency is fake and slower for shorter queries.
//
// Step 1  Naive effect. When `query` changes: set loading, call searchUsers, store the users.
//         Pass `new AbortController().signal` for now (a signal that never aborts).
//         REPRODUCE THE BUG: type "john" at normal speed. Wait. The list ends up showing
//         results for "j" while the input says "john". Why? (Answer in a comment.)
//
// Step 2  Fix it with effect cleanup: create the AbortController inside the effect and
//         return () => controller.abort(). In the catch, ignore AbortError (err.name === 'AbortError').
//         Aborted request must NOT set error and must NOT set loading=false: the newer
//         request owns `loading` now. Check the Network tab: earlier requests show "canceled".
//         In dev, <StrictMode> runs the effect twice on mount (mount, cleanup, mount) on purpose.
//         That is not a bug. It exists to catch a missing cleanup.
//
// Step 3  Debounce: implement useDebounce.ts, then search with the debounced query, not `query`.
//         The input must still update instantly. Only the request is delayed.
//
// Step 4  Extract a custom hook useUserSearch(query) in its own file that returns
//         { users, loading, error }. The component then only renders. That is your composable.
//
// Rules for yourself:
//   1. Effect is for talking to the network. Do NOT store anything in state that you can
//      compute during render. (Empty query = no results: is that state, or derived?)
//   2. Dependency array lists everything the effect reads. Let the linter be right.
//   3. Three separate states (users, loading, error) can disagree, e.g. loading AND error.
//      Be able to say how you keep them consistent, or model it as ONE state.
//
// Done when:
//   - Empty or whitespace-only query: no request, no list, hint text shown.
//   - Typing "jo" then "john" quickly never shows results for "jo" after "john" settles.
//   - "Loading..." shows while a request is pending, and only then.
//   - Typing "fail" shows the error message; typing anything else afterwards clears it.
//   - A search with no matches shows "No users match <query>", not an empty list.
//   - Unmounting mid-request (remove <UserSearch /> from App) leaves no console warning
//     and no request running.

export function UserSearch() {
  const [query, setQuery] = useState('')
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // TODO (steps 1-2): useEffect
  const debouncedQuery = useDebounce(query, 400);
  useEffect(()=>{
    const trimmedQuery = debouncedQuery.trim();
    if(trimmedQuery === ''){
      return;
    }
    setLoading(true)
    setError(null)
    const controller = new AbortController()
    
    searchUsers(trimmedQuery, controller.signal).then(apiUsers => {
      setUsers(apiUsers);
      setLoading(false)
    }).catch((e: Error) => {      
      if (e.name !== 'AbortError') {
        setError(e.message)
        setLoading(false)
      }
    })
    
    return () => controller.abort();
    // if we do not use the controller.abort earlier request also lands in serial, in our case, our first request completes last so we see resut of j instead of john.

  }, [debouncedQuery])

  return (
    <section>
      <h2>User search</h2>

      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search users, try 'john' or 'fail'" />

      {!query.trim() && <p>Type to search.</p>}
      {loading && <p>Loading...</p>}
      {error && <p role="alert">Error: {error}</p>}

      <ul>
        {users.map(u => (
          <li key={u.id}>
            {u.firstName} {u.lastName} ({u.email})
          </li>
        ))}
      </ul>

      {/* TODO: "No users match ..." when a finished search found nothing */}
    </section>
  )
}
