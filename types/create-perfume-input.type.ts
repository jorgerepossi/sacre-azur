export type CreatePerfumeInputType = {
  name: string;
  description: string;
  price: number;
  profit_margin?: number;
  size?: number;
  external_link: string;
  imageFile: File;
  brand_id: string;
  note_ids: string[];
};
