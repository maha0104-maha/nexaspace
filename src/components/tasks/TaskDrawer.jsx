import { useState, useEffect, useRef } from "react";
import { X, Trash2, RotateCcw, Check, Upload, CircleDot, Flag, User, UserCircle, Calendar, Timer, Tag, GitBranch, Ban, PenTool, FileText, Image as ImageIcon } from "lucide-react";
import Button from "../common/Button";
import Tabs from "../common/Tabs";
import Toggle from "../common/Toggle";
import ProgressBar from "../common/ProgressBar";
import Avatar from "../common/Avatar";
import { users, getUserById, TASK_STATUSES, TASK_PRIORITIES, TASK_LABELS, STATUS_META, LABEL_STYLES, FILE_TYPE_STYLES, formatLongDate } from "../../data";

const ESTIMATES = [1, 2, 3, 4, 6, 8, 10, 12, 16, 24];
const FILE_ICONS = { fig: PenTool, pdf: FileText, png: ImageIcon, doc: FileText };
const plain = "h-8 rounded-lg border-0 bg-transparent px-2 text-[13px] font-medium outline-none hover:bg-[#F3F4F6]";

function UserDot({ user, size = "xs" }) {
  if (!user) return null;
  return <Avatar name={user.name} size={size} style={{ backgroundColor: user.avatarBg, color: user.avatarFg }} />;
}

