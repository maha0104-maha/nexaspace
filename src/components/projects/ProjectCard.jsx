import {
    MoreHorizontal,
    Pencil,
    Copy,
    Archive,
    Calendar,
    Flag,
    FolderSearch,
    Rocket,
    BriefcaseMedical,
    TrendingUp,
    Store,
    Megaphone,
    Database,
    UtensilsCrossed,
    Smartphone,
} from "lucide-react";

import Card from "../common/Card";
import Badge from "../common/Badge";
import Button from "../common/Button";
import Avatar from "../common/Avatar";
import AvatarGroup from "../common/AvatarGroup";
import Dropdown from "../common/Dropdown";
import ProgressBar from "../common/ProgressBar";
import EmptyState from "../common/EmptyState";

import {
    getUserById,
    getProgress,
    getDeadlineNote,
    formatShortDate,
    STATUS_STYLES,
    PRIORITY_STYLES,
} from "../../data";

/* -------------------------------------------------------------------------- */
/*                         small project-only pieces                          */
/* -------------------------------------------------------------------------- */

export const ICONS = {
    rocket: Rocket,
    clinic: BriefcaseMedical,
    chart: TrendingUp,
    store: Store,
    megaphone: Megaphone,
    database: Database,
    utensils: UtensilsCrossed,
    phone: Smartphone,
};

// status -> ProgressBar colour token
const BAR_COLOR = { "On Track": "success", "At Risk": "warning", Delayed: "danger" };

const ProjectIcon = ({ project, size = 40, iconSize = 18 }) => {
    const Icon = ICONS[project.icon] || Rocket;

    return (
        <span
            className="flex shrink-0 items-center justify-center"
            style={{
                width: size,
                height: size,
                borderRadius: size >= 40 ? 10 : 8,
                backgroundColor: project.iconBg,
                color: project.iconColor,
            }}
        >
            <Icon size={iconSize} strokeWidth={1.7} />
        </span>
    );
};

const StatusBadge = ({ status }) => {
    const style = STATUS_STYLES[status] || STATUS_STYLES["On Track"];

    return (
        <Badge
            className="!h-6 !rounded-full gap-1.5"
            style={{ backgroundColor: style.bg, color: style.fg }}
        >
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: style.dot }} />
            {status}
        </Badge>
    );
};

const PriorityBadge = ({ priority }) => (
    <Badge className="!h-6 !rounded-full gap-1.5 border border-[var(--color-border)] !bg-[var(--color-surface)] !text-[var(--color-text-primary)]">
        <Flag size={12} strokeWidth={1.8} style={{ color: PRIORITY_STYLES[priority] }} />
        {priority}
    </Badge>
);

const DeadlineNote = ({ dueDate, className = "" }) => {
    const note = getDeadlineNote(dueDate);

    return (
        <span className={className}>
            <span className="font-semibold text-[var(--color-text-primary)]">
                {formatShortDate(dueDate)}
            </span>
            <span style={{ color: note.overdue ? "var(--color-danger)" : undefined }}>
                {" "}· {note.text}
            </span>
        </span>
    );
};

const toUsers = (ids = []) => ids.map(getUserById).filter(Boolean);

