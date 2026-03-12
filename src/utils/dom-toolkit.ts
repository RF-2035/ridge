/**
 * DOMToolkit - Simplified
 */

export const DOMToolkit = {
  query(selector: string | string[], options: { all?: boolean; shadow?: boolean; filter?: (el: Element) => boolean; parent?: Node } = {}): Element | Element[] | null {
    const { all = false, shadow = false, filter, parent = document } = options
    const selectors = Array.isArray(selector) ? selector : [selector]
    
    const results: Element[] = []
    const seen = new Set<Element>()

    const search = (root: Node | ShadowRoot) => {
      for (const s of selectors) {
        const found = (root as any).querySelectorAll(s)
        for (const el of Array.from(found) as Element[]) {
          if (seen.has(el)) continue
          if (filter && !filter(el)) continue
          seen.add(el)
          results.push(el)
          if (!all) return true
        }
      }

      if (shadow) {
        const elements = (root as any).querySelectorAll("*")
        for (const el of Array.from(elements) as Element[]) {
          if (el.shadowRoot) {
            if (search(el.shadowRoot) && !all) return true
          }
        }
      }
      return false
    }

    search(parent)
    
    if (all) return results
    return results.length > 0 ? results[0] : null
  }
}
