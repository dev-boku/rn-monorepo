import { renderHook, act } from '@testing-library/react-native';
import { useTodos } from './useTodos';
import { Todo } from '../model/todo';

describe('useTodos Hook', () => {
  const mockTodos: Todo[] = [
    {
      id: '1',
      title: 'Test Todo 1',
      description: 'Description 1',
      completed: false,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      priority: 'high',
      tags: ['work', 'urgent'],
    },
    {
      id: '2',
      title: 'Test Todo 2',
      description: 'Description 2',
      completed: true,
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02'),
      priority: 'low',
      tags: ['personal'],
    },
  ];

  describe('Initialization', () => {
    it('should initialize with empty todos', () => {
      const { result } = renderHook(() => useTodos());
      expect(result.current.todos).toEqual([]);
      expect(result.current.allTodos).toEqual([]);
    });

    it('should initialize with provided todos', () => {
      const { result } = renderHook(() => useTodos(mockTodos));
      expect(result.current.todos).toEqual(mockTodos);
      expect(result.current.allTodos).toEqual(mockTodos);
    });

    it('should initialize with default filter', () => {
      const { result } = renderHook(() => useTodos());
      expect(result.current.filter).toEqual({ status: 'all' });
    });
  });

  describe('Add Todo', () => {
    it('should add a new todo', () => {
      const { result } = renderHook(() => useTodos());
      const newTodoData = {
        title: 'New Todo',
        description: 'New Description',
        completed: false,
        priority: 'medium' as const,
      };

      let newTodo: Todo;
      act(() => {
        newTodo = result.current.addTodo(newTodoData);
      });

      expect(result.current.todos).toHaveLength(1);
      expect(result.current.todos[0]).toMatchObject({
        title: 'New Todo',
        description: 'New Description',
        completed: false,
        priority: 'medium',
      });
      expect(result.current.todos[0].id).toBeDefined();
      expect(result.current.todos[0].createdAt).toBeInstanceOf(Date);
      expect(result.current.todos[0].updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('Update Todo', () => {
    it('should update an existing todo', () => {
      const { result } = renderHook(() => useTodos(mockTodos));

      act(() => {
        result.current.updateTodo('1', {
          title: 'Updated Title',
          priority: 'medium',
        });
      });

      const updatedTodo = result.current.todos.find((t) => t.id === '1');
      expect(updatedTodo?.title).toBe('Updated Title');
      expect(updatedTodo?.priority).toBe('medium');
      expect(updatedTodo?.updatedAt).toBeInstanceOf(Date);
      expect(updatedTodo?.updatedAt.getTime()).toBeGreaterThan(
        mockTodos[0].updatedAt.getTime()
      );
    });

    it('should not affect other todos when updating', () => {
      const { result } = renderHook(() => useTodos(mockTodos));

      act(() => {
        result.current.updateTodo('1', { title: 'Updated' });
      });

      const untouchedTodo = result.current.todos.find((t) => t.id === '2');
      expect(untouchedTodo).toEqual(mockTodos[1]);
    });
  });

  describe('Delete Todo', () => {
    it('should delete a todo by id', () => {
      const { result } = renderHook(() => useTodos(mockTodos));

      act(() => {
        result.current.deleteTodo('1');
      });

      expect(result.current.todos).toHaveLength(1);
      expect(result.current.todos[0].id).toBe('2');
    });
  });

  describe('Toggle Todo', () => {
    it('should toggle todo completion status', () => {
      const { result } = renderHook(() => useTodos(mockTodos));

      act(() => {
        result.current.toggleTodo('1');
      });

      const toggledTodo = result.current.todos.find((t) => t.id === '1');
      expect(toggledTodo?.completed).toBe(true);

      act(() => {
        result.current.toggleTodo('1');
      });

      const reToggledTodo = result.current.todos.find((t) => t.id === '1');
      expect(reToggledTodo?.completed).toBe(false);
    });
  });

  describe('Filtering', () => {
    it('should filter by status - active', () => {
      const { result } = renderHook(() => useTodos(mockTodos));

      act(() => {
        result.current.setFilter({ status: 'active' });
      });

      expect(result.current.todos).toHaveLength(1);
      expect(result.current.todos[0].id).toBe('1');
    });

    it('should filter by status - completed', () => {
      const { result } = renderHook(() => useTodos(mockTodos));

      act(() => {
        result.current.setFilter({ status: 'completed' });
      });

      expect(result.current.todos).toHaveLength(1);
      expect(result.current.todos[0].id).toBe('2');
    });

    it('should filter by priority', () => {
      const { result } = renderHook(() => useTodos(mockTodos));

      act(() => {
        result.current.setFilter({ priority: 'high' });
      });

      expect(result.current.todos).toHaveLength(1);
      expect(result.current.todos[0].priority).toBe('high');
    });

    it('should filter by search query', () => {
      const { result } = renderHook(() => useTodos(mockTodos));

      act(() => {
        result.current.setFilter({ searchQuery: 'Todo 1' });
      });

      expect(result.current.todos).toHaveLength(1);
      expect(result.current.todos[0].title).toContain('Todo 1');
    });

    it('should filter by tags', () => {
      const { result } = renderHook(() => useTodos(mockTodos));

      act(() => {
        result.current.setFilter({ tags: ['work'] });
      });

      expect(result.current.todos).toHaveLength(1);
      expect(result.current.todos[0].tags).toContain('work');
    });

    it('should apply multiple filters', () => {
      const { result } = renderHook(() => useTodos(mockTodos));

      act(() => {
        result.current.setFilter({
          status: 'active',
          priority: 'high',
          tags: ['urgent'],
        });
      });

      expect(result.current.todos).toHaveLength(1);
      expect(result.current.todos[0]).toMatchObject({
        id: '1',
        completed: false,
        priority: 'high',
      });
    });
  });

  describe('Statistics', () => {
    it('should calculate correct stats', () => {
      const { result } = renderHook(() => useTodos(mockTodos));

      expect(result.current.stats).toEqual({
        total: 2,
        completed: 1,
        active: 1,
        completionRate: 50,
      });
    });

    it('should update stats when todos change', () => {
      const { result } = renderHook(() => useTodos(mockTodos));

      act(() => {
        result.current.toggleTodo('1');
      });

      expect(result.current.stats).toEqual({
        total: 2,
        completed: 2,
        active: 0,
        completionRate: 100,
      });
    });

    it('should handle empty todos stats', () => {
      const { result } = renderHook(() => useTodos());

      expect(result.current.stats).toEqual({
        total: 0,
        completed: 0,
        active: 0,
        completionRate: 0,
      });
    });
  });

  describe('Bulk Operations', () => {
    it('should clear all completed todos', () => {
      const { result } = renderHook(() => useTodos(mockTodos));

      act(() => {
        result.current.clearCompleted();
      });

      expect(result.current.todos).toHaveLength(1);
      expect(result.current.todos[0].completed).toBe(false);
    });

    it('should mark all todos as completed', () => {
      const { result } = renderHook(() => useTodos(mockTodos));

      act(() => {
        result.current.markAllAsCompleted();
      });

      expect(result.current.todos.every((t) => t.completed)).toBe(true);
    });
  });

  describe('Integration Tests', () => {
    it('should handle complex workflow', () => {
      const { result } = renderHook(() => useTodos());

      // Add multiple todos
      act(() => {
        result.current.addTodo({
          title: 'Todo 1',
          completed: false,
          priority: 'high',
          tags: ['work'],
        });
        result.current.addTodo({
          title: 'Todo 2',
          completed: false,
          priority: 'low',
          tags: ['personal'],
        });
        result.current.addTodo({
          title: 'Todo 3',
          completed: false,
          priority: 'high',
          tags: ['work', 'urgent'],
        });
      });

      expect(result.current.todos).toHaveLength(3);

      // Complete one todo
      act(() => {
        result.current.toggleTodo(result.current.todos[0].id);
      });

      // Filter by active and high priority
      act(() => {
        result.current.setFilter({ status: 'active', priority: 'high' });
      });

      expect(result.current.todos).toHaveLength(1);
      expect(result.current.todos[0].title).toBe('Todo 3');

      // Reset filter
      act(() => {
        result.current.setFilter({ status: 'all' });
      });

      expect(result.current.todos).toHaveLength(3);

      // Clear completed
      act(() => {
        result.current.clearCompleted();
      });

      expect(result.current.allTodos).toHaveLength(2);
    });
  });
});