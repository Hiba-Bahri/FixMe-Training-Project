import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from './todo.service';
import { Repository } from 'typeorm';
import { Todo } from './entities/Todo';
import { getRepositoryToken } from '@nestjs/typeorm';
import { timestamp } from 'rxjs';
import { NotFoundException } from '@nestjs/common';

describe('TodoService', () => {
  let service: TodoService;
  let todoRepository: Repository<Todo>;

  const mockTodoRepository = {
    findBy: jest.fn(),
    save: jest.fn(),
    findOneBy: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TodoService,
        {
          provide: getRepositoryToken(Todo),
          useValue: mockTodoRepository,
        },
      ],
    }).compile();

    service = module.get<TodoService>(TodoService);
    todoRepository = module.get<Repository<Todo>>(getRepositoryToken(Todo));

    jest.clearAllMocks();

  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe("getTodos", () => {

    it("should return an empty array", async () => {
      const userId = 1;
      const todos = [];

      mockTodoRepository.findBy.mockResolvedValue(todos);

      expect(await service.getTodos(userId)).toEqual(todos);
      expect(mockTodoRepository.findBy).toHaveBeenCalledTimes(1);

    });

    it("should return todos of a specific user", async() =>{
      const todos = [{
        id: 1,
        description: "Learn NestJS",
        done: false,
        timestamp: new Date("2025-01-19T00:23:27.000Z"),
        user: 1
      }];

      const userId = 1;

      mockTodoRepository.findBy.mockResolvedValue(todos);

      expect(await service.getTodos(userId)).toEqual(todos);

      expect(mockTodoRepository.findBy).toHaveBeenCalledTimes(1);

      expect(mockTodoRepository.findBy).toHaveBeenCalledWith({ user: userId });

    })
  });

  describe("addTodo", () => {
    it("should add a new todo", async () => {
      const createTodoDto = {
        description: "Learn NestJS",
        user: 1
      };

      const todo = {
        id: 1,
        ...createTodoDto, 
        done: false, 
        timestamp: new Date(),
      };

      mockTodoRepository.create.mockReturnValue(todo);
      mockTodoRepository.save.mockResolvedValue(todo);

      const results = await service.addTodo(createTodoDto);

      expect(results).toEqual(todo);

      expect(mockTodoRepository.create).toHaveBeenCalledTimes(1);
      expect(mockTodoRepository.create).toHaveBeenCalledWith(createTodoDto); 

      expect(mockTodoRepository.save).toHaveBeenCalledTimes(1);
      expect(mockTodoRepository.save).toHaveBeenCalledWith(todo);

      expect(results.timestamp).toBeDefined();
      expect(results.timestamp).toBeInstanceOf(Date);     
    });
  });

    describe('findTodoById', () => {
  
      it('should throw an error if todo not found', async () => {
  
        mockTodoRepository.findOneBy.mockReturnValue(null);
  
        expect(service.findTodoById(2)).rejects.toThrow(new NotFoundException('Todo not found'));
  
      });
  
      it('should return a todo if found', async () => {
  
        const todo = {
          id: 1,
          description: "Learn NestJS",
          done: false, 
          timestamp: new Date(),
          user: 1,
        };
  
        mockTodoRepository.findOneBy.mockReturnValue(todo);
  
        expect(await service.findTodoById(todo.id)).toEqual(todo);
  
        expect(mockTodoRepository.findOneBy).toHaveBeenCalledTimes(1);
      });
  
    });

    describe("checkTodo", () => {
      it('should throw an error when deleting if todo not found', async () => {
        const todoId = 1;
      
        jest.spyOn(service, 'findTodoById').mockRejectedValue(new NotFoundException('Todo not found'));
      
        await expect(service.checkTodo(todoId)).rejects.toThrow(NotFoundException);
        
        expect(service.findTodoById).toHaveBeenCalledWith(todoId);
        
        expect(mockTodoRepository.update).not.toHaveBeenCalled();
      });    
      
      it('should toggle the done status of a Todo', async () => {
        const todoId = 1;

        const taskStatus: boolean = Math.random() < 0.5;
    
        const todo = {
            id: 1,
            description: "Learn NestJS",
            done: taskStatus, 
            timestamp: new Date(),
            user: 1,
        };
    
        jest.spyOn(service, 'findTodoById').mockResolvedValue(todo);
    
        mockTodoRepository.update.mockResolvedValue({ affected: 1 });
    
        const result = await service.checkTodo(todoId);

        expect(result).toEqual("Todo task updated successfully");
    
        expect(todo.done).toBe(!taskStatus);
        expect(mockTodoRepository.update).toHaveBeenCalledTimes(1);
    });
    
  });

  describe("deleteTodo", () => {
    it('should throw an error when deleting if todo not found', async () => {
      const todoId = 1;
        
      jest.spyOn(service, 'findTodoById').mockRejectedValue(new NotFoundException('Todo not found'));
        
      await expect(service.deleteTodo(todoId)).rejects.toThrow(NotFoundException);
      expect(service.findTodoById).toHaveBeenCalledWith(todoId);
          
      expect(mockTodoRepository.delete).not.toHaveBeenCalled();      
    });
    
    it('should delete todo succesfully', async () => {
      const todo = {
        id: 1,
        description: "Learn NestJS",
        done: false, 
        timestamp: new Date(),
        user: 1,          
      };

      jest.spyOn(service, 'findTodoById').mockResolvedValue(todo);
        
      const deleteResult = { raw: {}, affected: 1 };        
      
      mockTodoRepository.delete.mockResolvedValue(deleteResult)
        
      const result = await service.deleteTodo(todo.id);
    
      expect(result).toEqual("Todo task deleted");
      expect(service.findTodoById).toHaveBeenCalledWith(todo.id); 
      expect(mockTodoRepository.delete).toHaveBeenCalledWith(todo.id);
    });
    
  });

});
