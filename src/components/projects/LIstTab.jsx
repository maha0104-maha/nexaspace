import { Flag } from "lucide-react";
import Avatar from "../../common/Avatar";
import EmptyState from "../../common/EmptyState";
import { TASK_STATUSES, STATUS_META, LABEL_STYLES, PRIORITY_STYLES, getUserById } from "../../../data";
import { getDueLabel, DUE_COLORS } from "../../../utils/taskUtils";

// same status icon as the board (we can move it to common later)
function StatusIcon({ status }) {
  const meta = STATUS_META[status];
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.2" stroke={meta.bar} strokeWidth="1.5" strokeDasharray={meta.icon === "dashed" ? "2.2 2.2" : undefined} />
      {meta.icon === "half" && <path d="M8 3.5a4.5 4.5 0 0 1 0 9z" fill={meta.bar} />}
      {meta.icon === "check" && <path d="M5.2 8.2l2 2 3.6-4" stroke={meta.bar} strokeWidth="1.5" fill="none" strokeLinecap="round" />}
      {meta.icon === "eye" && <circle cx="8" cy="8" r="2" fill={meta.bar} />}
    </svg>
  );
}

const cols = "grid grid-cols-[28px_64px_minmax(0,1fr)_170px_100px_110px_130px] items-center gap-3";

function ListTab({ tasks, onOpen, onUpdate }) {
  if (tasks.length === 0) return <EmptyState title="No tasks yet" description="Tasks you add will show up here." />;

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[860px]">
        {TASK_STATUSES.map((status) => {
          const list = tasks.filter((t) => t.status === status);
          return (
            <div key={status}>
              <div className="flex items-center gap-2 border-y border-[#EEF0F3] bg-[#F8F9FB] px-4 py-2 text-[13px]">
                <StatusIcon status={status} />
                <b>{status}</b>
                <span className="text-[#6B7280]">{list.length}</span>
              </div>
              {list.map((t) => {
                const done = t.status === "Done";
                const due = getDueLabel(t);
                const meta = STATUS_META[t.status];
                const user = getUserById(t.assigneeId);
                const label = LABEL_STYLES[t.label];
                return (
                  <div key={t.id} onClick={() => onOpen && onOpen(t)} className={cols + " cursor-pointer border-b border-[#EEF0F3] px-4 py-2.5 hover:bg-[#FAFAFC]"}>
                    <input type="checkbox" checked={done} aria-label={"Mark " + t.title + " done"} onClick={(e) => e.stopPropagation()}
                      onChange={() => onUpdate(t.id, { status: done ? "To Do" : "Done" })} className="h-4 w-4 accent-[#12A06C]" />
                    <span className="font-mono text-xs text-[#9CA3AF]">{t.id}</span>
                    <span className="flex min-w-0 items-center gap-2">
                      <span className={`truncate text-[13px] font-medium ${done ? "text-[#6B7280] line-through" : ""}`}>{t.title}</span>
                      {label && <span className="inline-flex h-5 items-center rounded px-2 text-[11px] font-semibold" style={{ backgroundColor: label.bg, color: label.fg }}>{t.label}</span>}
                    </span>
                    <span className="flex min-w-0 items-center gap-2 text-[13px] text-[#4B5563]">
                      {user && <Avatar name={user.name} size="xs" style={{ backgroundColor: user.avatarBg, color: user.avatarFg }} />}
                      <span className="truncate">{user?.name}</span>
                    </span>
                    <span className="flex items-center gap-1 text-[13px]"><Flag size={12} style={{ color: PRIORITY_STYLES[t.priority] }} />{t.priority}</span>
                    <span className={`text-[13px] ${due.color === "red" ? "font-semibold" : ""}`} style={{ color: DUE_COLORS[due.color] }}>{due.text}</span>
                    <select value={t.status} onClick={(e) => e.stopPropagation()} onChange={(e) => onUpdate(t.id, { status: e.target.value })} aria-label="Change status"
                      className="h-8 rounded-md border-0 px-2 text-xs font-medium outline-none" style={{ backgroundColor: meta.bg, color: meta.fg }}>
                      {TASK_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ListTab;