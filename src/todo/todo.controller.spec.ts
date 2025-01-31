import { Test, TestingModule } from '@nestjs/testing';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { CreateTodoInput } from './dto/create-todo.input';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

describe('TodoController', () => {
  let controller: TodoController;
  let todoService: TodoService;

  const mockTodoService = {
    getTodos: jest.fn(),
    addTodo: jest.fn(),
    checkTodo: jest.fn(),
    deleteTodo: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [
        {
          provide: TodoService,
          useValue: mockTodoService,
        },
      ],
    }).compile();

    controller = module.get<TodoController>(TodoController);
    todoService = module.get<TodoService>(TodoService);

  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getTodos', () => {

      it('should throw an exception when TodoService.getTodos fails', async () => {
        const userId = 1;

        jest.spyOn(todoService, 'getTodos').mockRejectedValue(new Error('Service error'));
    
        await expect(controller.getTodos(userId)).rejects.toThrow('Service error');
        expect(todoService.getTodos).toHaveBeenCalledWith(userId);
      });

    it('should call TodoService.getTodos with the correct parameter and return the todos of that specific user', async () => {
      const todos = [{
        id: 1,
        description: "Learn NestJS",
        done: false,
        timestamp: new Date(),
        user: 1
      }];

      const userId = 1;

      jest.spyOn(todoService, 'getTodos').mockResolvedValue(todos);

      const result = await controller.getTodos(userId);

      expect(todoService.getTodos).toHaveBeenCalledWith(userId);
      expect(result).toEqual(todos);
    });
  });

  describe('addTodo', () => {

    it('should throw a BadRequestException for invalid CreateTodoInput', async () => {
      const invalidCreateTodoInput = {};
      const validationPipe = new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true });

      await expect(
        validationPipe.transform(invalidCreateTodoInput, {
          type: 'body',
          metatype: CreateTodoInput,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should pass validation for valid CreateTodoInput', async () => {
      const validCreateTodoInput = {         
        description: "Learn NestJS",
        user: 1
      };

      const validationPipe = new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true });

      const result = await validationPipe.transform(validCreateTodoInput, {
        type: 'body',
        metatype: CreateTodoInput,
      });

      expect(result).toEqual(validCreateTodoInput);
    });

      it('should throw an exception when TodoService.addTodo fails', async () => {
        const createTodoInput: CreateTodoInput = {
          description: "Learn NestJS",
          user: 1
        };

        jest.spyOn(todoService, 'addTodo').mockRejectedValue(new Error('Service error'));
    
        await expect(controller.addTodo(createTodoInput)).rejects.toThrow('Service error');
        expect(todoService.addTodo).toHaveBeenCalledWith(createTodoInput);
      });    

    it('should call TodoService.addTodo with the correct body param and return the created todo', async () => {
      const createTodoInput : CreateTodoInput = {
        description: "Learn NestJS",
        user: 1
      };

      const todo = {
        id: 1,
        ...createTodoInput, 
        done: false, 
        timestamp: new Date(),
      };
      jest.spyOn(todoService, 'addTodo').mockResolvedValue(todo);

      const result = await controller.addTodo(createTodoInput);

      expect(todoService.addTodo).toHaveBeenCalledWith(createTodoInput);
      expect(result).toEqual(todo);
    });
  });

  describe('checkTodo', () => {

    it('should throw an exception when TodoService.checkTodo fails', async () => {

      const todoId = 1;

      jest.spyOn(todoService, 'checkTodo').mockRejectedValue(new Error('Service error'));
  
      await expect(controller.checkTodo(todoId)).rejects.toThrow('Service error');
      expect(todoService.checkTodo).toHaveBeenCalledWith(todoId);
    });

    it('should call TodoService.checkTodo with the todo id and return the success message', async () => {
      const todoId = 1;

      jest.spyOn(todoService, 'checkTodo').mockResolvedValue("Todo task updated successfully");

      const result = await controller.checkTodo(todoId);

      expect(todoService.checkTodo).toHaveBeenCalledWith(todoId);
      expect(result).toEqual("Todo task updated successfully");
    });
  });

  describe('deleteTodo', () => {

      it('should throw an exception when TodoService.deleteTodo fails', async () => {

        const todoId = 1;

        jest.spyOn(todoService, 'deleteTodo').mockRejectedValue(new Error('Service error'));
    
        await expect(controller.deleteTodo(todoId)).rejects.toThrow('Service error');
        expect(todoService.deleteTodo).toHaveBeenCalledWith(todoId);
      });
    
    it('should call TodoService.deleteTodo with the todo id and return the success message', async () => {
      const todoId = 1;

      jest.spyOn(todoService, 'deleteTodo').mockResolvedValue("Todo task deleted");

      const result = await controller.deleteTodo(todoId);

      expect(todoService.deleteTodo).toHaveBeenCalledWith(todoId);
      expect(result).toEqual("Todo task deleted");
    });
  });

});
