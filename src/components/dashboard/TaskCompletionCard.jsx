import {CardHeading,cardClass} from "./DashboardShared";

// the chart has 4 steps, pick a nice step size so the tallest bar always fits
const NICE_STEPS = [1, 2, 5, 10, 20, 50, 100, 200, 500];

const getScale=(data) => {
    let highest = 0;
    data.forEach((item) => {
        highest = Math.max(highest, item.completed, item.created);
    });

    const step = NICE_STEPS.find((value) => value * 4 >= highest) || 1000;
    return {
        max: step * 4,
        ticks: [4, 3, 2, 1, 0].map((n) => n * step),
    };
};

const TaskCompletionCard = ({ data, rangeLabel = "8 weeks" }) => {
    const { max: CHART_MAX, ticks: CHART_TICKS } = getScale(data);
    const columns = { gridTemplateColumns: `repeat(${data.length}, minmax(0, 1fr))` };

    const completedTotal = data.reduce(
        (sum, item) => sum + item.completed,
        0
    );

    const createdTotal = data.reduce(
        (sum, item) => sum + item.created,
        0
    );

    return (
        <section className={`${cardClass} min-w-0 px-[18px] pb-[18px] pt-[17px]`}>
            <div className="flex items-start justify-between gap-4">
                <CardHeading
                    title="Task completion"
                    subtitle={`last ${rangeLabel}`}
                />

                <div className="flex shrink-0 gap-[20px]">
                    <div>
                        <div className="flex items-center gap-[6px]">
                            <span className="h-[10px] w-[10px] rounded-[3px] bg-[var(--color-primary)]" />
                            <span className="text-[12px] leading-[16px] text-[#4B5563]">
                                Completed
                            </span>
                        </div>

                        <p className="text-[22px] font-semibold leading-[28px] tracking-[-0.4px] text-[#111827]">
                            {completedTotal}
                        </p>
                    </div>

                    <div>
                        <div className="flex items-center gap-[6px]">
                            <span className="h-[10px] w-[10px] rounded-[3px] bg-[#C9CBF3]" />
                            <span className="text-[12px] leading-[16px] text-[#4B5563]">
                                Created
                            </span>
                        </div>

                        <p className="text-[22px] font-semibold leading-[28px] tracking-[-0.4px] text-[#111827]">
                            {createdTotal}
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-[17px] flex">
                <div className="relative h-[200px] w-[30px] shrink-0">
                    {CHART_TICKS.map((tick) => (
                        <span
                            key={tick}
                            className="absolute right-[8px] -translate-y-1/2 font-mono text-[11px] leading-none text-[#9AA3B2]"
                            style={{
                                top: `${(1 - tick / CHART_MAX) * 100}%`,
                            }}
                        >
                            {tick}
                        </span>
                    ))}
                </div>

                <div className="min-w-0 flex-1">
                    <div className="relative h-[200px]">
                        {CHART_TICKS.map((tick) => (
                            <div
                                key={tick}
                                className="absolute inset-x-0 h-px bg-[#EEF0F3]"
                                style={{
                                    top: `${(1 - tick / CHART_MAX) * 100}%`,
                                }}
                            />
                        ))}

                        <div className="absolute inset-0 grid" style={columns}>
                            {data.map((item) => (
                                <div
                                    key={item.label}
                                    className="flex items-end justify-center gap-[3px]"
                                >
                                    <div
                                        className="w-[14px] rounded-t-[3px] bg-[var(--color-primary)]"
                                        style={{
                                            height: `${(item.completed / CHART_MAX) * 100}%`,
                                        }}
                                        title={`${item.label}: ${item.completed} completed`}
                                    />

                                    <div
                                        className="w-[14px] rounded-t-[3px] bg-[#C9CBF3]"
                                        style={{
                                            height: `${(item.created / CHART_MAX) * 100}%`,
                                        }}
                                        title={`${item.label}: ${item.created} created`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-[7px] grid" style={columns}>
                        {data.map((item) => (
                            <span
                                key={item.label}
                                className="text-center text-[11px] leading-[16px] text-[#6B7280]"
                            >
                                {item.label}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TaskCompletionCard;