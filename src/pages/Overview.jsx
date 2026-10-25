import { useState, useMemo } from "react";
import useTaskStore from "../hooks/useTaskStore";
import { getLiveProjects } from "../utils/liveData";
import { withNewTask } from "../utils/taskStore";
import { RANGES, buildDashboard } from "../components/dashboard/dashboardData";
import OverviewKpiSection from "../components/dashboard/OverviewKpiSection";
import TaskCompletionCard from "../components/dashboard/TaskCompletionCard";
import TasksByStatusCard from "../components/dashboard/TasksByStatusCard";
import ProjectHealthCard from "../components/dashboard/ProjectHealthCard";
import PriorityTasksCard from "../components/dashboard/PriorityTasksCard";
import RecentActivityCard from "../components/dashboard/RecentActivityCard";
import Dropdown from "../components/common/Dropdown";
import CreateTaskModal from "../components/projects/CreateTaskModal";

function Overview() {
    const store = useTaskStore();
    const [range, setRange] = useState("8w");
    const [selectedProjectId, setSelectedProjectId] = useState("all");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [justDone, setJustDone] = useState([]);

    // Live projects from localStorage (sorted according to demo order + new additions)
    const projects = getLiveProjects();

    // Determine current label for the dropdown button
    const selectedProject = projects.find((p) => p.id === selectedProjectId);
    const currentProjectLabel = selectedProjectId === "all" ? "All projects" : (selectedProject?.name || "All projects");

    // Filter tasks and projects based on the selected project
    const activeProjects = useMemo(() => {
        if (selectedProjectId === "all") return projects;
        return projects.filter((p) => p.id === selectedProjectId);
    }, [projects, selectedProjectId]);

    const activeTasks = useMemo(() => {
        if (selectedProjectId === "all") return store.tasks;
        return store.tasks.filter((t) => t.projectId === selectedProjectId);
    }, [store.tasks, selectedProjectId]);

    const activeActivity = useMemo(() => {
        if (selectedProjectId === "all") return store.activity;
        return store.activity.filter((a) => a.projectId === selectedProjectId);
    }, [store.activity, selectedProjectId]);

    const dash = buildDashboard({
        projects: activeProjects,
        tasks: activeTasks,
        activity: activeActivity,
        range,
        justDone,
    });

    const toggleTask = (id) => {
        const task = store.tasks.find((item) => item.id === id);
        if (!task) return;

        if (task.status === "Done") {
            store.updateTask(id, { status: "To Do" });
            setJustDone(justDone.filter((taskId) => taskId !== id));
        } else {
            store.updateTask(id, { status: "Done" });
            setJustDone([...justDone, id]);
        }
    };

    const handleCreateTask = (taskData) => {
        if (store.setStore) {
            store.setStore((old) => withNewTask(old, taskData));
        } else if (store.addTask) {
            store.addTask(taskData);
        }
        setIsCreateModalOpen(false);
    };

    return (
        <div className="px-4 pb-10 pt-[30px] sm:px-[34px]">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h2 className="text-[28px] font-bold leading-[34px] tracking-[-0.6px] text-[var(--color-text-primary)]">
                        {dash.greeting}
                    </h2>
                    <p className="mt-1 text-[13px] text-[var(--color-text-secondary)]">
                        {dash.subtitle}
                    </p>
                </div>

                {/* Right controls: Project Dropdown, Date Range selector, Black Create Task Button */}
                <div className="flex flex-wrap items-center gap-3">
                    {/* Project Selector using Reusable Dropdown in menu mode */}
                    <Dropdown
                        mode="menu"
                        trigger={
                            <button
                                type="button"
                                className="inline-flex h-9 items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-[13px] font-medium text-[var(--color-text-primary)] shadow-sm transition-colors hover:bg-[var(--color-background)]"
                            >
                                <svg
                                    className="h-4 w-4 text-[var(--color-text-secondary)]"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="1.8"
                                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                                    />
                                </svg>
                                <span>{currentProjectLabel}</span>
                                <svg
                                    className="h-3.5 w-3.5 text-[var(--color-text-secondary)]"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </button>
                        }
                        menuClassName="absolute right-0 z-50 mt-1.5 w-56 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-1.5 shadow-[var(--shadow-lg)]"
                    >
                        {({ close }) => (
                            <div className="flex flex-col gap-0.5 max-h-72 overflow-y-auto">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedProjectId("all");
                                        close();
                                    }}
                                    className={`flex w-full items-center rounded-lg px-2.5 py-1.5 text-left text-[13px] transition-colors ${
                                        selectedProjectId === "all"
                                            ? "bg-[var(--color-background)] font-medium text-[var(--color-text-primary)]"
                                            : "text-[var(--color-text-secondary)] hover:bg-[var(--color-background)] hover:text-[var(--color-text-primary)]"
                                    }`}
                                >
                                    All projects
                                </button>
                                {projects.map((project) => (
                                    <button
                                        key={project.id}
                                        type="button"
                                        onClick={() => {
                                            setSelectedProjectId(project.id);
                                            close();
                                        }}
                                        className={`flex w-full items-center rounded-lg px-2.5 py-1.5 text-left text-[13px] transition-colors ${
                                            selectedProjectId === project.id
                                                ? "bg-[var(--color-background)] font-medium text-[var(--color-text-primary)]"
                                                : "text-[var(--color-text-secondary)] hover:bg-[var(--color-background)] hover:text-[var(--color-text-primary)]"
                                        }`}
                                    >
                                        {project.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </Dropdown>

                    {/* Date Range Selector */}
                    <div
                        role="radiogroup"
                        aria-label="Date range"
                        className="flex gap-1 rounded-[10px] bg-[var(--color-surface)] p-1 shadow-[var(--shadow-sm)]"
                    >
                        {RANGES.map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                role="radio"
                                aria-checked={range === item.id}
                                onClick={() => setRange(item.id)}
                                className={`h-8 rounded-lg px-3 text-[13px] font-medium ${
                                    range === item.id
                                        ? "bg-[var(--color-background)] text-[var(--color-text-primary)]"
                                        : "text-[var(--color-text-secondary)]"
                                }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    {/* Black Create Task Button */}
                    <button
                        type="button"
                        onClick={() => setIsCreateModalOpen(true)}
                        className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#0F172A] px-3.5 text-[13px] font-medium text-white shadow-sm transition-colors hover:bg-black focus:outline-none focus:ring-2 focus:ring-black/20"
                    >
                        <span className="text-[15px] leading-none">+</span>
                        <span>Create task</span>
                    </button>
                </div>
            </div>

            <OverviewKpiSection items={dash.kpis} />

            <div className="mt-[13px] grid gap-[13px] xl:grid-cols-[minmax(0,1fr)_352px]">
                <TaskCompletionCard data={dash.completion} rangeLabel={dash.rangeLabel} />
                <TasksByStatusCard data={dash.statusBreakdown} />

                <ProjectHealthCard projects={dash.projectRows} />
                <RecentActivityCard items={dash.activityItems} />
            </div>

            <div className="mt-[13px]">
                <PriorityTasksCard tasks={dash.priorityTasks} onToggle={toggleTask} />
            </div>

            {/* Create Task Modal */}
            {isCreateModalOpen && (
                <CreateTaskModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    onSubmit={handleCreateTask}
                    defaultProjectId={selectedProjectId !== "all" ? selectedProjectId : projects[0]?.id}
                />
            )}
        </div>
    );
}

export default Overview;