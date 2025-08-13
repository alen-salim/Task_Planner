import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useTaskPlanner } from "../../hooks/useTaskPlanner";
import { TaskCategory } from "../../types";

const TaskModal: React.FC = () => {
  const { state, dispatch } = useTaskPlanner();
  const [taskName, setTaskName] = useState("");
  const [category, setCategory] = useState<TaskCategory>("To Do");

  const categories: TaskCategory[] = [
    "To Do",
    "In Progress",
    "Review",
    "Completed",
  ];

  useEffect(() => {
    if (state.editingTask) {
      setTaskName(state.editingTask.name);
      setCategory(state.editingTask.category);
    } else {
      setTaskName("");
      setCategory("To Do");
    }
  }, [state.editingTask, state.showModal]);

  const handleSubmit = () => {
    if (!taskName.trim()) return;

    if (state.editingTask) {
      dispatch({
        type: "UPDATE_TASK",
        payload: {
          ...state.editingTask,
          name: taskName.trim(),
          category,
        },
      });
    } else {
      const selectedDates = [...state.dragState.selectedDays].sort(
        (a, b) => a.getTime() - b.getTime()
      );
      if (selectedDates.length === 0) return;

      const newTask = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: taskName.trim(),
        startDate: selectedDates[0],
        endDate: selectedDates[selectedDates.length - 1],
        category,
        createdAt: new Date(),
      };

      dispatch({ type: "CREATE_TASK", payload: newTask });
    }
  };

  const handleClose = () => {
    dispatch({ type: "HIDE_MODAL" });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
    if (e.key === "Escape") {
      handleClose();
    }
  };

  if (!state.showModal) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-lg p-6 w-96 max-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {state.editingTask ? "Edit Task" : "Create Task"}
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Task Name</label>
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              onKeyDown={handleKeyPress}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter task name"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as TaskCategory)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              onClick={handleSubmit}
              className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {state.editingTask ? "Update" : "Create"}
            </button>
            <button
              onClick={handleClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
