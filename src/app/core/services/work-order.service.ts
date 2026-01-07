import { computed, Injectable, signal } from '@angular/core';
import { getWorkCenterDocumentData } from '../../../testing/data/work-centers.data';
import { getWorkOrderData } from '../../../testing/data/work-orders.data';
import { WorkCenterDocument } from '../models/work-center-document.model';
import { WorkOrderDocument } from '../models/work-order.model';

/**
 * Handles all work center & work order state.
 * Business rules (overlap detection) live here.
 */
@Injectable({ providedIn: 'root' })
export class WorkOrderService {
  // -------------------------
  // State
  // -------------------------

  private readonly _workCenters = signal<WorkCenterDocument[]>(getWorkCenterDocumentData() as WorkCenterDocument[]);

  private readonly _workOrders = signal<WorkOrderDocument[]>(getWorkOrderData() as WorkOrderDocument[]);

  // -------------------------
  // Public selectors
  // -------------------------

  readonly workCenters = computed(() => this._workCenters());

  readonly workOrders = computed(() => this._workOrders());

  workOrdersByCenter(workCenterId: string): WorkOrderDocument[] {
    return this._workOrders().filter((wo) => wo.data.workCenterId === workCenterId);
  }

  // -------------------------
  // CRUD operations
  // -------------------------

  create(order: WorkOrderDocument): void {
    if (this.hasOverlap(order)) {
      throw new Error('Work order overlaps with an existing order.');
    }

    this._workOrders.update((orders) => [...orders, order]);
  }

  update(order: WorkOrderDocument): void {
    if (this.hasOverlap(order, order.docId)) {
      throw new Error('Work order overlaps with an existing order.');
    }

    this._workOrders.update((orders) => orders.map((o) => (o.docId === order.docId ? order : o)));
  }

  delete(orderId: string): void {
    this._workOrders.update((orders) => orders.filter((o) => o.docId !== orderId));
  }

  // -------------------------
  // Validation
  // -------------------------

  /**
   * Checks whether a work order overlaps another order
   * on the same work center.
   *
   * @param order Work order being created or edited
   * @param excludeId Optional docId to exclude (edit mode)
   */
  hasOverlap(order: WorkOrderDocument, excludeId?: string): boolean {
    const start = new Date(order.data.startDate);
    const end = new Date(order.data.endDate);

    return this._workOrders().some((existing) => {
      if (existing.docId === excludeId) return false;
      if (existing.data.workCenterId !== order.data.workCenterId) return false;

      const existingStart = new Date(existing.data.startDate);
      const existingEnd = new Date(existing.data.endDate);

      return this.dateRangesOverlap(start, end, existingStart, existingEnd);
    });
  }

  /**
   * Inclusive overlap check:
   * [aStart, aEnd] ∩ [bStart, bEnd]
   */
  private dateRangesOverlap(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date): boolean {
    return aStart <= bEnd && bStart <= aEnd;
  }

  // -------------------------
  // Helpers
  // -------------------------

  /**
   * Utility to generate a new work order skeleton
   * (used by create panel).
   */
  createDraft(workCenterId: string, startDate: Date, endDate: Date): WorkOrderDocument {
    return {
      docId: crypto.randomUUID(),
      docType: 'workOrder',
      data: {
        name: '',
        workCenterId,
        status: 'open',
        startDate: startDate.toISOString().slice(0, 10),
        endDate: endDate.toISOString().slice(0, 10)
      }
    };
  }

  // @upgrade: persist work orders to localStorage
  // @upgrade: extract overlap logic into reusable validator
}
