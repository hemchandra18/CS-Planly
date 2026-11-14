import type { TaskItem } from '../dashboardState';

interface TaskRowProps {
  task: TaskItem;
  onToggle: (id: number) => void;
  onClick: (id: number) => void;
}

export function TaskRow({ task, onToggle, onClick }: TaskRowProps) {
  return (
    <div
      className={`task-row ${task.done ? 'done' : ''}`}
      onClick={() => onClick(task.id)}
    >
      <div
        className={`checkbox ${task.done ? 'done' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          onToggle(task.id);
        }}
      />
      <div className="task-name">{task.title}</div>
      <span className={`tag ${task.tagClass}`}>{task.cat}</span>
      <span className="time">{task.duration}</span>
    </div>
  );
}
