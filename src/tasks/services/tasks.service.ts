import { Injectable } from '@nestjs/common';
import { Task } from '../entities/task.entity';
import { CreateTaskDto } from '../dto/create-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateTaskDto } from '../dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
  ) {}

  // Create a new task
  async createTask(dto: CreateTaskDto): Promise<Task> {
    try {
      const newTask = this.taskRepo.create(dto);
      return await this.taskRepo.save(newTask);
    } catch (error) {
      console.error('Error creating task:', error);
      throw new Error('Failed to create task');
    }
  }

  // Read all tasks
  async readAllTasks(status?: string): Promise<Task[] | { message: string }> {
    try {
      const query = this.taskRepo.createQueryBuilder('task');

      if (status) {
        query.andWhere('task.status = :status', { status });
      }

      const task = await query.getMany();
      if (task.length === 0) return { message: 'No tasks found' };
      return task;
    } catch (error) {
      console.error('Error readimg tasks:', error);
      throw new Error('Failed to read tasks');
    }
  }

  // Read a task by ID
  async readTaskById(id: number): Promise<Task | { message: string }> {
    try {
      const task = await this.taskRepo.findOne({ where: { id } });
      if (!task) return { message: `Task with ID '${id}' was not found.` };
      return task;
    } catch (error) {
      console.error(`Error reading task with ID '${id}':`, error);
      throw new Error('Failed to read task');
    }
  }

  // Update a task by ID
  async updateTask(
    id: number,
    dto: UpdateTaskDto,
  ): Promise<Task | { message: string }> {
    try {
      const task = await this.taskRepo.findOne({ where: { id } });
      if (!task) return { message: `Task with ID '${id}' was not found.` };

      const updatedTask = Object.assign(task, dto);
      return await this.taskRepo.save(updatedTask);
    } catch (error) {
      console.error(`Error updating task with ID '${id}':`, error);
      throw new Error('Failed to update task');
    }
  }

  // Delete a task by ID
  async deleteTask(id: number): Promise<{ message: string }> {
    try {
      const task = await this.taskRepo.findOne({ where: { id } });
      if (!task) return { message: `Task with ID '${id}' was not found.` };

      await this.taskRepo.remove(task);
      return { message: `Task with ID '${id}' was deleted successfully.` };
    } catch (error) {
      console.error(`Error deleting task with ID '${id}':`, error);
      throw new Error('Failed to delete task');
    }
  }
}
