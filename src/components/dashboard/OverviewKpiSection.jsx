import {KpiCard} from "./DashboardShared";

const OverviewKpiSection=({items=[]})=>(
    <div className="mt-[22px] grid grid-cols-1 gap-[13px] sm:grid-cols-2 xl:grid-cols-4">
        {items.map((item)=>(
            <KpiCard key={item.id} item={item} />
        ))}
    </div>
);

export default OverviewKpiSection;
