export interface Brand {
  id: string;
  name: string;
  active: boolean;
  image?: string;
  tenant_id: string;
}

export interface PerfumeNote {
  id: number;
  name: string;
}

export interface PerfumeNoteRelation {
  note_id: number;
  perfume_notes: Pick<PerfumeNote, "id" | "name">;
}

export interface Perfume {
  id: string;
  name: string;
  brand: Brand;
  image: string;
  price: number;
  description: string;
  external_link?: string;
  brand_id?: string;
  in_stock: boolean;
  profit_margin: number;
  perfume_note_relation?: PerfumeNoteRelation[];
  tenant_id: string;
  tenant_product_id?: string;
}

export interface PerfumeWithDetails extends Perfume {
  perfume_note_relation: Array<{
    note_id: number;
    perfume_notes: {
      id: number;
      name: string;
    };
  }>;
}
