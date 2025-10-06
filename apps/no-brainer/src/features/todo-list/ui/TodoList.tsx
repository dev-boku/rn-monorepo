import React from 'react';
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ListRenderItem,
} from 'react-native';
import { Todo } from '@/entities/todo/model/todo';

export interface TodoListProps {
  todos: Todo[];
  onToggle?: (id: string) => void;
  onDelete?: (id: string) => void;
  onEdit?: (todo: Todo) => void;
  emptyMessage?: string;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  onToggle,
  onDelete,
  onEdit,
  emptyMessage = 'No todos yet',
}) => {
  const renderTodo: ListRenderItem<Todo> = ({ item }) => (
    <View style={styles.todoItem} testID={`todo-item-${item.id}`}>
      <TouchableOpacity
        style={styles.todoContent}
        onPress={() => onToggle?.(item.id)}
        testID={`todo-toggle-${item.id}`}
      >
        <View style={styles.checkbox}>
          {item.completed && (
            <Text style={styles.checkmark} testID={`todo-check-${item.id}`}>
              ✓
            </Text>
          )}
        </View>
        <View style={styles.todoInfo}>
          <Text
            style={[styles.todoTitle, item.completed && styles.completedText]}
            testID={`todo-title-${item.id}`}
          >
            {item.title}
          </Text>
          {item.description && (
            <Text style={styles.todoDescription} testID={`todo-desc-${item.id}`}>
              {item.description}
            </Text>
          )}
          {item.priority && (
            <View style={[styles.priority, styles[`priority${item.priority}`]]}>
              <Text style={styles.priorityText}>{item.priority}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
      <View style={styles.actions}>
        {onEdit && (
          <TouchableOpacity
            onPress={() => onEdit(item)}
            style={styles.actionButton}
            testID={`todo-edit-${item.id}`}
          >
            <Text style={styles.editButton}>Edit</Text>
          </TouchableOpacity>
        )}
        {onDelete && (
          <TouchableOpacity
            onPress={() => onDelete(item.id)}
            style={styles.actionButton}
            testID={`todo-delete-${item.id}`}
          >
            <Text style={styles.deleteButton}>Delete</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  if (todos.length === 0) {
    return (
      <View style={styles.emptyContainer} testID="empty-list">
        <Text style={styles.emptyText}>{emptyMessage}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={todos}
      renderItem={renderTodo}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
      testID="todo-list"
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingVertical: 8,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  todoContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 4,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  todoInfo: {
    flex: 1,
  },
  todoTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 4,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  todoDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  priority: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  prioritylow: {
    backgroundColor: '#E8F5E9',
  },
  prioritymedium: {
    backgroundColor: '#FFF3E0',
  },
  priorityhigh: {
    backgroundColor: '#FFEBEE',
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  editButton: {
    color: '#007AFF',
    fontWeight: '500',
  },
  deleteButton: {
    color: '#FF3B30',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    color: '#999999',
  },
});