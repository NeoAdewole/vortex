import { BadRequestException, PipeTransform } from '@nestjs/common';
import { TaskStatus } from '../task-status.enum';

export class TaskUpdateValidationPipe implements PipeTransform {
  readonly allowedStatuses = [
    TaskStatus.OPEN,
    TaskStatus.IN_PROGRESS,
    TaskStatus.DONE
  ];

  transform(value: any) {
    // if value.status is present, validate it
    if (value.status) {
      value.status = value.status.toUpperCase();
      if (!this.isStatusValid(value.status)) {
        throw new BadRequestException(`"${value.status}" is an invalid status`);
      }
    }
    return value;
  }

  private isStatusValid(status: any) {
    const idx = this.allowedStatuses.indexOf(status);
    return idx !== -1;
  }
}
