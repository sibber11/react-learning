// YOUR TURN. Implement cartReducer so every action below works.
//
// Rules for yourself (all from CHEATSHEET.md):
//   1. A reducer is a pure function: (state, action) => newState. No mutation, no side effects.
//   2. Always return a NEW object/array. Never items.push() or item.qty++.
//   3. Total and item count are derived: compute them in render, do not store them in state.
//   4. Use a `switch (action.type)`. Let TypeScript narrow each case, and make the default
//      branch unreachable (hint: assign `action` to a variable of type `never`).
//
// Done when:
//   - add: new product -> qty 1; product already in cart -> qty + 1.
//   - remove: removes the line entirely.
//   - setQty: sets qty; qty <= 0 removes the line.
//   - clear: empties the cart.

export type Product = {
  id: number
  name: string
  price: number
}

export type CartItem = Product & { qty: number }

export type CartState = {
  items: CartItem[]
}

export type CartAction =
  | { type: 'add'; product: Product }
  | { type: 'remove'; id: number }
  | { type: 'setQty'; id: number; qty: number }
  | { type: 'clear' }

export const initialCart: CartState = { items: [] }

export function cartReducer(state: CartState, action: CartAction): CartState {
  // TODO: handle every action type.
  void action
  return state
}
