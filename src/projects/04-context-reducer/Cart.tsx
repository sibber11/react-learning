import './Cart.css'
import { CartProvider, useCart } from './CartContext'
import type { CartItem, Product } from './cartReducer'

// YOUR TURN. Build the UI on top of useCart(). Do not edit the reducer from here.
//
// Rules for yourself:
//   1. Components only call dispatch({ type: ... }). No cart logic in the JSX.
//   2. Item count and total are derived in render (reduce over state.items).
//   3. Key list items by id, never by index.
//   4. Split into small components: ProductList and CartView both read the same context.
//
// Done when:
//   - Each product has an "Add" button; clicking again increases qty.
//   - Cart lines show name, qty (with - / + buttons), line price and a remove button.
//   - Footer shows item count, total price and a "Clear" button.
//   - Empty cart shows "Cart is empty".

const PRODUCTS: Product[] = [
  { id: 1, name: 'Keyboard', price: 49 },
  { id: 2, name: 'Mouse', price: 25 },
  { id: 3, name: 'Monitor', price: 199 },
]

function ProductList() {
  const { dispatch } = useCart()
  return (
    <section>
      <h3>Products</h3>
      <ul>
        {PRODUCTS.map(product => (
          <li key={product.id}>
            <span>{product.name}</span>
            <button onClick={() => dispatch({ type: 'add', product })}>Add</button>
          </li>
        ))}
      </ul>
    </section>
  )
}

function CartLine({ item }: { item: CartItem }) {
  const { dispatch } = useCart()
  const setQty = (qty: number) => dispatch({ type: 'setQty', id: item.id, qty })
  return (
    <li>
      <span>{item.name} x {item.qty}</span>
      <button onClick={() => setQty(item.qty - 1)}>-</button>
      <button onClick={() => setQty(item.qty + 1)}>+</button>
      <button onClick={() => dispatch({ type: 'remove', id: item.id })}>remove</button>
      Price: {item.price * item.qty}
    </li>
  )
}

function CartView() {
  const { state, dispatch } = useCart()
  const count = state.items.reduce((sum, item) => sum + item.qty, 0)
  const total = state.items.reduce((sum, item) => sum + item.price * item.qty, 0)

  return (
    <section>
      <h3>Cart</h3>
      {state.items.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        <>
          <ul>
            {state.items.map(item => (
              <CartLine key={item.id} item={item} />
            ))}
          </ul>
          <p>Items: {count}</p>
          <p>Total: {total}</p>
          <button onClick={() => dispatch({ type: 'clear' })}>Clear</button>
        </>
      )}
    </section>
  )
}

export function Cart() {
  return (
    <CartProvider>
      <div className="cart">
        <h2>Cart (context + reducer)</h2>
        <ProductList />
        <CartView />
      </div>
    </CartProvider>
  )
}
