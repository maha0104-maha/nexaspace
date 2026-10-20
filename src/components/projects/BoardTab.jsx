import { useState, useEffect } from "react";
import { Plus, Hand, User, Flag, Tag, ArrowUpDown, ChevronDown, Calendar, Paperclip, MessageCircle, ListChecks, Ban, GitBranch, ArrowLeft, ArrowRight } from "lucide-react";
import SearchInput from "../common/SearchInput";
import Avatar from "../common/Avatar";
import { loadJSON, saveJSON } from "../../utils/storage";
import { getDueLabel, sortTasks, DUE_COLORS } from "../../utils/taskUtils";
import { TASK_STATUSES, STATUS_META, PROJECT_PRIORITIES, TASK_LABELS, BOARD_SORTS, LABEL_STYLES, PRIORITY_STYLES, getUserById } from "../../data";

const START = { search: "", assignee: "", priority: "", label: "", sort: "Manual order" };

// dropdown with an icon on the left (move to common later)
function IconSelect({ icon: Icon, value, onChange, options, placeholder, label, width }) {
  return (
    <div className="relative shrink-0" style={{ width }}>
      <Icon size={14} strokeWidth={1.7} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
      <select value={value} onChange={onChange} aria-label={label}
        className="h-9 w-full appearance-none rounded-lg border border-[var(--color-border)] bg-white pl-9 pr-8 text-[13px] outline-none focus:border-[var(--color-primary)]">
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
    </div>
  );
}

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

