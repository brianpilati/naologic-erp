import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, computed } from '@angular/core';

import { MatMenuModule } from '@angular/material/menu';
import { WorkOrderDocument } from '../../../core/models/work-order.model';
import { TimelineService } from '../../../core/services/timeline.service';

@Component({
  selector: 'erp-work-order-bar',
  standalone: true,
  imports: [CommonModule, MatMenuModule],
  templateUrl: './work-order-bar.component.html',
  styleUrls: ['./work-order-bar.component.scss']
})
export class WorkOrderBarComponent {
  @Input({ required: true }) order!: WorkOrderDocument;

  /**
   * Vertical placement still belongs to the row/layout layer.
   * Default keeps it visually centered within the row until lanes are added.
   */
  @Input() topPx = 12;

  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();

  constructor(private readonly timelineService: TimelineService) {}

  readonly leftPx = computed(() => {
    const start = new Date(this.order.data.startDate);
    return this.timelineService.dateToX(start);
  });

  readonly widthPx = computed(() => {
    // Inclusive range: if start=end, show at least 1 day width.
    const start = new Date(this.order.data.startDate);

    // Make end inclusive by bumping one day so a 1-day order renders visibly.
    const endInclusive = new Date(this.order.data.endDate);
    endInclusive.setDate(endInclusive.getDate() + 1);

    const left = this.timelineService.dateToX(start);
    const right = this.timelineService.dateToX(endInclusive);

    return Math.max(24, right - left); // minimum width for usability
  });

  onEdit(event?: MouseEvent): void {
    event?.stopPropagation();
    this.edit.emit();
  }

  onDelete(event?: MouseEvent): void {
    event?.stopPropagation();
    this.delete.emit();
  }

  get name(): string {
    return this.order.data.name;
  }

  get status(): string {
    return this.order.data.status;
  }
}
