export type StockMovementType = keyof typeof StockMovementType;
export const StockMovementType = {
  ENTRY: 'ENTRY',
  EXIT: 'EXIT',
} as const;
