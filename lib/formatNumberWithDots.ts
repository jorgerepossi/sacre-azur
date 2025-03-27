export function formatNumberWithDots(value: number | undefined | null): string {
  if (typeof value !== "number" || isNaN(value)) return "0";
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
