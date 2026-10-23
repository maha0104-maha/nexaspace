import { Link } from "react-router-dom";
import { Check, Flag, Calendar } from "lucide-react";

import { CardHeading, OutlineLink, cardClass } from "./DashboardShared";
import { PRIORITY_STYLES, TASK_STATUS_STYLES } from "./dashboardData";

const taskGrid =
    "grid grid-cols-[40px_minmax(0,1fr)_212px_104px_131px_104px] items-center";

// onToggle(id) is called when a box is ticked, the page saves it to the task
const PriorityTasksCard = ({ tasks, onToggle = () => {} }) => {
    return (
        <section className={`${cardClass} overflow-hidden`}>
            <div className="flex items-start justify-between gap-3 px-[18px] pb-[16px] pt-[17px]">
                <CardHeading
                    title="My priority tasks"
                    subtitle="Overdue first, then by due date and priority"
                />

                <OutlineLink to="/mytasks">Open My Tasks</OutlineLink>
            </div>

            <div className="overflow-x-auto">
                <div className="min-w-[860px] border-t border-[#EEF0F3]">
                    {tasks.length === 0 && (
                        <p className="px-[18px] py-[24px] text-[13px] text-[#6B7280]">
                            Nothing is assigned to you right now.
                        </p>
                    )}

                    {tasks.map((task) => {
                        const ProjectIcon = task.projectIcon;
                        const status = TASK_STATUS_STYLES[task.status];
                        const StatusIcon = status.icon;
                        const done = task.done;

                        // red when late, orange when it is due today or tomorrow
                        const dueColor = task.overdue
                            ? "#D92D20"
                            : task.soon
                            ? "#C2540A"
                            : "#6B7280";

                        return (
                            <div
                                key={task.id}
                                className={`${taskGrid} h-[43px] border-b border-[#EEF0F3] px-[18px] transition-colors last:border-b-0 hover:bg-[#F9FAFB]`}
                            >
                                <button
                                    type="button"
                                    role="checkbox"
                                    aria-checked={done}
                                    aria-label={`Mark ${task.title} as done`}
                                    onClick={() => onToggle(task.id)}
                                    className={`flex h-[18px] w-[18px] items-center justify-center rounded-[5px] border transition-colors ${
                                        done
                                            ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                                            : "border-[#D1D5DB] bg-white"
                                    }`}
                                >
                                    {done && <Check size={12} strokeWidth={3} />}
                                </button>

                                <div className="flex min-w-0 items-center gap-[9px] pr-[12px]">
                                    <span className="shrink-0 font-mono text-[12px] text-[#9CA3AF]">
                                        {task.id}
                                    </span>

                                    <span
                                        className={`truncate text-[13px] font-semibold ${
                                            done
                                                ? "text-[#9CA3AF] line-through"
                                                : "text-[#111827]"
                                        }`}
                                    >
                                        {task.title}
                                    </span>
                                </div>

                                <Link
                                    to={`/projects/${task.project}`}
                                    className="flex min-w-0 items-center gap-[8px] pr-[12px]"
                                >
                                    <ProjectIcon
                                        size={14}
                                        strokeWidth={1.8}
                                        className="shrink-0"
                                        style={{ color: task.projectColor }}
                                    />

                                    <span className="truncate text-[13px] text-[#4B5563]">
                                        {task.projectName}
                                    </span>
                                </Link>

                                <div className="flex items-center gap-[7px]">
                                    <Flag
                                        size={14}
                                        strokeWidth={1.8}
                                        style={{
                                            color: PRIORITY_STYLES[task.priority],
                                        }}
                                    />

                                    <span className="text-[13px] text-[#374151]">
                                        {task.priority}
                                    </span>
                                </div>

                                <div className="flex items-center gap-[7px]">
                                    <Calendar
                                        size={14}
                                        strokeWidth={1.8}
                                        style={{ color: dueColor }}
                                    />

                                    <span
                                        className="text-[13px] font-medium"
                                        style={{ color: dueColor }}
                                    >
                                        {task.due}
                                    </span>
                                </div>

                                <div>
                                    <span
                                        className="inline-flex h-[22px] items-center gap-[6px] rounded-[6px] px-[8px] text-[12px] font-medium"
                                        style={{
                                            backgroundColor: status.bg,
                                            color: status.fg,
                                        }}
                                    >
                                        <StatusIcon size={12} strokeWidth={2} />
                                        {task.status}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default PriorityTasksCard;