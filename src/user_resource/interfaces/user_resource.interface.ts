export interface UserResource {
  startedAt: Date | null;
  completedAt: Date | null;
  notes: string | null;
  userId: number;
  resourceId: number;
}
