import './RecentlyViewed.css'
import { PRODUCTS, type Product } from './products'
import { useLocalStorage } from './useLocalStorage'

// YOUR TURN. Build the UI on top of useLocalStorage.
//
// Rules for yourself:
//   1. Store product IDS only (number[]), not whole objects. Look products up from PRODUCTS
//      in render, so name/price are never stale.
//   2. Newest first, no duplicates, capped at MAX_RECENT. Viewing a product already in the
//      list moves it to the front.
//   3. Keep the "add to recent" logic in one small pure function (easy to reason about),
//      and pass it to setIds with the functional form: setIds(prev => ...).
//   4. A stored id may no longer exist in PRODUCTS (catalog changed). Skip it, don't crash.
//   5. Key list items by id.
//
// Done when:
//   - Clicking a product "views" it and it appears first in the Recently viewed list.
//   - Viewing the same product again moves it to the front, no duplicate.
//   - List never exceeds MAX_RECENT.
//   - Reload keeps the list.
//   - "Clear" button empties the list and the storage entry.
//   - Empty list shows "Nothing viewed yet".

const STORAGE_KEY = 'recently-viewed'
const MAX_RECENT = 5

function ProductGrid({ onView }: { onView: (product: Product) => void }) {
  // TODO: render PRODUCTS, each clickable, calling onView(product).
  void onView
  void PRODUCTS
  return <section><h3>Products</h3></section>
}

function RecentList({ ids, onClear }: { ids: number[]; onClear: () => void }) {
  // TODO: map ids -> products, render them, show empty state, add Clear button.
  void ids
  void onClear
  return <section><h3>Recently viewed</h3></section>
}

export function RecentlyViewed() {
  const [ids, setIds] = useLocalStorage<number[]>(STORAGE_KEY, [])
  // TODO: handleView(product) uses setIds(prev => ...) with MAX_RECENT; handleClear resets to [].
  void setIds
  void MAX_RECENT
  return (
    <div className="recent">
      <ProductGrid onView={() => {}} />
      <RecentList ids={ids} onClear={() => {}} />
    </div>
  )
}
