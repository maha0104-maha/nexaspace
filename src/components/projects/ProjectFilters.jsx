/* eslint-disable react-refresh/only-export-components */
import { useEffect, useMemo, useState } from "react";
import { LayoutGrid, Table2 } from "lucide-react";

import Button from "../common/Button";
import Dropdown from "../common/Dropdown";
import SearchInput from "../common/SearchInput";

import {
    projects as seedProjects,
    users as allUsers,
    daysUntil,
    PROJECT_STATUSES,
    PROJECT_PRIORITIES,
    SORT_OPTIONS,
} from "../../data";

/* -------------------------------------------------------------------------- */
/*                         options + pure filter logic                        */
/* -------------------------------------------------------------------------- */

// "" always means "Any ..." (it is the Dropdown placeholder option)
export const DEFAULT_FILTERS = {
    search: "",
    status: "",
    lead: "",
    priority: "",
    deadline: "",
    sort: "deadline",
};

const DEADLINE_OPTIONS = [
    { label: "Overdue", value: "overdue" },
    { label: "Due this week", value: "week" },
    { label: "Due this month", value: "month" },
];

const SORT_VALUES = {
    Deadline: "deadline",
    Name: "name",
    Newest: "newest",
    Completion: "completion",
};

const toOptions = (list) => list.map((item) => ({ label: item, value: item }));

const matchesDeadline = (project, deadline) => {
    if (!deadline) return true;

    const days = daysUntil(project.dueDate);

    if (deadline === "overdue") return days < 0;
    if (deadline === "week") return days >= 0 && days <= 7;
    if (deadline === "month") return days >= 0 && days <= 30;

    return true;
};

const SORTERS = {
    deadline: (a, b) => new Date(a.dueDate) - new Date(b.dueDate),
    name: (a, b) => a.name.localeCompare(b.name),
    newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    completion: (a, b) =>
        b.taskDone / (b.taskTotal || 1) - a.taskDone / (a.taskTotal || 1),
};

export const applyProjectFilters = (list, filters) => {
    const query = filters.search.trim().toLowerCase();

    return list
        .filter((project) => {
            if (
                query &&
                !project.name.toLowerCase().includes(query) &&
                !project.client.toLowerCase().includes(query)
            ) {
                return false;
            }
            if (filters.status && project.status !== filters.status) return false;
            if (filters.lead && project.leadId !== filters.lead) return false;
            if (filters.priority && project.priority !== filters.priority) return false;

            return matchesDeadline(project, filters.deadline);
        })
        .sort(SORTERS[filters.sort] || SORTERS.deadline);
};

/* -------------------------------------------------------------------------- */
/*          hook: everything the Projects page needs, in one call             */
/* -------------------------------------------------------------------------- */

export const PROJECTS_STORAGE_KEY = "nexaspace.projects.v1";

export const useProjects = (initial = seedProjects) => {
    // first visit -> demo data; afterwards -> whatever is saved in localStorage
    const [projects, setProjects] = useState(() => {
        try {
            const saved = JSON.parse(localStorage.getItem(PROJECTS_STORAGE_KEY));
            return Array.isArray(saved) ? saved : initial;
        } catch {
            return initial;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
        } catch {
            /* storage full or unavailable - ignore */
        }
    }, [projects]);

    const [filters, setFilters] = useState(DEFAULT_FILTERS);
    const [view, setView] = useState("grid");

    const filtered = useMemo(
        () => applyProjectFilters(projects, filters),
        [projects, filters]
    );

    return {
        projects,
        filtered,
        filters,
        view,
        setView,
        setFilter: (key, value) =>
            setFilters((current) => ({ ...current, [key]: value })),
        clearFilters: () =>
            setFilters((current) => ({
                ...DEFAULT_FILTERS,
                sort: current.sort,
            })),
        addProject: (project) => setProjects((list) => [...list, project]),
        duplicateProject: (project) =>
            setProjects((list) => [
                ...list,
                {
                    ...project,
                    id: `${project.id}-copy-${Date.now()}`,
                    name: `${project.name} (copy)`,
                },
            ]),
        archiveProject: (project) =>
            setProjects((list) => list.filter((item) => item.id !== project.id)),
    };
};

