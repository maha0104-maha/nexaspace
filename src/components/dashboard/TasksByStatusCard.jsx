import { CardHeading, cardClass } from "./DashboardShared";

const DonutChart = ({ data, size = 168, thickness = 28 }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    const radius = (size - thickness) / 2;
    const circumference = 2 * Math.PI * radius;
    const gap = 2;

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                role="img"
                aria-label={`${total} tasks by status`}
            >
                <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
                    {data.map((item, index) => {
                        // how much of the ring is already used by the segments before this one
                        const before = data
                            .slice(0, index)
                            .reduce((sum, other) => sum + other.value, 0);
                        const offset = total ? (before / total) * circumference : 0;

                        // with no tasks at all there is nothing to draw
                        const length = total ? (item.value / total) * circumference : 0;

                        const circle = (
                            <circle
                                key={item.label}
                                cx={size / 2}
                                cy={size / 2}
                                r={radius}
                                fill="none"
                                stroke={item.color}
                                strokeWidth={thickness}
                                strokeDasharray={`${Math.max(length - gap, 0)} ${circumference - length + gap}`}
                                strokeDashoffset={-offset}
                            />
                        );

                        return circle;
                    })}
                </g>
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[32px] font-semibold leading-[36px] tracking-[-0.8px] text-[#111827]">
                    {total}
                </span>
                <span className="text-[12px] leading-[16px] text-[#6B7280]">
                    total tasks
                </span>
            </div>
        </div>
    );
};

const TasksByStatusCard = ({ data }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);

    return (
        <section className={`${cardClass} px-[17px] pb-[16px] pt-[17px]`}>
            <CardHeading
                title="Tasks by status"
                subtitle={`${total} tasks in scope`}
            />

            <div className="mt-[18px] flex justify-center">
                <DonutChart data={data} />
            </div>

            <ul className="mt-[20px]">
                {data.map((item) => (
                    <li
                        key={item.label}
                        className="flex h-[31px] items-center px-[4px]"
                    >
                        <span
                            className="h-[12px] w-[12px] shrink-0 rounded-[3px]"
                            style={{ backgroundColor: item.color }}
                        />

                        <span className="ml-[8px] flex-1 truncate text-[13px] text-[#4B5563]">
                            {item.label}
                        </span>

                        <span className="mr-[10px] font-mono text-[12px] text-[#9AA3B2]">
                            {total ? Math.round((item.value / total) * 100) : 0}%
                        </span>

                        <span className="w-[24px] text-right text-[13px] font-semibold text-[#111827]">
                            {item.value}
                        </span>
                    </li>
                ))}
            </ul>
        </section>
    );
};

export default TasksByStatusCard;