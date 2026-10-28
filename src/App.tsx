import { Counter } from './projects/01-state-and-lists/Counter'
import { TodoList } from './projects/01-state-and-lists/TodoList'
import { SignupForm } from './projects/02-forms/SignupForm'
import { UserSearch } from './projects/03-fetch/UserSearch'
import { Cart } from './projects/04-context-reducer/Cart'

function App() {
  return (
    <main style={{ maxWidth: 480, margin: '2rem auto', textAlign: 'left' }}>
      <h1>React learning</h1>
      <Counter />
      <TodoList />
      <SignupForm />
      <UserSearch />
      <Cart />
    </main>
  )
}

export default App
