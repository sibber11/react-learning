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
  return <section><h3>Products</h3>
    {PRODUCTS.map(product=><ProductCard key={product.id} product={product} onView={onView}/>)}
  </section>
}

function RecentList({ ids, onClear }: { ids: number[]; onClear: () => void }) {
  const products = ids
    .map(id => PRODUCTS.find(p => p.id === id))
    .filter((p): p is Product => p !== undefined)
  return <section>
    <h3>Recently viewed <button onClick={onClear}>Clear</button></h3>
    {products.length > 0
      ? <ul>{products.map(product => <li key={product.id}><ProductLabel product={product} /></li>)}</ul>
      : <p>Nothing viewed yet</p>}
  </section>
}

function isIdList(value: unknown): value is number[] {
  return Array.isArray(value) && value.every(v => typeof v === 'number')
}

export function RecentlyViewed() {
  const [ids, setIds] = useLocalStorage<number[]>(STORAGE_KEY, [], isIdList)
  function handleView(product: Product) {
    setIds(oldIds => [product.id, ...oldIds.filter(id => id !== product.id)].slice(0, MAX_RECENT))
  }
  function handleClear() {
    setIds([]);
  }
  return (
    <div className="recent">
      <ProductGrid onView={handleView} />
      <RecentList ids={ids} onClear={handleClear} />
    </div>
  )
}

function ProductLabel({ product }: { product: Product }) {
  return <>
    <span>{product.name}</span>
    <span> - </span>
    <span>{product.price}</span>
  </>
}

function ProductCard({ product, onView }: { product: Product; onView: (product: Product) => void }) {
  return <button onClick={() => onView(product)}>
    <ProductLabel product={product} />
  </button>
}