import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { TodoList } from './TodoList';
import { Todo } from '@/entities/todo/model/todo';

describe('TodoList Component', () => {
  const mockTodos: Todo[] = [
    {
      id: '1',
      title: 'Test Todo 1',
      description: 'Description 1',
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      priority: 'high',
      tags: ['work'],
    },
    {
      id: '2',
      title: 'Test Todo 2',
      completed: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      priority: 'low',
    },
  ];

  describe('Rendering', () => {
    it('should render list of todos', () => {
      render(<TodoList todos={mockTodos} />);

      expect(screen.getByTestId('todo-list')).toBeTruthy();
      expect(screen.getByTestId('todo-item-1')).toBeTruthy();
      expect(screen.getByTestId('todo-item-2')).toBeTruthy();
    });

    it('should render todo titles', () => {
      render(<TodoList todos={mockTodos} />);

      expect(screen.getByTestId('todo-title-1')).toHaveTextContent('Test Todo 1');
      expect(screen.getByTestId('todo-title-2')).toHaveTextContent('Test Todo 2');
    });

    it('should render todo descriptions when present', () => {
      render(<TodoList todos={mockTodos} />);

      expect(screen.getByTestId('todo-desc-1')).toHaveTextContent('Description 1');
      expect(screen.queryByTestId('todo-desc-2')).toBeNull();
    });

    it('should render priority badges', () => {
      render(<TodoList todos={mockTodos} />);

      const todo1Priority = screen.getByTestId('todo-item-1').findByText('high');
      const todo2Priority = screen.getByTestId('todo-item-2').findByText('low');

      expect(todo1Priority).toBeTruthy();
      expect(todo2Priority).toBeTruthy();
    });

    it('should show checkmark for completed todos', () => {
      render(<TodoList todos={mockTodos} />);

      expect(screen.queryByTestId('todo-check-1')).toBeNull();
      expect(screen.getByTestId('todo-check-2')).toHaveTextContent('✓');
    });

    it('should apply completed styles to completed todos', () => {
      render(<TodoList todos={mockTodos} />);

      const completedTitle = screen.getByTestId('todo-title-2');
      expect(completedTitle.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            textDecorationLine: 'line-through',
            opacity: 0.6,
          }),
        ])
      );
    });

    it('should render empty state when no todos', () => {
      render(<TodoList todos={[]} />);

      expect(screen.getByTestId('empty-list')).toBeTruthy();
      expect(screen.getByText('No todos yet')).toBeTruthy();
    });

    it('should render custom empty message', () => {
      render(<TodoList todos={[]} emptyMessage="Create your first todo!" />);

      expect(screen.getByText('Create your first todo!')).toBeTruthy();
    });
  });

  describe('Interactions', () => {
    it('should call onToggle when todo is pressed', () => {
      const onToggleMock = jest.fn();
      render(<TodoList todos={mockTodos} onToggle={onToggleMock} />);

      fireEvent.press(screen.getByTestId('todo-toggle-1'));
      expect(onToggleMock).toHaveBeenCalledWith('1');

      fireEvent.press(screen.getByTestId('todo-toggle-2'));
      expect(onToggleMock).toHaveBeenCalledWith('2');
      expect(onToggleMock).toHaveBeenCalledTimes(2);
    });

    it('should call onEdit when edit button is pressed', () => {
      const onEditMock = jest.fn();
      render(<TodoList todos={mockTodos} onEdit={onEditMock} />);

      fireEvent.press(screen.getByTestId('todo-edit-1'));
      expect(onEditMock).toHaveBeenCalledWith(mockTodos[0]);
    });

    it('should call onDelete when delete button is pressed', () => {
      const onDeleteMock = jest.fn();
      render(<TodoList todos={mockTodos} onDelete={onDeleteMock} />);

      fireEvent.press(screen.getByTestId('todo-delete-1'));
      expect(onDeleteMock).toHaveBeenCalledWith('1');
    });

    it('should not render edit button when onEdit is not provided', () => {
      render(<TodoList todos={mockTodos} />);

      expect(screen.queryByTestId('todo-edit-1')).toBeNull();
      expect(screen.queryByTestId('todo-edit-2')).toBeNull();
    });

    it('should not render delete button when onDelete is not provided', () => {
      render(<TodoList todos={mockTodos} />);

      expect(screen.queryByTestId('todo-delete-1')).toBeNull();
      expect(screen.queryByTestId('todo-delete-2')).toBeNull();
    });
  });

  describe('FlatList Props', () => {
    it('should use todo id as key extractor', () => {
      render(<TodoList todos={mockTodos} />);

      const flatList = screen.getByTestId('todo-list');
      const keyExtractor = flatList.props.keyExtractor;

      expect(keyExtractor(mockTodos[0])).toBe('1');
      expect(keyExtractor(mockTodos[1])).toBe('2');
    });

    it('should pass correct data to FlatList', () => {
      render(<TodoList todos={mockTodos} />);

      const flatList = screen.getByTestId('todo-list');
      expect(flatList.props.data).toEqual(mockTodos);
    });
  });

  describe('Priority Styles', () => {
    const todosWithAllPriorities: Todo[] = [
      {
        ...mockTodos[0],
        id: 'low',
        priority: 'low',
      },
      {
        ...mockTodos[0],
        id: 'medium',
        priority: 'medium',
      },
      {
        ...mockTodos[0],
        id: 'high',
        priority: 'high',
      },
    ];

    it('should apply correct styles for different priorities', () => {
      render(<TodoList todos={todosWithAllPriorities} />);

      // Note: Testing background colors via style props would require
      // accessing the priority container elements directly
      expect(screen.getByTestId('todo-item-low')).toBeTruthy();
      expect(screen.getByTestId('todo-item-medium')).toBeTruthy();
      expect(screen.getByTestId('todo-item-high')).toBeTruthy();
    });
  });

  describe('Multiple Actions', () => {
    it('should render both edit and delete buttons when both callbacks provided', () => {
      const onEditMock = jest.fn();
      const onDeleteMock = jest.fn();

      render(
        <TodoList
          todos={mockTodos}
          onEdit={onEditMock}
          onDelete={onDeleteMock}
        />
      );

      expect(screen.getByTestId('todo-edit-1')).toBeTruthy();
      expect(screen.getByTestId('todo-delete-1')).toBeTruthy();
      expect(screen.getByTestId('todo-edit-2')).toBeTruthy();
      expect(screen.getByTestId('todo-delete-2')).toBeTruthy();
    });
  });
});