import { useState } from 'react';
import type {
  TaskItem,
  PlanItem,
  DeadlineItem,
  GoalItem,
  LearningResource,
} from '../dashboardState';

export type ActiveModal =
  | { type: 'task'; task: TaskItem }
  | { type: 'plan'; plan: PlanItem }
  | { type: 'deadline'; deadline: DeadlineItem }
  | { type: 'goal'; goal: GoalItem }
  | { type: 'quick'; kind: 'plan' | 'task' | 'goal' | 'tomorrow' }
  | { type: 'resource'; resource: LearningResource; category: string }
  | null;

interface DashModalsProps {
  modal: ActiveModal;
  onClose: () => void;
  onToggleTask: (id: number) => void;
  onReschedulePlan: (id: number) => void;
  onCompletePlan: (id: number) => void;
  onEditDeadline: (id: number, newTitle: string) => void;
  onRescheduleDeadline: (id: number) => void;
  onCompleteDeadline: (id: number) => void;
  onAdjustGoal: (id: number, delta: number) => void;
  onSaveQuick: (kind: 'plan' | 'task' | 'goal' | 'tomorrow', f1: string, f2: string) => void;
}

export function DashModals({
  modal,
  onClose,
  onToggleTask,
  onReschedulePlan,
  onCompletePlan,
  onEditDeadline,
  onRescheduleDeadline,
  onCompleteDeadline,
  onAdjustGoal,
  onSaveQuick,
}: DashModalsProps) {
  const [quickF1, setQuickF1] = useState('');
  const [quickF2, setQuickF2] = useState('');

  if (!modal) return null;

  return (
    <div className="modal-overlay" id="ov" onClick={(e) => {
      if ((e.target as HTMLElement).id === 'ov') onClose();
    }}>
      {/* ── Task Modal ── */}
      {modal.type === 'task' && (
        <div className="modal">
          <h3>{modal.task.title}</h3>
          <div className="sub">{modal.task.cat}</div>
          <div className="detail-row">
            <span className="k">Category</span>
            <span>{modal.task.cat}</span>
          </div>
          <div className="detail-row">
            <span className="k">Duration</span>
            <span>{modal.task.duration}</span>
          </div>
          <div className="detail-row">
            <span className="k">Priority</span>
            <span>{modal.task.priority}</span>
          </div>
          <div className="detail-row">
            <span className="k">Notes</span>
            <span style={{ maxWidth: '220px', textAlign: 'right' }}>
              {modal.task.notes}
            </span>
          </div>
          <div className="modal-actions">
            <button className="btn" onClick={onClose}>
              Close
            </button>
            <button
              className={`btn ${modal.task.done ? '' : 'mint'}`}
              onClick={() => {
                onToggleTask(modal.task.id);
                onClose();
              }}
            >
              {modal.task.done ? 'Mark incomplete' : 'Mark complete'}
            </button>
          </div>
        </div>
      )}

      {/* ── Plan Modal ── */}
      {modal.type === 'plan' && (
        <div className="modal">
          <h3>{modal.plan.title}</h3>
          <div className="sub">{modal.plan.sub}</div>
          <div className="modal-actions">
            <button className="btn" onClick={onClose}>
              Close
            </button>
            <button
              className="btn"
              onClick={() => {
                onReschedulePlan(modal.plan.id);
                onClose();
              }}
            >
              Reschedule
            </button>
            <button
              className="btn mint"
              onClick={() => {
                onCompletePlan(modal.plan.id);
                onClose();
              }}
            >
              Mark complete
            </button>
          </div>
        </div>
      )}

      {/* ── Deadline Modal ── */}
      {modal.type === 'deadline' && (
        <div className="modal">
          <h3>{modal.deadline.title}</h3>
          <div className="sub">Due {modal.deadline.when}</div>
          <div className="modal-actions">
            <button className="btn" onClick={onClose}>
              Close
            </button>
            <button
              className="btn"
              onClick={() => {
                const newTitle = window.prompt('Edit title', modal.deadline.title);
                if (newTitle && newTitle.trim()) {
                  onEditDeadline(modal.deadline.id, newTitle.trim());
                }
                onClose();
              }}
            >
              Edit
            </button>
            <button
              className="btn"
              onClick={() => {
                onRescheduleDeadline(modal.deadline.id);
                onClose();
              }}
            >
              Reschedule
            </button>
            <button
              className="btn mint"
              onClick={() => {
                onCompleteDeadline(modal.deadline.id);
                onClose();
              }}
            >
              Mark complete
            </button>
          </div>
        </div>
      )}

      {/* ── Goal Modal ── */}
      {modal.type === 'goal' && (
        <div className="modal">
          <h3>{modal.goal.name}</h3>
          <div className="sub">{modal.goal.pct}% complete</div>
          <div className="bar-track" style={{ marginBottom: '16px' }}>
            <div
              className="bar-fill"
              style={{ width: `${modal.goal.pct}%`, background: modal.goal.color }}
            />
          </div>
          <div className="modal-actions">
            <button className="btn" onClick={onClose}>
              Close
            </button>
            <button
              className="btn"
              onClick={() => onAdjustGoal(modal.goal.id, -10)}
            >
              -10%
            </button>
            <button
              className="btn mint"
              onClick={() => onAdjustGoal(modal.goal.id, 10)}
            >
              +10% progress
            </button>
          </div>
        </div>
      )}

      {/* ── Quick Add Modal ── */}
      {modal.type === 'quick' && (() => {
        const cfg = {
          plan: { title: 'Create a plan', fields: ['Plan title', 'Date'] },
          task: { title: 'Add a task', fields: ['Task title', 'Duration'] },
          goal: { title: 'Set a goal', fields: ['Goal name', 'Target %'] },
          tomorrow: { title: 'Plan tomorrow', fields: ['Top priority', 'Notes'] },
        }[modal.kind];

        return (
          <div className="modal">
            <h3>{cfg.title}</h3>
            <div className="field">
              <label>{cfg.fields[0]}</label>
              <input
                id="qf1"
                placeholder="Type here…"
                value={quickF1}
                onChange={(e) => setQuickF1(e.target.value)}
              />
            </div>
            <div className="field">
              <label>{cfg.fields[1]}</label>
              <input
                id="qf2"
                placeholder="Type here…"
                value={quickF2}
                onChange={(e) => setQuickF2(e.target.value)}
              />
            </div>
            <div className="modal-actions">
              <button
                className="btn"
                onClick={() => {
                  setQuickF1('');
                  setQuickF2('');
                  onClose();
                }}
              >
                Cancel
              </button>
              <button
                className="btn primary"
                onClick={() => {
                  onSaveQuick(
                    (modal as { type: 'quick'; kind: 'plan' | 'task' | 'goal' | 'tomorrow' }).kind,
                    quickF1.trim() || cfg.fields[0],
                    quickF2.trim()
                  );
                  setQuickF1('');
                  setQuickF2('');
                  onClose();
                }}
              >
                Save
              </button>
            </div>
          </div>
        );
      })()}

      {/* ── Resource Modal ── */}
      {modal.type === 'resource' && (
        <div className="modal">
          <h3>{modal.resource.title}</h3>
          <div className="sub">
            {modal.category} · {modal.resource.type} · {modal.resource.duration}
          </div>
          <p
            style={{
              fontSize: '12.5px',
              color: 'var(--muted)',
              lineHeight: 1.6,
              margin: '4px 0 14px',
            }}
          >
            {modal.resource.desc}
          </p>
          <div className="bar-track" style={{ marginBottom: '6px' }}>
            <div
              className="bar-fill"
              style={{ width: `${modal.resource.progress}%`, background: 'var(--mint)' }}
            />
          </div>
          <div className="sub" style={{ marginBottom: 0 }}>
            {modal.resource.progress}% complete · {modal.resource.difficulty}
          </div>
          <div className="modal-actions">
            <button className="btn" onClick={onClose}>
              Close
            </button>
            <button
              className="btn primary"
              onClick={() => {
                window.open(modal.resource.url, '_blank', 'noopener');
              }}
            >
              {modal.resource.type === 'Video' ? 'Watch' : 'Open resource'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
