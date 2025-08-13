import { TaskPlannerState, TaskPlannerAction, DragState } from "../types";
import { addDays } from "../utils/dateUtils";

const initialDragState: DragState = {
  isDragging: false,
  dragType: null,
  selectedDays: [],
  taskBeingDragged: null,
  isSelecting: false,
  selectionStart: null,
};

export const initialState: TaskPlannerState = {
  currentMonth: new Date(),
  tasks: [
    {
      id: "1",
      name: "Sample Task",
      startDate: new Date(),
      endDate: addDays(new Date(), 1),
      category: "To Do",
      createdAt: new Date(),
    },
  ],
  filters: {
    categories: [],
    timeRange: null,
    searchQuery: "",
  },
  dragState: initialDragState,
  showModal: false,
  editingTask: null,
};

export const taskReducer = (
  state: TaskPlannerState,
  action: TaskPlannerAction
): TaskPlannerState => {
  switch (action.type) {
    case "CREATE_TASK":
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
        showModal: false,
        dragState: initialDragState,
      };

    case "UPDATE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? action.payload : task
        ),
        showModal: false,
        editingTask: null,
      };

    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      };

    case "SET_FILTERS":
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };

    case "UPDATE_DRAG_STATE":
      return {
        ...state,
        dragState: { ...state.dragState, ...action.payload },
      };

    case "START_SELECTION":
      return {
        ...state,
        dragState: {
          ...initialDragState,
          isSelecting: true,
          selectionStart: action.payload,
          selectedDays: [action.payload],
        },
      };

    case "UPDATE_SELECTION":
      return {
        ...state,
        dragState: {
          ...state.dragState,
          selectedDays: action.payload,
        },
      };

    case "END_SELECTION":
      if (state.dragState.selectedDays.length > 0) {
        return {
          ...state,
          showModal: true,
          dragState: { ...state.dragState, isSelecting: false },
        };
      }
      return {
        ...state,
        dragState: initialDragState,
      };

    case "CANCEL_SELECTION":
      return {
        ...state,
        dragState: initialDragState,
        showModal: false,
      };

    case "SHOW_MODAL":
      return {
        ...state,
        showModal: true,
        editingTask: action.payload || null,
      };

    case "HIDE_MODAL":
      return {
        ...state,
        showModal: false,
        editingTask: null,
        dragState: initialDragState,
      };

    case "START_RESIZE":
      return {
        ...state,
        dragState: {
          ...state.dragState,
          isDragging: true,
          dragType:
            action.payload.resizeType === "start"
              ? "resize-start"
              : "resize-end",
          taskBeingDragged: action.payload.taskId,
          resizeData: {
            taskId: action.payload.taskId,
            originalStart: action.payload.originalStart,
            originalEnd: action.payload.originalEnd,
            resizeType: action.payload.resizeType,
          },
        },
      };

    case "UPDATE_RESIZE":
      if (!state.dragState.resizeData) return state;

      const { taskId, originalStart, originalEnd, resizeType } =
        state.dragState.resizeData;
      const task = state.tasks.find((t) => t.id === taskId);
      if (!task) return state;

      let newStartDate = originalStart;
      let newEndDate = originalEnd;

      if (resizeType === "start") {
        newStartDate = action.payload.newDate;
        if (newStartDate > originalEnd) {
          newStartDate = originalEnd;
        }
      } else {
        newEndDate = action.payload.newDate;
        if (newEndDate < originalStart) {
          newEndDate = originalStart;
        }
      }

      const updatedTask = {
        ...task,
        startDate: newStartDate,
        endDate: newEndDate,
      };

      return {
        ...state,
        tasks: state.tasks.map((t) => (t.id === taskId ? updatedTask : t)),
      };

    case "END_RESIZE":
      return {
        ...state,
        dragState: initialDragState,
      };

    default:
      return state;
  }
};
