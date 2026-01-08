// src/app/features/components/work-order-panel/work-order-panel.component.ts
import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject
} from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { NgbDate, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

import { WorkOrderDocument } from '../../../core/models/work-order.model';
import { WorkOrderService } from '../../../core/services/work-order.service';
import { WorkOrderStatusType } from '../../../core/types/work-order-status.type';

type PanelMode = 'create' | 'edit';

interface WorkOrderFormValue {
  name: string;
  status: WorkOrderStatusType;
  start: NgbDate;
  end: NgbDate;
}

@Component({
  selector: 'erp-work-order-panel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbDatepickerModule, NgSelectModule],
  templateUrl: './work-order-panel.component.html',
  styleUrls: ['./work-order-panel.component.scss']
})
export class WorkOrderPanelComponent implements OnChanges {
  @Input({ required: true }) mode: PanelMode = 'create';
  @Input({ required: true }) initialOrder!: WorkOrderDocument;

  @Output() save = new EventEmitter<WorkOrderDocument>();
  @Output() close = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);
  private readonly hostEl = inject(ElementRef<HTMLElement>);
  private readonly workOrderService = inject(WorkOrderService);

  readonly statusOptions: WorkOrderStatusType[] = ['open', 'in-progress', 'complete', 'blocked'];

  readonly form = this.fb.nonNullable.group({
    name: this.fb.nonNullable.control('', [Validators.required]),
    status: this.fb.nonNullable.control<WorkOrderStatusType>('open', [Validators.required]),
    start: this.fb.nonNullable.control<NgbDate>(new NgbDate(2025, 1, 1), [Validators.required]),
    end: this.fb.nonNullable.control<NgbDate>(new NgbDate(2025, 1, 8), [Validators.required])
  });

  // surface validation to the template
  overlapError = '';
  dateError = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialOrder'] && this.initialOrder) {
      this.patchFromOrder(this.initialOrder);
    }
    if (changes['mode']) {
      // no-op for now, but keeps intent explicit
    }
  }

  // -------------------------
  // UX: click outside closes
  // -------------------------
  @HostListener('document:mousedown', ['$event'])
  onDocumentMouseDown(event: MouseEvent): void {
    const panel = this.hostEl.nativeElement.querySelector('.work-order-panel');
    if (!panel) return;

    const target = event.target as Node | null;
    if (target && !panel.contains(target)) {
      this.onCancel();
    }
  }

  // -------------------------
  // Actions
  // -------------------------
  onSubmit(): void {
    this.overlapError = '';
    this.dateError = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue() as WorkOrderFormValue;

    const startIso = this.ngbDateToIso(value.start);
    const endIso = this.ngbDateToIso(value.end);

    if (new Date(endIso) < new Date(startIso)) {
      this.dateError = 'End date must be after start date.';
      return;
    }

    const next: WorkOrderDocument = {
      ...this.initialOrder,
      data: {
        ...this.initialOrder.data,
        name: value.name.trim(),
        status: value.status,
        startDate: startIso,
        endDate: endIso
      }
    };

    // overlap validation lives in the service
    const excludeId = this.mode === 'edit' ? next.docId : undefined;
    if (this.workOrderService.hasOverlap(next, excludeId)) {
      this.overlapError = 'Work order overlaps with an existing order.';
      return;
    }

    this.save.emit(next);
  }

  onCancel(): void {
    this.close.emit();
  }

  // -------------------------
  // Helpers
  // -------------------------
  private patchFromOrder(order: WorkOrderDocument): void {
    const start = this.isoToNgbDate(order.data.startDate);
    const end = this.isoToNgbDate(order.data.endDate);

    this.form.reset({
      name: order.data.name ?? '',
      status: order.data.status ?? 'open',
      start,
      end
    });

    this.overlapError = '';
    this.dateError = '';
  }

  private isoToNgbDate(iso: string): NgbDate {
    // expects YYYY-MM-DD
    const [y, m, d] = iso.split('-').map((n) => Number(n));
    return new NgbDate(y, m, d);
  }

  private ngbDateToIso(d: NgbDate): string {
    const y = String(d.year).padStart(4, '0');
    const m = String(d.month).padStart(2, '0');
    const day = String(d.day).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  // template helpers
  ctrl(name: 'name' | 'status' | 'start' | 'end'): AbstractControl {
    return this.form.get(name)!;
  }

  get title(): string {
    return 'Work Order Details';
  }

  get primaryCtaLabel(): string {
    return this.mode === 'edit' ? 'Save' : 'Create';
  }
}
