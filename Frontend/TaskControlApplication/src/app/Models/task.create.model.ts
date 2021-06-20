import { DatePipe } from '@angular/common';

export interface CreatTaskModel {
  name: any;
  startDate: Date;
  endDate: Date | null;
  description: string;
  note: string;
  elapsedTime: string | null;
  solvingType: string | null;
  userId: number;
  statusId: number;
  priorityId: number;
  taskId: string | null;
}
