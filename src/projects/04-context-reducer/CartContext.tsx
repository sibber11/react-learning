import { createContext, useContext, useMemo, useReducer, type Dispatch, type ReactNode } from 'react'
import { cartReducer, initialCart, type CartAction, type CartState } from './cartReducer'

// YOUR TURN. Share the cart with any component below <CartProvider>.
// Vue mapping: provide/inject (or a Pinia store).
//
// Rules for yourself:
//   1. createContext needs a default; use `null` and make useCart() throw a clear error
//      when it is called outside a provider.
//   2. Provider owns `useReducer(cartReducer, initialCart)` and passes { state, dispatch } down.
//   3. Remember: every consumer re-renders when the context value changes.
//
// Done when:
//   - <CartProvider> wraps children and exposes state + dispatch.
//   - useCart() returns { state, dispatch } with correct types.
//   - useCart() outside the provider throws.

type CartContextValue = {
  state: CartState
  dispatch: Dispatch<CartAction>
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialCart)
  const value = useMemo(() => ({ state, dispatch }), [state])
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (ctx === null) {
    throw new Error('useCart must be used inside <CartProvider>')
  }
  return ctx
}
