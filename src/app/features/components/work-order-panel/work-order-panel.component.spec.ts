import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { WorkOrderPanelComponent } from './work-order-panel.component';

describe('WorkOrderPanelComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkOrderPanelComponent],
      providers: [provideZonelessChangeDetection()]
    }).compileComponents();
  });

  it('should create the WorkOrderPanelComponent', () => {
    const fixture = TestBed.createComponent(WorkOrderPanelComponent);
    const panel = fixture.componentInstance;
    expect(panel).toBeTruthy();
  });
});
