import {
    Circle,
    CircleCheck,
    CircleDashed,
    Contrast,
    Eye,
    BriefcaseMedical,
    TrendingUp,
    UtensilsCrossed,
    Megaphone,
    Store,
    Database,
    Rocket,
    Smartphone,
} from "lucide-react";

import {
    users,
    activities,
    dashboardActivityIds,
    currentUserId,
    getUserById,
    getDeadlineNote,
    formatShortDate,
    daysUntil,
    DEMO_TODAY,
} from "../../data";
import { addDaysIso, mondayBefore, timeAgo } from "../../utils/taskUtils";


export const RANGES = [
    { id: "14d", label: "14 days" },
    { id: "8w", label: "8 weeks" },
    { id: "12w", label: "12 weeks" },
];

// avatar colours come from the team list, keyed by the initials we show
export const AVATAR_STYLES = {};
users.forEach((user) => {
    AVATAR_STYLES[user.avatar] = { bg: user.avatarBg, fg: user.avatarFg };
});

export const PROJECT_STATUS_STYLES = {
    "On track": { bg: "#E3F6EC", fg: "#0B7A4B" },
    "At risk": { bg: "#FEF3D6", fg: "#9A5B00" },
    Delayed: { bg: "#FDE4E1", fg: "#B42318" },
};

export const PRIORITY_STYLES = {
    Urgent: "#E5484D",
    High: "#E8890C",
    Medium: "#3B82F6",
    Low: "#9CA3AF",
};

export const TASK_STATUS_STYLES = {
    Backlog: { bg: "#EEF0F3", fg: "#4B5563", icon: CircleDashed },
    "To Do": { bg: "#E6E8EC", fg: "#374151", icon: Circle },
    "In Progress": { bg: "#FDEFD3", fg: "#92580A", icon: Contrast },
    "In Review": { bg: "#EDE9FE", fg: "#5B3FD0", icon: Eye },
    Done: { bg: "#E3F6EC", fg: "#0B7A4B", icon: CircleCheck },
};

// the projects store an icon name
const PROJECT_ICONS = {
    clinic: BriefcaseMedical,
    chart: TrendingUp,
    utensils: UtensilsCrossed,
    megaphone: Megaphone,
    store: Store,
    database: Database,
    rocket: Rocket,
    phone: Smartphone,
};

const STATUS_COLORS = {
    Backlog: "#9CA3AF",
    "To Do": "#667085",
    "In Progress": "#E8890C",
    "In Review": "#7C5CFA",
    Done: "#12A06C",
};


const PROJECT_STATUS_LABEL = {
    "On Track": "On track",
    "At Risk": "At risk",
    Delayed: "Delayed",
};

const BAR_COLORS = {
    "On track": "#0F9D86",
    "At risk": "#E8890C",
    Delayed: "#E5484D",
};

const PRIORITY_RANK = { Urgent: 0, High: 1, Medium: 2, Low: 3 };
const GRAY = "#E5E7EB";



const isOpen = (task) => task.status !== "Done";
const myOpenTasks = (tasks) =>
    tasks.filter((task) => task.assigneeId === currentUserId && isOpen(task));

// bars with a 0 value would only leave a gap, so drop them
const nonEmpty = (segments) => {
    const kept = segments.filter((segment) => segment.value > 0);
    return kept.length ? kept : [{ value: 1, color: GRAY }];
};

// how many tasks are due between Monday and Sunday k
const dueThisWeek = (tasks) => {
    const monday = mondayBefore(DEMO_TODAY);
    const sunday = addDaysIso(monday, 6);
    return myOpenTasks(tasks).filter(
        (task) => task.dueDate >= monday && task.dueDate <= sunday
    ).length;
};

const countBetween = (tasks, field, from, to) =>
    tasks.filter((task) => task[field] && task[field] >= from && task[field] < to).length;



export const getGreeting = () => {
    const hour = new Date().getHours();
    const part = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";
    return `Good ${part}, ${getUserById(currentUserId).firstName}`;
};

export const getSubtitle = (tasks) => {
    const day = new Date(DEMO_TODAY + "T00:00:00").toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
    });
    const due = dueThisWeek(tasks);

    if (due === 0) return `${day} · none of your tasks are due this week`;
    if (due === 1) return `${day} · 1 of your tasks is due this week`;
    return `${day} · ${due} of your tasks are due this week`;
};

/* ------------------------------------------------------------------ */
/* task completion chart                                               */
/* ------------------------------------------------------------------ */

// where the chart starts and how wide each bar is, for the chosen range
const getWindow = (rangeId) => {
    if (rangeId === "14d") {
        return { count: 14, step: 1, first: addDaysIso(DEMO_TODAY, -13) };
    }
    const count = rangeId === "12w" ? 12 : 8;
    return {
        count,
        step: 7,
        first: addDaysIso(mondayBefore(DEMO_TODAY), -7 * (count - 1)),
    };
};

