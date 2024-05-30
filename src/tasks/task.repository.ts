import {
  Injectable,
  InternalServerErrorException,
  Logger
} from '@nestjs/common';
import { Task } from './task.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from 'src/users/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';

@Injectable()
export class TaskRepository extends Repository<Task> {
  private logger = new Logger('TaskRepository');

  constructor(dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }

  async getTasks(
    filterDto: GetTasksFilterDto,
    @GetUser() user: User
  ): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');
    query.where('task.userId = :userId', { userId: user.id });
    if (status) {
      query.andWhere('task.status = :status', { status });
      // tasks = tasks.filter((task) => task.status === status);
    }
    if (search) {
      query.andWhere(
        '(task.title LIKE :search OR task.description LIKE :search)',
        { search: `%${search}%` }
      );
    }
    try {
      const tasks = await query.getMany();
      return tasks;
    } catch (error) {
      this.logger.error(
        `Failed to get tasks for user "${user.username}". Filters: ${JSON.stringify(filterDto)}`,
        error.stack
      );
      throw new InternalServerErrorException();
    }
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    task.user = user;
    try {
      await task.save();
    } catch (error) {
      this.logger.error(
        `Failed to create a task for user "${user.username}". Data: ${createTaskDto}`,
        error.stack
      );
      throw new InternalServerErrorException();
    }

    delete task.user;
    return task;
  }

  async updateTask(task: Task, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const { title, description, status } = updateTaskDto;
    if (title) {
      task.title = title;
    }
    if (description) {
      task.description = description;
    }
    if (status) {
      task.status = status;
    }
    await this.update(task.id, { title, description, status });
    return task;
  }

  // async deleteTask(id: number): Promise<DeleteResult> {
  //   const deleteResult = await this.delete(id);
  //   return deleteResult;
  // }
}
