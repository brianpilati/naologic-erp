import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';

import { FormsModule } from '@angular/forms';
import { TIMELINE_ZOOM_LEVEL_VALUES, TimelineZoomLevelType } from '../../../core/types/timeline-zoom-level.type';

@Component({
  selector: 'erp-timeline-controller',
  standalone: true,
  imports: [CommonModule, NgSelectModule, FormsModule],
  templateUrl: './timeline-controller.component.html',
  styleUrls: ['./timeline-controller.component.scss']
})
export class TimelineControllerComponent {
  @Input({ required: true }) zoomLevel!: TimelineZoomLevelType;

  @Output() zoomChange = new EventEmitter<TimelineZoomLevelType>();

  readonly zoomOptions: TimelineZoomLevelType[] = TIMELINE_ZOOM_LEVEL_VALUES;

  onZoomLevelChange(level: TimelineZoomLevelType): void {
    this.zoomChange.emit(level);
  }
}