// one line in the drawer: icon + label on the left, the control on the right
function Row({ icon: Icon, label, children }) {
  return (
    <div className="flex items-start gap-3 py-1">
      <div className="flex w-[110px] shrink-0 items-center gap-2 pt-1.5 text-[13px] text-[#6B7280]"><Icon size={14} />{label}</div>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

function Attachment({ file, onDelete }) {
  const style = FILE_TYPE_STYLES[file.type] || FILE_TYPE_STYLES.doc;
  const Icon = FILE_ICONS[file.type] || FileText;
  return (
    <div className="flex items-center gap-3 rounded-lg border border-[var(--color-border)] p-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: style.bg, color: style.color }}><Icon size={15} /></span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-semibold">{file.name}</p>
        <p className="text-xs text-[#6B7280]">{file.sizeMb.toFixed(1)} MB · {getUserById(file.uploadedBy)?.name}</p>
      </div>
      <button type="button" aria-label={"Delete " + file.name} onClick={() => onDelete(file)} className="text-[#9CA3AF] hover:text-[var(--color-danger)]"><Trash2 size={14} /></button>
    </div>
  );
}

const fileKind = (name) => {
  const ext = name.split(".").pop().toLowerCase();
  if (ext === "pdf") return "pdf";
  if (["png", "jpg", "jpeg", "gif", "webp"].includes(ext)) return "png";
  if (ext === "fig") return "fig";
  return "doc";
};

function TaskDrawer({ task, project, store, onClose, onDelete }) {
  const [title, setTitle] = useState(task.title);
  const [desc, setDesc] = useState(task.description || "");
  const [newSub, setNewSub] = useState("");
  const [comment, setComment] = useState("");
  const [tab, setTab] = useState("comments");
  const fileRef = useRef(null);

  // Escape closes the drawer
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const done = task.status === "Done";
  const meta = STATUS_META[task.status];
  const subs = store.subtasks[task.id] || [];
  const subsDone = subs.filter((s) => s.completed).length;
  const taskFiles = store.files.filter((f) => f.taskId === task.id);
  const comments = store.comments[task.id] || [];
  const history = store.history[task.id] || [];
  const others = store.tasks.filter((t) => t.projectId === task.projectId && t.id !== task.id);
  const hours = Array.from(new Set([...ESTIMATES, task.estimateHours])).sort((a, b) => a - b);
  const save = (changes) => store.updateTask(task.id, changes);

  const addSub = () => {
    if (!newSub.trim()) return;
    store.addSubtask(task.id, newSub.trim());
    setNewSub("");
  };
  const sendComment = () => {
    if (!comment.trim()) return;
    store.addComment(task.id, comment.trim());
    setComment("");
  };
  const pickFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    store.addFile(task, { name: f.name, type: fileKind(f.name), sizeMb: Math.max(0.1, f.size / 1048576) });
    e.target.value = "";
  };

  return (
    <div className="fixed inset-0 z-[300] flex justify-end">
      <button type="button" aria-label="Close task" className="absolute inset-0 bg-black/30" onClick={onClose} />
      <aside role="dialog" aria-modal="true" aria-label={task.title} className="relative h-full w-full max-w-[580px] overflow-y-auto bg-white shadow-xl">
        <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-[var(--color-border)] bg-white px-5 py-3">
          <span className="flex min-w-0 flex-1 items-center gap-2 text-[13px] text-[#4B5563]">
            <span className="truncate">{project.name}</span><span className="text-[#9CA3AF]">›</span><span className="font-mono text-xs">{task.id}</span>
          </span>
          {done ? (
            <Button variant="outline" size="sm" onClick={() => save({ status: "To Do" })}><RotateCcw size={13} />Reopen</Button>
          ) : (
            <Button variant="secondary" size="sm" className="!bg-[#E3F6EC] !text-[#0B7A4B]" onClick={() => save({ status: "Done" })}><Check size={13} />Mark complete</Button>
          )}
          <Button variant="ghost" size="sm" aria-label="Delete task" onClick={() => onDelete(task)}><Trash2 size={15} /></Button>
          <Button variant="ghost" size="sm" aria-label="Close" onClick={onClose}><X size={16} /></Button>
        </div>

        <div className="p-5">
          <input value={title} onChange={(e) => setTitle(e.target.value)} onBlur={() => title.trim() && title !== task.title && save({ title: title.trim() })}
            aria-label="Task title" className={`w-full rounded-lg border-0 px-1 py-1 text-[22px] font-bold outline-none hover:bg-[#F7F8FA] focus:bg-[#F7F8FA] ${done ? "line-through" : ""}`} />
          {done && (
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-[#E3F6EC] px-4 py-3 text-[13px] font-medium text-[#0B7A4B]">
              <Check size={15} />Completed on <b>{formatLongDate(task.completedAt || task.dueDate)}</b>
            </div>
          )}

          <div className="mt-4">
            <Row icon={CircleDot} label="Status">
              <select value={task.status} onChange={(e) => save({ status: e.target.value })} aria-label="Status" className="h-8 rounded-lg border-0 px-3 text-[13px] font-semibold outline-none" style={{ backgroundColor: meta.bg, color: meta.fg }}>
                {TASK_STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </Row>
            <Row icon={Flag} label="Priority">
              <select value={task.priority} onChange={(e) => save({ priority: e.target.value })} aria-label="Priority" className={plain}>
                {TASK_PRIORITIES.map((p) => <option key={p}>{p}</option>)}
              </select>
            </Row>
            <Row icon={User} label="Assignee">
              <div className="flex items-center gap-1">
                <UserDot user={getUserById(task.assigneeId)} />
                <select value={task.assigneeId} onChange={(e) => save({ assigneeId: e.target.value })} aria-label="Assignee" className={plain}>
                  {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
              </div>
            </Row>
            <Row icon={UserCircle} label="Reporter">
              <div className="flex items-center gap-2 px-2 pt-1 text-[13px] font-medium"><UserDot user={getUserById(task.reporterId)} />{getUserById(task.reporterId)?.name}</div>
            </Row>
            <Row icon={Calendar} label="Dates">
              <div className="flex items-center gap-2">
                <input type="date" value={task.startDate} max={task.dueDate} onChange={(e) => e.target.value && save({ startDate: e.target.value })} aria-label="Start date" className="h-8 rounded-lg border border-[var(--color-border)] px-2 text-[13px]" />
                <span className="text-[#9CA3AF]">→</span>
                <input type="date" value={task.dueDate} min={task.startDate} onChange={(e) => e.target.value && save({ dueDate: e.target.value })} aria-label="Due date" className="h-8 rounded-lg border border-[var(--color-border)] px-2 text-[13px]" />
              </div>
            </Row>
            <Row icon={Timer} label="Estimate">
              <select value={task.estimateHours} onChange={(e) => save({ estimateHours: Number(e.target.value) })} aria-label="Estimate" className={plain}>
                {hours.map((h) => <option key={h} value={h}>{h} {h === 1 ? "hour" : "hours"}</option>)}
              </select>
            </Row>
            <Row icon={Tag} label="Labels">
              <div className="flex flex-wrap gap-1.5">
                {TASK_LABELS.map((l) => {
                  const on = task.label === l;
                  return (
                    <button key={l} type="button" aria-pressed={on} onClick={() => save({ label: on ? "" : l })} className="flex h-7 items-center gap-1 rounded-lg border px-2.5 text-xs"
                      style={on ? { backgroundColor: LABEL_STYLES[l].bg, color: LABEL_STYLES[l].fg, borderColor: LABEL_STYLES[l].bg } : { borderColor: "var(--color-border)", color: "#4B5563" }}>
                      {on ? <Check size={11} /> : "+"} {l}
                    </button>
                  );
                })}
              </div>
            </Row>
            <Row icon={GitBranch} label="Depends on">
              <select value={task.dependsOn || ""} onChange={(e) => save({ dependsOn: e.target.value || null })} aria-label="Depends on" className={plain + " max-w-full"}>
                <option value="">No dependency</option>
                {others.map((t) => <option key={t.id} value={t.id}>{t.id} · {t.title}</option>)}
              </select>
            </Row>
            <Row icon={Ban} label="Blocked">
              <div className="pl-2 pt-1.5"><Toggle checked={task.blocked} onChange={(v) => save({ blocked: v })} label="Blocked" /></div>
            </Row>
          </div>

          <h3 className="mb-2 mt-5 text-sm font-semibold">Description</h3>
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} onBlur={() => desc !== task.description && save({ description: desc })} rows={4}
            placeholder="Add context, acceptance criteria or links…" className="w-full resize-y rounded-lg border border-[var(--color-border)] p-3 text-[13px] outline-none focus:border-[var(--color-primary)]" />

          <div className="mb-3 mt-5 flex items-center gap-3">
            <h3 className="text-sm font-semibold">Subtasks</h3>
            <span className="text-xs text-[#6B7280]">{subsDone} of {subs.length}</span>
            <ProgressBar value={subsDone} max={subs.length || 1} className="flex-1" />
          </div>
          {subs.map((s) => (
            <div key={s.id} className="flex items-center gap-3 py-1.5">
              <input type="checkbox" checked={s.completed} onChange={() => store.toggleSubtask(task.id, s.id)} className="h-4 w-4 accent-[var(--color-primary)]" aria-label={s.title} />
              <span className={`flex-1 text-[13px] ${s.completed ? "text-[#6B7280] line-through" : ""}`}>{s.title}</span>
              <button type="button" aria-label={"Remove " + s.title} onClick={() => store.removeSubtask(task.id, s.id)} className="text-[#9CA3AF] hover:text-[var(--color-danger)]"><X size={13} /></button>
            </div>
          ))}
          <div className="mt-2 flex gap-2">
            <input value={newSub} onChange={(e) => setNewSub(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addSub()} placeholder="Add a subtask" aria-label="New subtask"
              className="h-9 flex-1 rounded-lg border border-dashed border-[#C9CDD6] px-3 text-[13px] outline-none focus:border-[var(--color-primary)]" />
            <Button variant="outline" onClick={addSub}>Add</Button>
          </div>

          <div className="mb-3 mt-6 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Attachments</h3>
            <input ref={fileRef} type="file" className="hidden" onChange={pickFile} />
            <button type="button" onClick={() => fileRef.current.click()} className="flex items-center gap-1.5 text-[13px] font-medium text-[var(--color-primary)]"><Upload size={13} />Add file</button>
          </div>
          <div className="flex flex-col gap-2">
            {taskFiles.length === 0 && <p className="text-[13px] text-[#6B7280]">No attachments yet.</p>}
            {taskFiles.map((f) => <Attachment key={f.id} file={f} onDelete={store.removeFile} />)}
          </div>

          <Tabs className="mt-6" activeTab={tab} onChange={setTab} tabs={[{ value: "comments", label: "Comments · " + comments.length }, { value: "history", label: "History" }]} />
          <div className="py-4">
            {tab === "comments" && comments.length === 0 && <p className="text-[13px] text-[#6B7280]">No comments yet. Start the conversation below.</p>}
            {tab === "comments" && comments.map((c) => (
              <div key={c.id} className="mb-3 flex gap-3">
                <UserDot user={getUserById(c.userId)} size="sm" />
                <div className="text-[13px]"><b>{getUserById(c.userId)?.name}</b> <span className="text-xs text-[#9CA3AF]">{c.ago}</span><p className="mt-0.5 whitespace-pre-wrap text-[#374151]">{c.text}</p></div>
              </div>
            ))}
            {tab === "history" && history.length === 0 && <p className="text-[13px] text-[#6B7280]">No history yet.</p>}
            {tab === "history" && history.map((h) => (
              <p key={h.id} className="mb-2 text-[13px] text-[#4B5563]"><b className="text-[var(--color-text-primary)]">{getUserById(h.userId)?.name}</b> {h.text} <span className="text-xs text-[#9CA3AF]">· {h.ago}</span></p>
            ))}
          </div>
          <div className="rounded-lg border border-[var(--color-border)] p-3">
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} onKeyDown={(e) => (e.metaKey || e.ctrlKey) && e.key === "Enter" && sendComment()} rows={2}
              aria-label="Write a comment" placeholder="Write a comment — type @ to mention someone" className="w-full resize-none border-0 text-[13px] outline-none" />
            <div className="mt-2 flex items-center justify-between">
              <span className="text-[11px] text-[#9CA3AF]">Ctrl + Enter to send</span>
              <Button size="sm" disabled={!comment.trim()} onClick={sendComment}>Comment</Button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

export default TaskDrawer;