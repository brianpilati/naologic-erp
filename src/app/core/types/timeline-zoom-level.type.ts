export const TimelineZoomLevelTypes = {
  Hour: 'hour',
  Day: 'day',
  Week: 'week',
  Month: 'month'
} as const;

export type TimelineZoomLevelType = (typeof TimelineZoomLevelTypes)[keyof typeof TimelineZoomLevelTypes];

/**
 * Runtime-safe list of zoom levels in display order.
 */
export const TIMELINE_ZOOM_LEVEL_VALUES = Object.values(TimelineZoomLevelTypes) as TimelineZoomLevelType[];
