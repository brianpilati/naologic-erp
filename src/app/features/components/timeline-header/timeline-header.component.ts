import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';

import { FormsModule } from '@angular/forms';
import { TIMELINE_ZOOM_LEVEL_VALUES, TimelineZoomLevelType } from '../../../core/types/timeline-zoom-level.type';

@Component({
  selector: 'erp-timeline-header',
  standalone: true,
  imports: [CommonModule, NgSelectModule, FormsModule],
  templateUrl: './timeline-header.component.html',
  styleUrls: ['./timeline-header.component.scss']
})
export class TimelineHeaderComponent {
  @Input({ required: true }) zoomLevel!: TimelineZoomLevelType;

  @Output() zoomChange = new EventEmitter<TimelineZoomLevelType>();

  readonly zoomOptions: TimelineZoomLevelType[] = TIMELINE_ZOOM_LEVEL_VALUES;

  onZoomLevelChange(level: TimelineZoomLevelType): void {
    this.zoomChange.emit(level);
  }
}
