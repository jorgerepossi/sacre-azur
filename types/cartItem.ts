

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size: number;
  image: string;
  profit_margin: number;
}
export interface GetTotal {
  name: string;
  size: number;
  quantity: number;
  total: number;
}
