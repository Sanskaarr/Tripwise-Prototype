export interface Activity {
  timeOfDay: 'Morning' | 'Afternoon' | 'Evening' | string;
  time?: string;           // e.g. "~9:00 AM"
  title: string;
  placeName: string;
  address: string;
  cost: string;
  type: 'food' | 'sightseeing' | 'transport' | 'shopping' | 'nature' | 'stay' | 'flight' | 'train' | 'bus' | 'other' | string;
  description?: string;    // "why this place" hook
  duration?: string;       // e.g. "~2 hours"
  isTransit?: boolean;     // city-to-city leg → renders as boarding-pass card
  from?: string;           // transit origin label
  to?: string;             // transit destination label
  travelTime?: string;     // e.g. "2h 15m"
}

export interface StayInfo {
  name: string;
  address?: string;
  cost: string;
  stars?: number;          // 1–5
  checkIn?: string;        // e.g. "~2:00 PM"
}

export interface Day {
  day: number;
  theme: string;
  date?: string;           // e.g. "22 May"
  city?: string;           // primary city for the day
  dayBudget?: string;      // per-day budget pill
  activities: Activity[];
  stay: StayInfo;
}

export interface BudgetItem {
  category: string;
  cost: string;
}

export interface TripOverview {
  title: string;
  destination: string;
  totalBudget: string;
}

export interface ParsedPlan {
  tripOverview: TripOverview;
  itinerary: Day[];
  budgetBreakdown: BudgetItem[];
  totalCost: string;
}

export function parseMasterPlan(raw: string): ParsedPlan | null {
  if (!raw) return null;
  try {
    let cleaned = raw.trim();
    if (cleaned.startsWith('```json')) cleaned = cleaned.slice(7);
    else if (cleaned.startsWith('```')) cleaned = cleaned.slice(3);
    if (cleaned.endsWith('```')) cleaned = cleaned.slice(0, -3);
    return JSON.parse(cleaned.trim()) as ParsedPlan;
  } catch {
    return null;
  }
}

export function extractTotalCostNumber(plan: ParsedPlan | null): number {
  if (!plan) return 0;
  const raw = plan.totalCost || plan.tripOverview?.totalBudget || '0';
  const digits = raw.replace(/[^0-9]/g, '');
  return parseInt(digits, 10) || 0;
}
