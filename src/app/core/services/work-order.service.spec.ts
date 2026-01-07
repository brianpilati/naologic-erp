import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { WorkOrderDocument } from '../models/work-order.model';
import { WorkOrderService } from './work-order.service';

describe('WorkOrderService', () => {
  let service: WorkOrderService;

  const WORK_CENTER_ID = 'wc-1';

  const baseOrder = (
    overrides: Partial<WorkOrderDocument['data']> = {},
    docId = 'wo-1'
  ): WorkOrderDocument => ({
    docId,
    docType: 'workOrder',
    data: {
      name: 'Order',
      workCenterId: WORK_CENTER_ID,
      status: 'open',
      startDate: '2025-01-01',
      endDate: '2025-01-05',
      ...overrides,
    },
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WorkOrderService, provideZonelessChangeDetection()],
    });

    service = TestBed.inject(WorkOrderService);

    // Reset internal state explicitly (no mocks)
    (service as any)._workOrders.set([]);
  });

  // ---------------------------------------
  // Selectors
  // ---------------------------------------

  it('should expose workCenters as a computed signal', () => {
    const centers = service.workCenters();

    expect(Array.isArray(centers)).toBeTrue();
    expect(centers.length).toBeGreaterThan(0);

    // Assert structure to avoid "incidental coverage"
    expect(centers[0]).toEqual(
      jasmine.objectContaining({
        docId: jasmine.any(String),
        docType: 'workCenter',
        data: jasmine.objectContaining({
          name: jasmine.any(String),
        }),
      })
    );
  });

  it('should expose workOrders as a computed signal', () => {
    const order = baseOrder();
    (service as any)._workOrders.set([order]);

    expect(service.workOrders()).toEqual([order]);
  });

  it('should return work orders by work center', () => {
    const order1 = baseOrder({}, 'wo-1');
    const order2 = baseOrder({ workCenterId: 'wc-2' }, 'wo-2');

    (service as any)._workOrders.set([order1, order2]);

    expect(service.workOrdersByCenter(WORK_CENTER_ID)).toEqual([order1]);
  });

  // ---------------------------------------
  // Create
  // ---------------------------------------

  it('should create a work order when no overlap exists', () => {
    const order = baseOrder();

    service.create(order);

    expect(service.workOrders()).toEqual([order]);
  });

  it('should throw when creating an overlapping work order', () => {
    const existing = baseOrder();
    const overlapping = baseOrder(
      { startDate: '2025-01-03', endDate: '2025-01-07' },
      'wo-2'
    );

    (service as any)._workOrders.set([existing]);

    expect(() => service.create(overlapping)).toThrowError(
      'Work order overlaps with an existing order.'
    );
  });

  // ---------------------------------------
  // Update
  // ---------------------------------------

  it('should update an existing work order when no overlap exists', () => {
    const original = baseOrder({}, 'wo-1');
    const updated = baseOrder({ name: 'Updated' }, 'wo-1');

    (service as any)._workOrders.set([original]);

    service.update(updated);

    expect(service.workOrders()).toEqual([updated]);
  });

  it('should throw when updating causes overlap with another order', () => {
    const order1 = baseOrder({}, 'wo-1');
    const order2 = baseOrder(
      { startDate: '2025-01-10', endDate: '2025-01-15' },
      'wo-2'
    );

    const updatedOrder2 = baseOrder(
      { startDate: '2025-01-03', endDate: '2025-01-07' },
      'wo-2'
    );

    (service as any)._workOrders.set([order1, order2]);

    expect(() => service.update(updatedOrder2)).toThrowError(
      'Work order overlaps with an existing order.'
    );
  });

  it('should ignore self when checking overlap during update', () => {
    const order = baseOrder({}, 'wo-1');

    (service as any)._workOrders.set([order]);

    expect(() => service.update(order)).not.toThrow();
  });

  it('should not modify other work orders when updating a specific order', () => {
    const order1: WorkOrderDocument = {
      docId: 'wo-1',
      docType: 'workOrder',
      data: {
        name: 'Original Order 1',
        workCenterId: 'wc-1',
        status: 'open',
        startDate: '2025-01-01',
        endDate: '2025-01-05',
      },
    };

    const order2: WorkOrderDocument = {
      docId: 'wo-2',
      docType: 'workOrder',
      data: {
        name: 'Original Order 2',
        workCenterId: 'wc-1',
        status: 'open',
        startDate: '2025-01-06',
        endDate: '2025-01-10',
      },
    };

    // Force known initial state
    (service as any)._workOrders.set([order1, order2]);

    const updatedOrder1: WorkOrderDocument = {
      ...order1,
      data: {
        ...order1.data,
        name: 'Updated Order 1',
      },
    };

    service.update(updatedOrder1);

    const result = service.workOrders();

    expect(result.find((o) => o.docId === 'wo-1')?.data.name).toBe(
      'Updated Order 1'
    );

    expect(result.find((o) => o.docId === 'wo-2')).toEqual(order2);
  });

  // ---------------------------------------
  // Delete
  // ---------------------------------------

  it('should delete a work order by id', () => {
    const order1 = baseOrder({}, 'wo-1');
    const order2 = baseOrder({}, 'wo-2');

    (service as any)._workOrders.set([order1, order2]);

    service.delete('wo-1');

    expect(service.workOrders()).toEqual([order2]);
  });

  // ---------------------------------------
  // Overlap Detection
  // ---------------------------------------

  it('should detect overlapping date ranges (inclusive)', () => {
    const existing = baseOrder();
    const overlapping = baseOrder(
      { startDate: '2025-01-05', endDate: '2025-01-10' },
      'wo-2'
    );

    (service as any)._workOrders.set([existing]);

    expect(service.hasOverlap(overlapping)).toBeTrue();
  });

  it('should not detect overlap when date ranges do not intersect', () => {
    const existing = baseOrder();
    const nonOverlapping = baseOrder(
      { startDate: '2025-01-06', endDate: '2025-01-10' },
      'wo-2'
    );

    (service as any)._workOrders.set([existing]);

    expect(service.hasOverlap(nonOverlapping)).toBeFalse();
  });

  it('should not detect overlap across different work centers', () => {
    const existing = baseOrder();
    const differentCenter = baseOrder({ workCenterId: 'wc-2' }, 'wo-2');

    (service as any)._workOrders.set([existing]);

    expect(service.hasOverlap(differentCenter)).toBeFalse();
  });

  // ---------------------------------------
  // Draft Creation
  // ---------------------------------------

  it('should create a valid draft work order', () => {
    spyOn(crypto, 'randomUUID').and.returnValue('uuid-123' as any);

    const start = new Date('2025-02-01');
    const end = new Date('2025-02-05');

    const draft = service.createDraft(WORK_CENTER_ID, start, end);

    expect(draft).toEqual({
      docId: 'uuid-123',
      docType: 'workOrder',
      data: {
        name: '',
        workCenterId: WORK_CENTER_ID,
        status: 'open',
        startDate: '2025-02-01',
        endDate: '2025-02-05',
      },
    });
  });
});
