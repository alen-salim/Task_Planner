import React, { useRef, useCallback, JSX } from "react";
import { Calendar } from "lucide-react";
import { useTaskPlanner } from "../../hooks/useTaskPlanner";
import { useFilteredTasks } from "../../hooks/useFilteredTasks";
import { getMonthDates, isSameDay, getDateRange } from "../../utils/dateUtils";
import DayTile from "./DayTile";
import TaskBar from "./TaskBar";

const CalendarGrid: React.FC = () => {
  const { state, dispatch } = useTaskPlanner();
  const filteredTasks = useFilteredTasks();
  const calendarRef = useRef<HTMLDivElement>(null);

  const currentDate = state.currentMonth;
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthDates = getMonthDates(year, month);

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handleMouseDown = useCallback(
    (date: Date, e: React.MouseEvent) => {
      // Prevent starting selection if we're already resizing
      if (state.dragState.isDragging) return;

      e.preventDefault();
      dispatch({ type: "START_SELECTION", payload: date });
    },
    [state.dragState.isDragging, dispatch]
  );

  const handleMouseEnter = useCallback(
    (date: Date) => {
      if (state.dragState.isSelecting && state.dragState.selectionStart) {
        const startDate = state.dragState.selectionStart;
        const selectedRange = getDateRange(startDate, date);
        dispatch({ type: "UPDATE_SELECTION", payload: selectedRange });
      }
    },
    [state.dragState.isSelecting, state.dragState.selectionStart, dispatch]
  );

  const handleMouseUp = useCallback(
    (date: Date) => {
      if (
        state.dragState.isSelecting &&
        state.dragState.selectedDays.length > 0
      ) {
        dispatch({ type: "END_SELECTION" });
      }
    },
    [state.dragState.isSelecting, state.dragState.selectedDays.length, dispatch]
  );

  const isDateSelected = useCallback(
    (date: Date): boolean => {
      return state.dragState.selectedDays.some((selectedDate) =>
        isSameDay(selectedDate, date)
      );
    },
    [state.dragState.selectedDays]
  );

  const renderTaskBars = useCallback(() => {
    const taskBars: JSX.Element[] = [];
    const processedTasks = new Set<string>();

    // Helper: Assign lanes so overlapping tasks stack
    function assignLanes(tasksInRow: typeof filteredTasks) {
      const lanes: (typeof filteredTasks)[] = [];

      tasksInRow.forEach((task) => {
        let placed = false;
        for (let laneIndex = 0; laneIndex < lanes.length; laneIndex++) {
          // Check if task overlaps with anything in this lane
          if (
            !lanes[laneIndex].some(
              (t) => t.startDate <= task.endDate && t.endDate >= task.startDate
            )
          ) {
            lanes[laneIndex].push(task);
            (task as any).lane = laneIndex;
            placed = true;
            break;
          }
        }
        if (!placed) {
          lanes.push([task]);
          (task as any).lane = lanes.length - 1;
        }
      });

      return tasksInRow;
    }

    // Process each task
    filteredTasks.forEach((task) => {
      if (processedTasks.has(task.id)) return;

      // Locate start & end indices in monthDates
      let startIndex = monthDates.findIndex((d) =>
        isSameDay(d, task.startDate)
      );
      let endIndex = monthDates.findIndex((d) => isSameDay(d, task.endDate));

      if (startIndex !== -1 && endIndex !== -1) {
        const startRow = Math.floor(startIndex / 7);
        const endRow = Math.floor(endIndex / 7);

        // Handle multi-row tasks
        for (let row = startRow; row <= endRow; row++) {
          const isFirstRow = row === startRow;
          const isLastRow = row === endRow;
          const startCol = isFirstRow ? startIndex % 7 : 0;
          const endCol = isLastRow ? endIndex % 7 : 6;

          // Get all tasks that belong in this row
          const tasksInRow = filteredTasks.filter((t) => {
            const tStartIndex = monthDates.findIndex((d) =>
              isSameDay(d, t.startDate)
            );
            const tEndIndex = monthDates.findIndex((d) =>
              isSameDay(d, t.endDate)
            );
            const tStartRow = Math.floor(tStartIndex / 7);
            const tEndRow = Math.floor(tEndIndex / 7);
            return row >= tStartRow && row <= tEndRow;
          });

          // Assign lane numbers for stacking
          const tasksWithLanes = assignLanes(tasksInRow);

          // Find this task's lane
          const lane = tasksWithLanes.find((t) => t.id === task.id)?.lane || 0;

          // Push TaskBar
          taskBars.push(
            <TaskBar
              key={`${task.id}-${row}`}
              task={task}
              startCol={startCol}
              endCol={endCol}
              row={row}
              lane={lane}
              monthDates={monthDates}
            />
          );
        }
      }

      processedTasks.add(task.id);
    });

    return taskBars;
  }, [filteredTasks, monthDates]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Calendar Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">
            {monthNames[month]} {year}
          </h2>
          <Calendar size={24} className="text-gray-600" />
        </div>

        <div className="grid grid-cols-7 gap-0">
          {dayNames.map((day) => (
            <div
              key={day}
              className="text-center text-sm font-semibold text-gray-600 p-2"
            >
              {day}
            </div>
          ))}
        </div>
      </div>

      {/* Calendar Body */}
      <div ref={calendarRef} className="relative" data-calendar-grid>
        <div className="grid grid-cols-7 gap-0">
          {monthDates.map((date, index) => {
            const isCurrentMonth = date.getMonth() === month;
            return (
              <DayTile
                key={index}
                date={date}
                isCurrentMonth={isCurrentMonth}
                onMouseDown={handleMouseDown}
                onMouseEnter={handleMouseEnter}
                onMouseUp={handleMouseUp}
                isSelected={isDateSelected(date)}
              />
            );
          })}
        </div>

        {/* Task Bars Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="pointer-events-auto">{renderTaskBars()}</div>
        </div>
      </div>
    </div>
  );
};

export default CalendarGrid;
