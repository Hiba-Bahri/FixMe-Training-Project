"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoService = void 0;
const common_1 = require("@nestjs/common");
const Todo_1 = require("./entities/Todo");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let TodoService = class TodoService {
    constructor(todoRepository) {
        this.todoRepository = todoRepository;
    }
    async getTodos(userId) {
        return await this.todoRepository.findBy({ user: userId });
    }
    async addTodo(createTodoDto) {
        const createdTodo = this.todoRepository.create(createTodoDto);
        return await this.todoRepository.save(createdTodo);
    }
    async findTodoById(id) {
        const Todo = await this.todoRepository.findOneBy({ id });
        if (!Todo) {
            throw new common_1.NotFoundException('Todo not found');
        }
        return Todo;
    }
    async checkTodo(id) {
        const checkedTodo = await this.findTodoById(id);
        checkedTodo.done = !checkedTodo.done;
        await this.todoRepository.update(id, checkedTodo);
        return "Todo task updated successfully";
    }
    async deleteTodo(id) {
        await this.findTodoById(id);
        await this.todoRepository.delete(id);
        return 'Todo task deleted';
    }
};
exports.TodoService = TodoService;
exports.TodoService = TodoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Todo_1.Todo)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TodoService);
//# sourceMappingURL=todo.service.js.map