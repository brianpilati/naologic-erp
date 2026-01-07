import { WorkOrderDocument } from '../../app/core/models/work-order.model';

const DATA: WorkOrderDocument[] = [
  // --------------------------------------------------
  // Extrusion Line A (multiple non-overlapping orders)
  // --------------------------------------------------
  {
    docId: 'wo-1',
    docType: 'workOrder',
    data: {
      name: 'Extrude Batch 1001',
      workCenterId: 'wc-1',
      status: 'complete',
      startDate: '2025-01-01',
      endDate: '2025-01-05',
    },
  },
  {
    docId: 'wo-2',
    docType: 'workOrder',
    data: {
      name: 'Extrude Batch 1002',
      workCenterId: 'wc-1',
      status: 'in-progress',
      startDate: '2025-01-07',
      endDate: '2025-01-12',
    },
  },

  // -------------------------
  // CNC Machine 1
  // -------------------------
  {
    docId: 'wo-3',
    docType: 'workOrder',
    data: {
      name: 'Mill Housing A',
      workCenterId: 'wc-2',
      status: 'open',
      startDate: '2025-01-03',
      endDate: '2025-01-06',
    },
  },

  // -------------------------
  // Assembly Station
  // -------------------------
  {
    docId: 'wo-4',
    docType: 'workOrder',
    data: {
      name: 'Assemble Frame X',
      workCenterId: 'wc-3',
      status: 'blocked',
      startDate: '2025-01-05',
      endDate: '2025-01-10',
    },
  },
  {
    docId: 'wo-5',
    docType: 'workOrder',
    data: {
      name: 'Assemble Frame Y',
      workCenterId: 'wc-3',
      status: 'open',
      startDate: '2025-01-12',
      endDate: '2025-01-16',
    },
  },

  // -------------------------
  // Quality Control
  // -------------------------
  {
    docId: 'wo-6',
    docType: 'workOrder',
    data: {
      name: 'Inspect Batch 1001',
      workCenterId: 'wc-4',
      status: 'complete',
      startDate: '2025-01-06',
      endDate: '2025-01-07',
    },
  },

  // -------------------------
  // Packaging Line
  // -------------------------
  {
    docId: 'wo-7',
    docType: 'workOrder',
    data: {
      name: 'Package Order A',
      workCenterId: 'wc-5',
      status: 'open',
      startDate: '2025-01-08',
      endDate: '2025-01-11',
    },
  },
  {
    docId: 'wo-8',
    docType: 'workOrder',
    data: {
      name: 'Package Order B',
      workCenterId: 'wc-5',
      status: 'complete',
      startDate: '2025-01-13',
      endDate: '2025-01-15',
    },
  },
];

export function getWorkOrderData(
  index?: number,
  asArray = false
): WorkOrderDocument | WorkOrderDocument[] {
  if (index !== undefined && index >= 0 && index < DATA.length) {
    const item = structuredClone(DATA[index]);
    return asArray ? [item] : item;
  }

  return structuredClone(DATA);
}
