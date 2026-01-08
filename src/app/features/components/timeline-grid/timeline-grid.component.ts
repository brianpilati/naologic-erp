import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';

import { TimelineColumn } from '../../../core/models/timeline-column.model';
import { WorkCenterDocument } from '../../../core/models/work-center-document.model';
import { TimelineService } from '../../../core/services/timeline.service';

@Component({
  selector: 'erp-timeline-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timeline-grid.component.html',
  styleUrls: ['./timeline-grid.component.scss']
})
export class TimelineGridComponent {
  /**
   * Timeline columns (day / week / month)
   */
  @Input({ required: true }) columns!: TimelineColumn[];
  @Input({ required: true }) workCenters!: WorkCenterDocument[];
  hoverX = signal<number | null>(null);

  timelineService = inject(TimelineService);

  headerHeight = 48;
  rowHeight = 48;

  hoverRowIndex = signal<number | null>(null);
  hoverDate = signal<Date | null>(null);

  /**
   * Emitted when user clicks empty timeline space
   * (hooked up later for create flow)
   */
  @Output() createAt = new EventEmitter<{ date: Date; workCenterId: string }>();

  onGridClick(): void {
    if (this.hoverRowIndex() === null || !this.hoverDate()) return;

    const center = this.workCenters[this.hoverRowIndex()!];

    this.createAt.emit({
      date: this.hoverDate()!,
      workCenterId: center.docId
    });
  }

  onMouseMove(event: MouseEvent): void {
    const gridRect = (event.currentTarget as HTMLElement).getBoundingClientRect();

    const y = event.clientY - gridRect.top - this.headerHeight;
    const rowIndex = Math.floor(y / this.rowHeight);

    if (rowIndex < 0 || rowIndex >= this.workCenters.length) {
      this.hoverRowIndex.set(null);
      this.hoverDate.set(null);
      this.hoverX.set(null);
      return;
    }

    const x = event.clientX - gridRect.left;

    this.hoverRowIndex.set(rowIndex);
    this.hoverDate.set(this.timelineService.xToDate(x));
    this.hoverX.set(this.timelineService.dateToX(this.hoverDate()!));
  }
}
