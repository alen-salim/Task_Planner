import React from "react";
import { isSameDay } from "../../utils/dateUtils";

interface DayTileProps {
  date: Date;
  isCurrentMonth: boolean;
  onMouseDown: (date: Date, e: React.MouseEvent) => void;
  onMouseEnter: (date: Date) => void;
  onMouseUp: (date: Date) => void;
  isSelected: boolean;
}

const DayTile: React.FC<DayTileProps> = ({
  date,
  isCurrentMonth,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
  isSelected,
}) => {
  const isToday = isSameDay(date, new Date());

  return (
    <div
      className={`
        border border-gray-200 h-24 p-1 cursor-pointer select-none relative
        ${!isCurrentMonth ? "bg-gray-50 text-gray-400" : "bg-white"}
        ${isToday ? "bg-blue-50 border-blue-300" : ""}
        ${isSelected ? "bg-blue-200 border-blue-400" : ""}
        hover:bg-gray-50 transition-colors
      `}
      onMouseDown={(e) => onMouseDown(date, e)}
      onMouseEnter={() => onMouseEnter(date)}
      onMouseUp={() => onMouseUp(date)}
    >
      <div className="font-medium text-sm">{date.getDate()}</div>
    </div>
  );
};

export default DayTile;
