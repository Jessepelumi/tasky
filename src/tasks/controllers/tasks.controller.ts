import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { TasksService } from '../services/tasks.service';

@Controller('tasks')
export class TasksController {
  // TaskService injection
  constructor(private readonly taskService: TasksService) {}

  @Post()
  createTask(@Body() taskData: CreateTaskDto) {
    return this.taskService.createTask(taskData);
  }

  @Get()
  getTasks() {
    return this.taskService.readAllTasks();
  }

  @Get(':id')
  getTask(@Param('id', ParseIntPipe) id: number) {
    return this.taskService.readTaskById(id);
  }

  @Patch(':id')
  updateTAsk(
    @Param('id', ParseIntPipe) id: number,
    @Body() taskData: UpdateTaskDto,
  ) {
    return this.taskService.updateTask(id, taskData);
  }

  @Delete(':id')
  deleteTask(@Param('id', ParseIntPipe) id: number) {
    return this.taskService.deleteTask(id);
  }
}
