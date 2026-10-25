import type { Product } from './types'

export const SAMPLE_IMAGE_PRODUCTS: Product[] = [
  {
    id: 1,
    sku: 'SKU-10940-EX',
    title: 'Heavy Duty Steel Gear',
    thumbnail:
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=80&h=80&fit=crop',
    category: 'Machinery Parts',
    price: 45.0,
    stock: 124,
    description: 'Precision milled high-tensile steel spur gear.',
    location: 'Aisle 3-B',
    status: 'in-stock',
  },
  {
    id: 2,
    sku: 'SKU-3904-B',
    title: 'Brass Ball Valve 2"',
    thumbnail:
      'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=80&h=80&fit=crop',
    category: 'Plumbing & Piping',
    price: 18.5,
    stock: 12,
    description: 'Industrial duty quarter-turn brass ball valve.',
    location: 'Aisle 12-C',
    status: 'low-stock',
  },
  {
    id: 3,
    sku: 'SKU-7210-Y',
    title: 'Industrial Cable Roll',
    thumbnail:
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=80&h=80&fit=crop',
    category: 'Electrical',
    price: 120.0,
    stock: 0,
    description: 'Heavy gauge multi-conductor copper wiring roll.',
    location: 'Aisle 8-A',
    status: 'out-of-stock',
  },
  {
    id: 4,
    sku: 'SKU-1049-M',
    title: 'Cardboard Shipping Box (L)',
    thumbnail:
      'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=80&h=80&fit=crop',
    category: 'Packaging',
    price: 1.2,
    stock: 1450,
    description: 'Double-walled corrugated shipping container.',
    location: 'Aisle 15-F',
    status: 'in-stock',
  },
  {
    id: 5,
    sku: 'SKU-9284-K',
    title: 'Vented Safety Helmet (Yellow)',
    thumbnail:
      'https://images.unsplash.com/photo-1578873375969-d705c120092c?w=80&h=80&fit=crop',
    category: 'Safety Gear',
    price: 24.99,
    stock: 42,
    description: 'OSHA compliant high-impact protective hard hat.',
    location: 'Aisle 1-A',
    status: 'low-stock',
  },
  {
    id: 6,
    sku: 'SKU-4059-W',
    title: 'Galvanized Steel Tubing',
    thumbnail:
      'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=80&h=80&fit=crop',
    category: 'Raw Materials',
    price: 15.75,
    stock: 310,
    description: 'Corrosion resistant structural round steel tubing.',
    location: 'Yard-B',
    status: 'in-stock',
  },
  {
    id: 7,
    sku: 'SKU-5830-L',
    title: 'Multi-Purpose Hand Tool',
    thumbnail:
      'https://images.unsplash.com/photo-1581147036324-c17ac41dfa6c?w=80&h=80&fit=crop',
    category: 'Hardware & Tools',
    price: 32.0,
    stock: 8,
    description: 'Ergonomic hardened steel combo hand tool.',
    location: 'Aisle 2-E',
    status: 'backordered',
  },
]

