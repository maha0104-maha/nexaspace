import { Link } from "react-router-dom";
import { Avatar, CardHeading, OutlineLink, cardClass } from "./DashboardShared";
import { PROJECT_STATUS_STYLES } from "./dashboardData";

const projectGrid =
    "grid grid-cols-[232px_132px_162px_102px_100px] items-center";

const ProjectHealthCard = ({ projects }) => (
    <section className={`${cardClass} min-w-0 overflow-hidden`}>
        <div className="flex items-start justify-between gap-3 px-[18px] pb-[16px] pt-[17px]">
            <CardHeading
                title="Project health"
                subtitle="Completion from task status · status set by project leads"
            />

            <OutlineLink to="/projects">View all projects</OutlineLink>
        </div>

        <div className="overflow-x-auto">
            <div className="min-w-[766px]">
                <div
                    className={`${projectGrid} h-[34px] border-y border-[var(--color-border)] bg-[#F9FAFB] px-[18px] text-[11px] font-medium uppercase tracking-[0.6px] text-[#6B7280]`}
                >
                    <span>Project</span>
                    <span>Lead</span>
                    <span>Progress</span>
                    <span>Deadline</span>
                    <span>Status</span>
                </div>

                {projects.length === 0 && (
                    <p className="px-[18px] py-[24px] text-[13px] text-[#6B7280]">
                        No projects yet. Create one from the Projects page.
                    </p>
                )}

                {projects.map((project) => {
                    const Icon = project.icon;
                    const status =
                        PROJECT_STATUS_STYLES[project.status] ||
                        PROJECT_STATUS_STYLES["On track"];

                    return (
                        <div
                            key={project.id}
                            className={`${projectGrid} h-[56px] border-b border-[#EEF0F3] px-[18px] last:border-b-0 hover:bg-[#FAFBFC]`}
                        >
                            <Link
                                to={`/projects/${project.id}`}
                                className="flex min-w-0 items-center gap-[10px] pr-[12px]"
                            >
                                <span
                                    className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-[8px]"
                                    style={{
                                        backgroundColor: project.iconBg,
                                        color: project.iconColor,
                                    }}
                                >
                                    <Icon size={15} strokeWidth={1.8} />
                                </span>

                                <div className="min-w-0">
                                    <p className="truncate text-[13px] font-semibold leading-[17px] text-[#111827]">
                                        {project.name}
                                    </p>
                                    <p className="truncate text-[12px] font-normal leading-[16px] text-[#6B7280]">
                                        {project.client} · {project.done}/{project.total} tasks
                                    </p>
                                </div>
                            </Link>

                            <div className="flex min-w-0 items-center gap-[8px] pr-[8px]">
                                <Avatar initials={project.lead.initials} size={24} />
                                <span className="truncate text-[13px] text-[#374151]">
                                    {project.lead.name}
                                </span>
                            </div>

                            <div className="flex items-center">
                                <div className="h-[6px] w-[106px] overflow-hidden rounded-full bg-[#E8EAEE]">
                                    <div
                                        className="h-full rounded-full"
                                        style={{
                                            width: `${project.progress}%`,
                                            backgroundColor: project.barColor,
                                        }}
                                    />
                                </div>

                                <span className="w-[44px] text-right font-mono text-[12px] text-[#4B5563]">
                                    {project.progress}%
                                </span>
                            </div>

                            <div>
                                <p className="text-[13px] font-semibold leading-[17px] text-[#111827]">
                                    {project.deadline}
                                </p>
                                <p
                                    className="text-[11.5px] font-normal leading-[16px]"
                                    style={{
                                        color: project.overdue ? "#B42318" : "#6B7280",
                                    }}
                                >
                                    {project.deadlineNote}
                                </p>
                            </div>

                            <div>
                                <span
                                    className="inline-flex h-[22px] items-center gap-[6px] rounded-full px-[9px] text-[12px] font-medium"
                                    style={{
                                        backgroundColor: status.bg,
                                        color: status.fg,
                                    }}
                                >
                                    <span
                                        className="h-[6px] w-[6px] rounded-full"
                                        style={{ backgroundColor: status.fg }}
                                    />
                                    {project.status}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    </section>
);

export default ProjectHealthCard;