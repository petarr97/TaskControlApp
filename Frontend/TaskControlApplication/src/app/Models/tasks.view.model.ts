export interface TasksViewModel {
  taskId: number;
  name: string;
  startDate: Date;
  endDate: string | null;
  description: string;
  note: string;
  elapsedTime: string;
  solvingType: string;
  user: number;
  status: string;
  priority: string;
  priorityId: number;
  statusId: number;
}
