import { Injectable, computed, signal } from '@angular/core';
import { TimelineColumn } from '../models/timeline-column.model';
import { TimelineZoomLevelType } from '../types/timeline-zoom-level.type';

/**
 * A single column rendered in the timeline header/grid.
 */

@Injectable({ providedIn: 'root' })
export class TimelineService {
  // --------------------------------------------------
  // Constants (match Sketch measurements)
  // --------------------------------------------------

  readonly DAY_WIDTH_PX = 48;
  readonly WEEK_WIDTH_PX = 120;
  readonly MONTH_WIDTH_PX = 180;

  // --------------------------------------------------
  // State
  // --------------------------------------------------

  private readonly _zoomLevel = signal<TimelineZoomLevelType>('day');

  /**
   * Visible range is inclusive.
   * Explicit dates keep tests deterministic.
   */
  private readonly _visibleStart = signal<Date>(new Date(2025, 0, 1));
  private readonly _visibleEnd = signal<Date>(new Date(2025, 0, 31));

  // --------------------------------------------------
  // Public selectors
  // --------------------------------------------------

  readonly zoomLevel = computed(() => this._zoomLevel());

  readonly visibleStart = computed(() => this._visibleStart());

  readonly visibleEnd = computed(() => this._visibleEnd());

  /**
   * Timeline header columns based on zoom level.
   */
  readonly columns = computed<TimelineColumn[]>(() => {
    switch (this._zoomLevel()) {
      case 'week':
        return this.buildWeekColumns();
      case 'month':
        return this.buildMonthColumns();
      case 'day':
      default:
        return this.buildDayColumns();
    }
  });

  // --------------------------------------------------
  // Public API
  // --------------------------------------------------

  setZoomLevel(level: TimelineZoomLevelType): void {
    this._zoomLevel.set(level);
  }

  setVisibleRange(start: Date, end: Date): void {
    this._visibleStart.set(start);
    this._visibleEnd.set(end);
  }

  /**
   * Convert a date to an X pixel offset from the visible start.
   */
  dateToX(date: Date): number {
    const daysFromStart =
      (this.startOfDay(date).getTime() -
        this.startOfDay(this._visibleStart()).getTime()) /
      this.MS_PER_DAY;

    return Math.max(0, daysFromStart) * this.dayWidth();
  }

  /**
   * Convert an X pixel offset to a date.
   */
  xToDate(x: number): Date {
    const days = Math.floor(x / this.dayWidth());
    const date = new Date(this._visibleStart());
    date.setDate(date.getDate() + days);
    return date;
  }

  /**
   * Position of today's vertical indicator.
   */
  todayIndicatorX(today = new Date()): number {
    return this.dateToX(today);
  }

  // --------------------------------------------------
  // Column builders
  // --------------------------------------------------

  private buildDayColumns(): TimelineColumn[] {
    const columns: TimelineColumn[] = [];
    let current = new Date(this._visibleStart());

    while (current <= this._visibleEnd()) {
      const start = this.startOfDay(current);
      const end = this.endOfDay(current);

      columns.push({
        startDate: start,
        endDate: end,
        label: current.toISOString().slice(0, 10),
        widthPx: this.DAY_WIDTH_PX,
      });

      current.setDate(current.getDate() + 1);
    }

    return columns;
  }

  private buildWeekColumns(): TimelineColumn[] {
    const columns: TimelineColumn[] = [];
    let current = this.startOfWeek(this._visibleStart());

    while (current <= this._visibleEnd()) {
      const start = new Date(current);
      const end = new Date(current);
      end.setDate(end.getDate() + 6);

      columns.push({
        startDate: start,
        endDate: end,
        label: `Week of ${start.toISOString().slice(0, 10)}`,
        widthPx: this.WEEK_WIDTH_PX,
      });

      current.setDate(current.getDate() + 7);
    }

    return columns;
  }

  private buildMonthColumns(): TimelineColumn[] {
    const columns: TimelineColumn[] = [];
    let current = new Date(
      this._visibleStart().getFullYear(),
      this._visibleStart().getMonth(),
      1
    );

    while (current <= this._visibleEnd()) {
      const start = new Date(current);
      const end = new Date(current.getFullYear(), current.getMonth() + 1, 0);

      columns.push({
        startDate: start,
        endDate: end,
        label: start.toLocaleString('default', {
          month: 'long',
          year: 'numeric',
        }),
        widthPx: this.MONTH_WIDTH_PX,
      });

      current.setMonth(current.getMonth() + 1);
    }

    return columns;
  }

  // --------------------------------------------------
  // Helpers
  // --------------------------------------------------

  private readonly MS_PER_DAY = 1000 * 60 * 60 * 24;

  private dayWidth(): number {
    return this.DAY_WIDTH_PX;
  }

  private startOfDay(date: Date): Date {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  private endOfDay(date: Date): Date {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
  }

  private startOfWeek(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay() || 7; // Monday start
    d.setDate(d.getDate() - day + 1);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  // --------------------------------------------------
  // @upgrade hooks
  // --------------------------------------------------

  // @upgrade: dynamically extend visible range on horizontal scroll
  // @upgrade: virtualize columns for very large ranges
  // @upgrade: support configurable week start (Mon/Sun)
}
