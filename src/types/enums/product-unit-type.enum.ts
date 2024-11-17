export type ProductUnit = keyof typeof ProductUnit;
export const ProductUnit = {
  UN: 'UN',
  CX: 'CX',
  PCT: 'PCT',
  KG: 'KG',
} as const;
