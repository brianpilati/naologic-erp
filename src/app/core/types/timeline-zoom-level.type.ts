export const TimelineZoomLevelTypes = {
  Day: 'day',
  Week: 'week',
  Month: 'month'
} as const;

export type TimelineZoomLevelType = (typeof TimelineZoomLevelTypes)[keyof typeof TimelineZoomLevelTypes];
