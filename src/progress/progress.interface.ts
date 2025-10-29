export interface Progress {
  id: number;
  userId: number;
  resourceId: number;
  completion: number;
  lastReviewed: Date | null;
  confidence: number | null;
  notes: string | null;
}
