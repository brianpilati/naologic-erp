import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TimelineColumn } from '../../../core/models/timeline-column.model';
import { WorkCenterDocument } from '../../../core/models/work-center-document.model';
import { TimelineService } from '../../../core/services/timeline.service';
import { TimelineGridComponent } from './timeline-grid.component';

describe('TimelineGridComponent', () => {
  let fixture: ComponentFixture<TimelineGridComponent>;
  let component: TimelineGridComponent;
  let timelineService: jasmine.SpyObj<TimelineService>;

  const workCenters: WorkCenterDocument[] = [
    {
      docId: 'wc-1',
      docType: 'workCenter',
      data: { name: 'Center A' }
    },
    {
      docId: 'wc-2',
      docType: 'workCenter',
      data: { name: 'Center B' }
    }
  ];

  const columns: TimelineColumn[] = [
    {
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-01-01'),
      label: '2025-01-01',
      widthPx: 48
    }
  ];

  beforeEach(async () => {
    timelineService = jasmine.createSpyObj<TimelineService>('TimelineService', ['xToDate', 'dateToX']);

    timelineService.xToDate.and.callFake((x: number) => {
      const d = new Date(2025, 0, 1);
      d.setDate(d.getDate() + Math.floor(x / 48));
      return d;
    });

    timelineService.dateToX.and.callFake((_date: Date) => 96);

    await TestBed.configureTestingModule({
      imports: [TimelineGridComponent],
      providers: [provideZonelessChangeDetection(), { provide: TimelineService, useValue: timelineService }]
    }).compileComponents();

    fixture = TestBed.createComponent(TimelineGridComponent);
    component = fixture.componentInstance;

    component.columns = columns;
    component.workCenters = workCenters;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // --------------------------------------------------
  // onMouseMove
  // --------------------------------------------------

  it('should set hoverRowIndex, hoverDate, and hoverX when mouse is over a valid row', () => {
    const gridEl = fixture.debugElement.query(By.css('.timeline-grid')).nativeElement as HTMLElement;

    spyOn(gridEl, 'getBoundingClientRect').and.returnValue({
      top: 0,
      left: 0,
      right: 500,
      bottom: 500,
      width: 500,
      height: 500,
      x: 0,
      y: 0,
      toJSON: () => {}
    });

    const event = new MouseEvent('mousemove', {
      clientX: 96,
      clientY: component.headerHeight + component.rowHeight + 1
    });

    Object.defineProperty(event, 'currentTarget', {
      value: gridEl
    });

    component.onMouseMove(event);

    expect(component.hoverRowIndex()).toBe(1);
    expect(component.hoverDate()).toEqual(new Date(2025, 0, 3));
    expect(component.hoverX()).toBe(96);
  });

  it('should clear hover state when mouse is above rows', () => {
    const gridEl = document.createElement('div');

    spyOn(gridEl, 'getBoundingClientRect').and.returnValue({
      top: 0,
      left: 0,
      right: 500,
      bottom: 500,
      width: 500,
      height: 500,
      x: 0,
      y: 0,
      toJSON: () => {}
    });

    const event = new MouseEvent('mousemove', {
      clientX: 50,
      clientY: component.headerHeight - 10
    });

    Object.defineProperty(event, 'currentTarget', {
      value: gridEl
    });

    component.onMouseMove(event);

    expect(component.hoverRowIndex()).toBeNull();
    expect(component.hoverDate()).toBeNull();
    expect(component.hoverX()).toBeNull();
  });

  it('should clear hover state when rowIndex is out of bounds', () => {
    const gridEl = document.createElement('div');

    spyOn(gridEl, 'getBoundingClientRect').and.returnValue({
      top: 0,
      left: 0,
      right: 500,
      bottom: 500,
      width: 500,
      height: 500,
      x: 0,
      y: 0,
      toJSON: () => {}
    });

    const event = new MouseEvent('mousemove', {
      clientX: 50,
      clientY: component.headerHeight + component.rowHeight * 10
    });

    Object.defineProperty(event, 'currentTarget', {
      value: gridEl
    });

    component.onMouseMove(event);

    expect(component.hoverRowIndex()).toBeNull();
    expect(component.hoverDate()).toBeNull();
    expect(component.hoverX()).toBeNull();
  });

  // --------------------------------------------------
  // onGridClick
  // --------------------------------------------------

  it('should emit createAt when hoverRowIndex and hoverDate are set', () => {
    const emitSpy = spyOn(component.createAt, 'emit');

    component.hoverRowIndex.set(0);
    component.hoverDate.set(new Date('2025-01-02'));

    component.onGridClick();

    expect(emitSpy).toHaveBeenCalledWith({
      date: new Date('2025-01-02'),
      workCenterId: 'wc-1'
    });
  });

  it('should not emit createAt when hoverRowIndex is null', () => {
    const emitSpy = spyOn(component.createAt, 'emit');

    component.hoverRowIndex.set(null);
    component.hoverDate.set(new Date('2025-01-02'));

    component.onGridClick();

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should not emit createAt when hoverDate is null', () => {
    const emitSpy = spyOn(component.createAt, 'emit');

    component.hoverRowIndex.set(0);
    component.hoverDate.set(null);

    component.onGridClick();

    expect(emitSpy).not.toHaveBeenCalled();
  });
});
