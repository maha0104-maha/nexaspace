const ProgressBar=({value=0,max=100,size="md",showLabel=false,className="",color="primary"})=>{
    const percentage=Math.min(100,Math.max(0,(value/max)*100||0));

    const sizes={
        sm:"h-1",
        md:"h-1.5",
        lg:"h-2.5"};

    const colors={
        primary:"bg-[var(--color-primary)]",
        success:"bg-[var(--color-success)]",
        warning:"bg-[var(--color-warning)]",
        danger:"bg-[var(--color-danger)]" };

    return(
        <div className={`w-full ${className}`}>
            <div
                className={`w-full overflow-hidden rounded-full bg-[var(--color-border)] ${sizes[size]||sizes.md}`}
                role="progressbar"
                aria-valuenow={Math.round(percentage)}
                aria-valuemin={0}
                aria-valuemax={100}>
                <div className={`h-full rounded-full transition-all duration-300 ${colors[color]||colors.primary}`}
                    style={{width:`${percentage}%`}}/>
            </div>
            {showLabel&&(
                <p className="mt-1 text-xs text-[var(--color-text-secondary)]">{Math.round(percentage)}%</p>
            )}
        </div>
    )
}

export default ProgressBar;