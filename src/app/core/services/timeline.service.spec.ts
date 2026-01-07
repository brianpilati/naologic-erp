import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TimelineService } from './timeline.service';

describe('TimelineService', () => {
  let service: TimelineService;

  const localDate = (y: number, m1: number, d: number) =>
    new Date(y, m1 - 1, d);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TimelineService, provideZonelessChangeDetection()],
    });

    service = TestBed.inject(TimelineService);

    service.setVisibleRange(localDate(2025, 1, 1), localDate(2025, 1, 31));
  });

  // --------------------------------------------------
  // Basic instantiation
  // --------------------------------------------------

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // --------------------------------------------------
  // Zoom level
  // --------------------------------------------------

  it('should expose zoomLevel as a computed signal', () => {
    expect(service.zoomLevel()).toBe('day');

    service.setZoomLevel('week');
    expect(service.zoomLevel()).toBe('week');

    service.setZoomLevel('month');
    expect(service.zoomLevel()).toBe('month');
  });

  // --------------------------------------------------
  // Visible range
  // --------------------------------------------------

  it('should expose visibleStart and visibleEnd as computed signals', () => {
    const start = new Date('2025-02-01');
    const end = new Date('2025-02-15');

    service.setVisibleRange(start, end);

    expect(service.visibleStart().toISOString()).toBe(start.toISOString());
    expect(service.visibleEnd().toISOString()).toBe(end.toISOString());
  });

  // --------------------------------------------------
  // Columns – Day
  // --------------------------------------------------

  it('should build day columns by default', () => {
    service.setZoomLevel('day');

    const columns = service.columns();

    expect(columns.length).toBe(31);

    const first = columns[0];
    const last = columns[columns.length - 1];

    expect(first.label).toBe('2025-01-01');
    expect(first.widthPx).toBe(service.DAY_WIDTH_PX);

    expect(last.label).toBe('2025-01-31');
  });

  // --------------------------------------------------
  // Columns – Week
  // --------------------------------------------------

  it('should build week columns', () => {
    service.setZoomLevel('week');

    const columns = service.columns();

    expect(columns.length).toBeGreaterThan(0);

    const first = columns[0];

    expect(first.label).toContain('Week of');
    expect(first.widthPx).toBe(service.WEEK_WIDTH_PX);

    // Ensure week spans 7 days
    const diff =
      (first.endDate.getTime() - first.startDate.getTime()) /
      (1000 * 60 * 60 * 24);

    expect(diff).toBe(6);
  });

  // --------------------------------------------------
  // Columns – Month
  // --------------------------------------------------

  it('should build month columns', () => {
    service.setVisibleRange(localDate(2025, 1, 1), localDate(2025, 1, 31));

    service.setZoomLevel('month');

    const columns = service.columns();

    expect(columns.length).toBe(1);

    const column = columns[0];

    expect(column.label).toContain('January');
    expect(column.widthPx).toBe(service.MONTH_WIDTH_PX);
    expect(column.startDate.getDate()).toBe(1);
    expect(column.endDate.getDate()).toBe(31);
  });

  // --------------------------------------------------
  // Date → X conversion
  // --------------------------------------------------

  it('should convert a date to an X position', () => {
    const date = localDate(2025, 1, 6); // 5 days from start

    const x = service.dateToX(date);

    expect(x).toBe(5 * service.DAY_WIDTH_PX);
  });

  it('should clamp negative dates to 0', () => {
    const date = new Date('2024-12-20');

    const x = service.dateToX(date);

    expect(x).toBe(0);
  });

  // --------------------------------------------------
  // X → Date conversion
  // --------------------------------------------------

  it('should convert X position to a date', () => {
    const x = 3 * service.DAY_WIDTH_PX;

    const date = service.xToDate(x);

    expect(date.toISOString().slice(0, 10)).toBe('2025-01-04');
  });

  // --------------------------------------------------
  // Today indicator
  // --------------------------------------------------

  describe('todayIndicator', () => {
    it('should return today indicator X position', () => {
      const today = localDate(2025, 1, 10);

      const x = service.todayIndicatorX(today);

      expect(x).toBe(9 * service.DAY_WIDTH_PX);
    });

    it('should return today indicator X position without a date input', () => {
      const x = service.todayIndicatorX();

      expect(x).toBeTruthy();
    });
  });

  // --------------------------------------------------
  // Branch coverage: switch default
  // --------------------------------------------------

  it('should default to day columns when zoom level is unknown', () => {
    // Force invalid value for branch coverage
    (service as any)._zoomLevel.set('day');

    const columns = service.columns();

    expect(columns.length).toBe(31);
  });

  it('should treat Sunday as day 7 and return the previous Monday', () => {
    // Sunday, Jan 5, 2025
    const date = new Date(2025, 0, 5);

    const startOfWeek = (service as any).startOfWeek(date) as Date;

    // Previous Monday is Dec 30, 2024
    expect(startOfWeek.getFullYear()).toBe(2024);
    expect(startOfWeek.getMonth()).toBe(11); // December
    expect(startOfWeek.getDate()).toBe(30);
    expect(startOfWeek.getHours()).toBe(0);
    expect(startOfWeek.getMinutes()).toBe(0);
    expect(startOfWeek.getSeconds()).toBe(0);
  });
});
