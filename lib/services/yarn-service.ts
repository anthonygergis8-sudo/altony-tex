import { YarnCategory, YarnType, YarnCategoryInfo } from './types';
import { supabase, CategoryRow, ProductRow } from '@/lib/supabase';

const convertCategoryToInfo = (row: CategoryRow): YarnCategoryInfo => ({
  id: row.slug as YarnCategory,
  name: row.name,
  image: row.image || '',
  gradient: row.gradient || '',
});

const convertProductToYarnType = (row: ProductRow): YarnType => ({
  id: String(row.id),
  category: row.category_id ? 'cotton' as YarnCategory : 'cotton',
  name: row.name,
  description: row.description || { ar: '', en: '', zh: '' },
  availableCounts: row.available_counts || [],
  image: row.image || '',
  isAvailable: row.is_available !== false,
});

const standardCounts = ['30/1', '40/1', '50/1', '60/1', '80/1', '20/1', '24/1'];

export const YarnService = {
  async getCategories(): Promise<YarnCategoryInfo[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('type', 'yarn')
      .order('id');

    if (error) {
      console.error('Error fetching yarn categories:', error);
      return [];
    }

    return (data as CategoryRow[]).map(convertCategoryToInfo);
  },

  async getCategoryById(categoryId: YarnCategory): Promise<YarnCategoryInfo | null> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', categoryId)
      .eq('type', 'yarn')
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return convertCategoryToInfo(data as CategoryRow);
  },

  async getYarnsByCategory(categoryId: YarnCategory): Promise<YarnType[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', categoryId)
      .eq('type', 'yarn')
      .maybeSingle();

    if (error || !data) {
      return [];
    }

    const categoryIdNum = (data as CategoryRow).id;

    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .eq('category_id', categoryIdNum)
      .eq('type', 'yarn');

    if (productsError || !products) {
      return [];
    }

    return (products as ProductRow[]).map(convertProductToYarnType);
  },

  async getAvailableCounts(categoryId: YarnCategory): Promise<string[]> {
    const yarns = await this.getYarnsByCategory(categoryId);
    const counts = new Set<string>();
    yarns.forEach((y) => y.availableCounts.forEach((c) => counts.add(c)));
    return counts.size > 0 ? Array.from(counts) : standardCounts;
  },

  async getYarnById(yarnId: string): Promise<YarnType | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', parseInt(yarnId, 10))
      .eq('type', 'yarn')
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return convertProductToYarnType(data as ProductRow);
  },
};
