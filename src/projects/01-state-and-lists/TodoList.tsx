import { useState } from 'react'

// YOUR TURN. Make every handler below work. Do not edit the JSX until the logic works.
//
// Rules for yourself (all from CHEATSHEET.md):
//   1. Never mutate `todos`. No push/splice/todo.done = ... . Build a new array.
//   2. Remaining count is derived: compute it in render, no extra useState, no useEffect.
//   3. Filtered list is derived too.
//   4. Use todo.id as the key, never the array index.
//
// Done when:
//   - Enter or the Add button adds a todo; empty/whitespace-only text is rejected; input clears after add.
//   - Checkbox toggles done; "x" removes the todo.
//   - Filter buttons show All / Active / Done.
//   - "N left" shows the number of not-done todos.

type Todo = {
  id: number
  text: string
  done: boolean
}

type Filter = 'all' | 'active' | 'done'

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: 'Read CHEATSHEET.md', done: true },
    { id: 2, text: 'Build a todo list', done: false },
  ])
  const [text, setText] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
 
  const visibleTodos = filter === 'all' ? todos : todos.filter(todo => (filter === 'done') === todo.done)
  const remaining = todos.filter(t=>!t.done).length

  // Hint: ids need to be unique. Date.now() is fine for this exercise. Why is todos.length not safe?
  // after a todo is deleted the length number will be reused
  function addTodo() {
    const trimmed = text.trim()
    if (trimmed === '') {
      return
    }
    const todo: Todo = {
      id: Date.now(),
      text: trimmed,
      done: false,
    }
    setTodos(prev => [...prev, todo])
    setText('')
  }

  function toggleTodo(id: number) {
    const map = (prev: Todo[]) => prev.map(todo => {
      if (todo.id === id)
        return {...todo, done: !todo.done}
      return todo
    })
    setTodos(map)
  }

  function removeTodo(id: number) {
    setTodos(prev=>prev.filter(t=>t.id !== id))
  }

  return (
    <section>
      <h2>Todos</h2>

      <form
        onSubmit={e => {
          e.preventDefault() // Vue's @submit.prevent
          addTodo()
        }}
      >
        <input value={text} onChange={e => setText(e.target.value)} placeholder="What needs doing?" />
        <button type="submit">Add</button>
      </form>

      <div>
        {(['all', 'active', 'done'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} disabled={filter === f}>
            {f}
          </button>
        ))}
      </div>

      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            <input type="checkbox" checked={todo.done} onChange={() => toggleTodo(todo.id)} />
            <span style={{ textDecoration: todo.done ? 'line-through' : 'none' }}>{todo.text}</span>
            <button onClick={() => removeTodo(todo.id)}>x</button>
          </li>
        ))}
      </ul>

      <p>{remaining} left</p>
    </section>
  )
}
