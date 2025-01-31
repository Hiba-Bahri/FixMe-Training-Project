import { Test, TestingModule } from '@nestjs/testing';
import { TodoResolver } from './todo.resolver';
import { CreateTodoInput } from './dto/create-todo.input';
import { TodoService } from './todo.service';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

describe('TodoResolver', () => {
  let resolver: TodoResolver;
  let todoService: TodoService;

  const mockTodoService = {
    getTodos: jest.fn(),
    findTodoById: jest.fn(),
    addTodo: jest.fn(),
    checkTodo: jest.fn(),
    deleteTodo: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TodoResolver,
        { provide: TodoService, useValue: mockTodoService },
      ],
      
    }).compile();

    resolver = module.get<TodoResolver>(TodoResolver);
    todoService = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('todos', () => {
    it('should throw an exception when TodoService.getTodos fails', async () => {
      const userId = 1;
      jest.spyOn(todoService, 'getTodos').mockRejectedValue(new Error('Service error'));

      await expect(resolver.todos(userId)).rejects.toThrow('Service error');
      expect(todoService.getTodos).toHaveBeenCalledWith(userId);
    });

    it('should return todos for a specific user', async () => {
      const todos = [{ id: 1, description: 'Learn NestJS', timestamp: new Date(), done: false, user: 1 }];
      jest.spyOn(todoService, 'getTodos').mockResolvedValue(todos);

      const result = await resolver.todos(1);
      expect(todoService.getTodos).toHaveBeenCalledWith(1);
      expect(result).toEqual(todos);
    });
  });

  describe('todoById', () => {
    it('should throw an exception when TodoService.findTodoById fails', async () => {
      const todoId = 1;
      jest.spyOn(todoService, 'findTodoById').mockRejectedValue(new Error('Service error'));

      await expect(resolver.todoById(todoId)).rejects.toThrow('Service error');
      expect(todoService.findTodoById).toHaveBeenCalledWith(todoId);
    });

    it('should return a single todo by ID', async () => {
      const todo = { id: 1, description: 'Learn NestJS', done: false, user: 1, timestamp: new Date() };
      jest.spyOn(todoService, 'findTodoById').mockResolvedValue(todo);

      const result = await resolver.todoById(1);
      expect(todoService.findTodoById).toHaveBeenCalledWith(1);
      expect(result).toEqual(todo);
    });
  });

  describe('createTodo', () => {
    it('should throw a GraphQLError for invalid CreateTodoInput', async () => {
      const invalidCreateTodoInput = {} as CreateTodoInput;

        const instance = plainToInstance(CreateTodoInput, invalidCreateTodoInput);
        const errors = await validate(instance);

        expect(errors.length).toBeGreaterThan(0); 
    });

    it('should create a new todo', async () => {
      const createTodoInput: CreateTodoInput = { description: 'Build a GraphQL API', user: 1 };
      const todo = { id: 1, ...createTodoInput, done: false, timestamp: new Date() };

      jest.spyOn(todoService, 'addTodo').mockResolvedValue(todo);
      const result = await resolver.createTodo(createTodoInput);

      expect(todoService.addTodo).toHaveBeenCalledWith(createTodoInput);
      expect(result).toEqual(todo);
    });

    it('should throw an exception when TodoService.addTodo fails', async () => {
      const createTodoInput: CreateTodoInput = {description: 'Build a GraphQL API', user: 1};
      jest.spyOn(todoService, 'addTodo').mockRejectedValue(new Error('Service error'));

      await expect(resolver.createTodo(createTodoInput)).rejects.toThrow('Service error');
      expect(todoService.addTodo).toHaveBeenCalledWith(createTodoInput);
    });
  });

  describe('updateTodo', () => {
    it('should throw an exception when TodoService.checkTodo fails', async () => {
      const todoId = 1;
      jest.spyOn(todoService, 'checkTodo').mockRejectedValue(new Error('Service error'));

      await expect(resolver.updateTodo(todoId)).rejects.toThrow('Service error');
      expect(todoService.checkTodo).toHaveBeenCalledWith(todoId);
    });

    it('should update a todo', async () => {
      const todoId = 1;
      jest.spyOn(todoService, 'checkTodo').mockResolvedValue('Todo updated');

      const result = await resolver.updateTodo(todoId);

      expect(todoService.checkTodo).toHaveBeenCalledWith(todoId);
      expect(result).toEqual('Todo updated');
    });
  });

  describe('deleteTodo', () => {
    it('should throw an exception when TodoService.deleteTodo fails', async () => {
      const todoId = 1;
      jest.spyOn(todoService, 'deleteTodo').mockRejectedValue(new Error('Service error'));

      await expect(resolver.deleteTodo(todoId)).rejects.toThrow('Service error');
      expect(todoService.deleteTodo).toHaveBeenCalledWith(todoId);
    });

    it('should delete a todo', async () => {
      const todoId = 1;
      jest.spyOn(todoService, 'deleteTodo').mockResolvedValue('Todo deleted');

      const result = await resolver.deleteTodo(todoId);

      expect(todoService.deleteTodo).toHaveBeenCalledWith(todoId);
      expect(result).toEqual('Todo deleted');
    });
  });
});