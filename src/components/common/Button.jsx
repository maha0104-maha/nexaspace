const Button=({children,variant="primary",size="md",type="button",disabled=false,loading=false,className="",onClick,...props})=>{
    const baseStyles="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

    const variants={
        primary:"bg-[var(--color-primary)] text-white hover:opacity-90 focus-visible:outline-[var(--color-primary)]",
        secondary:"bg-[var(--color-background)] text-[var(--color-text-primary)] hover:opacity-80 focus-visible:outline-[var(--color-primary)]",
        outline:"border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] hover:bg-[var(--color-background)] focus-visible:outline-[var(--color-primary)]",
        danger:"bg-[var(--color-danger)] text-white hover:opacity-90 focus-visible:outline-[var(--color-danger)]",
        ghost:"bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-background)] hover:text-[var(--color-text-primary)] focus-visible:outline-[var(--color-primary)]",
    };

    const sizes={
        sm:"h-8 px-3 text-xs",
        md:"h-9 px-3 text-[13px]",
        lg:"h-10 px-4 text-sm",
    };

    return(
        <button type={type} disabled={disabled||loading} onClick={onClick} className={`${baseStyles} ${variants[variant]||variants.primary} ${sizes[size]||sizes.md} ${className}`} {...props}>
            {loading?(
                <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" aria-hidden="true"/>
                    <span>Loading...</span>
                </>
            ):(
                children
            )}
        </button>
    )
}

export default Button;