/* -------------------------------------------------------------------------- */
/*                              Grid / Table toggle                           */
/* -------------------------------------------------------------------------- */

export const ProjectViewToggle = ({ view, setView }) => {
    const options = [
        { id: "grid", label: "Grid", icon: LayoutGrid },
        { id: "list", label: "Table", icon: Table2 },
    ];

    return (
        <div
            role="group"
            aria-label="Project view"
            className="flex h-10 items-center gap-1 rounded-[10px] bg-[var(--color-background)] p-1"
        >
            {options.map(({ id, label, icon: Icon }) => {
                const active = view === id;

                return (
                    <Button
                        key={id}
                        variant="ghost"
                        size="sm"
                        aria-pressed={active}
                        onClick={() => setView(id)}
                        className={`!h-8 ${
                            active
                                ? "!bg-[var(--color-surface)] !text-[var(--color-text-primary)] shadow-[var(--shadow-sm)]"
                                : ""
                        }`}
                    >
                        <Icon size={13} strokeWidth={1.8} aria-hidden="true" />
                        {label}
                    </Button>
                );
            })}
        </div>
    );
};

/* -------------------------------------------------------------------------- */
/*                                  filter bar                                */
/* -------------------------------------------------------------------------- */

/*  <ProjectFilters filters={filters} onChange={setFilter} onClear={clearFilters} />  */
const ProjectFilters = ({
    filters = DEFAULT_FILTERS,
    onChange = () => {},
    onClear,
    users = allUsers,
    projects = seedProjects,
}) => {
    const leadIds = new Set(projects.map((project) => project.leadId));
    const leadOptions = users
        .filter((user) => leadIds.has(user.id))
        .map((user) => ({ label: user.name, value: user.id }));

    const hasActiveFilters = ["search", "status", "lead", "priority", "deadline"].some(
        (key) => filters[key] !== ""
    );

    const sortOptions = SORT_OPTIONS.map((label) => ({
        label,
        value: SORT_VALUES[label] ?? label.toLowerCase(),
    }));

    const select = (key) => (event) => onChange(key, event.target.value);

    return (
        <div className="mt-6 flex flex-wrap items-center gap-2">
            <div className="w-full sm:w-[280px]">
                <SearchInput
                    value={filters.search}
                    onChange={select("search")}
                    placeholder="Search by project or client"
                    aria-label="Search by project or client"
                />
            </div>

            <Dropdown
                value={filters.status}
                onChange={select("status")}
                options={toOptions(PROJECT_STATUSES)}
                placeholder="Any status"
                aria-label="Filter by status"
                className="shrink-0 !w-[120px]"
            />

            <Dropdown
                value={filters.lead}
                onChange={select("lead")}
                options={leadOptions}
                placeholder="Any lead"
                aria-label="Filter by lead"
                className="shrink-0 !w-[140px]"
            />

            <Dropdown
                value={filters.priority}
                onChange={select("priority")}
                options={toOptions([...PROJECT_PRIORITIES].reverse())}
                placeholder="Any priority"
                aria-label="Filter by priority"
                className="shrink-0 !w-[130px]"
            />

            <Dropdown
                value={filters.deadline}
                onChange={select("deadline")}
                options={DEADLINE_OPTIONS}
                placeholder="Any deadline"
                aria-label="Filter by deadline"
                className="shrink-0 !w-[140px]"
            />

            {hasActiveFilters && onClear && (
                <Button variant="ghost" onClick={onClear}>
                    Clear
                </Button>
            )}

            <div className="ml-auto flex shrink-0 items-center gap-2.5">
                <span className="text-[13px] text-[var(--color-text-secondary)]">Sort</span>

                <Dropdown
                    value={filters.sort}
                    onChange={select("sort")}
                    options={sortOptions}
                    placeholder={null}
                    aria-label="Sort projects"
                    className="shrink-0 !w-[130px]"
                />
            </div>
        </div>
    );
};

export default ProjectFilters;