/* "..." menu: Edit / Duplicate / Archive (uses the shared Dropdown in menu mode) */
const CardMenu = ({ name, onEdit, onDuplicate, onArchive }) => (
    <div onClick={(event) => event.stopPropagation()}>
        <Dropdown
            mode="menu"
            menuClassName="absolute right-0 top-9 z-[var(--z-dropdown)] w-[180px] rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)] p-1 shadow-[var(--shadow-lg)]"
            trigger={
                <Button
                    variant="ghost"
                    size="sm"
                    aria-label={`More actions for ${name}`}
                    className="!h-7 !w-7 !px-0"
                >
                    <MoreHorizontal size={16} strokeWidth={1.8} />
                </Button>
            }
        >
            {({ close }) => (
                <>
                    <Button
                        variant="ghost"
                        role="menuitem"
                        className="w-full !justify-start"
                        onClick={() => { close(); onEdit?.(); }}
                    >
                        <Pencil size={14} strokeWidth={1.8} /> Edit
                    </Button>
                    <Button
                        variant="ghost"
                        role="menuitem"
                        className="w-full !justify-start"
                        onClick={() => { close(); onDuplicate?.(); }}
                    >
                        <Copy size={14} strokeWidth={1.8} /> Duplicate
                    </Button>
                    <Button
                        variant="ghost"
                        role="menuitem"
                        className="w-full !justify-start !text-[var(--color-danger)]"
                        onClick={() => { close(); onArchive?.(); }}
                    >
                        <Archive size={14} strokeWidth={1.8} /> Archive
                    </Button>
                </>
            )}
        </Dropdown>
    </div>
);

/* -------------------------------------------------------------------------- */
/*                                 single card                                */
/* -------------------------------------------------------------------------- */

/*  <ProjectCard project={project} onOpen onEdit onDuplicate onArchive />  */
export const ProjectCard = ({ project, onOpen, onEdit, onDuplicate, onArchive }) => {
    const progress = getProgress(project);

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={() => onOpen?.(project)}
            onKeyDown={(event) => {
                if (event.target === event.currentTarget && (event.key === "Enter" || event.key === " ")) {
                    event.preventDefault();
                    onOpen?.(project);
                }
            }}
            className="h-full cursor-pointer rounded-xl outline-none transition-shadow hover:shadow-[var(--shadow-md)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/30"
        >
            <Card className="h-full flex flex-col" contentClassName="flex flex-1 flex-col !p-[17px]">
                <div className="flex items-start gap-3">
                    <ProjectIcon project={project} />

                    <div className="min-w-0 flex-1 pt-px">
                        <h3 className="truncate text-[15px] font-semibold leading-5 tracking-[-0.2px] text-[var(--color-text-primary)]">
                            {project.name}
                        </h3>
                        <p className="truncate text-xs leading-[17px] text-[var(--color-text-secondary)]">
                            {project.client}
                        </p>
                    </div>

                    <CardMenu
                        name={project.name}
                        onEdit={() => (onEdit || onOpen)?.(project)}
                        onDuplicate={() => onDuplicate?.(project)}
                        onArchive={() => onArchive?.(project)}
                    />
                </div>

                <p className="mt-3 line-clamp-2 min-h-10 text-[13px] leading-5 text-[var(--color-text-secondary)]">
                    {project.description || "No description yet."}
                </p>

                <div className="mt-3 flex items-center gap-2">
                    <StatusBadge status={project.status} />
                    <PriorityBadge priority={project.priority} />
                </div>

                <div className="mt-4 flex items-center justify-between">
                    <span className="text-[12.5px] text-[var(--color-text-secondary)]">
                        {project.taskDone} of {project.taskTotal} tasks
                    </span>
                    <span className="font-mono text-xs font-bold text-[var(--color-text-primary)]">
                        {progress}%
                    </span>
                </div>

                <ProgressBar
                    value={progress}
                    color={BAR_COLOR[project.status] || "primary"}
                    className="mt-[7px]"
                />

                <div className="mt-auto flex items-center justify-between border-t border-[var(--color-background)] pt-3">
                    <AvatarGroup users={toUsers(project.memberIds)} max={4} size="compact" className="mt-4" />

                    <div className="mt-4 flex items-center gap-1.5 text-[12.5px] text-[var(--color-text-secondary)]">
                        <Calendar size={13} strokeWidth={1.8} />
                        <DeadlineNote dueDate={project.dueDate} />
                    </div>
                </div>
            </Card>
        </div>
    );
};

/* -------------------------------------------------------------------------- */
/*                                 table view                                 */
/* -------------------------------------------------------------------------- */

const tableGrid =
    "grid grid-cols-[252px_162px_122px_102px_152px_122px_minmax(0,1fr)] items-center";

