import { Flag, Eye, CircleCheck } from "lucide-react";
import Card from "../../common/Card";
import Avatar from "../../common/Avatar";
import { TASK_STATUSES, STATUS_META, formatLongDate, daysUntil, getUserById } from "../../../data";
import { getDueLabel, isOverdue, DUE_COLORS } from "../../../utils/taskUtils";

// small pieces used only in this file (we can move them to common later)
function Panel({ title, children }) {
  return (
    <Card contentClassName="!p-4">
      <h3 className="mb-3 text-[13px] font-semibold">{title}</h3>
      {children}
    </Card>
  );
}

function StatCard({ label, value, red }) {
  return (
    <Card contentClassName="!p-3.5">
      <p className="text-xs text-[#6B7280]">{label}</p>
      <p className={`mt-1.5 text-2xl font-semibold leading-8 ${red && value > 0 ? "text-[#B42318]" : ""}`}>{value}</p>
    </Card>
  );
}

function UserDot({ user, size = "xs" }) {
  if (!user) return null;
  return <Avatar name={user.name} size={size} style={{ backgroundColor: user.avatarBg, color: user.avatarFg }} />;
}

function StatusIcon({ status }) {
  const meta = STATUS_META[status];
  if (meta.icon === "check") return <CircleCheck size={14} color={meta.bar} strokeWidth={1.8} />;
  if (meta.icon === "eye") return <Eye size={14} color={meta.bar} strokeWidth={1.8} />;
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.2" stroke={meta.bar} strokeWidth="1.5" strokeDasharray={meta.icon === "dashed" ? "2.2 2.2" : undefined} />
      {meta.icon === "half" && <path d="M8 3.5a4.5 4.5 0 0 1 0 9z" fill={meta.bar} />}
    </svg>
  );
}

function Activity({ item }) {
  const user = getUserById(item.userId);
  return (
    <div className="flex items-start gap-3">
      <UserDot user={user} size="compact" />
      <div className="text-[13px] leading-5 text-[#4B5563]">
        <b className="text-[var(--color-text-primary)]">{user?.name}</b> {item.verb} <b className="text-[var(--color-text-primary)]">{item.target}</b> {item.suffix}
        <p className="text-xs text-[#9CA3AF]">{item.ago}</p>
      </div>
    </div>
  );
}

function OverviewTab({ project, tasks, milestones, activities }) {
  const open = tasks.filter((t) => t.status !== "Done");
  const overdue = tasks.filter(isOverdue).length;
  const blocked = open.filter((t) => t.blocked).length;
  let hours = 0;
  open.forEach((t) => { hours += t.estimateHours; });
  const upcoming = [...open].sort((a, b) => a.dueDate.localeCompare(b.dueDate)).slice(0, 5);
  const members = project.memberIds.map(getUserById).filter(Boolean);

  return (
    <div className="grid gap-4 p-5 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="flex min-w-0 flex-col gap-4">
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          <StatCard label="Open tasks" value={open.length} />
          <StatCard label="Overdue" value={overdue} red />
          <StatCard label="Blocked" value={blocked} />
          <StatCard label="Est. hours left" value={hours + "h"} />
        </div>

        <Panel title="Tasks by status">
          {tasks.length === 0 ? (
            <p className="text-[13px] text-[#6B7280]">No tasks yet.</p>
          ) : (
            <>
              <div className="flex h-2.5 gap-0.5 overflow-hidden rounded-full">
                {TASK_STATUSES.map((s) => {
                  const n = tasks.filter((t) => t.status === s).length;
                  return n > 0 && <div key={s} style={{ flex: n, backgroundColor: STATUS_META[s].bar }} />;
                })}
              </div>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-[#4B5563]">
                {TASK_STATUSES.map((s) => (
                  <span key={s} className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: STATUS_META[s].bar }} />
                    {s} <b className="text-[var(--color-text-primary)]">{tasks.filter((t) => t.status === s).length}</b>
                  </span>
                ))}
              </div>
            </>
          )}
        </Panel>

        <Panel title="Milestones">
          {milestones.length === 0 && <p className="text-[13px] text-[#6B7280]">No milestones set.</p>}
          {milestones.map((m) => (
            <div key={m.id} className="flex items-center gap-3 border-b border-[#EEF0F3] py-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EDEBFD] text-[#4F46E5]"><Flag size={14} /></span>
              <span className="flex-1 text-[13px] font-medium">{m.title}</span>
              <span className="text-[13px] text-[#6B7280]">{formatLongDate(m.date)}</span>
              <span className="rounded-full bg-[#E8EAFE] px-2.5 py-0.5 text-xs font-medium text-[#3F3FD9]">
                {daysUntil(m.date) >= 0 ? daysUntil(m.date) + " days left" : "Passed"}
              </span>
            </div>
          ))}
        </Panel>

        <Panel title="Upcoming deadlines">
          {upcoming.length === 0 && <p className="text-[13px] text-[#6B7280]">Nothing due. Nice.</p>}
          {upcoming.map((t) => {
            const due = getDueLabel(t);
            return (
              <div key={t.id} className="flex items-center gap-3 py-2">
                <StatusIcon status={t.status} />
                <span className="flex-1 truncate text-[13px] font-medium">{t.title}</span>
                <UserDot user={getUserById(t.assigneeId)} />
                <span className="w-24 text-right text-[13px] font-medium" style={{ color: DUE_COLORS[due.color] }}>{due.text}</span>
              </div>
            );
          })}
        </Panel>
      </div>

      <div className="flex flex-col gap-4">
        <Panel title="Team">
          <div className="flex flex-col gap-3.5">
            {members.map((m) => {
              const mine = tasks.filter((t) => t.assigneeId === m.id);
              const openCount = mine.filter((t) => t.status !== "Done").length;
              return (
                <div key={m.id} className="flex items-center gap-3">
                  <UserDot user={m} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold">{m.name}</p>
                    <p className="truncate text-xs text-[#6B7280]">{m.role}{m.id === project.leadId ? " · Lead" : ""}</p>
                  </div>
                  <span className="text-xs text-[#6B7280]"><b className="text-[var(--color-text-primary)]">{openCount}</b> open · {mine.length - openCount} done</span>
                </div>
              );
            })}
          </div>
        </Panel>

        <Panel title="Recent activity">
          {activities.length === 0 && <p className="text-[13px] text-[#6B7280]">No activity yet.</p>}
          <div className="flex flex-col gap-4">
            {activities.slice(0, 3).map((a) => <Activity key={a.id} item={a} />)}
          </div>
        </Panel>
      </div>
    </div>
  );
}

export default OverviewTab;