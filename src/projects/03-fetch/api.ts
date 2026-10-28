// Provided. Do not edit.

export type User = {
  id: number
  firstName: string
  lastName: string
  email: string
}

// Rejects as soon as `signal` aborts, same as fetch does. Rejection reason is an AbortError.
function sleep(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal.aborted) return reject(signal.reason)
    const id = setTimeout(resolve, ms)
    signal.addEventListener(
      'abort',
      () => {
        clearTimeout(id)
        reject(signal.reason)
      },
      { once: true },
    )
  })
}

// Fake latency that is SLOWER for SHORTER queries ("j" ~1.3s, "john" ~0.4s).
// That makes the stale-response race happen every time you type, instead of once in a while.
function fakeLatency(query: string) {
  return Math.max(400, 1600 - query.length * 300)
}

export async function searchUsers(query: string, signal: AbortSignal): Promise<User[]> {
  await sleep(fakeLatency(query), signal)

  // Fake failure so you can test your error path: type "fail".
  if (query.toLowerCase() === 'fail') throw new Error('Server exploded (fake)')

  const url = `https://dummyjson.com/users/search?q=${encodeURIComponent(query)}&limit=10&select=id,firstName,lastName,email`
  const res = await fetch(url, { signal })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = (await res.json()) as { users: User[] }
  return data.users
}
