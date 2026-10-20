import { Building2, Calendar, Flag, ChevronDown, Plus, SlidersHorizontal, MoreHorizontal, Copy, Archive, Trash2, Home, LayoutGrid, List, GanttChart, Paperclip, Activity } from "lucide-react";
import Button from "../common/Button";
import Dropdown from "../common/Dropdown";
import Tabs from "../common/Tabs";
import Avatar from "../common/Avatar";
import AvatarGroup from "../common/AvatarGroup";
import { ICONS } from "./ProjectCard";
import { getUserById, getDeadlineNote, formatShortDate, formatLongDate, PROJECT_STATUSES, STATUS_STYLES, PRIORITY_STYLES } from "../../data";

const menuBox = "absolute z-30 w-[200px] rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)] p-1 shadow-lg";
const item = "w-full !justify-start";

// small progress ring (40 % in the reference)
function Ring({ value, color }) {
  const size = 44;
  const stroke = 4;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#EEF0F3" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c - (c * value) / 100} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
        <span className="text-[11px] font-bold">{value}</span>
        <span className="text-[9px] text-[#6B7280]">%</span>
      </div>
    </div>
  );
}

function ProjectHeader({ project, tasks, fileCount, members, isDemo, tab, onTab, onStatus, onAddTask, onSettings, onDuplicate, onArchive, onDelete }) {
  const Icon = ICONS[project.icon] || ICONS.rocket;
  const lead = getUserById(project.leadId);
  const status = STATUS_STYLES[project.status] || STATUS_STYLES["On Track"];
  const note = getDeadlineNote(project.dueDate);
  const done = tasks.filter((t) => t.status === "Done").length;
  const percent = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4 p-[22px]">
        <div className="flex min-w-0 gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: project.iconBg, color: project.iconColor }}>
            <Icon size={22} strokeWidth={1.7} />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-[22px] font-bold leading-7">{project.name}</h2>
              <Dropdown mode="menu" menuClassName={menuBox + " left-0 top-8"}
                trigger={
                  <button type="button" aria-label="Change project status" className="flex h-6 items-center gap-1.5 rounded-full px-2.5 text-xs font-semibold" style={{ backgroundColor: status.bg, color: status.fg }}>
                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: status.dot }} />
                    {project.status}
                    <ChevronDown size={12} />
                  </button>
                }>
                {({ close }) => PROJECT_STATUSES.map((s) => (
                  <Button key={s} variant="ghost" role="menuitem" className={item} onClick={() => { close(); onStatus(s); }}>{s}</Button>
                ))}
              </Dropdown>
            </div>
            <p className="mt-1.5 max-w-[360px] text-[13px] leading-5 text-[#6B7280]">{project.description || "No description yet."}</p>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[13px] text-[#4B5563]">
              <span className="flex items-center gap-1.5"><Building2 size={13} />{project.client}</span>
              {lead && (
                <span className="flex items-center gap-1.5">
                  <Avatar name={lead.name} size="xs" style={{ backgroundColor: lead.avatarBg, color: lead.avatarFg }} />
                  Led by {lead.name}
                </span>
              )}
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[13px] text-[#4B5563]">
              <span className="flex items-center gap-1.5">
                <Calendar size={13} />
                {formatShortDate(project.startDate)} – {formatLongDate(project.dueDate)} · <span style={{ color: note.overdue ? "#B42318" : undefined }}>{note.text}</span>
              </span>
              <span className="flex items-center gap-1.5"><Flag size={13} style={{ color: PRIORITY_STYLES[project.priority] }} />{project.priority} priority</span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Ring value={percent} color={status.dot} />
          <div className="text-xs leading-4 text-[#6B7280]">
            <b className="block text-[13px] text-[var(--color-text-primary)]">{done}/{tasks.length}</b>
            tasks done
          </div>
          <AvatarGroup users={members} max={4} size="compact" />
          <Button variant="outline" onClick={onSettings}><SlidersHorizontal size={14} />Settings</Button>
          <Button onClick={onAddTask}><Plus size={14} />Add task</Button>
          <Dropdown mode="menu" menuClassName={menuBox + " right-0 top-10"}
            trigger={<Button variant="outline" aria-label="More project actions" className="!w-9 !px-0"><MoreHorizontal size={16} /></Button>}>
            {({ close }) => (
              <>
                <Button variant="ghost" role="menuitem" className={item} onClick={() => { close(); onDuplicate(); }}><Copy size={14} />Duplicate project</Button>
                <Button variant="ghost" role="menuitem" className={item} onClick={() => { close(); onArchive(); }}><Archive size={14} />Archive</Button>
                <Button variant="ghost" role="menuitem" className={item + " !text-[var(--color-danger)]"} onClick={() => { close(); onDelete(); }}>
                  <Trash2 size={14} />{isDemo ? "Delete demo project" : "Delete project"}
                </Button>
              </>
            )}
          </Dropdown>
        </div>
      </div>
      <Tabs className="px-[22px]" activeTab={tab} onChange={onTab} tabs={[
        { value: "overview", label: "Overview", icon: Home },
        { value: "board", label: "Board", icon: LayoutGrid, count: tasks.length },
        { value: "list", label: "List", icon: List },
        { value: "timeline", label: "Timeline", icon: GanttChart },
        { value: "files", label: "Files", icon: Paperclip, count: fileCount },
        { value: "activity", label: "Activity", icon: Activity },
      ]} />
    </div>
  );
}

export default ProjectHeader;