function TaskCard({ task, onMove, onOpen }) {
  const done = task.status === "Done";
  const due = getDueLabel(task);
  const user = getUserById(task.assigneeId);
  const label = LABEL_STYLES[task.label];

  const keyDown = (e) => {
    if (e.key === "Enter" && onOpen) onOpen(task);
    if (e.key === "ArrowLeft") { e.preventDefault(); onMove(task, -1); }
    if (e.key === "ArrowRight") { e.preventDefault(); onMove(task, 1); }
  };

  return (
    <div id={"card-" + task.id} tabIndex={0} draggable onKeyDown={keyDown} onClick={() => onOpen && onOpen(task)}
      onDragStart={(e) => { e.dataTransfer.setData("text/plain", task.id); e.dataTransfer.effectAllowed = "move"; }}
      className="cursor-grab rounded-lg border border-[var(--color-border)] bg-white p-3 shadow-sm outline-none hover:border-[#C9CDD6] focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/40">
      <div className="flex items-center justify-between">
        {label ? <span className="inline-flex h-5 items-center rounded px-2 text-[11px] font-semibold" style={{ backgroundColor: label.bg, color: label.fg }}>{task.label}</span> : <span />}
        <span className="flex items-center gap-1 text-xs" style={{ color: PRIORITY_STYLES[task.priority] }}>
          <Flag size={12} strokeWidth={1.8} />{task.priority}
        </span>
      </div>
      <p className={`mt-2.5 text-[13.5px] font-semibold leading-5 ${done ? "text-[#6B7280] line-through" : ""}`}>{task.title}</p>
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <span className="font-mono text-[11px] text-[#9CA3AF]">{task.id}</span>
        {task.subtasksTotal > 0 && (
          <span className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[11px] ${task.subtasksDone === task.subtasksTotal ? "border-[#BFE8D2] bg-[#E8F7EF] text-[#0B7A4B]" : "border-[var(--color-border)] bg-[#F7F8FA] text-[#4B5563]"}`}>
            <ListChecks size={11} />{task.subtasksDone}/{task.subtasksTotal}
          </span>
        )}
        {task.blocked && <span className="inline-flex items-center gap-1 rounded bg-[#FDE4E1] px-1.5 py-0.5 text-[11px] font-medium text-[#B42318]"><Ban size={11} />Blocked</span>}
        {task.dependsOn && <span className="inline-flex items-center gap-1 rounded bg-[#F1F2F5] px-1.5 py-0.5 text-[11px] text-[#4B5563]"><GitBranch size={11} />Depends</span>}
      </div>
      <div className="mt-3 flex items-center gap-2 border-t border-[#EEF0F3] pt-2.5">
        {user && <Avatar name={user.name} size="xs" style={{ backgroundColor: user.avatarBg, color: user.avatarFg }} />}
        <span className="flex items-center gap-1 text-xs" style={{ color: DUE_COLORS[due.color] }}><Calendar size={12} />{due.text}</span>
        <div className="ml-auto flex items-center gap-2.5 text-xs text-[#6B7280]">
          {task.attachments > 0 && <span className="flex items-center gap-1"><Paperclip size={12} />{task.attachments}</span>}
          {task.comments > 0 && <span className="flex items-center gap-1"><MessageCircle size={12} />{task.comments}</span>}
        </div>
      </div>
    </div>
  );
}

function BoardTab({ projectId, tasks, members, onMove, onOpen, onAdd }) {
  const key = "nexaspace.board." + projectId;
  const [f, setF] = useState(() => loadJSON(key, START));
  const [over, setOver] = useState("");
  useEffect(() => {
    saveJSON(key, f);
  }, [key, f]);

  const change = (name) => (e) => setF({ ...f, [name]: e.target.value });
  const opts = (list) => list.map((x) => ({ label: x, value: x }));
  const q = f.search.trim().toLowerCase();

  let shown = tasks.filter((t) => {
    if (q && !t.title.toLowerCase().includes(q) && !t.id.toLowerCase().includes(q)) return false;
    if (f.assignee && t.assigneeId !== f.assignee) return false;
    if (f.priority && t.priority !== f.priority) return false;
    if (f.label && t.label !== f.label) return false;
    return true;
  });
  shown = sortTasks(shown, f.sort);

  // arrow keys on a focused card
  const moveBy = (task, step) => {
    const next = TASK_STATUSES[TASK_STATUSES.indexOf(task.status) + step];
    if (!next) return;
    onMove(task.id, next);
    setTimeout(() => document.getElementById("card-" + task.id)?.focus(), 60);
  };
  const drop = (e, status) => {
    e.preventDefault();
    setOver("");
    const id = e.dataTransfer.getData("text/plain");
    if (id) onMove(id, status);
  };

  return (
    <div className="p-5">
      <div className="flex flex-wrap items-center gap-2">
        <div className="w-full sm:w-[240px]">
          <SearchInput value={f.search} onChange={change("search")} placeholder="Search this board" aria-label="Search this board" />
        </div>
        <IconSelect icon={User} width={150} label="Filter by assignee" placeholder="Anyone" value={f.assignee} onChange={change("assignee")}
          options={members.map((m) => ({ label: m.name, value: m.id }))} />
        <IconSelect icon={Flag} width={128} label="Filter by priority" placeholder="Any priority" value={f.priority} onChange={change("priority")}
          options={opts([...PROJECT_PRIORITIES].reverse())} />
        <IconSelect icon={Tag} width={116} label="Filter by label" placeholder="Any label" value={f.label} onChange={change("label")} options={opts(TASK_LABELS)} />
        <IconSelect icon={ArrowUpDown} width={138} label="Sort board" value={f.sort} onChange={change("sort")} options={opts(BOARD_SORTS)} />
      </div>
      <p className="mt-2.5 flex items-center gap-1.5 text-xs text-[#6B7280]">
        <Hand size={12} />Drag cards, or focus one and press
        <kbd className="flex h-5 w-5 items-center justify-center rounded border border-[var(--color-border)]"><ArrowLeft size={11} /></kbd>
        <kbd className="flex h-5 w-5 items-center justify-center rounded border border-[var(--color-border)]"><ArrowRight size={11} /></kbd>
      </p>

      <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
        {TASK_STATUSES.map((status) => {
          const list = shown.filter((t) => t.status === status);
          return (
            <div key={status}
              onDragOver={(e) => { e.preventDefault(); setOver(status); }}
              onDragLeave={() => setOver("")}
              onDrop={(e) => drop(e, status)}
              className={`min-h-[420px] w-[288px] shrink-0 rounded-xl p-2.5 ${over === status ? "bg-[#E8EAF2]" : "bg-[#F1F2F5]"}`}>
              <div className="mb-2.5 flex items-center gap-2 px-1 pt-0.5">
                <StatusIcon status={status} />
                <span className="text-[13px] font-semibold">{status}</span>
                <span className="rounded-full bg-white px-2 text-xs text-[#4B5563]">{list.length}</span>
                <button type="button" aria-label={"Add task to " + status} onClick={() => onAdd && onAdd(status)} className="ml-auto text-[#6B7280] hover:text-[var(--color-primary)]"><Plus size={15} /></button>
              </div>
              <div className="flex flex-col gap-3">
                {list.map((t) => <TaskCard key={t.id} task={t} onMove={moveBy} onOpen={onOpen} />)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BoardTab;
