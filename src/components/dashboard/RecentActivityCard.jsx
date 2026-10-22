import {Avatar,cardClass} from "./DashboardShared";
const RecentActivityCard=({items})=>(
    <section className={`${cardClass} px-[17px] pb-[18px] pt-[17px]`}>
        <h2 className="text-[15px] font-semibold leading-[20px] tracking-[-0.2px] text-[#111827]">
            Recent activity
        </h2>
        {items.length===0&&(
            <p className="mt-[18px] text-[13px] text-[#6B7280]">
                No activity yet.
            </p>
        )}

        <ul className="mt-[18px] space-y-[16px]">
            {items.map((item)=>(
                <li
                    key={item.id}
                    className="flex items-start gap-[10px]">
                    <Avatar initials={item.initials} size={28} />
                    <div className="min-w-0 flex-1">
                        <p className="text-[13px] leading-[19px] text-[#6B7280]">
                            <span className="font-semibold text-[#111827]">
                                {item.name}
                            </span>{" "}
                            {item.verb}{" "}
                            <span className="font-semibold text-[#111827]">
                                {item.target}
                            </span>
                            {item.suffix && <> {item.suffix}</>}
                        </p>
                        <p className="text-[11px] leading-[16px] text-[#9AA3B2]">
                            {item.time}
                        </p>
                    </div>
                </li>
            ))}
        </ul>
    </section>
);

export default RecentActivityCard;