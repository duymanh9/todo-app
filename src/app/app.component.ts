import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { TaskService, Task } from './services/task.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule, NgFor, NgIf],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private taskService = inject(TaskService);

  newTask: string = '';
  tasks: Task[] = [];

  editIndex: number | null = null;
  editedTaskName: string = '';

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getTasks().subscribe(data => {
      this.tasks = data;
    });
  }

  addTask() {
    if (!this.newTask.trim()) return;

    const task = {
      name: this.newTask.trim(),
      isCompleted: false,
      isDeleted: false
    };

    this.taskService.createTask(task).subscribe(() => {
      this.newTask = '';
      this.loadTasks();
    });
  }

  deleteTask(task: Task) {
    this.taskService.deleteTask(task.id).subscribe(() => {
      this.loadTasks();
    });
  }

  toggleComplete(task: Task) {
    task.isCompleted = !task.isCompleted;
    this.taskService.updateTask(task).subscribe(() => {
      this.loadTasks();
    });
  }

  startEdit(index: number) {
    this.editIndex = index;
    this.editedTaskName = this.tasks[index].name;
  }

  cancelEdit() {
    this.editIndex = null;
    this.editedTaskName = '';
  }

  saveEdit(index: number) {
    const task = this.tasks[index];
    task.name = this.editedTaskName.trim();

    this.taskService.updateTask(task).subscribe(() => {
      this.editIndex = null;
      this.editedTaskName = '';
      this.loadTasks();
    });
  }
}
