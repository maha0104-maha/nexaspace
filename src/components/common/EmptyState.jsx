const EmptyState=({title="No data found",description="There is nothing to display yet.",action,icon,className=""})=>{
    return(
        <div className={`flex flex-col items-center justify-center rounded-lg px-6 py-12 text-center ${className}`}>
            {icon&&(
                <div className="mb-3 text-[var(--color-text-muted)]">
                    {icon}
                </div>
            )}
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{title}</h3>
            <p className="mt-1.5 max-w-sm text-[13px] text-[var(--color-text-secondary)]">{description}</p>
            {action&&(
                <div className="mt-4">{action}</div>
            )}
        </div>
    )
}

export default EmptyState;