export interface Task {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  category: TaskCategory;
  createdAt: Date;
  lane?: number;
}

export type TaskCategory = "To Do" | "In Progress" | "Review" | "Completed";

export interface Filters {
  categories: TaskCategory[];
  timeRange: string | null;
  searchQuery: string;
}

export interface DragState {
  isDragging: boolean;
  dragType: "create" | "move" | "resize-start" | "resize-end" | null;
  selectedDays: Date[];
  taskBeingDragged: string | null;
  isSelecting: boolean;
  selectionStart: Date | null;
  resizeData?: {
    taskId: string;
    originalStart: Date;
    originalEnd: Date;
    resizeType: "start" | "end";
  };
}

export interface TaskPlannerState {
  currentMonth: Date;
  tasks: Task[];
  filters: Filters;
  dragState: DragState;
  showModal: boolean;
  editingTask: Task | null;
}

export type TaskPlannerAction =
  | { type: "CREATE_TASK"; payload: Task }
  | { type: "UPDATE_TASK"; payload: Task }
  | { type: "DELETE_TASK"; payload: string }
  | { type: "SET_FILTERS"; payload: Partial<Filters> }
  | { type: "UPDATE_DRAG_STATE"; payload: Partial<DragState> }
  | { type: "START_SELECTION"; payload: Date }
  | { type: "UPDATE_SELECTION"; payload: Date[] }
  | { type: "END_SELECTION" }
  | { type: "CANCEL_SELECTION" }
  | { type: "SHOW_MODAL"; payload?: Task }
  | { type: "HIDE_MODAL" }
  | {
      type: "START_RESIZE";
      payload: {
        taskId: string;
        resizeType: "start" | "end";
        originalStart: Date;
        originalEnd: Date;
      };
    }
  | { type: "UPDATE_RESIZE"; payload: { newDate: Date } }
  | { type: "END_RESIZE" };
