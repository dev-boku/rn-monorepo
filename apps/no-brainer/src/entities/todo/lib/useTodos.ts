import { useState, useCallback, useMemo } from 'react';
import { Todo, TodoFilter, TodoStats } from '../model/todo';

export const useTodos = (initialTodos: Todo[] = []) => {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [filter, setFilter] = useState<TodoFilter>({ status: 'all' });

  const addTodo = useCallback((todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTodo: Todo = {
      ...todo,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTodos((prev) => [...prev, newTodo]);
    return newTodo;
  }, []);

  const updateTodo = useCallback((id: string, updates: Partial<Todo>) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? { ...todo, ...updates, updatedAt: new Date() }
          : todo
      )
    );
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }, []);

  const toggleTodo = useCallback((id: string) => {
    updateTodo(id, {
      completed: !todos.find((t) => t.id === id)?.completed,
    });
  }, [todos, updateTodo]);

  const filteredTodos = useMemo(() => {
    let result = [...todos];

    // Filter by status
    if (filter.status === 'active') {
      result = result.filter((todo) => !todo.completed);
    } else if (filter.status === 'completed') {
      result = result.filter((todo) => todo.completed);
    }

    // Filter by priority
    if (filter.priority) {
      result = result.filter((todo) => todo.priority === filter.priority);
    }

    // Filter by search query
    if (filter.searchQuery) {
      const query = filter.searchQuery.toLowerCase();
      result = result.filter(
        (todo) =>
          todo.title.toLowerCase().includes(query) ||
          todo.description?.toLowerCase().includes(query)
      );
    }

    // Filter by tags
    if (filter.tags && filter.tags.length > 0) {
      result = result.filter((todo) =>
        todo.tags?.some((tag) => filter.tags?.includes(tag))
      );
    }

    return result;
  }, [todos, filter]);

  const stats: TodoStats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter((t) => t.completed).length;
    const active = total - completed;
    const completionRate = total > 0 ? (completed / total) * 100 : 0;

    return {
      total,
      completed,
      active,
      completionRate,
    };
  }, [todos]);

  const clearCompleted = useCallback(() => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  }, []);

  const markAllAsCompleted = useCallback(() => {
    setTodos((prev) =>
      prev.map((todo) => ({
        ...todo,
        completed: true,
        updatedAt: new Date(),
      }))
    );
  }, []);

  return {
    todos: filteredTodos,
    allTodos: todos,
    filter,
    stats,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    setFilter,
    clearCompleted,
    markAllAsCompleted,
  };
};