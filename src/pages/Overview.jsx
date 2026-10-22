import { useState } from "react";

import useTaskStore from "../hooks/useTaskStore";
import { getLiveProjects } from "../utils/liveData";
import { RANGES, buildDashboard } from "../components/dashboard/dashboardData";

import OverviewKpiSection from "../components/dashboard/OverviewKpiSection";
import TaskCompletionCard from "../components/dashboard/TaskCompletionCard";
import TasksByStatusCard from "../components/dashboard/TasksByStatusCard";
import ProjectHealthCard from "../components/dashboard/ProjectHealthCard";
import PriorityTasksCard from "../components/dashboard/PriorityTasksCard";
import RecentActivityCard from "../components/dashboard/RecentActivityCard";

function Overview() {
    const store = useTaskStore();
    const [range, setRange] = useState("8w");
    // tasks ticked off on this screen stay in the list (crossed out) until you leave
    const [justDone, setJustDone] = useState([]);

    // projects are saved in localStorage, tasks and activity come from the task store
    const projects = getLiveProjects();
    const dash = buildDashboard({
        projects,
        tasks: store.tasks,
        activity: store.activity,
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
        </div>
    );
}

export default Overview;
