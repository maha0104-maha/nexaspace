import { useState } from "react";
import { Folder, ChevronDown, Check, Plus } from "lucide-react";
import useTaskStore from "../hooks/useTaskStore";
import { getLiveProjects } from "../utils/liveData";
import { RANGES, buildDashboard } from "../components/dashboard/dashboardData";
import OverviewKpiSection from "../components/dashboard/OverviewKpiSection";
import TaskCompletionCard from "../components/dashboard/TaskCompletionCard";
import TasksByStatusCard from "../components/dashboard/TasksByStatusCard";
import ProjectHealthCard from "../components/dashboard/ProjectHealthCard";
import PriorityTasksCard from "../components/dashboard/PriorityTasksCard";
import RecentActivityCard from "../components/dashboard/RecentActivityCard";
import Button from "../components/common/Button";
import Dropdown from "../components/common/Dropdown";
import CreateTaskModal from "../components/projects/CreateTaskModal";

// same look as the other menus in the app (status menu, card menu)
const menuBox = "absolute right-0 top-10 z-30 w-[220px] rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)] p-1 shadow-lg";

function Overview() {
    const store = useTaskStore();
    const [range, setRange] = useState("8w");
    const [selectedProjectId, setSelectedProjectId] = useState("all");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [justDone, setJustDone] = useState([]);

    // projects are saved in localStorage, tasks and activity come from the task store
    const projects = getLiveProjects();

    // if the chosen project was deleted meanwhile, go back to showing all of them
    const selectedProject = projects.find((p) => p.id === selectedProjectId);
    const filterId = selectedProject ? selectedProjectId : "all";
    const currentProjectLabel = selectedProject ? selectedProject.name : "All projects";

    // the dashboard only looks at the chosen project (or at everything)
    const onlyChosen = (list, key) => (filterId === "all" ? list : list.filter((item) => item[key] === filterId));
    const dash = buildDashboard({
        projects: filterId === "all" ? projects : projects.filter((p) => p.id === filterId),
        tasks: onlyChosen(store.tasks, "projectId"),
        activity: onlyChosen(store.activity, "projectId"),
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
        store.addTask(taskData);
        setIsCreateModalOpen(false);
    };

    // the options of the project menu: "All projects" first, then every project
    const projectOptions = [{ id: "all", name: "All projects" }, ...projects];

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

                <div className="flex flex-wrap items-center gap-3">
                    <Dropdown
                        mode="menu"
                        menuClassName={menuBox}
                        trigger={
                            <Button variant="outline" aria-label="Choose project">
                                <Folder size={14} strokeWidth={1.7} />
                                <span className="max-w-[160px] truncate">{currentProjectLabel}</span>
                                <ChevronDown size={14} strokeWidth={1.7} />
                            </Button>
                        }
                    >
                        {({ close }) => (
                            <div className="max-h-[288px] overflow-y-auto">
                                {projectOptions.map((option) => (
                                    <Button
                                        key={option.id}
                                        variant="ghost"
                                        role="menuitem"
                                        className="w-full !justify-start"
                                        onClick={() => {
                                            setSelectedProjectId(option.id);
                                            close();
                                        }}
                                    >
                                        <span className="min-w-0 flex-1 truncate text-left">{option.name}</span>
                                        {filterId === option.id && <Check size={14} strokeWidth={2} />}
                                    </Button>
                                ))}
                            </div>
                        )}
                    </Dropdown>

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

                    <Button
                        className="!bg-[var(--color-text-primary)]"
                        disabled={projects.length === 0}
                        onClick={() => setIsCreateModalOpen(true)}
                    >
                        <Plus size={15} strokeWidth={2} aria-hidden="true" />
                        Create task
                    </Button>
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

            <CreateTaskModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onCreate={handleCreateTask}
                projectList={projects}
                projectId={filterId !== "all" ? filterId : projects[0]?.id}
            />
        </div>
    );
}

export default Overview;