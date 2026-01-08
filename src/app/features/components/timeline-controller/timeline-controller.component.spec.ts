import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineZoomLevelType, TimelineZoomLevelTypes } from '../../../core/types/timeline-zoom-level.type';
import { TimelineControllerComponent } from './timeline-controller.component';

describe('TimelineControllerComponent', () => {
  let fixture: ComponentFixture<TimelineControllerComponent>;
  let component: TimelineControllerComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimelineControllerComponent],
      providers: [provideZonelessChangeDetection()]
    }).compileComponents();

    fixture = TestBed.createComponent(TimelineControllerComponent);
    component = fixture.componentInstance;

    // required input
    component.zoomLevel = TimelineZoomLevelTypes.Day;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose all zoom options in correct order', () => {
    expect(component.zoomOptions).toEqual([
      TimelineZoomLevelTypes.Hour,
      TimelineZoomLevelTypes.Day,
      TimelineZoomLevelTypes.Week,
      TimelineZoomLevelTypes.Month
    ]);
  });

  it('should emit zoomChange when onZoomLevelChange is called', () => {
    const emitted: TimelineZoomLevelType[] = [];

    component.zoomChange.subscribe((value) => emitted.push(value));

    component.onZoomLevelChange(TimelineZoomLevelTypes.Week);

    expect(emitted).toEqual([TimelineZoomLevelTypes.Week]);
  });

  it('should bind the provided zoomLevel input', () => {
    component.zoomLevel = TimelineZoomLevelTypes.Month;
    fixture.detectChanges();

    expect(component.zoomLevel).toBe(TimelineZoomLevelTypes.Month);
  });
});
