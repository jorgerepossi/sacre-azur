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
