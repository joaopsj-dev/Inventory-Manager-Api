export type ServiceStatus = keyof typeof ServiceStatus;
export const ServiceStatus = {
  RECEIVED: 'RECEIVED',
  IN_PROGRES: 'IN_PROGRES',
  COMPLETED: 'COMPLETED',
} as const;
