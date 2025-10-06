export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  priority?: 'low' | 'medium' | 'high';
  tags?: string[];
}

export interface TodoFilter {
  status?: 'all' | 'active' | 'completed';
  priority?: Todo['priority'];
  searchQuery?: string;
  tags?: string[];
}

export interface TodoStats {
  total: number;
  completed: number;
  active: number;
  completionRate: number;
}