import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';

import { FormsModule } from '@angular/forms';
import { TimelineZoomLevelType, TimelineZoomLevelTypes } from '../../../core/types/timeline-zoom-level.type';

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

  readonly zoomOptions: TimelineZoomLevelType[] = [
    TimelineZoomLevelTypes.Hour,
    TimelineZoomLevelTypes.Day,
    TimelineZoomLevelTypes.Week,
    TimelineZoomLevelTypes.Month
  ];

  onZoomLevelChange(level: TimelineZoomLevelType): void {
    this.zoomChange.emit(level);
  }
}
