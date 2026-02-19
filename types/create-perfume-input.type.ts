export type CreatePerfumeInputType = {
  name: string;
  description: string;
  price: number;
  profit_margin?: number;
  size?: number;
  external_link: string;
  imageFile: File;
  brand_id: string;
  top_note_ids: string[];
  heart_note_ids: string[];
  base_note_ids: string[];
  family_ids: string[];
};