export const ProjectsTable = ({ list, onOpen }) => (
    <Card contentClassName="!p-0 overflow-x-auto">
        <div className="min-w-[1000px]">
            <div
                className={`${tableGrid} h-9 border-b border-[var(--color-border)] px-4 text-[11px] font-medium uppercase tracking-[0.6px] text-[var(--color-text-secondary)]`}
            >
                <span>Project</span>
                <span>Lead</span>
                <span>Status</span>
                <span>Priority</span>
                <span>Progress</span>
                <span>Deadline</span>
                <span>Team</span>
            </div>

            {list.map((project) => {
                const lead = getUserById(project.leadId);
                const progress = getProgress(project);

                return (
                    <div
                        key={project.id}
                        onClick={() => onOpen?.(project)}
                        className={`${tableGrid} h-[54px] cursor-pointer border-b border-[var(--color-background)] px-4 transition-colors last:border-b-0 hover:bg-[var(--color-surface-secondary)]`}
                    >
                        <div className="flex min-w-0 items-center gap-3 pr-3">
                            <ProjectIcon project={project} size={32} iconSize={14} />
                            <div className="min-w-0">
                                <p className="truncate text-[13px] font-semibold leading-[17px] text-[var(--color-text-primary)]">
                                    {project.name}
                                </p>
                                <p className="truncate text-xs leading-4 text-[var(--color-text-secondary)]">
                                    {project.client}
                                </p>
                            </div>
                        </div>

                        <div className="flex min-w-0 items-center gap-2 pr-2">
                            {lead && (
                                <Avatar
                                    name={lead.name}
                                    size="xs"
                                    style={{ backgroundColor: lead.avatarBg, color: lead.avatarFg }}
                                />
                            )}
                            <span className="truncate text-[13px]">{lead?.name}</span>
                        </div>

                        <div>
                            <StatusBadge status={project.status} />
                        </div>

                        <div className="inline-flex items-center gap-[7px] text-[13px]">
                            <Flag size={14} strokeWidth={1.8} style={{ color: PRIORITY_STYLES[project.priority] }} />
                            {project.priority}
                        </div>

                        <div className="flex items-center gap-2 pr-3.5">
                            <ProgressBar value={progress} color={BAR_COLOR[project.status] || "primary"} />
                            <span className="w-10 text-right font-mono text-xs font-bold text-[var(--color-text-primary)]">
                                {progress}%
                            </span>
                        </div>

                        <DeadlineNote dueDate={project.dueDate} className="text-[13px] text-[var(--color-text-secondary)]" />

                        <AvatarGroup users={toUsers(project.memberIds)} max={3} size="xs" />
                    </div>
                );
            })}
        </div>
    </Card>
);

/* -------------------------------------------------------------------------- */
/*                         list: grid / table / empty                         */
/* -------------------------------------------------------------------------- */

/*  <ProjectCards projectList={...} view="grid" | "list" onOpen onClear ... />  */
const ProjectCards = ({
    projectList = [],
    view = "grid",
    onOpen,
    onEdit,
    onDuplicate,
    onArchive,
    onClear,
}) => {
    if (!projectList.length) {
        return (
            <Card>
                <EmptyState
                    icon={<FolderSearch size={28} strokeWidth={1.6} />}
                    title="No projects found"
                    description="Try changing or clearing your filters."
                    action={
                        onClear && (
                            <Button variant="outline" onClick={onClear}>
                                Clear filters
                            </Button>
                        )
                    }
                />
            </Card>
        );
    }

    if (view === "list" || view === "table") {
        return <ProjectsTable list={projectList} onOpen={onOpen} />;
    }

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {projectList.map((project) => (
                <ProjectCard
                    key={project.id}
                    project={project}
                    onOpen={onOpen}
                    onEdit={onEdit}
                    onDuplicate={onDuplicate}
                    onArchive={onArchive}
                />
            ))}
        </div>
    );
};

export default ProjectCards;
