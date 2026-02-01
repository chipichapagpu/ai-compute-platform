import { TECHNIQUES, Technique, getTechniquesByCategory, getTechniqueBySlug, getRelatedTechniques } from '@/data/optimization-techniques'
import { CATEGORIES, Category, CategoryMeta, getCategoryBySlug } from '@/data/optimization-categories'

export { TECHNIQUES, CATEGORIES }
export type { Technique, Category, CategoryMeta }
export { getTechniquesByCategory, getTechniqueBySlug, getRelatedTechniques, getCategoryBySlug }

// Search techniques by query
export function searchTechniques(query: string): Technique[] {
  const q = query.toLowerCase().trim()
  if (!q) return []

  return TECHNIQUES.filter(t =>
    t.title.toLowerCase().includes(q) ||
    t.summary.toLowerCase().includes(q) ||
    t.slug.includes(q)
  )
}

// Get all techniques with category info
export function getAllTechniquesWithCategory() {
  return TECHNIQUES.map(t => ({
    ...t,
    categoryMeta: getCategoryBySlug(t.category)
  }))
}

// Count techniques per category
export function getTechniqueCounts(): Record<Category, number> {
  const counts: Record<Category, number> = {
    quantization: 0,
    attention: 0,
    'kv-cache': 0,
    batching: 0,
    memory: 0,
    frameworks: 0
  }

  TECHNIQUES.forEach(t => {
    counts[t.category]++
  })

  return counts
}

// Generate breadcrumb items
export function getBreadcrumbs(category?: string, slug?: string) {
  const items = [{ label: 'Optimization', href: '/optimization' }]

  if (category) {
    const cat = getCategoryBySlug(category)
    if (cat) {
      items.push({ label: cat.title, href: `/optimization/${category}` })
    }
  }

  if (slug) {
    const technique = getTechniqueBySlug(slug)
    if (technique) {
      items.push({ label: technique.title, href: `/optimization/${category}/${slug}` })
    }
  }

  return items
}
