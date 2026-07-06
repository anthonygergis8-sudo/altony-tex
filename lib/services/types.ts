export type YarnCategory = 'cotton' | 'polyester' | 'polyester-dty' | 'mixed' | 'viscose' | 'flat' | 'lycra';

export interface YarnType {
  id: string;
  category: YarnCategory;
  name: Record<string, string>;
  description: Record<string, string>;
  availableCounts: string[];
  image: string;
  isAvailable: boolean;
}

export interface YarnCategoryInfo {
  id: YarnCategory;
  name: Record<string, string>;
  image: string;
  gradient: string;
}

export type FabricCategory = 'cotton' | 'linen' | 'silk' | 'wool' | 'velvet' | 'fleece';
export type FabricCollection = 'summer' | 'winter';

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
