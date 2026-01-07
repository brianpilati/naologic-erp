import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';

import { TimelineService } from '../../core/services/timeline.service';
import { WorkOrderService } from '../../core/services/work-order.service';

import { WorkCenterDocument } from '../../core/models/work-center-document.model';
import { WorkOrderDocument } from '../../core/models/work-order.model';
import { TimelineZoomLevelType } from '../../core/types/timeline-zoom-level.type';

// Presentation components
/*
import { TimelineGridComponent } from './components/timeline-grid/timeline-grid.component';
import { TimelineHeaderComponent } from './components/timeline-header/timeline-header.component';
import { WorkCenterRowComponent } from './components/work-center-row/work-center-row.component';
import { WorkOrderPanelComponent } from './components/work-order-panel/work-order-panel.component';
*/

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [
    CommonModule,
    /*
    TimelineHeaderComponent,
    TimelineGridComponent,
    WorkCenterRowComponent,
    WorkOrderPanelComponent,
    */
  ],
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
})
export class TimelineComponent {
  // --------------------------------------------------
  // UI State
  // --------------------------------------------------

  readonly isPanelOpen = signal(false);
  readonly panelMode = signal<'create' | 'edit'>('create');
  readonly selectedWorkOrder = signal<WorkOrderDocument | null>(null);
  readonly selectedWorkCenterId = signal<string | null>(null);

  // --------------------------------------------------
  // Derived state
  // --------------------------------------------------

  readonly workCenters = computed(() => this.workOrderService.workCenters());

  readonly workOrders = computed(() => this.workOrderService.workOrders());

  // --------------------------------------------------
  // Constructor
  // --------------------------------------------------

  constructor(
    public readonly timelineService: TimelineService,
    public readonly workOrderService: WorkOrderService
  ) {}

  // --------------------------------------------------
  // Timeline header interactions
  // --------------------------------------------------

  onZoomChange(zoom: TimelineZoomLevelType): void {
    this.timelineService.setZoomLevel(zoom);
  }

  // --------------------------------------------------
  // Grid interactions
  // --------------------------------------------------

  /**
   * User clicked an empty area of the timeline.
   * Opens create panel with a draft work order.
   */
  onCreateAt(date: Date, workCenterId: string): void {
    const start = date;
    const end = new Date(start);
    end.setDate(end.getDate() + 7);

    const draft = this.workOrderService.createDraft(workCenterId, start, end);

    this.selectedWorkOrder.set(draft);
    this.selectedWorkCenterId.set(workCenterId);
    this.panelMode.set('create');
    this.isPanelOpen.set(true);
  }

  // --------------------------------------------------
  // Work order actions
  // --------------------------------------------------

  onEdit(order: WorkOrderDocument): void {
    this.selectedWorkOrder.set(order);
    this.selectedWorkCenterId.set(order.data.workCenterId);
    this.panelMode.set('edit');
    this.isPanelOpen.set(true);
  }

  onDelete(orderId: string): void {
    this.workOrderService.delete(orderId);
  }

  // --------------------------------------------------
  // Panel interactions
  // --------------------------------------------------

  onSave(order: WorkOrderDocument): void {
    if (this.panelMode() === 'create') {
      this.workOrderService.create(order);
    } else {
      this.workOrderService.update(order);
    }

    this.closePanel();
  }

  onCancel(): void {
    this.closePanel();
  }

  // --------------------------------------------------
  // Helpers
  // --------------------------------------------------

  private closePanel(): void {
    this.isPanelOpen.set(false);
    this.selectedWorkOrder.set(null);
    this.selectedWorkCenterId.set(null);
  }

  /**
   * Convenience helper for templates.
   */
  workOrdersForCenter(workCenter: WorkCenterDocument): WorkOrderDocument[] {
    return this.workOrderService.workOrdersByCenter(workCenter.docId);
  }
}
