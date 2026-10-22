import {
    ArrowRight,
    ArrowUpRight,
    ArrowDownRight,
    FolderOpen,
    CircleUser,
    CircleCheck,
    CircleAlert,
    Flag,
    Gauge,
} from "lucide-react";

import { AVATAR_STYLES } from "./dashboardData";

export const cardClass =
    "rounded-[12px] border border-[var(--color-border)] bg-[var(--color-surface)]";

export const Avatar = ({ initials, size = 24 }) => {
    const style = AVATAR_STYLES[initials] || {
        bg: "#E5E7EB",
        fg: "#374151",
    };

    return (
        <span
            className="flex shrink-0 items-center justify-center rounded-full font-semibold"
            style={{
                width: size,
                height: size,
                backgroundColor: style.bg,
                color: style.fg,
                fontSize: size >= 28 ? 10.5 : 9.5,
            }}
        >
            {initials}
        </span>
    );
};

export const CardHeading = ({ title, subtitle }) => (
    <div className="min-w-0">
        <h2 className="truncate text-[15px] font-semibold leading-[20px] tracking-[-0.2px] text-[#111827]">
            {title}
        </h2>

        {subtitle && (
            <p className="mt-[2px] truncate text-[12px] font-normal leading-[16px] text-[#6B7280]">
                {subtitle}
            </p>
        )}
    </div>
);

export const OutlineLink = ({ to, children }) => (
    <LinkWrapper to={to}>
        {children}
        <ArrowRight size={14} strokeWidth={1.8} />
    </LinkWrapper>
);

import { Link } from "react-router-dom";

const LinkWrapper = ({ to, children }) => (
    <Link
        to={to}
        className="inline-flex h-[32px] shrink-0 items-center gap-[6px] rounded-[8px] border border-[var(--color-border)] bg-[var(--color-surface)] px-[12px] text-[12.5px] font-medium text-[#111827] transition-colors hover:bg-[#F9FAFB]"
    >
        {children}
    </Link>
);

export const SegmentedBar = ({ segments }) => (
    <div className="flex h-[6px] w-full gap-[2px] overflow-hidden rounded-full">
        {segments.map((segment, index) => (
            <span
                key={index}
                className="h-full"
                style={{
                    flex: segment.value,
                    backgroundColor: segment.color,
                }}
            />
        ))}
    </div>
);

export const Sparkline = ({ values }) => {
    const max = Math.max(...values, 1);

    return (
        <div className="flex h-[22px] w-full items-end gap-[4px]">
            {values.map((value, index) => (
                <span
                    key={index}
                    className="flex-1 rounded-t-[2px]"
                    style={{
                        height: value === 0 ? 2 : Math.max((value / max) * 22, 4),
                        backgroundColor: value === 0 ? "#E5E7EB" : "#4B4FDB",
                    }}
                />
            ))}
        </div>
    );
};

const KPI_ICONS = {
    projects: FolderOpen,
    users: CircleUser,
    completed: CircleCheck,
    overdue: CircleAlert,
    flag: Flag,
    gauge: Gauge,
};

export const KpiCard = ({ item }) => {
    const Icon = KPI_ICONS[item.iconName];
    // a badge like "-20%" means things went down
    const goingDown = item.badge ? item.badge.startsWith("-") : false;

    return (
        <div className={`${cardClass} flex flex-col p-[16px] transition-shadow hover:shadow-md`}>
            <div className="flex items-center gap-[10px]">
                <span className="flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-[8px] border border-[var(--color-border)] bg-[var(--color-surface)] text-[#4B5563]">
                    <Icon size={14} strokeWidth={1.6} />
                </span>

                <p className="truncate text-[13px] font-medium leading-[18px] text-[#4B5563]">
                    {item.title}
                </p>
            </div>

            <div className="mt-[11px] flex items-center gap-[10px]">
                <span
                    className="text-[32px] font-semibold leading-[40px] tracking-[-0.8px]"
                    style={{ color: item.valueColor || "#111827" }}
                >
                    {item.value}
                </span>

                {item.badge && (
                    <span
                        className={`inline-flex h-[20px] items-center gap-[3px] rounded-[6px] px-[6px] text-[11px] font-semibold ${
                            goingDown
                                ? "bg-[#FDE4E1] text-[#B42318]"
                                : "bg-[#E3F6EC] text-[#0B7A4B]"
                        }`}
                    >
                        {goingDown ? (
                            <ArrowDownRight size={11} strokeWidth={2} />
                        ) : (
                            <ArrowUpRight size={11} strokeWidth={2} />
                        )}
                        {item.badge}
                    </span>
                )}
            </div>

            <div className="mt-auto pt-[11px]">
                {item.sparkline ? (
                    <Sparkline values={item.sparkline} />
                ) : (
                    <SegmentedBar segments={item.segments} />
                )}
            </div>

            <p className="mt-[9px] text-[12px] font-normal leading-[16px] text-[#6B7280]">
                {item.caption}
            </p>
        </div>
    );
};