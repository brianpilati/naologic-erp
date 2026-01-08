import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderDocument } from '../../../core/models/work-order.model';
import { TimelineService } from '../../../core/services/timeline.service';
import { WorkOrderBarComponent } from './work-order-bar.component';

describe('WorkOrderBarComponent', () => {
  let fixture: ComponentFixture<WorkOrderBarComponent>;
  let component: WorkOrderBarComponent;
  let timelineService: jasmine.SpyObj<TimelineService>;

  const mockOrder: WorkOrderDocument = {
    docId: 'wo-1',
    data: {
      name: 'Test Order',
      status: 'open',
      workCenterId: 'wc-1',
      startDate: new Date('2025-01-05').toISOString(),
      endDate: new Date('2025-01-07').toISOString()
    }
  } as WorkOrderDocument;

  beforeEach(async () => {
    timelineService = jasmine.createSpyObj<TimelineService>('TimelineService', ['dateToX']);

    await TestBed.configureTestingModule({
      imports: [WorkOrderBarComponent],
      providers: [provideZonelessChangeDetection(), { provide: TimelineService, useValue: timelineService }]
    }).compileComponents();

    fixture = TestBed.createComponent(WorkOrderBarComponent);
    component = fixture.componentInstance;
    component.order = mockOrder;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // --------------------------------------------------
  // Computed layout
  // --------------------------------------------------

  it('should compute leftPx using TimelineService.dateToX with startDate', () => {
    timelineService.dateToX.and.returnValue(96);

    const value = component.leftPx();

    expect(timelineService.dateToX).toHaveBeenCalledTimes(1);
    expect(timelineService.dateToX).toHaveBeenCalledWith(new Date(mockOrder.data.startDate));
    expect(value).toBe(96);
  });

  it('should compute widthPx as difference between inclusive end and start', () => {
    // start -> 48px, end+1day -> 144px → width = 96
    timelineService.dateToX.and.callFake((date: Date) => {
      if (date.toISOString().startsWith('2025-01-05')) {
        return 48;
      }
      return 144;
    });

    const value = component.widthPx();

    expect(timelineService.dateToX).toHaveBeenCalledTimes(2);
    expect(value).toBe(96);
  });

  it('should enforce a minimum width of 24px', () => {
    timelineService.dateToX.and.returnValues(100, 110); // diff = 10

    const value = component.widthPx();

    expect(value).toBe(24);
  });

  // --------------------------------------------------
  // Outputs
  // --------------------------------------------------
  describe('outputs', () => {
    let menuClosed: boolean;
    let trigger: any;

    beforeEach(() => {
      menuClosed = false;
      trigger = {
        closeMenu: () => {
          menuClosed = true;
        }
      } as any;
    });

    it('should emit edit and stop propagation', () => {
      const emitSpy = spyOn(component.edit, 'emit');
      const event = jasmine.createSpyObj<MouseEvent>('MouseEvent', ['stopPropagation']);

      component.onEdit(event, trigger);

      expect(event.stopPropagation).toHaveBeenCalled();
      expect(emitSpy).toHaveBeenCalledTimes(1);
      expect(menuClosed).toBeTrue();
    });

    it('should emit delete and stop propagation', () => {
      const emitSpy = spyOn(component.delete, 'emit');
      const event = jasmine.createSpyObj<MouseEvent>('MouseEvent', ['stopPropagation']);

      component.onDelete(event, trigger);

      expect(event.stopPropagation).toHaveBeenCalled();
      expect(emitSpy).toHaveBeenCalledTimes(1);
      expect(menuClosed).toBeTrue();
    });
  });

  // --------------------------------------------------
  // Getters
  // --------------------------------------------------

  it('should expose name from order', () => {
    expect(component.name).toBe('Test Order');
  });

  it('should expose status from order', () => {
    expect(component.status).toBe('open');
  });
});
