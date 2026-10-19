import { useState, useEffect } from "react";
import Avatar from "../../common/Avatar";
import EmptyState from "../../common/EmptyState";
import { loadJSON, saveJSON } from "../../../utils/storage";
import { dayDiff, addDaysIso, mondayBefore, toIso } from "../../../utils/taskUtils";
import { STATUS_META, DEMO_TODAY, formatShortDate, getUserById } from "../../../data";

const SCALES = { week: 36, month: 14, quarter: 6 };
const ZOOMS = [{ value: "week", label: "Week" }, { value: "month", label: "Month" }, { value: "quarter", label: "Quarter" }];
const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const ROW = 40;

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

function TimelineTab({ projectId, project, tasks, milestones }) {
  const key = "nexaspace.zoom." + projectId;
  const [zoom, setZoom] = useState(() => loadJSON(key, "month"));
  useEffect(() => {
    saveJSON(key, zoom);
  }, [zoom]);

  if (tasks.length === 0) return <EmptyState title="Nothing to plot" description="Tasks with dates will show up here." />;

  const px = SCALES[zoom] || 14;
  const rows = [...tasks].sort((a, b) => a.startDate.localeCompare(b.startDate) || a.id.localeCompare(b.id));

  // work out the first and last day to draw
  let first = project.startDate;
  let last = project.dueDate;
  rows.forEach((t) => {
    if (t.startDate < first) first = t.startDate;
    if (t.dueDate > last) last = t.dueDate;
  });
  milestones.forEach((m) => {
    if (m.date > last) last = m.date;
  });
  const start = mondayBefore(first);
  const total = dayDiff(start, addDaysIso(last, 21)) + 1;

  // header cells: days for week, weeks for month, months for quarter
  const cells = [];
  if (zoom === "week") {
    for (let i = 0; i < total; i++) {
      const d = new Date(addDaysIso(start, i) + "T00:00:00");
      cells.push({ left: i * px, width: px, top: DAYS[d.getDay()], bottom: d.getDate(), weekend: d.getDay() === 0 || d.getDay() === 6 });
    }
  } else if (zoom === "month") {
    for (let i = 0; i < total; i += 7) cells.push({ left: i * px, width: 7 * px, top: formatShortDate(addDaysIso(start, i)) });
  } else {
    let cur = start;
    while (dayDiff(start, cur) < total) {
      const d = new Date(cur + "T00:00:00");
      const next = toIso(new Date(d.getFullYear(), d.getMonth() + 1, 1));
      cells.push({ left: dayDiff(start, cur) * px, width: dayDiff(cur, next) * px, top: MONTHS[d.getMonth()] });
      cur = next;
    }
  }
  const todayLeft = dayDiff(start, DEMO_TODAY) * px + px / 2;

  return (
    <div>
      <div className="flex items-center justify-between px-5 py-3">
        <div className="flex items-center gap-4 text-xs text-[#6B7280]">
          <span className="flex items-center gap-1.5"><span className="h-3 w-0.5 bg-[#E5484D]" />Today</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rotate-45 border border-[#4F46E5]" />Milestone</span>
        </div>
        <div role="radiogroup" aria-label="Timeline zoom" className="flex gap-1 rounded-[10px] bg-[var(--color-background)] p-1">
          {ZOOMS.map((z) => (
            <button key={z.value} type="button" role="radio" aria-checked={zoom === z.value} onClick={() => setZoom(z.value)}
              className={`h-7 rounded-lg px-3 text-[13px] font-medium ${zoom === z.value ? "bg-[var(--color-surface)] shadow-sm" : "text-[#6B7280]"}`}>
              {z.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto border-t border-[#EEF0F3]">
        <div className="flex" style={{ width: 260 + total * px }}>
          <div className="sticky left-0 z-20 w-[260px] shrink-0 border-r border-[#EEF0F3] bg-white">
            <div className="flex h-14 items-end px-4 pb-2 text-[11px] font-medium tracking-wide text-[#6B7280]">TASK</div>
            <div className="h-[30px] border-t border-[#EEF0F3]" />
            {rows.map((t) => {
              const user = getUserById(t.assigneeId);
              return (
                <div key={t.id} style={{ height: ROW }} className="flex items-center gap-2 border-t border-[#EEF0F3] px-4">
                  <StatusIcon status={t.status} />
                  <span className="min-w-0 flex-1 truncate text-[13px] font-medium">{t.title}</span>
                  {user && <Avatar name={user.name} size="compact" style={{ backgroundColor: user.avatarBg, color: user.avatarFg }} />}
                </div>
              );
            })}
          </div>

          <div className="relative" style={{ width: total * px }}>
            {cells.map((c, i) => (
              <div key={i} className={`absolute bottom-0 top-0 border-l border-[#EEF0F3] ${c.weekend ? "bg-[#F6F7F9]" : ""}`} style={{ left: c.left, width: c.width }}>
                <div className="px-2 pt-3 text-[11px] font-medium text-[#4B5563]">
                  <div className={c.bottom ? "text-[#9CA3AF]" : ""}>{c.top}</div>
                  {c.bottom && <div className="font-semibold text-[#111827]">{c.bottom}</div>}
                </div>
              </div>
            ))}
            <div className="h-14" />
            <div className="relative h-[30px] border-t border-[#EEF0F3]">
              {milestones.map((m) => (
                <span key={m.id} className="absolute top-2 flex items-center gap-1.5 whitespace-nowrap text-xs font-medium text-[#4F46E5]" style={{ left: dayDiff(start, m.date) * px }}>
                  <span className="h-2 w-2 rotate-45 border border-[#4F46E5]" />{m.title}
                </span>
              ))}
            </div>
            {rows.map((t) => {
              const meta = STATUS_META[t.status];
              const left = dayDiff(start, t.startDate) * px;
              const width = Math.max((dayDiff(t.startDate, t.dueDate) + 1) * px, 16);
              const inside = width >= 110;
              return (
                <div key={t.id} className="relative border-t border-[#EEF0F3]" style={{ height: ROW }}>
                  <div className="absolute top-2 flex h-6 items-center rounded-md border px-2 text-[11px] font-semibold" style={{ left, width, backgroundColor: meta.bg, borderColor: meta.bar, color: meta.fg }}>
                    {inside && <span className="truncate">{t.title}</span>}
                  </div>
                  {!inside && <span className="absolute top-2.5 whitespace-nowrap text-[11px] text-[#6B7280]" style={{ left: left + width + 6 }}>{t.title}</span>}
                </div>
              );
            })}
            <div className="pointer-events-none absolute bottom-0 top-0 z-10 w-px bg-[#E5484D]" style={{ left: todayLeft }}>
              <span className="absolute left-1/2 top-1 -translate-x-1/2 rounded bg-[#E5484D] px-1.5 py-0.5 text-[10px] font-semibold text-white">Today</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TimelineTab;