export type ServiceStatus = keyof typeof ServiceStatus;
export const ServiceStatus = {
  RECEIVED: 'RECEIVED',
  IN_PROGRES: 'IN_PROGRES',
  COMPLETED: 'COMPLETED',
} as const;

export type PaymentStatus = keyof typeof PaymentStatus;
export const PaymentStatus = {
  TOTAL: 'TOTAL',
  PARTIAL: 'PARTIAL',
} as const;
