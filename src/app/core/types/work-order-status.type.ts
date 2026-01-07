export const WorkOrderStatusTypes = {
  Open: 'open',
  InProgress: 'in-progress',
 Complete: 'complete',
  Blocked: 'blocked',
} as const;

export type WorkOrderStatusType = (typeof WorkOrderStatusTypes)[keyof typeof WorkOrderStatusTypes];
