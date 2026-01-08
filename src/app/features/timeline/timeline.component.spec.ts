import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimelineComponent } from './timeline.component';

import { TimelineService } from '../../core/services/timeline.service';
import { WorkOrderService } from '../../core/services/work-order.service';

import { provideZonelessChangeDetection, signal } from '@angular/core';
import { TimelineColumn } from '../../core/models/timeline-column.model';
import { WorkCenterDocument } from '../../core/models/work-center-document.model';
import { WorkOrderDocument } from '../../core/models/work-order.model';
import { TimelineZoomLevelType } from '../../core/types/timeline-zoom-level.type';

describe('TimelineComponent', () => {
  let component: TimelineComponent;
  let fixture: ComponentFixture<TimelineComponent>;

  let workOrderServiceSpy: jasmine.SpyObj<WorkOrderService>;

  const columnsSignal = signal<TimelineColumn[]>([]);

  const timelineServiceMock: Partial<TimelineService> = {
    zoomLevel: signal('day'),
    columns: columnsSignal,
    setZoomLevel: jasmine.createSpy('setZoomLevel'),
    dateToX: jasmine.createSpy('dateToX').and.returnValue(0),
    xToDate: jasmine.createSpy('xToDate').and.returnValue(new Date())
  };

  const mockWorkCenters: WorkCenterDocument[] = [
    { docId: 'wc-1', data: { name: 'Center 1' } } as WorkCenterDocument,
    { docId: 'wc-2', data: { name: 'Center 2' } } as WorkCenterDocument
  ];

  const mockOrder: WorkOrderDocument = {
    docId: 'wo-1',
    data: {
      name: 'Order 1',
      status: 'open',
      startDate: new Date(2025, 0, 1),
      endDate: new Date(2025, 0, 8),
      workCenterId: 'wc-1'
    }
  } as any;

  beforeAll(() => {
    jasmine.clock().install();
  });

  afterAll(() => {
    jasmine.clock().uninstall();
  });

  beforeEach(async () => {
    workOrderServiceSpy = jasmine.createSpyObj<WorkOrderService>('WorkOrderService', [
      'workCenters',
      'workOrders',
      'createDraft',
      'create',
      'update',
      'delete',
      'workOrdersByCenter'
    ]);

    workOrderServiceSpy.workCenters.and.returnValue(mockWorkCenters);
    workOrderServiceSpy.workOrders.and.returnValue([mockOrder]);
    workOrderServiceSpy.workOrdersByCenter.and.returnValue([mockOrder]);

    workOrderServiceSpy.createDraft.and.callFake(
      (workCenterId: string, start: Date, end: Date) =>
        ({
          docId: 'draft',
          data: {
            name: '',
            status: 'open',
            startDate: start,
            endDate: end,
            workCenterId
          }
        }) as any
    );

    await TestBed.configureTestingModule({
      imports: [TimelineComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: TimelineService, useValue: timelineServiceMock },
        { provide: WorkOrderService, useValue: workOrderServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // --------------------------------------------------
  // Derived state
  // --------------------------------------------------

  it('should expose work centers via computed signal', () => {
    expect(component.workCenters()).toEqual(mockWorkCenters);
  });

  it('should expose work orders via computed signal', () => {
    expect(component.workOrders()).toEqual([mockOrder]);
  });

  // --------------------------------------------------
  // Zoom interaction
  // --------------------------------------------------

  it('should forward zoom changes to TimelineService', () => {
    const zoom: TimelineZoomLevelType = 'week';
    component.onZoomChange(zoom);
    expect(timelineServiceMock.setZoomLevel).toHaveBeenCalledWith(zoom);
  });

  // --------------------------------------------------
  // Create flow
  // --------------------------------------------------

  it('should open create panel when creating at a date', () => {
    const date = new Date(2025, 0, 10);

    spyOn(component, 'openPanel').and.callThrough();

    component.onCreateAt(date, 'wc-1');

    expect(workOrderServiceSpy.createDraft).toHaveBeenCalled();
    expect(component.selectedWorkCenterId()).toBe('wc-1');
    expect(component.panelMode()).toBe('create');
    expect(component.selectedWorkOrder()).toBeTruthy();
    expect(component.openPanel).toHaveBeenCalled();
  });

  // --------------------------------------------------
  // Edit flow
  // --------------------------------------------------

  it('should open edit panel for existing order', () => {
    spyOn(component, 'openPanel').and.callThrough();

    component.onEdit(mockOrder);

    expect(component.selectedWorkOrder()).toBe(mockOrder);
    expect(component.selectedWorkCenterId()).toBe('wc-1');
    expect(component.panelMode()).toBe('edit');
    expect(component.openPanel).toHaveBeenCalled();
  });

  // --------------------------------------------------
  // Delete flow
  // --------------------------------------------------

  it('should delete a work order', () => {
    component.onDelete('wo-1');
    expect(workOrderServiceSpy.delete).toHaveBeenCalledWith('wo-1');
  });

  // --------------------------------------------------
  // Save flow
  // --------------------------------------------------

  it('should create a work order when in create mode', () => {
    component.panelMode.set('create');

    spyOn(component, 'closePanel').and.callThrough();

    component.onSave(mockOrder);

    expect(workOrderServiceSpy.create).toHaveBeenCalledWith(mockOrder);
    expect(component.closePanel).toHaveBeenCalled();
  });

  it('should update a work order when in edit mode', () => {
    component.panelMode.set('edit');

    spyOn(component, 'closePanel').and.callThrough();

    component.onSave(mockOrder);

    expect(workOrderServiceSpy.update).toHaveBeenCalledWith(mockOrder);
    expect(component.closePanel).toHaveBeenCalled();
  });

  // --------------------------------------------------
  // Cancel flow
  // --------------------------------------------------

  it('should close panel on cancel', () => {
    spyOn(component, 'closePanel').and.callThrough();
    component.onCancel();
    expect(component.closePanel).toHaveBeenCalled();
  });

  // --------------------------------------------------
  // Panel open animation
  // --------------------------------------------------

  it('should open panel with opening animation flags', () => {
    spyOn(window, 'requestAnimationFrame').and.callFake((cb) => {
      cb(0);
      return 0;
    });

    component.openPanel();

    expect(component.isPanelOpen()).toBeTrue();
    expect(component.isPanelOpening()).toBeFalse();
    expect(component.isPanelClosing()).toBeFalse();
  });

  // --------------------------------------------------
  // Panel close animation
  // --------------------------------------------------

  it('should close panel after animation duration', () => {
    component.isPanelOpen.set(true);
    component.selectedWorkOrder.set(mockOrder);
    component.selectedWorkCenterId.set('wc-1');

    component.closePanel();

    expect(component.isPanelClosing()).toBeTrue();

    jasmine.clock().tick(240);

    expect(component.isPanelOpen()).toBeFalse();
    expect(component.isPanelClosing()).toBeFalse();
    expect(component.selectedWorkOrder()).toBeNull();
    expect(component.selectedWorkCenterId()).toBeNull();
  });

  // --------------------------------------------------
  // Helpers
  // --------------------------------------------------

  it('should return work orders for a given work center', () => {
    const result = component.workOrdersForCenter(mockWorkCenters[0]);
    expect(workOrderServiceSpy.workOrdersByCenter).toHaveBeenCalledWith('wc-1');
    expect(result).toEqual([mockOrder]);
  });
});
