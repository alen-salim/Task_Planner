import React, { useRef } from "react";
import { Task } from "../../types";
import { useTaskPlanner } from "../../hooks/useTaskPlanner";

interface TaskBarProps {
  task: Task;
  startCol: number;
  endCol: number;
  row: number;
  monthDates: Date[];
  lane?: number;
}

const TaskBar: React.FC<TaskBarProps> = ({
  task,
  startCol,
  endCol,
  row,
  monthDates,
}) => {
  const { dispatch } = useTaskPlanner();
  const taskBarRef = useRef<HTMLDivElement>(null);

  const categoryColors = {
    "To Do": "bg-blue-500",
    "In Progress": "bg-yellow-500",
    Review: "bg-purple-500",
    Completed: "bg-green-500",
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: "SHOW_MODAL", payload: task });
  };

  const handleResizeStart = (e: React.MouseEvent, type: "start" | "end") => {
    e.stopPropagation();
    e.preventDefault();

    dispatch({
      type: "START_RESIZE",
      payload: {
        taskId: task.id,
        resizeType: type,
        originalStart: task.startDate,
        originalEnd: task.endDate,
      },
    });

    const handleMouseMove = (e: MouseEvent) => {
      const calendarElement = document.querySelector("[data-calendar-grid]");
      if (!calendarElement) return;

      const rect = calendarElement.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const dayWidth = rect.width / 7;
      const dayHeight = 96; // h-24 = 96px

      const col = Math.max(0, Math.min(6, Math.floor(x / dayWidth)));
      const targetRow = Math.max(0, Math.min(5, Math.floor(y / dayHeight)));
      const dateIndex = targetRow * 7 + col;

      if (dateIndex >= 0 && dateIndex < monthDates.length) {
        const newDate = monthDates[dateIndex];
        dispatch({ type: "UPDATE_RESIZE", payload: { newDate } });
      }
    };

    const handleMouseUp = () => {
      dispatch({ type: "END_RESIZE" });
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Calculate position with proper containment
  const totalCols = endCol - startCol + 1;
  const width = Math.min(totalCols * (100 / 7), 100 - startCol * (100 / 7));
  const left = startCol * (100 / 7);

  return (
    <div
      ref={taskBarRef}
      className={`
        absolute ${
          categoryColors[task.category]
        } text-white text-xs rounded cursor-pointer 
        hover:opacity-90 transition-opacity select-none overflow-hidden z-10
      `}
      style={{
        left: `${Math.max(0, Math.min(left, 85.7))}%`,
        width: `${Math.max(14.3, Math.min(width, 100 - left))}%`,
        top: `${row * 96 + 26 + (task.lane || 0) * 22}px`,
        height: "20px",
      }}
      onDoubleClick={handleDoubleClick}
    >
      {/* Resize handle - start */}
      <div
        className="absolute left-0 top-0 w-2 h-full cursor-ew-resize bg-white bg-opacity-20 hover:bg-opacity-40 z-20"
        onMouseDown={(e) => handleResizeStart(e, "start")}
        title="Drag to change start date"
      />

      {/* Task content */}
      <div className="px-2 py-0.5 truncate font-medium pointer-events-none">
        {task.name}
      </div>

      {/* Resize handle - end */}
      <div
        className="absolute right-0 top-0 w-2 h-full cursor-ew-resize bg-white bg-opacity-20 hover:bg-opacity-40 z-20"
        onMouseDown={(e) => handleResizeStart(e, "end")}
        title="Drag to change end date"
      />
    </div>
  );
};

export default TaskBar;
