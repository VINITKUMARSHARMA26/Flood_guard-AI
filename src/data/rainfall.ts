import type { RainfallPoint } from '../types';

// 7-day demo rainfall with a forecast tail.
// Rainfall values are in mm. Clearly labeled as demo/sample data.
export const rainfallData: Record<string, RainfallPoint[]> = {
  jaipur: [
    { day: 'Mon', label: 'Monday', rainfall: 12, forecast: null },
    { day: 'Tue', label: 'Tuesday', rainfall: 28, forecast: null },
    { day: 'Wed', label: 'Wednesday', rainfall: 45, forecast: null },
    { day: 'Thu', label: 'Thursday', rainfall: 67, forecast: null },
    { day: 'Fri', label: 'Friday', rainfall: 92, forecast: null },
    { day: 'Sat', label: 'Saturday', rainfall: 124, forecast: null },
    { day: 'Sun', label: 'Sunday', rainfall: null, forecast: 108 },
  ],
  mumbai: [
    { day: 'Mon', label: 'Monday', rainfall: 35, forecast: null },
    { day: 'Tue', label: 'Tuesday', rainfall: 78, forecast: null },
    { day: 'Wed', label: 'Wednesday', rainfall: 156, forecast: null },
    { day: 'Thu', label: 'Thursday', rainfall: 210, forecast: null },
    { day: 'Fri', label: 'Friday', rainfall: 184, forecast: null },
    { day: 'Sat', label: 'Saturday', rainfall: 245, forecast: null },
    { day: 'Sun', label: 'Sunday', rainfall: null, forecast: 190 },
  ],
  guwahati: [
    { day: 'Mon', label: 'Monday', rainfall: 22, forecast: null },
    { day: 'Tue', label: 'Tuesday', rainfall: 56, forecast: null },
    { day: 'Wed', label: 'Wednesday', rainfall: 89, forecast: null },
    { day: 'Thu', label: 'Thursday', rainfall: 112, forecast: null },
    { day: 'Fri', label: 'Friday', rainfall: 134, forecast: null },
    { day: 'Sat', label: 'Saturday', rainfall: 98, forecast: null },
    { day: 'Sun', label: 'Sunday', rainfall: null, forecast: 76 },
  ],
  chennai: [
    { day: 'Mon', label: 'Monday', rainfall: 18, forecast: null },
    { day: 'Tue', label: 'Tuesday', rainfall: 42, forecast: null },
    { day: 'Wed', label: 'Wednesday', rainfall: 87, forecast: null },
    { day: 'Thu', label: 'Thursday', rainfall: 145, forecast: null },
    { day: 'Fri', label: 'Friday', rainfall: 167, forecast: null },
    { day: 'Sat', label: 'Saturday', rainfall: 120, forecast: null },
    { day: 'Sun', label: 'Sunday', rainfall: null, forecast: 95 },
  ],
  patna: [
    { day: 'Mon', label: 'Monday', rainfall: 25, forecast: null },
    { day: 'Tue', label: 'Tuesday', rainfall: 62, forecast: null },
    { day: 'Wed', label: 'Wednesday', rainfall: 95, forecast: null },
    { day: 'Thu', label: 'Thursday', rainfall: 128, forecast: null },
    { day: 'Fri', label: 'Friday', rainfall: 156, forecast: null },
    { day: 'Sat', label: 'Saturday', rainfall: 132, forecast: null },
    { day: 'Sun', label: 'Sunday', rainfall: null, forecast: 110 },
  ],
  kolkata: [
    { day: 'Mon', label: 'Monday', rainfall: 30, forecast: null },
    { day: 'Tue', label: 'Tuesday', rainfall: 68, forecast: null },
    { day: 'Wed', label: 'Wednesday', rainfall: 102, forecast: null },
    { day: 'Thu', label: 'Thursday', rainfall: 138, forecast: null },
    { day: 'Fri', label: 'Friday', rainfall: 175, forecast: null },
    { day: 'Sat', label: 'Saturday', rainfall: 142, forecast: null },
    { day: 'Sun', label: 'Sunday', rainfall: null, forecast: 98 },
  ],
};
