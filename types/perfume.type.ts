export interface Brand {
  id: string;
  name: string;
  active: boolean;
  slug: string;
  image?: string;
}

export interface PerfumeNote {
  id: number;
  name: string;
}

export interface PerfumeNoteRelation {
  note_id: number;
  note_type?: "top" | "heart" | "base";
  perfume_notes: Pick<PerfumeNote, "id" | "name">;
}

export interface OlfactiveFamily {
  id: number;
  name: string;
  description?: string;
}

export interface PerfumeFamilyRelation {
  family_id: number;
  olfactive_families: Pick<OlfactiveFamily, "id" | "name">;
}

export interface Perfume {
  id: string;
  name: string;
  description?: string;
  image?: string;
  external_link?: string;
  created_at?: string;
  brand: Brand;
  perfume_note_relation?: PerfumeNoteRelation[];
  perfume_family_relation?: PerfumeFamilyRelation[];
  price?: number;
  profit_margin?: number;
  size?: number;
  product_type?: "decant" | "perfume";
  in_stock?: boolean;
  is_active?: boolean;
  tenant_id?: string;
  tenant_product_id?: string;
}

export interface PerfumeWithDetails extends Perfume {
  perfume_note_relation: Array<{
    note_id: number;
    note_type: "top" | "heart" | "base";
    perfume_notes: {
      id: number;
      name: string;
    };
  }>;
  perfume_family_relation: Array<{
    family_id: number;
    olfactive_families: {
      id: number;
      name: string;
    };
  }>;
}

export interface CatalogPerfume {
  id: string;
  name: string;
  description?: string;
  image?: string;
  external_link?: string;
  created_at?: string;
  brand: Brand;
  perfume_note_relation?: PerfumeNoteRelation[];
  perfume_family_relation?: PerfumeFamilyRelation[];
}