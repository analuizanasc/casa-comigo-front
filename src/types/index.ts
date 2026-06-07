export interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface House {
  id: string;
  name: string;
  invite_code?: string;
  tolerance_percentage: number;
  created_at: string;
}

export interface HouseSummary {
  id: string;
  name: string;
  role: Role;
  created_at: string;
}

export type Role = 'admin' | 'catalog_manager' | 'resident';
export type Frequency = 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'annual';
export type EffortLevel = 'light' | 'medium' | 'heavy';
export type AssignmentStatus = 'pending' | 'completed' | 'overdue' | 'redistributed';
export type PreferenceLevel = 'hate' | 'neutral' | 'like';

export interface Member {
  id: string;
  user_id: string;
  name: string;
  email: string;
  role: Role;
  weight_percentage: number | null;
  weekly_availability_hours: number;
  created_at: string;
}

export interface WeightMember {
  user_id: string;
  name: string;
  weight_percentage: number | null;
  effective_weight: number;
}

export interface WeightsSummary {
  using_equal_distribution: boolean;
  total_defined_weight: number;
  is_valid: boolean;
  members: WeightMember[];
}

export interface Task {
  id: string;
  house_id: string;
  name: string;
  description: string | null;
  frequency: Frequency;
  duration_minutes: number;
  effort_level: EffortLevel;
  room: string | null;
  is_active: 0 | 1;
  created_by: string;
  created_by_name: string;
  created_at: string;
  updated_at: string;
}

export interface TaskDependency {
  depends_on_task_id: string;
  depends_on_name: string;
}

export interface TaskDependent {
  task_id: string;
  task_name: string;
}

export interface TaskDetail extends Task {
  dependencies: TaskDependency[];
  dependents: TaskDependent[];
}

export interface Preference {
  task_id: string;
  task_name: string;
  room: string | null;
  effort_level: EffortLevel;
  preference_level: PreferenceLevel;
  has_physical_limitation: boolean;
}

export interface Assignment {
  id: string;
  house_id: string;
  task_id: string;
  task_name: string;
  frequency: Frequency;
  duration_minutes: number;
  effort_level: EffortLevel;
  room: string | null;
  assigned_to: string;
  assigned_to_name: string;
  scheduled_date: string;
  status: AssignmentStatus;
  completed_at: string | null;
  completion_notes: string | null;
  group_id: string | null;
  sequence_order: number;
}

export interface BalanceEntry {
  user_id: string;
  name: string;
  target_percentage: number;
  actual_percentage: number;
  deviation: number;
  within_tolerance: boolean;
}

export interface DistributionResult {
  period_start: string;
  period_end: string;
  total_tasks_assigned: number;
  within_tolerance: boolean;
  balance: BalanceEntry[];
}

export interface PerformanceMember {
  user_id: string;
  name: string;
  role: string;
  weight_percentage: number | null;
  total_assigned: number;
  completed: number;
  overdue: number;
  redistributed: number;
  pending: number;
  completion_rate: number;
}

export interface PerformanceReport {
  period: { from: string | null; to: string | null };
  members: PerformanceMember[];
}

export interface BalanceReport {
  using_equal_distribution: boolean;
  tolerance_percentage: number;
  within_tolerance: boolean;
  members: BalanceEntry[];
}

export interface ApiError {
  error: string;
}
