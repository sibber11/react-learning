import { useState } from 'react'

// Worked example. Read it, play with it, then do TodoList.tsx yourself.
//
// Vue:   const count = ref(0);  count.value++
// React: const [count, setCount] = useState(0);  setCount(c => c + 1)
export function Counter() {
  const [count, setCount] = useState(0)

  // No computed(): just derive it. This line re-runs on every render, which is fine.
  const double = count * 2

  // Stale closure demo. Click each button once and compare.
  // `count` is a snapshot from this render, so all three calls see the same value.
  function addThreeWrong() {
    setCount(count + 1)
    setCount(count + 1)
    setCount(count + 1)
  }

  // Updater form: each call receives the latest pending value.
  function addThreeRight() {
    setCount(c => c + 1)
    setCount(c => c + 1)
    setCount(c => c + 1)
  }

  return (
    <section>
      <h2>Counter</h2>
      <p>
        count: {count}, double: {double}
      </p>
      <button onClick={() => setCount(c => c + 1)}>+1</button>
      <button onClick={addThreeWrong}>+3 (wrong)</button>
      <button onClick={addThreeRight}>+3 (right)</button>
      <button onClick={() => setCount(0)}>reset</button>
    </section>
  )
}
