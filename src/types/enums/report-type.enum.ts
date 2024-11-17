export type ReportType = keyof typeof ReportType;
export const ReportType = {
  PRODUCT: 'PRODUCT',
  SERVICE: 'SERVICE',
} as const;
