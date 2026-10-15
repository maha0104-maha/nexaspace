const LoadingSpinner=({size="md",label="Loading...",className=""})=>{
    const sizes={
        sm:"h-4 w-4 border-2",
        md:"h-6 w-6 border-2",
        lg:"h-8 w-8 border-[3px]",
    };

    return(
        <div className={`flex items-center justify-center gap-2 ${className}`} role="status">
            <span className={`animate-spin rounded-full border-[var(--color-border)] border-t-[var(--color-primary)] ${sizes[size]||sizes.md}`}/>
            {label&&(
                <span className="text-[13px] text-[var(--color-text-secondary)]">{label}</span>
            )}
        </div>
    )
}

export default LoadingSpinner;