import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { TimelineColumn } from '../../../core/models/timeline-column.model';

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

  /**
   * Emitted when user clicks empty timeline space
   * (hooked up later for create flow)
   */
  @Output() createAt = new EventEmitter<{
    x: number;
  }>();

  onGridClick(event: MouseEvent): void {
    this.createAt.emit({
      x: event.offsetX
    });
  }
}
