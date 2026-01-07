import { provideZonelessChangeDetection, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { WorkCenterDocument } from '../../core/models/work-center-document.model';
import { WorkOrderDocument } from '../../core/models/work-order.model';
import { TimelineService } from '../../core/services/timeline.service';
import { WorkOrderService } from '../../core/services/work-order.service';
import { TimelineComponent } from './timeline.component';

describe('TimelineComponent', () => {
  let component: TimelineComponent;
  let timelineService: jasmine.SpyObj<TimelineService>;
  let workOrderService: jasmine.SpyObj<WorkOrderService>;

  const workCenter: WorkCenterDocument = {
    docId: 'wc-1',
    docType: 'workCenter',
    data: { name: 'Assembly Line' }
  };

  const workOrder: WorkOrderDocument = {
    docId: 'wo-1',
    docType: 'workOrder',
    data: {
      name: 'Test Order',
      workCenterId: 'wc-1',
      status: 'open',
      startDate: '2025-01-01',
      endDate: '2025-01-05'
    }
  };

  beforeEach(() => {
    timelineService = jasmine.createSpyObj<TimelineService>('TimelineService', ['setZoomLevel']);

    workOrderService = jasmine.createSpyObj<WorkOrderService>(
      'WorkOrderService',
      ['create', 'update', 'delete', 'createDraft', 'workOrdersByCenter'],
      {
        workCenters: signal<WorkCenterDocument[]>([workCenter]),
        workOrders: signal<WorkOrderDocument[]>([workOrder])
      }
    );

    TestBed.configureTestingModule({
      imports: [TimelineComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: TimelineService, useValue: timelineService },
        { provide: WorkOrderService, useValue: workOrderService }
      ]
    });

    const fixture = TestBed.createComponent(TimelineComponent);
    component = fixture.componentInstance;
  });

  // --------------------------------------------------
  // Instantiation
  // --------------------------------------------------

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // --------------------------------------------------
  // Computed signals
  // --------------------------------------------------

  it('should expose workCenters from WorkOrderService', () => {
    expect(component.workCenters()).toEqual([workCenter]);
  });

  it('should expose workOrders from WorkOrderService', () => {
    expect(component.workOrders()).toEqual([workOrder]);
  });

  // --------------------------------------------------
  // Zoom change
  // --------------------------------------------------

  it('should forward zoom changes to TimelineService', () => {
    component.onZoomChange('week');
    expect(timelineService.setZoomLevel).toHaveBeenCalledWith('week');
  });

  // --------------------------------------------------
  // Create interaction
  // --------------------------------------------------

  it('should open panel in create mode when creating at a date', () => {
    const draft: WorkOrderDocument = { ...workOrder, docId: 'draft' };

    workOrderService.createDraft.and.returnValue(draft);

    const date = new Date(2025, 0, 1);

    component.onCreateAt(date, 'wc-1');

    expect(workOrderService.createDraft).toHaveBeenCalled();
    expect(component.selectedWorkOrder()).toBe(draft);
    expect(component.selectedWorkCenterId()).toBe('wc-1');
    expect(component.panelMode()).toBe('create');
    expect(component.isPanelOpen()).toBeTrue();
  });

  // --------------------------------------------------
  // Edit interaction
  // --------------------------------------------------

  it('should open panel in edit mode when editing a work order', () => {
    component.onEdit(workOrder);

    expect(component.selectedWorkOrder()).toBe(workOrder);
    expect(component.selectedWorkCenterId()).toBe('wc-1');
    expect(component.panelMode()).toBe('edit');
    expect(component.isPanelOpen()).toBeTrue();
  });

  // --------------------------------------------------
  // Delete interaction
  // --------------------------------------------------

  it('should delete a work order by id', () => {
    component.onDelete('wo-1');
    expect(workOrderService.delete).toHaveBeenCalledWith('wo-1');
  });

  // --------------------------------------------------
  // Save (create branch)
  // --------------------------------------------------

  it('should create a work order when saving in create mode', () => {
    component.panelMode.set('create');
    component.isPanelOpen.set(true);

    component.onSave(workOrder);

    expect(workOrderService.create).toHaveBeenCalledWith(workOrder);
    expect(component.isPanelOpen()).toBeFalse();
    expect(component.selectedWorkOrder()).toBeNull();
  });

  // --------------------------------------------------
  // Save (edit branch)
  // --------------------------------------------------

  it('should update a work order when saving in edit mode', () => {
    component.panelMode.set('edit');
    component.isPanelOpen.set(true);

    component.onSave(workOrder);

    expect(workOrderService.update).toHaveBeenCalledWith(workOrder);
    expect(component.isPanelOpen()).toBeFalse();
    expect(component.selectedWorkOrder()).toBeNull();
  });

  // --------------------------------------------------
  // Cancel / close panel
  // --------------------------------------------------

  it('should close panel on cancel', () => {
    component.isPanelOpen.set(true);
    component.selectedWorkOrder.set(workOrder);
    component.selectedWorkCenterId.set('wc-1');

    component.onCancel();

    expect(component.isPanelOpen()).toBeFalse();
    expect(component.selectedWorkOrder()).toBeNull();
    expect(component.selectedWorkCenterId()).toBeNull();
  });

  // --------------------------------------------------
  // Helper
  // --------------------------------------------------

  it('should return work orders for a given work center', () => {
    workOrderService.workOrdersByCenter.and.returnValue([workOrder]);

    const result = component.workOrdersForCenter(workCenter);

    expect(workOrderService.workOrdersByCenter).toHaveBeenCalledWith('wc-1');
    expect(result).toEqual([workOrder]);
  });
});
