import { supabase, ProductRow } from '@/lib/supabase';

export type FabricCollection = 'summer' | 'winter';

export type FabricCategory = 'cotton' | 'linen' | 'silk' | 'wool' | 'velvet' | 'fleece';

export interface FabricType {
  id: string;
  category: FabricCategory;
  collection: FabricCollection;
  name: Record<string, string>;
  description: Record<string, string>;
  composition: Record<string, string>;
  width: string;
  weight: string;
  image: string;
  isAvailable: boolean;
}

export interface FabricCollectionInfo {
  id: FabricCollection;
  name: Record<string, string>;
  image: string;
  gradient: string;
}

const fabricCollections: FabricCollectionInfo[] = [
  {
    id: 'summer',
    name: { ar: 'مجموعة الصيف', en: 'Summer Collection', zh: '夏季系列' },
    image: 'https://images.pexels.com/photos/731872/pexels-photo-731872.jpeg?auto=compress&cs=tinysrgb&w=600',
    gradient: 'from-sky-100 to-cyan-200 dark:from-sky-900/30 dark:to-cyan-800/30',
  },
  {
    id: 'winter',
    name: { ar: 'مجموعة الشتاء', en: 'Winter Collection', zh: '冬季系列' },
    image: 'https://images.pexels.com/photos/1683980/pexels-photo-1683980.jpeg?auto=compress&cs=tinysrgb&w=600',
    gradient: 'from-slate-200 to-neutral-300 dark:from-slate-800/30 dark:to-neutral-700/30',
  },
];

const convertProductToFabricType = (row: ProductRow): FabricType => ({
  id: String(row.id),
  category: extractCategoryFromSlug(row.slug),
  collection: row.collection || 'summer',
  name: row.name,
  description: row.description || { ar: '', en: '', zh: '' },
  composition: row.composition || { ar: '', en: '', zh: '' },
  width: row.width || '',
  weight: row.weight || '',
  image: row.image || '',
  isAvailable: row.is_available !== false,
});

const extractCategoryFromSlug = (slug: string): FabricCategory => {
  if (slug.includes('cotton')) return 'cotton';
  if (slug.includes('linen')) return 'linen';
  if (slug.includes('silk')) return 'silk';
  if (slug.includes('wool')) return 'wool';
  if (slug.includes('velvet')) return 'velvet';
  if (slug.includes('fleece')) return 'fleece';
  return 'cotton';
};

export const FabricService = {
  async getCollections(): Promise<FabricCollectionInfo[]> {
    return fabricCollections;
  },

  async getCollectionById(collectionId: FabricCollection): Promise<FabricCollectionInfo | null> {
    return fabricCollections.find((c) => c.id === collectionId) || null;
  },

  async getFabricsByCollection(collectionId: FabricCollection): Promise<FabricType[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('type', 'fabric')
      .eq('collection', collectionId);

    if (error || !data) {
      console.error('Error fetching fabrics:', error);
      return [];
    }

    return (data as ProductRow[]).map(convertProductToFabricType);
  },

  async getFabricById(fabricId: string): Promise<FabricType | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', parseInt(fabricId, 10))
      .eq('type', 'fabric')
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return convertProductToFabricType(data as ProductRow);
  },
};
