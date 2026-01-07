export const TimelineZoomLevelTypes = {
  Hour: 'hour',
  Day: 'day',
  Week: 'week',
  Month: 'month'
} as const;

export type TimelineZoomLevelType = (typeof TimelineZoomLevelTypes)[keyof typeof TimelineZoomLevelTypes];