export const buildCompletion = (tasks, rangeId) => {
    const { count, step, first } = getWindow(rangeId);
    const rows = [];

    for (let i = 0; i < count; i++) {
        const from = addDaysIso(first, i * step);
        const to = addDaysIso(from, step);

        rows.push({
            label: formatShortDate(from),
            completed: countBetween(tasks, "completedAt", from, to),
            // a task counts as created on the day it starts (never in the future)
            created: tasks.filter(
                (task) => task.startDate >= from && task.startDate < to && task.startDate <= DEMO_TODAY
            ).length,
        });
    }
    return rows;
};



export const buildStatusBreakdown = (tasks) =>
    Object.keys(STATUS_COLORS).map((label) => ({
        label,
        value: tasks.filter((task) => task.status === label).length,
        color: STATUS_COLORS[label],
    }));


export const buildProjectRows = (projects, tasks) =>
    projects.map((project) => {
        const list = tasks.filter((task) => task.projectId === project.id);
        const done = list.filter((task) => task.status === "Done").length;
        const progress = list.length ? Math.round((done / list.length) * 100) : 0;
        const lead = getUserById(project.leadId);
        const note = getDeadlineNote(project.dueDate);
        const status = PROJECT_STATUS_LABEL[project.status] || "On track";

        return {
            id: project.id,
            name: project.name,
            client: project.client,
            done,
            total: list.length,
            lead: {
                name: lead ? lead.name : "Unassigned",
                initials: lead ? lead.avatar : "?",
            },
            progress,
            barColor: BAR_COLORS[status],
            deadline: formatShortDate(project.dueDate),
            deadlineNote: note.text,
            overdue: note.overdue,
            status,
            icon: PROJECT_ICONS[project.icon] || Rocket,
            iconBg: project.iconBg,
            iconColor: project.iconColor,
        };
    });



const dueText = (days) => {
    if (days === -1) return "Yesterday";
    if (days < 0) return `${Math.abs(days)}d overdue`;
    if (days === 0) return "Today";
    if (days === 1) return "Tomorrow";
    return null; // far away, the caller shows the date
};


export const buildPriorityTasks = (tasks, projects, justDone = []) =>
    tasks
        .filter(
            (task) =>
                task.assigneeId === currentUserId &&
                (isOpen(task) || justDone.includes(task.id))
        )
        .sort(
            (a, b) =>
                a.dueDate.localeCompare(b.dueDate) ||
                PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]
        )
        .slice(0, 6)
        .map((task) => {
            const project = projects.find((p) => p.id === task.projectId);
            const days = daysUntil(task.dueDate);
            const done = task.status === "Done";

            return {
                id: task.id,
                title: task.title,
                project: task.projectId,
                projectName: project ? project.name : "Project",
                projectIcon: (project && PROJECT_ICONS[project.icon]) || Rocket,
                projectColor: project ? project.color || project.iconColor : "#6B7280",
                priority: task.priority,
                due: dueText(days) || formatShortDate(task.dueDate),
                overdue: days < 0 && !done,
                soon: days >= 0 && days <= 1 && !done,
                status: task.status,
                done,
            };
        });

/* recent activity   */


export const buildActivity = (liveActivity) => {
    const starter = dashboardActivityIds
        .map((id) => activities.find((item) => item.id === id))
        .filter(Boolean)
        .map((item) => ({ ...item, time: item.dashboardAgo }));

    const fresh = liveActivity.map((item) => ({ ...item, time: timeAgo(item) }));

    return [...fresh, ...starter].slice(0, 7).map((item) => {
        const user = getUserById(item.userId);
        let verb = item.verb;
        let suffix = item.suffix;

      
        if (verb === "moved" && suffix === "to Done") {
            verb = "completed";
            suffix = "";
        }

        return {
            id: item.id,
            initials: user ? user.avatar : "?",
            name: user ? user.name : "Someone",
            verb,
            target: item.target,
            suffix,
            time: item.time,
        };
    });
};


const HOURS_PER_PERSON = 60;

