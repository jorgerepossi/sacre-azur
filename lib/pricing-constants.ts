// Factores de ajuste por tamaño
// Se aplican DESPUÉS del profit margin para compensar costos operativos
export const SIZE_FACTORS = {
  10: 1.08, // Tamaño base (sin ajuste)
  5: 1.13, // 8% más caro por ml (packaging, trabajo)
  3: 1.18, // 18% más caro por ml
  2.5: 1.2, // 17% más caro por ml (mayor desperdicio, más trabajo)
  2: 1.25, // 25% más caro por ml
  1.2: 1.4, // 40% más caro por ml (viales chicos)
} as const;

export type SizeML = keyof typeof SIZE_FACTORS;

// Fuente única de verdad para el cálculo de precio de un decant.
// Usada tanto en el cliente (preview de precio) como en el server
// (recálculo autoritativo al crear una orden) para que nunca diverjan.
export const calculateDecantPrice = (
  basePrice: number,
  profitMargin: number,
  sizeInMl: number,
  isDecantSeller: boolean,
): number => {
  if (!basePrice) return 0;

  if (!isDecantSeller) return basePrice;

  const priceWithProfit = basePrice * (1 + profitMargin / 100);
  const pricePerMl = priceWithProfit / 100;
  const sizeFactor = SIZE_FACTORS[sizeInMl as SizeML] || 1.0;
  return Math.round(pricePerMl * sizeInMl * sizeFactor);
};
