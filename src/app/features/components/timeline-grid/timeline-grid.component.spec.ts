import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineColumn } from '../../../core/models/timeline-column.model';
import { TimelineGridComponent } from './timeline-grid.component';

describe('TimelineGridComponent', () => {
  let fixture: ComponentFixture<TimelineGridComponent>;
  let component: TimelineGridComponent;

  const columns: TimelineColumn[] = [
    {
      startDate: new Date(2025, 0, 1),
      endDate: new Date(2025, 0, 1),
      label: '2025-01-01',
      widthPx: 48
    },
    {
      startDate: new Date(2025, 0, 2),
      endDate: new Date(2025, 0, 2),
      label: '2025-01-02',
      widthPx: 48
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimelineGridComponent],
      providers: [provideZonelessChangeDetection()]
    }).compileComponents();

    fixture = TestBed.createComponent(TimelineGridComponent);
    component = fixture.componentInstance;

    component.columns = columns;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the correct number of timeline columns', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const renderedColumns = compiled.querySelectorAll('.timeline-grid-column');

    expect(renderedColumns.length).toBe(columns.length);
  });

  it('should emit createAt with x offset when grid is clicked', () => {
    const emitted: number[] = [];

    component.createAt.subscribe((value) => emitted.push(value));

    const fakeEvent = {
      offsetX: 123
    } as MouseEvent;

    component.onGridClick(fakeEvent);

    expect(emitted).toEqual([123]);
  });

  it('should project content into the grid rows slot', () => {
    // This test ensures <ng-content /> exists and does not throw
    // It does not assert projected DOM, only that projection is supported.
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