export const buildKpis = ({ projects, tasks, range, completion }) => {
    const rangeLabel = RANGES.find((item) => item.id === range).label;

    // projects
    const onTrack = projects.filter((p) => p.status === "On Track").length;
    const atRisk = projects.filter((p) => p.status === "At Risk").length;
    const delayed = projects.filter((p) => p.status === "Delayed").length;
    const needAttention = atRisk + delayed;

    // my tasks
    const mine = myOpenTasks(tasks);
    const byStatus = (label) => mine.filter((task) => task.status === label).length;

    // completed in the chosen range, compared with the range before it
    const completedNow = completion.reduce((sum, item) => sum + item.completed, 0);
    const { count, step, first } = getWindow(range);
    const before = countBetween(tasks, "completedAt", addDaysIso(first, -count * step), first);
    let change;
    if (before === 0) change = completedNow > 0 ? 100 : 0;
    else change = Math.round(((completedNow - before) / before) * 100);
    const badge = completedNow === 0 && before === 0 ? null : `${change >= 0 ? "+" : "-"}${Math.min(Math.abs(change), 999)}%`;

    // overdue (every open task whose date has passed, whoever it belongs to)
    const late = tasks.filter((task) => isOpen(task) && daysUntil(task.dueDate) < 0);
    const lateProjects = new Set(late.map((task) => task.projectId)).size;
    const lateBy = (priority) => late.filter((task) => task.priority === priority).length;

    // projects that need attention, by name
    const names = projects
        .filter((p) => p.status !== "On Track")
        .map((p) => p.name.split(" ")[0]);
    const nameText =
        names.length === 0
            ? "Every project is on track"
            : names.length <= 3
            ? names.join(", ")
            : `${names.slice(0, 3).join(", ")} +${names.length - 3}`;

    // team utilization
    let booked = 0;
    tasks
        .filter((task) => isOpen(task) && daysUntil(task.dueDate) <= 14)
        .forEach((task) => {
            booked += task.estimateHours;
        });
    const capacity = users.length * HOURS_PER_PERSON;
    const percent = capacity ? Math.round((booked / capacity) * 100) : 0;
    const filled = Math.min(percent, 100);

    const dueWeek = dueThisWeek(tasks);

    return [
        {
            id: "active-projects",
            title: "Active projects",
            value: String(projects.length),
            iconName: "projects",
            caption: `${onTrack} on track · ${needAttention} need attention`,
            segments: nonEmpty([
                { value: onTrack, color: "#12A06C" },
                { value: atRisk, color: "#E8890C" },
                { value: delayed, color: "#E5484D" },
            ]),
        },
        {
            id: "open-tasks",
            title: "My open tasks",
            value: String(mine.length),
            iconName: "users",
            caption: `${dueWeek} due this week`,
            segments: nonEmpty([
                { value: byStatus("Backlog"), color: "#9CA3AF" },
                { value: byStatus("To Do"), color: "#667085" },
                { value: byStatus("In Progress"), color: "#E8890C" },
                { value: byStatus("In Review"), color: "#7C5CFA" },
            ]),
        },
        {
            id: "completed",
            title: "Completed",
            value: String(completedNow),
            badge,
            iconName: "completed",
            caption: `last ${rangeLabel}`,
            sparkline: completion.map((item) => item.completed),
        },
        {
            id: "overdue",
            title: "Overdue tasks",
            value: String(late.length),
            iconName: "overdue",
            valueColor: late.length ? "#B42318" : undefined,
            caption:
                late.length === 0
                    ? "Nothing is overdue"
                    : `Across ${lateProjects} ${lateProjects === 1 ? "project" : "projects"}`,
            segments: nonEmpty([
                { value: lateBy("Urgent"), color: "#E5484D" },
                { value: lateBy("High"), color: "#E8890C" },
                { value: lateBy("Medium"), color: "#2F8CF5" },
                { value: lateBy("Low"), color: "#9CA3AF" },
            ]),
        },
        {
            id: "at-risk",
            title: "Projects at risk",
            value: String(needAttention),
            iconName: "flag",
            caption: nameText,
            segments: nonEmpty([
                { value: atRisk, color: "#E8890C" },
                { value: delayed, color: "#E5484D" },
                { value: onTrack, color: GRAY },
            ]),
        },
        {
            id: "utilization",
            title: "Team utilization",
            value: `${percent}%`,
            iconName: "gauge",
            caption: "Next 14 days · estimated hours",
            segments: nonEmpty([
                { value: filled, color: percent > 100 ? "#E5484D" : "#0F9D86" },
                { value: 100 - filled, color: GRAY },
            ]),
        },
    ];
};



export const buildDashboard = ({ projects, tasks, activity, range, justDone }) => {
    const completion = buildCompletion(tasks, range);

    return {
        greeting: getGreeting(),
        subtitle: getSubtitle(tasks),
        rangeLabel: RANGES.find((item) => item.id === range).label,
        kpis: buildKpis({ projects, tasks, range, completion }),
        completion,
        statusBreakdown: buildStatusBreakdown(tasks),
        projectRows: buildProjectRows(projects, tasks),
        priorityTasks: buildPriorityTasks(tasks, projects, justDone),
        activityItems: buildActivity(activity),
    };
};
