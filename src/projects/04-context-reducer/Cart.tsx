import { CartProvider, useCart } from './CartContext'
import type { Product } from './cartReducer'

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
  // TODO: render PRODUCTS with an Add button that dispatches { type: 'add', product }.
  void dispatch
  void PRODUCTS
  return <section><h3>Products</h3></section>
}

function CartView() {
  const { state, dispatch } = useCart()
  // TODO: render lines, +/- , remove, derived count + total, clear.
  void state
  void dispatch
  return <section><h3>Cart</h3></section>
}

export function Cart() {
  return (
    <CartProvider>
      <h2>Cart (context + reducer)</h2>
      <ProductList />
      <CartView />
    </CartProvider>
  )
}
